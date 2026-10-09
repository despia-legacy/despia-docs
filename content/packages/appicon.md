---
title: AppIcon
description: Let people choose the app icon shown on their home screen.
package: appicon
---

Let people choose the app icon shown on their home screen.

Switches the home screen icon between the icons you declare once in your project, and tells you which icon is showing. On iOS the change is immediate with the system's own alert; on Android it applies when the app is left. You design the icons and your picker screen.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when you want a setting that lets people pick an app icon, such as a dark or seasonal one. It is not available on the web, and it only works with icons you declared before the build.

## What native adds

The home screen icon itself changes, which a web page can never do.

## Install

```sh
despia add Core/Basics/AppIcon
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

## Actions

### current

`dsx.module.appicon.current`

Returns the icon showing now and, on Android, the icon that will show once the app is left.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | yes | The icon that is showing now, or that was requested. |
| `pending` | string | yes | On Android, the icon that will show once the app leaves the foreground; empty when nothing is waiting. For set it is true when the change is waiting. |

**Example: reports the primary icon when no alternate is applied**

```js
const result = await dsx.module.appicon.current({});
// resolves {"name":"default","pending":""}
```

### list

`dsx.module.appicon.list`

Lists the icon names the build carries, starting with default, together with the current and pending icon.

**When to use it.** Use it to fill an icon picker.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `current` | string | yes | The name of the icon showing on the home screen right now. |
| `icons` | array of string | yes | The icon names the build carries, starting with default. |
| `pending` | string | yes | On Android, the icon that will show once the app leaves the foreground; empty when nothing is waiting. For set it is true when the change is waiting. |

**Example: lists the primary icon first, then every icon the build carries**

```js
const result = await dsx.module.appicon.list({});
// resolves {"current":"default","icons":["default","midnight","classic"],"pending":""}
```

### reset

`dsx.module.appicon.reset`

Switches back to the app's main icon.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | yes | The icon that is showing now, or that was requested. |
| `ok` | boolean | yes | True when the switch was accepted. |
| `pending` | boolean | yes | On Android, the icon that will show once the app leaves the foreground; empty when nothing is waiting. For set it is true when the change is waiting. |
| `reason` | string | yes | If the change could not be applied, why. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_device` | This build carries no alternate icon to switch to. | Declare at least one alternate icon, or hide the icon picker. |

**Example: restores the primary icon**

```js
const result = await dsx.module.appicon.reset({});
// resolves {"name":"default","ok":true,"pending":false,"reason":""}
```

### set

`dsx.module.appicon.set`

Switches the home screen icon to one of the icons you declared, or back to the main one with the name default.

**When to use it.** Call it when the user picks an icon. iOS always shows its own alert; Android switches after the app is left.

**When not to.** Check dsx.has("appicon.set") first and hide your picker where it is false.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | yes | The icon name to switch to, exactly as declared in your icon list, or default for the main icon. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | yes | The icon that is showing now, or that was requested. |
| `ok` | boolean | yes | True when the switch was accepted. |
| `pending` | boolean | yes | On Android, the icon that will show once the app leaves the foreground; empty when nothing is waiting. For set it is true when the change is waiting. |
| `reason` | string | yes | If the change could not be applied, why. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unknown_icon` | The app declares no icon with that name. | Use a name from the list action. |
| `unsupported_device` | This build carries no alternate icon to switch to. | Declare at least one alternate icon, or hide the icon picker. |

**Example: switches to a declared icon**

```js
const result = await dsx.module.appicon.set({"name":"midnight"});
// resolves {"name":"midnight","ok":true,"pending":false,"reason":""}
```

**Example: Android records the choice and applies it when the app leaves the foreground**

```js
const result = await dsx.module.appicon.set({"name":"midnight"});
// resolves {"name":"midnight","ok":true,"pending":true,"reason":""}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `icons` | json | `` | The alternate app icons this app ships. Each is { name, image } plus optional dark, tinted (iOS 18), monochrome (Android 13 themed), foreground and background (Android adaptive layers). Paths are relative to the project; every image is a square 1024x1024 PNG. dsx.module.appicon.set({ name }) switches to one. |
| `primary` | json | `{}` | Optional variants of the primary icon (Assets/Icons/marketing.png): dark, tinted, monochrome, foreground, background. Same fields and rules as an alternate icon, without name or image. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
