# YesChef deployment — October 27, 2026

## Live destinations

- Public app: https://yeschef.resistanceandground.com/
- Cloudflare Pages production alias: https://yeschef-2.pages.dev/
- Deployment snapshot: https://4e0e6692.yeschef-2.pages.dev/
- Separate Cloudflare Pages project: yeschef-2, production branch main (Direct Upload).

User identified the authoritative build directory as C:\Users\resis\Documents\Codex\2026-08-14\files-mentioned-by-the-user-codex\yeschef-2\dist. Source app was verified against its own README/package/scripts and the active Build YesChef MVP chat; no older root-workspace app substituted.

## Build and publication

Executed in the YesChef source project: npm test (92 passed, 0 failed), npm run typecheck (passed), npm run build (passed). Build contains static index.html, hashed CSS and JS. No server API, account creation, shared cloud database or server secrets required. Source confirms seeded demo kitchen plus browser-local persistence; no no-login UI test is claimed.

Authenticated Cloudflare CLI with user-approved OAuth flow. Created a separate yeschef-2 Pages project. Parent workspace contained an older deployment configuration that conflicted with the app config; no parent files removed or rewritten. Copied only the fresh dist and app wrangler.toml to an isolated OS temporary release folder and deployed from there. Deployment uploaded 3 static files successfully. No YesChef app code was copied into R&G.

Attached yeschef.resistanceandground.com to the project. CLI authorization permits Pages operations but not zone DNS access; DNS API read returned 403. User manually saved the CNAME yeschef → yeschef-2.pages.dev in the resistanceandground.com zone. On resume, Pages reported domain/verification/HTTP-validation status all active. Initial HTTP 522 resolved during activation. Final custom-domain root returned 200 with title YesChef 2.0; both /assets/index-CJEEIMDk.js and /assets/index-D84e9UhY.css returned 200 over HTTPS.

## R&G integration

Set site.config.json yesChefDemoAvailable to true; preserved the centralized target https://yeschef.resistanceandground.com. Regenerated only the existing YesChef Market-card and detail-page action blocks. Open YesChef Demo is now a normal, keyboard-focusable same-tab link with explicit text and existing focus styling. Removed deployment-pending presentation through the shared generator; browser-local demo and no-account context retained. YesChef remains first in Market. No other cards, navigation, artist pages or unrelated user files changed.

Ran R&G sync-site.cjs, sync-site.cjs --check, check-site.cjs, check-seo.cjs, check-gallery-demos.cjs, check-public-scores.cjs and git diff --check: all passed.

## Limits and future releases

Browser automation stopped explicitly because URL-policy enforcement is unsupported for the user's Firefox window. No workaround attempted. Actual click-through, runtime console, responsive viewports, keyboard/touch, and manual recipe/vendor/event workflows remain untested in-browser. HTTP assets, source behavior and automated tests are verified; these do not substitute for interactive acceptance testing.

Future YesChef releases require a new build and Direct Upload to yeschef-2; R&G Git deployment does not deploy the independent app. The original app source was not committed by this deployment task. Cloudflare resources were limited to the new YesChef project/domain; no R&G hosting settings changed. OAuth credentials were used only in memory by temporary API helpers; no token copied into R&G or reported.
