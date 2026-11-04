(() => {
  'use strict';
  // Small pieces of motion shared by every page: a header that firms up once
  // you scroll, letters that rise, numbers that count, sections that arrive,
  // a pill that slides under the chosen option, and a light that follows the
  // pointer. All of it steps aside for reduced motion.
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const still = () => reduced.matches || document.body.dataset.motion === 'off';
  const EASE = 'cubic-bezier(.16, 1, .3, 1)';

  // ---------- Header ----------
  const firm = () => document.body.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll', firm, { passive: true });
  firm();

  // ---------- Letters that rise into place ----------
  function letters(element, text, delay = 0) {
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
    element.style.setProperty('--rise-delay', `${delay}ms`);
    if (still()) return;
    element.classList.remove('is-rising');
    void element.offsetWidth;
    element.classList.add('is-rising');
  }

  // ---------- Numbers that count up ----------
  // Works on plain numbers and on durations such as 55:29 or 1:07:21.
  function count(element, text, duration = 900) {
    const parts = text.split(':').map(Number);
    if (still() || parts.some(Number.isNaN)) { element.textContent = text; return; }
    const total = parts.reduce((sum, part) => sum * 60 + part, 0);
    const pad = n => String(n).padStart(2, '0');
    const format = value => {
      if (parts.length === 1) return String(Math.round(value));
      const v = Math.round(value), h = Math.floor(v / 3600), m = Math.floor(v / 60) % 60, s = v % 60;
      return parts.length === 3 ? `${h}:${pad(m)}:${pad(s)}` : `${Math.floor(v / 60)}:${pad(s)}`;
    };
    const start = performance.now();
    const step = now => {
      const t = Math.min(1, (now - start) / duration);
      element.textContent = format(total * (1 - Math.pow(1 - t, 4)));
      if (t < 1) requestAnimationFrame(step);
      else element.textContent = text;
    };
    requestAnimationFrame(step);
  }

  // ---------- Sections arrive as they scroll in ----------
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach((entry, i) => {
      entry.target.style.setProperty('--d', `${Math.min(i, 6) * 70}ms`);
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .06 }) : null;
  function reveal(scope = document) {
    scope.querySelectorAll('[data-reveal]:not(.is-in)').forEach(element => {
      if (still() || !io) element.classList.add('is-in');
      else io.observe(element);
    });
  }
  // Already-visible content arrives in order, one after another.
  function arrive(elements, gap = 60) {
    if (still()) return;
    [...elements].forEach((element, i) => element.animate(
      [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }],
      { duration: 700, delay: i * gap, easing: EASE, fill: 'backwards' }));
  }

  // ---------- A pill that slides under the chosen option ----------
  function pill(group) {
    const marker = group.querySelector('.pill');
    if (!marker) return;
    const on = group.querySelector('[aria-current=page], [aria-checked=true], [aria-pressed=true]');
    if (!on) { marker.style.opacity = 0; return; }
    const first = !group.classList.contains('has-pill');
    if (first) marker.style.transition = 'none';
    marker.style.opacity = 1;
    marker.style.width = `${on.offsetWidth}px`;
    marker.style.transform = `translateX(${on.offsetLeft}px)`;
    group.classList.add('has-pill');
    if (first) requestAnimationFrame(() => marker.style.removeProperty('transition'));
  }
  const pills = () => document.querySelectorAll('.has-pill, [data-pill]').forEach(pill);
  addEventListener('resize', pills, { passive: true });
  document.fonts?.ready.then(pills);

  // ---------- The pointer lights what it is over ----------
  document.addEventListener('pointermove', event => {
    const lit = event.target.closest?.('[data-light]');
    if (!lit) return;
    const r = lit.getBoundingClientRect();
    lit.style.setProperty('--lx', `${event.clientX - r.left}px`);
    lit.style.setProperty('--ly', `${event.clientY - r.top}px`);
  }, { passive: true });

  reveal();
  window.UI = { letters, count, reveal, arrive, pill, still, EASE };
})();
