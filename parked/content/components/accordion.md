---
title: Accordion
description: The global Web twin provides accessible disclosure semantics, reactive title/open state, toggle events, and the named header slot that REPLACES the default title + chevron.
order: 3
section: components
element: Accordion
category: structure
scope: library
platforms: web,ios,android
properties: [{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"on:toggle","type":"action","default":null},{"name":"open","type":"bool","default":"false"},{"name":"title","type":"string","default":null}]
actions: ["toggle"]
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# Accordion

The global Web twin provides accessible disclosure semantics, reactive title/open state, toggle events, and the named header slot that REPLACES the default title + chevron.

<RefMeta platforms="Web,iOS,Android">
Category: Structure - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<Accordion title="Details" open="false"><text value="Body copy"/></Accordion>
```

`Accordion` takes children.

## Catalog specimen

`AccordionDefault.dsx`, verbatim from the catalog:

```dsx
<Accordion title="Details" open="false" style="width: 100%">
  <head/>
  <text value="Body copy"/>
</Accordion>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: aria-expanded false->true on header click, body reveals, chevron rotates, header hover/active rules - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | Header is a system Button(.plain) with a full-row contentShape (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Core/swift/Accordion.swift:45-71): rest/pressed OS-owned; open/closed is component @State seeded by open= and every toggle raises the toggle event with {open}; disabled is not in this element's grammar (button-family only, the toggle web:states precedent); title/chevron ride system label + tint slots in both schemes. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: open/closed disclosure with a tappable header: dsxAccessibleActivation(Role.Button) on the header row (Displays.kt:157) + chevron rotation reflects state (Displays.kt:150 accordionChevron); no hover/press indication by the raw-detector rule (AccessibilityModifiers.kt header); no disabled attr in the contract (ElementSpec Accordion). Visual states both schemes pend capture. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `color` | `color` | `var(--dsx-accent)` |  |
| `on:toggle` | `action` |  |  |
| `open` | `bool` | `false` |  |
| `title` | `string` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `toggle` | `on:toggle="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The global Web twin provides accessible disclosure semantics, reactive title/open state, toggle events, and the named header slot that REPLACES the default title + chevron.

**Known limits on the web**

- Expand/collapse animates grid-template-rows over --dsx-dur-base and collapses instantly under prefers-reduced-motion.
- A custom header slot owns its own content entirely - the renderer contributes no chevron, exactly as the native slot replaces the default header view.

**Implementation notes.** Slots: default = collapsible body; "header" replaces the default Text(title)+chevron (Accordion.swift:59-71).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical fluid presentation at both widths (data family page 390+1366, overflow 0); RTL page mirrors (ChatBubble sides flip: firstFromRight=0) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-accordion`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `global`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | header is a button with aria-expanded, keyboard toggles; axe 0 serious/critical on the data family page light (dark: text link finding filed separately) |
| ios | review | 2026-08-19 | W12 red sweep 2026-08-19: the header Button speaks its disclosure state - .accessibilityValue(Expanded/Collapsed), the web aria-expanded + Android stateDescription twin - and the decorative chevron is .accessibilityHidden(true) (Accordion.swift). Swift compile-pending (rides Codemagic); balance-checked 0/0/0. Verified by review pending the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: header merges into one activation node: dsxAccessibleActivation(Role.Button) with a localized Expanded/Collapsed stateDescription + Enter/Space/D-pad activation and focus (Displays.kt:157-160, AccessibilityModifiers.kt isActivationKey); body content exposes its own semantics. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

