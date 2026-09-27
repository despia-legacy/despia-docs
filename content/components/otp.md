---
title: otp
description: The native-control twin implements a segmented one-time-code input with binding, paste/input normalization, completion event, and accessibility labeling.
order: 3
section: components
element: otp
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"bind","type":"expr","default":null},{"name":"boxSize","type":"number","default":"48"},{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"length","type":"number","default":"6"},{"name":"on:complete","type":"action","default":null}]
actions: ["complete"]
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# otp

The native-control twin implements a segmented one-time-code input with binding, paste/input normalization, completion event, and accessibility labeling.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<otp bind="dsx.variable.code" length="6" on:complete="dsx.action.verify()"/>
```

`otp` takes no children.

## Catalog specimen

`OtpDefault.dsx`, verbatim from the catalog:

```dsx
<otp bind="dsx.variable.code" length="6" style="width: 100%">
  <head>
    <variable as="code">return ''</variable>
  </head>
</otp>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: one-time-code input, paste fills 1234 + on:complete, box focus presentation (border/boxShadow delta on .dsx-otp-box) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | Active-box highlight (accent stroke on the next-to-fill box while focused), tap anywhere raises the keyboard, the bind clamps to length digits, on:complete at length, W9 disabled wrapper (DSXOTPField, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/OTP/swift/OTP.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: hidden number-pad field owns keystrokes (FocusRequester/onFocusChanged, OtpElements.kt); active next-to-fill box highlights while focused (the exact Swift predicate); M3 path dresses boxes in outline/primary/onSurface tokens (SelectionControl.OTP); reaching length raises on:complete; disabled= in the contract. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `bind` | `expr` |  |  |
| `boxSize` | `number` | `48` |  |
| `color` | `color` | `var(--dsx-accent)` |  |
| `disabled` | `bool` | `false` |  |
| `disabled-if` | `expr` |  | Disabled when this expression is truthy. `disabled=` binds as TEXT, and the string "false" is TRUE - so a bound boolean belongs here, never there. |
| `length` | `number` | `6` |  |
| `on:complete` | `action` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `complete` | `on:complete="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The native-control twin implements a segmented one-time-code input with binding, paste/input normalization, completion event, and accessibility labeling.

**Known limits on the web**

- Length and displayed value are capped by explicit safety limits.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-otp`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `native-control`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | autocomplete=one-time-code, a11yLabel, visible box focus presentation; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-19 | W12 red sweep 2026-08-19: the real input is the one labeled element - accessibilityLabel 'One-time code' + accessibilityValue reading the entered digits ('1 2 3, 3 of 6' / 'Empty, 6 digits') on the capturing TextField, and the read-out boxes are .accessibilityHidden(true) (OTP.swift DSXOTPField); SMS autofill unchanged. Swift compile-pending (rides Codemagic); balance-checked 0/0/0. Verified by review pending the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: one hidden text field owns input (number pad; tapping the boxes focuses it - OtpElements.kt header), so the control reads/edits as a single text entry; SMS autofill is the pinned :platform deferral. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

