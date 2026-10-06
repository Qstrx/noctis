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

  // A collection reached through the fallback passage opens under the same
  // opaque light the home page left; motion.js replaces this cover with the
  // dissolving veil once it is ready.
  try {
    const value = JSON.parse(sessionStorage.getItem('oceans-spectral-transfer'));
    const age = Date.now() - value?.at;
    if (still || !['cod', 'six'].includes(value?.world) || value.to !== location.pathname || !(age >= 0 && age < 6000)
      || !(value.origin >= 0 && value.origin <= 1)) return;
    root.dataset.arriving = value.world;
    root.style.setProperty('--passage-origin', `${value.origin * 100}%`);
  } catch (_) { /* Without storage the page simply appears. */ }
})();
