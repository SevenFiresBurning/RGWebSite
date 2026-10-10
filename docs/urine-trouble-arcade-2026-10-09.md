# Ur in Trouble — Arcade integration

Added the supplied standalone game and artwork to Arcade, alongside HatGame. No commit, push or deployment performed.

## Sources

- Requested standalone file was found as `C:\Users\resis\Documents\Codex\2026-10-08\files-pasted-by-the-user-build\outputs\Ur inTrouble-world-scaled.html` (space in the actual filename).
- Original project folder: `C:\Users\resis\OneDrive\Desktop\UrineTrouble`.
- Artwork: `C:\Users\resis\Downloads\Two Kids Race to the Restroom.png`.

Original files remain untouched. The copied game is `web-development/arcade/games/urine-trouble/index.html`; artwork is `web-development/arcade/previews/urine-trouble.png`. It is a buildless standalone Canvas game with embedded images, CSS, and three inline scripts, approximately 24.35 MB. No dependency folders or development tools copied.

## Integration

- Arcade card uses supplied artwork, the game's actual “Ur in Trouble” title, factual runner description, and Play Game destination.
- Arcade description/social metadata updated through `site.config.json` and the existing generator.
- Copied game has noindex metadata and the shared return bar. Escape keeps its original pause action; the visible Back to R&G link returns to Arcade.
- Scoped body layout reserves 44px for the return bar rather than overlapping the game's header. Shared CSS is versioned for the new game to refresh existing preview caches.
- `scripts/add-demo-return.cjs` reproduces this game's return bar, pause exception and layout class after re-copying.

## Verification

- `node scripts/sync-site.cjs --check`, `node scripts/check-site.cjs`, and `node scripts/check-gallery-demos.cjs` pass: 19 canonical pages, 10 legacy pages, 20 demo/game production files.
- All three standalone inline scripts parse successfully.
- Browser verified starting Wally and Maryann, advancing score/distance, ArrowLeft input, Escape pause, sound toggle, Restart, and return to Arcade.
- Mobile tested at 328 CSS pixels (390×844 override with browser zoom): no horizontal overflow; return bar ends where game begins. Original swipe behavior retained; physical-phone testing not performed.
- No warning/error console entries observed in game smoke tests. Gallery artwork and Play Game destination verified.
- Original `node checks.cjs` does **not** pass. Its first speed assertion expects 16 ≤ speed < 20 after five seconds; the current source produces about 54.91. This appears related to the world-scaled speed change. The original check and gameplay were not rewritten as part of integration. Full-run balance has not been certified.

## Preview

- Arcade: `http://127.0.0.1:59750/web-development/arcade/`
- Game: `http://127.0.0.1:59750/web-development/arcade/games/urine-trouble/`
