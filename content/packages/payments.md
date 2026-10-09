---
title: Payments
description: Take payments in your app with one set of calls, whichever payment provider you use.
package: payments
---

Take payments in your app with one set of calls, whichever payment provider you use.

Gives your app one way to start a payment, manage saved cards, link a bank account and open a customer portal, drawn by the payment package you add, such as Stripe. Add the provider packages you need and nothing more. Needs an account with that provider.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it to take payments inside your app through one set of calls, whichever provider package you add. Choose it before wiring a provider's own calls, so you can change provider later. Do not use it for in-app purchases of digital goods, which belong to the stores.

## What native adds

Native payment sheets support Apple Pay and Google Pay, saved cards and bank linking with the operating system's own look, and card numbers go straight to the provider.

## Install

```sh
despia add Core/Payments
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

### close

`dsx.module.payments.close`

Abandons the open payment session and clears its state. Call it when the user leaves checkout without paying.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `session` | string | no | The id of the open payment session this call applies to. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | How the payment ended, for example completed, canceled or failed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | No payment processor serves this build: add a processor package (payments.stripe) or set the payments `processor` config. | Not recoverable by retrying. |
| `not_ready` | No Stripe session is open. | Not recoverable by retrying. |
| `settled` | This session is finished. Open a new one to take another payment. | Not recoverable by retrying. |

**Example: abandons an idle session (served by the processor row)**

```js
const result = await dsx.module.payments.close({});
// resolves {"status":"canceled"}
```

### confirm

`dsx.module.payments.confirm`

Confirms the payment in the open session using the part of the screen the user acted on.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `session` | string | no | The id of the open payment session this call applies to. |
| `view` | string | no | Which part of the screen is confirming: inline (the card field), overlay (the payment sheet) or wallet (Apple Pay or Google Pay). |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `code` | string | no | A short code for the failure, when there was one. |
| `error` | string | no | A readable reason, when the payment did not succeed. |
| `method` | string | yes | The payment method the user paid with, such as card or Apple Pay. |
| `status` | string | yes | How the payment ended, for example completed, canceled or failed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A payment is already being confirmed. |  |
| `detached_view` | That face is not attached to this session. | Not recoverable by retrying. |
| `not_configured` | No payment processor serves this build: add a processor package (payments.stripe) or set the payments `processor` config. | Not recoverable by retrying. |
| `not_confirming` | No payment is being confirmed. | Not recoverable by retrying. |
| `not_ready` | No Stripe session is open. | Not recoverable by retrying. |
| `settled` | This session is finished. Open a new one to take another payment. | Not recoverable by retrying. |

**Example: confirms the inline session (served by the processor row)**

```js
const result = await dsx.module.payments.confirm({});
// resolves {"method":"cardInput","status":"completed"}
```

### connectBank

`dsx.module.payments.connectBank`

Opens the bank-linking flow so the user can connect a bank account for later debits.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `financial_connections_session_client_secret` | string | yes | The client secret of the bank-linking session your server created. |
| `publishable_key` | string | yes | Your Stripe publishable key, which is safe to ship in the app. |
| `return_url` | string | no | The address the user returns to after finishing in another app or page. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accounts` | array | no | The bank accounts the user linked. |
| `error` | string | no | A readable reason, when the payment did not succeed. |
| `session` | string | no | The id of the bank-linking session. |
| `status` | string | yes | How the payment ended, for example completed, canceled or failed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A bank link or ACH confirm is already open. |  |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find a screen to present the bank link. | Not recoverable by retrying. |
| `not_configured` | No payment processor serves this build: add a processor package (payments.stripe) or set the payments `processor` config. | Not recoverable by retrying. |
| `not_ready` | Stripe is not ready yet. Please try again in a moment. |  |

**Example: links a bank through Financial Connections (served by the processor row)**

```js
const result = await dsx.module.payments.connectBank({"financial_connections_session_client_secret":"fcsess_secret_abc","publishable_key":"pk_test_123"});
// resolves {"accounts":["fca_1"],"session":"fcsess_1","status":"linked"}
```

### manage

`dsx.module.payments.manage`

