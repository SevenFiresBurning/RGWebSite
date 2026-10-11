# Built by R&G implementation — October 10, 2026

## Repository and scope

Repository: `C:\Users\resis\OneDrive\Desktop\R&G\RGv3`, remote `SevenFiresBurning/RGWebSite`. Active branch is `main`, following the user's earlier instruction to implement on the latest merged main. Baseline commit: `cdde670`. No commit, push, or deployment performed. Existing GitHub/Cloudflare configuration retained; no Netlify infrastructure added.

The dependency-free generator is `scripts/sync-site.cjs`, driven by `site.config.json`. It generates shared navigation, breadcrumbs, metadata, sitemap and Cloudflare `_redirects`.

## Sources discovered

| Entry | Local source | Implementation |
| --- | --- | --- |
| Jenny & The StreetWalkers | `C:\Users\resis\OneDrive\Desktop\J&S\Jenny-The-StreetWalkers` | Existing approved `assets/band.webp`; direct live client domain verified in browser |
| Teacher Basic | `C:\Users\resis\OneDrive\Desktop\bright-desk-template` | Static HTML/CSS/JS; existing isolated production copy retained |
| Apple & Chalk | `C:\Users\resis\OneDrive\Desktop\apple-and-chalk-template` | React 18, TypeScript 5, Vite 6; existing production bundle retained |
| Frankie's Franks | `C:\Users\resis\Documents\Codex\2026-08-08\i-n\frankies-franks-template` | React/TypeScript/Vite; fictional restaurant concept, existing production bundle retained |
| Hat Rack Rhythm | `C:\Users\resis\OneDrive\Desktop\HatGame\hat-rack-rhythm` | Static HTML/Canvas game, existing production copy retained |
| Urine Trouble | `C:\Users\resis\OneDrive\Desktop\UrineTrouble` | Buildless Canvas prototype; existing supplied standalone game retained |

The standalone Urine Trouble build originally supplied is `C:\Users\resis\Documents\Codex\2026-10-08\files-pasted-by-the-user-build\outputs\Ur inTrouble-world-scaled.html`. Original project directories were not modified. Burgundy Cabaret was not located and is outside the approved public lineup; no placeholder was added.

## Routes and integration

Created `/web-development/built-by-rg/`, `/web-development/built-by-rg/market/`, and `/web-development/built-by-rg/arcade/`.

Homepage now contains Featured Client Work (J&S retained) followed by a substantial Built by R&G section with real imagery and two entrances. Web & Systems has a corresponding permanent section; YesChef, service information and inquiry links remain intact. About and generated navigation use the new identity.

Market order: J&S, Teacher Basic, Apple & Chalk, Frankie's Franks. Arcade order: Hat Rack Rhythm, Urine Trouble. Template/concept/prototype classifications are explicit. J&S links directly to `https://www.jennyandthestreetwalkers.com/`.

Old Marketplace and Arcade overview URLs redirect to their respective new collections. Old Portfolio overview and Projects routes redirect to Built by R&G. Individual Portfolio detail pages remain. Legacy HTML fallback redirects were tested locally; Cloudflare 301 rules were generated but have not been deployed.

Demo/game URLs remain stable under the existing Marketplace/Arcade directories. Their return bars now lead directly to the new canonical collections. Compiled demos already have working subdirectory asset paths, so no new bundle build was needed. They remain isolated from R&G styles except the established return bar. Original game mechanics are unchanged. Urine Trouble Escape continues to pause rather than exit; its explicit return link exits.

Future rankings, three-character initials and The Wall appear only as clearly upcoming text. No submissions or backend were implemented.

## Modified files

- New three HTML pages under `web-development/built-by-rg/`.
- `index.html`, `web-development/index.html`, `about/index.html`, and `web-development/gallery.css` for entrances, labels and responsive layout.
- `site.config.json`, `_redirects`, `sitemap.xml`, and generated shared navigation/metadata in existing canonical HTML pages.
- Legacy overview HTML at `projects/`, `web-development/portfolio/`, `web-development/marketplace/`, `web-development/arcade/`.
- Return links in seven Teacher Basic HTML pages, Apple & Chalk and Frankie's Franks entry HTML, and both game entry HTML files.
- `scripts/add-demo-return.cjs` and `scripts/check-site.cjs` updated for the new hierarchy.
- This report and `docs/qa/built-by-rg-desktop.jpg`.

## Executed verification

- `node scripts/sync-site.cjs`: passed.
- `node scripts/sync-site.cjs --check`: passed.
- `node scripts/check-site.cjs`: passed, 20 canonical and 12 legacy pages; navigation, paths, fragments, metadata, forms and JavaScript syntax.
- `node scripts/check-gallery-demos.cjs`: passed, 20 production files; links, assets, syntax, noindex and excluded development files.
- Apple & Chalk and Frankie's Franks source TypeScript checks (`--noEmit --incremental false`): passed.
- Standalone Urine Trouble inline JavaScript syntax: passed.
- `git diff --check`: passed.
- Browser: homepage and new collection entrances; correct Market/Arcade content; Teacher Basic resource search; Apple & Chalk resource filtering; Frankie's Franks menu filtering; Hat Rack Rhythm start/pause; Urine Trouble start/movement/pause; all return bars; J&S live homepage; old Market/Arcade fallback redirects; Web & Systems collection section; keyboard submenu opening with ArrowDown and closing with Escape. No captured console warnings/errors during these checks.
- Responsive one-column rules, focus outlines and existing reduced-motion CSS/JS audited. No new animations introduced. Desktop screenshot inspected and saved.

## Known issues and remaining verification

Urine Trouble's original `checks.cjs` fails its speed assertion after five seconds (`speed >= 16 && speed < 20`). The existing game is playable in the tested start/movement/pause flow, but a full-run balance/public-release review remains necessary. It is labelled a playable prototype with ongoing balancing; this pass does not fix its mechanics.

The in-app browser viewport API did not apply the requested 390 × 844 viewport. Mobile layouts and mobile menu behavior therefore have not been fully verified in-browser in this pass. Desktop keyboard navigation passed; responsive and reduced-motion source rules were inspected, not emulated. The temporary viewport override was reset. Repeat phone testing in a browser with working viewport controls before deployment.

Recommended next steps: review the local pages, finish phone/touch verification, and separately review Urine Trouble balance. GitHub push and Cloudflare deployment require a subsequent user instruction.

## Working-tree preservation

Changes remain uncommitted on main. Existing untracked `assets/Joanie.png`, `assets/RG_Article_01_What_the_MLC_Actually_Does_v2.docx`, `assets/SongOut.png`, `assets/image2-sharp.png`, `assets/image2.png`, `assets/loa.png`, `assets/proMlcImg.png`, `assets/writVpub.png`, and `docs/qa/demo-return-mobile.jpg` were preserved and not staged. No original source folders or unrelated content were deleted.
