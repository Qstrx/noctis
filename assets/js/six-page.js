(() => {
  'use strict';
  // SIX: the page is the episodes. Joe Graves' scene packs, the two seasons
  // side by side, built from EPISODES before site.js and player.js run, so
  // Preview and Download work on them.
  const seasons = document.getElementById('seasons');
  if (!seasons || typeof EPISODES === 'undefined') return;
  const PLAY = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 3.5 11 6.5-11 6.5z"/></svg>';
  const SAVE = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 3v10m-4-4 4 4 4-4M4 16h12" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const esc = text => String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const pad = n => String(n).padStart(2, '0');

  seasons.className = 'sx-cols';
  seasons.innerHTML = Object.keys(EPISODES).map(n => {
    const rows = EPISODES[n].map(ep => {
      const label = `Joe Graves scenes from season ${n}, episode ${pad(ep.ep)}, ${ep.title}`;
      return `<li class="sx-ep pack-card" aria-labelledby="s${n}e${ep.ep}">
        <div class="pack-cover sx-th"><img src="${SHOTS[n]}${pad(ep.ep)}.jpg" alt="" loading="lazy" decoding="async" width="480" height="270"><b aria-hidden="true">${pad(ep.ep)}</b><button class="sx-play" type="button" data-preview data-season="${n}" data-episode="${ep.ep}" aria-label="Preview ${esc(label)}"><i>${PLAY}</i></button></div>
        <div class="sx-text"><h3 id="s${n}e${ep.ep}">${esc(ep.title)}</h3><p>${ep.run}${ep.parts ? ' · 2 parts' : ''}</p></div>
        <button class="sx-dl" type="button" data-download-episode="${ep.ep}" data-season="${n}" aria-label="Download ${esc(ep.size)}, ${esc(label)}"><i>${SAVE}</i><span>${ep.size}</span></button>
      </li>`;
    }).join('');
    return `<section class="sx-col" id="season-${n}" aria-labelledby="season-${n}-t"><h2 class="sx-season" id="season-${n}-t">Season ${n}<span>${EPISODES[n].length} packs</span></h2><ol class="sx-list">${rows}</ol></section>`;
  }).join('');
})();
