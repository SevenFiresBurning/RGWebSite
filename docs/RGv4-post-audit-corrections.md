# RGv4 post-audit correction pass

## Working state

- Repository: `C:\Users\resis\OneDrive\Desktop\R&G\RGv3`
- Remote: `https://github.com/SevenFiresBurning/RGWebSite.git`
- Branch: `RGv4`
- Initial status: no tracked changes; six untracked assets preserved: `assets/Joanie.png`, `assets/RG_Article_01_What_the_MLC_Actually_Does_v2.docx`, `assets/SongOut.png`, `assets/loa.png`, `assets/proMlcImg.png`, and `assets/writVpub.png`.
- Modified: `index.html`, `music-media/artists-collaborations/index.html`, `rgv4.css`; added this report.
- No commit, merge, push, or deployment in this correction pass.

## Homepage

The three route headings and paragraphs now use the supplied wording exactly:

**Record, Release, Collaborate.**

Bring your ideas and we'll get the parts moving around it. We work on arrangements, recordings, and understand the practical support a release needs.

**A website that works for you.**

Bands need booking. Bookers need bands. Sales need closed. Start with what the site needs to do, then build around it.

**Publishing.**

Make sure your catalog is organized, your rights are registered, and the money you're owed has somewhere to go.

Route labels are exactly Music & Media, Web Development, and Resources. Their existing destinations remain `music-media/index.html`, `web-development/index.html`, and `resources/index.html`. Switch markup and circuitry remain intact.

The final Explore Resources link and its paragraph wrapper were removed. The featured article retains its existing layout and Read the article CTA, with no empty wrapper.

The section order is Hero → I'm Mike Wilson → What are you working on? → Featured → subsequent content. Mike's introduction copy is unchanged. A scoped homepage rule removes its redundant top padding and gives the introduction-to-routing transition responsive bottom spacing of 56–80px. The hero ground rule and routing circuit mark remain in place.

## Artists & Collaborations

The requested Music & Recordings CTA is not present in the current page. The current overview has Explore Artists; the child Artists page has Visit artist page. Neither was removed as a substitute. Clarification was requested; this is the only unresolved content ambiguity.

The background now uses the existing `assets/music-rehearsal.jpg` (2316 × 3088). The source file was not edited or replaced. SHA-256: `0D338B82F23B3A48BBC399D66D3910F214F4EB709B32E35F05E85AA33A6BF8D2`.

The previous social-card watermark and its animated rim were replaced with a decorative CSS pseudo-element behind the page content. It uses grayscale, 12% opacity on desktop, 9% at 850px and below, intersecting horizontal/vertical fade masks, and responsive cover positioning. It has no animation, blur, parallax, pointer interaction, or accessibility-tree content. Typography and page content remain dominant.

## QA and owner review

- Site checker passes: 18 canonical pages and 9 legacy pages, including internal paths/fragments, generated navigation and metadata, labels, forms, and JavaScript syntax.
- `git diff --check` passes.
- Browser checks at 320, 390, 768, 1024, and 1440px found no horizontal overflow on either affected page.
- Visual review covered desktop, intermediate, tablet, and mobile composition, background crop, text readability, and homepage spacing.
- Keyboard Tab reaches the routing links with a visible 3px focus outline and triggers the existing five-second circuit sweep. Link destinations and exact copy were checked in the rendered page.
- Browser error/warning log was empty during the checks.
- Existing reduced-motion circuit rules were inspected in the loaded stylesheet and remain unchanged; the new background has computed animation `none`. This browser interface does not expose motion-preference emulation, so a fresh emulated reduced-motion run was not performed in this pass.
- Owner review: confirm the subtle background intensity and reordered homepage rhythm, and identify a different CTA only if the absent Music & Recordings instruction refers to one of the existing links.

Local preview: `http://127.0.0.1:59746/`.
