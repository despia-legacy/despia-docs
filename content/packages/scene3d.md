---
title: 3D models and AR
description: Show 3D models people can spin and zoom, and place them in the real world with AR.
package: scene3d
---

Show 3D models people can spin and zoom, and place them in the real world with AR.

Adds a Scene3D element that displays a 3D model (USDZ, .reality or glTF) from a link, with orbit, pinch zoom, a turntable spin and model animations. With the AR package it can also place the model on a floor or wall, try it on a face, attach it to an image, or work as a tape measure. Good for product viewers. Needs your 3D files hosted online.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it for product viewers, hero models and simple augmented reality placement. Do not use it for games or physics, which need a game engine package.

## What native adds

The model is drawn by the system's 3D framework with smooth touch controls and real-world placement, which a web page cannot match.

## Install

```sh
despia add Core/Scene3D
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

## Actions

### camera

`dsx.module.scene3d.camera`

Moves the viewer camera around the model. Any value you leave out stays where it is.

**When to use it.** Use it for buttons such as front view or top view.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `azimuth` | number | no | The angle around the model, in degrees. |
| `distance` | number | no | How far the camera is from the model, in metres. |
| `elevation` | number | no | The angle above or below the model, in degrees. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the camera was moved. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_scene` | No <Scene3D/> is currently shown. |  |

**Example: orbits to an azimuth**

```js
const result = await dsx.module.scene3d.camera({"azimuth":45});
// resolves {"ok":true}
```

### clear

`dsx.module.scene3d.clear`

In measure mode, removes every measuring point. It does nothing in other modes.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call completed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_scene` | No <Scene3D/> is currently shown. |  |

**Example: clear drives the live scene**

```js
const result = await dsx.module.scene3d.clear({});
// resolves {"ok":true}
```

### close

`dsx.module.scene3d.close`

Closes the 3D viewer screen. Calling it when nothing is open does nothing.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call completed. |

**Example: pops the viewer**

```js
const result = await dsx.module.scene3d.close({});
// resolves {"ok":true}
```

**Example: closing nothing still resolves**

```js
const result = await dsx.module.scene3d.close({});
// resolves {"ok":true}
```

### open

`dsx.module.scene3d.open`

Opens a full-screen 3D viewer for a model as a native screen, with a close button and swipe back.

**When to use it.** Use it to show a model when you do not want an inline viewer. An image link opens a panorama viewer instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ar` | string | no | Which augmented reality mode to use: place, face, image or measure. Leave it out for the plain viewer. |
| `format` | string | no | The model format you are about to open, so you can check support first and get unsupported_device now instead of a load failure later. |
| `origin` | string | no | The host to load the content from, when it is not the app's own host. |
| `panorama` | boolean | no | Force the panorama viewer on or off instead of guessing from the file type. |
| `src` | string | no | The link to the model or to its content folder. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the viewer was opened. |
| `src` | string | yes | The link that was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A Scene3D screen is already open. |  |
| `no_src` | Pass a `src` (content folder or .usdz URL) or set default_src. | Not recoverable by retrying. |
| `unsupported_device` | This build cannot render a model of that format. | Not recoverable by retrying. |

**Example: pushes the viewer for a content folder**

```js
const result = await dsx.module.scene3d.open({"src":"/products/chair"});
// resolves {"ok":true,"src":"/products/chair"}
```

### pause

`dsx.module.scene3d.pause`

Pauses the model's animation and the turntable spin together.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the scene was paused. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_scene` | No <Scene3D/> is currently shown. |  |

**Example: pause drives the live scene**

```js
const result = await dsx.module.scene3d.pause({});
// resolves {"ok":true}
```

### play

`dsx.module.scene3d.play`

