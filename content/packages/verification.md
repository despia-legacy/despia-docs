---
title: Stripe Identity
description: Check who your users are with an ID document and selfie, using Stripe Identity.
package: verification
---

Check who your users are with an ID document and selfie, using Stripe Identity.

Opens Stripe Identity's own verification sheet over your app, or a ready-made verify button, and reports whether the person finished, cancelled or failed. Your server reads the final verified result. Works with the Stripe package. Needs a Stripe account with Identity, your publishable key, a server route that creates verification sessions and camera permission text.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Add it when you need to confirm a person's identity with an ID document and selfie, for example before payouts or age checks. It tells your app how the flow ended; your server must read the final verified result, because finishing the flow is not the same as being verified.

## What native adds

Presents Stripe Identity's own native sheet with camera capture of the document, which is more reliable than a web page.

## Install

```sh
despia add Core/Payments/Modules/Stripe/Modules/Verification
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

### verify

`dsx.module.verification.verify`

Opens Stripe Identity's verification sheet and reports whether the person finished, cancelled or failed.

**When to use it.** Call it when the person taps a verify identity button.

**When not to.** Do not treat submitted as verified; read the final result on your server.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `authorization` | string | no | The signed-in person's authorization value, sent to your endpoint so the session is created for them. |
| `client_secret` | string | no | The client secret of that verification session. |
| `endpoint` | string | no | The address of your server route that creates a verification session; defaults to the one in the package config. |
| `ephemeral_key_secret` | string | no | The short-lived key your server created for that session, needed on iOS and Android. |
| `publishable_key` | string | no | Your Stripe publishable key; never pass a secret key. |
| `verification_session_id` | string | no | The id of a verification session your server already created. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `error` | string | no | Stripe's own message when the flow failed. |
| `session` | string | yes | The id of the Stripe verification session. |
| `status` | string | yes | How the flow ended: submitted, canceled or failed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A verification is already open. |  |
| `invalid_authorization` | The Authorization value must be one line. | Not recoverable by retrying. |
| `invalid_endpoint` | The session endpoint must be https, or http to a local development host. | Not recoverable by retrying. |
| `invalid_ephemeral_key` | An ephemeral key secret is ek_... | Not recoverable by retrying. |
| `invalid_publishable_key` | A publishable key is pk_test_... or pk_live_... | Not recoverable by retrying. |
| `invalid_session` | That is not one VerificationSession: the id is vs_... and a client secret is vs_..._secret_... of the same session. | Not recoverable by retrying. |
| `missing_ephemeral_key` | The native Identity SDKs need an ephemeral key for the session: have the server create one with verification_session (POST /v1/ephemeral_keys) and pass ephemeral_key_secret. | Not recoverable by retrying. |
| `missing_param` | Nothing to verify with: pass verification_session_id with ephemeral_key_secret (iOS, Android) or client_secret (web), or set config session_endpoint. | Not recoverable by retrying. |
| `missing_publishable_key` | Stripe.js needs your publishable key: pass publishable_key or set config publishable_key. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find a screen to present the verification. | Not recoverable by retrying. |
| `not_configured` | The server's Stripe account does not offer Stripe Identity on this platform yet; the message names what it lacks (payments.stripe.backend: stripe:identity-mobile-sdk-access while the account's Identity mobile SDK access is off). | Not recoverable by retrying. |
| `not_ready` | Stripe Identity is not ready yet. Please try again in a moment. |  |
| `secret_key_refused` | A Stripe secret or restricted key never ships in an app; keep it on your server. | Not recoverable by retrying. |
| `session_rejected` | The session endpoint refused this request (401 or 403). | Not recoverable by retrying. |
| `session_unavailable` | The session endpoint did not answer with a VerificationSession (vs_...). |  |
| `unsupported_platform` | Stripe Identity has no SDK on this platform. | Not recoverable by retrying. |

**Example: Verify an identity with a session from your server**

```js
const result = await dsx.module.verification.verify({"ephemeral_key_secret":"ek_test_example","verification_session_id":"vs_example"});
// resolves {"session":"vs_example","status":"submitted"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `camera_usage_description` | string | `This app uses the camera to verify your identity.` | Why the app uses the camera during identity verification (iOS asks with this text). |
| `publishable_key` | string | `` | pk_test_... or pk_live_..., used by Stripe.js on the web. Never a secret key. |
| `session_endpoint` | string | `` | Your server's URL that creates a Stripe Identity VerificationSession (and, for iOS and Android, its ephemeral key) with your secret key: payments.stripe.backend's POST /payments/stripe/identity/verification-session, or your own route answering { "id": "vs_...", "client_secret": "vs_..._secret_...", "ephemeral_key_secret": "ek_..." }. |

## Related packages

- Needs: payments.stripe

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
