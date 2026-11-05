'use strict';
const assert = require('node:assert/strict');
const { startServer, launchBrowser, blockExternal } = require('./test-helpers.cjs');

// A short in-memory audio stream exercises real media lifecycle without fetching packs.
function silentWave() {
  const samples = 8000 * 12, data = Buffer.alloc(44 + samples * 2);
  data.write('RIFF'); data.writeUInt32LE(data.length - 8, 4); data.write('WAVEfmt ', 8);
  data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(1, 22);
  data.writeUInt32LE(8000, 24); data.writeUInt32LE(16000, 28);
  data.writeUInt16LE(2, 32); data.writeUInt16LE(16, 34); data.write('data', 36); data.writeUInt32LE(samples * 2, 40);
  return data;
}
(async () => {
  const server = await startServer({ mountPath: '/noctis' });
  let browser;
  try {
    browser = await launchBrowser();
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await blockExternal(context, server.origin);
    await context.route('https://github.com/**', route => route.fulfill({ status: 200, contentType: 'audio/wav', body: silentWave() }));
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const goto = suffix => page.goto(server.baseUrl + '/cod.html' + (suffix || ''));
    const hidden = () => page.locator('#sheet').waitFor({ state: 'hidden' });
    const shown = () => page.locator('#sheet:not([hidden])').waitFor();
    const activeGame = () => page.locator('#gameSwitch [aria-selected="true"]').getAttribute('data-game');
    const openScene = async (game, index = 0) => {
      await page.locator('#tab-' + game).click();
      await page.locator(`#${game}Missions [data-scene="${index}"]`).first().click();
    };

    await goto();
    assert.deepEqual(await page.locator('#cast .tile').evaluateAll(tiles => tiles.slice(0, 6).map(tile => tile.dataset.view)), ['price', 'gaz', 'ghost', 'soap', 'cutscenes', 'trailers'], 'available collections appear before coming-soon tiles');
    assert.equal(await page.locator('.tiles-heading').textContent(), 'Coming soon');
    assert.equal(await page.evaluate(() => [...document.querySelectorAll('[aria-controls]')].every(control => control.getAttribute('aria-controls').split(/\s+/).every(id => document.getElementById(id)))), true, 'every aria-controls target is mounted, including closed scene details');
    for (const [hash, game, tabs] of [['mw4-campaign', 'mw4', '#gameSwitch'], ['mw4-trailers', 'mw4', '#trailerSwitch']]) {
      await goto('#' + hash);
      assert.equal(await page.locator(`${tabs} [aria-selected="true"]`).getAttribute('data-game'), game, 'legacy link selects its MW4 game');
    }

    await goto();
    await page.locator('.tile[href="#cutscenes"]').click();
    await openScene('mw2');
    await openScene('mw3', 1);
    await page.locator('#mw3Detail input[value="1080p"]').check();
    const selectedUrl = page.url(), params = new URL(selectedUrl).searchParams;
    assert.equal(params.get('game'), 'mw3'); assert.equal(params.get('mw3'), '02');
    assert.equal(params.has('mw2'), false); assert.equal(params.get('quality'), '1080p');
    await page.reload();
    assert.equal(await activeGame(), 'mw3', 'refresh restores the selected campaign');
    assert.equal(await page.locator('#mw3Detail input:checked').inputValue(), '1080p');
    await page.goBack(); await hidden();
    await page.goForward(); await shown();
    assert.equal(page.url(), selectedUrl, 'Forward restores the same scene and quality URL');
    assert.equal(await activeGame(), 'mw3');
    assert.equal(await page.locator('#mw3Detail').isVisible(), true);
    await page.locator('.sheet-close').click(); await hidden();
    await page.locator('.tile[href="#cutscenes"]').click(); await shown();
    assert.equal(await page.locator('.mw4-detail:visible').count(), 0, 'reopening a plain collection link clears stale scene state');
    assert.equal(new URL(page.url()).searchParams.has('mw3'), false);

    await openScene('mw1');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#sheet').isVisible(), true, 'first Escape closes only the nested scene');
    assert.equal(await page.locator('#mw1Detail').isVisible(), false);
    assert.equal(await page.locator('#mw1Missions [data-scene="0"]').first().evaluate(el => el === document.activeElement), true, 'nested Escape restores the scene trigger');
    await page.keyboard.press('Escape'); await hidden();

    await page.locator('.tile[href="#ghost"]').click(); await shown();
    const checked = page.locator('.sheet-part[data-part="ghost"] .row .seg [aria-checked="true"]').first();
    await checked.focus(); await page.keyboard.press('ArrowRight');
    assert.equal(await page.evaluate(() => document.activeElement.dataset.q), '2K');
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-checked')), 'true');
    assert.equal(await page.evaluate(() => document.activeElement.parentElement.querySelectorAll('[tabindex="0"]').length), 1, 'quality radiogroup has one tab stop');
    assert.equal(await page.locator('.skip-link').evaluate(el => el.inert), true, 'skip link outside the modal is inert');
    const lastButton = page.locator('.sheet-part[data-part="ghost"] button:visible').last();
    await lastButton.focus(); await page.keyboard.press('Tab');
    assert.equal(await page.locator('.sheet-close').evaluate(el => el === document.activeElement), true, 'Tab wraps inside the sheet');
    await page.keyboard.press('Shift+Tab');
    assert.equal(await lastButton.evaluate(el => el === document.activeElement), true, 'Shift+Tab wraps inside the sheet');
    await page.locator('.skip-link').evaluate(el => el.focus());
    assert.equal(await page.evaluate(() => sheet.contains(document.activeElement)), true, 'focus stays inside the modal');
    await page.locator('.sheet-close').click(); await hidden();
    assert.equal(await page.locator('.skip-link').evaluate(el => el.inert), false);

    await page.locator('.tile[href="#cutscenes"]').click(); await openScene('mw1');
    await page.locator('#mw1Detail .mw4-play').click();
    await page.waitForFunction(() => { const video = document.querySelector('.mw4-video'); return video && !video.paused && video.readyState >= 2; });
    await page.evaluate(() => { window.lastPreview = document.querySelector('.mw4-video'); });
    await page.locator('#tab-mw2').click();
    assert.equal(await page.evaluate(() => lastPreview.paused && !lastPreview.isConnected && lastPreview.getAttribute('src') === null), true, 'switching campaign stops and unloads the real media stream');
    await openScene('mw2'); await page.locator('#mw2Detail .mw4-play').click();
    await page.waitForFunction(() => { const video = document.querySelector('.mw4-video'); return video && !video.paused && video.readyState >= 2; });
    await page.evaluate(() => { window.lastPreview = document.querySelector('.mw4-video'); });
    await page.locator('.sheet-close').click(); await hidden();
    assert.equal(await page.evaluate(() => lastPreview.paused && !lastPreview.isConnected && lastPreview.getAttribute('src') === null), true, 'closing the collection stops and unloads media');

    // Closing and immediately reopening must wait for the pending history step.
    await page.locator('.tile[href="#cutscenes"]').click();
    await page.evaluate(() => { document.querySelector('.sheet-close').click(); document.querySelector('.tile[href="#ghost"]').click(); });
    await page.waitForFunction(() => location.hash === '#ghost' && !sheet.hidden);
    assert.equal(await page.locator('#main').evaluate(el => el.inert), true);
    assert.equal(await page.locator('.sheet-title').textContent(), 'Ghost');

    await goto('#cutscenes');
    const combinations = await page.evaluate(() => {
      let selected, actions = 0; const failures = [];
      archive.askFile = file => { selected = file; };
      for (const game of ['mw1', 'mw2', 'mw3', 'mw4']) {
        document.querySelector('#tab-' + game).click();
        const packs = COD_PACKS.filter(pack => pack.id === game + '-campaign-individual' || game === 'mw4' && pack.id === 'mw4-recap');
        let index = 0;
        for (const pack of packs) for (let i = 0; i < pack.editions['4K'].files.length; i++, index++) {
          document.querySelector(`#${game}Missions [data-scene="${index}"]`).click();
          for (const quality of ['4K', '2K', '1080p']) {
            const input = document.querySelector(`#${game}Detail input[value="${quality}"]`);
            input.checked = true; input.dispatchEvent(new Event('change', { bubbles: true }));
            document.querySelector(`#${game}Detail .mw4-download`).click();
            const expected = pack.editions[quality].files[i]; actions++;
            if (selected?.url !== expected.url || selected?.resolution !== expected.resolution) failures.push({ game, index, quality });
          }
        }
      }
      return { actions, failures };
    });
    assert.equal(combinations.actions, 249); assert.deepEqual(combinations.failures, [], 'all 83 scenes retain their three exact download editions');
    assert.deepEqual(errors, [], 'no runtime errors');
    console.log('PASS: campaign URL/history, preview lifecycle, nested Escape, modal focus, quality keyboard controls, legacy links and 249 downloads');
  } finally {
    await browser?.close(); await server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
