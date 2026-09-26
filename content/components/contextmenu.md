---
title: contextmenu
description: The overlay twin supports context-click and long-press opening, nested actions, roles, separators, keyboard traversal and focus restoration, on the same long-press timing the native gesture recognizer uses.
order: 3
section: components
element: contextmenu
category: overlay
scope: library
platforms: web,ios,android
properties: [{"name":"menu","type":"expr","default":null}]
actions: []
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# contextmenu

The overlay twin supports context-click and long-press opening, nested actions, roles, separators, keyboard traversal and focus restoration, on the same long-press timing the native gesture recognizer uses.

<RefMeta platforms="Web,iOS,Android">
Category: Overlay - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<contextmenu menu="[{ title: 'Copy', action: 'copy' }]"><text value="Hold me"/></contextmenu>
```

`contextmenu` takes children.

## Catalog specimen

`ContextmenuDefault.dsx`, verbatim from the catalog:

```dsx
<contextmenu menu="[{ title: 'Copy', action: 'copy' }, { title: 'Share', action: 'share' }]">
  <head/>
  <text value="Hold me"/>
</contextmenu>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | right-click opens on fine pointer, CDP/touch long-press opens at 390 (500ms/10px declared parity), Escape walks up submenus then closes, shares the menu keyboard walk + shortcut hints - w9 Chromium probe (compileComponent->instantiate, full skin) scratchpad/w9/probe.mjs + CI oracle packages/dom/oracle/application-controls-browser.ts / overlay-controls-browser.ts, shots/w9-drawer-menubar-* |
| ios | review | 2026-08-18 | System context menu: long-press platter with open/rest states OS-owned; destructive role tint, separators, indefinite native submenus (menuItems recursion, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/ContextMenu/swift/ContextMenu.swift); CI-asserted open (press 1.2s opens, item visible, ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift + capture ui.ios.surface.contextmenu.open). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: long-press opens the REAL M3 DropdownMenu (Menus.kt MenuElement(longPress=true)): M3 ripple/surface states on items; destructive rows in the M3 error role (Menus.kt:175); trigger is a truthful single semantics node (clearDescendants, Menus.kt:116). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `menu` | `expr` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`contextmenu` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The overlay twin supports context-click and long-press opening, nested actions, roles, separators, keyboard traversal and focus restoration, on the same long-press timing the native gesture recognizer uses.

**Known limits on the web**

- Touch long-press opens at 500 ms with a 10 px slop - a DECLARED match for UILongPressGestureRecognizer's default minimumPressDuration, which the native contextMenu rides; the constant is exported and pinned so a drift is a parity change, not a tweak.
- Menu depth and item/text sizes are bounded for hostile input, and the platter is the renderer's own neutral surface rather than the OS blurred preview platter.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** input-adaptive trigger: contextmenu event on fine pointers, platform long-press timing on touch (probed both) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-overlay-host dsx-contextmenu-host`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `overlay`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | same menu semantics (role=menu, keyboard walk, Escape walk-up, aria-keyshortcuts hints); right-click + touch long-press both open; axe serious+critical clean while open - w9 Chromium probe (compileComponent->instantiate, full skin) scratchpad/w9/probe.mjs + CI oracle packages/dom/oracle/application-controls-browser.ts / overlay-controls-browser.ts, shots/w9-drawer-menubar-* |
| ios | review | 2026-08-18 | Native menu items are accessible system controls (labels from title, destructive voice); the long-press alternative exposure is the system's own. ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/ContextMenu/swift/ContextMenu.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: trigger: dsxAccessibleActivation with onLongClickLabel localized 'Open context menu' + clearDescendants single truthful node (Menus.kt:116); items are M3 DropdownMenuItem semantics; on-device: DsxInteractiveStateUiTest opens it via onNodeWithContentDescription and captures the open state. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

