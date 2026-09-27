---
title: Table
description: The global Web twin renders the whole native Table contract: a semantic, scroll-contained table from bound rows, declared columns/fields (fields defaulting to the lowercased column labels), semantic tint, header cell traits and one combined accessibility element per row.
order: 3
section: components
element: Table
category: display
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-label)"},{"name":"columns","type":"csv","default":null},{"name":"fields","type":"csv","default":null}]
actions: []
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# Table

The global Web twin renders the whole native Table contract: a semantic, scroll-contained table from bound rows, declared columns/fields (fields defaulting to the lowercased column labels), semantic tint, header cell traits and one combined accessibility element per row.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Display - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<Table bind="dsx.variable.rows" columns="Name,Price"/>
```

`Table` takes no children.

## Catalog specimen

`TableDefault.dsx`, verbatim from the catalog:

```dsx
<Table bind="dsx.variable.rows" columns="Name,Price" style="width: 100%">
  <head>
    <variable as="rows">return [{ Name: 'Weekly', Price: '4.99' }, { Name: 'Monthly', Price: '14.99' }]</variable>
  </head>
</Table>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: th scope=col headers + bound td cells (columns/fields grammar), tbody row hover fill, light+dark render - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | Non-interactive rows by design on iOS (rows carry no tap/hover contract; the web row-hover is a web-skin affordance); a zero-row bind renders the header row only; cells render bound text lineLimit(1). ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Core/swift/Table.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | n/a | 2026-08-18 | non-interactive data display on this renderer: static header + rows, no press/focus/disabled axis (Displays.kt Table; the web column's row hover fill is that renderer's own idiom - Android touch has no hover plane and the Table draws none). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `bind` | `expr` |  |  |
| `color` | `color` | `var(--dsx-label)` |  |
| `columns` | `csv` |  |  |
| `fields` | `csv` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`Table` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The global Web twin renders the whole native Table contract: a semantic, scroll-contained table from bound rows, declared columns/fields (fields defaulting to the lowercased column labels), semantic tint, header cell traits and one combined accessibility element per row.

**Known limits on the web**

- Bound tables are windowed by row: the frame's viewport plus an overscan band is live, two spacer rows keep the frame's full scroll extent, and aria-rowcount counts the whole table. No row is dropped and no truncation is stamped; column and cell text stay bounded for hostile input.
- Sorting, selection, editing, column resizing and virtualization are not part of the contract on ANY runtime - the native reference is a plain data table too. Compose `<grid>` with a row template when cells need custom controls.

**Implementation notes.** Each data row reads as ONE a11y element; headers carry the header trait (Table.swift:37,53).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** fluid width: 641px at 1366, fits 358px at 390 with no internal overflow; dashboard parity fixture recorded at both widths - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-table-frame`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `global`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | table/th[scope=col]/td semantics probed; axe 0 serious/critical on the data family page light (dark: text link finding filed separately) |
| ios | review | 2026-08-18 | Header cells carry .isHeader and each data row reads as ONE element (.accessibilityElement(children: .combine)) - the documented row-merge contract (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Core/swift/Table.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: each data row merges into ONE a11y utterance (mergeDescendants - Displays.kt header names this exact Compose twin); header row styled as the 13sp secondary header. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

