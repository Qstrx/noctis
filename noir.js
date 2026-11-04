(() => {
  'use strict';
  // Shared by every page: the recording timecode in the header, the
  // letterbox opening, a header that firms up once you scroll, and two text
  // effects the stages use (letters that rise, lines that decode).
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const still = () => reduced.matches || document.body.dataset.motion === 'off';
  const root = document.documentElement;

  // ---------- The letterbox opens, once per visit ----------
  let opened = false;
  try { opened = sessionStorage.getItem('noirOpened') === 't'; } catch {}
  if (!opened && !still() && document.body.dataset.intro === 'on') {
    const bars = document.createElement('div');
    bars.className = 'letterbox';
    bars.setAttribute('aria-hidden', 'true');
    bars.innerHTML = '<span></span><span></span><p class="letterbox-slate">Ocean’s Scenepacks <b>Reel 01</b></p>';
    document.body.append(bars);
    root.classList.add('is-opening');
    setTimeout(() => root.classList.remove('is-opening'), 1500);
    setTimeout(() => bars.remove(), 2300);
    try { sessionStorage.setItem('noirOpened', 't'); } catch {}
  }

  // ---------- Timecode: hours, minutes, seconds, frames at 24 fps ----------
  const header = document.querySelector('.site-header');
  if (header) {
    const tc = document.createElement('p');
    tc.className = 'rec';
    tc.setAttribute('aria-hidden', 'true');
    tc.innerHTML = '<i></i><span>REC</span><b>00:00:00:00</b>';
    header.append(tc);
    const out = tc.querySelector('b');
    const pad = n => String(n).padStart(2, '0');
    const t0 = performance.now();
    let last = '';
    const tick = () => {
      const f = Math.floor((performance.now() - t0) / (1000 / 24));
      const text = `${pad(Math.floor(f / 86400))}:${pad(Math.floor(f / 1440) % 60)}:${pad(Math.floor(f / 24) % 60)}:${pad(f % 24)}`;
      if (text !== last) { out.textContent = text; last = text; }
      if (!document.hidden) setTimeout(tick, 1000 / 24);
    };
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
    tick();
  }

  // ---------- The header firms up once the stage is behind you ----------
  const firm = () => document.body.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', firm, { passive: true });
  firm();

  // ---------- Letters that rise into place ----------
  // Each word keeps together; each letter carries its index for the stagger.
  function letters(element, text) {
    let i = 0;
    const parts = [];
    text.split(' ').forEach((word, w) => {
      if (w) parts.push(' ');
      const box = document.createElement('span');
      box.className = 'word';
      [...word].forEach(ch => {
        const span = document.createElement('span');
        span.className = 'ch';
        span.style.setProperty('--i', i++);
        span.textContent = ch;
        box.append(span);
      });
      parts.push(box);
    });
    element.replaceChildren(...parts);
    element.setAttribute('aria-label', text);
    if (still()) return;
    element.classList.remove('is-rising');
    void element.offsetWidth;
    element.classList.add('is-rising');
  }

  // ---------- A line that decodes out of noise ----------
  const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/:#';
  const runs = new WeakMap();
  function decode(element, text, duration = 700) {
    cancelAnimationFrame(runs.get(element));
    element.setAttribute('aria-label', text);
    if (still()) { element.textContent = text; return; }
    const start = performance.now();
    const step = now => {
      const t = Math.min(1, (now - start) / duration);
      const shown = Math.floor(t * text.length);
      let out = text.slice(0, shown);
      for (let i = shown; i < text.length; i++) out += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      element.textContent = out;
      if (t < 1) runs.set(element, requestAnimationFrame(step));
    };
    runs.set(element, requestAnimationFrame(step));
  }

  // ---------- The pointer lights what it is over ----------
  document.addEventListener('pointermove', event => {
    const lit = event.target.closest?.('[data-light]');
    if (!lit) return;
    const r = lit.getBoundingClientRect();
    lit.style.setProperty('--lx', `${event.clientX - r.left}px`);
    lit.style.setProperty('--ly', `${event.clientY - r.top}px`);
  }, { passive: true });

  window.Noir = { letters, decode, still };
})();
