---
title: picker
description: The native-control twin uses a real select control with static/bound options, labels, disabled state, and value write-back.
order: 3
section: components
element: picker
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"label","type":"string","default":null},{"name":"labelField","type":"string","default":"label"},{"name":"on:change","type":"action","default":null},{"name":"options","type":"csv","default":null},{"name":"optionsKey","type":"expr","default":null},{"name":"valueField","type":"string","default":"id"}]
actions: ["change"]
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# picker

The native-control twin uses a real select control with static/bound options, labels, disabled state, and value write-back.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<picker bind="dsx.variable.plan" options="Weekly,Monthly,Yearly" label="Plan"/>
```

`picker` takes no children.

## Catalog specimen

`PickerDefault.dsx`, verbatim from the catalog:

```dsx
<picker bind="dsx.variable.plan" options="Weekly,Monthly,Yearly" label="Plan" style="width: 100%">
  <head>
    <variable as="plan">return 'Weekly'</variable>
  </head>
</picker>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: native select with label, hover bg+border, selectOption writes store (plan=pro), focus ring - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | System Picker in the menu style (accent tint) with OS pressed/open states; two-way String selection via setBound; W9 disabled grammar (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Picker/swift/Picker.swift:29,34-35); CI-asserted open (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift picker activity: options present + capture ui.ios.surface.picker.open; Catalyst inspector selects High from the system menu). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: unstyled path: tap opens the REAL M3 DropdownMenu with a trailing tint checkmark on the selection (PlainPickerElements.kt `<picker>`; SelectionControl.rendersSystem - SelectionSystemTest green); legacy UIMenu-metric platter byte-identical; trigger shows the selected label + chevron glyph; disabled= gates. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `bind` | `expr` |  | The selected value. |
| `color` | `color` | `var(--dsx-accent)` | Menu tint (`picker` only). |
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

The native-control twin uses a real select control with static/bound options, labels, disabled state, and value write-back.

**Known limits on the web**

- Presentation and menu chrome are browser/OS controlled; options are bounded.

**Implementation notes.** pickerStyle(.menu). `<segmented>` shares this builder with .segmented style.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-native-choice dsx-picker`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `native-control`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | native select + aria-label; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | System Picker semantics (label + current value announced; options are native menu items); CI drives it through the accessibility tree (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: trigger dsxAccessibleActivation(Role.Button) (PlainPickerElements.kt:221,255); option rows dsxAccessibleSelectable with selected state (PlainPickerElements.kt:280). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

