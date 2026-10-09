---
title: PreventDefault
description: Stop iOS from scrolling the page when the keyboard opens.
package: preventdefault
---

Stop iOS from scrolling the page when the keyboard opens.

Turns off the built-in iOS keyboard autoscroll on the main web view, and can hand it back. Use it when your page manages its own message composer or sticky bar and the system scroll fights it. One call is enough, and the setting lasts for the session. You write the layout that reacts to the keyboard.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when your web page has a composer or sticky bar and iOS pushes the page around when the keyboard opens. Leave it alone if the default keyboard scrolling already works for your screens.

## Install

```sh
despia add Core/Basics/PreventDefault
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

### autoscroll

`dsx.module.preventdefault.autoscroll`

Turns the native iOS keyboard autoscroll off, or back on. Called with no value it prevents autoscroll. The default at launch is autoscroll restored.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `enabled` | boolean | no | Describes the native behavior: true restores iOS autoscroll, false or omitted prevents it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `prevented` | boolean | yes | True when native autoscroll is now prevented. |

**Example: restores native autoscroll when enabled**

```js
const result = await dsx.module.preventdefault.autoscroll({"enabled":true});
// resolves {"prevented":false}
```

**Example: prevents native autoscroll when disabled**

```js
const result = await dsx.module.preventdefault.autoscroll({"enabled":false});
// resolves {"prevented":true}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
