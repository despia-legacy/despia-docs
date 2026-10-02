---
title: stars
description: The rich Web twin renders fractional SVG star fills with read-only or radiogroup semantics, binding, and keyboard selection.
order: 3
section: components
element: stars
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"#FFCC00"},{"name":"count","type":"number","default":"5"},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"readonly","type":"bool","default":"false"},{"name":"size","type":"number","default":"24"}]
actions: []
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# stars

The rich Web twin renders fractional SVG star fills with read-only or radiogroup semantics, binding, and keyboard selection.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<stars bind="dsx.variable.rating" count="5"/>
```

`stars` takes no children.

## Catalog specimen

`StarsDefault.dsx`, verbatim from the catalog:

```dsx
<stars bind="dsx.variable.rating" count="5" style="width: 100%">
  <head>
    <variable as="rating">return 3</variable>
  </head>
</stars>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: role=radio star buttons, ArrowRight raises rating to 4, rides .dsx-button hover/press treatment, focus ring - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | Interactive stars are real Buttons (44pt targets, hover highlight, W9 disabled grammar, selected trait via distinct subtrees); readonly renders ONE combined value element; partial fills render via mask (DSXStars, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Stars/swift/Stars.swift); CI-asserted: Rating 4 of 5 tap writes 4 + selected refresh (iPad + Catalyst, ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: tap on cell i writes i+1 through the bind seam unless readonly; fractional fills clamp(value-index,0,1) render halves; disabled= in the contract (RatingElements.kt). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `bind` | `expr` |  |  |
| `color` | `color` | `#FFCC00` |  |
| `count` | `number` | `5` |  |
| `disabled` | `bool` | `false` |  |
| `disabled-if` | `expr` |  | Disabled when this expression is truthy. `disabled=` binds as TEXT, and the string "false" is TRUE - so a bound boolean belongs here, never there. |
| `readonly` | `bool` | `false` |  |
| `size` | `number` | `24` |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`stars` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The rich Web twin renders fractional SVG star fills with read-only or radiogroup semantics, binding, and keyboard selection.

**Known limits on the web**

- Count and size are bounded to protect DOM and layout.

**Implementation notes.** Cell fill fraction = clamp(value - index, 0, 1); tap writes i+1 via setBound (Stars.swift:38-41).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-stars`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `rich`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | role=radio buttons 'n of 5 stars', arrow keys; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | Per-star labels (Rating i of n) + isSelected on the current value; readonly reads as ONE Rating element with accessibilityValue (children .ignore) (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Stars/swift/Stars.swift); CI drives stars by label. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: dsxAccessibleRange over the whole row: progressBarRangeInfo + setProgress (TalkBack adjustable) + arrow keys (RatingElements.kt:72). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

