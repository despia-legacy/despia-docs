---
title: carousel
description: The structural twin renders accessible slides with two-way current-page binding, snap paging, selection dots, peek and spacing geometry, and change events - the full carousel.json attribute contract.
order: 3
section: components
element: carousel
category: structure
scope: library
platforms: web,ios,android
properties: [{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"dots","type":"bool","default":"true"},{"name":"on:change","type":"action","default":null},{"name":"peek","type":"number","default":"0"},{"name":"spacing","type":"number","default":"12"},{"name":"value","type":"expr","default":null}]
actions: ["change"]
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# carousel

The structural twin renders accessible slides with two-way current-page binding, snap paging, selection dots, peek and spacing geometry, and change events - the full carousel.json attribute contract.

<RefMeta platforms="Web,iOS,Android">
Category: Structure - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<carousel dots="true"><image src="{{ dsx.variable.hero }}"/></carousel>
```

`carousel` takes children.

## Catalog specimen

`CarouselDefault.dsx`, verbatim from the catalog:

```dsx
<carousel dots="true" style="width: 100%; height: 120px">
  <head/>
  <stack style="width: 100%; height: 120px; background: var(--dsx-fill); align-items: center; justify-content: center">
    <text value="One"/>
  </stack>
  <stack style="width: 100%; height: 120px; background: var(--dsx-fill); align-items: center; justify-content: center">
    <text value="Two"/>
  </stack>
</carousel>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-09-04 | The structural carousel exposes current-page state, clickable dots, value writeback, and selected-dot reflection; structural-controls.test.ts and element-support-ledger.test.ts execute those transitions. |
| ios | review | 2026-08-18 | Two-way value selection (child index) with mount-echo dedup (on:change never fires for the mounted page - the TabView re-assert is documented, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Carousel/swift/Carousel.swift); dots toggle via dots=; display-only without value (the OS owns selection). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | n/a | 2026-08-18 | swipe-paged container: no rest/pressed/focus/disabled axis; the page index is two-way data (value= key, Containers.kt CarouselElement) and dots are display-only (header: display-only, like .page's dots). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `color` | `color` | `var(--dsx-accent)` |  |
| `dots` | `bool` | `true` |  |
| `on:change` | `action` |  |  |
| `peek` | `number` | `0` |  |
| `spacing` | `number` | `12` |  |
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
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The structural twin renders accessible slides with two-way current-page binding, snap paging, selection dots, peek and spacing geometry, and change events - the full carousel.json attribute contract.

**Known limits on the web**

- Slides are capped at the 1,000-child structural safety ceiling and are not virtualized.
- Native peek physics are adapted to CSS scroll-snap rather than reproducing the UIKit paging recognizer.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-09-04).** The paged viewport supports fluid horizontal layout, RTL direction, authored peek and spacing, and ResizeObserver realignment (structural-controls.ts paged; structural-controls.test.ts).

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-paged dsx-carousel`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `structural`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-09-04 | The root is a named carousel, pages are labelled slides, dots expose current state, hidden pages are inert, and keyboard arrows select pages (structural-controls.ts paged; structural-controls.test.ts). |
| ios | review | 2026-08-18 | System page-style TabView exposes its page control to assistive tech; page content carries its own semantics; tint touches the dots only. ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Carousel/swift/Carousel.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: pages expose their own content semantics; dots are decorative (Containers.kt:479-482 display-only). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

