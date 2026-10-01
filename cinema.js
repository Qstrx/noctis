(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const world = document.body.dataset.world || 'home';
  if(world!=='six' && /^#preview=s[12]-e\d{2}-p[12](?:&|$)/.test(location.hash)) { location.replace('six.html'+location.hash); return; }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let preference = null;
  try { preference = localStorage.getItem('oceans-motion'); } catch {}
  // The toggle is gone from the pages, so only the OS reduced-motion setting decides.
  let motion = !reduced.matches;
  let openingTimer, closingTimer, pendingFile = null;
  const create = (tag, value, cls) => { const e=document.createElement(tag); if(value)e.textContent=value;if(cls)e.className=cls;return e; };
  function rememberOpening() { try { sessionStorage.setItem('oceans-rift-intro-'+world,'seen'); } catch {} }
  function closeOpening(immediate=false) {
    clearTimeout(openingTimer);clearTimeout(closingTimer);
    const dialog=$('opening');
    if(!dialog.open)return;
    const finish=()=>{dialog.close();dialog.classList.remove('leaving');document.body.classList.remove('opening-active');rememberOpening();$('pageTitle')?.focus({preventScroll:true});};
    if(immediate||!motion){finish();return;}
    dialog.classList.add('leaving');closingTimer=setTimeout(finish,430);
  }
  function playOpening() {
    if(!motion)return;
    const dialog=$('opening');clearTimeout(openingTimer);clearTimeout(closingTimer);dialog.classList.remove('leaving');
    if(document.querySelector('dialog[open]'))return;
    document.body.classList.add('opening-active');dialog.showModal();
    openingTimer=setTimeout(()=>closeOpening(),world==='home'?2350:world==='cod'?3100:3400);
  }
  $('openingSkip')?.addEventListener('click',()=>closeOpening(true));
  $('opening')?.addEventListener('cancel',event=>{event.preventDefault();closeOpening(true);});
  document.querySelectorAll('.replay-intro').forEach(b=>b.addEventListener('click',playOpening));
  function setMotion(next,save=false){
    motion=next&&!reduced.matches;document.body.dataset.motion=motion?'on':'off';
    document.querySelectorAll('.motion-toggle').forEach(b=>b.setAttribute('aria-pressed',String(motion)));
    if($('motionLabel'))$('motionLabel').textContent=motion?'Motion on':'Motion off';
    if(save){preference=motion?'on':'off';try{localStorage.setItem('oceans-motion',preference);}catch{}}
    if(!motion)closeOpening(true);
    updateParticles();
  }
  document.querySelectorAll('.motion-toggle').forEach(b=>b.addEventListener('click',()=>setMotion(!motion,true)));
  reduced.addEventListener('change',()=>setMotion(!reduced.matches));
  // Cached fog sprites and depth-layered rain, rendered by one capped loop.
  const canvas=$('dust'), ctx=canvas?.getContext('2d');
  let frame=0,lastFrame=0,width=0,height=0,dpr=1,weatherTime=0;
  const rain=Array.from({length:world==='home'?165:95},()=>({x:Math.random(),y:Math.random(),depth:.2+Math.random()*.8,phase:Math.random()*6.28}));
  const motes=Array.from({length:world==='six'?20:42},()=>({x:Math.random(),y:Math.random(),depth:.4+Math.random(),phase:Math.random()*6.28}));
  const fog=document.createElement('canvas');fog.width=384;fog.height=192;
  const fogCtx=fog.getContext('2d');
  if(fogCtx){
    for(let i=0;i<42;i++){
      const x=35+Math.random()*314,y=58+Math.random()*76,r=18+Math.random()*45;
      const g=fogCtx.createRadialGradient(x,y,0,x,y,r);
      const rgb=world==='cod'?'185,177,159':'159,180,195';
      g.addColorStop(0,`rgba(${rgb},.11)`);g.addColorStop(.4,`rgba(${rgb},.055)`);g.addColorStop(1,`rgba(${rgb},0)`);
      fogCtx.fillStyle=g;fogCtx.fillRect(x-r,y-r,r*2,r*2);
    }
  }
  function sizeParticles(){
    if(!ctx)return;width=canvas.clientWidth||innerWidth;height=canvas.clientHeight||innerHeight;dpr=Math.min(devicePixelRatio||1,1.25);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);paintWeather();
  }
  function paintWeather(){
    if(!ctx||!width||!height)return;ctx.clearRect(0,0,width,height);
    if(fogCtx){
      ctx.globalCompositeOperation='screen';
      for(let i=0;i<7;i++){
        const size=width*(.42+(i%3)*.14),travel=((i*.27+weatherTime*(.012+i*.0015))%1.65)-.38;
        const x=travel*width-size*.25,y=height*(.2+(i%4)*.19)+Math.sin(weatherTime*.1+i)*height*.025;
        ctx.globalAlpha=(world==='home'?.48:.28)*(.75+Math.sin(weatherTime*.26+i)*.18);
        ctx.drawImage(fog,x,y,size,size*.35);
      }
    }
    ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
    const count=width<700?Math.ceil(rain.length*.62):rain.length;
    for(let i=0;i<count;i++){
      const p=rain[i],speed=.12+p.depth*.38;
      const y=((p.y+weatherTime*speed)%1.15-.08)*height;
      const x=((p.x-weatherTime*speed*.09)%1.1+1.1)%1.1*width-width*.05;
      const length=(6+p.depth*28)*(width<700?.7:1);
      ctx.strokeStyle=`rgba(190,208,216,${.045+p.depth*.14})`;ctx.lineWidth=.4+p.depth*.55;
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-length*.13,y+length);ctx.stroke();
    }
    motes.forEach(p=>{
      const x=(p.x+Math.sin(weatherTime*.12+p.phase)*.016)*(world==='home'?width*.48:width);
      const y=((p.y-weatherTime*.012*p.depth)%1+1)%1*height;
      ctx.fillStyle=world==='six'?`rgba(167,196,212,${.08+Math.sin(weatherTime+p.phase)**2*.18})`:`rgba(226,198,154,${.1+Math.sin(weatherTime*.65+p.phase)**2*.3})`;
      ctx.beginPath();ctx.arc(x,y,p.depth,0,Math.PI*2);ctx.fill();
    });
  }
  function canAnimate(){return motion&&!document.hidden&&!document.querySelector('.preview-dialog[open]');}
  function drawParticles(now){
    if(!canAnimate()){frame=0;return;}frame=requestAnimationFrame(drawParticles);if(now-lastFrame<33)return;
    weatherTime+=Math.min((now-lastFrame)/1000,.08);lastFrame=now;paintWeather();
  }
  function updateParticles(){
    if(!ctx)return;if(frame){cancelAnimationFrame(frame);frame=0;}
    if(canAnimate()){lastFrame=performance.now();frame=requestAnimationFrame(drawParticles);}else if(!document.hidden)paintWeather();
  }
  if(ctx){sizeParticles();addEventListener('resize',sizeParticles,{passive:true});}
  document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('document-hidden',document.hidden);updateParticles();});
  document.querySelectorAll('.preview-dialog').forEach(dialog=>{dialog.addEventListener('close',updateParticles);new MutationObserver(updateParticles).observe(dialog,{attributes:true,attributeFilter:['open']});});

  let pointerQueued=false,pointerX=.5,pointerY=.3;
  document.addEventListener('pointermove',event=>{if(!motion||event.pointerType==='touch')return;pointerX=event.clientX/innerWidth;pointerY=event.clientY/innerHeight;if(!pointerQueued){pointerQueued=true;requestAnimationFrame(()=>{pointerQueued=false;document.documentElement.style.setProperty('--pointer-x',`${pointerX*100}%`);document.documentElement.style.setProperty('--pointer-y',`${pointerY*100}%`);});}},{passive:true});
  setMotion(motion);
  let seen=false;try{seen=sessionStorage.getItem('oceans-rift-intro-'+world)==='seen';}catch{}
  if(!location.hash&&!seen)playOpening();
  if(world==='home')return;

  function closeDownload(){if($('hit').open)$('hit').close();pendingFile=null;}
  function askFile(file,label){pendingFile=file;$('hitS').textContent=label;$('downloadChoices').replaceChildren();$('hitGo').hidden=false;if(!$('hit').open)$('hit').showModal();$('hitGo').focus();}
  function startDownload(){
    if(!pendingFile)return;const file=pendingFile;
    if(file.direct===false)window.open(file.url,'_blank','noopener');
    else {const a=document.createElement('a');a.href=file.url;a.download='';a.rel='noopener';document.body.append(a);a.click();a.remove();}
    closeDownload();
  }
  function askFiles(files,label){
    if(files.length===1){const external=files[0].direct===false?' · opens '+(files[0].url.includes('mega.nz')?'Mega':'Google Drive'):'';askFile(files[0],label+external);return;}
    pendingFile=null;$('hitS').textContent=label;$('hitGo').hidden=true;$('downloadChoices').replaceChildren();
    files.forEach((file,index)=>{const b=create('button',file.name||`Part ${index+1} · ${file.size}`,'dialog-action');b.type='button';b.addEventListener('click',()=>{pendingFile=file;startDownload();});$('downloadChoices').append(b);});
    if(!$('hit').open)$('hit').showModal();
  }
  window.archive={closeDownload,askFile};
  $('hitNo').addEventListener('click',closeDownload);$('hitGo').addEventListener('click',startDownload);$('hit').addEventListener('close',()=>{pendingFile=null;});
  document.querySelectorAll('[data-download-episode]').forEach(b=>b.addEventListener('click',()=>{
    const s=Number(b.dataset.season),ep=EPISODES[s].find(e=>e.ep===Number(b.dataset.downloadEpisode));
    askFiles(ep.parts||[ep],`Six / Season ${String(s).padStart(2,'0')} / Episode ${String(ep.ep).padStart(2,'0')}`);
  }));
  document.querySelectorAll('[data-preview]').forEach(b=>b.addEventListener('click',()=>window.archive.openPreview(Number(b.dataset.season),Number(b.dataset.episode),1,b)));
  document.querySelectorAll('[data-download-pack]').forEach(b=>b.addEventListener('click',()=>{const p=COD_PACKS.find(p=>p.id===b.dataset.downloadPack);askFiles(p.files,p.title+' / '+p.chapter);}));
  const notes=world==='six'?['Joe Graves scene packs, cut directly from the Blu-ray.','1920 × 1080 · 24 fps · H.264 / AAC.','The first or last frame may occasionally belong to the adjacent scene.']:[
    'John Price scenes: 2560 × 1088 · 60 fps.','The black bars in MW1 preserve the original framing of taller 4K clips. Nothing is cropped or downscaled.','The full pack on Mega contains the same footage in one file. Separate packs avoid Mega’s free transfer limit.','Campaign cutscenes: 2560 × 1440 · 60 fps. Files open on Google Drive; use the download arrow on the file page.'];
  $('sourceText').replaceChildren(...notes.map(note=>create('p',note)));
  document.querySelectorAll('.source-open').forEach(b=>b.addEventListener('click',()=>$('sourceDialog').showModal()));
  $('sourceClose').addEventListener('click',()=>$('sourceDialog').close());
  ['sourceDialog','hit'].forEach(id=>$(id).addEventListener('click',event=>{if(event.target!==$(id))return;const r=$(id).getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)$(id).close();}));
  if(/FBAN|FBAV|FB_IAB|Instagram|Snapchat|Twitter|LinkedInApp|Line\/|MicroMessenger|Pinterest|Bytedance|musical_ly|TikTok|trill/i.test(navigator.userAgent||'')){
    $('iab').hidden=false;$('iabClose').addEventListener('click',()=>{$('iab').hidden=true;});$('iabCopy').addEventListener('click',()=>{const reveal=()=>{$('iabUrl').textContent=location.href;$('iabUrl').hidden=false;};if(navigator.clipboard)navigator.clipboard.writeText(location.href).then(reveal,reveal);else reveal();});
  }
  if(world!=='cod')return;
  const dialog=$('codPreview'),video=$('codVideo');let pack=null,part=0,opener=null,loadId=0,loadTimer;
  function codState(message){$('codPreviewState').textContent=message;$('codPreviewState').hidden=!message;}
  function loadPart(index){
    const restorePartFocus=$('codPreviewParts').contains(document.activeElement);
    part=index;const id=++loadId;clearTimeout(loadTimer);video.pause();video.removeAttribute('src');video.replaceChildren();$('codPreviewError').hidden=true;
    $('codPreviewTitle').textContent=pack.chapter;$('codPreviewMeta').textContent=pack.meta+(pack.files.length>1?` · Part ${part+1}`:'');video.poster=pack.poster;
    $('codPreviewParts').hidden=pack.files.length===1;$('codPreviewParts').replaceChildren();
    pack.files.forEach((file,i)=>{const b=create('button','Part '+(i+1));b.type='button';b.setAttribute('aria-pressed',String(i===part));b.addEventListener('click',()=>loadPart(i));$('codPreviewParts').append(b);});
    if(restorePartFocus)$('codPreviewParts').querySelector('[aria-pressed="true"]')?.focus({preventScroll:true});
    codState('Loading preview…');const source=document.createElement('source');source.src=pack.files[part].url;source.type='video/mp4';source.addEventListener('error',()=>{if(id===loadId){clearTimeout(loadTimer);codState('');$('codPreviewError').hidden=false;}});video.append(source);video.load();
    loadTimer=setTimeout(()=>{if(id===loadId&&video.readyState<3&&$('codPreviewError').hidden)codState('Still loading original-quality footage…');},15000);
    const playing=video.play();if(playing)playing.catch(error=>{if(id!==loadId)return;if(error.name==='NotAllowedError'){clearTimeout(loadTimer);codState('Press play to start.');}else if(error.name!=='AbortError'){clearTimeout(loadTimer);codState('');$('codPreviewError').hidden=false;}});
  }
  document.querySelectorAll('[data-cod-preview]').forEach(b=>b.addEventListener('click',()=>{pack=COD_PACKS.find(p=>p.id===b.dataset.codPreview);opener=b;dialog.showModal();loadPart(0);}));
  $('codPreviewClose').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{++loadId;clearTimeout(loadTimer);video.pause();video.removeAttribute('src');video.replaceChildren();video.load();if(opener?.isConnected)opener.focus({preventScroll:true});});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  $('codPreviewRetry').addEventListener('click',()=>loadPart(part));
  $('codPreviewDownload').addEventListener('click',()=>{const file=pack.files[part],label=pack.chapter+(pack.files.length>1?` / Part ${part+1}`:'');dialog.close();askFile(file,label);});
  video.addEventListener('playing',()=>{clearTimeout(loadTimer);codState('');});video.addEventListener('canplay',()=>{clearTimeout(loadTimer);codState('');});video.addEventListener('waiting',()=>{if($('codPreviewError').hidden)codState('Buffering…');});video.addEventListener('error',()=>{if(dialog.open){clearTimeout(loadTimer);codState('');$('codPreviewError').hidden=false;}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&dialog.open)video.pause();});
})();
