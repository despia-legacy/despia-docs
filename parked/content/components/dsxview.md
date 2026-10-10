---
title: DSXView
description: The rich Web twin mounts the screen component src names from this build's compiled registry (the web reading of the native rule that a shipped tag of the same name always wins), with reactive src re-resolution, the stable dsx-view lifecycle events, and a labelled unavailable state.
order: 3
section: components
element: DSXView
category: web
scope: library
platforms: web,ios,android
properties: [{"name":"origin","type":"string","default":null},{"name":"src","type":"url","default":null}]
actions: []
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# DSXView

The rich Web twin mounts the screen component src names from this build's compiled registry (the web reading of the native rule that a shipped tag of the same name always wins), with reactive src re-resolution, the stable dsx-view lifecycle events, and a labelled unavailable state.

<RefMeta platforms="Web,iOS,Android">
Category: Web - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<DSXView src="Screens/Home.dsx"/>
```

`DSXView` takes no children.

## Catalog specimen

`DSXViewDefault.dsx`, verbatim from the catalog:

```dsx
<vstack style="gap: 6px; max-width: 260px">
  <head/>
  <text value="DSXView mounts a .dsx document by path."/>
  <text value="Web: partial. iOS and Android: the real thing." class="partial-note"/>
</vstack>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | n/a | 2026-08-18 | Non-interactive host embed: no rest/hover/pressed/focus/disabled axis on the host itself; the registry-resolution outcome (dsx-view-unavailable card) is value-driven data, and the mounted screen component's interaction states are audited on that component's own rows (OpenSource/Engine/TypeScript/support/element-support.json DSXView row; packages/dom/src/elements.ts dsx-view factory). |
| ios | review | 2026-08-18 | Screen lifecycle is the state surface: loading/ready/failed/disappear broadcast on the stable dsx-view scheme, offline-first cached render + background revalidate, atomic content generations (never mixed deploys) (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Views/DSXView/swift/DSXView.swift header LIFECYCLE + DSXRemoteCache.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: loading/ready/failed lifecycle broadcast on the stable surface (DSXViewComponent.kt header E1); loading placeholder = the kernel spinner (header: iOS ProgressView twin); failure strings surfaced (e.g. INTEGRITY message, DSXViewComponent.kt:134); offline-first cached render (DSXContent.cachedFile/freshFile). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `origin` | `string` |  |  |
| `src` | `url` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`DSXView` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `partial` | a renderer exists and is narrower than the reference in the ways listed below |
| ios | `reference` | the reference renderer this element is specified against |
| android | `module-facet` | filled by the module facet when that module is registered |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The rich Web twin mounts the screen component src names from this build's compiled registry (the web reading of the native rule that a shipped tag of the same name always wins), with reactive src re-resolution, the stable dsx-view lifecycle events, and a labelled unavailable state.

**Known limits on the web**

- src resolves against the compiled component registry only: remote DSX fetching, screen-folder manifests, and the native DSXRemoteCache/offline generation policy are native-only, so origin is not consumed.
- An unresolvable src renders the labelled dsx-view-unavailable status card instead of the native retryable DSXNativeUnavailable screen.

**Fallback.** Mounts the dsx-view host and resolves src from the compiled registry; a src this build does not ship renders a labelled role=status unavailable card, never blank and never a fake native surface.

**Implementation notes.** Remote/native DSX surface (remote-cached via DSXRemoteCache).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** Pure fill-its-container embed host: the host declares no phone/tablet/desktop variance of its own; presentation belongs to the mounted screen component, audited on its own rows (OpenSource/Engine/TypeScript/support/element-support.json DSXView row).

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-view`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `rich`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | no, and named | 2026-08-18 | W11 disposition (b), dated decision: the web twin is the documented registry-resolved fallback (OpenSource/Engine/TypeScript/support/element-support.json DSXView row keeps status partial); the composed native-surface semantics are native-owned per OpenSource/Documentation/architecture/web-surface-policy.md, so the host's own a11y (labelled role=status unavailable card) is not held to the library axe/keyboard bar on this renderer. Red-by-record. |
| ios | review | 2026-08-18 | Renders native SwiftUI from the fetched DSX, so standard component semantics apply unchanged (the kernel a11y pass applies on any element (StackStyle.apply, OpenSource/Engine/Swift/Stack.swift:6060-6092: a11yLabel/aria-label, a11yHint, a11yValue, a11yTrait/role, a11yGroup, a11yHidden; on:tap implies .isButton)); the component adds no chrome of its own. ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Views/DSXView/swift/DSXView.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: the rendered remote markup carries its own element semantics (every element renders through the same StackNodeView pipeline); the surface adds no chrome needing labels beyond the kernel spinner placeholder (DSXViewComponent.kt). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

