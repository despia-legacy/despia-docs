---
title: Backend
description: The server side of Stripe: payments, checkout, Connect, Identity and Issuing.
package: backend
---

The server side of Stripe: payments, checkout, Connect, Identity and Issuing.

Runs on your own server and holds your Stripe secret key. It creates the payments, setup requests, checkout sessions, keys and links that the Stripe packages in your app need, and checks Stripe's webhooks before passing events to your workflows and to commerce. You supply your Stripe keys and your catalogue prices.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Add it whenever your app takes payments with Stripe, because the app must never hold the secret key. Skip it if you use another payment provider.

## Install

```sh
despia add Core/Payments/Modules/Stripe/Modules/Backend
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | no |
| web | no |
| macos | no |

## Actions

### account

`dsx.module.backend.account`

Creates a Stripe Connect account for the signed-in person, or returns the one they already have.

**When to use it.** Call it when a seller or provider on your platform starts onboarding.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `country` | string | no | Two letter country code of the account holder. |
| `email` | string | no | Email address to store on the account. |
| `request_id` | string | yes | A key you choose for this attempt; reuse it when retrying so Stripe returns the first object instead of creating another. |
| `type` | string | no | The kind of connected account: express, standard or custom. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `account` | string | yes | The Stripe connected account id. |
| `chargesEnabled` | boolean | yes | True when the account can take payments. |
| `detailsSubmitted` | boolean | yes | True when the account holder has finished the onboarding details. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The request is missing a required value or contains one Stripe refuses. | Read data for the field and Stripe's reason, fix the request, then call again. |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |

**Example: Create a Connect account**

```js
const result = await dsx.module.backend.account({"country":"AE","email":"seller@example.com","request_id":"acct-1","type":"express"});
// resolves {"account":"acct_1Example","chargesEnabled":false,"detailsSubmitted":false}
```

### accountLink

`dsx.module.backend.accountLink`

Creates a link to Stripe's hosted onboarding for a connected account.

**When to use it.** Open it after account to let the person submit their business details.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `account` | string | yes | The connected account id to onboard. |
| `refresh_url` | string | yes | Where to send the person if the link expired. |
| `return_url` | string | yes | Where to send the person when onboarding ends. |
| `type` | string | no | Link type: account_onboarding or account_update. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `expiresAt` | number | yes | When the link stops working, as a Unix time. |
| `url` | string | yes | The onboarding address to open. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The request is missing a required value or contains one Stripe refuses. | Read data for the field and Stripe's reason, fix the request, then call again. |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |
| `not_found` | There is no such object for the signed-in person. | Check the id; objects that belong to someone else look the same as missing ones. |

**Example: Create the onboarding link**

```js
const result = await dsx.module.backend.accountLink({"account":"acct_1Example","refresh_url":"https://app.example.com/onboarding/refresh","return_url":"https://app.example.com/onboarding/done","type":"account_onboarding"});
// resolves {"expiresAt":1760000300,"url":"https://connect.stripe.com/setup/e/acct_1Example/example"}
```

### accountSession

`dsx.module.backend.accountSession`

Creates a session for Stripe's embedded Connect components in your app.

**When to use it.** Use it when you show onboarding or payouts components inside your own screens instead of a Stripe page.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `account` | string | yes | The connected account id to show components for. |
| `components` | object | yes | Which embedded components to enable for this session. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `account` | string | yes | The connected account id the session is for. |
| `clientSecret` | string | yes | The secret the embedded components use. |
| `expiresAt` | number | yes | When the session stops working, as a Unix time. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The request is missing a required value or contains one Stripe refuses. | Read data for the field and Stripe's reason, fix the request, then call again. |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |
| `not_found` | There is no such object for the signed-in person. | Check the id; objects that belong to someone else look the same as missing ones. |

**Example: Create a session for embedded components**

```js
const result = await dsx.module.backend.accountSession({"account":"acct_1Example","components":{"payments":{"enabled":true}}});
// resolves {"account":"acct_1Example","clientSecret":"accs_secret_example","expiresAt":1760000300}
```

### checkoutSession

`dsx.module.backend.checkoutSession`

Creates a Stripe Checkout page or embedded checkout for something in your catalogue.

**When to use it.** Use it when you prefer Stripe's hosted or embedded checkout over the in-app payment sheet.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancel_url` | string | no | Where the person returns if they cancel, for hosted checkout. |
| `mode` | string | no | What the checkout creates: payment, subscription or setup. |
| `price` | string | yes | Product key or Stripe price id from your catalogue. |
| `quantity` | number | no | How many of the price to buy; defaults to 1. |
| `request_id` | string | yes | A key you choose for this attempt; reuse it when retrying so Stripe returns the first object instead of creating another. |
| `return_url` | string | no | Where the embedded checkout sends the person when it finishes. |
| `success_url` | string | no | Where the person returns after paying, for hosted checkout. |
| `ui_mode` | string | no | Whether Checkout opens on a Stripe page (hosted) or inside your page (embedded). |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `checkoutSession` | string | yes | The Stripe Checkout session id. |
| `clientSecret` | string | no | The secret that mounts an embedded checkout. |
| `mode` | string | yes | The mode the session was created in. |
| `url` | string | no | The address of the hosted checkout page to open. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The request is missing a required value or contains one Stripe refuses. | Read data for the field and Stripe's reason, fix the request, then call again. |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |

