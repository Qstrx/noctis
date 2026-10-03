'use strict';
// Run with playwright-core installed, or set PLAYWRIGHT_MODULE to its path.
// Uses a local static server, disposable Chrome contexts and tiny intercepted
// attachments. No original video payload is fetched.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const root = path.resolve(__dirname, '..');
const captureDir = path.join(root, '.review/in-app-download');
const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)';
const android = 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko)';
const desktop = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const tiktok = `${iphone} Mobile/15E148 musical_ly_2026000000 JsSdk/2.0 BytedanceWebview/1.0`;
let assertions = 0;
const check = (condition, message) => { assert(condition, message); assertions++; console.log(`PASS: ${message}`); };
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const filename = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(filename, (error, content) => {
    if (error) res.writeHead(404).end();
    else res.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream' }).end(content);
  });
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const errors = [];
  const open = async (ua, route = 'six.html', extra = {}) => {
    const context = await browser.newContext({ userAgent: ua, viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', ...extra });
    const external = [];
    await context.route('**/*', async request => {
      if (new URL(request.request().url()).origin === origin) return request.continue();
      external.push(request.request().url());
      if (request.request().url().includes('/releases/download/')) return request.fulfill({ status: 200, headers: { 'Content-Type': 'application/octet-stream', 'Content-Disposition': 'attachment; filename="test.mp4"' }, body: 'intercepted test attachment' });
      return request.abort();
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${origin}/${route}`, { referer: 'https://www.tiktok.com/', waitUntil: 'load' });
    return { context, page, external };
  };
  const download = '[data-download-episode="1"][data-season="1"]';
  try {
    for (const [name, ua] of [
      ['TikTok iPhone', tiktok],
      ['TikTok Android', `${android} Version/4.0 Chrome/140.0.0.0 Mobile Safari/537.36 musical_ly`],
      ['Instagram iPhone', `${iphone} Mobile/15E148 Instagram 400.0.0`],
      ['Facebook Android', `${android} Chrome/140.0.0.0 Mobile Safari/537.36 [FBAN/FB4A;FBAV/1]`],
      ['Android WebView', `${android.replace('Pixel 9)', 'Pixel 9; wv)')} Version/4.0 Chrome/140.0.0.0 Mobile Safari/537.36`],
      ['iOS WebView', `${iphone} Mobile/15E148`]
    ]) {
      const { page, context, external } = await open(ua);
      await page.locator(download).click();
      check(await page.locator('#browserNotice').isVisible(), `${name}: Download opens browser instructions`);
      check(!await page.locator('#hit').isVisible() && !await page.locator('#creditScreen').count() && external.length === 0, `${name}: no file navigation or credit screen is started`);
      await page.keyboard.press('Escape');
      check(await page.locator(download).evaluate(el => el === document.activeElement), `${name}: Escape restores the download button`);
      await context.close();
    }
    for (const [name, ua] of [
      ['Safari iPhone', `${iphone} Version/18.0 Mobile/15E148 Safari/604.1`],
      ['Chrome Android', `${android} Chrome/140.0.0.0 Mobile Safari/537.36`],
      ['Chrome iPhone', `${iphone} CriOS/140.0.0.0 Mobile/15E148 Safari/604.1`],
      ['Firefox iPhone', `${iphone} FxiOS/140.0 Mobile/15E148 Safari/605.1.15`],
      ['Chrome desktop', desktop],
      ['Desktop with app token', `${desktop} TikTok`]
    ]) {
      const { page, context } = await open(ua);
      await page.locator(download).click();
      check(await page.locator('#hit').isVisible() && !await page.locator('#browserNotice').count(), `${name}: a TikTok referrer does not block the normal download panel`);
      await context.close();
    }
    for (const [route, selector] of [['cod.html', '[data-download-pack="mw1"]'], ['cod.html', '[data-download-pack="cuts1"]'], ['six.html', '[data-download-episode="5"][data-season="1"]']]) {
      const { page, context, external } = await open(tiktok, route);
      await page.locator(selector).click();
      check(await page.locator('#browserNotice').isVisible() && external.length === 0, `${route} ${selector}: multipart/provider downloads use the same guard`);
      await page.evaluate(() => {
        window.__copiedLink = '';
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.__copiedLink = text; } } });
      });
      await page.locator('#browserNoticeCopy').click();
      await page.waitForFunction(() => document.querySelector('#browserNoticeStatus').textContent.startsWith('Link copied.'));
      check(await page.evaluate(() => window.__copiedLink === location.href), `${route}: copy uses the website link, not a video URL`);
      const dialog = await page.locator('#browserNotice').evaluate(el => { const r = el.getBoundingClientRect(); return { width: r.width, height: r.height, x: r.x, y: r.y, viewport: innerHeight, overflow: document.documentElement.scrollWidth > innerWidth }; });
      check(dialog.x >= 0 && dialog.y >= 0 && dialog.y + dialog.height <= dialog.viewport + 1 && !dialog.overflow, `${route}: warning fits the phone viewport`);
      if (selector.includes('mw1') || selector.includes('episode="5"')) await page.screenshot({ path: path.join(captureDir, `${route.replace('.html', '')}-in-app-phone.png`) });
      await page.locator('.browser-notice-close').click();
      await page.locator(selector).click();
      check(await page.locator('#browserNotice').count() === 1 && await page.locator('#browserNoticeStatus').textContent() === '', `${route}: repeated attempts reuse one notice and reset copy feedback`);
      await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Denied'); } } }));
      await page.locator('#browserNoticeCopy').click();
      await page.waitForFunction(() => document.activeElement.id === 'browserNoticeUrl');
      check((await page.locator('#browserNoticeStatus').textContent()).startsWith('Touch and hold') && await page.locator('#browserNoticeUrl').evaluate(el => el.selectionEnd === el.value.length), `${route}: denied clipboard shows selected URL and manual copy instructions`);
      await context.close();
    }
    for (const [route, preview, final] of [['cod.html', '[data-cod-preview="mw1"]', '#codPreviewDownload'], ['six.html', '[data-preview][data-season="1"][data-episode="1"]', '#previewDownload']]) {
      const { page, context } = await open(tiktok, route);
      await page.locator(preview).click();
      await page.locator(final).click();
      check(await page.locator('#browserNotice').isVisible() && await page.locator('dialog[open]').count() === 1, `${route}: preview Download closes the player and opens only the warning`);
      await page.keyboard.press('Escape');
      check(await page.locator(preview).evaluate(el => el === document.activeElement), `${route}: warning restores the original preview action`);
      await context.close();
    }
    const { page, context, external } = await open(`${iphone} Version/18.0 Mobile/15E148 Safari/604.1`);
    await page.locator(download).click();
    const expected = await page.evaluate(() => EPISODES[1][0].url);
    const attachment = page.waitForEvent('download');
    await page.locator('#hitGo').click();
    await attachment;
    await page.waitForSelector('#creditScreen[open]');
    check(external.includes(expected), 'External mobile browser: Start download preserves the exact original file URL');
    check(await page.locator('#creditScreen').isVisible(), 'External mobile browser: Start download retains the credit reminder');
    await context.close();
    const compact = await open(tiktok, 'six.html', { viewport: { width: 320, height: 640 } });
    await compact.page.locator(download).click();
    check(await compact.page.locator('#browserNoticeCopy').isVisible() && await compact.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '320px: warning has no horizontal overflow and the copy action remains available');
    await compact.context.close();
    check(errors.length === 0, 'No JavaScript page errors during the walkthrough');
    console.log(`done (${assertions} assertions)`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
