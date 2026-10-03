(() => {
  'use strict';

  // The selected world's light softly exposes its archive through the same sky.
  const ease = 'cubic-bezier(.2,.8,.2,1)';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const enabled = () => document.body.dataset.motion !== 'off' && !reduced.matches;
  const animations = new Map();
  const closing = new Set();
  const scenes = new WeakMap();
  const dialogs = [...document.querySelectorAll('dialog')];
  const main = document.querySelector('main');
  const choices = [...document.querySelectorAll('[data-world-choice]')];
  let hoveredChoice = null;

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
    animation.finished.then(() => {
      animation.cancel();
      release();
    }, release);
    return animation;
  }
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
  window.archiveMotion = { sceneChange };

  const world = document.body.dataset.world;
  const passageKey = 'oceans-spectral-transfer';
  let veil = null, curtain = null, passageAnimation = null, pending = null, passageTimer = 0;
  const originOf = choice => {
    const rect = choice?.querySelector('.choice-photo')?.getBoundingClientRect();
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
    choice.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      hoveredChoice = choice;
      setChoice();
    });
    choice.addEventListener('pointerleave', () => { hoveredChoice = null; setChoice(); });
    choice.addEventListener('focus', () => { hoveredChoice = null; setChoice(); });
    choice.addEventListener('blur', () => queueMicrotask(setChoice));
  });
  function rememberSky() { dispatchEvent(new CustomEvent('oceans:aurora-remember')); }

  // The sky's selected hue accumulates as one continuous atmospheric exposure.
  // Its fully opaque final frame holds for a real load, then dissolves on arrival.
  // Content stays in place and visible by default; the veil never travels.
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
    try { sessionStorage.setItem(passageKey,JSON.stringify({world:pending.world,origin:pending.origin,to:new URL(href).pathname,at:Date.now()})); } catch (_) {}
    pending.committed = true;
    document.body.dataset.passage = 'holding';
    rememberSky(); location.assign(href);
  }
  function cancelPassage() {
    const opener = pending?.opener; pending = null; clearPassage();
    try { sessionStorage.removeItem(passageKey); } catch (_) {}
    opener?.focus({preventScroll:true});
    palette('home', 500, originOf(opener));
  }
  document.addEventListener('click', event => {
    const link=event.target.closest('.world-choice, .site-nav a, .back-link, .brand, .footer-brand');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || link.target === '_blank') return;
    const destination = new URL(link.href,location.href);
    if (destination.origin !== location.origin || !/\/(index|cod|six)\.html$/.test(destination.pathname) || destination.hash || destination.pathname === location.pathname) return;
    if (world !== 'home') { rememberSky(); return; }
    if (!enabled() || !main?.animate) {
      if (link.dataset.worldChoice) palette(link.dataset.worldChoice, 0, originOf(link), true);
      rememberSky(); return;
    }
    event.preventDefault(); if (pending) return;
    clearPassage();
    const chosen = link.dataset.worldChoice;
    if (!['cod','six'].includes(chosen)) { rememberSky(); location.assign(destination.href); return; }
    const origin = originOf(link);
    pending = {href:destination.href,world:chosen,origin,opener:link};
    const light = createVeil(chosen,origin); main.inert = true;
    document.body.dataset.passage = 'departing';
    palette(chosen, 700, origin, true);
    dispatchEvent(new CustomEvent('oceans:aurora-pulse'));
    passageAnimation = light.animate([
      {opacity:0},
      {opacity:1}
    ],{duration:700,easing:'cubic-bezier(.45,0,.2,1)',fill:'forwards'});
    passageTimer = setTimeout(go,700);
  });
  function takePassage() {
    try {
      const raw=sessionStorage.getItem(passageKey); sessionStorage.removeItem(passageKey);
      const value=raw && JSON.parse(raw);
      if (value && Date.now()-value.at >= 0 && Date.now()-value.at < 6000 && value.to === location.pathname && ['cod','six'].includes(value.world) && Number.isFinite(value.origin) && value.origin >= 0 && value.origin <= 1) return value;
    } catch (_) {}
    return null;
  }
  const incoming=takePassage();
  if (incoming && enabled()) {
    createVeil(incoming.world,incoming.origin);
    document.body.dataset.passage = 'arriving';
  }
  function arrive() {
    if (!curtain || pending) return;
    if (!enabled()) { clearPassage(); return; }
    passageAnimation=curtain.animate([
      {opacity:1},
      {opacity:0}
    ],{duration:800,easing:'cubic-bezier(.45,0,.2,1)',fill:'forwards'});
    passageAnimation.finished.then(()=>{if (!pending) clearPassage();},()=>{});
  }
  if (document.readyState !== 'complete') document.addEventListener('DOMContentLoaded',arrive,{once:true}); else arrive();
  document.addEventListener('keydown',event=>{if (pending && !pending.committed && event.key==='Escape') {event.preventDefault();cancelPassage();}});
  addEventListener('pageshow',event=>{if(event.persisted){pending=null;hoveredChoice=null;clearPassage();updateMarkers();setChoice(true);}});
  addEventListener('pagehide',()=>{rememberSky();passageAnimation?.cancel();[...animations.keys()].forEach(cancel);});
  function syncMotion(){
    if(enabled())return;
    clearPassage();
    [...animations.keys()].forEach(cancel);[...closing].forEach(dialog=>{if(dialog.open)dialog.close();});
    if(pending) { palette(pending.world,0,pending.origin,true);go(); } updateMarkers();
  }
  addEventListener('oceans:motion',syncMotion);reduced.addEventListener('change',syncMotion);
})();
