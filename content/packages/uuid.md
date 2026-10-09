---
title: DeviceUUID
description: Gives your app a stable anonymous id for each install, with no permission prompt.
package: uuid
---

Gives your app a stable anonymous id for each install, with no permission prompt.

Returns one identifier that stays the same across launches. It uses the vendor id on iOS, and a generated id kept safely on Android, desktop and the web. It is not an advertising id and cannot be used to fingerprint the device.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to recognise the same install across launches, for example to attach anonymous settings or sessions to a device. Do not use it as an advertising id or for tracking across other companies' apps.

## What native adds

The web can only keep an id in local storage, which is easily cleared. On iOS the vendor id survives reinstalls while any of your apps remains.

## Install

```sh
despia add Core/DeviceUUID
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

### get

`dsx.module.uuid.get`

Returns the stable id for this install. On iOS it is empty for a moment after install until the device is first unlocked, so treat empty as not ready and ask again.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uuid` | string | yes | The identifier for this install, or an empty value on iOS before the first unlock. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `app_identity_missing` | On desktop, the app has no stable app id to attach the identifier to. | Configure a stable DSX desktop app id for the app. |
| `persistence_unavailable` | The place where the identifier is kept is not available. | Try again later, and do not rely on the id for this launch. |

**Example: hands back the stable installation identifier**

```js
const result = await dsx.module.uuid.get({});
// resolves {"uuid":"1A2B3C4D-5E6F-7081-92A3-B4C5D6E7F809"}
```

**Example: reports the empty identifier iOS returns before the first unlock**

```js
const result = await dsx.module.uuid.get({});
// resolves {"uuid":""}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
