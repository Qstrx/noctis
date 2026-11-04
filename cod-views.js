(() => {
  'use strict';
  // The Call of Duty page opens on the roster of characters. A character lists
  // its games, and a game holds that character's scene pack and any gameplay
  // from it. Each of these is its own view with its own address (cod.html#price,
  // #price/mw4, #cutscenes…), so links, Back and Forward all work.
  // Everything is built from COD_PACKS here, before site.js and motion.js run,
  // so their buttons and reveals work on it as on any other card.
  const picker = document.getElementById('choose');
  const nav = document.getElementById('codSwitch');
  const crumbs = document.getElementById('codCrumbs');
  const roster = document.getElementById('roster');
  const holder = document.getElementById('packViews');
  const ambient = document.getElementById('codAmbient');
  if (!picker || !nav || !holder || typeof COD_PACKS === 'undefined') return;

  const CHARACTERS = [
    { id: 'price', name: 'John Price', img: 'img/cod/price-mw2.jpg', focus: '64% 35%', ins: '<rect x="4" y="5" width="16" height="5" rx="1"/><rect x="4" y="14" width="16" height="5" rx="1"/>' },
    { id: 'gaz', name: 'Gaz', img: 'img/cod/gaz-extra.jpg', focus: '42% 35%', ins: '<path d="M3 9.5 12 4l9 5.5v2.6L12 6.6l-9 5.5zM3 14 12 8.5l9 5.5v2.6l-9-5.5-9 5.5zM3 18.5 12 13l9 5.5v2.6l-9-5.5-9 5.5z"/>' },
    { id: 'ghost', name: 'Ghost', img: 'img/home/cod-ghost.jpg', focus: '46% 35%', ins: '<rect x="4" y="9.5" width="16" height="5" rx="1"/>' },
    { id: 'soap', name: 'Soap', img: 'img/cod/soap-mw3.jpg', focus: '56% 35%', ins: '<path d="M3 9.5 12 4l9 5.5v2.6L12 6.6l-9 5.5zM3 14 12 8.5l9 5.5v2.6l-9-5.5-9 5.5zM3 18.5 12 13l9 5.5v2.6l-9-5.5-9 5.5z"/>' },
    { id: 'valeria', name: 'Valeria', img: 'img/cod/valeria-mw4.jpg', focus: '70% 35%', ins: '<path d="M12 3 21 8v8l-9 5-9-5V8z"/>' },
    { id: 'archer', name: 'The Archer', img: 'img/cod/archer-mw4.jpg', focus: '50% 35%', ins: '<path d="M12 3 21 8v8l-9 5-9-5V8z"/>' }
  ];
  const GAMES = [
    { id: 'mw1', chapter: 'Modern Warfare', short: 'MW', logo: 'img/cod/logos/mw1.svg', width: 1000, height: 231 },
    { id: 'mw2', chapter: 'Modern Warfare II', short: 'MW II', logo: 'img/cod/logos/mw2.png', width: 351, height: 175 },
    { id: 'mw3', chapter: 'Modern Warfare III', short: 'MW III', logo: 'img/cod/logos/mw3.png', width: 635, height: 175 },
    { id: 'mw4', chapter: 'Modern Warfare 4', short: 'MW4', logo: 'img/cod/logos/mw4.webp', width: 1179, height: 404 },
    { id: 'more', chapter: 'More clips', short: 'More clips' }
  ];
  const PLAY = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6V4Z"/></svg>';
  const SAVE = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2v11m-4-4 4 4 4-4M3 14v3h14v-3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';

  // The same gameplay can show on two characters' pages; ids stay unique.
  let cardNo = 0;
  const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;
  const logo = game => game.logo
    ? `<img src="${game.logo}" alt="${game.chapter}" width="${game.width}" height="${game.height}" loading="lazy" decoding="async">`
    : `<span class="game-word">${game.chapter}</span>`;
  const resolution = pack => {
    const width = parseInt(pack.resolution, 10);
    return width >= 3800 ? '4K' : width >= 2500 ? '1440p' : pack.resolution;
  };
  const gameplayOf = (character, game) => COD_PACKS.filter(pack => pack.group === 'gameplay' && pack.game === game.id && pack.chars.includes(character.id));
  // A character's games, in release order, each with its pack and its gameplay.
  const entriesOf = character => GAMES.map(game => ({
    game,
    pack: COD_PACKS.find(pack => pack.group === character.id && pack.chapter === game.chapter),
    gameplay: gameplayOf(character, game)
  })).filter(entry => entry.pack);

  function buttons(pack, label) {
    return `<div class="pack-actions"><button class="action secondary" type="button" data-cod-preview="${pack.id}" aria-label="Preview ${label}">${PLAY}<span class="action-label">Preview</span></button><button class="action primary" type="button" data-download-pack="${pack.id}" aria-label="Download ${label}">${SAVE}<span class="action-label">Download</span></button></div>`;
  }
  function cover(pack, run, extra = '') {
    return `<div class="pack-cover"><span class="cover-frame"><img src="${pack.poster}" alt="" loading="lazy" decoding="async"></span>${extra}<button class="cover-play" type="button" data-cod-preview="${pack.id}" tabindex="-1" aria-hidden="true">${PLAY}</button><span class="cover-time">${run}</span></div>`;
  }
  function sceneCard(character, { game, pack }, key) {
    const [run, size] = pack.meta.split(' · ');
    const files = pack.files.length === 1 ? 'One file' : `${pack.files.length} parts, download one or all`;
    return `<article class="pack-card pack-feature reveal" aria-labelledby="t-${key}">
      ${cover(pack, run)}
      <div class="pack-info"><h4 id="t-${key}">${character.name} scenes</h4>
        <dl class="pack-specs"><div><dt>Length</dt><dd>${run}</dd></div><div><dt>Quality</dt><dd>${resolution(pack)} · ${pack.fps.toLowerCase()}</dd></div><div><dt>Size</dt><dd>${size}</dd></div><div><dt>Files</dt><dd>${files}</dd></div></dl></div>
      ${buttons(pack, `${character.name} ${game.chapter}`)}
    </article>`;
  }
  function gameplayCard(pack) {
    const [run, size] = pack.meta.split(' · ');
    const parts = pack.files.length > 1 ? ` · ${pack.files.length} parts` : '';
    return `<article class="pack-card reveal" aria-labelledby="t-${pack.id}-${++cardNo}">
      ${cover(pack, run, `<span class="cover-badge">Gameplay</span>`)}
      <div class="pack-info"><h4 id="t-${pack.id}-${cardNo}">${pack.chapter}</h4><p>${resolution(pack)} · 60 fps · ${size}${parts}</p></div>
      ${buttons(pack, `${pack.chapter} gameplay`)}
    </article>`;
  }
  const block =(id, title, note, body) => `<section class="pack-block"${id ? ` id="${id}"` : ''}><header class="block-head"><h3>${title}</h3><span>${note}</span></header>${body}</section>`;

  // A character's page: their games as a stack of wide frames.
  function characterView(character, entries) {
    const scenes = new Set(entries.flatMap(entry => entry.gameplay)).size;
    const rows = entries.map(({ game, pack, gameplay }) => `<li><a class="game-strip reveal" href="#${character.id}/${game.id}">
      <img class="game-strip-art" src="${pack.poster}" alt="" loading="lazy" decoding="async">
      <span class="game-strip-logo">${logo(game)}</span>
      <span class="game-strip-info"><span>Scene pack · ${pack.meta.split(' · ')[0]}</span>${gameplay.length ? `<span class="is-gameplay">${plural(gameplay.length, 'gameplay scene')}</span>` : ''}</span>
      <span class="game-strip-go">${ARROW}</span></a></li>`).join('');
    return `<section class="op char-view" id="pack-${character.id}" aria-labelledby="row-${character.id}" hidden>
      <header class="char-hero"><img src="${character.img}" alt="" style="object-position:${character.focus}" decoding="async">
        <div class="char-hero-text"><svg class="op-ins" viewBox="0 0 24 24" aria-hidden="true">${character.ins}</svg><h2 class="op-name" id="row-${character.id}" tabindex="-1">${character.name}</h2><p>${plural(entries.length, 'scene pack')}${scenes ? ` · ${plural(scenes, 'gameplay scene')}` : ''}</p></div></header>
      <ol class="game-list">${rows}</ol>
    </section>`;
  }
  // A game's page: the scene pack, then the gameplay from that game.
  function gameView(character, entries, entry) {
    const { game, gameplay } = entry;
    const key = `${character.id}-${game.id}`;
    const tabs = entries.length > 1 ? `<nav class="game-tabs" aria-label="${character.name} games">${entries.map(other => `<a href="#${character.id}/${other.game.id}"${other === entry ? ' aria-current="page"' : ''}>${other.game.short}</a>`).join('')}</nav>` : '';
    const clips = gameplay.length ? block(`pack-${key}-gameplay`, 'Gameplay', `${plural(gameplay.length, 'scene')} · 1440p · 60 fps`, `<div class="pack-grid">${gameplay.map(gameplayCard).join('')}</div>`) : '';
    return `<section class="op game-view" id="pack-${key}" aria-labelledby="row-${key}" hidden>
      <header class="game-head"><svg class="op-ins" viewBox="0 0 24 24" aria-hidden="true">${character.ins}</svg><h2 class="op-name" id="row-${key}" tabindex="-1">${character.name}</h2><span class="game-head-logo">${logo(game)}</span>${tabs}</header>
      ${block('', 'Scene pack', game.chapter, `<div class="pack-grid">${sceneCard(character, entry, key)}</div>`)}
      ${clips}
    </section>`;
  }

  // Every view: its title, the sections it shows, the heading that takes focus,
  // the tab it belongs to, its trail and its background picture.
  const home = { label: 'Call of Duty', href: '#choose' };
  const VIEWS = {
    cutscenes: { title: 'Cutscenes', show: ['mw4-campaign', 'mw4-gameplay', 'campaign-cutscenes', 'mw4-trailers'], heading: 'mw4-collection-title', tab: 'cutscenes', trail: [home, { label: 'Cutscenes' }], img: 'img/cod/mw4/scenes/16.jpg' }
  };
  // Places inside a view that links can point at directly. #gameplay is the old
  // address of the gameplay section.
  const INSIDE = { 'mw4-campaign': 'cutscenes', 'mw4-gameplay': 'cutscenes', 'campaign-cutscenes': 'cutscenes', 'mw4-trailers': 'cutscenes', gameplay: 'price/mw4' };
  const TARGETS = { gameplay: 'pack-price-mw4-gameplay' };
  let html = '';
  CHARACTERS.forEach(character => {
    const entries = entriesOf(character);
    const tile = document.createElement('li');
    tile.innerHTML = `<a class="roster-tile" href="#${character.id}" data-view-link="${character.id}" style="--i:${CHARACTERS.indexOf(character)}"><img src="${character.img}" alt="" style="object-position:${character.focus}" decoding="async"><span class="roster-name">${character.name}</span><span class="roster-games">${entries.map(entry => entry.game.short).join(' · ')}</span></a>`;
    const link = tile.firstChild;
    ['pointerenter', 'focus'].forEach(name => link.addEventListener(name, () => setAmbient(character.img)));
    roster?.append(tile);
    const trail = { label: character.name, href: `#${character.id}` };
    entries.forEach(entry => {
      const single = entries.length === 1;
      html += gameView(character, entries, entry);
      VIEWS[`${character.id}/${entry.game.id}`] = {
        title: single ? character.name : `${character.name}, ${entry.game.chapter}`,
        show: [`pack-${character.id}-${entry.game.id}`],
        heading: `row-${character.id}-${entry.game.id}`,
        tab: character.id,
        trail: single ? [home, { label: character.name }] : [home, trail, { label: entry.game.chapter }],
        img: entry.pack.poster
      };
    });
    // One game: the character is that game's page, without a list of one.
    if (entries.length === 1) VIEWS[character.id] = VIEWS[`${character.id}/${entries[0].game.id}`];
    else {
      html += characterView(character, entries);
      VIEWS[character.id] = { title: character.name, show: [`pack-${character.id}`], heading: `row-${character.id}`, tab: character.id, trail: [home, { label: character.name }], img: character.img };
    }
  });
  // Campaign gameplay that belongs to no character stays with the cutscenes.
  const campaign = COD_PACKS.filter(pack => pack.group === 'gameplay' && !pack.chars.length);
  html += `<section class="op" id="mw4-gameplay" aria-labelledby="row-mw4-gameplay" hidden>
    <header class="op-head"><svg class="op-ins" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12a4 4 0 0 1 4 4v1a3 3 0 0 1-5.4 1.8L15.5 13h-7l-1.1 1.8A3 3 0 0 1 2 13v-1a4 4 0 0 1 4-4z"/></svg><h2 class="op-name" id="row-mw4-gameplay" tabindex="-1">MW4 Gameplay</h2><span class="op-res">1440p</span></header>
    <div class="pack-grid">${campaign.map(gameplayCard).join('')}</div>
  </section>`;
  holder.innerHTML = html;

  const sections = [document.getElementById('mw4-campaign'), ...document.querySelectorAll('.op')].filter(Boolean);
  const baseTitle = document.title;
  let current = null;

  function setAmbient(src) {
    if (ambient && !ambient.src.endsWith(src)) ambient.src = src;
  }
  function viewFor(hash) {
    const id = decodeURIComponent(hash.replace(/^#/, ''));
    if (VIEWS[id]) return { view: id };
    if (INSIDE[id]) return { view: INSIDE[id], target: document.getElementById(TARGETS[id] || id) };
    // A link to an MW4 scene opens the cutscenes.
    if (!id && new URLSearchParams(location.search).has('scene')) return { view: 'cutscenes' };
    return { view: 'choose' };
  }
  function show({ view, target }, moveFocus) {
    const changed = view !== current;
    const info = VIEWS[view];
    current = view;
    document.body.dataset.view = view;
    picker.hidden = view !== 'choose';
    nav.hidden = view === 'choose';
    const shown = info ? info.show : [];
    sections.forEach(section => { section.hidden = !shown.includes(section.id); });
    document.querySelectorAll('.cod-tabs [data-view-link]').forEach(link => {
      if (link.dataset.viewLink === info?.tab) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    crumbs.innerHTML = (info?.trail || []).map(step => step.href ? `<li><a href="${step.href}">${step.label}</a></li>` : `<li aria-current="page">${step.label}</li>`).join('');
    document.title = info ? `${info.title} — ${baseTitle}` : baseTitle;
    setAmbient(info?.img || CHARACTERS[0].img);
    if (target) target.scrollIntoView({ block: 'start' });
    else if (changed || moveFocus) scrollTo(0, 0);
    if (moveFocus) document.getElementById(info ? info.heading : 'pickTitle')?.focus({ preventScroll: true });
  }

  // Every new view rises in.
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  addEventListener('hashchange', () => {
    const was = current;
    const next = viewFor(location.hash);
    show(next, true);
    if (was === next.view || reduced.matches || document.body.dataset.motion === 'off') return;
    const shown = next.view === 'choose' ? [picker] : sections.filter(section => !section.hidden);
    shown.slice(0, 4).forEach((element, i) => element.animate(
      [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }],
      { duration: 600, delay: i * 70, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' }));
  });
  // The browser jumps to a matching id after load; the view decides the scroll instead.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const first = viewFor(location.hash);
  show(first, false);
  addEventListener('load', () => {
    const scene = document.getElementById('mw4Detail');
    if (first.target) first.target.scrollIntoView({ block: 'start' });
    else if (scene?.isConnected) scene.scrollIntoView({ block: 'center' });
    else scrollTo(0, 0);
  });
})();
