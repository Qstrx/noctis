var REL1 = "https://github.com/Qstrx/noctis/releases/download/six-s1/";
var REL2 = "https://github.com/Qstrx/noctis/releases/download/six-s2/";



var SHOTS = { 1: "img/six/s1-e", 2: "img/six/s2-e" };

var EPISODES = {


  1: [
    { ep:1, title:"Pilot",  run:"14:01", size:"1.82 GB", url:REL1+"Six-S1-E01.mp4" },
    { ep:2, title:"Her Name is Esther",  run:"14:05", size:"1.83 GB", url:REL1+"Six-S1-E02.mp4" },
    { ep:3, title:"Tour of Duty",  run:"10:57", size:"1.83 GB", url:REL1+"Six-S1-E03.mp4" },
    { ep:4, title:"Man Down",  run:"11:19", size:"1.83 GB", url:REL1+"Six-S1-E04.mp4" },
    { ep:5, title:"Collateral",  run:"19:19", size:"3.65 GB", parts:[
      { part:1, run:"9:06",  size:"1.83 GB", url:REL1+"Six-S1-E05-Part1.mp4" },
      { part:2, run:"10:13", size:"1.82 GB", url:REL1+"Six-S1-E05-Part2.mp4" }
    ] },
    { ep:6, title:"Confession",  run:"9:58",  size:"1.83 GB", url:REL1+"Six-S1-E06.mp4" },
    { ep:7, title:"Blood Brothers",  run:"7:19",  size:"1.36 GB", url:REL1+"Six-S1-E07.mp4" },
    { ep:8, title:"End Game",  run:"7:15",  size:"1.39 GB", url:REL1+"Six-S1-E08.mp4" }
  ],
  2: [
    { ep:1, title:"Critical",  run:"9:25",  size:"1.50 GB", url:REL2+"Six-S2-E01.mp4" },
    { ep:2, title:"Ghosts",  run:"11:35", size:"1.82 GB", url:REL2+"Six-S2-E02.mp4" },
    { ep:3, title:"Dua",  run:"7:48",  size:"1.30 GB", url:REL2+"Six-S2-E03.mp4" },
    { ep:4, title:"Seesaw",  run:"6:47",  size:"1.12 GB", url:REL2+"Six-S2-E04.mp4" },
    { ep:5, title:"Masks",  run:"5:13",  size:"0.87 GB", url:REL2+"Six-S2-E05.mp4" },
    { ep:6, title:"Indian Country",  run:"8:33",  size:"1.26 GB", url:REL2+"Six-S2-E06.mp4" },
    { ep:7, title:"FUBAR",  run:"8:06",  size:"1.24 GB", url:REL2+"Six-S2-E07.mp4" },
    { ep:8, title:"Scorpions in a Bottle",  run:"6:57",  size:"1.24 GB", url:REL2+"Six-S2-E08.mp4" },
    { ep:9, title:"The Reckoning",  run:"8:05",  size:"1.35 GB", url:REL2+"Six-S2-E09.mp4" },
    { ep:10, title:"Danger Close", run:"14:51", size:"1.83 GB", url:REL2+"Six-S2-E10.mp4" }
  ]
};


