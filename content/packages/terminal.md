---
title: Stripe Terminal
description: Take in-person card payments with Stripe card readers.
package: terminal
---

Take in-person card payments with Stripe card readers.

Finds and connects Bluetooth, internet, USB (Android) or phone-based readers, then collects, confirms and refunds payments your server created. Use it for point of sale and shop counters. Works with the Payments package. Needs a Stripe account, a Stripe location for the reader, and a server endpoint that issues connection tokens.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it for in-person card payments with a Stripe card reader, such as a shop counter or a pop-up stand. For payments inside the app with no reader, use the Payments package instead.

## What native adds

Bluetooth and USB readers and Tap to Pay on the phone need Stripe's native reader software and system permissions, which a web page cannot reach.

## Install

```sh
despia add Core/Payments/Modules/Terminal
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

### cancel

`dsx.module.terminal.cancel`

Cancels whatever is in progress on the reader: discovery, a payment, a refund, a form or an update.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the operation was cancelled. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | No connection token endpoint: set config token_endpoint or call terminal.configure. | Not recoverable by retrying. |
| `sdk_error` | Stripe's reader software reported a failure that has no more specific code. | Try again, and if it keeps happening check the reader and your Stripe account. |
| `unsupported_country` | Stripe does not allow this reader, location or currency in that country (for example Tap to Pay on a location in a country Stripe has not launched it in, or a card_present currency the account's country refuses). Register the reader to a location in a supported country, or charge in a supported currency. | Not recoverable by retrying. |
| `unsupported_platform` | Stripe Terminal has no SDK on this platform. | Not recoverable by retrying. |

**Example: Cancel what the reader is doing**

```js
const result = await dsx.module.terminal.cancel({});
// resolves {"ok":true}
```

### clearDisplay

`dsx.module.terminal.clearDisplay`

Returns a smart reader's screen to its splash screen.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the screen was cleared. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `canceled` | The operation was cancelled before it finished, by the person or by a cancel call. | Treat it as a normal outcome and let the person start again if they want. |
| `feature_unavailable` | The connected reader or this Stripe account does not offer this. | Not recoverable by retrying. |
| `invalid_simulator` | simulator is { card?, tip?, update?, offline?, inputs? }. | Not recoverable by retrying. |
| `network_unavailable` | Stripe could not be reached. |  |
| `not_configured` | No connection token endpoint: set config token_endpoint or call terminal.configure. | Not recoverable by retrying. |
| `not_connected` | No reader is connected, so there is nothing to talk to. | Call discover and connect first, then retry. |
| `reader_busy` | The reader is busy or in use by another device. |  |
| `sdk_error` | Stripe's reader software reported a failure that has no more specific code. | Try again, and if it keeps happening check the reader and your Stripe account. |
| `session_expired` | The Terminal session expired; connect again. |  |
| `unsupported_country` | Stripe does not allow this reader, location or currency in that country (for example Tap to Pay on a location in a country Stripe has not launched it in, or a card_present currency the account's country refuses). Register the reader to a location in a supported country, or charge in a supported currency. | Not recoverable by retrying. |
| `unsupported_platform` | Stripe Terminal has no SDK on this platform, or the browser SDK cannot do this (it creates no PaymentIntent and has no offline mode or simulated update). | Not recoverable by retrying. |

**Example: Return the reader to its splash screen**

```js
const result = await dsx.module.terminal.clearDisplay({});
// resolves {"ok":true}
```

### collect

`dsx.module.terminal.collect`

Takes one in-person payment on the connected reader. Pass a PaymentIntent your server made, or an amount and currency to create one on the device, which offline payments need.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `amount` | int | no | The amount to charge in the currency's smallest unit, used when no clientSecret is given. |
| `clientSecret` | string | no | The client secret of a PaymentIntent created by your server. |
| `confirm` | boolean | no | Set false to stop after the card is read so you can review before charging, then call confirm. |
| `currency` | string | no | The three-letter currency code, used with amount. |
| `offline` | string | no | What to do without a network: require_online, prefer_online or force_offline. |
| `simulator` | object | no | Test settings for a simulated reader, such as a test card, tip, update state or form outcome. Use it only in Stripe test mode. |
| `skipTipping` | boolean | no | Set true to skip the tip screen. |
| `tip` | object | no | Asks for a tip on smart readers; eligibleAmount is the part of the amount the tip is based on. |
| `updatePaymentIntent` | boolean | no | Set true to update the PaymentIntent with the collected details on the server side. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `amount` | number | yes | The amount charged in the currency's smallest unit. |
| `card` | object | yes | Details of the card that was used, such as its brand and last four digits. |
| `charge` | string | yes | The Stripe charge id, which you need to refund in person. |
| `currency` | string | yes | The three-letter currency code of the payment. |
| `id` | string | yes | The Stripe id of the PaymentIntent that was taken. |
| `offline` | boolean | yes | True when the payment was taken offline and is waiting to be forwarded. |
| `status` | string | yes | The PaymentIntent status after the step, such as succeeded or requires_confirmation. |
| `tip` | number | yes | The tip included in the amount, in the smallest unit. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `canceled` | The operation was cancelled before it finished, by the person or by a cancel call. | Treat it as a normal outcome and let the person start again if they want. |
| `card_error` | The card could not be read. |  |
| `conflicting_intent` | Pass clientSecret or amount and currency, not both. | Not recoverable by retrying. |
| `declined` | The card was declined by the bank or card network. | Ask the customer to try another card or payment method. |
| `feature_unavailable` | The connected reader or this Stripe account does not offer this. | Not recoverable by retrying. |
| `invalid_amount` | An amount is a positive whole number in the currency's smallest unit. | Not recoverable by retrying. |
| `invalid_client_secret` | That is not a PaymentIntent client secret (pi_..._secret_...). | Not recoverable by retrying. |
| `invalid_currency` | A currency is a three-letter ISO code. | Not recoverable by retrying. |
| `invalid_offline` | offline is require_online, prefer_online or force_offline. | Not recoverable by retrying. |
| `invalid_param` | An argument has the wrong type. | Not recoverable by retrying. |
| `invalid_simulator` | simulator is { card?, tip?, update?, offline?, inputs? }. | Not recoverable by retrying. |
| `invalid_tip` | tip is { eligibleAmount }, a whole number of the smallest unit. | Not recoverable by retrying. |
| `missing_param` | Pass clientSecret, or amount and currency. | Not recoverable by retrying. |
| `network_unavailable` | Stripe could not be reached. |  |
| `not_configured` | No connection token endpoint: set config token_endpoint or call terminal.configure. | Not recoverable by retrying. |
| `not_connected` | No reader is connected, so there is nothing to talk to. | Call discover and connect first, then retry. |
| `nothing_collected` | Nothing is collected: call collect with confirm false first. |  |
| `offline_needs_amount` | An offline-capable payment is created on the device: pass amount and currency, not clientSecret. | Not recoverable by retrying. |
| `offline_unavailable` | Offline mode cannot take this payment (not enabled, over its limit, or the card or currency is not accepted offline). |  |
| `reader_busy` | The reader is busy or in use by another device. |  |
| `sdk_error` | Stripe's reader software reported a failure that has no more specific code. | Try again, and if it keeps happening check the reader and your Stripe account. |
| `session_expired` | The Terminal session expired; connect again. |  |
| `unsupported_country` | Stripe does not allow this reader, location or currency in that country (for example Tap to Pay on a location in a country Stripe has not launched it in, or a card_present currency the account's country refuses). Register the reader to a location in a supported country, or charge in a supported currency. | Not recoverable by retrying. |
| `unsupported_platform` | Stripe Terminal has no SDK on this platform, or the browser SDK cannot do this (it creates no PaymentIntent and has no offline mode or simulated update). | Not recoverable by retrying. |

**Example: Take a 19.99 payment**

```js
const result = await dsx.module.terminal.collect({"amount":1999,"currency":"usd"});
// resolves {"amount":1999,"card":{"brand":"visa","last4":"4242"},"charge":"ch_3Nxample","currency":"usd","id":"pi_3Nxample","offline":false,"status":"succeeded","tip":0}
```

### collectInputs

`dsx.module.terminal.collectInputs`

Shows forms on a smart reader and collects what the customer enters, such as a signature, email, phone number or a choice.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `inputs` | array | yes | The forms to show, each with a type, a title and optional text, choices and toggles. |
| `simulator` | object | no | Test settings for a simulated reader, such as a test card, tip, update state or form outcome. Use it only in Stripe test mode. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `results` | array | yes | One result per form with its type, whether it was skipped, the value entered and any toggles. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `canceled` | The operation was cancelled before it finished, by the person or by a cancel call. | Treat it as a normal outcome and let the person start again if they want. |
| `feature_unavailable` | The connected reader or this Stripe account does not offer this. | Not recoverable by retrying. |
| `inputs_timed_out` | The customer left the form. |  |
| `invalid_inputs` | inputs is a list of forms: { type, title, required?, description?, submitText?, skipText?, choices?, toggles? }. | Not recoverable by retrying. |
| `invalid_simulator` | simulator is { card?, tip?, update?, offline?, inputs? }. | Not recoverable by retrying. |
| `network_unavailable` | Stripe could not be reached. |  |
| `not_configured` | No connection token endpoint: set config token_endpoint or call terminal.configure. | Not recoverable by retrying. |
| `not_connected` | No reader is connected, so there is nothing to talk to. | Call discover and connect first, then retry. |
| `reader_busy` | The reader is busy or in use by another device. |  |
| `sdk_error` | Stripe's reader software reported a failure that has no more specific code. | Try again, and if it keeps happening check the reader and your Stripe account. |
| `session_expired` | The Terminal session expired; connect again. |  |
| `unsupported_country` | Stripe does not allow this reader, location or currency in that country (for example Tap to Pay on a location in a country Stripe has not launched it in, or a card_present currency the account's country refuses). Register the reader to a location in a supported country, or charge in a supported currency. | Not recoverable by retrying. |
| `unsupported_platform` | Stripe Terminal has no SDK on this platform, or the browser SDK cannot do this (it creates no PaymentIntent and has no offline mode or simulated update). | Not recoverable by retrying. |

**Example: Ask the customer for an email address**

```js
const result = await dsx.module.terminal.collectInputs({"inputs":[{"required":false,"title":"Email a receipt?","type":"email"}]});
// resolves {"results":[{"skipped":false,"type":"email","value":"ada@example.com"}]}
```

### collectSetup

`dsx.module.terminal.collectSetup`

Saves the card presented on the reader for later use, with the cardholder's consent. Your server creates the SetupIntent first.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `allowRedisplay` | string | no | Whether the saved card may be shown again at checkout: always or limited. |
| `clientSecret` | string | yes | The client secret of a SetupIntent your server created for card_present payments. |
| `confirm` | boolean | no | Set false to stop after the card is read and confirm later. |
| `simulator` | object | no | Test settings for a simulated reader, such as a test card, tip, update state or form outcome. Use it only in Stripe test mode. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The Stripe id of the SetupIntent that was saved. |
| `paymentMethod` | string | yes | The id of the saved payment method. |
| `status` | string | yes | The SetupIntent status after the step. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `canceled` | The operation was cancelled before it finished, by the person or by a cancel call. | Treat it as a normal outcome and let the person start again if they want. |
| `card_error` | The card could not be read. |  |
| `consent_required` | Saving a card needs the cardholder's consent: allowRedisplay always or limited. | Not recoverable by retrying. |
| `declined` | The card was declined by the bank or card network. | Ask the customer to try another card or payment method. |
| `feature_unavailable` | The connected reader or this Stripe account does not offer this. | Not recoverable by retrying. |
| `invalid_client_secret` | That is not a SetupIntent client secret (seti_..._secret_...). | Not recoverable by retrying. |
| `invalid_param` | An argument has the wrong type. | Not recoverable by retrying. |
| `invalid_simulator` | simulator is { card?, tip?, update?, offline?, inputs? }. | Not recoverable by retrying. |
| `network_unavailable` | Stripe could not be reached. |  |
| `not_configured` | No connection token endpoint: set config token_endpoint or call terminal.configure. | Not recoverable by retrying. |
| `not_connected` | No reader is connected, so there is nothing to talk to. | Call discover and connect first, then retry. |
| `reader_busy` | The reader is busy or in use by another device. |  |
| `sdk_error` | Stripe's reader software reported a failure that has no more specific code. | Try again, and if it keeps happening check the reader and your Stripe account. |
| `session_expired` | The Terminal session expired; connect again. |  |
| `unsupported_country` | Stripe does not allow this reader, location or currency in that country (for example Tap to Pay on a location in a country Stripe has not launched it in, or a card_present currency the account's country refuses). Register the reader to a location in a supported country, or charge in a supported currency. | Not recoverable by retrying. |
| `unsupported_platform` | Stripe Terminal has no SDK on this platform, or the browser SDK cannot do this (it creates no PaymentIntent and has no offline mode or simulated update). | Not recoverable by retrying. |

**Example: Save the card on the reader for later**

```js
const result = await dsx.module.terminal.collectSetup({"allowRedisplay":"always","clientSecret":"seti_1Nxample_secret_Nxample"});
// resolves {"id":"seti_1Nxample","paymentMethod":"pm_1Nxample","status":"succeeded"}
```

### configure

`dsx.module.terminal.configure`

Sets the address of your connection token server and the Authorization header to send to it while the app runs. Call it before the first reader call, for example once the person has signed in.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `authorization` | string | no | The value of the Authorization header to send to your token route, such as a bearer token. |
| `endpoint` | string | no | The https address of your server route that returns a Stripe Terminal connection token. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the settings were applied. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_authorization` | The Authorization value must be one line. | Not recoverable by retrying. |
| `invalid_endpoint` | The token endpoint must be https, or http to a local development host. | Not recoverable by retrying. |
| `not_configured` | No connection token endpoint: set config token_endpoint or call terminal.configure. | Not recoverable by retrying. |
| `unsupported_platform` | Stripe Terminal has no SDK on this platform. | Not recoverable by retrying. |

