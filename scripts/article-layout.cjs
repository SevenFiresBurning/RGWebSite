// Shared article layout and listing. Prose stays in the configured HTML source.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const esc = s => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const relative = (from, to) => path.posix.relative(path.posix.dirname(from), to);

function articlePage(page, config) {
  const image = config.images[page.image];
  const content = fs.readFileSync(path.join(root, page.article.content), 'utf8');
  const related = page.article.related.map(file => {
    const target = config.pages.find(p => p.file === file);
    if (!target) throw new Error(`Missing related article target: ${file}`);
    return `<li><a href="${relative(page.file, file)}">${esc(target.title)} <span aria-hidden="true">→</span></a></li>`;
  }).join('\n');
  let template = fs.readFileSync(path.join(__dirname, 'templates/article.html'), 'utf8');
  // Template paths start at the established two-level Resources article location.
  template = template.replace(/(href|src)="(\.\.\/[^"?#]+)([^" ]*)"/g, (_, attr, target, suffix) => {
    const fromRoot = path.posix.normalize('resources/article/' + target);
    return `${attr}="${relative(page.file, fromRoot)}${suffix}"`;
  });
  return template.replace('<!-- rg:article -->', `<article class="resource-article">
  <div class="page-heading"><p class="eyebrow">Resources / Publishing</p><h1>${esc(page.title)}</h1><p class="intro">${esc(page.article.intro)}</p><p>By Resistance &amp; Ground</p></div>
  <figure class="resource-visual"><img src="${relative(page.file, page.image)}" width="${image.width}" height="${image.height}" alt="${esc(image.alt)}" decoding="async" /></figure>
  <div class="resource-copy">
    ${content}
    <nav class="related-reading" aria-labelledby="related-reading-heading"><h2 id="related-reading-heading">Keep reading</h2><ul>${related}</ul><a class="button button--primary" href="${relative(page.file, 'resources/articles/index.html')}">All articles <span aria-hidden="true">→</span></a></nav>
  </div>
</article>`);
}

function articleListing(page, config) {
  return `<section class="article-list" aria-label="Publishing articles">${config.pages.filter(p => p.article).map(p => {
    const image = config.images[p.image];
    return `<article class="article-card"><img src="${relative(page.file, p.image)}" width="${image.width}" height="${image.height}" alt="${esc(image.alt)}" loading="lazy" /><div><p class="eyebrow">Publishing</p><h2><a href="${relative(page.file, p.file)}">${esc(p.title)}</a></h2><p>${esc(p.summary || p.description)}</p><a class="plain-link" href="${relative(page.file, p.file)}" aria-label="Read ${esc(p.title)}">Read the article <span aria-hidden="true">→</span></a></div></article>`;
  }).join('\n')}</section>`;
}
module.exports = { articlePage, articleListing };
