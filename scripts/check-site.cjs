const fs=require('fs'),path=require('path'),assert=require('assert'),cp=require('child_process');const root=path.resolve(__dirname,'..'),config=require('../site.config.json');
cp.execFileSync(process.execPath,[__dirname+'/sync-site.cjs','--check'],{stdio:'inherit'});
const read=f=>fs.readFileSync(root+'/'+f,'utf8');
function existsExact(f){let base=root;for(const segment of f.split('/')){assert(fs.readdirSync(base).includes(segment),'Missing/case-mismatched path '+f);base=path.join(base,segment)}return base}
const files=[...config.pages.map(p=>p.file),...Object.keys(config.redirects)];
for(const file of files){const s=read(file);const ids=[...s.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,'Duplicate id '+file);assert.equal((s.match(/<h1\b/g)||[]).length,1,'H1 '+file);
for(const [,value]of s.matchAll(/(?:href|src|poster)="([^"]+)"/g)){if(/^(https?:|mailto:|data:)/.test(value))continue;const u=new URL(value,'https://local/'+file);let target=decodeURIComponent(u.pathname.slice(1));if(target.endsWith('/'))target+='index.html';existsExact(target);if(u.hash&&target.endsWith('.html')&&!config.redirects[target])assert(read(target).includes(`id="${u.hash.slice(1)}"`),'Missing fragment '+file+' '+value);}
if(!config.redirects[file]){const p=config.pages.find(p=>p.file===file);assert(s.includes(`href="${config.siteUrl+'/'+file.replace(/index\.html$/,'')}"`),'Canonical '+file);assert(!/Web &amp; Systems|Web & Systems|Selected Projects|Industry Links|Templates|>Production(?:\.|<)/.test(s),'Stale discipline label '+file);assert(s.includes('formspree.io/f/mljdnpzl'),'Missing mailing form '+file);assert(s.includes('rgv4.css'),'Missing shared styles '+file);for(const [,json]of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(json)}
}
for(const file of ['app.js','mailing-list.js','legacy-redirect.js','webdev/systems.js','scripts/article-layout.cjs','scripts/sync-site.cjs'])cp.execFileSync(process.execPath,['--check',root+'/'+file]);
for(const page of config.pages.filter(p=>p.article)){
 const html=read(page.file);
 assert(html.includes(read(page.article.content)),'Article body drift '+page.file);
 const entities=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));
 assert(entities.some(e=>e['@type']==='Article'&&e.headline===page.title),'Article schema '+page.file);
 assert(html.includes('property="og:type" content="article"'),'Article social type '+page.file);
 assert(read('resources/articles/index.html').includes(page.file.replace('resources/','../')),'Article missing from listing '+page.file);
 // Original authoring documents may be retained locally rather than published with the site.
 if(page.article.source&&fs.existsSync(root+'/'+page.article.source))existsExact(page.article.source);
}
for(const [from,to]of Object.entries(config.redirects)){
 assert(!config.redirects[to],'Redirect chain '+from);assert(config.pages.some(p=>p.file===to),'Missing redirect target');
 const fallback=read(from),canonical=config.siteUrl+'/'+to.replace(/index\.html$/,'');
 assert(fallback.includes(`rel="canonical" href="${canonical}"`),'Legacy canonical drift '+from);
 assert(fallback.includes('noindex,follow'),'Legacy page must not compete in search '+from);
 const target=fallback.match(/id="legacy-destination" href="([^"]+)"/);
 assert(target&&new URL(target[1],'https://local/'+from).pathname==='/'+to,'Legacy fallback target drift '+from);
}
for(const page of config.pages){
 for(const [,href]of read(page.file).matchAll(/href="([^"]+)"/g)){
  if(/^(https?:|mailto:|data:)/.test(href))continue;
  let target=new URL(href,'https://local/'+page.file).pathname.slice(1);if(target.endsWith('/'))target+='index.html';
  assert(!config.redirects[target],'Public link points to obsolete route '+page.file+' '+href);
 }
 assert(!read(page.file).includes(' Overview</a>'),'Redundant overview link '+page.file);
}
for(const rule of read('_redirects').trim().split(/\r?\n/))assert(/^\S+ \S+ 301$/.test(rule),'Invalid Cloudflare redirect '+rule);
assert(read('contact/index.html').includes('action="https://formspree.io/f/mjykralg"'),'Contact endpoint drift');
console.log(`PASS: ${config.pages.length} canonical pages, ${Object.keys(config.redirects).length} legacy pages, case-sensitive paths, fragments, metadata, labels, forms, and JS syntax.`);
