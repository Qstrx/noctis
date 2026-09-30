# Ocean’s Scenepacks

A small, static archive for Call of Duty and Six footage. Published with GitHub Pages at https://qstrx.github.io/noctis/.

## Run locally

From this directory, run `python -m http.server 8765 --bind 127.0.0.1` and open http://127.0.0.1:8765/.

No build step or package installation is required.

## Files

- `index.html`: collection overview.
- `cod.html` and `six.html`: static catalogs with ordinary download links.
- `archive-data.js`: pack metadata and original file destinations.
- `site.css`: layout, colors, responsive rules, and motion preferences.
- `sky.js`: the background aurora, capped at 15 frames per second and paused when the page is hidden or a dialog is open.
- `catalog.js`: collection filters, scroll reveals, and preview-link routing.
- `cinema.js` and `player.js`: video previews, source notes, split downloads, and episode timestamps.

The background falls back to a static sky without WebGL. Reduced motion disables animation, and the pause control remembers the visitor’s choice. All downloads have ordinary links, including a no-script fallback for split packs. Video previews and filtering require JavaScript.

## Updating the archive

Keep the static catalog and `archive-data.js` in sync. Preserve the existing release filenames and episode IDs so shared scene links continue to work. GitHub release assets are downloaded directly; campaign files open on Google Drive, and the combined John Price pack opens on Mega.

The aurora shader is adapted from AuroraGrab under the notice in `licenses/AuroraGrab.txt`. That license covers the shader code; it does not grant rights to the film or game footage.
