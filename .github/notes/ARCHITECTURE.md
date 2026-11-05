# Architecture

Ocean’s Scenepacks is a static site hosted by GitHub Pages from the root of `main`. No compilation, application server or database is required. Keep public HTML pages at the root so existing links continue to work.

## Public pages

| Page | Purpose |
| --- | --- |
| `index.html` | Collection chooser |
| `cod.html` | Character packs, gameplay, campaign scenes and trailers |
| `six.html` | Joe Graves scene packs and previews |
| `quality.html` | Resolution, frame rate and file-format information |
| `maintenance.html` | Optional maintenance notice |
| `404.html` | Recovery links for missing addresses |

## Source layout

| Location | Responsibility |
| --- | --- |
| `assets/data/archive-data.js` | `COD_PACKS`, SIX `EPISODES`, file URLs and edition metadata |
| `assets/data/mw4-data.js` | MW4 campaign scenes, recap and their editions |
| `assets/data/cuts-data.js` | Modern Warfare I–III individual campaign scenes |
| `assets/js/cod-page.js` | COD tiles, character rows, edition controls and game tabs |
| `assets/js/six-page.js` | SIX episode rows |
| `assets/js/shelf.js` | COD collection sheets, URL routing and focus handling |
| `assets/js/mw4-missions.js` | Shared mission grid and inline campaign preview |
| `assets/js/site.js` | Download flow, in-app browser notice and COD pack preview |
| `assets/js/player.js` | SIX player, multipart previews and timestamp links |
| `assets/js/credit.js` | Credit reminder after a download starts |
| `assets/js/ui.js`, `assets/js/motion.js` | Shared controls and motion |
| `assets/js/arrival.js` | Maintenance routing and page-entry setup |
| `assets/js/count.js` | Visit and download-click events sent to GoatCounter |
| `assets/css/` | Base styles followed by page-specific styles and `clean.css` overrides |
| `assets/images/` | Covers, scene posters, icons, fonts and provenance records |
| `tests/` | Static validation and browser regression checks |
| `tools/` | Supporting maintenance scripts |
| `.github/notes/` | Contributor and maintenance notes |

## Loading and data flow

Scripts use the order declared in each HTML page. Data files load before the scripts that render their controls. COD campaign data extends `COD_PACKS`; page rendering then creates the rows that the download and preview handlers use. Preserve that dependency order when changing script tags.

A character pack contains its base files and optional `editions` keyed by `4K`, `2K` and `1080p`. An edition supplies its own file list, size and resolution. Files with `direct: false` open the provider’s page rather than an embedded video preview. Campaign scene editions must contain matching scene entries in the same order.

The mission grid reuses the campaign data for all four games. Its preview streams the 1080p edition only after a visitor presses Play; the selected download edition can remain 4K or 2K. SIX uses `EPISODES`, with `parts` for split files.

## Navigation and media

COD sheets have hash addresses such as `cod.html#ghost` and `cod.html#cutscenes`. Campaign scenes and quality use query parameters. SIX preview links retain their scene, part and timestamp in the hash. Browser Back, close actions and direct links must agree with the visible state.

Master media stays on GitHub Releases or Google Drive. Optional preview and caption fields are documented in [Media](MEDIA.md). Do not move release files as part of a site asset refactor. Each HTML page has a Content Security Policy; asset or provider changes must remain compatible with it. The site uses local fonts and supports `prefers-reduced-motion`.

GoatCounter is called by the local `count.js` script. Automated browsers and localhost are excluded; visits can also be excluded in a browser by opening a page with `#nocount`.
