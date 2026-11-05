# Ocean’s Scenepacks

[![Checks](https://github.com/Qstrx/noctis/actions/workflows/ci.yml/badge.svg)](https://github.com/Qstrx/noctis/actions/workflows/ci.yml)

Scene packs for video editors, published at **[qstrx.github.io/noctis](https://qstrx.github.io/noctis/)**.

- **Call of Duty:** character packs, gameplay, campaign cutscenes and trailers from Modern Warfare through Modern Warfare 4. Available editions include 4K, 2K and 1080p.
- **SIX:** Joe Graves scene packs from eight Season 1 and ten Season 2 episodes. These are selected character scenes, not full episodes.

Previews play on request. Downloads use GitHub Releases or Google Drive; split packs let visitors select a part. Mobile in-app browsers receive instructions to open Safari or Chrome. Individual GitHub files stay below 2 GB; complete campaigns on Drive are larger.

## Run locally

The site is plain HTML, CSS and JavaScript. There is no build step or backend.

```sh
npm run dev
```

Open [localhost:8765/noctis/](http://127.0.0.1:8765/noctis/). Node.js 22.12 or newer runs the local server; no dependencies are needed to serve the site. GitHub Pages serves the root of `main`; the HTML page addresses remain stable.

## Check changes

Use Node.js 22.12+ and npm to install the development tools:

```sh
npm ci
npm test
npx playwright install chromium
npm run test:e2e
```

Browser tests use local pages, disposable contexts and intercepted test attachments. They do not download the original multi-gigabyte videos. GitHub Actions runs the checks on pushes and pull requests.

## Repository layout

```text
*.html                 Public pages at their existing addresses
assets/css/            Shared and page-specific styles
assets/js/             Navigation, players, downloads and motion
assets/data/           Pack metadata, editions and media URLs
assets/images/         Images, icons, local fonts and provenance
tests/                 Static checks and browser regression tests
tools/                 Maintenance utilities
docs/                  Architecture and maintenance notes
```

See [Architecture](docs/ARCHITECTURE.md), [Maintenance](docs/MAINTENANCE.md), [Media and captions](docs/MEDIA.md) and [Contributing](CONTRIBUTING.md) for the implementation and update workflow.

The latest audit corrections and validation are recorded in [Audit fixes](docs/AUDIT_FIXES.md).

## Credits

The navigation underline incorporates work from AuroraGrab under the [MIT license](LICENSE-AuroraGrab). Bundled fonts retain their [SIL Open Font License](assets/images/fonts/OFL.txt). [Character sources](docs/IMAGE_SOURCES.md), [logo sources](assets/images/cod/logos/README.md) and [MW4 poster provenance](assets/images/cod/mw4/scenes/sources.json) are recorded alongside the assets. Game and television content belongs to its respective rights holders; these notices do not grant a license to that content.
