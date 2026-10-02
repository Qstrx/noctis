---
name: "Ocean’s Scenepacks — AuroraGrab Night"
description: "A scene archive beneath the northern sky of the AuroraGrab 3.0 reference."
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
  action-bg: "rgba(3,9,13,.58)"
  action-mint-bg: "rgba(111,245,191,.09)"
  action-mint-line: "rgba(111,245,191,.26)"
  search-bg: "rgba(2,9,13,.62)"
  dialog-bg: "#071016"
  mint-hover: "#a0ffd9"
typography:
  display:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "clamp(68px, 7.4vw, 96px)"
    fontWeight: 300
    lineHeight: 0.98
    letterSpacing: "-.035em"
  headline:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "clamp(42px, 4.8vw, 68px)"
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: "-.035em"
  title:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "clamp(32px, 3.2vw, 44px)"
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: "-.03em"
  season-title:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "clamp(42px, 4.5vw, 62px)"
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: "-.03em"
  choice-prefix:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: ".44em"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "-.02em"
  pack-title:
    fontFamily: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif'
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-.01em"
  body:
    fontFamily: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif'
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  cod-pack-title:
    fontFamily: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif'
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-.01em"
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
rounded:
  thumbnail: "4px"
  badge: "5px"
  status: "6px"
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
  dialog: "28px"
  chapter: "32px"
  section: "36px"
  wide: "64px"
  catalog-section: "84px"
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
    backgroundColor: "{colors.action-bg}"
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
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
    height: "38px"
  button-home-motion:
    backgroundColor: "transparent"
    textColor: "{colors.mint}"
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
  filter:
    textColor: "{colors.muted}"
    padding: "12px 0"
    height: "44px"
  media-tag:
    backgroundColor: "rgba(2,8,12,.82)"
    textColor: "#d0e1e0"
    rounded: "{rounded.badge}"
    padding: "4px 7px"
  pack-cover:
    backgroundColor: "{colors.panel-strong}"
    rounded: "{rounded.media}"
  home-choice:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.panel}"
    padding: "0"
  dialog:
    backgroundColor: "{colors.dialog-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
---

# Design System: Ocean’s Scenepacks

## Overview

**Creative North Star: "AuroraGrab Night"**

Ocean’s Scenepacks carries the user-pinned AuroraGrab 3.0 reference into a browser archive: a navy-black sky, green aurora curtains with violet upper light, sharp stars, dark mountain ridges, and reflected water. Light Segoe headings and mint actions sit above this atmosphere. The sky is decorative; supplied character and episode stills remain the visual evidence for the footage.

The world is quiet, spacious, and precise. Photographs dissolve into the real sky instead of ending in visible boxes; prominent destination names give the home a clear choice. Archive chapters and translucent controls provide readable structure. Selecting a destination closes a passage between two polar light fronts and reopens it onto the archive; the aurora’s clock continues between pages. This browser transition adapts the source app’s progress-coupled light-front principle. The reference determines the Segoe families, light display weights, palette, and aurora grammar; this is the pinned-reference exemption to a generic instruction to replace familiar system typography.

**Key Characteristics:**

- A procedural northern sky behind real source stills.
- Light Segoe display lettering with compact Segoe text controls.
- Mint actions, pale text, and restrained translucent borders.
- Dissolved photographic compositions, large destination names, and distinct archive chapters.
- A polar-curtain passage coupled to the continuous northern sky.
- Ambient motion that stops for accessibility preferences, manual pause, and preview playback.

## Colors

The palette places a luminous mint accent against a deep blue-black field. The frontmatter records the reused color values from `site.css`; the sidecar’s tonal strips are synthesized preview metadata, not additional shipping CSS tokens.

### Primary

- **Aurora Mint** (`mint`): download actions, the active archive navigation line, selected filters, home-choice feedback, focus outlines, the brand mark, and the collection heading full stop.
- **Mint Ink** (`mint-ink`): text and icons on solid mint buttons and text selections.
- **Mint Hover** (`mint-hover`): the brighter hover of the final download action.
- **Mint Wash and Mint Edge** (`action-mint-bg`, `action-mint-line`): the quiet default treatment for card download buttons before hover resolves them to solid mint.

### Neutral

