---
title: Flashlight
description: Turn the device flashlight on and off.
package: flashlight
---

Turn the device flashlight on and off.

Switches the phone's torch on or off from your app. It reports clearly when the device has no torch or another app is using the camera, and you can switch the feature off in settings. You draw your own torch button.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for a torch button, a scanner light or a signal. Check availability first so you can hide the button on devices with no torch.

## What native adds

The torch is driven by the device's own camera flash hardware, so it works on phones without a camera preview, which the web can only do through a live camera.

## Install

```sh
despia add Core/Basics/Flashlight
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

## Actions

### set

`dsx.module.flashlight.set`

Turns the torch on or off.

**When to use it.** Use it from a torch button. When the feature is disabled in settings it answers ok false with the reason disabled instead of failing.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | yes | True turns the torch on and false turns it off. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the torch was set as asked. |
| `on` | boolean | yes | Whether the torch is on now. |
| `reason` | string | yes | Why nothing happened when ok is false; disabled means the app was built with the flashlight turned off. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_value` | Pass on: true or false. | Not recoverable by retrying. |
| `permission_denied` | Camera access was refused, and a browser can only reach the torch through the camera track. |  |
| `unavailable` | The torch could not be driven: another app is holding the camera. |  |
| `unsupported_device` | This device has no torch. | Not recoverable by retrying. |

**Example: turns the torch on**

```js
const result = await dsx.module.flashlight.set({"on":true});
// resolves {"ok":true,"on":true,"reason":""}
```

**Example: turns the torch off**

```js
const result = await dsx.module.flashlight.set({"on":false});
// resolves {"ok":true,"on":false,"reason":""}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `enabled` | boolean | `true` | Allow the web app to toggle the device torch via dsx.module.flashlight.set({ on }). |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
