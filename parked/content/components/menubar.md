---
title: MenuBar
description: The application-control Web twin implements bounded keyed items, canonical selection state and write-back, selection events, radio-menu semantics, keyboard and RTL navigation, the compact pill dock, and, at the shared desktop step, the WAI-ARIA menubar presentation: roving roots, per-root shadow-3 flyouts from nested items, submenu keyboard walk with Escape walking up, and right-aligned shortcut hints from the shortcut token grammar.
order: 3
section: components
element: MenuBar
category: structure
scope: library
platforms: web,ios,android
properties: [{"name":"dark","type":"expr","default":null},{"name":"items","type":"expr","default":null},{"name":"on:select","type":"action","default":null},{"name":"selected","type":"expr","default":null}]
actions: ["select"]
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# MenuBar

The application-control Web twin implements bounded keyed items, canonical selection state and write-back, selection events, radio-menu semantics, keyboard and RTL navigation, the compact pill dock, and, at the shared desktop step, the WAI-ARIA menubar presentation: roving roots, per-root shadow-3 flyouts from nested items, submenu keyboard walk with Escape walking up, and right-aligned shortcut hints from the shortcut token grammar.

<RefMeta platforms="Web,iOS,Android">
Category: Structure - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<MenuBar/>
```

`MenuBar` takes no children.

## Catalog specimen

<Callout kind="note" title="Served as a frame">
The framework's own build refuses to serve this specimen as an embed, and the refusal is quoted rather than paraphrased: [dsx embed] ui.MenuBarDefault uses Drawer/MenuBar, which are full-application chrome and cannot ship in a self-contained custom-element embed (host-level portals/inert and the unchanged G10 budget); use them in a full DSX app.
</Callout>

`MenuBarDefault.dsx`, verbatim from the catalog:

```dsx
<MenuBar>
  <head/>
</MenuBar>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | dock: selection pill, hover/active washes, disabled skipped (w8-pinned oracle phases kept green); bar: root hover fill, open-root fill (aria-expanded), flyout item focus wash, destructive voice; light+dark - w9 Chromium probe (compileComponent->instantiate, full skin) scratchpad/w9/probe.mjs + CI oracle packages/dom/oracle/application-controls-browser.ts / overlay-controls-browser.ts, shots/w9-drawer-menubar-* |
| ios | review | 2026-08-18 | Selection pill adopts the active cell (single-source matchedGeometryEffect, ClosedSource/DSX/Modules/Mandatory/MenuBar/swift/MenuBarComponent.swift:150-176), inactive items dim to 0.55, two-way selected binding through the documented seed chain; scheme rides the dark attr (default dark - the cross-platform builder contract, light via dark=false); Catalyst renders the system segmented Picker with OS states. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: the bar renders REAL M3 NavigationBar + NavigationBarItem (MenuBar.kt:419-447) - selected indicator, state layers, touch states are the platform component's (MenuBar.kt header: M3 owns state animation); selected= drives the item state; sidebar = M3 drawer surface (MenuBar.kt:459-462 header: M3 owns rows/selection/scrim/back). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `dark` | `expr` |  |  |
| `items` | `expr` |  |  |
| `on:select` | `action` |  |  |
| `selected` | `expr` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `select` | `on:select="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `module-facet` | filled by the module facet when that module is registered |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The application-control Web twin implements bounded keyed items, canonical selection state and write-back, selection events, radio-menu semantics, keyboard and RTL navigation, the compact pill dock, and, at the shared desktop step, the WAI-ARIA menubar presentation: roving roots, per-root shadow-3 flyouts from nested items, submenu keyboard walk with Escape walking up, and right-aligned shortcut hints from the shortcut token grammar.

**Known limits on the web**

- Icon names resolve through the shared cross-runtime table (OpenSource/Conformance/icons/sf-map.json), so every name that draws on iOS/Android also draws here; an SF name absent from that table still needs an icon-web= adapter.
- Web uses neutral adaptive chrome rather than native Liquid Glass or Material component skins.
- MenuBar is full-application chrome and is deliberately rejected from self-contained custom-element embeds (nothing renders there rather than broken chrome).

**Implementation notes.** iOS renders real Liquid Glass with a morphing selection pill; Android renders opaque fallback (MenuBar.kt header: no glass, no pill morph).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** DECLARED pair: compact keeps the pill dock; >= 69rem fine (APPLICATION_WIDE_MEDIA, shared TABS_WIDE_MEDIA breakpoint) = WAI-ARIA menubar strip with per-root flyouts; declared icons kept, fallback glyphs dropped in bar; bar strip is app chrome on the ambient scheme tokens (authored dark= tone stays dock-only - probe asserts the strip flips dark, oracle pins color-scheme normal + ambient label); RTL arrows mirrored (oracle); safe-area inline padding - w9 Chromium probe (compileComponent->instantiate, full skin) scratchpad/w9/probe.mjs + CI oracle packages/dom/oracle/application-controls-browser.ts / overlay-controls-browser.ts, shots/w9-drawer-menubar-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-menu-bar`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `application`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | role=menubar with roving tabindex; plain roots menuitemradio + aria-checked/current + write-back, submenu roots menuitem + aria-haspopup/expanded/controls; Left/Right/Home/End rove, Down/Up open first/last, Escape walks up then closes to root, Tab closes; leaf hints aria-hidden + aria-keyshortcuts (Meta/Control per platform); axe serious+critical clean - w9 Chromium probe (compileComponent->instantiate, full skin) scratchpad/w9/probe.mjs + CI oracle packages/dom/oracle/application-controls-browser.ts / overlay-controls-browser.ts, shots/w9-drawer-menubar-* |
| ios | review | 2026-08-19 | W12 red sweep 2026-08-19: each touch-bar item is ONE spoken element with real semantics - .accessibilityElement(children: .ignore) + label(name) + .isButton, and .isSelected on the active item (MenuBarComponent.swift item cells), the MenuSidebar selected-trait precedent. Swift compile-pending (rides Codemagic); balance-checked 0/0/0. Verified by review pending the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: M3 NavigationBar/NavigationBarItem semantics are component-owned (MenuBar.kt header: 'accessibility semantics' listed among what M3 owns; sidebar block 459-462 repeats it for the drawer); item icons resolve through the shared sf-map ladder (StackIcons.kt). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

