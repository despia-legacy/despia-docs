---
title: Spinner
description: Show or hide the page-load activity indicator.
package: spinner
---

Show or hide the page-load activity indicator.

Puts a centered activity indicator over the web surface and lets you show or hide it from your code. It only draws the spinner and does not decide when to spin: the app shell keeps the loading rules for splash and first load. It follows the live web view across page loads. You decide when to call show and hide.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when you want to show a loading spinner over the web surface yourself, for example during your own long task. You do not need it for normal page loads, which the app shell handles.

## Install

```sh
despia add Core/Basics/Spinner
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

### hide

`dsx.module.spinner.hide`

Hides the activity indicator again.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the spinner was hidden. |

**Example: lowers the busy indicator**

```js
const result = await dsx.module.spinner.hide({});
// resolves {"ok":true}
```

**Example: hiding when nothing is shown is not an error**

```js
const result = await dsx.module.spinner.hide({});
// resolves {"ok":true}
```

### show

`dsx.module.spinner.show`

Shows the activity indicator over the web surface right away, without any loading rule. Pair it with hide.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the spinner was shown. |

**Example: raises the busy indicator**

```js
const result = await dsx.module.spinner.show({});
// resolves {"ok":true}
```

**Example: showing twice is not an error**

```js
const result = await dsx.module.spinner.show({});
// resolves {"ok":true}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
