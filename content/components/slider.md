---
title: slider
description: The base Web twin uses a real range input with binding, min/max, input write-back, and semantic tint styling.
order: 3
section: components
element: slider
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"max","type":"number","default":"1"},{"name":"min","type":"number","default":"0"},{"name":"on:change","type":"action","default":null}]
actions: ["change"]
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# slider

The base Web twin uses a real range input with binding, min/max, input write-back, and semantic tint styling.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<slider bind="dsx.variable.volume" min="0" max="1"/>
```

`slider` takes no children.

## Catalog specimen

`SliderDefault.dsx`, verbatim from the catalog:

```dsx
<slider bind="dsx.variable.volume" min="0" max="1" style="width: 100%">
  <head>
    <variable as="volume">return 0.5</variable>
  </head>
</slider>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: ArrowRight/End write bound store, :focus-visible thumb ring pixel-verified, hover/active thumb rules in skin - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | The system Slider with local-thumb drag + throttled bound writes + a final commit on release (BoundSlider, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Slider/swift/Slider.swift); W9 disabled grammar; system pressed/focus states; Catalyst CI-asserted (adjust writes the bound value, ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift inspector matrix). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: unstyled path = the REAL M3 Slider (StackSystemControls.kt SystemControl gate - StackSystemControlsTest green): platform thumb/track states incl. disabled; legacy track dims 0.5 + gates gestures under disabled/disabled-if (StackInputViews.kt:352-380). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `bind` | `expr` |  |  |
| `color` | `color` | `var(--dsx-accent)` |  |
| `disabled` | `bool` | `false` |  |
| `disabled-if` | `expr` |  | Disabled when this expression is truthy. `disabled=` binds as TEXT, and the string "false" is TRUE - so a bound boolean belongs here, never there. |
| `max` | `number` | `1` |  |
| `min` | `number` | `0` |  |
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

The base Web twin uses a real range input with binding, min/max, input write-back, and semantic tint styling.

**Known limits on the web**

- Track/thumb geometry and input cadence are browser controlled rather than UISlider internals.

**Implementation notes.** iOS renders the native UISlider; during drag the bound write is throttled ~12/s + final commit (Slider.swift:26-48). Android track/thumb metrics are internal chrome (StackInputViews.kt). SYSTEM IDENTITY (system-defaults.md, the Android M3-identity wave): iOS is the native UISlider always; web renders the real <input type=range> (elements.ts slider); Android renders the real M3 Slider when FULLY unstyled (StackSystemControls.kt SystemControl.SLIDER - bind/min/max + safe base; the degenerate range gets the iOS max(hi, lo+0.0001) epsilon), with explicit role colors (thumb/active track primary, inactive track surfaceContainerHighest); an authored color= (the track/thumb tint) EJECTS to the legacy drawn track byte-identically (pinned divergence: iOS tints its native control - the StackButtons precedent). Android joining COMPLETES the three-renderer native-control parity for this element.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-slider`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | range input with a11yLabel, keyboard steps, focus-visible thumb ring; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | System Slider adjustable semantics (VoiceOver increment/decrement; the Catalyst CI test adjusts through the accessibility API and the bound value changes, ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: dsxAccessibleRange: progressBarRangeInfo + setProgress + arrow-key adjustment + focusable (StackInputViews.kt:364, AccessibilityModifiers.kt:178); on-device DsxAccessibilityUiTest asserts the range semantics (ProgressBarRangeInfo import + Legacy slider node). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

