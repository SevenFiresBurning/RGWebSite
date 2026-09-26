// Run from any directory: node scripts/sync-site.cjs [--check]. No dependencies.
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),config=JSON.parse(fs.readFileSync(root+'/site.config.json','utf8'));
const check=process.argv.includes('--check'),byFile=new Map(config.pages.map(p=>[p.file,p]));let stale=[];
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const url=f=>config.siteUrl+'/'+f.replace(/index\.html$/,'');
const relative=(from,to)=>path.posix.relative(path.posix.dirname(from),to)||'index.html';
function ancestors(p){const result=[];while(p){result.unshift(p);p=byFile.get(p.parent)}return result}
function header(page){const chain=ancestors(page).map(p=>p.file);
 const link=(f,label,cls='')=>`<a${cls?` class="${cls}"`:''} href="${relative(page.file,f)}"${page.file===f?' aria-current="page"':chain.includes(f)?' aria-current="location"':''}>${esc(label)}</a>`;
 function children(parent){return config.pages.filter(p=>p.parent===parent).map(p=>`<li>${link(p.file,p.title)}${config.pages.some(c=>c.parent===p.file)?`<ul>${children(p.file)}</ul>`:''}</li>`).join('\n')}
 return `<header class="site-header">
  <a class="brand" href="${relative(page.file,'index.html')}" aria-label="Resistance and Ground home"><span class="brand-mark" aria-hidden="true">⏚</span><span>RESISTANCE<br />&amp; GROUND</span></a>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav">Menu <span aria-hidden="true">+</span></button>
  <nav id="main-nav" aria-label="Main navigation">
${config.navigation.map((f,i)=>{const p=byFile.get(f),kids=config.pages.some(c=>c.parent===f);if(!kids)return link(f,p.title,f==='contact/index.html'?'nav-contact':'');return `<div class="nav-dropdown"><div class="nav-topline">${link(f,p.title,'nav-overview')}<button class="nav-submenu-toggle" type="button" aria-label="Toggle ${esc(p.title)} submenu" aria-expanded="false" aria-controls="nav-section-${i}"><span aria-hidden="true">⌄</span></button></div><div class="nav-submenu" id="nav-section-${i}"><ul><li>${link(f,p.title+' Overview')}</li>${children(f)}</ul></div></div>`}).join('\n')}
  </nav>
</header>`}
function metadata(p){const image=p.image||'assets/rg-social-card.png',imageInfo=config.images[image],isArticle=p.file==='resources/what-is-music-publishing/index.html';const entity={'@context':'https://schema.org','@type':isArticle?'Article':'WebPage',name:p.title,description:p.description,url:url(p.file),isPartOf:{'@type':'WebSite',name:'Resistance & Ground',url:config.siteUrl+'/'}};if(isArticle)Object.assign(entity,{headline:p.title,mainEntityOfPage:url(p.file),image:config.siteUrl+'/'+image,author:{'@type':'Organization',name:'Resistance & Ground',url:config.siteUrl+'/'},publisher:{'@type':'Organization',name:'Resistance & Ground',url:config.siteUrl+'/'}});
 const crumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:ancestors(p).map((a,i)=>({'@type':'ListItem',position:i+1,name:a.file==='index.html'?'Home':a.title,item:url(a.file)}))};
 return `<!-- rg:metadata -->
<title>${esc(p.file==='index.html'?'Resistance & Ground — Music, Media & Web Development':p.title+' — Resistance & Ground')}</title>
<meta name="description" content="${esc(p.description)}" />
<link rel="canonical" href="${url(p.file)}" />
<meta property="og:type" content="${isArticle?'article':'website'}" />
<meta property="og:site_name" content="Resistance &amp; Ground" />
<meta property="og:title" content="${esc(p.title)}" />
<meta property="og:description" content="${esc(p.description)}" />
<meta property="og:url" content="${url(p.file)}" />
<meta property="og:image" content="${config.siteUrl+'/'+image}" />
<meta property="og:image:alt" content="${esc(imageInfo.alt)}" />
<meta property="og:image:width" content="${imageInfo.width}" />
<meta property="og:image:height" content="${imageInfo.height}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(p.title)}" />
<meta name="twitter:description" content="${esc(p.description)}" />
<meta name="twitter:image" content="${config.siteUrl+'/'+image}" />
<meta name="twitter:image:alt" content="${esc(imageInfo.alt)}" />
<script type="application/ld+json">${JSON.stringify([entity,crumb]).replaceAll('<','\\u003c')}</script>
<!-- /rg:metadata -->`}
function output(f,s){if(check){if(!fs.existsSync(root+'/'+f)||fs.readFileSync(root+'/'+f,'utf8')!==s)stale.push(f)}else{fs.mkdirSync(path.dirname(root+'/'+f),{recursive:true});fs.writeFileSync(root+'/'+f,s)}}
for(const p of config.pages){let s=fs.readFileSync(root+'/'+p.file,'utf8');s=s.replace(/<header\b[^>]*>[\s\S]*?<\/header>/,header(p));s=s.replace(/<!-- rg:metadata -->[\s\S]*?<!-- \/rg:metadata -->/,metadata(p));
const crumbs=`<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${ancestors(p).map((a,i,list)=>`<li>${i===list.length-1?`<span aria-current="page">${esc(a.title)}</span>`:`<a href="${relative(p.file,a.file)}">${a.file==='index.html'?'Home':esc(a.title)}</a>`}</li>`).join('')}</ol></nav>`;
s=s.replace(/<!-- rg:breadcrumbs -->[\s\S]*?<!-- \/rg:breadcrumbs -->/,'<!-- rg:breadcrumbs -->'+crumbs+'<!-- /rg:breadcrumbs -->');output(p.file,s)}
const rules=[];
for(const[from,to]of Object.entries(config.redirects)){const dest='/'+to.replace(/index\.html$/,'');for(const old of from.endsWith('/index.html')?['/'+from,'/'+from.replace(/index\.html$/,''),'/'+from.replace(/\/index\.html$/,'')]:['/'+from])rules.push(`${old} ${dest} 301!`)}
output('_redirects',rules.join('\n')+'\n');
output('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+config.pages.map(p=>`  <url><loc>${esc(url(p.file))}</loc></url>`).join('\n')+'\n</urlset>\n');
if(stale.length){console.error('Generated files are stale:',stale.join(', '));process.exitCode=1}else console.log(check?'Shared navigation, metadata, redirects and sitemap are current.':'Shared site files generated.');
