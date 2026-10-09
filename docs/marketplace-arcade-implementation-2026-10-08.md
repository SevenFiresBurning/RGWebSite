# Marketplace & Arcade implementation — 2026-10-08

## Latest refinement (supersedes earlier Portfolio and missing-card notes)

Homepage access: the former AfterFall moving-parts card is now “Galleries,” retaining AfterFall artwork and linking directly to Marketplace and Arcade. Web & Systems gallery entrances now display actual Bright Desk and HatGame preview artwork, with clickable images and entrance buttons. Existing checks pass with the new homepage card order. Browser QA verified the homepage Marketplace destination and both entrance images without broken assets or horizontal overflow. These latest artwork/homepage changes remain local pending a further push request.

### Demo escape controls

Every local demo HTML page (including Bright Desk subpages) and HatGame now includes a sticky “Back to R&G” bar, outside the demo app root. It returns to Marketplace or Arcade. Escape activates the same destination; Enter/click on the normal link also works. Shared scoped styling and script live in `web-development/demo-return.css` and `web-development/demo-return.js`. Repeat `node scripts/add-demo-return.cjs` after rebuilding/copying demos. The demo checker now requires the return bar on every HTML file and syntax-checks its shared JS. Original source projects remain untouched.

Apple Escape return, HatGame click return, Frankie Enter return and Bright Desk click return were verified in the browser. J&S opens in a separate tab so the R&G gallery remains available. No commit, push or deployment performed.

The user authorized using J&S in place of Burgundy Cabaret, removing Portfolio, and placing gallery entrances on Web & Systems. Marketplace now shows Jenny & The StreetWalkers with existing `assets/band.webp` artwork and a direct link to `https://www.jennyandthestreetwalkers.com/`. The actual production homepage loaded successfully from that gallery link in browser QA.

Portfolio is removed as a public section: navigation, About's entrance, project breadcrumbs and back links no longer present the Portfolio label. The old overview and `/projects/` redirect directly to Marketplace, using existing Cloudflare redirects and local HTML fallback. Individual project URLs/content are retained under Web & Systems and excluded from the menu through `navigation: false` in page configuration. The generator respects this flag.

Web & Systems has an “Explore the galleries” section with Enter Marketplace and Enter Arcade buttons, before YesChef. Existing service content remains intact. Desktop/mobile navigation and keyboard activation were checked, both gallery entrances were followed, and the old Portfolio overview fallback was verified. Current check totals: **19 canonical pages and 10 legacy pages**, plus 19 isolated demo/game production files. No commit, push or deployment performed. Entrance screenshot: `docs/qa/web-systems-gallery-entrances.jpg`.

## Environment and scope

- Repository: `C:\Users\resis\OneDrive\Desktop\R&G\RGv3`
- Remote: `https://github.com/SevenFiresBurning/RGWebSite.git`
- Branch: `main`. The user explicitly authorized implementing on the latest merged main instead of switching to RGv4.
- Hosting remains local development → GitHub → Cloudflare Pages. No Netlify configuration or hosting changes were introduced.
- Local implementation only. No commit, push, or deployment performed.
- Initial modified files and eight untracked assets were retained. Existing Portfolio pages, forms, article bodies, service content, and original project sources were preserved.

## Original projects

| Project | Original absolute source path | Framework / entry | Integration |
| --- | --- | --- | --- |
| Bright Desk | `C:\Users\resis\OneDrive\Desktop\bright-desk-template` | Static HTML/CSS/JS; `index.html`, `styles.css`, `script.js`; no package dependencies | Nine necessary production files copied to `web-development/marketplace/demos/bright-desk/` |
| Apple & Chalk | `C:\Users\resis\OneDrive\Desktop\apple-and-chalk-template` | React 18.3, TypeScript 5.7, Vite 6; `index.html` → `src/main.tsx`; React Vite plugin in original config | Production build under `web-development/marketplace/demos/apple-and-chalk/` |
| Burgundy Cabaret | **Not located** | Cannot establish entry, framework, assets, or completeness without source | Explicit unavailable card; no invented preview or nonworking demo link |
| Frankie’s Franks | `C:\Users\resis\Documents\Codex\2026-08-08\i-n\frankies-franks-template` | React 18.3, TypeScript 5.7, Vite 6; `index.html` → `src/main.tsx`; React Vite plugin in original config | Production build and real `frankie-mascot.png` under `web-development/marketplace/demos/frankies-franks/` |
| HatGame / Hat Rack Rhythm | `C:\Users\resis\OneDrive\Desktop\HatGame\hat-rack-rhythm` | Static `index.html`, `styles.css`, `game.js`; no package dependencies; CSS artwork and Web Audio sound | Three necessary production files copied to `web-development/arcade/games/hatgame/` |

