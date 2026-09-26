---
title: button
description: The base Web twin renders real button/anchor semantics with label, icon, iconSize, bordered/prominent variants, destructive/cancel roles, href navigation, disabled gating, and tap/double-tap activation - the full button.json attribute contract.
order: 3
section: components
element: button
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"color","type":"color","default":"white"},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"href","type":"string","default":null},{"name":"icon","type":"sf-symbol","default":null},{"name":"iconSize","type":"number","default":"20"},{"name":"label","type":"string","default":null},{"name":"on:tap","type":"action","default":null},{"name":"role","type":"enum","default":null,"values":["destructive","cancel"]},{"name":"variant","type":"enum","default":null,"values":["bordered","prominent","glass","glass-prominent","plain"]}]
actions: ["tap"]
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# button

The base Web twin renders real button/anchor semantics with label, icon, iconSize, bordered/prominent variants, destructive/cancel roles, href navigation, disabled gating, and tap/double-tap activation - the full button.json attribute contract.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Also answers to `glassButton`, `transport` - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<button label="Save" on:tap="dsx.event('save')"/>
```

`button` takes children. The same element answers to `glassButton`, `transport`.

## Catalog specimen

`ButtonDefault.dsx`, verbatim from the catalog:

```dsx
<stack>
  <head>
    <attribute as="label" default="'Button'"/>
    <event as="pressed"/>
  </head>

  <button label="{{ dsx.attribute.label }}" style="width: 100%" on:tap="dsx.event('pressed', { label: dsx.attribute.label })"/>
