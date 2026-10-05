(() => {
  'use strict';

  // The screen alternates frames from both collections. Each frame loads one
  // turn ahead, lights the sky around the screen with its own colors, and
  // shows where it sits in its pack. Leaning toward a title keeps only that
  // collection on screen; choosing it flies the frame into the title card.
  const reel = document.querySelector('[data-reel]');
  if (!reel) return;
  const shots = [...reel.querySelectorAll('.shot')];
  const clips = [...document.querySelectorAll('.timeline .clip')];
  const timeline = document.querySelector('.timeline');
  const screen = document.querySelector('.screen');
  const ambient = [...document.querySelectorAll('.screen-ambient img')];
  const caption = document.querySelector('.caption-text');
  const timecode = document.querySelector('.timecode');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const SHOT_TIME = 4200, FOCUSED_TIME = 3000;
  let index = 0, filter = null, timer = 0, shownAt = performance.now(), lit = 0, turn = 0;

  const SIZES = shots[0].sizes;
  // Frames after the first two wait as placeholders until their turn is near.
  function load(n) {
    let shot = shots[n];
    if (shot.tagName !== 'IMG') {
      const image = new Image();
      image.className = shot.className;
      image.alt = '';
      image.decoding = 'async';
      image.style.cssText = shot.style.cssText;
      Object.assign(image.dataset, shot.dataset);
      image.sizes = SIZES;
      image.srcset = shot.dataset.srcset;
      image.src = shot.dataset.src;
      delete image.dataset.srcset;
      delete image.dataset.src;
      shot.replaceWith(image);
      shots[n] = shot = image;
    }
    return shot.decode ? shot.decode().catch(() => {}) : Promise.resolve();
  }
  function following(from = index) {
    for (let step = 1; step <= shots.length; step++) {
      const candidate = (from + step) % shots.length;
      if (!filter || shots[candidate].dataset.world === filter) return candidate;
    }
    return from;
  }
  function light(shot) {
    const next = ambient[1 - lit];
    if (!next) return;
    next.src = shot.dataset.ambient;
    next.classList.add('is-lit');
    ambient[lit].classList.remove('is-lit');
    lit = 1 - lit;
  }
  async function show(next) {
    const ticket = ++turn;
    await load(next);
    if (ticket !== turn) return;
    const shot = shots[next];
    shots[index].classList.remove('is-active');
    clips[index]?.classList.remove('is-active');
    clips.forEach((clip, n) => clip.classList.toggle('is-played', n < next));
    index = next;
    shot.classList.remove('is-active');
    clips[index]?.classList.remove('is-active');
    void shot.offsetWidth;
    shot.classList.add('is-active');
    clips[index]?.classList.add('is-active');
    caption.textContent = shot.dataset.caption;
    shownAt = performance.now();
    light(shot);
    load(following());
  }
  function schedule(delay) {
    clearTimeout(timer);
    const time = filter ? FOCUSED_TIME : SHOT_TIME;
    screen.style.setProperty('--shot-time', `${time}ms`);
    if (reduced.matches || document.hidden) return;
    timer = setTimeout(async () => { await show(following()); schedule(); }, delay ?? time);
  }
  function focus(world) {
    filter = world;
    if (world) timeline.dataset.focus = world;
    else delete timeline.dataset.focus;
  }

  document.querySelectorAll('[data-world-choice]').forEach(choice => {
    const world = choice.dataset.worldChoice;
    const pick = async () => {
      focus(world);
      if (shots[index].dataset.world !== world) await show(following());
      schedule();
    };
    const release = () => { if (filter === world) { focus(null); schedule(); } };
    choice.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') pick(); });
    choice.addEventListener('pointerleave', release);
    choice.addEventListener('focus', pick);
    choice.addEventListener('blur', release);
    choice.addEventListener('click', () => {
      // The frame on screen when the choice is made travels to the next page;
      // if it belongs to the other collection, cut to one of this collection's first.
      focus(world);
      clearTimeout(timer);
      let target = index;
      if (shots[index].dataset.world !== world) {
        target = following();
        turn++;
        shots[index].classList.remove('is-active');
        shots[target].classList.add('is-active');
        index = target;
      }
      shots.forEach(shot => shot.style.removeProperty('view-transition-name'));
      shots[target].style.viewTransitionName = `hero-${world}`;
    });
  });
  // Any clip on the timeline can be played directly.
  clips.forEach((clip, n) => clip.addEventListener('click', async () => {
    await show(n);
    schedule();
  }));

  // The timecode reads the frame's position in its pack, advancing at the
  // pack's own frame rate while the frame is on screen.
  const pad = value => String(value).padStart(2, '0');
  setInterval(() => {
    if (document.hidden) return;
    const shot = shots[index];
    const fps = Number(shot.dataset.fps) || 24;
    const elapsed = reduced.matches ? 0 : (performance.now() - shownAt) / 1000;
    const frames = Math.floor((Number(shot.dataset.second) + elapsed) * fps);
    const seconds = Math.floor(frames / fps);
    timecode.textContent = `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}:${pad(frames % fps)}`;
  }, 1000 / 30);

  document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else schedule(); });
  reduced.addEventListener('change', () => schedule());
  addEventListener('pageshow', event => {
    if (!event.persisted) return;
    focus(null);
    shots.forEach(shot => shot.style.removeProperty('view-transition-name'));
    schedule();
  });
  ambient[0]?.classList.add('is-lit');
  load(1);
  schedule();
})();
