---
title: Pay
description: Take payments with the Apple Pay and Google Pay sheet.
package: pay
---

Take payments with the Apple Pay and Google Pay sheet.

Shows the native wallet sheet or a native wallet button and hands you the payment token to send to your own payment processor. The package never sees, stores or forwards the token, and it checks that your line items add up to the total. You need a payment processor, an Apple merchant id for iOS, and Google Pay gateway details for Android.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it for a one-tap checkout with the wallet the customer already trusts. If you only need card entry, use the Stripe package instead.

## What native adds

The wallet sheet unlocks with Face ID or a fingerprint and uses cards already saved on the device, which a web form cannot do.

## Install

```sh
despia add Core/Pay
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, tablet, desktop.

## Actions

### attach

`dsx.module.pay.attach`

Attaches a button or the sheet to the open payment plan. The pay button does this itself, so you rarely call it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `handle` | string | no | The shared-state key where the button wants its one-time result delivered. |
| `view` | string | no | Which view attaches: inline (the default) or overlay. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attached` | array of string | yes | The views currently attached to the plan. |
| `status` | string | yes | The state of the plan. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | No wallet session is open. | Not recoverable by retrying. |

**Example: the button attaches to the open plan on mount**

```js
const result = await dsx.module.pay.attach({"view":"inline"});
// resolves {"attached":["inline"],"status":"ready"}
```

### close

`dsx.module.pay.close`

Abandons the open payment plan. A new plan must be opened for any new cart.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | The state of the plan, closed after this call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | No wallet session is open. | Not recoverable by retrying. |
| `settled` | This session is finished. Open a new one to take another payment. | Not recoverable by retrying. |

**Example: closing an open plan abandons it**

```js
const result = await dsx.module.pay.close({});
// resolves {"status":"canceled"}
```

### complete

`dsx.module.pay.complete`

Tells the open sheet how your payment processor answered so it can show a tick or a cross and close. You must call it after request, or the sheet keeps spinning.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | no | The outcome from your processor: success or failure. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | The outcome that was shown on the sheet. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_sheet` | There is no payment sheet waiting for an outcome. | Not recoverable by retrying. |
| `unknown_status` | That is not an outcome the sheet understands. | Not recoverable by retrying. |

**Example: no word means success, the common case needs none**

```js
const result = await dsx.module.pay.complete({});
// resolves {"status":"success"}
```

**Example: an explicit success**

```js
const result = await dsx.module.pay.complete({"status":"success"});
// resolves {"status":"success"}
```

### confirm

`dsx.module.pay.confirm`

Authorizes the open payment plan through the wallet. The pay button runs it when tapped, and a second tap while the sheet is working is refused so nobody is charged twice.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `view` | string | no | Which view is asking: inline (the default) or overlay. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `billing` | object | no | The billing contact the wallet shared, if you asked for it. |
| `billing.email` | string | no | The email address the wallet shared. |
| `billing.name` | string | no | The full name the wallet shared. |
| `billing.phone` | string | no | The phone number the wallet shared. |
| `billing.postalAddress` | object | no | The postal address the wallet shared. |
| `cancelled` | boolean | yes | True when the person dismissed the sheet without paying. This is a normal outcome. |
| `network` | string | no | The card network the person paid with, such as visa. |
| `payer` | object | no | The payer contact the wallet shared, if you asked for it. |
| `payer.email` | string | no | The email address the wallet shared. |
| `payer.name` | string | no | The full name the wallet shared. |
| `payer.phone` | string | no | The phone number the wallet shared. |
| `payer.postalAddress` | object | no | The postal address the wallet shared. |
| `session` | string | yes | The handle of the payment plan. |
| `shipping` | object | no | The shipping contact the wallet shared, if you asked for it. |
| `shipping.email` | string | no | The email address the wallet shared. |
| `shipping.name` | string | no | The full name the wallet shared. |
| `shipping.phone` | string | no | The phone number the wallet shared. |
| `shipping.postalAddress` | object | no | The postal address the wallet shared. |
| `status` | string | yes | The state of the plan after the attempt. |
| `token` | string | no | The payment token to pass to your own payment processor. This package never stores or forwards it. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `authorization_failed` | The wallet could not authorize that payment. |  |
| `detached_view` | That face is not attached to this session. | Not recoverable by retrying. |
| `not_configured` | This build has no merchant identifier, so the wallet sheet cannot open. | Not recoverable by retrying. |
| `not_ready` | No wallet session is open. | Not recoverable by retrying. |
| `settled` | This session is finished. Open a new one to take another payment. | Not recoverable by retrying. |
| `sheet_busy` | A payment sheet is already open. |  |
| `unsupported_platform` | This surface has no wallet that can authorize a payment. | Not recoverable by retrying. |

**Example: a tap authorizes the open plan and hands the token back to THIS caller**

```js
const result = await dsx.module.pay.confirm({"view":"inline"});
// resolves {"cancelled":false,"network":"visa","session":"sess_1","status":"succeeded","token":"tok_opaque_psp_payload"}
```

**Example: a dismissed wallet sheet is not a failure, and the plan stays usable**

```js
const result = await dsx.module.pay.confirm({"view":"inline"});
// resolves {"cancelled":true,"session":"sess_1","status":"ready"}
```

### detach

`dsx.module.pay.detach`

Detaches a view from the open payment plan. A payment already in progress is not cancelled.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `handle` | string | no | The shared-state key the view used for its result. |
| `view` | string | no | Which view detaches: inline (the default) or overlay. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attached` | array of string | yes | The views still attached to the plan. |
| `status` | string | yes | The state of the plan. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | No wallet session is open. | Not recoverable by retrying. |

