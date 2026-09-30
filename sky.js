/* Aurora shader adapted from AuroraGrab. See licenses/AuroraGrab.txt. */
(() => {
  'use strict';
  const canvas = document.getElementById('aurora');
  const button = document.querySelector('.motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  try { paused = localStorage.getItem('oceans-sky-paused') === 'true'; } catch {}
  let gl;
  try { gl = canvas.getContext('webgl', {alpha: false, antialias: false, depth: false, powerPreference: 'low-power'}); } catch {}
  if (!gl) return;
  const vertex = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fragment = [
    'precision highp float;',
    'uniform vec2 uRes;uniform float uTime;uniform float uEnergy;uniform float uPulse;uniform float uDawn;uniform vec2 uPar;uniform float uHorizon;',
    'uniform float uGain;uniform float uStorm;uniform float uDark;',
    'uniform float uPaint;uniform float uProg;uniform sampler2D uBar;',
    'uniform vec3 uPalA;uniform vec3 uPalB;uniform float uPalOn;',
    'float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
    'float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}',
    'float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}',
    'vec3 curtain(vec2 uv,float t,float seed,float base,float amp,float hgt,float bright,float x0,float x1){',
    '  float x=uv.x;',
    '  float env=smoothstep(x0,x0+.22,x)*(1.-smoothstep(x1-.22,x1,x));',
    '  if(env<=0.)return vec3(0.);',
    '  float edge=base-.05*uStorm+amp*(fbm(vec2(x*1.1+seed,t*.028+seed))-.5)+.05*sin(x*4.6+seed*3.+t*.14)+.016*(noise(vec2(x*38.+seed,t*.4))-.5);',
    '  float d=uv.y-edge;',
    '  if(d<-.08)return vec3(0.);',
    '  float rx=x*105.+7.*sin(x*5.+t*.18+seed)+d*18.+seed*50.;',
    '  float rays=noise(vec2(rx,t*.3))*.6+noise(vec2(rx*2.7,t*.47+3.))*.4;',
    '  rays=pow(rays,3.);',
    '  float along=smoothstep(.28-.18*uStorm,.78,fbm(vec2(x*2.6+seed*2.,t*.09)));',
    '  float h=hgt*(.45+1.1*fbm(vec2(x*1.7+seed*4.,t*.05)))*(1.+1.4*uStorm);',
    '  float up=exp(-max(d,0.)/h*2.7);',
    '  float lower=smoothstep(-.038-.03*rays,.014,d)*(.5+.5*smoothstep(.2,.8,noise(vec2(x*9.+seed,t*.2))));',
    '  float I=lower*up*(.12+1.75*rays)*along*env*bright;',
    '  float k=clamp(d/h,0.,1.);',
    '  vec3 cEdge=mix(vec3(.45,1.,.74),vec3(.5,.92,.84),uDawn);',
    '  vec3 cBody=mix(vec3(.2,.96,.58),vec3(.35,.82,.74),uDawn);',
    '  vec3 cTop=mix(vec3(.52,.34,1.),vec3(.72,.62,1.),uDawn);',
    '  cTop=mix(cTop,vec3(1.,.2,.42),uStorm*.9);',
    '  cBody=mix(cBody,uPalA,uPalOn);cEdge=mix(cEdge,mix(uPalA,vec3(1.),.4),uPalOn);cTop=mix(cTop,uPalB,uPalOn);',
    '  vec3 col=mix(cBody,cTop,smoothstep(.22-.12*uStorm,.95,k));',
    '  col=mix(cEdge,col,smoothstep(0.,.07,k));',
    '  if(uPaint>0.){',
    '    vec3 v=texture2D(uBar,vec2(clamp(x,.003,.997),.5)).rgb;',
    '    vec3 pc=mix(v*1.08,v*vec3(.7,.62,1.)+vec3(.05,.02,.12),smoothstep(.25,.95,k));',
    '    pc=mix(mix(v,vec3(1.),.42),pc,smoothstep(0.,.08,k));',
    '    float g=dot(col,vec3(.3,.5,.2));',
    '    vec3 un=vec3(g)*vec3(.68,.71,.8);',
    '    float dn=1.-smoothstep(uProg-.03,uProg+.004,x);',
    '    col=mix(col,mix(un,pc,dn),uPaint);',
    '    I*=mix(1.,mix(.6,1.25,dn),uPaint);',
    '  }',
    '  return col*I;',
    '}',
    'vec3 aurora(vec2 uv,float t){',
    '  vec3 a=curtain(uv,t,1.7,.56,.36,.22,1.15,-.25,1.25)+curtain(uv,t*.86,5.3,.68,.22,.14,.6,.35,1.3)+curtain(uv,t*1.12,9.1,.5,.18,.12,.4,-.3,.62);',
    '  if(uPulse>-.5)a*=1.+1.7*exp(-pow((uv.x-uPulse)/.065,2.));',
    '  a+=vec3(.85,.1,.24)*uStorm*.16*smoothstep(.5,1.,uv.y)*(.55+.45*fbm(vec2(uv.x*2.2+t*.015,uv.y*2.6)));',
    '  return a*(.28+1.1*uEnergy)*uGain;',
    '}',
    'vec3 skyCol(vec2 uv){',
    '  vec3 n=mix(vec3(.03,.1,.11),vec3(.01,.045,.075),smoothstep(.08,.5,uv.y));',
    '  n=mix(n,vec3(.003,.01,.03),smoothstep(.5,1.,uv.y));',
    '  n*=1.-.35*uDark;',
    '  float band=exp(-pow((uv.y-.78+(uv.x-.5)*.32)/.1,2.));',
    '  float mw=fbm(vec2(uv.x*4.+uv.y*2.,uv.y*3.));',
    '  n+=vec3(.045,.05,.075)*(1.+2.2*uDark)*band*smoothstep(.42-.12*uDark,.85,mw);',
    '  n+=vec3(.012,.05,.042)*(1.-.5*uDark)*exp(-max(uv.y-uHorizon,0.)/.11);',
    '  vec3 d=mix(vec3(.98,.86,.78),vec3(.86,.83,.92),smoothstep(.08,.45,uv.y));',
    '  d=mix(d,vec3(.62,.74,.9),smoothstep(.45,1.,uv.y));',
    '  return mix(n,d,uDawn);',
    '}',
    'void main(){',
    '  vec2 uv=gl_FragCoord.xy/uRes;',
    '  float t=uTime;',
    '  vec3 col;',
    '  if(uv.y>uHorizon){',
    '    vec3 a=aurora(uv+uPar,t);',
    '    vec3 s=skyCol(uv);',
    '    col=mix(1.-exp(-(s+a)*1.7),s*(1.-.18*min(a,1.))+a*.42,uDawn);',
    '  }else{',
    '    float wy=uHorizon-uv.y;',
    '    float rip=(noise(vec2(uv.x*18.,wy*140.-t*.6))-.5)*.012*(.4+wy*6.);',
    '    vec2 m=vec2(uv.x+rip,uHorizon+wy*4.6);',
    '    vec3 a=aurora(m+uPar,t);',
    '    vec3 s=skyCol(m);',
    '    col=mix((1.-exp(-(s+a)*1.7))*.5,(s*(1.-.18*min(a,1.))+a*.42)*.82,uDawn);',
    '    col*=.85+.15*smoothstep(0.,.02,wy);',
    '  }',
    '  gl_FragColor=vec4(col,1.);',
    '}',
  ].join('\n');
  const compile = (type, text) => { const s = gl.createShader(type); gl.shaderSource(s, text); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('Sky shader unavailable'); return s; };
  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex)); gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program); if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Sky unavailable');
  } catch { return; }
  gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const p = gl.getAttribLocation(program, 'p'); gl.enableVertexAttribArray(p); gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);
  const u = {};
  ['uRes','uTime','uEnergy','uPulse','uDawn','uPar','uHorizon','uGain','uStorm','uDark','uPaint','uProg','uPalA','uPalB','uPalOn','uBar'].forEach(k => u[k] = gl.getUniformLocation(program, k));
  const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([0,0,0]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.uniform1i(u.uBar, 0); gl.uniform1f(u.uHorizon, .1); gl.uniform1f(u.uEnergy, .3); gl.uniform1f(u.uPulse, -1);
  gl.uniform1f(u.uDawn, 0); gl.uniform1f(u.uGain, 1); gl.uniform1f(u.uStorm, 0); gl.uniform1f(u.uDark, .25);
  gl.uniform1f(u.uPaint, 0); gl.uniform1f(u.uProg, 0); gl.uniform1f(u.uPalOn, 0); gl.uniform2f(u.uPar, 0, 0);
  let frame = 0, last = 0, time = 40, lost = false;
  const moving = () => !paused && !reduced.matches && !document.hidden && !document.querySelector('dialog[open]') && !lost;
  function draw() { if (lost) return; gl.uniform1f(u.uTime, time); gl.drawArrays(gl.TRIANGLES, 0, 6); }
  function size() {
    if (lost) return;
    const scale = Math.min(devicePixelRatio || 1, 1.25) * (innerWidth < 700 ? .65 : .55);
    canvas.width = Math.round(canvas.clientWidth * scale); canvas.height = Math.round(canvas.clientHeight * scale);
    gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform2f(u.uRes, canvas.width, canvas.height); draw();
  }
  function tick(now) {
    if (!moving()) { frame = 0; return; }
    frame = requestAnimationFrame(tick);
    if (now - last < 66) return;
    time += Math.min((now-last)/1000, .12); last = now; draw();
  }
  function update() {
    if (frame) cancelAnimationFrame(frame); frame = 0;
    const still = paused || reduced.matches;
    document.body.dataset.motion = still ? 'off' : 'on';
    button.setAttribute('aria-pressed', String(still));
    button.setAttribute('aria-label', reduced.matches ? 'Background animation disabled by reduced-motion preference' : still ? 'Resume background animation' : 'Pause background animation');
    button.querySelector('.motion-label').textContent = still ? 'Still sky' : 'Pause sky';
    button.disabled = reduced.matches;
    if (moving()) { last = performance.now(); frame = requestAnimationFrame(tick); }
  }
  button.hidden = false; size(); canvas.classList.add('ready'); update();
  button.addEventListener('click', () => { paused = !paused; try { localStorage.setItem('oceans-sky-paused', String(paused)); } catch {} update(); });
  reduced.addEventListener('change', update); document.addEventListener('visibilitychange', update);
  new MutationObserver(update).observe(document.body, {subtree: true, attributes: true, attributeFilter: ['open']});
  let resizeFrame = 0;
  addEventListener('resize', () => { if (!resizeFrame) resizeFrame = requestAnimationFrame(() => { resizeFrame = 0; size(); }); }, {passive: true});
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); lost = true; canvas.classList.remove('ready'); update(); button.hidden = true; });
  canvas.addEventListener('webglcontextrestored', () => { canvas.classList.remove('ready'); button.hidden = true; });
})();
