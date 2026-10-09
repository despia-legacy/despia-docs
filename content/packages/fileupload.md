---
title: FileUpload
description: Make file inputs in your web pages open the camera, photo library, scanner or file picker.
package: fileupload
---

Make file inputs in your web pages open the camera, photo library, scanner or file picker.

When a person taps a file input, the app shows the native source sheet and hands the chosen files back to your page as a normal file selection. Your existing upload code keeps working unchanged. The accept and capture attributes choose which source opens first.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

It works by itself: write an ordinary file input and uploads just work. You rarely call its actions; read its state if you want to show a spinner while a picker is open.

## What native adds

A web view cannot offer the camera, photo library and document scanner from a file input on its own; this package adds the native choices.

## Install

```sh
despia add Mandatory/FileUpload
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | yes |

Device classes: phone, desktop.

## Actions

### captureInfo

`dsx.module.fileupload.captureInfo`

Passes the accept and capture settings of the file input that was tapped, so the next pick opens the matching source.

**When not to.** This is called by the package's own page script, not by apps.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accept` | string | no | The accept attribute of the tapped file input, such as image/*. |
| `capture` | string | no | The capture attribute of the tapped file input, such as environment for the rear camera. |

**Resolves with**

_None._

**Example: an image-only accept with a rear capture hint routes the next pick to the camera**

```js
const result = await dsx.module.fileupload.captureInfo({"accept":"image/*","capture":"environment"});
```

**Example: an accept with no capture hint routes the next pick to the library**

```js
const result = await dsx.module.fileupload.captureInfo({"accept":"image/*"});
```

### nativeOverwrite

`dsx.module.fileupload.nativeOverwrite`

Turns the native handling of file inputs on or off; when off, every file input opens the generic source sheet instead.

**When not to.** Apps do not normally call this.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `native_overwrite` | boolean | no | True to narrow each input to the source its attributes ask for, false to always show the generic source sheet. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `native_overwrite` | boolean | yes | Whether native handling of file inputs is on right now. |

**Example: turns native interception off**

```js
const result = await dsx.module.fileupload.nativeOverwrite({"native_overwrite":false});
// resolves {"native_overwrite":false}
```

**Example: turns native interception back on**

```js
const result = await dsx.module.fileupload.nativeOverwrite({"native_overwrite":true});
// resolves {"native_overwrite":true}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `camera_usage_description` | multiline | `` | Turns on the camera in file uploads and says why the app asks for it, for example: Use the camera to capture a photo you choose to upload. Empty (the default): file inputs offer the photo library and files only, and the app declares no camera permission. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
