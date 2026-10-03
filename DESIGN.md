---
name: "Ocean’s Scenepacks — AuroraGrab Night"
description: "Original scene collections with mint, amber and ice-blue light in the AuroraGrab Night sky."
colors:
  sky-bg: "#02060b"
  ink: "#eef4f5"
  muted: "#adbfc3"
  faint: "#8ea7ad"
  mint: "#6ff5bf"
  mint-ink: "#03110c"
  panel: "rgba(3, 9, 13, .64)"
  panel-strong: "rgba(4, 10, 14, .92)"
  line: "rgba(225, 248, 243, .13)"
  line-strong: "rgba(225, 248, 243, .24)"
  sky-top: "#01030a"
  sky-mid: "#03101a"
  sky-horizon: "#06171d"
  action-mint-bg: "color-mix(in srgb, #6ff5bf 10%, transparent)"
  action-mint-line: "color-mix(in srgb, #6ff5bf 30%, transparent)"
  action-hover: "rgba(225,248,243,.1)"
  player-bg: "#000"
  cod-sky-bg: "#090c08"
  cod-ink: "#f3f1e9"
  cod-muted: "#c0c2b3"
  cod-faint: "#a7ae96"
  cod-accent: "#e7c78b"
  cod-accent-ink: "#17170c"
  cod-panel: "rgba(15,20,12,.72)"
  cod-panel-strong: "rgba(15,20,13,.96)"
  cod-line: "rgba(230,227,199,.15)"
  cod-line-strong: "rgba(230,227,199,.28)"
  cod-sky-top: "#070a06"
  cod-sky-mid: "#131c10"
  cod-sky-horizon: "#20261a"
  six-sky-bg: "#030a13"
  six-ink: "#eaf3ff"
  six-muted: "#afc4dc"
  six-faint: "#90adc9"
  six-accent: "#98cdff"
  six-accent-ink: "#071426"
  six-panel: "rgba(5,14,27,.72)"
  six-panel-strong: "rgba(7,18,32,.96)"
  six-line: "rgba(202,226,255,.15)"
  six-line-strong: "rgba(202,226,255,.28)"
  six-sky-top: "#030714"
  six-sky-mid: "#0c1a33"
  six-sky-horizon: "#132b42"
typography:
  display:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "clamp(40px, 4.3vw, 56px)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-.035em"
  headline:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-.02em"
  title:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "28px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-.02em"
  pack-title:
    fontFamily: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif'
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-.01em"
  episode-title:
    fontFamily: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif'
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0"
  episode-number:
    fontFamily: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif'
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif'
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif'
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  action:
    fontFamily: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif'
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.5
  home-brand:
    fontFamily: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif'
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-.035em"
  archive-brand:
    fontFamily: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif'
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-.035em"
  dialog-title:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-.02em"
  preview-title:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "clamp(24px, 3vw, 36px)"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "-.025em"
rounded:
  episode: "6px"
  control: "8px"
  media: "12px"
  panel: "16px"
  pill: "999px"
spacing:
  compact: "6px"
  small: "8px"
  label: "12px"
  control: "16px"
  content: "20px"
  panel: "24px"
  shelf: "28px"
  chapter: "32px"
  section: "36px"
  home-gap: "56px"
