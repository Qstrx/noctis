(() => {
  'use strict';
  // Call of Duty: one slice per character, then the full cutscenes and the
  // trailers. A slice
  // opens its sheet (shelf.js): the packs from Modern Warfare to MW4, each in
  // 4K, 2K and 1080p, and for Price, Ghost and Gaz their gameplay. Everything
  // is built from COD_PACKS here, before site.js and motion.js run, so
  // Preview and Download work on these rows as on any other card.
  const slices = document.getElementById('slices');
  if (!slices || !window.Shelf || typeof COD_PACKS === 'undefined') return;

  const VIEWS = [
    { id: 'price', name: 'John Price', still: 'img/stage/price.jpg', focus: '36% 30%' },
    { id: 'gaz', name: 'Gaz', still: 'img/stage/gaz.jpg', focus: '44% 30%' },
    { id: 'ghost', name: 'Ghost', still: 'img/stage/ghost.jpg', focus: '56% 30%' },
    { id: 'soap', name: 'Soap', still: 'img/stage/soap.jpg', focus: '46% 34%' },
    { id: 'farah', name: 'Farah', still: 'img/stage/farah.jpg', focus: '68% 30%' },
    { id: 'alex', name: 'Alex' },
    { id: 'graves', name: 'Graves' },
    { id: 'valeria', name: 'Valeria', still: 'img/stage/valeria.jpg', focus: '52% 40%' },
    { id: 'laswell', name: 'Laswell' },
    { id: 'dunn', name: 'Dunn' },
    { id: 'archer', name: 'The Archer', still: 'img/stage/archer.jpg', focus: '58% 30%' },
    { id: 'cutscenes', name: 'Full cutscenes', still: 'img/stage/cutscenes.jpg', focus: '50% 40%' },
    { id: 'trailers', name: 'Trailers', still: 'img/stage/trailers.jpg', focus: '62% 50%' }
  ];
  const SPECIAL = ['cutscenes', 'trailers'];
  // Which MW4 gameplay shows under which character. For now Price, Ghost and
  // Gaz each show all six.
  const MW4_GAMEPLAY = COD_PACKS.filter(pack => pack.group === 'gameplay').map(pack => pack.id);
  const GAMEPLAY = { price: MW4_GAMEPLAY, ghost: MW4_GAMEPLAY, gaz: MW4_GAMEPLAY };
  const YEARS = { 'Modern Warfare': 2019, 'Modern Warfare II': 2022, 'Modern Warfare III': 2023, 'Modern Warfare 4': 2026 };
  const QUALITIES = ['4K', '2K', '1080p'];
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
  function row(pack, { title, sub, all = false }) {
    const found = versions(pack);
    const first = QUALITIES.find(q => found[q]);
    const lightest = [...QUALITIES].reverse().find(q => found[q]);
    const label = `${pack.title}, ${pack.chapter}`;
    const key = `r${++rowNo}`;
    const offered = all ? QUALITIES : QUALITIES.filter(q => found[q]);
    const choice = offered.length > 1
      ? `<div class="seg" role="radiogroup" aria-label="Quality" data-pill><span class="pill"></span>${offered.map(q => found[q]
          ? `<button type="button" role="radio" aria-checked="${q === first}" data-q="${q}">${q}</button>`
          : `<button type="button" role="radio" aria-checked="false" disabled title="Coming soon">${q}</button>`).join('')}</div>`
      : `<span class="row-tag">${first}</span>`;
    const canPreview = found[lightest].files.every(file => file.direct !== false);
    const ids = esc(JSON.stringify(Object.fromEntries(Object.entries(found).map(([q, p]) => [q, p.id]))));
    return `<li class="row pack-card" style="--r:${rowNo % 12}" data-versions="${ids}" aria-labelledby="${key}">
      <div class="pack-cover"><span class="cover-frame"><img src="${pack.poster}" alt="" loading="lazy" decoding="async"></span>${canPreview ? `<button class="row-play" type="button" data-cod-preview="${found[lightest].id}" aria-label="Preview ${esc(label)}"><i>${PLAY}</i></button>` : ''}</div>
      <div class="row-text"><h3 id="${key}">${esc(title)}</h3><p>${esc(sub)}</p></div>
      ${choice}
      <button class="action primary" type="button" data-download-pack="${found[first].id}">${SAVE}<span class="action-label">Download</span> <span class="action-size">${sizeOf(found[first])}</span></button>
    </li>`;
  }
  function setVersion(rowEl, q) {
    const pack = byId(JSON.parse(rowEl.dataset.versions)[q]);
    if (!pack) return;
    rowEl.querySelectorAll('.seg [data-q]').forEach(button => button.setAttribute('aria-checked', String(button.dataset.q === q)));
    const download = rowEl.querySelector('[data-download-pack]');
    download.dataset.downloadPack = pack.id;
    download.querySelector('.action-size').textContent = sizeOf(pack);
    download.setAttribute('aria-label', `Download ${pack.title}, ${pack.chapter}, ${q}, ${sizeOf(pack)}`);
    const seg = rowEl.querySelector('.seg');
    if (seg) UI.pill(seg);
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('.row .seg [data-q]');
    if (button) setVersion(button.closest('.row'), button.dataset.q);
  });
  const rows = list => `<ul class="rows">${list.join('')}</ul>`;
  const label = text => `<p class="label">${esc(text)}</p>`;

  // ---------- The sheets ----------
  const parts = document.getElementById('sheetParts');
  VIEWS.forEach(view => {
    if (SPECIAL.includes(view.id)) return;
    // From Modern Warfare to MW4; more clips last.
    const packs = COD_PACKS.filter(pack => pack.group === view.id)
      .sort((a, b) => (YEARS[a.chapter] || 9999) - (YEARS[b.chapter] || 9999));
    const clips = (GAMEPLAY[view.id] || []).map(byId).filter(Boolean);
    view.meta = packs.length ? `${plural(packs.length, 'pack')} · ${clock(packs.reduce((sum, pack) => sum + seconds(runOf(pack)), 0))}` : 'Coming soon';
    view.count = packs.length ? plural(packs.length, 'pack') + (clips.length ? ` · ${clips.length} gameplay` : '') : 'Coming soon';
    const part = document.createElement('div');
    part.className = 'sheet-part';
    part.dataset.part = view.id;
    part.hidden = true;
    part.innerHTML = label('Scene packs') + (packs.length ? rows(packs.map(pack => row(pack, {
      title: pack.chapter, sub: `${YEARS[pack.chapter] || 'Extra'} · ${runOf(pack)}`, all: true
    }))) : `<p class="empty">${esc(view.name)}’s scene packs are on the way.</p>`) + (view.id in GAMEPLAY ? label('Gameplay') + rows(clips.map(pack => row(pack, { title: pack.chapter, sub: `MW4 · ${runOf(pack)}` }))) : '');
    parts.append(part);
  });
  // Full cutscenes: Modern Warfare to MW III, then the MW4 campaign.
  const campaign = byId('mw4-campaign-individual');
  const cuts = VIEWS.find(view => view.id === 'cutscenes');
  cuts.meta = 'MW · MW II · MW III · MW4';
  cuts.count = 'MW to MW4';
  // Trailers: their own sheet.
  const trailers = VIEWS.find(view => view.id === 'trailers');
  const trailerPacks = COD_PACKS.filter(pack => pack.group === 'trailers');
  trailers.meta = `${plural(trailerPacks.length, 'trailer')} · 4K`;
  trailers.count = plural(trailerPacks.length, 'trailer');
  const trailerPart = document.createElement('div');
  trailerPart.className = 'sheet-part';
  trailerPart.dataset.part = 'trailers';
  trailerPart.hidden = true;
  trailerPart.innerHTML = label('Modern Warfare 4') + '<ul class="rows" id="trailerRows"></ul>';
  parts.append(trailerPart);
  document.getElementById('cutsRows').innerHTML = ['cuts1', 'cuts2', 'cuts3'].map(byId).map(pack => row(pack, { title: pack.chapter, sub: `${YEARS[pack.chapter]} · ${runOf(pack)}` })).join('');
  document.getElementById('trailerRows').innerHTML = COD_PACKS.filter(pack => pack.group === 'trailers').map(pack => row(pack, {
    title: pack.chapter.split(' — ')[1] || pack.chapter, sub: `${pack.releaseDate?.slice(0, 4) || ''} · ${runOf(pack)}`
  })).join('');
  if (campaign) document.getElementById('mw4Label').textContent = `Modern Warfare 4 · 22 scenes · ${runOf(campaign)}`;
  document.querySelectorAll('.row[data-versions]').forEach(rowEl => setVersion(rowEl, QUALITIES.find(q => JSON.parse(rowEl.dataset.versions)[q])));

  // ---------- The slices ----------
  slices.classList.add('is-many');
  slices.innerHTML = VIEWS.map((view, i) => `<a class="slice${view.still ? '' : ' is-blank'}" href="#${view.id}" data-view="${view.id}" style="--n:${i}">${view.still ? `<img class="slice-pic" src="${view.still}" alt="" style="object-position:${view.focus}" decoding="async">` : ''}<span class="slice-name">${esc(view.name)}</span><span class="slice-count">${esc(view.count)}</span></a>`).join('');
  VIEWS.forEach(view => Shelf.add(view.id, view));
  // A link to an MW4 scene opens the cutscenes with that scene.
  if (!location.hash && new URLSearchParams(location.search).has('scene')) {
    history.replaceState(history.state, '', '#cutscenes');
    addEventListener('load', () => document.getElementById('mw4Detail')?.scrollIntoView({ block: 'center' }));
  }
  // Old addresses still land in the right sheet.
  Shelf.start({ aliases: { 'mw4-campaign': 'cutscenes', 'campaign-cutscenes': 'cutscenes', 'mw4-trailers': 'trailers', gameplay: 'price', 'pack-gameplay': 'price', 'pack-price': 'price', 'pack-gaz': 'gaz', 'pack-ghost': 'ghost', 'pack-soap': 'soap', 'pack-valeria': 'valeria', 'pack-archer': 'archer' } });
})();
