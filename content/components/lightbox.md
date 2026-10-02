---
title: lightbox
description: The media Web twin provides a shared-top-layer modal gallery with bounded safe sources, reactive presentation/index, focus containment/restoration, keyboard and RTL paging, pointer swipe, interactive drag dismissal, responsive controls, deterministic SSR, and the native zoom ladder: pinch (pointer pairs and trackpad ctrl+wheel) and double-tap zoom toward the focal point (1..4x), pan while zoomed with the native lock (pager and dismiss-drag disabled, chrome hidden), Escape unwinding zoom before dismissal, per-page zoom reset.
order: 3
section: components
element: lightbox
category: overlay
scope: library
platforms: web,ios,android
properties: [{"name":"color","type":"color","default":"white"},{"name":"images","type":"expr","default":null},{"name":"index","type":"expr","default":null},{"name":"present","type":"expr","default":null},{"name":"srcField","type":"string","default":"src"},{"name":"urls","type":"csv","default":null}]
actions: []
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# lightbox

The media Web twin provides a shared-top-layer modal gallery with bounded safe sources, reactive presentation/index, focus containment/restoration, keyboard and RTL paging, pointer swipe, interactive drag dismissal, responsive controls, deterministic SSR, and the native zoom ladder: pinch (pointer pairs and trackpad ctrl+wheel) and double-tap zoom toward the focal point (1..4x), pan while zoomed with the native lock (pager and dismiss-drag disabled, chrome hidden), Escape unwinding zoom before dismissal, per-page zoom reset.

<RefMeta platforms="Web,iOS,Android">
Category: Overlay - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<lightbox present="dsx.variable.viewer" images="dsx.variable.photos"/>
```

`lightbox` takes no children.

## Catalog specimen

<Callout kind="note" title="Served as a frame">
The framework's own build refuses to serve this specimen as an embed, and the refusal is quoted rather than paraphrased: [dsx embed] ui.LightboxDefault uses full-application-only media surface(s) `<lightbox>`; their minimal locked self-contained bundle exceeds both the default 40KiB G10 widget budget and the declared 49KiB media qualification, or requires host-level modal ownership. Use host-provided media/composition in an embed, or a full DSX app; the budget is not raised.
</Callout>

`LightboxDefault.dsx`, verbatim from the catalog:

```dsx
<vstack style="width: 100%; gap: 8px">
  <head>
    <variable as="viewer">return false</variable>
    <variable as="photos">return []</variable>
  </head>
  <button label="Open the viewer" style="width: 100%" on:tap="dsx.variable.viewer = true"/>
  <lightbox present="dsx.variable.viewer" images="dsx.variable.photos"/>
</vstack>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: opens over everything with 3-image gallery, ArrowRight pages (idx=1, counter advances), Escape dismisses + on:dismiss - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | present lifecycle (fullScreenCover + on:dismiss on any path), page/counter state, zoomed lock (paging + dismiss-drag disabled while zoomed), drag-to-dismiss past 120pt or a fling with backdrop fade (LightboxViewer/ZoomablePhoto, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Lightbox/swift/Lightbox.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: zoom state locks paging + dismiss drag and hides chrome; counter n/m when >1 page; settled swipe writes index back; BACK dismisses (Lightbox.kt header); failed page keeps the shared placeholder instead of a black page (pinned deviation). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `color` | `color` | `white` |  |
| `images` | `expr` |  |  |
| `index` | `expr` |  |  |
| `present` | `expr` |  |  |
| `srcField` | `string` | `src` |  |
| `urls` | `csv` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`lightbox` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The media Web twin provides a shared-top-layer modal gallery with bounded safe sources, reactive presentation/index, focus containment/restoration, keyboard and RTL paging, pointer swipe, interactive drag dismissal, responsive controls, deterministic SSR, and the native zoom ladder: pinch (pointer pairs and trackpad ctrl+wheel) and double-tap zoom toward the focal point (1..4x), pan while zoomed with the native lock (pager and dismiss-drag disabled, chrome hidden), Escape unwinding zoom before dismissal, per-page zoom reset.

**Known limits on the web**

- Native haptic ticks are platform chrome a browser does not expose; the gesture ladder is otherwise the full reference contract.
- Image decoding/caching follows browser policy and the normalized gallery is capped at 256 entries.
- Lightbox is full-application-only because it requires shared host-level portal/inert ownership and its locked slice exceeds both the default 40960-byte widget budget and the 50176-byte media qualification ceiling.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** full-viewport top-layer gallery at both widths (1366x900 panel), keyboard + RTL paging (element-support.json), safe-area chrome padding (media-surfaces.ts) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-lightbox-host`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `media`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | labelled Previous/Next/Close controls, counter, focus containment (activeElement lands on close), Escape restores, axe clean while open - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | The counter announces photo N of M (accessibilityLabel); close is a real Button reachable without gestures (system symbol label); zoom is optional inspection. ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Lightbox/swift/Lightbox.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: dsxAccessibleDismiss on the surface (Lightbox.kt:154) + close/chrome activations (Lightbox.kt:185,217). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

