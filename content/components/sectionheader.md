---
title: sectionHeader
description: The base Web twin renders the list section header from markup, writing the same class and the same part name the bound group_by emitter writes, so one look has two ways in and a reader hears the group's own name either way.
order: 3
section: components
element: sectionHeader
category: structure
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"value","type":"string","default":null}]
actions: []
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# sectionHeader

The base Web twin renders the list section header from markup, writing the same class and the same part name the bound group_by emitter writes, so one look has two ways in and a reader hears the group's own name either way.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Structure - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<sectionHeader value="Today"/>
```

`sectionHeader` takes no children.

## Catalog specimen

The catalog has no specimen for `sectionHeader` at the default rung yet, so there is nothing to copy here. It appears with no change to this page the moment the catalog carries one: the page is a projection of the catalog, not a screenshot of it.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | n/a | 2026-09-17 | Furniture, not a control: no interaction axis. |
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

`sectionHeader` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The base Web twin renders the list section header from markup, writing the same class and the same part name the bound group_by emitter writes, so one look has two ways in and a reader hears the group's own name either way.

**Known limits on the web**

- Deliberately sticky, which is the header's contract on both reference systems: a header inside a non scrolling list therefore pins to nothing and simply sits at the top of its section.

**Implementation notes.** The list section header, reachable from markup. It writes the same class and the same part name the bound group_by emitter in the web renderer writes, so one look has two ways in. SwiftUI's Section header and Material 3's list subheader are the counterparts.

Declared platforms: `ios`, `android`, `web`.

**Adaptivity (web, 2026-09-17).** Identical box from markup and from the bound group_by path at every recorded width, which is the claim list-sections.dsx exists to measure and the plane confirms at 31.5 on both paths (OpenSource/Conformance/parity/reference/web/list-sections.*).

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-list-section-header`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-09-17 | Inside a list it takes neither a row wrapper nor the listitem role, so a three item list is not announced as five, and on the bound path the section already carries the group value as its accessible name. |
| ios | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| android | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

