(() => {
  'use strict';
  // The Call of Duty page opens on one grid: a row per character, a column per
  // game. A cell opens that character's page for that game, which holds the
  // scene pack and any gameplay from it. Each page has its own address
  // (cod.html#price/mw4, #price, #cutscenes…), so links, Back and Forward work.
  // Everything is built from COD_PACKS here, before site.js and motion.js run,
  // so their buttons and reveals work on it as on any other card.
  const picker = document.getElementById('choose');
  const nav = document.getElementById('codSwitch');
  const crumbs = document.getElementById('codCrumbs');
  const grid = document.getElementById('packGrid');
  const holder = document.getElementById('packViews');
  if (!picker || !nav || !holder || !grid || typeof COD_PACKS === 'undefined') return;

  const CHARACTERS = [
    { id: 'price', name: 'John Price' },
    { id: 'gaz', name: 'Gaz' },
    { id: 'ghost', name: 'Ghost' },
    { id: 'soap', name: 'Soap' },
    { id: 'valeria', name: 'Valeria' },
    { id: 'archer', name: 'The Archer' }
  ];
  const GAMES = [
    { id: 'mw1', chapter: 'Modern Warfare', short: 'MW', logo: 'img/cod/logos/mw1.svg', width: 1000, height: 231 },
    { id: 'mw2', chapter: 'Modern Warfare II', short: 'MW II', logo: 'img/cod/logos/mw2.png', width: 351, height: 175 },
    { id: 'mw3', chapter: 'Modern Warfare III', short: 'MW III', logo: 'img/cod/logos/mw3.png', width: 635, height: 175 },
    { id: 'mw4', chapter: 'Modern Warfare 4', short: 'MW4', logo: 'img/cod/logos/mw4.webp', width: 1179, height: 404 },
    { id: 'more', chapter: 'More clips', short: 'More' }
  ];
  const PLAY = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6V4Z"/></svg>';
  const SAVE = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2v11m-4-4 4 4 4-4M3 14v3h14v-3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

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
  const metaOf = pack => pack.meta.split(' · ');
  const byId = id => COD_PACKS.find(pack => pack.id === id);
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
  function cover(pack, extra = '') {
    return `<div class="pack-cover"><span class="cover-frame"><img src="${pack.poster}" alt="" loading="lazy" decoding="async"></span>${extra}<button class="cover-play" type="button" data-cod-preview="${pack.id}" tabindex="-1" aria-hidden="true">${PLAY}</button></div>`;
  }
  function sceneCard(character, { game, pack }, key) {
    const [run, size] = metaOf(pack);
    const files = pack.files.length === 1 ? 'One file' : `${pack.files.length} parts`;
    return `<article class="pack-card pack-feature" aria-labelledby="t-${key}">
      ${cover(pack, `<span class="cover-game">${logo(game)}</span>`)}
      <div class="pack-bar"><h4 class="sr-only" id="t-${key}">${character.name} scenes, ${game.chapter}</h4>
        <dl class="pack-specs"><div><dt>Length</dt><dd>${run}</dd></div><div><dt>Quality</dt><dd>${resolution(pack)} ${pack.fps.replace(' FPS', ' fps')}</dd></div><div><dt>Size</dt><dd>${size}</dd></div><div><dt>Files</dt><dd>${files}</dd></div></dl>
        ${buttons(pack, `${character.name} ${game.chapter}`)}</div>
    </article>`;
  }
  function gameplayRow(pack) {
    const [run, size] = metaOf(pack);
    const parts = pack.files.length > 1 ? ` · ${pack.files.length} parts` : '';
    const id = `t-${pack.id}-${++cardNo}`;
    return `<li><article class="pack-card clip-row" aria-labelledby="${id}">
      ${cover(pack)}
      <div class="pack-info"><h4 id="${id}">${pack.chapter}</h4><p>${run} · ${resolution(pack)} 60 fps · ${size}${parts}</p></div>
      ${buttons(pack, `${pack.chapter} gameplay`)}
    </article></li>`;
  }
  const block = (id, title, note, body) => `<section class="pack-block"${id ? ` id="${id}"` : ''}><header class="block-head"><h3>${title}</h3><span>${note}</span></header>${body}</section>`;

  // A character in one game: the scene pack, then the gameplay from that game.
  function gameView(character, entries, entry) {
    const { game, gameplay } = entry;
    const key = `${character.id}-${game.id}`;
    const tabs = entries.length > 1 ? `<nav class="game-tabs" aria-label="${character.name} games">${entries.map(other => `<a href="#${character.id}/${other.game.id}"${other === entry ? ' aria-current="page"' : ''}>${other.game.short}</a>`).join('')}</nav>` : '';
    const clips = gameplay.length ? block(`pack-${key}-gameplay`, 'Gameplay', `${plural(gameplay.length, 'scene')} from ${game.chapter}`, `<ul class="clip-list">${gameplay.map(gameplayRow).join('')}</ul>`) : '';
    return `<section class="op game-view" id="pack-${key}" aria-labelledby="row-${key}" hidden>
      <header class="game-head"><h2 class="op-name" id="row-${key}" tabindex="-1">${character.name}</h2>${tabs}</header>
      ${block('', 'Scene pack', game.chapter, sceneCard(character, entry, key))}
      ${clips}
    </section>`;
  }

  // One cell of the grid.
  function clip(href, label, poster, game, time, tag = '') {
    return `<a class="clip" href="${href}" aria-label="${label}"><img src="${poster}" alt="" loading="lazy" decoding="async"><span class="clip-game">${game}</span><span class="clip-time">${time}</span>${tag ? `<span class="clip-tag">${tag}</span>` : ''}</a>`;
  }
  const blank = '<span class="clip is-empty" aria-hidden="true"></span>';
  const track = (href, name, cells) => `<li class="track"><a class="track-name" href="${href}">${name}</a>${cells}</li>`;

  // Every view: its title, the sections it shows, the heading that takes focus,
  // the tab it belongs to and its trail.
  const home = { label: 'Call of Duty', href: '#choose' };
  const VIEWS = {
    cutscenes: { title: 'Cutscenes', show: ['mw4-campaign', 'mw4-gameplay', 'campaign-cutscenes', 'mw4-trailers'], heading: 'mw4-collection-title', tab: 'cutscenes', trail: [home, { label: 'Cutscenes' }] }
  };
  // Places inside a view that links can point at directly. #gameplay is the old
  // address of the gameplay section.
  const INSIDE = { 'mw4-campaign': 'cutscenes', 'mw4-gameplay': 'cutscenes', 'campaign-cutscenes': 'cutscenes', 'mw4-trailers': 'cutscenes', gameplay: 'price/mw4' };
  const TARGETS = { gameplay: 'pack-price-mw4-gameplay' };
  let html = '';
  let rows = `<li class="track track-head" aria-hidden="true"><span></span>${GAMES.map(game => `<span class="track-game">${logo(game)}</span>`).join('')}</li>`;
  CHARACTERS.forEach(character => {
    const entries = entriesOf(character);
    rows += track(`#${character.id}`, character.name, GAMES.map(game => {
      const entry = entries.find(item => item.game === game);
      if (!entry) return blank;
      const extra = entry.gameplay.length;
      return clip(`#${character.id}/${game.id}`, `${character.name}, ${game.chapter}`, entry.pack.poster, game.short, metaOf(entry.pack)[0], extra ? `+ ${extra} gameplay` : '');
    }).join(''));
    entries.forEach(entry => {
      html += gameView(character, entries, entry);
      VIEWS[`${character.id}/${entry.game.id}`] = {
        title: `${character.name}, ${entry.game.chapter}`,
        show: [`pack-${character.id}-${entry.game.id}`],
        heading: `row-${character.id}-${entry.game.id}`,
        tab: character.id,
        trail: [home, { label: character.name }, { label: entry.game.chapter }]
      };
    });
    // A character's own address opens their newest game.
    const newest = entries.filter(entry => entry.game.id !== 'more').pop();
    VIEWS[character.id] = VIEWS[`${character.id}/${newest.game.id}`];
  });
  rows += track('#cutscenes', 'Cutscenes', [
    clip('#campaign-cutscenes', 'Modern Warfare campaign cutscenes', byId('cuts1').poster, 'MW', metaOf(byId('cuts1'))[0]),
    clip('#campaign-cutscenes', 'Modern Warfare II campaign cutscenes', byId('cuts2').poster, 'MW II', metaOf(byId('cuts2'))[0]),
    clip('#campaign-cutscenes', 'Modern Warfare III campaign cutscenes', byId('cuts3').poster, 'MW III', metaOf(byId('cuts3'))[0]),
    clip('#mw4-campaign', 'Modern Warfare 4 campaign cutscenes', 'img/cod/mw4/scenes/16.jpg', 'MW4', '22 scenes'),
    clip('#mw4-trailers', 'Modern Warfare 4 trailers', byId('mw4-trailer-3').poster, 'Trailers', '3 trailers')
  ].join(''));
  grid.innerHTML = rows;
  // Campaign gameplay that belongs to no character stays with the cutscenes.
  const campaign = COD_PACKS.filter(pack => pack.group === 'gameplay' && !pack.chars.length);
  html += `<section class="op" id="mw4-gameplay" aria-labelledby="row-mw4-gameplay" hidden>
    <header class="block-head"><h2 class="block-title" id="row-mw4-gameplay" tabindex="-1">MW4 Gameplay</h2><span>${plural(campaign.length, 'scene')} from the campaign</span></header>
    <ul class="clip-list">${campaign.map(gameplayRow).join('')}</ul>
  </section>`;
  holder.innerHTML = html;

  const sections = [document.getElementById('mw4-campaign'), ...document.querySelectorAll('.op')].filter(Boolean);
  const baseTitle = document.title;
  let current = null;

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
    crumbs.innerHTML = (info?.trail || []).map(step => step.href ? `<li><a href="${step.href}">${step.label}</a></li>` : `<li>${step.label}</li>`).join('');
    document.title = info ? `${info.title} — ${baseTitle}` : baseTitle;
    if (target) target.scrollIntoView({ block: 'start' });
    else if (changed || moveFocus) scrollTo(0, 0);
    if (moveFocus) document.getElementById(info ? info.heading : 'pickTitle')?.focus({ preventScroll: true });
  }

  // Every new view fades in.
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  addEventListener('hashchange', () => {
    const was = current;
    const next = viewFor(location.hash);
    show(next, true);
    if (was === next.view || reduced.matches || document.body.dataset.motion === 'off') return;
    const shown = next.view === 'choose' ? [picker] : sections.filter(section => !section.hidden);
    shown.slice(0, 4).forEach(element => element.animate(
      [{ opacity: 0 }, { opacity: 1 }], { duration: 280, easing: 'ease-out', fill: 'backwards' }));
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
