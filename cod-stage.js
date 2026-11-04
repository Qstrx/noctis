(() => {
  'use strict';
  // Call of Duty as a stage. Each choice (a character, the gameplay or the
  // cutscenes) has its own address (cod.html#ghost), its picture on the stage
  // and its reel of packs below. Everything is built from COD_PACKS here,
  // before site.js and motion.js run, so their Preview, Download and reveal
  // work on these cards as on any other.
  const stageEl = document.getElementById('stage');
  const reel = document.getElementById('reel');
  if (!stageEl || !reel || typeof COD_PACKS === 'undefined') return;

  const VIEWS = [
    { id: 'price', name: 'John Price', still: 'img/cod/price-mw2.jpg', focus: [.64, .34] },
    { id: 'gaz', name: 'Gaz', still: 'img/cod/gaz-extra.jpg', focus: [.3, .38] },
    { id: 'ghost', name: 'Ghost', still: 'img/cod/ghost-mw4.jpg', focus: [.6, .42] },
    { id: 'soap', name: 'Soap', still: 'img/cod/soap-mw3.jpg', focus: [.6, .34] },
    { id: 'valeria', name: 'Valeria', still: 'img/cod/valeria-mw4.jpg', focus: [.8, .4] },
    { id: 'archer', name: 'The Archer', still: 'img/cod/archer-mw4.jpg', focus: [.3, .36] },
    { id: 'gameplay', name: 'Gameplay', still: 'img/cod/gameplay-makarov.jpg', focus: [.5, .4] },
    { id: 'cutscenes', name: 'Cutscenes', still: 'img/cod/mw4/mw4-recap.jpg', focus: [.62, .45] }
  ];
  const GAMES = [
    { chapter: 'Modern Warfare', short: 'MW', year: 2019, logo: 'img/cod/logos/mw1.svg' },
    { chapter: 'Modern Warfare II', short: 'MW II', year: 2022, logo: 'img/cod/logos/mw2.png' },
    { chapter: 'Modern Warfare III', short: 'MW III', year: 2023, logo: 'img/cod/logos/mw3.png' },
    { chapter: 'Modern Warfare 4', short: 'MW4', year: 2026, logo: 'img/cod/logos/mw4.webp' },
    { chapter: 'More clips', short: 'More', year: 0 }
  ];
  const PLAY = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 3.5 11 6.5-11 6.5z"/></svg>';
  const SAVE = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2v11m-4-4 4 4 4-4M3 14v3h14v-3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const PREVIEW = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6V4Z"/></svg>';
  const esc = text => String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const pad = n => String(n).padStart(2, '0');
  const gameOf = pack => GAMES.find(game => game.chapter === pack.chapter);

  // "1:07:21" and "9:31" into seconds, and back.
  const seconds = run => run.split(':').reduce((total, part) => total * 60 + Number(part), 0);
  const clock = total => {
    const h = Math.floor(total / 3600), m = Math.floor(total / 60) % 60, s = total % 60;
    return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  };
  const runOf = pack => pack.meta.split(' · ')[0];
  const sizeOf = pack => pack.meta.split(' · ')[1];
  const quality = pack => {
    const width = parseInt(pack.resolution, 10);
    return width >= 3800 ? '4K' : width >= 2500 ? '2K' : '1080p';
  };
  const fps = pack => pack.fps.replace('~', '').replace(' FPS', ' fps');
  const files = pack => pack.files.length === 1 ? (pack.files[0].direct === false ? 'Google Drive' : '1 file') : `${pack.files.length} files`;

  // ---------- Packs per view ----------
  const packsOf = view => {
    if (view.id === 'gameplay') return COD_PACKS.filter(pack => pack.group === 'gameplay');
    if (view.id === 'cutscenes') return [];
    // Newest game first, more clips last.
    return COD_PACKS.filter(pack => pack.group === view.id)
      .sort((a, b) => (gameOf(b)?.year || -1) - (gameOf(a)?.year || -1));
  };

  // ---------- One pack, as a shot ----------
  function shot(pack, { lead = false, span = 6, kicker, title, logo = true, focus = '' } = {}) {
    const game = gameOf(pack);
    const label = `${pack.title}, ${pack.chapter}`;
    const logoHtml = !logo ? '' : game?.logo
      ? `<span class="shot-logo"><img src="${game.logo}" alt="" loading="lazy" decoding="async"></span>`
      : `<span class="shot-logo"><span>${esc(pack.chapter)}</span></span>`;
    const preview = pack.files.every(file => file.direct !== false);
    const specs = [
      ['Length', runOf(pack)], ['Quality', `${quality(pack)} ${fps(pack)}`], ['Size', sizeOf(pack)], ['Files', files(pack)]
    ];
    return `<article class="pack-card shot reveal${lead ? ' is-lead' : ''}" style="--span:${span}" aria-labelledby="t-${pack.id}">
      <div class="pack-cover"><span class="cover-frame"><img src="${pack.poster}" alt="" loading="lazy" decoding="async"${focus ? ` style="${focus}"` : ''}></span>
        <span class="shot-shade"></span>
        <p class="shot-tc">${runOf(pack)}</p><span class="shot-res">${quality(pack)}</span>${logoHtml}
        ${preview ? `<button class="shot-play" type="button" data-cod-preview="${pack.id}" aria-label="Preview ${esc(label)}">${PLAY}</button>` : ''}
      </div>
      <div class="shot-body">
        <p class="shot-kicker">${esc(kicker)}</p>
        <h3 class="shot-title" id="t-${pack.id}">${esc(title)}</h3>
        <ul class="shot-specs">${specs.map(([k, v]) => `<li data-k="${k}">${esc(v)}</li>`).join('')}</ul>
        <div class="pack-actions">${preview ? `<button class="action secondary" type="button" data-cod-preview="${pack.id}" aria-label="Preview ${esc(label)}">${PREVIEW}<span class="action-label">Preview</span></button>` : ''}<button class="action primary" type="button" data-download-pack="${pack.id}" aria-label="Download ${esc(label)}">${SAVE}<span class="action-label">Download</span></button></div>
      </div>
    </article>`;
  }
  // The rest after the lead: three to a row when they divide by three, else two.
  const spans = count => Array.from({ length: count }, (_, i) =>
    count % 3 === 0 ? 4 : count % 2 === 0 ? 6 : i < count - 2 ? 4 : 6);
  // Equal shots, three to a row, no lead.
  const row = (packs, describe) => `<div class="reel-grid">${packs.map(pack => shot(pack, { ...describe(pack), span: 4 })).join('')}</div>`;
  function grid(packs, describe) {
    const [lead, ...rest] = packs;
    const widths = spans(rest.length);
    return `<div class="reel-grid">${[lead && shot(lead, { ...describe(lead), lead: true }), ...rest.map((pack, i) => shot(pack, { ...describe(pack), span: widths[i] }))].filter(Boolean).join('')}</div>`;
  }

  // ---------- Facts on the stage ----------
  const total = packs => clock(packs.reduce((sum, pack) => sum + seconds(runOf(pack)), 0));
  const mw4 = COD_PACKS.find(pack => pack.id === 'mw4-campaign-individual');
  function facts(view, packs) {
    if (view.id === 'cutscenes') return ['22 MW4 scenes', '4K · 2K · 1080p', 'MW I–III campaigns', '3 trailers'];
    if (view.id === 'gameplay') return [`${packs.length} gameplay packs`, total(packs), 'MW4 · 2K 60 fps'];
    const games = packs.map(pack => gameOf(pack)?.short).filter(short => short && short !== 'More').reverse();
    return [`${packs.length} scene pack${packs.length === 1 ? '' : 's'}`, total(packs), games.join(' · ') + (packs.some(pack => pack.chapter === 'More clips') ? ' · More' : ''), '4K'];
  }

  // ---------- Build the stage and the reel ----------
  VIEWS.forEach((view, i) => { view.no = pad(i + 1); view.packs = packsOf(view); });
  const roster = stageEl.querySelector('.roster');
  roster.style.setProperty('--n', VIEWS.length);
  roster.innerHTML = VIEWS.map(view => `<li><a href="#${view.id}" data-view-link="${view.id}"><span class="roster-pic"><img src="${view.still}" alt="" style="object-position:${view.focus[0] * 100}% ${view.focus[1] * 100}%" decoding="async"></span><span class="roster-label"><b>${view.no}</b><span>${esc(view.name)}</span></span></a></li>`).join('');
  const tabs = reel.querySelector('.reel-tabs');
  tabs.innerHTML = VIEWS.map(view => `<a href="#${view.id}" data-view-link="${view.id}"><b>${view.no}</b>${esc(view.name)}</a>`).join('');

  const cutsView = document.getElementById('view-cutscenes');
  VIEWS.forEach(view => {
    if (view.id === 'cutscenes') {
      const cuts = ['cuts1', 'cuts2', 'cuts3'].map(id => COD_PACKS.find(pack => pack.id === id));
      const trailers = COD_PACKS.filter(pack => pack.group === 'trailers');
      document.getElementById('cutsMore').innerHTML =
        `<section id="campaign-cutscenes" aria-labelledby="h-cuts"><header class="reel-sub"><h3 id="h-cuts" tabindex="-1">Modern Warfare I–III</h3><p>Full campaigns · 2K 60 fps</p></header>${row(cuts, pack => ({ kicker: 'Campaign cutscenes', title: pack.chapter }))}</section>` +
        `<section id="mw4-trailers" aria-labelledby="h-trailers"><header class="reel-sub"><h3 id="h-trailers" tabindex="-1">MW4 Trailers</h3><p>Three official trailers · 4K</p></header>${row(trailers, pack => { const [no, name] = pack.chapter.split(' — '); return { kicker: `${no} · ${pack.releaseDate.slice(0, 4)}`, title: name, logo: false }; })}</section>`;
      return;
    }
    const section = document.createElement('section');
    section.className = 'reel-view';
    section.id = `view-${view.id}`;
    section.dataset.view = view.id;
    section.hidden = true;
    section.setAttribute('aria-labelledby', `h-${view.id}`);
    const isGameplay = view.id === 'gameplay';
    section.innerHTML = `<header class="reel-head"><h2 id="h-${view.id}" tabindex="-1"><small>${view.no} — ${isGameplay ? 'Modern Warfare 4' : 'Scene packs'}</small>${esc(view.name)}</h2><p>${facts(view, view.packs).map(esc).join('<br>')}</p></header>` +
      grid(view.packs, pack => isGameplay
        ? { kicker: 'Gameplay · MW4', title: pack.chapter, logo: false }
        : { kicker: pack.chapter === 'More clips' ? 'Extra footage' : `Scene pack · ${gameOf(pack)?.year || ''}`, title: pack.chapter });
    reel.insertBefore(section, cutsView);
  });
  // The cutscenes view: its heading leads, the MW4 campaign follows.
  const cutsFacts = cutsView.querySelector('.reel-head p');
  if (cutsFacts) cutsFacts.innerHTML = facts(VIEWS[7], []).map(esc).join('<br>');

  // ---------- The stage ----------
  const nameEl = document.getElementById('stageName');
  const echoEl = document.getElementById('stageEcho');
  const factsEl = document.getElementById('stageFacts');
  const noEl = document.getElementById('stageNo');
  const goEl = document.getElementById('stageGo');
  const host = stageEl.querySelector('.stage-pic');
  const first = VIEWS[0];
  const stage = window.Stage ? Stage.create(host, null) : null;
  VIEWS.forEach(view => window.Stage?.load(view.still).catch(() => {}));

  const INSIDE = { 'mw4-campaign': 'cutscenes', 'campaign-cutscenes': 'cutscenes', 'mw4-trailers': 'cutscenes', 'mw4-gameplay': 'gameplay' };
  VIEWS.forEach(view => { INSIDE[`pack-${view.id}`] = view.id; INSIDE[`view-${view.id}`] = view.id; });
  const baseTitle = document.title;
  let current = null;

  function route() {
    const id = decodeURIComponent(location.hash.slice(1));
    const view = VIEWS.find(item => item.id === id);
    if (view) return { view };
    if (INSIDE[id]) return { view: VIEWS.find(item => item.id === INSIDE[id]), target: document.getElementById(id) };
    if (new URLSearchParams(location.search).has('scene')) return { view: VIEWS[7], target: document.getElementById('mw4-campaign') };
    return { view: first };
  }

  function show(view, { from = 'load' } = {}) {
    const changed = view !== current;
    current = view;
    document.body.dataset.view = view.id;
    document.title = view === first && !location.hash ? baseTitle : `${view.name} — ${baseTitle}`;
    document.querySelectorAll('[data-view-link]').forEach(link => {
      if (link.dataset.viewLink === view.id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    reel.querySelectorAll('.reel-view').forEach(section => { section.hidden = section.dataset.view !== view.id; });
    if (!changed) return;
    noEl.textContent = view.no;
    Noir.letters(nameEl, view.name);
    echoEl.textContent = view.name;
    Noir.decode(factsEl, facts(view, view.packs).join('   ·   '), 900);
    goEl.querySelector('span').textContent = view.id === 'cutscenes' ? 'Watch the cutscenes' : view.id === 'gameplay' ? 'See the gameplay' : 'See the scene packs';
    stage?.show({ src: view.still, focus: view.focus });
    if (!stage) host.querySelector('img')?.setAttribute('src', view.still);
    const section = document.getElementById(`view-${view.id}`);
    if (from !== 'load' && !Noir.still()) {
      section.classList.remove('is-entering'); void section.offsetWidth; section.classList.add('is-entering');
    }
    // Keep the active roster entry in view on narrow screens.
    const active = roster.querySelector('[aria-current=page]');
    if (active && roster.scrollWidth > roster.clientWidth) roster.scrollTo({ left: active.parentElement.offsetLeft - roster.clientWidth / 2 + active.offsetWidth / 2, behavior: Noir.still() ? 'auto' : 'smooth' });
    const activeTab = tabs.querySelector('[aria-current=page]');
    if (activeTab && tabs.scrollWidth > tabs.clientWidth) tabs.scrollTo({ left: activeTab.offsetLeft - tabs.clientWidth / 2 + activeTab.offsetWidth / 2, behavior: 'auto' });
  }

  // Where a change came from decides the scroll: on the stage you stay on the
  // stage; from the tabs in the reel you go to the top of the new reel.
  let origin = 'stage';
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-view-link]');
    if (link) origin = link.closest('.reel-tabs') ? 'tabs' : 'stage';
  }, true);
  addEventListener('hashchange', () => {
    const { view, target } = route();
    show(view, { from: origin });
    if (target) target.scrollIntoView({ block: 'start' });
    else if (origin === 'tabs') {
      const top = reel.getBoundingClientRect().top + scrollY;
      if (scrollY > top) scrollTo({ top, behavior: 'auto' });
      document.getElementById(`h-${view.id}`)?.focus({ preventScroll: true });
    }
    origin = 'stage';
  });

  // Previous and next: buttons, arrow keys and a swipe on the stage.
  function step(by) {
    // From the address, which moves at once, so quick presses add up.
    const index = (VIEWS.indexOf(route().view) + by + VIEWS.length) % VIEWS.length;
    origin = 'stage';
    location.hash = VIEWS[index].id;
  }
  stageEl.querySelector('[data-step="-1"]')?.addEventListener('click', () => step(-1));
  stageEl.querySelector('[data-step="1"]')?.addEventListener('click', () => step(1));
  addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || document.querySelector('dialog[open]')) return;
    if (event.target.closest?.('input, select, textarea, video, [contenteditable]')) return;
    if (stageEl.getBoundingClientRect().bottom < innerHeight * .4) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
  });
  let touch = null;
  host.parentElement.addEventListener('touchstart', event => { touch = event.touches.length === 1 ? [event.touches[0].clientX, event.touches[0].clientY] : null; }, { passive: true });
  host.parentElement.addEventListener('touchend', event => {
    if (!touch) return;
    const dx = event.changedTouches[0].clientX - touch[0], dy = event.changedTouches[0].clientY - touch[1];
    touch = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  }, { passive: true });
  // The outline behind the name drifts against the pointer.
  stageEl.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    stageEl.style.setProperty('--mx', (event.clientX / innerWidth - .5).toFixed(3));
    stageEl.style.setProperty('--my', (event.clientY / innerHeight - .5).toFixed(3));
  });
  // The roster's height sets where the name sits.
  const fit = () => stageEl.style.setProperty('--roster', `${roster.offsetHeight}px`);
  addEventListener('resize', fit, { passive: true });
  fit();

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const start = route();
  document.querySelector('.letterbox') ? setTimeout(() => show(start.view), 380) : show(start.view);
  if (!current) {
    // The reel is ready at once even while the stage waits for the letterbox.
    reel.querySelectorAll('.reel-view').forEach(section => { section.hidden = section.dataset.view !== start.view.id; });
    document.querySelectorAll('[data-view-link]').forEach(link => { if (link.dataset.viewLink === start.view.id) link.setAttribute('aria-current', 'page'); });
  }
  addEventListener('load', () => {
    const scene = document.getElementById('mw4Detail');
    if (start.target) start.target.scrollIntoView({ block: 'start' });
    else if (scene?.isConnected) scene.scrollIntoView({ block: 'center' });
  });
})();
