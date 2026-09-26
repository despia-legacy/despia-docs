---
title: form
description: The form twin manages namespace state, child fields, validity, scrolling, and submit actions/events using a real form element.
order: 3
section: components
element: form
category: forms
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"as","type":"string","default":"form"},{"name":"on:submit","type":"action","default":null},{"name":"scroll","type":"bool","default":"false"},{"name":"spacing","type":"number","default":"12"},{"name":"submit","type":"string","default":null}]
actions: ["submit"]
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# form

The form twin manages namespace state, child fields, validity, scrolling, and submit actions/events using a real form element.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Forms - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<form as="signup" submit="Create account" on:submit="dsx.action.signup()"><field name="email" type="email" validate="required,email"/></form>
```

`form` takes children.

## Catalog specimen

`FormDefault.dsx`, verbatim from the catalog:

```dsx
<form as="signup" submit="Create account" style="width: 100%">
  <head/>
  <field name="email" type="email" label="Email" validate="required,email"/>
  <field name="password" type="secure" label="Password" validate="required"/>
</form>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: invalid submit dims Save + marks touched, valid submit fires on:submit exactly once (submits=1) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | valid gating (submit runs on:submit only when form.valid), an invalid submit marks every field touched + sets form.submitted (markAllTouched), dim-while-invalid submit affordance (opacity 0.5, still tappable to reveal errors) (DSXForm, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Forms/Form/swift/Form.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: invalid submit dims the button to 50% (FORM_INVALID_OPACITY), marks every registered field touched + sets form.submitted; valid submit blurs then fires on:submit (Forms.kt FORM block, Form.swift 1:1); state namespace injected via CompositionLocal (as=). |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `as` | `string` | `form` | The state namespace; nested `<field>`s inherit it automatically - multiple forms on a screen just need distinct `as`. |
| `on:submit` | `action` |  | Runs only when `form.valid`. |
| `scroll` | `bool` | `false` | Wrap in a ScrollView (the keyboard lifts the focused field). |
| `spacing` | `number` | `12` |  |
| `submit` | `string` |  | Renders a submit button with this label; dims while invalid. An invalid submit marks every field touched + sets `form.submitted` (reveals all errors at once). Prefer your own button + `disabled-if="{{ !form.valid }}"` for full control. |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `submit` | `on:submit="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `captured` | the desktop capture plane composed and measured this element at both locked widths |

The form twin manages namespace state, child fields, validity, scrolling, and submit actions/events using a real form element.

**Known limits on the web**

- Async/server validation orchestration remains application-owned.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-form`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `form`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | submit button dims while invalid (aria-disabled), errors revealed on submit; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | The system Form path inherits platform form semantics; the submit affordance is a real Button; fields coordinate focus through store state (dsxForm environment); nothing intercepts assistive input (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Forms/Form/swift/Form.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: submit is dsxAccessibleActivation(Role.Button) (Forms.kt:207); errors reveal per field; keyboard walk rides form.fieldOrder/form.focus (Forms.kt accessory bar; pure halves pinned in FormsAccessoryTest - gradle :render:testDebugUnitTest run 2026-08-18: 292 tests, 1 failure (StackButtonsTest#systemButtonsDelegateTheirDefaultPalettesToMaterial3 - a stale source-grep of the pre-W9 disabled literal, not a behavior break)). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

