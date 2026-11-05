# Contributing

Use a focused branch and describe the visible problem your change fixes. Include a reproducible URL and steps for navigation or media bugs. Please do not include private account information in screenshots or issue reports.

## Development

The public site needs only a static server:

```sh
npm run dev
```

Install the development tools and run the checks before opening a pull request:

```sh
npm ci
npm test
npx playwright install chromium
npm run test:e2e
```

Keep root HTML page addresses stable. Place application code in `assets/js/`, styles in `assets/css/`, metadata in `assets/data/` and artwork in `assets/images/`. See [Architecture](docs/ARCHITECTURE.md) and [Maintenance](docs/MAINTENANCE.md) for script dependencies and content updates.

For an interaction change, verify keyboard access, focus return, Back/Forward, reduced motion and a narrow viewport. Add a regression check when the behavior is significant enough to break a user flow. Tests should use small intercepted attachments rather than the original large videos.

Do not commit downloaded videos, dependencies or generated test output. Preserve third-party licenses and asset provenance. A new dependency should solve a concrete need without adding a build requirement to the public site.

In the pull request, explain the resulting behavior, relevant validation and any remaining limitation. Changes to hosting, access or published media destinations should be called out explicitly.
