---
title: Face ID and Touch ID
description: Confirm it is really the user with Face ID, Touch ID or the device passcode.
package: biometric
---

Confirm it is really the user with Face ID, Touch ID or the device passcode.

Shows the system prompt so the user can confirm it is them with biometrics, falling back to the device passcode. Without a challenge the answer is a yes or no for the interface (a modified client can fake it, so it never protects data); pass a server challenge and the answer is a passkey assertion your server verifies. To keep a secret behind biometrics use the vault's locked records. You write the reason text shown in the prompt.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to confirm the person holding the phone before showing a screen or acting on a tap. For anything that protects data or money, pass a server challenge so your server can verify the answer.

## What native adds

Face ID, Touch ID and the Android fingerprint prompt use the secure hardware and the system's own sheet, which a web page cannot reach.

## Install

```sh
despia add Core/Biometric
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, desktop.

## Actions

### authenticate

`dsx.module.biometric.authenticate`

Shows the system Face ID, Touch ID or fingerprint prompt, falling back to the device passcode, and tells you whether the person confirmed.

**When to use it.** Use it to unlock a screen or confirm a sensitive tap. Add a challenge when your server must be able to trust the answer.

**When not to.** Without a challenge, do not rely on it to protect data, money or a sign-in, because a modified app could fake the yes.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `allow` | array of string | no | A list of credential ids that may answer the challenge. Used only together with challenge. |
| `challenge` | string | no | A one-time value from your server; when given, the answer is a passkey assertion your server can verify. |
| `reason` | string | no | The sentence shown in the prompt, for example Unlock your vault; defaults to the usage description in the package config. |
| `rpId` | string | no | The domain of your server (the relying party) that the passkey belongs to. Used together with challenge. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `assertion` | object | no | The signed passkey proof your server verifies. Present only when a challenge was given and ok is true. |
| `assertion.authenticatorData` | string | yes | The authenticator data that was signed, encoded as base64url. |
| `assertion.clientDataJSON` | string | yes | The client data that was signed, encoded as base64url. |
| `assertion.id` | string | yes | The credential id of the passkey that signed. |
| `assertion.rawId` | string | yes | The raw credential id, encoded as base64url. |
| `assertion.signature` | string | yes | The signature your server checks, encoded as base64url. |
| `assertion.userHandle` | string | no | The user handle stored with the passkey, when there is one. |
| `message` | string | no | A readable explanation of the failure from the system. |
| `ok` | boolean | yes | True when the person confirmed, false when they did not or the device could not ask. |
| `platformCode` | number | no | The operating system's own error number, useful only for diagnosis. |
| `reason` | string | no | Why it failed when ok is false, such as cancelled, fallback, failed, lockout or not_enrolled. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | The fingerprint or face sensor is in use right now. | Wait a moment and try again. |
| `challenge_unsupported` | A challenge was given but the app was built without the passkeys package. | Add the passkeys package to the build, or call without a challenge. |
| `failed` | The passkey confirmation started but could not finish. | Let the person try again. |
| `not_set_up` | The person has not set up biometrics or a passcode on this device. | Ask them to enable it in Settings, then try again. |
| `unsupported_device` | The device has no biometric or passcode route to ask, or the browser has no passkey support. | Hide the option, or offer a normal sign-in instead. |

**Example: resolves ok on successful auth**

```js
const result = await dsx.module.biometric.authenticate({"reason":"Unlock your records"});
// resolves {"ok":true}
```

## Presence or security: pick the right strength

_What the yes or no is worth, and when to ask your server to verify it._

# Presence or security: pick the right strength

Biometric answers one question in two strengths, and the strength you ask for decides what the answer is worth.

## Presence only

Call `authenticate` with just a `reason`. The person sees the system prompt and the answer is a yes or a no. Because that answer is produced on the device, a modified copy of your app can fake it. Use it to unlock a screen or confirm a tap, never to protect data, money or a sign-in.

```js
const { ok, reason } = await dsx.module.biometric.authenticate({ reason: "Unlock your vault" });
```

## Verifiable by your server

Pass the `challenge` your server issued and the `rpId` of your associated domain. The answer becomes a passkey assertion that your server checks. A faked client cannot produce it.

```js
const { ok, assertion } = await dsx.module.biometric.authenticate({ reason: "Confirm the transfer", rpId: "example.com", challenge });
if (ok) await fetch("/transfers/confirm", { method: "POST", body: JSON.stringify({ assertion }) });
```

This needs the Passkeys package in the build. Without it the call is refused with `challenge_unsupported` and the presence strength keeps working.

## Keeping a secret behind biometrics

Do not gate a stored secret on the yes or no. Use a locked record in the identity vault, which binds the secret to the hardware.

## When nothing is enrolled

If the person has no Face ID, Touch ID or passcode set up, the call refuses with `not_set_up` before any prompt, and tells you which setting to send them to.

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `usage_description` | multiline | `Authenticate with Face ID or Touch ID to continue.` | The message explaining why the app uses Face ID / Touch ID. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_registered` | This device already has a passkey for that account. |  |
| `ceremony_failed` | The passkey could not be created. |  |
| `domain_not_associated` | This app is not associated with that domain. Check the site's association file. |  |
| `invalid_challenge` | That is not a usable challenge. |  |
| `invalid_credential` | That is not a base64url credential id. |  |
| `invalid_rp_id` | That is not a relying-party domain. |  |
| `invalid_user` | That is not a usable user handle. |  |
| `no_credential` | There is no passkey on this device for that account. |  |
| `not_configured` | This build declares no relying-party domain, so a passkey cannot be bound to anything. |  |
| `unknown_attestation` | That is not an attestation preference. |  |
| `unknown_mediation` | That is not a mediation mode. |  |
| `unknown_resident_key` | That is not a resident-key preference. |  |
| `unknown_verification` | That is not a user-verification preference. |  |
| `unsupported_device` | This device cannot do a platform passkey: the browser has no WebAuthn or the OS has no passkey provider. |  |
| `unsupported_os` | Passkeys need Android 9 (API 28) or newer. |  |

## Related packages

- Works better with: [Passkeys](/packages/passkeys)
- Used by: [AppLock](/packages/applock), [IdentityVault](/packages/identityvault)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