components:
  button-primary:
    backgroundColor: "{colors.action-mint-bg}"
    textColor: "{colors.mint}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "9px 11px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.mint-ink}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "9px 11px"
    height: "44px"
  button-complete:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.mint-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "9px 11px"
    height: "44px"
  button-episode:
    backgroundColor: "{colors.action-mint-bg}"
    textColor: "{colors.mint}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "0"
    height: "44px"
    width: "44px"
  button-download:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.mint-ink}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "48px"
  button-download-cod:
    backgroundColor: "{colors.cod-accent}"
    textColor: "{colors.cod-accent-ink}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "48px"
  button-download-six:
    backgroundColor: "{colors.six-accent}"
    textColor: "{colors.six-accent-ink}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "48px"
  button-motion:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "0"
    height: "44px"
    width: "44px"
  button-home-motion:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "0"
    height: "44px"
    width: "44px"
  navigation:
    textColor: "{colors.muted}"
  archive-heading:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    padding: "0"
  pack-cover:
    backgroundColor: "{colors.panel-strong}"
    rounded: "{rounded.control}"
  episode-cover:
    backgroundColor: "{colors.panel-strong}"
    rounded: "{rounded.episode}"
  collection-shelf:
    backgroundColor: "{colors.panel-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "{spacing.shelf}"
  season-panel:
    backgroundColor: "{colors.panel-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel}"
  home-choice:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.media}"
    padding: "0"
  dialog:
    backgroundColor: "{colors.panel-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
  transfer-dialog:
    backgroundColor: "{colors.panel-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "{spacing.shelf}"
    width: "480px"
---

# Design System: Ocean’s Scenepacks — AuroraGrab Night

## Overview

**Creative North Star: "AuroraGrab Night"**

The pinned AuroraGrab 3.0 reference supplies the real northern sky, mint home foundation, Segoe family stacks and quiet controls. The user-directed v9 expansion gives COD amber light over olive surfaces and SIX ice-blue light over navy surfaces. The same sky previews the collection on hover or keyboard focus and carries its color wave into the archive. Contained home photographs, compact breadcrumbs, collection shelves and illustrated season panels keep the footage legible. Search, main filters, result counts and redundant Drive card buttons are removed; the download panel now identifies the actual file. This preserves surface seed provenance `9b05bce6` without implying a new seed selection or aesthetic approval.

**Key Characteristics:**

- Home contains the brand, a motion icon and two photographed collection links.
- Call of Duty has two shelves: John Price with the adjacent All in one file, and Cutscenes with only three campaign files.
- SIX pairs Season 1 and Season 2 panels, each led by a full-width source still above its heading, containing eight and ten named episode rows.
- Archive titles use a consistent 500 weight, facts use 400 and the brand uses 600; light home names and 44px archive actions remain clear.
- Every collection remains visible without catalog search, filter bars or result counts; preview season selection remains available.
- Mint home, amber/olive COD and ice-blue/navy SIX share the same actual sky and Segoe system.
- A directional light curtain reveals the archive in place while the sky retains time, energy, pulse and palette-wave continuity.
- The download panel leads with a real still, actual file title, facts, provider guidance and a clear action or part rows.

## Colors

The three palette groups in the frontmatter are actual values from `site.css`. Home starts with the original mint Night palette. Its chosen collection palette is previewed on hover or focus; COD and SIX load their own scoped values immediately. `--accent` and `--accent-ink` supply the controls, focus, navigation marker and download action. Compatibility aliases `--mint` and `--mint-ink` resolve on the body so they follow its collection variables. Photographs preserve their source colors and the actual sky fills the background on every page.

### Primary

- **Aurora Mint** (`#6ff5bf`) with **Mint Ink** (`#03110c`): the home’s resting accent and accent text.
- **COD Amber** (`#e7c78b`) with **COD Accent Ink** (`#17170c`): COD controls, active navigation, focus, the All in one action and file-panel confirmation.
- **SIX Ice Blue** (`#98cdff`) with **SIX Accent Ink** (`#071426`): SIX controls, active navigation, focus and file-panel confirmation.
- Ordinary archive downloads use `color-mix(in srgb, var(--accent) 10%, transparent)` and a 30% accent border before solid-accent hover. The frontmatter action colors show the mint default; the live component resolves the collection accent. Final download buttons brighten with `filter: brightness(1.08)`.

### Neutral

