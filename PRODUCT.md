# Ocean’s Scenepacks

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Editors looking for John Price footage from Call of Duty and Joe Graves footage from SIX.

## Product Purpose

Let visitors find, preview and download original scene packs for their edits, without signing in.

## Capabilities and Constraints

Keep the static HTML/CSS/JavaScript architecture and GitHub Pages compatibility. Home, Call of Duty and SIX remain three separate pages. Preserve all seven Call of Duty packs, 18 SIX episodes, multipart downloads, source notes, existing file URLs and SIX timestamp sharing. Call of Duty is 60 fps; SIX is 1080p at 24 fps. These are distinct source specifications.

Home contains the Ocean’s brand, an accessible motion icon and two equally clear photographed links: Call of Duty and SIX. Contained images, 40–56px light Segoe names and the visible actual sky make the choice quiet and direct. Archive details live on the collection pages.

Call of Duty has two sections: John Price with MW I, II, III and the adjacent existing All in one pack; Cutscenes with only the three original campaign files. The combined All in one file belongs only to John Price. SIX uses two season panels with distinct source photographs above their headings, containing eight and ten episode rows with duration/size and adjacent accessible Preview/Download icons. Both archives begin with a compact breadcrumb, collection name and source quality facts; there is no introductory portrait or description block.

## Brand Commitments

The pinned AuroraGrab 3.0 reference remains the authority for the Night palette, real northern sky, light Segoe typography and quiet controls. The user-directed v7 archive headings and illustrated season panels build on the clearer v6 shelves and restrained home. The large archive introductions and campaign-wide chooser are removed at the user’s request. Preserve real source imagery, original file destinations, source facts and the English Ocean’s archive identity. Retain existing surface seed provenance `9b05bce6` without implying a new world selection or aesthetic approval.

## Evidence on Hand

`archive-data.js` contains original download metadata. `img/cod`, `img/six`, `img/price.jpg` and `img/joe.jpg` contain supplied scene stills. The AuroraGrab 3.0 reference source and verified screenshots establish the Night world. Current layout and motion are implemented in `home.css`, `archive.css`, `motion.js`, `motion.css` and `aurora.js`; DESIGN.md documents those actual values.

## Product Principles

- Footage and downloads lead the experience.
- Home presents one clear choice between the two collections.
- Source quality and file facts are visible before downloading.
- Browsing works on phones and with a keyboard.
- A 300ms departing home photograph and 400ms fade reveal its archive in place while preserving immediate direct access, archive navigation, pause, reduced motion, Escape and back restoration.
- The real sky retains its artwork, continuous time/pulse transfer and 30/20fps caps.
