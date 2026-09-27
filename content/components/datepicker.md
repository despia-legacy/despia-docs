---
title: datepicker
description: The native-control twin uses browser date/time controls with normalized DSX wire values, label, color, disabled state, and write-back.
order: 3
section: components
element: datepicker
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"label","type":"string","default":null},{"name":"mode","type":"enum","default":"date","values":["date","time","datetime"]},{"name":"on:change","type":"action","default":null}]
actions: ["change"]
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# datepicker

The native-control twin uses browser date/time controls with normalized DSX wire values, label, color, disabled state, and write-back.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Also answers to `date` - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<datepicker bind="dsx.variable.when" mode="date" label="Date"/>
```

`datepicker` takes no children. The same element answers to `date`.

## Catalog specimen

`DatepickerDefault.dsx`, verbatim from the catalog:

```dsx
<datepicker bind="dsx.variable.when" mode="date" label="Date" style="width: 100%">
  <head>
    <variable as="when">return ''</variable>
  </head>
</datepicker>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: date input segments, fill+change writes ISO to store (when=2026-09-01), keyboard segment entry - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | System DatePicker (date/time/datetime components) with two-way ISO binding through setBound + W9 disabled grammar (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/DatePicker/swift/DatePicker.swift); system pressed/focus/disabled states; CI-asserted: the compact field opens the calendar surface with month navigation (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift datepicker activity, DatePicker.Show value January 2026). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: value pills open the REAL M3 DatePickerDialog / M3 TimePicker in an AlertDialog on the unstyled path, the framework android.app dialogs on the legacy path (DateElements.kt header; SelectionControl.rendersSystem gate); pill activation via dsxAccessibleActivation (DateElements.kt:337); disabled= in the contract; ISO-8601 writes through the bind seam. |
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
| `mode` | `date` \| `time` \| `datetime` | `date` |  |
| `on:change` | `action` |  | Fires when the bound value changes. |

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

The native-control twin uses browser date/time controls with normalized DSX wire values, label, color, disabled state, and write-back.

**Known limits on the web**

- Picker presentation and locale chrome are browser/OS controlled.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-datepicker`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `native-control`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | native date input + label association; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | System DatePicker semantics (adjustable date parts; the labeled Show control is CI-queried by identifier and value). ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/DatePicker/swift/DatePicker.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: pill activation semantics (dsxAccessibleActivation Role.Button, DateElements.kt:337) + the M3 date/time dialogs' own accessibility. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

