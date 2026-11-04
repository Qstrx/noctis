(() => {
  'use strict';

  // Runs before the first paint. Everything here only decides how the page
  // enters; motion.js does the moving once the document is ready.
  // Maintenance: while true, every page sends visitors to maintenance.html.
  // Open the site once with #open to see it normally in that browser, #closed to undo.
  const maintenance = false;
  if (maintenance) {
    try {
      if (location.hash === '#open') localStorage.setItem('oceansOpen', 't');
      if (location.hash === '#closed') localStorage.removeItem('oceansOpen');
    } catch {}
    let owner = false;
    try { owner = localStorage.getItem('oceansOpen') === 't'; } catch {}
    if (!owner) { location.replace('maintenance.html'); return; }
  }

  // Early access: only Call of Duty is open, and in it only Ghost's scene
  // packs (OPEN in cod-page.js). SIX and Quality send visitors home.
  // To open everything, set earlyAccess to false here and in cod-page.js.
  const earlyAccess = true;
  if (earlyAccess && /\/(six|quality)\.html$/.test(location.pathname)) { location.replace('index.html'); return; }
  if (earlyAccess) document.documentElement.classList.add('early-access');

  const root = document.documentElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footage further down waits for motion.js to reveal it as it scrolls in.
  if (!still) root.classList.add('reveal-ready');

  // A photo carried over by a View Transition lands without a second entrance.
  addEventListener('pagereveal', event => {
    if (event.viewTransition) root.classList.add('vt-arrival');
  });
})();
