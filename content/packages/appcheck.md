---
title: Firebase App Check
description: Get Firebase App Check tokens so Firebase and your backend accept only your real app.
package: appcheck
---

Get Firebase App Check tokens so Firebase and your backend accept only your real app.

Returns an App Check token you send in the X-Firebase-AppCheck header to Firebase services or your own backend. It relies on the App integrity check package for the device proof. iOS and Android only. Needs a Firebase project, its Web API key and your Firebase app IDs.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it when Firebase services or your own backend should only answer your genuine app. Send the token in the X-Firebase-AppCheck header. It works on iOS and Android only and needs the app integrity package.

## What native adds

It uses the phone's own proof that the app is genuine, which a web page cannot produce.

## Install

```sh
despia add Core/Integrity/Modules/AppCheck
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone, tablet.

## Actions

### token

`dsx.module.appcheck.token`

Returns an App Check token that proves this is your real app. It reuses a saved token until five minutes before it expires.

**When to use it.** Call it before each request to Firebase or your backend and send the result in the X-Firebase-AppCheck header.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `refresh` | boolean | no | Set to true to get a brand new token instead of reusing the saved one. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `expiresAt` | number | yes | When the token stops working, in epoch milliseconds. |
| `token` | string | yes | The App Check token to send with your requests. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `attestation_failed` | Core/Integrity did not attest this app. |  |
| `challenge_mismatch` | App Check's challenge cannot be bound by Play Integrity verbatim. | Not recoverable by retrying. |
| `exchange_failed` | App Check refused the attestation. |  |
| `invalid_challenge` | App Check's challenge is not usable. | Not recoverable by retrying. |
| `not_configured` | App Check needs config project, api_key and this platform's Firebase app ID. | Not recoverable by retrying. |
| `transport_unavailable` | App Check could not be reached. |  |
| `unsupported_platform` | App Check on the web needs its reCAPTCHA provider, which Despia does not own. | Not recoverable by retrying. |

**Example: Get an App Check token**

```js
const result = await dsx.module.appcheck.token({});
// resolves {"expiresAt":1791503600000,"token":"example-app-check-token"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `android_app_id` | string | `` | The Android app's Firebase app ID, e.g. 1:123456789:android:def456. |
| `api_key` | string | `` | The app's Firebase Web API key (public; it ships in every Firebase app). |
| `bundle_id` | string | `` | The iOS bundle identifier the API key is restricted to, if it is. |
| `ios_app_id` | string | `` | The iOS app's Firebase app ID, e.g. 1:123456789:ios:abc123. |
| `project` | string | `` | Your Firebase project ID or number. |

## Related packages

- Needs: [Integrity](/packages/integrity)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
