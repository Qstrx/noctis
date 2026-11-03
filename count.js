(() => {
  'use strict';

  // Visits and download clicks, sent to GoatCounter without loading its script,
  // so the page keeps running only its own code. No cookies, nothing stored.
  // Your own visits: open the site once with #nocount to stop counting this browser.
  const endpoint = 'https://oceans-scenepacks.goatcounter.com/count';

  if (location.hash === '#nocount') {
    try { localStorage.setItem('skipgc', 't'); } catch {}
    history.replaceState(null, '', location.pathname + location.search);
  }
  const skipped = (() => { try { return localStorage.getItem('skipgc') === 't'; } catch { return false; } })();
  const local = /^(localhost|127\.0\.0\.1|\[::1\]|.*\.localhost)$/.test(location.hostname) || location.protocol === 'file:';
  const bot = navigator.webdriver || /headless|bot|crawl|spider|lighthouse/i.test(navigator.userAgent);
  const off = skipped || local || bot || document.visibilityState === 'prerender';

  function send(params) {
    if (off) return;
    params.s = [screen.width, screen.height, devicePixelRatio || 1].join(',');
    params.rnd = Math.random().toString(36).slice(2);
    const url = endpoint + '?' + new URLSearchParams(params);
    if (!navigator.sendBeacon?.(url)) fetch(url, { method: 'POST', mode: 'no-cors', keepalive: true }).catch(() => {});
  }

  send({ p: location.pathname, t: document.title, r: document.referrer });

  // One event per file actually started, named after the file, so GoatCounter
  // lists "download/Ghost-MW4.mp4" with its own count and dates.
  window.oceansCount = function (fileUrl, title) {
    let name = fileUrl;
    try { name = decodeURIComponent(new URL(fileUrl).pathname.split('/').pop()) || new URL(fileUrl).hostname; } catch {}
    send({ p: 'download/' + name, t: title || name, e: 'true' });
  };
})();
