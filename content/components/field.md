---
title: field
description: The form twin supplies labeled controls, shared form state, touched/dirty/error tracking, validation, secure inputs, and option fields.
order: 3
section: components
element: field
category: forms
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"color","type":"color","default":"var(--dsx-label)"},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"form","type":"string","default":"form (inherited from enclosing <form as=>)"},{"name":"label","type":"string","default":null},{"name":"message","type":"string","default":null},{"name":"name","type":"string","default":null},{"name":"pattern","type":"regex","default":null},{"name":"placeholder","type":"string","default":null},{"name":"secure","type":"bool","default":"false"},{"name":"type","type":"enum","default":"text","values":["text","email","number","phone","url","secure","toggle","picker"]},{"name":"validate","type":"csv","default":null,"values":["required","email","url","phone","minLength:n","maxLength:n","pattern"]}]
actions: []
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# field

The form twin supplies labeled controls, shared form state, touched/dirty/error tracking, validation, secure inputs, and option fields.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Forms - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<field name="email" type="email" label="Email" validate="required,email"/>
```

`field` takes no children.

## Catalog specimen

`FieldDefault.dsx`, verbatim from the catalog:

```dsx
<field name="email" type="email" label="Email" validate="required,email" style="width: 100%">
  <head/>
</field>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: label + focus well, empty required submit reveals error state (aria-invalid + 'Required' message), typed value accepted - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | The full field state machine: touched (focus then blur), dirty, first-failing-error, form.valid recompute, submit-reveal, cross-field focus via form.focus, submitLabel next/done + keyboard accessory prev/next/Done; error text gated on touched/submitted; W9 disabled wrapper (DSXField, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Forms/Field/swift/Field.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: text entry is the REAL M3 OutlinedTextField with the native error state set by revealed validation; errors reveal once TOUCHED (focused-then-blurred) or on form submit; focus walks form.fieldOrder via the Return key (Forms.kt FIELD block; engine validator builtins through JSE.eval); disabled= in the contract; type= picks text/secure/toggle/picker inputs. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `color` | `color` | `var(--dsx-label)` |  |
| `disabled` | `bool` | `false` |  |
| `disabled-if` | `expr` |  | Disabled when this expression is truthy. `disabled=` binds as TEXT, and the string "false" is TRUE - so a bound boolean belongs here, never there. |
| `form` | `string` | `form (inherited from enclosing <form as=>)` | Explicit namespace override (rarely needed - fields inherit the enclosing `<form as=…>`). |
| `label` | `string` |  |  |
| `message` | `string` |  | Error message override. |
| `name` | `string` |  | The value key - `form.values.<name>`. |
| `pattern` | `regex` |  |  |
| `placeholder` | `string` |  |  |
| `secure` | `bool` | `false` |  |
| `type` | `text` \| `email` \| `number` \| `phone` \| `url` \| `secure` \| `toggle` \| `picker` | `text` | `text` / `email` / `number` / `phone` / `url` (keyboard) · `secure` (password) · `toggle` (inline switch) · `picker` (`options` CSV or `optionsKey`). |
| `validate` | `required` \| `email` \| `url` \| `phone` \| `minLength:n` \| `maxLength:n` \| `pattern` |  | `validate="required,email,minLength:8"` - built-ins: `required` / `email` / `url` / `phone` / `minLength:n` / `maxLength:n` / `pattern` (the regex rides its own `pattern=` attribute, so commas in `{2,4}` don't collide). |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

`field` raises no events.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The form twin supplies labeled controls, shared form state, touched/dirty/error tracking, validation, secure inputs, and option fields.

**Known limits on the web**

- Validation is synchronous and the custom pattern grammar is deliberately bounded.

**Implementation notes.** State namespace: form.values.`<name>` / form.fields.`<name>`.{touched,dirty,error} / form.valid (Field.swift header).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-field`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `form`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | label/message anatomy, aria-invalid on error, error text revealed; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | Label + error are real text elements read in order; the input is the system field (placeholder announced, keyboard per type=); the error rides the semantic destructive slot (errorText, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Forms/Field/swift/Field.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: M3 field semantics + native error state; accessory bar prev/next/Done are dsxAccessibleActivation(Role.Button) (Forms.kt:454,475); type=picker rows ride dsxAccessibleSelectable (Forms.kt:542). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

