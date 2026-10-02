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
    fontSize: "clamp(44px, 5.2vw, 72px)"
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: "-.035em"
  headline:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "clamp(38px, 4.4vw, 60px)"
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: "-.035em"
  collection-title:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "clamp(32px, 3.2vw, 45px)"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "-.03em"
  title:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "23px"
    fontWeight: 350
    lineHeight: 1.5
    letterSpacing: "-.02em"
  pack-title:
    fontFamily: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif'
    fontSize: "15px"
    fontWeight: 550
    lineHeight: 1.4
    letterSpacing: "-.01em"
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
    fontSize: "11px"
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
  section: "36px"
  wide: "64px"
components:
  button-primary:
    backgroundColor: "{colors.action-mint-bg}"
    textColor: "{colors.mint}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "9px 11px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.mint-ink}"
  button-secondary:
    backgroundColor: "{colors.action-bg}"
    textColor: "{colors.ink}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "9px 11px"
    height: "40px"
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
  collection-door:
    backgroundColor: "{colors.panel-strong}"
    rounded: "{rounded.panel}"
    height: "392px"
  dialog:
    backgroundColor: "{colors.dialog-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
---

# Design System: Ocean’s Scenepacks

## Overview

**Creative North Star: "AuroraGrab Night"**

Ocean’s Scenepacks carries the user-pinned AuroraGrab 3.0 reference into a browser archive: a navy-black sky, green aurora curtains with violet upper light, sharp stars, dark mountain ridges, and reflected water. Light Segoe headings and mint actions sit above this atmosphere. The sky is decorative; supplied character and episode stills remain the visual evidence for the footage.

The world is quiet, spacious, and precise. Translucent blue-black controls preserve the night beneath them, while photographic surfaces and modal players provide stronger local contrast. The reference explicitly determines the Segoe families, light display weights, palette, and aurora grammar; this is the pinned-reference exemption to a generic instruction to replace familiar system typography.

**Key Characteristics:**

- A procedural northern sky behind real source stills.
- Light Segoe display lettering with compact Segoe text controls.
- Mint actions, pale text, and restrained translucent borders.
- Rounded media surfaces and pill-shaped global or final actions.
- Ambient motion that stops for accessibility preferences, manual pause, and preview playback.

## Colors

The palette places a luminous mint accent against a deep blue-black field. The frontmatter records the reused color values from `site.css`; the sidecar’s tonal strips are synthesized preview metadata, not additional shipping CSS tokens.

### Primary

- **Aurora Mint** (`mint`): download actions, the active navigation line, selected filters, focus outlines, the brand mark, and the small headline full stop.
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

- **Display** (`display`): home headline; balanced wrapping, light weight, and close tracking. It resolves to (56px) at widths up to (1100px), (46px) up to (760px), and (42px) up to (400px).
- **Headline** (`headline`): collection heading. Mobile overrides use (43px), then (35px) at the narrowest breakpoint.
- **Collection title** (`collection-title`): names on the photographic collection doors; mobile uses (37px).
- **Title** (`title`): catalog group headings; mobile uses (22px).
- **Pack title** (`pack-title`): episode and campaign titles; mobile uses (13px).
- **Body** (`body`): general copy. Home supporting text uses (16px) with a line height of (1.7), then (14px) on mobile. Source-note paragraphs are limited to (72ch) with the same relaxed line height.
- **Label and action** (`label`, `action`): source facts, navigation support, and buttons. Shipping small text bottoms out at (11px). Time and file-size rows use tabular numerals.
- **Preview title:** light display text at `clamp(24px, 3vw, 36px)`, line height (1.2), and tracking (-.025em). The download heading uses (30px) at weight (300).

**The Reference Type Rule.** Preserve the declared Segoe stacks and light display hierarchy when extending this world; the user-pinned app reference is the visual authority.

## Layout

Shared page chrome and content align to a centered container capped at (1280px). Desktop gutters are (48px) per side, changing to (32px) at (1100px) and (20px) at (760px). The document supports a minimum width of (320px).

The system uses generous page spacing and compact local controls. Reused steps are recorded in frontmatter. Header height starts at (100px). At (760px), the header wraps into a brand-and-motion row plus a full-width navigation row, with a minimum combined height of (116px). The active navigation line moves from (24px) above the header base to (8px) above the mobile navigation base.

Photographic collection surfaces use a two-column grid of (1.18fr / 1fr) with a (24px) gap; at (760px) they become a single column with an (18px) gap. Door minimum height is (392px), (430px) above (1600px), (370px) up to (1100px), and (340px) on mobile.

