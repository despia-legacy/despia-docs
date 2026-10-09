---
title: Automotive
description: Run your app on cars that have Android built in, using Android Automotive OS.
package: automotive
---

Run your app on cars that have Android built in, using Android Automotive OS.

Adds Android Automotive OS support to the Car package. Cars with Android built in need their own app build, and this package makes that build: you export for the automotive track and the car launches your car templates directly. Include it only in the build you ship to the automotive track, since a phone build that contains it is refused. Android only.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when you ship a car app to the Android Automotive track on Google Play, for cars that run Android themselves. Skip it for phone projection through Android Auto or CarPlay, which the Car package already covers.

## Install

```sh
despia add Core/Extensions/Car/Modules/Automotive
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | yes |
| web | no |
| macos | no |

## Actions

### status

`dsx.module.automotive.status`

Tells you whether the running device is an Android Automotive OS car and whether it has the car app templates host. Use it to branch on car-only behaviour or to explain why templates cannot show.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `automotive` | boolean | yes | True when the device is a car that runs Android Automotive OS, false on phones and emulators. |
| `templatesHost` | boolean | yes | True when the device has the host that shows car app templates, which the car screens need. |

**Example: a phone or emulator answers that it is not a car**

```js
const result = await dsx.module.automotive.status({});
// resolves {"automotive":false,"templatesHost":false}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
