(() => {
  'use strict';
  // Call of Duty: a switch of characters (and the cutscenes), the chosen one
  // large with its numbers and picture, then its scene packs and, for Price,
  // Ghost and Gaz, its gameplay. Each choice has its own address
  // (cod.html#ghost), so links, Back and Forward work. Everything is built
  // from COD_PACKS here, before site.js and motion.js run, so Preview and
  // Download work on these cards as on any other.
  const main = document.getElementById('main');
  const views = document.getElementById('views');
  if (!main || !views || typeof COD_PACKS === 'undefined' || !window.UI) return;

  const CHARACTERS = [
    { id: 'price', name: 'John Price', still: 'img/cod/price-mw2.jpg', focus: '62% 34%' },
    { id: 'gaz', name: 'Gaz', still: 'img/cod/gaz-extra.jpg', focus: '30% 40%' },
    { id: 'ghost', name: 'Ghost', still: 'img/cod/ghost-mw4.jpg', focus: '60% 42%' },
    { id: 'soap', name: 'Soap', still: 'img/cod/soap-mw3.jpg', focus: '60% 34%' },
    { id: 'valeria', name: 'Valeria', still: 'img/cod/valeria-mw4.jpg', focus: '78% 40%' },
    { id: 'archer', name: 'The Archer', still: 'img/cod/archer-mw4.jpg', focus: '30% 36%' },
    { id: 'cutscenes', name: 'Cutscenes', still: 'img/cod/mw4/mw4-recap.jpg', focus: '62% 45%' }
  ];
  // Which MW4 gameplay belongs to which character. A gameplay pack listed
  // under nobody stays with the cutscenes.
  const GAMEPLAY = {
    price: ['gameplay-price-ghost', 'gameplay-price-jail', 'gameplay-makarov', 'gameplay-graves-death'],
    ghost: ['gameplay-price-ghost', 'gameplay-price-jail'],
    gaz: []
  };
  const GAMES = [
    { chapter: 'Modern Warfare', year: 2019, logo: 'img/cod/logos/mw1.svg' },
    { chapter: 'Modern Warfare II', year: 2022, logo: 'img/cod/logos/mw2.png' },
    { chapter: 'Modern Warfare III', year: 2023, logo: 'img/cod/logos/mw3.png' },
    { chapter: 'Modern Warfare 4', year: 2026, logo: 'img/cod/logos/mw4.webp' },
    { chapter: 'More clips', year: 0 }
  ];
  const QUALITIES = ['4K', '2K', '1080p'];
  const PLAY = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 3.5 11 6.5-11 6.5z"/></svg>';
  const PREVIEW = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 3.5 11 6.5-11 6.5z"/></svg>';
  const SAVE = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v10m-4-4 4 4 4-4M4 16h12" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const esc = text => String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const pad = n => String(n).padStart(2, '0');
  const byId = id => COD_PACKS.find(pack => pack.id === id);
  const gameOf = pack => GAMES.find(game => game.chapter === pack.chapter);
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
  const fps = pack => pack.fps.replace('~', '').replace(' FPS', ' fps');
  const filesOf = pack => pack.files.length === 1 ? (pack.files[0].direct === false ? 'Google Drive' : '1 file') : `${pack.files.length} files`;

  // ---------- The three versions of a pack ----------
  // A pack is one version (its own resolution). More versions can sit in its
  // "editions", keyed by 4K, 2K or 1080p, each with its own files and meta.
  // Every version becomes a pack of its own in COD_PACKS, so the download and
  // preview dialogs find it by id.
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

  // ---------- A card ----------
  let cardNo = 0;
  function card(pack, { title, sub = '', all = false, logo = true } = {}) {
    const found = versions(pack);
    const offered = all ? QUALITIES : QUALITIES.filter(q => found[q]);
    const first = QUALITIES.find(q => found[q]);
    const lightest = [...QUALITIES].reverse().find(q => found[q]);
    const game = gameOf(pack);
    const key = `c${++cardNo}`;
    const label = `${pack.title}, ${pack.chapter}`;
    const canPreview = found[lightest].files.every(file => file.direct !== false);
    const choice = offered.length > 1
      ? `<div class="seg" role="radiogroup" aria-label="Quality for ${esc(label)}" data-pill><span class="pill"></span>${offered.map(q => found[q]
          ? `<button type="button" role="radio" aria-checked="${q === first}" data-q="${q}">${q}</button>`
          : `<button type="button" role="radio" aria-checked="false" disabled title="Coming soon">${q} <small>Soon</small></button>`).join('')}</div>`
      : `<span class="card-tag">${first} · ${fps(found[first])}</span>`;
    const versionsJson = esc(JSON.stringify(Object.fromEntries(Object.entries(found).map(([q, p]) => [q, p.id]))));
    return `<article class="pack-card card" data-reveal data-versions="${versionsJson}" aria-labelledby="${key}">
      <div class="pack-cover"><span class="cover-frame"><img src="${pack.poster}" alt="" loading="lazy" decoding="async"></span><span class="card-shade"></span>
        ${logo && game?.logo ? `<span class="card-logo"><img src="${game.logo}" alt="" loading="lazy" decoding="async"></span>` : ''}
        <span class="card-time">${runOf(pack)}</span>
        ${canPreview ? `<button class="card-play" type="button" data-cod-preview="${found[lightest].id}" aria-label="Preview ${esc(label)}">${PLAY}</button>` : ''}
      </div>
      <div class="card-body">
        <div class="card-title"><h3 id="${key}">${esc(title)}</h3>${sub ? `<span>${esc(sub)}</span>` : ''}</div>
        ${choice}
        <p class="card-spec" aria-live="polite"></p>
        <div class="card-actions">${canPreview ? `<button class="action secondary" type="button" data-cod-preview="${found[lightest].id}" aria-label="Preview ${esc(label)}">${PREVIEW}<span class="action-label">Preview</span></button>` : ''}<button class="action primary" type="button" data-download-pack="${found[first].id}">${SAVE}<span class="action-label">Download</span> <span class="action-size"></span></button></div>
      </div>
    </article>`;
  }
  // The chosen version decides what the card says and what Download takes.
  function setVersion(cardEl, q) {
    const ids = JSON.parse(cardEl.dataset.versions);
    const pack = byId(ids[q]);
    if (!pack) return;
    cardEl.querySelectorAll('.seg [data-q]').forEach(button => button.setAttribute('aria-checked', String(button.dataset.q === q)));
    const res = pack.resolution.replace(/\s/g, ' ');
    cardEl.querySelector('.card-spec').textContent = `${res} · ${fps(pack)} · ${filesOf(pack)}`;
    const download = cardEl.querySelector('[data-download-pack]');
    download.dataset.downloadPack = pack.id;
    download.querySelector('.action-size').textContent = sizeOf(pack);
    download.setAttribute('aria-label', `Download ${pack.title}, ${pack.chapter}, ${q}, ${sizeOf(pack)}`);
    const seg = cardEl.querySelector('.seg');
    if (seg) UI.pill(seg);
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('.card .seg [data-q]');
    if (button) setVersion(button.closest('.card'), button.dataset.q);
  });

  const block = (title, note, body) => `<section class="block"><header class="block-head" data-reveal><h2>${esc(title)}</h2><p>${esc(note)}</p></header>${body}</section>`;
  const cards = (list, three) => `<div class="cards${three ? ' is-three' : ''}">${list.join('')}</div>`;

  // ---------- Each character's view ----------
  const scenePacks = id => COD_PACKS.filter(pack => pack.group === id)
    .sort((a, b) => (gameOf(b)?.year ?? -1) - (gameOf(a)?.year ?? -1));
  const used = new Set(Object.values(GAMEPLAY).flat());
  CHARACTERS.forEach((view, i) => {
    view.no = pad(i + 1);
    if (view.id === 'cutscenes') return;
    const packs = scenePacks(view.id);
    const total = clock(packs.reduce((sum, pack) => sum + seconds(runOf(pack)), 0));
    view.stats = [['Scene packs', String(packs.length)], ['Footage', total], ['Up to', '4K']];
    let html = block('Scene packs', `${packs.length} · ${total}`, cards(packs.map(pack => card(pack, {
      title: pack.chapter, sub: gameOf(pack)?.year ? String(gameOf(pack).year) : 'Extra', all: true
    }))));
    if (view.id in GAMEPLAY) {
      const clips = GAMEPLAY[view.id].map(byId).filter(Boolean);
      html += block('Gameplay', clips.length ? `${clips.length} from Modern Warfare 4` : 'Modern Warfare 4', clips.length
        ? cards(clips.map(pack => card(pack, { title: pack.chapter, sub: 'MW4', logo: false })), true)
        : `<div class="empty" data-reveal><strong>Coming soon</strong><span>${esc(view.name)}’s gameplay is on the way.</span></div>`);
      view.stats.splice(2, 0, ['Gameplay', clips.length ? String(clips.length) : 'Soon']);
    }
    const section = document.createElement('div');
    section.className = 'view';
    section.id = `view-${view.id}`;
    section.dataset.view = view.id;
    section.hidden = true;
    section.innerHTML = html;
    views.append(section);
  });

  // ---------- The cutscenes view ----------
  const cutsView = document.getElementById('view-cutscenes');
  const campaign = byId('mw4-campaign-individual');
  const other = COD_PACKS.filter(pack => pack.group === 'gameplay' && !used.has(pack.id));
  CHARACTERS[6].stats = [['MW4 scenes', '22'], ['MW4 footage', campaign ? runOf(campaign) : '1:07:21'], ['Campaigns', '3'], ['Trailers', '3']];
  document.getElementById('cutsMore').innerHTML =
    `<div id="campaign-cutscenes">${block('Modern Warfare I–III', 'Full campaigns · 2K 60 fps', cards(['cuts1', 'cuts2', 'cuts3'].map(byId).map(pack => card(pack, { title: pack.chapter, sub: 'Google Drive' })), true))}</div>` +
    `<div id="mw4-trailers">${block('MW4 Trailers', 'Official · 4K', cards(COD_PACKS.filter(pack => pack.group === 'trailers').map(pack => card(pack, { title: pack.chapter.split(' — ')[1] || pack.chapter, sub: pack.releaseDate?.slice(0, 4) || '', logo: false })), true))}</div>` +
    (other.length ? `<div id="mw4-gameplay">${block('More gameplay', 'Modern Warfare 4', cards(other.map(pack => card(pack, { title: pack.chapter, sub: 'MW4', logo: false })), true))}</div>` : '');
  cutsView.querySelector('.mw4-collection')?.setAttribute('data-reveal', '');
  document.querySelectorAll('.card').forEach(cardEl => setVersion(cardEl, QUALITIES.find(q => JSON.parse(cardEl.dataset.versions)[q])));

  // ---------- The switch ----------
  const switchEl = document.getElementById('switch');
  switchEl.insertAdjacentHTML('beforeend', CHARACTERS.map(view => `<a href="#${view.id}" data-view-link="${view.id}">${esc(view.name)}</a>`).join(''));

  // ---------- Show a view ----------
  const nameEl = document.getElementById('heroName');
  const noEl = document.getElementById('heroNo');
  const statsEl = document.getElementById('heroStats');
  const frame = document.getElementById('frame');
  const INSIDE = { 'mw4-campaign': 'cutscenes', 'campaign-cutscenes': 'cutscenes', 'mw4-trailers': 'cutscenes', 'mw4-gameplay': 'cutscenes', gameplay: 'price' };
  CHARACTERS.forEach(view => { INSIDE[`pack-${view.id}`] = view.id; });
  const baseTitle = document.title;
  let current = null;

  function route() {
    const id = decodeURIComponent(location.hash.slice(1));
    const view = CHARACTERS.find(item => item.id === id);
    if (view) return { view };
    if (INSIDE[id]) return { view: CHARACTERS.find(item => item.id === INSIDE[id]), target: document.getElementById(id) };
    if (new URLSearchParams(location.search).has('scene')) return { view: CHARACTERS[6], target: document.getElementById('mw4-campaign') };
    return { view: CHARACTERS[0] };
  }

  // The new picture wipes in over the old one, from the side you moved toward.
  function picture(view, direction) {
    const old = frame.querySelector('img:not(.is-leaving)');
    const img = new Image();
    img.alt = '';
    img.decoding = 'async';
    img.src = view.still;
    img.style.objectPosition = view.focus;
    if (!old || UI.still()) { old?.remove(); frame.prepend(img); return; }
    const from = direction < 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)';
    const go = () => {
      old.classList.add('is-leaving');
      img.classList.add('is-coming');
      old.after(img);
      img.animate([{ clipPath: from, transform: 'scale(1.12)' }, { clipPath: 'inset(0 0 0 0)', transform: 'scale(1)' }], { duration: 1100, easing: 'cubic-bezier(.77, 0, .18, 1)' });
      old.animate([{ transform: 'scale(1)', filter: 'brightness(1)' }, { transform: `translateX(${direction < 0 ? 6 : -6}%) scale(1.04)`, filter: 'brightness(.35)' }], { duration: 1100, easing: 'cubic-bezier(.77, 0, .18, 1)', fill: 'forwards' })
        .finished.then(() => { old.remove(); img.classList.remove('is-coming'); }, () => {});
    };
    (img.decode ? img.decode() : Promise.resolve()).then(go, go);
  }

  function show(view, { direction = 1, initial = false } = {}) {
    if (view === current) return;
    current = view;
    document.body.dataset.view = view.id;
    document.title = initial && !location.hash ? baseTitle : `${view.name} — ${baseTitle}`;
    switchEl.querySelectorAll('[data-view-link]').forEach(link => {
      if (link.dataset.viewLink === view.id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    UI.pill(switchEl);
    const active = switchEl.querySelector('[aria-current=page]');
    if (switchEl.scrollWidth > switchEl.clientWidth) switchEl.scrollTo({ left: active.offsetLeft - switchEl.clientWidth / 2 + active.offsetWidth / 2, behavior: initial || UI.still() ? 'auto' : 'smooth' });

    noEl.textContent = view.no;
    UI.letters(nameEl, view.name, initial ? 120 : 0);
    statsEl.innerHTML = view.stats.map(([k]) => `<div><dt>${esc(k)}</dt><dd></dd></div>`).join('');
    statsEl.querySelectorAll('dd').forEach((dd, i) => UI.count(dd, view.stats[i][1], initial ? 1100 : 800));
    if (!initial) { UI.arrive(statsEl.children, 70); picture(view, direction); }
    else {
      // On arrival the picture opens from its centre line.
      const img = frame.querySelector('img');
      if (!img.src.endsWith(view.still)) { img.src = view.still; img.style.objectPosition = view.focus; }
      if (!UI.still()) img.animate([{ clipPath: 'inset(50% 0 50% 0)', transform: 'scale(1.15)' }, { clipPath: 'inset(0 0 0 0)', transform: 'scale(1)' }], { duration: 1400, delay: 100, easing: 'cubic-bezier(.77, 0, .18, 1)', fill: 'backwards' });
    }

    document.querySelectorAll('.view').forEach(section => { section.hidden = section.dataset.view !== view.id; });
    const section = document.getElementById(`view-${view.id}`);
    section.querySelectorAll('.seg[data-pill]').forEach(UI.pill);
    UI.reveal(section);
  }

  let pending = 0;
  addEventListener('hashchange', () => {
    const { view, target } = route();
    const from = CHARACTERS.indexOf(current), to = CHARACTERS.indexOf(view);
    show(view, { direction: pending || (to >= from ? 1 : -1) });
    pending = 0;
    if (target) target.scrollIntoView({ block: 'start' });
    else if (scrollY > frame.offsetTop + frame.offsetHeight * .5) scrollTo({ top: 0, behavior: UI.still() ? 'auto' : 'smooth' });
  });

  // Previous and next: the buttons on the picture, arrow keys, a swipe.
  function step(by) {
    const index = (CHARACTERS.indexOf(route().view) + by + CHARACTERS.length) % CHARACTERS.length;
    pending = by;
    location.hash = CHARACTERS[index].id;
  }
  frame.querySelector('[data-step="-1"]')?.addEventListener('click', () => step(-1));
  frame.querySelector('[data-step="1"]')?.addEventListener('click', () => step(1));
  addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || document.querySelector('dialog[open]')) return;
    if (event.target.closest?.('input, select, textarea, video, [contenteditable], .seg[role=radiogroup]')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
  });
  let touch = null;
  frame.addEventListener('touchstart', event => { touch = event.touches.length === 1 ? [event.touches[0].clientX, event.touches[0].clientY] : null; }, { passive: true });
  frame.addEventListener('touchend', event => {
    if (!touch) return;
    const dx = event.changedTouches[0].clientX - touch[0], dy = event.changedTouches[0].clientY - touch[1];
    touch = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const start = route();
  show(start.view, { initial: true });
  addEventListener('load', () => {
    const scene = document.getElementById('mw4Detail');
    if (start.target) start.target.scrollIntoView({ block: 'start' });
    else if (scene?.isConnected) scene.scrollIntoView({ block: 'center' });
  });
})();
