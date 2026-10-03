(() => {
  'use strict';
  if (window.archiveCredit) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ease = 'cubic-bezier(.16,1,.3,1)';
  const running = new Set();
  let screen = null;
  let opener = null;
  let closing = false;
  let generation = 0;
  let motionAllowed = document.body.dataset.motion !== 'off';

  const moving = () => motionAllowed && document.body.dataset.motion !== 'off' && !reduced.matches && !document.hidden;

  function stopMotion() {
    [...running].forEach(animation => animation.cancel());
    running.clear();
  }

  function animate(element, frames, duration, delay = 0) {
    if (!element?.animate) return null;
    const animation = element.animate(frames, { duration, delay, easing: ease, fill: 'both' });
    running.add(animation);
    const release = () => { running.delete(animation); animation.cancel(); };
    animation.finished.then(release, () => running.delete(animation));
    return animation;
  }

  function restore() {
    stopMotion();
    closing = false;
    delete document.body.dataset.credit;
    const target = opener;
    opener = null;
    // Native close restores the previous focus first; this retains the actual
    // archive action when a download panel was the immediately previous modal.
    if (target?.isConnected && !target.closest('[inert]')) {
      target.focus({ preventScroll: true });
    }
  }

  function create() {
    if (screen) return screen;
    screen = document.createElement('dialog');
    screen.id = 'creditScreen';
    screen.className = 'credit-screen';
    screen.setAttribute('aria-labelledby', 'creditMessage');
    screen.innerHTML = `
      <div class="credit-lights" aria-hidden="true"><span class="credit-light"></span></div>
      <button type="button" class="credit-close" data-credit-close aria-label="Close credit reminder">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
      </button>
      <div class="credit-composition">
        <figure class="credit-source">
          <img class="credit-poster" alt="" decoding="async">
          <figcaption class="credit-source-title"></figcaption>
        </figure>
        <div class="credit-copy">
          <h2 id="creditMessage" class="credit-heading">Remember to credit Ocean on TikTok.</h2>
          <a class="credit-account" href="https://www.tiktok.com/@oceanxaep" target="_blank" rel="noopener noreferrer" aria-label="Ocean on TikTok: @oceanxaep (opens in a new tab)">
            <span>@oceanxaep</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M7 6h11v11"/></svg>
          </a>
          <button type="button" class="credit-continue" data-credit-close autofocus>Continue browsing<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg></button>
        </div>
      </div>`;
    screen.addEventListener('cancel', event => {
      event.preventDefault();
      close();
    });
    screen.addEventListener('close', restore);
    screen.querySelectorAll('[data-credit-close]').forEach(button => button.addEventListener('click', close));
    document.body.append(screen);
    return screen;
  }

  function setSource(dialog, options) {
    const poster = dialog.querySelector('.credit-poster');
    const source = dialog.querySelector('.credit-source');
    const caption = dialog.querySelector('.credit-source-title');
    const title = typeof options.title === 'string' ? options.title.trim() : '';
    let url = null;
    if (typeof options.poster === 'string') {
      try {
        const candidate = new URL(options.poster, location.href);
        if (candidate.origin === location.origin && /\/img\//.test(candidate.pathname)) url = candidate;
      } catch (_) { /* An invalid source never becomes a request. */ }
    }
    source.hidden = !url;
    dialog.querySelector('.credit-composition').classList.toggle('credit-without-source', !url);
    caption.textContent = title;
    caption.hidden = !title;
    poster.alt = title ? `Scene pack preview: ${title}` : 'Scene pack preview';
    if (url) poster.src = url.href;
    else poster.removeAttribute('src');
  }

  function show(options = {}) {
    const dialog = create();
    // Keep one modal and one sequence even if a multipart action is double-clicked.
    if (dialog.open || closing) return false;
    stopMotion();
    generation += 1;
    opener = options.opener instanceof HTMLElement ? options.opener : document.activeElement;
    setSource(dialog, options);
    try { dialog.showModal(); } catch (_) { opener = null; return false; }
    document.body.dataset.credit = 'open';

    if (moving()) {
      dispatchEvent(new CustomEvent('oceans:aurora-pulse'));
      animate(dialog, [{ opacity: .45 }, { opacity: 1 }], 300);
      if (!dialog.querySelector('.credit-source').hidden) {
        animate(dialog.querySelector('.credit-poster'), [
          { opacity: .55, clipPath: 'inset(0 24% 0 0)', filter: 'contrast(.9)' },
          { opacity: 1, clipPath: 'inset(0 0% 0 0)', filter: 'contrast(1)' }
        ], 800);
      }
      animate(dialog.querySelector('.credit-copy'), [
        { opacity: .6, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0px)' }
      ], 680, 80);
      animate(dialog.querySelector('.credit-light'), [
        { opacity: 0, transform: 'translateX(-10vw) rotate(-20deg)', offset: 0 },
        { opacity: .46, transform: 'translateX(48vw) rotate(-20deg)', offset: .45 },
        { opacity: 0, transform: 'translateX(155vw) rotate(-20deg)' }
      ], 1000);
    } else if (!document.hidden) {
      // The sentence and controls are legible from the first reduced-motion frame.
      animate(dialog, [{ opacity: .9 }, { opacity: 1 }], 100);
    }
    return true;
  }

  function close() {
    if (!screen?.open || closing) return false;
    closing = true;
    const current = getComputedStyle(screen).opacity;
    stopMotion();
    const currentGeneration = generation;
    const finish = () => {
      if (generation === currentGeneration && screen?.open && closing) screen.close();
    };
    if (!moving()) { finish(); return true; }
    const departure = animate(screen, [{ opacity: current }, { opacity: 0 }], 160);
    if (departure) departure.finished.then(finish, finish);
    else finish();
    return true;
  }

  function settle() {
    // A preference change or hidden tab settles to the CSS resting composition;
    // no decorative sequence restarts when the visitor returns.
    stopMotion();
    if (closing && screen?.open) screen.close();
  }
  addEventListener('oceans:motion', event => {
    motionAllowed = event.detail?.enabled !== false;
    if (!moving()) settle();
  });
  reduced.addEventListener('change', () => { if (reduced.matches) settle(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) settle(); });
  addEventListener('pagehide', () => {
    generation += 1;
    stopMotion();
    if (screen?.open) screen.close();
    else restore();
  });
  window.archiveCredit = { show, close };
})();
