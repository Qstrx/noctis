---
name: "Ocean’s Scenepacks — AuroraGrab Night"
description: "Original scene collections in the quiet sky of the AuroraGrab 3.0 reference."
colors:
  sky-bg: "#02060b"
  ink: "#eef4f5"
  muted: "#adbfc3"
  faint: "#8ea7ad"
  facts: "#c3d6d8"
  mint: "#6ff5bf"
  mint-ink: "#03110c"
  panel: "rgba(3, 9, 13, .64)"
  panel-strong: "rgba(4, 10, 14, .92)"
  shelf: "rgba(3,9,13,.88)"
  line: "rgba(225, 248, 243, .13)"
  line-strong: "rgba(225, 248, 243, .24)"
  action-mint-bg: "rgba(111,245,191,.1)"
  action-mint-line: "rgba(111,245,191,.24)"
  action-hover: "rgba(225,248,243,.1)"
  quiet-mint: "rgba(111,245,191,.04)"
  search-bg: "rgba(2,9,13,.62)"
  dialog-bg: "#071016"
  player-bg: "#000"
  mint-hover: "#a0ffd9"
typography:
  display:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "clamp(40px, 4.3vw, 56px)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-.035em"
  headline:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-.025em"
  title:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "30px"
    fontWeight: 350
    lineHeight: 1.15
    letterSpacing: "-.025em"
  pack-title:
    fontFamily: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif'
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "-.015em"
  episode-title:
    fontFamily: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif'
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "-.015em"
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
    fontSize: "30px"
    fontWeight: 300
    lineHeight: 1.5
    letterSpacing: "-.03em"
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
    rounded: "{rounded.pill}"
    padding: "12px 16px"
    height: "48px"
  button-download-hover:
    backgroundColor: "{colors.mint-hover}"
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
  search-field:
    backgroundColor: "{colors.search-bg}"
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "42px"
    width: "260px"
  navigation:
    textColor: "{colors.muted}"
  archive-heading:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    padding: "0"
  filter:
    textColor: "{colors.muted}"
    padding: "12px 0"
    height: "44px"
  pack-cover:
    backgroundColor: "{colors.panel-strong}"
    rounded: "{rounded.control}"
  episode-cover:
    backgroundColor: "{colors.panel-strong}"
    rounded: "{rounded.episode}"
  collection-shelf:
    backgroundColor: "{colors.shelf}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "{spacing.shelf}"
  season-panel:
    backgroundColor: "{colors.shelf}"
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
    backgroundColor: "{colors.dialog-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
---

# Design System: Ocean’s Scenepacks — AuroraGrab Night

## Overview

**Creative North Star: "AuroraGrab Night"**

The pinned AuroraGrab 3.0 reference supplies the real northern sky, Night palette, light Segoe headings and quiet controls. Contained home photographs leave the sky visible; compact archive breadcrumbs, collection shelves and illustrated season panels make original footage easy to find. This is the user-directed v7 composition within that established world, retaining surface seed provenance `9b05bce6`; it does not imply a new seed selection or aesthetic approval.

**Key Characteristics:**

- Home contains the brand, a motion icon and two photographed collection links.
- Call of Duty has two shelves: John Price with the adjacent All in one file, and Cutscenes with only three campaign files.
- SIX pairs Season 1 and Season 2 panels, each led by a full-width source still above its heading, containing eight and ten episode rows.
- Segoe headings stay light; source facts and 44px archive actions remain clear.
- A home photograph expands and fades to reveal its archive in place; the main stays visible and the real sky retains its clock and pulse.

## Colors

Mint and pale text sit over the original dark AuroraGrab Night sky. Photographs keep their source colors. The actual sky fills the background on every page; the home does not screen-blend a reduced-opacity sky over full-window photographs.

### Primary

- **Aurora Mint** (`#6ff5bf`): action labels, active navigation, keyboard focus and the All in one action. Ordinary archive downloads use the translucent `action-mint-bg` surface and `action-mint-line` border before a solid mint hover.
- **Mint Ink** (`#03110c`): text on solid mint actions. The final dialog action brightens to `#a0ffd9` on hover.

### Neutral

- **Night Sky** (`#02060b`): base beneath the shader and static fallback.
- **Pale Ink** (`#eef4f5`), **Muted** (`#adbfc3`) and **Faint** (`#8ea7ad`): headings, secondary copy and placeholders.
- **Source Facts** (`#c3d6d8`): collection metadata inherited from `site.css`.
- **Shelf** (`rgba(3,9,13,.88)`): the COD shelves and SIX season panels; original `panel` and `panel-strong` remain the controls and media backing.
- **Line / Strong Line** (`rgba(225, 248, 243, .13)` / `.24`): panel edges, episode dividers and controls.
- **Dialog Night** (`#071016`) and **Player Black** (`#000`): modal and video surfaces. The player uses black to preserve source framing.

