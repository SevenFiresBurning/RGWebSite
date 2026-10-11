const json = (value,status=200) => new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
const lifetime = 14 * 24 * 60 * 60 * 1000;
const expire = (db,now) => db.prepare('DELETE FROM arcade_wall WHERE created_at <= ?').bind(now-lifetime);
const trim = db => db.prepare('DELETE FROM arcade_wall WHERE id NOT IN (SELECT id FROM arcade_wall ORDER BY created_at DESC,id DESC LIMIT 50)');
export async function onRequest({request,env}) {
  if (!env.ARCADE_DB) return json({error:'The Wall is not connected yet.'},503);
  try {
    if (request.method === 'GET') {
      const now = Date.now();
      const batch = await env.ARCADE_DB.batch([expire(env.ARCADE_DB,now),trim(env.ARCADE_DB),env.ARCADE_DB.prepare('SELECT id,message AS text,color,created_at AS createdAt FROM arcade_wall ORDER BY created_at DESC,id DESC LIMIT 50')]);
      return json({notes:batch[2].results.reverse(),serverNow:now});
    }
    if (request.method !== 'POST') return json({error:'Method not allowed.'},405);
    if (request.headers.get('Origin') !== new URL(request.url).origin) return json({error:'Invalid origin.'},403);
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({error:'JSON required.'},415);
    const raw = await request.text();
    if (raw.length > 2048) return json({error:'Message too large.'},413);
    let value; try {value = JSON.parse(raw);} catch {return json({error:'Invalid JSON.'},400);}
    const {text,color,id} = value || {};
    if (typeof text !== 'string' || !text.trim() || text.length > 160 || !['ink','red','blue','green'].includes(color) || typeof id !== 'string' || !/^[a-f0-9-]{36}$/i.test(id)) return json({error:'Use 1–160 characters and a listed marker color.'},400);
    const existing = await env.ARCADE_DB.prepare('SELECT message,color FROM arcade_wall WHERE id = ?').bind(id).first();
    if (existing) return existing.message === text.trim() && existing.color === color ? json({ok:true}) : json({error:'Submission already exists.'},409);
    const source = request.headers.get('CF-Connecting-IP') || 'unknown';
    const digest = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(source));
    const hash = Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
    const now = Date.now();
    const inserted = env.ARCADE_DB.prepare('INSERT INTO arcade_wall (id,message,color,created_at,source_hash) SELECT ?,?,?,?,? WHERE (SELECT COUNT(*) FROM arcade_wall WHERE source_hash = ? AND created_at > ?) < 3').bind(id,text.trim(),color,now,hash,hash,now-60000);
    const batch = await env.ARCADE_DB.batch([expire(env.ARCADE_DB,now),inserted,trim(env.ARCADE_DB)]);
    return batch[1].meta.changes ? json({ok:true}) : json({error:'Please wait a minute before adding another note.'},429);
  } catch {return json({error:'The Wall is temporarily unavailable. Please try again.'},503);}
}
