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
    fontFamily: 'Cinema, sans-serif'
    fontSize: "clamp(90px, 10vw, 160px)"
    fontWeight: 400
    lineHeight: 0.99
    letterSpacing: "-.025em"
  headline:
    fontFamily: 'Cinema, sans-serif'
    fontSize: "clamp(56px, 6.6vw, 96px)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-.02em"
  title:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "clamp(32px, 3.2vw, 44px)"
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: "-.03em"
  season-title:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "58px"
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: "-.03em"
  fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: "clamp(42px, 4.5vw, 62px)"
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: "-.03em"
  choice-prefix:
    fontFamily: 'Cinema, sans-serif'
    fontSize: ".52em"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-.025em"
  fontFamily: '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
    fontSize: ".44em"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "-.02em"
  pack-title:
    fontFamily: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif'
    fontSize: "21px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-.02em"
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
    fontSize: "21px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-.02em"
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
    backgroundColor: "{colors.mint}"
    textColor: "{colors.mint-ink}"
    typography: "{typography.action}"
    rounded: "6px"
    padding: "9px 11px"
    height: "44px"
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
    rounded: "6px"
    padding: "9px 11px"
    height: "44px"
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
    padding: "0"
    height: "44px"
    width: "44px"
  backgroundColor: "{colors.panel}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
    height: "38px"
  button-home-motion:
    backgroundColor: "rgba(2,6,11,.72)"
    textColor: "{colors.mint}"
    rounded: "{rounded.pill}"
    padding: "0"
    height: "44px"
    width: "44px"
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
    rounded: "0"
    padding: "0"
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

# Aurora Cinema

**Creative North Star: "Aurora Cinema"**

Two full-height photographed cinema screens lead directly to footage organized in film rows. The selected photograph expands to the viewport and settles into the collection header. AuroraGrab supplies the night palette, real procedural sky, quiet Segoe interface and light chapter headings; supplied Anton provides the cinematic destination voice.

**Key Characteristics:**

- Home is a binary full-window choice, with no introductory prose.
- Archive chapters replace thumbnail grids with horizontal footage rows.
- COD preserves three campaign files, three character files and the complete pack beside Price.
- SIX pairs distinct season artwork with eight and ten episode rows.
- One isolated photograph owns navigation; main content remains at opacity 1 without clipping.

## Colors

The original AuroraGrab Night tokens remain canonical. Real photographs retain their supplied colors. Home layers the real sky at 20% screen blend over the photographs; archives expose the full sky. Mint identifies actions and keyboard focus.

## Typography

Cinema is the supplied self-hosted Anton-Regular.ttf, licensed by the included OFL.txt. Home Duty is 90–160px, with a .52em Call of prefix; SIX is 132–240px. Mobile uses 60–88px / 88–128px. Archive names use 56–96px, 52px on phones and 44px at 360px. These intentional cinema title sizes exceed the generic display ceiling. Segoe remains the chapter and interface voice: chapter labels 44px, seasons 58px, footage titles 21px, action labels 12px. Archive headers and home labels are real text.

## Layout

Home uses two edge-to-edge equal columns, becoming two equal rows below 760px. Both choices fit a 320×640 viewport and short landscape. Labels sit near the lower outer corners. All parts of each screen are one native destination link.

Archive width caps at 1520px, with 40px side gutters and 20px on phones. The photographic collection header is 380px high, 350px on phones. Campaign and season chapters use a 280px heading/artwork column and a footage list. Each desktop row contains still, title, source facts and 44px actions. Below 1250px, facts sit under the title; below 980px, chapter introductions sit above rows. Mobile pairs a 112px still with title/facts and two full-width row actions beneath. Price's three rows sit beside the separate 320px complete-pack section; that section follows the trilogy below 980px. SIX season artwork remains visible beside each desktop list and becomes a compact chapter portrait on phones.

## Motion

On a direct home load, the source photographs resolve from a bounded lens blur in 1100ms, with an 80ms secondary offset. The sky starts in its settled state. On selection, one isolated fixed photograph expands from its actual link rectangle to the viewport in 420ms and holds through document loading. A one-use, six-second session record allows the destination to create the photograph before its first paint and settle it into its actual header rectangle in 560ms. The main stays visible beneath the photograph. The same journey returns the archive image to its home choice. Archive-to-archive navigation remains immediate. No cross-document View Transition dependency is shipped.

The animation uses Web Animations on one isolated frame. Shader time, pulse and energy keep their existing one-use sky transfer. Pause commits pending navigation immediately and clears the frame; reduced motion uses native links. Escape cancels departure and restores focus. Back restoration removes any frame and clears inert state. Storage failure leaves normal navigation and visible destination content. Ambient rendering remains capped at 30/20fps, suspending for hidden documents and previews.

## Components

Footage rows are semantic articles and retain every original action. Source badges are suppressed in the row layout because the visible source line names the content. Primary download actions are solid mint with dark text; secondary preview/provider actions remain dark outlined controls. The complete pack has one separate border surface. Native dialogs preserve video cleanup, errors, retry, part selection and focus return. Search, filters, result counts, source notes and SIX timestamp sharing retain their original behavior.

## Rules

**The Source Rule.** Keep real supplied photographs, all download metadata and original media specifications.

**The Contrast Rule.** Use dark photographic backing behind light titles; readable text never depends on aurora brightness.

**The Motion Rule.** Preserve ordinary anchors, pause, reduced motion, Escape cancellation and back restoration.

### Do:

- Keep the home to brand, motion control and two clear destination names.
- Use Segoe for chapter labels and interface text, supplied Anton for cinema headings.
- Preserve the actual resting aurora and its capped, suspended renderer.
- Keep Preview and Download immediately available in each footage row.

### Don't:

- Do not restore the rejected paired masked faces, card grids or clipped aurora gate.
- Do not invent media metadata, source claims or download destinations.
- Do not block content on a direct load or require an animation to navigate.
- Do not claim successful full streaming or large downloads from failure-state tests.