</stack>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: hover deepens fill, pressed bg+scale(0.97), focus-visible ring on tab, disabled twin opacity 0.5 + button[disabled] inert, Enter activates; dark tokens move (accent 6d8cff) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | Real system Button styles own rest/pressed/disabled/focus (.borderless default, .bordered/.borderedProminent variants - ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Button/swift/Button.swift:29,49-64,80); W9 disabled grammar (lines 17,48); role=destructive/cancel map to the system ButtonRole (lines 140-148); the surface gate leaves unauthored foregrounds nil so the OS paints accent/disabled/pressed as one control state (lines 157-179); both schemes via semantic slots. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: unstyled/variant-word path renders the REAL M3 TextButton/FilledTonalButton/Button with enabled=!disabled (StackButtons.kt:203-207) - platform state layer carries rest/pressed/focus/disabled; W9 disabled grammar at the dispatch: JSE.truthy(disabled) \|\| disabled-if (StackNodeView.kt:1785); legacy authored path keeps the press snap 0.92/easeOut 0.12s (StackMotion.PRESS_SNAP, StackNodeView header). Gate pinned by StackButtonsTest (rendersSystem allowlist; gradle :render:testDebugUnitTest run 2026-08-18: 292 tests, 1 failure (StackButtonsTest#systemButtonsDelegateTheirDefaultPalettesToMaterial3 - a stale source-grep of the pre-W9 disabled literal, not a behavior break)). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `color` | `color` | `white` | Icon/label color. Unstyled controls use the app tint; an authored color always wins. |
| `disabled` | `bool` | `false` |  |
| `disabled-if` | `expr` |  | Disabled when this expression is truthy. `disabled=` binds as TEXT, and the string "false" is TRUE - so a bound boolean belongs here, never there. |
| `href` | `string` |  |  |
| `icon` | `sf-symbol` |  | Icon content. |
| `iconSize` | `number` | `20` | Icon size (weight semibold). |
| `label` | `string` |  | Text content (used if no `icon`). |
| `on:tap` | `action` |  | Press handler. |
| `role` | `destructive` \| `cancel` |  | `destructive` (red danger semantics) / `cancel` (dismissive weight) - the SwiftUI `ButtonRole`. Only these two words; any other `role` value keeps its accessibility meaning. |
| `variant` | `bordered` \| `prominent` \| `glass` \| `glass-prominent` \| `plain` |  | One of `bordered`, `prominent`, `glass`, `glass-prominent`, `plain`. `plain` is the TEXT TIER, minted 2026-09-17 with `architecture/adr/0002-despia-ui-words.md`: accent ink over no fill at the SAME height as the other rungs, which is the part an author cannot restate by hand without first measuring them. The counterparts are `.borderless` on SwiftUI and the Material 3 text button; a lane that has not written its half yet falls to the base rendering the way it does for any word it does not know. `bordered` selects the tonal system button (`.bordered`); `prominent` selects the filled system button (`.borderedProminent`). Both use **`.controlSize(.large)`**, the modern full-size system button and larger tap target. Use `style="width: 100%"` when the CTA has a definite containing box. Web mirrors the large metrics (theme.ts); Android's M3 button already uses the platform's full-size spec. The unstyled default button stays inline-sized. **`glass` and `glass-prominent` are Liquid Glass**, and what they render is per platform and per OS: on **iOS 26 and later** the real system glass button style (SwiftUI `GlassButtonStyle` / `GlassProminentButtonStyle`, spelled `.glass` and `.glassProminent`; the UIKit twins in the SDK are `glassButtonConfiguration` and `prominentGlassButtonConfiguration`), tinted from the resolved `color`; on **iOS 16.6 to 25** there is no glass in the SDK, so the shipped control part answers instead, which is the tinted fill over the system thin material for `glass` and the accent fill for `glass-prominent`; on **Android** there is no glass either, so `glass` is the M3 tonal button and `glass-prominent` the filled one, with no blur applied (write `backdrop-filter` yourself to get the existing material ladder); on **web and desktop** the user agent sheet paints a translucent surface with `backdrop-filter: blur(12px) saturate(1.8)` and a hairline ring, or the accent fill with the same blur. Under **Reduce Transparency** (`prefers-reduced-transparency: reduce`) both become solid on every lane, and that is the documented rendering rather than a defect. An unknown variant word is a lint error naming the five; a supported word on a platform without glass never errors, it falls back as written here. |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `tap` | `on:tap="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The base Web twin renders real button/anchor semantics with label, icon, iconSize, bordered/prominent variants, destructive/cancel roles, href navigation, disabled gating, and tap/double-tap activation - the full button.json attribute contract.

**Known limits on the web**

- Press feedback is neutral DSX motion rather than a pixel clone of the native 0.92 press-scale recognizer.
- Icon names resolve through the shared cross-runtime sf-map corpus (OpenSource/Conformance/icons/sf-map.json): 89 rows draw a 24x24 stroke vector, the ten pictographic rows draw the corpus unicode fallback glyph, and an SF name absent from the corpus paints the fail-open placeholder plus one console warning (override with icon-web=).

**Implementation notes.** Icon glyphs render semibold (Button.swift:25,33). Content precedence: icon-only > label(+icon) > children slot (Button.swift:18-38). Variant sizing: iOS variant buttons ride .controlSize(.large) - the modern full-size system button (Button.swift); Android rides the M3 spec's own metrics (the platform's real button - no cross-platform pin); web mirrors the large feel in theme.ts (0.75rem vertical padding, 2.75rem min-height).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-button`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | native button element, label text, disabled reflected; tab-reachable with ring; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | A real SwiftUI Button: button trait + label from content; ButtonRole announces destructive; the kernel a11y pass applies on any element (StackStyle.apply, OpenSource/Engine/Swift/Stack.swift:6060-6092: a11yLabel/aria-label, a11yHint, a11yValue, a11yTrait/role, a11yGroup, a11yHidden; on:tap implies .isButton) covers icon-only buttons; CI exercises DSX buttons through the accessibility tree across fixtures (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift app.buttons[label].tap()). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: system path = the real M3 Button semantics; legacy path = dsxAccessibleActivation(Role.Button) beside the raw recognizer with Enter/Space/D-pad activation + focus traversal (StackNodeView.kt:1210, AccessibilityModifiers.kt:39). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

