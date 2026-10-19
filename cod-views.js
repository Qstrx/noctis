(() => {
  'use strict';
  // The Call of Duty page opens on a choice of operator or the cutscenes; each
  // choice is its own view with its own address (cod.html#price, #cutscenes…),
  // so links, Back and Forward all work. Without scripts every section shows.
  const picker = document.getElementById('choose');
  const nav = document.getElementById('codSwitch');
  if (!picker || !nav) return;
  const VIEWS = {
    price: { title: 'John Price', show: ['#pack-price'], heading: '#row-price', cover: '#pack-price .cover-frame' },
    gaz: { title: 'Gaz', show: ['#pack-gaz'], heading: '#row-gaz', cover: '#pack-gaz .cover-frame' },
    ghost: { title: 'Ghost', show: ['#pack-ghost'], heading: '#row-ghost', cover: '#pack-ghost .cover-frame' },
    soap: { title: 'Soap', show: ['#pack-soap'], heading: '#row-soap', cover: '#pack-soap .cover-frame' },
    cutscenes: { title: 'Cutscenes', show: ['#mw4-campaign', '#campaign-cutscenes', '.board-trailers'], heading: '#mw4-collection-title', cover: '.mw4-mission-cover' }
  };
  // Places inside a view that links can point at directly.
  const INSIDE = { 'mw4-campaign': 'cutscenes', 'campaign-cutscenes': 'cutscenes', 'mw4-trailers': 'cutscenes' };
  const sections = [document.getElementById('mw4-campaign'), ...document.querySelectorAll('.board, .board-row, .source-notes')].filter(Boolean);
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
    if (view === 'choose') sections.forEach(section => { section.hidden = true; });
    else {
      const visible = new Set(VIEWS[view].show.flatMap(selector => [...document.querySelectorAll(selector)]));
      sections.forEach(section => {
        // A board stays when one of its rows is shown; the source notes go with every view.
        const keep = visible.has(section) || section.classList.contains('source-notes')
          || (section.classList.contains('board') && [...visible].some(item => section.contains(item)))
          || [...visible].some(item => item !== section && item.contains(section));
        section.hidden = !keep;
      });
    }
    nav.querySelectorAll('[data-view-link]').forEach(link => {
      if (link.dataset.viewLink === view) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.title = view === 'choose' ? baseTitle : `${VIEWS[view].title} — ${baseTitle}`;
    if (target) target.scrollIntoView({ block: 'start' });
    else if (changed || moveFocus) scrollTo(0, 0);
    if (moveFocus) document.querySelector(view === 'choose' ? '#pickTitle' : VIEWS[view].heading)?.focus({ preventScroll: true });
  }

  // Moving between views is one View Transition: the chosen name or picture
  // (marked data-vt="heading" or "cover") travels into the view it opens.
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let from = null;
  picker.addEventListener('click', event => {
    const link = event.target.closest('[data-view-link]');
    from = link?.querySelector('[data-vt]') || null;
    if (!link) return;
    const box = link.getBoundingClientRect();
    root.style.setProperty('--vt-x', `${event.clientX || box.left + box.width / 2}px`);
    root.style.setProperty('--vt-y', `${event.clientY || box.top + box.height / 2}px`);
  });
  addEventListener('hashchange', () => {
    const next = viewFor(location.hash);
    if (!document.startViewTransition || reduced.matches || document.body.dataset.motion === 'off') { from = null; show(next, true); return; }
    const source = next.view !== 'choose' && current === 'choose' ? from : null;
    let landed = null;
    root.dataset.vtFrom = current; root.dataset.vtTo = next.view;
    if (source) source.style.viewTransitionName = 'cod-pick';
    const transition = document.startViewTransition(() => {
      if (source) source.style.removeProperty('view-transition-name');
      show(next, true);
      landed = source && document.querySelector(VIEWS[next.view][source.dataset.vt === 'cover' ? 'cover' : 'heading']);
      if (landed) landed.style.viewTransitionName = 'cod-pick';
    });
    transition.finished.finally(() => {
      landed?.style.removeProperty('view-transition-name');
      delete root.dataset.vtFrom; delete root.dataset.vtTo;
      from = null;
    });
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
