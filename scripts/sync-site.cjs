// Run from any directory: node scripts/sync-site.cjs [--check]. No dependencies.
const fs=require('fs'),path=require('path');
const {articlePage,articleListing}=require('./article-layout.cjs');
const {connectionPanel}=require('./connection-panel.cjs');
const root=path.resolve(__dirname,'..'),config=JSON.parse(fs.readFileSync(root+'/site.config.json','utf8'));
const check=process.argv.includes('--check'),byFile=new Map(config.pages.map(p=>[p.file,p]));let stale=[];
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const url=f=>config.siteUrl+'/'+f.replace(/index\.html$/,'');
const relative=(from,to)=>path.posix.relative(path.posix.dirname(from),to)||'index.html';
function ancestors(p){const result=[];while(p){result.unshift(p);p=byFile.get(p.parent)}return result}
function header(page){const chain=ancestors(page).map(p=>p.file);
 const link=(f,label,cls='',fragment='')=>`<a${cls?` class="${cls}"`:''} href="${relative(page.file,f)}${fragment?'#'+fragment:''}"${fragment?(page.article&&f==='resources/index.html'?' aria-current="location"':''):page.file===f?' aria-current="page"':chain.includes(f)?' aria-current="location"':''}>${esc(label)}</a>`;
 function children(parent){const overrides=byFile.get(parent)?.navigationLinks;if(overrides)return overrides.map(p=>`<li>${link(p.file,p.title,'',p.fragment||'')}</li>`).join('\n');return config.pages.filter(p=>p.parent===parent&&p.navigation!==false).map(p=>`<li>${link(p.file,p.title)}${config.pages.some(c=>c.parent===p.file&&c.navigation!==false)?`<ul>${children(p.file)}</ul>`:''}</li>`).join('\n')}
 return `<header class="site-header">
  <a class="brand" href="${relative(page.file,'index.html')}" aria-label="Resistance and Ground home"><span class="brand-mark" aria-hidden="true">⏚</span><span>RESISTANCE<br />&amp; GROUND</span></a>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav">Menu <span aria-hidden="true">+</span></button>
  <nav id="main-nav" aria-label="Main navigation">
${config.navigation.map((f,i)=>{const p=byFile.get(f),kids=config.pages.some(c=>c.parent===f&&c.navigation!==false);if(!kids)return link(f,p.title,f==='contact/index.html'?'nav-contact':'');return `<div class="nav-dropdown"><div class="nav-topline">${link(f,p.title,'nav-overview')}<button class="nav-submenu-toggle" type="button" aria-label="Toggle ${esc(p.title)} submenu" aria-expanded="false" aria-controls="nav-section-${i}"><span aria-hidden="true">⌄</span></button></div><div class="nav-submenu" id="nav-section-${i}"><ul>${children(f)}</ul></div></div>`}).join('\n')}
  </nav>
</header>`}
function metadata(p){const image=p.image||config.defaultSocialImage||'assets/rg-social-card.png',imageInfo=config.images[image],isArticle=Boolean(p.article);const entity={'@context':'https://schema.org','@type':isArticle?'Article':'WebPage',name:p.title,description:p.description,url:url(p.file),isPartOf:{'@type':'WebSite',name:'Resistance & Ground',url:config.siteUrl+'/'}};if(isArticle)Object.assign(entity,{headline:p.title,mainEntityOfPage:url(p.file),image:config.siteUrl+'/'+image,author:{'@type':'Organization',name:'Resistance & Ground',url:config.siteUrl+'/'},publisher:{'@type':'Organization',name:'Resistance & Ground',url:config.siteUrl+'/'}});
 const crumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:ancestors(p).map((a,i)=>({'@type':'ListItem',position:i+1,name:a.file==='index.html'?'Home':a.title,item:url(a.file)}))};
 return `<!-- rg:metadata -->
<title>${esc(p.file==='index.html'?'Resistance & Ground — Web & Systems, Music & Media, Publishing & Artist Services':p.title+' — Resistance & Ground')}</title>
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
function yesChefDemoAction(){
 const target=new URL(config.yesChefDemoUrl);if(target.protocol!=='https:'||target.hostname==='localhost'||target.hostname==='127.0.0.1')throw new Error('YesChef demo must use a public HTTPS URL');
 const action=config.yesChefDemoAvailable?`<a class="button button--primary yeschef-demo-link" href="${esc(config.yesChefDemoUrl)}">Open YesChef Demo <span aria-hidden="true">→</span></a>`:'<span class="button yeschef-demo-unavailable" aria-disabled="true">Open YesChef Demo</span>';
 return '<!-- rg:yeschef-demo-action --><div class="yeschef-demo-access">'+action+'<p class="yeschef-demo-note">Sample Recipes, Vendors, Events, costs, and operational data. Demo data is stored locally in your browser.</p><p class="yeschef-demo-note">'+(config.yesChefDemoAvailable?'Demo data is stored locally in your browser. No account required.':'Demo deployment pending. The public link will be enabled once the prototype is online.')+'</p></div><!-- /rg:yeschef-demo-action -->';
}
function componentLine(end=false){
 const lead='M0 12 H18 l4 -5 8 10 8 -10 8 10 4 -5 H482 l4 -5 8 10 8 -10 8 10 4 -5 H984 V24';
 const ground='M972 24 h24 M976 29 h16 M980 34 h8';
 return `<div class="page-component-line${end?' page-component-line--end':''}" aria-hidden="true"><svg viewBox="0 0 1000 40" focusable="false"><path class="circuit-trace" d="${lead} ${ground}" /><path class="circuit-signal" pathLength="100" d="${lead}" /><path class="circuit-ground" d="${ground}" /></svg></div>`;
}
function output(f,s){const target=root+'/'+f,existing=fs.existsSync(target)?fs.readFileSync(target,'utf8'):null;/* Preserve existing files when only platform line endings differ. */if(existing!==null&&existing.replace(/\r\n/g,'\n')===s.replace(/\r\n/g,'\n'))return;if(check)stale.push(f);else{fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,s)}}
function canonicalLinks(html,file){return html.replace(/href="([^"]+)"/g,(match,href)=>{
 if(/^(https?:|mailto:|data:|tel:|#)/.test(href))return match;
 const target=new URL(href.replaceAll('&amp;','&'),config.siteUrl+'/'+file);
 if(target.origin!==config.siteUrl)return match;
 let resolved=target.pathname.slice(1);if(resolved.endsWith('/'))resolved+='index.html';
 if(config.redirects[resolved])resolved=config.redirects[resolved];
 if(!byFile.has(resolved))return match;
 return `href="${esc('/'+resolved.replace(/index\.html$/,'')+target.search+target.hash)}"`;
});}
for(const p of config.pages){let s=p.article?articlePage(p,config):fs.readFileSync(root+'/'+p.file,'utf8');
s=s.replace(/<!-- rg:connections -->[\s\S]*?<!-- \/rg:connections -->/g,'').replace(/<!-- rg:connection-assets -->[\s\S]*?<!-- \/rg:connection-assets -->/g,'');
s=s.replace(/<!-- rg:yeschef-demo-action -->[\s\S]*?<!-- \/rg:yeschef-demo-action -->/g,()=>yesChefDemoAction());
s=s.replace('</head>',`<!-- rg:connection-assets --><link rel="stylesheet" href="${relative(p.file,'connection-panel.css')}?v=slim-4" /><script src="${relative(p.file,'connection-panel.js')}?v=slim-4" defer></script><!-- /rg:connection-assets --></head>`);
s=s.replace(/<!-- rg:article-list -->[\s\S]*?<!-- \/rg:article-list -->/,'<!-- rg:article-list -->'+articleListing(p,config)+'<!-- /rg:article-list -->');s=s.replace(/<header\b[^>]*>[\s\S]*?<\/header>/,header(p));s=s.replace(/<!-- rg:metadata -->[\s\S]*?<!-- \/rg:metadata -->/,metadata(p));
const crumbs=`<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${ancestors(p).map((a,i,list)=>`<li>${i===list.length-1?`<span aria-current="page">${esc(a.title)}</span>`:`<a href="${relative(p.file,a.file)}">${a.file==='index.html'?'Home':esc(a.title)}</a>`}</li>`).join('')}</ol></nav>`;
s=s.replace(/<!-- rg:breadcrumbs -->[\s\S]*?<!-- \/rg:breadcrumbs -->/,'<!-- rg:breadcrumbs -->'+crumbs+'<!-- /rg:breadcrumbs -->');// Shared decoration remains generated, including article-template outputs.
s=s.replace(/<!-- rg:component-(?:assets|start|end) -->[\s\S]*?<!-- \/rg:component-(?:assets|start|end) -->/g,'');
s=s.replace(/\s*<link rel="stylesheet" href="(?:\.\.\/)*home-circuit\.css" \/>/g,'').replace(/\s*<script src="(?:\.\.\/)*home-circuit\.js" defer><\/script>/g,'');
s=s.replace('</head>',`<!-- rg:component-assets --><link rel="stylesheet" href="${relative(p.file,'home-circuit.css')}" /><script src="${relative(p.file,'home-circuit.js')}" defer></script><!-- /rg:component-assets --></head>`);
if(p.file!=='index.html'){
 s=s.replace('<!-- /rg:breadcrumbs -->','<!-- /rg:breadcrumbs --><!-- rg:component-start -->'+componentLine()+'<!-- /rg:component-start -->');
 s=s.replace('</main>','<!-- rg:component-end -->'+componentLine(true)+'<!-- /rg:component-end --></main>');
}
if(p.file==='index.html')s=s.replace(/(<section class="home-hero">[\s\S]*?<\/section>)/,'$1'+connectionPanel(p,config));
else s=s.replace('<!-- /rg:component-start -->','<!-- /rg:component-start -->'+connectionPanel(p,config));
output(p.file,canonicalLinks(s,p.file))}
const rules=[];
for(const[from,to]of Object.entries(config.redirects)){const dest='/'+to.replace(/index\.html$/,'');for(const old of from.endsWith('/index.html')?['/'+from,'/'+from.replace(/index\.html$/,''),'/'+from.replace(/\/index\.html$/,'')]:['/'+from])rules.push(`${old} ${dest} 301`)}
output('_redirects',rules.join('\n')+'\n');
output('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+config.pages.filter(p=>!p.noindex&&!config.redirects[p.file]).map(p=>`  <url><loc>${esc(url(p.file))}</loc></url>`).join('\n')+'\n</urlset>\n');
if(stale.length){console.error('Generated files are stale:',stale.join(', '));process.exitCode=1}else console.log(check?'Shared navigation, metadata, redirects and sitemap are current.':'Shared site files generated.');
