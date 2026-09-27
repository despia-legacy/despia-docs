---
title: split
description: The structural twin provides the two/three-pane plan (paneRole resolution, collapseAt/expandAt width classes), the phone stack push with a back pop, the overlay sidebar, ARIA window-splitter dividers with drag and keyboard resize, and value/on:change detail routing.
order: 3
section: components
element: split
category: structure
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"collapseAt","type":"number","default":"760"},{"name":"contentIdeal","type":"number","default":"340"},{"name":"contentMax","type":"number","default":"480"},{"name":"contentMin","type":"number","default":"280"},{"name":"detailMin","type":"number","default":"360"},{"name":"expandAt","type":"number","default":"1104"},{"name":"on:change","type":"action","default":null},{"name":"paneRole","type":"enum","default":null,"values":["sidebar","content","detail"]},{"name":"panes","type":"number","default":null},{"name":"resizable","type":"bool","default":"true"},{"name":"sidebarIdeal","type":"number","default":"280"},{"name":"sidebarMax","type":"number","default":"360"},{"name":"sidebarMin","type":"number","default":"220"},{"name":"value","type":"expr","default":null}]
actions: ["change"]
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# split

The structural twin provides the two/three-pane plan (paneRole resolution, collapseAt/expandAt width classes), the phone stack push with a back pop, the overlay sidebar, ARIA window-splitter dividers with drag and keyboard resize, and value/on:change detail routing.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Structure - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<split value="dsx.variable.note"><list paneRole="sidebar" bind="dsx.variable.notes"><text bind="dsx.this.title"/></list><vstack paneRole="detail"><text value="{{ dsx.variable.note }}"/></vstack></split>
```

`split` takes children.

## Catalog specimen

`SplitDefault.dsx`, verbatim from the catalog:

```dsx
<split value="dsx.variable.note" style="width: 100%; height: 180px; border: 1px solid var(--dsx-separator)">
  <head>
    <variable as="note">return 'First note'</variable>
    <variable as="notes">return [{ id: 1, title: 'First note' }, { id: 2, title: 'Second note' }]</variable>
  </head>
  <list paneRole="sidebar" bind="dsx.variable.notes" key="id">
    <text value="{{ dsx.this.title }}"/>
  </list>
  <vstack paneRole="detail" style="padding: 12px">
    <text value="{{ dsx.variable.note }}"/>
  </vstack>
</split>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | rest/hover washes on kernel chrome (toggle fill, divider hover + dragging accent), focus-visible rings on divider/toggle/back, selection states: detail push active/inactive (data-dsx-detail-active), overlay open/closed (aria-expanded + scrim), resizable=false disarms the divider (tabindex -1, keys inert); light+dark - w9 Chromium probe (compileComponent->instantiate, full skin) scratchpad/split-probe.ts (32 checks green), shots/w9-split.png (390/1024/1680) + w9-split-dark.png |
| ios | review | 2026-08-18 | Selection bridges value= to the compact column: a non-empty selection prefers the detail column, the platform Back pop clears it and fires on:change once, mount selection is not a change (compactColumn Binding, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Split/swift/Split.swift:99-117); the fold is pinned in SplitPlan + OpenSource/Conformance/split/split.json and verified through the real Swift planner by SplitConformance on the record lane. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: value= two-way detail selection: compact = the host pane with the selected detail covering it (the stack-push idiom), medium = pinned pair + scrimmed sidebar overlay with a labelled 40dp toggle, expanded = all panes pinned (Containers.kt SplitElement); selectionActive from the shared planner. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `collapseAt` | `number` | `760` | iOS and Web stack below this **container** width. |
| `contentIdeal` | `number` | `340` |  |
| `contentMax` | `number` | `480` |  |
| `contentMin` | `number` | `280` |  |
| `detailMin` | `number` | `360` | The flexible detail column's floor (clamps divider drag / the web grid `minmax`). |
| `expandAt` | `number` | `1104` | A three-pane split pins its sidebar at/above this width and overlays it below; raised to `collapseAt` when authored lower. |
| `on:change` | `action` |  | Fires only when the **split itself** clears the selection (the compact Back pop) - never for the selection it mounted with. |
| `paneRole` | `sidebar` \| `content` \| `detail` |  |  |
| `panes` | `number` |  | Advisory pane-count hint; the children are the truth. |
| `resizable` | `bool` | `true` | Desktop divider drag + arrow/Home/End keyboard resize (fine pointers, columns presentation) on the semantic renderers. |
| `sidebarIdeal` | `number` | `280` |  |
| `sidebarMax` | `number` | `360` |  |
| `sidebarMin` | `number` | `220` |  |
| `value` | `expr` |  | Two-way selected detail identity; `""`/blank = none (numeric ids like `0` stay selectable). |

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

