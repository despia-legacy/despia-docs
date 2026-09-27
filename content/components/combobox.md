---
title: combobox
description: The native-control twin implements an editable ARIA combobox/listbox with filtering, keyboard navigation, option binding, selection, and disabled state.
order: 3
section: components
element: combobox
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"labelField","type":"string","default":"label"},{"name":"on:select","type":"action","default":null},{"name":"options","type":"csv","default":null},{"name":"optionsKey","type":"expr","default":null},{"name":"placeholder","type":"string","default":null},{"name":"valueField","type":"string","default":"id"}]
actions: ["select"]
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# combobox

The native-control twin implements an editable ARIA combobox/listbox with filtering, keyboard navigation, option binding, selection, and disabled state.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<combobox bind="dsx.variable.city" options="Berlin,Paris,Tokyo" placeholder="City"/>
```

`combobox` takes no children.

## Catalog specimen

`ComboboxDefault.dsx`, verbatim from the catalog:

```dsx
<combobox bind="dsx.variable.city" options="Berlin,Paris,Tokyo" placeholder="City" style="width: 100%">
  <head>
    <variable as="city">return ''</variable>
  </head>
</combobox>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: role=combobox, hover bg+border, type-ahead + ArrowDown + Enter writes 'Berlin', on:select once, listbox popup - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | Focus-driven results card: opens only while focused AND the query is non-empty AND matches exist, typing reopens after a pick, blur closes; on:select fires and focus resigns on pick; W9 disabled wrapper (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Combobox/swift/Combobox.swift:34-36 + DSXCombobox); CI-asserted open state (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift combobox activity + capture ui.ios.surface.combobox.open). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: unstyled path = REAL M3 ExposedDropdownMenuBox + editable M3 TextField anchor (PickerElements.kt combobox; SelectionControl.rendersSystem gate - SelectionSystemTest green): platform field focus/state layers; legacy card path byte-identical; disabled= in the contract; keystrokes write bind, row tap writes VALUE + on:select. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `bind` | `expr` |  |  |
| `color` | `color` | `var(--dsx-accent)` |  |
| `disabled` | `bool` | `false` |  |
| `disabled-if` | `expr` |  | Disabled when this expression is truthy. `disabled=` binds as TEXT, and the string "false" is TRUE - so a bound boolean belongs here, never there. |
| `labelField` | `string` | `label` |  |
| `on:select` | `action` |  |  |
| `options` | `csv` |  |  |
| `optionsKey` | `expr` |  |  |
| `placeholder` | `string` |  |  |
| `valueField` | `string` | `id` |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `select` | `on:select="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The native-control twin implements an editable ARIA combobox/listbox with filtering, keyboard navigation, option binding, selection, and disabled state.

**Known limits on the web**

- Options and label text are bounded for untrusted data.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-combobox`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `native-control`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | role=combobox + listbox options, full keyboard select; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | System TextField (placeholder announced) + result rows as real Buttons with text labels (resultsCard); operable end to end; CI drives the open card through the accessibility tree (app.buttons[Berlin], ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: M3 field + menu semantics on the system path; legacy result rows ride dsxAccessibleSelectable(Role.RadioButton) with selected state + Enter/Space (PickerElements.kt:292). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