Burgundy searches covered OneDrive Desktop, Documents (including Codex workspaces), OneDrive, `.codex`, and Downloads, using variations in names and content. Some obsolete video-tools paths were inaccessible. Cabaret-related J&S content and a stage image were found, but these are not a Burgundy Cabaret source project and were not substituted.

Bright Desk and Apple & Chalk use CSS illustration/sample artwork. Their gallery previews are actual browser screenshots, not invented artwork. Frankie uses its original mascot. HatGame uses a screenshot of its original game.

## Files and architecture

- Added `web-development/marketplace/index.html` and `web-development/arcade/index.html` using the existing R&G page shell, breadcrumbs, typography, forms, circuit details, header/footer and responsive navigation.
- Added `web-development/gallery.css`: two-column gallery, single-column narrow layout, uncropped thumbnail display and existing design tokens. No immersive theme or new animation system.
- Added four real screenshots in the galleries’ `previews/` directories, with actual intrinsic image dimensions.
- Added the isolated demo/game production directories listed above: 19 production files total. No dependency folders, source maps, environment files, caches or credentials copied.
- Updated `site.config.json` with Marketplace and Arcade under Web & Systems, preserving the existing approved public service label and Portfolio hierarchy.
- Regenerated navigation across all canonical pages and updated `sitemap.xml`. Existing page bodies remain unchanged; generated navigation changes account for the related existing-page diffs. `_redirects` remains generated and retains its existing rules; no original URLs changed.
- Updated `_headers` with `X-Robots-Tag: noindex, follow` for both demo/game trees. Demo HTML also has `noindex,follow`. Removed sample canonical URLs from copied HTML to avoid competing with the original sample brand names.
- Added `scripts/check-gallery-demos.cjs` to check copied HTML/CSS links, exact asset-path casing, bundled image literals, JS syntax, noindex metadata and excluded development files.
- Added visual QA captures: `docs/qa/marketplace-gallery.jpg`, `docs/qa/arcade-gallery.jpg`.

Demo pages are standalone documents. Their styles and scripts do not enter the shared R&G page scope.

## Build details

Both React builds used the installed Vite 6.4.4 API and original source roots, with these settings:

```js
await build({
  configFile: false,
  root: originalSourcePath,
  base: '/web-development/marketplace/demos/' + slug + '/',
  esbuild: { jsx: 'automatic' },
  build: { outDir: absoluteProductionDirectory, emptyOutDir: false }
});
```

`build` was imported from each source project's installed `node_modules/vite/dist/node/index.js`. The original Vite config only supplied the React plugin; automatic JSX transformation builds these projects without editing their configs. CLI/config resolution hit Windows sandbox restrictions, so the successful build ran with approved execution outside the sandbox. No new dependencies were installed. Each build transformed 28 modules and completed successfully.

Post-processing of copied output:

- Frankie’s compiled root image literals `/frankie-mascot.png` were changed to `/web-development/marketplace/demos/frankies-franks/frankie-mascot.png`.
- Copied HTML received noindex metadata and sample canonical removal.
- React apps retain their original hash routing, avoiding conflicts with Cloudflare path routing.
- Static sites retain relative file links. HatGame JS and CSS are byte-identical to their original files; its HTML changes only concern search metadata.

Rebuilding later must repeat those output-only metadata and mascot adjustments. Original sources remain in their original directories.

## Checks performed

