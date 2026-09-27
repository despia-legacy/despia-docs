---
title: sectionFooter
description: The base Web twin renders the section footer from markup, and the bound twin is the list's group_footer_by attribute, which reads the footer off the section's first row exactly as the header reads the group value.
order: 3
section: components
element: sectionFooter
category: structure
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"value","type":"string","default":null}]
actions: []
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# sectionFooter

The base Web twin renders the section footer from markup, and the bound twin is the list's group_footer_by attribute, which reads the footer off the section's first row exactly as the header reads the group value.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Structure - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<sectionFooter value="Three items in this section."/>
```

`sectionFooter` takes no children.

## Catalog specimen

The catalog has no specimen for `sectionFooter` at the default rung yet, so there is nothing to copy here. It appears with no change to this page the moment the catalog carries one: the page is a projection of the catalog, not a screenshot of it.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | n/a | 2026-09-17 | Furniture, not a control. |
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

`sectionFooter` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The base Web twin renders the section footer from markup, and the bound twin is the list's group_footer_by attribute, which reads the footer off the section's first row exactly as the header reads the group value. Deliberately not sticky: a footer pinned to the bottom of a scroller is a toolbar.

**Known limits on the web**

- Deliberately not sticky, because a footer pinned to the bottom of a scroller is a toolbar and not a footer.

**Implementation notes.** The other half of a section's furniture. Deliberately not sticky, because a footer pinned to the bottom of a scroller is a toolbar. The bound twin is the list's group_footer_by attribute, which reads the footer off the section's first row exactly as the header reads the group value.

Declared platforms: `ios`, `android`, `web`.

**Adaptivity (web, 2026-09-17).** Identical box from markup and from the bound group_footer_by path at every recorded width, measured at 30.84 on both (OpenSource/Conformance/parity/reference/web/list-sections.*).

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-list-section-footer`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-09-17 | Supporting copy, marked aria-hidden on the bound path because the section already announces its own name, and taking no listitem role from markup. |
| ios | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| android | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

