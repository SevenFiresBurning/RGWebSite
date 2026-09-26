# Resistance & Ground — RGv4

Static HTML, CSS, and JavaScript. Formspree handles contact and mailing-list submissions. No client-side framework or package installation is required.

## Shared site configuration

`site.config.json` defines canonical pages, their hierarchy, primary navigation, social images, and legacy route mappings. To change navigation or metadata, edit this file and run:

```sh
node scripts/sync-site.cjs
node scripts/check-site.cjs
```

The generator writes static navigation, breadcrumbs, page metadata, `_redirects`, and `sitemap.xml`. Generated HTML stays crawlable and usable without JavaScript. Commit the generated results along with the configuration when changes have been reviewed. `--check` detects drift without writing files.

Page body content remains in its HTML file. Add a page's content before adding its configuration entry. Keep the `rg:metadata` and `rg:breadcrumbs` markers intact. Shared navigation/CTA/component styling belongs in `rgv4.css`; existing foundational and specialist styles remain in `style.css`, `resources/resources.css`, and `webdev/systems.css`.

## Hosting and legacy URLs

Netlify publishes the repository root and runs `node scripts/sync-site.cjs` before publishing. `_redirects` contains explicit permanent redirects, forced so legacy HTML files cannot shadow them. Static legacy pages also include canonical/noindex metadata, a refresh, and a normal destination link for non-Netlify previews. `legacy-redirect.js` preserves query strings and fragments. Legacy section anchors remain on the replacement pages.

On another host, configure equivalent HTTP 301 redirects; HTML fallbacks preserve access but cannot return a 301 status. Deploying beneath a URL subdirectory would also require reviewing root-based redirect rules and the production domain in `site.config.json`.

The old music-publishing article and example-deal source are preserved as text under `docs/legacy/`. They are not linked into the public hierarchy. Netlify headers mark that directory noindex and serve it as text.

## Forms and media

Contact: `https://formspree.io/f/mjykralg`. Mailing list: `https://formspree.io/f/mljdnpzl`. Existing fields, consent behavior, email fallback, and form handlers are retained. Local tests should mock submissions unless a live test has been explicitly requested.

Existing videos and source assets remain unchanged. YesChef and AfterFall are labeled In Development. The supplied AfterFall PNG has a baked-in checkerboard background; it is not a transparent image.

## Pending assets and payment information

- R&G Venmo: blocked pending a confirmed destination. Current destination retained.
- R&G PayPal: blocked pending a confirmed destination; no new link added.
- Transparent Swilson artwork: future supplied asset; current JPEG uses a CSS edge mask.
- Transparent booking artwork: future supplied asset; current artwork retained.

See `docs/RGv4-migration.md` for the route map and validation notes.
