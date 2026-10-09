---
title: Stripe
description: Take card, Apple Pay and bank payments with Stripe.
package: stripe
---

Take card, Apple Pay and bank payments with Stripe.

Shows Stripe's payment sheet and customer sheet in your app, supports Apple Pay and optional card scanning, and handles bank payments and Connect onboarding. Your server creates the payments and sends the secrets to the app. Works with the Payments package. Needs a Stripe account, your publishable key and, for Apple Pay, an Apple merchant ID.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it to take card, Apple Pay, Google Pay and bank payments through Stripe in a native app. Your own server must create the payment and send its secrets to the app; this package never holds your secret key.

## What native adds

Native Stripe sheets give Apple Pay, Google Pay, card scanning and bank linking that web checkout cannot match, and the payment never leaves your app.

## Install

```sh
despia add Core/Payments/Modules/Stripe
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, desktop.

## Actions

### attach

`dsx.module.stripe.attach`

Registers a face, such as a card field or wallet button, with the open session so it is allowed to confirm.

**When to use it.** The Stripe components call this for you; you rarely need it yourself.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `handle` | string | no | The key under which the face keeps its live Stripe view so the package can reach it when confirming. |
| `view` | string | no | Which face is acting: inline for the card field, overlay for the presented sheet, or wallet for Apple Pay and Google Pay. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attached` | array | yes | The faces that are attached to the session now. |
| `status` | string | yes | The state of the session. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | No Stripe session is open. | Not recoverable by retrying. |

**Example: the inline face attaches to an open session**

```js
const result = await dsx.module.stripe.attach({"view":"inline"});
// resolves {"attached":["inline"],"status":"ready"}
```

**Example: the wallet button attaches beside the card field as a DISTINCT face**

```js
const result = await dsx.module.stripe.attach({"view":"wallet"});
// resolves {"attached":["overlay"],"status":"ready"}
```

### close

`dsx.module.stripe.close`

Abandons the open session; if a payment attempt is running it cancels that attempt and keeps the payment usable.

**When to use it.** Use it when the person leaves checkout. After a session is closed with no attempt running, it is finished for good.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `session` | string | no | The id of the session to close; it defaults to the current one. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | The state of the session after closing, such as canceled. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | No Stripe session is open. | Not recoverable by retrying. |
| `settled` | This session is finished. Open a new one to take another payment. | Not recoverable by retrying. |

**Example: abandons an idle session**

```js
const result = await dsx.module.stripe.close({});
// resolves {"status":"canceled"}
```

### confirm

`dsx.module.stripe.confirm`

Confirms the open session's payment from a named face, which is what your own Pay button calls.

**When to use it.** Use it when you build a custom checkout button around the inline components. For the plain sheet use payment.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `session` | string | no | The id of the session to confirm; it defaults to the current one. |
| `view` | string | no | Which face is acting: inline for the card field, overlay for the presented sheet, or wallet for Apple Pay and Google Pay. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `code` | string | no | A machine-readable reason, present only when the status is failed, that your code can branch on. |
| `error` | string | no | Stripe's own message for a failed attempt. |
| `method` | string | yes | Which Stripe surface took the payment, such as cardInput or a wallet. |
| `status` | string | yes | How it ended: completed, canceled or failed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A payment is already being confirmed. |  |
| `detached_view` | That face is not attached to this session. | Not recoverable by retrying. |
| `not_confirming` | No payment is being confirmed. | Not recoverable by retrying. |
| `not_ready` | No Stripe session is open. | Not recoverable by retrying. |
| `settled` | This session is finished. Open a new one to take another payment. | Not recoverable by retrying. |

**Example: confirms the inline session**

```js
const result = await dsx.module.stripe.confirm({});
// resolves {"method":"cardInput","status":"completed"}
```

**Example: a wallet confirm charges the WALLET, never the card field beside it**

```js
const result = await dsx.module.stripe.confirm({"view":"wallet"});
// resolves {"method":"applePay","status":"completed"}
```

### connectBank

`dsx.module.stripe.connectBank`

Opens Stripe Financial Connections so the person can link a bank account.