- **Night Sky** (`sky-bg`): the page background and dark base beneath the procedural scene.
- **Frost Ink** (`ink`): primary text and current navigation.
- **Mist Text** (`muted`): descriptions, metadata, unselected controls, and footer copy.
- **Distant Mist** (`faint`): placeholder text, result counts, and separators.
- **Night Glass** (`panel`) and **Deep Night Glass** (`panel-strong`): translucent controls and the backing beneath source imagery.
- **Quiet Edge** (`line`) and **Control Edge** (`line-strong`): dividers and control borders.
- **Action Glass**, **Search Glass**, and **Player Night** (`action-bg`, `search-bg`, `dialog-bg`): local surfaces for actions, searching, and modal reading.

**The Mint State Rule.** Use mint to identify an action, selected state, or focus target; keep descriptive copy in the pale neutral text colors.

## Typography

**Display Font:** Segoe UI Variable Display, Segoe UI, system-ui, sans-serif.
**Body Font:** Segoe UI Variable Text, Segoe UI, system-ui, sans-serif.

**Character:** Light display lettering reflects the AuroraGrab 3.0 reference. The browser uses installed Segoe when available and the declared system fallback otherwise; this build does not embed a Segoe font file. Controls and archive facts use a compact, readable text stack. The inherited Anton font asset is not used by the new stylesheet.

### Hierarchy

- **Display** (`display`): the large “Duty” and “SIX” destination names. Mobile uses `clamp(58px, 17vw, 80px)`; short landscape uses (60px). “Call of” sits above “Duty” in the smaller `choice-prefix` role with a (7px) lower margin. These are the intentional type relationships of the current compositions.
- **Headline** (`headline`): collection heading. Mobile overrides use (43px), then (35px) at the narrowest breakpoint.
- **Title** (`title`): Campaign cutscenes and John Price chapter headings; mobile uses (34px), narrowing to (30px) at (400px). “All in one” uses (32px) on desktop, (40px) up to (1100px), then the mobile chapter scale.
- **Season title** (`season-title`): the prominent Season 1 and Season 2 headings; mobile uses (36px), then (32px) at (400px).
- **Pack title** (`pack-title`, `cod-pack-title`): SIX episode titles use (16px), then (15px) on mobile. Call of Duty titles use (18px), rising to (20px) in the single-column mobile layout; its complete-pack title uses (17px) on desktop.
- **Body** (`body`): archive descriptions and dialog copy. Source-note paragraphs are limited to (72ch) with a relaxed line height of (1.7).
- **Label and action** (`label`, `action`): source facts, navigation support, and buttons. Shipping small text bottoms out at (11px). Time and file-size rows use tabular numerals.
- **Preview title:** light display text at `clamp(24px, 3vw, 36px)`, line height (1.2), and tracking (-.025em). The download heading uses (30px) at weight (300).

**The Reference Type Rule.** Preserve the declared Segoe stacks and light display hierarchy when extending this world; the user-pinned app reference is the visual authority.

## Layout

Archive page chrome and content align to a centered container capped at (1280px). Desktop gutters are (48px) per side, changing to (32px) at (1100px) and (20px) at (760px). The document supports a minimum width of (320px).

The archive uses generous page spacing and compact local controls. Reused steps are recorded in frontmatter. Archive header height starts at (100px). At (760px), it wraps into a brand-and-motion row plus a full-width navigation row, with a minimum combined height of (116px). The active navigation line moves from (24px) above the header base to (8px) above the mobile navigation base.

The home remains a literal two-choice view: the Ocean’s brand and an icon-only motion control above two equal photographed links labeled “Call of Duty” and “SIX”. Its main region caps at (1440px), with an (88px) header and (16px / 52px) upper/lower padding. The composition grid reaches (680px) high and uses two equal columns with a gap of `clamp(36px, 6vw, 96px)`. At (1100px), its gap is (36px). Each entire composition is a hit area; visible imagery dissolves through intersecting vertical and horizontal masks.

At (760px), the home header is (72px); equal rows stack without an inter-row gap, within the remaining viewport and a (760px) composition-height cap. Main lower padding is (32px). Labels align to the outer content edges; their photographs shift right beneath them. At heights up to (540px) with widths of at least (560px), the header is (64px), choices return to equal columns with a (36px) gap, and lower padding is (24px). The home contains no counts, descriptions, duplicated navigation, or footer.

