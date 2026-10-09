---
title: Passkeys
description: Sign people in with passkeys from the phone's own authenticator, with any backend.
package: passkeys
---

Sign people in with passkeys from the phone's own authenticator, with any backend.

Create a passkey and sign in with one using the system passkey sheet on iOS, Android and the web. You get the raw response to send to your own server, which verifies it against the challenge it issued. The package does not store credentials or verify them for you. You need your own sign-in server and a domain set up for passkeys.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for passwordless sign-in when you run your own backend or use a service that accepts standard WebAuthn responses. If you already use Clerk, use its own package instead.

## What native adds

The system sheet uses the person's own Face ID, fingerprint or screen lock and syncs passkeys across their devices, which a web form cannot do.

## Install

```sh
despia add Core/Passkeys
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, tablet, desktop.

## Actions

### autofill

`dsx.module.passkeys.autofill`

Arms the passkey suggestion inside a username field, so the system offers a passkey when the person focuses it. The call resolves only if they choose one.

**When to use it.** Use it once per sign-in screen when you want passkeys offered inside the username field.

**When not to.** Do not use it for a button that opens the sheet directly; use get for that.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `challenge` | string | yes | A random value from your server, base64url encoded, at least 16 bytes. Your server checks the response against it. |
| `rpId` | string | yes | The domain the passkeys belong to, such as example.com. |
| `timeout` | int | no | How long to wait for the person, in milliseconds. Values are held between 15000 and 600000. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `authenticatorData` | string | no | The authenticator data of the assertion, base64url encoded, for your server to verify. |
| `cancelled` | boolean | yes | True when the person dismissed the passkey sheet. This is a normal outcome, not an error. |
| `clientDataJSON` | string | no | The client data from the ceremony, base64url encoded, for your server to check against its challenge. |
| `id` | string | no | The credential id, base64url encoded. |
| `rawId` | string | no | The raw credential id, base64url encoded. |
| `signature` | string | no | The signature over the assertion, base64url encoded, for your server to verify. |
| `userHandle` | string | no | The opaque user id stored in the passkey when it was created, base64url encoded. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `ceremony_failed` | The passkey could not be used. |  |
| `invalid_challenge` | That is not a usable challenge. | Not recoverable by retrying. |
| `invalid_rp_id` | That is not a relying-party domain. | Not recoverable by retrying. |
| `not_configured` | This build declares no relying-party domain, so a passkey cannot be bound to anything. | Not recoverable by retrying. |
| `unsupported_device` | This device cannot offer a passkey inside a username field (Android's conditional UI needs an autofill-hinted native field a Despia surface does not present). Call get() when the user submits instead. | Not recoverable by retrying. |

**Example: the user picks a passkey from the username field**

```js
const result = await dsx.module.passkeys.autofill({"challenge":"AAECAwQFBgcICQoLDA0ODw","rpId":"example.com"});
// resolves {"authenticatorData":"SZYN5YgOjGh0NBcPZHZgW4","cancelled":false,"clientDataJSON":"eyJ0eXBlIjoid2ViYXV0aG4uZ2V0In0","id":"Y3JlZC1pZA","rawId":"Y3JlZC1pZA","signature":"MEUCIQD","userHandle":"AAECAwQFBgc"}
```

**Example: the user types a password instead, and the armed ceremony simply ends**

```js
const result = await dsx.module.passkeys.autofill({"challenge":"AAECAwQFBgcICQoLDA0ODw","rpId":"example.com"});
// resolves {"cancelled":true}
```

### cancel

`dsx.module.passkeys.cancel`

Stops an armed autofill request or an abandoned passkey request. Calling it when nothing is waiting is harmless.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancelled` | boolean | yes | True when there was a request to stop, false when nothing was waiting. |

**Example: tears down an armed autofill**

```js
const result = await dsx.module.passkeys.cancel({});
// resolves {"cancelled":true}
```

**Example: cancelling nothing is a no-op, so teardown paths need no bookkeeping**

