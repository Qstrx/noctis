(() => {
  'use strict';
  // SIX: the page is the episodes. Joe Graves' scene packs, one row per
  // episode under its season, built from EPISODES before site.js and
  // player.js run, so Preview and Download work on them.
  const seasons = document.getElementById('seasons');
  if (!seasons || typeof EPISODES === 'undefined') return;
  const PLAY = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 3.5 11 6.5-11 6.5z"/></svg>';
  const SAVE = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v10m-4-4 4 4 4-4M4 16h12" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const esc = text => String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const pad = n => String(n).padStart(2, '0');

  seasons.innerHTML = Object.keys(EPISODES).map(n => {
    const rows = EPISODES[n].map(ep => {
      const label = `Joe Graves scenes from season ${n}, episode ${pad(ep.ep)}, ${ep.title}`;
      return `<li class="row pack-card" aria-labelledby="s${n}e${ep.ep}">
        <div class="pack-cover"><span class="cover-frame"><img src="${SHOTS[n]}${pad(ep.ep)}.jpg" alt="" loading="lazy" decoding="async"></span><button class="row-play" type="button" data-preview data-season="${n}" data-episode="${ep.ep}" aria-label="Preview ${esc(label)}"><i>${PLAY}</i></button></div>
        <div class="row-text"><h3 id="s${n}e${ep.ep}">${esc(ep.title)}</h3><p>E${pad(ep.ep)} · ${ep.run}${ep.parts ? ' · 2 parts' : ''}</p></div>
        <span class="row-tag">1080p</span>
        <button class="action primary" type="button" data-download-episode="${ep.ep}" data-season="${n}" aria-label="Download ${esc(ep.size)}, ${esc(label)}">${SAVE}<span class="action-label">Download</span> <span class="action-size">${ep.size}</span></button>
      </li>`;
    }).join('');
    return `<section id="season-${n}" aria-label="Season ${n}"><h2 class="label"><span>Season ${n}</span><span class="label-note">${EPISODES[n].length} scene packs</span></h2><ul class="rows is-clips">${rows}</ul></section>`;
  }).join('');
})();
