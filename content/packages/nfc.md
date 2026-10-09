---
title: NFC tags
description: Read and write NFC tags from your app.
package: nfc
---

Read and write NFC tags from your app.

Reads NDEF tags and writes a text record to them. Needs the NFC Tag Reading capability enabled on your Apple App ID and a phone that supports NFC. It is off by default and you turn it on when you want it.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when your app should read an NFC tag the user holds to the phone, or write a short text onto one, for example for check-ins, product tags or pairing. It reads and writes text tags only, and needs a phone with NFC.

## What native adds

Reading tags uses the phone's own NFC scan sheet, which a web page cannot open on iPhone.

## Install

```sh
despia add Core/NFC
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

## Actions

### permission.manage

`dsx.module.nfc.permission.manage`

Lets the user change a limited NFC selection where the system offers one; otherwise it reports the current state with changed set to false.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `changed` | boolean | yes | True when the selection was changed; always false when there is nothing to change. |
| `level` | string | no | The level of access granted, where the platform has levels. |
| `status` | string | yes | The permission state: granted, denied, not determined, restricted or unavailable. |

**Example: nothing limited to manage**

```js
const result = await dsx.module.nfc.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.nfc.permission.openSettings`

Opens this app's page in the system Settings so the user can change the NFC permission.

**When to use it.** Call it from a button the user tapped, after the OS can no longer ask.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when the Settings page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | The system Settings page could not be opened on this device. | Tell the user to open Settings by hand. |
| `unsupported_platform` | This action does not exist on the current platform, for example opening Settings from a web page. | Hide the control on this platform. |

**Example: opens the app page**

```js
const result = await dsx.module.nfc.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.nfc.permission.request`

Shows the system NFC permission dialog when the OS can still ask, and reports the resulting state.

**When to use it.** Use it from an onboarding step or a settings row. Feature calls ask on their own when they need to.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `level` | string | no | The level of access granted, where the platform has levels. |
| `status` | string | yes | The permission state: granted, denied, not determined, restricted or unavailable. |

**Example: granted**

```js
const result = await dsx.module.nfc.permission.request({});
// resolves {"canAsk":false,"status":"granted"}
```

### permission.status

`dsx.module.nfc.permission.status`

Reads the current NFC permission without ever showing a dialog, so a settings screen can call it every time it appears.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `level` | string | no | The level of access granted, where the platform has levels. |
| `status` | string | yes | The permission state: granted, denied, not determined, restricted or unavailable. |

**Example: never asked**

```js
const result = await dsx.module.nfc.permission.status({});
// resolves {"canAsk":true,"status":"undetermined"}
```

**Example: a final denial: only Settings helps**

```js
const result = await dsx.module.nfc.permission.status({});
// resolves {"canAsk":false,"status":"denied"}
```

### read

`dsx.module.nfc.read`

Opens the system scan sheet, reads the first NDEF tag the user holds to the phone, and returns its records.

**When to use it.** Call it when the user taps a scan button; the sheet closes after the first tag.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `message` | string | no | The text shown in the system scan sheet while it waits for a tag. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `records` | array of object | yes | The records found on the tag, each with its format, type, identifier and payload. |
| `tagId` | string | yes | The id of the tag that was read, where the platform provides one. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | Another NFC read or write is still in progress. | Wait for it to finish, then try again. |
| `cancelled` | The user closed the scan sheet. | Treat it as a normal answer and do nothing. |
| `permission_denied` | The user declined NFC access in the browser. Native apps do not raise this. | Explain why you need NFC and ask the user to allow it. |
| `read_failed` | The tag could not be read. | Ask the user to hold the tag steady and try again. |
| `switched_off` | NFC is turned off in the device settings. | Ask the user to turn NFC on, then try again. |
| `unavailable` | The system Settings page could not be opened on this device. | Tell the user to open Settings by hand. |
| `unsupported_device` | This device has no NFC chip, as on an iPad, a simulator or a phone without NFC. | Hide the NFC feature on this device. |

**Example: reads the first NDEF message**

```js
const result = await dsx.module.nfc.read({"message":"Hold a tag near the phone."});
// resolves {"records":[{"format":"nfcWellKnown","identifier":"","payload":"hello","type":"T"}],"tagId":""}
```

### write

`dsx.module.nfc.write`

Opens the system scan sheet and writes one text record onto a writable NDEF tag the user holds to the phone.

**When not to.** It writes only a text record; other record types such as links are not supported.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `lang` | string | no | The language code saved with the text, such as en. The default is en. |
| `message` | string | no | The text shown in the system scan sheet while it waits for a tag. |
| `text` | string | yes | The text to write onto the tag. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the tag accepted the write. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | Another NFC read or write is still in progress. | Wait for it to finish, then try again. |
| `cancelled` | The user closed the scan sheet. | Treat it as a normal answer and do nothing. |
| `missing_param` | The write call had no text to write. | Pass a non-empty text value. |
| `permission_denied` | The user declined NFC access in the browser. Native apps do not raise this. | Explain why you need NFC and ask the user to allow it. |
| `switched_off` | NFC is turned off in the device settings. | Ask the user to turn NFC on, then try again. |
| `unavailable` | The system Settings page could not be opened on this device. | Tell the user to open Settings by hand. |
| `unsupported_device` | This device has no NFC chip, as on an iPad, a simulator or a phone without NFC. | Hide the NFC feature on this device. |
| `write_failed` | The tag could not be written, for example because it is locked, not writable or moved away. | Try again with a writable tag held steady. |

**Example: writes a text record to the tag**

```js
const result = await dsx.module.nfc.write({"lang":"en","message":"Hold a writable tag near the phone.","text":"hello"});
// resolves {"ok":true}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `usage_description` | multiline | `Read and write NFC tags.` | The message shown when iOS asks the user for NFC tag scanning. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `session_failed` | The scan session ended in an unexpected way. | Try again. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