Catalog grids use four columns with gaps of (28px / 22px), three columns up to (1100px), and two columns up to (760px) with gaps of (25px / 14px). Images keep a (16:9) cover ratio. Card actions stack on mobile and increase from a (40px) minimum height to (42px). The toolbar wraps at the mobile breakpoint; search becomes full width.

Collection portraits scale from (224 × 130px) to (114 × 106px), then (90 × 96px) at (400px). The preview dialog has a desktop media-and-sidebar grid with a (260px) sidebar. At (760px), that sidebar moves below the player; its episode list becomes a horizontally scrollable strip of (148px) items. Preview width changes from a (1280px) cap with (24px) side clearance to (10px) side clearance. Download dialogs cap at (520px).

Preserve semantic page structure: a skip link to the single main region, labeled navigation, heading levels, labeled collection sections, archive articles, real links for page navigation, native buttons for state changes, and native dialogs for previews and download choices. Filter buttons expose `aria-pressed`; result counts use a polite status region. The decorative sky and SVG icons are hidden from assistive technology. Source stills on collection doors have descriptive alternative text; thumbnails alongside labeled archive titles are decorative.

## Elevation & Depth

Depth comes from the sky, photographic overlays, translucent surfaces, and sparse hairline borders. Regular archive cards remain open against the page rather than acquiring independent panel shadows. The collection doors and modal dialogs provide the two structural shadow treatments.

### Shadow Vocabulary

- **Collection surface** (`0 18px 60px rgba(0,0,0,.24)`): separates the large photographic doors from the sky.
- **Modal surface** (`0 30px 100px #0009`): lifts preview and download dialogs over the page.
- **Thumbnail feedback** (`0 8px 26px rgba(0,0,0,.45)`): appears only on hover or keyboard focus while the cover lifts.
- **Modal backdrop:** `rgba(1,4,9,.72)` with a (10px) backdrop blur.

**The Local Contrast Rule.** Place dark local backing and gradients behind readable content; the aurora never supplies the contrast required by a label or control.

## Shapes

Control corners use the frontmatter’s `control` radius. Desktop thumbnails and collection portraits use `media`; mobile grid thumbnails reduce to `control`. Large collection doors and dialogs use `panel`. Tiny episode thumbnails use `thumbnail`, cover labels use `badge`, and loading-state labels use `status`. Motion controls and final download actions use the `pill` radius.

Thin borders structure navigation dividers, search fields, actions, and dialog chrome. Media clips to its rounded bounds. The brand is a small inline wave mark; other icons are inline strokes, with filled play triangles for preview actions.

## Components

### Buttons

Card download actions use a mint wash and edge with mint lettering; hover fills them with mint and switches the lettering to Mint Ink. Secondary preview and external-file actions use Action Glass and Control Edge. Both use compact padding and the action type role. Desktop minimum height is (40px); mobile is (42px).

Final download and multipart-choice actions use solid mint, pill corners, a (48px) minimum height, and (13px) semibold text. The final action brightens on hover. Disabled buttons reduce opacity to (.45). Focus uses a (2px) mint outline with a (3px) offset for controls; ordinary links use a (5px) offset.

### Navigation and Filters

Navigation uses muted (14px) text, a pale current state, and a mint underline. Mobile navigation uses (13px). Filters are native buttons with a (44px) minimum height; one mint marker travels between selections in (350ms). The filter group remains keyboard reachable and conveys state with `aria-pressed`. Without JavaScript the original per-control underline identifies selection.

### Search Fields

Search pairs a small inline magnifier with a labeled search input, Search Glass, Control Edge, and control corners. The wrapper has a (42px) minimum height. Focus changes the wrapper border to mint. Input text is (13px), the caret is mint, and placeholders use Distant Mist.

### Tags and Source Details

Small cover tags identify scene packs or cutscenes on a dark translucent backing. Larger source badges on collection doors use pill corners. Source notes use native `details` and `summary`, a compact chevron, and relaxed paragraph spacing; opening rotates the chevron through (180deg).

### Archive Cards and Collection Doors

Use the supplied stills in `img/cod`, `img/six`, `img/price.jpg`, and `img/joe.jpg`. Preserve the authored focal-point crops, lazy loading on catalog thumbnails, intrinsic image dimensions, and high-priority loading on leading collection imagery. These are source images, not generated artwork; shipping image provenance belongs in the project’s asset record.

Archive cards show title, source facts, duration, file size, and independent preview/download actions. The photographic collection door is an actual page link with a dark vertical gradient beneath its text. Its image scales to (1.035) and gains slight saturation on hover or keyboard focus. Archive thumbnails use the same scale with a slight brightness increase.