**Example: Create a hosted checkout page**

```js
const result = await dsx.module.backend.checkoutSession({"cancel_url":"https://app.example.com/cart","mode":"subscription","price":"pro-monthly","request_id":"checkout-1001","success_url":"https://app.example.com/thanks","ui_mode":"hosted"});
// resolves {"checkoutSession":"cs_test_Example1","mode":"subscription","url":"https://checkout.stripe.com/c/pay/cs_test_Example1"}
```

### customer

`dsx.module.backend.customer`

Finds or creates the Stripe customer for the signed-in person.

**When to use it.** Call it before saving cards or charging, when you need the person's customer id.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `email` | string | no | Email address to store on the customer if it is created. |
| `name` | string | no | Name to store on the customer if it is created. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `created` | boolean | yes | True when the customer was created by this call. |
| `customer` | string | yes | The Stripe customer id of the signed-in person. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |
| `unavailable` | Stripe could not be reached or is throttling requests. | Retry the same request with the same request_id after a short wait. |

**Example: Find or create the Stripe customer**

```js
const result = await dsx.module.backend.customer({"email":"ada@example.com","name":"Ada Lovelace"});
// resolves {"created":true,"customer":"cus_Example1"}
```

### drainStripeEvents

`dsx.module.backend.drainStripeEvents`

Passes each verified Stripe webhook event on to commerce and to your own workflows.

**When to use it.** Your server runs it every minute by itself; you do not call it.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `commerce` | string | yes | Whether the events were handed to commerce or commerce is absent. |
| `drained` | number | yes | How many events were taken from the queue. |
| `emitted` | number | yes | How many events were published to your workflows. |
| `failed` | number | no | How many events could not be handled and will be retried. |
| `ok` | boolean | yes | True when the run completed. |
| `queue` | string | yes | The name of the queue that was read. |

**Example: Hand the stored Stripe events to commerce and workflows**

```js
const result = await dsx.module.backend.drainStripeEvents({});
// resolves {"commerce":"handed","drained":4,"emitted":4,"ok":true,"queue":"stripe_events"}
```

### ephemeralKey

`dsx.module.backend.ephemeralKey`

Mints a short-lived key that lets the app read and manage the signed-in person's saved payment methods.

**When to use it.** Call it when the app opens the customer sheet or lists saved cards.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `api_version` | string | no | The API version of the Stripe app SDK, so the key you get works with it. |
| `request_id` | string | no | Optional key for this attempt; reuse it when retrying so Stripe returns the same result. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `customer` | string | yes | The Stripe customer id it belongs to. |
| `ephemeralKey` | string | yes | The short-lived key secret for the app. |
| `expires` | number | yes | When the key stops working, as a Unix time. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The request is missing a required value or contains one Stripe refuses. | Read data for the field and Stripe's reason, fix the request, then call again. |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |

**Example: Mint a key for the saved payment methods**

```js
const result = await dsx.module.backend.ephemeralKey({"api_version":"2025-01-27.acacia"});
// resolves {"customer":"cus_Example1","ephemeralKey":"ek_test_example","expires":1760003600}
```

### financialConnectionsSession

`dsx.module.backend.financialConnectionsSession`

Creates a session that lets the person link a bank account.

