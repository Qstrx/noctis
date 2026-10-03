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
      <div class="credit-lights" aria-hidden="true">
        <span class="credit-light credit-light-one"></span>
        <span class="credit-light credit-light-two"></span>
      </div>
      <button type="button" class="credit-close" data-credit-close aria-label="Close credit reminder">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
      </button>
      <div class="credit-composition">
        <h2 id="creditMessage" class="credit-heading"><span class="credit-prelude">Remember to credit</span> <span class="credit-name">Ocean</span> <span class="credit-platform">on TikTok</span></h2>
        <svg class="credit-wave" viewBox="0 0 360 32" aria-hidden="true">
          <path class="credit-wave-flow" pathLength="1" d="M8 19C53 19 63 4 97 7S145 27 180 22 226 2 267 8 306 21 352 14"/>
          <path class="credit-wave-line" pathLength="1" d="M118 17h124"/>
        </svg>
        <button type="button" class="credit-continue" data-credit-close autofocus>Continue browsing<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg></button>
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

  function show(options = {}) {
    const dialog = create();
    // Keep one modal and one sequence even if a multipart action is double-clicked.
    if (dialog.open || closing) return false;
    stopMotion();
    generation += 1;
    opener = options.opener instanceof HTMLElement ? options.opener : document.activeElement;
    try { dialog.showModal(); } catch (_) { opener = null; return false; }
    document.body.dataset.credit = 'open';

    if (moving()) {
      dispatchEvent(new CustomEvent('oceans:aurora-pulse'));
      animate(dialog, [{ opacity: 0 }, { opacity: 1 }], 320);
      animate(dialog.querySelector('.credit-heading'), [
        { opacity: .35, filter: 'blur(5px)', transform: 'translateY(12px)' },
        { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' }
      ], 720);
      animate(dialog.querySelector('.credit-light-one'), [
        { opacity: 0, transform: 'translate(-9%,12%) rotate(-18deg)' },
        { opacity: .78, transform: 'translate(0%,0%) rotate(-18deg)', offset: .48 },
        { opacity: .28, transform: 'translate(7%,-5%) rotate(-18deg)' }
      ], 1400);
      animate(dialog.querySelector('.credit-light-two'), [
        { opacity: 0, transform: 'translate(10%,7%) rotate(16deg)' },
        { opacity: .48, transform: 'translate(0%,0%) rotate(16deg)', offset: .5 },
        { opacity: .18, transform: 'translate(-6%,-4%) rotate(16deg)' }
      ], 1400);
      animate(dialog.querySelector('.credit-wave-flow'), [
        { opacity: .8, strokeDashoffset: 1, offset: 0 },
        { opacity: .8, strokeDashoffset: 0, offset: .7 },
        { opacity: 0, strokeDashoffset: 0 }
      ], 1250, 100);
      animate(dialog.querySelector('.credit-wave-line'), [
        { opacity: 0, strokeDashoffset: 1 },
        { opacity: 1, strokeDashoffset: 0 }
      ], 550, 800);
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
