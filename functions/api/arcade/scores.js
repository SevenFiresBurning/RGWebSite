const games = new Set(['hat-rack-rhythm', 'ur-in-trouble']);
const json = (value, status=200) => new Response(JSON.stringify(value), {status, headers:{'Content-Type':'application/json', 'Cache-Control':'no-store'}});
export async function onRequest({request,env}) {
  if (!env.ARCADE_DB) return json({error:'Public scores are not connected yet.'},503);
  const url = new URL(request.url);
  try {
    if (request.method === 'GET') {
      const game = url.searchParams.get('game');
      if (!games.has(game)) return json({error:'Unknown game.'},400);
      const {results} = await env.ARCADE_DB.prepare('SELECT initials, score FROM arcade_scores WHERE game = ? ORDER BY score DESC, created_at ASC, id ASC LIMIT 10').bind(game).all();
      return json({scores:results});
    }
    if (request.method !== 'POST') return json({error:'Method not allowed.'},405);
    if (request.headers.get('Origin') !== url.origin) return json({error:'Invalid origin.'},403);
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({error:'JSON required.'},415);
    const raw = await request.text();
    if (raw.length > 1024) return json({error:'Submission too large.'},413);
    let value; try { value = JSON.parse(raw); } catch { return json({error:'Invalid JSON.'},400); }
    const {game,initials,score,id} = value || {};
    if (!games.has(game) || typeof initials !== 'string' || !/^[A-Z0-9]{3}$/.test(initials) || !Number.isSafeInteger(score) || score < 0 || score > 10000000 || typeof id !== 'string' || !/^[a-f0-9-]{36}$/i.test(id)) return json({error:'Invalid score or initials.'},400);
    const existing = await env.ARCADE_DB.prepare('SELECT id,game,initials,score FROM arcade_scores WHERE id = ?').bind(id).first();
    if (existing && (existing.game !== game || existing.initials !== initials || existing.score !== score)) return json({error:'Submission already exists.'},409);
    if (!existing) {
      const source = request.headers.get('CF-Connecting-IP') || 'unknown';
      const digest = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(source));
      const sourceHash = Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
      const now = Date.now();
      const inserted = await env.ARCADE_DB.prepare('INSERT INTO arcade_scores (id,game,initials,score,created_at,source_hash) SELECT ?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM arcade_scores WHERE source_hash = ? AND created_at > ?) < 3').bind(id,game,initials,score,now,sourceHash,sourceHash,now-60000).run();
      if (!inserted.meta.changes) return json({error:'Please wait a minute before submitting another score.'},429);
    }
    const row = await env.ARCADE_DB.prepare('SELECT COUNT(*) + 1 AS rank FROM arcade_scores WHERE game = ? AND (score > ? OR (score = ? AND (created_at < (SELECT created_at FROM arcade_scores WHERE id = ?) OR (created_at = (SELECT created_at FROM arcade_scores WHERE id = ?) AND id < ?))))').bind(game,score,score,id,id,id).first();
    return json({ok:true,rank:row.rank});
  } catch (_) { return json({error:'Public scores are temporarily unavailable. Please try again.'},503); }
}
