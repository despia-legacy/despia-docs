---
title: spinner
description: The base Web twin provides an accessible status spinner with semantic color/scale styling and reduced-motion handling.
order: 3
section: components
element: spinner
category: display
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"color","type":"color","default":"var(--dsx-secondary-label)"}]
actions: []
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# spinner

The base Web twin provides an accessible status spinner with semantic color/scale styling and reduced-motion handling.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Display - Also answers to `activity` - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<spinner style="color: white"/>
```

`spinner` takes no children. The same element answers to `activity`.

## Catalog specimen

`SpinnerDefault.dsx`, verbatim from the catalog:

```dsx
<spinner>
  <head/>
</spinner>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | n/a | 2026-08-18 | Non-interactive display/layout surface: no rest/hover/pressed/focus/disabled axis (value-driven rendering is data, not interaction state; Skeleton IS the loading state). |
| ios | n/a | 2026-08-18 | Non-interactive display/layout surface: no rest/hover/pressed/focus/disabled axis (value-driven rendering is data, not interaction state; Skeleton IS the loading state). |
| android | n/a | 2026-08-18 | Non-interactive display/layout surface: no rest/hover/pressed/focus/disabled axis (value-driven rendering is data, not interaction state; Skeleton IS the loading state). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `color` | `color` | `var(--dsx-secondary-label)` |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`spinner` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The base Web twin provides an accessible status spinner with semantic color/scale styling and reduced-motion handling.

**Known limits on the web**

- It is DSX CSS-rendered rather than a browser-native progress indicator; authored scale is bounded to 0.25x through 4x to contain hostile remote markup.

**Implementation notes.** SYSTEM IDENTITY (system-defaults.md, the Android M3-identity wave): iOS renders the native ProgressView always - untinted when no color is authored, .tint(color) otherwise (SpinnerElement.swift); web is the .dsx-spinner control; Android renders the real M3 CircularProgressIndicator when unstyled OR color-only (StackSystemControls.kt SystemControl.SPINNER). THE TINT DECISION (stated): an authored color rides the M3 component as its indicator color - the compatible tint, the iOS ProgressView().tint twin - it never ejects the system rendering; every other styling attr (scale= included, it rides the style chain) ejects to the legacy 270-degree arc byte-identically. Metrics follow the cross-platform contract (the StackButtons iconSize precedent): the M3 indicator renders at the fixture's 20dp/2dp stroke, not M3's native 40dp. Uncolored = the component's own theme color (M3 primary - the platform's own choice; iOS's untinted spinner is ITS gray, which colors.tint above pins for the legacy path). Android joining COMPLETES the three-renderer parity for this element.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical fluid presentation at both widths (data family page 390+1366, overflow 0); RTL page mirrors (ChatBubble sides flip: firstFromRight=0) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-spinner`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | a11yLabel announced, stays visible under reduced motion; axe 0 serious/critical on the data family page light (dark: text link finding filed separately) |
| ios | review | 2026-08-18 | The system ProgressView announces its own progress semantics (the OS's in-progress element). ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Spinner/swift/SpinnerElement.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: the unstyled system path renders M3 CircularProgressIndicator with the platform progress semantics (StackSystemControls.kt); CAVEAT named: the legacy authored arc (StackInputViews.kt SpinnerView) exposes no semantics. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

