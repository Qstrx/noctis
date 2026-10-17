(() => {
  'use strict';
  const controls = [...document.querySelectorAll('input[name="mw4-quality"]')];
  const packs = typeof COD_PACKS !== 'undefined' ? COD_PACKS.filter(pack => pack.group === 'mw4' && pack.editions) : [];
  if (!controls.length || !packs.length) {
    controls.forEach(control => { control.disabled = true; });
    return;
  }
  function chooseQuality(quality) {
    if (!packs.every(pack => pack.editions[quality]?.files?.length)) return;
    packs.forEach(pack => {
      Object.assign(pack, pack.editions[quality]);
      const card = document.getElementById(pack.id);
      if (!card) return;
      card.querySelector('.cover-badge').textContent = quality + ' · ' + pack.count;
      card.querySelector('.mw4-card-facts').textContent = pack.cardFacts;
      card.querySelector('[data-cod-preview]')?.setAttribute('aria-label', 'Preview MW4 ' + pack.chapter.toLowerCase() + ' in ' + quality);
      card.querySelector('[data-download-pack]')?.setAttribute('aria-label', 'Download MW4 ' + pack.chapter.toLowerCase() + ' in ' + quality);
    });
    controls.forEach(control => { control.checked = control.value === quality; });
    const detail = { '4K': 'Full 4K detail.', '2K': 'Smaller files at 2560 pixels wide.', '1080p': 'Lightest files at 1920 pixels wide.' }[quality];
    document.getElementById('mw4QualityNote').textContent = detail + ' Native 30/60 fps. Stereo audio where available.';
  }
  controls.forEach(control => control.addEventListener('change', () => chooseQuality(control.value)));
  chooseQuality('4K');
})();