**When to use it.** Call it before opening the bank linking flow.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `permissions` | array | no | What you want to read from the account, such as balances or payment details. |
| `prefetch` | array | no | Account data to fetch right after linking. |
| `request_id` | string | no | A key you choose for this attempt; reuse it when retrying so Stripe returns the first object instead of creating another. |
| `return_url` | string | no | Where to return after the bank app, on mobile. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `clientSecret` | string | yes | The secret the app uses to open the linking flow. |
| `customer` | string | yes | The Stripe customer the linked account is saved to. |
| `financialConnectionsSession` | string | yes | The Stripe bank linking session id. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The request is missing a required value or contains one Stripe refuses. | Read data for the field and Stripe's reason, fix the request, then call again. |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |

**Example: Start linking a bank account**

```js
const result = await dsx.module.backend.financialConnectionsSession({"permissions":["balances","payment_method"],"request_id":"bank-1","return_url":"myapp://bank-linked"});
// resolves {"clientSecret":"fcsess_Example1_secret_example","customer":"cus_Example1","financialConnectionsSession":"fcsess_Example1"}
```

### identityResult

`dsx.module.backend.identityResult`

Reads the outcome of a verification session, never the document itself.

**When to use it.** Call it after the person finishes the flow to learn whether they were verified.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the verification session to read. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `error` | string | no | Why verification failed, when it did, without any document details. |
| `status` | string | yes | Where the verification stands, such as requires_input or verified. |
| `type` | string | yes | The kind of check: document or id_number. |
| `verificationSession` | string | yes | Identifier of the Stripe Identity check this answer describes. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_found` | There is no such object for the signed-in person. | Check the id; objects that belong to someone else look the same as missing ones. |

**Example: Read the outcome of a verification**

```js
const result = await dsx.module.backend.identityResult({"id":"vs_Example1"});
// resolves {"status":"verified","type":"document","verificationSession":"vs_Example1"}
```

### identitySession

`dsx.module.backend.identitySession`

Creates a Stripe Identity verification session to check a person's identity document.

**When to use it.** Call it before showing the verification flow.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `api_version` | string | no | The API version of the Stripe app SDK, so the key you get works with it. |
| `options` | object | no | Stripe Identity options such as which documents are accepted. |
| `platform` | string | no | Where the flow runs: ios, android or web; an ephemeral key is returned only for ios and android. |
| `request_id` | string | no | A key you choose for this attempt; reuse it when retrying so Stripe returns the first object instead of creating another. |
| `return_url` | string | no | Where the hosted flow sends the person when it finishes. |
| `type` | string | no | What to verify: document or id_number. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `clientSecret` | string | yes | The secret the flow uses to continue this session. |
| `ephemeralKey` | string | no | A short-lived key for the mobile verification SDK, on ios and android only. |
| `publishableKey` | string | no | The Stripe publishable key matching your secret key, when you configured one. |
| `url` | string | no | The address of the hosted verification page. |
| `verificationSession` | string | yes | The Stripe verification session id. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The request is missing a required value or contains one Stripe refuses. | Read data for the field and Stripe's reason, fix the request, then call again. |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |

**Example: Start a document check on iOS**

```js
const result = await dsx.module.backend.identitySession({"platform":"ios","request_id":"kyc-1","type":"document"});
// resolves {"clientSecret":"vs_Example1_secret_example","ephemeralKey":"ek_test_example","publishableKey":"pk_test_example","verificationSession":"vs_Example1"}
```

### issuingCard

`dsx.module.backend.issuingCard`

Reads a card's safe details: last four digits, brand, expiry, status and spending limits, never the number or code.

**When to use it.** Call it to draw a card on screen.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `card` | string | yes | The id of the Stripe card to read. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `card` | string | yes | The id of the Stripe card. |
| `details` | object | yes | Safe card details such as last four digits, brand, expiry, status and limits. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |
| `not_found` | There is no such object for the signed-in person. | Check the id; objects that belong to someone else look the same as missing ones. |

**Example: Read a card's safe details**

```js
const result = await dsx.module.backend.issuingCard({"card":"ic_1Example"});
// resolves {"card":"ic_1Example","details":{"brand":"visa","card":"ic_1Example","cardholder":"Ada Lovelace","exp_month":12,"exp_year":2028,"last4":"4242","livemode":false,"status":"active"}}
```

### issuingCreateCard

`dsx.module.backend.issuingCreateCard`

Issues an active virtual card to the signed-in person's cardholder.

**When to use it.** Call it after the cardholder exists, when self-serve cards are switched on.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cardholder` | string | yes | The cardholder id the card is issued to. |
| `currency` | string | no | Three letter currency code of the card. |
| `request_id` | string | yes | A key you choose for this attempt; reuse it when retrying so Stripe returns the first object instead of creating another. |
| `spending_limits` | array | no | Limits on how much the card may spend per interval; none asked means your ceiling per day. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `card` | string | yes | The id of the newly issued Stripe card. |
| `details` | object | yes | Safe card details such as last four digits, brand, expiry and limits. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The request is missing a required value or contains one Stripe refuses. | Read data for the field and Stripe's reason, fix the request, then call again. |
| `forbidden` | The request asks for more than your Issuing settings allow, such as a limit above the ceiling. | Ask for a lower limit or raise the spending ceiling in your settings. |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |
| `not_found` | There is no such object for the signed-in person. | Check the id; objects that belong to someone else look the same as missing ones. |

