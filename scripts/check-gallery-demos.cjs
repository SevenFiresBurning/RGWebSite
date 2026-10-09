const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
const roots = ['web-development/marketplace/demos', 'web-development/arcade/games'];
let checked = 0;
function existsExact(relative) {
  let current = root;
  for (const segment of relative.split('/')) {
    assert(fs.readdirSync(current).includes(segment), 'Missing/case-mismatched asset: ' + relative);
    current = path.join(current, segment);
  }
}
function checkUrl(value, file) {
  if (/^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(value)) return;
  const url = new URL(value, 'https://local/' + file);
  let target = decodeURIComponent(url.pathname.slice(1));
  if (target.endsWith('/')) target += 'index.html';
  existsExact(target);
}
function walk(relative) {
  for (const entry of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
    assert(!/^(?:node_modules|\.git|\.env(?:\..*)?|\.cache|.*\.map)$/i.test(entry.name), 'Non-production file: ' + entry.name);
    const file = relative + '/' + entry.name;
    if (entry.isDirectory()) { walk(file); continue; }
    checked++;
    const extension = path.extname(file);
    if (!['.html', '.css', '.js'].includes(extension)) continue;
    const content = fs.readFileSync(path.join(root, file), 'utf8');
    if (extension === '.html') {
      assert(content.includes('noindex,follow'), 'Demo search policy missing: ' + file);
      assert(content.includes('id="rg-demo-return"'), 'Missing return to R&G: ' + file);
      for (const match of content.matchAll(/(?:href|src|poster)=["']([^"']+)["']/g)) checkUrl(match[1], file);
    }
    if (extension === '.css') {
      for (const match of content.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) checkUrl(match[1], file);
    }
    if (extension === '.js') {
      cp.execFileSync(process.execPath, ['--check', path.join(root, file)]);
      // Compiled image literals can bypass the HTML and CSS asset checks.
      for (const match of content.matchAll(/["'](\/[^"'\s]+\.(?:png|webp|jpg|svg))["']/g)) checkUrl(match[1], file);
    }
  }
}
roots.forEach(walk);
cp.execFileSync(process.execPath, ['--check', path.join(root, 'web-development/demo-return.js')]);
console.log(`PASS: ${checked} production files; demo links/assets, case-sensitive paths, JS syntax, noindex and excluded development files.`);
