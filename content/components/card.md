---
title: card
description: The base Web twin renders the surface word: the card corner, the raised ground, the elevation and the INSET, which is the part the two helper classes deliberately do not carry because their wearers pad themselves.
order: 3
section: components
element: card
category: layout
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"variant","type":"string","default":null}]
actions: []
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# card

The base Web twin renders the surface word: the card corner, the raised ground, the elevation and the INSET, which is the part the two helper classes deliberately do not carry because their wearers pad themselves.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Layout - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<card><text value="Elevation one" type="headline"/></card>
```

`card` takes children.

## Catalog specimen

The catalog has no specimen for `card` at the default rung yet, so there is nothing to copy here. It appears with no change to this page the moment the catalog carries one: the page is a projection of the catalog, not a screenshot of it.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | n/a | 2026-09-17 | A surface, not a control: no rest, hover, pressed, focus or disabled axis of its own, and a pressable inside a card is audited on its own row. Its three variants are renderings, not states. |
| ios | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| android | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `variant` | `string` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`card` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The base Web twin renders the surface word: the card corner, the raised ground, the elevation and the INSET, which is the part the two helper classes deliberately do not carry because their wearers pad themselves. variant="cut" is the outlined card and variant="plain" the unelevated grouped platter; an unknown word keeps the elevated base rendering, which is the law the button ladder already states.

**Known limits on the web**

- The inset is one token read, so an author who wants a different one re-declares padding rather than reaching for a second word.

**Implementation notes.** The surface word. variant is one of cut (the outlined card) or plain (the unelevated grouped platter); an unknown word keeps the base rendering, which unstyled is the platform card itself: the stock SwiftUI GroupBox and the Material 3 filled Card (the web keeps its elevated card, VRG-F11); both inset their content, which is the inset this row pins and the one the two helper classes deliberately do not carry.

Declared platforms: `ios`, `android`, `web`.

**Adaptivity (web, 2026-09-17).** Fluid at every recorded width with no breakpoint of its own: surface-card.dsx is recorded at 390, 768 and 1366 in both schemes and the three variants hold the same box at all three, differing only in ground and edge (OpenSource/Conformance/parity/reference/web/surface-card.*).

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-card`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-09-17 | Presentational by construction: a plain box with no role, no focus stop and no announcement, so a card never interposes itself between a reader and the content it holds. |
| ios | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| android | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

