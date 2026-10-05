(() => {
  'use strict';

  // Motion for the archive. The selected world's light carries between pages,
  // title cards rise, footage reveals as it scrolls in and every touch answers.
  const ease = 'cubic-bezier(.2,.8,.2,1)';
  const easeOut = 'cubic-bezier(.16,1,.3,1)';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const enabled = () => document.body.dataset.motion !== 'off' && !reduced.matches;
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  const root = document.documentElement;
  const world = document.body.dataset.world;
  const animations = new Map();
  const closing = new Set();
  const scenes = new WeakMap();
  const dialogs = [...document.querySelectorAll('dialog')];
  const main = document.querySelector('main');
  const choices = [...document.querySelectorAll('[data-world-choice]')];
  // Cross-document View Transitions carry the chosen photo between pages.
  const crossDocument = 'CSSViewTransitionRule' in window;
  let hoveredChoice = null;

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

  /* ---------- Home choices ----------
     Leaning toward a collection tints the sky; its poster tilts toward the
     pointer and catches the light where the pointer is. */
  const passageKey = 'oceans-spectral-transfer';
  let veil = null, curtain = null, passageAnimation = null, pending = null, passageTimer = 0;
  const originOf = choice => {
    const rect = choice?.querySelector('[data-choice-media]')?.getBoundingClientRect();
    return rect?.width ? Math.max(0, Math.min(1, (rect.left + rect.width / 2) / innerWidth)) : .5;
  };
  function palette(selectedWorld, duration, origin = .5, commit = false) {
    dispatchEvent(new CustomEvent('oceans:palette', { detail: { world: selectedWorld, duration, origin, commit } }));
  }
  function setChoice(force = false) {
    if (pending || world !== 'home') return;
    const focused = document.activeElement?.closest('[data-world-choice]');
    const selected = hoveredChoice || focused;
    const targetWorld = selected?.dataset.worldChoice || '';
    if (!force && document.body.dataset.choice === targetWorld) return;
    document.body.dataset.choice = targetWorld;
    choices.forEach(choice => choice.classList.toggle('is-selected', choice === selected));
    dispatchEvent(new CustomEvent('oceans:aurora-focus', { detail: { active: !!selected } }));
    palette(targetWorld || 'home', 700, originOf(selected));
  }
  choices.forEach(choice => {
    let frame = 0, last = null;
    choice.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      hoveredChoice = choice;
      setChoice();
    });
    choice.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch' || !enabled()) return;
      last = event;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = choice.getBoundingClientRect();
        const x = clamp((last.clientX - rect.left) / rect.width, 0, 1);
        const y = clamp((last.clientY - rect.top) / rect.height, 0, 1);
        choice.style.setProperty('--rx', `${((.5 - y) * 12).toFixed(2)}deg`);
        choice.style.setProperty('--ry', `${((x - .5) * 14).toFixed(2)}deg`);
        choice.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
        choice.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
      });
    });
    choice.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      frame = 0;
      ['--rx', '--ry', '--gx', '--gy'].forEach(name => choice.style.removeProperty(name));
      hoveredChoice = null;
      setChoice();
    });
    choice.addEventListener('focus', () => { hoveredChoice = null; setChoice(); });
    choice.addEventListener('blur', () => queueMicrotask(setChoice));
  });
  function rememberSky() { dispatchEvent(new CustomEvent('oceans:aurora-remember')); }

  /* ---------- The fallback passage ----------
     The sky's selected hue accumulates as one continuous atmospheric exposure.
     Its fully opaque final frame holds for a real load, then dissolves on
     arrival. Content stays in place and visible by default. */
  function clearPassage() {
    clearTimeout(passageTimer);
    passageAnimation?.cancel(); passageAnimation = null;
    veil?.remove(); veil = null; curtain = null;
    if (main) main.inert = false;
    delete document.body.dataset.passage;
  }
  function createVeil(chosen, origin) {
    veil = document.createElement('div');
    veil.className = 'passage-veil';
    veil.dataset.world = chosen;
    veil.setAttribute('aria-hidden', 'true');
    veil.style.setProperty('--passage-origin', `${origin * 100}%`);
    curtain = document.createElement('div');
    curtain.className = 'passage-curtain';
    veil.append(curtain);
    document.body.append(veil);
    return curtain;
  }
  function go() {
    if (!pending || pending.committed) return;
    const href = pending.href;
    try { sessionStorage.setItem(passageKey, JSON.stringify({ world: pending.world, origin: pending.origin, to: new URL(href).pathname, at: Date.now() })); } catch (_) {}
    pending.committed = true;
    document.body.dataset.passage = 'holding';
    rememberSky(); location.assign(href);
  }
  function cancelPassage() {
    const opener = pending?.opener; pending = null; clearPassage();
    try { sessionStorage.removeItem(passageKey); } catch (_) {}
    opener?.focus({ preventScroll: true });
    palette('home', 500, originOf(opener));
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('.world-choice, .site-nav a, .back-link, .brand');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || link.target === '_blank') return;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin || !/\/(index|cod|six)\.html$/.test(destination.pathname) || destination.hash || destination.pathname === location.pathname) return;
    if (world !== 'home') { rememberSky(); return; }
    const chosen = link.dataset.worldChoice;
    if (!enabled() || !main?.animate) {
      if (chosen) palette(chosen, 0, originOf(link), true);
      rememberSky(); return;
    }
    if (crossDocument) {
      // The browser carries the photo across; the sky starts turning now.
      if (chosen) {
        palette(chosen, 700, originOf(link), true);
        dispatchEvent(new CustomEvent('oceans:aurora-pulse'));
      }
      rememberSky(); return;
    }
    event.preventDefault(); if (pending) return;
    clearPassage();
    if (!['cod', 'six'].includes(chosen)) { rememberSky(); location.assign(destination.href); return; }
    const origin = originOf(link);
    pending = { href: destination.href, world: chosen, origin, opener: link };
    const light = createVeil(chosen, origin); main.inert = true;
    document.body.dataset.passage = 'departing';
    palette(chosen, 700, origin, true);
    dispatchEvent(new CustomEvent('oceans:aurora-pulse'));
    passageAnimation = light.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' });
    passageTimer = setTimeout(go, 700);
  });
  function takePassage() {
    try {
      const raw = sessionStorage.getItem(passageKey); sessionStorage.removeItem(passageKey);
      const value = raw && JSON.parse(raw);
      if (value && Date.now() - value.at >= 0 && Date.now() - value.at < 6000 && value.to === location.pathname && ['cod', 'six'].includes(value.world) && Number.isFinite(value.origin) && value.origin >= 0 && value.origin <= 1) return value;
    } catch (_) {}
    return null;
  }
  const incoming = takePassage();
  if (incoming && enabled()) {
    createVeil(incoming.world, incoming.origin);
    document.body.dataset.passage = 'arriving';
  }
  // Same frame: the veil takes over the first-paint cover from arrival.js,
  // and the paused title card starts underneath it.
  delete root.dataset.arriving;
  root.style.removeProperty('--passage-origin');
  function arrive() {
    if (!curtain || pending) return;
    if (!enabled()) { clearPassage(); return; }
    passageAnimation = curtain.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 800, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' });
    passageAnimation.finished.then(() => { if (!pending) clearPassage(); }, () => {});
  }
  if (document.readyState !== 'complete') document.addEventListener('DOMContentLoaded', arrive, { once: true }); else arrive();
  document.addEventListener('keydown', event => { if (pending && !pending.committed && event.key === 'Escape') { event.preventDefault(); cancelPassage(); } });

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

  /* ---------- The chapter rail follows the reader ---------- */
  const rail = document.querySelector('.rail');
  const railLinks = rail ? [...rail.querySelectorAll('.rail-link')] : [];
  const railTargets = railLinks.map(link => document.getElementById(decodeURIComponent(link.hash.slice(1)))).filter(Boolean);
  const railMarker = rail?.querySelector('.rail-marker');
  let railCurrent = null;
  function placeRailMarker(instant = false) {
    if (!rail || !railMarker) return;
    const link = railLinks.find(item => item.hash === `#${railCurrent}`);
    rail.classList.toggle('has-current', !!link);
    if (!link) return;
    if (instant) railMarker.style.transition = 'none';
    railMarker.style.setProperty('--mx', `${link.offsetLeft}px`);
    railMarker.style.setProperty('--mw', `${link.offsetWidth}px`);
    if (instant) requestAnimationFrame(() => railMarker.style.removeProperty('transition'));
    const overflow = rail.scrollWidth > rail.clientWidth;
    if (overflow) rail.scrollTo({ left: link.offsetLeft - (rail.clientWidth - link.offsetWidth) / 2, behavior: enabled() ? 'smooth' : 'auto' });
  }
  function updateRail() {
    if (!rail) return;
    const line = innerHeight * .4;
    let current = null;
    railTargets.forEach(target => { if (target.getBoundingClientRect().top <= line) current = target.id; });
    if (current !== railCurrent) {
      const first = railCurrent === null;
      railCurrent = current;
      railLinks.forEach(link => {
        if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      placeRailMarker(first);
    }
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    rail.style.setProperty('--progress', scrollable > 0 ? clamp(scrollY / scrollable, 0, 1).toFixed(4) : '0');
  }

  /* ---------- The title card drifts as the page scrolls away ---------- */
  const heroMedia = document.querySelector('.hero-media');
  function updateHero() {
    if (!heroMedia) return;
    // The photo is scaled 1.1 inside its frame; never drift past that margin.
    const shift = enabled() ? Math.min(scrollY * .08, heroMedia.clientHeight * .045) : 0;
    heroMedia.style.setProperty('--hero-shift', `${shift.toFixed(1)}px`);
  }

  let scrollFrame = 0;
  function onScroll() {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; updateRail(); updateHero(); });
  }
  addEventListener('scroll', onScroll, { passive: true });
  function layout() { updateMarkers(); placeRailMarker(true); onScroll(); }
  layout();
  addEventListener('resize', layout, { passive: true });
  document.fonts?.ready.then(layout);

  /* ---------- Page lifecycle ---------- */
  addEventListener('pageshow', event => { if (event.persisted) { pending = null; hoveredChoice = null; clearPassage(); layout(); setChoice(true); } });
  addEventListener('pagehide', () => { rememberSky(); passageAnimation?.cancel(); [...animations.keys()].forEach(cancel); });
  function syncMotion() {
    if (enabled()) return;
    clearPassage();
    revealAll();
    [...animations.keys()].forEach(cancel); [...closing].forEach(dialog => { if (dialog.open) dialog.close(); });
    if (pending) { palette(pending.world, 0, pending.origin, true); go(); }
    updateMarkers(); updateHero();
  }
  addEventListener('oceans:motion', syncMotion); reduced.addEventListener('change', syncMotion);
})();
