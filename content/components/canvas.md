---
title: canvas
description: The `<canvas>` surface renders the shared display list into an HTML canvas, with the SSR SVG path byte-identical to the native twins.
order: 3
section: components
element: canvas
category: scene
scope: library
platforms: web,ios,android
properties: [{"name":"a11yChildren","type":"expr","default":null},{"name":"a11yLabel","type":"string","default":null},{"name":"commands","type":"expr","default":null},{"name":"on:draw","type":"action","default":null},{"name":"on:frame","type":"action","default":null},{"name":"on:layout","type":"action","default":null},{"name":"on:strokeEnd","type":"action","default":null},{"name":"on:strokeStart","type":"action","default":null},{"name":"opaque","type":"bool","default":"false"},{"name":"scale","type":"string","default":"device"}]
actions: ["draw","frame","layout","strokeEnd","strokeStart"]
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# canvas

The `<canvas>` surface renders the shared display list into an HTML canvas, with the SSR SVG path byte-identical to the native twins.

<RefMeta platforms="Web,iOS,Android">
Category: Scene - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<canvas style="height: 200px; min-height: 200px" a11yLabel="Revenue sparkline"><path d="M0 80 L60 40 L120 60 L180 12" stroke="accent" strokeWidth="2" fill="none"/></canvas>
```

`canvas` takes no children.

## Catalog specimen

`CanvasDefault.dsx`, verbatim from the catalog:

```dsx
<canvas commands="dsx.variable.strokes" a11yLabel="A rising line" style="width: 200px; height: 100px">
  <head>
    <variable as="strokes">return [{ op: 'stroke', points: [[0, 90], [50, 50], [100, 70], [160, 14]], color: '#315cea', width: 2 }]</variable>
  </head>
