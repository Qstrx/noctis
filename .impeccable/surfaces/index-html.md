---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["cod.html","six.html"]
---

# Aurora archive redesign

Scope: index.html, cod.html and six.html. Home is Experience; collection pages are Operate.

## Direction contract

THESIS: The scene archive lives under the same northern sky as AuroraGrab 3.0. Real character footage leads the home; a searchable library leads each collection.

OWN-WORLD: The user-pinned AuroraGrab Night world: navy-black sky, green aurora curtains, sharp stars, dark ridges, translucent blue-black panels, mint actions, light Segoe display lettering and calm 350ms transitions.

STORY: Choose John Price or Joe Graves, find the right game or episode, preview original footage, download the exact file. Preserve all source notes and split-file choices.

FIRST VIEWPORT: A restrained navigation bar above a left-aligned light headline. Home presents two large photographic collection doors with character names, source facts and explicit links. Collection pages place a character still beside the title and source specifications, then tabs and search immediately above a responsive thumbnail library.

FORM: User-pinned app reference overrides concept selection. Code-led translation of the supplied app implementation, not a generated image comp. Signature interaction: the AuroraGrab ribbon drifts continuously behind the library and freezes instantly with the motion control; panel imagery gently resolves on hover.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Interface motion follow-up

The approved Aurora background remains unchanged. The focal moment is the actual John Price or Joe Graves photograph moving from its home collection door into the archive portrait during native navigation. Direct entry uses one bounded composition reveal; archives reveal only the first visible packs, without repeated scroll choreography.

Continuity: shared photograph transitions, one sliding filter underline, and a short FLIP rearrangement when search or filters change. Visibility and result counts update synchronously, even when a prior animation is interrupted.

Feedback: a 350ms player entrance, a faster 220ms dismissal, a brief scene-change confirmation, and source-sized image/action hover and press responses. Preview-to-download remains an immediate transaction. Focus restoration and video cleanup remain attached to native dialog closure.

Budget: retain AuroraGrab's cubic-bezier(.2,.8,.2,1), 150/350ms control timings and capped 30ms pack stagger. No dependencies, additional loops, scroll observers, or background effects. Content is visible without JavaScript. Manual pause and reduced motion cancel pending spatial animations and preserve immediate state changes and quick color feedback.
