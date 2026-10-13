# Resources and Articles consolidation — 2026-10-13

Implemented locally on RGv4. Earlier homepage/project, SEO and Music/navigation changes preserved. No commit, push, deployment or Cloudflare settings change.

## Files modified in this pass
- resources/index.html: requested heading/introduction, generated Articles section with both published articles and original artwork, secondary Reference section with approved description and CTA. Removed duplicated feature/gateway presentation.
- resources/articles/index.html: retired noindex fallback pointing directly to /resources/, retaining query/hash forwarding through legacy-redirect.js.
- site.config.json: removed separate Articles listing; both articles now parent directly to Resources; approved card descriptions stored once in existing summary fields; Resources metadata updated; added retired listing redirect.
- scripts/article-layout.cjs: generated list now includes Articles h2 and article-card h3 headings with Read Article links. Existing article metadata/artwork feed the list. Article return CTA goes directly to Resources. Article body sources unchanged.
- resources/resources.css: existing card heading styles extended to h3; section heading styling retained within existing visual system.
- scripts/check-site.cjs: checks Resources card coverage, direct article parents and retired Articles routing.
- Generated canonical headers/breadcrumbs updated sitewide; individual article canonicals and URLs unchanged. Reference page content and external links unchanged.
- _redirects and sitemap.xml regenerated; screenshot artifacts resources-consolidated-desktop.png and resources-consolidated-mobile.png under docs/qa.

## Generation and hierarchy
Resources remains under Publishing. Its children are What Is Music Publishing?, What the MLC Actually Does, and Reference. New published articles use the existing config/content/template workflow: configure the article with Resources as parent, summary and existing image metadata, then run sync-site. No duplicated manual card metadata, placeholder entries, new dependency or CMS.
Permanent rules for /resources/articles/index.html, /resources/articles/, and /resources/articles point directly to /resources/. Existing redirects retained. No public internal links pass through the retired listing. Its fallback retains canonical/noindex safety and query forwarding.

## Validation
PASS: sync-site.cjs; sync-site.cjs --check; check-site.cjs; check-seo.cjs; check-gallery-demos.cjs; check-public-scores.cjs.
18 unique canonical indexable sitemap URLs; 14 retired-route groups. Resources, both articles and Reference remain indexable. Retired listing excluded; individual article canonicals unchanged. Contact parameters and game/demo noindex preserved.
Browser checked actual CSS widths 320, 375, 768, 1024, 1280 and 1440px: no horizontal overflow, consistent header heights (96px mobile / 108px desktop). Verified both article links, direct Resources breadcrumbs, All articles return, Reference destination and existing external-reference links in the DOM. Mobile nested menu shows Resources, two articles and Reference directly, with no Articles gateway. Escape closes the menu. No console warnings/errors; existing validation verifies local asset paths.
New production 301 rules were validated as configuration, not live HTTP responses. They require later authorized deployment for live status verification. Physical-device touch input was not exercised. No remaining implementation decisions.
