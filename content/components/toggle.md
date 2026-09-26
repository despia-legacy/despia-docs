---
title: toggle
description: The base Web twin uses a real checkbox input with switch semantics, bound state, change write-back, and accessible focus handling.
order: 3
section: components
element: toggle
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"on:change","type":"action","default":null}]
actions: ["change"]
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# toggle

The base Web twin uses a real checkbox input with switch semantics, bound state, change write-back, and accessible focus handling.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Also answers to `switch` - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<toggle bind="dsx.variable.dark"/>
```

`toggle` takes no children. The same element answers to `switch`.

## Catalog specimen

`ToggleDefault.dsx`, verbatim from the catalog:

```dsx
<toggle bind="dsx.variable.dark" style="width: 100%">
  <head>
    <variable as="dark">return false</variable>
  </head>
</toggle>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: role=switch input, Space flips bound store, knob track/thumb restyle, hover inner delta, focus ring; disabled= not in any renderer's grammar (button-family only) - filed as trinity grammar decision - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | The system switch (SwiftUI Toggle, labelsHidden, accent tint) owns on/off/pressed states; two-way bool via setBound; W9 disabled grammar (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Toggle/swift/Toggle.swift:14-20); CI-asserted on Catalyst: the desktop checkbox rendering flips the bound value (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift inspector matrix Toggle activity). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: unstyled path = the REAL M3 Switch (StackSystemControls.kt SystemControl gate - StackSystemControlsTest green): platform thumb/track state layers incl. disabled; legacy capsule dims 0.5 + gates gestures under disabled/disabled-if (StackInputViews.kt:180-197); on-device: DsxAccessibilityUiTest toggles it via semantics (assertIsOff -> performClick -> assertIsOn). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `bind` | `expr` |  |  |
| `color` | `color` | `var(--dsx-accent)` |  |
| `disabled` | `bool` | `false` |  |
| `disabled-if` | `expr` |  | Disabled when this expression is truthy. `disabled=` binds as TEXT, and the string "false" is TRUE - so a bound boolean belongs here, never there. |
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

The base Web twin uses a real checkbox input with switch semantics, bound state, change write-back, and accessible focus handling.

**Known limits on the web**

- Track/thumb chrome is a web-only iOS-26-ish capsule polyfill (63x28, pill thumb), glass-free and token-overridable (--dsx-toggle-*, color=). It is not a hosted UISwitch or Material switch; iOS and Android keep the platform control.

**Implementation notes.** on:change fires from setBound's write seam on actual change only (Toggle.swift:15). SYSTEM IDENTITY (system-defaults.md, the Android M3-identity wave): iOS renders the native UISwitch always (SwiftUI Toggle, tint= compatible - Toggle.swift:16-18); web renders the real <input type=checkbox role=switch> (elements.ts toggle) with a token-overridable iOS-26-ish capsule polyfill (63x28, pill thumb; --dsx-toggle-* / color=); Android renders the real M3 Switch when the element is FULLY unstyled (StackSystemControls.kt SystemControl.TOGGLE - bind + safe base only), at the Switch's own 52x32 metric with explicit role colors (selected onPrimary/primary, unselected outline/surfaceContainerHighest); ANY styling attr - color= included, the SystemButton word-less rule - ejects to the legacy 51x31 capsule byte-identically (the pinned geometry above IS that legacy path + the iOS metric). Android joining COMPLETES the three-renderer native-control parity for this element. Token slots: system track/thumb ride the platform's own switch roles, never re-specified here; colors.tint stays the legacy path's accent.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-toggle`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | input role=switch, a11yLabel, parts aria-hidden; Space operates; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | System switch semantics (on/off value + toggle action announced by the OS); the label is markup's job by contract (labelsHidden); CI flips it through the accessibility tree on Catalyst (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: dsxAccessibleToggle(Role.Switch) with ToggleableState + Enter/Space + focusable on the legacy capsule (StackInputViews.kt:188); the M3 Switch carries its own toggleable semantics; DsxAccessibilityUiTest asserts both toggle rows on-device. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

