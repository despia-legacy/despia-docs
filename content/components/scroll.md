---
title: scroll
description: The base Web twin provides vertical or horizontal overflow layout and renders child content through the common binding/style contract.
order: 3
section: components
element: scroll
category: layout
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"axis","type":"enum","default":"vertical","values":["vertical","horizontal"]},{"name":"bind","type":"state-key","default":"none"},{"name":"bounces","type":"bool","default":"platform"},{"name":"contentInset","type":"string","default":"none"},{"name":"direction","type":"enum","default":"vertical","values":["vertical","horizontal"]},{"name":"indicators","type":"bool","default":"true"},{"name":"keyboardDismiss","type":"enum","default":"interactive","values":["none","onDrag","interactive"]},{"name":"maintainPosition","type":"bool","default":"false"},{"name":"on:reachEnd","type":"action","default":"none"},{"name":"on:scroll","type":"action","default":"none"},{"name":"on:scrollEnd","type":"action","default":"none"},{"name":"overscroll","type":"enum","default":"auto","values":["auto","never","always"]},{"name":"paging","type":"bool","default":"false"},{"name":"snap","type":"enum","default":"none","values":["none","start","center","end"]},{"name":"threshold","type":"number","default":"0"}]
actions: ["reachEnd","scroll","scrollEnd"]
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# scroll

The base Web twin provides vertical or horizontal overflow layout and renders child content through the common binding/style contract.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Layout - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<scroll axis="vertical"><vstack style="gap: 8px"><text value="Row"/></vstack></scroll>
```

`scroll` takes children.

## Catalog specimen

`ScrollDefault.dsx`, verbatim from the catalog:

```dsx
<scroll axis="vertical" style="width: 100%; height: 120px">
  <head/>
  <stack style="flex-direction: column; gap: 8px">
    <text value="Row one"/>
    <text value="Row two"/>
    <text value="Row three"/>
    <text value="Row four"/>
    <text value="Row five"/>
    <text value="Row six"/>
    <text value="Row seven"/>
  </stack>
</scroll>
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
| `axis` | `vertical` \| `horizontal` | `vertical` |  |
| `bind` | `state-key` | `none` | Two-way offset. Writing it scrolls; scrolling writes it. |
| `bounces` | `bool` | `platform` |  |
| `contentInset` | `string` | `none` |  |
| `direction` | `vertical` \| `horizontal` | `vertical` |  |
| `indicators` | `bool` | `true` |  |
| `keyboardDismiss` | `none` \| `onDrag` \| `interactive` | `interactive` | `interactive` |
| `maintainPosition` | `bool` | `false` | Keep the visible row anchored when content is prepended. |
| `on:reachEnd` | `action` | `none` | Fires once per approach within `threshold` of the end, and re-arms only after leaving. |
| `on:scroll` | `action` | `none` | Coalesced to one dispatch per frame; `dsx.this` carries offset, size and direction. |
| `on:scrollEnd` | `action` | `none` | Fires once the scroll settles, not on every deceleration frame. |
| `overscroll` | `auto` \| `never` \| `always` | `auto` | `always` |
| `paging` | `bool` | `false` |  |
| `snap` | `none` \| `start` \| `center` \| `end` | `none` | `center` \ |
| `threshold` | `number` (pt) | `0` | Distance from the end that counts as reaching it. |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `reachEnd` | `on:reachEnd="..."` |
| `scroll` | `on:scroll="..."` |
| `scrollEnd` | `on:scrollEnd="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The base Web twin provides vertical or horizontal overflow layout and renders child content through the common binding/style contract.

**Known limits on the web**

- Scrollbar appearance and momentum are browser/OS controlled.

**Implementation notes.** Scroll indicators hidden on both platforms (Scroll.swift:17 showsIndicators: false).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** layout primitive: presentation IS the authored geometry, declared identical across widths; probed at 390/1366 with overflow 0 and RTL mirror (hstack reverses, logical properties) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-scroll`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | scroll container keyboard-scrollable; axe 0 serious/critical on the chrome family page light + dark-390 |
| ios | review | 2026-08-18 | System ScrollView: assistive scrolling is the OS's own; content is transparent; the scroll-container seam only affects layout choices (stackInScrollContainer). ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Scroll/swift/Scroll.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: platform scrollable semantics (Compose scroll modifiers expose scroll actions to TalkBack); children own their content semantics. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

