---
title: list
description: The structural/binding twin implements the whole fixture contract: semantic rows, keyed identity, write-back scope, spacing/axis/scroll/alignment, reach-end, group_by sections in first-seen order, the swipe-action rails with both firing shapes and per-edge full-swipe commit, drag reorder that writes the moved array back through the bind seam and fires on:move with FINAL indices, and the horizontal autoscroll marquee - under the same construct gating List.swift uses (scroll="false" and a horizontal axis win over all three; a grouped list ignores reorder; an active reorder suppresses swipe) and with an SSR twin that paints the same first frame.
order: 3
section: components
element: list
category: structure
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"autoscroll","type":"number","default":null},{"name":"axis","type":"enum","default":"vertical","values":["vertical","horizontal"]},{"name":"bind","type":"expr","default":null},{"name":"direction","type":"enum","default":"vertical","values":["vertical","horizontal"]},{"name":"group_by","type":"string","default":null},{"name":"group_footer_by","type":"string","default":null},{"name":"key","type":"string","default":"id"},{"name":"on:move","type":"action","default":null},{"name":"on:reachEnd","type":"action","default":null},{"name":"reorder","type":"bool","default":"false"},{"name":"scroll","type":"bool","default":"true"},{"name":"spacing","type":"number","default":"0"},{"name":"swipeFullLeading","type":"bool","default":"false"},{"name":"swipeFullTrailing","type":"bool","default":"false"},{"name":"swipeLeading","type":"expr","default":null},{"name":"swipeTrailing","type":"expr","default":null}]
actions: ["move","reachEnd"]
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# list

The structural/binding twin implements the whole fixture contract: semantic rows, keyed identity, write-back scope, spacing/axis/scroll/alignment, reach-end, group_by sections in first-seen order, the swipe-action rails with both firing shapes and per-edge full-swipe commit, drag reorder that writes the moved array back through the bind seam and fires on:move with FINAL indices, and the horizontal autoscroll marquee - under the same construct gating List.swift uses (scroll="false" and a horizontal axis win over all three; a grouped list ignores reorder; an active reorder suppresses swipe) and with an SSR twin that paints the same first frame.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Structure - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<list bind="dsx.variable.episodes" key="id" style="gap: 8px"><pressable on:tap="dsx.event('open')"><text bind="dsx.this.title"/></pressable></list>
```

`list` takes children: rowTemplate.

## Catalog specimen

`ListDefault.dsx`, verbatim from the catalog:

```dsx
<list bind="dsx.variable.episodes" key="id" style="width: 100%">
  <head>
    <variable as="episodes">return [{ id: 1, title: 'The first episode' }, { id: 2, title: 'The second episode' }, { id: 3, title: 'The third episode' }]</variable>
  </head>
  <text value="{{ dsx.this.title }}"/>
