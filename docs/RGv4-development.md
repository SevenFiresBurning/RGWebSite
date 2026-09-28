# RGv4 development and owner review

Prepared September 28, 2026. Local development only; no commit, push, merge, or deployment was performed.

## Verified source and branch

- Repository: `C:\Users\resis\OneDrive\Desktop\R&G\RGv3`.
- Remote: https://github.com/SevenFiresBurning/RGWebSite.git.
- Source branch: local `main`.
- Development branch: `RGv4`, created in the same repository.
- Source commit: `034e619b942f4a9dace91755de0d8a08b98b02be`.
- GitHub `main` at the source check: `230f55d687b936a15231e8dad0ddc4378c8a75c2`.
- The local history differs from GitHub. After that discrepancy was reported, the owner explicitly confirmed that the current RGv3 working files, including existing modified and untracked work, are authoritative for this branch. They were carried forward without resetting or synchronizing the checkout.
- Branch creation initially encountered sandbox Git metadata permissions and succeeded with approved escalation.
- Other R&G repositories were found at `Documents\Codex\2026-09-15\wh\work\rg-publish` (HEAD `21bfd36`) and `rgv3-support\site` (HEAD `fde49b0`). Both point to the same remote. Nearby older folders include `RGv2`, `Resistance-and-Ground`, and several temporary R&G work folders. None were modified.
- Jenny & The StreetWalkers was referenced only through R&G's existing portfolio entry and assets. Its repository was not edited.

## Initial modified and untracked state

These changes predated this development pass; they must not be mistaken for new RGv4 edits.

Modified tracked files:

```text
README.md
about/index.html
app.js
contact/index.html
index.html
mailing-list.css
music/index.html
music/mikes-wilson/index.html
netlify.toml
production/index.html
production/music-publishing.html
production/publishing/artists/index.html
production/publishing/example-deals.html
production/publishing/index.html
projects/index.html
robots.txt
style.css
webdev/index.html
```

Previously deleted: `assets/music-portrait-bw.jpg`, `assets/music-portrait-light.jpg`.

Untracked at entry:

```text
_headers
_redirects
assets/RG_Article_01_What_the_MLC_Actually_Does_v2.docx
assets/SongOut.png
assets/Swilson.JPEG
assets/YesChefWeb.png
assets/afterFallLogo.png
assets/mlcImage.png
assets/music-portrait-bw.png
assets/music-portrait-light.png
assets/proMlcImg.png
assets/writVpub.png
docs/
legacy-redirect.js
music-media/
resources/
rgv4.css
scripts/
site.config.json
sitemap.xml
web-development/
```

## Article sources and artwork

| Article | Source document | Artwork | Result |
| --- | --- | --- | --- |
| What the MLC Actually Does | `assets/RG_Article_01_What_the_MLC_Actually_Does_v2.docx` | `assets/mlcImage.png` | Added at `/resources/what-the-mlc-actually-does/` |
| PRO vs. MLC: What Each One Handles | Not supplied | `assets/proMlcImg.png` | Not fabricated; awaiting source |
| Writer Share vs. Publisher Share | Not supplied | `assets/writVpub.png` | Not fabricated; awaiting source |

The three image pairings are supported by the visible lettering in the supplied artwork. `SongOut.png` was also present but was not assigned to an article by guesswork. No source document was deleted or edited. No artwork was generated or replaced.

All 46 DOCX paragraphs were checked against the output: title and subtitle are in the article heading, the supplied index summary is in the listing, and the body paragraphs, lists, disclaimer, and sources are retained. Word Heading 1 sections become HTML h2 elements beneath the page's single h1. HTML escaping and line-break markup preserve the actual text. No article prose was rewritten for marketing.

The source also mentions Publishing vs. Distribution, the two missing articles, and an MLC / PRO Registration Tracker. None of those source documents/downloads was supplied. Their descriptions remain plain text, accompanied by separate availability notes; they are not represented as working links or downloads. Owner review should confirm this interim treatment before eventual publication.

## Design and page changes

