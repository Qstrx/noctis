# Ocean’s Scenepacks

Scene packs for video editors, available at [qstrx.github.io/noctis](https://qstrx.github.io/noctis/).

## Collections

- **Call of Duty:** scene packs of John Price, Gaz, Ghost and Soap from Modern Warfare I–III and Modern Warfare 4 (plus more clips of Gaz and Soap), Valeria and The Archer from Modern Warfare 4, the campaign cutscenes of Modern Warfare I–III, and 22 Modern Warfare 4 campaign cutscenes, a separate campaign recap and three trailers.
- **SIX:** selected Joe Graves scenes from eight Season 1 and ten Season 2 source episodes. These files are character scene packs, not full episodes.

File entries show their duration and preview. Available previews play in the browser. Downloads retain the original GitHub and Google Drive destinations, with part selection for split files. After Start download, a reminder links to [@oceanxaep on TikTok](https://www.tiktok.com/@oceanxaep).

Mobile in-app browsers receive instructions for opening the site in Safari or Chrome before downloading. Detection uses device and browser signals; a TikTok referrer alone does not block downloads in an external browser.

## Run locally

This is a static HTML, CSS and JavaScript site. No build step or backend is required.

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open [localhost:8765](http://127.0.0.1:8765). GitHub Pages publishes the root of the main branch.

## How it is built

| File | What it does |
| --- | --- |
| `index.html` | Home: choose Call of Duty or SIX |
| `cod.html`, `six.html` | The two collections |
| `site.css` | Fonts, colours, header, dialogs, shared base |
| `select.css`, `select.js` | The select screens on the home and on Call of Duty |
| `cards.css` | Pack cards (cover, details, Preview and Download) and the SIX seasons |
| `cod.css`, `cod-views.js` | Call of Duty sections, one view at a time |
| `mw4.css`, `mw4-data.js`, `mw4-missions.js` | The Modern Warfare 4 campaign cutscenes |
| `download.css`, `site.js` | The download dialog, in-app browser notice and Call of Duty previews |
| `credit.css`, `credit.js` | The credit reminder after a download |
| `player.js` | The SIX preview player |
| `motion.css`, `motion.js`, `arrival.js` | Page fades, scroll reveals, card tilt and the navigation underline |
| `quality.html`, `quality.css` | One page with the resolution, frame rate and format of every pack |
| `archive-data.js` | Files, sizes and links of every pack |

Every page is dark and flat, with one colour per collection: sand for Call of Duty, blue for SIX. The home and Call of Duty open on the same select screen: a numbered list beside a picture of the row you are on. Pointing, focus, the arrow keys or the number keys move through it; a click, a tap or Enter opens it. Phones show the list alone, each row with its picture. On the home the two names lead, large, with a smaller picture of the one you are on beside them; the page takes that collection's colour.

On Call of Duty each choice is its own view with its own address (`cod.html#price`, `#gaz`, `#ghost`, `#soap`, `#valeria`, `#archer`, `#cutscenes`), so links, Back and Forward work. A bar at the top of every view leads back to the choice or straight to another section. A view shows that character's packs as a grid whose columns follow how many packs there are (a single pack gets a large picture with its details beside it), one card per game with the game's logo on its cover; Cutscenes shows the Modern Warfare 4 campaign, the Modern Warfare I–III campaign cutscenes and the MW4 trailers, and an MW4 scene link (`?scene=`) opens it directly. Without scripts every section shows. SIX opens directly on its seasons.

Reduced motion turns movement into plain fades. Fonts are Latin subsets of Anton, Archivo Black and Barlow Condensed, licensed under the SIL Open Font License in [img/fonts/OFL.txt](img/fonts/OFL.txt). The travelling navigation underline follows AuroraGrab’s, under the [MIT license](LICENSE-AuroraGrab). Official game logo sources are listed in [img/cod/logos/README.md](img/cod/logos/README.md). SIX previews support links to timestamps.

## Checks

With Playwright installed (`playwright` or `playwright-core`):

```sh
node scripts/test-in-app-download.cjs
node scripts/test-navigation.cjs
```

Set `PLAYWRIGHT_MODULE` to the module's path if it is installed elsewhere, and `PLAYWRIGHT_CHANNEL=chrome` to use an installed Chrome instead of Playwright's Chromium. The download checks use a local server, disposable browser contexts and small intercepted attachments; they cover embedded-browser detection, multipart and provider files, clipboard fallback, focus return, credit reminders and narrow-screen fit, and save captures to the ignored `.review/in-app-download/` directory. The navigation checks walk the select screens and the Call of Duty views by pointer, keyboard, Back and touch. Browser emulation does not replace testing on physical devices.

## Modern Warfare 4

The Cutscenes view offers the same 22 individual campaign cutscenes and a separate campaign recap in three editions: 4K, 2K (2560 pixels wide), and 1080p (1920 pixels wide), under the `mw4-scenepack-versions` release. The campaign is laid out as 17 mission cards in campaign order (`mw4-missions.js`), each with its scenes as Intro / Interlude / Outro chips; the recap closes the list. Choosing a scene opens it right under its mission’s row: a large poster, its duration, the three resolutions with their file sizes, and a download action that opens the existing download flow for the selected file only. Previous and next step through the scenes; Escape or the close button folds the scene away and returns to its chip. Previews stream the 1080p edition on explicit play; choosing 4K or 2K changes the download and does not silently request a heavier preview. Phones show two mission cards per row, tablets three, desktops four, and the open scene always spans the full width. Above the missions, a short guide explains the three resolutions: on a computer any of them works, while on a phone that cannot play or import 4K at 60 fps a lower one is the answer; on a phone the phone advice comes first. On phones, choosing 4K also shows a tip beside the resolutions with one-tap switches to 2K and 1080p. Scene and quality are retained in the URL. Artwork provenance is recorded in `img/cod/mw4/scenes/sources.json`. Every video is below 2 GB; original 30/60 fps and cinematic framing are retained. One English AAC-LC stereo track is included where recovered; Meltdown Outro remains silent. The 4K video bitstreams match the previous size-capped release; smaller editions are high-quality conversions. The earlier release and older operator, trailer and SIX behavior are preserved.