Call of Duty uses three explicit sections: Campaign cutscenes (3 packs), John Price (3 packs), and the adjacent All in one complete pack (1 file). Campaign and character trilogies use three equal columns with (28px) gaps. Below the campaign chapter, the character trilogy and complete pack use a (3fr / 1fr) layout with a (244px) minimum complete-pack column, a (36px) gap, and (84px) upper spacing. A quiet divider and (28px) inset separate the complete pack. Up to (1100px), that pack moves below the trilogy into a two-column heading-and-media composition. Up to (760px), all Call of Duty packs become one column with (36px) gaps, the complete pack follows its chapter heading, and preview/download actions remain side by side. Hidden chapters collapse their surrounding layout during filtering.

SIX uses two prominent season chapters containing (8) and (10) episodes. Their headings pair source totals with a supplied season still. Episode grids use four columns with gaps of (36px / 24px), three columns up to (1100px), then two columns with gaps of (32px / 16px) on mobile, narrowing to a (14px) column gap at (400px). Chapters are separated by (84px), reducing to (64px) on mobile. Season stills use (288 × 132px), then (112 × 112px), and (96 × 104px) at (400px). SIX actions stack on mobile. All archive card actions use a (44px) minimum height. The toolbar wraps on mobile and search becomes full width.

Archive covers retain (16:9) framing, except the adjacent desktop complete-pack cover, which uses (1.25) before returning to (16:9) at (1100px). Catalog lower padding is (84px), or (56px) on mobile.

Collection portraits scale from (224 × 130px) to (114 × 106px), then (90 × 96px) at (400px). The preview dialog has a desktop media-and-sidebar grid with a (260px) sidebar. At (760px), that sidebar moves below the player; its episode list becomes a horizontally scrollable strip of (148px) items. Preview width changes from a (1280px) cap with (24px) side clearance to (10px) side clearance. Download dialogs cap at (520px).

Preserve semantic page structure: a skip link to the single main region, labeled navigation, heading levels, labeled collection sections, archive articles, real links for page navigation, native buttons for state changes, and native dialogs for previews and download choices. The home has a visually hidden heading and a labeled navigation region containing the two destination links. Their photographs are decorative because the visible collection names label each link. Filter buttons expose `aria-pressed`; result counts use a polite status region. The decorative sky and SVG icons are hidden from assistive technology. Collection portraits have descriptive alternative text; archive thumbnails alongside labeled titles are decorative.

## Elevation & Depth

Depth comes from the sky, masked photographic edges, translucent surfaces, and sparse hairline borders. Home compositions have no backing panel or box shadow; a restrained text shadow anchors their large names. Archive cards remain open against the page; only their active cover feedback gains a local shadow. Modal dialogs provide the structural lifted surface.

### Shadow Vocabulary

- **Modal surface** (`0 30px 100px #0009`): lifts preview and download dialogs over the page.
- **Thumbnail feedback** (`0 8px 26px rgba(0,0,0,.45)`): appears only on hover or keyboard focus while the cover lifts.
- **Destination lettering** (`0 3px 18px rgba(0,0,0,.65)`): a text shadow beneath the home names.
- **Modal backdrop:** `rgba(1,4,9,.72)` with a (10px) backdrop blur.

**The Local Contrast Rule.** Place dark local backing and gradients behind readable content; the aurora never supplies the contrast required by a label or control.

## Shapes

Control corners use the frontmatter’s `control` radius. Call of Duty covers, desktop SIX covers, portraits, and season stills use `media`; mobile SIX covers reduce to `control`. Dialogs and the home link hit areas use `panel`, but the home’s photographic edges dissolve through masks. Tiny player episode thumbnails use `thumbnail`, cover labels use `badge`, and loading-state labels use `status`. Motion controls and final download actions use the `pill` radius. Home arrows sit in circular outlines.

Thin borders structure navigation dividers, search fields, actions, and dialog chrome. Media clips to its rounded bounds. The brand is a small inline wave mark; other icons are inline strokes, with filled play triangles for preview actions.

## Components

### Buttons

Card download actions use a mint wash and edge with mint lettering; hover fills them with mint and switches the lettering to Mint Ink. The complete-pack action is solid mint at rest and brightens on hover. Secondary preview and external-file actions use Action Glass and Control Edge. All archive card actions use compact padding, the action type role, and a (44px) minimum height.

Final download and multipart-choice actions use solid mint, pill corners, a (48px) minimum height, and (13px) semibold text. The final action brightens on hover. Disabled buttons reduce opacity to (.45). Focus uses a (2px) mint outline with a (3px) offset for controls; ordinary links use a (5px) offset.

