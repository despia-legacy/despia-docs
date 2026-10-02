---
title: searchbar
description: The Web twin is the composite search field the native reference draws: a leading magnifier, the real search input with binding, the Search placeholder default and submit, and a trailing clear button that writes the bound path back and fires on:clear.
order: 3
section: components
element: searchbar
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"on:clear","type":"action","default":null},{"name":"on:submit","type":"action","default":null},{"name":"placeholder","type":"string","default":"Search"}]
actions: ["clear","submit"]
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# searchbar

The Web twin is the composite search field the native reference draws: a leading magnifier, the real search input with binding, the Search placeholder default and submit, and a trailing clear button that writes the bound path back and fires on:clear.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<searchbar bind="dsx.variable.query" placeholder="Search" on:submit="dsx.action.search()"/>
```

`searchbar` takes no children.

## Catalog specimen

`SearchbarDefault.dsx`, verbatim from the catalog:

```dsx
<searchbar bind="dsx.variable.query" placeholder="Search" style="width: 100%">
  <head>
    <variable as="query">return ''</variable>
  </head>
</searchbar>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: leading icon, typing writes store (q=amp), clear affordance, focus well, hover inner delta - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | Focus-preserving clear flow: the trailing clear appears only while non-empty and clears + fires on:clear without dropping keyboard focus (@FocusState, DSXSearchBar); submitLabel(.search) + on:submit; W9 disabled wrapper (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/SearchBar/swift/SearchBar.swift:22-24). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: bound field in the capsule: trailing clear button appears while non-empty (clears + on:clear), Return fires on:submit, on:change per keystroke through the seam (Forms.kt SEARCHBAR block, SearchBar.swift 1:1); disabled= in the contract. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `bind` | `expr` |  |  |
| `color` | `color` | `var(--dsx-accent)` |  |
| `disabled` | `bool` | `false` |  |
| `disabled-if` | `expr` |  | Disabled when this expression is truthy. `disabled=` binds as TEXT, and the string "false" is TRUE - so a bound boolean belongs here, never there. |
| `on:clear` | `action` |  |  |
| `on:submit` | `action` |  |  |
| `placeholder` | `string` | `Search` |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `clear` | `on:clear="..."` |
| `submit` | `on:submit="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The Web twin is the composite search field the native reference draws: a leading magnifier, the real search input with binding, the Search placeholder default and submit, and a trailing clear button that writes the bound path back and fires on:clear.

**Known limits on the web**

- The leading and trailing glyphs are drawn as control chrome rather than resolved through the shared icon corpus, so a control affordance can never depend on an icon name being present in that table.
- The browser's own type=search cancel affordance is suppressed in favour of the declared clear button, and its `search` event is routed through the same on:clear contract.

**Implementation notes.** Leading magnifyingglass + trailing xmark.circle.fill clear button (shown while non-empty), both .secondary (SearchBar.swift:39-40,52-53).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-searchbar-field`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | labelled search input + labelled clear; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | System TextField (placeholder announced, search submit label); the clear control is a real Button carrying the system symbol's label; icons are secondary-tinted (DSXSearchBar, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/SearchBar/swift/SearchBar.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: the clear affordance is an activation (dsxAccessibleActivation, Forms.kt:606); the field is a real text input with the localized Search placeholder (DSXStrings). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

