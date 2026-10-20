(() => {
  'use strict';

  // Motion for the archive: title cards rise, footage reveals as it scrolls in
  // and every touch answers.
  const ease = 'cubic-bezier(.2,.8,.2,1)';
  const easeOut = 'cubic-bezier(.16,1,.3,1)';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const enabled = () => document.body.dataset.motion !== 'off' && !reduced.matches;
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  const root = document.documentElement;
  const animations = new Map();
  const closing = new Set();
  const scenes = new WeakMap();
  const dialogs = [...document.querySelectorAll('dialog')];

  function cancel(element) {
    const running = animations.get(element);
    if (!running) return;
    running.forEach(animation => animation.cancel());
    animations.delete(element);
  }
  function animate(element, frames, duration = 350, delay = 0, easing = ease) {
    if (!element || !enabled() || !element.animate) return null;
    const animation = element.animate(frames, { duration, delay, easing, fill: 'both' });
    let running = animations.get(element);
    if (!running) animations.set(element, running = new Set());
    running.add(animation);
    const release = () => {
      running.delete(animation);
      if (!running.size && animations.get(element) === running) animations.delete(element);
    };
    animation.finished.then(() => {
      animation.cancel();
      release();
    }, release);
    return animation;
  }

  /* ---------- Site navigation underline ---------- */
  const markers = [...document.querySelectorAll('.site-nav')].map(container => {
    const marker = document.createElement('span');
    marker.className = 'nav-marker';
    marker.setAttribute('aria-hidden', 'true');
    container.append(marker);
    return { container, marker };
  });
  function updateMarkers() {
    markers.forEach(({ container, marker }) => {
      const selected = container.querySelector('[aria-current="page"]');
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

  /* ---------- Dialogs ----------
     A preview grows out of the card that opened it; other dialogs rise in. */
  let pressedCard = null;
  let pressedAt = 0;
  document.addEventListener('click', event => {
    const card = event.target.closest?.('.pack-card');
    if (card) { pressedCard = card; pressedAt = performance.now(); }
  }, true);
  function resetDialog(dialog) {
    cancel(dialog);
    dialog.querySelectorAll('.preview-heading, .preview-screen').forEach(cancel);
    dialog.querySelectorAll('.preview-flight').forEach(flight => flight.remove());
    closing.delete(dialog);
    scenes.delete(dialog);
    dialog.classList.remove('is-closing');
  }
  function growFromCard(dialog) {
    const screen = dialog.querySelector('.preview-screen');
    const source = performance.now() - pressedAt < 1200 && pressedCard?.querySelector('.cover-frame img');
    if (!screen || !source || !source.complete || !source.getClientRects().length) return false;
    const from = source.getBoundingClientRect();
    const to = screen.getBoundingClientRect();
    if (!from.width || !to.width || to.bottom < 0 || to.top > innerHeight) return false;
    const flight = new Image();
    flight.src = source.currentSrc || source.src;
    flight.alt = '';
    flight.className = 'preview-flight';
    flight.setAttribute('aria-hidden', 'true');
    flight.style.objectPosition = getComputedStyle(source).objectPosition;
    dialog.append(flight);
    animate(dialog, [{ opacity: 0 }, { opacity: 1 }], 320);
    animate(screen, [{ opacity: 0 }, { opacity: 0, offset: .72 }, { opacity: 1 }], 680);
    const box = (rect, radius) => ({ left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, borderRadius: radius });
    const travel = flight.animate([box(from, '12px'), box(to, '8px')], { duration: 680, easing: easeOut, fill: 'forwards' });
    travel.finished
      .then(() => flight.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' }).finished)
      .catch(() => {})
      .finally(() => flight.remove());
    return true;
  }
  function enterDialog(dialog) {
    if (!dialog.open || closing.has(dialog)) return;
    cancel(dialog);
    if (enabled() && growFromCard(dialog)) return;
    animate(dialog, [
      { opacity: 0, transform: 'translateY(14px) scale(.98)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' }
    ], 420, 0, easeOut);
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
    const exit = animate(dialog, [start, { opacity: 0, transform: 'translateY(10px) scale(.98)' }], 220);
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
    animate(heading, [{ opacity: .4, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], 360, 0, easeOut);
    animate(screen, [{ opacity: .55, transform: 'scale(.985)' }, { opacity: 1, transform: 'scale(1)' }], 360, 0, easeOut);
  }
  window.archiveMotion = { sceneChange };

  /* ---------- Revealed while scrolling ---------- */
  const reveals = [...document.querySelectorAll('.reveal')];
  let revealObserver = null;
  function revealAll() {
    revealObserver?.disconnect();
    reveals.forEach(element => element.classList.add('is-in'));
  }
  if (root.classList.contains('reveal-ready')) {
    root.classList.add('reveal-live');
    if (!('IntersectionObserver' in window) || !enabled()) revealAll();
    else {
      revealObserver = new IntersectionObserver(entries => {
        const entering = entries.filter(entry => entry.isIntersecting).map(entry => entry.target);
        entering.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
        entering.forEach((element, index) => {
          element.style.setProperty('--rd', `${Math.min(index, 6) * 90}ms`);
          element.classList.add('is-in');
          revealObserver.unobserve(element);
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: .08 });
      reveals.forEach(element => revealObserver.observe(element));
    }
  }

  /* ---------- Cards lean toward the pointer ---------- */
  if (finePointer.matches) {
    document.querySelectorAll('.pack-card .pack-cover').forEach(cover => {
      let frame = 0, last = null;
      cover.addEventListener('pointermove', event => {
        if (!enabled()) return;
        last = event;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const rect = cover.getBoundingClientRect();
          const x = clamp((last.clientX - rect.left) / rect.width, 0, 1);
          const y = clamp((last.clientY - rect.top) / rect.height, 0, 1);
          cover.classList.add('is-tilting');
          cover.style.setProperty('--rx', `${((.5 - y) * 8).toFixed(2)}deg`);
          cover.style.setProperty('--ry', `${((x - .5) * 10).toFixed(2)}deg`);
          cover.style.setProperty('--gx', x.toFixed(3));
        });
      });
      cover.addEventListener('pointerleave', () => {
        cancelAnimationFrame(frame);
        frame = 0;
        cover.classList.remove('is-tilting');
        ['--rx', '--ry', '--gx'].forEach(name => cover.style.removeProperty(name));
      });
    });
  }

  /* ---------- Buttons answer the press ---------- */
  document.addEventListener('click', event => {
    const button = event.target.closest?.('.action');
    if (!button || !enabled()) return;
    button.classList.remove('is-pressed');
    void button.offsetWidth;
    button.classList.add('is-pressed');
  });
  document.addEventListener('animationend', event => {
    event.target.closest?.('.action')?.classList.remove('is-pressed');
  });

  function layout() { updateMarkers(); }
  layout();
  addEventListener('resize', layout, { passive: true });
  document.fonts?.ready.then(layout);

  /* ---------- Page lifecycle ---------- */
  addEventListener('pageshow', event => { if (event.persisted) layout(); });
  addEventListener('pagehide', () => { [...animations.keys()].forEach(cancel); });
  function syncMotion() {
    if (enabled()) return;
    revealAll();
    [...animations.keys()].forEach(cancel); [...closing].forEach(dialog => { if (dialog.open) dialog.close(); });
    updateMarkers();
  }
  addEventListener('oceans:motion', syncMotion); reduced.addEventListener('change', syncMotion);
})();