</canvas>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | n/a | 2026-09-04 | Canvas is an author-drawn surface: interaction exists only when handlers or ink are authored, so it has no built-in rest, hover, pressed, focus, disabled, loading, error, or empty state axis (canvas.ts; StackCanvas.swift; StackCanvas.kt). |
| ios | n/a | 2026-09-04 | Canvas is an author-drawn surface: interaction exists only when handlers or ink are authored, so it has no built-in rest, hover, pressed, focus, disabled, loading, error, or empty state axis (canvas.ts; StackCanvas.swift; StackCanvas.kt). |
| android | n/a | 2026-09-04 | Canvas is an author-drawn surface: interaction exists only when handlers or ink are authored, so it has no built-in rest, hover, pressed, focus, disabled, loading, error, or empty state axis (canvas.ts; StackCanvas.swift; StackCanvas.kt). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `a11yChildren` | `expr` |  | The declared semantic overlay: rows of `{role, label, value}`, the accessible bar-chart pattern. |
| `a11yLabel` | `string` |  | **Required by the linter** when a gesture handler is bound and no `a11yChildren` are declared. |
| `commands` | `expr` |  | Tier 2: rows of `[method, args...]`, replayed through the kernel recorder. |
| `on:draw` | `action` |  | Fires before each tier-2 replay. A notification, never a mutable graphics handle. |
| `on:frame` | `action` |  | Display-linked `{ time, delta, frame }` under the shared 60/s budget. Installed only while bound, mounted **and on screen**. |
| `on:layout` | `action` |  | `{ width, height }` after layout, before the first draw. |
| `on:strokeEnd` | `action` |  |  |
| `on:strokeStart` | `action` |  |  |
| `opaque` | `bool` | `false` | Skips the alpha channel; a perf win for a full-bleed canvas. |
| `scale` | `string` | `device` | Raster scale (web only; native surfaces are already device-scaled). |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `draw` | `on:draw="..."` |
| `frame` | `on:frame="..."` |
| `layout` | `on:layout="..."` |
| `strokeEnd` | `on:strokeEnd="..."` |
| `strokeStart` | `on:strokeStart="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The `<canvas>` surface renders the shared display list into an HTML canvas, with the SSR SVG path byte-identical to the native twins. Tier-1 children, the paint set, transforms, gradients and the fill-rule fold all come from the shared CanvasCore, so a shape cannot mean one thing here and another on a phone.

**Known limits on the web**

- Tier 2 is a declarative command list replayed through the kernel recorder, not a live Canvas2D context handle: the payload seam carries data, never a mutable graphics object.
- on:frame is display-linked and installed only while bound, mounted and on screen, so an off-screen canvas costs nothing.
- Canvas is selectively available to self-contained embeds through an explicit tool-grade budget. The locked production-equivalent qualification measured 51566 bytes gzip, leaving 5778 bytes below its explicit 57344-byte qualification and sitting 10606 bytes above the default 40960-byte widget budget. The latest move (2026-09-20): three arms of the STATEMENT RUNNER became foldable, and one of them had a fold already. `__DSX_OPTIONAL_BLOCK_CONTROL__` (`throw`/`try`/`switch`) and `__DSX_OPTIONAL_DSX_STDLIB__` were written into the engine and given no roster key, so `embedDefines` set neither and every widget carried both; and the two block folds shed the EXPRESSION evaluator's copy of the machinery while the runner's copy stayed, because a class method is reachable through its class and no bundler can drop one. The runner's five block arms and its five effect verbs (`fetch:`, `remove:`, `animate:`, `resolve:`, `error:`) are module functions behind inline guards now, decided per slice by the words an author spells, and every figure above fell again without a budget moving. The move before (2026-09-08): the expression standard library became optional. `apply` (every bare `name(...)` builtin) and `applyMethod` (every `<value>.name(...)` method) are two switch statements 8360 minified bytes long, and both are reachable only through a call an author SPELLS, so a closed slice that spells none can never enter either one; they now fold behind `__DSX_OPTIONAL_STDLIB_FNS__` and `__DSX_OPTIONAL_STDLIB_METHODS__`, decided per slice against the kernel's own dispatch roster, and every figure above fell again without a budget moving. The move before (2026-09-07): cutting the module alias spine (409785085) took 86 second spellings of a chain head out of the module bus, and bus.ts is on every embed's common path, so every figure above fell without a budget moving. The move before (2026-09-06): three subsystems no self-contained slice can reach had been riding every embed, and removing them is what closed the overage; no budget moved. The custom-design sheet (the appearance lane's style text) now lives in its own module, because a bundler cannot drop a top level template literal from a module it already reached and the mount path only ever wanted the stamp. The standard color grammar that the DOM, the compiler and the SSR renderer share rides `__DSX_OPTIONAL_COLOR_VALUES__`: a slice with a color door keeps the whole grammar and the parity with it, a slice with none sheds it, and the lightbox and svg color doors are refused from an embed outright so playback never opens one. And two guards that RETURNED instead of folding at the reference, the reactive bridge tables in mount.ts and the ReDoS scanner in jse.ts, now fold where the name is used, which is the same law the recognizer and the link rungs already carry.  A package exposing a canvas component must therefore declare expose.budgetKB as 56; the default budget is unchanged, and a build-time test pins these figures. Standard element color validation added 235 bytes to the slice. Retiring the Web growth carrier removed 284 bytes from the slice without changing either budget. One byte joined the slice with the wave that landed between 1a4d06ba3 and 9a8f49058, and no budget moved for it: 54486 is still 2858 under the 57344 qualification.

**Implementation notes.** The 2-D drawing surface. TIER 1 is the declarative child set - path / rect / circle / ellipse / line / polygon / polyline / text / image, the group / blur / shadow / blend wrappers and gradient / stop - reconciled as a keyed display list; attribute naming is SVG's exactly. TIER 2 is the Canvas2D subset as a command LIST replayed through the kernel recorder (corpus tier2.json), not a live ctx object. No Skia, no shader language, no pixel readback: each platform's own rasteriser draws the same kernel display list. Numbers live in CanvasCore.swift / CanvasCore.kt / canvas-core.ts; corpus OpenSource/Conformance/canvas/. FOUR RENDERERS, no exceptions: SwiftUI, Compose (Android), Compose Desktop (DesktopCanvas.kt - Windows and Linux) and the DOM. Each replays the same kernel display list through its own rasteriser, so a picture drawn on a phone is the picture a desktop window draws. DRAWN ON: the `<ink>` child makes the surface a pointer target - the committed strokes fold back into ordinary tier-1 stroked paths, the in-flight stroke is transient native paint, and the bound value is written exactly once per stroke on pointer-up. The two stroke events belong to the SURFACE, not to `<ink>`, because a canvas can carry ink beside other geometry.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-09-04).** ResizeObserver schedules a redraw, backing pixels follow device scale, and on:layout reports the used box before draw (OpenSource/Engine/TypeScript/packages/dom/src/canvas.ts canvasFactory); canvas conformance tests pin display-list and raster-independent geometry.

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-canvas`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `media`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-09-04 | OpenSource/Conformance/canvas/a11y.json is executed by packages/kernel/test/canvas-conformance.test.ts; canvas.ts projects its verdict to role and name plus real ordered semantic-overlay children. |
| ios | review | 2026-09-04 | Verified by source review: CanvasCore.a11y evaluates the shared accessibility corpus and StackCanvas projects ordered semantic overlay elements with labels, values, traits, and frames (OpenSource/Engine/Swift/StackCanvas.swift). |
| android | review | 2026-09-04 | Verified by source review: CanvasConformanceTest executes the shared a11y corpus and StackCanvas projects its ordered semantics with labels, values, roles, and bounds (OpenSource/Engine/Kotlin canvas implementation). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

