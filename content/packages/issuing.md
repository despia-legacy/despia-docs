---
title: Stripe Issuing
description: Let people add your Stripe-issued cards to Apple Wallet or Google Wallet.
package: issuing
---

Let people add your Stripe-issued cards to Apple Wallet or Google Wallet.

Adds an Add to Wallet button that only shows when the card and the device can take it, and shows the card number safely on the web inside Stripe's own display. Works with the Stripe package. Needs Stripe Issuing, your publishable key and server routes for card details and keys. Apple Wallet needs Apple's approval for your app; Google needs access to its TapAndPay SDK.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it if you issue cards with Stripe Issuing and want cardholders to add them to Apple Wallet or Google Wallet, or see their card number safely on the web. If you only take payments, you do not need it.

## What native adds

Adding a card to the phone's wallet uses Apple's and Google's own sheets and secure element, which only a native app can reach.

## Install

```sh
despia add Core/Payments/Modules/Stripe/Modules/Issuing
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone, desktop.

## Actions

### canProvision

`dsx.module.issuing.canProvision`

Checks whether this card may be added to this phone's wallet right now. A no is a normal answer, not an error, and Apple requires the check before showing an add button.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `authorization` | string | no | The Authorization header value to send to your server, such as a bearer token. |
| `card` | string | yes | The id of the Stripe Issuing card, such as ic_123. |
| `endpoint` | string | no | Overrides the card details server address for this call. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAdd` | boolean | yes | True when the card can be added to this device's wallet. |
| `detail` | string | no | More explanation when the system gives one. |
| `reason` | string | yes | Why the answer is what it is, such as needs_identity_verification. |
| `wallet` | string | yes | Which wallet applies, apple or google. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `backend_not_configured` | Your backend is not configured (data.what names what is missing). | Not recoverable by retrying. |
| `card_not_found` | The card does not exist or is not the signed-in cardholder's. | Not recoverable by retrying. |
| `card_unavailable` | Your endpoint did not answer with the card's facts. |  |
| `endpoint_rejected` | Your endpoint refused this request (401 or 403). | Not recoverable by retrying. |
| `invalid_authorization` | The Authorization value must be one line. | Not recoverable by retrying. |
| `invalid_card` | An Issuing card id is ic_... | Not recoverable by retrying. |
| `invalid_endpoint` | The endpoint must be https, or http to a local development host. | Not recoverable by retrying. |
| `issuing_not_enabled` | Issuing is not set up on this Stripe account. | Not recoverable by retrying. |
| `missing_endpoint` | Set config card_endpoint (payments.stripe.backend issuingCard) or pass endpoint. | Not recoverable by retrying. |
| `missing_param` | Pass the Issuing card id (card: "ic_..."). | Not recoverable by retrying. |
| `secret_key_refused` | A Stripe secret or restricted key never ships in an app; keep it on your server. | Not recoverable by retrying. |
| `unsupported_platform` | Wallet push provisioning runs on iOS and Android only, and on Android only in a build carrying Google's customer-supplied TapAndPay SDK (data.what names com.google.android.gms:play-services-tapandpay). | Not recoverable by retrying. |

**Example: Check that a card can be added to the wallet**

```js
const result = await dsx.module.issuing.canProvision({"card":"ic_1Example"});
// resolves {"canAdd":true,"reason":"eligible","wallet":"apple"}
```

### provision

`dsx.module.issuing.provision`

