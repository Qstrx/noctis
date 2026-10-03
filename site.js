(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const world = document.body.dataset.world || 'home';
  const create = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  const restoreFocus = element => {
    if (element?.isConnected && element.getClientRects().length && !document.querySelector('dialog[open]')) {
      element.focus({ preventScroll: true });
    }
  };

  // Scene links retain the original SIX player and its timestamp format.
  if (world !== 'six' && /^#preview=s[12]-e\d{2}-p[12](?:&|$)/.test(location.hash)) {
    location.replace('six.html' + location.hash);
    return;
  }

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let motionPreference = 'on';
  try {
    const saved = localStorage.getItem('oceans-motion');
    if (saved === 'on' || saved === 'off') motionPreference = saved;
  } catch { /* Private browsing may make storage unavailable. */ }
  const previewDialogs = [...document.querySelectorAll('#preview, #codPreview')];
  function syncMotion() {
    const enabled = motionPreference !== 'off' && !reducedMotion.matches;
    const previewOpen = previewDialogs.some(dialog => dialog.open);
    document.body.dataset.motion = enabled ? 'on' : 'off';
    document.body.classList.toggle('preview-open', previewOpen);
    document.querySelectorAll('.motion-toggle').forEach(button => {
      button.setAttribute('aria-pressed', String(enabled));
      button.disabled = reducedMotion.matches;
      button.title = reducedMotion.matches ? 'Motion is off because of your device accessibility setting.' : 'Pause or resume animations';
      const label = button.querySelector('.motion-label');
      if (label) label.textContent = enabled ? 'Motion on' : 'Motion paused';
      button.setAttribute('aria-label', enabled ? 'Pause animations' : 'Resume animations');
      const icon = button.querySelector('svg path');
      if (icon) icon.setAttribute('d', enabled ? 'M9 5v14M15 5v14' : 'M8 5l10 7-10 7Z');
    });
    window.dispatchEvent(new CustomEvent('oceans:motion', { detail: { enabled: enabled && !previewOpen } }));
  }
  document.querySelectorAll('.motion-toggle').forEach(button => {
    button.addEventListener('click', () => {
      motionPreference = motionPreference === 'off' ? 'on' : 'off';
      try { localStorage.setItem('oceans-motion', motionPreference); } catch {}
      syncMotion();
    });
  });
  reducedMotion.addEventListener('change', syncMotion);
  previewDialogs.forEach(dialog => {
    new MutationObserver(syncMotion).observe(dialog, { attributes: true, attributeFilter: ['open'] });
    dialog.addEventListener('close', syncMotion);
  });
  syncMotion();

  const cards = [...document.querySelectorAll('.pack-card')];
  const groups = [...document.querySelectorAll('.pack-group')];
  const search = $('packSearch');
  const filterButtons = [...document.querySelectorAll('.filter-button[data-filter]')];
  const resultCount = $('resultCount');
  const emptyResults = $('emptyResults');
  const normalize = text => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const searchableCards = cards.map(card => ({ card, text: normalize(card.dataset.search || card.textContent) }));
  let activeFilter = 'all';
  function filterPacks() {
    const before = window.archiveMotion?.captureLayout();
    const words = normalize(search?.value).split(/\s+/).filter(Boolean);
    let visible = 0;
    searchableCards.forEach(({ card, text }) => {
      const matches = (activeFilter === 'all' || card.dataset.kind === activeFilter) && words.every(word => text.includes(word));
      card.hidden = !matches;
      if (matches) visible++;
    });
    groups.forEach(group => { group.hidden = ![...group.querySelectorAll('.pack-card')].some(card => !card.hidden); });
    filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter)));
    if (resultCount) resultCount.textContent = visible === cards.length
      ? `${visible} scene ${visible === 1 ? 'pack' : 'packs'}`
      : `${visible} of ${cards.length} scene packs`;
    if (emptyResults) emptyResults.hidden = visible !== 0;
    window.archiveMotion?.animateLayout(before);
  }
  if (cards.length) {
    if (resultCount) {
      resultCount.setAttribute('role', 'status');
      resultCount.setAttribute('aria-live', 'polite');
      resultCount.setAttribute('aria-atomic', 'true');
    }
    search?.addEventListener('input', filterPacks);
    filterButtons.forEach(button => button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      filterPacks();
    }));
    $('resetFilters')?.addEventListener('click', () => {
      activeFilter = 'all';
      if (search) search.value = '';
      filterPacks();
      search?.focus({ preventScroll: true });
    });
    filterPacks();
  }

  const downloadDialog = $('hit');
  const choices = $('downloadChoices');
  const downloadGo = $('hitGo');
  let pendingFile = null;
  let downloadOpener = null;
  function showActionError(message) {
    let error = $('archiveActionError');
    if (!error) {
      error = create('p', '', 'action-error');
      error.id = 'archiveActionError';
      error.setAttribute('role', 'alert');
      const tools = document.querySelector('.archive-tools, .catalog-tools');
      (tools || document.querySelector('main') || document.body).append(error);
    }
    error.textContent = message;
  }
  function safeFile(file) {
    if (!file?.url) return false;
    try { return new URL(file.url).protocol === 'https:'; } catch { return false; }
  }
  function externalLabel(file) {
    if (file.direct !== false) return 'Start download';
    return file.url.includes('mega.nz') ? 'Open Mega' : 'Open Google Drive';
  }
  function closeDownload() {
    pendingFile = null;
    if (downloadDialog?.open) downloadDialog.close();
  }
  function startDownload() {
    if (!safeFile(pendingFile)) return;
    const file = pendingFile;
    pendingFile = null;
    const link = document.createElement('a');
    link.href = file.url;
    link.rel = 'noopener noreferrer';
    if (file.direct === false) link.target = '_blank';
    else link.download = '';
    document.body.append(link);
    link.click();
    link.remove();
    closeDownload();
  }
  function prepareDownload(label, opener) {
    if (!downloadDialog || !choices || !downloadGo) return false;
    if (!downloadDialog.open) downloadOpener = opener || document.activeElement;
    $('hitS').textContent = label;
    choices.replaceChildren();
    return true;
  }
  function askFile(file, label, opener) {
    if (!safeFile(file)) { showActionError('This file is unavailable. Choose another pack or try again later.'); return; }
    if (!prepareDownload(label, opener)) {
      pendingFile = file;
      startDownload();
      return;
    }
    pendingFile = file;
    downloadGo.hidden = false;
    // Keep the authored download icon when changing the action label.
    const labelElement = downloadGo.querySelector('[data-download-label]');
    if (labelElement) labelElement.textContent = externalLabel(file);
    else {
      const textNode = [...downloadGo.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      if (textNode) textNode.textContent = externalLabel(file) + ' ';
    }
    if (!downloadDialog.open) downloadDialog.showModal();
    downloadGo.focus({ preventScroll: true });
  }
  function askFiles(files, label, opener) {
    if (!Array.isArray(files) || !files.length) { showActionError('This pack is unavailable. Choose another pack or try again later.'); return; }
    if (files.length === 1) { askFile(files[0], label, opener); return; }
    if (!prepareDownload(label, opener)) { showActionError('The file selector is unavailable. Reload this page and try again.'); return; }
    pendingFile = null;
    downloadGo.hidden = true;
    files.forEach((file, index) => {
      const button = create('button', file.name || `Part ${index + 1}${file.run ? ' · ' + file.run : ''}${file.size ? ' · ' + file.size : ''}`, 'dialog-action');
      button.type = 'button';
      button.disabled = !safeFile(file);
      button.addEventListener('click', () => {
        if (!downloadDialog.open) return;
        pendingFile = file;
        startDownload();
      });
      choices.append(button);
    });
    if (!downloadDialog.open) downloadDialog.showModal();
    choices.querySelector('button:not(:disabled)')?.focus({ preventScroll: true });
  }
  window.archive = Object.assign(window.archive || {}, { closeDownload, askFile });
  $('hitNo')?.addEventListener('click', closeDownload);
  downloadGo?.addEventListener('click', startDownload);
  downloadDialog?.addEventListener('close', () => {
    pendingFile = null;
    restoreFocus(downloadOpener);
  });
  function closeFromBackdrop(event) {
    const dialog = event.currentTarget;
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }
  downloadDialog?.addEventListener('click', closeFromBackdrop);
  document.querySelectorAll('[data-download-pack]').forEach(button => button.addEventListener('click', event => {
    event.preventDefault();
    const pack = typeof COD_PACKS !== 'undefined' && COD_PACKS.find(item => item.id === button.dataset.downloadPack);
    if (!pack) { showActionError('This pack is unavailable. Reload this page and try again.'); return; }
    askFiles(pack.files, pack.title + ' / ' + pack.chapter, button);
  }));
  document.querySelectorAll('[data-download-episode]').forEach(button => button.addEventListener('click', event => {
    event.preventDefault();
    const season = Number(button.dataset.season);
    const episode = typeof EPISODES !== 'undefined' && EPISODES[season]?.find(item => item.ep === Number(button.dataset.downloadEpisode));
    if (!episode) { showActionError('This episode is unavailable. Reload this page and try again.'); return; }
    askFiles(episode.parts || [episode], `Six / Season ${String(season).padStart(2, '0')} / Episode ${String(episode.ep).padStart(2, '0')}`, button);
  }));
  document.querySelectorAll('[data-preview]').forEach(button => button.addEventListener('click', () => {
    if (typeof window.archive.openPreview !== 'function') {
      showActionError('The preview player could not load. Reload this page, or download the original file.');
      return;
    }
    window.archive.openPreview(Number(button.dataset.season), Number(button.dataset.episode), 1, button);
  }));

  if (/FBAN|FBAV|FB_IAB|Instagram|Snapchat|Twitter|LinkedInApp|Line\/|MicroMessenger|Pinterest|Bytedance|musical_ly|TikTok|trill/i.test(navigator.userAgent || '') && $('iab')) {
    $('iab').hidden = false;
    $('iabClose')?.addEventListener('click', () => { $('iab').hidden = true; });
    $('iabCopy')?.addEventListener('click', () => {
      const reveal = () => { $('iabUrl').textContent = location.href; $('iabUrl').hidden = false; };
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(location.href).then(reveal, reveal);
      else reveal();
    });
  }

  const dialog = $('codPreview');
  const video = $('codVideo');
  if (world !== 'cod' || !dialog || !video) return;
  let pack = null;
  let part = 0;
  let previewOpener = null;
  let loadId = 0;
  let loadTimer = null;
  function codStatus(message) {
    $('codPreviewState').textContent = message;
    $('codPreviewState').hidden = !message;
  }
  function codFailed(id) {
    if (id !== loadId || !dialog.open) return;
    clearTimeout(loadTimer);
    codStatus('');
    $('codPreviewError').hidden = false;
  }
  $('codPreviewError').setAttribute('role', 'alert');
  function loadPart(index) {
    if (!pack?.files[index]) return;
    const restorePartFocus = $('codPreviewParts').contains(document.activeElement);
    part = index;
    const id = ++loadId;
    clearTimeout(loadTimer);
    video.pause();
    video.removeAttribute('src');
    video.replaceChildren();
    video.preload = 'metadata';
    $('codPreviewError').hidden = true;
    $('codPreviewTitle').textContent = pack.chapter;
    $('codPreviewMeta').textContent = pack.meta + (pack.files.length > 1 ? ` · Part ${part + 1}` : '');
    video.poster = pack.poster;
    video.setAttribute('aria-label', `${pack.title}, ${pack.chapter}${pack.files.length > 1 ? ', part ' + (part + 1) : ''} scene pack`);
    $('codPreviewParts').hidden = pack.files.length === 1;
    $('codPreviewParts').replaceChildren();
    pack.files.forEach((file, fileIndex) => {
      const button = create('button', 'Part ' + (fileIndex + 1));
      button.type = 'button';
      button.setAttribute('aria-pressed', String(fileIndex === part));
      button.addEventListener('click', () => loadPart(fileIndex));
      $('codPreviewParts').append(button);
    });
    if (restorePartFocus) $('codPreviewParts').querySelector('[aria-pressed="true"]')?.focus({ preventScroll: true });
    window.archiveMotion?.sceneChange(dialog);
    if (!safeFile(pack.files[part]) || pack.files[part].direct === false) { codFailed(id); return; }
    codStatus('Loading preview…');
    const source = create('source');
    source.src = pack.files[part].url;
    source.type = 'video/mp4';
    source.addEventListener('error', () => codFailed(id));
    video.append(source);
    video.load();
    loadTimer = setTimeout(() => {
      if (id === loadId && dialog.open && video.readyState < 3 && $('codPreviewError').hidden) codStatus('Still loading original-quality footage…');
    }, 15000);
    const play = video.play();
    if (play) play.catch(error => {
      if (id !== loadId || !dialog.open) return;
      if (error.name === 'NotAllowedError') {
        clearTimeout(loadTimer);
        codStatus('Press play to start.');
      } else if (error.name !== 'AbortError') codFailed(id);
    });
  }
  document.querySelectorAll('[data-cod-preview]').forEach(button => button.addEventListener('click', () => {
    const selected = typeof COD_PACKS !== 'undefined' && COD_PACKS.find(item => item.id === button.dataset.codPreview);
    if (!selected) { showActionError('This preview is unavailable. Reload this page, or download the original file.'); return; }
    closeDownload();
    pack = selected;
    previewOpener = button;
    if (!dialog.open) dialog.showModal();
    syncMotion();
    loadPart(0);
  }));
  $('codPreviewClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', closeFromBackdrop);
  dialog.addEventListener('close', () => {
    ++loadId;
    clearTimeout(loadTimer);
    video.pause();
    video.removeAttribute('src');
    video.replaceChildren();
    video.preload = 'none';
    video.load();
    codStatus('');
    restoreFocus(previewOpener);
  });
  $('codPreviewRetry').addEventListener('click', () => loadPart(part));
  $('codPreviewDownload').addEventListener('click', () => {
    if (!pack) return;
    const file = pack.files[part];
    const label = pack.chapter + (pack.files.length > 1 ? ` / Part ${part + 1}` : '');
    const opener = previewOpener;
    dialog.close();
    askFile(file, label, opener);
  });
  ['playing', 'canplay'].forEach(name => video.addEventListener(name, () => {
    if (!dialog.open) return;
    clearTimeout(loadTimer);
    codStatus('');
  }));
  video.addEventListener('waiting', () => {
    if (dialog.open && $('codPreviewError').hidden) codStatus('Buffering…');
  });
  video.addEventListener('error', () => codFailed(loadId));
  document.addEventListener('visibilitychange', () => { if (document.hidden && dialog.open) video.pause(); });
})();
