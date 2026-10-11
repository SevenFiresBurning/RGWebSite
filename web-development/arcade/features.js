(() => {
  'use strict';
  const store = window.RGArcadeStore;
  const selector = document.querySelector('#score-game');
  selector.addEventListener('change', renderScores);
  const gameButtons = [...document.querySelectorAll('[data-score-game]')];
  function selectGame(button) {
    selector.value = button.dataset.scoreGame;
    gameButtons.forEach(item => {const active=item===button;item.setAttribute('aria-checked',String(active));item.tabIndex=active?0:-1;});
    renderScores();
  }
  gameButtons.forEach((button,index) => {
    button.addEventListener('click',() => selectGame(button));
    button.addEventListener('keydown',event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault(); const target=event.key==='Home'?0:event.key==='End'?gameButtons.length-1:(index+(event.key==='ArrowRight'?1:-1)+gameButtons.length)%gameButtons.length;
      selectGame(gameButtons[target]); gameButtons[target].focus();
    });
  });
  let scoreRequest = 0;
  async function renderScores() {
    const current = ++scoreRequest, game = selector.value;
    const body = document.querySelector('#score-rows');
    body.replaceChildren();
    document.querySelector('.score-table caption').textContent = selector.selectedOptions[0].textContent+' — Top 10';
    const play = document.querySelector('#score-play');
    play.href = game === 'ur-in-trouble' ? '../../arcade/games/urine-trouble/index.html' : '../../arcade/games/hatgame/index.html';
    play.textContent = 'Play '+selector.selectedOptions[0].textContent;
    const message = document.querySelector('#score-empty');
    message.hidden = false; message.textContent = 'Loading public scores…';
    let rows;
    try { rows = await store.scores(game); }
    catch (error) { if (current === scoreRequest) message.textContent = error.message; return; }
    if (current !== scoreRequest) return;
    for (let i=0; i<10; i++) {
      const row = document.createElement('tr');
      for (const value of [String(i+1).padStart(2,'0'), rows[i]?.initials || '—', rows[i]?.score.toLocaleString() || '—']) {
        const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
      }
      body.append(row);
    }
    document.querySelector('#score-empty').hidden = rows.length > 0;
    message.textContent = 'No public scores yet. Finish a run to enter your initials.';
  }
  let wallRequest = 0;
  let activeNotes = [];
  const noteNodes=new Map();
  const venue = document.querySelector('[aria-labelledby="wall-heading"] .venue-wall');
  const wallHome = document.createElement('div'); wallHome.className='wall-home'; venue.before(wallHome); wallHome.append(venue);
  const maximize = document.createElement('button'); maximize.type='button'; maximize.className='wall-maximize'; maximize.textContent='Maximize Wall'; wallHome.after(maximize);
  const expanded = document.createElement('dialog'); expanded.className='wall-expanded'; expanded.setAttribute('aria-labelledby','wall-expanded-heading');
  expanded.innerHTML='<header><h2 id="wall-expanded-heading">The Wall</h2><button type="button">Minimize / Close</button></header>';
  document.body.append(expanded);
  let oldOverflow='';
  maximize.addEventListener('click',() => {oldOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';expanded.append(venue);expanded.showModal();layoutNotes();expanded.querySelector('button').focus();});
  expanded.querySelector('button').addEventListener('click',() => expanded.close());
  expanded.addEventListener('close',() => {wallHome.append(venue);document.documentElement.style.overflow=oldOverflow;layoutNotes();maximize.focus();});
  function layoutNotes() {
    const wall=document.querySelector('#wall-notes');
    const now=Date.now()+(store.wallClockOffset||0);
    activeNotes.forEach(note => {
      const mark=noteNodes.get(note.id);
      wall.append(mark);
    });
    for (const host of [wall]) {
      const width=host.clientWidth; if (!width) continue;
      let y=12;
      [...host.children].forEach(mark => {
        const note=activeNotes.find(item=>item.id===mark.dataset.noteId);
        const p=window.RGWallLayout.presentation(note,activeNotes.length,now,expanded.open);
        const noteWidth=Math.max(40,Math.min(expanded.open?560:440,width*p.width,width-28));
        Object.assign(mark.style,{width:noteWidth+'px',fontSize:p.font+'px',left:12+Math.max(0,(width-noteWidth-24))*p.x+'px',top:y+'px'});
        mark.style.setProperty('--tilt',p.rotation+'deg'); mark.style.setProperty('--age',String(p.age));
        mark.style.backgroundColor=`hsl(44 ${32+p.age*12}% ${86-p.age*16}%)`;
        mark.style.opacity=String(1-p.age*.12);
        y+=mark.offsetHeight+p.gap-8;
      });
      host.style.height=Math.max(24,y+18)+'px';
    }
  }
  let lastWallWidth=0;
  new ResizeObserver(entries => {const width=entries[0].contentRect.width;if(width!==lastWallWidth){lastWallWidth=width;layoutNotes();}}).observe(document.querySelector('#wall-notes'));
  new ResizeObserver(layoutNotes).observe(document.querySelector('.arcade-layout'));
  async function renderWall() {
    const current = ++wallRequest;
    const wall = document.querySelector('#wall-notes');
    const message = document.querySelector('#wall-empty');
    message.hidden = false; message.textContent = 'Loading The Wall…';
    let notes;
    try {notes = await store.notes();}
    catch(error) {if (current === wallRequest) message.textContent = error.message; return;}
    if (current !== wallRequest) return;
    const now=Date.now()+(store.wallClockOffset||0);
    activeNotes=notes.filter(note => !window.RGWallLayout.presentation(note,notes.length,now).expired).slice(-50);
    const ids=new Set(activeNotes.map(note=>note.id));
    noteNodes.forEach((mark,id) => {if(!ids.has(id)){mark.remove();noteNodes.delete(id);}});
    activeNotes.forEach(note => {
      let mark=noteNodes.get(note.id);
      if (!mark) {mark=document.createElement('p');mark.dataset.noteId=note.id;noteNodes.set(note.id,mark);}
      mark.className = 'wall-note marker-'+note.color;
      mark.textContent=note.text; mark.title=new Date(note.createdAt).toLocaleDateString();
    });
    layoutNotes();
    document.querySelector('#wall-empty').hidden = activeNotes.length > 0;
    message.textContent = 'A fresh patch of wall. Leave the first mark.';
  }
  const form = document.querySelector('#wall-form');
  const editor = document.createElement('dialog'); editor.className = 'wall-editor';
  editor.setAttribute('aria-labelledby', 'wall-editor-heading');
  const heading = document.createElement('h2'); heading.id = 'wall-editor-heading'; heading.textContent = 'Leave your mark';
  const close = document.createElement('button'); close.type = 'button'; close.textContent = 'Close editor';
  editor.append(heading, form, close); document.body.append(editor);
  const open = document.createElement('button'); open.type = 'button'; open.className = 'wall-open'; open.textContent = 'Write a note';
  venue.prepend(open);
  open.addEventListener('click', () => { editor.showModal(); form.elements.message.focus(); });
  close.addEventListener('click', () => editor.close());
  editor.addEventListener('close', () => open.focus());
  let noteId = null;
  form.addEventListener('input', () => {noteId = null;});
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const submit = form.querySelector('[type=submit]'); if (submit.disabled) return;
    submit.disabled = true; noteId ||= crypto.randomUUID();
    const status = document.querySelector('#wall-status'); status.textContent = 'Posting your note…';
    try {
      const saved = await store.saveNote(form.elements.message.value,form.elements.marker.value,noteId);
      if (saved.ok) {status.textContent = 'Your note is on The Wall for everyone to see.'; form.elements.message.value = ''; noteId = null; renderWall();}
    } catch(error) {status.textContent = error.message;}
    finally {submit.disabled = false;}
  });
  window.addEventListener('focus', () => { renderScores(); renderWall(); });
  window.addEventListener('pageshow', () => { renderScores(); renderWall(); });
  window.setInterval(renderWall,60000);
  renderScores(); renderWall();
})();