Passed:

```text
node scripts/sync-site.cjs
node scripts/sync-site.cjs --check
node scripts/check-site.cjs
node scripts/check-gallery-demos.cjs
```

- Existing site checker: 20 canonical pages, 9 legacy pages; exact-case paths, internal links/fragments, metadata, labels, forms, JS syntax, article body preservation and redirect rules.
- Demo checker: all 19 production files, HTML/CSS links, compiled image asset paths, JS parsing and excluded development files.
- Original Apple & Chalk and Frankie TypeScript checks: installed `typescript/bin/tsc --noEmit --incremental false -p <original tsconfig.json>` passed for both.
- Browser desktop and narrow/mobile layouts tested on galleries and all four demos. The mobile viewport override was 390×844; the browser's zoom produced a 328-CSS-pixel layout, exercising an even narrower breakpoint. No horizontal overflow or broken image elements observed. The temporary override was reset.
- R&G mobile main menu, Web & Systems submenu, Marketplace/Arcade destinations and desktop submenu verified. Enter opens submenu buttons and follows gallery links.
- Bright Desk resource navigation and search tested: “Grammar” reduced the library to one card.
- Apple & Chalk resource route, Reading category filter (one result), and Reading Response Toolkit detail route tested.
- Frankie desktop menu route and mobile bottom Menu navigation tested; Spicy filter showed only The Firehouse. Both mascot instances loaded.
- HatGame loads, starts by click and Enter, advances timer/web accumulation, pauses/resumes, restarts and toggles sound. Its faded start overlay correctly uses opacity 0 and pointer-events none during play. Original controls and gameplay code preserved. A pointer input was exercised; a complete scoring run and all ten difficulty levels were not certified.
- No warning/error console entries observed in the tested browser sessions.
- Static output and existing Cloudflare `_headers`/`_redirects` syntax checked locally. A remote Cloudflare deployment was intentionally not performed.

## Known issues / review points

1. Burgundy Cabaret needs its original project folder before a genuine preview/demo can be integrated.
2. Demo content retains source sample pricing, fictional identities, placeholder marketplace/social links and demo-only forms. These are disclosed on Marketplace and are not production commerce or connected client forms.
3. HatGame scoring is pointer-only in the original source. Keyboard navigation/start/control activation works, but keyboard scoring is not implemented. This integration deliberately preserves the game instead of redesigning it.
4. Web Audio sound toggle and browser behavior were tested; audible output was not independently certified.
5. Rebuilds depend on the original external local source folders; the production bundles in R&G do not replace those sources.

## Local preview URLs

- Marketplace: `http://127.0.0.1:59750/web-development/marketplace/`
- Arcade: `http://127.0.0.1:59750/web-development/arcade/`
- Bright Desk: `http://127.0.0.1:59750/web-development/marketplace/demos/bright-desk/`
- Apple & Chalk: `http://127.0.0.1:59750/web-development/marketplace/demos/apple-and-chalk/`
- Frankie’s Franks: `http://127.0.0.1:59750/web-development/marketplace/demos/frankies-franks/`
- HatGame: `http://127.0.0.1:59750/web-development/arcade/games/hatgame/`

Preview server: Python HTTP server bound to localhost port 59750. Production uses the same static relative/base paths beneath `https://resistanceandground.com`.

## Git review state

Working on `main`, with uncommitted changes. Existing tracked HTML navigation changes span the 18 pre-existing canonical pages; `_headers`, `site.config.json`, and `sitemap.xml` have substantive updates. `_redirects` was already marked modified at entry and its generated content has no substantive diff.

New files are the two gallery trees, shared gallery CSS, demo checker, this report, and QA captures. The eight pre-existing untracked assets remain untouched: `Joanie.png`, `RG_Article_01_What_the_MLC_Actually_Does_v2.docx`, `SongOut.png`, `image2-sharp.png`, `image2.png`, `loa.png`, `proMlcImg.png`, and `writVpub.png` under `assets/`.

No files were staged. No commit, push or deployment was made. Review before authorizing GitHub/Cloudflare publication.
