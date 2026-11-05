# Audit fixes — 5 November 2026

This update fixes the eleven findings from the site audit and organizes the source without changing public page addresses or existing media download destinations.

| Finding | Change |
| --- | --- |
| Hidden campaign playback | Stop and unload the media when changing campaign, closing the collection, or hiding the document |
| Conflicting scene URLs | One campaign/scene/quality route, normalized on direct load, tab change and history navigation |
| Escape closes two layers | The nested scene handles Escape before the collection; focus returns to the trigger |
| Focus leaves the modal | Outside content is inert, with focus containment and Tab wrapping |
| Low contrast metadata | Readable secondary colors and download sizes; reduced motion no longer creates an unintended visibility transition |
| Incorrect file-size promise | Quality distinguishes individual GitHub files from the larger Drive campaigns and lists actual available editions |
| Legacy MW4 links | Resolve both collection and MW4 game tab |
| Quality radio keyboard behavior | Arrow/Home/End selection and a single tab stop |
| Invalid ARIA references | Scene detail targets remain mounted while hidden; expanded states and visible label names stay synchronized |
| Stale browser tests | Current selectors, shared local server, reproducible pinned dependencies and CI |
| Outdated early-access instructions | README and maintenance documentation describe the real configuration |

Dunn and Ko Jin Hyuk now use verified character portraits. Their full covers and locked thumbnails have recorded sources and checksums in [Image sources](IMAGE_SOURCES.md). Available COD collections appear before a separate Coming soon group.

Public source is split into `assets/css`, `assets/js`, `assets/data` and `assets/images`. Checks are in `tests`, the local server is in `tools`, and contributor information is in `.github/notes`. GitHub Pages still publishes the branch root; `_config.yml` excludes development files from the existing Jekyll publication. Release files were not moved.

Canonical URLs, a sitemap, a recovery 404 page and clearer SIX scene-pack context are included. Players support optional separate previews and local caption tracks, documented in [Media](MEDIA.md). No compressed preview media or completed captions are claimed: those assets must be encoded or authored and verified before their optional fields are added.

## Validation

```sh
npm ci
npm test
npx playwright install --with-deps chromium
npm run test:e2e
```

The update passed six static checks and all four browser suites. Coverage includes the 47 in-app/download assertions, navigation by keyboard and touch, URL/history regressions, real media lifecycle with a tiny intercepted stream, all 249 campaign scene/quality download choices and eighteen axe page/dialog states under the production `/noctis/` prefix. No original multi-gigabyte master was downloaded by the tests.

Physical mobile devices, their actual in-app browsers and complete playback of every master remain separate manual compatibility checks. Automated accessibility checks supplement keyboard checks; they are not a substitute for a complete assistive-technology review.