**Example: Issue a virtual card**

```js
const result = await dsx.module.backend.issuingCreateCard({"cardholder":"ich_1Example","currency":"usd","request_id":"card-1"});
// resolves {"card":"ic_1Example","details":{"brand":"visa","card":"ic_1Example","cardholder":"Ada Lovelace","exp_month":12,"exp_year":2028,"last4":"4242","livemode":false,"status":"active"}}
```

### issuingCreateCardholder

`dsx.module.backend.issuingCreateCardholder`

Creates the signed-in person's single Issuing cardholder, or returns the one they already have.

**When to use it.** Call it once before issuing the person a card, when self-serve cards are switched on.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accept_terms` | boolean | no | Set true to record that the person accepted the card terms. |
| `address` | object | yes | The cardholder's billing address. |
| `email` | string | no | The cardholder's email address. |
| `individual` | object | no | Personal details of the cardholder such as date of birth. |
| `name` | string | yes | The cardholder's full name. |
| `phone_number` | string | no | The cardholder's phone number. |
| `request_id` | string | no | Optional key for this attempt; reuse it when retrying so Stripe returns the same result. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cardholder` | string | yes | The Stripe cardholder id of the signed-in person. |
| `created` | boolean | yes | True when this call created the cardholder, false when it already existed. |
| `livemode` | boolean | yes | True for a real cardholder, false in Stripe test mode. |
| `name` | string | yes | The name the cardholder is registered under. |
| `status` | string | yes | Whether the cardholder is active, inactive or blocked. |
| `type` | string | yes | The kind of cardholder, such as individual. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The request is missing a required value or contains one Stripe refuses. | Read data for the field and Stripe's reason, fix the request, then call again. |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |

**Example: Create the cardholder**

```js
const result = await dsx.module.backend.issuingCreateCardholder({"accept_terms":true,"address":{"city":"Dubai","country":"AE","line1":"1 Main Street"},"email":"ada@example.com","name":"Ada Lovelace"});
// resolves {"cardholder":"ich_1Example","created":true,"livemode":false,"name":"Ada Lovelace","status":"active","type":"individual"}
```

### issuingEphemeralKey

`dsx.module.backend.issuingEphemeralKey`

Mints a key that lets the app show a virtual card's details or add it to a wallet.

**When to use it.** Call it when the person opens their card or taps add to wallet.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `api_version` | string | no | The API version of the Stripe app SDK, so the key you get works with it. |
| `card` | string | yes | The id of the Stripe card to show. |
| `nonce` | string | no | A one-time value from the wallet provisioning step. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `card` | string | yes | The id of the Stripe card the key is for. |
| `details` | object | yes | Safe card details such as last four digits, brand, expiry and status. |
| `ephemeralKey` | string | yes | The short-lived key secret for the app. |
| `expires` | number | yes | When the key stops working, as a Unix time. |
| `key` | object | yes | The full key object the wallet provisioning kits redeem. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |
| `not_found` | There is no such object for the signed-in person. | Check the id; objects that belong to someone else look the same as missing ones. |

**Example: Mint a key to show a card**

```js
const result = await dsx.module.backend.issuingEphemeralKey({"api_version":"2025-01-27.acacia","card":"ic_1Example"});
// resolves {"card":"ic_1Example","details":{"brand":"visa","card":"ic_1Example","exp_month":12,"exp_year":2028,"last4":"4242","status":"active"},"ephemeralKey":"ek_test_example","expires":1760003600,"key":{"id":"ephkey_Example1","object":"ephemeral_key"}}
```

### issuingSpendingControls

`dsx.module.backend.issuingSpendingControls`

Changes the spending limits of a card this service issued.

