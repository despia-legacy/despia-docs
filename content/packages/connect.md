---
title: Stripe Connect
description: Put Stripe's onboarding, payouts and payments screens for connected accounts inside your platform app.
package: connect
---

Put Stripe's onboarding, payouts and payments screens for connected accounts inside your platform app.

Adds Stripe's own Connect components to your layout or as sheets, such as onboarding, payments and payouts, so sellers or providers on your platform manage their money without leaving the app. Works with the Stripe package. Needs a Stripe account with Connect, your publishable key and a server route that creates Account Sessions.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it when you run a platform or marketplace and want sellers or providers to onboard, see payments and manage payouts using Stripe's own screens. Your server must create account sessions. Use the main Stripe package for your own customers' payments.

## What native adds

On the phone, onboarding is Stripe's own native screen, including identity document capture with the camera.

## Install

```sh
despia add Core/Payments/Modules/Stripe/Modules/Connect
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

### configure

`dsx.module.connect.configure`

Sets where to get account sessions, which connected account to show and how it looks, before the first Stripe screen appears.

**When to use it.** Call it at startup, or again when the signed-in account changes. A new call starts a new session.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `account` | string | no | The connected account to show, beginning with acct_. |
| `appearance` | object | no | Colours and fonts in Stripe's variables format. Variables a phone cannot apply are reported in notes. |
| `authorization` | string | no | The Authorization header your server expects, such as a bearer token. |
| `endpoint` | string | no | The address of your server's account session route. |
| `locale` | string | no | A Stripe language code such as en-US. It applies on the web only; phones follow the device. |
| `publishable_key` | string | no | Your Stripe publishable key. Secret keys are refused. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `notes` | array | no | Appearance variables this device could not apply. |
| `ok` | boolean | yes | True when the settings were applied. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_account` | A connected account is a Stripe account id (acct_...). | Not recoverable by retrying. |
| `invalid_authorization` | The Authorization value must be one line. | Not recoverable by retrying. |
| `invalid_endpoint` | The Account Session endpoint must be https, or http to a local development host. | Not recoverable by retrying. |
| `invalid_key` | That is not a Stripe publishable key (pk_test_... or pk_live_...). | Not recoverable by retrying. |
| `secret_key_refused` | A secret or restricted key never belongs in an app. Pass the publishable key; the secret key stays on your server. | Not recoverable by retrying. |
| `unsupported_platform` | Stripe Connect has no SDK on this platform. | Not recoverable by retrying. |

**Example: configures an https endpoint and a test key**

```js
const result = await dsx.module.connect.configure({"account":"acct_1","endpoint":"https://api.example.com/connect/account-session","publishable_key":"pk_test_123"});
// resolves {"ok":true}
```

### logout

`dsx.module.connect.logout`

Ends the current Stripe session so the next screen fetches a fresh one.

**When to use it.** Call it when the signed-in person changes.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the session was ended. |

**Example: ends the session**

```js
const result = await dsx.module.connect.logout({});
// resolves {"ok":true}
```

### present

`dsx.module.connect.present`

Shows one Stripe Connect screen over your app, such as onboarding or payouts, and reports how it was closed.

**When to use it.** Use it for a one-off screen. To place a screen in your layout, use its element instead. Phones draw onboarding, payments and payouts only.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `component` | string | yes | Which Connect screen to show, such as onboarding, payments or payouts. |
| `props` | object | no | Settings for that screen, using the same names as its element. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `component` | string | yes | The screen that was shown. |
| `error` | string | no | What went wrong, when status is failed. |
| `status` | string | yes | How it ended: exited, closed or failed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A Connect component is already presented. |  |
| `invalid_param` | A component attribute has the wrong shape. | Not recoverable by retrying. |
| `missing_param` | Name the component to present. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find a screen to present Connect from. | Not recoverable by retrying. |
| `not_configured` | No Account Session endpoint or publishable key: set config session_endpoint and publishable_key, or call connect.configure. | Not recoverable by retrying. |
| `not_ready` | Stripe Connect is not ready yet. Please try again in a moment. |  |
| `unknown_component` | That is not a Stripe Connect embedded component. | Not recoverable by retrying. |
| `unsupported_platform` | This Connect component is web-only in the pinned Stripe SDK. | Not recoverable by retrying. |

**Example: presents payouts and settles when the sheet closes**

```js
const result = await dsx.module.connect.present({"component":"Payouts"});
// resolves {"component":"Payouts","status":"closed"}
```

**Example: onboarding settles exited when the vendor exits**

```js
const result = await dsx.module.connect.present({"component":"Onboarding"});
// resolves {"component":"Onboarding","status":"exited"}
```

### update

`dsx.module.connect.update`

Changes the colours, fonts or language of the live session without reloading the screens.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `appearance` | object | no | The new colours and fonts, in Stripe's variables format. |
| `locale` | string | no | The new language code such as en-US. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `notes` | array | no | Appearance variables this device could not apply. |
| `ok` | boolean | yes | True when the change was applied. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | Stripe Connect has no SDK on this platform. | Not recoverable by retrying. |

**Example: updates the appearance**

```js
const result = await dsx.module.connect.update({"appearance":{"variables":{"colorPrimary":"#635BFF"}}});
// resolves {"ok":true}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `camera_usage_description` | string | `Photograph your identity documents to verify your account.` | Shown by iOS when onboarding asks to photograph an identity document. |
| `publishable_key` | string | `` | Your Stripe publishable key (pk_test_... or pk_live_...). Never the secret key. |
| `session_endpoint` | string | `` | Your server's URL that creates a Stripe Account Session with your secret key and answers { "client_secret": "accs_..." }. |

## Related packages

- Needs: payments.stripe

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
