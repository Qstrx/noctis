(() => {
  'use strict';
  // SIX: a slice per season. Each opens its sheet (shelf.js) with Joe
  // Graves' scene packs, one row per episode, built from EPISODES before
  // site.js and player.js run, so Preview and Download work on them.
  const slices = document.getElementById('slices');
  if (!slices || !window.Shelf || typeof EPISODES === 'undefined') return;
  const SEASONS = [
    { id: 'season-1', n: 1, name: 'Season 1', still: 'img/stage/six-1.jpg', focus: '72% 30%' },
    { id: 'season-2', n: 2, name: 'Season 2', still: 'img/stage/six-2.jpg', focus: '58% 30%' }
  ];
  const PLAY = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 3.5 11 6.5-11 6.5z"/></svg>';
  const SAVE = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v10m-4-4 4 4 4-4M4 16h12" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const esc = text => String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const pad = n => String(n).padStart(2, '0');
  const seconds = run => run.split(':').reduce((total, part) => total * 60 + Number(part), 0);
  const clock = total => `${Math.floor(total / 3600)}:${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}`;
  const parts = document.getElementById('sheetParts');

  SEASONS.forEach((season, i) => {
    const episodes = EPISODES[season.n];
    season.meta = `${episodes.length} packs · ${clock(episodes.reduce((sum, ep) => sum + seconds(ep.run), 0))}`;
    season.count = `${episodes.length} packs`;
    const part = document.createElement('div');
    part.className = 'sheet-part';
    part.dataset.part = season.id;
    part.hidden = true;
    part.innerHTML = `<p class="label">Joe Graves</p><ul class="rows">${episodes.map((ep, r) => {
      const label = `Joe Graves scenes from season ${season.n}, episode ${pad(ep.ep)}, ${ep.title}`;
      return `<li class="row pack-card" style="--r:${r}" aria-labelledby="s${season.n}e${ep.ep}">
        <div class="pack-cover"><span class="cover-frame"><img src="${SHOTS[season.n]}${pad(ep.ep)}.jpg" alt="" loading="lazy" decoding="async"></span><button class="row-play" type="button" data-preview data-season="${season.n}" data-episode="${ep.ep}" aria-label="Preview ${esc(label)}"><i>${PLAY}</i></button></div>
        <div class="row-text"><h3 id="s${season.n}e${ep.ep}">${esc(ep.title)}</h3><p>E${pad(ep.ep)} · ${ep.run}${ep.parts ? ' · 2 parts' : ''}</p></div>
        <span class="row-tag">1080p</span>
        <button class="action primary" type="button" data-download-episode="${ep.ep}" data-season="${season.n}" aria-label="Download ${esc(label)}">${SAVE}<span class="action-label">Download</span> <span class="action-size">${ep.size}</span></button>
      </li>`;
    }).join('')}</ul>`;
    parts.append(part);
    Shelf.add(season.id, season);
  });
  slices.innerHTML = SEASONS.map((season, i) => `<a class="slice" href="#${season.id}" data-view="${season.id}" style="--n:${i}"><img class="slice-pic" src="${season.still}" alt="" style="object-position:${season.focus}" decoding="async"><span class="slice-name">${season.name}</span><span class="slice-count">${season.count}</span></a>`).join('');
  Shelf.start();
})();