**When to use it.** Call it when the person adjusts their card limits within your ceiling.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `card` | string | yes | The Stripe card id to change. |
| `request_id` | string | no | Optional key for this attempt; reuse it when retrying so Stripe returns the same result. |
| `spending_limits` | array | yes | The new limits, each below your spending ceiling. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `card` | string | yes | The id of the Stripe card that was changed. |
| `details` | object | yes | Safe card details including the new limits. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The request is missing a required value or contains one Stripe refuses. | Read data for the field and Stripe's reason, fix the request, then call again. |
| `forbidden` | The request asks for more than your Issuing settings allow, such as a limit above the ceiling. | Ask for a lower limit or raise the spending ceiling in your settings. |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |
| `not_found` | There is no such object for the signed-in person. | Check the id; objects that belong to someone else look the same as missing ones. |

**Example: Lower the daily limit**

```js
const result = await dsx.module.backend.issuingSpendingControls({"card":"ic_1Example","spending_limits":[{"amount":50000,"interval":"daily"}]});
// resolves {"card":"ic_1Example","details":{"brand":"visa","card":"ic_1Example","cardholder":"Ada Lovelace","exp_month":12,"exp_year":2028,"last4":"4242","livemode":false,"status":"active"}}
```

### paymentIntent

`dsx.module.backend.paymentIntent`

Creates a payment for the signed-in person and returns what the app needs to open the payment sheet.

**When to use it.** Call it when the person is about to pay for something from your catalogue.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `amount` | number | no | Amount in the smallest currency unit; accepted only when custom amounts are switched on. |
| `api_version` | string | no | The API version of the Stripe app SDK, so the key you get works with it. |
| `capture_method` | string | no | Whether to charge at once (automatic) or only hold the money to capture later (manual). |
| `currency` | string | no | Three letter currency code for a custom amount. |
| `metadata` | object | no | Extra values to store on the payment. |
| `payment_method_types` | array | no | Limit which payment methods the sheet offers. |
| `price` | string | no | Product key or Stripe price id from your catalogue; the amount and currency come from it. |
| `quantity` | number | no | How many of the price to charge for; defaults to 1. |
| `request_id` | string | yes | A key you choose for this attempt; reuse it when retrying so Stripe returns the first object instead of creating another. |
| `setup_future_usage` | string | no | Set to save the payment method for later payments. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `amount` | number | yes | The amount to be charged in the smallest currency unit. |
| `clientSecret` | string | yes | The secret the app uses to complete this payment; give it only to the signed-in person. |
| `currency` | string | yes | The three letter currency code of the payment. |
| `customer` | string | yes | The Stripe customer id paying. |
| `ephemeralKey` | string | yes | A short-lived key that lets the app show the customer's saved methods. |
| `paymentIntent` | string | yes | The id of the Stripe payment that was created. |
| `publishableKey` | string | no | The Stripe publishable key matching your secret key, when you configured one. |
| `status` | string | yes | Where the payment stands, such as requires_payment_method. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The request is missing a required value or contains one Stripe refuses. | Read data for the field and Stripe's reason, fix the request, then call again. |
| `conflict` | This request_id was already used with different parameters. | Use a new request_id for a new attempt, and reuse the old one only to retry the identical request. |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |
| `unavailable` | Stripe could not be reached or is throttling requests. | Retry the same request with the same request_id after a short wait. |

**Example: Create a payment for a catalogue price**

```js
const result = await dsx.module.backend.paymentIntent({"price":"pro-monthly","quantity":1,"request_id":"order-1001"});
// resolves {"amount":1999,"clientSecret":"pi_3Example1_secret_example","currency":"usd","customer":"cus_Example1","ephemeralKey":"ek_test_example","paymentIntent":"pi_3Example1","publishableKey":"pk_test_example","status":"requires_payment_method"}
```

### portalSession

`dsx.module.backend.portalSession`

Creates a link to Stripe's Customer Portal where the person manages subscriptions and payment methods.

**When to use it.** Call it from a manage billing button.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `request_id` | string | no | Optional key for this attempt; reuse it when retrying so Stripe returns the same result. |
| `return_url` | string | yes | Where the portal sends the person when they are done. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `portalSession` | string | yes | The Stripe portal session id. |
| `url` | string | yes | The address of the portal page to open. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The request is missing a required value or contains one Stripe refuses. | Read data for the field and Stripe's reason, fix the request, then call again. |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |

**Example: Open the customer portal**

```js
const result = await dsx.module.backend.portalSession({"return_url":"https://app.example.com/account"});
// resolves {"portalSession":"bps_Example1","url":"https://billing.stripe.com/p/session/example"}
```