Shows the sheet where the user manages their saved payment methods, adding or removing cards.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accent_color` | string | no | The accent colour for buttons and highlights, as a hex value. |
| `action_corner_radius` | number | no | How rounded the buttons on the payment sheet are, in points. |
| `corner_radius` | number | no | How rounded the payment fields are, in points. |
| `customer_id` | string | yes | The Stripe customer id of the signed-in user, to show their saved payment methods. |
| `ephemeral_key_secret` | string | yes | A short-lived key your server made so the app may read this customer's saved methods. |
| `publishable_key` | string | yes | Your Stripe publishable key, which is safe to ship in the app. |
| `setup_intent_client_secret` | string | no | The client secret of a setup intent, used to save a payment method without charging. |
| `theme` | string | no | The look of the payment screens: light, dark or automatic. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `error` | string | no | A readable reason, when the payment did not succeed. |
| `method` | string | yes | The payment method the user paid with, such as card or Apple Pay. |
| `status` | string | yes | How the payment ended, for example completed, canceled or failed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A payment sheet is already open. |  |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find a screen to present the payment. | Not recoverable by retrying. |
| `not_configured` | No payment processor serves this build: add a processor package (payments.stripe) or set the payments `processor` config. | Not recoverable by retrying. |
| `not_ready` | Stripe is not ready yet. Please try again in a moment. |  |

**Example: selects a saved payment method (served by the processor row)**

```js
const result = await dsx.module.payments.manage({"customer_id":"cus_123","ephemeral_key_secret":"ek_123","publishable_key":"pk_test_123"});
// resolves {"method":"customerSheet","status":"selected"}
```

### payAch

`dsx.module.payments.payAch`

Pays the intent by US bank debit, after the user accepted the debit agreement and linked an account.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `email` | string | no | The account holder's email address. |
| `mandate_accepted` | boolean | yes | True when the user has accepted the bank debit agreement. |
| `name` | string | yes | The account holder's full name. |
| `payment_intent_client_secret` | string | yes | The client secret of the payment intent your server created for this payment. |
| `publishable_key` | string | yes | Your Stripe publishable key, which is safe to ship in the app. |
| `return_url` | string | no | The address the user returns to after finishing in another app or page. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `error` | string | no | A readable reason, when the payment did not succeed. |
| `method` | string | yes | The payment method the user paid with, such as card or Apple Pay. |
| `status` | string | yes | How the payment ended, for example completed, canceled or failed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A bank link or ACH confirm is already open. |  |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find a screen to present the bank collection. | Not recoverable by retrying. |
| `not_configured` | No payment processor serves this build: add a processor package (payments.stripe) or set the payments `processor` config. | Not recoverable by retrying. |
| `not_ready` | Stripe is not ready yet. Please try again in a moment. |  |

**Example: collects a bank account and confirms ACH (served by the processor row)**

```js
const result = await dsx.module.payments.payAch({"email":"ada@example.com","mandate_accepted":true,"name":"Ada Lovelace","payment_intent_client_secret":"pi_123_secret_abc","publishable_key":"pk_test_123"});
// resolves {"method":"us_bank_account","status":"completed"}
```

### payment

`dsx.module.payments.payment`

Shows the provider's payment sheet so the user can pick a method and pay, and returns when they finish or cancel.

**When to use it.** Use it for a quick checkout without building your own fields.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accent_color` | string | no | The accent colour for buttons and highlights, as a hex value. |
| `action_corner_radius` | number | no | How rounded the buttons on the payment sheet are, in points. |
| `corner_radius` | number | no | How rounded the payment fields are, in points. |
| `customer_id` | string | no | The Stripe customer id of the signed-in user, to show their saved payment methods. |
| `ephemeral_key_secret` | string | no | A short-lived key your server made so the app may read this customer's saved methods. |
| `payment_intent_client_secret` | string | yes | The client secret of the payment intent your server created for this payment. |
| `publishable_key` | string | yes | Your Stripe publishable key, which is safe to ship in the app. |
| `session` | string | no | The id of the open payment session this call applies to. |
| `theme` | string | no | The look of the payment screens: light, dark or automatic. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `error` | string | no | A readable reason, when the payment did not succeed. |
| `method` | string | yes | The payment method the user paid with, such as card or Apple Pay. |
| `status` | string | yes | How the payment ended, for example completed, canceled or failed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A payment sheet is already open. |  |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find a screen to present the payment. | Not recoverable by retrying. |
| `not_configured` | No payment processor serves this build: add a processor package (payments.stripe) or set the payments `processor` config. | Not recoverable by retrying. |
| `not_ready` | Stripe is not ready yet. Please try again in a moment. |  |
| `settled` | This session is finished. Open a new one to take another payment. | Not recoverable by retrying. |

