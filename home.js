(() => {
  'use strict';

  // The screen plays frames taken from every pack (home-frames.js). Each time
  // a frame comes up, its episode and the moment in it are drawn at random:
  // every episode plays before any repeats, and every frame of an episode before
  // its first comes back. The next frame loads one turn ahead, lights the sky
  // around the screen with its own colors, and shows where it sits in its pack.
  // Leaning toward a title keeps only that collection on screen; choosing it
  // flies the frame into the title card.
  const reel = document.querySelector('[data-reel]');
  const packs = window.HOME_FRAMES;
  if (!reel || !packs) return;
  const clips = [...document.querySelectorAll('.timeline .clip')];
  const timeline = document.querySelector('.timeline');
  const screen = document.querySelector('.screen');
  const caption = document.querySelector('.caption-text');
  const timecode = document.querySelector('.timecode');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const SHOT_TIME = 4200, FOCUSED_TIME = 3000, SIZES = '(max-width: 700px) 100vw, 860px';
  let index = 0, filter = null, timer = 0, shownAt = performance.now(), lit = 0, turn = 0, current = null;

  const random = count => Math.floor(Math.random() * count);
  // Draws without repeats until the pile runs out, then reshuffles, never
  // starting the new round with the item that ended the last one.
  function bag(items) {
    let pile = [], last = null;
    return () => {
      if (!pile.length) {
        pile = items.slice();
        for (let i = pile.length - 1; i > 0; i--) { const j = random(i + 1); [pile[i], pile[j]] = [pile[j], pile[i]]; }
        if (pile.length > 1 && pile[pile.length - 1] === last) [pile[0], pile[pile.length - 1]] = [pile[pile.length - 1], pile[0]];
      }
      return last = pile.pop();
    };
  }
  const episodes = {};
  Object.entries(packs).forEach(([world, list]) => {
    list.forEach(pack => { pack.next = bag(pack.frames); });
    episodes[world] = bag(list);
  });

  // The order of the two collections on the timeline changes on every visit too.
  clips.forEach((clip, n) => {
    if (n % 2) return;
    const pair = Math.random() < .5 ? ['cod', 'six'] : ['six', 'cod'];
    clip.dataset.world = pair[0];
    if (clips[n + 1]) clips[n + 1].dataset.world = pair[1];
  });

  // The ambient light is two blurred copies of the frame that crossfade.
  const ambient = document.querySelector('.screen-ambient');
  const glows = [0, 1].map(() => {
    const image = new Image();
    image.alt = '';
    ambient.append(image);
    return image;
  });

  // Frames waiting for their turn, by timeline position.
  const ready = new Map();
  function prepare(n) {
    let image = ready.get(n);
    if (!image) {
      const world = clips[n].dataset.world;
      const pack = episodes[world]();
      const [second, x, y] = pack.next();
      const base = `img/home/${pack.id}-${Math.floor(second)}`;
      image = new Image();
      image.className = 'shot';
      image.alt = '';
      image.decoding = 'async';
      image.sizes = SIZES;
      image.srcset = `${base}-640.webp 640w, ${base}.webp 1280w`;
      image.src = `${base}-640.webp`;
      image.style.objectPosition = `${x}% ${y}%`;
      Object.assign(image.dataset, { world, caption: pack.caption, second, fps: pack.fps, ambient: `${base}-640.webp` });
      reel.append(image);
      ready.set(n, image);
    }
    return image;
  }
  const decoded = image => image.decode ? image.decode().catch(() => {}) : Promise.resolve();
  function following(from = index, world = filter) {
    for (let step = 1; step <= clips.length; step++) {
      const candidate = (from + step) % clips.length;
      if (!world || clips[candidate].dataset.world === world) return candidate;
    }
    return from;
  }
  function light(image) {
    const next = glows[1 - lit];
    next.src = image.dataset.ambient;
    next.classList.add('is-lit');
    glows[lit].classList.remove('is-lit');
    lit = 1 - lit;
  }
  // Puts a prepared frame on screen and lets the previous one fade out and go.
  function cut(next) {
    const image = prepare(next);
    ready.delete(next);
    const previous = current;
    if (previous && previous !== image) {
      previous.classList.remove('is-active');
      setTimeout(() => { if (previous !== current) previous.remove(); }, 1400);
    }
    clips.forEach((clip, n) => {
      clip.classList.toggle('is-played', n < next);
      clip.classList.remove('is-active');
    });
    index = next;
    current = image;
    void clips[next].offsetWidth;
    image.classList.add('is-active');
    clips[next].classList.add('is-active');
    caption.textContent = image.dataset.caption;
    shownAt = performance.now();
    light(image);
    // Ready the next frame, and the next of each collection for a choice made without hovering.
    prepare(following());
    Object.keys(packs).forEach(world => prepare(following(next, world)));
    return image;
  }
  async function show(next) {
    const ticket = ++turn;
    await decoded(prepare(next));
    if (ticket === turn) cut(next);
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
      if (current.dataset.world !== world) await show(following());
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
      turn++;
      const image = current.dataset.world === world ? current : cut(following());
      reel.querySelectorAll('.shot').forEach(shot => shot.style.removeProperty('view-transition-name'));
      image.style.viewTransitionName = `hero-${world}`;
    });
  });
  // Any clip on the timeline can be played directly; it draws a new frame each time.
  clips.forEach((clip, n) => clip.addEventListener('click', async () => {
    await show(n);
    schedule();
  }));

  // The timecode reads the frame's position in its pack, advancing at the
  // pack's own frame rate while the frame is on screen.
  const pad = value => String(value).padStart(2, '0');
  function tick() {
    const fps = Number(current.dataset.fps) || 24;
    const elapsed = reduced.matches ? 0 : (performance.now() - shownAt) / 1000;
    const frames = Math.floor((Number(current.dataset.second) + elapsed) * fps);
    const seconds = Math.floor(frames / fps);
    timecode.textContent = `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}:${pad(frames % fps)}`;
  }
  setInterval(() => { if (!document.hidden) tick(); }, 1000 / 30);

  document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else schedule(); });
  reduced.addEventListener('change', () => schedule());
  addEventListener('pageshow', event => {
    if (!event.persisted) return;
    focus(null);
    reel.querySelectorAll('.shot').forEach(shot => shot.style.removeProperty('view-transition-name'));
    schedule();
  });

  // The first frame goes up at once; the projector's warm-up is its entrance.
  const first = prepare(0);
  first.fetchPriority = 'high';
  cut(0);
  tick();
  schedule();
})();
