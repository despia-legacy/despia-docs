---
title: tabs
description: The structural twin provides ARIA tabs/tabpanels, bound selection, icons/badges/titles, change events, and keyboard traversal.
order: 3
section: components
element: tabs
category: structure
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"on:change","type":"action","default":null},{"name":"tabBadge","type":"string","default":null},{"name":"tabIcon","type":"sf-symbol","default":null},{"name":"tabTitle","type":"string","default":null},{"name":"value","type":"expr","default":null}]
actions: ["change"]
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# tabs

The structural twin provides ARIA tabs/tabpanels, bound selection, icons/badges/titles, change events, and keyboard traversal.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Structure - Also answers to `tabview` - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<tabs value="dsx.variable.tab" style="color: var(--dsx-accent)"><vstack tabTitle="Home" tabIcon="house.fill"><text value="Home"/></vstack><vstack tabTitle="Library" tabIcon="books.vertical"><text value="Library"/></vstack></tabs>
```

`tabs` takes children. The same element answers to `tabview`.

## Catalog specimen

`TabsDefault.dsx`, verbatim from the catalog:

```dsx
<tabs value="dsx.variable.tab" style="width: 100%; height: 160px">
  <head>
    <variable as="tab">return 0</variable>
  </head>
  <vstack tabTitle="Home" tabIcon="house.fill" style="padding: 12px">
    <text value="Home"/>
  </vstack>
  <vstack tabTitle="Library" tabIcon="books.vertical" style="padding: 12px">
    <text value="Library"/>
  </vstack>
</tabs>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: active/inactive treatment (accent + pill), click + ArrowDown/ArrowRight switching, tabBadge renders (3), on:change fires - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | Two-way value selection (child index) with mount-echo dedup (on:change only on a real change); per-pane tabTitle/tabIcon/tabBadge (.badge) (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Tabs/swift/Tabs.swift); selected/pressed tab states are the system bar's own. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: M3 NavigationSuiteScaffold items with platform selected/unselected state layers; selected icon/label carry the authored tint, every other role stays M3 (StackNodeView.kt Tabs, itemColors block); value= two-way index through the seam; badges render M3 Badge. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `color` | `color` | `var(--dsx-accent)` |  |
| `on:change` | `action` |  |  |
| `tabBadge` | `string` |  |  |
| `tabIcon` | `sf-symbol` |  |  |
| `tabTitle` | `string` |  |  |
| `value` | `expr` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `change` | `on:change="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The structural twin provides ARIA tabs/tabpanels, bound selection, icons/badges/titles, change events, and keyboard traversal.

**Known limits on the web**

- Tab chrome and overflow behavior adapt to DSX Web rather than a native tab bar.

**Implementation notes.** Desktop class (Tabs.swift:57 adaptive): iOS 18 / macOS 15+ adopt .tabViewStyle(.sidebarAdaptable) - iPhone keeps the bottom bar, regular-width iPad presents the top tab bar with the user-toggleable sidebar, macOS the sidebar; older OSes keep the classic TabView. Android (StackNodeView.kt Tabs) adopts the same shape through Material 3 NavigationSuiteScaffold - compact width renders the bottom navigation bar, medium/expanded the navigation rail, per the platform's own WindowSizeClass; color= rides the suite's item colors, tabIcon the sf-map subset, tabBadge the M3 Badge. All attributes are presentation-independent (same value Binding, same tabItem/badge). Native delegates the compact/regular switch to the OS size class, where web uses its >= 69rem rail breakpoint.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** 390 touch: bottom dock, icons+labels, badge (shot w8-audit-chrome-tabs390); 1366 fine: left sidebar rail 240px, vertical rows (shot w8-audit-chrome-tabs1366) - the wave-5 adaptive chrome verified live - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-tabs`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `structural`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | role=tablist/tab + aria-selected, arrow-key selection, labelled icons; axe clean at 390 - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | System tab bar semantics (titles/icons/badges announced by the OS across bar and sidebar presentations). ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Tabs/swift/Tabs.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: M3 NavigationBar/NavigationRail item semantics (selected state, labels) are component-owned; icon-less panes render label-only, title-less label Tab N (StackNodeView.kt Tabs). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