### setupIntent

`dsx.module.backend.setupIntent`

Creates a request to save a payment method for later and returns what the app needs to show the card form.

**When to use it.** Call it when the person adds a card without paying now.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `api_version` | string | no | The API version of the Stripe app SDK, so the key you get works with it. |
| `payment_method_types` | array | no | Limit which payment methods can be saved. |
| `request_id` | string | yes | A key you choose for this attempt; reuse it when retrying so Stripe returns the first object instead of creating another. |
| `usage` | string | no | Whether the saved method will be used on_session or off_session. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `clientSecret` | string | yes | The secret the app uses to finish saving the method. |
| `customer` | string | yes | The Stripe customer id the method is saved to. |
| `ephemeralKey` | string | yes | A short-lived key that lets the app show the customer's saved methods. |
| `publishableKey` | string | no | The Stripe publishable key matching your secret key, when you configured one. |
| `setupIntent` | string | yes | The id of the Stripe setup request that was created. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The request is missing a required value or contains one Stripe refuses. | Read data for the field and Stripe's reason, fix the request, then call again. |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |
| `unavailable` | Stripe could not be reached or is throttling requests. | Retry the same request with the same request_id after a short wait. |

**Example: Save a card for later**

```js
const result = await dsx.module.backend.setupIntent({"request_id":"setup-1001","usage":"off_session"});
// resolves {"clientSecret":"seti_1Example1_secret_example","customer":"cus_Example1","ephemeralKey":"ek_test_example","publishableKey":"pk_test_example","setupIntent":"seti_1Example1"}
```

### terminalLocation

`dsx.module.backend.terminalLocation`

Creates a Terminal location, the place where card readers are registered.

**When to use it.** Call it once per physical shop before registering a reader.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `address` | object | yes | Postal address of the location. |
| `display_name` | string | yes | Name of the location as shown in the Stripe Dashboard. |
| `request_id` | string | yes | A key you choose for this attempt; reuse it when retrying so Stripe returns the first object instead of creating another. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `displayName` | string | yes | The name the location was saved with. |
| `location` | string | yes | The id of the Terminal location that was created. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The request is missing a required value or contains one Stripe refuses. | Read data for the field and Stripe's reason, fix the request, then call again. |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |

**Example: Create a store location for card readers**

```js
const result = await dsx.module.backend.terminalLocation({"address":{"city":"Dubai","country":"AE","line1":"1 Main Street"},"display_name":"Main street store","request_id":"loc-1"});
// resolves {"displayName":"Main street store","location":"tml_Example1"}
```

### terminalToken

`dsx.module.backend.terminalToken`

Mints a connection token for the Stripe Terminal reader software.

**When to use it.** Point the Terminal configuration at this route so the app can connect to card readers.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `location` | string | no | Optional Terminal location the token is limited to. |
| `request_id` | string | no | Optional key for this attempt; reuse it when retrying so Stripe returns the same result. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `secret` | string | yes | The connection token secret the reader software uses. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The request is missing a required value or contains one Stripe refuses. | Read data for the field and Stripe's reason, fix the request, then call again. |
| `not_configured` | A Stripe setting or product this call needs is not set up in your deployment. | Set the Stripe key in your deployment settings, or enable the named Stripe product on your Stripe account. |

**Example: Mint a Terminal connection token**

```js
const result = await dsx.module.backend.terminalToken({"location":"tml_Example1"});
// resolves {"secret":"pst_test_example"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `custom_amounts` | boolean | `false` | Let paymentIntent take an amount and currency from the app instead of a catalogue price. Turn on only for point of sale, tips and donations. |
| `issuing_self_serve` | boolean | `false` | Let a signed in person create their Issuing cardholder and a virtual card, and set its spending limits within the ceiling below. Off, those routes answer not_configured. |
| `issuing_spending_limit` | number | `10000` | The most a self-issued card may spend per limit interval, in the card currency's smallest unit (10000 is 100.00 USD). A card with no limit asked gets this per day. |
| `publishable_key` | string | `` | Returned beside a PaymentIntent or SetupIntent so the app opens the sheet with the key that matches the secret key. Optional. |
| `secret_key` | secret | `` | The secret key from your Stripe Dashboard (Developers, API keys). Test mode keys start with sk_test_. |
| `webhook_secret` | secret | `` | The signing secret of the Stripe webhook endpoint that points at /webhooks/stripe on your backend (whsec_…). |

## Related packages

- Needs: payments.stripe

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
