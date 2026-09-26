---
title: ProgressRing
description: The global Web twin renders an accessible SVG progress ring with bound value/max, line width, colors, size, and label.
order: 3
section: components
element: ProgressRing
category: display
scope: library
platforms: web,ios,android
properties: [{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"label","type":"string","default":null},{"name":"lineWidth","type":"number","default":"10"},{"name":"max","type":"number","default":"1"},{"name":"size","type":"number","default":"88"},{"name":"trackColor","type":"color","default":"#2C2C2E"},{"name":"value","type":"number","default":"0"}]
actions: []
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# ProgressRing

The global Web twin renders an accessible SVG progress ring with bound value/max, line width, colors, size, and label.

<RefMeta platforms="Web,iOS,Android">
Category: Display - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<ProgressRing value="0.65" label="65%"/>
```

`ProgressRing` takes no children.

## Catalog specimen

`ProgressRingDefault.dsx`, verbatim from the catalog:

```dsx
<ProgressRing value="0.65" label="65%">
  <head/>
</ProgressRing>
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
| `color` | `color` | `var(--dsx-accent)` |  |
| `label` | `string` |  |  |
| `lineWidth` | `number` | `10` |  |
| `max` | `number` | `1` |  |
| `size` | `number` | `88` |  |
| `trackColor` | `color` | `#2C2C2E` |  |
| `value` | `number` | `0` |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`ProgressRing` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The global Web twin renders an accessible SVG progress ring with bound value/max, line width, colors, size, and label.

**Known limits on the web**

- Animation timing follows Web motion preferences and is not a pixel clone of SwiftUI.

**Implementation notes.** Arc starts at -90deg, rounded line cap, easeInOut animation (ProgressRing.swift:54-58).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical fluid presentation at both widths (data family page 390+1366, overflow 0); RTL page mirrors (ChatBubble sides flip: firstFromRight=0) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-progress-ring`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `global`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | role=progressbar + aria-valuenow=0.4 probed; axe 0 serious/critical on the data family page light (dark: text link finding filed separately) |
| ios | review | 2026-08-19 | W12 red sweep 2026-08-19: progress semantics landed - .accessibilityElement(children: .ignore) + label (center label, else Progress) + value '`<n>` percent' from the fraction (ProgressRing.swift ProgressRingView), the web progressbar twin. Swift compile-pending (rides Codemagic); balance-checked 0/0/0. Verified by review pending the iOS capture lane. |
| android | review | 2026-08-19 | W12 red sweep 2026-08-19: the ring exposes progress semantics - progressBarRangeInfo(fraction, 0..1) + contentDescription (authored label, else localized Progress) on the ring box (Displays.kt ProgressRingElement semantics), the web role=progressbar + aria-valuenow twin. gradle test green. Pending the Android capture lane. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

