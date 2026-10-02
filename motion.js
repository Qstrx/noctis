(() => {
  'use strict';

  // AuroraGrab's whole-view choreography; the sky carries the choice into the archive.
  const ease = 'cubic-bezier(.2,.8,.2,1)';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const enabled = () => document.body.dataset.motion !== 'off' && !reduced.matches;
  const animations = new Map();
  const closing = new Set();
  const scenes = new WeakMap();
  const cards = [...document.querySelectorAll('.pack-card')];
  const dialogs = [...document.querySelectorAll('dialog')];
  let entered = false;
  let navigation = null;
  let navigationTimer = 0;
  const main = document.querySelector('main');
  const choices = [...document.querySelectorAll('[data-world-choice]')];
  let hoveredChoice = null;

  function cancel(element) {
    const running = animations.get(element);
    if (!running) return;
    running.forEach(animation => animation.cancel());
    animations.delete(element);
  }
  function animate(element, frames, duration = 350, delay = 0, hold = false) {
    if (!element || !enabled() || !element.animate) return null;
    const animation = element.animate(frames, { duration, delay, easing: ease, fill: 'both' });
    let running = animations.get(element);
    if (!running) animations.set(element, running = new Set());
    running.add(animation);
    const release = () => {
      running.delete(animation);
      if (!running.size && animations.get(element) === running) animations.delete(element);
    };
    animation.finished.then(() => {
      // Departure stays withdrawn while the destination document loads.
      // Held effects remain tracked for Escape, pagehide and BFCache restoration.
      if (hold) return;
      animation.cancel();
      release();
    }, release);
    return animation;
  }
  function reveal(element, delay = 0, duration = 450) {
    return animate(element, [
      { opacity: 0, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], duration, delay);
  }
  const inViewport = rect => rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;

  // Read the current visual positions before cancelling an interrupted layout.
  // The caller changes hidden/aria state immediately, then we bridge to its layout.
  function captureLayout() {
    if (!enabled()) return null;
    const positions = new Map();
    cards.forEach(card => {
      if (!card.hidden && card.getClientRects().length) positions.set(card, card.getBoundingClientRect());
    });
    cards.forEach(cancel);
    return positions;
  }
  function animateLayout(before) {
    updateMarkers();
    if (!before || !enabled()) return;
    let newIndex = 0;
    cards.forEach(card => {
      if (card.hidden || !card.getClientRects().length) return;
      const next = card.getBoundingClientRect();
      const previous = before.get(card);
      if (!inViewport(next) && (!previous || !inViewport(previous))) return;
      if (previous) {
        const x = previous.left - next.left;
        const y = previous.top - next.top;
        if (Math.abs(x) + Math.abs(y) < 1) return;
        animate(card, [
          { transform: `translate(${x}px, ${y}px)` },
          { transform: 'translate(0, 0)' }
        ]);
      } else {
        reveal(card, Math.min(newIndex++, 5) * 30, 400);
      }
    });
  }

  const markers = [...document.querySelectorAll('.site-nav, .filter-list')].map(container => {
    const marker = document.createElement('span');
    marker.className = container.matches('.site-nav') ? 'nav-marker' : 'filter-marker';
    marker.setAttribute('aria-hidden', 'true');
    container.append(marker);
    return { container, marker };
  });
  function updateMarkers() {
    markers.forEach(({ container, marker }) => {
      const selected = container.querySelector('[aria-current="page"], [aria-pressed="true"]');
      if (!selected) return;
      const parent = container.getBoundingClientRect();
      const target = selected.getBoundingClientRect();
      const firstPosition = !container.classList.contains('has-motion-marker');
      if (firstPosition) marker.style.transition = 'none';
      marker.style.setProperty('--marker-x', `${target.left - parent.left}px`);
      marker.style.setProperty('--marker-width', String(target.width));
      container.classList.add('has-motion-marker');
      if (firstPosition) requestAnimationFrame(() => marker.style.removeProperty('transition'));
    });
  }
  updateMarkers();
  addEventListener('resize', updateMarkers, { passive: true });
  document.fonts?.ready.then(updateMarkers);

  function resetDialog(dialog) {
    cancel(dialog);
    dialog.querySelectorAll('.preview-heading, .preview-screen').forEach(cancel);
    closing.delete(dialog);
    scenes.delete(dialog);
    dialog.classList.remove('is-closing');
  }
  function enterDialog(dialog) {
    if (!dialog.open || closing.has(dialog)) return;
    cancel(dialog);
    animate(dialog, [
      { opacity: 0, transform: 'translateY(10px) scale(.985)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' }
    ]);
  }
  function closeDialog(dialog) {
    if (!dialog?.open || closing.has(dialog)) return;
    if (!enabled()) { dialog.close(); return; }
    const current = getComputedStyle(dialog);
    const start = { opacity: current.opacity, transform: current.transform };
    cancel(dialog);
    closing.add(dialog);
    dialog.classList.add('is-closing');
    dialog.querySelector('video')?.pause();
    const exit = animate(dialog, [start, { opacity: 0, transform: 'translateY(8px) scale(.985)' }], 220);
    if (!exit) { dialog.close(); return; }
    exit.finished.then(() => {
      if (closing.has(dialog) && dialog.open) dialog.close();
    }, () => {});
  }
  dialogs.forEach(dialog => {
    new MutationObserver(() => {
      if (dialog.open) enterDialog(dialog);
      else resetDialog(dialog);
    }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
    dialog.addEventListener('close', () => { if (!dialog.open) resetDialog(dialog); });
    dialog.addEventListener('cancel', event => {
      if (!enabled()) return;
      event.preventDefault();
      closeDialog(dialog);
    });
    dialog.addEventListener('click', event => {
      if (!enabled() || event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      closeDialog(dialog);
    }, true);
    // Also covers a valid scene deep link opened by the following player script.
    if (dialog.open) enterDialog(dialog);
  });
  document.addEventListener('click', event => {
    const dismiss = event.target.closest('#hitNo, #codPreviewClose, #previewClose');
    if (!dismiss || !enabled()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    closeDialog(dismiss.closest('dialog'));
  }, true);

  function sceneChange(dialog) {
    if (!dialog?.open) return;
    // A scene hash can arrive during dismissal without reloading the document.
    // The new scene owns the still-open player and cancels the stale close.
    if (closing.has(dialog)) {
      const current = getComputedStyle(dialog);
      const start = { opacity: current.opacity, transform: current.transform };
      cancel(dialog);
      closing.delete(dialog);
      dialog.classList.remove('is-closing');
      animate(dialog, [start, { opacity: 1, transform: 'translateY(0) scale(1)' }]);
    }
    const heading = dialog.querySelector('.preview-heading');
    const signature = heading?.textContent;
    const previous = scenes.get(dialog);
    scenes.set(dialog, signature);
    if (!previous || signature === previous || !enabled()) return;
    const screen = dialog.querySelector('.preview-screen');
    cancel(heading);
    cancel(screen);
    animate(heading, [{ opacity: .5, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], 300);
    animate(screen, [{ opacity: .65 }, { opacity: 1 }], 300);
  }
  window.archiveMotion = { captureLayout, animateLayout, sceneChange };

  function setChoice() {
    const focused = document.activeElement?.closest('[data-world-choice]');
    const selected = hoveredChoice || focused;
    const world = selected?.dataset.worldChoice || '';
    if (document.body.dataset.choice === world) return;
    document.body.dataset.choice = world;
    choices.forEach(choice => choice.classList.toggle('is-selected', choice === selected));
    dispatchEvent(new CustomEvent('oceans:aurora-focus', { detail: { active: !!selected } }));
  }
  choices.forEach(choice => {
    choice.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      hoveredChoice = choice;
      setChoice();
    });
    choice.addEventListener('pointerleave', () => { hoveredChoice = null; setChoice(); });
    choice.addEventListener('focus', () => { hoveredChoice = null; setChoice(); });
    choice.addEventListener('blur', () => queueMicrotask(setChoice));
  });
  let lastFilter = document.querySelector('.filter-button[aria-pressed="true"]')?.dataset.filter;
  document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.filter === lastFilter || !enabled()) return;
    lastFilter = button.dataset.filter;
    dispatchEvent(new CustomEvent('oceans:aurora-pulse'));
  }));

  function rememberSky() { dispatchEvent(new CustomEvent('oceans:aurora-remember')); }
  function finishNavigation() {
    if (!navigation) return;
    const destination = navigation.href;
    clearTimeout(navigationTimer);
    navigationTimer = 0;
    rememberSky();
    location.assign(destination);
  }
  function restoreView() {
    clearTimeout(navigationTimer);
    navigationTimer = 0;
    const opener = navigation?.opener;
    navigation = null;
    cancel(main);
    if (main) main.inert = false;
    document.body.classList.remove('is-navigating');
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('.world-choice, .site-nav a, .back-link, .brand, .footer-brand');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || link.target === '_blank') return;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin || !/\/(index|cod|six)\.html$/.test(destination.pathname) || destination.hash) return;
    if (destination.pathname === location.pathname && !destination.search) return;
    if (!enabled() || !main?.animate) { rememberSky(); return; }
    event.preventDefault();
    if (navigation) return;
    navigation = { href: destination.href, opener: link };
    document.body.classList.add('is-navigating');
    cancel(main);
    dispatchEvent(new CustomEvent('oceans:aurora-pulse'));
    // The app withdraws a complete view rather than sending individual cards away.
    animate(main, [{ opacity: getComputedStyle(main).opacity }, { opacity: 0 }], 300, 0, true);
    animate(main, [{ transform: getComputedStyle(main).transform }, { transform: 'scale(.985)' }], 450, 0, true);
    main.inert = true;
    navigationTimer = setTimeout(finishNavigation, 300);
  });
  document.addEventListener('keydown', event => {
    if (!navigation || event.key !== 'Escape') return;
    event.preventDefault();
    restoreView();
    dispatchEvent(new CustomEvent('oceans:aurora-focus', { detail: { active: false } }));
  });
  addEventListener('pageshow', event => {
    if (!event.persisted) return;
    restoreView();
    updateMarkers();
    setChoice();
  });
  addEventListener('pagehide', () => {
    rememberSky();
    [...animations.keys()].forEach(cancel);
  });

  function syncMotion() {
    if (enabled()) {
      dispatchEvent(new CustomEvent('oceans:aurora-focus', { detail: { active: !!document.body.dataset.choice } }));
      return;
    }
    [...animations.keys()].forEach(cancel);
    [...closing].forEach(dialog => { if (dialog.open) dialog.close(); });
    if (navigation) finishNavigation();
    updateMarkers();
  }
  addEventListener('oceans:motion', syncMotion);
  reduced.addEventListener('change', syncMotion);
  function enterPage() {
    if (entered) return;
    entered = true;
    if (!enabled() || navigation || dialogs.some(dialog => dialog.open)) return;
    const delay = document.body.dataset.world === 'home' ? 180 : 0;
    animate(main, [{ opacity: 0 }, { opacity: 1 }], 450, delay);
    animate(main, [{ transform: 'translateY(8px)' }, { transform: 'translateY(0)' }], 550, delay);
  }
  // Start after the sky renderer has initialized, with the same app view arrival.
  const scheduleEntry = () => requestAnimationFrame(() => requestAnimationFrame(enterPage));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleEntry, { once: true });
  else scheduleEntry();
})();
