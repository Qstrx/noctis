(() => {
  'use strict';
  // SIX: Joe Graves large, then one season at a time. The switch slides
  // between Season 1 and Season 2; each has its own address (#season-2).
  const switchEl = document.getElementById('switch');
  if (!switchEl || !window.UI) return;
  const seasons = [...document.querySelectorAll('.season')];
  const title = document.getElementById('seasonTitle');
  const note = document.getElementById('seasonNote');
  const frame = document.getElementById('frame');

  UI.letters(document.getElementById('heroName'), 'Joe Graves', 120);
  const stats = [['Scene packs', '18'], ['Footage', '3:01:33'], ['Seasons', '2'], ['Quality', '1080p']];
  const statsEl = document.getElementById('heroStats');
  statsEl.innerHTML = stats.map(([k]) => `<div><dt>${k}</dt><dd></dd></div>`).join('');
  statsEl.querySelectorAll('dd').forEach((dd, i) => UI.count(dd, stats[i][1], 1100));
  const img = frame.querySelector('img');
  if (!UI.still()) img.animate([{ clipPath: 'inset(50% 0 50% 0)', transform: 'scale(1.15)' }, { clipPath: 'inset(0 0 0 0)', transform: 'scale(1)' }], { duration: 1400, delay: 100, easing: 'cubic-bezier(.77, 0, .18, 1)', fill: 'backwards' });

  let current = null;
  function show(n, initial) {
    if (n === current) return;
    current = n;
    seasons.forEach(season => { season.hidden = season.dataset.group !== n; });
    switchEl.querySelectorAll('[data-season-link]').forEach(link => {
      if (link.dataset.seasonLink === n) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    UI.pill(switchEl);
    const season = seasons.find(item => item.dataset.group === n);
    title.textContent = `Season ${n}`;
    note.textContent = season?.querySelector('.season-head p')?.textContent || '';
    if (!initial) UI.arrive(season.querySelectorAll('.pack-card'), 45);
  }
  const route = () => (/^#season-([12])$/.exec(location.hash) || [])[1] || '1';
  addEventListener('hashchange', () => {
    if (!/^#season-/.test(location.hash)) return;
    show(route());
    document.getElementById('seasons').scrollIntoView({ block: 'start', behavior: UI.still() ? 'auto' : 'smooth' });
  });
  show(route(), true);
})();
