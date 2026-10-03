# Ocean’s Scenepacks

Scene packs for video editors, available at [qstrx.github.io/noctis](https://qstrx.github.io/noctis/).

## Collections

- **Call of Duty:** Modern Warfare I, II and III each contain John Price scenes and campaign cutscenes. Modern Warfare IV contains three trailers in release order. The John Price All in one file covers MW I–III.
- **SIX:** selected Joe Graves scenes from eight Season 1 and ten Season 2 source episodes. These files are character scene packs, not full episodes.

File entries show their source, duration and size. Available previews play in the browser. Downloads retain the original GitHub, Google Drive and Mega destinations, with part selection for split files. After Start download, a reminder links to [@oceanxaep on TikTok](https://www.tiktok.com/@oceanxaep).

Mobile in-app browsers receive instructions for opening the site in Safari or Chrome before downloading. Detection uses device and browser signals; a TikTok referrer alone does not block downloads in an external browser.

## Run locally

This is a static HTML, CSS and JavaScript site. No build step or backend is required.

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open [localhost:8765](http://127.0.0.1:8765). GitHub Pages publishes the root of the main branch.

## Resources

The sky renderer is adapted from AuroraGrab under the [MIT license](LICENSE-AuroraGrab). Official game logo sources are listed in [img/cod/logos/README.md](img/cod/logos/README.md). Font licensing is included in [img/fonts/OFL.txt](img/fonts/OFL.txt).

The site uses local imagery, three collection palettes, keyboard-accessible dialogs and the device’s reduced-motion preference. SIX previews support links to timestamps. Original media metadata lives in `archive-data.js`.

## Download checks

With Chrome and `playwright-core` installed:

```sh
node scripts/test-in-app-download.cjs
```

Set `PLAYWRIGHT_MODULE` to an existing module path if needed. The checks use a local server, disposable browser contexts and small intercepted attachments. They cover embedded-browser detection, multipart and provider files, clipboard fallback, focus return, credit reminders and narrow-screen fit. Captures are saved to the ignored `.review/in-app-download/` directory. Browser emulation does not replace testing on physical devices.
