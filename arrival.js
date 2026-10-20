(() => {
  'use strict';

  // Runs before the first paint. Everything here only decides how the page
  // enters; motion.js does the moving once the document is ready.
  const root = document.documentElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footage further down waits for motion.js to reveal it as it scrolls in.
  if (!still) root.classList.add('reveal-ready');

  // A photo carried over by a View Transition lands without a second entrance.
  addEventListener('pagereveal', event => {
    if (event.viewTransition) root.classList.add('vt-arrival');
  });
})();