```js
const result = await dsx.module.passkeys.cancel({});
// resolves {"cancelled":false}
```

### create

`dsx.module.passkeys.create`

Registers a new passkey for a person by showing the system passkey sheet. It returns the raw registration response for your server to verify and store.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attestation` | string | no | How much proof about the authenticator you want: none (the default), indirect, direct or enterprise. |
| `challenge` | string | yes | A random value from your server, base64url encoded, at least 16 bytes. Your server checks the response against it. |
| `exclude` | array of string | no | Credential ids already registered for this account, so the device does not create a duplicate. |
| `residentKey` | string | no | Whether the passkey is stored on the device for account pickers: discouraged, preferred (the default) or required. |
| `rpId` | string | yes | The domain the passkeys belong to, such as example.com. |
| `timeout` | int | no | How long to wait for the person, in milliseconds. Values are held between 15000 and 600000. |
| `user` | object | yes | The account the passkey is for: an opaque id (base64url, at most 64 bytes), a name and an optional display name. |
| `user.displayName` | string | no | A friendlier name for the account, shown in some passkey lists. |
| `user.id` | string | yes | An opaque random id for the user, base64url encoded. Never an email or username, because it is stored in the passkey permanently. |
| `user.name` | string | yes | The account name shown to the person, such as their email address. |
| `userVerification` | string | no | Whether the person must prove themselves: required, preferred (the default) or discouraged. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attestationObject` | string | no | The attestation of the new passkey, base64url encoded, for your server to verify and store. |
| `cancelled` | boolean | yes | True when the person dismissed the passkey sheet. This is a normal outcome, not an error. |
| `clientDataJSON` | string | no | The client data from the ceremony, base64url encoded, for your server to check against its challenge. |
| `id` | string | no | The credential id, base64url encoded. |
| `rawId` | string | no | The raw credential id, base64url encoded. |
| `transports` | array of string | no | How the authenticator can be reached, such as internal or hybrid, when the platform says. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_registered` | The device already holds a passkey listed in exclude for this account. | Offer sign-in with the existing passkey instead of creating a new one. |
| `ceremony_failed` | The passkey could not be created. |  |
| `domain_not_associated` | This app is not associated with that domain. Check the site's association file. | Not recoverable by retrying. |
| `invalid_challenge` | That is not a usable challenge. | Not recoverable by retrying. |
| `invalid_credential` | That is not a base64url credential id. | Not recoverable by retrying. |
| `invalid_rp_id` | That is not a relying-party domain. | Not recoverable by retrying. |
| `invalid_user` | That is not a usable user handle. | Not recoverable by retrying. |
| `not_configured` | This build declares no relying-party domain, so a passkey cannot be bound to anything. | Not recoverable by retrying. |
| `unknown_attestation` | That is not an attestation preference. | Not recoverable by retrying. |
| `unknown_resident_key` | That is not a resident-key preference. | Not recoverable by retrying. |
| `unknown_verification` | That is not a user-verification preference. | Not recoverable by retrying. |
| `unsupported_device` | This device cannot do a platform passkey: the browser has no WebAuthn or the OS has no passkey provider. | Not recoverable by retrying. |
| `unsupported_os` | Passkeys need Android 9 (API 28) or newer. | Not recoverable by retrying. |

**Example: registers a passkey and hands back the attestation for the developer's own backend**

```js
const result = await dsx.module.passkeys.create({"challenge":"AAECAwQFBgcICQoLDA0ODw","rpId":"example.com","user":{"id":"AAECAwQFBgc","name":"ada@example.com"}});
// resolves {"attestationObject":"o2NmbXRkbm9uZQ","cancelled":false,"clientDataJSON":"eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIn0","id":"Y3JlZC1pZA","rawId":"Y3JlZC1pZA","transports":["internal","hybrid"]}
```

**Example: a dismissed sheet is not a failure**

```js
const result = await dsx.module.passkeys.create({"challenge":"AAECAwQFBgcICQoLDA0ODw","rpId":"example.com","user":{"id":"AAECAwQFBgc","name":"ada@example.com"}});
// resolves {"cancelled":true}
```

### get

`dsx.module.passkeys.get`

Signs in with an existing passkey through the system sheet. It returns the raw assertion for your server to verify against the challenge it issued.

**When to use it.** Use it when a person taps a sign-in button and you want the system passkey sheet to appear.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `allow` | array of string | no | Credential ids to accept. Leave empty to let the person pick any passkey for the domain. |
| `challenge` | string | yes | A random value from your server, base64url encoded, at least 16 bytes. Your server checks the response against it. |
| `mediation` | string | no | How the sheet appears: silent, optional (the default), conditional or required. |
| `rpId` | string | yes | The domain the passkeys belong to, such as example.com. |
| `timeout` | int | no | How long to wait for the person, in milliseconds. Values are held between 15000 and 600000. |
| `userVerification` | string | no | Whether the person must prove themselves: required, preferred (the default) or discouraged. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `authenticatorData` | string | no | The authenticator data of the assertion, base64url encoded, for your server to verify. |
| `cancelled` | boolean | yes | True when the person dismissed the passkey sheet. This is a normal outcome, not an error. |
| `clientDataJSON` | string | no | The client data from the ceremony, base64url encoded, for your server to check against its challenge. |
| `id` | string | no | The credential id, base64url encoded. |
| `rawId` | string | no | The raw credential id, base64url encoded. |
| `signature` | string | no | The signature over the assertion, base64url encoded, for your server to verify. |
| `userHandle` | string | no | The opaque user id stored in the passkey when it was created, base64url encoded. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `ceremony_failed` | The passkey could not be used. |  |
| `domain_not_associated` | This app is not associated with that domain. Check the site's association file. | Not recoverable by retrying. |
| `invalid_challenge` | That is not a usable challenge. | Not recoverable by retrying. |
| `invalid_credential` | That is not a base64url credential id. | Not recoverable by retrying. |
| `invalid_rp_id` | That is not a relying-party domain. | Not recoverable by retrying. |
| `no_credential` | There is no passkey on this device for that account. |  |
| `not_configured` | This build declares no relying-party domain, so a passkey cannot be bound to anything. | Not recoverable by retrying. |
| `unknown_mediation` | That is not a mediation mode. | Not recoverable by retrying. |
| `unknown_verification` | That is not a user-verification preference. | Not recoverable by retrying. |
| `unsupported_device` | This device cannot do a platform passkey: the browser has no WebAuthn or the OS has no passkey provider. | Not recoverable by retrying. |
| `unsupported_os` | Passkeys need Android 9 (API 28) or newer. | Not recoverable by retrying. |

**Example: signs in with a discoverable passkey and hands back the assertion**

```js
const result = await dsx.module.passkeys.get({"challenge":"AAECAwQFBgcICQoLDA0ODw","rpId":"example.com"});
// resolves {"authenticatorData":"SZYN5YgOjGh0NBcPZHZgW4","cancelled":false,"clientDataJSON":"eyJ0eXBlIjoid2ViYXV0aG4uZ2V0In0","id":"Y3JlZC1pZA","rawId":"Y3JlZC1pZA","signature":"MEUCIQD","userHandle":"AAECAwQFBgc"}
```

**Example: a named credential narrows the picker to one account**

```js
const result = await dsx.module.passkeys.get({"allow":["Y3JlZC1pZA"],"challenge":"AAECAwQFBgcICQoLDA0ODw","rpId":"example.com"});
// resolves {"authenticatorData":"SZYN5YgOjGh0NBcPZHZgW4","cancelled":false,"clientDataJSON":"eyJ0eXBlIjoid2ViYXV0aG4uZ2V0In0","id":"Y3JlZC1pZA","rawId":"Y3JlZC1pZA","signature":"MEUCIQD","userHandle":"AAECAwQFBgc"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `relying_party` | string | `` | The domain your passkeys belong to, e.g. example.com. No https://, no path, no port. |

## Related packages

- Used by: [Biometric](/packages/biometric)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
