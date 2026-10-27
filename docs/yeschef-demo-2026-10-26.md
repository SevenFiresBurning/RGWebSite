# YesChef public-prototype entry — October 26, 2026

## Status

R&G integration prepared locally, but NOT complete end-to-end: https://yeschef.resistanceandground.com does not resolve in the external network check. User confirmed this is the intended deployment target once YesChef is deployed to Cloudflare Pages and its custom subdomain is configured. No claim that the public demo currently opens or is usable. No Cloudflare settings changed; no app code copied or embedded; no commit, push or deployment.

## Placement and content

Updated the existing YesChef card in Web & Systems → Built by R&G → Market, preserving order and every other card. Existing YesChef detail URL /web-development/portfolio/yeschef/ retained. Homepage continues to lead visitors through its existing Market entrance; no new top-level navigation, project record, large portfolio grid or homepage feature added. Existing artwork reused unchanged.

Category: Kitchen Operations. Status: Public Prototype. Card copy: “Cost recipes, compare suppliers, plan events, and manage daily kitchen decisions from one connected workspace.” Detail introduction: “A chef-focused operations platform for recipes, food costing, vendor comparison, events, kitchen math, and operational paperwork.”

Prototype points: recipe costing/scaling; vendor product comparison; event menu economics; kitchen conversions; operational document previews; browser-local demo data. Near the action: sample Recipes, Vendors, Events, costs and operational data; data stored locally in the browser. Broader existing capability descriptions remain under Development direction with an explicit note that not every capability is complete. No production-readiness, shared cloud data, security, integration or multi-user claims added.

## Configuration and availability

site.config.json:
- yesChefDemoUrl: https://yeschef.resistanceandground.com
- yesChefDemoAvailable: false

The shared generator fills two rg:yeschef-demo-action markers (existing Market card and detail presentation). Pending state shows the requested Open YesChef Demo label as a non-interactive, aria-disabled status presentation and explains deployment is pending. No broken placeholder anchor is exposed to visitors. Live state renders the explicit Open YesChef Demo link in the same tab, matching normal project demo navigation. HTTPS is enforced; localhost addresses rejected. No authentication, email or signup introduced. The site still offers the functional existing project-detail link.

After the independent YesChef app and custom domain are deployed: verify the URL, populated demo, no-login flow and browser-local storage behavior; then set yesChefDemoAvailable true and run node scripts/sync-site.cjs. The live link path has been tested by rendering the actual helper in isolation, without temporarily exposing it in generated HTML. No URL duplicated across source HTML; one configured destination.

## Styling and accessibility

Scoped yeschef-title gradient follows the existing RG sharp text-clipping approach, with 14-second smooth alternating color movement, bold light text, no blur/text-shadow and a solid text fallback. Reduced motion and forced colors disable the gradient/animation. Visible CTA targets are at least 44px tall and wrap within container width. Existing focus indicators apply to the eventual native demo anchor and current detail link. Disabled action is intentionally not a keyboard trap or clickable link. No separate design framework, new dependency, heavy brand asset or new JavaScript file.

## Tests

Passed:
- node scripts/sync-site.cjs
- node scripts/sync-site.cjs --check
- node scripts/check-site.cjs
- node scripts/check-seo.cjs
- node scripts/check-gallery-demos.cjs
- node scripts/check-public-scores.cjs
- git diff --check
- Supplemental tests: one existing YesChef card; disabled state contains no dead href; enabled state uses configured same-tab public HTTPS destination; localhost rejected; other Market cards unchanged; 199 other tracked files byte-preserved relative to task-start snapshot.
- Local HTTP 200: homepage, Market, YesChef detail, existing YesChef artwork. Started the existing isolated preview server as needed; no production DB changes.

Not applicable: npm test, npm run typecheck and npm run build — this is a vanilla HTML/CSS/JS site without package.json, TypeScript or npm build pipeline. Existing generation, JS syntax and validation scripts used instead.

Blocked/pending:
- Public endpoint verification failed DNS resolution outside the sandbox. Demo not verified loaded, populated, login-free or usable; integration is pending external deployment and domain configuration.
- Browser automation remains unavailable due to earlier explicit preview browser-security rejection; no workaround attempted. No actual click-through, hover/focus, console, animation or viewport test claimed. Responsive source reviewed at 320/375/390/430/768 and desktop widths using existing minmax grid and ≤700px single-column breakpoint; wrapping CTA, text and intrinsic artwork sizes preserved. Actual horizontal overflow/phone-touch verification remains required.

## Files changed

- site.config.json — centralized target/availability, updated Market and YesChef metadata descriptions.
- scripts/sync-site.cjs — shared demo action rendering from configuration.
- rgv4.css — scoped sharp/reduced-motion-aware title shimmer and wrapping action styles.
- web-development/built-by-rg/market/index.html — existing card presentation/action.
- web-development/portfolio/yeschef/index.html — public-prototype presentation and expectations.
- docs/yeschef-demo-2026-10-26.md — this report.

Tracked diff: 5 files, 37 insertions and 15 deletions; report is untracked. Unrelated untracked assets/documents and preview logs preserved. No files staged.
