---
title: chip
description: The base Web twin renders the pill word with its two independent axes: role is the STATUS voice off the system's own semantic pairs (accent, success, warning, danger, info) and selected is the chosen pose, so a chip may be a warning and selected at once.
order: 3
section: components
element: chip
category: display
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"label","type":"string","default":null},{"name":"on:tap","type":"event","default":null},{"name":"role","type":"string","default":null},{"name":"selected","type":"expr","default":null}]
actions: ["tap"]
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# chip

The base Web twin renders the pill word with its two independent axes: role is the STATUS voice off the system's own semantic pairs (accent, success, warning, danger, info) and selected is the chosen pose, so a chip may be a warning and selected at once.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Display - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<chip label="Warning" role="warning"/>
```

`chip` takes no children.

## Catalog specimen

The catalog has no specimen for `chip` at the default rung yet, so there is nothing to copy here. It appears with no change to this page the moment the catalog carries one: the page is a projection of the catalog, not a screenshot of it.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-09-17 | Two independent axes, both recorded: the five status roles and the selected pose, with the ratified pressed and hover state layer on the interactive form. chip-badge.dsx carries a chip that is a warning AND selected, so a collapse of the two axes into one is a measured diff. |
| ios | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| android | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` |  |  |
| `on:tap` | `event` |  |  |
| `role` | `string` |  |  |
| `selected` | `expr` |  |  |

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

The base Web twin renders the pill word with its two independent axes: role is the STATUS voice off the system's own semantic pairs (accent, success, warning, danger, info) and selected is the chosen pose, so a chip may be a warning and selected at once. A chip carrying an authored on:tap is a real button with the platform's own focus and keyboard behaviour; a chip without one is inert copy and takes no focus stop, and the server twin reads the same attribute so a first paint and its hydration reach the same element.

**Known limits on the web**

- An unknown role word keeps the neutral pill rather than stamping a selector nothing styles.

**Implementation notes.** The pill word. role is one of accent, success, warning, danger or info and sets the STATUS voice off the system's own semantic pairs; selected is the chosen pose and is a separate axis, so a chip may be a warning and selected at once. A chip carrying an authored on:tap is a real button on every renderer; a chip without one is inert copy and takes no focus stop. Material 3 assist and filter chips are the counterpart; SwiftUI has no chip and draws the same shape as a Capsule label, which is what the native lanes owe.

Declared platforms: `ios`, `android`, `web`.

**Adaptivity (web, 2026-09-17).** The chips wrap rather than compress and hold their height at 390, 768 and 1366 in both schemes (OpenSource/Conformance/parity/reference/web/chip-badge.*).

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-chip`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-09-17 | The element follows the contract: a chip carrying an authored tap is a real button with the platform's focus and keyboard behaviour and an aria-pressed state, and a chip without one is an inert span that takes no focus stop and announces nothing extra. |
| ios | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| android | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

