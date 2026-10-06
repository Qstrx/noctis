(function(){
"use strict";
var preview = document.getElementById("preview");
var previewVideo = document.getElementById("previewVideo");
var previewState = document.getElementById("previewState");
var previewError = document.getElementById("previewError");
var previewList = document.getElementById("previewList");
var previewParts = document.getElementById("previewParts");
var previewFeedback = document.getElementById("previewFeedback");
var previewLink = document.getElementById("previewLink");
var previewSpeed = document.getElementById("previewSpeed");
var previewTime = document.getElementById("previewTime");
var previewPrevious = document.getElementById("previewPrevious");
var previewNext = document.getElementById("previewNext");
var previewReadyControls = ["previewBack", "previewForward", "previewTime", "previewJump", "previewShare"];
var previewFiles = [], previewIndex = -1, previewOpener = null, previewLoad = 0;
var previewTarget = 0, previewTimer = null, previewPendingLink = null;
function padEpisode(n){ return String(n).padStart(2, "0"); }
function episodeText(value){
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
Object.keys(EPISODES).forEach(function(s){
  EPISODES[s].forEach(function(ep){
    (ep.parts || [ep]).forEach(function(file){
      if (file.url) previewFiles.push({season:Number(s), ep:ep.ep, part:file.part || 1, entry:ep, file:file});
    });
  });
});
function previewControls(ready){
  previewReadyControls.forEach(function(id){ document.getElementById(id).disabled = !ready; });
}
function previewStatus(message){
  if (!preview.open) return;
  previewState.textContent = message;
  previewState.hidden = !message;
}
function previewFailed(){
  if (!preview.open || previewIndex < 0) return;
  clearTimeout(previewTimer);
  previewStatus("");
  previewError.hidden = false;
  previewControls(false);
}
function alignPreviewSelection(){
  var id = previewLoad;
  requestAnimationFrame(function(){
    if (!preview.open || id !== previewLoad) return;
    var selected = previewList.querySelector('[aria-current="true"]');
    if (!selected){ previewList.scrollLeft = 0; previewList.scrollTop = 0; return; }
    var rail = previewList.getBoundingClientRect(), card = selected.getBoundingClientRect();
    if (getComputedStyle(previewList).display === "flex"){
      previewList.scrollLeft += card.left - rail.left - (previewList.clientWidth - card.width) / 2;
    } else {
      previewList.scrollTop += card.top - rail.top - (previewList.clientHeight - card.height) / 2;
    }
  });
}
function drawPreviewList(season){
  var current = previewFiles[previewIndex];
  preview.querySelectorAll("[data-preview-season]").forEach(function(button){
    button.setAttribute("aria-pressed", String(Number(button.dataset.previewSeason) === season));
  });
  previewList.setAttribute("aria-label", "Joe Graves scene packs from season " + season);
  previewList.innerHTML = EPISODES[season].map(function(ep){
    var selected = current && current.season === season && current.ep === ep.ep;
    return '<li><button type="button" class="preview-episode" data-preview-ep="' + ep.ep +
      '" data-season="' + season + '"' + (selected ? ' aria-current="true"' : '') +
      ' aria-label="Preview Joe Graves scenes from season ' + season + ', episode ' + ep.ep + ', ' + episodeText(ep.title) + '">' +
      '<img src="' + SHOTS[season] + padEpisode(ep.ep) + '.jpg" width="140" height="79" alt="" loading="lazy">' +
      '<span><strong>' + episodeText(ep.title) + '</strong><small>From episode ' + padEpisode(ep.ep) + ' · ' + ep.run +
      (ep.parts ? ' · 2 parts' : '') + '</small></span></button></li>';
  }).join("");
  alignPreviewSelection();
}
function loadPreview(index, time){
  if (index < 0 || index >= previewFiles.length) return;
  var focusWasInsideList = previewList.contains(document.activeElement);
  var focusWasInsideParts = previewParts.contains(document.activeElement);
  previewIndex = index;
  var current = previewFiles[index], id = ++previewLoad;
  clearTimeout(previewTimer);
  previewVideo.pause();
  previewVideo.removeAttribute("src");
  previewVideo.replaceChildren();
  previewControls(false);
  previewTarget = Math.max(0, Number(time) || 0);
  previewTime.value = "";
  previewTime.removeAttribute("aria-invalid");
  previewFeedback.textContent = "";
  previewLink.hidden = true;
  previewError.hidden = true;
  document.getElementById("previewTitle").textContent = "Joe Graves — " + current.entry.title;
  document.getElementById("previewMeta").textContent = "From season " + padEpisode(current.season) + ", episode " + padEpisode(current.ep) + " · " + current.file.run + " · 1080p" +
    (current.entry.parts ? " · Part " + current.part + " of " + current.entry.parts.length : "");
  document.getElementById("previewDownload").innerHTML = "<span>Download ↓</span><small>" + current.file.size + "</small>";
  document.getElementById("previewDownload").setAttribute("aria-label", "Download Joe Graves scenes from season " + current.season + ", episode " + current.ep + ", " + current.entry.title +
    (current.entry.parts ? ", part " + current.part : ""));
  previewVideo.poster = SHOTS[current.season] + padEpisode(current.ep) + ".jpg";
  previewVideo.setAttribute("aria-label", "Joe Graves scenes from season " + current.season + ", episode " + current.ep + ", " + current.entry.title +
    (current.entry.parts ? ", part " + current.part : ""));
  previewParts.hidden = !current.entry.parts;
  previewParts.innerHTML = (current.entry.parts || []).map(function(part){
    return '<button type="button" data-preview-part="' + part.part + '" aria-pressed="' +
      (part.part === current.part) + '">Part ' + part.part + ' · ' + part.run + '</button>';
  }).join("");
  previewPrevious.disabled = index === 0;
  previewNext.disabled = index === previewFiles.length - 1;
  drawPreviewList(current.season);
  if (focusWasInsideList) previewList.querySelector('[aria-current="true"]').focus({preventScroll:true});
  if (focusWasInsideParts){
    var selectedPart = previewParts.querySelector('[aria-pressed="true"]');
    if (selectedPart) selectedPart.focus({preventScroll:true});
  }
  if (window.archiveMotion) window.archiveMotion.sceneChange(preview);
  previewStatus("Loading preview…");
  previewVideo.preload = "metadata";
  var source = document.createElement("source");
  source.type = "video/mp4";
  source.src = current.file.url;
  source.addEventListener("error", function(){ if (id === previewLoad) previewFailed(); });
  previewVideo.appendChild(source);
  previewVideo.load();
  previewVideo.playbackRate = Number(previewSpeed.value);
  previewTimer = setTimeout(function(){
    if (id === previewLoad && previewVideo.readyState < 3 && previewError.hidden)
      previewStatus("Still loading. Original-quality video may take a little longer.");
  }, 15000);
  var play = previewVideo.play();
  if (play) play.catch(function(error){
    if (id !== previewLoad || !preview.open) return;
    if (error.name === "NotAllowedError") previewStatus("Press play to start the preview.");
    else if (error.name !== "AbortError") previewFailed();
  });
}
function openPreview(season, episode, part, opener, time){
  var index = previewFiles.findIndex(function(item){
    return item.season === Number(season) && item.ep === Number(episode) && item.part === (Number(part) || 1);
  });
  if (index < 0) return;
  if (!preview.open){
    previewOpener = opener || document.querySelector('[data-preview][data-season="' + season + '"][data-episode="' + episode + '"]');
    window.archive.closeDownload();
    preview.showModal();
    document.body.classList.add("preview-open");

  }
  loadPreview(index, time);
}
function releasePreview(){
  ++previewLoad;
  clearTimeout(previewTimer);
  previewVideo.pause();
  previewVideo.removeAttribute("src");
  previewVideo.replaceChildren();
  previewVideo.preload = "none";
  previewVideo.load();
  previewIndex = -1;
  document.body.classList.remove("preview-open");
  // A closed scene no longer belongs in the address: reloading stays closed,
  // and opening the same shared link again fires a new hashchange.
  if (/^#preview=/.test(location.hash)) history.replaceState(history.state, "", location.pathname + location.search);
  if (previewOpener && previewOpener.isConnected) previewOpener.focus({preventScroll:true});
}
function closePreview(){ if (preview.open) preview.close(); }
preview.addEventListener("close", releasePreview);
document.getElementById("previewClose").addEventListener("click", closePreview);
preview.addEventListener("click", function(event){
  if (event.target !== preview) return;
  var rect = preview.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closePreview();
});
preview.addEventListener("keydown", function(event){
  if (event.key !== "Tab") return;
  var controls = [].slice.call(preview.querySelectorAll("button:not(:disabled), input:not(:disabled), select, video[controls]"))
    .filter(function(control){ return control.getClientRects().length > 0; });
  var first = controls[0], last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first){ event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last){ event.preventDefault(); first.focus(); }
});
function revealPreviewForTouch(event){
  if (event.detail && matchMedia("(max-width:800px), (max-width:1000px) and (max-height:500px)").matches)
    preview.scrollTop = 0;
}
previewList.addEventListener("click", function(event){
  var button = event.target.closest("[data-preview-ep]");
  if (button){ openPreview(button.dataset.season, button.dataset.previewEp, 1); revealPreviewForTouch(event); }
});
preview.querySelectorAll("[data-preview-season]").forEach(function(button){
  button.addEventListener("click", function(){ drawPreviewList(Number(button.dataset.previewSeason)); });
});
previewParts.addEventListener("click", function(event){
  var button = event.target.closest("[data-preview-part]"), current = previewFiles[previewIndex];
  if (button && current) openPreview(current.season, current.ep, button.dataset.previewPart);
});
previewPrevious.addEventListener("click", function(event){ loadPreview(previewIndex - 1); revealPreviewForTouch(event); });
previewNext.addEventListener("click", function(event){ loadPreview(previewIndex + 1); revealPreviewForTouch(event); });
document.getElementById("previewRetry").addEventListener("click", function(){ loadPreview(previewIndex, previewTarget || previewVideo.currentTime); });
previewVideo.addEventListener("loadedmetadata", function(){
  if (!preview.open || previewIndex < 0 || !Number.isFinite(previewVideo.duration)) return;
  previewControls(true);
  previewVideo.playbackRate = Number(previewSpeed.value);
  if (previewTarget){
    previewVideo.currentTime = Math.min(previewTarget, Math.max(0, previewVideo.duration - 0.1));
    previewTarget = 0;
  }
  if (previewVideo.paused) previewStatus("Press play to explore the scene pack.");
});
previewVideo.addEventListener("playing", function(){ clearTimeout(previewTimer); previewStatus(""); });
previewVideo.addEventListener("waiting", function(){ if (previewError.hidden) previewStatus("Buffering…"); });
previewVideo.addEventListener("seeking", function(){ if (previewError.hidden) previewStatus("Finding your scene…"); });
previewVideo.addEventListener("seeked", function(){ previewStatus(""); });
previewVideo.addEventListener("canplay", function(){ clearTimeout(previewTimer); previewStatus(""); });
previewVideo.addEventListener("error", previewFailed);
previewSpeed.addEventListener("change", function(){ previewVideo.playbackRate = Number(previewSpeed.value); });
function seekPreview(time){
  if (!Number.isFinite(previewVideo.duration)) return;
  previewVideo.currentTime = Math.max(0, Math.min(time, Math.max(0, previewVideo.duration - 0.1)));
}
document.getElementById("previewBack").addEventListener("click", function(){ seekPreview(previewVideo.currentTime - 10); });
document.getElementById("previewForward").addEventListener("click", function(){ seekPreview(previewVideo.currentTime + 10); });
function jumpPreview(){
  var value = previewTime.value.trim(), match = /^(\d{1,4}):([0-5]\d)$/.exec(value);
  var seconds = match ? Number(match[1]) * 60 + Number(match[2]) : /^\d{1,6}$/.test(value) ? Number(value) : NaN;
  if (!Number.isFinite(seconds) || !Number.isFinite(previewVideo.duration) || seconds >= previewVideo.duration){
    previewTime.setAttribute("aria-invalid", "true");
    previewFeedback.textContent = "Enter a time within this part, such as 02:30, or a number of seconds.";
    return;
  }
  previewTime.removeAttribute("aria-invalid");
  previewFeedback.textContent = "";
  seekPreview(seconds);
  if (matchMedia("(pointer:coarse)").matches) previewTime.blur();
}
document.getElementById("previewJump").addEventListener("click", jumpPreview);
previewTime.addEventListener("keydown", function(event){ if (event.key === "Enter"){ event.preventDefault(); jumpPreview(); } });
document.getElementById("previewShare").addEventListener("click", function(){
  var current = previewFiles[previewIndex];
  if (!current) return;
  var url = new URL(location.href), id = previewLoad;
  url.hash = "preview=s" + current.season + "-e" + padEpisode(current.ep) + "-p" + current.part + "&t=" + Math.floor(previewVideo.currentTime || 0);
  function reveal(){
    if (!preview.open || id !== previewLoad) return;
    previewLink.value = url.href;
    previewLink.hidden = false;
    previewLink.focus();
    previewLink.select();
    previewFeedback.textContent = "Copy this link to share the scene at this time.";
  }
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(url.href).then(function(){
      if (preview.open && id === previewLoad) previewFeedback.textContent = "Scene link copied, including this timestamp.";
    }, reveal);
  } else reveal();
});
document.getElementById("previewDownload").addEventListener("click", function(){
  var current = previewFiles[previewIndex];
  if (!current) return;
  closePreview();
  window.archive.askFile(current.file, 'Joe Graves / Season ' + current.season + ' / From episode ' + padEpisode(current.ep) + ' — ' + current.entry.title + (current.entry.parts ? ' / Part ' + current.part : ''), previewOpener);
});
function readPreviewLink(){
  var params = new URLSearchParams(location.hash.slice(1));
  var match = /^s([12])-e(\d{2})-p([12])$/.exec(params.get("preview") || "");
  var seconds = params.get("t") || "0";
  if (!match || !/^\d{1,6}$/.test(seconds)) return null;
  var valid = previewFiles.some(function(item){ return item.season === Number(match[1]) && item.ep === Number(match[2]) && item.part === Number(match[3]); });
  return valid ? {season:Number(match[1]), ep:Number(match[2]), part:Number(match[3]), time:Number(seconds)} : null;
}
function openPendingPreview(){
  if (!previewPendingLink) return;
  var link = previewPendingLink;
  previewPendingLink = null;
  openPreview(link.season, link.ep, link.part, null, link.time);
}
previewPendingLink = readPreviewLink();
addEventListener("hashchange", function(){
  previewPendingLink = readPreviewLink();
  openPendingPreview();
});
document.addEventListener("visibilitychange", function(){ if (document.hidden && preview.open) previewVideo.pause(); });



window.archive.openPreview=openPreview;
addEventListener("resize",function(){if(preview.open)alignPreviewSelection();},{passive:true});
openPendingPreview();
})();
