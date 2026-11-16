<a href="https://qstrx.github.io/noctis/">
  <img src=".github/media/cover.svg" alt="Ocean’s Scenepacks — a little archive for your next edit. Call of Duty and SIX, curated by @oceanxaep." width="1280">
</a>

<p align="center">
  <a href="https://qstrx.github.io/noctis/"><strong>Explore the archive →</strong></a>
  &nbsp; · &nbsp;
  <a href="https://qstrx.github.io/noctis/quality.html">Quality guide</a>
  &nbsp; · &nbsp;
  <a href="https://github.com/Qstrx/noctis/issues/new/choose">Leave a note</a>
</p>

<p align="center">
  Scene packs, cutscenes and trailers for your next edit.<br>
  <sub>Up to 4K · No watermark · No sign-in</sub>
</p>

<br>

<a href="https://qstrx.github.io/noctis/">
  <img src=".github/media/preview.webp" alt="The archive homepage: Ghost’s Call of Duty collection beside Joe Graves from SIX, with Farah and Graves featured below." width="1280">
</a>

## The collections

| 01 / Call of Duty | 02 / SIX |
| :--- | :--- |
| Character packs, campaign cutscenes, gameplay and trailers. | Joe Graves, seasons 1–2. Scene packs organised by episode. |
| [Open collection →](https://qstrx.github.io/noctis/cod.html) | [Open collection →](https://qstrx.github.io/noctis/six.html) |

Choose a collection, open a pack and pick your quality. Preview supported files before downloading; some files open on their provider’s page.

<br>

<details>
<summary><strong>Behind the archive</strong> — local setup, project map &amp; notes</summary>

### Run it locally

The archive is a static site built with HTML, CSS and JavaScript. No build step is needed. Use **Node.js 22.12 or later** for the local tools.

```sh
git clone https://github.com/Qstrx/noctis.git
cd noctis
npm run dev
```

Open **[localhost:8765/noctis/](http://localhost:8765/noctis/)**. The local server has no dependencies.

### Find your way around

| Location | What lives here |
| :--- | :--- |
| Root HTML pages | Home, collections and quality guide |
| [`assets/css/`](assets/css/) | Layout, colour and motion |
| [`assets/js/`](assets/js/) | Navigation, previews and downloads |
| [`assets/data/`](assets/data/) | Packs, episodes and file metadata |
| [`tests/`](tests/) | Static and browser checks |
| [`.github/notes/`](.github/notes/) | Maintenance and contributor notes |

Master videos live in GitHub Releases or on their existing provider. GitHub Pages publishes the site from `main`.

### Check a change

```sh
npm ci
npm test
npx playwright install chromium
npm run test:e2e
```

Read the [contribution guide](.github/CONTRIBUTING.md), [maintenance notes](.github/notes/MAINTENANCE.md) or [architecture overview](.github/notes/ARCHITECTURE.md) for more. The [artwork sources](.github/notes/IMAGE_SOURCES.md) and bundled asset licences stay with the project.

</details>

<br>

---

<p align="center">
  Made by <a href="https://www.tiktok.com/@oceanxaep"><strong>@oceanxaep</strong></a>.<br>
  <sub>Please credit when you create.</sub>
</p>
