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
  const behind = [document.getElementById('main'), document.querySelector('.site-header')].filter(Boolean);
  const views = new Map();
  const baseTitle = document.title;
  let current = null, openedHere = false, active = null, leaving = false, closeTicket = 0, undoClose = null;
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

  function fly(src, focus, from, to, radius) {
    active?.remove();
    const flight = active = new Image();
    flight.src = src;
    flight.alt = '';
    flight.className = 'flight';
    flight.style.objectPosition = focus;
    document.body.append(flight);
    const frame = (r, rad) => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, borderRadius: rad });
    const run = flight.animate([frame(from, radius[0]), frame(to, radius[1])], { duration: 950, easing: EASE, fill: 'forwards' });
    return run.finished.catch(() => {}).then(() => flight);
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
  }

  function open(id, { animate = true } = {}) {
    if (!views.has(id)) return;
    const switching = current && current !== id;
    undoClose?.();
    current = id;
    sheet.hidden = false;
    document.documentElement.classList.add('sheet-open');
    behind.forEach(el => { el.inert = true; });
    sheet.scrollTop = 0;
    fill(id);
    const from = tileOf(id)?.getBoundingClientRect();
    const flies = animate && !UI.still() && !switching && from && visible(from) && pictureOf(views.get(id));
    // The title rises as the picture lands.
    UI.letters(title, views.get(id).name, flies ? 880 : 0);
    title.focus({ preventScroll: true });
    if (UI.still() || switching) return;
    const fade = [{ opacity: 0 }, { opacity: 1 }];
    if (!flies) {
      sheet.animate(fade, { duration: 400, easing: 'ease-out' });
      return;
    }
    // The picture travels; everything else waits for it.
    const to = box.getBoundingClientRect();
    box.style.visibility = 'hidden';
    sheet.animate([{ backgroundColor: 'rgba(9, 9, 10, 0)' }, { backgroundColor: 'rgba(9, 9, 10, 1)' }], { duration: 700, easing: 'ease-out' });
    document.getElementById('sheetParts')?.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 600, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' });
    sheet.querySelector('.sheet-close').animate(fade, { duration: 400, delay: 500, fill: 'backwards' });
    const view = views.get(id);
    fly(pictureOf(view), focusOf(view), from, to, ['8px', getComputedStyle(box).borderRadius]).then(flight => {
      if (flight !== active) return;
      active = null;
      flight.remove();
      box.style.visibility = '';
      box.animate(fade, { duration: 350, easing: 'ease-out', pseudoElement: '::after' });
      head.animate(fade, { duration: 350, easing: 'ease-out' });
    });
  }

  function close() {
    if (!current) return;
    const id = current;
    const ticket = ++closeTicket;
    current = null;
    document.title = baseTitle;
    behind.forEach(el => { el.inert = false; });
    const tile = tileOf(id);
    const done = () => {
      if (ticket !== closeTicket) return;
      undoClose = null;
      sheet.hidden = true;
      document.documentElement.classList.remove('sheet-open');
      box.style.visibility = '';
      linkOf(id)?.focus({ preventScroll: true });
    };
    const from = box.getBoundingClientRect();
    const to = tile?.getBoundingClientRect();
    // Reopening while this one is on its way out takes all of it back.
    const running = [];
    undoClose = () => {
      closeTicket++;
      undoClose = null;
      running.forEach(animation => animation.cancel());
      active?.remove();
      active = null;
      box.style.visibility = '';
    };
    if (UI.still() || !to || !visible(from) || !visible(to) || !pictureOf(views.get(id))) {
      if (UI.still()) done();
      else {
        const out = sheet.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease-in', fill: 'forwards' });
        running.push(out);
        out.finished.then(() => { done(); out.cancel(); }, () => {});
      }
      return;
    }
    box.style.visibility = 'hidden';
    fly(pictureOf(views.get(id)), focusOf(views.get(id)), from, to, [getComputedStyle(box).borderRadius, '8px']).then(flight => {
      if (flight === active) active = null;
      flight.remove();
      running.forEach(animation => animation.cancel());
      done();
    });
    running.push(sheet.animate([{ backgroundColor: 'rgba(9, 9, 10, 1)' }, { backgroundColor: 'rgba(9, 9, 10, 0)' }], { duration: 700, easing: 'ease-in-out', fill: 'forwards' }));
    sheet.querySelectorAll('.sheet-inner > :not(.sheet-pic), .sheet-close').forEach(el => running.push(el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' })));
  }

  // Closing goes back in history when this page opened the sheet, so Back
  // and the close button agree.
  function requestClose() {
    if (leaving) return;
    if (openedHere) { leaving = true; history.back(); }
    else { history.replaceState(history.state, '', location.pathname + location.search); close(); }
  }
  sheet.querySelector('.sheet-close').addEventListener('click', requestClose);
  addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !current || document.querySelector('dialog[open]')) return;
    event.preventDefault();
    requestClose();
  });

  function route({ initial = false } = {}) {
    leaving = false;
    const id = decodeURIComponent(location.hash.slice(1));
    const target = views.has(id) ? id : resolve(id);
    if (target) {
      if (target !== current) open(target, { animate: !initial });
      if (!initial) openedHere = true;
    } else if (current) { openedHere = false; close(); }
  }
  // Other addresses can point inside a sheet: { 'mw4-trailers': 'cutscenes' }.
  let aliases = {};
  const resolve = id => aliases[id] || null;

  window.Shelf = {
    add(id, view) { views.set(id, view); },
    start(options = {}) {
      aliases = options.aliases || {};
      if (options.sourceFor) sourceOf = options.sourceFor;
      addEventListener('hashchange', () => route());
      route({ initial: true });
    }
  };
})();