var COD_PACKS = [
  {
    "id": "mw1",
    "collection": "cod",
    "group": "price",
    "title": "John Price",
    "chapter": "Modern Warfare",
    "poster": "img/cod/price-mw1.jpg",
    "meta": "7:34 · 1.95 GB · one file",
    "files": [
      {
        "url": "https://github.com/Qstrx/noctis/releases/download/cod-141/Price-MW1.mp4",
        "name": "MW1",
        "run": "7:34",
        "size": "1.95 GB",
        "direct": true
      }
    ],
    "fps": "30 FPS",
    "resolution": "3840 × 1634",
    "count": "01 file"
  },
  {
    "id": "mw2",
    "collection": "cod",
    "group": "price",
    "title": "John Price",
    "chapter": "Modern Warfare II",
    "poster": "img/cod/price-mw2.jpg",
    "meta": "9:31 · 1.94 GB · one file",
    "files": [
      {
        "url": "https://github.com/Qstrx/noctis/releases/download/cod-141/Price-MW2.mp4",
        "name": "MW2",
        "run": "9:31",
        "size": "1.94 GB",
        "direct": true
      }
    ],
    "fps": "30 FPS",
    "resolution": "3840 × 1634",
    "count": "01 file"
  },
  {
    "id": "mw3",
    "collection": "cod",
    "group": "price",
    "title": "John Price",
    "chapter": "Modern Warfare III",
    "poster": "img/cod/price-mw3.jpg",
    "meta": "15:27 · 1.94 GB · one file",
    "files": [
      {
        "url": "https://github.com/Qstrx/noctis/releases/download/cod-141/Price-MW3.mp4",
        "name": "MW3",
        "run": "15:27",
        "size": "1.94 GB",
        "direct": true
      }
    ],
    "fps": "30 FPS",
    "resolution": "3840 × 1634",
    "count": "01 file"
  },
  {
    "id": "cuts1",
    "collection": "cod",
    "group": "cutscenes",
    "title": "Campaign cutscenes",
    "chapter": "Modern Warfare",
    "poster": "img/cod/cuts-mw1.jpg",
    "meta": "59:15 · 4.51 GB · on Google Drive",
    "files": [
      {
        "url": "https://drive.google.com/file/d/1lP5NG8kCMl4PpKJKyOi3KVMiDZNnuBlP/view",
        "name": "MW1 cutscenes",
        "direct": false
      }
    ],
    "fps": "60 FPS",
    "resolution": "2560 × 1440",
    "count": "01 file"
  },
  {
    "id": "cuts2",
    "collection": "cod",
    "group": "cutscenes",
    "title": "Campaign cutscenes",
    "chapter": "Modern Warfare II",
    "poster": "img/cod/cuts-mw2.jpg",
    "meta": "38:36 · 3.67 GB · on Google Drive",
    "files": [
      {
        "url": "https://drive.google.com/file/d/1oxg2-HFapdZli2YJaZ5iuyn9fHFd7gJu/view",
        "name": "MW2 cutscenes",
        "direct": false
      }
    ],
    "fps": "60 FPS",
    "resolution": "2560 × 1440",
    "count": "01 file"
  },
  {
    "id": "cuts3",
    "collection": "cod",
    "group": "cutscenes",
    "title": "Campaign cutscenes",
    "chapter": "Modern Warfare III",
    "poster": "img/cod/cuts-mw3.jpg",
    "meta": "1:14:44 · 5.73 GB · on Google Drive",
    "files": [
      {
        "url": "https://drive.google.com/file/d/1ALgxOjOu_UF4f5RGsHnBsxDVpRm510zu/view",
        "name": "MW3 cutscenes",
        "direct": false
      }
    ],
    "fps": "60 FPS",
    "resolution": "2560 × 1440",
    "count": "01 file"
  },
  {
    "id": "mw4-trailer-1",
    "collection": "cod",
    "group": "trailers",
    "title": "Modern Warfare 4",
    "chapter": "Trailer 1 — Reveal Trailer",
    "poster": "img/cod/mw4-trailer-1.jpg",
    "meta": "2:49 · 448.3 MB · one file",
    "files": [{ "url": "https://github.com/Qstrx/noctis/releases/download/mw4-trailers/mw4-trailer-1.mp4", "name": "Trailer 1", "run": "2:49", "size": "448.3 MB", "direct": true }],
    "fps": "~60 FPS",
    "resolution": "3840 × 1634",
    "releaseDate": "2026-05-28",
    "source": "https://www.callofduty.com/uk/en/blog/2026/05/modernwarfare4-fob",
    "count": "01 file"
  },
  {
    "id": "mw4-trailer-2",
    "collection": "cod",
    "group": "trailers",
    "title": "Modern Warfare 4",
    "chapter": "Trailer 2 — Campaign First Look: Traffic",
    "poster": "img/cod/mw4-trailer-2.jpg",
    "meta": "0:30 · 128.4 MB · one file",
    "files": [{ "url": "https://github.com/Qstrx/noctis/releases/download/mw4-trailers/mw4-trailer-2.mp4", "name": "Trailer 2", "run": "0:30", "size": "128.4 MB", "direct": true }],
    "fps": "~60 FPS",
    "resolution": "3840 × 2160",
    "releaseDate": "2026-08-11",
    "source": "https://www.youtube.com/watch?v=BrNglFVnMMw",
    "count": "01 file"
  },
  {
    "id": "mw4-trailer-3",
    "collection": "cod",
    "group": "trailers",
    "title": "Modern Warfare 4",
    "chapter": "Trailer 3 — Campaign Trailer",
    "poster": "img/cod/mw4-trailer-3.jpg",
    "meta": "2:32 · 307.4 MB · one file",
    "files": [{ "url": "https://github.com/Qstrx/noctis/releases/download/mw4-trailers/mw4-trailer-3.mp4", "name": "Trailer 3", "run": "2:32", "size": "307.4 MB", "direct": true }],
    "fps": "~60 FPS",
    "resolution": "3840 × 1606",
    "releaseDate": "2026-09-17",
    "source": "https://www.callofduty.com/blog/2026/09/call-of-duty-modern-warfare-4-tokyo-games-show-campaign-trailer",
    "count": "01 file"
  },
  {"id":"ghost-mw2","collection":"cod","group":"ghost","title":"Ghost","chapter":"Modern Warfare II","poster":"img/cod/ghost-mw2.jpg","meta":"7:16 · 1.94 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/cod-141/Ghost-MW2.mp4","name":"Ghost MW2","run":"7:16","size":"1.94 GB","direct":true}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file"},
  {"id":"ghost-mw3","collection":"cod","group":"ghost","title":"Ghost","chapter":"Modern Warfare III","poster":"img/cod/ghost-mw3.jpg","meta":"4:37 · 1.95 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/cod-141/Ghost-MW3.mp4","name":"Ghost MW3","run":"4:37","size":"1.95 GB","direct":true}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file"},
  {"id":"soap-mw2","collection":"cod","group":"soap","title":"Soap","chapter":"Modern Warfare II","poster":"img/cod/soap-mw2.jpg","meta":"9:35 · 1.94 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/cod-141/Soap-MW2.mp4","name":"Soap MW2","run":"9:35","size":"1.94 GB","direct":true}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file"},
  {"id":"soap-mw3","collection":"cod","group":"soap","title":"Soap","chapter":"Modern Warfare III","poster":"img/cod/soap-mw3.jpg","meta":"7:38 · 1.95 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/cod-141/Soap-MW3.mp4","name":"Soap MW3","run":"7:38","size":"1.95 GB","direct":true}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file"},
  {"id":"soap-extra","collection":"cod","group":"soap","title":"Soap","chapter":"More clips","poster":"img/cod/soap-extra.jpg","meta":"1:00 · 444.7 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/cod-141/Soap-More-Clips.mp4","name":"Soap more clips","run":"1:00","size":"444.7 MB","direct":true}],"fps":"60 FPS","resolution":"3840 × 2160","count":"01 file"},
  {"id":"gaz-mw1","collection":"cod","group":"gaz","title":"Gaz","chapter":"Modern Warfare","poster":"img/cod/gaz-mw1.jpg","meta":"2:21 · 751.5 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/cod-141/Gaz-MW1.mp4","name":"Gaz MW1","run":"2:21","size":"751.5 MB","direct":true}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file"},
  {"id":"gaz-mw2","collection":"cod","group":"gaz","title":"Gaz","chapter":"Modern Warfare II","poster":"img/cod/gaz-mw2.jpg","meta":"5:34 · 1.95 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/cod-141/Gaz-MW2.mp4","name":"Gaz MW2","run":"5:34","size":"1.95 GB","direct":true}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file"},
  {"id":"gaz-mw3","collection":"cod","group":"gaz","title":"Gaz","chapter":"Modern Warfare III","poster":"img/cod/gaz-mw3.jpg","meta":"4:40 · 1.94 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/cod-141/Gaz-MW3.mp4","name":"Gaz MW3","run":"4:40","size":"1.94 GB","direct":true}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file"},
  {"id":"gaz-extra","collection":"cod","group":"gaz","title":"Gaz","chapter":"More clips","poster":"img/cod/gaz-extra.jpg","meta":"3:49 · 1.94 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/cod-141/Gaz-More-Clips.mp4","name":"Gaz more clips","run":"3:49","size":"1.94 GB","direct":true}],"fps":"60 FPS","resolution":"3840 × 2160","count":"01 file"},
  {"id":"price-mw4","collection":"cod","group":"price","title":"John Price","chapter":"Modern Warfare 4","poster":"img/cod/price-mw4.jpg","meta":"22:57 · 3.90 GB · two files","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-characters/John-Price-MW4-Part1.mp4","name":"MW4 part 1","run":"10:42","size":"1.95 GB","direct":true},{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-characters/John-Price-MW4-Part2.mp4","name":"MW4 part 2","run":"12:16","size":"1.95 GB","direct":true}],"fps":"60 FPS","resolution":"3840 × 1634","count":"02 files"},
  {"id":"gaz-mw4","collection":"cod","group":"gaz","title":"Gaz","chapter":"Modern Warfare 4","poster":"img/cod/gaz-mw4.jpg","meta":"3:46 · 1.95 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-characters/Gaz-MW4.mp4","name":"Gaz MW4","run":"3:46","size":"1.95 GB","direct":true}],"fps":"60 FPS","resolution":"3840 × 1634","count":"01 file"},
  {"id":"ghost-mw4","collection":"cod","group":"ghost","title":"Ghost","chapter":"Modern Warfare 4","poster":"img/cod/ghost-mw4.jpg","meta":"3:53 · 1.95 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-characters/Ghost-MW4.mp4","name":"Ghost MW4","run":"3:53","size":"1.95 GB","direct":true}],"fps":"60 FPS","resolution":"3840 × 1634","count":"01 file"},
  {"id":"valeria-mw4","collection":"cod","group":"valeria","title":"Valeria","chapter":"Modern Warfare 4","poster":"img/cod/valeria-mw4.jpg","meta":"10:14 · 1.95 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-characters/Valeria-MW4.mp4","name":"Valeria MW4","run":"10:14","size":"1.95 GB","direct":true}],"fps":"60 FPS","resolution":"3840 × 1634","count":"01 file"},
  {"id":"archer-mw4","collection":"cod","group":"archer","title":"The Archer","chapter":"Modern Warfare 4","poster":"img/cod/archer-mw4.jpg","meta":"6:32 · 1.95 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-characters/The-Archer-MW4.mp4","name":"The Archer MW4","run":"6:32","size":"1.95 GB","direct":true}],"fps":"60 FPS","resolution":"3840 × 1634","count":"01 file"},
  {"id":"gameplay-market","collection":"cod","group":"gameplay","title":"Modern Warfare 4 gameplay","chapter":"Market Scene","poster":"img/cod/gameplay-market.jpg","meta":"2:40 · 610.4 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-gameplay/MW4-Gameplay-Market-Scene.mp4","name":"Market Scene","run":"2:40","size":"610.4 MB","direct":true}],"fps":"60 FPS","resolution":"2560 × 1440","count":"01 file"},
  {"id":"gameplay-makarov","collection":"cod","group":"gameplay","title":"Modern Warfare 4 gameplay","chapter":"Makarov Chase","poster":"img/cod/gameplay-makarov.jpg","meta":"9:48 · 2.45 GB · two files","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-gameplay/MW4-Gameplay-Makarov-Chase-Part1.mp4","name":"Makarov Chase part 1","run":"4:55","size":"901.8 MB","direct":true},{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-gameplay/MW4-Gameplay-Makarov-Chase-Part2.mp4","name":"Makarov Chase part 2","run":"4:54","size":"1.54 GB","direct":true}],"fps":"60 FPS","resolution":"2560 × 1440","count":"02 files"},
  {"id":"gameplay-price-ghost","collection":"cod","group":"gameplay","title":"Modern Warfare 4 gameplay","chapter":"Price vs Ghost","poster":"img/cod/gameplay-price-ghost.jpg","meta":"7:50 · 1.68 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-gameplay/MW4-Gameplay-Price-vs-Ghost.mp4","name":"Price vs Ghost","run":"7:50","size":"1.68 GB","direct":true}],"fps":"60 FPS","resolution":"2560 × 1440","count":"01 file"},
  {"id":"gameplay-price-jail","collection":"cod","group":"gameplay","title":"Modern Warfare 4 gameplay","chapter":"Price Jail","poster":"img/cod/gameplay-price-jail.jpg","meta":"5:57 · 803.1 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-gameplay/MW4-Gameplay-Price-Jail.mp4","name":"Price Jail","run":"5:57","size":"803.1 MB","direct":true}],"fps":"60 FPS","resolution":"2560 × 1440","count":"01 file"},
  {"id":"gameplay-defector","collection":"cod","group":"gameplay","title":"Modern Warfare 4 gameplay","chapter":"Defector","poster":"img/cod/gameplay-defector.jpg","meta":"5:01 · 1.31 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-gameplay/MW4-Gameplay-Defector.mp4","name":"Defector","run":"5:01","size":"1.31 GB","direct":true}],"fps":"60 FPS","resolution":"2560 × 1440","count":"01 file"},
  {"id":"gameplay-graves-death","collection":"cod","group":"gameplay","title":"Modern Warfare 4 gameplay","chapter":"Graves Death","poster":"img/cod/gameplay-gravesdeath.jpg","meta":"4:16 · 798.3 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-gameplay/MW4-Gameplay-Graves-Death.mp4","name":"Graves Death","run":"4:16","size":"798.3 MB","direct":true}],"fps":"60 FPS","resolution":"2560 × 1440","count":"01 file"}
];
