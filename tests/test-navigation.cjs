'use strict';
// Walk the public navigation with pointer, keyboard, history and touch.
const assert = require('node:assert/strict');
const { startServer, launchBrowser, blockExternal, devices } = require('./test-helpers.cjs');
(async () => {
  const server = await startServer();
  let browser;
  try {
    browser = await launchBrowser();
    const errors = [];
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await blockExternal(context, server.origin);
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(server.origin + '/index.html');
    await page.locator('.door[href="cod.html"]').click();
    await page.waitForURL('**/cod.html');
    assert.equal(await page.locator('#cast .tile').count(), 15, 'home opens all collection tiles');
    await page.locator('.tile[href="#ghost"]').click();
    await page.locator('#sheet:not([hidden])').waitFor();
    assert.equal(await page.locator('.sheet-pic img').getAttribute('src'), await page.locator('.tile[href="#ghost"] img').getAttribute('src'), 'sheet keeps tile artwork');
    assert.equal(await page.locator('#main').evaluate(el => getComputedStyle(el).visibility), 'hidden', 'background is hidden');
    await page.locator('.sheet-close').click();
    await page.locator('#sheet').waitFor({ state: 'hidden' });
    await page.waitForFunction(() => !location.hash);
    await page.locator('.tile[href="#cutscenes"]').click();
    await page.locator('#tab-mw2').click();
    await page.locator('#mw2Missions .mw4-mission-cover').first().click();
    await page.locator('#mw2Detail input[value="2K"]').check();
    await page.locator('.sheet-close').click();
    await page.locator('#sheet').waitFor({ state: 'hidden' });
    await page.waitForFunction(() => !location.hash);
    await page.locator('.tile[href="#cutscenes"]').click();
    await page.goBack();
    await page.locator('#sheet').waitFor({ state: 'hidden' });
    await page.locator('.tile.is-locked').first().evaluate(el => el.click());
    assert.equal(await page.locator('#sheet').isVisible(), false, 'locked tile does not open');
    await page.locator('.tile[href="#ghost"]').focus();
    await page.keyboard.press('Enter');
    await page.locator('#sheet:not([hidden])').waitFor();
    await page.keyboard.press('Escape');
    await page.locator('#sheet').waitFor({ state: 'hidden' });
    assert.equal(await page.locator('.tile[href="#ghost"]').evaluate(el => el === document.activeElement), true, 'Escape restores tile focus');
    const phone = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' });
    await blockExternal(phone, server.origin);
    const touch = await phone.newPage();
    touch.on('pageerror', error => errors.push(error.message));
    await touch.goto(server.origin + '/cod.html');
    await touch.locator('.tile[href="#gaz"]').tap();
    await touch.locator('#sheet:not([hidden])').waitFor();
    assert.equal(new URL(touch.url()).hash, '#gaz', 'touch opens Gaz');
    assert.deepEqual(errors, [], 'no page errors');
    console.log('PASS: collection navigation, history, keyboard, locked tiles and touch');
  } finally {
    await browser?.close();
    await server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
