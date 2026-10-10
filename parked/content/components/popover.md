---
title: popover
description: The overlay twin provides an anchored, viewport-aware popover with trigger semantics, dismissal, keyboard handling, and focus restoration.
order: 3
section: components
element: popover
category: overlay
scope: library
platforms: web,ios,android
properties: [{"name":"arrow","type":"enum","default":"top","values":["top","bottom","leading","trailing"]},{"name":"on:dismiss","type":"action","default":null},{"name":"present","type":"expr","default":null}]
actions: ["dismiss"]
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# popover

The overlay twin provides an anchored, viewport-aware popover with trigger semantics, dismissal, keyboard handling, and focus restoration.

<RefMeta platforms="Web,iOS,Android">
Category: Overlay - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<popover present="dsx.variable.tip" arrow="top"><text value="A helpful tip"/></popover>
```

`popover` takes children.

## Catalog specimen

`PopoverDefault.dsx`, verbatim from the catalog:

```dsx
<vstack style="width: 100%; gap: 8px">
  <head>
    <variable as="tip">return false</variable>
  </head>
  <button label="Show the tip" style="width: 100%" on:tap="dsx.variable.tip = true"/>
  <popover present="dsx.variable.tip" arrow="top">
    <text value="The anchor"/>
    <text value="A helpful tip" slot="content"/>
  </popover>
</vstack>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: anchored open on present bind, outside-click dismiss fires on:dismiss, Escape closes - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | present lifecycle (two-way bool) with on:dismiss on tap-outside or programmatic close (PopoverAnchor dsxOnChange, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Popover/swift/Popover.swift); the anchor slot stays inline; arrow edge selectable. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: present= two-way Bool; focusable Popup dismisses on tap-outside/programmatic false with on:dismiss (Menus.kt PopoverElement, PopupProperties(focusable=true)); anchor stays the always-visible default slot. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `arrow` | `top` \| `bottom` \| `leading` \| `trailing` | `top` |  |
| `on:dismiss` | `action` |  |  |
| `present` | `expr` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `dismiss` | `on:dismiss="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The overlay twin provides an anchored, viewport-aware popover with trigger semantics, dismissal, keyboard handling, and focus restoration.

**Known limits on the web**

- Arrow preference may flip/clamp to remain visible and browser layout controls subpixel placement.

**Implementation notes.** Default slot = the always-visible anchor; the content slot = the bubble.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** anchored floating panel at fine pointer; 390: fits viewport (133x103 within bounds) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-overlay-host dsx-popover-host`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `overlay`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | panel focus behavior, outside-click + Escape dismiss, isolated axe clean while open - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | System popover semantics: VoiceOver focus moves into the bubble; tap-outside dismissal is system behavior; content is ordinary DSX. ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Popover/swift/Popover.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: focusable Popup takes input focus while open and dismisses on outside tap; bubble content exposes its own semantics (Menus.kt PopoverElement). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