**When to use it.** Use it to link a bank for later payments or checks. To pay by US bank debit straight away use payAch.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `financial_connections_session_client_secret` | string | yes | The client secret of the Financial Connections session your server created. |
| `publishable_key` | string | yes | Your Stripe publishable key, which starts with pk_test or pk_live. Never pass the secret key. |
| `return_url` | string | no | On iOS, the address that brings the person back to the app after their bank; Android and the web ignore it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accounts` | array | no | The ids of the accounts the person linked, present when the status is linked. |
| `error` | string | no | Stripe's own message when the status is failed. |
| `session` | string | no | The Financial Connections session id, present when the status is linked. |
| `status` | string | yes | How it ended: linked, canceled or failed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A bank link or ACH confirm is already open. |  |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find a screen to present the bank link. | Not recoverable by retrying. |
| `not_ready` | Stripe is not ready yet. Please try again in a moment. |  |

**Example: links a bank through Financial Connections**

```js
const result = await dsx.module.stripe.connectBank({"financial_connections_session_client_secret":"fcsess_secret_abc","publishable_key":"pk_test_123"});
// resolves {"accounts":["fca_1"],"session":"fcsess_1","status":"linked"}
```

**Example: a user dismiss is canceled, not a failure**

```js
const result = await dsx.module.stripe.connectBank({"financial_connections_session_client_secret":"fcsess_secret_cancel","publishable_key":"pk_test_123"});
// resolves {"status":"canceled"}
```

### connectOnboard

`dsx.module.stripe.connectOnboard`

Opens Stripe Connect onboarding so a seller can set up their connected account.

**When to use it.** Use it in marketplace or platform apps. Your server must first create an account session with onboarding enabled.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `account` | string | no | The id of the connected account the session was made for; it is echoed back when onboarding completes. |
| `account_session_client_secret` | string | yes | The client secret of the account session your server created. |
| `publishable_key` | string | yes | Your Stripe publishable key, which starts with pk_test or pk_live. Never pass the secret key. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `account` | string | no | The connected account id, present when onboarding completed. |
| `error` | string | no | Stripe's own message when the status is failed. |
| `status` | string | yes | How onboarding ended, such as complete, canceled or failed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A Connect onboard is already open. |  |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find a screen to present Connect onboarding. | Not recoverable by retrying. |
| `not_ready` | Stripe is not ready yet. Please try again in a moment. |  |
| `unsupported_platform` | Connect embedded onboarding needs com.stripe:connect EmbeddedComponentManager, which this pin does not link. | Not recoverable by retrying. |

**Example: completes Connect account onboarding**

```js
const result = await dsx.module.stripe.connectOnboard({"account":"acct_1","account_session_client_secret":"accs_secret_abc","publishable_key":"pk_test_123"});
// resolves {"account":"acct_1","status":"complete"}
```

**Example: a user dismiss is canceled, not a failure**

```js
const result = await dsx.module.stripe.connectOnboard({"account_session_client_secret":"accs_secret_cancel","publishable_key":"pk_test_123"});
// resolves {"status":"canceled"}
```

### detach

`dsx.module.stripe.detach`

Removes a face from the open session without cancelling a payment that is in progress.

**When to use it.** The Stripe components call this when they unmount; you rarely need it yourself.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `view` | string | no | Which face is acting: inline for the card field, overlay for the presented sheet, or wallet for Apple Pay and Google Pay. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attached` | array | yes | The faces that are still attached to the session. |
| `status` | string | yes | The state of the session. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | No Stripe session is open. | Not recoverable by retrying. |

**Example: detaching mid-confirm leaves the attempt running**

```js
const result = await dsx.module.stripe.detach({"view":"inline"});
// resolves {"attached":[],"status":"confirming"}
```

**Example: a wallet button that unmounts mid-sheet leaves the attempt running**

```js
const result = await dsx.module.stripe.detach({"view":"wallet"});
// resolves {"attached":[],"status":"confirming"}
```

### manage

`dsx.module.stripe.manage`

Shows Stripe's native customer sheet so the person can pick or edit their saved payment methods.

