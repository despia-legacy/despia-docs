---
title: Scene3D
description: The viewer renders over the kernel `<scene>` engine's WebGL surface (packages/dom/src/scene3d.ts): one internal `<scene>` per instance (camera, key and ambient light, the GLB model centred and resting on the floor, one node per models= row) driven through the scene bus with the iOS orbit rig (drag, wheel and pinch, autoRotate), the clip and loop, the live scale and the clip clock hold; loading, ready {ar, animations, bounds}, failed {reason}, tap {node} and animationFinished fire on the element and the scene3d channel, and the scene3d verbs reach it through Core/Scene3D/web.
order: 3
section: components
element: Scene3D
category: scene
scope: library
platforms: web,ios,android
properties: [{"name":"models","type":"expr","default":null}]
actions: []
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# Scene3D

The viewer renders over the kernel `<scene>` engine's WebGL surface (packages/dom/src/scene3d.ts): one internal `<scene>` per instance (camera, key and ambient light, the GLB model centred and resting on the floor, one node per models= row) driven through the scene bus with the iOS orbit rig (drag, wheel and pinch, autoRotate), the clip and loop, the live scale and the clip clock hold; loading, ready {ar, animations, bounds}, failed {reason}, tap {node} and animationFinished fire on the element and the scene3d channel, and the scene3d verbs reach it through Core/Scene3D/web.

<RefMeta platforms="Web,iOS,Android">
Category: Scene - Also answers to `Model3D`, `Scene3DView` - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<Scene3D models="dsx.variable.models"/>
```

`Scene3D` takes no children. The same element answers to `Model3D`, `Scene3DView`.

## Catalog specimen

The catalog has no specimen for `Scene3D` at the default rung yet, so there is nothing to copy here. It appears with no change to this page the moment the catalog carries one: the page is a projection of the catalog, not a screenshot of it.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | review | 2026-10-01 | OpenSource/Engine/TypeScript/packages/dom/src/scene3d.ts frame(): loading spinner, ready, and a failure card (role=note) with a reason sentence; loading/ready/failed fire on the element. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| ios | review | 2026-10-01 | ClosedSource/DSX/Modules/Core/Scene3D/swift/Scene3DComponent.swift: ProgressView while loading, a failure card with the reason, ready otherwise; loading/ready/failed signals. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| android | review | 2026-10-01 | ClosedSource/DSX/Modules/Core/Scene3D/kotlin/Scene3DView.kt: CircularProgressIndicator while loading, FailureCard with the reason, the scene when ready; loading/ready/failed emitted. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `models` | `expr` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`Scene3D` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `module-facet` | filled by the module facet when that module is registered |
| desktop | `unavailable` | the desktop build bundles no runtime for it and answers with a typed refusal |

The viewer renders over the kernel `<scene>` engine's WebGL surface (packages/dom/src/scene3d.ts): one internal `<scene>` per instance (camera, key and ambient light, the GLB model centred and resting on the floor, one node per models= row) driven through the scene bus with the iOS orbit rig (drag, wheel and pinch, autoRotate), the clip and loop, the live scale and the clip clock hold; loading, ready {ar, animations, bounds}, failed {reason}, tap {node} and animationFinished fire on the element and the scene3d channel, and the scene3d verbs reach it through Core/Scene3D/web. Numbers pinned by OpenSource/Conformance/scene3d/viewer.json, shared with the Android lane.

**Known limits on the web**

- The kernel reads glTF binary (GLB, embedded buffers); a USDZ/.reality model fails with load_failed and the card says to ship a .glb, so status() answers usdz:false.
- Materials shade flat Lambert from baseColorFactor; glTF textures are the kernel's named absence.
- ar modes fail open to the viewer (no AR on the web lane) and ar=measure fails with ar_unavailable, as iOS does without the AR package.

**Implementation notes.** RealityKit scene - D-class on Android (android-status.md section 3: not rebuilt on Filament).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-10-01).** OpenSource/Engine/TypeScript/packages/dom/src/scene3d.ts: the stage fills its box at any width; drag, wheel and pinch on the field of view; the close control sits in the safe corner. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane.

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-scene3d`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `media`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | review | 2026-10-01 | OpenSource/Engine/TypeScript/packages/dom/src/scene3d.ts: host role=img with a default name ("3D model") until authored, failure card role=note, the close control is labelled, decorative glyphs aria-hidden; SSR stamps the same name. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| ios | review | 2026-10-01 | ClosedSource/DSX/Modules/Core/Scene3D/swift/Scene3DComponent.swift: the close control is labelled "Close"; the scene view is one element with the failure text readable. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| android | review | 2026-10-01 | ClosedSource/DSX/Modules/Core/Scene3D/kotlin/Scene3DView.kt: semantics contentDescription ("3D model") on the box, the close control described "Close". Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

