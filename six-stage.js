(() => {
  'use strict';
  // SIX opens on Joe Graves, full screen; the roster jumps to a season.
  const stageEl = document.getElementById('stage');
  if (!stageEl || !window.Noir) return;
  const host = stageEl.querySelector('.stage-pic');
  const begin = () => {
    window.Stage?.create(host, { src: 'img/joe.jpg', focus: [.5, .36] });
    Noir.letters(document.getElementById('stageName'), 'Joe Graves');
    Noir.decode(document.getElementById('stageFacts'), '18 scene packs   ·   3:01:33   ·   Seasons 1–2   ·   1080p', 900);
  };
  document.querySelector('.letterbox') ? setTimeout(begin, 380) : begin();
  const roster = stageEl.querySelector('.roster');
  const fit = () => stageEl.style.setProperty('--roster', `${roster.offsetHeight}px`);
  addEventListener('resize', fit, { passive: true });
  fit();
  stageEl.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    stageEl.style.setProperty('--mx', (event.clientX / innerWidth - .5).toFixed(3));
    stageEl.style.setProperty('--my', (event.clientY / innerHeight - .5).toFixed(3));
  });
})();