Adds the card to Apple Wallet or Google Wallet using the system's own sheet. Your server provides a short-lived key for the card first.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `authorization` | string | no | The Authorization header value to send to your server, such as a bearer token. |
| `card` | string | yes | The id of the Stripe Issuing card, such as ic_123. |
| `description` | string | no | The card description shown in the wallet. |
| `endpoint` | string | no | Overrides the card details server address for this call. |
| `name` | string | no | The cardholder name shown on the card in the wallet. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `card` | string | yes | The id of the card that was processed. |
| `status` | string | yes | How the add ended, such as added or cancelled. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_in_wallet` | This card is already added to the wallet on this device. | Tell the person the card is already in their wallet instead of offering to add it again. |
| `backend_not_configured` | Your backend is not configured (data.what names what is missing). | Not recoverable by retrying. |
| `busy` | A wallet sheet is already open. |  |
| `card_inactive` | The card is not active. | Not recoverable by retrying. |
| `card_not_found` | The card does not exist or is not the signed-in cardholder's. | Not recoverable by retrying. |
| `endpoint_rejected` | Your endpoint refused this request (401 or 403). | Not recoverable by retrying. |
| `invalid_authorization` | The Authorization value must be one line. | Not recoverable by retrying. |
| `invalid_card` | An Issuing card id is ic_... | Not recoverable by retrying. |
| `invalid_endpoint` | The endpoint must be https, or http to a local development host. | Not recoverable by retrying. |
| `issuing_not_enabled` | Issuing is not set up on this Stripe account. | Not recoverable by retrying. |
| `key_unavailable` | Your endpoint did not answer with an ephemeral key for the card. |  |
| `missing_endpoint` | Set config key_endpoint (payments.stripe.backend issuingEphemeralKey) or pass endpoint. | Not recoverable by retrying. |
| `missing_param` | Pass the Issuing card id (card: "ic_..."). | Not recoverable by retrying. |
| `no_active_wallet` | Google Wallet is not set up on this device. |  |
| `no_presenter` | Couldn't find a screen to present the wallet sheet. | Not recoverable by retrying. |
| `not_eligible` | Stripe says this card cannot be added to this wallet (data.detail is Stripe's reason). | Not recoverable by retrying. |
| `not_ready` | The wallet sheet is not ready yet. Please try again in a moment. |  |
| `provisioning_failed` | The wallet could not add the card (data.vendor is the wallet's own code). |  |
| `secret_key_refused` | A Stripe secret or restricted key never ships in an app; keep it on your server. | Not recoverable by retrying. |
| `test_card` | Google Wallet cannot add a test-mode card. | Not recoverable by retrying. |
| `unsupported_platform` | Wallet push provisioning runs on iOS and Android only, and on Android only in a build carrying Google's customer-supplied TapAndPay SDK (data.what names com.google.android.gms:play-services-tapandpay). | Not recoverable by retrying. |
| `wallet_unavailable` | This device's wallet cannot add payment cards. | Not recoverable by retrying. |

**Example: Add a card to the wallet**

```js
const result = await dsx.module.issuing.provision({"card":"ic_1Example","endpoint":"https://api.example.com/card-key","name":"Ada Lovelace"});
// resolves {"card":"ic_1Example","status":"added"}
```

### showCard

`dsx.module.issuing.showCard`

Shows the card number, expiry and security code on the web inside Stripe's own secure display, so the number never reaches your app.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `authorization` | string | no | The Authorization header value to send to your server, such as a bearer token. |
| `card` | string | yes | The id of the Stripe Issuing card, such as ic_123. |
| `copy` | string | no | Which details get a copy button. |
| `endpoint` | string | no | Overrides the card details server address for this call. |
| `fields` | string | no | Which card details to show, for example number, expiry and cvc. |
| `publishable_key` | string | no | Your Stripe publishable key, if you do not set it in the settings. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `card` | string | yes | The id of the card that was shown. |
| `status` | string | yes | How the display ended, such as closed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `backend_not_configured` | Your backend is not configured (data.what names what is missing). | Not recoverable by retrying. |
| `busy` | The card sheet is already open. |  |
| `card_not_found` | The card does not exist or is not the signed-in cardholder's. | Not recoverable by retrying. |
| `endpoint_rejected` | Your endpoint refused this request (401 or 403). | Not recoverable by retrying. |
| `invalid_authorization` | The Authorization value must be one line. | Not recoverable by retrying. |
| `invalid_card` | An Issuing card id is ic_... | Not recoverable by retrying. |
| `invalid_endpoint` | The endpoint must be https, or http to a local development host. | Not recoverable by retrying. |
| `invalid_fields` | fields are number, expiry, cvc and pin; copy names shown fields only. | Not recoverable by retrying. |
| `invalid_publishable_key` | A publishable key is pk_test_... or pk_live_... | Not recoverable by retrying. |
| `issuing_not_enabled` | Issuing is not set up on this Stripe account. | Not recoverable by retrying. |
| `key_unavailable` | Your endpoint did not answer with an ephemeral key for the card. |  |
| `missing_endpoint` | Set config key_endpoint (payments.stripe.backend issuingEphemeralKey) or pass endpoint. | Not recoverable by retrying. |
| `missing_param` | Pass the Issuing card id (card: "ic_..."). | Not recoverable by retrying. |
| `missing_publishable_key` | Stripe.js needs your publishable key: pass publishable_key or set config publishable_key. | Not recoverable by retrying. |
| `not_ready` | Stripe.js could not be loaded. Please try again in a moment. |  |
| `secret_key_refused` | A Stripe secret or restricted key never ships in an app; keep it on your server. | Not recoverable by retrying. |
| `unsupported_platform` | The card display runs on the web only (Stripe ships no native card-details view). | Not recoverable by retrying. |

**Example: Show the card details in Stripe's secure display**

```js
const result = await dsx.module.issuing.showCard({"card":"ic_1Example","endpoint":"https://api.example.com/card-key","fields":"number expiry cvc"});
// resolves {"card":"ic_1Example","status":"closed"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `card_endpoint` | string | `` | Your server's URL that answers the signed-in cardholder's Issuing card facts: POST { "card": "ic_..." } answered { "card", "details": { last4, brand, exp_month, exp_year, status, livemode, cardholder, wallets } } (payments.stripe.backend issuingCard). Never the card number. |
| `key_endpoint` | string | `` | Your server's URL that mints an Issuing ephemeral key for the signed-in cardholder's card: POST { "card", "api_version", "nonce"? } answered { "ephemeralKey": "ek_...", "key": { the raw Stripe object }, "details": { ... } } (payments.stripe.backend issuingEphemeralKey). |
| `payment_pass_provisioning` | boolean | `false` | Turn on once Apple has granted this app com.apple.developer.payment-pass-provisioning (you request it through Stripe). Off, the app never claims the entitlement, and test-mode cards use Stripe's test controller. |
| `publishable_key` | string | `` | pk_test_... or pk_live_..., used by Stripe.js for the card display on the web. Never a secret key. |
| `tapandpay_aar` | string | `` | Android only. The path, inside your app project, of Google's TapAndPay SDK AAR (play-services-tapandpay 18.8.0 or later), which Google gives card issuers under its push provisioning agreement. Empty: Google Wallet provisioning answers unsupported_platform. |
| `tapandpay_sha256` | string | `` | The SHA-256 (64 hex characters) of the AAR named in tapandpay_aar, as you received it from Google. The export refuses a file whose digest differs. |

## Related packages

- Needs: payments.stripe

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
