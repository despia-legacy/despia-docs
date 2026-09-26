---
title: textfield
description: The base Web twin uses a real text/password input with binding, placeholder, change, submit, focus and blur events, and maps the fixture's contentType/keyboard tokens onto autocomplete/inputmode/type.
order: 3
section: components
element: textfield
category: input
scope: library
platforms: web,ios,android,desktop
properties: [{"name":"autocapitalize","type":"enum","default":null,"values":["off","none","on","sentences","words","characters"]},{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-label)"},{"name":"contentType","type":"enum","default":null,"values":["name","givenName","familyName","middleName","namePrefix","nameSuffix","nickname","jobTitle","organizationName","emailAddress","telephoneNumber","URL","username","password","newPassword","oneTimeCode","fullStreetAddress","streetAddressLine1","streetAddressLine2","addressCity","addressState","postalCode","countryName","creditCardNumber","creditCardName","creditCardExpiration","creditCardExpirationMonth","creditCardExpirationYear","creditCardSecurityCode","none","email","otp","firstName","lastName","phone","telephone","url","zip","address"]},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"enterkeyhint","type":"enum","default":null,"values":["enter","done","go","next","previous","search","send"]},{"name":"keyboard","type":"enum","default":null,"values":["email","number","decimal","phone","url","ascii","twitter","websearch"]},{"name":"on:blur","type":"action","default":null},{"name":"on:change","type":"action","default":null},{"name":"on:focus","type":"action","default":null},{"name":"on:submit","type":"action","default":null},{"name":"placeholder","type":"string","default":null},{"name":"secure","type":"bool","default":"false"}]
actions: ["blur","change","focus","submit"]
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# textfield

The base Web twin uses a real text/password input with binding, placeholder, change, submit, focus and blur events, and maps the fixture's contentType/keyboard tokens onto autocomplete/inputmode/type.

<RefMeta platforms="Web,iOS,Android,Desktop">
Category: Input - Also answers to `input` - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<textfield bind="dsx.variable.email" placeholder="Email" on:submit="dsx.action.next()"/>
```

`textfield` takes no children. The same element answers to `input`.

## Catalog specimen

`TextfieldDefault.dsx`, verbatim from the catalog:

```dsx
<textfield bind="dsx.variable.email" placeholder="Email" style="width: 100%">
  <head>
    <variable as="email">return ''</variable>
  </head>
</textfield>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: hover well delta, focus well + ring, typing writes store (tf=Atlas), placeholder, dark field well - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | System TextField/SecureField with @FocusState on:focus/on:blur, on:submit on return, on:change via the write seam; W9 disabled grammar; contentType autofill incl. oneTimeCode; focus never shifts layout (the minHeight 24 stability pin) (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/TextField/swift/TextField.swift); CI types into the DSX keyboard input across iPhone/iPad/Catalyst tests (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: unstyled path = REAL M3 OutlinedTextField (M3TextFieldView, SelectionControl.TEXTFIELD): platform focus/state layers + enabled=!disabled (StackInputViews.kt:304-308); legacy path dims/gates identically (StackInputViews.kt:225-229); the B2 event trio byte-pinned: on:focus/on:blur CHANGE-only, on:submit from the IME action THEN clearFocus->blur (StackInputViews.kt:218-243); secure= PasswordVisualTransformation. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `autocapitalize` | `off` \| `none` \| `on` \| `sentences` \| `words` \| `characters` |  | The HTML autocapitalize spelling, in app: sets the soft keyboard auto-capitalization behavior. |
| `bind` | `expr` |  | Two-way bound String. |
| `color` | `color` | `var(--dsx-label)` | Unstyled controls follow the adaptive label token. |
| `contentType` | `name` \| `givenName` \| `familyName` \| `middleName` \| `namePrefix` \| `nameSuffix` \| `nickname` \| `jobTitle` \| `organizationName` \| `emailAddress` \| `telephoneNumber` \| `URL` \| `username` \| `password` \| `newPassword` \| `oneTimeCode` \| `fullStreetAddress` \| `streetAddressLine1` \| `streetAddressLine2` \| `addressCity` \| `addressState` \| `postalCode` \| `countryName` \| `creditCardNumber` \| `creditCardName` \| `creditCardExpiration` \| `creditCardExpirationMonth` \| `creditCardExpirationYear` \| `creditCardSecurityCode` \| `none` \| `email` \| `otp` \| `firstName` \| `lastName` \| `phone` \| `telephone` \| `url` \| `zip` \| `address` |  |  |
| `disabled` | `bool` | `false` |  |
| `disabled-if` | `expr` |  | Disabled when this expression is truthy. `disabled=` binds as TEXT, and the string "false" is TRUE - so a bound boolean belongs here, never there. |
| `enterkeyhint` | `enter` \| `done` \| `go` \| `next` \| `previous` \| `search` \| `send` |  | The HTML enterkeyhint spelling, in app: sets the soft keyboard return key label and, when present, wins over the label the keyboard token implies. |
| `keyboard` | `email` \| `number` \| `decimal` \| `phone` \| `url` \| `ascii` \| `twitter` \| `websearch` |  | `email` \ |
| `on:blur` | `action` |  |  |
| `on:change` | `action` |  | Each edit. The payload names WHAT CAUSED the change beside the value: `inputType`, a member of the closed DOM `InputEvent.inputType` vocabulary, flat in the handler scope. `historyUndo` and `historyRedo` are the FIELD'S own text history and not the document's, so a consumer that commits on a settle, Enter or blur must treat them as local and write nothing. A renderer that cannot name the cause says `unspecified`, which is a member and is never local. The law, with the per renderer table, is OpenSource/Conformance/elements/textfield.json `behavior.changeCause`. |
| `on:focus` | `action` |  |  |
| `on:submit` | `action` |  | Return key. |
| `placeholder` | `string` |  |  |
| `secure` | `bool` | `false` | `"true"` → `SecureField`. |

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

The base Web twin uses a real text/password input with binding, placeholder, change, submit, focus and blur events, and maps the fixture's contentType/keyboard tokens onto autocomplete/inputmode/type.

**Known limits on the web**

- keyboard= sets inputmode (and, for email/phone/url, the matching input type); a numeric keyboard deliberately stays type=text so the field keeps its literal value instead of a locale-parsed number.
- An unrecognized contentType/keyboard token leaves the platform default in place, exactly as an unknown UITextContentType does on the native runtime.
- Which autofill entries a browser actually offers is user-agent and profile owned; the renderer declares the field's meaning, it cannot force the suggestion.

**Implementation notes.** Android placeholder renders at text color alpha 0.3 (StackInputViews.kt) - iOS uses the native prompt styling. Android submit rides the IME action (Done; keyboard= url→Go, websearch→Search - the iOS return-key presentation for the mapped UIKeyboardType), firing on:submit then ending editing so on:blur follows - the SwiftUI return-key order, and editing ends even with no on:submit authored. Pinned Android divergences: twitter/websearch have no Compose keyboard layout (KeyboardType.Text; websearch's identity rides the IME action), and contentType (semantic autofill) is deferred.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-textfield`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `base`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | labelled input, focus ring; axe 0 serious/critical on the controls family page light+dark (calendar excluded, filed) |
| ios | review | 2026-08-18 | System field semantics (placeholder announced, secure entry, autofill hints via textContentType); CI queries and types through the accessibility tree (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: real text-input semantics on both paths (BasicTextField/OutlinedTextField); placeholder announced via the M3 slot; password masking via VisualTransformation (StackInputViews.kt). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

