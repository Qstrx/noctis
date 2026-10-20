(() => {
  'use strict';
  // The Call of Duty page opens on a choice of operator or the cutscenes; each
  // choice is its own view with its own address (cod.html#price, #cutscenes…),
  // so links, Back and Forward all work. Without scripts every section shows.
  const picker = document.getElementById('choose');
  const nav = document.getElementById('codSwitch');
  if (!picker || !nav) return;
  // Each view: its title, the sections it shows and the heading that takes focus.
  const VIEWS = {
    price: { title: 'John Price', show: ['pack-price'], heading: 'row-price' },
    gaz: { title: 'Gaz', show: ['pack-gaz'], heading: 'row-gaz' },
    ghost: { title: 'Ghost', show: ['pack-ghost'], heading: 'row-ghost' },
    soap: { title: 'Soap', show: ['pack-soap'], heading: 'row-soap' },
    valeria: { title: 'Valeria', show: ['pack-valeria'], heading: 'row-valeria' },
    archer: { title: 'The Archer', show: ['pack-archer'], heading: 'row-archer' },
    cutscenes: { title: 'Cutscenes', show: ['mw4-campaign', 'campaign-cutscenes', 'mw4-trailers'], heading: 'mw4-collection-title' }
  };
  // Places inside a view that links can point at directly.
  const INSIDE = { 'mw4-campaign': 'cutscenes', 'campaign-cutscenes': 'cutscenes', 'mw4-trailers': 'cutscenes' };
  const sections = [document.getElementById('mw4-campaign'), ...document.querySelectorAll('.op')].filter(Boolean);
  const baseTitle = document.title;
  let current = null;

  function viewFor(hash) {
    const id = decodeURIComponent(hash.replace(/^#/, ''));
    if (VIEWS[id]) return { view: id };
    if (INSIDE[id]) return { view: INSIDE[id], target: document.getElementById(id) };
    // A link to an MW4 scene opens the cutscenes.
    if (!id && new URLSearchParams(location.search).has('scene')) return { view: 'cutscenes' };
    return { view: 'choose' };
  }
  function show({ view, target }, moveFocus) {
    const changed = view !== current;
    current = view;
    document.body.dataset.view = view;
    picker.hidden = view !== 'choose';
    nav.hidden = view === 'choose';
    const shown = view === 'choose' ? [] : VIEWS[view].show;
    sections.forEach(section => { section.hidden = !shown.includes(section.id); });
    nav.querySelectorAll('[data-view-link]').forEach(link => {
      if (link.dataset.viewLink === view) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.title = view === 'choose' ? baseTitle : `${VIEWS[view].title} — ${baseTitle}`;
    if (target) target.scrollIntoView({ block: 'start' });
    else if (changed || moveFocus) scrollTo(0, 0);
    if (moveFocus) document.getElementById(view === 'choose' ? 'pickTitle' : VIEWS[view].heading)?.focus({ preventScroll: true });
  }

  // Leaving the choice, the view rises in; select.js has already stepped the list out.
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  addEventListener('hashchange', () => {
    const was = current;
    const next = viewFor(location.hash);
    show(next, true);
    if (was !== 'choose' || next.view === 'choose' || reduced.matches || document.body.dataset.motion === 'off') return;
    [nav, ...sections.filter(section => !section.hidden)].slice(0, 4).forEach((element, i) => element.animate(
      [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }],
      { duration: 700, delay: i * 70, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' }));
  });
  // The browser jumps to a matching id after load; the view decides the scroll instead.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const first = viewFor(location.hash);
  show(first, false);
  addEventListener('load', () => {
    const scene = document.getElementById('mw4Detail');
    if (first.target) first.target.scrollIntoView({ block: 'start' });
    else if (scene?.isConnected) scene.scrollIntoView({ block: 'center' });
    else scrollTo(0, 0);
  });
})();
