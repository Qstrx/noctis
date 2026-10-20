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
  let browserNotice = null;
  let browserNoticeOpener = null;
  function mobileInAppBrowser() {
    const ua = navigator.userAgent || '';
    const mobile = /Android|iPhone|iPad|iPod/i.test(ua) ||
      (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) || navigator.userAgentData?.mobile === true;
    if (!mobile) return false;
    // A TikTok referrer alone is not evidence: a visitor may already have
    // opened this page in Safari or Chrome. Use the current browser's signals.
    const app = /FBAN|FBAV|FB_IAB|Instagram|Snapchat|Twitter|LinkedInApp|Line\/|MicroMessenger|Pinterest|Bytedance|ByteLocale|musical_ly|TikTok|\btrill\b|\bGSA\//i.test(ua);
    const androidWebView = /Android/i.test(ua) && /;\s*wv\b|Version\/4\.0.*Chrome\//i.test(ua);
    const iosWebView = /iPhone|iPad|iPod/i.test(ua) && /AppleWebKit/i.test(ua) &&
      /Mobile\//i.test(ua) && !/Safari\/|CriOS\/|FxiOS\/|EdgiOS\/|OPiOS\/|DuckDuckGo\//i.test(ua);
    return app || androidWebView || iosWebView;
  }
  function warnInAppBrowser(opener) {
    if (!mobileInAppBrowser()) return false;
    pendingFile = null;
    if (downloadDialog?.open) closeDownload();
    if (!browserNotice) {
      browserNotice = create('dialog', '', 'transfer-dialog browser-notice');
      browserNotice.id = 'browserNotice';
      browserNotice.setAttribute('aria-labelledby', 'browserNoticeTitle');
      browserNotice.setAttribute('aria-describedby', 'browserNoticeReason browserNoticeSteps');
      const close = create('button', 'Close', 'browser-notice-close');
      close.type = 'button';
      close.addEventListener('click', () => browserNotice.close());
      const title = create('h2', 'Open in your browser');
      title.id = 'browserNoticeTitle';
      const reason = create('p', 'You’re using an in-app browser. Downloads can open as full-screen videos instead of saving to your phone.');
      reason.id = 'browserNoticeReason';
      const steps = create('p', '', 'browser-notice-steps');
      steps.id = 'browserNoticeSteps';
      steps.append('To download, use the app’s menu and choose ', create('strong', 'Open in browser'), ', or copy this link and open it in Safari or Chrome.');
      const label = create('label', 'Website link', 'browser-notice-label');
      label.htmlFor = 'browserNoticeUrl';
      const url = create('input', '', 'browser-notice-url');
      url.id = 'browserNoticeUrl';
      url.type = 'text';
      url.readOnly = true;
      url.addEventListener('click', () => url.select());
      const copy = create('button', 'Copy website link', 'transfer-action');
      copy.id = 'browserNoticeCopy';
      copy.type = 'button';
      const status = create('p', '', 'browser-notice-status');
      status.id = 'browserNoticeStatus';
      status.setAttribute('role', 'status');
      copy.addEventListener('click', async () => {
        copy.disabled = true;
        try {
          if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
          await navigator.clipboard.writeText(url.value);
          status.textContent = 'Link copied. Paste it into Safari or Chrome to download.';
        } catch {
          // Some in-app browsers deny clipboard access. Keep the real URL
          // visible and selected, with no false success message.
          status.textContent = 'Touch and hold the link above, choose Copy, then paste it into your browser.';
          if (browserNotice.open) { url.focus({ preventScroll: true }); url.select(); }
        } finally { copy.disabled = false; }
      });
      browserNotice.append(close, title, reason, steps, label, url, copy, status);
      browserNotice.addEventListener('click', closeFromBackdrop);
      browserNotice.addEventListener('close', () => restoreFocus(browserNoticeOpener));
      document.body.append(browserNotice);
    }
    if (!browserNotice.open) browserNoticeOpener = opener || document.activeElement;
    // Open the collection, rather than immediately reopening a shared preview.
    const url = new URL(location.href);
    if (url.hash.startsWith('#preview=')) url.hash = '';
    $('browserNoticeUrl').value = url.href;
    $('browserNoticeStatus').textContent = '';
    if (!browserNotice.open) browserNotice.showModal();
    $('browserNoticeCopy').focus({ preventScroll: true });
    return true;
  }
  let actionErrorTimer = 0;
  function showActionError(message) {
    let error = $('archiveActionError');
    if (!error) {
      error = create('p', '', 'action-error');
      error.id = 'archiveActionError';
      error.setAttribute('role', 'alert');
      document.body.append(error);
    }
    // Shown where the visitor is looking, not after the last collection.
    error.textContent = message;
    error.hidden = false;
    clearTimeout(actionErrorTimer);
    actionErrorTimer = setTimeout(() => { error.hidden = true; }, 6000);
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
  // What the download panel says: the pack's name, where it comes from above
  // it, and a few tags (resolution, part).
  function downloadDetails(files, label, opener) {
    const firstFile = files.find(safeFile) || files[0];
    const card = opener?.closest?.('.pack-card');
    const cover = card?.querySelector('.pack-cover img');
    const codPack = typeof COD_PACKS !== 'undefined' && COD_PACKS.find(item => item.files.some(file => file.url === firstFile.url));
    if (codPack) {
      const index = codPack.files.findIndex(file => file.url === firstFile.url);
      const onePart = files.length === 1 && codPack.files.length > 1;
      if (codPack.namedFiles && files.length === 1) return {
        title: firstFile.name,
        context: codPack.title + ' · ' + codPack.chapter,
        tags: [resolutionLabel(firstFile.resolution)],
        poster: firstFile.poster || codPack.poster
      };
      const cutscenes = codPack.group === 'cutscenes' || codPack.group === 'trailers';
      return {
        title: cutscenes ? codPack.chapter : codPack.title,
        context: cutscenes ? codPack.title : codPack.chapter,
        tags: [resolutionLabel(firstFile.resolution || codPack.resolution), onePart ? `Part ${index + 1}` : ''],
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
          context: `Joe Graves · SIX · S${String(season).padStart(2, '0')} E${String(episode.ep).padStart(2, '0')}`,
          tags: ['1080p', onePart ? `Part ${firstFile.part}` : ''],
          poster: cover?.getAttribute('src') || `img/six/s${season}-e${String(episode.ep).padStart(2, '0')}.jpg`
        };
      }
    }
    return { title: label || firstFile.name || 'Scene pack', context: '', tags: [], poster: cover?.getAttribute('src') };
  }
  // 3840 × 1634 reads as 4K, 2560 × … as 2K and 1920 × … as 1080p.
  const resolutionLabel = value => {
    const width = parseInt(value, 10);
    if (!width) return value;
    return width >= 3800 ? '4K' : width >= 2500 ? '2K' : width >= 1900 ? '1080p' : value;
  };
  // Only what the visitor has to do differently gets a note.
  function downloadNote(files) {
    const url = new URL((files.find(safeFile) || files[0]).url);
    if (url.hostname === 'drive.google.com') return 'Opens on Google Drive: use the download arrow on the file page.';
    if (url.hostname === 'mega.nz') return 'Opens on Mega: download from the file page.';
    return files.length > 1 ? 'Choose a file below.' : '';
  }
  function closeDownload() {
    pendingFile = null;
    if (downloadDialog?.open) downloadDialog.close();
  }
  function startDownload() {
    if (!safeFile(pendingFile)) return;
    if (warnInAppBrowser(downloadOpener)) return;
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
    const tags = details.tags.filter(Boolean);
    $('hitMeta').replaceChildren(...tags.map(tag => create('li', tag)));
    $('hitMeta').hidden = !tags.length;
    $('hitNote').textContent = downloadNote(files);
    $('hitNote').hidden = !$('hitNote').textContent;
    $('hitCover').hidden = !details.poster;
    if (details.poster) $('hitCover').src = details.poster;
    else $('hitCover').removeAttribute('src');
    downloadGo.setAttribute('aria-label', 'Start download: ' + details.title);
    downloadGo.disabled = false;
    if ($('downloadFilterWrap')) $('downloadFilterWrap').hidden = true;
    if ($('downloadFilter')) $('downloadFilter').value = '';
    if ($('downloadCount')) $('downloadCount').hidden = true;
    if ($('downloadEmpty')) $('downloadEmpty').hidden = true;
    if ($('downloadSelected')) $('downloadSelected').hidden = true;
    choices.replaceChildren();
    return true;
  }
  function askFile(file, label, opener) {
    if (!safeFile(file)) { showActionError('This file is unavailable. Choose another pack or try again later.'); return; }
    if (warnInAppBrowser(opener)) return;
    if (!prepareDownload([file], label, opener)) {
      pendingFile = file;
      startDownload();
      return;
    }
    pendingFile = file;
    if ($('downloadSelected') && file.audio) {
      $('downloadSelected').hidden = false;
      $('downloadSelected').textContent = [file.name, resolutionLabel(file.resolution)].filter(Boolean).join(' · ');
    }
    downloadGo.hidden = false;
    if (!downloadDialog.open) downloadDialog.showModal();
    downloadGo.focus({ preventScroll: true });
  }
  function askFiles(files, label, opener) {
    if (!Array.isArray(files) || !files.length) { showActionError('This pack is unavailable. Choose another pack or try again later.'); return; }
    if (warnInAppBrowser(opener)) return;
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
      const facts = resolutionLabel(file.resolution) || '';
      if (facts) info.append(create('small', facts));
      button.append(info, partChoiceIcon());
      button.addEventListener('click', () => {
        if (!downloadDialog.open) return;
        pendingFile = file;
        downloadGo.disabled = false;
        if ($('downloadSelected')) {
          $('downloadSelected').hidden = false;
          $('downloadSelected').textContent = 'Selected: ' + name;
        }
        choices.querySelectorAll('button').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
        downloadGo.setAttribute('aria-label', `Start download: ${$('hitT').textContent}, ${name}`);
      });
      choices.append(button);
    });
    const filter = $('downloadFilter');
    if (filter && files.length > 6) {
      $('downloadFilterWrap').hidden = false;
      $('downloadCount').hidden = false;
      $('downloadCount').textContent = `${files.length} files`;
      filter.oninput = () => {
        const query = filter.value.trim().toLocaleLowerCase();
        let visible = 0;
        choices.querySelectorAll('button').forEach((option, index) => {
          option.hidden = !(files[index].name || `Part ${index + 1}`).toLocaleLowerCase().includes(query);
          if (!option.hidden) visible++;
          if (option.hidden && pendingFile === files[index]) {
            pendingFile = null;
            option.setAttribute('aria-pressed', 'false');
            downloadGo.disabled = true;
            $('downloadSelected').hidden = false;
            $('downloadSelected').textContent = 'Choose a matching file to download.';
          }
        });
        $('downloadCount').textContent = `${visible} of ${files.length} files`;
        $('downloadEmpty').hidden = visible !== 0;
      };
    }
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
    const selectedFile = pack.files[index];
    // Whose pack and which game: "John Price — Modern Warfare II".
    $('codPreviewTitle').textContent = pack.namedFiles ? selectedFile.name : pack.group === 'trailers' ? pack.chapter : `${pack.title} — ${pack.chapter}`;
    $('codPreviewLabel').textContent = pack.group === 'trailers' ? 'Call of Duty / Trailer preview' : 'Call of Duty / Scene preview';
    $('codPreviewMeta').textContent = (selectedFile.run || pack.meta.split(' · ')[0]) + (pack.files.length > 1 && !pack.namedFiles ? ` · Part ${part + 1}` : '');
    video.poster = pack.poster;
    video.setAttribute('aria-label', `${pack.title}, ${pack.chapter}${pack.files.length > 1 ? ', part ' + (part + 1) : ''}${pack.group === 'trailers' ? '' : ' scene pack'}`);
    $('codPreviewParts').hidden = pack.files.length === 1;
    $('codPreviewParts').replaceChildren();
    if (pack.namedFiles) {
      const label = create('label', 'Choose a scene', 'mw4-scene-select');
      const select = create('select');
      pack.files.forEach((file, fileIndex) => {
        const option = create('option', file.name);
        option.value = String(fileIndex);
        option.selected = fileIndex === part;
        select.append(option);
      });
      select.addEventListener('change', () => loadPart(Number(select.value)));
      label.append(select);
      $('codPreviewParts').append(label);
    } else pack.files.forEach((file, fileIndex) => {
      const button = create('button', 'Part ' + (fileIndex + 1));
      button.type = 'button';
      button.setAttribute('aria-pressed', String(fileIndex === part));
      button.addEventListener('click', () => loadPart(fileIndex));
      $('codPreviewParts').append(button);
    });
    if (restorePartFocus) $('codPreviewParts').querySelector('select, [aria-pressed="true"]')?.focus({ preventScroll: true });
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
      if (id === loadId && dialog.open && video.readyState < 3 && $('codPreviewError').hidden) codStatus(pack.namedFiles ? 'Still loading ' + (pack.editionLabel || '4K') + ' footage…' : 'Still loading original-quality footage…');
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
    const label = pack.chapter + (pack.namedFiles ? ' / ' + file.name : pack.files.length > 1 ? ` / Part ${part + 1}` : '');
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
