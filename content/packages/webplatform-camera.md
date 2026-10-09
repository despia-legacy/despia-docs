---
title: Camera
description: Lets web pages inside your app use the camera with getUserMedia.
package: camera
---

Lets web pages inside your app use the camera with getUserMedia.

Adds the camera permission text on iOS and the camera permission on Android so that a page running in your app's web view can call navigator.mediaDevices.getUserMedia for video. You get no new commands to call; the page uses the browser camera API it already knows. You write the permission sentence and your own page code.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Include it when a page in your app captures video or photos with the browser camera API. For the native camera with burst capture and device controls, use the camera package instead.

## Install

```sh
despia add Core/WebPlatform/Camera
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | no |
| web | no |
| macos | yes |

Device classes: phone, desktop.

## Actions

_This package declares no actions._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `usage_description` | multiline | `Processing your camera input for scanning purposes` | The message shown when iOS asks the user for camera access. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
