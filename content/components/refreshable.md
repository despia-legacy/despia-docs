---
title: refreshable
description: The data-control twin implements the fixture's on:refresh/busy contract: scroll-contained content, rubber-band pull on touch and fine pointers with the shared overscroll curve, a built-in always-visible 44px refresh control for keyboard and mouse with hover and focus-visible states, a polite live status region, aria-busy reflection, spin progress with reduced-motion collapse, and busy-gated completion.
order: 3
section: components
element: refreshable
category: structure
scope: library
platforms: web,ios,android
properties: [{"name":"busy","type":"expr","default":null},{"name":"on:refresh","type":"action","default":null}]
actions: ["refresh"]
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# refreshable

The data-control twin implements the fixture's on:refresh/busy contract: scroll-contained content, rubber-band pull on touch and fine pointers with the shared overscroll curve, a built-in always-visible 44px refresh control for keyboard and mouse with hover and focus-visible states, a polite live status region, aria-busy reflection, spin progress with reduced-motion collapse, and busy-gated completion.

<RefMeta platforms="Web,iOS,Android">
Category: Structure - Also answers to `refresh` - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<refreshable on:refresh="fetch: dsx.variable.feed = GET https://api.example.com/feed" busy="dsx.variable.feed.loading"><list bind="dsx.variable.feed.data" key="id" scroll="false"><text bind="dsx.this.title"/></list></refreshable>
```

`refreshable` takes children. The same element answers to `refresh`.

## Catalog specimen

`RefreshableDefault.dsx`, verbatim from the catalog:

```dsx
<refreshable on:refresh="dsx.variable.pulls = dsx.variable.pulls + 1" busy="true" style="width: 100%; height: 120px">
  <head>
    <variable as="pulls">return 0</variable>
  </head>
  <vstack style="gap: 8px">
    <text value="Pull down to refresh"/>
    <text value="{{ dsx.variable.pulls }} refreshes"/>
  </vstack>
</refreshable>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: touch pull (CDP scroll gesture) fires on:refresh once, busy bind accepted; keyboard/mouse path absent by ledger decision (element-support.json knownLimits) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | Pull lifecycle with an honest busy hold: on:refresh fires and the spinner holds until the authored busy flag clears (guarded grace for sync actions) (.refreshable loop, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Refreshable/swift/Refreshable.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: pull lifecycle: reveal (0.5 resistance) -> armed at 70dp -> busy band held at 56dp; busy= expression holds the spinner until falsy (60ms poll after 50ms settle), no busy = 350ms grace - the iOS timing contract fixture-pinned (RefreshableElements.kt, PlainWaveDefaults; RefreshMath JVM-pinned in PlainElementsTest, gradle :render:testDebugUnitTest run 2026-08-18: 292 tests, 1 failure (StackButtonsTest#systemButtonsDelegateTheirDefaultPalettesToMaterial3 - a stale source-grep of the pre-W9 disabled literal, not a behavior break)). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `busy` | `expr` |  | Bare expression (like `bind`): the spinner holds until it turns falsy, so it tracks the **real** load. Omitted → a brief grace period. |
| `on:refresh` | `action` |  | The pull action (usually a `fetch:`). |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `refresh` | `on:refresh="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The data-control twin implements the fixture's on:refresh/busy contract: scroll-contained content, rubber-band pull on touch and fine pointers with the shared overscroll curve, a built-in always-visible 44px refresh control for keyboard and mouse with hover and focus-visible states, a polite live status region, aria-busy reflection, spin progress with reduced-motion collapse, and busy-gated completion.

**Known limits on the web**

- Completion is driven by the bound busy state (350ms grace without one) inside start/maximum safety windows rather than a native refresh-control lifecycle; a refresh that never settles is finished by the safety timeout and announced in the status region.
- The pull gesture arms only while the viewport is scrolled to the top and contains its own overscroll; any browser or OS page-level pull-to-refresh chrome stays the platform's own.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** touch: pull gesture drives refresh (probed via CDP scroll gesture); fine pointer: content without the gesture per the ledger's declared fallback (element-support.json) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-refreshable`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `data`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | Built-in keyboard/mouse refresh control (44px, aria-label, focus-visible ring, probed focusable), role=status aria-live=polite announcements, aria-busy reflection; the scroll viewport is a named focusable region (role=region + tabindex=0, the Table-frame pattern) - the axe scrollable-region-focusable finding surfaced by this audit was FIXED in data-controls.ts + the SSR twin this audit; a11y-demo 0 serious/critical over /gallery incl. the Media section, both schemes. |
| ios | review | 2026-08-18 | System .refreshable rides the platform refresh semantics (the OS's own assistive refresh affordance on the ScrollView). ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Structure/Refreshable/swift/Refreshable.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-19 | W12 red sweep 2026-08-19: the non-pointer refresh path landed - a localized Refresh custom accessibility action on the container arms the SAME refresh cycle the pull commits (refreshing=true -> fire + band + busy/grace + settle) (RefreshableElements.kt RefreshableView semantics { customActions }), the iOS .refreshable-automatic twin. gradle test green. Pending the Android capture lane. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

