---
title: Checkbox
description: The global Web twin uses a real checkbox input with bound state, label, change write-back, and keyboard/focus semantics.
order: 3
section: components
element: Checkbox
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"label","type":"string","default":null}]
actions: []
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# Checkbox

The global Web twin uses a real checkbox input with bound state, label, change write-back, and keyboard/focus semantics.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<Checkbox bind="dsx.variable.agree" label="I agree to the terms"/>
```

`Checkbox` takes no children.

## Catalog specimen

`CheckboxDefault.dsx`, verbatim from the catalog:

```dsx
<Checkbox bind="dsx.variable.agree" label="I agree to the terms" style="width: 100%">
  <head>
    <variable as="agree">return false</variable>
  </head>
</Checkbox>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: hover border delta (unchecked), Space toggles store, box check animates, focus ring, 44px row - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-19 | W12 red sweep 2026-08-19: the Catalyst arm now renders the PLATFORM control - a real SwiftUI Toggle through the same setBound seam (#if targetEnvironment(macCatalyst), Checkbox.swift CheckboxView) - because the same UITest run measured the kernel `<toggle>` (the platform checkbox) green while the composed .plain Button dropped pointer clicks; iOS/iPadOS keep the composed 44pt button unchanged. Compile-pending (Codemagic); the desktop control-matrix UITest re-measures the fix. Swift compile-pending (rides Codemagic); balance-checked 0/0/0. Verified by review pending the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: unstyled path renders the REAL M3 Checkbox in a toggleable row (ChoiceElements.kt M3 path, SelectionControl.CHECKBOX gate - SelectionSystemTest green, gradle :render:testDebugUnitTest run 2026-08-18: 292 tests, 1 failure (StackButtonsTest#systemButtonsDelegateTheirDefaultPalettesToMaterial3 - a stale source-grep of the pre-W9 disabled literal, not a behavior break)): platform state layer carries rest/pressed/focus/disabled; legacy path: dsxAccessibleToggle + checked/unchecked SF glyphs (ChoiceElements.kt:157); disabled= in the contract (ElementSpec Checkbox). |
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

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`Checkbox` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The global Web twin uses a real checkbox input with bound state, label, change write-back, and keyboard/focus semantics.

**Known limits on the web**

- The check glyph is CSS-drawn rather than an SF Symbol.

**Implementation notes.** Glyphs: checkmark.square.fill / square (Checkbox.swift:43).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-checkbox`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `global`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | real input semantics + label, Space operates; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | Explicit label + value (Checked/Unchecked) + isSelected through distinct subtrees (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Core/swift/Checkbox.swift:56-66); CI-asserted on iPad: value flips and the selected trait refreshes (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: dsxAccessibleToggle(Role.Checkbox) with ToggleableState + Enter/Space activation on the legacy row (ChoiceElements.kt:157, AccessibilityModifiers.kt); M3 path rides the toggleable row semantics; instrumented on-device: DsxAccessibilityUiTest asserts a checkbox row toggles via semantics (assertIsToggleable/On/Off). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

