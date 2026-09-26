---
title: qrcode
description: The rich Web twin generates deterministic SVG QR matrices with size, colors, correction level, accessible labeling, and fail-closed input handling.
order: 3
section: components
element: qrcode
category: display
scope: library
platforms: web,ios,android
properties: [{"name":"background","type":"color","default":"white"},{"name":"color","type":"color","default":"black"},{"name":"correction","type":"enum","default":"M","values":["L","M","Q","H"]},{"name":"size","type":"number","default":"200"},{"name":"value","type":"string","default":null}]
actions: []
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# qrcode

The rich Web twin generates deterministic SVG QR matrices with size, colors, correction level, accessible labeling, and fail-closed input handling.

<RefMeta platforms="Web,iOS,Android">
Category: Display - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<qrcode value="https://despia.com" size="200"/>
```

`qrcode` takes no children.

## Catalog specimen

`QrcodeDefault.dsx`, verbatim from the catalog:

```dsx
<qrcode value="https://despia.com" size="120">
  <head/>
</qrcode>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | n/a | 2026-08-18 | Non-interactive display/layout surface: no rest/hover/pressed/focus/disabled axis (value-driven rendering is data, not interaction state; Skeleton IS the loading state). |
| ios | n/a | 2026-08-18 | Non-interactive display/layout surface: no rest/hover/pressed/focus/disabled axis (value-driven rendering is data, not interaction state; Skeleton IS the loading state). |
| android | n/a | 2026-08-18 | Non-interactive display/layout surface: no rest/hover/pressed/focus/disabled axis (value-driven rendering is data, not interaction state; Skeleton IS the loading state). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `background` | `color` | `white` |  |
| `color` | `color` | `black` |  |
| `correction` | `L` \| `M` \| `Q` \| `H` | `M` |  |
| `size` | `number` | `200` |  |
| `value` | `string` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`qrcode` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The rich Web twin generates deterministic SVG QR matrices with size, colors, correction level, accessible labeling, and fail-closed input handling.

**Known limits on the web**

- Oversized or invalid payloads render an explicit unavailable status instead of an approximate code.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical fluid presentation at both widths (data family page 390+1366, overflow 0); RTL page mirrors (ChatBubble sides flip: firstFromRight=0) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-qrcode`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `rich`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | aria-label carries encoded value ('QR for example.com'); axe 0 serious/critical on the data family page light (dark: text link finding filed separately) |
| ios | review | 2026-08-18 | Reads as an image; the documented contract is an author a11yLabel (the in-file ACCESSIBILITY note: the raw value is often a token that should not be spoken) via the kernel pass (Stack.swift:6084). ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/QRCode/swift/QRCode.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-19 | W12 red sweep 2026-08-19: the QR Canvas speaks its payload - contentDescription 'QR code containing `<value>`' when no a11yLabel is authored (an authored one rides the universal style chain and wins) (QrElements.kt QrCodeView), the web aria-label twin (elements.ts). gradle test green. Pending the Android capture lane. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

