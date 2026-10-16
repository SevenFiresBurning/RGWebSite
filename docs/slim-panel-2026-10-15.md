# Slim Social/Pay strip — October 15, 2026

Local implementation only. No commit, push, deployment or Cloudflare change. Existing unrelated untracked assets and preview logs preserved.

## Changes

- connection-panel.css: replaced compact-module overrides with slim-strip proportions. Maximum width 640→560px; reduced housing padding/depth, 32→22px sockets, 18×26→13×19px switch plates, 11→10px platform labels and 22→15px ground symbol. Hidden the redundant R&G/CONNECTIONS nameplate; retained FOLLOW/PAY labels and the accessible section name. Links retain minimum 44×44px targets, no CSS scale used. Two banks remain horizontal above 600px, stacked below.
- connection-panel.js: branch stubs 12→8px, smaller resistor zigzag and junction dots. Existing momentary pointer/Enter handlers unchanged. Signal still uses the exact same SVG path as the stationary conductor. Current stroke 1.1→0.8px with muted color and shorter illuminated segment; reduced-motion behavior remains intact.
- scripts/sync-site.cjs: asset version slim-4. Regenerated 18 canonical HTML pages; normalized comparison to HEAD confirms their only changes are these asset versions. Shared top circuit lines, navigation, footer, placement, all six R&G destinations and seven artist links remain unchanged. One panel per canonical page; standalone games remain untouched.

## Before / after sizing

CSS-derived estimates, NOT browser measurements. Assumes full-width containing block and existing fonts; actual rendered measurements still require a browser. At 320/390px the width is retained for readable controls. Height reduction: approximately 46% desktop and 40% mobile.

| Viewport | Before estimated width × height | After estimated width × height |
|---|---|---|
| 320px | 275 × 295px | 275 × 177px |
| 390px | 335 × 295px | 335 × 177px |
| 768px | 640 × 172px | 560 × 93px |
| 1024px | 640 × 172px | 560 × 93px |
| 1440px | 640 × 172px | 560 × 93px |

Geometry review at all five widths yields link widths above 44px without overflow in the assumed containing block. Desktop horizontal banks and mobile two-row banks preserved. Primary navigation CSS and HTML unchanged; device footprint, brightness and typography reduced to make it subordinate.

## Checks

Passed sync-site.cjs, sync-site.cjs --check, check-site.cjs, check-seo.cjs, check-gallery-demos.cjs, check-public-scores.cjs and git diff --check. Additional normalized comparisons verify unchanged page content/navigation/component lines/links and unchanged event handlers. No duplicate panels introduced.

Browser visual QA remains unavailable following the earlier explicit preview browser security-policy rejection; no workaround attempted. Therefore actual dimensions, navigation prominence, visual overlap/overflow, touch/keyboard interactions, animation appearance and runtime console errors were not browser-tested in this pass. The dimensions above and responsive review are source-derived, not a desktop/mobile visual pass. Manual review is required before publication.
