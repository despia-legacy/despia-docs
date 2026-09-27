---
title: progress
description: The base Web twin provides an accessible determinate progressbar with clamped bound value and semantic track/fill styling.
order: 3
section: components
element: progress
category: display
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"height","type":"number","default":"4"},{"name":"value","type":"number","default":"0"}]
actions: []
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# progress

The base Web twin provides an accessible determinate progressbar with clamped bound value and semantic track/fill styling.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Display - Also answers to `capsuleProgress` - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<progress bind="dsx.variable.pct" style="height: 6px; min-height: 6px"/>
```

`progress` takes no children. The same element answers to `capsuleProgress`.

## Catalog specimen

`ProgressDefault.dsx`, verbatim from the catalog:

```dsx
<progress bind="dsx.variable.pct" style="width: 100%; height: 6px">
  <head>
    <variable as="pct">return 0.4</variable>
  </head>
</progress>
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
| `bind` | `expr` |  | Progress value. |
| `color` | `color` | `var(--dsx-accent)` | Fill tint (track = 20% of it). |
| `height` | `number` | `4` | Bar thickness. |
| `value` | `number` | `0` | Static value if no `bind`. |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`progress` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The base Web twin provides an accessible determinate progressbar with clamped bound value and semantic track/fill styling.

**Known limits on the web**

- The Web control is DSX-drawn rather than the platform's native progress component.

**Implementation notes.** SYSTEM IDENTITY (system-defaults.md, the Android M3-identity wave): iOS draws a custom capsule (this fixture's geometry - Progress.swift); web is the role=progressbar .dsx-progress control; Android renders the real M3 LinearProgressIndicator when unstyled or color-only (StackSystemControls.kt SystemControl.PROGRESS), determinate from bind=/value= clamped 0..1, at the fixture height 6 (the cross-platform metric rule - M3's native 4dp yields to the contract). THE TINT RULE matches the spinner (stated, consistent): an authored color= is the M3 indicator color and keeps this fixture's tint@0.2 track relationship (trackOpacity - Progress.swift:19); uncolored rides the component's own colors (primary + its own track). height= and every other styling attr eject to the legacy capsule byte-identically. Android joining COMPLETES the three-renderer parity for this element.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical fluid presentation at both widths (data family page 390+1366, overflow 0); RTL page mirrors (ChatBubble sides flip: firstFromRight=0) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-progress`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | role=progressbar + aria-valuenow probed; axe 0 serious/critical on the data family page light (dark: text link finding filed separately) |
| ios | review | 2026-08-19 | W12 red sweep 2026-08-19: progress semantics landed - .accessibilityElement(children: .ignore) + label Progress + value '`<n>` percent' from the 0..1 value (Progress.swift ProgressElement), the web progressbar twin. Swift compile-pending (rides Codemagic); balance-checked 0/0/0. Verified by review pending the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: the unstyled system path renders M3 LinearProgressIndicator, which carries the platform progress semantics (StackSystemControls.kt); CAVEAT named: the legacy authored path (StackInputViews.kt ProgressView) exposes no range semantics - port progressBarRangeInfo when the capture lane audits it. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

