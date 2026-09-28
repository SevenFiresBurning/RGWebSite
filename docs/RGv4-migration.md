# RGv3 → RGv4 migration

This migration preserves the existing static site, content, media, and Formspree integration. It introduces a generated shared header/metadata configuration and a reusable navigation, CTA, and editorial component stylesheet.

## Canonical hierarchy

- `/` — Home
- `/music-media/`
  - `/music-media/artists-collaborations/`
    - `/music-media/artists-collaborations/music/`
      - `/music-media/artists-collaborations/music/mikes-wilson/`
  - `/music-media/publishing/`
- `/web-development/`
  - `/web-development/portfolio/`
    - `/web-development/portfolio/yeschef/`
    - `/web-development/portfolio/afterfall/`
    - `/web-development/portfolio/jenny-and-the-streetwalkers/`
- `/resources/`
  - `/resources/articles/`
    - `/resources/what-is-music-publishing/` — retained article URL
  - `/resources/reference/`
- `/about/`
- `/contact/`

Each directory has a crawlable `index.html`.

## Legacy mapping

| Old route | New destination |
| --- | --- |
| `/production/` | `/music-media/` |
| `/production/publishing/artists/` | `/music-media/artists-collaborations/` |
| `/music/` | `/music-media/artists-collaborations/music/` |
| `/music/mikes-wilson/` | `/music-media/artists-collaborations/music/mikes-wilson/` |
| `/production/publishing/` | `/music-media/publishing/` |
| `/webdev/` | `/web-development/` |
| `/projects/` | `/web-development/portfolio/` |
| `/production/music-publishing.html` | `/resources/what-is-music-publishing/` |
| `/production/publishing/example-deals.html` | `/music-media/publishing/` |

Directory redirects include both trailing-slash, non-trailing-slash, and explicit `index.html` forms. The two older standalone publishing documents are archived as text rather than deleted. The source retains legitimate references to music production and systems within descriptive copy.

## Root causes addressed

- Manually duplicated headers are now generated from `site.config.json`; the same hierarchy generates breadcrumbs and structured relationships.
- Competing header gaps, a Contact-only left margin, and legacy navigation rules were consolidated. A single 950px breakpoint is shared between CSS and JavaScript, with stable touch controls at constrained widths.
- Blue action rules and separate mailing-submit styling are replaced by one common control system.
- Publishing's mobile watermark used `right: -5%` and a scale animation, producing overflow. A positive inset and bounded width keep it inside the page at every animation phase.
- Existing frame/video/form logic is retained. The new sound-toggle styling keeps its absolute placement within the reel.

## Local checks

`node scripts/check-site.cjs` checks generated-file consistency, all canonical/legacy routes, case-sensitive local assets and links, anchors, metadata presence, obsolete public labels, form endpoints, and JavaScript syntax.

Browser validation covers desktop/mobile navigation, keyboard focus and Escape, no-JavaScript navigation, full image decoding, semantic headings, reduced motion, legacy fallback navigation, and layout from 320px to 1920px. Form tests use mocked responses, including failure and mailto fallback; they do not send real messages. Netlify's actual HTTP redirect responses still require a post-deployment spot check.

Current payment and transparent-asset dependencies remain pending as documented in the README. No payment destination was guessed and no replacement transparent asset was manufactured.
