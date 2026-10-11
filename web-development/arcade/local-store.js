(function (root) {
  'use strict';
  const keys = { scores: 'rg.arcade.scores.v1', wall: 'rg.arcade.wall.v1' };
  const games = ['hat-rack-rhythm'];
  const colors = ['ink', 'red', 'blue', 'green'];
  function read(kind) {
    try { const value = JSON.parse(root.localStorage.getItem(keys[kind]) || '[]'); return Array.isArray(value) ? value : []; }
    catch (_) { return []; }
  }
  function write(kind, value) {
    try { root.localStorage.setItem(keys[kind], JSON.stringify(value)); return true; }
    catch (_) { return false; }
  }
  function scores(game) {
    return read('scores').filter(x => x && x.game === game && /^[A-Z0-9]{3}$/.test(x.initials) && Number.isSafeInteger(x.score) && x.score >= 0 && typeof x.id === 'string')
      .sort((a, b) => b.score - a.score).slice(0, 10);
  }
  function qualifies(game, score) {
    const rows = scores(game);
    return games.includes(game) && Number.isSafeInteger(score) && score >= 0 && (rows.length < 10 || score > rows[9].score);
  }
  function saveScore(game, initials, score) {
    if (!/^[A-Z0-9]{3}$/.test(initials) || !qualifies(game, score)) return { ok: false };
    const id = root.crypto.randomUUID();
    const rows = [...scores(game), { id, game, initials, score }].sort((a,b) => b.score-a.score).slice(0,10);
    const others = read('scores').filter(x => x && games.includes(x.game) && x.game !== game);
    return { ok: write('scores', [...others, ...rows]), rank: rows.findIndex(x => x.id === id)+1 };
  }
  function notes() {
    return read('wall').filter(x => x && typeof x.text === 'string' && x.text.trim().length > 0 && x.text.length <= 160 && colors.includes(x.color)).slice(-50);
  }
  function saveNote(text, color) {
    text = text.trim();
    if (!text || text.length > 160 || !colors.includes(color)) return false;
    return write('wall', [...notes(), { text, color }].slice(-50));
  }
  root.RGArcadeStore = { scores, qualifies, saveScore, notes, saveNote, clearNotes: () => write('wall', []), clearScores: () => write('scores', []) };
})(typeof window === 'undefined' ? globalThis : window);