The home motion control is an icon-only (44 × 44px) button with a transparent resting surface. Pause and play icons switch with state; the accessible action reads “Pause animations” or “Resume animations”. A visually hidden state label retains “Motion on” / “Motion paused”.

### Navigation and Filters

Archive navigation uses muted (14px) text, a pale current state, and a mint underline. Mobile navigation uses (13px). Filters are native buttons with a (44px) minimum height; one mint marker travels between selections in (350ms). The filter group remains keyboard reachable and conveys state with `aria-pressed`. Without JavaScript the original per-control underline identifies selection. The home’s two photographed destination links are its collection navigation.

### Search Fields

Search pairs a small inline magnifier with a labeled search input, Search Glass, Control Edge, and control corners. The wrapper has a (42px) minimum height. Focus changes the wrapper border to mint. Input text is (13px), the caret is mint, and placeholders use Distant Mist.

### Tags and Source Details

Small archive cover tags identify scene packs or cutscenes on a dark translucent backing. Source notes use native `details` and `summary`, a compact chevron, and relaxed paragraph spacing; opening rotates the chevron through (180deg).

### Archive Cards and Home Choices

Use the supplied stills in `img/cod`, `img/six`, `img/price.jpg`, and `img/joe.jpg`. Preserve the authored focal-point crops, lazy loading on catalog thumbnails, intrinsic image dimensions, and high-priority loading on leading collection imagery. These are source images, not generated artwork; shipping image provenance belongs in the project’s asset record.

Archive cards show title, source facts, duration, file size, and independent preview/download actions. Archive thumbnails scale to (1.035) with a slight brightness increase during hover or keyboard focus.

Home choices use the real Price and Graves photographs as frameless compositions with only the destination name and a circular arrow. Intersecting masks dissolve the top, bottom, and side edges into the actual sky. Images rest at brightness (.8), saturation (.8), and scale (1.025); hover, keyboard focus, or selection resolves them to full brightness and saturation at scale (1.065). Image scale resolves in (700ms), filters in (400ms), the arrow travels (4px) in (400ms), its color/border responds in (200ms), and the thin mint line extends in (450ms). Arrow circles are (48px), or (44px) on mobile. Focus uses a (2px) mint outline with an (8px) offset, reducing to (4px) on mobile.

The signature navigation is a polar-curtain passage. The main stays at opacity (1) and has no navigation transform. Instead, left and right clipping boundaries converge on the chosen link’s horizontal center in (400ms), while two temporary shader light fronts track those boundaries. The closed mask holds until the destination document replaces the page. A valid transferred arrival opens the clipping window in (520ms), in step with the real aurora. Both use the source app’s easing. The sky and header remain outside the mask.

During departure the main becomes inert, repeat activation is ignored, and Escape cancels the mask and gate while restoring focus. Back-cache restoration exposes the loaded view immediately. Pause or reduced-motion cancels spatial effects and commits pending navigation immediately. Direct loads keep main content visible without an entry animation. Ordinary links remain the fallback without a ready WebGL renderer, Web Animations, or enabled motion; modified clicks retain native browser behavior.

Filtering reads each card's current visual position, updates visibility and counts synchronously, then bridges visible cards to their new layout in (350ms). Newly included visible packs enter in (400ms). Rapid changes cancel the preceding motion before taking over. Fine-pointer hover and keyboard focus lift the thumbnail by (3px) with a soft offset shadow; control press uses scale (.97). None of these states delay an action.

### Preview and Download Dialogs

Native modal dialogs use Player Night, panel corners, and a blurred backdrop. Preview chrome keeps a visible close button and retains the native video controls. The SIX player also exposes episode, season, part, playback-speed, timestamp, and share-link controls. Download dialogs surface the selected file or separate multipart choices. Closing returns focus to the connected opener.

Dialog entry resolves opacity, (10px) vertical travel and scale (.985) in (350ms), with a (300ms) backdrop fade. User dismissal takes (220ms), with a faster (180ms) veil fade; Esc, the close control and backdrop all use the same path. Video pauses at dismissal start, and native closure releases sources and restores focus. Preview-to-download closes immediately and opens the selected file action without an exit delay. Episode or part changes briefly resolve the heading and screen in (300ms).

Loading, buffering, unavailable-preview, and download-error messages remain legible on a dark local surface. A failed preview preserves access to the original download. Keep the preview’s (16:9) frame and contain the video rather than crop its contents.

### Aurora and Motion Control

