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

  const root = document.documentElement;

  // A photo carried over by a View Transition lands without a second entrance.
  addEventListener('pagereveal', event => {
    if (event.viewTransition) root.classList.add('vt-arrival');
  });
})();
