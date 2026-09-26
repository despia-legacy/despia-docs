---
title: rangeslider
description: The native-control twin implements two bounded range inputs with normalized low/high constraints, throttled write-back, final commit, and accessible labels.
order: 3
section: components
element: rangeslider
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"a11yHighLabel","type":"string","default":"Upper value"},{"name":"a11yLowLabel","type":"string","default":"Lower value"},{"name":"bindHigh","type":"expr","default":null},{"name":"bindLow","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"max","type":"number","default":"1"},{"name":"min","type":"number","default":"0"},{"name":"on:change","type":"action","default":null},{"name":"step","type":"number","default":null}]
actions: ["change"]
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# rangeslider

The native-control twin implements two bounded range inputs with normalized low/high constraints, throttled write-back, final commit, and accessible labels.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<rangeslider bindLow="dsx.variable.min" bindHigh="dsx.variable.max" min="0" max="100"/>
```

`rangeslider` takes no children.

## Catalog specimen

`RangesliderDefault.dsx`, verbatim from the catalog:

```dsx
<rangeslider bindLow="dsx.variable.low" bindHigh="dsx.variable.high" min="0" max="100" style="width: 100%">
  <head>
    <variable as="low">return 20</variable>
    <variable as="high">return 80</variable>
  </head>
</rangeslider>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: two labelled thumbs (Lower/Upper value), ArrowRight steps low thumb +5, focus-visible thumb ring pixel-verified, thumbs clamp - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | Dual-thumb drag with local-state thumbs + throttled bound writes + a final commit; overlap resolution selects low/high by first horizontal intent and locks it; system cancellation resets via @GestureState; disabled gates writes and .disabled (DSXRangeSlider, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/RangeSlider/swift/RangeSlider.swift); CI-asserted: equal thumbs separate in BOTH directions on iPad (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift testIPadFoundationEqualRangeThumbsCanSeparateInBothDirections) + Catalyst bounds publish. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: unstyled path = the REAL M3 RangeSlider over the same two bound vars (RangeSliderElements.kt; SelectionControl.RANGESLIDER): platform thumb/track states; legacy dual-thumb track byte-identical with >= 80ms throttled writes + final commit; thumbs never cross (clamped); disabled= in the contract. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `a11yHighLabel` | `string` | `Upper value` |  |
| `a11yLowLabel` | `string` | `Lower value` |  |
| `bindHigh` | `expr` |  |  |
| `bindLow` | `expr` |  |  |
| `color` | `color` | `var(--dsx-accent)` |  |
| `disabled` | `bool` | `false` |  |
| `disabled-if` | `expr` |  | Disabled when this expression is truthy. `disabled=` binds as TEXT, and the string "false" is TRUE - so a bound boolean belongs here, never there. |
| `max` | `number` | `1` |  |
| `min` | `number` | `0` |  |
| `on:change` | `action` |  |  |
| `step` | `number` |  |  |

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

The native-control twin implements two bounded range inputs with normalized low/high constraints, throttled write-back, final commit, and accessible labels.

**Known limits on the web**

- Overlapping-thumb visuals and pointer arbitration follow the browser implementation.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-rangeslider`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `native-control`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | thumbs labelled 'Lower value'/'Upper value' + a11yLow/HighLabel grammar, keyboard steps; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | Each thumb: label (Lower/Upper value) + numeric accessibilityValue + accessibilityAdjustableAction (VoiceOver/Switch Control), arrow keys on iOS17, hover highlight (thumbControl, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/RangeSlider/swift/RangeSlider.swift); CI drives thumbs by their labels. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: BOTH thumbs carry dsxAccessibleRange (progressBarRangeInfo + setProgress + arrow keys; RangeSliderElements.kt:199,222); step count via the shared accessibilityStepsForIncrement (AccessibilityModifiersTest green, gradle :render:testDebugUnitTest run 2026-08-18: 292 tests, 1 failure (StackButtonsTest#systemButtonsDelegateTheirDefaultPalettesToMaterial3 - a stale source-grep of the pre-W9 disabled literal, not a behavior break)). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