**Example: detaching mid-authorization leaves the attempt running**

```js
const result = await dsx.module.pay.detach({"view":"inline"});
// resolves {"attached":[],"status":"confirming"}
```

### request

`dsx.module.pay.request`

Shows the native payment sheet and returns what the wallet authorized. Pass a cart directly, or pass a session you opened earlier.

**When to use it.** Use it from your own pay button when you do not use the pay button component.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `capabilities` | array of string | no | Card features you require, such as debit, credit, threeDS or emv. |
| `contact` | array of string | no | Contact details to ask the person for on the sheet, such as email or phone. |
| `currency` | string | no | The three-letter currency code of all amounts, such as USD. |
| `items` | array of object | no | The line items shown on the sheet, each with a label, an amount and an optional kind (final or pending). |
| `merchant` | string | no | The merchant name or identifier shown on the payment sheet. |
| `networks` | array of string | no | The card networks you accept, such as visa or mastercard. |
| `session` | string | no | The handle of a plan opened with session, to present that plan instead of a new cart. |
| `shipping` | array of string | no | Shipping details to ask the person for on the sheet. |
| `total` | object | no | The total charged, with a label and an amount. It must equal the sum of the items. |
| `total.amount` | object | yes | The total as a decimal string in the major unit, such as 22.99. |
| `total.kind` | string | no | Always final for the total. |
| `total.label` | string | yes | The text shown next to the total, usually your business name. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `billing` | object | no | The billing contact the wallet shared, if you asked for it. |
| `billing.email` | string | no | The email address the wallet shared. |
| `billing.name` | string | no | The full name the wallet shared. |
| `billing.phone` | string | no | The phone number the wallet shared. |
| `billing.postalAddress` | object | no | The postal address the wallet shared. |
| `cancelled` | boolean | yes | True when the person dismissed the sheet without paying. This is a normal outcome. |
| `network` | string | no | The card network the person paid with, such as visa. |
| `payer` | object | no | The payer contact the wallet shared, if you asked for it. |
| `payer.email` | string | no | The email address the wallet shared. |
| `payer.name` | string | no | The full name the wallet shared. |
| `payer.phone` | string | no | The phone number the wallet shared. |
| `payer.postalAddress` | object | no | The postal address the wallet shared. |
| `shipping` | object | no | The shipping contact the wallet shared, if you asked for it. |
| `shipping.email` | string | no | The email address the wallet shared. |
| `shipping.name` | string | no | The full name the wallet shared. |
| `shipping.phone` | string | no | The phone number the wallet shared. |
| `shipping.postalAddress` | object | no | The postal address the wallet shared. |
| `token` | string | no | The payment token to pass to your own payment processor. This package never stores or forwards it. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `authorization_failed` | The wallet could not authorize that payment. |  |
| `invalid_amount` | That is not an amount this currency can express. | Not recoverable by retrying. |
| `invalid_currency` | That is not an ISO 4217 currency code. | Not recoverable by retrying. |
| `invalid_label` | Every line the customer sees needs a label. | Not recoverable by retrying. |
| `missing_merchant` | A payment needs a merchant identifier. | Not recoverable by retrying. |
| `no_items` | A payment sheet needs at least one line item. | Not recoverable by retrying. |
| `not_configured` | This build has no merchant identifier, so the wallet sheet cannot open. | Not recoverable by retrying. |
| `not_ready` | No wallet session is open. | Not recoverable by retrying. |
| `settled` | This session is finished. Open a new one to take another payment. | Not recoverable by retrying. |
| `sheet_busy` | A payment sheet is already open. |  |
| `total_mismatch` | The line items do not add up to the total. | Not recoverable by retrying. |
| `unknown_capability` | That is not a merchant capability this sheet knows. | Not recoverable by retrying. |
| `unknown_field` | That is not a field the sheet can collect. | Not recoverable by retrying. |
| `unknown_network` | That is not a card network this sheet knows. | Not recoverable by retrying. |