The signature interface transition carries the real John Price or Joe Graves photograph from its home door into the collection portrait in (600ms), using native same-origin view transitions. The remaining page changes with a (200ms) fade; the sky and header keep steady snapshots, with the sky explicitly beneath page content. Browsers without this feature keep ordinary navigation. Direct home entry reveals the two doors with a bounded crop and a (70ms) separation. Archive entry reveals only the first visible packs in (500ms), with a (30ms) stagger capped at (150ms); it never replays on scroll or competes with a native page transition.

Filtering reads each card's current visual position, updates visibility and counts synchronously, then bridges visible cards to their new layout in (350ms). Newly included visible packs enter in (400ms). Rapid changes cancel the preceding motion before taking over. Fine-pointer hover and keyboard focus lift the thumbnail by (3px) with a soft offset shadow; control press uses scale (.97). None of these states delay an action.

### Preview and Download Dialogs

Native modal dialogs use Player Night, panel corners, and a blurred backdrop. Preview chrome keeps a visible close button and retains the native video controls. The SIX player also exposes episode, season, part, playback-speed, timestamp, and share-link controls. Download dialogs surface the selected file or separate multipart choices. Closing returns focus to the connected opener.

Dialog entry resolves opacity, (10px) vertical travel and scale (.985) in (350ms), with a (300ms) backdrop fade. User dismissal takes (220ms), with a faster (180ms) veil fade; Esc, the close control and backdrop all use the same path. Video pauses at dismissal start, and native closure releases sources and restores focus. Preview-to-download closes immediately and opens the selected file action without an exit delay. Episode or part changes briefly resolve the heading and screen in (300ms).

Loading, buffering, unavailable-preview, and download-error messages remain legible on a dark local surface. A failed preview preserves access to the original download. Keep the preview’s (16:9) frame and contain the video rather than crop its contents.

### Aurora and Motion Control

The sky uses the procedural curtain and seeded Lofoten ridges adapted from the AuroraGrab 3.0 reference. A WebGL canvas renders drifting curtains and water reflection; a separate 2D canvas draws deterministic stars, three dark ridge layers, and ridge reflections. The background veil keeps content readable.

The shader is timer-paced to at most (30 fps) on desktop and (20 fps) at widths up to (700px). Render targets use half the CSS resolution on desktop and (.35) of the capped width on mobile, with CSS width capped at (2400px) for this calculation. The detail canvas caps pixel ratio at (1.5) on desktop and (1) on mobile. Desktop pointer movement supplies slight parallax; mobile omits it. A pulse is available through the implemented aurora event, with a (1300ms) sweep.

The motion button exposes its pressed state and labels itself “Motion on” or “Motion paused”. Manual choice is stored as `oceans-motion` when local storage is available. Device reduced-motion takes precedence and disables the button with an explanatory title. Manual pause freezes the sky, cancels pending Web Animations, skips shared-photo transitions, and completes an in-progress dismissal immediately. Both paused and reduced-motion paths remove spatial travel and smooth scrolling while keeping (100ms) control color feedback. Default HTML content stays visible without JavaScript or animation support. The sky stops while a preview is open, while the document is hidden, and on page exit. Its retained frame remains visible when animation is disabled.

The WebGL renderer requests low-power operation, falls back to medium shader precision if needed, and exposes the static CSS sky when WebGL is unavailable or its context is lost. Restoration reinitializes the renderer. The static gradient and detail layers remain the fallback atmosphere.

## Do's and Don'ts

### Do:

- **Do** preserve the AuroraGrab 3.0 reference’s night palette, light Segoe hierarchy, and procedural northern sky.
- **Do** use supplied source stills and preserve focal-point crops, image dimensions, and loading priorities.
- **Do** keep mint for action, selection, and focus while source facts use neutral text.
- **Do** preserve the documented mobile grid, full-width search, stacked actions, and preview episode strip.
- **Do** retain native semantics, labeled controls, visible focus, live result feedback, and dialog focus return.
- **Do** honor manual pause, device reduced-motion, hidden-document suspension, and the shader frame-rate limits.

### Don't:

- **Don't** replace the pinned Segoe hierarchy with a new display font.
- **Don't** place essential labels directly on the aurora without dark local contrast.
- **Don't** replace source footage imagery with generated character art.
- **Don't** crop the video playback frame or merge distinct source-quality specifications into one generic claim.
- **Don't** increase ambient rendering frequency or add motion that bypasses the motion preference.
- **Don't** turn the unboxed catalog cards into a separate shadowed panel for every archive item.
