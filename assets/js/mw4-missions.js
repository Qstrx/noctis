(() => {
  'use strict';
  // A campaign: one card per mission, its scenes as chips. Choosing a scene
  // opens it right under its mission's row, with a 1080p preview on request,
  // the three resolutions and the existing download flow. MW4 and each of
  // Modern Warfare I–III get one such grid.
  const packById = id => typeof COD_PACKS !== 'undefined' && COD_PACKS.find(pack => pack.id === id);
  const QUALITIES = ['4K', '2K', '1080p'];
  const NOTES = {
    '4K': 'Maximum detail. Video kept without another encode.',
    '2K': 'A smaller download with more detail than 1080p. Original framing and frame rate.',
    '1080p': 'The smallest download. Original framing and frame rate. Device support varies.'
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Phones get a nudge toward the lighter files; on a computer any resolution is fine.
  const phone = navigator.userAgentData?.mobile || /iPhone|iPod|Android.+Mobile|Windows Phone/i.test(navigator.userAgent)
    || (matchMedia('(pointer: coarse)').matches && Math.max(screen.width, screen.height) < 1000);
  const PHONE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>';
  const icon = (d, filled) => `<svg viewBox="0 0 20 20" ${filled ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true"><path d="${d}"/></svg>`;
  const esc = text => String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // Controllers own media and rendering; cod-page owns the single URL state.
  const controllers = new Map();
  let navigate = () => {};
  window.CampaignNavigation = {
    connect(handler) { navigate = handler; },
    sceneExists(game, scene) { return controllers.get(game)?.hasScene(scene) || false; },
    activate(game, scene, quality = '4K') {
      controllers.forEach((controller, id) => controller.sync(id === game ? scene : null, quality, id === game));
    },
    stop() { controllers.forEach(controller => controller.stop()); }
  };
  addEventListener('oceans:viewchange', event => {
    if (event.detail.view !== 'cutscenes') window.CampaignNavigation.stop();
  });

  function campaignGrid({ grid, packs, prefix, param }) {
  // Every scene with its three editions; a recap closes the list.
  const scenes = [];
  packs.forEach(([pack, isRecap]) => pack.editions['4K'].files.forEach((file, i) => {
    const [title, kind] = file.name.replace(/^\d+\s*[—–-]\s*/, '').split(' · ');
    scenes.push({
      index: scenes.length, no: isRecap ? 'recap' : file.scene, title, kind: isRecap ? 'Recap' : kind, recap: isRecap,
      run: file.run, poster: file.poster,
      by: Object.fromEntries(QUALITIES.map(q => [q, pack.editions[q].files[i]]))
    });
  }));
  // Consecutive scenes of one mission share a card.
  const missions = [];
  scenes.forEach(scene => {
    const last = missions[missions.length - 1];
    if (last && !scene.recap && last.title === scene.title) last.scenes.push(scene);
    else missions.push({ title: scene.title, recap: scene.recap, scenes: [scene] });
    scene.mission = missions.length - 1;
  });

  grid.innerHTML = missions.map((mission, m) => {
    const first = mission.scenes[0], last = mission.scenes[mission.scenes.length - 1];
    const label = mission.recap ? 'Recap' : first === last ? 'Scene ' + first.no : `Scenes ${first.no}–${last.no}`;
    return `<li class="mw4-mission${mission.recap ? ' is-recap' : ''}" data-mission="${m}">
      <button type="button" class="mw4-mission-cover" data-scene="${first.index}" aria-expanded="false" aria-controls="${prefix}Detail" aria-label="${esc([label + (!first.kind ? ' ' + first.run : ''), 'Open ' + mission.title, first.kind].filter(Boolean).join(': '))}"><img src="${first.poster}" alt="" width="1200" height="510" loading="lazy"><span class="mw4-mission-no">${esc(label)}</span> ${first.kind ? '' : `<span class="mw4-mission-run">${first.run}</span>`}</button>
      <h3 class="mw4-mission-title">${esc(mission.title)}</h3>
      ${first.kind ? `<div class="mw4-clips">${mission.scenes.map(scene => `<button type="button" class="mw4-clip" data-scene="${scene.index}" aria-controls="${prefix}Detail" aria-expanded="false" aria-label="${esc(`${scene.kind} ${scene.run}: ${mission.title}`)}"><b>${esc(scene.kind)}</b> ${scene.run}</button>`).join('')}</div>` : ''}
    </li>`;
  }).join('');

  const detail = document.createElement('li');
  detail.className = 'mw4-detail';
  detail.id = `${prefix}Detail`;
  detail.hidden = true;
  grid.append(detail);
  detail.setAttribute('aria-labelledby', `${prefix}SceneTitle`);
  detail.innerHTML = `
    <div class="mw4-media">
      <img class="mw4-poster" alt="" width="1200" height="510" decoding="async">
      <button type="button" class="mw4-play"><span class="mw4-play-icon">${icon('m7 4 9 6-9 6V4Z', true)}</span><span>Play preview<small>1080p · uses data</small></span></button>
      <p class="mw4-video-state" role="status" hidden></p>
      <div class="mw4-video-error" role="alert" hidden><strong>Preview could not load</strong><p>You can still download this scene, or try the preview again.</p><button type="button" class="mw4-retry">Retry preview</button></div>
    </div>
    <div class="mw4-body">
      <p class="preview-data-note mw4-data-use"></p>
      <div class="mw4-detail-head">
        <div><p class="mw4-kicker"></p><h3 class="mw4-detail-title" id="${prefix}SceneTitle" tabindex="-1"></h3></div>
        <div class="mw4-detail-nav">
          <button type="button" class="mw4-step" data-step="-1" aria-label="Previous scene">${icon('m12 4-6 6 6 6')}</button>
          <button type="button" class="mw4-step" data-step="1" aria-label="Next scene">${icon('m8 4 6 6-6 6')}</button>
          <button type="button" class="mw4-close" aria-label="Close the scene">${icon('m5 5 10 10M15 5 5 15')}</button>
        </div>
      </div>
      <dl class="mw4-facts"><div><dt>Duration</dt><dd data-fact="run"></dd></div></dl>
      <fieldset class="mw4-res"><legend>Resolution</legend>${QUALITIES.map(q => `<label><input type="radio" name="${prefix}-quality" value="${q}"><span class="mw4-res-face"><b>${q}</b><em data-size></em></span></label>`).join('')}</fieldset>
      <p class="mw4-res-note" role="status"></p>
      <div class="mw4-phone-tip" hidden><span class="mw4-tip-icon">${PHONE_ICON}</span><p><strong>On a phone?</strong> <span class="mw4-tip-text"></span></p><div class="mw4-tip-picks"><button type="button" data-quality="2K"></button><button type="button" data-quality="1080p"></button></div></div>
      <button type="button" class="mw4-download">${icon('M10 2v11m-4-4 4 4 4-4M3 14v3h14v-3')}<span class="mw4-download-label"></span> <span class="mw4-download-size"></span></button>
    </div>`;
  const $ = selector => detail.querySelector(selector);
  const media = $('.mw4-media'), poster = $('.mw4-poster'), state = $('.mw4-video-state'), failure = $('.mw4-video-error');

  let quality = '4K', current = 0, open = false, opener = null;
  // The download dialog resolves the chosen edition by its file URL.
  const useEdition = () => packs.forEach(([pack]) => Object.assign(pack, pack.editions[quality]));
  const saveUrl = () => navigate({ game: prefix, scene: open ? scenes[current].no : null, quality });

  // Previews stream the 1080p edition, only when asked for.
  let video = null, load = 0, slow = 0;
  function stopPreview() {
    load++; clearTimeout(slow);
    if (video) { video.pause(); video.removeAttribute('src'); video.load(); video.remove(); video = null; }
    media.classList.remove('is-playing'); state.hidden = true; failure.hidden = true;
  }
  function startPreview() {
    stopPreview();
    const id = load, scene = scenes[current];
    video = document.createElement('video');
    video.className = 'mw4-video'; video.controls = true; video.playsInline = true; video.preload = 'auto'; video.poster = scene.poster;
    video.setAttribute('aria-label', `${scene.title} ${scene.kind || ''} preview in 1080p`);
    video.addEventListener('error', () => { if (id === load) { clearTimeout(slow); state.hidden = true; failure.hidden = false; } });
    ['playing', 'canplay'].forEach(name => video.addEventListener(name, () => { if (id === load) { clearTimeout(slow); state.hidden = true; } }));
    video.addEventListener('waiting', () => { if (id === load && failure.hidden) { state.textContent = 'Buffering preview…'; state.hidden = false; } });
    const file = scene.by['1080p'];
    const source = window.archive?.previewSource ? window.archive.previewSource(file) : file.url;
    if (!source) { video = null; failure.hidden = false; return; }
    video.src = source;
    window.archive?.attachPreviewTracks?.(video, file);
    media.prepend(video); media.classList.add('is-playing');
    state.textContent = 'Loading 1080p preview…'; state.hidden = false;
    slow = setTimeout(() => { if (id === load && video?.readyState < 3) state.textContent = 'Still loading. You can download the scene below.'; }, 15000);
    video.focus({ preventScroll: true });
    video.play()?.catch(error => {
      if (id !== load || error.name === 'AbortError') return;
      if (error.name === 'NotAllowedError') { clearTimeout(slow); state.textContent = 'Press play in the video to start.'; }
      else { state.hidden = true; failure.hidden = false; }
    });
  }

  function render() {
    const scene = scenes[current], file = scene.by[quality];
    poster.src = scene.poster;
    $('.mw4-data-use').textContent = window.archive?.previewDataNotice?.(scene.by['1080p']) || `Preview streams the 1080p file (${scene.by['1080p'].size}). Uses data.`;
    $('.mw4-kicker').textContent = scene.recap ? 'Campaign recap · separate from the 22 scenes' : `Scene ${scene.no} of ${scenes.filter(item => !item.recap).length}${scene.kind ? ` · ${scene.kind}` : ''}`;
    $('.mw4-detail-title').textContent = scene.recap ? 'Campaign Recap' : scene.kind ? `${scene.title} · ${scene.kind}` : scene.title;
    $('[data-fact=run]').textContent = scene.run;
    detail.querySelectorAll('.mw4-res input').forEach(input => {
      const variant = scene.by[input.value], face = input.nextElementSibling;
      input.checked = input.value === quality;
      face.querySelector('[data-size]').textContent = variant.size;
    });
    $('.mw4-res-note').textContent = NOTES[quality];
    $('.mw4-phone-tip').hidden = !(phone && quality === '4K');
    $('.mw4-tip-text').textContent = '4K is too heavy for many phones. If it won’t play or import, take a lighter file:';
    detail.querySelectorAll('.mw4-tip-picks button').forEach(button => {
      const variant = scene.by[button.dataset.quality];
      button.textContent = `${button.dataset.quality} · ${variant.size}`;
      button.setAttribute('aria-label', `${button.dataset.quality} · ${variant.size}: Switch resolution`);
    });
    $('.mw4-download-label').textContent = 'Download ' + quality;
    $('.mw4-download-size').textContent = file.size;
    $('.mw4-download').setAttribute('aria-label', `Download ${quality} ${file.size}: ${file.name}`);
    $('[data-step="-1"]').disabled = current === 0;
    $('[data-step="1"]').disabled = current === scenes.length - 1;
    detail.hidden = !open;
    grid.querySelectorAll('[data-scene]').forEach(clip => {
      const on = open && Number(clip.dataset.scene) === current;
      clip.setAttribute('aria-expanded', String(on));
      if (on) clip.setAttribute('aria-current', 'true'); else clip.removeAttribute('aria-current');
    });
    grid.querySelectorAll('.mw4-mission').forEach(card => card.classList.toggle('is-open', open && Number(card.dataset.mission) === scene.mission));
  }
  // The open scene sits right under the row of its mission, its notch under the card.
  function place() {
    if (!open) return;
    const card = grid.querySelector(`[data-mission="${scenes[current].mission}"]`);
    let last = card;
    for (let next = card.nextElementSibling; next; next = next.nextElementSibling) {
      if (next === detail) continue;
      if (next.offsetTop !== card.offsetTop) break;
      last = next;
    }
    if (last.nextElementSibling !== detail) last.after(detail);
    const cardBox = card.getBoundingClientRect(), gridBox = grid.getBoundingClientRect();
    detail.style.setProperty('--notch', `${cardBox.left - gridBox.left + cardBox.width / 2}px`);
  }
  function show(index, { focus = false } = {}) {
    if (!scenes[index]) return;
    if (index !== current) stopPreview();
    current = index; open = true;
    render(); place(); saveUrl();
    if (focus) {
      $('.mw4-detail-title').focus({ preventScroll: true });
      detail.scrollIntoView({ block: 'nearest', behavior: reduced.matches ? 'auto' : 'smooth' });
    }
  }
  function close() {
    const returnTo = opener;
    stopPreview(); open = false; render(); saveUrl();
    if (returnTo?.isConnected) returnTo.focus({ preventScroll: true });
  }

  grid.addEventListener('click', event => {
    const target = event.target.closest('[data-scene]');
    if (!target || detail.contains(target)) return;
    const index = Number(target.dataset.scene);
    if (open && index === current && (target.classList.contains('mw4-clip') || !scenes[index].kind)) { close(); return; }
    opener = target;
    show(index, { focus: true });
  });
  $('.mw4-play').addEventListener('click', startPreview);
  $('.mw4-retry').addEventListener('click', startPreview);
  $('.mw4-close').addEventListener('click', close);
  detail.querySelectorAll('.mw4-step').forEach(button => button.addEventListener('click', () => {
    const index = current + Number(button.dataset.step);
    opener = grid.querySelector(`[data-scene="${index}"]`) || opener;
    show(index);
    detail.scrollIntoView({ block: 'nearest', behavior: reduced.matches ? 'auto' : 'smooth' });
  }));
  detail.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !event.defaultPrevented && !document.querySelector('dialog[open]')) {
      event.preventDefault(); event.stopPropagation(); close();
    }
  });
  function setQuality(value) {
    if (!QUALITIES.includes(value)) return;
    quality = value; useEdition(); render(); saveUrl();
  }
  $('.mw4-res').addEventListener('change', event => setQuality(event.target.value));
  // The tip goes away once a lighter file is chosen, so focus moves to that choice.
  detail.querySelectorAll('.mw4-tip-picks button').forEach(button => button.addEventListener('click', () => {
    setQuality(button.dataset.quality);
    $('.mw4-res input:checked')?.focus();
  }));
  $('.mw4-download').addEventListener('click', event => {
    const file = scenes[current].by[quality];
    video?.pause();
    if (typeof window.archive?.askFile === 'function') window.archive.askFile(file, file.name + ' · ' + quality, event.currentTarget);
    else document.getElementById('mw4Fallback').hidden = false;
  });
  addEventListener('resize', place);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopPreview(); });
  document.addEventListener('play', event => { if (video && event.target !== video) video.pause(); }, true);

  controllers.set(prefix, {
    hasScene(no) { return scenes.some(scene => scene.no === no); },
    stop: stopPreview,
    sync(no, selectedQuality, active) {
      const linked = active && scenes.find(scene => scene.no === no);
      const next = linked ? linked.index : 0;
      if (!active || !linked || next !== current) stopPreview();
      quality = QUALITIES.includes(selectedQuality) ? selectedQuality : '4K';
      current = next;
      open = !!linked;
      if (open && (!opener || Number(opener.dataset.scene) !== current)) {
        opener = grid.querySelector(`.mw4-clip[data-scene="${current}"]`) || grid.querySelector(`[data-scene="${current}"]`);
      }
      useEdition(); render();
      if (open) place();
    }
  });
  grid.hidden = false;
  useEdition();
  render();
  }

  // On a phone, the phone advice comes first in the guide.
  const guide = document.getElementById('mw4Guide');
  if (guide) guide.dataset.yours = phone ? 'phone' : 'computer';
  const mw4 = packById('mw4-campaign-individual'), recap = packById('mw4-recap');
  const mw4Grid = document.getElementById('mw4Missions');
  if (mw4Grid && mw4?.editions && recap?.editions) {
    campaignGrid({ grid: mw4Grid, packs: [[mw4, false], [recap, true]], prefix: 'mw4', param: 'scene' });
    document.getElementById('mw4Fallback').hidden = true;
  }
  ['mw1', 'mw2', 'mw3'].forEach(prefix => {
    const pack = packById(`${prefix}-campaign-individual`);
    const grid = document.getElementById(`${prefix}Missions`);
    if (grid && pack?.files?.length) campaignGrid({ grid, packs: [[pack, false]], prefix, param: prefix });
  });
})();
