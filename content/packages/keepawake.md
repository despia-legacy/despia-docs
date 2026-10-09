---
title: KeepAwake
description: Keep the screen from dimming or locking while something on screen needs to stay visible.
package: keepawake
---

Keep the screen from dimming or locking while something on screen needs to stay visible.

Holds the display awake for a video, a recipe, a scanner or a map. Each screen takes its own named hold and the screen may sleep again only when the last hold is released, so two screens cannot undo each other. You can also keep the whole app awake. It draws nothing and needs no permission.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it while something on screen needs to stay readable without touches, such as a video, a recipe or turn-by-turn directions. Release it when you are done so the battery is not drained.

## Install

```sh
despia add Core/KeepAwake
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

### activate

`dsx.module.keepawake.activate`

Takes a hold that keeps the screen awake. Taking the same name twice does nothing extra, and the screen stays awake until every hold is released.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `tag` | string | no | A name for this hold, such as player. Leave out to use a shared default name. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `active` | boolean | yes | True when something is currently keeping the screen awake. |
| `prevented` | boolean | yes | True when the app-wide hold that keeps the screen awake is on. |
| `tags` | array of string | yes | The names of the screens or features that currently hold the screen awake. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_tag` | tag must be a non-empty string. | Not recoverable by retrying. |
| `unsupported_platform` | This browser has no Screen Wake Lock API. | Not recoverable by retrying. |

**Example: one holder keeps the display awake**

```js
const result = await dsx.module.keepawake.activate({"tag":"scanner"});
// resolves {"active":true,"prevented":false,"tags":["scanner"]}
```

**Example: an omitted tag takes the default holder**

```js
const result = await dsx.module.keepawake.activate({});
// resolves {"active":true,"prevented":false,"tags":["default"]}
```

### deactivate

`dsx.module.keepawake.deactivate`

Releases a hold you took. The screen may sleep again only when no holds remain, and releasing a name nobody holds is harmless.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `tag` | string | no | The name of the hold to release. Leave out to release the default one. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `active` | boolean | yes | True when something is currently keeping the screen awake. |
| `prevented` | boolean | yes | True when the app-wide hold that keeps the screen awake is on. |
| `tags` | array of string | yes | The names of the screens or features that currently hold the screen awake. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_tag` | tag must be a non-empty string. | Not recoverable by retrying. |

**Example: two activates and one deactivate leaves it active**

```js
const result = await dsx.module.keepawake.deactivate({"tag":"player"});
// resolves {"active":true,"prevented":false,"tags":["scanner"]}
```

**Example: releasing the last holder lets the display sleep**

```js
const result = await dsx.module.keepawake.deactivate({"tag":"scanner"});
// resolves {"active":false,"prevented":false,"tags":[]}
```

### preventSleep

`dsx.module.keepawake.preventSleep`

Turns the app-wide hold on or off while the app runs, independent of the per-screen holds. The starting value comes from the package setting.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | yes | True to keep the screen awake for the whole app, false to stop doing so. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `active` | boolean | yes | True when something is currently keeping the screen awake. |
| `prevented` | boolean | yes | True when the app-wide hold that keeps the screen awake is on. |
| `tags` | array of string | yes | The names of the screens or features that currently hold the screen awake. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_on` | on must be true or false. | Not recoverable by retrying. |
| `unsupported_platform` | This browser has no Screen Wake Lock API. | Not recoverable by retrying. |

**Example: holds the display awake for the whole app with no tag anywhere**

```js
const result = await dsx.module.keepawake.preventSleep({"on":true});
// resolves {"active":true,"prevented":true,"tags":[]}
```

**Example: redefines a live hold back to off**

```js
const result = await dsx.module.keepawake.preventSleep({"on":false});
// resolves {"active":false,"prevented":false,"tags":[]}
```

### status

`dsx.module.keepawake.status`

Reports whether anything is keeping the screen awake right now, and which holds are in place.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `active` | boolean | yes | True when something is currently keeping the screen awake. |
| `prevented` | boolean | yes | True when the app-wide hold that keeps the screen awake is on. |
| `tags` | array of string | yes | The names of the screens or features that currently hold the screen awake. |

**Example: reports nothing holding on a fresh app**

```js
const result = await dsx.module.keepawake.status({});
// resolves {"active":false,"prevented":false,"tags":[]}
```

**Example: reports every live holder**

```js
const result = await dsx.module.keepawake.status({});
// resolves {"active":true,"prevented":false,"tags":["scanner","player"]}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `prevent_sleep` | boolean | `false` | Keep the screen awake while the app is open. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