**Example: completes a payment sheet (served by the processor row)**

```js
const result = await dsx.module.payments.payment({"payment_intent_client_secret":"pi_123_secret_abc","publishable_key":"pk_test_123"});
// resolves {"method":"paymentSheet","status":"completed"}
```

### portal

`dsx.module.payments.portal`

Opens the provider's hosted customer portal, where users manage subscriptions, invoices and payment methods. Works on the web only.

**When not to.** On iOS and Android use manage instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `url` | string | yes | The https address of the customer portal session your server created. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | How the payment ended, for example completed, canceled or failed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_param` | The portal URL must be an https://billing.stripe.com session URL. | Not recoverable by retrying. |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `not_configured` | No payment processor serves this build: add a processor package (payments.stripe) or set the payments `processor` config. | Not recoverable by retrying. |
| `unsupported_platform` | The customer portal is a web page; on iOS and Android use manage(). | Not recoverable by retrying. |

**Example: opens a Customer Portal session URL (served by the processor row)**

```js
const result = await dsx.module.payments.portal({"url":"https://billing.stripe.com/p/session/test_abc"});
// resolves {"status":"opened"}
```

### session

`dsx.module.payments.session`

Opens a payment session that the card fields and checkout tags on your screen attach to. Close it when the checkout is finished.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accent_color` | string | no | The accent colour for buttons and highlights, as a hex value. |
| `amount` | number | no | The payment amount in the currency's smallest unit, such as cents. |
| `checkout_session_client_secret` | string | no | The client secret of a Stripe Checkout session created by your server. |
| `corner_radius` | number | no | How rounded the payment fields are, in points. |
| `country_code` | string | no | The two-letter country code of your business, used for wallet payments. |
| `currency` | string | no | The three-letter currency code of the payment, such as USD. |
| `customer_id` | string | no | The Stripe customer id of the signed-in user, to show their saved payment methods. |
| `ephemeral_key_secret` | string | no | A short-lived key your server made so the app may read this customer's saved methods. |
| `label` | string | no | The name shown on the wallet payment sheet, such as your business name. |
| `merchant_identifier` | string | no | Your Apple Pay merchant id, needed to show Apple Pay. |
| `payment_intent_client_secret` | string | no | The client secret of the payment intent your server created for this payment. |
| `publishable_key` | string | yes | Your Stripe publishable key, which is safe to ship in the app. |
| `setup_intent_client_secret` | string | no | The client secret of a setup intent, used to save a payment method without charging. |
| `theme` | string | no | The look of the payment screens: light, dark or automatic. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `session` | string | yes | The id of the session that was opened. |
| `status` | string | yes | The state of the session, such as open. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_open` | A Stripe session is already open. Close it before opening another. |  |
| `missing_param` | A required parameter is missing. | Not recoverable by retrying. |
| `not_configured` | No payment processor serves this build: add a processor package (payments.stripe) or set the payments `processor` config. | Not recoverable by retrying. |

**Example: opens a payment session the inline components bind to (served by the processor row)**

```js
const result = await dsx.module.payments.session({"payment_intent_client_secret":"pi_123_secret_abc","publishable_key":"pk_test_123"});
// resolves {"session":"sess_1","status":"ready"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `processor` | string | `` | Retired spelling of `provider`; still read as the same choice. Set `provider` instead. |
| `provider` | string | `` | Optional: which provider package takes payments (for example stripe). Empty means the one provider package this app includes. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | No payment provider package is in the app, so payment calls have nothing to answer them. | Add a provider package such as the Stripe one. |
| `provider_ambiguous` | The app has two payment providers and no setting says which one to use. | Set the provider in the package settings. |
| `unsupported_by_provider` | The chosen provider does not offer this call. | Use a call the provider supports or pick another provider. |
| `unsupported_provider` | The provider named in the settings is not part of this app. | Add that provider package or change the setting. |

## Related packages

- Used by: [Plaid](/packages/plaid), [Stripe](/packages/stripe), [TapToPay](/packages/taptopay), [Terminal](/packages/terminal)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
