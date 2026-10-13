# Homepage and Built by R&G cleanup — 2026-10-13

Implemented locally on existing RGv4, fast-forwarded to current origin/main (32a6ab1). No new commit, push, or deployment.

## Changes
- index.html: removed the entire personal introduction and its Read More link; added Featured Client immediately above J&S; replaced the homepage Market eyebrow with the approved wording. Feature artwork, description, all three external client links, gallery entrances, and remaining homepage content are preserved.
- rgv4.css: removed two unused personal-introduction spacing rules.
- web-development/index.html: replaced the existing client-websites/workflow-tools paragraph with the exact approved Built by R&G copy, once. Existing service information, sales guide, and YesChef service example remain intact.
- web-development/built-by-rg/market/index.html: integrated YesChef with existing artwork and an explicit development status; Teacher Basic and Apple & Chalk explicitly labeled website templates. Existing four projects remain.
- web-development/built-by-rg/arcade/index.html: added AfterFall after the two playable games, with original artwork, strategy-game description and development status. Links lead to project details; no playable demo is claimed.
- web-development/portfolio/yeschef/index.html and web-development/portfolio/afterfall/index.html: updated breadcrumbs/structured data and return links to Market/Arcade.
- site.config.json: updated gallery descriptions and detail-page parents while keeping URLs unchanged.
- docs/qa/home-cleanup-desktop.png and docs/qa/home-cleanup-mobile.png: local visual verification captures.

## URL and functionality preservation
All six requested existing URLs remain canonical and available. No new routes or redirects. Web & Systems remains in primary navigation and retains service/sales information. The full approved paragraph appears only on Web & Systems, where the old paragraph was located.
About, Music & Media, Publishing, and Resources have no content diff. Arcade scripts, game pages, launch links, score APIs, Wall APIs, storage and aging logic have no diff. Shared generated files may show filesystem modification status from line endings but have no content changes outside this scope.

## Validation
Passed sync-site.cjs, sync-site.cjs --check, check-site.cjs, check-gallery-demos.cjs, and check-public-scores.cjs. Site checks cover canonical/legacy routes, case-sensitive links/assets, fragments, metadata, navigation and JavaScript syntax; public storage checks cover leaderboard behavior and Wall lifecycle.
Browser verified effective desktop width 1210px and mobile width 328px, five Market cards and three Arcade cards, no horizontal page overflow, correct Featured Client label, removed personal-introduction section, updated detail breadcrumbs and working gallery-to-detail-to-gallery links. Captured console logs contain no warnings/errors. Existing object-fit:contain preserves full project artwork.
No unresolved decisions. J&S's existing live destination is preserved; no new launch claim introduced. Physical-device touch testing was not performed in this pass.
