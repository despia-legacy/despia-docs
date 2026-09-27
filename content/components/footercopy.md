---
title: footerCopy
description: The base Web twin renders the closing line of a screen or a form at the footnote rung in the tertiary ink, the other half of the screen header word.
order: 3
section: components
element: footerCopy
category: display
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"value","type":"string","default":null}]
actions: []
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# footerCopy

The base Web twin renders the closing line of a screen or a form at the footnote rung in the tertiary ink, the other half of the screen header word.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Display - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<footerCopy value="Seats renew on the first of the month."/>
```

`footerCopy` takes no children.

## Catalog specimen

The catalog has no specimen for `footerCopy` at the default rung yet, so there is nothing to copy here. It appears with no change to this page the moment the catalog carries one: the page is a projection of the catalog, not a screenshot of it.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | n/a | 2026-09-17 | Copy, not a control. |
| ios | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| android | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `value` | `string` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`footerCopy` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The base Web twin renders the closing line of a screen or a form at the footnote rung in the tertiary ink, the other half of the screen header word.

**Known limits on the web**

- A closing line is one text run, so a footerCopy that wraps to several lines wraps as copy and takes no separate rule for its second line.

**Implementation notes.** The closing line of a screen or a form, a footnote rung in the tertiary ink. The other half of screenHeader and stated beside it. SwiftUI's Section footer copy and Material 3's supporting text are the counterparts.

Declared platforms: `ios`, `android`, `web`.

**Adaptivity (web, 2026-09-17).** Follows its column and the type plane at 390, 768 and 1366 in both schemes (OpenSource/Conformance/parity/reference/web/surface-card.*).

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-footer-copy`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-09-17 | A paragraph element with no role of its own, and an empty one draws nothing. |
| ios | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| android | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