The structural twin provides the two/three-pane plan (paneRole resolution, collapseAt/expandAt width classes), the phone stack push with a back pop, the overlay sidebar, ARIA window-splitter dividers with drag and keyboard resize, and value/on:change detail routing.

**Known limits on the web**

- Presentation resolves from the split's own container width (ResizeObserver) rather than a native split host; the platform Back chrome is a kernel-rendered button.

**Implementation notes.** The two/three-pane adaptive container (component-library.md W9) - the shared planner is OpenSource/Engine/Swift/SplitPlan.swift with corpus OpenSource/Conformance/split/split.json (TS packages/dom/src/split.ts and Kotlin :core SplitPlan.kt run the same file). Apple renders a real NavigationSplitView (two panes = two columns, three = three; iOS 17+/macOS 14+ bridge value= to preferredCompactColumn so a non-empty selection pushes the detail on compact and the platform Back pop clears it + fires on:change). Android renders the plan's list-detail shape with Compose (:render SplitElement) - compact stack push, medium pinned pair + overlay sidebar, expanded all-pane row with the M3 readable margin. Web plans from the CONTAINER width via ResizeObserver (collapseAt/expandAt are live attributes) and adds draggable hairline dividers on fine pointers; native delegates the compact/regular switch to the platform split host, per system-defaults.md - the same division as `<tabs>`.

Declared platforms: `ios`, `android`, `web`, `macos`, `windows`, `linux`.

**Adaptivity (web, 2026-08-18).** DECLARED trio from the split's OWN container width (ResizeObserver, author-movable collapseAt/expandAt): <760 stack (host pane is the screen, detail pushes, Back pops), 760-1104 three-pane pinned pair + scrimmed overlay sidebar behind a toggle (chrome-strip reservation, Escape/scrim close), >=1104 all panes pinned with hairline dividers; RTL probed (mirrored push keyframes, inverted divider keyboard step); safe-area env() insets on toggle/back/chrome strip - w9 Chromium probe (compileComponent->instantiate, full skin) scratchpad/split-probe.ts (32 checks green), shots/w9-split.png (390/1024/1680) + w9-split-dark.png

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-split`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `structural`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | role=group host + named panes, dividers role=separator aria-orientation/valuemin/valuemax/valuenow with the ARIA window-splitter keyboard contract (Arrows/Home/End, probed), toggle aria-expanded + focus handoff into the overlay, Escape closes, back pop returns focus to the host, covered panes inert + aria-hidden; axe clean on stack/overlay/columns, light+dark - w9 Chromium probe (compileComponent->instantiate, full skin) scratchpad/split-probe.ts (32 checks green), shots/w9-split.png (390/1024/1680) + w9-split-dark.png |
| ios | review | 2026-08-18 | System NavigationSplitView semantics (columns + Back); panes stamp the sidebar seam for context-resolved lists (dsxInSidebarColumn, pane()). ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Split/swift/Split.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: every pane is a labelled semantics node (testTag dsx.split.`<role>` + contentDescription, Containers.kt:306-307); the sidebar toggle carries Show/Hide sidebar content descriptions (Containers.kt scrim/toggle block); the scrim is tappable to close. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

