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
    "poster": "img/price.jpg",
    "meta": "18:51 · 2.56 GB · two files",
    "files": [
      {
        "url": "https://github.com/Qstrx/noctis/releases/download/v1/John-Price-MW1-Part1.mp4",
        "name": "MW1 part 1",
        "direct": true
      },
      {
        "url": "https://github.com/Qstrx/noctis/releases/download/v1/John-Price-MW1-Part2.mp4",
        "name": "MW1 part 2",
        "direct": true
      }
    ],
    "fps": "60 fps",
    "resolution": "2560 × 1088",
    "count": "02 files"
  },
  {
    "id": "mw2",
    "collection": "cod",
    "group": "price",
    "title": "John Price",
    "chapter": "Modern Warfare II",
    "poster": "img/cod/price-mw2.jpg",
    "meta": "8:06 · 1.16 GB · one file",
    "files": [
      {
        "url": "https://github.com/Qstrx/noctis/releases/download/v1/John-Price-MW2.mp4",
        "name": "MW2",
        "direct": true
      }
    ],
    "fps": "60 fps",
    "resolution": "2560 × 1088",
    "count": "01 file"
  },
  {
    "id": "mw3",
    "collection": "cod",
    "group": "price",
    "title": "John Price",
    "chapter": "Modern Warfare III",
    "poster": "img/cod/price-mw3.jpg",
    "meta": "11:55 · 1.62 GB · one file",
    "files": [
      {
        "url": "https://github.com/Qstrx/noctis/releases/download/v1/John-Price-MW3.mp4",
        "name": "MW3",
        "direct": true
      }
    ],
    "fps": "60 fps",
    "resolution": "2560 × 1088",
    "count": "01 file"
  },
  {
    "id": "full",
    "collection": "cod",
    "group": "price",
    "title": "John Price",
    "chapter": "Everything, one file",
    "poster": "img/price.jpg",
    "meta": "39:00 · 5.33 GB · opens Mega",
    "files": [
      {
        "url": "https://mega.nz/file/SS4EAQQI#_0fGCxJnfgSKcLeHu5oPYMi6CU1KAQch8r4KsW4Vr0k",
        "name": "Full scene pack",
        "direct": false
      }
    ],
    "fps": "60 fps",
    "resolution": "2560 × 1088",
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
    "fps": "60 fps",
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
    "fps": "60 fps",
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
    "fps": "60 fps",
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
    "fps": "~60 fps",
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
    "fps": "~60 fps",
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
    "fps": "~60 fps",
    "resolution": "3840 × 1606",
    "releaseDate": "2026-09-17",
    "source": "https://www.callofduty.com/blog/2026/09/call-of-duty-modern-warfare-4-tokyo-games-show-campaign-trailer",
    "count": "01 file"
  }
];
