# Distribution Is Not Publishing — local integration, October 19, 2026

## Result and files

Route: /resources/articles/distribution-is-not-publishing/ . Integrated locally on RGv4 through the existing Resources article template/generator. No commit, push, deployment, Cloudflare or external-account changes.

New task files:
- resources/article-content/distribution-is-not-publishing.html — supplied article, semantic headings/list/checklist/source anchors and educational disclaimer.
- resources/articles/distribution-is-not-publishing/index.html — generated article page.
- assets/distribution-is-not-publishing-source.png — byte-identical approved Downloads image; original retained.
- assets/distribution-is-not-publishing.jpg — optimized 1733×908 JPEG, 586,459 bytes, proportional unaltered composition; used for article/listing/social. JPEG chosen for broad social-platform compatibility. Source PNG is 3,114,140 bytes, so the served derivative is approximately 81% smaller.
- docs/distribution-is-not-publishing-2026-10-19.md — this report.

Existing files changed by this task only: site.config.json, resources/index.html, sitemap.xml. All earlier Refinement Pass 2 work preserved. Shared article framework/styles not modified. All 193 other previously tracked files byte-preserved relative to a snapshot taken before article configuration/generation, including Mike’s Wilson, homepage circuit, Arcade, AfterFall and existing articles.

## Copy and artwork integrity

Source: C:\Users\resis\.codex\attachments\334fdb1a-eb1d-46d4-af29-9091ac43c311\Pasted text.txt . Body from “You finished the recording…” through the educational disclaimer is preserved verbatim after removing HTML and normalizing whitespace. Includes the supplied conclusion, source labels and all six checklist items. No additional prose, dates or credentials invented. Trailing Source verification notes and Editorial status are editorial annotations, not public article copy; excluded from the generated page. Existing heading structure followed; the checklist has a descriptive accessible list label.

Approved image: C:\Users\resis\Downloads\Vintage Music Rights Infographic.png . Source asset SHA256 matches original: DC0E7EA8AF158FAA7CD96DA74B8A2448E7F61CEF4C3935584539621BFE78A54D. No regeneration, reinterpretation, crop or replacement. Alt text explains the recording-versus-composition split and royalty paths.

## Listing, metadata and routes

Resources now lists exactly three original articles, preserving the previous two entries. New entry uses the exact subtitle as summary and the approved image thumbnail. Article navigation:false prevents unrelated shared-menu changes; the article remains indexable and linked from Resources. Its logical parent is Resources even though its URL is nested beneath the retired Articles index. Existing /resources/articles/ → /resources/ redirects are exact matches, without a wildcard that would capture the new article path; retained unchanged.

Generated canonical: https://resistanceandground.com/resources/articles/distribution-is-not-publishing/ . Existing site title convention retained: Distribution Is Not Publishing — Resistance & Ground. Description uses supplied suggested copy. OG/Twitter use https://resistanceandground.com/assets/distribution-is-not-publishing.jpg with correct 1733×908 dimensions and descriptive alt metadata. Article and BreadcrumbList schema use the existing generator; no publication date fabricated. Sitemap contains the new canonical once (19 canonical entries total). Default R&G logo preview and existing page-specific previews unchanged.

## Sources verified

No material factual corrections identified; approved prose was not silently rewritten.

- https://copyright.gov/engage/musicians/ — primary distinction between musical works and sound recordings verified.
- https://www.themlc.com/how-it-works — digital mechanical role verified.
- https://www.themlc.com/resources-songwriters — current destination for former self-administered-songwriters resources URL; linked directly to avoid that redirect.
- https://www.themlc.com/tools — matching/registration/claiming tools verified.
- https://www.ascap.com/help/registering-your-music — official URL returns 403 to automated browsing. It is not asserted to be broken, but its current content requires manual verification. Existing site Reference also links ASCAP. No alternative third-party source substituted.
- https://www.bmi.com/creators/royalty-policy-manual — registration and public-performance collection responsibilities verified.
- https://www.tunecore.com/ — distribution service verified.
- https://www.tunecore.com/music-publishing-administration — separate publishing administration, fees and retained copyright supported; article does not publish specific current prices/commissions.
- https://support.distrokid.com/hc/en-us/articles/48447750765715-Does-DistroKid-Collect-my-Songwriting-Royalties — composition royalties require separate DistroKid Publishing enrollment, verified. No claim that every distribution account includes publishing administration.

