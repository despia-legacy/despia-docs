---
title: scaffold
description: The base Web twin provides an accessible adaptive split/stack shell with sidebar/content/inspector panes, authored widths, collapse policy, and labels.
order: 3
section: components
element: scaffold
category: layout
scope: library
platforms: web,ios,android
properties: [{"name":"collapse","type":"enum","default":"platform","values":["platform","stack","content","none"]},{"name":"compactAt","type":"number","default":"760"},{"name":"contentLabel","type":"string","default":"Content"},{"name":"inspectorIdeal","type":"number","default":"320"},{"name":"inspectorLabel","type":"string","default":"Inspector"},{"name":"inspectorMax","type":"number","default":"420"},{"name":"inspectorMin","type":"number","default":"240"},{"name":"pane","type":"enum","default":"content for an unpinned child without pane","values":["sidebar","content","inspector"]},{"name":"pin","type":"enum","default":null,"values":["top","bottom"]},{"name":"shell","type":"enum","default":"custom","values":["custom","automatic","native"]},{"name":"sidebarIdeal","type":"number","default":"280"},{"name":"sidebarLabel","type":"string","default":"Sidebar"},{"name":"sidebarMax","type":"number","default":"360"},{"name":"sidebarMin","type":"number","default":"220"},{"name":"sidebarTitle","type":"string","default":null},{"name":"title","type":"string","default":null}]
actions: []
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# scaffold

The base Web twin provides an accessible adaptive split/stack shell with sidebar/content/inspector panes, authored widths, collapse policy, and labels.

<RefMeta platforms="Web,iOS,Android">
Category: Layout - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<scaffold shell="automatic"><vstack pane="sidebar"><text value="Library"/></vstack><scroll pane="content"><text value="Body"/></scroll></scaffold>
```

`scaffold` takes children.

## Catalog specimen

`ScaffoldDefault.dsx`, verbatim from the catalog:

```dsx
<scaffold shell="automatic" compactAt="760" style="width: 100%; height: 200px; border: 1px solid var(--dsx-separator)">
  <head/>
  <vstack pane="sidebar" style="padding: 12px">
    <text value="Library"/>
  </vstack>
  <scroll pane="content" style="padding: 12px">
    <text value="Body"/>
  </scroll>
</scaffold>
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
| `collapse` | `platform` \| `stack` \| `content` \| `none` | `platform` | `content` \ |
| `compactAt` | `number` | `760` | Compact/wide breakpoint in logical points/dp/CSS px. |
| `contentLabel` | `string` | `Content` |  |
| `inspectorIdeal` | `number` | `320` |  |
| `inspectorLabel` | `string` | `Inspector` |  |
| `inspectorMax` | `number` | `420` |  |
| `inspectorMin` | `number` | `240` |  |
| `pane` | `sidebar` \| `content` \| `inspector` | `content for an unpinned child without pane` |  |
| `pin` | `top` \| `bottom` |  |  |
| `shell` | `custom` \| `automatic` \| `native` | `custom` | `native` |
| `sidebarIdeal` | `number` | `280` |  |
| `sidebarLabel` | `string` | `Sidebar` |  |
| `sidebarMax` | `number` | `360` |  |
| `sidebarMin` | `number` | `220` |  |
| `sidebarTitle` | `string` |  |  |
| `title` | `string` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`scaffold` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The base Web twin provides an accessible adaptive split/stack shell with sidebar/content/inspector panes, authored widths, collapse policy, and labels.

**Known limits on the web**

- Web uses semantic CSS layout and does not claim NavigationSplitView, WinUI, or GTK chrome.

**Implementation notes.** Apple uses a real NavigationSplitView when available. Compose/Web use semantic split/stack layouts and do not claim WinUI or GTK. See OpenSource/Conformance/layout/adaptive-shell.json.

Declared platforms: `ios`, `android`, `web`, `macos`, `windows`, `linux`.

**Adaptivity (web, 2026-08-18).** 1366: sidebar/content/inspector side by side (x=30/250/1097); below compactAt: panes stack (collapse=stack); /system gallery rides it in production - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-scaffold`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | nav/main/aside panes with sidebarLabel/contentLabel/inspectorLabel; a11y-demo.ts: 0 serious/critical over /system gallery, all 4 sections, light+dark (the /system gallery rides scaffold) |
| ios | review | 2026-08-18 | Panes are accessibility containers (.accessibilityElement(children: .contain), Scaffold.swift pane) inside the system split view; pinned bars stay reachable (CI asserts pinned survives the adaptive split). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: every pane is a labelled semantics node: testTag dsx.scaffold.`<role>` + contentDescription Sidebar/Content/Inspector (Containers.kt Pane, SCAFFOLD_*_LABEL); bars stay inside safe insets so content is never occluded. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

