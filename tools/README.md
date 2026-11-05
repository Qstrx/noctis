# Local tools

`serve.mjs` serves only public site files on loopback, with no build step or dependencies. Both `/` and the production `/noctis/` prefix work. It supports HEAD and byte-range requests for local media.

```sh
npm run dev
# Optional alternate port:
PORT=8766 npm run dev
```

Keep media masters in GitHub Releases or their existing provider, rather than committing video files to this repository. Browser test fixtures stay disposable and are intercepted in tests.
