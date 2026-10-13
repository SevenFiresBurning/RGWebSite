# Music & Media simplification and navigation QA — 2026-10-13

Local implementation on RGv4. Prior homepage, project-copy and SEO work remains preserved. Nothing committed, pushed or deployed; no Cloudflare account settings changed.

## Modified files in this pass
- music-media/index.html: concise hero, five-service supporting line, Artists & Collaborations and Publishing pathways, contact CTA retaining type=Artist%20production.
- music-media/artists-collaborations/index.html: existing artist-showcase content consolidated at the surviving URL, with corrected asset paths and heading levels.
- music-media/artists-collaborations/music/index.html: retired noindex fallback page with canonical destination and query-preserving legacy script.
- site.config.json: Music & Media now parents Artists & Collaborations and Publishing; Mike's Wilson keeps its original detail URL with the surviving artist listing as parent. Added former-listing permanent redirect and removed its sitemap entry.
- scripts/sync-site.cjs: preserve canonical-link improvements and normalize retired internal destinations directly to their final page.
- app.js: removed unused production-video audio controls/listeners; fixed desktop hover immediately followed by first toggle click closing the menu.
- style.css and rgv4.css: removed exclusive production-video/expander styles, preserved social-link focus and reduced-motion behavior, added compact Music landing spacing, shared navigation-gap variables and dropdown-indicator spacing.
- scripts/check-site.cjs and scripts/check-seo.cjs: hierarchy and Music/retired-listing assertions updated; sitemap count reports actual entries.
- Shared generated headers/breadcrumbs changed across the canonical site pages. No Built by R&G, Arcade, game, score or Wall content/functionality changed in this pass. Homepage content is unchanged except its existing Publishing service link now points directly to Publishing rather than the retired gateway experience; shared header regenerated.
- _redirects and sitemap.xml regenerated. Existing redirect rules remain; added /music-media/artists-collaborations/music/index.html, /music-media/artists-collaborations/music/, and /music-media/artists-collaborations/music direct 301 rules to /music-media/artists-collaborations/.
- docs/qa/music-simplified-desktop.png and docs/qa/music-simplified-mobile.png: browser verification captures.

## Resulting structure
Primary navigation: Web & Systems, Music & Media, About, Contact.
Music & Media children: Artists & Collaborations (with Mike's Wilson) and Publishing (with existing Resources hierarchy).
Music landing: requested hero and intro; supporting services line; two relevant content destinations; requested contact heading/copy/CTA. Production video, sound toggle, overlays, expanders, exclusive CSS and initialization removed. Original video asset retained; no asset deletions.
Publishing and individual artist paragraph content was compared against Git HEAD and is unchanged. Publishing Resources and type=Publishing contact links remain. Earlier unpublished project updates remain intact.

## Validation
PASS: sync-site.cjs, sync-site.cjs --check, check-site.cjs, check-seo.cjs, check-gallery-demos.cjs, check-public-scores.cjs.
19 unique public canonical sitemap entries; 13 retired-route groups; all clean canonical links, original game/demo noindex rules and query forwarding preserved. Direct redirect rules and destinations checked locally. No claim of live verification for the new artist-listing redirects; they are unpublished.
Browser viewport calibration produced actual CSS widths 320, 375, 768, 1024, 1280 and 1440px. No document horizontal overflow at any tested width. Header is in mobile mode at 768px and below, desktop mode at 1024px and above. Brand/header/nav positions and widths are identical across Music, Publishing and About at 1440px; active states do not shift adjacent items. Desktop dropdown bounds stay inside viewport.
Verified desktop first-click and hover handling, ArrowDown submenu access, Escape closure/focus return; mobile menu, nested resources/articles list, 44px CSS touch targets, Escape returning to Menu, and contact Artist production preselection. Physical touch-device input was not exercised.
Verified surviving Artists & Collaborations showcase, Mike's Wilson detail route, Publishing content and Resources destination. No captured console warnings/errors; existing site checks confirm asset paths and link destinations. Video-related selectors and initialization no longer exist in active Music/shared files.

## Outstanding issues
No implementation decision required. New redirects require a later authorized deployment for production HTTP verification. www DNS/custom-domain configuration remains postponed. No Google indexing or Search Console validation action requested or claimed.
