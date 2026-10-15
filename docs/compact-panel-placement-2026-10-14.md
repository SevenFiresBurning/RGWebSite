# Compact electrical panel repositioning — 2026-10-14

Local implementation on RGv4. No commit, push, deploy, dependency or Cloudflare change. Unrelated untracked assets preserved.

## Final placement
On the 17 internal canonical pages, the single shared module is the immediate next element after the existing top page-component-line and before page-heading/article content. On the homepage, which has no generated top page-component-line, it follows the existing home-hero section ending in the original ground-rule bars. Existing line/hero markup and styles are unchanged. The footer instance is removed, while original footer HTML is preserved exactly.

## Changed files
- scripts/sync-site.cjs: relocates the generated instance, keeps regeneration idempotent, versions compact assets. Reuses scripts/connection-panel.cjs without rebuilding its markup.
- connection-panel.css: maximum width 640px rather than 860px, reduced padding/height, 32px sockets, 18px mounting plates, 17px metal stems, 11px readable platform labels, thinner wiring and a smaller ground mark. No scale() sizing. Desktop design footprint is approximately 55–60% of the previous module; phone groups still stack to preserve readability. Link targets retain a 44px minimum width and 62px minimum height.
- connection-panel.js: final conductor rail follows the measured ground location instead of the former fixed-height offset; junctions reduced proportionally. Animation follows the same path and remains contained by the module.
- scripts/check-site.cjs: checks shared placement, exactly one instance, and no footer placement.
- All 18 canonical HTML pages regenerated with relocated markup and asset versions; redirects/sitemap URL contents unchanged.

## Preservation and validation
PASS: sync-site.cjs; sync-site.cjs --check; check-site.cjs; check-seo.cjs; check-gallery-demos.cjs; check-public-scores.cjs.
Additional source comparison with Git HEAD verified every original footer and internal top component-line block is unchanged; the original homepage hero is unchanged. Six R&G destinations and all seven artist-specific Mike's Wilson links match the previous version exactly. Shared header CSS/JavaScript was not modified. Six momentary switches, grouped FOLLOW/PAY links, resistor, continuous animated conductor, branch illumination and reduced-motion handling are retained.
Browser visual/interaction verification could not be completed: the browser URL policy denied access to the current localhost preview. No alternate browser or automation workaround was attempted. Actual rendered dimensions, responsive menu interaction, and compact animation appearance therefore remain visually unverified in this pass; stated footprint is a design estimate. No screenshot from the previous footer version is presented as evidence of the new placement.
