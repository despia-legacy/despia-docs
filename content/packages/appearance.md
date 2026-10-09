---
title: Appearance
description: Let people choose light, dark or the system look for the whole app.
package: appearance
---

Let people choose light, dark or the system look for the whole app.

Sets one color scheme for every part of the app at once: system bars, sheets, materials, colors and the web view. The user's choice is remembered between launches, and you can set a design default for apps that look best in only light or only dark. You build the settings control.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when your app offers a light, dark or automatic setting, or when your design is dark only and you want the system bars to match.

## Install

```sh
despia add Core/Basics/Appearance
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

`dsx.module.appearance.get`

Returns the chosen appearance and what is actually showing, which is light or dark.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `mode` | string | yes | The chosen appearance: system, light or dark. |
| `resolved` | string | yes | What is actually showing, light or dark; with system it follows the device. |

**Example: reports the active preference and the resolved scheme**

```js
const result = await dsx.module.appearance.get({});
// resolves {"mode":"system","resolved":"light"}
```

### seed

`dsx.module.appearance.seed`

Sets the design default for this launch without saving it, so a choice the user made earlier still wins.

**When to use it.** Use it on your first screen for an app designed in one look.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `mode` | string | yes | The appearance to use: system, light or dark. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `applied` | boolean | yes | True when the new appearance was applied. |
| `mode` | string | yes | The chosen appearance: system, light or dark. |
| `resolved` | string | yes | What is actually showing, light or dark; with system it follows the device. |
| `seeded` | boolean | yes | True when the design default was used, and false when a saved user choice won. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_mode` | The mode is not system, light or dark. | Pass system, light or dark. |

**Example: adopts the design default when the user has not chosen**

```js
const result = await dsx.module.appearance.seed({"mode":"dark"});
// resolves {"applied":true,"mode":"dark","resolved":"dark","seeded":true}
```

### set

`dsx.module.appearance.set`

Sets the app-wide appearance to system, light or dark and remembers the choice between launches.

**When to use it.** Call it from the user's settings control.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `mode` | string | yes | The appearance to use: system, light or dark. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `applied` | boolean | yes | True when the new appearance was applied. |
| `mode` | string | yes | The chosen appearance: system, light or dark. |
| `resolved` | string | yes | What is actually showing, light or dark; with system it follows the device. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_mode` | The mode is not system, light or dark. | Pass system, light or dark. |
| `storage_unavailable` | The choice could not be saved on this device. | Try again after the app has finished starting. |

**Example: pins the app dark**

```js
const result = await dsx.module.appearance.set({"mode":"dark"});
// resolves {"applied":true,"mode":"dark","resolved":"dark"}
```

**Example: reports the pin as unapplied where no OS override plane exists**

```js
const result = await dsx.module.appearance.set({"mode":"dark"});
// resolves {"applied":false,"mode":"dark","resolved":"light"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `mode` | string | `system` | The look for the whole app: system follows the device, or force light or dark. It applies to every screen, sheet, navigation bar and the web view. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
