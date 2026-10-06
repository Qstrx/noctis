/* AuroraGrab 3.0's northern sky, adapted for the Oceans archive.
 * Original procedural curtain and seeded Lofoten ridges by AuroraGrab (MIT).
 * No external resources. The quiet sky keeps a still frame when motion is off.
 */
(() => {
  'use strict';

  const canvas = document.getElementById('auroraCanvas');
  if (!canvas) return;
  const scene = canvas.parentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 700px)');
  const details = document.createElement('canvas');
  details.className = 'aurora-details';
  details.setAttribute('aria-hidden', 'true');
  canvas.after(details);
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = details.getContext('2d');
  const HORIZON = 626 / 700;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const rng = (seed) => () => {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  let width = 0;
  let height = 0;
  let gl = null;
  let program = null;
  let uniforms = {};
  let enabled = (document.body.dataset.motion || document.documentElement.dataset.motion) !== 'off'
    && !document.querySelector('#preview[open], #codPreview[open]');
  let raf = 0;
  let timer = 0;
  let last = 0;
  let time = 40;
  let pulseStart = 0;
  let energy = 0.35;
  let focused = false;
  let introStart = 0;
  let detailLayers = null;
  let detailDpr = 1;
  let parallax = [0, 0];
  let targetParallax = [0, 0];
  let resizeTimer = 0;
  let contextLost = false;
  // Scrolling stirs the curtains a little and lets them drift with the page.
  let scrollBoost = 0;
  let scrollShift = 0;
  let lastScrollY = window.scrollY;
  const world = ['cod', 'six'].includes(document.body.dataset.world) ? document.body.dataset.world : 'home';
  // The same seeded curtains carry three collection lights. No replacement sky.
  const palettes = {
    home: [[.2,.96,.58],[.52,.34,1],[.45,1,.74],[.03,.1,.11],[.01,.045,.075],[.003,.01,.03],[.012,.05,.042]],
    cod: [[.63,.78,.28],[1,.55,.18],[.94,.85,.46],[.085,.11,.035],[.035,.06,.018],[.01,.014,.006],[.055,.06,.018]],
    six: [[.22,.58,1],[.49,.42,.95],[.61,.87,1],[.02,.08,.16],[.015,.04,.095],[.003,.008,.035],[.01,.045,.095]]
  };
  const clonePalette = value => value.map(color => [...color]);
  let paletteFrom = clonePalette(palettes[world]);
  let paletteTo = clonePalette(palettes[world]);
  let paletteWorld = world;
  let paletteStart = 0, paletteDuration = 0, paletteOrigin = .5;
  const validPalette = value => Array.isArray(value) && value.length === 7 && value.every(color => Array.isArray(color) && color.length === 3 && color.every(n => Number.isFinite(n) && n >= 0 && n <= 1));
  function paletteProgress(now = performance.now()) {
    return paletteDuration ? clamp((now - paletteStart) / paletteDuration, 0, 1) : 1;
  }
  function sampledPalette(now = performance.now()) {
    const p = paletteProgress(now), mix = p * p * (3 - 2 * p);
    return paletteFrom.map((color, i) => color.map((n, j) => n + (paletteTo[i][j] - n) * mix));
  }
  function paletteState(now = performance.now()) {
    return { from: paletteFrom, to: paletteTo, world: paletteWorld, progress: paletteProgress(now), duration: paletteDuration, origin: paletteOrigin };
  }
  function setPalette(chosen, duration = 700, origin = .5) {
    if (!palettes[chosen]) return;
    document.body.dataset.palette = chosen;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', {home:'#02060b',cod:'#090c08',six:'#030a13'}[chosen]);
    if (paletteWorld === chosen) return;
    paletteFrom = sampledPalette();
    paletteTo = clonePalette(palettes[chosen]);
    paletteWorld = chosen;
    paletteOrigin = clamp(origin, 0, 1);
    paletteStart = performance.now();
    paletteDuration = enabled && !reduced.matches ? clamp(duration, 100, 1500) : 0;
    canvas.dataset.skyPalette = chosen;
    if (!paletteDuration) { paletteFrom = clonePalette(paletteTo); draw(); }
  }

  // A collection is another view of the same sky, as in AuroraGrab's shell.
  // A one-use transfer carries the curtain's clock and light wave across pages.
  function takeTransfer() {
    try {
      const saved = sessionStorage.getItem('oceans-sky-transfer');
      sessionStorage.removeItem('oceans-sky-transfer');
      if (saved) {
        const value = JSON.parse(saved);
        const age = Date.now() - value.writtenAt;
        if (Number.isFinite(value.time) && value.time >= 0 && value.time < 100000
          && Number.isFinite(value.energy) && Number.isFinite(value.pulseElapsed)
          && age >= 0 && age <= 5000) return { ...value, age };
      }
    } catch (_) { /* Storage may be unavailable; each page still has a sky. */ }
    return null;
  }
  function restoreTransfer(value) {
    time = value.time + value.age / 1000 * .735;
    energy = clamp(value.energy, 0, 1.5);
    const elapsed = value.pulseElapsed + value.age;
    pulseStart = value.pulseElapsed >= 0 && elapsed < 1300 ? performance.now() - elapsed : 0;
    canvas.dataset.skyArrival = 'continuous';
    const saved = value.palette;
    if (saved && validPalette(saved.from) && validPalette(saved.to)
      && palettes[saved.world] && Number.isFinite(saved.progress) && Number.isFinite(saved.duration) && Number.isFinite(saved.origin)) {
      const progress = clamp(saved.progress + value.age / Math.max(1, saved.duration), 0, 1);
      if (saved.world === world) {
        paletteFrom = clonePalette(saved.from); paletteTo = clonePalette(saved.to);
        paletteDuration = clamp(saved.duration, 0, 1500); paletteStart = performance.now() - progress * paletteDuration;
        paletteOrigin = clamp(saved.origin, 0, 1); paletteWorld = world;
      } else {
        const mix = progress * progress * (3 - 2 * progress);
        paletteFrom = saved.from.map((color, i) => color.map((n, j) => n + (saved.to[i][j] - n) * mix));
        paletteTo = clonePalette(palettes[world]); paletteWorld = world;
        paletteDuration = enabled && !reduced.matches ? 700 : 0; paletteStart = performance.now(); paletteOrigin = .5;
      }
    }
  }
  const transfer = takeTransfer();
  if (transfer) restoreTransfer(transfer);
  canvas.dataset.skyArrival = transfer ? 'continuous' : 'initial';
  canvas.dataset.skyIntro = 'skipped';
  canvas.dataset.skyPalette = paletteWorld;

  // The source intro uses cubic-bezier(.2,.8,.2,1) for each layer. Solve its
  // x coordinate so the cached canvas layers follow that same authored ease.
  function introEase(progress) {
    const x = clamp(progress, 0, 1);
    let t = x;
    for (let i = 0; i < 5; i++) {
      const error = t * t * t - .6 * t * t + .6 * t - x;
      const slope = 3 * t * t - 1.2 * t + .6;
      t = clamp(t - error / slope, 0, 1);
    }
    return .4 * t * t * t - 1.8 * t * t + 2.4 * t;
  }

  const vertex = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fragment = `
    precision highp float;
    uniform vec2 uRes;
    uniform float uTime;
    uniform float uEnergy;
    uniform float uPulse;
    uniform vec2 uPar;
    uniform float uHorizon;
    uniform vec3 uFrom[7];
    uniform vec3 uTo[7];
    uniform float uColorProgress;
    uniform float uColorOrigin;
    float paletteMix(vec2 uv){
      if(uColorProgress>=.999)return 1.;
      if(uColorProgress<=.001)return 0.;
      float distance=abs(uv.x-uColorOrigin)+.12*abs(uv.y-.55);
      return smoothstep(distance-.12,distance+.12,uColorProgress*1.5-.14);
    }
    float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
    float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}
    vec3 curtain(vec2 uv,float t,float seed,float base,float amp,float hgt,float bright,float x0,float x1){
      float x=uv.x;
      float env=smoothstep(x0,x0+.22,x)*(1.-smoothstep(x1-.22,x1,x));
      if(env<=0.)return vec3(0.);
      float edge=base+amp*(fbm(vec2(x*1.1+seed,t*.028+seed))-.5)+.05*sin(x*4.6+seed*3.+t*.14)+.016*(noise(vec2(x*38.+seed,t*.4))-.5);
      float d=uv.y-edge;
      if(d<-.08)return vec3(0.);
      float rx=x*105.+7.*sin(x*5.+t*.18+seed)+d*18.+seed*50.;
      float rays=noise(vec2(rx,t*.3))*.6+noise(vec2(rx*2.7,t*.47+3.))*.4;
      rays=pow(rays,3.);
      float along=smoothstep(.28,.78,fbm(vec2(x*2.6+seed*2.,t*.09)));
      float h=hgt*(.45+1.1*fbm(vec2(x*1.7+seed*4.,t*.05)));
      float up=exp(-max(d,0.)/h*2.7);
      float lower=smoothstep(-.038-.03*rays,.014,d)*(.5+.5*smoothstep(.2,.8,noise(vec2(x*9.+seed,t*.2))));
      float I=lower*up*(.12+1.75*rays)*along*env*bright;
      float k=clamp(d/h,0.,1.);
      float pal=paletteMix(uv);
      vec3 col=mix(mix(uFrom[0],uTo[0],pal),mix(uFrom[1],uTo[1],pal),smoothstep(.22,.95,k));
      col=mix(mix(uFrom[2],uTo[2],pal),col,smoothstep(0.,.07,k));
      return col*I;
    }
    vec3 aurora(vec2 uv,float t){
      vec3 a=curtain(uv,t,1.7,.56,.36,.22,1.15,-.25,1.25)+curtain(uv,t*.86,5.3,.68,.22,.14,.6,.35,1.3)+curtain(uv,t*1.12,9.1,.5,.18,.12,.4,-.3,.62);
      if(uPulse>-.5)a*=1.+.55*exp(-pow((uv.x-uPulse)/.18,2.));
      return a*(.28+1.1*uEnergy);
    }
    vec3 skyCol(vec2 uv){
      float pal=paletteMix(uv);
      vec3 n=mix(mix(uFrom[3],uTo[3],pal),mix(uFrom[4],uTo[4],pal),smoothstep(.08,.5,uv.y));
      n=mix(n,mix(uFrom[5],uTo[5],pal),smoothstep(.5,1.,uv.y));
      float band=exp(-pow((uv.y-.78+(uv.x-.5)*.32)/.1,2.));
      float mw=fbm(vec2(uv.x*4.+uv.y*2.,uv.y*3.));
      n+=vec3(.045,.05,.075)*band*smoothstep(.42,.85,mw);
      n+=mix(uFrom[6],uTo[6],pal)*exp(-max(uv.y-uHorizon,0.)/.11);
      return n;
    }
    void main(){
      vec2 uv=gl_FragCoord.xy/uRes;
      vec3 col;
      if(uv.y>uHorizon){
        col=1.-exp(-(skyCol(uv)+aurora(uv+uPar,uTime))*1.7);
      }else{
        float wy=uHorizon-uv.y;
        float rip=(noise(vec2(uv.x*18.,wy*140.-uTime*.6))-.5)*.012*(.4+wy*6.);
        vec2 m=vec2(uv.x+rip,uHorizon+wy*4.6);
        col=(1.-exp(-(skyCol(m)+aurora(m+uPar,uTime))*1.7))*.5;
        col*=.85+.15*smoothstep(0.,.02,wy);
      }
      gl_FragColor=vec4(col,1.);
    }
  `;

  function ridge(seed, rough, amp, peaks) {
    const random = rng(seed);
    const ys = new Array(513);
    let step = 512;
    let displacement = amp;
    ys[0] = amp * (0.25 + random() * 0.3);
    ys[512] = amp * (0.25 + random() * 0.3);
    while (step > 1) {
      const half = step / 2;
      for (let i = half; i < 513; i += step) ys[i] = (ys[i - half] + ys[i + half]) / 2 + (random() - 0.5) * displacement;
      displacement *= rough;
      step = half;
    }
    for (const peak of peaks) {
      for (let i = 0; i < 513; i++) {
        const dx = i / 512 - peak[0];
        const distance = Math.abs(dx) / (dx < 0 ? peak[1] : peak[2]);
        if (distance < 1) ys[i] += peak[3] * Math.pow(1 - distance, 1.45);
      }
    }
    return ys.map((value) => Math.max(4, value));
  }
  const ridges = [
    { points: ridge(11, .6, 115, [[.16,.07,.045,58],[.45,.05,.09,72],[.73,.045,.065,52]]), top: '#0a1d28', bottom: '#07151d' },
    { points: ridge(23, .62, 82, [[.3,.045,.075,50],[.62,.065,.04,62],[.88,.04,.06,36]]), top: '#061219', bottom: '#040d13' },
    { points: ridge(37, .64, 50, [[.07,.05,.035,26],[.5,.035,.055,30],[.8,.05,.045,22]]), top: '#02080c', bottom: '#010508' }
  ];

  function traceRidge(context, points, reflected = false) {
    const horizon = height * HORIZON;
    context.beginPath();
    context.moveTo(-width * .03, horizon);
    for (let i = 0; i < points.length; i++) {
      context.lineTo(width * (i / 512 * 1.06 - .03), horizon + points[i] * height / 700 * (reflected ? 1 : -1));
    }
    context.lineTo(width * 1.03, reflected ? height : horizon);
    context.lineTo(-width * .03, reflected ? height : horizon);
    context.closePath();
  }

  function makeDetailLayer() {
    const buffer = document.createElement('canvas');
    buffer.width = details.width;
    buffer.height = details.height;
    const context = buffer.getContext('2d');
    if (context) context.setTransform(detailDpr, 0, 0, detailDpr, 0, 0);
    return { buffer, context };
  }

  function buildDetailLayers() {
    if (!ctx || !width || !height) return;
    detailDpr = Math.min(window.devicePixelRatio || 1, compact.matches ? 1 : 1.5);
    details.width = Math.round(width * detailDpr);
    details.height = Math.round(height * detailDpr);
    ctx.setTransform(detailDpr, 0, 0, detailDpr, 0, 0);
    // Cache the seeded artwork once per resize. The intro only composites these
    // buffers; it neither redraws hundreds of stars nor creates extra DOM layers.
    detailLayers = { stars: makeDetailLayer(), ridges: ridges.map(makeDetailLayer), reflection: makeDetailLayer() };
    const stars = detailLayers.stars.context;
    if (!stars || detailLayers.ridges.some((layer) => !layer.context) || !detailLayers.reflection.context) {
      detailLayers = null;
      return;
    }
    const random = rng(42);
    const count = Math.round(clamp(340 * width * height / (1120 * 700), compact.matches ? 120 : 220, compact.matches ? 240 : 650));
    for (let i = 0; i < count; i++) {
      const x = random() * width;
      const y = Math.pow(random(), 1.35) * (476 / 700) * height;
      const size = random();
      const radius = size < .85 ? .35 + random() * .55 : .8 + random() * .7;
      const alpha = .18 + random() * .75;
      const tint = random();
      const color = tint < .7 ? '255,255,255' : tint < .87 ? '200,220,255' : '255,232,205';
      if (radius > 1.1) {
        const glow = stars.createRadialGradient(x, y, 0, x, y, radius * 5);
        glow.addColorStop(0, `rgba(${color},${alpha * .35})`);
        glow.addColorStop(1, `rgba(${color},0)`);
        stars.fillStyle = glow;
        stars.fillRect(x-radius*5, y-radius*5, radius*10, radius*10);
      }
      stars.fillStyle = `rgba(${color},${alpha})`;
      stars.beginPath();
      stars.arc(x, y, radius, 0, Math.PI * 2);
      stars.fill();
    }
    const horizon = height * HORIZON;
    ridges.forEach((ridge, index) => {
      const context = detailLayers.ridges[index].context;
      const gradient = context.createLinearGradient(0, horizon - height * .23, 0, horizon);
      gradient.addColorStop(0, ridge.top);
      gradient.addColorStop(1, ridge.bottom);
      traceRidge(context, ridge.points);
      context.fillStyle = gradient;
      context.fill();
      if (index === 0) {
        context.beginPath();
        ridge.points.forEach((point, i) => {
          const x = width * (i / 512 * 1.06 - .03);
          const y = horizon - point * height / 700;
          if (i) context.lineTo(x, y); else context.moveTo(x, y);
        });
        context.strokeStyle = `rgba(${palettes[world][2].map(n => Math.round(n * 255)).join(',')},.22)`;
        context.lineWidth = .6;
        context.stroke();
      }
    });
    const reflection = detailLayers.reflection.context;
    reflection.save();
    reflection.beginPath();
    reflection.rect(0, horizon, width, height - horizon);
    reflection.clip();
    reflection.globalAlpha = .5;
    for (const ridge of ridges) {
      traceRidge(reflection, ridge.points, true);
      reflection.fillStyle = ridge.bottom;
      reflection.fill();
    }
    reflection.restore();
  }

  function drawDetails(now = performance.now()) {
    if (!ctx || !detailLayers) return;
    const elapsed = introStart ? now - introStart : 2000;
    const phase = (duration, delay) => introEase((elapsed - delay) / duration);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, details.width, details.height);
    const composite = (layer, alpha, y = 0) => {
      ctx.globalAlpha = alpha;
      ctx.drawImage(layer.buffer, 0, y * detailDpr);
    };
    composite(detailLayers.stars, phase(1500, 150));
    [34, 46, 58].forEach((rise, i) => {
      const progress = phase(1100, [250, 380, 510][i]);
      composite(detailLayers.ridges[i], progress, rise * (1 - progress));
    });
    composite(detailLayers.reflection, phase(1000, 650));
    ctx.globalAlpha = 1;
    ctx.setTransform(detailDpr, 0, 0, detailDpr, 0, 0);
    if (!introStart) detailLayers = null;
  }

  function finishIntro() {
    if (!introStart) return;
    introStart = 0;
    canvas.style.opacity = '';
    canvas.dataset.skyIntro = 'complete';
    drawDetails();
  }

  function setFallback(on) {
    scene.classList.toggle('aurora-fallback', on);
    canvas.classList.toggle('is-ready', !on);
    // Leaving the WebGL canvas transparent exposes the static CSS sky beneath.
    canvas.hidden = on;
  }

  function initializeGL() {
    try {
      gl = canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false, powerPreference: 'low-power' });
      if (!gl) throw new Error('WebGL unavailable');
      const compile = (kind, source) => {
        const shader = gl.createShader(kind);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const error = gl.getShaderInfoLog(shader);
          gl.deleteShader(shader);
          throw new Error(error || 'Shader unavailable');
        }
        return shader;
      };
      const vertexShader = compile(gl.VERTEX_SHADER, vertex);
      const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      const fragmentShader = compile(gl.FRAGMENT_SHADER, precision && precision.precision ? fragment : fragment.replace('precision highp float;', 'precision mediump float;'));
      program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Sky program unavailable');
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'p');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      uniforms = {};
      ['uRes','uTime','uEnergy','uPulse','uPar','uHorizon'].forEach((name) => { uniforms[name] = gl.getUniformLocation(program, name); });
      ['uFrom[0]', 'uTo[0]', 'uColorProgress', 'uColorOrigin'].forEach(name => { uniforms[name] = gl.getUniformLocation(program, name); });
      setFallback(false);
      return true;
    } catch (_) {
      gl = null;
      setFallback(true);
      return false;
    }
  }

  function draw(now = performance.now()) {
    if (!gl || contextLost || !width || !height) return;
    // At most half the CSS resolution, with a lighter mobile render target.
    const scale = compact.matches ? .35 : .5;
    const renderWidth = Math.max(2, Math.round(Math.min(width, 2400) * scale));
    const renderHeight = Math.max(2, Math.round(renderWidth * height / width));
    if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
      canvas.width = renderWidth;
      canvas.height = renderHeight;
      gl.viewport(0, 0, renderWidth, renderHeight);
    }
    const moving = enabled && !reduced.matches;
    if (introStart) {
      const elapsed = now - introStart;
      canvas.style.opacity = String(introEase(elapsed / 1400));
      drawDetails(now);
      if (elapsed >= 1650) finishIntro();
    }
    const progress = pulseStart && moving ? (now - pulseStart) / 1300 : 2;
    const pulse = progress <= 1 ? -.1 + progress * 1.2 : -1;
    if (progress > 1) pulseStart = 0;
    gl.uniform2f(uniforms.uRes, renderWidth, renderHeight);
    gl.uniform1f(uniforms.uTime, time);
    gl.uniform1f(uniforms.uEnergy, energy);
    gl.uniform1f(uniforms.uPulse, pulse);
    gl.uniform2f(uniforms.uPar, moving ? parallax[0] : 0, moving ? parallax[1] + scrollShift : 0);
    gl.uniform1f(uniforms.uHorizon, 1 - HORIZON);
    const paletteP = moving ? paletteProgress(now) : 1;
    gl.uniform3fv(uniforms['uFrom[0]'], new Float32Array(paletteFrom.flat()));
    gl.uniform3fv(uniforms['uTo[0]'], new Float32Array(paletteTo.flat()));
    gl.uniform1f(uniforms.uColorProgress, paletteP * paletteP * (3 - 2 * paletteP));
    gl.uniform1f(uniforms.uColorOrigin, paletteOrigin);
    canvas.dataset.skyPaletteProgress = paletteP.toFixed(3);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  const shouldAnimate = () => gl && !contextLost && enabled && !reduced.matches && document.visibilityState === 'visible';
  function stop() {
    window.cancelAnimationFrame(raf);
    window.clearTimeout(timer);
    raf = 0;
    timer = 0;
    last = 0;
  }
  function tick(now) {
    raf = 0;
    if (!shouldAnimate()) return;
    const dt = last ? Math.min(100, now - last) / 1000 : 0;
    last = now;
    time += dt * .735;
    const pulsePhase = pulseStart ? clamp((now - pulseStart) / 1300, 0, 1) : 1;
    const lightBreath = pulseStart ? .45 * Math.pow(Math.sin(Math.PI * pulsePhase), 2) : 0;
    const targetEnergy = (focused ? .6 : .35) + lightBreath + scrollBoost;
    energy += (targetEnergy - energy) * Math.min(1, dt * 1.8);
    scrollBoost *= Math.max(0, 1 - dt * 2.2);
    scrollShift += (Math.min(1, window.scrollY / 1800) * .03 - scrollShift) * Math.min(1, dt * 3);
    parallax = parallax.map((value, i) => value + (targetParallax[i] - value) * Math.min(1, dt * 3));
    draw(now);
    // A timer avoids waking every display refresh only to skip most frames.
    const fps = compact.matches ? 20 : 30;
    timer = window.setTimeout(() => {
      timer = 0;
      if (shouldAnimate()) raf = window.requestAnimationFrame(tick);
    }, 1000 / fps);
  }
  function synchronize() {
    stop();
    if (!enabled || reduced.matches || !gl || contextLost || document.visibilityState !== 'visible') {
      finishIntro();
      if (!enabled || reduced.matches) { energy = .35; focused = false; pulseStart = 0; }
      if (!enabled || reduced.matches) { paletteDuration = 0; paletteFrom = clonePalette(paletteTo); }
    }
    if (document.visibilityState !== 'visible') return;
    drawDetails();
    draw();
    if (shouldAnimate()) raf = window.requestAnimationFrame(tick);
  }
  function resize() {
    const bounds = scene.getBoundingClientRect();
    width = Math.max(1, bounds.width || window.innerWidth);
    height = Math.max(1, bounds.height || window.innerHeight);
    buildDetailLayers();
    synchronize();
  }

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    contextLost = true;
    stop();
    finishIntro();
    setFallback(true);
  });
  canvas.addEventListener('webglcontextrestored', () => {
    contextLost = false;
    initializeGL();
    resize();
  });
  const motionChanged = (event) => {
    if (typeof event.detail?.enabled !== 'boolean') return;
    enabled = event.detail.enabled;
    if (!enabled) { pulseStart = 0; targetParallax = [0, 0]; }
    synchronize();
  };
  window.addEventListener('oceans:motion', motionChanged);
  document.addEventListener('oceans:motion', motionChanged);
  // AuroraGrab's restrained hover energy prepares a choice; a confirmed choice
  // uses a broad 1300ms light wave with a smooth rise and fall in energy.
  window.addEventListener('oceans:aurora-focus', (event) => {
    if (typeof event.detail?.active !== 'boolean' || !shouldAnimate()) return;
    focused = event.detail.active;
  });
  window.addEventListener('oceans:aurora-pulse', () => {
    if (!shouldAnimate()) return;
    pulseStart = performance.now();
  });
  window.addEventListener('oceans:palette', event => {
    const chosen = event.detail?.world;
    if (!palettes[chosen]) return;
    const duration = Number.isFinite(event.detail.duration) ? event.detail.duration : 700;
    const origin = Number.isFinite(event.detail.origin) ? event.detail.origin : .5;
    setPalette(chosen, duration, origin);
  });
  window.addEventListener('oceans:aurora-remember', () => {
    try {
      const now = performance.now();
      const elapsed = pulseStart ? now - pulseStart : -1;
      sessionStorage.setItem('oceans-sky-transfer', JSON.stringify({
        time,
        energy,
        pulseElapsed: elapsed >= 0 && elapsed <= 1300 ? elapsed : -1,
        palette: paletteState(now),
        writtenAt: Date.now()
      }));
    } catch (_) { /* Navigation remains available without storage. */ }
  });
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const moved = Math.abs(y - lastScrollY);
    lastScrollY = y;
    if (shouldAnimate()) scrollBoost = Math.min(.28, scrollBoost + moved / 3000);
  }, { passive: true });

  // Now and then, while the visitor lingers on the home sky, a star falls.
  // Three at most per visit, never over a dialog or a passage.
  const streakCanvas = world === 'home' ? document.createElement('canvas') : null;
  const streakContext = streakCanvas?.getContext('2d');
  if (streakCanvas) {
    streakCanvas.className = 'aurora-details';
    streakCanvas.setAttribute('aria-hidden', 'true');
    details.after(streakCanvas);
  }
  let streakTimer = 0;
  let streakFrame = 0;
  let streakCount = 0;
  function scheduleStreak(delay) {
    window.clearTimeout(streakTimer);
    if (!streakContext || streakCount >= 3) return;
    streakTimer = window.setTimeout(shootStar, delay);
  }
  function shootStar() {
    if (!shouldAnimate() || document.body.dataset.passage || document.querySelector('dialog[open]') || !width) { scheduleStreak(9000); return; }
    streakCount += 1;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = width;
    const h = height;
    streakCanvas.width = Math.round(w * dpr);
    streakCanvas.height = Math.round(h * dpr);
    const x0 = w * (.12 + Math.random() * .5);
    const y0 = h * (.05 + Math.random() * .16);
    const angle = (14 + Math.random() * 14) * Math.PI / 180;
    const travel = w * (.2 + Math.random() * .12);
    const dx = Math.cos(angle) * travel;
    const dy = Math.sin(angle) * travel;
    const tail = Math.min(150, travel * .45) / travel;
    const tint = palettes[paletteWorld][2].map((n) => Math.round(150 + n * 105)).join(',');
    const start = performance.now();
    const frame = (now) => {
      const progress = clamp((now - start) / 1100, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      streakContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      streakContext.clearRect(0, 0, w, h);
      if (progress >= 1 || !shouldAnimate()) {
        streakFrame = 0;
        scheduleStreak(18000 + Math.random() * 22000);
        return;
      }
      const x = x0 + dx * eased;
      const y = y0 + dy * eased;
      const fade = progress < .7 ? 1 : 1 - (progress - .7) / .3;
      const trail = streakContext.createLinearGradient(x, y, x - dx * tail, y - dy * tail);
      trail.addColorStop(0, `rgba(255,255,255,${.95 * fade})`);
      trail.addColorStop(.3, `rgba(${tint},${.45 * fade})`);
      trail.addColorStop(1, `rgba(${tint},0)`);
      streakContext.strokeStyle = trail;
      streakContext.lineWidth = 1.5;
      streakContext.lineCap = 'round';
      streakContext.beginPath();
      streakContext.moveTo(x, y);
      streakContext.lineTo(x - dx * tail, y - dy * tail);
      streakContext.stroke();
      streakContext.fillStyle = `rgba(255,255,255,${fade})`;
      streakContext.beginPath();
      streakContext.arc(x, y, 1.2, 0, Math.PI * 2);
      streakContext.fill();
      streakFrame = window.requestAnimationFrame(frame);
    };
    streakFrame = window.requestAnimationFrame(frame);
  }
  scheduleStreak(5500);
  window.addEventListener('pagehide', () => { window.cancelAnimationFrame(streakFrame); window.clearTimeout(streakTimer); });

  window.addEventListener('pointermove', (event) => {
    if (!shouldAnimate() || compact.matches) return;
    targetParallax = [(event.clientX / window.innerWidth - .5) * .012, (event.clientY / window.innerHeight - .5) * .008];
  }, { passive: true });
  document.addEventListener('pointerout', (event) => { if (!event.relatedTarget) targetParallax = [0, 0]; });
  document.addEventListener('visibilitychange', synchronize);
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 120);
  }, { passive: true });
  reduced.addEventListener('change', synchronize);
  compact.addEventListener('change', resize);
  window.addEventListener('pagehide', () => { stop(); finishIntro(); });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      const incoming = takeTransfer();
      if (incoming) restoreTransfer(incoming);
      scheduleStreak(6000);
    }
    synchronize();
  });
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 120);
  }).observe(scene);

  initializeGL();
  // The new cinema entrance owns first-load motion; the sky starts settled.
  finishIntro();
  resize();
})();
