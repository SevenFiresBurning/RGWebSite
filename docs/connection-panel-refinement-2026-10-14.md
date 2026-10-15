# Electrical connection panel refinement — 2026-10-14

Local on RGv4. Earlier uncommitted connection-panel work preserved. No commit, push, deployment, dependency installation or Cloudflare changes.

## Files changed
- scripts/connection-panel.cjs: retained existing groups/destinations/footer template; added six metal-stem momentary-contact assemblies, one SVG conductor/signal layer and six generated branch junctions.
- connection-panel.css: graphite/metal finishes, recessed mounting plates, indicator lights, per-connection feedback and a restrained illuminated segment moving along the actual conductor. Reduced motion hides the moving segment and disables stem movement while retaining the stationary wiring and contact illumination.
- connection-panel.js: measures actual socket/group/ground positions and draws one continuous main path. ResizeObserver updates it when the banks stack. Six short vertical branches join it with visible junction dots. Pointer/Enter/click momentarily throw only the activated contact, returning after about 650ms; native anchor navigation and modified-click behavior remain untouched. Hover/focus brightens the corresponding branch.
- scripts/sync-site.cjs: includes versioned panel CSS/JS on shared public pages; generated HTML updated across all 18 canonical pages, including article-template outputs.
- scripts/check-site.cjs: syntax checks for the new module/script, six switches per panel, conductor layers and normal-link semantics without nested buttons or persistent switch attributes.
- docs/qa/connection-refined-desktop.png and connection-refined-mobile.png: browser evidence.

## Conductor and interaction
The path enters from the left through a resistor-style zigzag, passes FOLLOW then PAY junctions and terminates at the existing ground symbol. Straight bus segments and 90-degree return turns keep it continuous on stacked mobile layouts. The animated path has exactly the same d attribute as the stationary conductor. Only a short segment moves; no panel-wide blink or simultaneous activation.
Switch stems mount beside each recessed socket. LED and stem feedback represent momentary link activation, not account/payment availability. Links retain original hrefs, new-tab behavior and accessibility labels. No payment transaction or account authentication performed.

## Preservation and tests
All six configured R&G URLs unchanged, including the original Facebook share URL and Cash App $ResistGround spelling. Compared the artist social block with Git HEAD: all seven Mike's Wilson URLs remain identical. Header navigation, redirects, sitemap and robots rules have no content changes from this refinement.
PASS: sync-site.cjs; sync-site.cjs --check; check-site.cjs; check-seo.cjs; check-gallery-demos.cjs; check-public-scores.cjs.
Browser tested actual widths 320, 375, 768, 1024, 1280 and 1440px on Contact: no horizontal overflow at any size; six switches, six junctions, one continuous main path and identical moving/static path geometry. Confirmed matching keyboard-focus branch, pointer activation opening Facebook, Enter activation and return to resting state. No persistent on/off role or nested interactive element. No console warnings/errors captured.
Physical touch input and OS reduced-motion/forced-colors emulation were not exercised; pointer-event support and relevant CSS rules are implemented. Separate additional homepage inspection at 320px found approximately 5px of existing hero-content overflow, outside the panel. Homepage typography/layout remains unchanged; the panel and Contact page fit the available width.
