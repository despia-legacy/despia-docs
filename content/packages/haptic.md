---
title: Haptics
description: Add vibration feedback to taps and results.
package: haptic
---

Add vibration feedback to taps and results.

Plays short vibrations: light, medium and heavy taps for touches, and success, warning and error patterns for outcomes. Also supports custom patterns. Use it to make buttons and confirmations feel responsive. Needs no setup or permission.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for a small physical confirmation of a touch or an outcome, such as a toggle, a saved item or a failed payment. Do not buzz on every scroll frame or for things the person cannot connect to an action.

## What native adds

Uses the phone's real vibration hardware (Taptic Engine on iPhone), which a web page cannot trigger.

## Install

```sh
despia add Core/Basics/Haptics
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

## Actions

### error

`dsx.module.haptic.error`

Plays a sharp triple tap that signals that an action failed.

**When to use it.** Use it when a request fails or input is rejected.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True once the vibration was requested. |

**Example: fires an error notification**

```js
const result = await dsx.module.haptic.error({});
// resolves {"ok":true}
```

### heavy

`dsx.module.haptic.heavy`

Plays a firm single tap.

**When to use it.** Use it for a long press or a significant touch.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True once the vibration was requested. |

**Example: fires a heavy impact**

```js
const result = await dsx.module.haptic.heavy({});
// resolves {"ok":true}
```

### light

`dsx.module.haptic.light`

Plays a light single tap.

**When to use it.** Use it when the person touches something small, such as a toggle or a selection change.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True once the vibration was requested. |

**Example: fires a light impact**

```js
const result = await dsx.module.haptic.light({});
// resolves {"ok":true}
```

### medium

`dsx.module.haptic.medium`

Plays a medium-firm single tap.

**When to use it.** Use it for a button press or other touch that deserves a clearer response.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True once the vibration was requested. |

**Example: fires a medium impact**

```js
const result = await dsx.module.haptic.medium({});
// resolves {"ok":true}
```

### pattern

`dsx.module.haptic.pattern`

Plays a custom sequence of vibrations that you describe event by event.

**When to use it.** Use it when the six built-in styles do not fit, for a signature feel for your app.

**When not to.** For ordinary touch feedback, prefer light, medium, heavy, success, warning or error.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `events` | array of object | yes | The vibrations to play in order, each with an optional delay, duration, intensity from 0 to 1 and sharpness from 0 to 1. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `fallback` | string | no | Set when the device could not play the full pattern: impact means a series of simple taps was used, none means the device cannot vibrate. |
| `ok` | boolean | yes | True once the pattern was requested. |

**Example: plays a custom CoreHaptics pattern**

```js
const result = await dsx.module.haptic.pattern({"events":[{"duration":0.2,"intensity":1,"sharpness":0.5}]});
// resolves {"ok":true}
```

**Example: reports the degradation when the device cannot play the pattern**

```js
const result = await dsx.module.haptic.pattern({"events":[{"duration":0.2,"intensity":1,"sharpness":0.5}]});
// resolves {"fallback":"none","ok":true}
```

### success

`dsx.module.haptic.success`

Plays an upbeat double tap that signals something finished cleanly.

**When to use it.** Use it after a save, a payment or any completed action.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True once the vibration was requested. |

**Example: fires a success notification**

```js
const result = await dsx.module.haptic.success({});
// resolves {"ok":true}
```

### warning

`dsx.module.haptic.warning`

Plays two heavy taps that signal a problem the person can recover from.

**When to use it.** Use it when something needs attention but did not fail.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True once the vibration was requested. |

**Example: fires a warning notification**

```js
const result = await dsx.module.haptic.warning({});
// resolves {"ok":true}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
