// Repeat after copying/building demo output. Original source projects are untouched.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function visit(folder, gallery) {
  for (const entry of fs.readdirSync(path.join(root, folder), { withFileTypes: true })) {
    const file = folder + '/' + entry.name;
    if (entry.isDirectory()) { visit(file, gallery); continue; }
    if (!file.endsWith('.html')) continue;
    let html = fs.readFileSync(path.join(root, file), 'utf8');
    if (html.includes('id="rg-demo-return"')) continue;
    html = html.replace('</head>', '<link rel="stylesheet" href="/web-development/demo-return.css?v=2" /><script src="/web-development/demo-return.js" defer></script></head>');
    const pauses = file.includes('/urine-trouble/');
    if (pauses) html = html.replace('<body>', '<body class="rg-game-with-return">');
    html = html.replace(/<body\b[^>]*>/, tag => tag + `<nav id="rg-demo-return"${pauses ? ' data-escape="pause"' : ''} aria-label="Return to Resistance &amp; Ground"><a href="/web-development/${gallery}/index.html">← Back to R&amp;G</a><span>${gallery === 'arcade' ? 'Arcade' : 'Marketplace'} · Esc ${pauses ? 'pauses' : 'to return'}</span></nav>`);
    fs.writeFileSync(path.join(root, file), html);
  }
}
visit('web-development/marketplace/demos', 'marketplace');
visit('web-development/arcade/games', 'arcade');
console.log('Demo return links added.');
