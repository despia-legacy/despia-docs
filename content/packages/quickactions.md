---
title: QuickActions
description: Add shortcuts to your app icon's long-press menu on the Home screen.
package: quickactions
---

Add shortcuts to your app icon's long-press menu on the Home screen.

Lets you set the shortcuts that appear when someone presses and holds your app icon, each with a title, an icon and a value. When one is chosen the app opens and your code is told which value was picked, whether the app was closed or already running. You choose the items and decide what each one does.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to give quick routes into your app, such as New message or Scan, from the Home screen icon. The shortcuts are shown by the system, so keep them few and short.

## What native adds

The shortcuts live in the system's icon menu, outside your app, and work even when the app is not running.

## Install

```sh
despia add Core/QuickActions
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

## Actions

### clear

`dsx.module.quickactions.clear`

Removes all the shortcuts from the app icon's menu.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the shortcuts were removed. |

**Example: clears the menu**

```js
const result = await dsx.module.quickactions.clear({});
// resolves {"ok":true}
```

### get

`dsx.module.quickactions.get`

Reads the shortcuts that are currently set, including the ones kept from an earlier launch.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many shortcuts are set. |
| `items` | array of object | yes | The shortcuts that are set. |

**Example: reads the menu back**

```js
const result = await dsx.module.quickactions.get({});
// resolves {"count":0,"items":[]}
```

### set

`dsx.module.quickactions.set`

Sets the shortcuts shown when the app icon is long pressed, replacing the ones set before.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `items` | array of object | no | The shortcuts to show. An item without a title or a value is dropped. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many shortcuts were set. |

**Example: sets the Home-screen menu**

```js
const result = await dsx.module.quickactions.set({"items":[{"symbol":"magnifyingglass","title":"Search","value":"search"}]});
// resolves {"count":1}
```

## Events

Read with `dsx.on(name, handler)`.

### tap

Fires when the person chooses one of your shortcuts, including when it launched the app.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `value` | string | yes | The value of the shortcut that was chosen. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