- **Night Sky** (`#02060b`), **COD Olive Night** (`#090c08`) and **SIX Navy Night** (`#030a13`): the respective bases beneath the shader and static fallback.
- Each palette carries its own ink, muted, faint, panel, strong panel and line tokens. Collection panels use the scoped `--panel-strong`; all source facts use the scoped muted text. This maintains readable local surfaces through the changing background.
- `sky-top`, `sky-mid` and `sky-horizon` in each group supply the CSS fallback gradient. The shader uses the matching seven-role color arrays in `aurora.js` for ribbons, stars, atmosphere and terrain.
- **Player Black** (`#000`): video backing that preserves the source framing.

**The Readable Surface Rule.** Keep pale text on dark local surfaces; source facts and controls must remain readable through changes in the sky.

## Typography

**Display Font:** "Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif.
**Body Font:** "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif.

The exact source-app family stacks are intentional reference fidelity. Light display text stays on the quiet home and preview headings. Archive collection, section, file and download-panel titles use a consistent 500 weight, facts use 400 and the brand uses 600. The current visible UI uses Segoe throughout without a new font download.

### Hierarchy

- **Display:** weight 300, `clamp(40px, 4.3vw, 56px)` / 1.1, tracking `-.035em`; both complete home destination names. Phones and short landscape use 40px.
- **Headline:** weight 500, 22px / 1.25, tracking `-.02em`; the collection name beside the archive breadcrumb at every width.
- **Title:** weight 500, 28px / 1.2, tracking `-.02em`; both COD shelf headings and both season headings at every width.
- **Pack titles:** weight 500, 18px / 1.4, tracking `-.01em`; COD titles become 16px on phones and 15px at 380px.
- **Episode names / numbers:** names use weight 500, 16px / 1.4 with zero tracking; the secondary episode number uses weight 400, 12px / 1.5 and tabular figures on a separate line, with a 4px top gap. Names retain 16px on phones and wrap as needed.
- **Body / navigation:** body uses 15px / 1.5; main navigation uses 14px. Labels, source facts, breadcrumb links and archive action text use 12px; numbers use tabular figures. Archive introductions and their subtitle role are removed.
- **Brand / dialogs:** home brand 22px and archive brand 24px, both weight 600. Download-panel titles use 22px/500 with line-height 1.3 and `-.02em` tracking, becoming 20px at 480px. Preview titles retain light `clamp(24px, 3vw, 36px)` text.

The observed 12, 13, 14, 15, 16, 18, 20, 22, 24, 28, 36, 40 and 56px steps reflect these distinct roles and responsive overrides.

**The Source Voice Rule.** Use the app’s Segoe text and display stacks, with light home names, consistent 500-weight archive titles and 400-weight source facts.

## Layout

Home has a 1120px header cap with 48px gutters and an 88px minimum height. Its centered content caps at 784px: two equal columns separated by 56px, each with a `clamp(190px, 25svh, 240px)` photograph and a label below. The main uses 48px top and 120px bottom padding. At 900px the gap is 36px. At 700px, the header has 24px gutters and a 76px height; content caps at 400px and becomes one column with a 28px gap and `clamp(128px, 22svh, 190px)` images. Short phones tighten vertical spacing. Landscape at minimum width 560px and maximum height 540px restores two columns, a 32px gap and 120–170px photographs.

Archives cap at 1240px with 40px gutters. The site header is 84px high. A compact archive heading follows with 28px top spacing: the All collections link, a slash and the collection name share one row, with small source quality facts on the right. Collection panels begin 28px below the heading, with no catalog toolbar or count in between. At 1100px gutters become 24px; at 760px they become 20px, the site header is 110px, heading top spacing becomes 20px and quality facts move below the breadcrumb. The former description-and-portrait introduction is absent.

Call of Duty has two 28px-padded shelves separated by 32px. John Price has four equal positions with a 24px gap for MW I, II, III and All in one; their covers and titles align without an extra divider or inset for the combined file. Cutscenes uses three equal columns for the original campaign files, with no collective chooser. At 1100px shelves use 24px padding and 18px gaps. At 800px both shelves become two columns. At 760px panels use 20px padding, 24×16px gaps and vertically stacked file actions; at 380px padding is 16px and horizontal gaps are 12px.

