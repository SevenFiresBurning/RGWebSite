# RGv4 targeted correction pass — September 30, 2026

## Repository and initial state

- Repository: `C:\Users\resis\OneDrive\Desktop\R&G\RGv3`
- Remote: `https://github.com/SevenFiresBurning/RGWebSite.git`
- Branch: `RGv4`, initially up to date with `origin/RGv4`.
- Initial status: no tracked changes; six existing untracked assets listed below were preserved.
- Initial five commits: `78273c0` Apply RGv4 post-audit homepage and background corrections; `a0aaff0` Merge production history into reviewed RGv4 release; `18f6f5c` Develop RGv4 circuit design and publishing resources; `230f55d` Update R&G site hierarchy, resources, and page refinements; `034e619` Update mailing list and social sharing.

## Corrections

1. In `rgv4.css`, `.collaborations-stage::before` opacity increased from `.12` to `.16`; the existing `max-width: 850px` override increased from `.09` to `.12`. Image, grayscale, crop, position and masks remain unchanged. `assets/music-rehearsal.jpg` SHA256 remains `0D338B82F23B3A48BBC399D66D3910F214F4EB709B32E35F05E85AA33A6BF8D2`.
2. Artists & Collaborations now contains an extensible Artists roster section with Mike’s Wilson identity, existing Unheard3 performance image and descriptive alt text, concise description, and a direct artist-page link. The detailed artist page retains recordings, video, social, booking and payment links at its existing canonical URL. The redundant Artists intermediary is gone from normal navigation; the removed Music & Recordings button on Artists & Collaborations was not restored.
3. The obsolete `/music-media/artists-collaborations/music/` route redirects to Artists & Collaborations. Its fallback HTML has a destination canonical, `noindex,follow`, refresh, accessible link and the existing redirect script. The older `/music/` fallback also goes directly there, avoiding a chain. Config, sitemap, generated navigation, Mike’s Wilson breadcrumbs/schema and back-link reflect the shorter hierarchy.
4. Jenny & The StreetWalkers image, presentation and See project link were removed from the Web Development landing page. Its unused `proof-inline` CSS was removed. Jenny remains in Portfolio and its project page; assets are untouched.
5. The existing contact-strip immediately follows Services & Digital Support and contains the exact heading “Let’s talk.”, View Portfolio, and the existing Start a project action. Duplicate contact placement was removed. Existing fragment anchors remain. Services now stack below 950px to avoid a cramped tablet text column beside the 480px guide.

## Navigation and hosting details

The checked-in baseline still generated duplicate Overview dropdown entries. These were removed in the shared generator to satisfy the requested final navigation. Parent labels remain page links at mobile widths; adjacent chevrons retain submenu control. Desktop hover, keyboard, ArrowDown and Escape handling remain.

The existing `_redirects` generator emitted Netlify-style `301!`. It now emits numeric `301`, suitable for the current Cloudflare Pages host. This follows [Cloudflare’s redirect-file format](https://developers.cloudflare.com/pages/configuration/redirects/). No hosting infrastructure was added.

## Validation

- `node scripts/check-site.cjs` passes: 17 canonical pages, 10 legacy pages; navigation/metadata/sitemap synchronization, case-sensitive paths, fragments, labels, forms and JavaScript syntax.
- Added regression checks for legacy fallback destinations/canonicals/noindex, stale obsolete-route links, duplicate Overview links, redirect status syntax and Contact endpoint.
- Artists & Collaborations inspected at 1440, 1024, 768 and 390px: readable subdued background, direct roster presentation, mobile stacking, no horizontal overflow or broken images.
- Web Development inspected at the same widths; final tablet screenshot confirms a coherent single-column services group. Additional 320px DOM measurement found no horizontal overflow.
- Desktop submenu Enter/Escape and focus checked. Mobile chevron keyboard activation exposes the submenu; parent Music & Media link reaches its landing page. Detailed artist navigation and revised breadcrumbs/back-link checked.
- Old Artists fallback reaches Artists & Collaborations locally. Actual HTTP 301 behavior requires a future hosted deployment; Python preview does not process `_redirects`. Query/hash preservation was not established in the browser fallback check.
- Preview console checks returned no warnings/errors. No missing images on the checked roster page.
- Reduced-motion CSS rules were inspected and retained; new background/roster treatment adds no animation. Browser motion-preference emulation was unavailable, so a fresh emulated reduced-motion run was not performed.
- Homepage, Contact, Resources/article/reference, Portfolio index and Jenny project main content compared equal to HEAD. Form/media-handler code after the navigation block also compared equal to HEAD.
- All retained form markup compared equal to HEAD. Contact endpoint remains `https://formspree.io/f/mjykralg`; mailing-list endpoint remains `https://formspree.io/f/mljdnpzl`. No forms submitted. The obsolete intermediary’s form disappears with that page’s redirect replacement.

## Files and final working state

27 tracked files modified:

```text
_redirects
about/index.html
app.js
contact/index.html
index.html
music-media/artists-collaborations/index.html
music-media/artists-collaborations/music/index.html
music-media/artists-collaborations/music/mikes-wilson/index.html
music-media/index.html
music-media/publishing/index.html
music/index.html
resources/articles/index.html
resources/index.html
resources/reference/index.html
resources/what-is-music-publishing/index.html
resources/what-the-mlc-actually-does/index.html
rgv4.css
scripts/check-site.cjs
scripts/sync-site.cjs
site.config.json
sitemap.xml
web-development/index.html
web-development/portfolio/afterfall/index.html
web-development/portfolio/index.html
web-development/portfolio/jenny-and-the-streetwalkers/index.html
web-development/portfolio/yeschef/index.html
webdev/systems.css
```

Unrelated canonical-page edits are generated navigation changes. This report is a new untracked file. Six pre-existing untracked assets remain:

```text
assets/Joanie.png
assets/RG_Article_01_What_the_MLC_Actually_Does_v2.docx
assets/SongOut.png
assets/loa.png
assets/proMlcImg.png
assets/writVpub.png
```

No commits, merges, pushes or deployments performed. Ready for owner review. The retained detailed Mike’s Wilson page is intentional: the roster is consolidated into Artists & Collaborations while specialist artist content keeps its established URL. Visual review of the subtle opacity increase and CTA placement remains the owner’s decision; hosted redirect verification remains pending any separately authorized deployment.
