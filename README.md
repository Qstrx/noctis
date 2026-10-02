# Ocean’s Scenepacks

A static scene archive for John Price, Call of Duty campaign cutscenes, and Joe Graves from SIX, under the night sky of the AuroraGrab 3.0 reference.

## Run locally

From this folder, run:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765. No build step, package installation, or server backend is required. GitHub Pages can serve these files directly.

## Files

- `index.html`: a two-choice home with the Ocean’s brand, motion icon, and photographed Call of Duty / SIX links.
- `cod.html`, `six.html`: the complete searchable collection pages.
- `site.css`: shared AuroraGrab Night styling and archive layouts.
- `home.css`: the centered home choices and short-screen layouts.
- `site.js`: search, filters, download selection, COD previews, and the motion preference.
- `motion.css`, `motion.js`: whole-main arrival/departure, selection feedback, interruptible filter layouts, and dialog transitions.
- `aurora.js`: the adapted WebGL sky, seeded stars, Lofoten ridges, reflection, app-style sky introduction, and navigation state transfer.
- `archive-data.js`: original pack metadata and download URLs.
- `player.js`: the SIX preview player, episode navigation, and timestamp sharing.
- `img/`: supplied scene stills and icons; image comments record source provenance.

## Behavior

The home contains two destinations. Both choices arrive together with the complete main view: a 450ms opacity change and 550ms vertical arrival, delayed 180ms on home. Navigation fades the main for 300ms while it scales toward .985 over 450ms. Navigation starts at 300ms; the completed effects hold until the destination document replaces the page. Escape cancels the departure and restores focus; page exit or back-cache restoration clears held effects. Modified clicks and browsers without Web Animations keep native link behavior.

The approved sky’s final palette, seeded artwork, and reflection remain intact. Initial home entry introduces the curtain, stars, ridges, and reflection using the source app’s layered timings. Hovering or focusing a choice gently raises aurora energy; confirming a destination triggers a 1300ms light wave. A one-use session record carries shader time, energy, and pulse progress across navigation, so collection pages resume the same sky phase rather than restart its introduction. The shader remains capped at 30 fps on desktop and 20 fps on mobile.

The motion icon controls the interface and sky, remembers the preference, and has an accessible pause/resume label. The operating system’s reduced-motion setting takes precedence. Pause cancels pending interface movement, settles an unfinished sky introduction, and commits pending navigation immediately. The sky stops when the page is hidden or a preview is open. Devices without WebGL retain the static night sky and foreground; storage failures preserve ordinary navigation and an independent sky on each page.

Search and filters change visibility and result counts immediately. Visible archive cards then bridge to their new positions; rapid input cancels prior movement. Preview dialogs enter in 350ms and dismiss in 220ms. Preview-to-download switches to the selected file action immediately. Video files load only when a preview opens. Downloads retain the original GitHub release assets, Google Drive, and Mega links; SIX retains its timestamp format.

## Validation

The current world was verified in Edge with Playwright at 1440×960, 390×844, 320×640, 844×390, and 2265×1244. Checks covered continuous shader time and pulse, focus, Escape cancellation, keyboard navigation, back navigation, pause/reduced motion, visible no-JavaScript content, and icon labels. Archive regression covered search/filter/empty states, multipart choices, provider labels, preview failure recovery, episode/part navigation, timestamp deep links, and focus restoration. Navigation checks wait for the documented 300ms departure. With the destination response delayed 1100ms, the outgoing page still had opacity 0, scale .985, and an inert main at 700ms; destination arrival and back navigation restored the view.

Video requests were deliberately blocked to verify recovery; complete multi-gigabyte downloads were not performed. Release asset URLs were checked against GitHub release metadata. Current design tokens and motion behavior are recorded in `DESIGN.md` and `.impeccable/design.json`.
