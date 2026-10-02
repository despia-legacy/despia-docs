---
title: Signature
description: The global Web twin is a real pointer-driven ink pad: a devicePixelRatio-scaled 2D canvas drawing the SHARED ink law (@despia-native/kernel signature-core: clamp, round-at-capture, midpoint quadratic curve), one bound write per stroke on pointer-up, and a server twin that renders the committed strokes as an inline SVG in the same normalized space, so a signed document has real first paint before the pad mounts.
order: 3
section: components
element: Signature
category: input
scope: library
platforms: web,ios,android
properties: [{"name":"baseline","type":"bool","default":"true"},{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-label)"},{"name":"height","type":"number","default":"180"},{"name":"on:begin","type":"action","default":null},{"name":"on:change","type":"action","default":null},{"name":"on:end","type":"action","default":null},{"name":"placeholder","type":"string","default":null},{"name":"radius","type":"number","default":"12"},{"name":"readOnly","type":"bool","default":"false"},{"name":"strokeWidth","type":"number","default":"3"}]
actions: ["begin","change","end"]
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# Signature

The global Web twin is a real pointer-driven ink pad: a devicePixelRatio-scaled 2D canvas drawing the SHARED ink law (@despia-native/kernel signature-core: clamp, round-at-capture, midpoint quadratic curve), one bound write per stroke on pointer-up, and a server twin that renders the committed strokes as an inline SVG in the same normalized space, so a signed document has real first paint before the pad mounts.

<RefMeta platforms="Web,iOS,Android">
Category: Input - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<Signature bind="dsx.variable.signature" placeholder="Sign here"/>
```

`Signature` takes no children.

## Catalog specimen

`SignatureDefault.dsx`, verbatim from the catalog:

```dsx
<Signature bind="dsx.variable.signature" placeholder="Sign here" style="width: 100%">
  <head>
    <variable as="signature">return []</variable>
  </head>
</Signature>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | no, and named | 2026-09-04 | Audited-red 2026-09-04: readOnly gates pointer capture, but the web factory has no focus or hover presentation and does not fold universal disabled or disabled-if into readOnly (OpenSource/Engine/TypeScript/packages/dom/src/globals.ts signature). The complete control-state contract therefore does not hold. |
| ios | review | 2026-09-04 | Verified by source review: readOnly, disabled, and disabled-if gate DragGesture capture; empty or signed and live or committed ink are explicit states and scheme colors use semantic tokens (Signature.swift SignatureView). Visual state review remains in the owner shot ledger. |
| android | review | 2026-09-04 | Verified by source review: readOnly, disabled, and disabled-if prevent pointerInput capture; empty or signed and live or committed ink are explicit states and scheme colors use semantic tokens (SignatureElement.kt). Visual state review remains in the owner shot ledger. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `baseline` | `bool` | `true` | The signing rule, inset 24 and 36 above the bottom. |
| `bind` | `expr` |  | The stroke list (below). Two-way: writing it back redraws the pad. |
| `color` | `color` | `var(--dsx-label)` | Ink colour. |
| `height` | `number` | `180` |  |
| `on:begin` | `action` |  |  |
| `on:change` | `action` |  | Fires from the bound write, like every two-way element. |
| `on:end` | `action` |  |  |
| `placeholder` | `string` |  | Shown while the pad is empty ("Sign here"). |
| `radius` | `number` | `12` |  |
| `readOnly` | `bool` | `false` | Render the strokes, refuse new ones (`disabled` does the same). |
| `strokeWidth` | `number` | `3` | Ink width, in points. |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `begin` | `on:begin="..."` |
| `change` | `on:change="..."` |
| `end` | `on:end="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The global Web twin is a real pointer-driven ink pad: a devicePixelRatio-scaled 2D canvas drawing the SHARED ink law (@despia-native/kernel signature-core: clamp, round-at-capture, midpoint quadratic curve), one bound write per stroke on pointer-up, and a server twin that renders the committed strokes as an inline SVG in the same normalized space, so a signed document has real first paint before the pad mounts.

**Known limits on the web**

- A pointer-drawn pad has no keyboard or switch-control equivalent on any renderer; the element exposes role=img with an empty/signed label and the documented pattern pairs it with a typed-name field.
- Stylus pressure and tilt are dropped: the wire shape carries one width per stroke, so the same value draws identically on the four renderers.

**Implementation notes.** THE PAD IS CHROME OVER THE INK PRIMITIVE. The box, the signing rule, the hint and the a11y wrapper are this element's; the ink is `<canvas>`'s `<ink>` child, whose law - the wire shape, the capture folds and the curve - lives once per language in the kernel (InkCore / @despia-native/kernel ink-core.ts) and is pinned by OpenSource/Conformance/canvas/ink.json. Anything this fixture used to say about capture now lives there. WHY THE ELEMENT EXISTS at all, when `<canvas><ink bind="sig"/></canvas>` draws the same thing: a component boundary cannot forward a two-way binding (a component's state is its own), so a ready-made pad that writes back into the CONSUMER's `sig` has to be a real element. VALUE SHAPE: `bind` holds `[{ "points": [[x, y], …], "width": <pt> }]`, x/y normalized 0…1 and rounded at capture, so a signature captured on a phone replays on a desktop pad. COMMIT LAW: one store write per stroke, on pointer-up. There is no clear()/undo() control channel: clearing is `sig = []`, undo is `sig.slice(0, sig.length - 1)`, and export is `ref` + `dsx.module.capture.element({ ref: "sig" })`. ACCESSIBILITY: a pointer-drawn pad has no keyboard or switch-control equivalent on any platform; it exposes `a11yLabel` (default "Signature") and an empty/signed value, and the documented pattern is to pair it with a typed-name field rather than to pretend the canvas is operable.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-09-04).** The pad fills available width, repaints through ResizeObserver, and stores normalized 0..1 points, so the same strokes replay after resizing (globals.ts signature; OpenSource/Conformance/canvas/ink.json; kernel and core canvas conformance tests).

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-signature dsx-signature-ruled dsx-signature-empty`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `global`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | no, and named | 2026-09-04 | Audited-red 2026-09-04: the pad exposes role=img plus a localized Empty or Signed name but has no keyboard or switch-control operation. OpenSource/Conformance/elements/Signature.json names this pointer-only limitation explicitly. |
| ios | no, and named | 2026-09-04 | Audited-red 2026-09-04: Signature.swift exposes one accessibility element with a label and Empty or Signed value, but the documented pointer-drawn pad has no keyboard or switch-control action (OpenSource/Conformance/elements/Signature.json). |
| android | no, and named | 2026-09-04 | Audited-red 2026-09-04: SignatureElement.kt exposes a content description and Empty or Signed state, but the documented pointer-drawn pad has no TalkBack action (OpenSource/Conformance/elements/Signature.json). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