</list>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: bound rows render 1:1 with key (3/3), rows accept authored pressables, scroll=false honored - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | System List constructs own the interaction states: swipe-action buttons (destructive slot, full-swipe commit opt-in), drag-reorder edit mode, sections; on:reachEnd fires on last-row appear; a zero-row bind renders empty; the unstyled gate + scroll-ancestor seam pick system vs flat paths at render time (ScrollAwareSystemList/SystemListStyle, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/List/swift/List.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: bound keyed rows render 1:1 with per-row item scope + write-back (BoundList, StackNodeView); the unstyled vertical scrolling list upgrades to REAL M3 ListItem rows (StackSystemControls.kt SystemList gate - StackSystemControlsTest green, gradle :render:testDebugUnitTest run 2026-08-18: 292 tests, 1 failure (StackButtonsTest#systemButtonsDelegateTheirDefaultPalettesToMaterial3 - a stale source-grep of the pre-W9 disabled literal, not a behavior break)); constructs: group_by sections, swipe rails, drag reorder + on:move (ListElements.kt). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `autoscroll` | `number` (pts/sec) |  |  |
| `axis` | `vertical` \| `horizontal` | `vertical` |  |
| `bind` | `expr` |  |  |
| `direction` | `vertical` \| `horizontal` | `vertical` |  |
| `group_by` | `string` |  |  |
| `group_footer_by` | `string` |  | The field whose stringified value is the section FOOTER, read from the section's FIRST row. The twin of group_by, which reads the header off the group field, and it takes the same reading for the same reason: a section is defined by its first seen row, so its furniture is too. An absent field, an absent value and an empty string all draw nothing. |
| `key` | `string` | `id` |  |
| `on:move` | `action` |  |  |
| `on:reachEnd` | `action` |  |  |
| `reorder` | `bool` | `false` |  |
| `scroll` | `bool` | `true` |  |
| `spacing` | `number` | `0` |  |
| `swipeFullLeading` | `bool` | `false` |  |
| `swipeFullTrailing` | `bool` | `false` |  |
| `swipeLeading` | `expr` |  |  |
| `swipeTrailing` | `expr` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `move` | `on:move="..."` |
| `reachEnd` | `on:reachEnd="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The structural/binding twin implements the whole fixture contract: semantic rows, keyed identity, write-back scope, spacing/axis/scroll/alignment, reach-end, group_by sections in first-seen order, the swipe-action rails with both firing shapes and per-edge full-swipe commit, drag reorder that writes the moved array back through the bind seam and fires on:move with FINAL indices, and the horizontal autoscroll marquee - under the same construct gating List.swift uses (scroll="false" and a horizontal axis win over all three; a grouped list ignores reorder; an active reorder suppresses swipe) and with an SSR twin that paints the same first frame.

**Known limits on the web**

- Bound lists are windowed rather than fully materialised: the viewport plus an overscan band is live, the container keeps the full scroll extent, and the counts are reported on the element as data-dsx-total-count / rendered-count / window-start. No row is dropped, and on:reachEnd rides the true last row.
- A swipe rail is bounded at 8 buttons per edge and 120 characters per label/icon/colour token, the same containment the overlay item model applies to authored data.
- Swipe buttons are real focusable buttons that a rail opens on focus, rather than DOM hidden until a gesture: the web/AT-honest twin of the native rotor actions, at the cost of extra tab stops per row.
- Drag reorder and the marquee frame loop are inherently interactive, so the server paints the handle and the closed rails statically and the client wires the pointer drag, the keyboard ArrowUp/ArrowDown move and the animation on mount.
- Reorder needs a plain dotted bind path to write the moved array back through; a computed bind expression has no write seam, so the handles do not appear at all rather than moving a row nothing records.
- The autoscroll marquee loops by rotating the leading row to the end instead of cloning a second track (a duplicate would fork keyed row identity); it pauses under pointer/focus and stands down entirely under prefers-reduced-motion.

**Implementation notes.** Single child = the row template, rendered per row in its own item scope with write-back. Lazy only inside a scrolling viewport (List.swift:137-142). SYSTEM IDENTITY (system-defaults.md): a fully UNSTYLED vertical scrolling list uses real platform components - iOS a SwiftUI List in .insetGrouped (List.swift:79-183); Android the existing keyed LazyColumn with genuine Material 3 ListItem rows (StackSystemControls.kt SystemMaterialList/SystemMaterialListItem). Material 3 defines no list container, so Android keeps LazyColumn virtualization and does not imitate SwiftUI inset cards with hand-authored radii, padding, or separators. The gate is the SAME conservative allowlist on both platforms (List.swift systemSafeAttrs ~230-247 = Android SystemList.SYSTEM_SAFE_ATTRS, drift-pinned by StackSystemControlsTest): element attrs post-cascade AND the row template's raw root attrs must all be look-free words; horizontal / scroll=false / any authored look keep the flat pre-law path byte-identically. Under a scrolling/hugging ancestor both platforms stand down via the same signal (iOS stackInScrollContainer stamped by Scroll + the sheet fit-content slot; Android LocalInScrollContainer, same stampers - there a nested lazy list is additionally a Compose error). LIST CONSTRUCTS (group_by · swipeLeading/swipeTrailing · reorder) render inside the system list on BOTH platforms - iOS in a real SwiftUI List (List.swift:82-174), Android on one keyed LazyColumn whose ordinary and swipe foreground rows share SystemMaterialListItem (elements/ListElements.kt ConstructList); the words gate identically and `scroll="false"` (fit-content) WINS over all three on both. Semantics pinned on both: group_by partitions by the stringified field value in FIRST-SEEN order for groups AND rows, the value being the section header; a GROUPED list ignores reorder and an active reorder suppresses swipe (one mode per list); on:reachEnd rides the GLOBAL last row regardless of section; a reorder drop rewrites the bound array through the bind seam and fires on:move with { from, to } as FINAL indices. A swipe button dict is { "label"|"title", "icon", "role": "destructive", "color" } plus one or both firing shapes - "event" fires the list's on:`<event>` with the ROW as scope, "action"+"args" dispatches on the bus (event first); full-swipe commits the FIRST button of that edge only when swipeFull{Leading,Trailing}="true". Android divergences (declared, ListElements.kt header): no edit mode/drag handles - a reorder drag starts on LONG PRESS (Compose has neither), a full swipe springs the row closed instead of animating it out, the action-rail metrics are Android's own (out of this spec, rule 4), and an open row closes on its own button tap or a swipe back rather than on an unrelated scroll. WEB VIRTUALISATION (2026-09-19): the web renderer WINDOWS a scrolling bound list exactly as LazyVStack and LazyColumn virtualise it. It mounts the rows the viewport shows plus an overscan band, keeps the container's full scroll extent through two spacers whose size is learned from measured rows per key, and slides that window with the scroll through the same keyed walk, so a row keeps its DOM node and its state while it stays in the window. The 1,000 row cap that used to slice the array and stamp data-dsx-truncated is gone: no lane drops a row, on:reachEnd rides the TRUE last row of the array rather than the end of the window, and aria-setsize, aria-posinset and the row indexes count the whole set.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** fluid bound rows at both widths; list-feed parity fixture recorded at w390+w1366 - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-list`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `structural`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | bound rows as real elements, no fake list roles; axe 0 serious/critical on the data family page light (dark: text link finding filed separately) |
| ios | review | 2026-08-18 | A real SwiftUI List: rows/sections carry system semantics; swipe actions surface as accessibility actions by the system; reorder rides system edit mode (ReorderEditMode). ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/List/swift/List.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-19 | W12 red sweep 2026-08-19: the list constructs gained non-pointer equivalents - every swipe button (by its label) and, under reorder, localized Move up / Move down are TalkBack/Switch Access customActions on the row (ListElements.kt ConstructList rowActions -> ListRowCell semantics { customActions }; actions fire the same fireSwipe/commitMove seams the gestures use), the iOS .swipeActions-automatic twin. gradle test green. Pending the Android capture lane. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