**When to use it.** Use it from a settings or account screen. It does not take a payment.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accent_color` | string | no | The accent color of the Stripe sheet, as a color value. |
| `action_corner_radius` | number | no | The corner radius of the Stripe sheet's buttons, in points. |
| `corner_radius` | number | no | The corner radius of the Stripe sheet's fields, in points. |
| `customer_id` | string | yes | The Stripe customer id whose saved payment methods are shown. |
| `ephemeral_key_secret` | string | yes | The short-lived key your server created for that customer. |
| `publishable_key` | string | yes | Your Stripe publishable key, which starts with pk_test or pk_live. Never pass the secret key. |
| `setup_intent_client_secret` | string | no | The client secret of a setup your server created, so a new payment method can be saved. |
| `theme` | string | no | The look of the Stripe sheet: its light or dark appearance. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `error` | string | no | Stripe's own message when the status is failed. |
| `method` | string | yes | Which Stripe surface was shown, such as customerSheet. |
| `status` | string | yes | How it ended: selected, canceled or failed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A payment sheet is already open. |  |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find a screen to present the payment. | Not recoverable by retrying. |
| `not_ready` | Stripe is not ready yet. Please try again in a moment. |  |

**Example: selects a saved payment method**

```js
const result = await dsx.module.stripe.manage({"customer_id":"cus_123","ephemeral_key_secret":"ek_123","publishable_key":"pk_test_123"});
// resolves {"method":"customerSheet","status":"selected"}
```

### payAch

`dsx.module.stripe.payAch`

Collects a US bank account and confirms an ACH Direct Debit payment.

**When to use it.** Use it for US bank debits. You must show the person the debit mandate text first and only then pass mandate_accepted as true.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `email` | string | no | The email address of the account holder, used for the debit receipt. |
| `mandate_accepted` | boolean | yes | True once the person has seen and accepted the debit mandate; the call fails without it. |
| `name` | string | yes | The full name of the account holder. |
| `payment_intent_client_secret` | string | yes | The client secret of the payment your server created. |
| `publishable_key` | string | yes | Your Stripe publishable key, which starts with pk_test or pk_live. Never pass the secret key. |
| `return_url` | string | no | On iOS, the address that brings the person back to the app after their bank. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `error` | string | no | Stripe's own message when the status is failed. |
| `method` | string | yes | The payment method used, such as us_bank_account. |
| `status` | string | yes | How it ended: completed, canceled or failed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A bank link or ACH confirm is already open. |  |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find a screen to present the bank collection. | Not recoverable by retrying. |
| `not_ready` | Stripe is not ready yet. Please try again in a moment. |  |

**Example: collects a bank account and confirms ACH**

```js
const result = await dsx.module.stripe.payAch({"email":"ada@example.com","mandate_accepted":true,"name":"Ada Lovelace","payment_intent_client_secret":"pi_123_secret_abc","publishable_key":"pk_test_123"});
// resolves {"method":"us_bank_account","status":"completed"}
```

**Example: a user dismiss is canceled, not a failure**

```js
const result = await dsx.module.stripe.payAch({"mandate_accepted":true,"name":"Ada Lovelace","payment_intent_client_secret":"pi_123_secret_cancel","publishable_key":"pk_test_123"});
// resolves {"method":"us_bank_account","status":"canceled"}
```

### payment

`dsx.module.stripe.payment`

Shows Stripe's native payment sheet so the person can pay for a payment your server already created.

**When to use it.** Use it for a one-off purchase when a full sheet is fine. For card fields inside your own layout, open a session and use the inline components instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accent_color` | string | no | The accent color of the Stripe sheet, as a color value. |
| `action_corner_radius` | number | no | The corner radius of the Stripe sheet's buttons, in points. |
| `corner_radius` | number | no | The corner radius of the Stripe sheet's fields, in points. |
| `customer_id` | string | no | The Stripe customer id, so the sheet can show and save that customer's payment methods. |
| `ephemeral_key_secret` | string | no | The short-lived key your server created for that customer; needed with customer_id. |
| `payment_intent_client_secret` | string | yes | The client secret of the payment your server created with Stripe. |
| `publishable_key` | string | yes | Your Stripe publishable key, which starts with pk_test or pk_live. Never pass the secret key. |
| `session` | string | no | The id of an open inline session to present the sheet over, instead of starting a second payment. |
| `theme` | string | no | The look of the Stripe sheet: its light or dark appearance. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `error` | string | no | Stripe's own message when the status is failed. |
| `method` | string | yes | Which Stripe surface took the payment, such as paymentSheet. |
| `status` | string | yes | How it ended: completed, canceled or failed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A payment sheet is already open. |  |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find a screen to present the payment. | Not recoverable by retrying. |
| `not_ready` | Stripe is not ready yet. Please try again in a moment. |  |
| `settled` | This session is finished. Open a new one to take another payment. | Not recoverable by retrying. |

