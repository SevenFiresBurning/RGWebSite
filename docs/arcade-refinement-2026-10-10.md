# Arcade refinement — 2026-10-10

Implemented on RGv4, fast-forwarded to existing main before editing. No commit, push, deployment, or production database modification.

## Modified files
- web-development/built-by-rg/arcade/index.html: heading placement, removed introduction, updated Ur In Trouble card caption, explicit ranking controls and layout script.
- web-development/arcade/features.css: reserved switch lane, desktop heading/notes row, compact mobile columns, aged paper, expanded Wall and active ranking styles.
- web-development/arcade/features.js: stable note reconciliation and placement, responsive note distribution, scaling, modal Wall with Escape/focus return/scroll lock, keyboard game selection.
- web-development/arcade/wall-layout.js: deterministic ID-based placement and rotation, server-clock aging and readable size floors (14px compact / 18px expanded).
- web-development/arcade/public-scores.js: use server time for note aging.
- functions/api/arcade/wall.js: atomic D1 expiration, insertion and oldest-first capacity enforcement; server-generated timestamps. Score records are unaffected.
- scripts/check-public-scores.cjs: real SQLite transactional storage, expiration/capacity/timestamp/scaling tests.
- scripts/preview-arcade.cjs: optional isolated in-memory QA preview. Defaults to no notes; explicit numeric argument adds clearly labeled test fixtures. Never seeds production.

## Verification
PASS: check-public-scores.cjs, sync-site.cjs, check-site.cjs, check-gallery-demos.cjs.
API tests cover 0/7/13/14-day aging, expiration at 14 days, 51st-note eviction, equal-time tie-breaker, 50 retained notes, server timestamps, validation, rate limits and preserved score records. Layout tests cover deterministic results and readable scaling at 1/10/25/50 notes.
Browser checks used the actual Pages handlers with isolated SQLite QA storage. Effective viewport widths were 1210px desktop, 860px tablet and 328px mobile (the in-app browser scales requested dimensions). No horizontal document overflow at these widths. Desktop showed three notes beside the heading and 47 in the left Wall; mobile showed games first and two narrow feature columns. Switch artwork has 56px reserved space before button text.
Tested expanded Wall, background scroll lock, Escape, focus return, note editor, plain-text rendering of HTML-looking text, submission and persistence after reload at 50-note capacity. Tested mouse selection and arrow-key game selection. No console warnings/errors. Native controls have touch-sized targets; physical-device touch was not exercised. Reduced-motion CSS disables note rotation; OS-level reduced-motion simulation was not available through the browser controls.

## Backend limits
Uses the existing ARCADE_DB binding and arcade_wall table. No new schema migration required. Existing migration 0002 must already be applied to the production database; that remote schema was not changed or reverified in this pass. Expired notes are physically reconciled on server reads/writes, rather than through a scheduled job. The deployed behavior remains unchanged until this work is separately published. QA preview persistence is in-memory for the lifetime of its server; production persistence remains D1.
