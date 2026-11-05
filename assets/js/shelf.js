(() => {
  'use strict';
  // Tiles and their sheet. Each tile links to its own address
  // (cod.html#ghost). Opening one, its picture resizes from the tile into the
  // top of the sheet while the page settles in around it; closing sends it
  // back. Back, Escape and the close button all close.
  const sheet = document.getElementById('sheet');
  if (!sheet || !window.UI) return;
  const box = sheet.querySelector('.sheet-pic');
  const pic = box.querySelector('img');
  const title = sheet.querySelector('.sheet-title');
  const meta = sheet.querySelector('.sheet-meta');
  const head = sheet.querySelector('.sheet-head');
  const outside = new Map();
  function lockOutside(lock) {
    if (!lock) {
      outside.forEach((wasInert, element) => { element.inert = wasInert; });
      outside.clear();
      return;
    }
    [...document.body.children].forEach(element => {
      // Native dialogs keep their own focus handling above this sheet.
      if (element === sheet || ['DIALOG', 'SCRIPT', 'STYLE', 'LINK'].includes(element.tagName)) return;
      if (!outside.has(element)) outside.set(element, element.inert);
      element.inert = true;
    });
  }
  new MutationObserver(() => { if (current) lockOutside(true); }).observe(document.body, { childList: true });
  const views = new Map();
  const baseTitle = document.title;
  let current = null, openedHere = false, active = null, closeTicket = 0, undoClose = null;
  let routeCallback = () => {}, pendingBack = false, queuedView = null;
  const EASE = 'cubic-bezier(.77, 0, .18, 1)';

  // Where a sheet's picture flies from and back to, and what takes focus
  // after closing. A page can set both; by default it is the tile.
  // The sheet shows the tile's own picture, so it only changes size.
  const pictureOf = view => view.cover || view.still;
  const focusOf = view => view.cover ? (view.coverFocus || '50% 30%') : view.focus;
  const linkOf = id => document.querySelector(`[data-view="${CSS.escape(id)}"]`);
  let sourceOf = id => linkOf(id);
  const tileOf = id => sourceOf(id);
  const visible = rect => rect.bottom > 0 && rect.top < innerHeight && rect.width > 0;

  // The picture is laid out once at its size in the sheet and moved with
  // transform and clip-path alone, so no frame of the move needs a new layout.
  function fly(src, focus, tile, sheetBox, radius, closing) {
    active?.remove();
    const flight = active = new Image();
    flight.decoding = 'sync';
    flight.src = src;
    flight.alt = '';
    flight.className = 'flight';
    flight.style.cssText = `object-position:${focus};width:${sheetBox.width}px;height:${sheetBox.height}px`;
    document.body.append(flight);
    const scale = Math.max(tile.width / sheetBox.width, tile.height / sheetBox.height);
    const insetX = (sheetBox.width - tile.width / scale) / 2, insetY = (sheetBox.height - tile.height / scale) / 2;
    const small = { transform: `translate(${tile.left - insetX * scale}px, ${tile.top - insetY * scale}px) scale(${scale})`, clipPath: `inset(${insetY}px ${insetX}px round ${8 / scale}px)` };
    const large = { transform: `translate(${sheetBox.left}px, ${sheetBox.top}px) scale(1)`, clipPath: `inset(0px 0px round ${radius}px)` };
    const run = flight.animate(closing ? [large, small] : [small, large], { duration: 800, easing: EASE, fill: 'forwards' });
    // A tab in the background may never finish the animation; the page must not wait for it.
    return Promise.race([run.finished.catch(() => {}), new Promise(resolve => setTimeout(resolve, 950))]).then(() => flight);
  }

  function fill(id) {
    const view = views.get(id);
    document.title = `${view.name} — ${baseTitle}`;
    // A view without a picture yet gets a quiet, empty frame.
    box.classList.toggle('is-blank', !pictureOf(view));
    if (pictureOf(view)) { pic.src = pictureOf(view); pic.style.objectPosition = focusOf(view); }
    else pic.removeAttribute('src');
    meta.textContent = view.meta;
    sheet.querySelectorAll('.sheet-part').forEach(part => { part.hidden = part.dataset.part !== id; });
    const part = sheet.querySelector(`.sheet-part[data-part="${CSS.escape(id)}"]`);
    if (!UI.still()) part?.querySelectorAll('.rows, .label, .sheet-mw4').forEach(el => {
      el.classList.remove('is-entering'); void el.offsetWidth; el.classList.add('is-entering');
    });
    part?.querySelectorAll('.seg[data-pill]').forEach(UI.pill);
    view.onShow?.();
    dispatchEvent(new Event('resize'));
    dispatchEvent(new CustomEvent('oceans:viewchange', { detail: { view: id } }));
  }

  function open(id, { animate = true } = {}) {
    if (!views.has(id)) return;
    const switching = current && current !== id;
    undoClose?.();
    active?.remove(); active = null; reset();
    sheet.getAnimations({ subtree: true }).forEach(animation => { if (!(animation instanceof CSSTransition)) animation.cancel(); });
    current = id;
    sheet.hidden = false;
    document.documentElement.classList.add('sheet-open');
    lockOutside(true);
    sheet.scrollTop = 0;
    fill(id);
    const from = tileOf(id)?.getBoundingClientRect();
    const flies = animate && !UI.still() && !switching && from && visible(from) && pictureOf(views.get(id));
    // The title rises as the picture lands.
    UI.letters(title, views.get(id).name, flies ? 740 : 0);
    if (!flies) solid(true);
    title.focus({ preventScroll: true });
    if (UI.still() || switching) return;
    const fade = [{ opacity: 0 }, { opacity: 1 }];
    if (!flies) {
      // Arriving on a sheet's own address, it is simply there.
      if (animate) sheet.animate(fade, { duration: 400, easing: 'ease-out' });
      return;
    }
    // The picture travels; everything else waits for it. The sheet's own
    // background is off for the move while a veil of the same colour fades in.
    // The background colour itself is never animated: browsers can leave it
    // unpainted afterwards, and the page shows through.
    const to = box.getBoundingClientRect();
    box.style.visibility = 'hidden';
    sheet.classList.add('is-clear', 'is-veiled', 'no-move');
    void sheet.offsetWidth;
    sheet.classList.remove('is-veiled', 'no-move');
    document.getElementById('sheetParts')?.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 450, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' });
    sheet.querySelector('.sheet-close').animate(fade, { duration: 300, delay: 450, fill: 'backwards' });
    const view = views.get(id);
    fly(pictureOf(view), focusOf(view), from, to, parseFloat(getComputedStyle(box).borderRadius), false).then(flight => {
      if (flight !== active) return;
      active = null;
      flight.remove();
      box.style.visibility = '';
      solid(true);
      head.animate(fade, { duration: 350, easing: 'ease-out' });
    });
  }

  // Once a sheet has settled it is the whole page: its background is plain and
  // the page behind it is not drawn at all, so nothing can show through.
  function solid(on) {
    sheet.classList.remove('is-clear');
    document.documentElement.classList.toggle('sheet-solid', on);
  }
  function reset() {
    sheet.classList.remove('is-clear', 'is-veiled', 'is-leaving', 'is-gone');
    box.style.visibility = '';
  }
  function close() {
    if (!current) return;
    const id = current;
    const ticket = ++closeTicket;
    current = null;
    document.title = baseTitle;
    lockOutside(false);
    dispatchEvent(new CustomEvent('oceans:viewchange', { detail: { view: null } }));
    solid(false);
    const done = () => {
      if (ticket !== closeTicket) return;
      if (pendingBack) { requestAnimationFrame(done); return; }
      undoClose = null;
      sheet.hidden = true;
      document.documentElement.classList.remove('sheet-open');
      reset();
      linkOf(id)?.focus({ preventScroll: true });
    };
    const from = box.getBoundingClientRect();
    const to = tileOf(id)?.getBoundingClientRect();
    // Reopening while this one is on its way out takes all of it back.
    undoClose = () => {
      closeTicket++;
      undoClose = null;
      active?.remove();
      active = null;
      reset();
    };
    // History may restore focus after popstate; settle before returning it to the tile.
    if (UI.still()) { requestAnimationFrame(done); return; }
    if (!to || !visible(from) || !visible(to) || !pictureOf(views.get(id))) {
      sheet.classList.add('is-gone');
      setTimeout(done, 280);
      return;
    }
    box.style.visibility = 'hidden';
    sheet.classList.add('is-clear', 'is-veiled', 'is-leaving');
    fly(pictureOf(views.get(id)), focusOf(views.get(id)), to, from, parseFloat(getComputedStyle(box).borderRadius), true).then(flight => {
      if (flight === active) active = null;
      flight.remove();
      done();
    });
  }

  // Closing goes back in history when this page opened the sheet, so Back
  // and the close button agree.
  // The sheet closes at once, whatever the history does afterwards.
  function requestClose() {
    if (!current || pendingBack) return;
    const back = openedHere;
    openedHere = false;
    close();
    if (back) { pendingBack = true; history.back(); }
    else {
      history.replaceState(history.state, '', location.pathname);
      route();
    }
  }
  sheet.querySelector('.sheet-close').addEventListener('click', requestClose);
  const focusable = () => [...sheet.querySelectorAll('a[href], video[controls], audio[controls], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')]
    .filter(element => element.tabIndex >= 0 && element.getClientRects().length && !element.closest('[hidden], [inert]'));
  addEventListener('keydown', event => {
    if (event.defaultPrevented || !current || document.querySelector('dialog[open]')) return;
    if (event.key === 'Tab') {
      const items = focusable(), index = items.indexOf(document.activeElement);
      if (!items.length) { event.preventDefault(); title.focus(); }
      else if (event.shiftKey && index <= 0) { event.preventDefault(); items[items.length - 1].focus(); }
      else if (!event.shiftKey && (index === -1 || index === items.length - 1)) { event.preventDefault(); items[0].focus(); }
    } else if (event.key === 'Escape') {
      event.preventDefault(); requestClose();
    }
  });
  addEventListener('focusin', event => {
    if (current && !sheet.contains(event.target) && !document.querySelector('dialog[open]')) title.focus({ preventScroll: true });
  });

  function targetOf(id) {
    const target = views.has(id) ? id : resolve(id);
    return views.has(target) ? target : null;
  }
  function route({ initial = false } = {}) {
    let id = location.hash.slice(1);
    try { id = decodeURIComponent(id); } catch { id = ''; }
    const target = targetOf(id);
    routeCallback({ target, id, initial });
    if (target) {
      if (target !== current) open(target, { animate: !initial });
      openedHere = history.state?.oceansShelfEntry === true;
    } else { openedHere = false; if (current) close(); }
  }
  function navigate(id) {
    if (pendingBack) { queuedView = id; return; }
    const url = new URL(location.href); url.hash = id;
    if (url.href !== location.href) history.pushState({ ...history.state, oceansShelfEntry: true }, '', url);
    route();
  }
  // Other addresses can point inside a sheet: { 'mw4-trailers': 'cutscenes' }.
  let aliases = {};
  const resolve = id => aliases[id] || null;

  window.Shelf = {
    add(id, view) { views.set(id, view); },
    start(options = {}) {
      aliases = options.aliases || {};
      if (options.sourceFor) sourceOf = options.sourceFor;
      routeCallback = options.onRoute || (() => {});
      document.addEventListener('click', event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;
        const id = link.getAttribute('href').slice(1);
        if (!targetOf(id)) return;
        event.preventDefault(); navigate(id);
      });
      addEventListener('hashchange', () => route());
      // A step back that also changes the query fires no hashchange in Chrome,
      // and a chosen scene or quality is in the query.
      addEventListener('popstate', () => {
        pendingBack = false; route();
        if (queuedView) { const id = queuedView; queuedView = null; navigate(id); }
      });
      route({ initial: true });
    }
  };
})();
