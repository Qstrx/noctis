(() => {
  'use strict';

  /* Deep links to an episode preview belong to Six, not the home. */
  const redirectPreview = () => {
    if (!/^#preview=s[12]-e\d{2}-p[12](?:&|$)/.test(location.hash)) return false;
    location.replace('six.html?v=stage-2' + location.hash);
    return true;
  };
  if (redirectPreview()) return;
  addEventListener('hashchange', redirectPreview);

  const root = document.documentElement;
  const body = document.body;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const picks = [...document.querySelectorAll('.pick')];
  const stage = document.getElementById('stageFrames');
  const nowShowing = document.getElementById('nowShowing');

  let entering = false;
  let introTimer = 0;

  /* ---------------- the frames this archive is made of ---------------- */

  const COD_FRAMES = [
    { src: 'img/cod/price-mw1.jpg', label: 'John Price · MW' },
    { src: 'img/cod/price-mw2.jpg', label: 'John Price · MW II' },
    { src: 'img/cod/price-mw3.jpg', label: 'John Price · MW III' },
    { src: 'img/cod/cuts-mw1.jpg', label: 'Cutscenes · MW' },
    { src: 'img/cod/cuts-mw2.jpg', label: 'Cutscenes · MW II' },
    { src: 'img/cod/cuts-mw3.jpg', label: 'Cutscenes · MW III' }
  ].map(f => ({ ...f, collection: 'cod', href: 'cod.html?v=stage-2' }));

  const sixFrames = () => {
    const shots = typeof SHOTS === 'object' ? SHOTS : null;
    const eps = typeof EPISODES === 'object' ? EPISODES : null;
    if (!shots || !eps) return [];
    const out = [];
    for (const season of [1, 2]) {
      for (const episode of eps[season] || []) {
        const n = String(episode.ep).padStart(2, '0');
        out.push({
          src: shots[season] + n + '.jpg',
          label: 'Six · S' + season + ' E' + n,
          collection: 'six',
          href: 'six.html?v=stage-2'
        });
      }
    }
    return out;
  };

  const SIX_FRAMES = sixFrames();
  const FRAMES = [...COD_FRAMES, ...SIX_FRAMES];

  // Interleave the two worlds so the idle reel alternates instead of running one then the other.
  const weave = (a, b) => {
    const out = [];
    let i = 0, j = 0;
    while (i < a.length || j < b.length) {
      if (j >= b.length || (i < a.length && (i + 1) / a.length <= (j + 1) / b.length)) out.push(a[i++]);
      else out.push(b[j++]);
    }
    return out;
  };
  const IDLE_FRAMES = weave(COD_FRAMES, SIX_FRAMES);
  const poolFor = world => (world === 'cod' ? COD_FRAMES : world === 'six' ? SIX_FRAMES : IDLE_FRAMES);

  /* Where the subject actually sits in each still, measured from the frames themselves,
     so the crop and the slow push both stay on the subject instead of the geometric centre. */
  const FOCAL = {
    'img/cod/price-mw1.jpg': [57, 48], 'img/cod/price-mw2.jpg': [52, 50], 'img/cod/price-mw3.jpg': [54, 59],
    'img/cod/cuts-mw1.jpg': [44, 32], 'img/cod/cuts-mw2.jpg': [50, 41], 'img/cod/cuts-mw3.jpg': [58, 47],
    'img/six/s1-e01.jpg': [53, 58], 'img/six/s1-e02.jpg': [50, 59], 'img/six/s1-e03.jpg': [50, 45],
    'img/six/s1-e04.jpg': [57, 51], 'img/six/s1-e05.jpg': [54, 51], 'img/six/s1-e06.jpg': [46, 57],
    'img/six/s1-e07.jpg': [45, 48], 'img/six/s1-e08.jpg': [54, 55], 'img/six/s2-e01.jpg': [70, 53],
    'img/six/s2-e02.jpg': [52, 65], 'img/six/s2-e03.jpg': [54, 39], 'img/six/s2-e04.jpg': [51, 50],
    'img/six/s2-e05.jpg': [50, 41], 'img/six/s2-e06.jpg': [68, 48], 'img/six/s2-e07.jpg': [50, 35],
    'img/six/s2-e08.jpg': [51, 53], 'img/six/s2-e09.jpg': [51, 47], 'img/six/s2-e10.jpg': [60, 42]
  };
  const aimAt = (img, src) => {
    const f = FOCAL[src] || [50, 50];
    img.style.setProperty('--fx', f[0] + '%');
    img.style.setProperty('--fy', f[1] + '%');
  };

  /* ---------------- what each collection is worth, from the real manifest ---------------- */

  const toSeconds = value => value.split(':').reverse().reduce((total, part, i) => total + Number(part) * 60 ** i, 0);
  const timecode = total => {
    const s = Math.max(0, Math.round(total));
    return Math.floor(s / 3600) + ':' + String(Math.floor(s % 3600 / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  };

  function paintMeta() {
    const sum = { cod: { items: 0, runtime: 0, bytes: 0 }, six: { items: 0, runtime: 0, bytes: 0 } };

    if (typeof COD_PACKS !== 'undefined' && Array.isArray(COD_PACKS)) {
      sum.cod.items = COD_PACKS.length;
      for (const pack of COD_PACKS) {
        // "full" repackages MW I-III, so its minutes and bytes are already counted.
        if (pack.id === 'full') continue;
        const parts = /^\s*([\d:]+)\s*·\s*([\d.]+)\s*GB/.exec(pack.meta || '');
        if (!parts) continue;
        sum.cod.runtime += toSeconds(parts[1]);
        sum.cod.bytes += parseFloat(parts[2]);
      }
    }
    if (typeof EPISODES !== 'undefined') {
      for (const season of [1, 2]) {
        for (const episode of EPISODES[season] || []) {
          sum.six.items++;
          sum.six.runtime += toSeconds(episode.run);
          sum.six.bytes += parseFloat(episode.size);
        }
      }
    }

    const cod = document.querySelector('[data-side-meta=cod]');
    const six = document.querySelector('[data-side-meta=six]');
    if (cod && sum.cod.items) cod.textContent = `${sum.cod.items} packs · ${timecode(sum.cod.runtime)} · ${sum.cod.bytes.toFixed(1)} GB`;
    if (six && sum.six.items) six.textContent = `${sum.six.items} episodes · ${timecode(sum.six.runtime)} · ${sum.six.bytes.toFixed(1)} GB`;
  }

  /* ---------------- the stage plays whichever world you are looking at ---------------- */

  let layers = [];
  let front = 0;
  let pool = IDLE_FRAMES;
  let cursor = 0;
  let playTimer = 0;

  function buildStage() {
    if (!stage || !IDLE_FRAMES.length) return;
    for (let i = 0; i < 2; i++) {
      const img = new Image();
      img.alt = '';
      img.decoding = 'async';
      if (i === 1) img.classList.add('is-out');
      img.src = IDLE_FRAMES[i % IDLE_FRAMES.length].src;
      aimAt(img, img.getAttribute('src'));
      stage.appendChild(img);
      layers.push(img);
    }
    cursor = 0;
    if (nowShowing) nowShowing.textContent = IDLE_FRAMES[0].label;
  }

  function show(frame) {
    if (!layers.length) return;
    const back = layers[1 - front];
    back.src = frame.src;
    aimAt(back, frame.src);
    if (nowShowing) nowShowing.textContent = frame.label;

    const reveal = () => {
      layers[front].classList.add('is-out');
      back.classList.remove('is-out');
      front = 1 - front;
    };
    if (back.complete) requestAnimationFrame(reveal);
    else back.addEventListener('load', () => requestAnimationFrame(reveal), { once: true });
  }

  function advance() {
    if (document.hidden || entering || !pool.length) return;
    cursor = (cursor + 1) % pool.length;
    show(pool[cursor]);
  }

  function startPlaying() {
    if (playTimer || reduced.matches) return;
    playTimer = setInterval(advance, 3400);
  }

  function stopPlaying() {
    clearInterval(playTimer);
    playTimer = 0;
  }

  // Switching worlds cuts straight to a frame from that world rather than waiting for the next tick.
  function setPool(world) {
    const next = poolFor(world);
    if (next === pool) return;
    pool = next;
    cursor = 0;
    if (!reduced.matches && !entering) show(pool[0]);
  }

  /* ---------------- picking one ---------------- */

  let hovered = null;

  function focusedPick() {
    const el = document.activeElement;
    return el && el.closest ? el.closest('.pick') : null;
  }

  function setActive(pick) {
    if (entering) return;
    const world = pick ? pick.dataset.collection : 'none';
    body.dataset.active = world;
    for (const item of picks) {
      item.classList.toggle('is-on', item === pick);
      item.classList.toggle('is-off', Boolean(pick) && item !== pick);
    }
    // The glow sits a touch above or below centre so the two worlds feel different even at a glance.
    root.style.setProperty('--wash-y', world === 'six' ? '58%' : world === 'cod' ? '42%' : '50%');
    setPool(world);
  }

  function enter(pick) {
    if (entering) return;
    entering = true;
    finishIntro();
    stopPlaying();
    body.dataset.active = pick.dataset.collection;
    body.classList.add('is-entering');
    pick.classList.add('is-on', 'is-chosen');
    pick.classList.remove('is-off');
    setTimeout(() => location.assign(pick.href), 720);
  }

  for (const pick of picks) {
    pick.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch' || !finePointer.matches) return;
      hovered = pick;
      setActive(pick);
    });
    pick.addEventListener('pointerleave', event => {
      if (event.pointerType === 'touch' || !finePointer.matches) return;
      if (hovered === pick) hovered = null;
      setActive(focusedPick() || hovered);
    });
    pick.addEventListener('focus', () => { if (!entering) setActive(pick); });
    pick.addEventListener('blur', () => {
      queueMicrotask(() => setActive(focusedPick() || hovered));
    });
    pick.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (reduced.matches || !finePointer.matches) return;
      event.preventDefault();
      enter(pick);
    });
  }

  /* ---------------- the room breathes with the pointer ---------------- */

  let driftFrame = 0;
  let driftX = 0;
  let driftY = 0;

  function applyDrift() {
    driftFrame = 0;
    if (!stage || entering) return;
    stage.style.setProperty('--px', driftX.toFixed(1) + 'px');
    stage.style.setProperty('--py', driftY.toFixed(1) + 'px');
  }

  addEventListener('pointermove', event => {
    if (!finePointer.matches || reduced.matches || entering) return;
    driftX = (event.clientX / innerWidth - 0.5) * -26;
    driftY = (event.clientY / innerHeight - 0.5) * -16;
    if (!driftFrame) driftFrame = requestAnimationFrame(applyDrift);
  }, { passive: true });

  /* ---------------- film grain ---------------- */

  const grainCanvas = document.getElementById('grain');
  let grainTimer = 0;

  function startGrain() {
    if (grainTimer || !grainCanvas || reduced.matches) return;
    const W = 700, H = 420;
    grainCanvas.width = 640;
    grainCanvas.height = 360;
    const tile = document.createElement('canvas');
    tile.width = W;
    tile.height = H;
    const tileCtx = tile.getContext('2d');
    const ctx = grainCanvas.getContext('2d');
    if (!tileCtx || !ctx) return;

    const frame = tileCtx.createImageData(W, H);
    const data = frame.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = 108 + (Math.random() * 88 | 0);
      data[i] = data[i + 1] = data[i + 2] = v;
      data[i + 3] = 255;
    }
    tileCtx.putImageData(frame, 0, 0);

    const tick = () => {
      if (document.hidden) return;
      ctx.drawImage(tile, -(Math.random() * 60 | 0), -(Math.random() * 60 | 0));
    };
    tick();
    grainTimer = setInterval(tick, 72);
  }

  /* ---------------- the reel ---------------- */

  function chip(frame) {
    const link = document.createElement('a');
    link.className = 'chip';
    link.href = frame.href;
    link.dataset.collection = frame.collection;
    const img = new Image();
    img.src = frame.src;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    aimAt(img, frame.src);
    const label = document.createElement('span');
    label.className = 'chip-label';
    label.textContent = frame.label;
    link.append(img, label);
    link.setAttribute('aria-label', frame.label + ' — open the ' + (frame.collection === 'cod' ? 'Call of Duty' : 'Six') + ' collection');
    return link;
  }

  function buildReel() {
    if (!FRAMES.length) return;
    const half = Math.ceil(FRAMES.length / 2);
    const rows = [
      [document.querySelector('#reelTop .reel-track'), FRAMES.slice(0, half)],
      [document.querySelector('#reelBottom .reel-track'), FRAMES.slice(half)]
    ];
    for (const [track, list] of rows) {
      if (!track || !list.length) continue;
      const parts = document.createDocumentFragment();
      for (let pass = 0; pass < 2; pass++) {
        for (const frame of list) {
          const node = chip(frame);
          // The duplicate pass only exists to make the loop seamless.
          if (pass === 1) { node.setAttribute('aria-hidden', 'true'); node.tabIndex = -1; }
          parts.appendChild(node);
        }
      }
      track.appendChild(parts);
    }
  }

  /* ---------------- opening ---------------- */

  function finishIntro() {
    clearTimeout(introTimer);
    body.classList.remove('is-opening');
  }

  function startIntro() {
    if (reduced.matches || entering) return;
    body.classList.add('is-opening');
    introTimer = setTimeout(finishIntro, 1800);
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') finishIntro();
  });
  document.addEventListener('visibilitychange', () => {
    body.classList.toggle('is-hidden', document.hidden);
    if (document.hidden) finishIntro();
  });
  addEventListener('pageshow', event => {
    if (!event.persisted) return;
    entering = false;
    hovered = null;
    body.classList.remove('is-entering');
    for (const pick of picks) pick.classList.remove('is-on', 'is-off', 'is-chosen');
    setActive(null);
    startPlaying();
    finishIntro();
  });

  const syncModes = () => {
    if (reduced.matches) { stopPlaying(); setActive(null); }
    else { startPlaying(); startGrain(); }
  };
  reduced.addEventListener('change', syncModes);
  finePointer.addEventListener('change', syncModes);

  /* ---------------- go ---------------- */

  paintMeta();
  buildStage();
  buildReel();
  startPlaying();
  startGrain();
  startIntro();
})();
