---
title: pressable
description: The base Web twin provides whole-area button/anchor semantics with child content and universal tap, double-tap, long-press, and navigation wiring.
order: 3
section: components
element: pressable
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"href","type":"string","default":null},{"name":"on:doubleTap","type":"action","default":null},{"name":"on:longPress","type":"action","default":null},{"name":"on:longPressEnd","type":"action","default":null},{"name":"on:tap","type":"action","default":null}]
actions: ["doubleTap","longPress","longPressEnd","tap"]
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# pressable

The base Web twin provides whole-area button/anchor semantics with child content and universal tap, double-tap, long-press, and navigation wiring.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Also answers to `row` - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<pressable on:tap="dsx.variable.liked = !dsx.variable.liked"><text value="Like"/></pressable>
```

`pressable` takes children. The same element answers to `row`.

## Catalog specimen

`PressableDefault.dsx`, verbatim from the catalog:

```dsx
<pressable on:tap="dsx.variable.liked = !dsx.variable.liked" style="width: 100%">
  <head>
    <variable as="liked">return false</variable>
  </head>
  <text value="{{ dsx.variable.liked ? 'Liked' : 'Like' }}"/>
</pressable>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: hover bg, pressed bg, focus ring, Enter/tap fires on:tap - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | Tap-only renders a real borderless Button (StackButtonStyle press scale 0.92 under the pinned press preset, Stack.swift:4658-4680); the multi-gesture surface keeps a native touch host with slop/cancel handling; hoverEffect(.highlight); focusable + Return/Space on iOS17; W9 disabled grammar disables recognizers and traits (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Pressable/swift/Pressable.swift); CI-asserted: two immediate primaries + one double on double-tap, long-press begin/end lifecycle (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift testIPadFoundationPressableStarsAndTextAreaUseNativeSemantics). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: the multi-gesture TikTok contract: instant tap on every tap-up, additional doubleTap, 0.4s balanced long-press lifecycle, slop 12dp, ancestor-consume cancels - the pure machine is JVM-pinned (PressableGestureMachineTest green, gradle :render:testDebugUnitTest run 2026-08-18: 292 tests, 1 failure (StackButtonsTest#systemButtonsDelegateTheirDefaultPalettesToMaterial3 - a stale source-grep of the pre-W9 disabled literal, not a behavior break)); disabled/disabled-if gate the recognizer (StackNodeView.kt:1803); NO press indication by contract (bare container, the web .dsx-pressable twin). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `disabled` | `bool` | `false` |  |
| `disabled-if` | `expr` |  | Disabled when this expression is truthy. `disabled=` binds as TEXT, and the string "false" is TRUE - so a bound boolean belongs here, never there. |
| `href` | `string` |  |  |
| `on:doubleTap` | `action` |  |  |
| `on:longPress` | `action` |  |  |
| `on:longPressEnd` | `action` |  |  |
| `on:tap` | `action` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `doubleTap` | `on:doubleTap="..."` |
| `longPress` | `on:longPress="..."` |
| `longPressEnd` | `on:longPressEnd="..."` |
| `tap` | `on:tap="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The base Web twin provides whole-area button/anchor semantics with child content and universal tap, double-tap, long-press, and navigation wiring.

**Known limits on the web**

- Gesture recognition uses PointerEvent/browser timing rather than native recognizer internals.

**Implementation notes.** Tap-only renders a borderless Button (whole area tappable, Pressable.swift:33); on:tap fires on EVERY tap-up including each tap of a double.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-pressable`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | button element + a11yLabel; ring; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | One semantic control: children combine, .isButton, a primary accessibilityAction + named custom actions for double/long (the VoiceOver rotor), keyboard activation, the touch host hidden from the tree (PressableNativeActivation/PressableTouchHost, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Pressable/swift/Pressable.swift:103-247). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: dsxAccessibleActivation merges one node with primary + long-click actions; the double-tap surfaces in the TalkBack custom-actions rotor with a localizable label (a11yDoubleTapLabel, StackNodeView.kt:1825-1848); Enter/Space/D-pad activation + focus traversal. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

