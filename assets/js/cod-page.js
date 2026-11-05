(() => {
  'use strict';
  // Call of Duty: one tile per character, then the full cutscenes and the
  // trailers. A tile
  // opens its sheet (shelf.js): the packs from Modern Warfare to MW4, each in
  // 4K, 2K and 1080p, and for Price, Ghost and Gaz their gameplay. Everything
  // is built from COD_PACKS here, before site.js and motion.js run, so
  // Preview and Download work on these rows as on any other card.
  const cast = document.getElementById('cast');
  if (!cast || !window.Shelf || typeof COD_PACKS === 'undefined') return;

  const VIEWS = [
    { id: 'price', cover: 'assets/images/cover/price.webp', name: 'Price' },
    { id: 'gaz', cover: 'assets/images/cover/gaz.webp', coverFocus: '50% 16%', name: 'Gaz' },
    { id: 'ghost', cover: 'assets/images/cover/ghost.webp', name: 'Ghost' },
    { id: 'soap', cover: 'assets/images/cover/soap.webp', coverFocus: '50% 42%', name: 'Soap' },
    { id: 'laswell', cover: 'assets/images/cover/laswell.webp', coverFocus: '40% 40%', name: 'Laswell' },
    { id: 'farah', cover: 'assets/images/cover/farah.webp', name: 'Farah' },
    { id: 'alex', name: 'Alex' },
    { id: 'valeria', cover: 'assets/images/cover/valeria.webp', coverFocus: '50% 20%', name: 'Valeria' },
    { id: 'graves', cover: 'assets/images/cover/graves.webp', coverFocus: '50% 25%', name: 'Graves' },
    { id: 'makarov', name: 'Makarov' },
    { id: 'dunn', cover: 'assets/images/cover/dunn.webp', name: 'Dunn' },
    { id: 'archer', name: 'The Archer', still: 'assets/images/stage/archer.webp', focus: '58% 30%' },
    { id: 'ko', cover: 'assets/images/cover/ko.webp', name: 'Ko Jin Hyuk' },
    { id: 'cutscenes', name: 'Full cutscenes', still: 'assets/images/stage/cutscenes.webp', focus: '59% 40%' },
    { id: 'trailers', name: 'Trailers', still: 'assets/images/stage/trailers.webp', focus: '62% 50%' }
  ];
  const SPECIAL = ['cutscenes', 'trailers'];
  // Sections that are complete; everything else shows blurred and locked.
  const OPEN = ['price', 'gaz', 'ghost', 'soap', 'cutscenes', 'trailers'];
  const isOpen = id => OPEN.includes(id);
  // Which MW4 gameplay shows under which character. Gameplay listed under
  // nobody goes at the end of the full cutscenes.
  const GAMEPLAY = {
    price: ['gameplay-makarov', 'gameplay-graves-death', 'gameplay-price-ghost', 'gameplay-price-jail'],
    gaz: ['gameplay-price-ghost'],
    ghost: ['gameplay-price-ghost', 'gameplay-price-jail']
  };
  const YEARS = { 'Modern Warfare': 2019, 'Modern Warfare II': 2022, 'Modern Warfare III': 2023, 'Modern Warfare 4': 2026 };
  const QUALITIES = ['4K', '2K', '1080p'];
  const LOCK = '<span class="tile-lock" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span>';
  const PLAY = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 3.5 11 6.5-11 6.5z"/></svg>';
  const SAVE = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v10m-4-4 4 4 4-4M4 16h12" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const esc = text => String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const byId = id => COD_PACKS.find(pack => pack.id === id);
  const pad = n => String(n).padStart(2, '0');
  const seconds = run => run.split(':').reduce((total, part) => total * 60 + Number(part), 0);
  const clock = total => {
    const h = Math.floor(total / 3600), m = Math.floor(total / 60) % 60, s = total % 60;
    return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  };
  const runOf = pack => pack.meta.split(' · ')[0];
  const sizeOf = pack => pack.meta.split(' · ')[1];
  const qualityOf = pack => {
    const width = parseInt(pack.resolution, 10);
    return width >= 3800 ? '4K' : width >= 2500 ? '2K' : '1080p';
  };
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

  // ---------- The versions of a pack ----------
  // A pack is one version; its others sit in "editions" keyed 4K, 2K or
  // 1080p, each with its own files and meta. Every version becomes a pack of
  // its own in COD_PACKS, so the download and preview dialogs find it by id.
  function versions(pack) {
    const found = { [qualityOf(pack)]: pack };
    Object.entries(pack.editions || {}).forEach(([q, edition]) => {
      if (found[q] || !edition?.files?.length) return;
      const variant = { ...pack, ...edition, id: `${pack.id}-${q.toLowerCase()}`, editions: undefined };
      COD_PACKS.push(variant);
      found[q] = variant;
    });
    return found;
  }

  // ---------- One row ----------
  let rowNo = 0;
  const LOGOS = { 'Modern Warfare': 'assets/images/cod/logos/mw1.svg', 'Modern Warfare II': 'assets/images/cod/logos/mw2.png', 'Modern Warfare III': 'assets/images/cod/logos/mw3.png', 'Modern Warfare 4': 'assets/images/cod/logos/mw4.webp' };
  const filesOf = pack => pack.files.length === 1 ? (pack.files[0].direct === false ? 'Drive' : '1') : String(pack.files.length);
  // Every pack is a block of its own: a wide picture with the game's logo or
  // the pack's name, then its numbers, quality and download. Scene packs show
  // all three qualities, the ones still to come greyed out.
  function block(pack, { name, all = false } = {}) {
    const found = versions(pack);
    const first = QUALITIES.find(q => found[q]);
    const lightest = [...QUALITIES].reverse().find(q => found[q]);
    const label = `${pack.title}, ${pack.chapter}`;
    const key = `r${++rowNo}`;
    const logo = !name && LOGOS[pack.chapter];
    const ids = esc(JSON.stringify(Object.fromEntries(Object.entries(found).map(([q, p]) => [q, p.id]))));
    const canPreview = found[lightest].files.every(file => file.direct !== false);
    const offered = all ? QUALITIES : QUALITIES.filter(q => found[q]);
    const choice = offered.length > 1
      ? `<div class="seg" role="radiogroup" aria-label="Quality" data-pill><span class="pill"></span>${offered.map(q => found[q]
          ? `<button type="button" role="radio" aria-checked="${q === first}" tabindex="${q === first ? 0 : -1}" data-q="${q}">${q}</button>`
          : `<button type="button" role="radio" aria-checked="false" disabled title="Coming soon">${q}</button>`).join('')}</div>`
      : `<span class="row-tag">${first}</span>`;
    return `<li class="row pack-card is-game" style="--r:${rowNo % 12}" data-versions="${ids}" aria-labelledby="${key}">
      <div class="pack-cover"><span class="cover-frame"><img src="${pack.poster}" alt="" loading="lazy"></span><span class="game-shade"></span>
        <div class="game-id">${logo ? `<img src="${logo}" alt="" loading="lazy">` : `<span class="game-word">${esc(name || pack.chapter)}</span>`}<h3 class="sr-only" id="${key}">${esc(name || pack.chapter)}</h3></div>
        <span class="game-time">${runOf(pack)}</span>
        ${canPreview ? `<button class="row-play" type="button" data-cod-preview="${found[lightest].id}" aria-label="Preview ${esc(label)}"><i>${PLAY}</i></button>` : ''}</div>
      <div class="game-side">
        <dl class="game-specs"><div><dt>Size</dt><dd data-spec="size">${sizeOf(found[first])}</dd></div><div><dt>Files</dt><dd data-spec="files">${filesOf(found[first])}</dd></div></dl>
        ${choice}
        <button class="action primary" type="button" data-download-pack="${found[first].id}">${SAVE}<span class="action-label">Download</span> <span class="action-size">${sizeOf(found[first])}</span></button>
      </div>
    </li>`;
  }
  function setVersion(rowEl, q) {
    const pack = byId(JSON.parse(rowEl.dataset.versions)[q]);
    if (!pack) return;
    rowEl.querySelectorAll('.seg [data-q]').forEach(button => {
      const selected = button.dataset.q === q;
      button.setAttribute('aria-checked', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    const download = rowEl.querySelector('[data-download-pack]');
    download.dataset.downloadPack = pack.id;
    download.querySelector('.action-size').textContent = sizeOf(pack);
    const spec = name => rowEl.querySelector(`[data-spec="${name}"]`);
    if (spec('size')) { spec('size').textContent = sizeOf(pack); spec('files').textContent = filesOf(pack); }
    download.setAttribute('aria-label', `Download ${sizeOf(pack)}: ${pack.title}, ${pack.chapter}, ${q}`);
    const seg = rowEl.querySelector('.seg');
    if (seg) UI.pill(seg);
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('.row .seg [data-q]');
    if (button) setVersion(button.closest('.row'), button.dataset.q);
  });
  document.addEventListener('keydown', event => {
    const radio = event.target.closest('.row .seg [data-q]');
    if (!radio || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const options = [...radio.parentElement.querySelectorAll('[data-q]:not(:disabled)')];
    const step = ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1;
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
      : (options.indexOf(radio) + step + options.length) % options.length;
    setVersion(radio.closest('.row'), options[index].dataset.q);
    options[index].focus();
  });
  const rows = (list, kind = '') => `<ul class="rows${kind ? ` ${kind}` : ''}">${list.join('')}</ul>`;
  const label = (text, note = '') => `<p class="label"><span>${esc(text)}</span>${note ? `<span class="label-note">${esc(note)}</span>` : ''}</p>`;

  // ---------- The sheets ----------
  const parts = document.getElementById('sheetParts');
  VIEWS.forEach(view => {
    if (SPECIAL.includes(view.id)) return;
    // From Modern Warfare to MW4; more clips last.
    const packs = COD_PACKS.filter(pack => pack.group === view.id)
      .sort((a, b) => (YEARS[a.chapter] || 9999) - (YEARS[b.chapter] || 9999));
    const clips = (GAMEPLAY[view.id] || []).map(byId).filter(Boolean);
    view.meta = packs.length ? `${plural(packs.length, 'pack')} · ${clock(packs.reduce((sum, pack) => sum + seconds(runOf(pack)), 0))}` : 'Coming soon';
    view.soon = !packs.length;
    view.count = packs.length ? plural(packs.length, 'pack') + (clips.length ? ` · ${clips.length} gameplay` : '') : 'Coming soon';
    const part = document.createElement('div');
    part.className = 'sheet-part';
    part.dataset.part = view.id;
    part.hidden = true;
    part.innerHTML = label('Scene packs', packs.length ? plural(packs.length, 'pack') : '') + (packs.length ? rows(packs.map(pack => block(pack, { all: true })), 'is-games') : `<p class="empty">${esc(view.name)}’s scene packs are on the way.</p>`)
      + (view.id in GAMEPLAY && clips.length ? label('Gameplay', `Modern Warfare 4 · ${plural(clips.length, 'scene')}`) + rows(clips.map(pack => block(pack, { name: pack.chapter })), 'is-games') : '');
    parts.append(part);
  });
  // Full cutscenes: Modern Warfare to MW III, then the MW4 campaign.
  const cuts = VIEWS.find(view => view.id === 'cutscenes');
  cuts.meta = `4 games · ${22 + ['mw1', 'mw2', 'mw3'].reduce((sum, id) => sum + byId(`${id}-campaign-individual`).files.length, 0)} scenes`;
  cuts.count = 'MW to MW4';
  // Trailers: their own sheet.
  const trailers = VIEWS.find(view => view.id === 'trailers');
  const trailerPacks = COD_PACKS.filter(pack => pack.group === 'trailers');
  trailers.meta = `${plural(trailerPacks.length, 'trailer')} · 4K`;
  trailers.count = plural(trailerPacks.length, 'trailer');
  const GAME_NAMES = ['Modern Warfare', 'Modern Warfare II', 'Modern Warfare III', 'Modern Warfare 4'];
  const trailerGames = GAME_NAMES.map((name, i) => ({ id: `mw${i + 1}`, name, packs: trailerPacks.filter(pack => pack.title === name) }));
  const trailerPart = document.createElement('div');
  trailerPart.className = 'sheet-part';
  trailerPart.dataset.part = 'trailers';
  trailerPart.hidden = true;
  trailerPart.innerHTML = '<div class="game-switch" id="trailerSwitch" role="tablist" aria-label="Choose a game"></div>' + trailerGames.map(game =>
    `<div class="game-panel" id="t-panel-${game.id}" role="tabpanel" aria-labelledby="t-tab-${game.id}" data-game="${game.id}" hidden>${rows(game.packs.map(pack => block(pack, { name: pack.chapter.split(' — ')[1] || pack.chapter })), 'is-games')}</div>`).join('');
  parts.append(trailerPart);
  // One tab per game; only the chosen game's scenes show.
  ['1', '2', '3'].forEach(n => { document.getElementById(`mw${n}Whole`).innerHTML = block(byId(`cuts${n}`), { name: byId(`cuts${n}`).chapter }); });
  const sheetEl = document.getElementById('sheet');
  // A tab per game above that game's panel; only the chosen one shows.
  function gameTabs(box, prefix, games, first, onPick) {
    const ids = games.map(game => game.id);
    box.innerHTML = games.map(game => `<button type="button" role="tab" id="${prefix}tab-${game.id}" aria-controls="${prefix}panel-${game.id}" aria-selected="false" tabindex="-1" data-game="${game.id}"><img src="${LOGOS[game.name]}" alt=""><span class="sr-only">${esc(game.name)}</span><small>${game.note}</small></button>`).join('');
    const panels = [...box.parentElement.querySelectorAll('.game-panel')];
    function pick(id, { keepPlace = false } = {}) {
      box.querySelectorAll('[role=tab]').forEach(tab => {
        const on = tab.dataset.game === id;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
      });
      panels.forEach(panel => { panel.hidden = panel.dataset.game !== id; });
      // An open scene finds its row again now that its grid has a size.
      dispatchEvent(new Event('resize'));
      if (!keepPlace && sheetEl.scrollTop > box.offsetTop) sheetEl.scrollTop = box.parentElement.offsetTop;
    }
    box.addEventListener('click', event => {
      const tab = event.target.closest('[role=tab]');
      if (tab) onPick(tab.dataset.game);
    });
    box.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? ids.length - 1
        : (ids.indexOf(event.target.dataset.game) + (event.key === 'ArrowLeft' ? -1 : 1) + ids.length) % ids.length;
      const next = ids[index];
      onPick(next);
      document.getElementById(`${prefix}tab-${next}`).focus();
    });
    pick(first, { keepPlace: true });
    return { pick };
  }
  const gameIds = ['mw1', 'mw2', 'mw3', 'mw4'];
  const sceneParam = game => game === 'mw4' ? 'scene' : game;
  const routeParams = ['game', 'scene', 'mw1', 'mw2', 'mw3', 'quality'];
  const campaignTabs = gameTabs(document.getElementById('gameSwitch'), '', GAME_NAMES.map((name, i) => {
    const id = `mw${i + 1}`;
    return { id, name, note: `${id === 'mw4' ? 22 : byId(`${id}-campaign-individual`).files.length} scenes` };
  }), 'mw1', game => updateCampaign({ game, scene: null, quality: new URLSearchParams(location.search).get('quality') || '4K' }));
  const trailerTabs = gameTabs(document.getElementById('trailerSwitch'), 't-', trailerGames.map(game => ({ ...game, note: plural(game.packs.length, 'trailer') })), 'mw1', game => {
    const url = new URL(location.href);
    routeParams.forEach(key => url.searchParams.delete(key));
    url.searchParams.set('game', game); url.hash = 'trailers';
    history.replaceState(history.state, '', url);
    syncRoute({ target: 'trailers', id: 'trailers' });
  });

  function updateCampaign({ game, scene, quality }) {
    const url = new URL(location.href);
    routeParams.forEach(key => url.searchParams.delete(key));
    url.searchParams.set('game', game);
    if (scene) url.searchParams.set(sceneParam(game), scene);
    if (quality !== '4K') url.searchParams.set('quality', quality);
    url.hash = 'cutscenes';
    history.replaceState(history.state, '', url);
    syncRoute({ target: 'cutscenes', id: 'cutscenes' });
  }
  // Initial links, tab choices, Back and Forward all restore the same state.
  function syncRoute({ target, id }) {
    const url = new URL(location.href), params = new URLSearchParams(url.search);
    routeParams.forEach(key => url.searchParams.delete(key));
    if (target === 'cutscenes') {
      const legacy = id === 'mw4-campaign' ? 'mw4' : id === 'campaign-cutscenes' ? 'mw1' : null;
      const game = legacy || (gameIds.includes(params.get('game')) ? params.get('game')
        : params.has('scene') ? 'mw4' : gameIds.find(value => params.has(sceneParam(value))) || 'mw1');
      const requested = params.get(sceneParam(game));
      const scene = window.CampaignNavigation?.sceneExists(game, requested) ? requested : null;
      const quality = QUALITIES.includes(params.get('quality')) ? params.get('quality') : '4K';
      url.searchParams.set('game', game);
      if (scene) url.searchParams.set(sceneParam(game), scene);
      if (quality !== '4K') url.searchParams.set('quality', quality);
      url.hash = 'cutscenes';
      campaignTabs.pick(game, { keepPlace: true });
      window.CampaignNavigation?.activate(game, scene, quality);
    } else {
      window.CampaignNavigation?.activate(null, null);
      if (target === 'trailers') {
        const game = id === 'mw4-trailers' ? 'mw4' : gameIds.includes(params.get('game')) ? params.get('game') : 'mw1';
        url.searchParams.set('game', game); url.hash = 'trailers';
        trailerTabs.pick(game, { keepPlace: true });
      }
    }
    if (url.href !== location.href) history.replaceState(history.state, '', url);
  }
  window.CampaignNavigation?.connect(updateCampaign);
  const assigned = new Set(Object.values(GAMEPLAY).flat());
  const loose = COD_PACKS.filter(pack => pack.group === 'gameplay' && !assigned.has(pack.id));
  document.getElementById('looseLabel').hidden = !loose.length;
  document.getElementById('looseRows').innerHTML = loose.map(pack => block(pack, { name: pack.chapter })).join('');
  document.querySelectorAll('.row[data-versions]').forEach(rowEl => setVersion(rowEl, QUALITIES.find(q => JSON.parse(rowEl.dataset.versions)[q])));

  // ---------- The tiles: square pictures edge to edge, a name on each ----------
  // The characters are all the same size; the full cutscenes (two parts)
  // and the trailers (one part) share a larger row at the bottom.
  const SIZE = { trailers: 'is-trailers', cutscenes: 'is-full' };
  // Sections still to come show a small picture blurred ahead of time, so the
  // browser has no live blur to draw.
  const orderedViews = [...VIEWS.filter(view => isOpen(view.id)), ...VIEWS.filter(view => !isOpen(view.id))];
  cast.innerHTML = orderedViews.map((view, i) => {
    const open = isOpen(view.id);
    const picture = open ? `<img src="${view.cover || view.still}" alt="" style="object-position:${view.cover ? (view.coverFocus || '50% 30%') : view.focus}">` : `<img src="assets/images/locked/${view.id}.webp" alt="">`;
    const link = open ? `<a class="tile" href="#${view.id}" data-view="${view.id}">` : `<a class="tile is-locked" data-view="${view.id}" aria-disabled="true" aria-label="${esc(view.name)}, locked">`;
    return `${view.id === 'cutscenes' ? '<li class="tiles-break" aria-hidden="true"></li>' : i === OPEN.length ? '<li class="tiles-heading"><h2>Coming soon</h2></li>' : ''}<li class="${SIZE[view.id] || ''}" style="--n:${i}">${link}<span class="tile-pic">${picture}</span><span class="tile-text"><span class="tile-name">${esc(view.name)}</span><span class="tile-meta">${open ? esc(view.count) : 'Locked'}</span></span>${open ? '' : LOCK}</a></li>`;
  }).join('');
  VIEWS.filter(view => isOpen(view.id)).forEach(view => Shelf.add(view.id, view));
  // The sheet's picture grows out of the tile.
  const sourceFor = id => document.querySelector(`.tile[data-view="${CSS.escape(id)}"] .tile-pic`);
  // A link to an MW4 scene opens the cutscenes with that scene.
  if (!location.hash && ['game', 'scene', 'mw1', 'mw2', 'mw3'].some(name => new URLSearchParams(location.search).has(name))) {
    history.replaceState(history.state, '', '#cutscenes');
    addEventListener('load', () => document.querySelector('.mw4-detail:not([hidden])')?.scrollIntoView({ block: 'center' }));
  }
  // Old addresses still land in the right sheet.
  Shelf.start({ sourceFor, onRoute: syncRoute, aliases: { 'mw4-campaign': 'cutscenes', 'campaign-cutscenes': 'cutscenes', 'mw4-trailers': 'trailers', gameplay: 'price', 'pack-gameplay': 'price', 'pack-price': 'price', 'pack-gaz': 'gaz', 'pack-ghost': 'ghost', 'pack-soap': 'soap', 'pack-valeria': 'valeria', 'pack-archer': 'archer' } });
})();
