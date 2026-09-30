(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const world = document.body.dataset.world;
  const create = (tag, value, cls) => { const e = document.createElement(tag); if (value) e.textContent = value; if (cls) e.className = cls; return e; };
  function closeDownload() { if ($('hit').open) $('hit').close(); }
  function askFiles(files, label) {
    $('hitS').textContent = label;
    $('downloadChoices').replaceChildren();
    files.forEach((file, i) => {
      const a = create('a', file.name || (files.length > 1 ? `Part ${i + 1} · ${file.size}` : `Download · ${file.size}`), 'dialog-action');
      a.href = file.url;
      if (file.direct === false) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      else a.setAttribute('download', '');
      $('downloadChoices').append(a);
    });
    if (!$('hit').open) $('hit').showModal();
  }
  const askFile = (file, label) => askFiles([file], label);
  window.archive = {closeDownload, askFile};
  $('hitNo').addEventListener('click', closeDownload);
  document.querySelectorAll('[data-download-episode]').forEach(b => b.addEventListener('click', () => {
    const s = Number(b.dataset.season), ep = EPISODES[s].find(e => e.ep === Number(b.dataset.downloadEpisode));
    askFiles(ep.parts || [ep], `Six / Season ${s} / Episode ${ep.ep}`);
  }));
  document.querySelectorAll('[data-preview]').forEach(b => b.addEventListener('click', () => window.archive.openPreview(Number(b.dataset.season), Number(b.dataset.episode), 1, b)));
  document.querySelectorAll('[data-download-pack]').forEach(b => b.addEventListener('click', () => {
    const p = COD_PACKS.find(p => p.id === b.dataset.downloadPack); askFiles(p.files, p.title + ' / ' + p.chapter);
  }));
  const notes=world==='six'?['Joe Graves scene packs, cut directly from the Blu-ray.','1920 × 1080 · 24 fps · H.264 / AAC.','Episode 5 of season 1 is split into two parts. The first or last frame may occasionally belong to the adjacent scene.']:[
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