- **Electrical vocabulary:** small, reusable inline schematic resistor/ground marks; thin connecting rules; restrained terminal nodes. The original typography, imagery, watermarks, and blue/white text shimmer remain.
- **CTA system:** shared `.button` and mailing-list submit controls have an open contact lead at rest. Hover, keyboard focus, and press close the contact. A warm, subtly filled `.button--primary` identifies the main next step; discovery actions and plain links remain quieter. Motion lasts 450 ms and never delays navigation. No fake toggle roles or states were added.
- **CTA hierarchy:** homepage contact, Music & Media contact, Artists exploration, artist-page video, Publishing contact, Web Development project inquiry, Resources article browsing, live Jenny website, About contact, Contact submission, and article related browsing have explicit primary treatments. Listings and unfinished project detail pages keep quieter browsing choices rather than inventing commercial actions. No page has more than one primary CTA inside `main`.
- **Homepage:** three visitor routes now appear after the hero and before Featured: music/release work, websites, and publishing questions. Existing Featured and Mike Wilson identity content remain. Actual work follows: Jenny's live website project, Mike's Wilson, and the new MLC article. One primary contact step closes the page.
- **Proof placement:** Web Development gains a compact Jenny project reference near its capability copy, without restoring the removed full portfolio preview. Music & Media gains direct Mike's Wilson and MLC reading links. Publishing gains a compact reading list and loses two repetitive teasers pointing to the same article.
- **Web Development:** atmospheric systems video and Services & Digital Support remain. View Portfolio stays immediately beneath its lead-in paragraph at desktop and mobile widths. YesChef and AfterFall remain In Development; Jenny remains a live client website. No Tetrapod proof was invented.
- **AfterFall:** the existing transparent logo remains; a muted connecting line, two nodes, a small schematic mark, and a matching contact accent provide a subordinate component treatment. No grid illustration or new animation.
- **Music & Media / Artists:** verified Artists hierarchy, preserved `/music/` URL segment, Explore Artists and Visit artist page wording, Mike’s Wilson identity, three-image Unheard slideshow and positioning, production reel source, and sound toggle. The sound control has an opaque surface for contrast and sits at the top right on small screens to avoid overlapping the existing caption.
- **Contact:** original portrait, watermark, required `-select-` placeholder, query preselection, fields, validation, and submission handler remain. Only its CTA presentation changes.
- **Payment identity:** the personal Venmo link was removed from the R&G homepage. It already existed on Mike's Wilson, so it was retained there with the explicit accessible label “Support Mike’s Wilson on Venmo.” No confirmed R&G PayPal URL was supplied; no PayPal link or implied destination was added.
- **Navigation:** shared generated hierarchy includes the new article. The Resources dropdown now aligns to its right edge on desktop, fixing overflow at 951 and 1024 pixels. Existing desktop, mobile, keyboard, and no-JavaScript navigation behavior is preserved.
- **Documentation:** README's outdated transparent-artwork limitations were corrected. Both portrait PNGs and `afterFallLogo.png` were verified to contain alpha transparency. The existing Swilson JPEG remains in its existing editorial placements.

## Reusable article authoring

The site remains static HTML/CSS/JavaScript, without new production dependencies, frameworks, animation libraries, or a CMS.

1. Retain the supplied original document and artwork.
2. Add body-only semantic HTML under `resources/article-content/`. Preserve supplied prose, use h2 for main sections, and keep relative body links appropriate to the output page location.
3. Add a page in `site.config.json` with its canonical output path, title, description, image, parent `resources/articles/index.html`, optional supplied listing `summary`, and an `article` object containing `content`, `intro`, optional `source`, and `related` page paths. Add image dimensions and alt text to `images`.
4. Run `node scripts/sync-site.cjs`, then `node scripts/check-site.cjs`.
5. Compare the rendered prose against the source and review desktop/mobile output.

`scripts/templates/article.html` owns the common article shell. `scripts/article-layout.cjs` renders that shell, the article's semantic wrapper, related reading, and a shared article-card pattern. Both existing and new articles use it. Shared article styling stays in `resources/resources.css`; no per-article CSS blocks were added.

Do not hand-edit generated article pages or generated listing markers. The generator also continues to own navigation, breadcrumbs, metadata, redirects, and sitemap. Body source and template paths have Netlify noindex/plain-text headers so they do not become competing article pages.

## SEO and Reference verification

