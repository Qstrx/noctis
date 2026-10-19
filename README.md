# Ocean’s Scenepacks

Scene packs for video editors, available at [qstrx.github.io/noctis](https://qstrx.github.io/noctis/).

## Collections

- **Call of Duty:** scene packs of John Price, Gaz, Soap and Ghost from Modern Warfare I–III (plus more clips of Gaz and Soap), the campaign cutscenes of the three games, and 22 Modern Warfare 4 campaign cutscenes, a separate campaign recap and three trailers.
- **SIX:** selected Joe Graves scenes from eight Season 1 and ten Season 2 source episodes. These files are character scene packs, not full episodes.

File entries show their duration and preview. Available previews play in the browser. Downloads retain the original GitHub and Google Drive destinations, with part selection for split files. After Start download, a reminder links to [@oceanxaep on TikTok](https://www.tiktok.com/@oceanxaep).

Mobile in-app browsers receive instructions for opening the site in Safari or Chrome before downloading. Detection uses device and browser signals; a TikTok referrer alone does not block downloads in an external browser.

## Run locally

This is a static HTML, CSS and JavaScript site. No build step or backend is required.

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open [localhost:8765](http://127.0.0.1:8765). GitHub Pages publishes the root of the main branch.

## Resources

The sky renderer is adapted from AuroraGrab under the [MIT license](LICENSE-AuroraGrab). Official game logo sources are listed in [img/cod/logos/README.md](img/cod/logos/README.md). Fonts (Anton, Archivo Black, Barlow Condensed, Latin subsets) are licensed under the SIL Open Font License in [img/fonts/OFL.txt](img/fonts/OFL.txt).

The site uses local imagery, three collection palettes, keyboard-accessible dialogs and the device’s reduced-motion preference. SIX previews support links to timestamps. Original media metadata lives in `archive-data.js`.

The Call of Duty page is a board (`board.css`, `rank.css`): a row per operator (John Price, Gaz, Soap, Ghost) and for the cutscenes, each headed by the operator's rank insignia, name and resolution, a column per game (Modern Warfare, II, III, more clips) whose logos stay pinned while the rows scroll, and the game logo printed on every cover. The Modern Warfare 4 trailers follow on a board of their own. `cod.html#ghost` opens on Ghost. Gaz, Soap and Ghost packs are GitHub release assets under the `cod-141` tag. SIX opens directly on its seasons.

The home is a night sky before the aurora (`home-simple.css`, `home-sky.js`): drifting stars and a glow on the horizon that takes the colour of the collection being pointed at. Two pictures, Call of Duty and SIX, lead to the collections; choosing one opens its picture to fill the screen and dims it into that collection's night in half a second, and the page opens under its aurora.

Motion lives in `motion.css` and `motion.js`. Titles rise letter by letter, footage reveals as it scrolls in, and previews grow out of their card. Reduced motion turns all of it into plain fades, and the home then opens a collection directly. Titles use a Latin subset of Anton (`img/fonts/anton-latin.woff2`).

## Download checks

With Chrome and `playwright-core` installed:

```sh
node scripts/test-in-app-download.cjs
```

Set `PLAYWRIGHT_MODULE` to an existing module path if needed. The checks use a local server, disposable browser contexts and small intercepted attachments. They cover embedded-browser detection, multipart and provider files, clipboard fallback, focus return, credit reminders and narrow-screen fit. Captures are saved to the ignored `.review/in-app-download/` directory. Browser emulation does not replace testing on physical devices.

## Modern Warfare 4

The MW4 collection opens the Call of Duty page. It offers the same 22 individual campaign cutscenes and a separate campaign recap in three editions: 4K, 2K (2560 pixels wide), and 1080p (1920 pixels wide), under the `mw4-scenepack-versions` release. The campaign is laid out as 17 mission cards in campaign order (`mw4-missions.js`), each with its scenes as Intro / Interlude / Outro chips; the recap closes the list. Choosing a scene opens it right under its mission’s row: a large poster, its native frame rate and audio, three resolution choices with that scene’s exact dimensions and file sizes, and a download action that opens the existing download flow for the selected file only. Previous and next step through the scenes; Escape or the close button folds the scene away and returns to its chip. Previews stream the 1080p edition on explicit play; choosing 4K or 2K changes the download and does not silently request a heavier preview. Phones show two mission cards per row, tablets three, desktops four, and the open scene always spans the full width. Scene and quality are retained in the URL. Artwork provenance is recorded in `img/cod/mw4/scenes/sources.json`. Every video is below 2 GB; original 30/60 fps and cinematic framing are retained. One English AAC-LC stereo track is included where recovered; Meltdown Outro remains silent. The 4K video bitstreams match the previous size-capped release; smaller editions are high-quality conversions. The user confirmed successful export of the earlier 1080p/60 Kill Archer Outro sample on a Samsung A55; the other clips and the 2K/4K editions have not been tested on that phone. The earlier release and older operator, trailer and SIX behavior are preserved.
