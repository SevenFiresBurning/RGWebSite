const fs=require('fs'),path=require('path'),assert=require('assert'),cp=require('child_process');const root=path.resolve(__dirname,'..'),config=require('../site.config.json');
cp.execFileSync(process.execPath,[__dirname+'/sync-site.cjs','--check'],{stdio:'inherit'});
const read=f=>fs.readFileSync(root+'/'+f,'utf8');
function existsExact(f){let base=root;for(const segment of f.split('/')){assert(fs.readdirSync(base).includes(segment),'Missing/case-mismatched path '+f);base=path.join(base,segment)}return base}
const files=[...config.pages.map(p=>p.file),...Object.keys(config.redirects)];
for(const file of files){const s=read(file);const ids=[...s.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,'Duplicate id '+file);assert.equal((s.match(/<h1\b/g)||[]).length,1,'H1 '+file);
for(const [,value]of s.matchAll(/(?:href|src|poster)="([^"]+)"/g)){if(/^(https?:|mailto:|data:)/.test(value))continue;const u=new URL(value,'https://local/'+file);let target=decodeURIComponent(u.pathname.slice(1));if(target.endsWith('/'))target+='index.html';existsExact(target);if(u.hash&&target.endsWith('.html')&&!config.redirects[target])assert(read(target).includes(`id="${u.hash.slice(1)}"`),'Missing fragment '+file+' '+value);}
if(!config.redirects[file]){const p=config.pages.find(p=>p.file===file);assert(s.includes(`href="${config.siteUrl+'/'+file.replace(/index\.html$/,'')}"`),'Canonical '+file);assert(!/Web &amp; Systems|Web & Systems|Selected Projects|Industry Links|Templates|>Production(?:\.|<)/.test(s),'Stale discipline label '+file);assert(s.includes('formspree.io/f/mljdnpzl'),'Missing mailing form '+file);assert(s.includes('rgv4.css'),'Missing shared styles '+file);for(const [,json]of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(json)}
}
for(const file of ['app.js','mailing-list.js','legacy-redirect.js','webdev/systems.js'])cp.execFileSync(process.execPath,['--check',root+'/'+file]);
for(const [from,to]of Object.entries(config.redirects)){assert(!config.redirects[to],'Redirect chain '+from);assert(config.pages.some(p=>p.file===to),'Missing redirect target')}
console.log(`PASS: ${config.pages.length} canonical pages, ${Object.keys(config.redirects).length} legacy pages, case-sensitive paths, fragments, metadata, labels, forms, and JS syntax.`);