**Example: Point the package at your token server**

```js
const result = await dsx.module.terminal.configure({"authorization":"Bearer example-session-token","endpoint":"https://api.example.com/terminal/token"});
// resolves {"ok":true}
```

### confirm

`dsx.module.terminal.confirm`

Finishes a payment that collect left waiting, after you have reviewed the card and tip.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `amount` | number | yes | The amount charged in the currency's smallest unit. |
| `card` | object | yes | Details of the card that was used, such as its brand and last four digits. |
| `charge` | string | yes | The Stripe charge id, which you need to refund in person. |
| `currency` | string | yes | The three-letter currency code of the payment. |
| `id` | string | yes | The Stripe id of the PaymentIntent that was confirmed. |
| `offline` | boolean | yes | True when the payment was taken offline and is waiting to be forwarded. |
| `status` | string | yes | The PaymentIntent status after the step, such as succeeded or requires_confirmation. |
| `tip` | number | yes | The tip included in the amount, in the smallest unit. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `canceled` | The operation was cancelled before it finished, by the person or by a cancel call. | Treat it as a normal outcome and let the person start again if they want. |
| `declined` | The card was declined by the bank or card network. | Ask the customer to try another card or payment method. |
| `feature_unavailable` | The connected reader or this Stripe account does not offer this. | Not recoverable by retrying. |
| `invalid_simulator` | simulator is { card?, tip?, update?, offline?, inputs? }. | Not recoverable by retrying. |
| `network_unavailable` | Stripe could not be reached. |  |
| `not_configured` | No connection token endpoint: set config token_endpoint or call terminal.configure. | Not recoverable by retrying. |
| `not_connected` | No reader is connected, so there is nothing to talk to. | Call discover and connect first, then retry. |
| `nothing_collected` | Nothing is collected: call collect with confirm false first. |  |
| `offline_unavailable` | Offline mode cannot take this payment (not enabled, over its limit, or the card or currency is not accepted offline). |  |
| `reader_busy` | The reader is busy or in use by another device. |  |
| `sdk_error` | Stripe's reader software reported a failure that has no more specific code. | Try again, and if it keeps happening check the reader and your Stripe account. |
| `session_expired` | The Terminal session expired; connect again. |  |
| `unsupported_country` | Stripe does not allow this reader, location or currency in that country (for example Tap to Pay on a location in a country Stripe has not launched it in, or a card_present currency the account's country refuses). Register the reader to a location in a supported country, or charge in a supported currency. | Not recoverable by retrying. |
| `unsupported_platform` | Stripe Terminal has no SDK on this platform, or the browser SDK cannot do this (it creates no PaymentIntent and has no offline mode or simulated update). | Not recoverable by retrying. |

**Example: Finish a payment that collect left waiting**

```js
const result = await dsx.module.terminal.confirm({});
// resolves {"amount":1999,"card":{"brand":"visa","last4":"4242"},"charge":"ch_3Nxample","currency":"usd","id":"pi_3Nxample","offline":false,"status":"succeeded","tip":0}
```

### connect

`dsx.module.terminal.connect`

Connects to one reader found by discover. Bluetooth, Tap to Pay and USB readers must be registered to a Stripe location.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the reader to connect to, taken from discover. |
| `location` | string | no | The Stripe location id (tml_...) to register a Bluetooth, Tap to Pay or USB reader to. |
| `timeout` | number | no | How long to wait for the connection, in milliseconds, before giving up. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `reader` | object | yes | The reader that is now connected. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `account_not_linked` | The merchant has not accepted Apple's Tap to Pay terms (dismissed, or no iCloud sign-in). |  |
| `already_connected` | A reader is already connected, and only one can be connected at a time. | Call disconnect first, or keep using the reader that is connected. |
| `bluetooth_unavailable` | Bluetooth is off or not permitted. |  |
| `debuggable_build` | Tap to Pay on Android refuses a debuggable build for live payments; ship a release build. | Not recoverable by retrying. |
| `entitlement_missing` | The app lacks Apple's Tap to Pay entitlement (com.apple.developer.proximity-reader.payment.acceptance). | Not recoverable by retrying. |
| `invalid_location` | A location is a Stripe Terminal location id (tml_...). | Not recoverable by retrying. |
| `invalid_timeout` | timeout is a positive number of milliseconds. | Not recoverable by retrying. |
| `location_unavailable` | Location services are off or not permitted; Stripe requires them for readers. |  |
| `missing_location` | Bluetooth, Tap to Pay and USB readers connect to a location id (tml_...). | Not recoverable by retrying. |
| `missing_param` | A required argument is missing. | Not recoverable by retrying. |
| `network_unavailable` | Stripe could not be reached. |  |
| `nfc_unavailable` | NFC is off, so Tap to Pay cannot start. |  |
| `not_configured` | No connection token endpoint: set config token_endpoint or call terminal.configure. | Not recoverable by retrying. |
| `offline_unavailable` | Offline mode cannot take this payment (not enabled, over its limit, or the card or currency is not accepted offline). |  |
| `passcode_required` | Tap to Pay on iPhone needs a device passcode. |  |
| `reader_busy` | The reader is busy or in use by another device. |  |
| `sdk_error` | Stripe's reader software reported a failure that has no more specific code. | Try again, and if it keeps happening check the reader and your Stripe account. |
| `timeout` | The reader did not connect in time; the attempt was abandoned and any late connection is released. |  |
| `token_rejected` | Your connection token endpoint refused this app (401/403). | Not recoverable by retrying. |
| `token_unavailable` | Your connection token endpoint did not answer a token. |  |
| `unknown_reader` | No discovered reader has that id. | Not recoverable by retrying. |
| `unsupported_country` | Stripe does not allow this reader, location or currency in that country (for example Tap to Pay on a location in a country Stripe has not launched it in, or a card_present currency the account's country refuses). Register the reader to a location in a supported country, or charge in a supported currency. | Not recoverable by retrying. |
| `unsupported_device` | This device cannot take Tap to Pay payments (model, OS version, or a tampered or insecure environment). | Not recoverable by retrying. |
| `unsupported_platform` | Stripe Terminal has no SDK on this platform. | Not recoverable by retrying. |
| `update_failed` | The reader software update failed (battery, interruption or the reader). |  |

**Example: Connect to a reader found by discover**

```js
const result = await dsx.module.terminal.connect({"id":"tmr_FDOt2wlRZEdbeD","location":"tml_Fxample"});
// resolves {"reader":{"batteryLevel":0.8,"deviceType":"bbpos_wisepos_e","id":"tmr_FDOt2wlRZEdbeD","label":"Counter reader","serialNumber":"STRM26138003393"}}
```

### disconnect

`dsx.module.terminal.disconnect`

Disconnects the reader that is currently connected.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the reader was disconnected. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | No connection token endpoint: set config token_endpoint or call terminal.configure. | Not recoverable by retrying. |
| `not_connected` | No reader is connected, so there is nothing to talk to. | Call discover and connect first, then retry. |
| `sdk_error` | Stripe's reader software reported a failure that has no more specific code. | Try again, and if it keeps happening check the reader and your Stripe account. |
| `unsupported_country` | Stripe does not allow this reader, location or currency in that country (for example Tap to Pay on a location in a country Stripe has not launched it in, or a card_present currency the account's country refuses). Register the reader to a location in a supported country, or charge in a supported currency. | Not recoverable by retrying. |
| `unsupported_platform` | Stripe Terminal has no SDK on this platform. | Not recoverable by retrying. |

**Example: Disconnect the reader**

```js
const result = await dsx.module.terminal.disconnect({});
// resolves {"ok":true}
```

### discover

`dsx.module.terminal.discover`

Looks for card readers of one kind and returns the first ones found. The list in context stays live until you connect or cancel.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `location` | string | no | The Stripe location id (tml_...) the readers belong to. |
| `method` | string | yes | The kind of reader to look for: bluetooth, tap_to_pay, internet or usb. |
| `prompt` | boolean | no | Set false to skip the permission prompts and handle them yourself. |
| `simulated` | boolean | no | Set true to find a simulated reader instead of a real one, for testing. |
| `simulator` | object | no | Test settings for a simulated reader, such as a test card, tip, update state or form outcome. Use it only in Stripe test mode. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `readers` | array | yes | The readers found, each with an id you pass to connect. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bluetooth_unavailable` | Bluetooth is off or not permitted. |  |
| `canceled` | The operation was cancelled before it finished, by the person or by a cancel call. | Treat it as a normal outcome and let the person start again if they want. |
| `discovery_timed_out` | No reader was found in time. |  |
| `invalid_location` | A location is a Stripe Terminal location id (tml_...). | Not recoverable by retrying. |
| `invalid_simulator` | simulator is { card?, tip?, update?, offline?, inputs? }. | Not recoverable by retrying. |
| `location_unavailable` | Location services are off or not permitted; Stripe requires them for readers. |  |
| `network_unavailable` | Stripe could not be reached. |  |
| `nfc_unavailable` | NFC is off, so Tap to Pay cannot start. |  |
| `not_configured` | No connection token endpoint: set config token_endpoint or call terminal.configure. | Not recoverable by retrying. |
| `not_loaded` | Tap to Pay readers are the payments.taptopay package: add payments.taptopay to this app. | Not recoverable by retrying. |
| `permission_denied` | Location (or, for a Bluetooth reader, Bluetooth) access is not granted. The data carries the contract state: { permission, status, canAsk }. |  |
| `sdk_error` | Stripe's reader software reported a failure that has no more specific code. | Try again, and if it keeps happening check the reader and your Stripe account. |
| `token_rejected` | Your connection token endpoint refused this app (401/403). | Not recoverable by retrying. |
| `token_unavailable` | Your connection token endpoint did not answer a token. |  |
| `unsupported_country` | Stripe does not allow this reader, location or currency in that country (for example Tap to Pay on a location in a country Stripe has not launched it in, or a card_present currency the account's country refuses). Register the reader to a location in a supported country, or charge in a supported currency. | Not recoverable by retrying. |
| `unsupported_method` | That reader family is not available on this platform. | Not recoverable by retrying. |
| `unsupported_platform` | Stripe Terminal has no SDK on this platform. | Not recoverable by retrying. |

**Example: Find simulated Bluetooth readers**

```js
const result = await dsx.module.terminal.discover({"method":"bluetooth","simulated":true});
// resolves {"readers":[{"batteryLevel":0.8,"deviceType":"bbpos_wisepos_e","id":"tmr_FDOt2wlRZEdbeD","label":"Counter reader","serialNumber":"STRM26138003393"}]}
```

### display

`dsx.module.terminal.display`

Shows a cart on a smart reader's screen, with the lines, tax and total exactly as you give them.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cart` | object | yes | The cart to show: a currency, lineItems with description, quantity and amount, and optional tax and total. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the cart was shown. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `canceled` | The operation was cancelled before it finished, by the person or by a cancel call. | Treat it as a normal outcome and let the person start again if they want. |
| `feature_unavailable` | The connected reader or this Stripe account does not offer this. | Not recoverable by retrying. |
| `invalid_cart` | A cart is { currency, lineItems: [{ description, quantity, amount }], tax?, total? }. | Not recoverable by retrying. |
| `invalid_currency` | A currency is a three-letter ISO code. | Not recoverable by retrying. |
| `invalid_simulator` | simulator is { card?, tip?, update?, offline?, inputs? }. | Not recoverable by retrying. |
| `network_unavailable` | Stripe could not be reached. |  |
| `not_configured` | No connection token endpoint: set config token_endpoint or call terminal.configure. | Not recoverable by retrying. |
| `not_connected` | No reader is connected, so there is nothing to talk to. | Call discover and connect first, then retry. |
| `reader_busy` | The reader is busy or in use by another device. |  |
| `sdk_error` | Stripe's reader software reported a failure that has no more specific code. | Try again, and if it keeps happening check the reader and your Stripe account. |
| `session_expired` | The Terminal session expired; connect again. |  |
| `unsupported_country` | Stripe does not allow this reader, location or currency in that country (for example Tap to Pay on a location in a country Stripe has not launched it in, or a card_present currency the account's country refuses). Register the reader to a location in a supported country, or charge in a supported currency. | Not recoverable by retrying. |
| `unsupported_platform` | Stripe Terminal has no SDK on this platform, or the browser SDK cannot do this (it creates no PaymentIntent and has no offline mode or simulated update). | Not recoverable by retrying. |

**Example: Show a cart on the reader screen**

```js
const result = await dsx.module.terminal.display({"cart":{"currency":"usd","lineItems":[{"amount":450,"description":"Coffee","quantity":1}],"tax":40,"total":490}});
// resolves {"ok":true}
```

### permission.manage

`dsx.module.terminal.permission.manage`

Lets the person change a limited permission selection where the system supports it. Elsewhere it just returns the current state with changed false.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when the system will still show a permission prompt. |
| `changed` | boolean | yes | True when the person changed their selection. |
| `level` | string | no | Which permission level was checked, location or bluetooth. |
| `status` | string | yes | The current permission state, such as granted or denied. |

**Example: nothing limited to manage**

```js
const result = await dsx.module.terminal.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.terminal.permission.openSettings`

Opens this app's page in the system settings so the person can change a denied permission. Call it only from a tap.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when the settings page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | Opening Settings needs the App Settings package (dsx.module.settings). | Not recoverable by retrying. |
| `unsupported_platform` | No page script can open browser or OS settings. | Not recoverable by retrying. |

**Example: opens the app page**

```js
const result = await dsx.module.terminal.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.terminal.permission.request`

Asks the person for the permissions card readers need, showing the system dialog only if they have not decided yet. Use it from a settings row or onboarding step.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | string | no | Which permission to check: location (the default) or bluetooth, which also needs location. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when the system will still show a permission prompt. |
| `level` | string | no | Which permission level was checked, location or bluetooth. |
| `status` | string | yes | The current permission state, such as granted or denied. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_level` | level must be one of: location, bluetooth. |  |

**Example: granted**

```js
const result = await dsx.module.terminal.permission.request({});
// resolves {"canAsk":false,"level":"location","status":"granted"}
```

### permission.status

`dsx.module.terminal.permission.status`

Checks whether the app may use location and, if asked, Bluetooth, which Stripe needs to work with readers. It never shows a prompt, so you can call it every time a settings screen appears.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | string | no | Which permission to check: location (the default) or bluetooth, which also needs location. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when the system will still show a permission prompt. |
| `level` | string | no | Which permission level was checked, location or bluetooth. |
| `status` | string | yes | The current permission state, such as granted or denied. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_level` | level must be one of: location, bluetooth. |  |

**Example: never asked**

```js
const result = await dsx.module.terminal.permission.status({});
// resolves {"canAsk":true,"level":"location","status":"undetermined"}
```

**Example: a final denial: only Settings helps**

```js
const result = await dsx.module.terminal.permission.status({});
// resolves {"canAsk":false,"level":"location","status":"denied"}
```

### refund

`dsx.module.terminal.refund`

Refunds a payment in person: the reader reads the card the charge was paid with. Use it for methods Stripe only refunds with the card present.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `amount` | int | yes | The amount to refund in the currency's smallest unit. |
| `chargeId` | string | yes | The Stripe charge id (ch_... or py_...) to refund. |
| `currency` | string | yes | The three-letter currency code of the charge. |
| `simulator` | object | no | Test settings for a simulated reader, such as a test card, tip, update state or form outcome. Use it only in Stripe test mode. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `amount` | number | yes | The amount refunded in the smallest unit. |
| `currency` | string | yes | The three-letter currency code of the refund. |
| `id` | string | yes | The Stripe id of the refund that was created. |
| `status` | string | yes | Whether the refund succeeded, is pending or failed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `canceled` | The operation was cancelled before it finished, by the person or by a cancel call. | Treat it as a normal outcome and let the person start again if they want. |
| `card_error` | The card could not be read. |  |
| `feature_unavailable` | The connected reader or this Stripe account does not offer this. | Not recoverable by retrying. |
| `invalid_amount` | An amount is a positive whole number in the currency's smallest unit. | Not recoverable by retrying. |
| `invalid_charge` | A refund names the charge (ch_... or py_...). | Not recoverable by retrying. |
| `invalid_currency` | A currency is a three-letter ISO code. | Not recoverable by retrying. |
| `invalid_simulator` | simulator is { card?, tip?, update?, offline?, inputs? }. | Not recoverable by retrying. |
| `network_unavailable` | Stripe could not be reached. |  |
| `not_configured` | No connection token endpoint: set config token_endpoint or call terminal.configure. | Not recoverable by retrying. |
| `not_connected` | No reader is connected, so there is nothing to talk to. | Call discover and connect first, then retry. |
| `reader_busy` | The reader is busy or in use by another device. |  |
| `refund_failed` | Stripe refused the refund, for example because it is more than the charge or has already been refunded. | Check the charge and amount on your Stripe dashboard. |
| `sdk_error` | Stripe's reader software reported a failure that has no more specific code. | Try again, and if it keeps happening check the reader and your Stripe account. |
| `session_expired` | The Terminal session expired; connect again. |  |
| `unsupported_country` | Stripe does not allow this reader, location or currency in that country (for example Tap to Pay on a location in a country Stripe has not launched it in, or a card_present currency the account's country refuses). Register the reader to a location in a supported country, or charge in a supported currency. | Not recoverable by retrying. |
| `unsupported_platform` | Stripe Terminal has no SDK on this platform, or the browser SDK cannot do this (it creates no PaymentIntent and has no offline mode or simulated update). | Not recoverable by retrying. |

**Example: Refund a charge in person**

```js
const result = await dsx.module.terminal.refund({"amount":500,"chargeId":"ch_3Nxample","currency":"usd"});
// resolves {"amount":500,"currency":"usd","id":"re_3Nxample","status":"succeeded"}
```

### update

`dsx.module.terminal.update`

Installs the software update the connected reader offers, with progress in context. Required updates install during connect, and smart readers update themselves.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `installed` | boolean | yes | True when an update was installed. |
| `update` | object | yes | Details of the update that was available. |
| `version` | string | yes | The software version the reader now runs. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `canceled` | The operation was cancelled before it finished, by the person or by a cancel call. | Treat it as a normal outcome and let the person start again if they want. |
| `feature_unavailable` | The connected reader or this Stripe account does not offer this. | Not recoverable by retrying. |
| `invalid_simulator` | simulator is { card?, tip?, update?, offline?, inputs? }. | Not recoverable by retrying. |
| `network_unavailable` | Stripe could not be reached. |  |
| `not_configured` | No connection token endpoint: set config token_endpoint or call terminal.configure. | Not recoverable by retrying. |
| `not_connected` | No reader is connected, so there is nothing to talk to. | Call discover and connect first, then retry. |
| `reader_busy` | The reader is busy or in use by another device. |  |
| `sdk_error` | Stripe's reader software reported a failure that has no more specific code. | Try again, and if it keeps happening check the reader and your Stripe account. |
| `session_expired` | The Terminal session expired; connect again. |  |
| `unsupported_country` | Stripe does not allow this reader, location or currency in that country (for example Tap to Pay on a location in a country Stripe has not launched it in, or a card_present currency the account's country refuses). Register the reader to a location in a supported country, or charge in a supported currency. | Not recoverable by retrying. |
| `unsupported_platform` | Stripe Terminal has no SDK on this platform, or the browser SDK cannot do this (it creates no PaymentIntent and has no offline mode or simulated update). | Not recoverable by retrying. |
| `update_failed` | The reader software update failed (battery, interruption or the reader). |  |

**Example: Install the reader software update**

```js
const result = await dsx.module.terminal.update({});
// resolves {"installed":true,"update":{"required":false,"version":"2.28.1.0"},"version":"2.28.1.0"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `connect_timeout_ms` | number | `300000` | How long connect waits, in milliseconds, before failing with timeout. |
| `offline_behavior` | string | `require_online` | How a device-created payment behaves without a network: require_online, prefer_online (store and forward when offline) or force_offline. |
| `token_endpoint` | string | `` | Your server's URL that creates a Stripe Terminal connection token with your secret key and answers { "secret": "pst_..." }. |
| `usage_description` | string | `Connect to card readers to take payments.` | Shown by iOS when the app first looks for a card reader. |

## Related packages

- Needs: [Payments](/packages/payments)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
