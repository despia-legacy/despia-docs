---
title: Drawer
description: The application-control Web twin implements BOTH declared presentations: the modal drawer (adaptive geometry, focus containment and restoration, background inerting, Escape and scrim dismissal, bounded content, 120px drag dismissal) and, at the shared desktop step, the standing drawer pinned in flow (collapse-to-rail control, keyboard- and pointer-resizable drag hairline within min/max, honest complementary semantics, no scrim or focus trap).
order: 3
section: components
element: Drawer
category: overlay
scope: library
platforms: web,ios,android
properties: [{"name":"on:close","type":"action","default":null},{"name":"present","type":"expr","default":null}]
actions: ["close"]
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# Drawer

The application-control Web twin implements BOTH declared presentations: the modal drawer (adaptive geometry, focus containment and restoration, background inerting, Escape and scrim dismissal, bounded content, 120px drag dismissal) and, at the shared desktop step, the standing drawer pinned in flow (collapse-to-rail control, keyboard- and pointer-resizable drag hairline within min/max, honest complementary semantics, no scrim or focus trap).

<RefMeta platforms="Web,iOS,Android">
Category: Overlay - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<Drawer on:close="dsx.variable.open = false"><text value="Drawer content"/></Drawer>
```

`Drawer` takes children.

## Catalog specimen

<Callout kind="note" title="Served as a frame">
The framework's own build refuses to serve this specimen as an embed, and the refusal is quoted rather than paraphrased: [dsx embed] ui.DrawerDefault uses Drawer/MenuBar, which are full-application chrome and cannot ship in a self-contained custom-element embed (host-level portals/inert and the unchanged G10 budget); use them in a full DSX app.
</Callout>

`DrawerDefault.dsx`, verbatim from the catalog:

```dsx
<vstack style="width: 100%; gap: 8px">
  <head>
    <variable as="open">return false</variable>
  </head>
  <button label="Open the drawer" style="width: 100%" on:tap="dsx.variable.open = true"/>
  <Drawer visible-if="dsx.variable.open" on:close="dsx.variable.open = false">
    <text value="Drawer content"/>
  </Drawer>
</vstack>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | BOTH presentations: modal (opens on present bind, scrim, focus trap in, Escape/scrim/120px-drag each fire one on:close) and standing (pinned open, collapse/expand rail, resizing state, focus-visible on collapse+resizer); light+dark - w9 Chromium probe (compileComponent->instantiate, full skin) scratchpad/w9/probe.mjs + CI oracle packages/dom/oracle/application-controls-browser.ts / overlay-controls-browser.ts, shots/w9-drawer-menubar-* |
| ios | review | 2026-08-19 | W12 red sweep 2026-08-19: the touch panel now rides the semantic slots (system-defaults.md): surface = secondaryBackground, grabber = fill (both via StackStyle.color, Drawer.swift DrawerView) - the light-scheme half of the states contract renders a real light panel; twins followed reference-first (Conformance/elements/Drawer.json colors panel/handle; Sheets.kt + DesktopExtendedElements.kt). Swift compile-pending (rides Codemagic); balance-checked 0/0/0. Verified by review pending the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: open surface with drag-follow (down only), spring-back under the 120dp threshold, close event past it (Sheets.kt DrawerElement, geometry pinned from Drawer.swift); a11y dismiss action (Sheets.kt:675 dsxAccessibleDismiss); no hover/disabled axis in the contract (census: on:close only). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `on:close` | `action` |  |  |
| `present` | `expr` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `close` | `on:close="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The application-control Web twin implements BOTH declared presentations: the modal drawer (adaptive geometry, focus containment and restoration, background inerting, Escape and scrim dismissal, bounded content, 120px drag dismissal) and, at the shared desktop step, the standing drawer pinned in flow (collapse-to-rail control, keyboard- and pointer-resizable drag hairline within min/max, honest complementary semantics, no scrim or focus trap).

**Known limits on the web**

- Modal drag dismissal begins from a 44 by 44 pixel handle instead of the native whole-panel gesture surface, a deliberate accessible-target adaptation.
- Web uses a neutral token-driven surface instead of cloning the native fixed dark treatment.
- Drawer is full-application chrome and is deliberately rejected from self-contained custom-element embeds (nothing renders there rather than broken chrome).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** DECLARED pair: compact = modal drawer (scrim, trap, swipe); >= 69rem fine (APPLICATION_WIDE_MEDIA = TABS_WIDE_MEDIA + hover/fine) = standing drawer pinned IN FLOW, no scrim, content reflows; presentation swaps fire no phantom close; RTL-aware resize; safe-area padding - w9 Chromium probe (compileComponent->instantiate, full skin) scratchpad/w9/probe.mjs + CI oracle packages/dom/oracle/application-controls-browser.ts / overlay-controls-browser.ts, shots/w9-drawer-menubar-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-application-control-host dsx-drawer-host`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `application`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | host span role=group (aria-label legal closed+open - the w8 audit fix); modal role=dialog aria-modal focus trap; standing role=complementary NO aria-modal, collapse aria-expanded/controls, resizer role=separator vertical + valuenow/min/max + arrows/Home/End/Enter; axe serious+critical clean modal+standing, light+dark - w9 Chromium probe (compileComponent->instantiate, full skin) scratchpad/w9/probe.mjs + CI oracle packages/dom/oracle/application-controls-browser.ts / overlay-controls-browser.ts, shots/w9-drawer-menubar-* |
| ios | review | 2026-08-19 | W12 red sweep 2026-08-19: assistive-tech dismissal landed - .accessibilityAction(.escape) raising the same close event the 120pt drag raises (Drawer.swift touch presentation); the Catalyst inspector keeps its labeled Close button. Swift compile-pending (rides Codemagic); balance-checked 0/0/0. Verified by review pending the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: dsxAccessibleDismiss on the panel raises the standard accessibility dismiss action wired to the close event (Sheets.kt:675, AccessibilityModifiers.kt:223); slot content keeps its own semantics. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

