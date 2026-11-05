'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { projectRoot, sourcePath } = require('./test-helpers.cjs');
const read = filename => fs.readFileSync(filename, 'utf8');
const publicPages = fs.readdirSync(projectRoot).filter(name => name.endsWith('.html'));
const duration = value => value.split(':').reduce((sum, item) => sum * 60 + Number(item), 0);
const context = vm.createContext({});
for (const filename of ['archive-data.js', 'mw4-data.js', 'cuts-data.js']) {
  vm.runInContext(read(sourcePath(filename, 'data')), context, { filename, timeout: 1000 });
}
const { COD_PACKS, EPISODES, SHOTS } = JSON.parse(vm.runInContext('JSON.stringify({ COD_PACKS, EPISODES, SHOTS })', context));

function localReference(reference, parent) {
  if (!reference || /^(?:#|data:|mailto:|tel:|javascript:)/i.test(reference)) return;
  let pathname;
  if (/^https?:/i.test(reference)) {
    const url = new URL(reference);
    if (url.origin !== 'https://qstrx.github.io' || !url.pathname.startsWith('/noctis/')) return;
    pathname = url.pathname.slice('/noctis/'.length);
    parent = projectRoot;
  } else {
    pathname = reference.split(/[?#]/)[0];
    if (pathname.startsWith('/noctis/')) { pathname = pathname.slice('/noctis/'.length); parent = projectRoot; }
    else if (pathname.startsWith('/')) { pathname = pathname.slice(1); parent = projectRoot; }
  }
  if (!pathname || pathname.endsWith('/')) pathname += 'index.html';
  const resolved = path.resolve(parent, decodeURIComponent(pathname));
  assert(resolved.startsWith(projectRoot + path.sep), `reference stays inside public root: ${reference}`);
  assert(fs.existsSync(resolved), `missing local reference: ${path.relative(projectRoot, parent)} → ${reference}`);
}

test('HTML documents and social previews reference existing local assets', () => {
  for (const name of publicPages) {
    const html = read(path.join(projectRoot, name));
    assert.match(html, /<html\b[^>]*\blang=["'][a-z-]+["']/i, `${name} declares a language`);
    assert.match(html, /<title>[^<]+<\/title>/i, `${name} has a title`);
    assert.match(html, /name=["']viewport["']/i, `${name} declares a viewport`);
    for (const match of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)) localReference(match[1], projectRoot);
    for (const match of html.matchAll(/<meta\b[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/gi)) localReference(match[1], projectRoot);
    for (const match of html.matchAll(/url\(["']?([^)'"\s]+)["']?\)/gi)) localReference(match[1], projectRoot);
  }
});

test('CSS font and image URLs resolve after asset moves', () => {
  const directory = fs.existsSync(path.join(projectRoot, 'assets/css')) ? path.join(projectRoot, 'assets/css') : projectRoot;
  for (const name of fs.readdirSync(directory).filter(name => name.endsWith('.css'))) {
    for (const match of read(path.join(directory, name)).matchAll(/url\(["']?([^)'"\s]+)["']?\)/gi)) localReference(match[1], directory);
  }
});

test('classic browser scripts remain valid JavaScript', () => {
  for (const group of ['js', 'data']) {
    const directory = fs.existsSync(path.join(projectRoot, 'assets', group)) ? path.join(projectRoot, 'assets', group) : projectRoot;
    for (const name of fs.readdirSync(directory).filter(name => name.endsWith('.js'))) {
      assert.doesNotThrow(() => new vm.Script(read(path.join(directory, name)), { filename: name }), name + ' syntax');
    }
  }
});

test('catalog IDs, image paths, file URLs and direct download sizes are valid', () => {
  assert(COD_PACKS.length > 0, 'catalog contains packs');
  assert(Object.values(EPISODES).every(episodes => episodes.length > 0), 'each season contains episodes');
  assert.equal(new Set(COD_PACKS.map(pack => pack.id)).size, COD_PACKS.length, 'pack IDs are unique');
  const validateImage = object => {
    for (const value of Object.values(object)) {
      if (value && typeof value === 'object') validateImage(value);
      else if (typeof value === 'string' && /\.(?:jpe?g|png|webp|svg)$/i.test(value)) localReference(value, projectRoot);
    }
  };
  const validateFile = (file, label) => {
    const url = new URL(file.url);
    assert.equal(url.protocol, 'https:', label + ' uses HTTPS');
    if (file.direct === false) {
      assert.equal(url.hostname, 'drive.google.com', label + ' retains its provider page');
      return;
    }
    assert.equal(url.hostname, 'github.com', label + ' is a GitHub release download');
    assert.match(url.pathname, /^\/Qstrx\/noctis\/releases\/download\/.+\.mp4$/, label + ' has a stable release path');
    assert.match(file.run, /^(?:\d+:)?\d{1,2}:\d{2}$/, label + ' duration');
    const size = /^(\d+(?:\.\d+)?)\s+(GB|MB)$/.exec(file.size);
    assert(size, label + ' formatted size');
    assert(Number(size[1]) * (size[2] === 'GB' ? 1000 : 1) < 2000, label + ' individual direct file stays below 2 GB');
  };
  for (const pack of COD_PACKS) {
    assert(pack.files.length > 0, pack.id + ' has files');
    validateImage(pack);
    for (const edition of [pack, ...Object.values(pack.editions || {})]) {
      assert.equal(new Set(edition.files.map(file => file.url)).size, edition.files.length, pack.id + ': no repeated files within an edition');
      for (const file of edition.files) validateFile(file, pack.id + ': ' + file.name);
      if (edition.meta && edition.files.every(file => file.run)) {
        // Displayed durations round each individual file to seconds.
        const displayed = duration(edition.meta.split(' · ')[0]);
        const total = edition.files.reduce((sum, file) => sum + duration(file.run), 0);
        assert(Math.abs(displayed - total) <= edition.files.length, pack.id + ' duration matches file totals within rounding');
      }
    }
  }
  for (const [season, episodes] of Object.entries(EPISODES)) {
    assert.equal(new Set(episodes.map(episode => episode.ep)).size, episodes.length, 'unique episode numbers in season ' + season);
    for (const episode of episodes) {
      localReference(SHOTS[season] + String(episode.ep).padStart(2, '0') + '.jpg', projectRoot);
      for (const file of episode.parts || [episode]) validateFile(file, `S${season}E${episode.ep}`);
      if (episode.parts) assert.equal(episode.parts.reduce((sum, part) => sum + duration(part.run), 0), duration(episode.run), 'episode duration equals all parts');
    }
  }
});

test('all editions preserve scene order, names, durations and complete file counts', () => {
  for (const pack of COD_PACKS.filter(pack => pack.editions)) {
    for (const [quality, edition] of Object.entries(pack.editions)) {
      assert.equal(edition.files.length, pack.files.length, `${pack.id} ${quality}: complete set`);
      edition.files.forEach((file, index) => {
        for (const property of ['scene', 'name', 'run']) assert.equal(file[property], pack.files[index][property], `${pack.id} ${quality} file ${index}: ${property}`);
        assert.notEqual(file.url, '', 'edition URL is present');
      });
    }
  }
});
