(() => {
  'use strict';

  // Runs before the first paint of a collection reached through the home
  // passage. The page opens under the same opaque light the home page left;
  // motion.js replaces this cover with the dissolving veil once it is ready.
  try {
    const value = JSON.parse(sessionStorage.getItem('oceans-spectral-transfer'));
    const age = Date.now() - value?.at;
    if (!['cod', 'six'].includes(value?.world) || value.to !== location.pathname || !(age >= 0 && age < 6000)
      || !(value.origin >= 0 && value.origin <= 1) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.dataset.arriving = value.world;
    document.documentElement.style.setProperty('--passage-origin', `${value.origin * 100}%`);
  } catch (_) { /* Without storage the page simply appears. */ }
})();