**Example: a two-line cart authorizes and hands back a token for the developer's own processor**

```js
const result = await dsx.module.pay.request({"currency":"USD","items":[{"amount":"18.00","label":"Coffee beans"},{"amount":"4.99","label":"Shipping"}],"merchant":"merchant.com.example.store","total":{"amount":"22.99","label":"Example Store"}});
// resolves {"billing":{},"cancelled":false,"network":"visa","payer":{},"token":"tok_opaque_psp_payload"}
```

**Example: requested contact fields come back on the payer**

```js
const result = await dsx.module.pay.request({"contact":["email"],"currency":"USD","items":[{"amount":"300.00","label":"Desk"}],"merchant":"merchant.com.example.store","shipping":["postalAddress"],"total":{"amount":"300.00","label":"Example Store"}});
// resolves {"billing":{},"cancelled":false,"network":"mastercard","payer":{"email":"buyer@example.com"},"shipping":{},"token":"tok_opaque_psp_payload"}
```

### session

`dsx.module.pay.session`

Opens a wallet payment plan with the merchant, currency, items and total, and keeps it for the pay button or the sheet to use. It shows nothing by itself.

**When to use it.** Use it when you want the wallet button to appear in your layout, with the price kept out of the markup.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `capabilities` | array of string | no | Card features you require, such as debit, credit, threeDS or emv. |
| `contact` | array of string | no | Contact details to ask the person for on the sheet, such as email or phone. |
| `currency` | string | yes | The three-letter currency code of all amounts, such as USD. |
| `items` | array of object | yes | The line items shown on the sheet, each with a label, an amount and an optional kind (final or pending). |
| `merchant` | string | yes | The merchant name or identifier shown on the payment sheet. |
| `networks` | array of string | no | The card networks you accept, such as visa or mastercard. |
| `shipping` | array of string | no | Shipping details to ask the person for on the sheet. |
| `total` | object | yes | The total charged, with a label and an amount. It must equal the sum of the items. |
| `total.amount` | object | yes | The total as a decimal string in the major unit, such as 22.99. |
| `total.kind` | string | no | Always final for the total. |
| `total.label` | string | yes | The text shown next to the total, usually your business name. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `session` | string | yes | The handle of the payment plan you opened. |
| `status` | string | yes | The state of the plan, such as open. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_open` | A wallet session is already open. Close it before opening another. |  |
| `invalid_amount` | That is not an amount this currency can express. | Not recoverable by retrying. |
| `invalid_currency` | That is not an ISO 4217 currency code. | Not recoverable by retrying. |
| `invalid_label` | Every line the customer sees needs a label. | Not recoverable by retrying. |
| `missing_merchant` | A payment needs a merchant identifier. | Not recoverable by retrying. |
| `no_items` | A payment sheet needs at least one line item. | Not recoverable by retrying. |
| `total_mismatch` | The line items do not add up to the total. | Not recoverable by retrying. |
| `unknown_capability` | That is not a merchant capability this sheet knows. | Not recoverable by retrying. |
| `unknown_field` | That is not a field the sheet can collect. | Not recoverable by retrying. |
| `unknown_network` | That is not a card network this sheet knows. | Not recoverable by retrying. |

**Example: opens the plan the button binds to, without presenting anything**

```js
const result = await dsx.module.pay.session({"currency":"USD","items":[{"amount":"18.00","label":"Coffee beans"},{"amount":"4.99","label":"Shipping"}],"merchant":"merchant.com.example.store","total":{"amount":"22.99","label":"Example Store"}});
// resolves {"session":"sess_1","status":"ready"}
```

### wallet

`dsx.module.pay.wallet`

Reports whether a card can pay right now with the networks and features you care about, and whether the person could add one.

**When to use it.** Use it before showing a pay option, and show a set-up button when canAddCards is true.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `capabilities` | array of string | no | Card features to check for, such as debit, credit, threeDS or emv. |
| `networks` | array of string | no | Card networks to check for, such as visa or mastercard. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAddCards` | boolean | yes | True when the wallet exists but is empty, so you can offer to set up a card. |
| `ready` | boolean | yes | True when the wallet holds a card that can pay now. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unknown_capability` | That is not a merchant capability this sheet knows. | Not recoverable by retrying. |
| `unknown_network` | That is not a card network this sheet knows. | Not recoverable by retrying. |

**Example: a wallet with a card can pay**

```js
const result = await dsx.module.pay.wallet({});
// resolves {"canAddCards":true,"ready":true}
```

**Example: narrowing to one network still answers**

```js
const result = await dsx.module.pay.wallet({"networks":["visa"]});
// resolves {"canAddCards":true,"ready":true}
```

## Events

Read with `dsx.on(name, handler)`.

### session.changed

Fires whenever the payment plan changes state, such as when it opens, attaches, confirms, settles or closes.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attempts` | number | yes | How many payment attempts have been made on this plan. |
| `session` | string | yes | The handle of the payment plan. |
| `status` | string | yes | The state the plan is now in. |

### session.settled

Fires when a payment attempt finishes. It carries the outcome but never the payment token.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `network` | string | yes | The card network used, or empty when the wallet did not say. |
| `session` | string | yes | The handle of the payment plan. |
| `status` | string | yes | The result of the attempt, such as success or failure. |
| `view` | string | yes | Which view made the attempt: overlay or inline. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `apple_merchant_country` | string | `US` | The two-letter country code your business is registered in, e.g. US. |
| `apple_merchant_id` | string | `` | The merchant identifier from your Apple Developer account, e.g. merchant.com.yourcompany.app. |
| `google_environment` | string | `test` | Which Google Pay environment to open: test cards, or real ones. |
| `google_gateway` | string | `` | Your payment processor's Google Pay gateway name, e.g. stripe, adyen, braintree. |
| `google_gateway_merchant_id` | string | `` | The account identifier your processor issued you, e.g. a Stripe account ID. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
