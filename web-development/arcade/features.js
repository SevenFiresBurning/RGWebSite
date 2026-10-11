(() => {
  'use strict';
  const store = window.RGArcadeStore;
  const scoreClear = document.createElement('button'); scoreClear.type = 'button'; scoreClear.textContent = 'Clear my local scores';
  document.querySelector('#score-empty').after(scoreClear);
  scoreClear.addEventListener('click', () => {
    scoreClear.textContent = store.clearScores() ? 'Local scores cleared' : 'Could not clear browser storage'; renderScores();
  });
  function renderScores() {
    const body = document.querySelector('#score-rows');
    body.replaceChildren();
    const rows = store.scores('hat-rack-rhythm');
    for (let i=0; i<10; i++) {
      const row = document.createElement('tr');
      for (const value of [String(i+1).padStart(2,'0'), rows[i]?.initials || '—', rows[i]?.score.toLocaleString() || '—']) {
        const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
      }
      body.append(row);
    }
    document.querySelector('#score-empty').hidden = rows.length > 0;
  }
  function renderWall() {
    const wall = document.querySelector('#wall-notes');
    wall.replaceChildren();
    const notes = store.notes();
    notes.forEach((note, i) => {
      const mark = document.createElement('p'); mark.className = 'wall-note marker-'+note.color;
      mark.style.setProperty('--tilt', ((i%5)-2)+'deg'); mark.textContent = note.text; wall.append(mark);
    });
    document.querySelector('#wall-empty').hidden = notes.length > 0;
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
  const clear = document.createElement('button'); clear.type = 'button'; clear.textContent = 'Clear my local wall';
  clear.addEventListener('click', () => {
    const saved = store.clearNotes();
    document.querySelector('#wall-status').textContent = saved ? 'Your local wall is clear.' : 'Could not clear browser storage.';
    if (saved) renderWall();
  });
  form.append(clear);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const saved = store.saveNote(form.elements.message.value, form.elements.marker.value);
    document.querySelector('#wall-status').textContent = saved ? 'Your note is on this browser’s wall.' : 'Could not save. Use 1–160 characters and allow browser storage.';
    if (saved) { form.elements.message.value = ''; renderWall(); }
  });
  window.addEventListener('storage', () => { renderScores(); renderWall(); });
  window.addEventListener('pageshow', () => { renderScores(); renderWall(); });
  renderScores(); renderWall();
})();
