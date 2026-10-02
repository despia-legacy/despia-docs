---
title: grid
description: The structural/binding twin renders semantic grid rows/cells with responsive columns, keyed reconciliation, spacing, scroll, and reach-end handling - the full grid.json attribute contract (bind/key/columns/spacing/scroll/reachEnd).
order: 3
section: components
element: grid
category: structure
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"bind","type":"expr","default":null},{"name":"columns","type":"number","default":"3"},{"name":"key","type":"string","default":"id"},{"name":"on:reachEnd","type":"action","default":null},{"name":"scroll","type":"bool","default":"true"},{"name":"spacing","type":"number","default":"10"}]
actions: ["reachEnd"]
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# grid

The structural/binding twin renders semantic grid rows/cells with responsive columns, keyed reconciliation, spacing, scroll, and reach-end handling - the full grid.json attribute contract (bind/key/columns/spacing/scroll/reachEnd).

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Structure - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<grid bind="dsx.variable.items" columns="3"><image src="{{ dsx.this.cover }}"/></grid>
```

`grid` takes children: rowTemplate.

## Catalog specimen

`GridDefault.dsx`, verbatim from the catalog:

```dsx
<grid bind="dsx.variable.items" key="id" columns="3" style="gap: 8px; width: 100%">
  <head>
    <variable as="items">return [{ id: 1, name: 'One' }, { id: 2, name: 'Two' }, { id: 3, name: 'Three' }, { id: 4, name: 'Four' }, { id: 5, name: 'Five' }, { id: 6, name: 'Six' }]</variable>
  </head>
  <stack style="height: 48px; border-radius: 8px; background: var(--dsx-fill); align-items: center; justify-content: center">
    <text value="{{ dsx.this.name }}"/>
  </stack>
</grid>
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
| `bind` | `expr` |  |  |
| `columns` | `number` | `3` | Column count (interpolates `{{ }}`). |
| `key` | `string` | `id` |  |
| `on:reachEnd` | `action` |  | Fires when the last cell appears (pagination). |
| `scroll` | `bool` | `true` | `"false"` = no own ScrollView - compose inside `<scroll>` / measured sheets (sizes to content; renders **eagerly** so intrinsic height is real - see the laziness rule under Fit-content). |
| `spacing` | `number` | `10` | Cell gap, both axes. |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `reachEnd` | `on:reachEnd="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The structural/binding twin renders semantic grid rows/cells with responsive columns, keyed reconciliation, spacing, scroll, and reach-end handling - the full grid.json attribute contract (bind/key/columns/spacing/scroll/reachEnd).

**Known limits on the web**

- Bound grids are windowed by row band: the viewport plus an overscan band is live, the container keeps the full scroll extent, and aria-rowcount counts the whole grid. No cell is dropped and no truncation is stamped.
- CSS grid layout owns browser-specific fractional column rounding.

**Implementation notes.** Single child = the cell template, rendered per row in its own item scope with write-back (the `<list>` data model), flowing into `columns` flexible columns (default 3, clamped >=1). Lazy ONLY inside a scrolling viewport (LazyVGrid - a Lazy*Grid reports ~zero ideal height before cells materialize, so an embedded grid collapses); `scroll="false"`/measuring = the EAGER chunked grid (a VStack of HStacks with equal flexible columns, zero-height fillers squaring the last partial row). on:reachEnd fires when the LAST cell appears (pagination). NO LIST-CONSTRUCTS: unlike `<list>`, `<grid>` carries no group_by / swipeLeading / swipeTrailing / reorder - DECLARED PARITY, not a gap. The iOS twin (Grid.swift) is deliberately construct-free and those are List-only on every renderer, so no renderer implements them for `<grid>`; adding them to one renderer alone would violate the unified-codebase law (swipe-to-dismiss has no honest grid analogue anyway - cells share a row). Android: BoundGrid header + android-status.md carry the same ratification. WEB VIRTUALISATION (2026-09-19): the web renderer WINDOWS a scrolling bound grid BY ROW BAND, the band of `columns` cells being the unit the window moves in, with aria-rowcount over the whole grid and each band stating its own index in it. The 1,000 cell cap and data-dsx-truncated are gone; no lane drops a cell.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** columns=3 renders 3-col aria rows at 1366; fits 390 (family page overflow 0); reactive columns are author grammar - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-list dsx-grid`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `structural`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | emits aria row structure (.dsx-grid-aria-row role=row) around cells; axe 0 serious/critical on the chrome family page light + dark-390 |
| ios | review | 2026-08-18 | Transparent collection container: rows carry their own semantics; on:reachEnd rides onAppear (no a11y interception); the kernel a11y pass applies on any element (StackStyle.apply, OpenSource/Engine/Swift/Stack.swift:6060-6092: a11yLabel/aria-label, a11yHint, a11yValue, a11yTrait/role, a11yGroup, a11yHidden; on:tap implies .isButton). ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Grid/swift/Grid.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: rows are content; the lazy grid exposes the platform scrollable-collection semantics (Compose LazyVerticalGrid). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

