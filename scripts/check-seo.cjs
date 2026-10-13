const fs=require('node:fs'),assert=require('node:assert/strict'),config=require('../site.config.json');
const canonical=file=>config.siteUrl+'/'+file.replace(/index\.html$/,'');
const sitemap=fs.readFileSync('sitemap.xml','utf8'),locations=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.deepEqual(locations,config.pages.filter(p=>!p.noindex&&!config.redirects[p.file]).map(p=>canonical(p.file)));
assert.equal(new Set(locations).size,locations.length);
for(const page of config.pages){const html=fs.readFileSync(page.file,'utf8');assert.equal((html.match(/rel="canonical"/g)||[]).length,1);assert.ok(html.includes('rel="canonical" href="'+canonical(page.file)+'"'));assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html));for(const [,href] of html.matchAll(/href="([^"]+)"/g)){if(href.startsWith('#'))continue;const url=new URL(href.replaceAll('&amp;','&'),config.siteUrl+'/'+page.file);if(url.origin!==config.siteUrl)continue;const file=url.pathname.slice(1);assert.ok(!config.pages.some(p=>p.file===file),'Noncanonical internal destination '+page.file+' '+href);}}
const headers=fs.readFileSync('_headers','utf8');assert.ok(headers.includes('/web-development/arcade/games/*\n  X-Robots-Tag: noindex, follow')||headers.includes('/web-development/arcade/games/*\r\n  X-Robots-Tag: noindex, follow'));
assert.ok(fs.readFileSync('web-development/arcade/games/hatgame/index.html','utf8').includes('noindex'));
assert.ok(fs.readFileSync('legacy-redirect.js','utf8').includes('url.search=location.search'));
console.log('PASS: '+locations.length+' unique indexable canonical sitemap entries, one HTTPS canonical per public page, clean internal page links, preserved game noindex and query forwarding.');
