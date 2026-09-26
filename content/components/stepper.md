---
title: stepper
description: The base Web twin provides the visible label caption, named decrement/value/increment controls, semantic tint, fixture-default bounds, bound numeric updates and press-and-hold acceleration.
order: 3
section: components
element: stepper
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"label","type":"string","default":null},{"name":"max","type":"number","default":"100"},{"name":"min","type":"number","default":"0"},{"name":"on:change","type":"action","default":null},{"name":"step","type":"number","default":"1"}]
actions: ["change"]
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# stepper

The base Web twin provides the visible label caption, named decrement/value/increment controls, semantic tint, fixture-default bounds, bound numeric updates and press-and-hold acceleration.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<stepper bind="dsx.variable.qty" min="1" max="10" label="Quantity"/>
```

`stepper` takes no children.

## Catalog specimen

`StepperDefault.dsx`, verbatim from the catalog:

```dsx
<stepper bind="dsx.variable.qty" min="1" max="10" label="Quantity" style="width: 100%">
  <head>
    <variable as="qty">return 1</variable>
  </head>
</stepper>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | rest/active/disabled discipline held from w8; the filed fine-pointer hover gap CLOSED: .dsx-stepper-btn hover rides the button family's fill wash (globals.ts), probed live (backgroundColor changes on hover, fine pointer 1680); disabled=/disabled-if force both halves beyond the min/max clamp and release reactively (probed) - w9 Chromium probe (compileComponent->bootDsx, full skin incl. globals/native/data sheets), scratchpad/w9/density-probe.mjs, shots/w9-density-controls.png + -390.png |
| ios | review | 2026-08-18 | The system Stepper (plus/minus, clamped min...max by step, two-way number via setBound) + W9 disabled grammar (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Stepper/swift/Stepper.swift); system pressed/repeat states; Catalyst CI asserts presence + bound publishing (inspector matrix; activation asserted only as far as the platform's observed behavior supports, documented there). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: M3 path: two FilledTonalIconButtons with the value between them; a button disables at its clamp edge (StepperElements.kt header; SelectionControl.STEPPER); legacy 94x32 chrome dims the glyph 35% at the edge; disabled= in the contract; range guard mirrors Swift (max(hi, lo+step)). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `bind` | `expr` |  |  |
| `color` | `color` | `var(--dsx-accent)` |  |
| `disabled` | `bool` | `false` |  |
| `disabled-if` | `expr` |  | Disabled when this expression is truthy. `disabled=` binds as TEXT, and the string "false" is TRUE - so a bound boolean belongs here, never there. |
| `label` | `string` |  |  |
| `max` | `number` | `100` |  |
| `min` | `number` | `0` |  |
| `on:change` | `action` |  | Fires when the bound value changes. |
| `step` | `number` | `1` |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `change` | `on:change="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The base Web twin provides the visible label caption, named decrement/value/increment controls, semantic tint, fixture-default bounds, bound numeric updates and press-and-hold acceleration.

**Known limits on the web**

- Press-and-hold repeat is pointer driven (500 ms hold, then repeats accelerating from 240 ms to a 60 ms floor); a held keyboard Enter uses the platform's own key repeat and deliberately does not double-step.
- The caption element only exists when label= is authored, so an unlabelled stepper keeps the bare minus/value/plus anatomy the native control shows.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-stepper`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | labelled +/- buttons keyboard-operable, value readout; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | System Stepper increment/decrement semantics with the authored label (Text label, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Stepper/swift/Stepper.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: increment/decrement are activations (dsxAccessibleActivation, StepperElements.kt:182) that respect the clamp edges; the current value renders as text between them on the M3 path. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

