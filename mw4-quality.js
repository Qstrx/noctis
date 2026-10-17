(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const root = $('mw4Browser');
  const campaign = typeof COD_PACKS !== 'undefined' && COD_PACKS.find(pack => pack.id === 'mw4-campaign-individual');
  const recap = typeof COD_PACKS !== 'undefined' && COD_PACKS.find(pack => pack.id === 'mw4-recap');
  const qualities = ['4K', '2K', '1080p'];
  if (!root || !campaign?.editions || !recap?.editions) return;
  const packs = { campaign, recap };
  const radios = [...root.querySelectorAll('input[name="mw4-quality"]')];
  const collectionButtons = [...root.querySelectorAll('[data-mw4-collection]')];
  const search = $('mw4Search'), type = $('mw4Type'), list = $('mw4SceneList');
  const video = $('mw4Video'), poster = $('mw4Poster'), play = $('mw4Play');
  const params = new URLSearchParams(location.search);
  const initial = params.get('scene');
  let collection = initial === 'recap' ? 'recap' : 'campaign';
  let quality = qualities.includes(params.get('quality')) ? params.get('quality') : '4K';
  const selected = { campaign: Math.max(0, campaign.editions['4K'].files.findIndex(file => file.scene === initial)), recap: 0 };
  let buttons = [], load = 0, timer;
  const normalize = text => text.toLocaleLowerCase().replace(/[^a-z0-9]/g, '');
  const currentPack = () => packs[collection];
  const currentFile = (edition = quality) => currentPack().editions[edition].files[selected[collection]];
  function sceneName(file) {
    const parts = file.name.replace(/^\d+\s*[—–-]\s*/, '').split(' · ');
    return { title: parts[0], kind: parts[1] || 'Recap' };
  }
  function updateUrl() {
    const url = new URL(location.href);
    url.searchParams.set('scene', currentFile().scene);
    url.searchParams.set('quality', quality);
    try { history.replaceState(null, '', url); } catch { /* Embedded previews can restrict history. */ }
  }
  function stopPreview() {
    ++load; clearTimeout(timer);
    video.pause(); video.removeAttribute('src'); video.load(); video.hidden = true;
    poster.hidden = false; play.hidden = false;
    $('mw4VideoError').hidden = true; $('mw4VideoState').hidden = true;
  }
  function showError(id) {
    if (id !== load) return;
    clearTimeout(timer); video.pause();
    $('mw4VideoState').hidden = true; $('mw4VideoError').hidden = false;
  }
  function startPreview() {
    stopPreview();
    const id = load, file = currentFile('1080p'), name = sceneName(file);
    video.poster = file.poster;
    video.setAttribute('aria-label', name.title + ' ' + name.kind + ' preview in 1080p');
    video.src = file.url; video.hidden = false; poster.hidden = true; play.hidden = true;
    video.focus({ preventScroll: true });
    $('mw4VideoState').textContent = 'Loading 1080p preview…'; $('mw4VideoState').hidden = false;
    timer = setTimeout(() => {
      if (id === load && video.readyState < 3) $('mw4VideoState').textContent = 'Still loading. You can download the scene below.';
    }, 15000);
    video.play()?.catch(error => {
      if (id !== load || error.name === 'AbortError') return;
      if (error.name === 'NotAllowedError') {
        clearTimeout(timer); $('mw4VideoState').textContent = 'Press play in the video to start.';
      } else showError(id);
    });
  }
  function chooseQuality(value, save = true) {
    if (!qualities.includes(value)) return;
    quality = value;
    Object.values(packs).forEach(pack => Object.assign(pack, pack.editions[quality]));
    radios.forEach(radio => { radio.checked = radio.value === quality; });
    const file = currentFile();
    $('mw4DownloadLabel').textContent = 'Download ' + quality;
    $('mw4DownloadSize').textContent = file.size;
    $('mw4Download').setAttribute('aria-label', 'Download ' + file.name + ', ' + quality + ', ' + file.size);
    $('mw4QualityNote').textContent = {
      '4K': 'Maximum detail. Video kept from the existing 4K pack without another encode.',
      '2K': 'A smaller download with more detail than 1080p. Original framing and frame rate.',
      '1080p': 'The smallest download. Original framing and frame rate. Device support varies.'
    }[quality];
    $('mw4FileNote').textContent = 'MP4 · H.264 · ' + (file.audio === 'No associated audio' ? 'No associated audio' : 'AAC stereo') + ' · Under 2 GB';
    if (save) updateUrl();
  }
  function chooseScene(index, moveFocus = false) {
    if (!currentPack().editions['4K'].files[index]) return;
    stopPreview(); selected[collection] = index;
    const file = currentFile(), name = sceneName(file);
    $('mw4QuickScene').value = String(index);
    $('mw4SceneTitle').textContent = name.title;
    $('mw4SceneSubtitle').textContent = collection === 'recap' ? 'Campaign recap · Separate from the campaign sequence' : 'Scene ' + file.scene + ' of 22 · ' + name.kind;
    poster.src = file.poster;
    poster.onerror = () => { poster.onerror = null; poster.src = currentPack().poster; };
    $('mw4Duration').textContent = file.run; $('mw4Fps').textContent = file.fps + ' · native'; $('mw4Audio').textContent = file.audio;
    $('mw4Audio').classList.toggle('is-silent', file.audio === 'No associated audio');
    $('mw4Previous').disabled = index === 0; $('mw4Next').disabled = index === currentPack().editions['4K'].files.length - 1;
    qualities.forEach(value => {
      const variant = currentFile(value);
      root.querySelector('[data-mw4-dimensions="' + value + '"]').textContent = variant.resolution;
      root.querySelector('[data-mw4-size="' + value + '"]').textContent = variant.size;
    });
    buttons.forEach((button, i) => button.setAttribute('aria-current', String(i === index)));
    chooseQuality(quality);
    $('mw4SelectionStatus').textContent = file.name + ' selected. ' + file.fps + '. ' + file.audio + '.';
    if (moveFocus && window.matchMedia('(max-width: 900px)').matches) {
      $('mw4Library').dataset.expanded = 'false'; $('mw4ToggleList').setAttribute('aria-expanded', 'false');
      $('mw4Detail').scrollIntoView({ behavior: 'instant', block: 'start' }); $('mw4Detail').focus({ preventScroll: true });
    }
  }
  function filterScenes() {
    const query = normalize(search.value.trim());
    let visible = 0;
    const files = currentPack().editions['4K'].files;
    buttons.forEach((button, i) => {
      const file = files[i];
      button.parentElement.hidden = !normalize(file.name).includes(query) || (type.value !== 'all' && sceneName(file).kind !== type.value);
      if (!button.parentElement.hidden) visible++;
    });
    $('mw4Results').textContent = visible === files.length ? files.length + (files.length === 1 ? ' scene' : ' scenes') : visible + ' of ' + files.length + ' scenes';
    $('mw4Empty').hidden = visible !== 0; list.hidden = visible === 0;
  }
  function resetFilters() { search.value = ''; type.value = 'all'; filterScenes(); }
  function renderCollection(value) {
    if (!packs[value]) return;
    collection = value;
    collectionButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mw4Collection === value)));
    type.disabled = value === 'recap';
    list.setAttribute('aria-label', value === 'recap' ? 'Campaign recap' : 'Campaign cutscenes'); list.replaceChildren();
    $('mw4QuickScene').replaceChildren();
    buttons = currentPack().editions['4K'].files.map((file, index) => {
      const name = sceneName(file), li = document.createElement('li'), button = document.createElement('button');
      const option = document.createElement('option'); option.value = String(index); option.textContent = file.name; $('mw4QuickScene').append(option);
      button.type = 'button'; button.className = 'mw4-scene';
      button.setAttribute('aria-label', 'Select ' + file.name + ', ' + file.run);
      const number = document.createElement('span'); number.className = 'mw4-scene-number'; number.textContent = value === 'recap' ? '' : file.scene; number.setAttribute('aria-hidden', 'true');
      const image = document.createElement('img'); image.src = file.thumbnail; image.alt = ''; image.width = 240; image.height = 102; image.loading = 'lazy'; image.decoding = 'async';
      const info = document.createElement('span'); info.className = 'mw4-scene-info';
      const title = document.createElement('strong'); title.textContent = name.title;
      const meta = document.createElement('small'); meta.textContent = name.kind + ' · ' + file.run; info.append(title, meta);
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); arrow.setAttribute('viewBox', '0 0 20 20'); arrow.setAttribute('fill', 'none'); arrow.setAttribute('aria-hidden', 'true');
      const path = document.createElementNS(arrow.namespaceURI, 'path'); path.setAttribute('d', 'm8 5 5 5-5 5'); path.setAttribute('stroke', 'currentColor'); path.setAttribute('stroke-width', '1.5'); arrow.append(path);
      button.append(number, image, info, arrow); button.addEventListener('click', () => chooseScene(index, true)); li.append(button); list.append(li);
      return button;
    });
    $('mw4LibraryFoot').textContent = value === 'recap' ? 'A separate story recap · 2:32' : '22 scenes · 1:07:21 total';
    resetFilters(); chooseScene(selected[collection]); list.scrollTop = 0;
  }
  radios.forEach(radio => radio.addEventListener('change', () => chooseQuality(radio.value)));
  collectionButtons.forEach(button => button.addEventListener('click', () => renderCollection(button.dataset.mw4Collection)));
  $('mw4QuickScene').addEventListener('change', () => chooseScene(Number($('mw4QuickScene').value)));
  $('mw4ToggleList').addEventListener('click', () => {
    const expanded = $('mw4Library').dataset.expanded !== 'true';
    $('mw4Library').dataset.expanded = String(expanded); $('mw4ToggleList').setAttribute('aria-expanded', String(expanded));
  });
  search.addEventListener('input', filterScenes); type.addEventListener('change', filterScenes);
  $('mw4Reset').addEventListener('click', () => { resetFilters(); search.focus(); });
  $('mw4Previous').addEventListener('click', () => { resetFilters(); chooseScene(selected[collection] - 1); buttons[selected[collection]].scrollIntoView({ block: 'nearest' }); });
  $('mw4Next').addEventListener('click', () => { resetFilters(); chooseScene(selected[collection] + 1); buttons[selected[collection]].scrollIntoView({ block: 'nearest' }); });
  $('mw4Browse').addEventListener('click', () => { $('mw4Library').scrollIntoView({ behavior: 'instant', block: 'start' }); $('mw4QuickScene').focus({ preventScroll: true }); });
  $('mw4Download').addEventListener('click', event => {
    const file = currentFile();
    video.pause();
    if (typeof window.archive?.askFile === 'function') window.archive.askFile(file, file.name + ' · ' + quality, event.currentTarget);
    else { $('mw4SelectionStatus').textContent = 'The download control could not load. Reload the page and try again.'; $('mw4Fallback').hidden = false; }
  });
  play.addEventListener('click', startPreview); $('mw4Retry').addEventListener('click', startPreview);
  video.addEventListener('error', () => { if (!video.hidden && video.getAttribute('src')) showError(load); });
  ['playing', 'canplay'].forEach(event => video.addEventListener(event, () => { clearTimeout(timer); $('mw4VideoState').hidden = true; }));
  video.addEventListener('waiting', () => { if (!video.hidden && $('mw4VideoError').hidden) { $('mw4VideoState').textContent = 'Buffering preview…'; $('mw4VideoState').hidden = false; } });
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
  document.addEventListener('play', event => { if (event.target !== video) video.pause(); }, true);
  renderCollection(collection); root.hidden = false; $('mw4Fallback').hidden = true;
})();
