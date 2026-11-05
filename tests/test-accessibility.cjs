'use strict';
// Exercise rendered pages and dialogs under the GitHub Pages project prefix.
// Media is blocked: these checks never download the original videos.
const assert = require('node:assert/strict');
const AxeBuilder = require('@axe-core/playwright').default;
const { startServer, launchBrowser, blockExternal } = require('./test-helpers.cjs');

(async () => {
  const server = await startServer({ mountPath: '/noctis' });
  let browser;
  try {
    browser = await launchBrowser();
    const errors = [];
    const violations = [];
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    await blockExternal(context, server.origin);
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    const audit = async label => {
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      for (const violation of result.violations) violations.push({ label, id: violation.id, nodes: violation.nodes.map(node => ({ target: node.target, failure: node.failureSummary })) });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), label + ': no horizontal page overflow');
      console.log(`CHECK: ${label}`);
    };
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 844 });
      for (const route of ['index.html', 'quality.html', '404.html', 'maintenance.html', 'cod.html#price', 'cod.html#cutscenes']) {
        await page.goto(server.baseUrl + '/' + route);
        await audit(`${width}px ${route}`);
      }
    }
    await page.goto(server.baseUrl + '/cod.html#price');
    await page.locator('.sheet-part[data-part=price] [data-cod-preview]').first().click();
    await page.locator('#codPreview[open]').waitFor();
    await page.locator('#codPreviewError:not([hidden])').waitFor();
    await audit('Call of Duty preview and unavailable media fallback');
    await page.keyboard.press('Escape');
    await page.goto(server.baseUrl + '/cod.html#cutscenes');
    await page.locator('#mw1Missions .mw4-mission-cover').first().click();
    await audit('campaign scene detail');
    await page.locator('#mw1Detail .mw4-download').click();
    await page.locator('#hit[open]').waitFor();
    await audit('campaign download dialog');
    await page.keyboard.press('Escape');
    await page.goto(server.baseUrl + '/six.html');
    await audit('SIX episode catalog');
    await page.locator('[data-preview][data-season="1"][data-episode="1"]').click();
    await page.locator('#preview[open]').waitFor();
    await page.locator('#previewError:not([hidden])').waitFor();
    await audit('SIX preview and unavailable media fallback');
    await page.keyboard.press('Escape');
    await page.locator('[data-download-episode="5"][data-season="1"]').click();
    await page.locator('#hit[open]').waitFor();
    await audit('SIX multipart download dialog');
    assert.deepEqual(errors, [], 'no uncaught page errors');
    assert.deepEqual(violations, [], 'no automated WCAG A/AA violations in the sampled pages and dialogs');
    console.log('PASS: project-prefix navigation, rendered labels, contrast, ARIA and dialogs');
  } finally { await browser?.close(); await server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
