(() => {
  'use strict';
  // A select screen (select.css): pointing, focus, the arrow keys or 1–9 pick
  // a row and the picture follows; a click, a tap or Enter opens it. The list
  // steps out first, then the page moves on: to another page, or to a view of
  // this one (cod-views.js shows it).
  const picker = document.querySelector('.pick');
  if (!picker) return;
  const rows = [...picker.querySelectorAll('.pick-row')];
  // The pictures that follow the list: a frame beside it, or the whole stage behind it.
  const frames = [...picker.querySelectorAll('.pick-frame img, .pick-stage img')];
  const back = picker.querySelector('.pick-back');
  const backImg = back?.querySelector('img');
  const meta = picker.querySelector('.pick-meta');
  const count = picker.querySelector('.pick-info');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const still = () => reduced.matches || document.body.dataset.motion === 'off';
  let on = null, ticket = 0, busy = false;

  function select(row) {
    if (!row || row === on) return;
    on?.classList.remove('is-on');
    on = row;
    row.classList.add('is-on');
    if (meta) meta.textContent = row.dataset.meta;
    if (count) count.textContent = row.dataset.info;
    // On the home, the page takes the colour of the collection you are on.
    if (row.dataset.palette) document.body.dataset.palette = row.dataset.palette;
    if (frames.length < 2) return;
    // Two pictures in the frame: the next one fades in over the last.
    const mine = ++ticket;
    const [shown, next] = frames[0].classList.contains('is-on') ? frames : [frames[1], frames[0]];
    next.src = row.dataset.img;
    next.style.objectPosition = row.dataset.focus;
    back?.classList.add('is-swap');
    const ready = next.decode ? next.decode() : Promise.resolve();
    Promise.race([ready, new Promise(resolve => setTimeout(resolve, 250))]).catch(() => {}).then(() => {
      if (mine !== ticket) return;
      next.classList.add('is-on');
      shown.classList.remove('is-on');
      if (backImg) { backImg.src = row.dataset.img; backImg.style.objectPosition = row.dataset.focus; }
      back?.classList.remove('is-swap');
    });
  }
  rows.forEach(row => {
    row.addEventListener('pointerenter', () => { if (fine.matches) select(row); });
    row.addEventListener('focus', () => select(row));
  });
  select(rows[0]);

  // The keys work as soon as the screen shows, without a click first.
  addEventListener('keydown', event => {
    if (picker.hidden || busy || event.altKey || event.ctrlKey || event.metaKey || document.querySelector('dialog[open]')) return;
    const index = rows.indexOf(on);
    let next = null;
    if (event.key === 'ArrowDown') next = rows[(index + 1) % rows.length];
    else if (event.key === 'ArrowUp') next = rows[(index - 1 + rows.length) % rows.length];
    else if (/^[1-9]$/.test(event.key)) next = rows[event.key - 1];
    else if (event.key === 'Enter' && !document.activeElement?.closest('a, button, input, select, textarea, summary, [contenteditable]')) { event.preventDefault(); on?.click(); return; }
    if (!next) return;
    event.preventDefault();
    next.focus();
  });

  const parts = () => [picker.querySelector('.pick-kicker'), picker.querySelector('.pick-title'), ...rows, picker.querySelector('.pick-view'), back].filter(Boolean);
  function reset() { parts().forEach(el => el.getAnimations().forEach(animation => animation.cancel())); busy = false; }
  // The screen comes in: the title, then the rows one after another.
  function enter() {
    reset();
    if (still() || picker.hidden) return;
    parts().forEach((el, i) => el.animate([{ opacity: 0, transform: el === back ? 'none' : 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
      { duration: 650, delay: 60 + i * 45, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' }));
  }
  // …and steps out before the page moves on.
  function leave() {
    const out = { duration: 300, easing: 'cubic-bezier(.4, 0, 1, 1)', fill: 'forwards' };
    const done = parts().map((el, i) => el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: el === back || el.matches('.pick-view') ? 'scale(.98)' : 'translateY(-10px)' }],
      { ...out, delay: el === back ? 0 : i * 30 }).finished);
    return Promise.race([Promise.all(done), new Promise(resolve => setTimeout(resolve, 650))]).catch(() => {});
  }

  picker.addEventListener('click', event => {
    const link = event.target.closest('.pick-row');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button) return;
    event.preventDefault();
    if (busy) return;
    select(link);
    const here = link.pathname === location.pathname && link.hash;
    const go = () => { if (here) location.hash = link.hash; else location.href = link.href; };
    if (still()) { go(); return; }
    busy = true;
    leave().then(go);
  });

  enter();
  // Back on the choice inside a page, or back to this page from the next one.
  addEventListener('hashchange', () => { if (picker.hidden) reset(); else enter(); });
  addEventListener('pageshow', event => { if (event.persisted) enter(); });
})();
