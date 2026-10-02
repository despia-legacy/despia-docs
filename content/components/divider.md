---
title: divider
description: The base Web twin renders the semantic-token divider and accepts universal style/color overrides.
order: 3
section: components
element: divider
category: layout
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"color","type":"color","default":"var(--dsx-separator)"}]
actions: []
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# divider

The base Web twin renders the semantic-token divider and accepts universal style/color overrides.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Layout - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<divider/>
```

`divider` takes no children.

## Catalog specimen

`DividerDefault.dsx`, verbatim from the catalog:

```dsx
<vstack style="gap: 8px; width: 100%">
  <head/>
  <text value="Above"/>
  <divider/>
  <text value="Below"/>
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
| `color` | `color` | `var(--dsx-separator)` |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`divider` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The base Web twin renders the semantic-token divider and accepts universal style/color overrides.

**Known limits on the web**

- Hairline rasterization follows the browser device-pixel ratio.

**Implementation notes.** ITS COLOUR IS STANDARD CSS `background-color`. The hairline is a box with a background on every lane (the `.dsx-divider` rule on the web, a filled Rectangle on iOS, a box background on both Compose lanes), so the proprietary `color` attribute was a second spelling of one declaration and is retired. The separator token stays the element's own default.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical fluid presentation at both widths (data family page 390+1366, overflow 0); RTL page mirrors (ChatBubble sides flip: firstFromRight=0) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-divider`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | purely presentational hairline, no semantics; axe 0 serious/critical on the data family page light (dark: text link finding filed separately) |
| ios | review | 2026-08-18 | Explicitly accessibilityHidden(true) - decorative by contract (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Divider/swift/Divider.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: decorative separator: renders with no semantics, correctly silent to TalkBack. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

