# Public Arcade scores

Cloudflare Pages Functions endpoint: `/api/arcade/scores`. D1 binding: `ARCADE_DB`.

Setup required in the existing Cloudflare Pages project:

Confirmed project name: `rgwebsite`. Dashboard access currently requires the user to sign in.

1. Create a D1 database named `rg-arcade-scores`.
2. Execute `migrations/0001_arcade_scores.sql` against that database.
3. In Pages project Settings → Bindings, add a D1 binding named `ARCADE_DB` referencing that database (production and a separate preview database if desired).
4. Deploy the repository with Pages Functions enabled, then verify the public scoreboard in two different browsers.

Reference: https://developers.cloudflare.com/pages/functions/bindings/

Score history is retained in D1; the public endpoint returns the top ten per game. Browser resets do not delete public scores. Existing local test scores are not uploaded automatically. Clearing browser storage still clears The Wall, which remains local.

Initials and scores become public only after the player presses Save score. The API validates game, initials, integer score and submission ID, uses bound SQL parameters, rejects cross-origin submissions, limits submissions to three per minute per hashed network source, and makes retries idempotent. No raw IP is stored or returned; the internal hash is excluded from public results.

Scores are client-reported. These checks reduce accidental invalid data and spam but are not proof of genuine gameplay or anti-cheat. A later pass can add server-verified runs. Database persistence is durable, not a guarantee against administrative deletion: maintain D1 backups and retention policies for long-term history.

If the binding or backend is unavailable, the frontend displays an error and allows retry. It never silently saves a purported public score only to the browser. Python static previews cannot execute Pages Functions.

Run `node scripts/check-public-scores.cjs` (Node 24 with built-in SQLite) for API/schema integration tests. No Cloudflare account resources have been created and no production deployment has been performed in this pass.
