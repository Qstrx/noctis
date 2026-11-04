(() => {
  'use strict';
  // Slices and their sheet. Each slice links to its own address
  // (cod.html#ghost). Opening one, its picture flies out of the slice and
  // grows into the top of the sheet while the page settles in around it;
  // closing sends it back. Back, Escape and the close button all close.
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
  let current = null, openedHere = false, busy = null;
  const EASE = 'cubic-bezier(.77, 0, .18, 1)';

  // Where a sheet's picture flies from and back to, and what takes focus
  // after closing. A page can set both; by default it is the slice.
  // A view's wide picture heads its sheet; its cover (the tile's picture)
  // is what flies. Either stands in for the other.
  const heroOf = view => view.still || view.cover;
  const coverOf = view => view.cover || view.still;
  const focusOf = view => view.still ? view.focus : (view.coverFocus || '50% 30%');
  const linkOf = id => document.querySelector(`[data-view="${CSS.escape(id)}"]`);
  let sourceOf = id => linkOf(id);
  const sliceOf = id => sourceOf(id);
  const visible = rect => rect.bottom > 0 && rect.top < innerHeight && rect.width > 0;

  function fly(src, focus, from, to, radius) {
    const flight = new Image();
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
    box.classList.toggle('is-blank', !heroOf(view));
    if (heroOf(view)) { pic.src = heroOf(view); pic.style.objectPosition = focusOf(view); }
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
    current = id;
    sheet.hidden = false;
    document.documentElement.classList.add('sheet-open');
    behind.forEach(el => { el.inert = true; });
    sheet.scrollTop = 0;
    fill(id);
    UI.letters(title, views.get(id).name, animate ? 420 : 0);
    title.focus({ preventScroll: true });
    if (UI.still() || switching) return;
    const slice = sliceOf(id);
    const from = slice?.getBoundingClientRect();
    const fade = [{ opacity: 0 }, { opacity: 1 }];
    if (!animate || !from || !visible(from) || !coverOf(views.get(id))) {
      sheet.animate(fade, { duration: 400, easing: 'ease-out' });
      return;
    }
    // The picture travels; everything else waits for it.
    const to = box.getBoundingClientRect();
    box.style.visibility = 'hidden';
    sheet.animate([{ backgroundColor: 'rgba(9, 9, 10, 0)' }, { backgroundColor: 'rgba(9, 9, 10, 1)' }], { duration: 700, easing: 'ease-out' });
    head.animate(fade, { duration: 500, delay: 650, fill: 'backwards' });
    document.getElementById('sheetParts')?.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 600, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' });
    sheet.querySelector('.sheet-close').animate(fade, { duration: 400, delay: 500, fill: 'backwards' });
    const view = views.get(id);
    const mine = busy = fly(coverOf(view), view.cover ? (view.coverFocus || '50% 30%') : view.focus, from, to, ['0px', getComputedStyle(box).borderRadius]).then(flight => {
      box.style.visibility = '';
      // The cover lands and the wide picture comes up through it.
      if (view.cover && heroOf(view) !== view.cover) pic.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, easing: 'ease-out' });
      flight.animate(fade.slice().reverse(), { duration: 200 }).finished.then(() => flight.remove(), () => flight.remove());
      if (busy === mine) busy = null;
    });
  }

  function close() {
    if (!current) return;
    const id = current;
    current = null;
    document.title = baseTitle;
    behind.forEach(el => { el.inert = false; });
    const slice = sliceOf(id);
    const done = () => {
      sheet.hidden = true;
      document.documentElement.classList.remove('sheet-open');
      box.style.visibility = '';
      linkOf(id)?.focus({ preventScroll: true });
    };
    const from = box.getBoundingClientRect();
    const to = slice?.getBoundingClientRect();
    if (UI.still() || !to || !visible(from) || !coverOf(views.get(id))) {
      if (UI.still()) done();
      else sheet.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease-in' }).finished.then(done, done);
      return;
    }
    box.style.visibility = 'hidden';
    fly(heroOf(views.get(id)), focusOf(views.get(id)), from, to, [getComputedStyle(box).borderRadius, '0px']).then(flight => {
      flight.remove();
    });
    sheet.animate([{ backgroundColor: 'rgba(9, 9, 10, 1)', opacity: 1 }, { backgroundColor: 'rgba(9, 9, 10, 0)', opacity: 1 }], { duration: 700, easing: 'ease-in-out' });
    const parts = [...sheet.querySelectorAll('.sheet-inner > :not(.sheet-pic), .sheet-head, .sheet-close')];
    parts.forEach(el => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' }));
    setTimeout(() => { parts.forEach(el => el.getAnimations().forEach(a => a.cancel())); done(); }, 950);
  }

  // Closing goes back in history when this page opened the sheet, so Back
  // and the close button agree.
  // A pinned sheet is the whole page: it cannot be closed or left.
  let pinned = null;
  function requestClose() {
    if (pinned) return;
    if (openedHere) history.back();
    else { history.replaceState(history.state, '', location.pathname + location.search); close(); }
  }
  sheet.querySelector('.sheet-close').addEventListener('click', requestClose);
  addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !current || document.querySelector('dialog[open]')) return;
    event.preventDefault();
    requestClose();
  });

  function route({ initial = false } = {}) {
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
      pinned = options.pinned && views.has(options.pinned) ? options.pinned : null;
      if (pinned) {
        if (location.hash !== `#${pinned}`) history.replaceState(history.state, '', `#${pinned}`);
        addEventListener('hashchange', () => { if (location.hash !== `#${pinned}`) history.replaceState(history.state, '', `#${pinned}`); open(pinned, { animate: false }); });
        open(pinned, { animate: false });
        return;
      }
      addEventListener('hashchange', () => route());
      if (options.initial && !location.hash) history.replaceState(history.state, '', `#${options.initial}`);
      route({ initial: true });
    }
  };
})();
