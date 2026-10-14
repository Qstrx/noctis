/* The home's night sky: stars before the aurora. Pointing at a collection warms
 * the horizon to its colour; choosing one opens its picture to fill the screen.
 */
(() => {
  'use strict';
  const canvas = document.getElementById('homeSky');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const glow = document.querySelector('.home-glow');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const moving = () => document.body.dataset.motion !== 'off' && !reduced.matches;
  const COLORS = { home: [120, 170, 190], cod: [231, 199, 139], six: [110, 170, 255] };
  // Each collection's night, the colour its page opens on.
  const NIGHT = { cod: '#090c08', six: '#030a13' };
  let w = 0, h = 0, dpr = 1, stars = [], raf = 0, last = 0;
  let tint = COLORS.home.slice(), tintTo = COLORS.home.slice();
  let pointer = [0, 0], parallax = [0, 0];

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(900, w * h / 2600));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * .9 + .1,
      tw: Math.random() * Math.PI * 2, sp: .6 + Math.random() * 1.6
    }));
    if (!raf) draw(performance.now());
  }

  function draw(now) {
    const dt = Math.min(64, now - (last || now)) / 1000; last = now;
    for (let i = 0; i < 3; i++) tint[i] += (tintTo[i] - tint[i]) * Math.min(1, dt * 3);
    parallax[0] += (pointer[0] - parallax[0]) * Math.min(1, dt * 2);
    parallax[1] += (pointer[1] - parallax[1]) * Math.min(1, dt * 2);
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const scale = Math.max(w, h) * .55;
    const [r, g, b] = tint.map(Math.round);
    for (const s of stars) {
      // Drift slowly toward the viewer.
      s.z -= dt * .012 * s.sp;
      if (s.z <= .02) { s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; s.z = 1; }
      const px = cx + (s.x / s.z) * scale + parallax[0] * (1 - s.z) * 30;
      const py = cy + (s.y / s.z) * scale + parallax[1] * (1 - s.z) * 30;
      if (px < -50 || px > w + 50 || py < -50 || py > h + 50) continue;
      const near = 1 - s.z;
      const twinkle = .55 + .45 * Math.sin(now / 900 * s.sp + s.tw);
      const alpha = Math.min(1, (.38 + near * .9) * twinkle);
      const size = .5 + near * 1.8;
      // Near stars take the colour of the collection being pointed at.
      const mix = near * .6;
      const cr = Math.round(235 + (r - 235) * mix), cg = Math.round(240 + (g - 240) * mix), cb = Math.round(250 + (b - 250) * mix);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
      ctx.beginPath(); ctx.arc(px, py, size, 0, Math.PI * 2); ctx.fill();
    }
    glow.style.setProperty('--glow', `${r}, ${g}, ${b}`);
    raf = moving() ? requestAnimationFrame(draw) : 0;
  }
  function wake() { if (!raf) { last = 0; raf = requestAnimationFrame(draw); } }

  addEventListener('resize', resize);
  addEventListener('pointermove', e => { pointer = [(e.clientX / w - .5) * 2, (e.clientY / h - .5) * 2]; wake(); }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });

  const cards = [...document.querySelectorAll('[data-go]')];
  cards.forEach(card => {
    const world = card.dataset.go;
    const hover = on => { tintTo = (on ? COLORS[world] : COLORS.home).slice(); document.body.dataset.palette = on ? world : 'home'; wake(); };
    card.addEventListener('pointerenter', () => hover(true));
    card.addEventListener('pointerleave', () => hover(false));
    card.addEventListener('focus', () => hover(true));
    card.addEventListener('blur', () => hover(false));
    card.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!moving() || document.body.dataset.leaving) return;
      event.preventDefault();
      leave(card, world);
    });
  });

  // The chosen picture opens to fill the screen and dims into the collection's
  // own night; the page then opens under its aurora. Half a second in all.
  function leave(card, world) {
    document.body.dataset.leaving = world;
    const img = card.querySelector('.card-img img');
    const r = card.querySelector('.card-img').getBoundingClientRect();
    cards.forEach(other => other.classList.add(other === card ? 'is-chosen' : 'is-dropped'));
    const zoom = document.createElement('div');
    zoom.className = 'home-zoom';
    zoom.style.setProperty('--bg', NIGHT[world]);
    const copy = img.cloneNode();
    copy.removeAttribute('loading');
    zoom.append(copy);
    document.body.append(zoom);
    const from = `inset(${r.top}px ${w - r.right}px ${h - r.bottom}px ${r.left}px round 20px)`;
    zoom.animate([{ clipPath: from }, { clipPath: 'inset(0 0 0 0 round 0px)' }], { duration: 420, easing: 'cubic-bezier(.7, 0, .2, 1)', fill: 'forwards' });
    copy.animate([{ transform: 'scale(1)', filter: 'brightness(1)' }, { transform: 'scale(1.08)', filter: 'brightness(.35)' }], { duration: 520, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards' });
    zoom.animate([{ backgroundColor: 'transparent' }, { backgroundColor: NIGHT[world] }], { duration: 160, delay: 380, fill: 'forwards' });
    copy.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, delay: 380, fill: 'forwards' });
    setTimeout(() => { location.href = card.href; }, 540);
  }
  // Coming back with the browser's back button: start again from a quiet sky.
  addEventListener('pageshow', e => {
    if (!e.persisted) return;
    delete document.body.dataset.leaving; tintTo = COLORS.home.slice();
    document.querySelector('.home-zoom')?.remove();
    cards.forEach(card => card.classList.remove('is-chosen', 'is-dropped'));
    wake();
  });

  resize();
})();
