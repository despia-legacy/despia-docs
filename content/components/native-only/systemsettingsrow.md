---
title: SystemSettingsRow
description: The native half of the shared SettingsRow.dsx wrapper has no Web renderer, and is not asked for one: SettingsRow.dsx gates this tag off web, Windows and Linux and composes the row from standard elements and CSS on those lanes, so the settings row an author writes as `<SettingsRow>` is a real, styled, accessible row on every renderer while this tag itself stays native.
order: 3
section: components
element: SystemSettingsRow
category: structure
scope: module-owned
platforms: ios,android
properties: [{"name":"chevron","type":"bool","default":"false"},{"name":"on:tap","type":"action","default":null},{"name":"subtitle","type":"string","default":null},{"name":"tappable","type":"bool","default":"false"},{"name":"title","type":"string","default":null},{"name":"value","type":"string","default":null}]
actions: ["tap"]
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# SystemSettingsRow

The native half of the shared SettingsRow.dsx wrapper has no Web renderer, and is not asked for one: SettingsRow.dsx gates this tag off web, Windows and Linux and composes the row from standard elements and CSS on those lanes, so the settings row an author writes as `<SettingsRow>` is a real, styled, accessible row on every renderer while this tag itself stays native.

<RefMeta platforms="iOS,Android">
Category: Structure - Live specimens: the [System gallery](/system).
</RefMeta>

This element is web unsupported by DESIGN, not by omission: its essence is a vendor or platform runtime the web renderer does not ship, and its facet fills the tag only when its module is registered. It is named here rather than left off the list, because a library that quietly omits its own rows is not a library.

**The ruling**, 2026-08-18. component-library.md 'Out of scope, named': native-first module tags follow their module roadmaps; the row stays on the scoreboard without blocking the trinity.

## Usage

```dsx
<SystemSettingsRow title="Notifications" value="On" chevron="true" on:tap="dsx.event('open')"/>
```

`SystemSettingsRow` takes no children.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `chevron` | `bool` | `false` |  |
| `on:tap` | `action` |  |  |
| `subtitle` | `string` |  |  |
| `tappable` | `bool` | `false` |  |
| `title` | `string` |  |  |
| `value` | `string` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `tap` | `on:tap="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `unsupported` | no renderer and no polyfill; the runtime mounts the labelled placeholder |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The native half of the shared SettingsRow.dsx wrapper has no Web renderer, and is not asked for one: SettingsRow.dsx gates this tag off web, Windows and Linux and composes the row from standard elements and CSS on those lanes, so the settings row an author writes as `<SettingsRow>` is a real, styled, accessible row on every renderer while this tag itself stays native.

**Known limits on the web**

- No DOM lookalike of SwiftUI LabeledContent or the Material 3 ListItem is mounted, so nothing here is reported as a working platform settings row.
- The census row records what already ships on the two native lanes; it grants the Web renderer nothing.

**Fallback.** An author who writes `<SettingsRow>` gets the wrapper's own web branch, a dsx-settings-row composition with its own action button, icon plate, title and subtitle copy, trailing value, slot and chevron. A document that writes the native tag directly mounts the honest dsx-unsupported placeholder, a labelled marker carrying the `<SystemSettingsRow>` name; never blank, never a fake lookalike.

**Implementation notes.** The native half of the shared SettingsRow.dsx wrapper. The two lanes agree on the attribute contract, on which of the three trailing pieces exist, and on the trailing spacing, and they deliberately do not agree on the row chrome: SwiftUI LabeledContent owns the label and detail columns with the builder adding 16 horizontal and 10 vertical points of padding, while Material 3 ListItem owns its own typography, content insets, minimum height and colours, which is what a real platform row identity means on each side. The `icon` attribute the wrapper writes on the tag is not read by either native body: both take the icon plate through the leading slot instead, so it is recorded here as absent rather than as a contract. Only the trailing spacing is pinned as cross-platform geometry; the padding either platform's own row control chooses is its own.

Declared platforms: `ios`, `android`.

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

