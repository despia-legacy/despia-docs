---
title: Orientation
description: Lock or unlock the screen orientation while the app runs.
package: orientation
---

Lock or unlock the screen orientation while the app runs.

Lets a screen lock portrait or landscape while it is shown and return to the app's normal setting when it leaves, for example a video that goes fullscreen sideways. You can lock from code or declare it on a screen, and read the live orientation and changes. You choose which orientations the app is built to allow.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when a screen needs a fixed orientation, such as fullscreen video, a camera or a game. If the whole app is always portrait, set that once at build time instead.

## What native adds

Native orientation control rotates the real interface and keeps the system rotation in step, which a web page can only ask for in a few browsers.

## Install

```sh
despia add Core/Orientation
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone.

## Actions

### claim

`dsx.module.orientation.claim`

Registers the lock that a screen declares, keyed by that screen.

**When to use it.** The app's screen router calls this for you when a screen declares an orientation; you rarely need it yourself.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `surface` | string | yes | The identity of the screen or modal that asks for the lock. |
| `to` | string | yes | The orientation that screen asks for. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `locked` | boolean | yes | True when a lock is now active. |
| `orientation` | string | yes | The orientation the screen is now in. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_allowed` | This app was not built to support that orientation. | Not recoverable by retrying. |
| `unknown_orientation` | That is not an orientation. Use portrait, portraitUpsideDown, landscape, landscapeLeft, landscapeRight, all or current. | Not recoverable by retrying. |

**Example: a surface claims landscape and the device follows**

```js
const result = await dsx.module.orientation.claim({"surface":"frame:2","to":"landscape"});
// resolves {"locked":true,"orientation":"landscapeLeft"}
```

**Example: a second surface claims on top without disturbing the first**

```js
const result = await dsx.module.orientation.claim({"surface":"modal:7","to":"portrait"});
// resolves {"locked":true,"orientation":"portrait"}
```

### get

`dsx.module.orientation.get`

Reads the current orientation, whether a lock is active and which orientations the app was built to allow.

**When to use it.** Use it to choose a layout or to know whether a lock is held. It changes nothing.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `allowed` | array of string | yes | The orientations that the app was built to allow. |
| `isLandscape` | boolean | yes | True when the screen is wider than it is tall. |
| `locked` | boolean | yes | True while some lock is holding the orientation. |
| `orientation` | string | yes | The orientation now, such as portrait or landscapeLeft. |

**Example: reports the live orientation with nothing locked**

```js
const result = await dsx.module.orientation.get({});
// resolves {"allowed":["portrait","landscapeLeft","landscapeRight"],"isLandscape":false,"locked":false,"orientation":"portrait"}
```

**Example: reports landscape while a lock is held**

```js
const result = await dsx.module.orientation.get({});
// resolves {"allowed":["portrait","landscapeLeft","landscapeRight"],"isLandscape":true,"locked":true,"orientation":"landscapeLeft"}
```

### lock

`dsx.module.orientation.lock`

Locks the screen to one orientation and rotates to it now.

**When to use it.** Use it from code, for example when a video goes fullscreen. Call unlock when it ends.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `to` | string | yes | The orientation to lock: portrait, portraitUpsideDown, landscape, landscapeLeft, landscapeRight or a similar word the error message lists. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `locked` | boolean | yes | True when a lock is now active. |
| `orientation` | string | yes | The orientation the screen is now in. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_allowed` | This app was not built to support that orientation. | Not recoverable by retrying. |
| `unknown_orientation` | That is not an orientation. Use portrait, portraitUpsideDown, landscape, landscapeLeft, landscapeRight, all or current. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot control screen orientation. | Not recoverable by retrying. |

**Example: locks to landscape and reports where it landed**

```js
const result = await dsx.module.orientation.lock({"to":"landscape"});
// resolves {"locked":true,"orientation":"landscapeLeft"}
```

**Example: locks to portrait**

```js
const result = await dsx.module.orientation.lock({"to":"portrait"});
// resolves {"locked":true,"orientation":"portrait"}
```

### release

`dsx.module.orientation.release`

Releases the lock that one screen registered, so the screen underneath resumes or the app default returns.

**When to use it.** The app's screen router calls this for you when a screen leaves; you rarely need it yourself.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `surface` | string | yes | The identity of the screen or modal whose lock is released. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `locked` | boolean | yes | True while another lock is still holding the orientation. |
| `orientation` | string | yes | The orientation the screen is now in. |

**Example: releasing the only claim returns the app default**

```js
const result = await dsx.module.orientation.release({"surface":"frame:2"});
// resolves {"locked":false,"orientation":"landscapeLeft"}
```

**Example: releasing a surface that never claimed is a no-op**

```js
const result = await dsx.module.orientation.release({"surface":"frame:99"});
// resolves {"locked":false,"orientation":"portrait"}
```

### unlock

`dsx.module.orientation.unlock`

Releases the lock that lock set, so the screen is free to rotate again.

**When to use it.** Use it when the screen that needed a fixed orientation closes. A lock declared on a screen stays in force underneath.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `locked` | boolean | yes | True while some other lock is still holding the orientation. |
| `orientation` | string | yes | The orientation the screen is now in. |

**Example: releases the imperative lock and lets the device rotate again**

```js
const result = await dsx.module.orientation.unlock({});
// resolves {"locked":false,"orientation":"landscapeLeft"}
```

**Example: unlocking when nothing is locked is a no-op**

```js
const result = await dsx.module.orientation.unlock({});
// resolves {"locked":false,"orientation":"portrait"}
```

## Events

Read with `dsx.on(name, handler)`.

### change

Tells you the screen orientation changed, either because of a lock or because the device was turned.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `orientation` | string | yes | The orientation the screen is in now. |
| `previous` | string | yes | The orientation before the change. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
