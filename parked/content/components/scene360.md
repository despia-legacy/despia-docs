---
title: Scene360
description: The panorama renders over the kernel `<scene>` engine's WebGL surface: an inside-out sphere textured with the equirectangular src, the camera at its centre, drag to look (yaw/pitch, pitch clamped), wheel and pinch on the field of view (20 to 110), yaw/pitch/fov reactive; loading, ready and failed fire as on iOS.
order: 3
section: components
element: Scene360
category: scene
scope: library
platforms: web,ios,android
properties: [{"name":"src","type":"string","default":null}]
actions: []
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# Scene360

The panorama renders over the kernel `<scene>` engine's WebGL surface: an inside-out sphere textured with the equirectangular src, the camera at its centre, drag to look (yaw/pitch, pitch clamped), wheel and pinch on the field of view (20 to 110), yaw/pitch/fov reactive; loading, ready and failed fire as on iOS.

<RefMeta platforms="Web,iOS,Android">
Category: Scene - Also answers to `Panorama` - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<Scene360 src="panorama.jpg"/>
```

`Scene360` takes no children. The same element answers to `Panorama`.

## Catalog specimen

The catalog has no specimen for `Scene360` at the default rung yet, so there is nothing to copy here. It appears with no change to this page the moment the catalog carries one: the page is a projection of the catalog, not a screenshot of it.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | review | 2026-10-01 | OpenSource/Engine/TypeScript/packages/dom/src/scene3d.ts frame(): loading spinner, ready, and a failure card (role=note) with a reason sentence; loading/ready/failed fire on the element. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| ios | review | 2026-10-01 | ClosedSource/DSX/Modules/Core/Scene3D/swift/Scene360Component.swift: ProgressView while loading, a failure card with the reason, ready otherwise; loading/ready/failed signals. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| android | review | 2026-10-01 | ClosedSource/DSX/Modules/Core/Scene3D/kotlin/Scene3DView.kt: CircularProgressIndicator while loading, FailureCard with the reason, the scene when ready; loading/ready/failed emitted. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `src` | `string` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`Scene360` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `module-facet` | filled by the module facet when that module is registered |
| desktop | `unavailable` | the desktop build bundles no runtime for it and answers with a typed refusal |

The panorama renders over the kernel `<scene>` engine's WebGL surface: an inside-out sphere textured with the equirectangular src, the camera at its centre, drag to look (yaw/pitch, pitch clamped), wheel and pinch on the field of view (20 to 110), yaw/pitch/fov reactive; loading, ready and failed fire as on iOS.

**Known limits on the web**

- The sphere is the kernel's tessellated UV sphere, so very wide fields of view show its facets at the poles.

**Implementation notes.** 360-degree panorama viewer - D-class on Android with Scene3D.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-10-01).** OpenSource/Engine/TypeScript/packages/dom/src/scene3d.ts: the stage fills its box at any width; drag, wheel and pinch on the field of view; the close control sits in the safe corner. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane.

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-scene360`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `media`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | review | 2026-10-01 | OpenSource/Engine/TypeScript/packages/dom/src/scene3d.ts: host role=img with a default name ("Panorama") until authored, failure card role=note, the close control is labelled, decorative glyphs aria-hidden; SSR stamps the same name. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| ios | review | 2026-10-01 | ClosedSource/DSX/Modules/Core/Scene3D/swift/Scene360Component.swift: the close control is labelled "Close"; the scene view is one element with the failure text readable. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| android | review | 2026-10-01 | ClosedSource/DSX/Modules/Core/Scene3D/kotlin/Scene3DView.kt: semantics contentDescription ("360 panorama") on the box, the close control described "Close". Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