Article source labels retained while adding appropriate primary hyperlinks. ASCAP access remains the outbound-verification limitation.

## Validation

Passed: sync-site.cjs, sync-site.cjs --check, check-site.cjs, check-seo.cjs, check-gallery-demos.cjs, check-public-scores.cjs, git diff --check. Supplemental assertions verify exact article text, no editorial notes in public copy, no invented publication date, correct nested relative paths/canonical/image metadata, exactly three listing rows, and preservation of 193 other tracked files.

Normal local HTTP server returned 200 for new article, Resources, optimized JPEG and source PNG. Static validation finds no missing assets or broken local fragments. Existing article routes and redirects preserved. No form submissions or production writes.

Responsive source review at 320, 390, 768, 1024 and 1440px uses unchanged established article styles: 86% fluid width, 760px maximum prose and 900px maximum artwork, intrinsic image dimensions, object-fit contain for non-portrait images, wrapping source links and semantic readable checklist. This is source review, not measured rendering.

Browser automation remains unavailable after the earlier explicit preview security-policy denial; no workaround attempted. Actual mobile/desktop rendering, horizontal overflow, keyboard/touch navigation and runtime console-error checks were NOT performed. They remain manual QA. Live domain availability requires separately authorized deployment and is not claimed.

## Git summary

The following diff/status include all pre-existing uncommitted refinement work, not only this article. New files are untracked and therefore omitted from git diff --stat until staged. No files staged by this task.
 about/index.html                               |  8 +++----
 contact/index.html                             |  8 +++----
 home-circuit.js                                | 31 ++++++++++++++++++++++++
 index.html                                     | 10 ++++----
 music-media/artists-collaborations/index.html  |  8 +++----
 music-media/index.html                         |  8 +++----
 music-media/publishing/index.html              |  8 +++----
 resources/index.html                           | 13 +++++-----
 resources/reference/index.html                 |  8 +++----
 resources/resources.css                        | 16 +++++++++++++
 rgv4.css                                       | 18 ++++++++++++++
 scripts/article-layout.cjs                     |  2 +-
 scripts/sync-site.cjs                          |  4 ++--
 site.config.json                               | 33 ++++++++++++++++++++++++--
 sitemap.xml                                    |  1 +
 web-development/built-by-rg/arcade/index.html  | 10 ++++----
 web-development/built-by-rg/index.html         |  8 +++----
 web-development/built-by-rg/market/index.html  |  8 +++----
 web-development/index.html                     |  8 +++----
 web-development/portfolio/afterfall/index.html |  2 +-
 20 files changed, 154 insertions(+), 58 deletions(-)
 M about/index.html
 M contact/index.html
 M home-circuit.js
 M index.html
 M music-media/artists-collaborations/index.html
 M music-media/artists-collaborations/music/mikes-wilson/index.html
 M music-media/index.html
 M music-media/publishing/index.html
 M resources/index.html
 M resources/reference/index.html
 M resources/resources.css
 M rgv4.css
 M scripts/article-layout.cjs
 M scripts/sync-site.cjs
 M site.config.json
 M sitemap.xml
 M web-development/built-by-rg/arcade/index.html
 M web-development/built-by-rg/index.html
 M web-development/built-by-rg/market/index.html
 M web-development/gallery.css
 M web-development/index.html
 M web-development/portfolio/afterfall/index.html
?? assets/Joanie.png
?? assets/RG_Article_01_What_the_MLC_Actually_Does_v2.docx
?? assets/SongOut.png
?? assets/distribution-is-not-publishing-source.png
?? assets/distribution-is-not-publishing.jpg
?? assets/hat-rack-cabaret-branded.jpg
?? assets/image2-sharp.png
?? assets/image2.png
?? assets/loa.png
?? assets/proMlcImg.png
?? assets/rg-logo-share.jpg
?? assets/writVpub.png
?? docs/distribution-is-not-publishing-2026-10-19.md
?? docs/qa/demo-return-mobile.jpg
?? docs/refinement-pass2-2026-10-19.md
?? preview-server-error.log
?? preview-server.log
?? resources/article-content/distribution-is-not-publishing.html
?? resources/articles/distribution-is-not-publishing/
