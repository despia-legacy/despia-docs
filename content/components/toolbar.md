---
title: toolbar
description: The structural twin provides toolbar semantics, position/spacing, child content, and roving arrow/Home/End focus behavior.
order: 3
section: components
element: toolbar
category: structure
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"position","type":"enum","default":"bottom","values":["bottom","top"]},{"name":"spacing","type":"number","default":"12"}]
actions: []
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# toolbar

The structural twin provides toolbar semantics, position/spacing, child content, and roving arrow/Home/End focus behavior.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Structure - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<toolbar position="bottom"><button icon="square.and.arrow.up"/><spacer/><button icon="trash"/></toolbar>
```

`toolbar` takes children.

## Catalog specimen

`ToolbarDefault.dsx`, verbatim from the catalog:

```dsx
<toolbar position="bottom" style="width: 100%">
  <head/>
  <button icon="square.and.arrow.up" a11yLabel="Share"/>
  <spacer/>
  <button icon="trash" a11yLabel="Delete"/>
</toolbar>
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
| `position` | `bottom` \| `top` | `bottom` |  |
| `spacing` | `number` | `12` |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`toolbar` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The structural twin provides toolbar semantics, position/spacing, child content, and roving arrow/Home/End focus behavior.

**Known limits on the web**

- Material/backdrop rendering follows browser support and forced-colors fallbacks.

**Implementation notes.** Bar material (.bar) + a Color(white:0.5).opacity(0.35) hairline on the content-facing edge (Toolbar.swift:33-37).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-09-04).** Toolbar uses logical inline layout, safe-area padding, and declared coarse versus fine-pointer target metrics (STRUCTURAL_CONTROLS_CSS; structural-controls.test.ts).

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-toolbar`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `structural`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-09-04 | Toolbar exposes role, name, and horizontal orientation; ArrowLeft, ArrowRight, Home, and End move focus among native controls without activation (structural-controls.ts toolbar; structural-controls.test.ts). |
| ios | review | 2026-08-18 | Transparent container (children own their semantics); the hairline is a shape (no stray a11y element); the bar material is decorative. ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Toolbar/swift/Toolbar.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: slot content keeps its own semantics in a centered Row; the bar itself is chrome (Containers.kt ToolbarElement). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