**Example: completes a payment sheet**

```js
const result = await dsx.module.stripe.payment({"payment_intent_client_secret":"pi_123_secret_abc","publishable_key":"pk_test_123"});
// resolves {"method":"paymentSheet","status":"completed"}
```

**Example: presents over an existing inline session**

```js
const result = await dsx.module.stripe.payment({"payment_intent_client_secret":"pi_123_secret_abc","publishable_key":"pk_test_123","session":"sess_1"});
// resolves {"method":"paymentSheet","status":"completed"}
```

### portal

`dsx.module.stripe.portal`

Opens the Stripe customer portal at a session address your server created.

**When to use it.** Use it on the web so customers can manage subscriptions and invoices. On iOS and Android use manage instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `url` | string | yes | The https billing.stripe.com portal session address your server created. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | Opened when the page is being sent to the portal. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_param` | The portal URL must be an https://billing.stripe.com session URL. | Not recoverable by retrying. |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `unsupported_platform` | The customer portal is a web page; on iOS and Android use manage(). | Not recoverable by retrying. |

**Example: opens a Customer Portal session URL**

```js
const result = await dsx.module.stripe.portal({"url":"https://billing.stripe.com/p/session/test_abc"});
// resolves {"status":"opened"}
```

### session

`dsx.module.stripe.session`

Opens the payment session that the inline Stripe components bind to, without showing anything.

**When to use it.** Use it before placing card, payment or express checkout components in your own layout. It does not charge anything.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accent_color` | string | no | The accent color of the Stripe sheet, as a color value. |
| `amount` | number | no | The total shown on the wallet sheet, in the smallest currency unit such as cents; the real charge is set by your server. |
| `checkout_session_client_secret` | string | no | On the web only, the client secret of an embedded Stripe Checkout session. |
| `corner_radius` | number | no | The corner radius of the Stripe sheet's fields, in points. |
| `country_code` | string | no | The two-letter country where the payment is processed, which is your Stripe account's country; it defaults to US. |
| `currency` | string | no | The three-letter currency code shown on the wallet sheet total; the real charge is set by your server. |
| `customer_id` | string | no | The Stripe customer id for saved payment methods. |
| `ephemeral_key_secret` | string | no | The short-lived key your server created for that customer. |
| `label` | string | no | The line label on the wallet sheet total; it defaults to the app name. |
| `merchant_identifier` | string | no | On iOS, your Apple merchant id for Apple Pay; it defaults to the Apple merchant ID setting. |
| `payment_intent_client_secret` | string | no | The client secret of the payment your server created. |
| `publishable_key` | string | yes | Your Stripe publishable key, which starts with pk_test or pk_live. Never pass the secret key. |
| `setup_intent_client_secret` | string | no | The client secret of a setup your server created, to save a payment method without charging. |
| `theme` | string | no | The look of the Stripe sheet: its light or dark appearance. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `session` | string | yes | The id of the session that was opened. |
| `status` | string | yes | The state of the session, such as ready. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_open` | A Stripe session is already open. Close it before opening another. |  |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |

**Example: opens a payment session the inline components bind to**

```js
const result = await dsx.module.stripe.session({"payment_intent_client_secret":"pi_123_secret_abc","publishable_key":"pk_test_123"});
// resolves {"session":"sess_1","status":"ready"}
```

**Example: opens a wallet-capable session**

```js
const result = await dsx.module.stripe.session({"amount":1099,"country_code":"US","currency":"USD","label":"iHats, Inc","merchant_identifier":"merchant.com.example.app","payment_intent_client_secret":"pi_123_secret_abc","publishable_key":"pk_test_123"});
// resolves {"session":"sess_1","status":"ready"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `apple_merchant_id` | string | `` | The merchant identifier from your Apple Developer account, e.g. merchant.com.yourcompany.app. |
| `card_scan` | string | `offer` | offer: the card form offers Stripe's scanner where the device has one. auto: the scanner opens with the card form. |
| `card_scan_usage_description` | string | `Scan your card to fill in its details.` | Shown by iOS the first time the card scanner asks for the camera. |
| `publishable_key` | string | `` | Your Stripe publishable key (pk_test_... or pk_live_...), used by <payments.PaymentMessaging/> on the web when no session is open. Never the secret key. |

## Related packages

- Needs: [Payments](/packages/payments)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
