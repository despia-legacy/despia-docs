---
title: MenuSidebar
description: The application-control Web twin of the Sidebar.dsx slide-over: a fixed overlay panel on the leading edge, min(320px, 100% - 56px) wide and padded by the safe area, over a 32% black scrim; rows bound to items (attribute first, then the store) with a 24px icon, the label and a trailing checkmark, the active row carrying aria-current and the 12% selection fill; on:select publishing the whole row as authored and on:dismiss from a scrim tap and from Escape; dark, background and tint as on the natives; focus moved into the panel (the selected row) and restored on close, focus contained, the background inerted, through the shared overlay coordinator; a slide and scrim fade in only after the document settled and a freeze-frame slide out before removal on every close path.
order: 3
section: components
element: MenuSidebar
category: structure
scope: library
platforms: web,ios,android
properties: [{"name":"background","type":"color","default":null},{"name":"dark","type":"expr","default":"true"},{"name":"items","type":"expr","default":null},{"name":"on:dismiss","type":"action","default":null},{"name":"on:select","type":"action","default":null},{"name":"selected","type":"expr","default":"0"},{"name":"tint","type":"color","default":null}]
actions: ["dismiss","select"]
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# MenuSidebar

The application-control Web twin of the Sidebar.dsx slide-over: a fixed overlay panel on the leading edge, min(320px, 100% - 56px) wide and padded by the safe area, over a 32% black scrim; rows bound to items (attribute first, then the store) with a 24px icon, the label and a trailing checkmark, the active row carrying aria-current and the 12% selection fill; on:select publishing the whole row as authored and on:dismiss from a scrim tap and from Escape; dark, background and tint as on the natives; focus moved into the panel (the selected row) and restored on close, focus contained, the background inerted, through the shared overlay coordinator; a slide and scrim fade in only after the document settled and a freeze-frame slide out before removal on every close path.

<RefMeta platforms="Web,iOS,Android">
Category: Structure - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<MenuSidebar/>
```

`MenuSidebar` takes no children.

## Catalog specimen

The catalog has no specimen for `MenuSidebar` at the default rung yet, so there is nothing to copy here. It appears with no change to this page the moment the catalog carries one: the page is a projection of the catalog, not a screenshot of it.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | review | 2026-10-01 | OpenSource/Engine/TypeScript/packages/dom/src/application-controls.ts MenuSidebar factory: rows are real buttons with data-dsx-selected + aria-current=page on the bound index and a checkmark on the selected row; :active and :focus-visible inks; the pointer hover is gated and stands down for the selected row (interaction.json menu-sidebar-row). Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| ios | review | 2026-10-01 | ClosedSource/DSX/Modules/Mandatory/MenuBar/swift/MenuBarComponent.swift MenuSidebarComponentView: the selected row draws the checkmark and carries .isSelected; a tap writes the selection and raises select; the Catalyst face is a List(selection:) in .sidebar style. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| android | review | 2026-10-01 | ClosedSource/DSX/Modules/Mandatory/MenuBar/kotlin/MenuBar.kt MenuSidebarView: Material 3 NavigationDrawerItem selected = (selected == index) with secondaryContainer selected colours; onClick emits select. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `background` | `color` |  |  |
| `dark` | `expr` | `true` |  |
| `items` | `expr` |  |  |
| `on:dismiss` | `action` |  |  |
| `on:select` | `action` |  |  |
| `selected` | `expr` | `0` |  |
| `tint` | `color` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `dismiss` | `on:dismiss="..."` |
| `select` | `on:select="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `module-facet` | filled by the module facet when that module is registered |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The application-control Web twin of the Sidebar.dsx slide-over: a fixed overlay panel on the leading edge, min(320px, 100% - 56px) wide and padded by the safe area, over a 32% black scrim; rows bound to items (attribute first, then the store) with a 24px icon, the label and a trailing checkmark, the active row carrying aria-current and the 12% selection fill; on:select publishing the whole row as authored and on:dismiss from a scrim tap and from Escape; dark, background and tint as on the natives; focus moved into the panel (the selected row) and restored on close, focus contained, the background inerted, through the shared overlay coordinator; a slide and scrim fade in only after the document settled and a freeze-frame slide out before removal on every close path.

**Known limits on the web**

- Icon names resolve through the shared cross-runtime table (OpenSource/Conformance/icons/sf-map.json), so every name that draws on iOS/Android also draws here; an SF name absent from that table still needs an icon-web= adapter.
- There is no edge swipe to dismiss (the Material drawer's gesture); the scrim and Escape are the dismissals, which is the iOS face's own set.
- MenuSidebar is full-application chrome and is deliberately rejected from self-contained custom-element embeds (nothing renders there rather than broken chrome).

**Implementation notes.** The native half of the shared Sidebar.dsx adapter. iOS has no system drawer primitive, so the panel is composed from real SwiftUI Button and List controls and is capped at min(320, width - 56); Android hands the whole drawer, scrim, gestures, back handling and touch targets to Material 3 ModalNavigationDrawer, so the two lanes agree on the attribute contract and not on the chrome.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-10-01).** OpenSource/Engine/TypeScript/packages/dom/src/application-controls.ts: the panel slides from the leading edge and mirrors under [dir=rtl] (--dsx-menu-sidebar-off), the width clamps to the viewport, light/dark tones follow data-dsx-tone. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane.

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-application-control-host dsx-menu-sidebar-host`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `application`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | review | 2026-10-01 | OpenSource/Engine/TypeScript/packages/dom/src/application-controls.ts: panel role=dialog aria-modal with a localized aria-label (Menu), the scrim is a labelled "Close menu" control out of the Tab ring, Escape dismisses, Arrow/Home/End walk the rows, aria-current marks the selection. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| ios | review | 2026-10-01 | ClosedSource/DSX/Modules/Mandatory/MenuBar/swift/MenuBarComponent.swift: the dismiss area is "Close menu" (menubar.sidebar.dismiss) with an accessibilityRepresentation button, rows carry .isSelected, decorative checkmarks are hidden, the list is labelled Navigation. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| android | review | 2026-10-01 | ClosedSource/DSX/Modules/Mandatory/MenuBar/kotlin/MenuBar.kt: M3 owns the drawer and item semantics (selected state, role, touch targets); the comment block at MenuSidebar states it. Verified by code review (lane HEAD-REDS); the visual capture awaits the capture lane. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

