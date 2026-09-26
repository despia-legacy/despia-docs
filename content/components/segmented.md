---
title: segmented
description: The rich Web twin provides an accessible radiogroup with static/bound options, selection write-back, and arrow/Home/End keyboard behavior.
order: 3
section: components
element: segmented
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"bind","type":"expr","default":null},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"label","type":"string","default":null},{"name":"labelField","type":"string","default":"label"},{"name":"on:change","type":"action","default":null},{"name":"options","type":"csv","default":null},{"name":"optionsKey","type":"expr","default":null},{"name":"valueField","type":"string","default":"id"}]
actions: ["change"]
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# segmented

The rich Web twin provides an accessible radiogroup with static/bound options, selection write-back, and arrow/Home/End keyboard behavior.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<segmented bind="dsx.variable.range" options="Day,Week,Month"/>
```

`segmented` takes no children.

## Catalog specimen

`SegmentedDefault.dsx`, verbatim from the catalog:

```dsx
<segmented bind="dsx.variable.range" options="Day,Week,Month" style="width: 100%">
  <head>
    <variable as="range">return 'Week'</variable>
  </head>
</segmented>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: option hover inner delta, pressed bg+transform on option, ArrowRight moves selection, sliding indicator, focus ring - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | The system segmented control (.pickerStyle(.segmented)): selection/pressed states OS-owned; two-way String selection via setBound; W9 disabled grammar (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Picker/swift/Picker.swift:29,33-34). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: unstyled path = the REAL M3 SingleChoiceSegmentedButtonRow (SelectionSystem.kt gate table; PlainPickerElements.kt `<segmented>`): platform selected/pressed states; legacy segmented platter byte-identical; selection is single-select two-way through the bind seam. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `bind` | `expr` |  | The selected value. |
| `disabled` | `bool` | `false` |  |
| `disabled-if` | `expr` |  | Disabled when this expression is truthy. `disabled=` binds as TEXT, and the string "false" is TRUE - so a bound boolean belongs here, never there. |
| `label` | `string` |  | DRAWN and announced. Since 2026-09-17 (`architecture/adr/0002-despia-ui-words.md`, row 30) a `picker` with a label draws it above the field as well as carrying it as the accessible name, which is what both reference systems do and what the web previously did not: the attribute reached the accessibility tree alone, so a sighted author who wrote one saw nothing and typed a caption beside the control. Write `a11yLabel` instead when the name should be announced and not drawn. The same change landed on `RadioGroup` (row 31). |
| `labelField` | `string` | `label` |  |
| `on:change` | `action` |  |  |
| `options` | `csv` |  | Static/interpolated: `options="Weekly,Monthly,Yearly"`. |
| `optionsKey` | `expr` |  | Bound options list; `valueField` / `labelField` pick the fields (default `id` / `label`). |
| `valueField` | `string` | `id` |  |

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

The rich Web twin provides an accessible radiogroup with static/bound options, selection write-back, and arrow/Home/End keyboard behavior.

**Known limits on the web**

- Chrome is neutral DSX Web styling rather than a cloned native segmented control.

**Implementation notes.** Native segmented control (pickerStyle(.segmented), Picker.swift:30,37).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-segmented`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `rich`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | arrow-key selection, labelled group, focus ring; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | System segmented control semantics (segments announced with selection state by the OS). ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Picker/swift/Picker.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: segments ride dsxAccessibleSelectable with selected state + Enter/Space (PlainPickerElements.kt:187); the M3 row carries its own semantics on the system path. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

