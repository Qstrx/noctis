(() => {
  'use strict';

  // The photo of the name under the pointer follows it with a little lag and
  // leans into the direction of travel. On a click it becomes the shared photo
  // that flies into the collection's title card.
  const float = document.querySelector('.sky-float');
  const image = float?.querySelector('img');
  const fine = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 761px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!float || !image) return;
  let x = innerWidth / 2, y = innerHeight / 2, targetX = x, targetY = y, tilt = 0, frame = 0, active = null;

  function step() {
    frame = 0;
    const dx = targetX - x, dy = targetY - y;
    x += dx * .16; y += dy * .16;
    tilt += (Math.max(-12, Math.min(12, dx * .12)) - tilt) * .2;
    float.style.setProperty('--fx', `${(x - float.offsetWidth * .5).toFixed(1)}px`);
    float.style.setProperty('--fy', `${(y - float.offsetHeight * .55).toFixed(1)}px`);
    float.style.setProperty('--fr', `${tilt.toFixed(2)}deg`);
    if (Math.abs(dx) + Math.abs(dy) > .3 || Math.abs(tilt) > .05) frame = requestAnimationFrame(step);
  }
  document.querySelectorAll('.sky-title').forEach(link => {
    link.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch' || !fine.matches || reduced.matches) return;
      if (active !== link) {
        image.src = link.dataset.image;
        image.style.objectPosition = link.querySelector('img')?.style.objectPosition || '';
      }
      if (!active) { x = targetX = event.clientX; y = targetY = event.clientY; }
      active = link;
      float.classList.add('is-on');
      if (!frame) frame = requestAnimationFrame(step);
    });
    link.addEventListener('pointermove', event => {
      if (active !== link) return;
      targetX = event.clientX; targetY = event.clientY;
      if (!frame) frame = requestAnimationFrame(step);
    });
    link.addEventListener('pointerleave', () => {
      if (active !== link) return;
      active = null;
      float.classList.remove('is-on');
    });
    link.addEventListener('click', () => {
      // Only the visible photo carries the name into the next page.
      if (active === link && float.classList.contains('is-on')) float.style.viewTransitionName = `hero-${link.dataset.worldChoice}`;
    });
  });
  addEventListener('pageshow', event => {
    if (!event.persisted) return;
    active = null;
    float.classList.remove('is-on');
    float.style.removeProperty('view-transition-name');
  });
})();
