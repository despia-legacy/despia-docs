---
title: scopeBar
description: The base Web twin renders the scopes under a search field as a wrapping rail of the chip word, with the tablist semantics, a roving tab stop and the two way write back the other option controls carry.
order: 3
section: components
element: scopeBar
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"bind","type":"expr","default":null},{"name":"label","type":"string","default":null},{"name":"labelField","type":"string","default":"label"},{"name":"on:change","type":"event","default":null},{"name":"options","type":"csv","default":null},{"name":"optionsKey","type":"expr","default":null},{"name":"valueField","type":"string","default":"id"}]
actions: ["change"]
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# scopeBar

The base Web twin renders the scopes under a search field as a wrapping rail of the chip word, with the tablist semantics, a roving tab stop and the two way write back the other option controls carry.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<scopeBar bind="dsx.variable.scope" options="All,Unread,Flagged"/>
```

`scopeBar` takes no children.

## Catalog specimen

The catalog has no specimen for `scopeBar` at the default rung yet, so there is nothing to copy here. It appears with no change to this page the moment the catalog carries one: the page is a projection of the catalog, not a screenshot of it.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-09-17 | Roving tab stop over the tablist, one selected scope at a time, each scope carrying the chip word's own resting, hover, pressed and selected poses. |
| ios | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| android | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `bind` | `expr` |  |  |
| `label` | `string` |  |  |
| `labelField` | `string` | `label` |  |
| `on:change` | `event` |  |  |
| `options` | `csv` |  |  |
| `optionsKey` | `expr` |  |  |
| `valueField` | `string` | `id` |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `change` | `on:change="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The base Web twin renders the scopes under a search field as a wrapping rail of the chip word, with the tablist semantics, a roving tab stop and the two way write back the other option controls carry. It is not a segmented control: a segmented control picks a value and a scope bar narrows a search that is already running.

**Known limits on the web**

- The scopes arrive with the first client mount, so a server rendered scope bar is empty on the first paint and the sheet hides an empty rail rather than reserving a band that then fills.

**Implementation notes.** The scopes under a search field. It is NOT a segmented control: a segmented control picks a value and a scope bar narrows a search that is already running, so it wraps rather than compresses and its scopes are the chip word. UIKit's search scope bar and Material 3's filter chip row under a search bar are the counterparts.

Declared platforms: `ios`, `android`, `web`.

**Adaptivity (web, 2026-09-17).** The rail wraps at every width instead of compressing or scrolling a scope off the screen, recorded at 390, 768 and 1366 in both schemes (OpenSource/Conformance/parity/reference/web/chip-badge.*).

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-scope-bar`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-09-17 | role=tablist over role=tab scopes with aria-selected and a roving tabindex, and a labelled rail, so the scopes announce as a set and the chosen one announces as chosen. |
| ios | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| android | no, and named | 2026-09-17 | No implementation on this renderer yet: the word was minted on the web with package D of the round two fidelity audit (OpenSource/Documentation/architecture/adr/0002-despia-ui-words.md) and this lane's gap is registered with a degradation and a plan at ClosedSource/release/platform-parity-register.json. Audited as failing rather than left unaudited, because an unaudited cell reads as a question nobody asked and this one is answered. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