The sky uses the procedural curtain and seeded Lofoten ridges adapted from the AuroraGrab 3.0 reference. A WebGL canvas renders drifting curtains and water reflection; a separate 2D canvas draws deterministic stars, three dark ridge layers, and ridge reflections. The background veil keeps content readable.

The shader is timer-paced to at most (30 fps) on desktop and (20 fps) at widths up to (700px). Render targets use half the CSS resolution on desktop and (.35) of the capped width on mobile, with CSS width capped at (2400px) for this calculation. The detail canvas caps pixel ratio at (1.5) on desktop and (1) on mobile. Desktop pointer movement supplies slight parallax; mobile omits it. The completed background retains its established shader palette, seeded stars, ridges, and reflection.

Initial home entry uses the source app’s layered sky arrival: curtain opacity takes (1400ms); stars take (1500ms) after (150ms); the three ridge layers take (1100ms) after (250 / 380 / 510ms) and rise from (34 / 46 / 58px); reflected ridges take (1000ms) after (650ms). The introduction finishes at (1650ms). Layers are cached once per resize and composited within the existing renderer. Archive entry and valid transferred arrivals skip this sky introduction.

Resting energy is (.35), focused home-choice energy is (.6), and initial-intro target energy is (1.25) for its first (1500ms). Changed archive filters trigger the existing (1300ms) left-to-right wave at energy of at least (1.35). Navigation instead uses the coupled polar light fronts. Their contribution is zero when the gate is at rest, preserving the approved ordinary background. This adaptation follows the AuroraGrab 3.0 reference’s `paint.progress()` principle: a visible light front follows interface progress, with reduced-motion respected.

Before navigation, a one-use session transfer records shader time, energy, pulse progress, and gate origin/bounds. The next page accepts records up to (5000ms) old, advances the shader clock by elapsed navigation time, and reopens the gate around the same horizontal origin using its own main bounds. Unavailable storage falls back to each page’s independent sky and visible content.

The motion button exposes its pressed state and retains “Motion on” or “Motion paused” as its state label. Manual choice is stored as `oceans-motion` when local storage is available. Device reduced-motion takes precedence and disables the button with an explanatory title. Pausing cancels pending Web Animations and completes an in-progress dismissal or navigation immediately. Both paused and reduced-motion paths remove spatial travel and smooth scrolling while keeping (100ms) control color feedback. They finish an in-progress sky introduction and return energy to (.35). Default HTML content stays visible without JavaScript or animation support. The sky stops while a preview is open, while the document is hidden, and on page exit; the retained frame remains visible when animation is disabled.

The WebGL renderer requests low-power operation, falls back to medium shader precision if needed, and exposes the static CSS sky when WebGL is unavailable or its context is lost. Restoration reinitializes the renderer. The static gradient and detail layers remain the fallback atmosphere.

## Do's and Don'ts

### Do:

- **Do** preserve the AuroraGrab 3.0 reference’s night palette, light Segoe hierarchy, and procedural northern sky.
- **Do** use supplied source stills and preserve focal-point crops, image dimensions, and loading priorities.
- **Do** keep the home limited to its brand, motion icon, and two labeled photographed destinations.
- **Do** keep mint for action, selection, and focus while source facts use neutral text.
- **Do** preserve the documented mobile grid, full-width search, stacked actions, and preview episode strip.
- **Do** retain native semantics, labeled controls, visible focus, live result feedback, and dialog focus return.
- **Do** honor manual pause, device reduced-motion, hidden-document suspension, and the shader frame-rate limits.
- **Do** couple the clipping passage to temporary fronts in the real aurora and carry sky/gate state between pages.
- **Do** preserve the three Call of Duty sections and two prominent SIX season chapters.

### Don't:

- **Don't** replace the pinned Segoe hierarchy with a new display font.
- **Don't** place essential labels directly on the aurora without dark local contrast.
- **Don't** replace source footage imagery with generated character art.
- **Don't** crop the video playback frame or merge distinct source-quality specifications into one generic claim.
- **Don't** increase ambient rendering frequency or add motion that bypasses the motion preference.
- **Don't** turn the unboxed catalog cards into a separate shadowed panel for every archive item.
- **Don't** reintroduce home descriptions, counts, duplicate links, a footer, per-card page-entry choreography, or a photograph flying into the collection portrait.
- **Don't** replace the curtain passage with a whole-main fade, scale, or translation, or leave gate light in the resting sky.