**The Readable Surface Rule.** Keep pale text on dark local surfaces; source facts and controls must remain readable through changes in the sky.

## Typography

**Display Font:** "Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif.
**Body Font:** "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif.

The exact source-app family stacks are intentional reference fidelity. Light display text gives the interface the app’s quiet character; file titles and controls use stronger text weights. The current visible UI uses Segoe throughout.

### Hierarchy

- **Display:** weight 300, `clamp(40px, 4.3vw, 56px)` / 1.1, tracking `-.035em`; both complete home destination names. Phones and short landscape use 40px.
- **Headline:** weight 400, 24px / 1.25, tracking `-.025em`; the collection name beside the archive breadcrumb. Phones use 22px.
- **Title:** weight 350, 30px / 1.15, tracking `-.025em`; both COD shelf headings and both season headings. Phones use 28px.
- **Pack / episode titles:** weight 500, 18px / 1.35 and 16px / 1.35, tracking `-.015em`; COD titles become 16px on phones and 15px at 380px, while episode titles use 15px on phones.
- **Body / navigation:** body uses 15px / 1.5; main navigation uses 14px. Labels, source facts, breadcrumb links and archive action text use 12px; numbers use tabular figures. Archive introductions and their subtitle role are removed.
- **Brand / dialogs:** home brand 22px and archive brand 24px, both weight 600. Dialog titles use light 30px text; preview titles use `clamp(24px, 3vw, 36px)`.

The observed 12, 13, 14, 15, 16, 18, 22, 24, 28, 30, 36, 40 and 56px steps reflect these distinct roles and responsive overrides.

**The Source Voice Rule.** Use the app’s Segoe text and display stacks, with light collection headings and stronger file labels.

## Layout

Home has a 1120px header cap with 48px gutters and an 88px minimum height. Its centered content caps at 784px: two equal columns separated by 56px, each with a `clamp(190px, 25svh, 240px)` photograph and a label below. The main uses 48px top and 120px bottom padding. At 900px the gap is 36px. At 700px, the header has 24px gutters and a 76px height; content caps at 400px and becomes one column with a 28px gap and `clamp(128px, 22svh, 190px)` images. Short phones tighten vertical spacing. Landscape at minimum width 560px and maximum height 540px restores two columns, a 32px gap and 120–170px photographs.

Archives cap at 1240px with 40px gutters. The site header is 84px high. A compact archive heading follows with 28px top spacing: the All collections link, a slash and the collection name share one row, with small source quality facts on the right. The search/filter toolbar follows after 16px, before the result count and collection panels. At 1100px gutters become 24px; at 760px they become 20px, the site header is 110px, heading top spacing becomes 20px, quality facts move below the breadcrumb and search spans the available width. The former description-and-portrait introduction is absent.

Call of Duty has two 28px-padded shelves separated by 28px. John Price has four equal positions with a 24px gap for MW I, II, III and All in one; only the All in one position has a left divider. Cutscenes uses three equal columns for the original campaign files, with no collective chooser. At 1100px shelves use 24px padding and 18px gaps. At 800px both shelves become two columns and the All in one divider disappears. At 760px panels use 20px padding, 24×16px gaps and vertically stacked file actions; at 380px padding is 16px and horizontal gaps are 12px.

SIX uses two season panels side by side with a 24px gap and padding. Each opens with a full-width 190px-high source photograph (Season 1: s1-e07; Season 2: s2-e10), followed by a separate heading and the season’s episode count, duration and size. The photographs extend to the inner panel edges; their upper corners are 15px, concentric with the 16px panel corner minus its one-pixel border. Each episode row has a 96px still, a flexible title/facts column and a 94px action column, with 16px horizontal gaps and 16px vertical padding. At 1100px panel padding becomes 20px, cover height 170px, stills 64px and gaps 12px. At 800px panels stack, padding and cover height return to 24px/190px and stills become 100px. At 760px padding is 20px, covers 150px, stills 64px and row padding 14px; at 380px padding is 16px, covers 140px and stills 48px. Preview and Download remain adjacent 44×44px controls at every width. Panel margins do not compound the grid gaps.

## Elevation & Depth

Dark tonal panels, one-pixel borders and source photographs establish depth over the full sky. Home images use `0 12px 36px rgba(0,0,0,.22)`; native dialogs use `0 30px 100px #0009` with a dimmed, 10px-blurred backdrop. Archive covers do not lift, scale or cast hover shadows; their image brightness can still respond to hover and focus.

**The Quiet Depth Rule.** Keep collection panels still and let tonal backing, borders and the actual sky carry depth.

## Shapes

