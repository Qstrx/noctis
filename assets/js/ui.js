(() => {
  'use strict';
  // Small pieces of motion shared by every page: a header that firms up once
  // you scroll, letters that rise and a pill that slides under the chosen
  // option. All of it steps aside for reduced motion.
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const still = () => reduced.matches || document.body.dataset.motion === 'off';

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

  // ---------- A pill that slides under the chosen option ----------
  function pill(group) {
    const marker = group.querySelector('.pill');
    if (!marker) return;
    const on = group.querySelector('[aria-current=page], [aria-checked=true], [aria-pressed=true]');
    if (!on) { marker.style.opacity = 0; return; }
    // Inside a closed sheet nothing has a size yet; the sheet calls again when it opens.
    if (!on.offsetWidth) return;
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

  window.UI = { letters, pill, still };
})();
