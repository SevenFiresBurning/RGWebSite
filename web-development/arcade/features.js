(() => {
  'use strict';
  const store = window.RGArcadeStore;
  const selector = document.querySelector('#score-game');
  selector.addEventListener('change', renderScores);
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
  async function renderWall() {
    const current = ++wallRequest;
    const wall = document.querySelector('#wall-notes');
    wall.replaceChildren();
    const message = document.querySelector('#wall-empty');
    message.hidden = false; message.textContent = 'Loading The Wall…';
    let notes;
    try {notes = await store.notes();}
    catch(error) {if (current === wallRequest) message.textContent = error.message; return;}
    if (current !== wallRequest) return;
    notes.forEach((note, i) => {
      const mark = document.createElement('p'); mark.className = 'wall-note marker-'+note.color;
      mark.style.setProperty('--tilt', ((i%5)-2)+'deg'); mark.textContent = note.text; wall.append(mark);
    });
    document.querySelector('#wall-empty').hidden = notes.length > 0;
    message.textContent = 'A fresh patch of wall. Leave the first mark.';
  }
  const form = document.querySelector('#wall-form');
  const editor = document.createElement('dialog'); editor.className = 'wall-editor';
  editor.setAttribute('aria-labelledby', 'wall-editor-heading');
  const heading = document.createElement('h2'); heading.id = 'wall-editor-heading'; heading.textContent = 'Leave your mark';
  const close = document.createElement('button'); close.type = 'button'; close.textContent = 'Close editor';
  editor.append(heading, form, close); document.body.append(editor);
  const open = document.createElement('button'); open.type = 'button'; open.className = 'wall-open'; open.textContent = 'Write a note';
  document.querySelector('.venue-wall').append(open);
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
  renderScores(); renderWall();
})();