SIX uses two season panels side by side with a 24px gap and padding. Each opens with a full-width 190px-high source photograph (Season 1: s1-e07; Season 2: s2-e10), followed by a separate heading and the season’s episode count, duration and size. The photographs extend to the inner panel edges; their upper corners are 15px, concentric with the 16px panel corner minus its one-pixel border. Each episode row has a 96px still, a flexible name/number/facts column and a 94px action column, with 16px horizontal gaps and 16px vertical padding. At 1100px panel padding becomes 20px, cover height 170px, stills 64px and gaps 12px. At 800px panels stack, padding and cover height return to 24px/190px and stills become 100px. At 760px padding is 20px, covers 150px, stills 64px and row padding 14px; at 380px padding is 16px, covers 140px and the small row still is hidden so the episode name has room to wrap. Season cover photographs remain visible. Preview and Download remain adjacent 44×44px controls at every width. Panel margins do not compound the grid gaps.

## Elevation & Depth

Scoped dark tonal panels, one-pixel borders and source photographs establish depth over the full sky. Home images use `0 12px 36px rgba(0,0,0,.22)`; previews use `0 30px 100px #0009`. The borderless file panel uses `0 24px 80px rgba(0,0,0,.48)`. Native dialogs share a dimmed, 10px-blurred backdrop. Archive covers do not lift, scale or cast hover shadows; their image brightness can still respond to hover and focus.

**The Quiet Depth Rule.** Keep collection panels still and let tonal backing, borders and the actual sky carry depth.

## Shapes

Home photographs have 12px corners. Season cover photographs have 15px upper corners within the one-pixel border of a 16px panel; archive headings contain no portraits. COD stills use 8px corners and a 16:10 crop; SIX stills use 6px corners with the responsive ratios in `archive.css`. Archive and file-panel controls use 8px corners; shelves, season panels and dialogs use 16px. Only the motion toggle uses a pill shape. Source badges remain in the archive markup but are visually suppressed. Photographs are contained rectangles rather than edge-dissolved or masked compositions.

## Components

### Actions and navigation

Ordinary archive Download controls use the collection accent, a 10% translucent accent background and 30% accent border; All in one alone has a solid accent action at rest. Preview is a transparent outlined control. Cutscene cards have only Download; their redundant Drive control is removed. Buttons are at least 44px high; SIX uses adjacent 44×44px icon buttons with inline SVGs, native button semantics, explicit episode-specific accessible names and visually hidden text. The final file-panel action is 48px high with 8px corners and solid collection accent. Motion is a 44×44px accessible toggle; its home background is transparent. Native anchors preserve modified-click navigation. Main navigation keeps its selected state and a moving 2px collection-accent underline; there is no catalog filter navigation.

### Collections and source facts

All seven COD packs and 18 SIX episode articles retain original IDs, source facts and file actions. John Price contains three character packs plus the existing combined All in one file. Cutscenes exposes the three existing Google Drive campaign files independently through Download. Only John Price has an All in one action; no campaign-wide chooser is present. SIX season covers use the existing source stills without text overlays; their headings and aggregate facts sit below. Official episode names lead the rows, with episode numbers below; names also identify the preview heading, episode picker, video, download context and accessible action names. SIX retains duration/size beside every episode; Season 1 Episode 5 has the concise visible “2 parts” note. Both COD shelves and both SIX season panels remain visible. Search data/input/listeners, empty/reset UI, main kind/season filters and their result counts are removed.

### Fields and dialogs

