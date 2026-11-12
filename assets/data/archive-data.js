var REL1 = "https://github.com/Qstrx/noctis/releases/download/six-s1/";
var REL2 = "https://github.com/Qstrx/noctis/releases/download/six-s2/";



var SHOTS = { 1: "assets/images/six/s1-e", 2: "assets/images/six/s2-e" };

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
  {"id":"mw1","collection":"cod","group":"price","title":"John Price","chapter":"Modern Warfare","poster":"assets/images/cod/price-mw1.jpg","meta":"22:26 · 1.94 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW1-4K.mp4","name":"MW1","run":"22:26","size":"1.94 GB","direct":true,"resolution":"3840 × 1634"}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"22:26 · 1.79 GB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW1-2K.mp4","name":"MW1","run":"22:26","size":"1.79 GB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"22:26 · 1.55 GB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW1-1080p.mp4","name":"MW1","run":"22:26","size":"1.55 GB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"mw2","collection":"cod","group":"price","title":"John Price","chapter":"Modern Warfare II","poster":"assets/images/cod/price-mw2.jpg","meta":"9:31 · 1.88 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW2-4K.mp4","name":"MW2","run":"9:31","size":"1.88 GB","direct":true,"resolution":"3840 × 1634"}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"9:31 · 1.75 GB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW2-2K.mp4","name":"MW2","run":"9:31","size":"1.75 GB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"9:31 · 1.45 GB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW2-1080p.mp4","name":"MW2","run":"9:31","size":"1.45 GB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"mw3","collection":"cod","group":"price","title":"John Price","chapter":"Modern Warfare III","poster":"assets/images/cod/price-mw3.jpg","meta":"15:27 · 1.91 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW3-4K.mp4","name":"MW3","run":"15:27","size":"1.91 GB","direct":true,"resolution":"3840 × 1634"}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"15:27 · 1.91 GB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW3-2K.mp4","name":"MW3","run":"15:27","size":"1.91 GB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"15:27 · 1.84 GB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW3-1080p.mp4","name":"MW3","run":"15:27","size":"1.84 GB","direct":true,"resolution":"1920 × 816"}]}}},
  {
    "id": "cuts1",
    "collection": "cod",
    "group": "cutscenes",
    "title": "Campaign cutscenes",
    "chapter": "Modern Warfare",
    "poster": "assets/images/cod/cuts-mw1.jpg",
    "meta": "29:56 · 4.14 GB · on Google Drive",
    "files": [
      {
        "url": "https://drive.google.com/file/d/1KIoVIZACKLsK_r3O-n5mFVwWyYAZ82R8/view",
        "name": "MW1 cutscenes",
        "direct": false
      }
    ],
    "fps": "30 FPS",
    "resolution": "3840 × 1634",
    "count": "01 file"
  },
  {
    "id": "cuts2",
    "collection": "cod",
    "group": "cutscenes",
    "title": "Campaign cutscenes",
    "chapter": "Modern Warfare II",
    "poster": "assets/images/cod/cuts-mw2.jpg",
    "meta": "41:26 · 5.74 GB · on Google Drive",
    "files": [
      {
        "url": "https://drive.google.com/file/d/1Af3usYrD51ijCPFDmdiSHi7KLD3TVHdq/view",
        "name": "MW2 cutscenes",
        "direct": false
      }
    ],
    "fps": "30 FPS",
    "resolution": "3840 × 1634",
    "count": "01 file"
  },
  {
    "id": "cuts3",
    "collection": "cod",
    "group": "cutscenes",
    "title": "Campaign cutscenes",
    "chapter": "Modern Warfare III",
    "poster": "assets/images/cod/cuts-mw3.jpg",
    "meta": "54:00 · 5.67 GB · on Google Drive",
    "files": [
      {
        "url": "https://drive.google.com/file/d/1iTuCPOnDDlZ5LggPpO0OS-k0KJ45W1Jx/view",
        "name": "MW3 cutscenes",
        "direct": false
      }
    ],
    "fps": "30 FPS",
    "resolution": "3840 × 1634",
    "count": "01 file"
  },
  {
    "id": "mw4-trailer-1",
    "collection": "cod",
    "group": "trailers",
    "title": "Modern Warfare 4",
    "chapter": "Trailer 1 — Reveal Trailer",
    "poster": "assets/images/cod/mw4-trailer-1.jpg",
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
    "poster": "assets/images/cod/mw4-trailer-2.jpg",
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
    "poster": "assets/images/cod/mw4-trailer-3.jpg",
    "meta": "2:32 · 307.4 MB · one file",
    "files": [{ "url": "https://github.com/Qstrx/noctis/releases/download/mw4-trailers/mw4-trailer-3.mp4", "name": "Trailer 3", "run": "2:32", "size": "307.4 MB", "direct": true }],
    "fps": "~60 FPS",
    "resolution": "3840 × 1606",
    "releaseDate": "2026-09-17",
    "source": "https://www.callofduty.com/blog/2026/09/call-of-duty-modern-warfare-4-tokyo-games-show-campaign-trailer",
    "count": "01 file"
  },
  {"id":"mw1-trailer-reveal-trailer","collection":"cod","group":"trailers","title":"Modern Warfare","chapter":"Reveal Trailer","poster":"assets/images/cod/trailers/mw1-trailer-reveal-trailer.jpg?v=2","meta":"1:52 · 335.9 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/campaign-trailers/MW1-Trailer-Reveal-Trailer.mp4","name":"Reveal Trailer","run":"1:52","size":"335.9 MB","direct":true}],"fps":"60 FPS","resolution":"3840 × 2160","count":"01 file"},
  {"id":"mw1-trailer-story-trailer","collection":"cod","group":"trailers","title":"Modern Warfare","chapter":"Story Trailer","poster":"assets/images/cod/trailers/mw1-trailer-story-trailer.jpg","meta":"2:25 · 295.5 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/campaign-trailers/MW1-Trailer-Story-Trailer.mp4","name":"Story Trailer","run":"2:25","size":"295.5 MB","direct":true}],"fps":"60 FPS","resolution":"3840 × 2160","count":"01 file"},
  {"id":"mw1-trailer-launch-gameplay-trailer","collection":"cod","group":"trailers","title":"Modern Warfare","chapter":"Launch Gameplay Trailer","poster":"assets/images/cod/trailers/mw1-trailer-launch-gameplay-trailer.jpg","meta":"1:10 · 197.6 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/campaign-trailers/MW1-Trailer-Launch-Gameplay-Trailer.mp4","name":"Launch Gameplay Trailer","run":"1:10","size":"197.6 MB","direct":true}],"fps":"60 FPS","resolution":"3840 × 1928","count":"01 file"},
  {"id":"mw2-trailer-ultimate-team","collection":"cod","group":"trailers","title":"Modern Warfare II","chapter":"Ultimate Team","poster":"assets/images/cod/trailers/mw2-trailer-ultimate-team.jpg","meta":"1:00 · 72.1 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/campaign-trailers/MW2-Trailer-Ultimate-Team.mp4","name":"Ultimate Team","run":"1:00","size":"72.1 MB","direct":true}],"fps":"24 FPS","resolution":"3840 × 2160","count":"01 file"},
  {"id":"mw2-trailer-worldwide-reveal","collection":"cod","group":"trailers","title":"Modern Warfare II","chapter":"Worldwide Reveal","poster":"assets/images/cod/trailers/mw2-trailer-worldwide-reveal.jpg","meta":"1:48 · 320.0 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/campaign-trailers/MW2-Trailer-Worldwide-Reveal.mp4","name":"Worldwide Reveal","run":"1:48","size":"320.0 MB","direct":true}],"fps":"60 FPS","resolution":"3840 × 1920","count":"01 file"},
  {"id":"mw2-trailer-campaign-early-access","collection":"cod","group":"trailers","title":"Modern Warfare II","chapter":"Campaign Early Access","poster":"assets/images/cod/trailers/mw2-trailer-campaign-early-access.jpg","meta":"0:30 · 112.9 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/campaign-trailers/MW2-Trailer-Campaign-Early-Access.mp4","name":"Campaign Early Access","run":"0:30","size":"112.9 MB","direct":true}],"fps":"60 FPS","resolution":"3840 × 2160","count":"01 file"},
  {"id":"mw2-trailer-launch-gameplay-trailer","collection":"cod","group":"trailers","title":"Modern Warfare II","chapter":"Launch Gameplay Trailer","poster":"assets/images/cod/trailers/mw2-trailer-launch-gameplay-trailer.jpg","meta":"1:15 · 258.0 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/campaign-trailers/MW2-Trailer-Launch-Gameplay-Trailer.mp4","name":"Launch Gameplay Trailer","run":"1:15","size":"258.0 MB","direct":true}],"fps":"60 FPS","resolution":"3840 × 2160","count":"01 file"},
  {"id":"mw3-trailer-makarov-reveal","collection":"cod","group":"trailers","title":"Modern Warfare III","chapter":"Makarov Reveal","poster":"assets/images/cod/trailers/mw3-trailer-makarov-reveal.jpg","meta":"1:49 · 164.8 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/campaign-trailers/MW3-Trailer-Makarov-Reveal.mp4","name":"Makarov Reveal","run":"1:49","size":"164.8 MB","direct":true}],"fps":"60 FPS","resolution":"3840 × 2160","count":"01 file"},
  {"id":"mw3-trailer-campaign-trailer","collection":"cod","group":"trailers","title":"Modern Warfare III","chapter":"Campaign Trailer","poster":"assets/images/cod/trailers/mw3-trailer-campaign-trailer.jpg","meta":"0:30 · 82.3 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/campaign-trailers/MW3-Trailer-Campaign-Trailer.mp4","name":"Campaign Trailer","run":"0:30","size":"82.3 MB","direct":true}],"fps":"60 FPS","resolution":"3840 × 2160","count":"01 file"},
  {"id":"mw3-trailer-pc-trailer","collection":"cod","group":"trailers","title":"Modern Warfare III","chapter":"PC Trailer","poster":"assets/images/cod/trailers/mw3-trailer-pc-trailer.jpg","meta":"1:07 · 264.7 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/campaign-trailers/MW3-Trailer-PC-Trailer.mp4","name":"PC Trailer","run":"1:07","size":"264.7 MB","direct":true}],"fps":"60 FPS","resolution":"3840 × 2160","count":"01 file"},
  {"id":"ghost-mw2","collection":"cod","group":"ghost","title":"Ghost","chapter":"Modern Warfare II","poster":"assets/images/cod/ghost-mw2.jpg","meta":"7:16 · 1.93 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Ghost-MW2-4K.mp4","name":"Ghost MW2","run":"7:16","size":"1.93 GB","direct":true,"resolution":"3840 × 1634"}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"7:16 · 1.61 GB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Ghost-MW2-2K.mp4","name":"Ghost MW2","run":"7:16","size":"1.61 GB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"7:16 · 1.08 GB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Ghost-MW2-1080p.mp4","name":"Ghost MW2","run":"7:16","size":"1.08 GB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"ghost-mw3","collection":"cod","group":"ghost","title":"Ghost","chapter":"Modern Warfare III","poster":"assets/images/cod/ghost-mw3.jpg","meta":"4:37 · 1.56 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Ghost-MW3-4K.mp4","name":"Ghost MW3","run":"4:37","size":"1.56 GB","direct":true,"resolution":"3840 × 1634"}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"4:37 · 1.17 GB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Ghost-MW3-2K.mp4","name":"Ghost MW3","run":"4:37","size":"1.17 GB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"4:37 · 631.7 MB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Ghost-MW3-1080p.mp4","name":"Ghost MW3","run":"4:37","size":"631.7 MB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"soap-mw2","collection":"cod","group":"soap","title":"Soap","chapter":"Modern Warfare II","poster":"assets/images/cod/soap-mw2.jpg","meta":"9:35 · 1.93 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Soap-MW2-4K.mp4","name":"Soap MW2","run":"9:35","size":"1.93 GB","direct":true,"resolution":"3840 × 1634"}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"9:35 · 1.66 GB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Soap-MW2-2K.mp4","name":"Soap MW2","run":"9:35","size":"1.66 GB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"9:35 · 1.19 GB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Soap-MW2-1080p.mp4","name":"Soap MW2","run":"9:35","size":"1.19 GB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"soap-mw3","collection":"cod","group":"soap","title":"Soap","chapter":"Modern Warfare III","poster":"assets/images/cod/soap-mw3.jpg","meta":"7:38 · 1.93 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Soap-MW3-4K.mp4","name":"Soap MW3","run":"7:38","size":"1.93 GB","direct":true,"resolution":"3840 × 1634"}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"7:38 · 1.75 GB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Soap-MW3-2K.mp4","name":"Soap MW3","run":"7:38","size":"1.75 GB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"7:38 · 1.01 GB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Soap-MW3-1080p.mp4","name":"Soap MW3","run":"7:38","size":"1.01 GB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"soap-extra","collection":"cod","group":"soap","title":"Soap","chapter":"More clips","poster":"assets/images/cod/soap-extra.jpg","meta":"1:00 · 444.7 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/cod-141/Soap-More-Clips.mp4","name":"Soap more clips","run":"1:00","size":"444.7 MB","direct":true}],"fps":"60 FPS","resolution":"3840 × 2160","count":"01 file"},
  {"id":"graves-mw2","collection":"cod","group":"graves","title":"Phillip Graves","chapter":"Modern Warfare II","poster":"assets/images/cod/graves-mw2.jpg?v=2","meta":"14:01 · 1.93 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Graves-MW2-4K.mp4","name":"MW2","run":"14:01","size":"1.93 GB","direct":true,"resolution":"3840 × 1634"}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"14:01 · 1.85 GB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Graves-MW2-2K.mp4","name":"MW2","run":"14:01","size":"1.85 GB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"14:01 · 1.75 GB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Graves-MW2-1080p.mp4","name":"MW2","run":"14:01","size":"1.75 GB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"graves-shadow-siege","collection":"cod","group":"graves","title":"Phillip Graves","chapter":"Shadow Siege","poster":"assets/images/cod/graves-shadow-siege.jpg","meta":"1:17 · 885.7 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Graves-MW2-Shadow-Siege-4K.mp4","name":"Graves Shadow Siege","run":"1:17","size":"885.7 MB","direct":true,"resolution":"3840 × 1634"}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"1:17 · 128.9 MB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Graves-MW2-Shadow-Siege-2K.mp4","name":"Graves Shadow Siege","run":"1:17","size":"128.9 MB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"1:17 · 79.9 MB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Graves-MW2-Shadow-Siege-1080p.mp4","name":"Graves Shadow Siege","run":"1:17","size":"79.9 MB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"graves-mw3","collection":"cod","group":"graves","title":"Phillip Graves","chapter":"Modern Warfare III","poster":"assets/images/cod/graves-mw3.jpg?v=2","meta":"5:35 · 1.86 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Graves-MW3-4K.mp4","name":"MW3","run":"5:35","size":"1.86 GB","direct":true,"resolution":"3840 × 1634"}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"5:35 · 1.41 GB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Graves-MW3-2K.mp4","name":"MW3","run":"5:35","size":"1.41 GB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"5:35 · 730.0 MB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Graves-MW3-1080p.mp4","name":"MW3","run":"5:35","size":"730.0 MB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"farah-mw1","collection":"cod","group":"farah","title":"Farah Karim","chapter":"Modern Warfare","poster":"assets/images/cod/farah-mw1.jpg","meta":"19:24 · 1.93 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Farah-MW1-4K.mp4","name":"MW1","run":"19:24","size":"1.93 GB","direct":true,"resolution":"3840 × 1634"}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"19:24 · 1.82 GB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Farah-MW1-2K.mp4","name":"MW1","run":"19:24","size":"1.82 GB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"19:24 · 1.50 GB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Farah-MW1-1080p.mp4","name":"MW1","run":"19:24","size":"1.50 GB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"farah-mw2","collection":"cod","group":"farah","title":"Farah Karim","chapter":"Modern Warfare II","poster":"assets/images/cod/farah-mw2.jpg","meta":"2:00 · 1.20 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Farah-MW2-4K.mp4","name":"MW2","run":"2:00","size":"1.20 GB","direct":true,"resolution":"3840 × 1634"}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"2:00 · 461.6 MB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Farah-MW2-2K.mp4","name":"MW2","run":"2:00","size":"461.6 MB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"2:00 · 276.4 MB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Farah-MW2-1080p.mp4","name":"MW2","run":"2:00","size":"276.4 MB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"farah-mw3","collection":"cod","group":"farah","title":"Farah Karim","chapter":"Modern Warfare III","poster":"assets/images/cod/farah-mw3.jpg","meta":"15:11 · 1.93 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Farah-MW3-4K.mp4","name":"MW3","run":"15:11","size":"1.93 GB","direct":true,"resolution":"3840 × 1634"}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"15:11 · 1.90 GB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Farah-MW3-2K.mp4","name":"MW3","run":"15:11","size":"1.90 GB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"15:11 · 1.84 GB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Farah-MW3-1080p.mp4","name":"MW3","run":"15:11","size":"1.84 GB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"gaz-mw1","collection":"cod","group":"gaz","title":"Gaz","chapter":"Modern Warfare","poster":"assets/images/cod/gaz-mw1.jpg","meta":"2:21 · 629.6 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Gaz-MW1-4K.mp4","name":"Gaz MW1","run":"2:21","size":"629.6 MB","direct":true,"resolution":"3840 × 1634"}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"2:21 · 345.0 MB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Gaz-MW1-2K.mp4","name":"Gaz MW1","run":"2:21","size":"345.0 MB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"2:21 · 195.5 MB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Gaz-MW1-1080p.mp4","name":"Gaz MW1","run":"2:21","size":"195.5 MB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"gaz-mw2","collection":"cod","group":"gaz","title":"Gaz","chapter":"Modern Warfare II","poster":"assets/images/cod/gaz-mw2.jpg","meta":"5:34 · 1.86 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Gaz-MW2-4K.mp4","name":"Gaz MW2","run":"5:34","size":"1.86 GB","direct":true,"resolution":"3840 × 1634"}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"5:34 · 1.31 GB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Gaz-MW2-2K.mp4","name":"Gaz MW2","run":"5:34","size":"1.31 GB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"5:34 · 835.5 MB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Gaz-MW2-1080p.mp4","name":"Gaz MW2","run":"5:34","size":"835.5 MB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"gaz-mw3","collection":"cod","group":"gaz","title":"Gaz","chapter":"Modern Warfare III","poster":"assets/images/cod/gaz-mw3.jpg","meta":"4:40 · 1.57 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Gaz-MW3-4K.mp4","name":"Gaz MW3","run":"4:40","size":"1.57 GB","direct":true,"resolution":"3840 × 1634"}],"fps":"30 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"4:40 · 1.22 GB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Gaz-MW3-2K.mp4","name":"Gaz MW3","run":"4:40","size":"1.22 GB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"4:40 · 678.4 MB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Gaz-MW3-1080p.mp4","name":"Gaz MW3","run":"4:40","size":"678.4 MB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"gaz-extra","collection":"cod","group":"gaz","title":"Gaz","chapter":"More clips","poster":"assets/images/cod/gaz-extra.jpg","meta":"3:49 · 1.94 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/cod-141/Gaz-More-Clips.mp4","name":"Gaz more clips","run":"3:49","size":"1.94 GB","direct":true}],"fps":"60 FPS","resolution":"3840 × 2160","count":"01 file"},
  {"id":"price-mw4","collection":"cod","group":"price","title":"John Price","chapter":"Modern Warfare 4","poster":"assets/images/cod/price-mw4.jpg","meta":"22:57 · 3.86 GB · two files","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW4-Part1-4K.mp4","name":"MW4 part 1","run":"11:48","size":"1.93 GB","direct":true,"resolution":"3840 × 1634"},{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW4-Part2-4K.mp4","name":"MW4 part 2","run":"11:09","size":"1.93 GB","direct":true,"resolution":"3840 × 1634"}],"fps":"60 FPS","resolution":"3840 × 1634","count":"02 files","editions":{"2K":{"meta":"22:57 · 3.78 GB · two files","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW4-Part1-2K.mp4","name":"MW4 part 1","run":"11:48","size":"1.91 GB","direct":true,"resolution":"2560 × 1088"},{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW4-Part2-2K.mp4","name":"MW4 part 2","run":"11:09","size":"1.87 GB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"22:57 · 3.07 GB · two files","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW4-Part1-1080p.mp4","name":"MW4 part 1","run":"11:48","size":"1.61 GB","direct":true,"resolution":"1920 × 816"},{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW4-Part2-1080p.mp4","name":"MW4 part 2","run":"11:09","size":"1.46 GB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"price-raid","collection":"cod","group":"price","title":"John Price","chapter":"Raid Atomgrad","poster":"assets/images/cod/raid-atomgrad.jpg","fps":"30 FPS","count":"01 file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW2-Raid-Atomgrad-4K.mp4","name":"Price Raid Atomgrad","run":"12:53","size":"1.91 GB","direct":true,"resolution":"3840 × 1634"}],"meta":"12:53 · 1.91 GB · one file","resolution":"3840 × 1634","editions":{"2K":{"meta":"12:53 · 1.49 GB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW2-Raid-Atomgrad-2K.mp4","name":"Price Raid Atomgrad","run":"12:53","size":"1.49 GB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"12:53 · 916.9 MB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW2-Raid-Atomgrad-1080p.mp4","name":"Price Raid Atomgrad","run":"12:53","size":"916.9 MB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"gaz-mw4","collection":"cod","group":"gaz","title":"Gaz","chapter":"Modern Warfare 4","poster":"assets/images/cod/gaz-mw4.jpg","meta":"3:46 · 1.28 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Gaz-MW4-4K.mp4","name":"Gaz MW4","run":"3:46","size":"1.28 GB","direct":true,"resolution":"3840 × 1634"}],"fps":"60 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"3:46 · 877.6 MB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Gaz-MW4-2K.mp4","name":"Gaz MW4","run":"3:46","size":"877.6 MB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"3:46 · 470.0 MB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Gaz-MW4-1080p.mp4","name":"Gaz MW4","run":"3:46","size":"470.0 MB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"gaz-raid","collection":"cod","group":"gaz","title":"Gaz","chapter":"Raid Atomgrad","poster":"assets/images/cod/raid-atomgrad.jpg","fps":"30 FPS","count":"01 file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Gaz-MW2-Raid-Atomgrad-4K.mp4","name":"Gaz Raid Atomgrad","run":"12:53","size":"1.91 GB","direct":true,"resolution":"3840 × 1634"}],"meta":"12:53 · 1.91 GB · one file","resolution":"3840 × 1634","editions":{"2K":{"meta":"12:53 · 1.49 GB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Gaz-MW2-Raid-Atomgrad-2K.mp4","name":"Gaz Raid Atomgrad","run":"12:53","size":"1.49 GB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"12:53 · 916.9 MB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Gaz-MW2-Raid-Atomgrad-1080p.mp4","name":"Gaz Raid Atomgrad","run":"12:53","size":"916.9 MB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"ghost-mw4","collection":"cod","group":"ghost","title":"Ghost","chapter":"Modern Warfare 4","poster":"assets/images/cod/ghost-mw4.jpg","meta":"3:53 · 1.31 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Ghost-MW4-4K.mp4","name":"Ghost MW4","run":"3:53","size":"1.31 GB","direct":true,"resolution":"3840 × 1634"}],"fps":"60 FPS","resolution":"3840 × 1634","count":"01 file","editions":{"2K":{"meta":"3:53 · 910.6 MB · one file","resolution":"2560 × 1088","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Ghost-MW4-2K.mp4","name":"Ghost MW4","run":"3:53","size":"910.6 MB","direct":true,"resolution":"2560 × 1088"}]},"1080p":{"meta":"3:53 · 489.8 MB · one file","resolution":"1920 × 816","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Ghost-MW4-1080p.mp4","name":"Ghost MW4","run":"3:53","size":"489.8 MB","direct":true,"resolution":"1920 × 816"}]}}},
  {"id":"valeria-mw4","collection":"cod","group":"valeria","title":"Valeria","chapter":"Modern Warfare 4","poster":"assets/images/cod/valeria-mw4.jpg","meta":"10:14 · 1.95 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-characters/Valeria-MW4.mp4","name":"Valeria MW4","run":"10:14","size":"1.95 GB","direct":true}],"fps":"60 FPS","resolution":"3840 × 1634","count":"01 file"},
  {"id":"archer-mw4","collection":"cod","group":"archer","title":"The Archer","chapter":"Modern Warfare 4","poster":"assets/images/cod/archer-mw4.jpg","meta":"6:32 · 1.95 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-characters/The-Archer-MW4.mp4","name":"The Archer MW4","run":"6:32","size":"1.95 GB","direct":true}],"fps":"60 FPS","resolution":"3840 × 1634","count":"01 file"},
  {"id":"gameplay-market","collection":"cod","group":"gameplay","title":"Modern Warfare 4 gameplay","chapter":"Market Scene","poster":"assets/images/cod/gameplay-market.jpg","meta":"2:40 · 610.4 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-gameplay/MW4-Gameplay-Market-Scene.mp4","name":"Market Scene","run":"2:40","size":"610.4 MB","direct":true}],"fps":"60 FPS","resolution":"2560 × 1440","count":"01 file"},
  {"id":"gameplay-makarov","collection":"cod","group":"gameplay","title":"Modern Warfare 4 gameplay","chapter":"Makarov Chase","poster":"assets/images/cod/gameplay-makarov.jpg","meta":"9:48 · 2.45 GB · two files","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-gameplay/MW4-Gameplay-Makarov-Chase-Part1.mp4","name":"Makarov Chase part 1","run":"4:55","size":"901.8 MB","direct":true},{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-gameplay/MW4-Gameplay-Makarov-Chase-Part2.mp4","name":"Makarov Chase part 2","run":"4:54","size":"1.54 GB","direct":true}],"fps":"60 FPS","resolution":"2560 × 1440","count":"02 files"},
  {"id":"gameplay-defector","collection":"cod","group":"gameplay","title":"Modern Warfare 4 gameplay","chapter":"Defector","poster":"assets/images/cod/gameplay-defector.jpg","meta":"5:01 · 1.31 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-gameplay/MW4-Gameplay-Defector.mp4","name":"Defector","run":"5:01","size":"1.31 GB","direct":true}],"fps":"60 FPS","resolution":"2560 × 1440","count":"01 file"},
  {"id":"gameplay-graves-death","collection":"cod","group":"gameplay","title":"Modern Warfare 4 gameplay","chapter":"Graves Death","poster":"assets/images/cod/gameplay-gravesdeath.jpg","meta":"4:16 · 798.3 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-gameplay/MW4-Gameplay-Graves-Death.mp4","name":"Graves Death","run":"4:16","size":"798.3 MB","direct":true}],"fps":"60 FPS","resolution":"2560 × 1440","count":"01 file"},
  {"id":"gameplay-price-ghost","collection":"cod","group":"gameplay","title":"Modern Warfare 4 gameplay","chapter":"Price vs Ghost","poster":"assets/images/cod/gameplay-price-ghost.jpg","meta":"7:50 · 1.68 GB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-gameplay/MW4-Gameplay-Price-vs-Ghost.mp4","name":"Price vs Ghost","run":"7:50","size":"1.68 GB","direct":true}],"fps":"60 FPS","resolution":"2560 × 1440","count":"01 file"},
  {"id":"gameplay-price-jail","collection":"cod","group":"gameplay","title":"Modern Warfare 4 gameplay","chapter":"Price Jail","poster":"assets/images/cod/gameplay-price-jail.jpg","meta":"5:57 · 803.1 MB · one file","files":[{"url":"https://github.com/Qstrx/noctis/releases/download/mw4-gameplay/MW4-Gameplay-Price-Jail.mp4","name":"Price Jail","run":"5:57","size":"803.1 MB","direct":true}],"fps":"60 FPS","resolution":"2560 × 1440","count":"01 file"}
];
