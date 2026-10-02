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
  let gate = null;
  let gateClosure = 0;
  let gateArrival = null;

  function gateConfig(value) {
    if (!value || !Number.isFinite(value.origin) || !value.bounds
      || !Number.isFinite(value.bounds.left) || !Number.isFinite(value.bounds.right)) return null;
    const { left, right } = value.bounds;
    if (left < 0 || right > 1 || right - left < .01 || value.origin < left || value.origin > right) return null;
    return { origin: value.origin, bounds: { left, right } };
  }
  function gateStatus(state) {
    canvas.dataset.gate = state;
    canvas.dataset.gateClosure = gateClosure.toFixed(3);
  }
  function resetGate() {
    gate = null;
    gateClosure = 0;
    gateArrival = null;
    gateStatus('idle');
  }
  gateStatus('idle');

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
    const incomingGate = gateConfig(value.gate);
    if (incomingGate) {
      gate = { ...incomingGate, state: 'closed', from: 1, to: 1, startedAt: 0, duration: 0 };
      gateClosure = 1;
      gateArrival = incomingGate;
      gateStatus('closed');
    }
    canvas.dataset.skyArrival = 'continuous';
  }
  const transfer = takeTransfer();
  if (transfer) restoreTransfer(transfer);
  canvas.dataset.skyArrival = transfer ? 'continuous' : 'initial';
  canvas.dataset.skyIntro = 'skipped';

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
    uniform float uGate;
    uniform vec3 uGateGeometry;
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
      vec3 col=mix(vec3(.2,.96,.58),vec3(.52,.34,1.),smoothstep(.22,.95,k));
      col=mix(vec3(.45,1.,.74),col,smoothstep(0.,.07,k));
      return col*I;
    }
    vec3 aurora(vec2 uv,float t){
      vec3 a=curtain(uv,t,1.7,.56,.36,.22,1.15,-.25,1.25)+curtain(uv,t*.86,5.3,.68,.22,.14,.6,.35,1.3)+curtain(uv,t*1.12,9.1,.5,.18,.12,.4,-.3,.62);
      if(uPulse>-.5)a*=1.+1.7*exp(-pow((uv.x-uPulse)/.065,2.));
      return a*(.28+1.1*uEnergy);
    }
    vec3 skyCol(vec2 uv){
      vec3 n=mix(vec3(.03,.1,.11),vec3(.01,.045,.075),smoothstep(.08,.5,uv.y));
      n=mix(n,vec3(.003,.01,.03),smoothstep(.5,1.,uv.y));
      float band=exp(-pow((uv.y-.78+(uv.x-.5)*.32)/.1,2.));
      float mw=fbm(vec2(uv.x*4.+uv.y*2.,uv.y*3.));
      n+=vec3(.045,.05,.075)*band*smoothstep(.42,.85,mw);
      n+=vec3(.012,.05,.042)*exp(-max(uv.y-uHorizon,0.)/.11);
      return n;
    }
    // Two temporary polar light fronts follow the interface's narrowing window.
    // No contribution at rest: the approved ordinary sky stays exactly the same.
    vec3 gateLight(vec2 uv){
      float left=mix(uGateGeometry.y,uGateGeometry.x,uGate);
      float right=mix(uGateGeometry.z,uGateGeometry.x,uGate);
      float weave=(noise(vec2(uv.y*14.,uTime*.27))-.5)*.014;
      float distance=min(abs(uv.x-left-weave),abs(uv.x-right+weave));
      float halo=exp(-pow(distance/.047,2.));
      float core=exp(-pow(distance/.0065,2.));
      float strands=pow(noise(vec2(uv.x*115.,uv.y*11.-uTime*.32)),2.);
      float height=smoothstep(uHorizon-.035,uHorizon+.1,uv.y);
      vec3 colour=mix(vec3(.45,1.,.74),vec3(.52,.34,1.),smoothstep(.36,.97,uv.y));
      return colour*(halo*(.28+.72*strands)+core*.72)*height*smoothstep(0.,.16,uGate);
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
      if(uGate>0.)col=1.-(1.-col)*exp(-gateLight(uv)*1.05);
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
        context.strokeStyle = 'rgba(120,255,200,.22)';
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
      ['uRes','uTime','uEnergy','uPulse','uPar','uHorizon','uGate','uGateGeometry'].forEach((name) => { uniforms[name] = gl.getUniformLocation(program, name); });
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
    if (gate && (gate.state === 'closing' || gate.state === 'opening')) {
      const progress = clamp((now - gate.startedAt) / gate.duration, 0, 1);
      gateClosure = gate.from + (gate.to - gate.from) * introEase(progress);
      if (progress >= 1) {
        if (gate.to === 1) {
          gateClosure = 1;
          gate.state = 'closed';
        } else resetGate();
      }
      gateStatus(gate?.state || 'idle');
    }
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
    gl.uniform2f(uniforms.uPar, moving ? parallax[0] : 0, moving ? parallax[1] : 0);
    gl.uniform1f(uniforms.uHorizon, 1 - HORIZON);
    gl.uniform1f(uniforms.uGate, gateClosure);
    gl.uniform3f(uniforms.uGateGeometry, gate?.origin ?? .5, gate?.bounds.left ?? 0, gate?.bounds.right ?? 1);
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
    const targetEnergy = introStart && now - introStart < 1500 ? 1.25 : focused ? .6 : .35;
    energy += (targetEnergy - energy) * Math.min(1, dt * 1.8);
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
      resetGate();
      if (!enabled || reduced.matches) { energy = .35; focused = false; pulseStart = 0; }
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
    resetGate();
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
  // uses its stronger flare and 1300ms left-to-right light wave.
  window.addEventListener('oceans:aurora-focus', (event) => {
    if (typeof event.detail?.active !== 'boolean' || !shouldAnimate()) return;
    focused = event.detail.active;
  });
  window.addEventListener('oceans:aurora-pulse', () => {
    if (!shouldAnimate()) return;
    pulseStart = performance.now();
    energy = Math.max(energy, 1.35);
  });
  window.addEventListener('oceans:aurora-remember', () => {
    try {
      const now = performance.now();
      const elapsed = pulseStart ? now - pulseStart : -1;
      sessionStorage.setItem('oceans-sky-transfer', JSON.stringify({
        time,
        energy,
        pulseElapsed: elapsed >= 0 && elapsed <= 1300 ? elapsed : -1,
        gate: gate && gate.state !== 'opening' ? { origin: gate.origin, bounds: gate.bounds } : null,
        writtenAt: Date.now()
      }));
    } catch (_) { /* Navigation remains available without storage. */ }
  });
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
      // History restoration exposes the already-loaded view immediately.
      resetGate();
    }
    synchronize();
  });
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 120);
  }).observe(scene);

  initializeGL();
  if (gl && enabled && !reduced.matches && !transfer && document.body.dataset.world === 'home'
    && document.visibilityState === 'visible') {
    introStart = performance.now();
    energy = 0;
    canvas.dataset.skyIntro = 'playing';
  }
  resize();
  // Navigation borrows the actual sky renderer; it does not add another canvas
  // or animation clock. The compositor mask uses the same source-app ease.
  window.auroraPassage = {
    get ready() { return !!shouldAnimate(); },
    get arrival() { return gateArrival; },
    close(value) {
      const config = gateConfig(value);
      if (!config || !shouldAnimate()) return false;
      finishIntro();
      gateArrival = null;
      gate = { ...config, state: 'closing', from: gateClosure, to: 1, startedAt: performance.now(), duration: clamp(Number(value.duration) || 400, 100, 1000) };
      gateStatus('closing');
      draw(gate.startedAt);
      return true;
    },
    open(value) {
      const config = gateConfig(value) || gateArrival;
      if (!config || !shouldAnimate()) { resetGate(); draw(); return false; }
      gateArrival = null;
      gateClosure = 1;
      gate = { ...config, state: 'opening', from: 1, to: 0, startedAt: performance.now(), duration: clamp(Number(value?.duration) || 520, 100, 1000) };
      gateStatus('opening');
      draw(gate.startedAt);
      return true;
    },
    reset() { resetGate(); draw(); }
  };
})();
