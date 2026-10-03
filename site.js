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
  const previewDialogs = [...document.querySelectorAll('#preview, #codPreview')];
  function syncMotion() {
    const enabled = !reducedMotion.matches;
    const previewOpen = previewDialogs.some(dialog => dialog.open);
    document.body.dataset.motion = enabled ? 'on' : 'off';
    document.body.classList.toggle('preview-open', previewOpen);
    window.dispatchEvent(new CustomEvent('oceans:motion', { detail: { enabled: enabled && !previewOpen } }));
  }
  reducedMotion.addEventListener('change', syncMotion);
  previewDialogs.forEach(dialog => {
    new MutationObserver(syncMotion).observe(dialog, { attributes: true, attributeFilter: ['open'] });
    dialog.addEventListener('close', syncMotion);
  });
  syncMotion();

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
    try {
      const url = new URL(file.url);
      return url.protocol === 'https:' && ['github.com', 'release-assets.githubusercontent.com', 'drive.google.com', 'mega.nz'].includes(url.hostname);
    } catch { return false; }
  }
  function partChoiceIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.5');
    svg.setAttribute('aria-hidden', 'true');
    const circle = document.createElementNS(svg.namespaceURI, 'circle');
    circle.setAttribute('cx', '10'); circle.setAttribute('cy', '10'); circle.setAttribute('r', '7.5');
    const check = document.createElementNS(svg.namespaceURI, 'path');
    check.setAttribute('d', 'm6.5 10 2.3 2.3 4.8-4.8');
    check.setAttribute('stroke-linecap', 'round'); check.setAttribute('stroke-linejoin', 'round');
    svg.append(circle, check);
    return svg;
  }
  function downloadDetails(files, label, opener) {
    const firstFile = files.find(safeFile) || files[0];
    const card = opener?.closest?.('.pack-card');
    const cover = card?.querySelector('.pack-cover img');
    const codPack = typeof COD_PACKS !== 'undefined' && COD_PACKS.find(item => item.files.some(file => file.url === firstFile.url));
    if (codPack) {
      const index = codPack.files.findIndex(file => file.url === firstFile.url);
      const onePart = files.length === 1 && codPack.files.length > 1;
      return {
        title: codPack.id === 'full' ? 'All in one' : codPack.chapter,
        context: codPack.title + (onePart ? ` · Part ${index + 1}` : ''),
        facts: onePart ? [firstFile.run, firstFile.size, codPack.fps].filter(Boolean).join(' · ') : codPack.meta.split(' · ').slice(0, 2).concat(codPack.fps).join(' · '),
        poster: cover?.getAttribute('src') || codPack.poster
      };
    }
    if (typeof EPISODES !== 'undefined') {
      for (const [season, episodes] of Object.entries(EPISODES)) {
        const episode = episodes.find(item => (item.parts || [item]).some(file => file.url === firstFile.url));
        if (!episode) continue;
        const onePart = files.length === 1 && episode.parts;
        return {
          title: episode.title,
          context: `Joe Graves scenes · SIX · S${String(season).padStart(2, '0')} E${String(episode.ep).padStart(2, '0')}` + (onePart ? ` · Part ${firstFile.part}` : ''),
          facts: [onePart ? firstFile.run : episode.run, onePart ? firstFile.size : episode.size, '1080p · 24 fps'].filter(Boolean).join(' · '),
          poster: cover?.getAttribute('src') || `img/six/s${season}-e${String(episode.ep).padStart(2, '0')}.jpg`
        };
      }
    }
    return { title: label || firstFile.name || 'Scene pack', context: '', facts: [firstFile.run, firstFile.size].filter(Boolean).join(' · '), poster: cover?.getAttribute('src') };
  }
  function downloadNote(files) {
    const url = new URL((files.find(safeFile) || files[0]).url);
    if (url.hostname === 'drive.google.com') return 'Google Drive · use the download arrow on the file page.';
    if (url.hostname === 'mega.nz') return 'Mega · download from the file page.';
    return files.length > 1 ? 'GitHub · choose a part to download.' : 'GitHub · original video file.';
  }
  function closeDownload() {
    pendingFile = null;
    if (downloadDialog?.open) downloadDialog.close();
  }
  function startDownload() {
    if (!safeFile(pendingFile)) return;
    const file = pendingFile;
    const opener = downloadOpener;
    const title = $('hitT')?.textContent || file.name || 'Scene pack';
    const poster = $('hitCover')?.getAttribute('src') || '';
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
    window.archiveCredit?.show({ opener, title, poster, provider: new URL(file.url).hostname });
  }
  function prepareDownload(files, label, opener) {
    if (!downloadDialog || !choices || !downloadGo) return false;
    if (!downloadDialog.open) downloadOpener = opener || document.activeElement;
    const details = downloadDetails(files, label, opener);
    $('hitT').textContent = details.title;
    $('hitS').textContent = details.context;
    $('hitMeta').textContent = details.facts;
    $('hitMeta').hidden = !details.facts;
    $('hitNote').textContent = downloadNote(files);
    $('hitCover').hidden = !details.poster;
    if (details.poster) $('hitCover').src = details.poster;
    else $('hitCover').removeAttribute('src');
    downloadGo.setAttribute('aria-label', 'Start download: ' + details.title);
    choices.replaceChildren();
    return true;
  }
  function askFile(file, label, opener) {
    if (!safeFile(file)) { showActionError('This file is unavailable. Choose another pack or try again later.'); return; }
    if (!prepareDownload([file], label, opener)) {
      pendingFile = file;
      startDownload();
      return;
    }
    pendingFile = file;
    downloadGo.hidden = false;
    if (!downloadDialog.open) downloadDialog.showModal();
    downloadGo.focus({ preventScroll: true });
  }
  function askFiles(files, label, opener) {
    if (!Array.isArray(files) || !files.length) { showActionError('This pack is unavailable. Choose another pack or try again later.'); return; }
    if (files.length === 1) { askFile(files[0], label, opener); return; }
    if (!files.some(safeFile)) { showActionError('These files are unavailable. Choose another pack or try again later.'); return; }
    if (!prepareDownload(files, label, opener)) { showActionError('The file selector is unavailable. Reload this page and try again.'); return; }
    const firstPart = files.findIndex(safeFile);
    pendingFile = files[firstPart];
    downloadGo.hidden = false;
    files.forEach((file, index) => {
      const name = file.name || `Part ${index + 1}`;
      const button = create('button', '', 'transfer-part');
      button.type = 'button';
      button.disabled = !safeFile(file);
      button.setAttribute('aria-label', `Select ${name}`);
      button.setAttribute('aria-pressed', String(index === firstPart));
      const info = create('span', '', 'transfer-part-info');
      info.append(create('strong', name));
      const facts = [file.run, file.size].filter(Boolean).join(' · ');
      if (facts) info.append(create('small', facts));
      button.append(info, partChoiceIcon());
      button.addEventListener('click', () => {
        if (!downloadDialog.open) return;
        pendingFile = file;
        choices.querySelectorAll('button').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
        downloadGo.setAttribute('aria-label', `Start download: ${$('hitT').textContent}, ${name}`);
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
    if (!episode) { showActionError('This scene pack is unavailable. Reload this page and try again.'); return; }
    askFiles(episode.parts || [episode], `Joe Graves scenes / SIX / Season ${String(season).padStart(2, '0')} / Episode ${String(episode.ep).padStart(2, '0')} / ${episode.title}`, button);
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
