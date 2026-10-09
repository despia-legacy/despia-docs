---
title: IdentityVault
description: Stores small secrets on the device in the system keychain, with an optional Face ID or fingerprint lock.
package: identityvault
---

Stores small secrets on the device in the system keychain, with an optional Face ID or fingerprint lock.

Writes and reads small pieces of text, such as an anonymous user id or a token, in the secure store of the device. Records can be locked so they release only after Face ID, Touch ID or the passcode, and can follow the user to a new phone through iCloud Keychain or Google Block Store. It also reports honestly how long a record will last.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it for small secrets that must survive reinstalls or follow the user, such as an anonymous identity behind a purchase. Do not use it for large data or ordinary settings.

## What native adds

The web has no secure store that survives, and no way to tie a value to biometrics. The keychain and hardware keys keep secrets encrypted and can bring them to a new phone.

## Install

```sh
despia add Core/IdentityVault
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

### durability

`dsx.module.identityvault.durability`

Reports how long stored records will last and how far they reach, for example whether they follow the user to a new phone. It never fails and says none when nothing can be stored.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `durability` | string | yes | How long records last: synced, device, session or none. |
| `evictable` | boolean | yes | True if the platform may clear the records by itself. |
| `plane` | string | yes | Where the records are held, such as the synced keychain or device-only storage. |
| `proven` | boolean | yes | True if a record from another install has been read on this device. |
| `reason` | string | yes | A plain explanation when the level is lower than expected. |
| `restorable` | boolean | yes | True if the platform's cross-device store was used, so a new phone can recover the records. |

**Example: reports what the deployment actually got, not what it asked for**

```js
const result = await dsx.module.identityvault.durability({});
// resolves {"durability":"synced","evictable":false,"plane":"keychain_synced","proven":false,"reason":"","restorable":true}
```

**Example: a deployment that turned cloud_sync off is device-only, and the reason says so**

```js
const result = await dsx.module.identityvault.durability({});
// resolves {"durability":"device","evictable":false,"plane":"keychain_device","proven":false,"reason":"sync_off","restorable":false}
```

### read

`dsx.module.identityvault.read`

Reads the value stored under a key. A locked record shows the biometric prompt first, and a successful read also sets the value on the page under the key name for older pages.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The name the value was stored under. |
| `reason` | string | no | The text shown in the biometric prompt for a locked record. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The key that was read. |
| `locked` | boolean | yes | True if the record is locked behind biometrics. |
| `value` | string | yes | The text that was stored under the key. |

**Example: reads a stored record**

```js
const result = await dsx.module.identityvault.read({"key":"token"});
// resolves {"key":"token","locked":false,"value":"abc123"}
```

**Example: reads the device credential back at every boot**

```js
const result = await dsx.module.identityvault.read({"key":"dsx.device"});
// resolves {"key":"dsx.device","locked":false,"value":"{\"deviceId\":\"3f1c…\",\"secret\":\"…\"}"}
```

### write

`dsx.module.identityvault.write`

Saves a value under a key. With locked set to true, the value is tied to the user's biometrics and can only be read after they authenticate.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `allowPasscode` | boolean | no | Set to true to let the device passcode unlock a locked record as well. |
| `key` | string | yes | The name to store the value under. |
| `locked` | boolean | no | Set to true to require Face ID, Touch ID or a fingerprint before the value can be read. |
| `reason` | string | no | The text shown in the biometric prompt. |
| `value` | string | no | The text you want to store under the key. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The key the value was stored under. |
| `locked` | boolean | yes | True if the record is locked behind biometrics. |
| `protection` | string | no | What holds a locked record: secure_enclave, strongbox, tee or prf. |

**Example: stores a record**

```js
const result = await dsx.module.identityvault.write({"key":"token","locked":false,"value":"abc123"});
// resolves {"key":"token","locked":false}
```

**Example: stores a device credential without prompting**

```js
const result = await dsx.module.identityvault.write({"key":"dsx.device","locked":false,"value":"{\"deviceId\":\"3f1c…\",\"secret\":\"…\"}"});
// resolves {"key":"dsx.device","locked":false}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `accessibility` | string | `whenUnlocked` | "whenUnlocked" (default) allows reads only while the device is unlocked. "afterFirstUnlock" also allows reads while it is locked, once the user has unlocked it after a restart. |
| `cloud_sync` | boolean | `true` | On by default. Records are also kept in the platform's own cross-device credential store: iCloud Keychain on iOS, Google Play Block Store on Android: so a person who buys a new phone keeps the identity they paid with. Turn it off only for a record that must stay on one device. A browser has no equivalent; the web reports that rather than pretending. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `auth_failed` | The user did not pass the biometric check. | Let them try again, or fall back to another sign-in. |
| `cancelled` | The user dismissed the biometric prompt. | Treat it as a normal choice and do not ask again at once. |
| `encode_failed` | The record could not be prepared for storage. | Check that the value is plain text. |
| `invalidated` | The biometrics on the device changed, so the locked record can no longer be opened and was erased. | Have the user sign in again to set the secret up anew. |
| `missing_key` | The call has no key to look up or store under. | Pass a key. |
| `not_found` | Nothing is stored under that key. | Treat it as a new user, or write a value first. |
| `not_set_up` | No biometrics are set up on this device, so a locked record cannot be bound to them. | Ask the user to set up Face ID, Touch ID or a fingerprint, or store the value unlocked. |
| `store_unavailable` | The secure store is not available right now. | Try again in a moment. |
| `unsupported_device` | This device has no hardware that can bind a record to biometrics. | Store the value unlocked, or use another way to protect it. |

## Related packages

- Needs: [Biometric](/packages/biometric)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
