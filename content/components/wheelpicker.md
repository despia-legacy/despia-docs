---
title: wheelpicker
description: A real drum to the shared spec (PickerElements.kt, which carries the UIPickerView metrics): a 216px scroll-snap wheel of 32px rows, the selection band behind the centre row, off-centre rows dimmed, drag/fling/trackpad momentum and snap from the scroller itself, tap-to-centre, arrow/Home/End keys on a listbox role, a settled snap writing through the bind seam once, and bound writes scrolling the drum.
order: 3
section: components
element: wheelpicker
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"label","type":"string","default":null},{"name":"labelField","type":"string","default":"label"},{"name":"options","type":"csv","default":null},{"name":"optionsKey","type":"expr","default":null},{"name":"valueField","type":"string","default":"id"}]
actions: []
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# wheelpicker

A real drum to the shared spec (PickerElements.kt, which carries the UIPickerView metrics): a 216px scroll-snap wheel of 32px rows, the selection band behind the centre row, off-centre rows dimmed, drag/fling/trackpad momentum and snap from the scroller itself, tap-to-centre, arrow/Home/End keys on a listbox role, a settled snap writing through the bind seam once, and bound writes scrolling the drum.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<wheelpicker bind="dsx.variable.city" options="Berlin,Paris,Tokyo"/>
```

`wheelpicker` takes no children.

## Catalog specimen

`WheelpickerDefault.dsx`, verbatim from the catalog:

```dsx
<wheelpicker bind="dsx.variable.city" options="Berlin,Paris,Tokyo" style="width: 100%">
  <head>
    <variable as="city">return 'Paris'</variable>
  </head>
</wheelpicker>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: always-visible select list, selection writes store (wheel=enterprise); browser-owned wheel chrome per element-support.json knownLimits - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | The system wheel picker (.pickerStyle(.wheel)) with two-way selection via setBound + W9 disabled grammar; Catalyst maps to the supported .menu style instead of trapping (documented in-file) (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/WheelPicker/swift/WheelPicker.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: the snapping drum: settled snap writes the VALUE through the bind seam, writing the bound var scrolls the drum; selection band behind the centre row, off-centre rows dim (PickerElements.kt wheelpicker - no gate, M3-token-dressed in every case, divergence pinned: M3 ships no wheel); disabled= in the contract. |
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
| `labelField` | `string` | `label` |  |
| `options` | `csv` |  |  |
| `optionsKey` | `expr` |  |  |
| `valueField` | `string` | `id` |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`wheelpicker` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

A real drum to the shared spec (PickerElements.kt, which carries the UIPickerView metrics): a 216px scroll-snap wheel of 32px rows, the selection band behind the centre row, off-centre rows dimmed, drag/fling/trackpad momentum and snap from the scroller itself, tap-to-centre, arrow/Home/End keys on a listbox role, a settled snap writing through the bind seam once, and bound writes scrolling the drum.

**Known limits on the web**

- Native selection haptics are platform chrome a browser does not expose; the drum is otherwise the full author contract.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-native-choice dsx-wheelpicker`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `native-control`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | native select list + aria-label; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | System picker-wheel semantics (adjustable rows announced by the OS); options resolve exactly like `<picker>` (CSV or bound list). ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/WheelPicker/swift/WheelPicker.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-19 | W12 red sweep 2026-08-19: the drum is operable without the wheel gesture - dsxAccessibleRange over the option indices (setProgress -> bind write -> the boundIndex effect spins the drum; arrow keys ride the same seam; stateDescription = the selected option's label) (PickerElements.kt WheelPickerView). gradle test green. Pending the Android capture lane. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

