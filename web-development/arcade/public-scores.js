(() => {
  const store = window.RGArcadeStore = {};
  async function api(options,game) {
    const response = await fetch('/api/arcade/scores'+(game?'?game='+encodeURIComponent(game):''), options);
    let value; try { value = await response.json(); } catch { throw Error('Public scores are not connected yet.'); }
    if (!response.ok) throw Error(value.error || 'Public scores are unavailable.');
    return value;
  }
  store.scores = async game => (await api(undefined,game)).scores;
  store.qualifies = async (game,score) => {
    if (!Number.isSafeInteger(score) || score < 0) return false;
    try { const rows = await store.scores(game); return rows.length < 10 || score > rows[9].score; }
    catch { return true; } // Allow entry and explicit retry when the API is unavailable.
  };
  store.saveScore = (game,initials,score,id) => api({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({game,initials,score,id})});
  async function wall(options) {
    const response = await fetch('/api/arcade/wall',options);
    let value; try {value = await response.json();} catch {throw Error('The Wall is not connected yet.');}
    if (!response.ok) throw Error(value.error || 'The Wall is unavailable.');
    return value;
  }
  store.notes = async () => (await wall()).notes;
  store.saveNote = (text,color,id) => wall({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:text.trim(),color,id})});
})();
