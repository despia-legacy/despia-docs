---
title: svg
description: The media Web twin implements the fixture's full asset/src/d/viewBox/fill/width/height contract over the same static shape/path subset the native renderer draws (rect/circle/ellipse/line/polygon/polyline/path with M L H V C S Q T A Z absolute and relative), with semantic paint tokens, decorative-by-default accessibility, deterministic SSR, and fail-closed canonicalizing sanitization.
order: 3
section: components
element: svg
category: display
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"asset","type":"string","default":null},{"name":"d","type":"path-data","default":null},{"name":"fill","type":"color","default":null},{"name":"height","type":"number","default":null},{"name":"src","type":"markup","default":null},{"name":"viewBox","type":"string","default":null},{"name":"width","type":"number","default":null}]
actions: []
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# svg

The media Web twin implements the fixture's full asset/src/d/viewBox/fill/width/height contract over the same static shape/path subset the native renderer draws (rect/circle/ellipse/line/polygon/polyline/path with M L H V C S Q T A Z absolute and relative), with semantic paint tokens, decorative-by-default accessibility, deterministic SSR, and fail-closed canonicalizing sanitization.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Display - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<svg d="M0 0 L24 24" viewBox="0 0 24 24" fill="var(--dsx-accent)"/>
```

`svg` takes no children.

## Catalog specimen

<Callout kind="note" title="Served as a frame">
The framework's own build refuses to serve this specimen as an embed, and the refusal is quoted rather than paraphrased: [dsx embed] ui.SvgDefault uses full-application-only media surface(s) `<svg>`; their minimal locked self-contained bundle exceeds both the default 40KiB G10 widget budget and the declared 49KiB media qualification, or requires host-level modal ownership. Use host-provided media/composition in an embed, or a full DSX app; the budget is not raised.
</Callout>

`SvgDefault.dsx`, verbatim from the catalog:

```dsx
<svg d="M12 2 L22 20 L2 20 Z" viewBox="0 0 24 24" fill="currentColor" style="width: 48px; height: 48px">
  <head/>
</svg>
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
| `asset` | `string` |  |  |
| `d` | `path-data` |  |  |
| `fill` | `color` |  |  |
| `height` | `number` |  |  |
| `src` | `markup` |  |  |
| `viewBox` | `string` |  |  |
| `width` | `number` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`svg` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The media Web twin implements the fixture's full asset/src/d/viewBox/fill/width/height contract over the same static shape/path subset the native renderer draws (rect/circle/ellipse/line/polygon/polyline/path with M L H V C S Q T A Z absolute and relative), with semantic paint tokens, decorative-by-default accessibility, deterministic SSR, and fail-closed canonicalizing sanitization.

**Known limits on the web**

- A NATIVE app-bundle resource name (asset="logo", or src naming a bundled file) has no browser equivalent because a browser has no app bundle; the twin stays network-free by design, stamps data-dsx-unresolved="asset"|"src" (the image precedent) and renders nothing, so the gap is inspectable rather than a silent blank.
- Scripts, styles, references, images, groups, animation, unknown attributes, and oversized documents fail closed. Inline SVG root width/height above 16384px are rejected, DSX host width/height are clamped to 16384px, and shape coordinates are independently bounded to an absolute value of 1000000000.
- SVG is full-application-only because its locked slice exceeds both the default 40960-byte widget budget and the 50176-byte media qualification ceiling.

**Implementation notes.** Native SVG subset renderer (no WebView): rect/circle/ellipse/line/polygon/polyline/path M L H V C S Q T A Z; fill/stroke/stroke-width/opacity/viewBox. `A` (the elliptical arc) joined the subset on 2026-09-12: the framework's own brand/despia-logo.svg is four circular arcs, so until then the one SVG in this repository was the one this element could not draw, and a skipped `A` drew garbage rather than nothing because each parser's fallback branch consumed a single token and carried on. Both native lanes convert an arc to cubic segments of at most a quarter turn by the standard endpoint to centre conversion (SVG 1.1 F.6.5), judged against each other by OpenSource/Conformance/svg/arcs.json; the web lane emits the arc as real DOM SVG and the browser draws it. On every lane the two boolean flags must be SEPARATED from the coordinate that follows them: the SVG grammar allows them to run together and these tokenizers read numbers greedily, so a glued path is refused rather than guessed at.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical fluid presentation at both widths (data family page 390+1366, overflow 0); RTL page mirrors (ChatBubble sides flip: firstFromRight=0) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-svg`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `media`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | safe static subset, decorative by default; axe 0 serious/critical on the data family page light (dark: text link finding filed separately) |
| ios | review | 2026-08-18 | The canvas is decorative by construction (accessibilityHidden(true), ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/SVG/swift/SVG.swift:30); label a meaningful graphic via the kernel a11yLabel pass + role=image (Stack.swift:6084-6088). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: decorative by contract: the static shape subset renders with no text alternative surface, matching the web column's decorative-by-default ruling (SvgElements.kt - pure command lists drawn to Canvas). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