Plays an animation built into the model on the viewer that was shown most recently.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `animation` | string | no | The name of the animation to play. Leave it out to play the default one. |
| `loop` | boolean | no | Whether to repeat the animation. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the animation started. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_scene` | No <Scene3D/> is currently shown. |  |

**Example: plays a named clip**

```js
const result = await dsx.module.scene3d.play({"animation":"spin","loop":false});
// resolves {"ok":true}
```

### raycast

`dsx.module.scene3d.raycast`

Finds what is under a point on the screen: the real world in augmented reality, or the model's parts in the plain viewer.

**When to use it.** Use it to react to taps. A miss is a normal answer, not an error.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `x` | number | no | The horizontal screen position, from 0 at the left to 1 at the right. |
| `y` | number | no | The vertical screen position, from 0 at the top to 1 at the bottom. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `node` | string | no | The name of the part of the model that was hit, in the plain viewer. |
| `ok` | boolean | yes | False when the point hit nothing. |
| `x` | number | no | The horizontal position of the hit in the scene. |
| `y` | number | no | The vertical position of the hit in the scene. |
| `z` | number | no | The depth position of the hit in the scene. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_scene` | No <Scene3D/> is currently shown. |  |

**Example: hits a node at the screen centre**

```js
const result = await dsx.module.scene3d.raycast({"x":0.5,"y":0.5});
// resolves {"node":"chair","ok":true,"x":0,"y":0,"z":-0.4}
```

**Example: a ray that hits nothing resolves a miss, not an error**

```js
const result = await dsx.module.scene3d.raycast({"x":0.02,"y":0.02});
// resolves {"ok":false}
```

### reset

`dsx.module.scene3d.reset`

In placement mode, forgets where the model was put so the next tap places it again. It does nothing in the plain viewer.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call completed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_scene` | No <Scene3D/> is currently shown. |  |

**Example: reset drives the live scene**

```js
const result = await dsx.module.scene3d.reset({});
// resolves {"ok":true}
```

### resume

`dsx.module.scene3d.resume`

Continues the animation and turntable after a pause.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the scene was resumed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_scene` | No <Scene3D/> is currently shown. |  |

**Example: resume drives the live scene**

```js
const result = await dsx.module.scene3d.resume({});
// resolves {"ok":true}
```

### snapshot

`dsx.module.scene3d.snapshot`

Takes a picture of the scene as it looks now and saves it as a JPEG in the app's cache.

**When to use it.** Use it to share or save what the person is looking at. Copy the file somewhere permanent if you want to keep it.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the picture was saved. |
| `path` | string | yes | The file path of the saved JPEG. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_scene` | No <Scene3D/> is currently shown. |  |
| `snapshot_failed` | The scene could not be captured. |  |

**Example: captures the scene to a cached jpeg**

```js
const result = await dsx.module.scene3d.snapshot({});
// resolves {"ok":true,"path":"cache:scene3d/snapshot-1.jpg"}
```

### toggle

`dsx.module.scene3d.toggle`

Opens the viewer when it is closed and closes it when it is open, so one button needs no state of its own.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `format` | string | no | The model format you are about to open, so unsupported formats are refused early. |
| `src` | string | no | The link to the model to open, used when the viewer is closed. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the viewer was opened or closed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_src` | Pass a `src` (content folder or .usdz URL) or set default_src. | Not recoverable by retrying. |
| `unsupported_device` | This build cannot render a model of that format. | Not recoverable by retrying. |

**Example: opens when nothing is shown**

```js
const result = await dsx.module.scene3d.toggle({"src":"/products/chair"});
// resolves {"ok":true}
```

### undo

`dsx.module.scene3d.undo`

In measure mode, removes the last measuring point. It does nothing in other modes.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call completed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_scene` | No <Scene3D/> is currently shown. |  |

**Example: undo drives the live scene**

```js
const result = await dsx.module.scene3d.undo({});
// resolves {"ok":true}
```

## Events

Read with `dsx.on(name, handler)`.

### closed

The screen opened by open was closed, by the close button, a swipe back or a close call. It fires once per open.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | Always true; it only confirms the screen closed. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `content_origin` | string | `` | Host that serves 3D content folders. Empty = the app's own host (App.json). A `src` is appended to this. |
| `default_src` | string | `` | The `src` loaded when dsx.scene3d() is called with no src. |
| `light_intensity` | number | `2600` | Brightness of the viewer's key light when the markup sets no lightIntensity attribute. |
| `loading_background` | color | `#000000` | Hex color shown behind the spinner while the model downloads. |
| `show_close_button` | boolean | `true` | Overlay a native close button on the pushed Scene3D screen (it pops the route). |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
