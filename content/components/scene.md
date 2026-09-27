---
title: scene
description: The DSX-native scene root renders in the browser through the in-kernel WebGL surface installed by registerSceneSurface, over the same corpus-pinned scene fold (transform composition, projection, picking) the two native lanes and the Compose desktop rasterizer read, so a scene cannot mean one thing here and another on a phone.
order: 3
section: components
element: scene
category: scene
scope: library
platforms: web,ios,android
properties: [{"name":"background","type":"color","default":"#000000"},{"name":"mode","type":"enum","default":"3d","values":["3d","2d","ar"]},{"name":"on:ready","type":"action","default":null}]
actions: ["ready"]
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# scene

The DSX-native scene root renders in the browser through the in-kernel WebGL surface installed by registerSceneSurface, over the same corpus-pinned scene fold (transform composition, projection, picking) the two native lanes and the Compose desktop rasterizer read, so a scene cannot mean one thing here and another on a phone.

<RefMeta platforms="Web,iOS,Android">
Category: Scene - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<scene style="background: #0b1020"><camera position="0 1.5 4" look-at="0 0 0"/><light kind="ambient" intensity="0.4"/><box color="#2563eb"/></scene>
```

`scene` takes no children.

## Catalog specimen

`SceneDefault.dsx`, verbatim from the catalog:

```dsx
<stack style="width: 100%">
  <head/>
  <scene a11yLabel="A blue cube turning slowly above a dark ground plane"
         style="background: #0b1020; width: 100%">
    <camera position="0 1.5 4" look-at="0 0 0" fov="60"/>
    <light kind="ambient" intensity="0.4"/>
    <light kind="directional" position="3 5 2" intensity="0.8"/>
    <group id="rig" rotation="0 0 0">
      <animate target="rotation" from="0 0 0" to="0 360 0" duration="8s" easing="linear" loop="true" fill="hold"/>
      <box id="cube" position="0 0 0" size="1 1 1" color="#2563eb"/>
      <plane position="0 -0.5 0" size="10 10" rotation="-90 0 0" color="#1e293b"/>
    </group>
  </scene>