- New canonical page, descriptive title/description, OG article type, social artwork/alt/dimensions, Twitter metadata, Article schema, breadcrumbs, and sitemap entry.
- Article schema selection now follows article configuration rather than a hard-coded filename. No publication dates, qualifications, affiliations, or guarantees were invented.
- New article is reachable through Resources, Articles, shared navigation, related reading, homepage proof, and relevant Music & Media/Publishing links.
- The seven existing Reference organizations, descriptions, and same-tab destinations were retained. Only generated navigation changed on that page.
- First-party destinations were checked: [Copyright Office](https://www.copyright.gov/engage/musicians/), [BMI](https://www.bmi.com/creators), [SESAC](https://www.sesac.com/frequently-asked-questions/), [The MLC](https://www.themlc.com/how-it-works), [Songfile](https://www.songfile.com/faq), and [SoundExchange](https://www.soundexchange.com/digital-performance-royalties/) were readable. [ASCAP](https://www.ascap.com/) returned HTTP 403 to automated access; its official URL remains unchanged.
- All five external source URLs supplied in the MLC article were readable during the check and retained in the article.

## Validation performed

- `node scripts/sync-site.cjs`: passed.
- `node scripts/check-site.cjs`: passed for 18 canonical pages and 9 legacy pages; generated consistency, exact-case local paths, fragments, titles, forms, and JavaScript syntax. The checker now also validates shared article body inclusion, Article schema, OG type, article listing membership, and retained source paths.
- Headless Microsoft Edge: all 18 canonical pages at 320, 390, 768, 1024, and 1440 px, totaling 90 final layout checks. All page images were explicitly loaded and decoded. No missing images, horizontal overflow, or page JavaScript errors were found.
- Keyboard navigation: menu/submenu opening, Tab navigation, Escape, and open-menu overflow at 320, 768, 950, 951, 1024, and 1440 px. Passed after the dropdown fix.
- CTA feedback: contact closure, visible 3 px keyboard outline, targets of at least 44 px, and immediate static feedback under reduced motion. Artist card keyboard focus also closes its visual contact. High-contrast mode has explicit system-color borders.
- No-JavaScript navigation was checked at 320 px, including access to the new article.
- Contact: native validation, neutral initial category, valid and invalid query categories, duplicate-submit protection, mocked success/reset and re-enabled button. Failure/mailto draft behavior was verified with the actual handler in an isolated location stub, preventing an email app from opening.
- Mailing list: consent validation, duplicate-submit protection, mocked success/reset and failure. No live Formspree submissions were sent.
- Reel sound toggle and the retained three-image slideshow were checked. Reel control/caption separation was checked at 320, 390, 768, and 1024 px after its mobile placement refinement.
- Every original asset and the existing `app.js`, `mailing-list.js`, and `webdev/systems.js` matched the entry snapshot by SHA-256. The supplied DOCX and artwork are unchanged.
- Visual screenshot review covered desktop/mobile homepage routing and proof, article listing, article heading/art/body/related reading, Contact, Web Development, AfterFall, reel, and the open intermediate-width navigation.

Browser QA helpers, screenshots, and the entry snapshot are outside the website in the task's temporary review folder. They are not website deliverables or production dependencies.

## Files created in this pass

```text
docs/RGv4-development.md
resources/article-content/what-is-music-publishing.html
resources/article-content/what-the-mlc-actually-does.html
resources/what-the-mlc-actually-does/index.html
scripts/article-layout.cjs
scripts/templates/article.html
```

## Files modified relative to the confirmed working files

```text
README.md
_headers
about/index.html
contact/index.html
index.html
music-media/artists-collaborations/index.html
music-media/artists-collaborations/music/index.html
music-media/artists-collaborations/music/mikes-wilson/index.html
music-media/index.html
music-media/publishing/index.html
resources/articles/index.html
resources/index.html
resources/reference/index.html
resources/resources.css
resources/what-is-music-publishing/index.html
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
```

Some pages in this list changed only because shared navigation now includes the new article. No existing files were removed in this pass.

## Remaining dependencies and owner review

- Supply the PRO vs. MLC and Writer Share vs. Publisher Share article documents before those pages can be added.
- Confirm an R&G PayPal destination before a homepage payment control can be implemented.
- Review the new homepage routing copy, restrained warm primary CTA treatment, and the MLC availability notes for unpublished related articles/downloads.
- Publishing vs. Distribution and the suggested tracker remain unavailable. They were referenced by the supplied MLC source, not added as extra deliverables.
- Safari, physical-device testing, hosted redirects/headers, and production deployment were not verified in this local pass. ASCAP needs manual verification because of its automated-access block.
- Changes are uncommitted on `RGv4`, ready for local owner review. The local history still intentionally differs from GitHub's production history. Any future commit, synchronization, merge, push, or deployment needs the owner's explicit authorization.

Local preview used for this pass: `http://127.0.0.1:59746/`. Its availability depends on the running preview process.

## Homepage circuit follow-up

The routing links now sit on a connected resistor/switch line ending at ground. The line follows the three columns on desktop and the stacked links on mobile. Switches start open and close on hover, keyboard focus, or press; activating a link starts one five-second left-to-ground signal sweep. Navigation remains immediate. The original small component lines remain and now carry the same five-second signal, with a brief ground light on arrival. Reduced-motion users receive static connection feedback.

Implemented in homepage-only `home-circuit.css` and `home-circuit.js`, referenced by `index.html`. Checked at 320, 390, 768, 1024, and 1440 px, including switch hover/focus, five-second animation timing, reduced-motion behavior, JavaScript errors, and horizontal overflow. No commit, push, merge, or deployment.

## Sitewide component-line extension

The circuit assets have since been generalized for all 18 canonical pages (their existing filenames are retained). The shared generator adds responsive resistor-to-ground lines after breadcrumbs and at the end of main content on interior pages; the homepage keeps its existing connected routing treatment. Each line carries one five-second signal followed by a ground light. Small existing schematic marks, including AfterFall's, share the signal treatment. Reduced motion leaves static lines. Decorative SVGs are hidden from assistive technology and do not intercept input; the static generated traces also remain available without JavaScript. Legacy redirect pages retain their minimal redirect behavior.
