(() => {
  'use strict';

  // AuroraGrab's short view/card transitions, with visible native HTML as fallback.
  const ease = 'cubic-bezier(.2,.8,.2,1)';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const enabled = () => document.body.dataset.motion !== 'off' && !reduced.matches;
  const animations = new Map();
  const closing = new Set();
  const scenes = new WeakMap();
  const cards = [...document.querySelectorAll('.pack-card')];
  const dialogs = [...document.querySelectorAll('dialog')];
  let incomingTransition = false;
  let entered = false;

  function cancel(element) {
    const running = animations.get(element);
    if (!running) return;
    running.forEach(animation => animation.cancel());
    animations.delete(element);
  }
  function animate(element, frames, duration = 350, delay = 0) {
    if (!element || !enabled() || !element.animate) return null;
    const animation = element.animate(frames, { duration, delay, easing: ease, fill: 'both' });
    let running = animations.get(element);
    if (!running) animations.set(element, running = new Set());
    running.add(animation);
    const release = () => {
      running.delete(animation);
      if (!running.size && animations.get(element) === running) animations.delete(element);
    };
    animation.finished.then(() => { animation.cancel(); release(); }, release);
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

  function syncMotion() {
    if (enabled()) return;
    document.activeViewTransition?.skipTransition();
    [...animations.keys()].forEach(cancel);
    [...closing].forEach(dialog => { if (dialog.open) dialog.close(); });
    updateMarkers();
  }
  addEventListener('oceans:motion', syncMotion);
  reduced.addEventListener('change', syncMotion);
  addEventListener('pageswap', event => {
    if (!enabled()) event.viewTransition?.skipTransition();
  });
  addEventListener('pagereveal', event => {
    updateMarkers();
    if (!event.viewTransition) return;
    incomingTransition = true;
    if (!enabled()) event.viewTransition.skipTransition();
  });

  function enterPage() {
    if (entered) return;
    entered = true;
    if (!enabled() || incomingTransition || document.activeViewTransition || dialogs.some(dialog => dialog.open)) return;
    if (document.body.dataset.world === 'home') {
      reveal(document.querySelector('.home-intro h1'), 0, 550);
      reveal(document.querySelector('.home-intro-note'), 60, 450);
      document.querySelectorAll('.collection-door').forEach((door, index) => {
        if (!inViewport(door.getBoundingClientRect())) return;
        animate(door, [
          { opacity: 0, clipPath: 'inset(0 0 8% 0 round 16px)', transform: 'translateY(10px)' },
          { opacity: 1, clipPath: 'inset(0 0 0 0 round 16px)', transform: 'translateY(0)' }
        ], 600, 110 + index * 70);
      });
    } else {
      reveal(document.querySelector('.collection-heading'), 0, 450);
      reveal(document.querySelector('.catalog-toolbar'), 60, 350);
      cards.filter(card => !card.hidden && inViewport(card.getBoundingClientRect())).slice(0, 8)
        .forEach((card, index) => reveal(card, 90 + Math.min(index, 5) * 30, 500));
    }
  }
  // Two frames leave native cross-document snapshots free of entry transforms.
  const scheduleEntry = () => requestAnimationFrame(() => requestAnimationFrame(enterPage));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleEntry, { once: true });
  else scheduleEntry();
})();
