(() => {
  'use strict';
  if (/^#preview=s[12]-e\d{2}-p[12](?:&|$)/.test(location.hash) && document.body.dataset.world !== 'six') {
    location.replace('six.html' + location.hash); return;
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const items = document.querySelectorAll('.reveal, .cat-row, .cat-group-head');
  if (!reduced.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.remove('waiting'); observer.unobserve(entry.target); } });
    }, {threshold: .08});
    items.forEach((item, i) => { item.style.setProperty('--delay', Math.min(i % 3, 2) * 85 + 'ms'); item.classList.add('waiting'); observer.observe(item); });
    reduced.addEventListener('change', () => { if (reduced.matches) { items.forEach(item => item.classList.remove('waiting')); observer.disconnect(); } });
  }
  const filters = [...document.querySelectorAll('[data-filter]')];
  const groups = [...document.querySelectorAll('[data-group]')];
  filters.forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.filter;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    groups.forEach(group => group.hidden = key !== 'all' && group.dataset.group !== key);
    const count = groups.filter(group => !group.hidden).reduce((n, group) => n + group.querySelectorAll('.cat-row').length, 0);
    document.getElementById('filterCount').textContent = `${count} ${document.body.dataset.world === 'six' ? 'episodes' : 'packs'}`;
  }));
  document.querySelectorAll('dialog:not(#preview)').forEach(dialog => {
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), video[controls]')].filter(el => el.getClientRects().length);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    });
  });
})();
