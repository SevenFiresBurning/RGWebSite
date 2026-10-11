# Arcade local features — October 10, 2026

Implemented in the current Built by R&G gallery pass. No commit, push, deployment or original-project source edits.

## High Scores

Hat Rack Rhythm already awards 100/60 points for perfect/good hits, combo bonuses and five-point web-clearing bonuses. Its existing score is submitted only from normal run-ending code: rack failure or set completion. Restart and pause do not submit. No scoring rules were changed and no player records were seeded.

Qualifying runs open an accessible native modal with exactly three A–Z/0–9 initials, case-normalized to uppercase. Scores sort descending; earlier equal scores retain their position. A full leaderboard requires beating its tenth score. Saving reports local rank, prevents repeat submission, and handles blocked storage. Zero is a legitimate final gameplay score and can qualify while places are empty.

Arcade shows ten ranked positions, distinctly colored top three, explicit browser-local labels and a reset control. Ur In Trouble rankings remain pending its scoring readiness. No global scores are claimed.

## The Wall

The concentrated wall treatment uses a worn surface, taped paper, angled handwritten notes and four marker colors. Visitors can add 1–160-character plain-text notes by keyboard or pointer. Notes survive refresh; the latest 50 are retained, with a local clear control. No fake visitor messages are seeded. Rendering uses `textContent`, never message HTML. Empty, corrupt and unavailable browser storage are handled. Reduced-motion preference removes note rotation; no new animation is introduced.

## Files

- `web-development/built-by-rg/arcade/index.html`: composition is introduction, games, High Scores, The Wall.
- `web-development/arcade/local-store.js`: versioned storage adapter and validation, separated from UI for future replacement.
- `web-development/arcade/features.js` and `features.css`: leaderboard, wall and visual treatment.
- `web-development/arcade/score-entry.js`: run-ending initials dialog.
- `web-development/arcade/games/hatgame/index.html` and `game.js`: shared module loading and two final-score event hooks.
- `scripts/check-arcade-local.cjs`: isolated in-memory regression checks; synthetic test values are never written into visitors' storage.
- `docs/qa/arcade-wall-local.jpg`: labelled QA note screenshot; the note was removed after testing.

## Validation

Passed local-storage tests for ranking, ties, top-10 limits, valid/invalid initials, invalid scores, unsupported games, notes and character limits, 50-note retention, reload-equivalent persistence, corrupt JSON and blocked writes.

Passed site sync/check, site checks, gallery-demo checks and `git diff --check`.

Browser verification: real Hat Rack Rhythm run ended naturally at 12 strands, opened the initials modal with its actual zero-point score; two-character initials were rejected, three characters saved successfully at rank 1. Arcade displayed that score after refresh. Modal Escape dismissed it while remaining in the game. Test score was then cleared through the UI. A wall note containing HTML-like input displayed literally, created no image element, persisted after refresh and was cleared. Keyboard Enter submission and mouse controls worked. No captured console warnings/errors.

Mobile/touch testing remains incomplete: the existing in-app browser viewport control did not apply requested phone sizing in this session. Responsive rules and minimum 44px controls were inspected; native touch interaction and reduced-motion emulation were not executed. Verify on a real phone before deployment. A full successful Hat Rack Rhythm set was not played; its completion hook was inspected and syntax-checked, while the failure ending was exercised live.

## Later shared-backend pass

Replace the browser adapter with Cloudflare-backed read/write APIs, add server-side score validation and abuse controls (local scores are editable in browser storage), shared note moderation, rate limits, admin removal and archived-wall support. No backend requests, moderation tools, freehand drawing or stickers were implemented here. Ur In Trouble retains its previously documented speed-balance check failure and needs a separate gameplay/scoring review.

All current gallery work remains uncommitted on main. Unrelated existing untracked assets remain preserved.

## Layout refinement (supersedes the vertical composition above)

### Two-game scoreboard update

Public game labels now use **Ur In Trouble** throughout the site, metadata and documentation. Technical folder and asset paths remain stable for existing inbound links. The scoreboard now selects Hat Rack Rhythm or Ur In Trouble, each with its own local Top 10. Ur In Trouble's existing distance/pass score is captured after its completed ending sequence; restart and pause do not submit. Both games share the same validated initials interface.

Verified a real Ur In Trouble run ending at 6,378 points, entered QAT, saved at rank 1, returned to Arcade and confirmed the score remained in its own list after refresh. The QA score was removed through the local reset control. Store tests additionally verify game isolation; site/demo/sync checks pass with no captured browser console errors. Gameplay balance remains unchanged. These changes are local and have not yet been pushed.

Arcade now uses an integrated CSS Grid: at 1150px and above the columns are Wall / Games / High Scores with `1fr 2.3fr 1fr` proportions. The center shows large game cards vertically. Below that breakpoint games occupy the full top row and Wall / High Scores occupy equal columns beneath. At 600px and below game cards stack; feature typography, table cells and spacing become compact. Grid children use zero minimum widths, fixed table layout and wrapping to avoid intrinsic-width overflow. Controls retain 44px minimum touch height.

Graffiti editing moves into a labelled native modal opened by Write a note. This preserves a compact wall preview at all sizes while providing full-width editing controls, focus trapping, Escape dismissal and focus restoration. The form and storage adapter remain the same. With JavaScript unavailable the form remains in the page. Score-entry functionality is unchanged.

Verified in-browser at the available 1076px CSS viewport: games first, equal feature columns, no page horizontal overflow, wall-editor keyboard opening, save, Escape close and focus return. QA note removed. Existing store and site checks pass. Phone/touch and wide-desktop breakpoint emulation remain unverified because the browser viewport override is ineffective; their CSS rules were inspected. No backend, commit, push or deployment added.
