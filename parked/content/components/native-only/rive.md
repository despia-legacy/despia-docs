---
title: rive
description: No Rive runtime ships with the web renderer; `<rive>` is a MODULE element, and the Core/Rive web facet fills the tag through the module component loader whenever the module is registered and its pinned @rive-app/canvas player was fetched by the build.
order: 3
section: components
element: rive
category: media
scope: module-owned
platforms: ios,android
properties: [{"name":"a11yLabel","type":"string","default":null},{"name":"alignment","type":"string","default":"center"},{"name":"animation","type":"string","default":null},{"name":"artboard","type":"string","default":null},{"name":"autoplay","type":"bool","default":"true"},{"name":"fit","type":"string","default":"contain"},{"name":"inputs","type":"expr","default":null},{"name":"on:error","type":"action","default":null},{"name":"on:event","type":"action","default":null},{"name":"on:load","type":"action","default":null},{"name":"on:stateChange","type":"action","default":null},{"name":"ref","type":"string","default":null},{"name":"speed","type":"number","default":"1"},{"name":"src","type":"url","default":null},{"name":"stateMachine","type":"string","default":null}]
actions: ["error","event","load","stateChange"]
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# rive

No Rive runtime ships with the web renderer; `<rive>` is a MODULE element, and the Core/Rive web facet fills the tag through the module component loader whenever the module is registered and its pinned @rive-app/canvas player was fetched by the build.

<RefMeta platforms="iOS,Android">
Category: Media - Live specimens: the [System gallery](/system).
</RefMeta>

This element is web unsupported by DESIGN, not by omission: its essence is a vendor or platform runtime the web renderer does not ship, and its facet fills the tag only when its module is registered. It is named here rather than left off the list, because a library that quietly omits its own rows is not a library.

**The ruling**, 2026-08-18. component-library.md 'Out of scope, named': native-first module tags follow their module roadmaps; the row stays on the scoreboard without blocking the trinity.

Module: `rive`.

## Usage

```dsx
<rive src="cart.riv" stateMachine="Cart" inputs="{ itemCount: 3 }" a11yLabel="Shopping cart"/>
```

`rive` takes no children.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `a11yLabel` | `string` |  |  |
| `alignment` | `string` | `center` |  |
| `animation` | `string` |  |  |
| `artboard` | `string` |  |  |
| `autoplay` | `bool` | `true` |  |
| `fit` | `string` | `contain` |  |
| `inputs` | `expr` |  |  |
| `on:error` | `action` |  |  |
| `on:event` | `action` |  |  |
| `on:load` | `action` |  |  |
| `on:stateChange` | `action` |  |  |
| `ref` | `string` |  |  |
| `speed` | `number` | `1` |  |
| `src` | `url` |  |  |
| `stateMachine` | `string` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `error` | `on:error="..."` |
| `event` | `on:event="..."` |
| `load` | `on:load="..."` |
| `stateChange` | `on:stateChange="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `unsupported` | no renderer and no polyfill; the runtime mounts the labelled placeholder |
| ios | `reference` | the reference renderer this element is specified against |
| android | `module-facet` | filled by the module facet when that module is registered |
| desktop | `unavailable` | the desktop build bundles no runtime for it and answers with a typed refusal |

No Rive runtime ships with the web renderer; `<rive>` is a MODULE element, and the Core/Rive web facet fills the tag through the module component loader whenever the module is registered and its pinned @rive-app/canvas player was fetched by the build.

**Known limits on the web**

- With Core/Rive registered the facet consumes src, artboard, stateMachine, animation, inputs, autoplay, fit, alignment, speed, ref, a11yLabel and the on:load / on:stateChange / on:event / on:error handlers; the input fold, the selection refusals, fit and alignment and the playback schedule all come from the shared kernel core, so a state machine cannot mean one thing here and another on a phone.
- The player is 2.2 MB of js and wasm and is fetched in CI from the coordinate pinned in the module's dsx.lock.json. A build without that fetch reports the typed absence (unsupported_platform) and renders the labelled unavailable card, never blank pixels.
- Without the module (excluded builds, sliced embeds), no attribute is consumed.

**Fallback.** Mounts the honest dsx-unsupported placeholder whenever the Core/Rive module is absent - a labelled marker carrying the `<rive>` name and the dsx-unsupported class; never blank, never a fake lookalike of the native surface.

**Implementation notes.** STATE-MACHINE animation, rendered by Rive's own runtime on every target (rive-ios, rive-android, @rive-app/canvas) - so pixels are the vendor's and are pinned nowhere. Everything AROUND the vendor is the shared kernel core (RiveCore.swift / RiveCore.kt / rive-core.ts, corpus OpenSource/Conformance/rive/) and IS pinned: the input fold and its trigger edges, the artboard/machine/animation selection and its refusals, fit and alignment, the playback and residency lifecycle, the payload shapes and the accessibility verdict. A timeline is `<lottie>`; a state machine is `<rive>`. Provided by the excludable Core/Rive module: with the module dropped the tag is unresolved, and on the NATIVE renderers its children render instead (the author's own fallback). The web renderer mounts its dsx-unsupported box for any unresolved tag and ignores the children today - the same behaviour `<lottie>` has there, and a cross-cutting mount.ts decision rather than this element's.

Declared platforms: `ios`, `android`.

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

