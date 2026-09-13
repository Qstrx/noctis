/* The catalogue stage: whatever row you are pointing at plays behind the page.
   Left alone, it drifts through the collection on its own. */
(() => {
  'use strict';

  const body = document.body;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const rows = [...document.querySelectorAll('.cat-row[data-still]')];
  if (!rows.length) return;

  const stage = document.createElement('div');
  stage.className = 'cat-stage';
  stage.setAttribute('aria-hidden', 'true');

  // Both layers start on the first row's still, so neither is ever a src-less image.
  const first = rows[0];
  const [fx0, fy0] = (first.dataset.focal || '50,50').split(',');
  const layers = [];
  for (let i = 0; i < 2; i++) {
    const img = new Image();
    img.alt = '';
    img.decoding = 'async';
    img.src = first.dataset.still;
    img.style.setProperty('--fx', fx0 + '%');
    img.style.setProperty('--fy', fy0 + '%');
    if (i === 1) img.classList.add('is-out');
    layers.push(img);
    stage.appendChild(img);
  }
  document.body.prepend(stage);

  let front = 0;
  let showing = first.dataset.still;

  function show(src, focal) {
    if (!src || src === showing) return;
    showing = src;
    const back = layers[1 - front];
    back.src = src;
    if (focal) {
      const [x, y] = focal.split(',');
      back.style.setProperty('--fx', x + '%');
      back.style.setProperty('--fy', y + '%');
    }
    const settle = () => {
      layers[front].classList.add('is-out');
      back.classList.remove('is-out');
      front = 1 - front;
    };
    if (back.complete) requestAnimationFrame(settle);
    else back.addEventListener('load', () => requestAnimationFrame(settle), { once: true });
  }

  /* ---- the idle drift, so the page is never a still photograph ---- */
  let idleTimer = 0;
  let idleStep = 0;

  function startIdle() {
    if (idleTimer || reduced.matches) return;
    idleTimer = setInterval(() => {
      if (document.hidden || body.classList.contains('row-live')) return;
      idleStep = (idleStep + 1) % rows.length;
      const row = rows[idleStep];
      show(row.dataset.still, row.dataset.focal);
    }, 5200);
  }

  function stopIdle() {
    clearInterval(idleTimer);
    idleTimer = 0;
  }

  /* ---- pointing at a row takes over the stage ---- */
  let live = null;

  function setLive(row) {
    live = row;
    body.classList.toggle('row-live', Boolean(row));
    for (const item of rows) item.classList.toggle('is-live', item === row);
    if (row) show(row.dataset.still, row.dataset.focal);
  }

  const focusedRow = () => {
    const el = document.activeElement;
    return el && el.closest ? el.closest('.cat-row') : null;
  };

  for (const row of rows) {
    row.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      setLive(row);
    });
    row.addEventListener('pointerleave', event => {
      if (event.pointerType === 'touch') return;
      if (live === row) setLive(focusedRow());
    });
    row.addEventListener('focusin', () => setLive(row));
    row.addEventListener('focusout', () => {
      queueMicrotask(() => { if (!row.contains(document.activeElement)) setLive(focusedRow()); });
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopIdle();
    else startIdle();
  });
  reduced.addEventListener('change', () => { if (reduced.matches) stopIdle(); else startIdle(); });

  startIdle();
})();
