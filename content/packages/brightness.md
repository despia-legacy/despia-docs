---
title: ScreenBrightness
description: Raise or lower the screen brightness and put it back afterwards.
package: brightness
---

Raise or lower the screen brightness and put it back afterwards.

Sets the screen brightness from 0 to 1, reads it, and restores the level the person had before. The original level is remembered the first time you set it and is put back automatically when the app goes to the background, so your change never outlives the app. No permission is needed. You decide when to brighten the screen.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when the screen must be bright for a moment, for example to show a barcode or a QR code to a scanner. Always restore when you are done, and do not use it to dim the screen to save power.

## What native adds

It changes the real screen brightness, which a web page is not allowed to do.

## Install

```sh
despia add Core/ScreenBrightness
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

## Actions

### get

`dsx.module.brightness.get`

Reads the current screen brightness.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | number | yes | The current brightness from 0 to 1. |

**Example: reports the live screen brightness**

```js
const result = await dsx.module.brightness.get({});
// resolves {"level":1}
```

### restore

`dsx.module.brightness.restore`

Puts back the brightness the person had before you changed it. It also happens by itself when the app goes to the background.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | number | yes | The brightness after restoring, from 0 to 1. |

**Example: reports the level after putting the user's back**

```js
const result = await dsx.module.brightness.restore({});
// resolves {"level":1}
```

### set

`dsx.module.brightness.set`

Sets the screen brightness. The level the person had is remembered on the first call so restore can put it back.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | number | yes | The brightness from 0 (darkest the device allows) to 1 (full). |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | number | yes | The brightness that is now set, from 0 to 1. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_level` | The level is not a number between 0 and 1. | Pass a number from 0 to 1. |

**Example: pins the display to full brightness**

```js
const result = await dsx.module.brightness.set({"level":1});
// resolves {"level":1}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
