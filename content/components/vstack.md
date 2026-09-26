---
title: vstack
description: The base Web twin renders a vertical flex stack with DSX spacing/alignment and slot content through the universal style contract.
order: 3
section: components
element: vstack
category: layout
scope: library
platforms: web,ios,android
properties: [{"name":"align","type":"enum","default":"leading","values":["leading","center","trailing"]},{"name":"spacing","type":"number","default":"8"}]
actions: []
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# vstack

The base Web twin renders a vertical flex stack with DSX spacing/alignment and slot content through the universal style contract.

<RefMeta platforms="Web,iOS,Android">
Category: Layout - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<vstack style="gap: 8px; align-items: start; justify-items: start"><text value="Title"/><text value="Subtitle" style="color: var(--dsx-secondary-label)"/></vstack>
```

`vstack` takes children.

## Catalog specimen

`VstackDefault.dsx`, verbatim from the catalog:

```dsx
<vstack style="width: 100%; gap: 8px">
  <head/>
  <text value="Title"/>
  <text value="Subtitle"/>
</vstack>
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
| `align` | `leading` \| `center` \| `trailing` | `leading` | Cross-axis alignment is pure alignment and does not size the stack. To center a section across the screen, compose parent participation and child alignment with `<vstack style="align-self: stretch; align-items: center">`. **vstack:** `leading`(default)/`center`/`trailing`. **hstack:** `center`(default)/`top`/`bottom`. **zstack:** `center`(default)/`top`/`bottom`/`leading`/`trailing`/`topLeading`/`topTrailing`/`bottomLeading`/`bottomTrailing`. |
| `spacing` | `number` | `8` | Gap between children (stacks only). CSS `gap`/`row-gap`/`column-gap` resolve onto this axis-correctly (hstack reads the column gap, vstack the row gap). |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`vstack` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The base Web twin renders a vertical flex stack with DSX spacing/alignment and slot content through the universal style contract.

**Known limits on the web**

- Flexbox rounding follows browser layout.

**Implementation notes.** Children render via dsx.slot(); a bare `<spacer/>` child is flexible space.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** layout primitive: presentation IS the authored geometry, declared identical across widths; probed at 390/1366 with overflow 0 and RTL mirror (hstack reverses, logical properties) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-stack dsx-vstack`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | neutral div; axe 0 serious/critical on the chrome family page light + dark-390 |
| ios | review | 2026-08-18 | Transparent layout container: children carry their own semantics; the kernel a11y pass applies on any element (StackStyle.apply, OpenSource/Engine/Swift/Stack.swift:6060-6092: a11yLabel/aria-label, a11yHint, a11yValue, a11yTrait/role, a11yGroup, a11yHidden; on:tap implies .isButton). ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/VStack/swift/VStack.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: transparent layout container: children own their semantics. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

