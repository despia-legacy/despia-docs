---
title: menu
description: The overlay twin provides anchored nested menus with normalized actions, roles, separators, focus management, and keyboard traversal.
order: 3
section: components
element: menu
category: overlay
scope: library
platforms: web,ios,android
properties: [{"name":"menu","type":"expr","default":null}]
actions: []
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# menu

The overlay twin provides anchored nested menus with normalized actions, roles, separators, focus management, and keyboard traversal.

<RefMeta platforms="Web,iOS,Android">
Category: Overlay - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<menu menu="[{ title: 'Edit', action: 'edit' }]"><button icon="ellipsis"/></menu>
```

`menu` takes children.

## Catalog specimen

`MenuDefault.dsx`, verbatim from the catalog:

```dsx
<menu menu="[{ title: 'Edit', action: 'edit' }, { title: 'Delete', action: 'delete' }]">
  <head/>
  <button icon="ellipsis" a11yLabel="More"/>
</menu>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | trigger opens role=menu, ArrowDown walk, submenu ArrowRight/ArrowLeft walk, Escape walks UP one submenu level before closing (w9), item hover/focus fill, shortcut hints render on leaves - w9 Chromium probe (compileComponent->instantiate, full skin) scratchpad/w9/probe.mjs + CI oracle packages/dom/oracle/application-controls-browser.ts / overlay-controls-browser.ts, shots/w9-drawer-menubar-* |
| ios | review | 2026-08-18 | System tap-to-open menu on the slot trigger: open/rest states OS-owned, destructive item tint, separators, indefinite native submenus (shared ContextMenuElement.menuItems, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Menu/swift/Menu.swift); Catalyst gets the desktop button menu style (menuStyle(.button) + borderless + fixedSize); CI-asserted open (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift menu activity: trigger tap shows Edit + capture ui.ios.surface.menu.open). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: tap opens the REAL M3 DropdownMenu (Menus.kt MenuElement(longPress=false)): M3 item ripple/states; destructive rows in the M3 error role (Menus.kt:175); leaf rows dispatch then close. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `menu` | `expr` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`menu` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The overlay twin provides anchored nested menus with normalized actions, roles, separators, focus management, and keyboard traversal.

**Known limits on the web**

- Menu item/depth/text input is bounded and placement adapts to the viewport.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** desktop anchored flyout; 390 touch: positioned menu idiom fits (272px wide), RTL open verified - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-overlay-host dsx-menu-host`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `overlay`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | role=menu/menuitem, ArrowDown walk, submenu ArrowRight, Escape walk-up then close, aria-keyshortcuts + aria-hidden hints on shortcut leaves; axe serious+critical clean while open - w9 Chromium probe (compileComponent->instantiate, full skin) scratchpad/w9/probe.mjs + CI oracle packages/dom/oracle/application-controls-browser.ts / overlay-controls-browser.ts, shots/w9-drawer-menubar-* |
| ios | review | 2026-08-18 | Native menu items are system controls (labels, destructive voice); the trigger slot is the button; CI drives it through the accessibility tree (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: trigger dsxAccessibleActivation with localized onClickLabel 'Open menu' + clearDescendants truthful single node (Menus.kt:116); M3 item semantics; on-device DsxInteractiveStateUiTest opens via content description. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

