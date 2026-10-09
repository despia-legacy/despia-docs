---
title: App integrity check
description: Prove to your server that a request comes from a genuine, unmodified copy of your app.
package: integrity
---

Prove to your server that a request comes from a genuine, unmodified copy of your app.

Uses Apple App Attest on iOS and Google Play Integrity on Android to produce a token your backend verifies with Apple or Google. Use it to protect your API from fake or tampered apps. Needs a server that checks the token. For iOS you pick the development or production environment in the settings.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it to protect your own API from fake or tampered copies of your app: your server sends a challenge, the app returns a token, and your server checks it with Apple or Google. Do not use it to decide things inside the app, since a check run on the device can be patched.

## What native adds

The token comes from Apple App Attest or Google Play Integrity, so the trust rests with Apple or Google and not with code on the device.

## Install

```sh
despia add Core/Integrity
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

### assert

`dsx.module.integrity.assert`

Produces a token that ties one request to the key that attest registered. It is cheap enough to call before a sensitive API call.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `challenge` | string | yes | A one-time value your server created for this request, which the token is bound to. |
| `keyRef` | string | no | The key handle attest returned. It is ignored on Android. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `advisory` | string | yes | A reminder that the device cannot judge itself and only your server's check counts. |
| `challenge` | string | yes | The challenge the token is bound to, echoed back. |
| `format` | string | yes | A name for the token format, so your server knows how to verify it. |
| `keyRef` | string | yes | A handle for the key that was registered. Keep it and pass it to assert. It is empty on Android. |
| `provider` | string | yes | Which service produced the token, such as Apple App Attest or Google Play Integrity. |
| `token` | string | yes | The token to send to your server, which checks it with Apple or Google. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `attestation_failed` | The platform could not attest this app. | Try again later, and treat the request as unverified. |
| `invalid_challenge` | The challenge is not usable for attestation. | Ask your server for a fresh challenge and try again. |
| `invalid_key_ref` | The key reference is not a usable one. | Pass the keyRef that attest returned. |
| `not_attested` | This app instance has not been attested yet. | Call attest first, then assert. |
| `not_configured` | This build is not set up for attestation, for example the Android Cloud project number is missing. | Fill in the Integrity settings and rebuild. |
| `rate_limited` | The platform is throttling attestation requests. | Wait a while and try again. |
| `unknown_format` | That attestation format is not one this provider performs. | Leave the format out to use the default. |
| `unknown_provider` | That attestation provider does not exist on this platform. | Leave the provider out to use the platform's own. |
| `unsupported_device` | This device has no App Attest service on iOS or no Play Integrity route on Android. | Fall back to another check on your server. |
| `unsupported_platform` | A browser has no app attestation service, so nothing the page says about itself can be verified. | Attest from your native builds, or protect the endpoint another way. |

**Example: binds a request to the registered key**

```js
const result = await dsx.module.integrity.assert({"challenge":"AAECAwQFBgcICQoLDA0ODw","keyRef":"d2hhdGV2ZXJBcHBsZUdhdmVVcw=="});
// resolves {"advisory":"This token is only meaningful once your backend verifies it with Apple or Google. Nothing decided on the device is a security decision.","challenge":"AAECAwQFBgcICQoLDA0ODw","format":"apple.assert","keyRef":"d2hhdGV2ZXJBcHBsZUdhdmVVcw==","provider":"appattest","token":"omlzaWduYXR1cmVY"}
```

**Example: a platform with no key to bind to ignores keyRef and returns the same token shape**

```js
const result = await dsx.module.integrity.assert({"challenge":"AAECAwQFBgcICQoLDA0ODw"});
// resolves {"advisory":"This token is only meaningful once your backend verifies it with Apple or Google. Nothing decided on the device is a security decision.","challenge":"AAECAwQFBgcICQoLDA0ODw","format":"google.playintegrity","keyRef":"","provider":"playintegrity","token":"eyJhbGciOiJFUzI1NiJ9.payload.sig"}
```

### attest

`dsx.module.integrity.attest`

Registers this app instance with Apple or Google and returns a one-time registration token for your server. On iOS it also creates a key and returns its keyRef.

**When to use it.** Call it once per install, then send the token to your server.

**When not to.** Use assert for later requests, since attest is a one-time ceremony.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `challenge` | string | yes | A one-time value your server created for this request, which the token is bound to. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `advisory` | string | yes | A reminder that the device cannot judge itself and only your server's check counts. |
| `challenge` | string | yes | The challenge the token is bound to, echoed back. |
| `format` | string | yes | A name for the token format, so your server knows how to verify it. |
| `keyRef` | string | yes | A handle for the key that was registered. Keep it and pass it to assert. It is empty on Android. |
| `provider` | string | yes | Which service produced the token, such as Apple App Attest or Google Play Integrity. |
| `token` | string | yes | The token to send to your server, which checks it with Apple or Google. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `attestation_failed` | The platform could not attest this app. | Try again later, and treat the request as unverified. |
| `invalid_challenge` | The challenge is not usable for attestation. | Ask your server for a fresh challenge and try again. |
| `not_configured` | This build is not set up for attestation, for example the Android Cloud project number is missing. | Fill in the Integrity settings and rebuild. |
| `rate_limited` | The platform is throttling attestation requests. | Wait a while and try again. |
| `unknown_format` | That attestation format is not one this provider performs. | Leave the format out to use the default. |
| `unknown_provider` | That attestation provider does not exist on this platform. | Leave the provider out to use the platform's own. |
| `unsupported_device` | This device has no App Attest service on iOS or no Play Integrity route on Android. | Fall back to another check on your server. |
| `unsupported_platform` | A browser has no app attestation service, so nothing the page says about itself can be verified. | Attest from your native builds, or protect the endpoint another way. |

**Example: produces a registration token and the key reference every later assertion needs**

```js
const result = await dsx.module.integrity.attest({"challenge":"AAECAwQFBgcICQoLDA0ODw"});
// resolves {"advisory":"This token is only meaningful once your backend verifies it with Apple or Google. Nothing decided on the device is a security decision.","challenge":"AAECAwQFBgcICQoLDA0ODw","format":"apple.attest","keyRef":"d2hhdGV2ZXJBcHBsZUdhdmVVcw==","provider":"appattest","token":"o2NmbXRvYXBwbGUtYXBwYXR0ZXN0"}
```

**Example: a platform with no registration step returns an EMPTY keyRef rather than omitting it**

```js
const result = await dsx.module.integrity.attest({"challenge":"AAECAwQFBgcICQoLDA0ODw"});
// resolves {"advisory":"This token is only meaningful once your backend verifies it with Apple or Google. Nothing decided on the device is a security decision.","challenge":"AAECAwQFBgcICQoLDA0ODw","format":"google.playintegrity","keyRef":"","provider":"playintegrity","token":"eyJhbGciOiJFUzI1NiJ9.payload.sig"}
```

### claim

`dsx.module.integrity.claim`

Produces a device token your backend can hand to Apple or Google to read and set that device's anti-abuse bits, so something like a used free trial survives a reinstall.

**When to use it.** Use it to remember that a device already took a free trial, without fingerprinting it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `challenge` | string | yes | A one-time value your server created for this request, which the token is bound to. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `advisory` | string | yes | A reminder that the device cannot judge itself and only your server's check counts. |
| `challenge` | string | yes | The challenge the token is bound to, echoed back. |
| `format` | string | yes | A name for the token format, so your server knows how to verify it. |
| `keyRef` | string | yes | A handle for the key that was registered. Keep it and pass it to assert. It is empty on Android. |
| `provider` | string | yes | Which service produced the token, such as Apple App Attest or Google Play Integrity. |
| `token` | string | yes | The token to send to your server, which checks it with Apple or Google. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `attestation_failed` | The platform could not attest this app. | Try again later, and treat the request as unverified. |
| `invalid_challenge` | The challenge is not usable for attestation. | Ask your server for a fresh challenge and try again. |
| `not_configured` | This build is not set up for attestation, for example the Android Cloud project number is missing. | Fill in the Integrity settings and rebuild. |
| `rate_limited` | The platform is throttling attestation requests. | Wait a while and try again. |
| `unknown_format` | That attestation format is not one this provider performs. | Leave the format out to use the default. |
| `unknown_provider` | That attestation provider does not exist on this platform. | Leave the provider out to use the platform's own. |
| `unsupported_device` | This device has no App Attest service on iOS or no Play Integrity route on Android. | Fall back to another check on your server. |
| `unsupported_platform` | A browser has no app attestation service, so nothing the page says about itself can be verified. | Attest from your native builds, or protect the endpoint another way. |

**Example: an apple device claim is a DeviceCheck token with no key**

```js
const result = await dsx.module.integrity.claim({"challenge":"AAECAwQFBgcICQoLDA0ODw"});
// resolves {"advisory":"This token is only meaningful once your backend verifies it with Apple or Google. Nothing decided on the device is a security decision.","challenge":"AAECAwQFBgcICQoLDA0ODw","format":"apple.devicecheck","keyRef":"","provider":"appattest","token":"AgAAAN1ldmljZWNoZWNr"}
```

**Example: a google device claim is the Play Integrity token**

```js
const result = await dsx.module.integrity.claim({"challenge":"AAECAwQFBgcICQoLDA0ODw"});
// resolves {"advisory":"This token is only meaningful once your backend verifies it with Apple or Google. Nothing decided on the device is a security decision.","challenge":"AAECAwQFBgcICQoLDA0ODw","format":"google.playintegrity","keyRef":"","provider":"playintegrity","token":"eyJhbGciOiJFUzI1NiJ9.payload.sig"}
```

### status

`dsx.module.integrity.status`

Reports what the device knows: which provider exists, whether this install attested, and the key handle it holds. It never says whether the app is genuine.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `advisory` | string | yes | A reminder that this is bookkeeping and not a verdict. |
| `attested` | boolean | yes | True when this install has attested before. |
| `keyRef` | string | yes | The key handle held for this install, or empty. |
| `provider` | string | yes | Which attestation service this platform has. |

**Example: a fresh install has a provider but has never attested**

```js
const result = await dsx.module.integrity.status({});
// resolves {"advisory":"This token is only meaningful once your backend verifies it with Apple or Google. Nothing decided on the device is a security decision.","attested":false,"keyRef":"","provider":"appattest"}
```

**Example: after attesting, the key reference is remembered so assert needs no argument**

```js
const result = await dsx.module.integrity.status({});
// resolves {"advisory":"This token is only meaningful once your backend verifies it with Apple or Google. Nothing decided on the device is a security decision.","attested":true,"keyRef":"d2hhdGV2ZXJBcHBsZUdhdmVVcw==","provider":"appattest"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `attest_environment` | string | `development` | Which Apple attestation environment this build targets: development or production. |
| `play_cloud_project_number` | string | `` | The numeric Cloud project linked to your Play Console app, e.g. 123456789012. |
| `remember_key_ref` | boolean | `true` | Store the key reference from attest() so assert() can be called without it. |

## Related packages

- Used by: [AppCheck](/packages/appcheck), [Backend](/packages/integrity-modules-backend)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
