(() => {
  'use strict';
  // The stage: one still filling the screen, drawn with WebGL. It breathes
  // (a slow push-in), leans toward the pointer, carries film grain, and
  // changes picture through a liquid, colour-split dissolve. Without WebGL,
  // or with reduced motion, two stacked <img> cross-fade instead.
  //
  //   const stage = Stage.create(element, { src, focus: [x, y] });
  //   stage.show({ src, focus: [x, y] });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * .5 + .5; gl_Position = vec4(aPos, 0., 1.); }`;

  const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uA;
uniform sampler2D uB;
uniform vec2 uSizeA;
uniform vec2 uSizeB;
uniform vec2 uFocusA;
uniform vec2 uFocusB;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uP;
uniform float uTime;
uniform float uLive;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), u.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0., a = .5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= .5; }
  return v;
}
// object-fit: cover, with object-position as the focus.
vec2 cover(vec2 uv, vec2 size, vec2 focus, float zoom) {
  float ca = uRes.x / uRes.y, ia = size.x / size.y;
  vec2 s = ca > ia ? vec2(1., ia / ca) : vec2(ca / ia, 1.);
  s /= zoom;
  vec2 off = (1. - s) * vec2(focus.x, 1. - focus.y);
  return off + uv * s;
}
vec3 shot(sampler2D t, vec2 uv, vec2 size, vec2 focus, float zoom, vec2 push, float split) {
  vec2 c = cover(uv, size, focus, zoom) + push;
  vec2 d = vec2(split, 0.);
  return vec3(texture2D(t, c + d).r, texture2D(t, c).g, texture2D(t, c - d).b);
}
void main() {
  vec2 uv = vUv;
  float p = smoothstep(0., 1., uP);
  // The camera breathes and leans toward the pointer.
  float breathe = 1.035 + .02 * sin(uTime * .11) * uLive;
  vec2 lean = uMouse * .012 * uLive;
  // The dissolve: a field of smoke that the new picture floods through.
  float n = fbm(uv * vec2(3.2, 2.2) + vec2(uTime * .05, 0.));
  float edge = smoothstep(n - .18, n + .18, p * 1.36 - .18);
  float wave = sin(p * 3.14159);
  vec2 flow = vec2(n - .5, (n - .5) * .5) * wave * .1;
  float split = .0012 + .0055 * wave;
  vec3 a = shot(uA, uv, uSizeA, uFocusA, breathe + p * .08, lean + flow, split);
  vec3 b = shot(uB, uv, uSizeB, uFocusB, breathe + (1. - p) * .1, lean - flow * .8, split);
  vec3 col = mix(a, b, edge);
  // A thin seam of light where the two pictures meet.
  float seam = smoothstep(.0, .5, edge) * smoothstep(1., .5, edge) * wave;
  col += seam * vec3(1., .8, .52) * .7;
  // The cut flashes warm, like light leaking onto film.
  col += wave * wave * vec3(.16, .09, .03) * smoothstep(.2, .9, n + uv.x * .4);
  // Grade: lifted blacks, a little warmth, vignette, grain.
  vec2 q = uv - .5;
  col *= 1. - dot(q * vec2(1.05, 1.3), q * vec2(1.05, 1.3)) * 1.25;
  col = mix(vec3(.012), col, .97);
  float g = hash(uv * uRes + fract(uTime * 7.3) * 91.7) - .5;
  col += g * .07;
  gl_FragColor = vec4(col, 1.);
}`;

  function compile(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'shader');
    return shader;
  }

  const images = new Map();
  function load(src) {
    if (!images.has(src)) {
      images.set(src, new Promise((resolve, reject) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      }));
    }
    return images.get(src);
  }

  function create(host, first) {
    host.classList.add('stage-host');
    const flat = document.createElement('div');
    flat.className = 'stage-flat';
    flat.innerHTML = '<img alt="" decoding="async"><img alt="" decoding="async">';
    const canvas = document.createElement('canvas');
    canvas.className = 'stage-gl';
    canvas.setAttribute('aria-hidden', 'true');
    host.prepend(flat, canvas);
    const flats = [...flat.querySelectorAll('img')];
    let flatOn = 0;

    let gl = null;
    try {
      gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
    } catch { gl = null; }
    let program, loc = {}, textures = [], sizes = [[16, 9], [16, 9]], focus = [[.5, .5], [.5, .5]];
    if (gl) {
      try {
        program = gl.createProgram();
        gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
        gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('link');
        gl.useProgram(program);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const aPos = gl.getAttribLocation(program, 'aPos');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        ['uA', 'uB', 'uSizeA', 'uSizeB', 'uFocusA', 'uFocusB', 'uRes', 'uMouse', 'uP', 'uTime', 'uLive'].forEach(name => { loc[name] = gl.getUniformLocation(program, name); });
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        textures = [0, 1].map(() => {
          const texture = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([3, 3, 4, 255]));
          [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(w => gl.texParameteri(gl.TEXTURE_2D, w, gl.CLAMP_TO_EDGE));
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          return texture;
        });
        gl.uniform1i(loc.uA, 0);
        gl.uniform1i(loc.uB, 1);
        host.classList.add('is-gl');
      } catch { gl = null; }
    }

    const still = () => reduced.matches || document.body.dataset.motion === 'off';
    let progress = 1, from = 0, duration = 1, start = 0, raf = 0, visible = true, ticket = 0;
    const mouse = [0, 0], target = [0, 0];
    const t0 = performance.now();

    function upload(slot, img) {
      gl.activeTexture(slot ? gl.TEXTURE1 : gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[slot]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      sizes[slot] = [img.naturalWidth, img.naturalHeight];
    }
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(host.clientWidth * dpr)), h = Math.max(1, Math.round(host.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
    }
    function draw(now) {
      raf = 0;
      if (!gl) return;
      resize();
      if (progress < 1) progress = Math.min(1, from + (now - start) / duration);
      mouse[0] += (target[0] - mouse[0]) * .06;
      mouse[1] += (target[1] - mouse[1]) * .06;
      const live = still() ? 0 : 1;
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, textures[0]);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, textures[1]);
      gl.uniform2fv(loc.uSizeA, sizes[0]); gl.uniform2fv(loc.uSizeB, sizes[1]);
      gl.uniform2fv(loc.uFocusA, focus[0]); gl.uniform2fv(loc.uFocusB, focus[1]);
      gl.uniform2f(loc.uRes, canvas.width, canvas.height);
      gl.uniform2f(loc.uMouse, mouse[0], mouse[1]);
      gl.uniform1f(loc.uP, progress);
      gl.uniform1f(loc.uTime, live ? (now - t0) / 1000 : 0);
      gl.uniform1f(loc.uLive, live);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (visible && !document.hidden && (live || progress < 1)) raf = requestAnimationFrame(draw);
    }
    function wake() { if (gl && !raf) raf = requestAnimationFrame(draw); }

    function showFlat(src, at) {
      const next = flats[1 - flatOn];
      next.src = src;
      next.style.objectPosition = `${at[0] * 100}% ${at[1] * 100}%`;
      const swap = () => { next.classList.add('is-on'); flats[flatOn].classList.remove('is-on'); flatOn = 1 - flatOn; };
      (next.decode ? next.decode() : Promise.resolve()).catch(() => {}).then(swap);
    }

    // Show a picture. The current one becomes A and the new one B, then the
    // dissolve runs from A to B.
    function show({ src, focus: at = [.5, .5] }, { instant = false } = {}) {
      const mine = ++ticket;
      if (!gl) { showFlat(src, at); return Promise.resolve(); }
      return load(src).then(img => {
        if (mine !== ticket) return;
        // Whatever is on screen now becomes A.
        if (progress >= .5) {
          const t = textures[0]; textures[0] = textures[1]; textures[1] = t;
          const s = sizes[0]; sizes[0] = sizes[1]; sizes[1] = s;
          const f = focus[0]; focus[0] = focus[1]; focus[1] = f;
        }
        upload(1, img);
        focus[1] = at;
        from = 0;
        progress = instant ? 1 : 0;
        duration = still() ? 260 : 1500;
        start = performance.now();
        wake();
      }).catch(() => showFlat(src, at));
    }

    if (gl) {
      canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); gl = null; host.classList.remove('is-gl'); });
      addEventListener('resize', wake, { passive: true });
      host.addEventListener('pointermove', event => {
        if (event.pointerType !== 'mouse') return;
        const r = host.getBoundingClientRect();
        target[0] = (event.clientX - r.left) / r.width - .5;
        target[1] = (event.clientY - r.top) / r.height - .5;
        wake();
      });
      host.addEventListener('pointerleave', () => { target[0] = 0; target[1] = 0; wake(); });
      if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) wake();
      }).observe(host);
      document.addEventListener('visibilitychange', wake);
      reduced.addEventListener?.('change', wake);
    }
    if (first) show(first, { instant: still() });
    return { show, gl: !!gl };
  }

  window.Stage = { create, load };
})();
