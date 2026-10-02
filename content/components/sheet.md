---
title: sheet
description: The overlay twin implements modal sheet/inset/full modes, normalized detents, title/close/action chrome, focus containment/restoration, and dismissal.
order: 3
section: components
element: sheet
category: overlay
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"action","type":"string","default":null},{"name":"actionIcon","type":"sf-symbol","default":null},{"name":"actionSide","type":"enum","default":"trailing","values":["leading","trailing"]},{"name":"background","type":"color","default":"var(--dsx-background)"},{"name":"close","type":"enum","default":"leading","values":["leading","trailing","none"]},{"name":"detents","type":"csv","default":"half,full","values":["content","half","full"]},{"name":"inset","type":"number","default":"14"},{"name":"mode","type":"enum","default":"sheet","values":["sheet","card","cover"]},{"name":"on:action","type":"action","default":null},{"name":"on:dismiss","type":"action","default":null},{"name":"present","type":"expr","default":null},{"name":"systemBackground","type":"bool","default":"false"},{"name":"title","type":"string","default":null}]
actions: ["action","dismiss"]
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# sheet

The overlay twin implements modal sheet/inset/full modes, normalized detents, title/close/action chrome, focus containment/restoration, and dismissal.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Overlay - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<sheet present="dsx.variable.show" detents="half,full" title="Episodes" on:dismiss="dsx.variable.show = false"><list bind="dsx.variable.episodes" scroll="false"><text bind="dsx.this.title"/></list></sheet>
```

`sheet` takes children.

## Catalog specimen

`SheetDefault.dsx`, verbatim from the catalog:

```dsx
<vstack style="width: 100%; gap: 8px">
  <head>
    <variable as="show">return false</variable>
  </head>
  <button label="Open the sheet" style="width: 100%" on:tap="dsx.variable.show = true"/>
  <sheet present="dsx.variable.show" detents="half,full" title="Episodes" on:dismiss="dsx.variable.show = false">
    <text value="Sheet content"/>
  </sheet>
</vstack>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: opens on present bind, scrim shown, focus moves in + Tab trapped, Escape fires on:dismiss, action/close chrome renders - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | present lifecycle (two-way bool; on:dismiss on swipe or programmatic close), detent selection incl. the measured content detent, standard chrome states (close/action raise events), drawer vs floating card vs cover modes (SheetAnchor, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Sheet/swift/Sheet.swift); CI-asserted: the content detent presents through the REAL platform sheet at measured height (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift testLiteralEntityRendersOnceInsideMeasuredNativeSheet). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: present= two-way; standard half/full + full-only contracts ride the REAL M3 ModalBottomSheet (system scrim, drag handle, predictive BACK - Sheets.kt:358-383); content detents + card/cover ride the custom compositor with detent snapping/fling projection JVM-pinned (SheetMath - SheetMathTest green) + presentation-policy split pinned (AndroidSheetPresentationPolicyTest green, gradle :render:testDebugUnitTest run 2026-08-18: 292 tests, 1 failure (StackButtonsTest#systemButtonsDelegateTheirDefaultPalettesToMaterial3 - a stale source-grep of the pre-W9 disabled literal, not a behavior break)); scroll-expands-sheet nested-scroll seam; chrome close/action buttons. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `action` | `string` |  |  |
| `actionIcon` | `sf-symbol` |  |  |
| `actionSide` | `leading` \| `trailing` | `trailing` | `trailing` |
| `background` | `color` | `var(--dsx-background)` | The presentation background (the sheet chrome itself, not the content). Use `transparent` for no fill. |
| `close` | `leading` \| `trailing` \| `none` | `leading` | `none` |
| `detents` | `content` \| `half` \| `full` | `half,full` | Stops: `content` / `half` / `full`. `content` is **fit-content, for any markup**: the slot lays out at its ideal height, scrolls and structural spacers contribute their intrinsic size, the sheet hugs it with a 90% screen cap, taller content scrolls, and async rows resize the sheet live. |
| `inset` | `number` | `14` | Card mode: the floating gap. |
| `mode` | `sheet` \| `card` \| `cover` | `sheet` | `sheet` = edge-to-edge drawer · `card` = floating inset card (AirPods-style) that **sheds the gap** at the `full` detent and becomes a drawer · `cover` = full-screen modal, no detents. |
| `on:action` | `action` |  | The chrome action button. |
| `on:dismiss` | `action` |  | Fires on close (swipe or programmatic). |
| `present` | `expr` |  | **An expression, never a bare key** - the value is evaluated as one expression on every platform, so it is spelled `present="dsx.variable.showEpisodes"` (or `dsx.global.*`); a bare `present="showEpisodes"` reads **null** and nothing ever presents, and `despia lint` reports it (`bare-reach`). **Two-way like `bind=`:** set it true to open, and a dismissal (swipe, scrim, the system close control, a navigation) **writes it back false** through the same path before `on:dismiss` fires. |
| `systemBackground` | `bool` | `false` | Use the platform's native presentation material instead of an authored color. |
| `title` | `string` |  | Standard drawer chrome: centered header title. Declaring `title`/`close`/`action` renders the built-in header (the REAL system close control + system sheet-header language) - stop hand-rolling header rows. |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `action` | `on:action="..."` |
| `dismiss` | `on:dismiss="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The overlay twin implements modal sheet/inset/full modes, normalized detents, title/close/action chrome, focus containment/restoration, and dismissal.

**Known limits on the web**

- Detents and drag behavior adapt to browser viewport/input rather than reproducing native sheet physics.

**Implementation notes.** content detent = fit-content capped at 90% of screen. systemBackground=true selects the native platform presentation material without overloading the background color grammar. Android twin: Material ModalBottomSheet / inset Card / full-screen Dialog (Sheet.swift header).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** desktop: centered card 704x540 over blurred scrim; compact 390: full-width bottom sheet (bottom=844, w=390); safe-area insets in overlay CSS - shots/w8-audit-overlays*.png - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-overlay-host dsx-sheet-host`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `overlay`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | grabber restructured to role=slider (vertical, valuenow/min/max/text legal - clears the w8 axe critical aria-allowed-attr) with unchanged click/ArrowUp/Down/Home/End detents; role=dialog aria-modal, labelled by title, Tab trapped, Escape dismisses; axe serious+critical clean open, light+dark - w9 Chromium probe (compileComponent->instantiate, full skin) scratchpad/w9/probe.mjs + CI oracle packages/dom/oracle/application-controls-browser.ts / overlay-controls-browser.ts, shots/w9-drawer-menubar-* |
| ios | review | 2026-08-18 | System sheet semantics + labeled chrome (Close accessibilityLabel, Sheet.swift:123,186); the content surface is exposed under dsx.sheet.content (CI queries it); assistive dismissal is the system sheet's own. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: M3 ModalBottomSheet accessibility semantics + system BACK on the standard path (Sheets.kt header); the custom compositor carries dsxAccessibleDismiss (Sheets.kt:515,675) and chrome activations (Sheets.kt:627,647); on-device: DsxInteractiveStateUiTest opens a measured-detent sheet and asserts its native text surface. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

