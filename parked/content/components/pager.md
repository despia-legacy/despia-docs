---
title: pager
description: The structural/binding twin renders horizontal/vertical snap paging with two-way current-page binding, keyed bound pages, selection dots, and change events - the full pager.json attribute contract.
order: 3
section: components
element: pager
category: structure
scope: library
platforms: web,ios,android
properties: [{"name":"axis","type":"enum","default":"horizontal","values":["horizontal","vertical"]},{"name":"bind","type":"expr","default":null},{"name":"dots","type":"bool","default":"true"},{"name":"key","type":"string","default":"id"},{"name":"on:change","type":"action","default":null},{"name":"value","type":"expr","default":null}]
actions: ["change"]
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# pager

The structural/binding twin renders horizontal/vertical snap paging with two-way current-page binding, keyed bound pages, selection dots, and change events - the full pager.json attribute contract.

<RefMeta platforms="Web,iOS,Android">
Category: Structure - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<pager axis="vertical" value="dsx.variable.page"><vstack><text value="Page one"/></vstack><vstack><text value="Page two"/></vstack></pager>
```

`pager` takes children.

## Catalog specimen

`PagerDefault.dsx`, verbatim from the catalog:

```dsx
<pager value="dsx.variable.page" style="width: 100%; height: 120px">
  <head>
    <variable as="page">return 0</variable>
  </head>
  <vstack style="align-items: center; justify-content: center">
    <text value="Page one"/>
  </vstack>
  <vstack style="align-items: center; justify-content: center">
    <text value="Page two"/>
  </vstack>
</pager>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-09-04 | The pager exposes current-page state, clickable dots, bound value writeback, and selected-dot reflection; mount.test.ts and structural-controls.test.ts execute these transitions. |
| ios | review | 2026-08-18 | Two-way value (page index) with the commit rule: a page commits only when it fully covers the viewport and the offset RESTS on the boundary (~80ms confirm; mid-drag changes nothing), the mount/seed settle is never a change, external writes scroll + fire once (VerticalPagerView, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Pager/swift/Pager.swift); CI-asserted: external writes drive page 0-2-0 with exact change counts (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift testIPadPrivilegedVerticalPagerRespondsToExternalValueWrites). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | n/a | 2026-08-18 | swipe-paged container: no rest/pressed/focus/disabled axis; the page index is two-way data (value=/bind=, StackNodeView Pager branch). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `axis` | `horizontal` \| `vertical` | `horizontal` | `"vertical"` = full-screen vertical paging. |
| `bind` | `expr` |  |  |
| `dots` | `bool` | `true` | Page dots (horizontal only). |
| `key` | `string` | `id` |  |
| `on:change` | `action` |  | Fires when a page **rests** on the viewport (fully covers it, confirmed ~80 ms - a frame that merely *grazes* a boundary mid-fling or mid-jump never commits), never mid-drag, and never for the page the pager opened on. The outgoing page stays live under the finger (a playing video keeps playing, TikTok-style) until the swipe commits; a programmatic jump (writing `value`) commits once, immediately. Read the new index from `value`. |
| `value` | `expr` |  | Two-way current page - a swipe writes it; writing it jumps/scrolls to that page (and a non-zero initial value is honored). |

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
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The structural/binding twin renders horizontal/vertical snap paging with two-way current-page binding, keyed bound pages, selection dots, and change events - the full pager.json attribute contract.

**Known limits on the web**

- Bound pages are capped at the 1,000-page structural safety ceiling and are not virtualized.
- Scroll-boundary commit follows browser scroll events rather than reproducing the native ~80 ms vertical-commit implementation detail.

**Implementation notes.** Vertical commit rule: the current page is the page that FULLY covers the viewport, confirmed after ~80ms at the boundary (Pager.swift:143-156).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-09-04).** The pager supports horizontal or vertical axes, RTL direction, fluid page sizing, and ResizeObserver realignment (mount.ts mountBoundPager; structural-controls.ts paged; their tests).

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-paged dsx-pager`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `structural`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-09-04 | The root is a named carousel, pages are labelled slides, dots expose current state, hidden pages are inert, and axis-aware keyboard arrows select pages (mount.test.ts; structural-controls.test.ts). |
| ios | review | 2026-08-18 | The horizontal form is the system page-style TabView (system page control); vertical pages remain ordinary content in a ScrollView, assistive-scrollable. ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Pager/swift/Pager.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: pages expose their own content semantics (each page is a full StackNodeView). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

