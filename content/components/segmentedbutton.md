---
title: segmentedButton
description: The data-control twin implements single or multiple segmented selection, labels/icons, binding, keyboard traversal, and accessibility state.
order: 3
section: components
element: segmentedButton
category: input
scope: library
platforms: web,ios,android
properties: [{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"icons","type":"csv","default":null},{"name":"multiple","type":"bool","default":"true"},{"name":"options","type":"csv","default":null}]
actions: []
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# segmentedButton

The data-control twin implements single or multiple segmented selection, labels/icons, binding, keyboard traversal, and accessibility state.

<RefMeta platforms="Web,iOS,Android">
Category: Input - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<segmentedButton bind="dsx.variable.tools" options="Bold,Italic" multiple="true"/>
```

`segmentedButton` takes no children.

## Catalog specimen

`SegmentedButtonDefault.dsx`, verbatim from the catalog:

```dsx
<segmentedButton bind="dsx.variable.tools" options="Bold,Italic" multiple="true" style="width: 100%">
  <head>
    <variable as="tools">return ['Bold']</variable>
  </head>
</segmentedButton>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: single-select radiogroup mode, click selects + writes store, item hover rule (data-controls.ts), focus ring, selected state styling - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | Multi/single-select toggle segments: selected fill + on-tint label, isSelected add/remove per segment through distinct subtrees, group disabled, order-stable CSV write-back (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/SegmentedButton/swift/SegmentedButton.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: the Material connected MULTI-select: M3 Multi/SingleChoiceSegmentedButtonRow on the system path (SelectionSystem.kt table; ChoiceElements.kt segmentedButton); legacy custom row byte-identical (SEG_* metrics from SegmentedButton.swift); selection CSV two-way; disabled= in the contract. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `bind` | `expr` |  |  |
| `color` | `color` | `var(--dsx-accent)` |  |
| `disabled` | `bool` | `false` |  |
| `disabled-if` | `expr` |  | Disabled when this expression is truthy. `disabled=` binds as TEXT, and the string "false" is TRUE - so a bound boolean belongs here, never there. |
| `icons` | `csv` |  |  |
| `multiple` | `bool` | `true` |  |
| `options` | `csv` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`segmentedButton` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The data-control twin implements single or multiple segmented selection, labels/icons, binding, keyboard traversal, and accessibility state.

**Known limits on the web**

- Option and icon lists are bounded and normalized.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-segmented`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `data`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | role=radiogroup (single) / group (multiple) + aria-label; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | Each segment is a labeled Button with isSelected exposed through distinct subtrees + hover highlight (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/SegmentedButton/swift/SegmentedButton.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: segments ride dsxAccessibleToggle (multiple=true) / dsxAccessibleSelectable (single) with per-segment state (ChoiceElements.kt:379,386). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

