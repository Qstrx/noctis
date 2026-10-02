# Ocean’s Scenepacks

A static scene archive for John Price, Call of Duty campaign cutscenes, and Joe Graves from SIX, under the night sky of the AuroraGrab 3.0 reference.

## Run locally

From this folder, run:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765. No build step, package installation, or server backend is required. GitHub Pages can serve these files directly.

## Files

- `index.html`, `home.css`: two equal photographic compositions labeled Call of Duty / SIX, dissolving into the real sky.
- `cod.html`, `six.html`, `archive.css`: prominent archive chapters, responsive grids, and the complete searchable collections.
- `site.css`: shared AuroraGrab Night tokens, controls, and player layouts.
- `site.js`: search, filters, download selection, COD previews, and the motion preference.
- `motion.css`, `motion.js`: the polar-curtain navigation mask, selection feedback, interruptible filter layouts, and dialog transitions.
- `aurora.js`: the WebGL sky, seeded stars, Lofoten ridges, reflection, layered sky introduction, coupled passage fronts, and navigation state transfer.
- `archive-data.js`: original pack metadata and download URLs.
- `player.js`: the SIX preview player, episode navigation, and timestamp sharing.
- `img/`: supplied scene stills and icons; image comments retain source provenance.

## Behavior

The home contains the Ocean’s brand, an accessible motion icon, and two destination links. Source photographs dissolve at their edges into the actual aurora; large destination names keep the choice clear. “Call of” is a smaller prefix above “Duty”. The two complete compositions provide equal hit areas and stack on phones.

Call of Duty has three clear sections: Campaign cutscenes (3), John Price (3), and the adjacent All in one complete pack (1). SIX has two prominent season chapters with 8 and 10 episodes. Source information, previews, original downloads, multipart choices, and SIX timestamp links remain available.

Selecting a destination closes a clipped passage around the chosen link’s horizontal center in 400ms. Two temporary fronts in the existing aurora shader follow the same progress and easing. The closed mask holds while the destination loads; the destination reopens it in 520ms. The main remains at opacity 1 without navigation scale or translation. Direct loads start visible, and no per-card page-entry sequence runs. Escape cancels the passage and restores focus; back-cache restoration clears the gate. Without a ready WebGL renderer, Web Animations, or enabled motion, navigation uses ordinary links. Modified clicks retain native browser behavior.

A one-use session record carries shader time, energy, pulse progress, and gate geometry across navigation. The gate contributes no light at rest, preserving the approved ordinary sky. Initial home entry retains the source app’s layered curtain, star, ridge, and reflection timings. The passage adapts its `paint.progress()` principle of coupling a visible light front to interface progress. The shader stays capped at 30 fps on desktop and 20 fps on mobile, using its existing animation clock and canvas.

The motion icon remembers the preference and exposes an accessible pause/resume label. The operating system’s reduced-motion setting takes precedence. Pause cancels pending spatial effects, resets the gate, settles an unfinished sky introduction, and commits pending navigation immediately. The sky stops when the page is hidden or a preview opens. Devices without WebGL retain the static night sky and foreground; unavailable storage preserves visible content and an independent sky on each page.

Search and filters update visibility and result counts immediately. Visible archive cards then bridge to their new positions; rapid input cancels prior movement. Preview dialogs enter in 350ms and dismiss in 220ms. Preview-to-download switches to the selected file action immediately. Video files load only when a preview opens. Downloads retain the original GitHub release assets, Google Drive, and Mega links; SIX retains its timestamp format.

## Validation

The cinematic checks passed nine views covering desktop widths of 1440 and 2265px, mobile 390/320px, and 844px landscape, along with both collection passages, Escape, back navigation, keyboard access, pause, reduced motion, and no-JavaScript content. Archive grouping, cards, and filters passed at 320, 390, 1024, and 1440px; full archive/player regression also passed. During an 850ms delayed destination load, the outgoing main remained at opacity 1 and transform none with a closed clip, closed gate, and inert state, then restored on arrival and back navigation. Current tokens and motion behavior are recorded in `DESIGN.md` and `.impeccable/design.json`.

Video requests were deliberately blocked to verify recovery; complete multi-gigabyte downloads were not performed. Release asset URLs were checked against GitHub release metadata.

The incoming passage is primed before the first paint. A frame-sampling check confirms COD and SIX arrive fully clipped, then open and restore an unclipped view; direct loads remain immediately visible.
