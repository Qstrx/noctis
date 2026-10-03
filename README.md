# Ocean’s Scenepacks

A static footage archive for John Price, Call of Duty campaign cutscenes and Joe Graves from SIX.

## Run locally

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765. No build step or backend is required; GitHub Pages remains supported.

## Layout

Home offers two contained photographic destinations inside the real AuroraGrab Night sky. Light Segoe names at 40–56px replace the former oversized cinema lettering. Both choices fit the first viewport on desktop, phone and short landscape.

COD has exactly two collections. John Price presents Modern Warfare I, II and III with All in one beside them. Cutscenes presents only the three original campaign files in three desktop columns, with separate Drive and download actions. The source catalog contains one combined Price file; campaigns remain three distinct Google Drive files. There is no All cutscenes interface.

SIX presents Season 1 and Season 2 side by side on desktop, each with a distinct existing scene photograph above its heading, followed by eight and ten compact episode entries. Each entry leads with its official episode name, then the episode number and original duration/size. Names are verified against HISTORY’s [Season 1](https://www.history.com/shows/six/season-1) and [Season 2](https://www.history.com/shows/six/season-2) listings and carried through previews, episode selection and download context. The panels stack on phones; at 380px and below, the small row still is hidden to give longer names room, while season cover photographs remain. The two-part episode retains its concise “2 parts” note. File actions have 44px hit areas and episode-specific accessible names.

Archive introductions are replaced by a compact breadcrumb, collection name and source quality facts. Archive type now uses 500-weight titles and 400-weight facts within the existing Segoe stacks. John Price’s four cover/title positions align without an extra divider or inset for All in one. Search inputs, search data/listeners and the empty/reset interface are removed; kind and season filters remain, with result counts announced to screen readers. Source notes, original download metadata, multipart selection, native previews and timestamp sharing are preserved. All 25 original content items remain available.

## Motion and fallback

A selected photograph expands in 300ms, holds through document loading, then fades away in 400ms to reveal the archive in place. The traveling frame carries only the image. A one-use session record expires after six seconds. Archive-to-home and archive-to-archive navigation remain immediate. The actual sky maintains time/energy continuity, render-resolution and 30/20fps limits, and suspension for hidden documents and previews.

Pause and reduced motion use ordinary immediate links. Escape cancels departure before navigation starts; browser-back restoration removes any traveling frame and clears inert state. Storage or animation support failure leaves native navigation and visible destination content. Home has no lens-blur introduction.

## Verification

The v8 layout, decoded images, catalog counts and legible source facts passed at 1440, 390 and the user’s 2265px viewport. Additional fit checks covered 320px, 1024px and 844×390 landscape. All nine desktop, phone and user-size captures were inspected; the checked pages have no horizontal overflow or broken images. Slow destination loading, first-frame photo coverage, keyboard navigation, pause, Escape and browser-back cleanup also passed.

Seventeen targeted archive/player groups passed for v8, including original source-field preservation, official episode names in rows and preview/download context, complete search removal, filters, multipart choices, providers, preview error/retry/media cleanup, focus return, SIX timestamp links and removal of the campaign-wide chooser. No page errors were recorded. External media was blocked during recovery tests; timestamp seeking used synthetic loaded metadata. Complete remote playback and large downloads were not performed.

One detector pass returned 30 advisory findings and two cramped-padding warnings. The padding warnings describe the inherited toolbar rule; computed styles confirm the current filter-only toolbar has no border and a transparent background because `archive.css` overrides that rule. The advisory findings concern the retained palette, hidden source badges, distinct type roles and the 15px inner season-cover corner.

PRODUCT.md, DESIGN.md and .impeccable/design.json record the current app-inspired interface. Supplied photographs, shader implementation, font/license assets and original source URLs are retained.
