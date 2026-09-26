---
title: chart
description: The rich Web twin renders accessible SVG line, area, bar and point charts from bound data - multi-series with palette or single color=, stacked= areas and bars (domain from the stack totals, bands closing on the previous layer), legend= at the census positions (a figcaption, so assistive tech reads it as the caption), xType=time positioning by parsed timestamps with the kernel timeTicks ladder, y2Key/y2Color riding a labeled secondary axis, animate= draw-in (reduced-motion instant), interpolation=linear|smooth|monotone|step, grids, and deterministic downsampling.
order: 3
section: components
element: chart
category: data
scope: library
platforms: web,ios,android
properties: [{"name":"animate","type":"bool","default":"true"},{"name":"areaOpacity","type":"number","default":"0.25"},{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"colors","type":"csv","default":null},{"name":"data","type":"expr","default":null},{"name":"interpolation","type":"enum","default":"linear","values":["linear","monotone","step"]},{"name":"legend","type":"enum","default":"bottom with series, else none","values":["bottom","top","leading","trailing","none"]},{"name":"lineWidth","type":"number","default":"2"},{"name":"pointSize","type":"number","default":"40"},{"name":"series","type":"string","default":null},{"name":"showPoints","type":"bool","default":"false"},{"name":"stacked","type":"bool","default":"true for area, else false"},{"name":"type","type":"enum","default":"line","values":["line","bar","area","point"]},{"name":"x","type":"string","default":null},{"name":"xGrid","type":"bool","default":"false"},{"name":"xHide","type":"bool","default":"false"},{"name":"xType","type":"enum","default":"category","values":["category","number","time"]},{"name":"y","type":"string","default":null},{"name":"y2Color","type":"color","default":"#FF9500"},{"name":"y2Key","type":"string","default":null},{"name":"yGrid","type":"bool","default":"true"},{"name":"yHide","type":"bool","default":"false"}]
actions: []
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# chart

The rich Web twin renders accessible SVG line, area, bar and point charts from bound data - multi-series with palette or single color=, stacked= areas and bars (domain from the stack totals, bands closing on the previous layer), legend= at the census positions (a figcaption, so assistive tech reads it as the caption), xType=time positioning by parsed timestamps with the kernel timeTicks ladder, y2Key/y2Color riding a labeled secondary axis, animate= draw-in (reduced-motion instant), interpolation=linear|smooth|monotone|step, grids, and deterministic downsampling.

<RefMeta platforms="Web,iOS,Android">
Category: Data - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<chart type="line" data="dsx.variable.sales" x="month" y="revenue" style="height: 220px; min-height: 220px"/>
```

`chart` takes no children.

## Catalog specimen

`ChartDefault.dsx`, verbatim from the catalog:

```dsx
<chart type="line" data="dsx.variable.sales" x="month" y="revenue" style="width: 100%; height: 160px">
  <head>
    <variable as="sales">return [{ month: 'Jan', revenue: 12 }, { month: 'Feb', revenue: 18 }, { month: 'Mar', revenue: 15 }, { month: 'Apr', revenue: 24 }]</variable>
  </head>
</chart>
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
| `animate` | `bool` | `true` |  |
| `areaOpacity` | `number` | `0.25` |  |
| `color` | `color` | `var(--dsx-accent)` |  |
| `colors` | `csv` |  |  |
| `data` | `expr` |  |  |
| `interpolation` | `linear` \| `monotone` \| `step` | `linear` |  |
| `legend` | `bottom` \| `top` \| `leading` \| `trailing` \| `none` | `bottom with series, else none` |  |
| `lineWidth` | `number` | `2` |  |
| `pointSize` | `number` | `40` |  |
| `series` | `string` |  |  |
| `showPoints` | `bool` | `false` |  |
| `stacked` | `bool` | `true for area, else false` |  |
| `type` | `line` \| `bar` \| `area` \| `point` | `line` |  |
| `x` | `string` |  |  |
| `xGrid` | `bool` | `false` |  |
| `xHide` | `bool` | `false` |  |
| `xType` | `category` \| `number` \| `time` | `category` |  |
| `y` | `string` |  |  |
| `y2Color` | `color` | `#FF9500` |  |
| `y2Key` | `string` |  |  |
| `yGrid` | `bool` | `true` |  |
| `yHide` | `bool` | `false` |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`chart` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `module-facet` | filled by the module facet when that module is registered |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The rich Web twin renders accessible SVG line, area, bar and point charts from bound data - multi-series with palette or single color=, stacked= areas and bars (domain from the stack totals, bands closing on the previous layer), legend= at the census positions (a figcaption, so assistive tech reads it as the caption), xType=time positioning by parsed timestamps with the kernel timeTicks ladder, y2Key/y2Color riding a labeled secondary axis, animate= draw-in (reduced-motion instant), interpolation=linear|smooth|monotone|step, grids, and deterministic downsampling.

**Known limits on the web**

- More than 2,000 source points are deterministically downsampled.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical fluid presentation at both widths (data family page 390+1366, overflow 0); RTL page mirrors (ChatBubble sides flip: firstFromRight=0) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-chart`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `rich`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | accessible SVG with generated summary label ('line chart with 4 points; values range from 0 to 8'); axe 0 serious/critical on the data family page light (dark: text link finding filed separately) |
| ios | review | 2026-08-18 | The platform charting framework provides per-mark accessibility elements by default for its marks; the kernel a11y pass applies on any element (StackStyle.apply, OpenSource/Engine/Swift/Stack.swift:6060-6092: a11yLabel/aria-label, a11yHint, a11yValue, a11yTrait/role, a11yGroup, a11yHidden; on:tap implies .isButton). ClosedSource/DSX/Modules/Core/Charts/swift/Charts.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-19 | W12 red sweep 2026-08-19: the web-generated summary ported to Compose semantics - contentDescription '`<type>` chart with N points; values range from `<min>` to `<max>`' (empty data reads '`<type>` chart with 0 points') on the chart Canvas (ClosedSource/DSX/Modules/Core/Charts/kotlin/Charts.kt ChartView; the elements.ts figure aria-label twin). :app:assembleDebug green. Pending the Android capture lane. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