</stack>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | n/a | 2026-09-07 | P23B audit 2026-09-07: NOT APPLICABLE, the canvas precedent. The scene grammar declares background, mode and on:ready only (OpenSource/Documentation/reference/stack-elements.json), so there is no hover, pressed, focus visible, disabled, loading, error or empty state to depict: measured live in the locked Playwright Chromium (evidence/p23b-logs/p23b-probe.json, harness evidence/p23b-logs/p23b-catalog-proof-probe.ts) the mounted host is role img with 0 focusable descendants at 390x844 touch and 1366x1024 fine pointer. The one state it does have, rest, is scheme correct and measured: fill rgba(17, 17, 24, 0.06) light and rgba(255, 255, 255, 0.09) dark. |
| ios | n/a | 2026-09-07 | P23B audit 2026-09-07: NOT APPLICABLE for the same reason as the web column, the canvas precedent: the grammar declares background, mode and on:ready only, so there is no state ladder to depict. The iOS host is an SCNView bound at OpenSource/Engine/Swift/SceneElement.swift:565-572, and that file type checks inside the shipping app target: xcodebuild build -workspace ClosedSource/Runtime.xcworkspace -scheme Runtime -destination generic/platform=iOS Simulator reports BUILD SUCCEEDED with 0 errors (evidence/p23b-logs/ios-runtime-build.log). |
| android | n/a | 2026-09-07 | P23B audit 2026-09-07: NOT APPLICABLE for the same reason as the other two columns, the canvas precedent: background, mode and on:ready are the whole grammar, so there is no state ladder. The Android home is ComposeStackComponents.defineNative("scene") at OpenSource/Engine/Kotlin/render/src/main/kotlin/despia/engine/render/elements/SceneElements.kt:154-156, and check_element_unification.rb rule 3 passes with 0 failures. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `background` | `color` | `#000000` | `#rgb`/`#rrggbb`; reactive. |
| `mode` | `3d` \| `2d` \| `ar` | `3d` | `3d` / `2d` / `ar`. `2d` is the SAME graph under an orthographic camera (z = layer order); `ar` is scheduled (P3). |
| `on:ready` | `action` |  | Fires after the first rendered frame. |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `ready` | `on:ready="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The DSX-native scene root renders in the browser through the in-kernel WebGL surface installed by registerSceneSurface, over the same corpus-pinned scene fold (transform composition, projection, picking) the two native lanes and the Compose desktop rasterizer read, so a scene cannot mean one thing here and another on a phone.

**Known limits on the web**

- The server renderer emits the sized, labelled box only: the canvas is client-only, and a generic child walk would paint unsupported markers for the scene-space tags, which are not DOM children.
- The surface is installed by the boot path, so a sliced embed that never imports it falls to the labelled placeholder rather than to a silent blank.
- A build with no WebGL context renders the honest labelled fallback inside the scene box, and the scheduled words of the ladder render their named placeholder rather than nothing.

**Implementation notes.** The DSX-native scene root. Every NUMBER is the corpus-pinned kernel fold (OpenSource/Conformance/scene/), shared by all four renderers as ONE fold of source, and judged against that corpus on web, iOS and Android (the scene corpus has no Compose Desktop runner today, `evidence/DESKTOP-CENSUS.md`), which is why this fixture pins the root attribute contract and no per-renderer chrome: the scene vocabulary inside the box (camera, light, group, box, sphere, plane, model, text3d, anchor) is scene space, not stack children, and its defaults live in the corpus rather than in a builder. Web SSR emits the sized labelled box only, because the canvas is client-only and a generic child walk would paint unsupported markers for the scene-space tags.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-09-07).** P23B audit 2026-09-07: one DECLARED fluid presentation at every form factor, measured live in the locked Playwright Chromium (evidence/p23b-logs/p23b-probe.json, harness evidence/p23b-logs/p23b-catalog-proof-probe.ts): the host measured 390x219.38 at 390x844 with touch emulation and 1366x768.38 at 1366x1024 with a fine pointer, both exactly the declared aspect-ratio 16 / 9 (SCENE_CSS, scene.ts:2127), with 0 page errors. RTL safe: the surface is full bleed and the RTL plane leaves it at x 0 width 390. It touches no edge of its own, so the safe area is the scaffold's plane.

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-scene`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `media`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-09-07 | P23B audit 2026-09-07: measured live in the locked Playwright Chromium (evidence/p23b-logs/p23b-probe.json, harness evidence/p23b-logs/p23b-catalog-proof-probe.ts) the host is role img with aria-label bound from the a11yLabel attribute and defaulting to "3D scene" (scene.ts:601-602), measured role img and aria-label "3D scene" on all six planes; the WebGL canvas is aria-hidden true (scene.ts:1402) so the tree carries one node, not a duplicate; the fallback and scheduled notices are role note (scene.ts:1394, 1410); and forced colors gets an explicit CanvasText border with forced-color-adjust auto (SCENE_CSS). There is no keyboard operation to prove because the surface is not interactive, which is the same reading canvas, svg and qrcode carry. |
| ios | review | 2026-09-07 | SCENE-A11Y 2026-09-07: was audited red, the defect is fixed. SceneElement.swift now sets accessibilityLabel beside the existing isAccessibilityElement / .image trait, from the shared name fold SceneA11y.accessibleName: the scene's own a11yLabel, else the first labelled descendant in document order, else the first text3d value, else the pinned "3D scene". A blank label is not a label at any level. That fold is corpus law on all three renderers (OpenSource/Conformance/scene/a11y.json names section, 9 cases) and its Swift arm runs per pull request: swift_conformance_run_test.rb prints scene-a11y: 19 case(s); check_swift_parse.rb 714 swift files 0 errors; the Runtime iOS build succeeds. REVIEW rather than true because no per component native capture lane exists, so the spoken name is proven as a fold and a compile, never as a VoiceOver recording. |
| android | review | 2026-09-07 | SCENE-A11Y 2026-09-07: was audited red, and it was the worst column: the file carried NO semantics at all. SceneElements.kt and DesktopSceneElement.kt now wrap the host Box in semantics { contentDescription = ...; role = Role.Image }, with the name from the shared fold sceneAccessibleName (the scene's own a11yLabel, else the first labelled descendant, else the first text3d value, else the pinned "3D scene"). All three renderers now speak a NAMED image. MEASURED, counts from the JUnit XML: TEST-despia.engine.scene.SceneConformanceTest.xml tests=282 failures=0 errors=0 (the 9 corpus name cases among them) and TEST-despia.engine.render.SceneElementsTest.xml tests=18 failures=0 errors=0, one of which reads the name through the exact fold the composable hands to contentDescription for four markup shapes. REVIEW rather than true because no per component native capture lane exists, so the spoken name is proven as a fold and a JVM test, never as a TalkBack recording. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

