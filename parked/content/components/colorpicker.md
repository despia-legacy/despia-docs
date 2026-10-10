---
title: colorpicker
description: The browser's own colour control (input type=color) behind the iOS ColorPicker row: the label leading, a 28px well painting the bound colour trailing, the hex round-tripped by the shared core, the colour announced by name, on:change on every write and on:commit once when the browser picker closes.
order: 3
section: components
element: colorpicker
category: input
scope: library
platforms: web,ios,android
properties: [{"name":"alpha","type":"bool","default":"true"},{"name":"bind","type":"expr","default":null},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"label","type":"string","default":null},{"name":"mode","type":"enum","default":null,"values":["wheel","sliders","swatches"]},{"name":"on:change","type":"action","default":null},{"name":"on:commit","type":"action","default":null},{"name":"swatches","type":"string","default":null}]
actions: ["change","commit"]
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# colorpicker

The browser's own colour control (input type=color) behind the iOS ColorPicker row: the label leading, a 28px well painting the bound colour trailing, the hex round-tripped by the shared core, the colour announced by name, on:change on every write and on:commit once when the browser picker closes.

<RefMeta platforms="Web,iOS,Android">
Category: Input - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<colorpicker bind="dsx.variable.accent" label="Accent"/>
```

`colorpicker` takes no children.

## Catalog specimen

The catalog has no specimen for `colorpicker` at the default rung yet, so there is nothing to copy here. It appears with no change to this page the moment the catalog carries one: the page is a projection of the catalog, not a screenshot of it.

## States

No renderer has an audited state record for `colorpicker` yet. The matrix cell is unaudited, which is a red cell on the library scoreboard, not a claim that the states are missing.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `alpha` | `bool` | `true` |  |
| `bind` | `expr` |  |  |
| `disabled` | `bool` | `false` |  |
| `disabled-if` | `expr` |  | Disabled when this expression is truthy. `disabled=` binds as TEXT, and the string "false" is TRUE - so a bound boolean belongs here, never there. |
| `label` | `string` |  |  |
| `mode` | `wheel` \| `sliders` \| `swatches` |  |  |
| `on:change` | `action` |  |  |
| `on:commit` | `action` |  |  |
| `swatches` | `string` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `change` | `on:change="..."` |
| `commit` | `on:commit="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The browser's own colour control (input type=color) behind the iOS ColorPicker row: the label leading, a 28px well painting the bound colour trailing, the hex round-tripped by the shared core, the colour announced by name, on:change on every write and on:commit once when the browser picker closes. The custom panel appears only for what the browser control cannot hold: the preset swatches and an opacity track (webNeedsCustomColorPanel).

**Known limits on the web**

- The picker surface itself (wheel, sliders, eyedropper) is the browser's and the OS's; `mode` is a native presentation hint the browser control cannot take.

**Implementation notes.** Not a markup component: the library `<ColorPicker>` (Core/ColorPicker.dsx) stays the palette-and-sliders markup for apps that want one; this element is the system picker.

Declared platforms: `ios`, `android`.

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-colorpicker`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `native-control`.

## Accessibility

No renderer has an audited accessibility record for `colorpicker` yet; the matrix cell is unaudited.

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