The preview timestamp field, season selector and playback controls remain. The new download panel has a 480px width cap, 28px padding, a source still, actual title, context and file facts. The still is 80×80px; at 480px the panel uses 24px padding, a 64×72px still and a 20px title. One-file panels place credit beside a 48px Download action, stacking the full-width action above credit on phones. Multipart panels replace that action with 64px-minimum part rows containing the part name and actual duration/size. Google Drive and Mega retain their original file-page destinations with specific guidance; GitHub files retain direct-download behavior. No full-file payload is loaded to render the panel.

Native dialogs retain immediate preview-to-download handoff, media cleanup, error/retry states, scene timestamp sharing and focus return. Ordinary dialog entry is 350ms; dismissal is 220ms. A new scene during dismissal cancels the stale close. Changed scene heading and screen feedback lasts 300ms. A transactional preview-to-download handoff closes the player before opening the file dialog.

### Collection light passage and sky

Hover or keyboard focus samples the chosen photograph’s normalized horizontal center and previews the collection colors in the actual shader over 700ms. On home, registered color properties also transition over 700ms. The shader changes seven color roles with an origin-based horizontal wave, retaining the source artwork. Selection sends a 1100ms palette target and a source-inspired energy pulse.

A fixed `.passage-veil` contains one `.passage-curtain`, colored for the chosen collection. It enters from the chosen side in 600ms with `cubic-bezier(.32,0,.16,1)`, using only transform and opacity. Its opaque central region covers slow document loading. A one-use six-second record carries the world, origin and destination; the destination creates the curtain before first paint and continues it outward over 500ms with `cubic-bezier(.16,1,.3,1)`. There is no traveling photograph. Main stays at opacity 1 without transform or clipping, becoming inert only during departure. Direct loads, archive-to-home and archive-to-archive navigation are immediate.

Pause commits pending navigation immediately and removes the curtain; reduced motion uses normal anchors and settled collection colors. Escape before departure commits cancels the passage and restores link focus. Back restoration clears the curtain and inert state. Storage failure leaves destination content visible. Home image feedback uses 350ms; arrow color uses 180ms and shifts 4px. Action feedback uses 150ms colors and 120ms transforms, with a 100ms active press. Reduced/manual motion disables travel and physical feedback, retaining brief color confirmation.

The actual shader keeps the established artwork. Hover/focus raises its target energy from .35 to .6; selection can trigger a 1300ms pulse and energy 1.35. A separate one-use five-second record transfers shader time, energy, pulse progress and the palette’s from/to arrays, progress, duration, world and origin; time advances by .735 units per second. Ambient work is capped at 30fps, or 20fps at 700px and below, and suspends for hidden documents, paused/reduced motion, open previews and context loss. Context restoration rebuilds WebGL resources; unavailable WebGL exposes the scoped static CSS sky. No initial shader entrance runs.

## Do's and Don'ts

### Do:

- **Do** preserve the pinned AuroraGrab Night artwork and exact Segoe family stacks, using the approved mint home, amber/olive COD and ice-blue/navy SIX variants.
- **Do** keep both home choices equally clear with contained photographs and 40–56px names.
- **Do** keep John Price and Cutscenes as two shelves, with the existing All in one file beside the Price trilogy.
- **Do** keep the eight- and ten-episode season panels, official episode names, secondary episode numbers and adjacent 44×44px actions accessible.
- **Do** preserve all original media, metadata, download destinations and native interaction behavior.
- **Do** keep the light passage cancellable, preserve capped sky and palette continuity, and retain immediate native access.
- **Do** identify the selected file with its source still, actual title, facts and provider guidance before downloading.

### Don't:

- **Don't** restore oversized cinema lettering, full-window home photographs, intro blur, a clipped sky gate or whole-page fade/scale.
- **Don't** add a campaign-wide chooser, campaign All in one or an eighth COD pack.
- **Don't** reintroduce archive search, main filter bars, result counts, redundant Drive card controls, cover lift/scale, visible source badges or stacked margins between collection panels.
- **Don't** turn direct loading or browsing into an animation prerequisite.
- **Don't** present superseded ship verdicts or the retained seed as fresh aesthetic approval.
