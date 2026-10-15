# Social and payment connection panel — 2026-10-14

Implemented locally on RGv4 at existing base 5579c11. No commit, push or deployment. Existing Music & Media, Resources, navigation, redirect and SEO work remains intact; unrelated untracked assets untouched.

## Implementation
- site.config.json: one shared FOLLOW/PAY destination list. Facebook reuses the existing R&G share link exactly; Instagram, TikTok, PayPal, Venmo and Cash App use the supplied destinations, including the literal $ResistGround Cash App path.
- scripts/connection-panel.cjs: accessible semantic HTML with two labelled navigation groups, six ordinary external links, decorative socket/icon elements and a common-ground symbol. External links use target=_blank with noopener/noreferrer and announce the new tab.
- connection-panel.css: compact equipment-style plate, circular sockets, subtle circuit rails, common ground, restrained hover/focus illumination, keyboard outline, mobile grouping and reduced-motion handling. No component JavaScript, account connection or payment processing.
- assets/social/paypal.svg and cash-app.svg: lightweight monochrome SVG symbols. Existing Facebook, Instagram, TikTok and Venmo SVGs reused without modification.
- scripts/sync-site.cjs: panel and stylesheet generated once above the shared footer on all 18 public canonical pages, including regenerated articles. Retired fallback pages and standalone game/demo experiences remain unchanged.
- index.html: moved the standalone R&G Facebook link into the common panel so the homepage contains that account link only once. Artist-specific accounts are unchanged.
- scripts/check-site.cjs: validates one panel, six destinations and safe external-link attributes across every canonical page, plus no duplicate homepage R&G Facebook link.
- Generated public HTML files, desktop/mobile screenshots under docs/qa.

## Validation
Passed sync-site.cjs, sync-site.cjs --check, check-site.cjs, check-seo.cjs, check-gallery-demos.cjs and check-public-scores.cjs. Regeneration is stable; canonicals, sitemap, permanent redirects, game/demo noindex and Arcade storage behavior preserved.
Browser checked actual widths 320, 375, 768, 1024 and 1440px. No horizontal overflow. Two groups side by side on desktop/tablet and stacked below 600px; six labels remain visible. Smallest measured link target at 320px was approximately 72px, exceeding 44px. All six icons loaded. Sequential keyboard focus visits Instagram, TikTok, PayPal, Venmo and Cash App after Facebook, with visible outlines and socket illumination. No captured console warnings/errors. Reduced motion disables the only component transition; there are no animated circuit effects.
Destination hrefs verified against the supplied list. No payment transaction or external account authentication was performed. Physical-device touch and OS-level forced-colors/reduced-motion emulation were not exercised.
