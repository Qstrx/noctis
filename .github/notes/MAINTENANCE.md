# Maintenance

## Local checks

Run `npm run dev` and open `http://127.0.0.1:8765/noctis/` to match the production base path. Before submitting a change, run:

```sh
npm ci
npm test
npx playwright install chromium
npm run test:e2e
```

On Linux, Playwright may need system dependencies: use `npx playwright install --with-deps chromium` in a suitable development environment. GitHub Actions installs these dependencies before browser tests.

Check a small phone viewport and a desktop viewport. For a change to scene navigation, also open a direct scene link, switch games and quality, use Back/Forward, and close with Escape. For media changes, test the relevant provider manually without downloading unrelated large files. Browser emulation does not establish compatibility with physical iPhones, Android devices or in-app browsers.

## Add or update a pack

1. Publish the intended files on GitHub Releases or the provider. Preserve existing download URLs whenever possible.
2. Update `assets/data/archive-data.js` for character packs, gameplay, trailers or SIX episodes. Update `assets/data/mw4-data.js` or `assets/data/cuts-data.js` for individual campaign scenes.
3. Supply an existing poster under `assets/images/`, the actual duration and file size, resolution and frame rate. Put alternative versions under `editions`. Use `direct: false` for provider pages such as Drive.
4. Keep scene identity and order aligned across all campaign editions. Confirm that each preview points to the intended scene and that changing quality selects the intended file.
5. Update `quality.html` when supported formats or size limits change. Complete campaign files on Drive exceed 2 GB; do not claim that every file on the site is below that limit.
6. Run the checks and verify the edited pack in the local browser.

MW4 campaign previews use the 1080p edition on explicit play. Choosing a download resolution should not start a larger preview. Preserve original framing, frame rate and audio metadata when updating these entries; document intentional silent clips accurately.

## Open or lock a COD section

`OPEN` in `assets/js/cod-page.js` lists the available sections. A section omitted from that list appears locked. Add a section only when its data, cover and interactions are ready. Locked cover images live in `assets/images/locked/`.

There is no `earlyAccess` setting. The home, SIX and Quality pages are independent public pages.

## Maintenance notice

`maintenance` in `assets/js/arrival.js` controls routing to `maintenance.html`. It is normally `false`. While enabled, opening a page with `#open` stores an owner-preview flag in that browser; `#closed` removes it. This is a convenience for previewing a static site, not access control. Restore the flag to `false` when reopening the site.

## Assets and cache versions

Keep CSS in `assets/css/`, application scripts in `assets/js/`, metadata in `assets/data/` and media artwork in `assets/images/`. CSS image and font URLs are relative to the stylesheet; HTML and data references are resolved from the public page. Run the static checks after moving an asset.

When changing a versioned script or stylesheet, update its `?v=` reference in every affected HTML page. The site is served from the `/noctis/` project path, so verify links there as well as on localhost. Preserve existing page addresses and release URLs.

Record third-party artwork sources alongside the assets. MW4 poster records live at `assets/images/cod/mw4/scenes/sources.json`; update provenance and hashes if those posters change. Keep bundled license files with the corresponding assets.

## Publishing

GitHub Pages publishes the root of `main`. The CI workflow validates changes; it does not deploy or alter the Pages configuration. After a checked change reaches `main`, verify the public pages and an edited direct link after Pages finishes publishing. If a bad change is published, revert the relevant commit through the normal review workflow.

Generated screenshots, test results, local download reports and `node_modules/` are ignored. Large video files belong in the existing release/provider storage rather than the source tree.
