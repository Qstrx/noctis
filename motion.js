(() => {
  'use strict';

  // Motion for the archive: dialogs rise in, the navigation underline travels
  // and every press answers.
  const ease = 'cubic-bezier(.2,.8,.2,1)';
  const easeOut = 'cubic-bezier(.16,1,.3,1)';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const enabled = () => document.body.dataset.motion !== 'off' && !reduced.matches;
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
     Dialogs rise in. */
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
    [...animations.keys()].forEach(cancel); [...closing].forEach(dialog => { if (dialog.open) dialog.close(); });
    updateMarkers();
  }
  addEventListener('oceans:motion', syncMotion); reduced.addEventListener('change', syncMotion);
})();
