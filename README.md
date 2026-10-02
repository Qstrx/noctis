# Ocean’s Scenepacks

A static cinema archive for Call of Duty campaign cutscenes, John Price scene packs and Joe Graves from SIX.

## Run locally

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765. No build step or backend is required; the site remains compatible with GitHub Pages.

## Experience

Home is two full-window photographic destinations, with supplied Anton lettering and the real AuroraGrab sky layered over the imagery. Selecting a destination expands its photograph to the viewport in 420ms. It holds while the document loads, then settles into the collection header in 560ms. Main content stays at opacity 1 without clipping or page scaling. The one-use photo handoff expires after six seconds. Navigation between archives remains immediate; returning to home carries the selected photograph back to its choice.

The foreground owns the initial lens-resolution sequence; the sky starts settled. The sky renderer retains its original time, energy and pulse transfer, reduced render resolution, 30/20fps limits, and suspension when hidden or when a preview opens. The rejected clip gate and cross-document View Transition prototype are absent from the shipped implementation.

COD has three campaign cutscenes, three John Price files and a separate complete file beside the character trilogy. SIX has two artwork-led chapters with eight and ten episode rows. Search, filters, source notes, multipart selection, native preview dialogs, original downloads and SIX timestamp sharing remain available.

Pause or device reduced motion uses immediate links and clears photographic motion. Escape cancels departure before navigation starts. Back restoration removes the traveling frame and restores interaction. Without JavaScript, animation support or session storage, the underlying links and visible destination content remain usable.

## Files

- `index.html`, `home.css`: cinematic binary chooser and bounded direct-load lens entrance.
- `cod.html`, `six.html`, `archive.css`: photographic collection headers, film rows and responsive chapters.
- `site.css`, `site.js`: shared Night controls, search, filters and source download/preview behavior.
- `motion.css`, `motion.js`: isolated photo passage, local filter/dialog feedback and motion cleanup.
- `aurora.js`: the preserved real sky, stars, mountain detail, reflection and sky transfer.
- `archive-data.js`, `player.js`: original file metadata and SIX player/timestamp functions.
- `DESIGN.md`, `.impeccable/design.json`, `PRODUCT.md`: current visual and product contracts.
- `img/`: supplied scene stills, icons, self-hosted Anton and its OFL notice. Source pixels are unchanged.

## Verification

All 25 original article blocks remain byte-identical. Layout and images were checked across all pages at 1440, 390, 2265 and 1024px; home also fits 320px and short landscape. Real photo passages, keyboard links, Escape, pause, reduced motion, browser back and no-JavaScript links passed. A delayed destination test records the outgoing photograph at the exact full viewport at 850ms and the incoming photograph already present at first paint. Main opacity remains 1 and inert state clears on arrival and back.

Archive/player regression passed: filters, search and empty reset, source providers, multipart choices, preview failure recovery, video cleanup, episode/part navigation, timestamp links and focus restoration. Media requests were deliberately blocked for recovery tests; complete remote playback and multi-gigabyte downloads were not streamed.
