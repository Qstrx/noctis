# Ocean’s Scenepacks

A static scene archive for John Price, Call of Duty campaign cutscenes and Joe Graves from SIX. Home and both collections share the night sky and motion language of AuroraGrab 3.0.

## Run locally

From this folder, run:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765. No build step, package installation or server backend is required. The existing GitHub Pages setup can serve these files directly.

## Files

- `index.html`, `cod.html`, `six.html`: home and collection pages.
- `site.css`: shared AuroraGrab Night styling and responsive layouts.
- `site.js`: filters, search, download selection, COD preview and motion preference.
- `aurora.js`: adapted AuroraGrab 3.0 WebGL sky, seeded stars, Lofoten ridges and reflection.
- `archive-data.js`: original pack metadata and download URLs.
- `player.js`: original SIX preview player, episode navigation and timestamp sharing.
- `img/`: supplied scene stills and icons. Image comments record source provenance without changing pixels.

## Behavior

The aurora renders at reduced resolution and is capped at 30 fps on desktop and 20 fps on mobile. It pauses when the page is hidden or a preview opens. “Aurora on” toggles motion and remembers the preference; the operating system’s reduced-motion setting takes precedence. Devices without WebGL retain the static night sky and foreground.

Search and category filters operate locally. Video files load only when a preview is opened. Downloads continue to use the original GitHub release assets, Google Drive and Mega links. SIX keeps its existing timestamp link format.

## Validation

Verified in Edge with Playwright at 1440, 390 and 320 px. Search/filter/empty states, multipart file choices, provider labels, preview failure recovery, episode/part navigation, timestamp deep links, focus restoration and motion preferences passed. Video requests were deliberately blocked to verify recovery; complete multi-gigabyte downloads were not performed. Existing release asset URLs were checked against GitHub release metadata.
