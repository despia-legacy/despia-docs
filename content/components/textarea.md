---
title: textarea
description: The base Web twin uses a real textarea with binding, placeholder, input, focus and blur events, and grows between minLines and maxLines exactly like the native lineLimit(min...max) contract.
order: 3
section: components
element: textarea
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"autocapitalize","type":"enum","default":null,"values":["off","none","on","sentences","words","characters"]},{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-label)"},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"enterkeyhint","type":"enum","default":null,"values":["enter","done","go","next","previous","search","send"]},{"name":"maxLines","type":"number","default":"8"},{"name":"minLines","type":"number","default":"3"},{"name":"on:blur","type":"action","default":null},{"name":"on:change","type":"action","default":null},{"name":"on:focus","type":"action","default":null},{"name":"on:submit","type":"action","default":null},{"name":"placeholder","type":"string","default":null},{"name":"resize","type":"enum","default":"vertical","values":["vertical","none"]},{"name":"submitOnEnter","type":"bool","default":"false"}]
actions: ["blur","change","focus","submit"]
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# textarea

The base Web twin uses a real textarea with binding, placeholder, input, focus and blur events, and grows between minLines and maxLines exactly like the native lineLimit(min...max) contract.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<textarea bind="dsx.variable.notes" placeholder="Notes" minLines="3"/>
```

`textarea` takes no children.

## Catalog specimen

`TextareaDefault.dsx`, verbatim from the catalog:

```dsx
<textarea bind="dsx.variable.notes" placeholder="Notes" minLines="3" style="width: 100%">
  <head>
    <variable as="notes">return ''</variable>
  </head>
</textarea>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: multi-line entry writes store (ta=Line), focus well, min/max lines grammar - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | Growing multiline field (iOS16 vertical-axis TextField clamped minLines...maxLines; TextEditor fallback) with on:focus/on:blur via @FocusState; W9 disabled grammar; bounded line counts guard remote input (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/TextArea/swift/TextArea.swift); CI-asserted: focus fires and typed values round-trip (iPad multiline + Catalyst notes, ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: unstyled path = REAL M3 OutlinedTextField multiline (M3TextAreaView, SelectionControl.TEXTAREA): platform focus/state layers; grow-then-scroll minLines/maxLines with the Swift normalization (textAreaLineRange); on:focus/on:blur CHANGE-only on the field modifier, no on:submit for multiline exactly iOS (TextAreaElements.kt). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `autocapitalize` | `off` \| `none` \| `on` \| `sentences` \| `words` \| `characters` |  | The HTML autocapitalize spelling, in app: sets the soft keyboard auto-capitalization behavior. |
| `bind` | `expr` |  | Two-way bound String. |
| `color` | `color` | `var(--dsx-label)` |  |
| `disabled` | `bool` | `false` |  |
| `disabled-if` | `expr` |  | Disabled when this expression is truthy. `disabled=` binds as TEXT, and the string "false" is TRUE - so a bound boolean belongs here, never there. |
| `enterkeyhint` | `enter` \| `done` \| `go` \| `next` \| `previous` \| `search` \| `send` |  | The HTML enterkeyhint spelling, in app: sets the soft keyboard return key label. |
| `maxLines` | `number` | `8` |  |
| `minLines` | `number` | `3` |  |
| `on:blur` | `action` |  |  |
| `on:change` | `action` |  | Each edit. The payload names WHAT CAUSED the change beside the value: `inputType`, a member of the closed DOM `InputEvent.inputType` vocabulary, flat in the handler scope. `historyUndo` and `historyRedo` are the FIELD'S own text history and not the document's, so a consumer that commits on a settle, Enter or blur must treat them as local and write nothing. A renderer that cannot name the cause says `unspecified`, which is a member and is never local. The law, with the per renderer table, is OpenSource/Conformance/elements/textfield.json `behavior.changeCause`. |
| `on:focus` | `action` |  |  |
| `on:submit` | `action` |  |  |
| `placeholder` | `string` |  |  |
| `resize` | `vertical` \| `none` | `vertical` |  |
| `submitOnEnter` | `bool` | `false` |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `blur` | `on:blur="..."` |
| `change` | `on:change="..."` |
| `focus` | `on:focus="..."` |
| `submit` | `on:submit="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The base Web twin uses a real textarea with binding, placeholder, input, focus and blur events, and grows between minLines and maxLines exactly like the native lineLimit(min...max) contract.

**Known limits on the web**

- Auto-grow counts hard line breaks and the CSS cap bounds soft-wrapped lines, so the maxLines ceiling is enforced by box height rather than by a per-glyph wrap measurement.
- Line counts are bounded to 1..64 and a reversed minLines/maxLines pair normalizes by swapping, never by trapping - the twin of the native input policy.
- The user-drag resize handle is a browser affordance the native control has no equivalent for; it is left in place rather than suppressed.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-textarea`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | labelled textarea; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | System multiline field semantics (CI queries it as textFields/textViews; placeholder announced; typed value readable back). ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/TextArea/swift/TextArea.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: M3 field semantics + placeholder slot on the system path; the legacy path is a real BasicTextField (editable text semantics); shared m3TextInputColors keeps contrastable role colors. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

