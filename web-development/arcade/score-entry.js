(() => {
  'use strict';
  let pending = null;
  const dialog = document.createElement('dialog'); dialog.className = 'score-entry';
  dialog.innerHTML = '<form><h2>HIGH SCORE</h2><p id="entry-score"></p><p>Local scores · saved only in this browser.</p><label for="arcade-initials">Enter three initials (A–Z or 0–9)</label><input id="arcade-initials" name="initials" minlength="3" maxlength="3" pattern="[A-Za-z0-9]{3}" autocomplete="off" required /><button type="submit">Save score</button><button type="button" id="skip-score">Skip</button><p id="entry-status" role="status" aria-live="polite"></p></form>';
  document.body.append(dialog);
  dialog.setAttribute('aria-labelledby', 'entry-title');
  dialog.querySelector('h2').id = 'entry-title';
  document.addEventListener('keydown', event => {
    if (dialog.open && event.key === 'Escape') event.stopImmediatePropagation();
  }, true);
  const form = dialog.querySelector('form'), input = form.elements.initials, status = dialog.querySelector('#entry-status');
  document.addEventListener('rg:game-ended', event => {
    const score = event.detail.score;
    if (!window.RGArcadeStore.qualifies('hat-rack-rhythm', score)) return;
    pending = score; input.value = ''; input.hidden = false; form.querySelector('[type=submit]').hidden = false;
    status.textContent = ''; dialog.querySelector('#skip-score').textContent = 'Skip';
    dialog.querySelector('#entry-score').textContent = score.toLocaleString()+' points. You qualify for the top 10!';
    dialog.showModal(); input.focus();
  });
  dialog.querySelector('#skip-score').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { pending = null; document.querySelector('#startButton').focus(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (pending === null) return;
    const result = window.RGArcadeStore.saveScore('hat-rack-rhythm',input.value.toUpperCase(),pending);
    status.textContent = result.ok ? 'Saved! Your local rank is #'+result.rank+'. See High Scores in Arcade.' : 'Score was not saved. Browser storage may be unavailable or the top 10 changed.';
    if (result.ok) { pending = null; input.hidden = true; form.querySelector('[type=submit]').hidden = true; dialog.querySelector('#skip-score').textContent = 'Back to game'; dialog.querySelector('#skip-score').focus(); }
  });
})();