Home photographs have 12px corners. Season cover photographs have 15px upper corners within the one-pixel border of a 16px panel; archive headings contain no portraits. COD stills use 8px corners and a 16:10 crop; SIX stills use 6px corners with the responsive ratios in `archive.css`. Archive controls use 8px corners, shelves and season panels 16px, and motion/final-download controls use pill shapes. Source badges remain in the archive markup but are visually suppressed. Photographs are contained rectangles rather than edge-dissolved or masked compositions.

## Components

### Actions and navigation

Ordinary archive Download controls use mint text, a translucent mint background and a mint border; All in one alone has a solid mint action at rest. Preview and Drive are transparent outlined controls. Buttons are at least 44px high; SIX uses 44×44px icon buttons with inline SVGs, native button semantics, explicit episode-specific accessible names and visually hidden text. The final download dialog action is a solid mint 48px pill. Motion is a 44×44px accessible toggle; its home background is transparent. Native anchors preserve modified-click navigation. Archive navigation and filters retain their selected state and a moving 2px mint underline.

### Collections and source facts

All seven COD packs and 18 SIX episode articles retain original IDs, search data, source facts and file actions. John Price contains three character packs plus the existing combined All in one file. Cutscenes exposes the three existing Google Drive campaign files independently. Only John Price has an All in one action; no campaign-wide chooser is present. SIX season covers use the existing source stills without text overlays; their headings and aggregate facts sit below. SIX retains duration/size beside every episode; the Season 1 Episode 5 multipart explanation remains visible. Search and filters update hidden and ARIA state immediately, hide empty groups and preserve the result count and empty state.

### Fields and dialogs

Search is a 260px-wide, 42px-high outlined field with an 8px radius and a mint focus border; it becomes full width on phones. Native dialogs retain multipart selection, immediate preview-to-download handoff, media cleanup, error/retry states, scene timestamp sharing and focus return. Ordinary dialog entry is 350ms; dismissal is 220ms. A new scene during dismissal cancels the stale close. Changed scene heading and screen feedback lasts 300ms. A transactional preview-to-download handoff closes the player before opening the file dialog.

### Photographic passage and sky

Only the chosen photograph travels. A fixed decorative frame expands from the current photo rectangle to the viewport in 300ms with `cubic-bezier(.32,0,.16,1)` and holds until document replacement. The destination creates its full-viewport frame before first paint, then fades that frame away over 400ms with `cubic-bezier(.16,1,.3,1)` to reveal the archive in place. A one-use six-second session record connects the documents. The main remains at opacity 1 with no page transform or clipping; direct loads show their content immediately without a photographic entrance or blur. Archive-to-home and archive-to-archive links navigate immediately; no destination portrait or reverse photographic morph is required.

Pause commits pending navigation immediately and removes the frame; reduced motion uses normal anchors. Escape before departure commits cancels travel and restores the link focus. Back restoration clears the frame and inert state. Storage failure leaves destination content visible. Filter movement uses 350ms; newly visible articles reveal over 400ms with at most five 30ms offsets, without an initial page stagger. Home image/color feedback uses 350ms; arrow color uses 180ms and shifts 4px. Action feedback uses 150ms colors and 120ms transforms, with a 100ms active press; reduced/manual motion disables travel/physical feedback and keeps brief color confirmation.

The actual shader keeps the established resting artwork. Hover/focus raises its target energy from .35 to .6; selection/filter changes can trigger a 1300ms pulse and energy 1.35. A separate one-use five-second record transfers actual shader time, energy and pulse progress; time advances by .735 units per second. Ambient work is capped at 30fps, or 20fps at 700px and below, and suspends for hidden documents, paused/reduced motion, open previews and context loss. Context restoration rebuilds the WebGL resources; unavailable WebGL exposes the static CSS sky. No shader entrance is run in v7.

## Do's and Don'ts

### Do:

- **Do** preserve the pinned AuroraGrab Night sky, palette and exact Segoe family stacks.
- **Do** keep both home choices equally clear with contained photographs and 40–56px names.
- **Do** keep John Price and Cutscenes as two shelves, with the existing All in one file beside the Price trilogy.
- **Do** keep the eight- and ten-episode season panels and adjacent 44×44px actions accessible.
- **Do** preserve all original media, metadata, download destinations and native interaction behavior.
- **Do** keep the photographic passage cancellable and the capped sky continuous across navigation.

### Don't:

- **Don't** restore oversized cinema lettering, full-window home photographs, intro blur, a clipped sky gate or whole-page fade/scale.
- **Don't** add a campaign-wide chooser, campaign All in one or an eighth COD pack.
- **Don't** reintroduce cover lift/scale, visible source badges or stacked margins between collection panels.
- **Don't** turn direct loading or browsing into an animation prerequisite.
- **Don't** present superseded ship verdicts or the retained seed as fresh aesthetic approval.
