---
title: AR
description: Run an augmented reality session on the phone camera.
package: ar
---

Run an augmented reality session on the phone camera.

Starts an ARKit session for world tracking, face tracking or image marker tracking, and lets you place named anchors, hit-test the real world, and save and restore a mapped room. Other packages can attach their renderer to the same session. It asks for the camera the first time it starts, with text you set. You write the content that is drawn in AR.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for experiences that place things in the real world, track a face or recognise a printed marker. It is off by default because camera and AR need a clear reason in App Review.

## What native adds

ARKit gives accurate world tracking, plane detection, face tracking and LiDAR depth that a web page cannot reach.

## Install

```sh
despia add Core/AR
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | no |
| web | yes |
| macos | no |

Device classes: phone.

## Actions

### anchor

`dsx.module.ar.anchor`

Places a named anchor at a position in the world; using an existing name moves that anchor instead of adding another.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | yes | The name to give the anchor. |
| `transform` | array of number | yes | The position and rotation as 16 numbers in column-major order. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | yes | Echoes which anchor was just recorded, for chaining calls. |
| `ok` | boolean | yes | True when the anchor was recorded. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_anchor` | ar.anchor needs a `name` and a column-major 16-value `transform`. | Not recoverable by retrying. |
| `not_ready` | No AR session is running; call ar.start first. |  |

**Example: records a named placement**

```js
const result = await dsx.module.ar.anchor({"name":"chair","transform":[1,0,0,0,0,1,0,0,0,0,1,0,0.4,0,-1.2,1]});
// resolves {"name":"chair","ok":true}
```

### forget

`dsx.module.ar.forget`

Deletes one saved world; it succeeds even if that name was never saved.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | no | The name of the saved world; it is cleaned into a safe file name, and default is used if nothing is left. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when no world with that name exists any more. |

**Example: deletes a saved world**

```js
const result = await dsx.module.ar.forget({"name":"kitchen"});
// resolves {"ok":true}
```

**Example: deleting a world that was never saved still resolves**

```js
const result = await dsx.module.ar.forget({"name":"never-existed"});
// resolves {"ok":true}
```

### pause

`dsx.module.ar.pause`

Pauses tracking and frees the camera without losing placed content or the mapped world.

**When to use it.** Use it when a screen covers the AR view for a while.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when tracking was paused. |

**Example: suspends tracking without resetting the world**

```js
const result = await dsx.module.ar.pause({});
// resolves {"ok":true}
```

### permission.manage

`dsx.module.ar.permission.manage`

Lets the user change which items this app can see when the camera for AR is limited, without leaving the app; elsewhere it only reports the current state.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog for the camera for AR; false means only Settings can change it. |
| `changed` | boolean | yes | True when the user changed the selection in the system picker. |
| `level` | string | no | The permission level that this answer is about. |
| `status` | string | yes | The current state of the camera for AR: undetermined, granted, limited, denied, restricted or unavailable. |

**Example: nothing limited to manage**

```js
const result = await dsx.module.ar.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.ar.permission.openSettings`

Opens this app's page in the system Settings so the user can change a denied permission.

**When to use it.** Call it only from a button the user taps, never automatically after a denial.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when the Settings page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | Opening Settings needs the App Settings package, which is not part of this app. | Add the App Settings package to the app, or tell the user where to find Settings. |

**Example: opens the app page**

```js
const result = await dsx.module.ar.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.ar.permission.request`

Asks for the camera for AR with the system dialog, for a settings row or an onboarding step; the dialog only appears while the system still allows it.

**When to use it.** Use it when the user taps something that clearly needs the permission, or on a priming screen you design.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog for the camera for AR; false means only Settings can change it. |
| `level` | string | no | The permission level that this answer is about. |
| `status` | string | yes | The current state of the camera for AR: undetermined, granted, limited, denied, restricted or unavailable. |

**Example: granted**

```js
const result = await dsx.module.ar.permission.request({});
// resolves {"canAsk":false,"status":"granted"}
```

### permission.status

`dsx.module.ar.permission.status`

Reads the current state of the camera for AR without ever showing a dialog, so a settings screen can call it every time it appears.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog for the camera for AR; false means only Settings can change it. |
| `level` | string | no | The permission level that this answer is about. |
| `status` | string | yes | The current state of the camera for AR: undetermined, granted, limited, denied, restricted or unavailable. |

**Example: never asked**

```js
const result = await dsx.module.ar.permission.status({});
// resolves {"canAsk":true,"status":"undetermined"}
```

**Example: a final denial: only Settings helps**

```js
const result = await dsx.module.ar.permission.status({});
// resolves {"canAsk":false,"status":"denied"}
```

### raycast

`dsx.module.ar.raycast`

Finds where a point on the screen meets the real world, returning its position, surface direction and distance.

**When to use it.** Use it to place objects where the user taps, or to measure between two points.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `target` | string | no | What to hit: any (known surfaces first, then estimates), plane or estimated. |
| `x` | number | yes | Horizontal position on the screen from 0 at the left to 1 at the right. |
| `y` | number | yes | Vertical position on the screen from 0 at the top to 1 at the bottom. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `distance` | number | no | How far the point is from the camera, in meters. |
| `hit` | boolean | yes | True when the ray hit something. |
| `normal` | array of number | no | The direction the surface faces. |
| `position` | array of number | no | The world position in meters as x, y and z. |
| `target` | string | no | What kind of surface was hit. |
| `tracking` | string | no | The tracking quality at the moment of the hit. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_point` | ar.raycast needs `x` and `y`, each 0 to 1 across the screen. | Not recoverable by retrying. |
| `bad_target` | ar.raycast `target` is `any`, `plane` or `estimated`. | Not recoverable by retrying. |
| `not_running` | Start the AR session (ar.start) before raycasting. |  |

**Example: a hit on a detected plane**

```js
const result = await dsx.module.ar.raycast({"x":0.5,"y":0.5});
// resolves {"distance":1,"hit":true,"normal":[0,1,0],"position":[0.1,-0.4,-0.9],"target":"plane"}
```

**Example: nothing there yet**

```js
const result = await dsx.module.ar.raycast({"x":0.5,"y":0.5});
// resolves {"hit":false,"tracking":"limited:insufficientFeatures"}
```

### removeAnchor

`dsx.module.ar.removeAnchor`

Removes a named anchor; it succeeds even if the anchor does not exist.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | yes | The name of the anchor to remove. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when no anchor with that name exists any more. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_anchor` | ar.removeAnchor needs a `name`. | Not recoverable by retrying. |

**Example: drops a named placement**

```js
const result = await dsx.module.ar.removeAnchor({"name":"chair"});
// resolves {"ok":true}
```

### resume

`dsx.module.ar.resume`

Continues a paused session with its world map and placed anchors intact.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when tracking has started running again. |

**Example: continues tracking and re-exports the session**

```js
const result = await dsx.module.ar.resume({});
// resolves {"ok":true}
```

### save

`dsx.module.ar.save`

Saves the mapped room and every named anchor to a file, so a later session can restore it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | no | The name of the saved world; it is cleaned into a safe file name, and default is used if nothing is left. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | number | yes | The size of the saved file in bytes. |
| `name` | string | yes | The name the world was saved under. |
| `ok` | boolean | yes | True when the world was saved. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `save_failed` | The world map could not be saved. |  |

**Example: writes the mapped room and reports its size**

```js
const result = await dsx.module.ar.save({"name":"kitchen"});
// resolves {"bytes":184320,"name":"kitchen","ok":true}
```

### start

`dsx.module.ar.start`

Starts the AR session in world, face or image mode, asking for the camera first if needed.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `image` | string | no | The marker picture to look for, as an https address or a files path such as cache: or documents:. |
| `imageWidth` | number | no | The real printed width of the marker in meters, needed with image. |
| `mode` | string | no | What to track: world for surfaces, face for the front camera, or image for a printed marker; the configured default is used if left out. |
| `occlusion` | boolean | no | Pass true to use the LiDAR scene mesh so virtual things hide behind real objects; it is ignored on phones without LiDAR. |
| `planeDetection` | string | no | For world mode, which flat surfaces to detect: none, horizontal, vertical or both. |
| `prompt` | boolean | no | Leave it out or pass true to show the camera permission dialog when needed; false never shows it. |
| `restore` | string | no | The name of a saved world to resume; if it cannot be read, a fresh session starts. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `marker` | boolean | no | Only present when you gave an image: whether the marker picture loaded. |
| `mode` | string | yes | The tracking mode that is running. |
| `ok` | boolean | yes | True when the session started. |
| `restored` | boolean | no | Only present when you gave restore: false means no saved world could be read and a fresh session started. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | The camera is in use by another feature (the data names the holder), so the AR session cannot take it yet. |  |
| `gesture_required` | A browser starts an AR session only from a user gesture. Call ar.start from a tap or click handler. |  |
| `marker_unreadable` | The marker image could not be loaded. |  |
| `missing_image` | Image tracking needs an `image` (an https URL or a Core/Files path). |  |
| `permission_denied` | Camera access is not granted. The data carries the contract state: { permission, status, canAsk }. |  |
| `superseded` | A newer ar.start/stop happened while this start was preparing. |  |
| `unsupported` | The AR session could not start on this device. | Not recoverable by retrying. |
| `unsupported_device` | This device cannot run that kind of AR tracking. | Not recoverable by retrying. |

**Example: starts world tracking**

```js
const result = await dsx.module.ar.start({"mode":"world"});
// resolves {"mode":"world","ok":true}
```

**Example: arms marker detection and reports the marker loaded**

```js
const result = await dsx.module.ar.start({"image":"https://example.com/marker.png","imageWidth":0.2,"mode":"image"});
// resolves {"marker":true,"mode":"image","ok":true}
```

### status

`dsx.module.ar.status`

Tells whether the app has camera permission for AR, without ever showing a dialog.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cameraAuthorized` | boolean | yes | True when the user has allowed camera access. |

**Example: reports the camera already granted**

```js
const result = await dsx.module.ar.status({});
// resolves {"cameraAuthorized":true}
```

**Example: reports no camera grant yet**

```js
const result = await dsx.module.ar.status({});
// resolves {"cameraAuthorized":false}
```

### stop

`dsx.module.ar.stop`

Ends the AR session and releases everything it shared, so other packages stop using it.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the session was stopped. |

**Example: ends the session and clears the exported handles**

```js
const result = await dsx.module.ar.stop({});
// resolves {"ok":true}
```

### worlds

`dsx.module.ar.worlds`

Lists the names of the saved worlds, sorted.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `worlds` | array of string | yes | The names of all worlds saved on this device. |

**Example: lists the saved worlds**

```js
const result = await dsx.module.ar.worlds({});
// resolves {"worlds":["default","kitchen"]}
```

**Example: an empty store lists nothing**

```js
const result = await dsx.module.ar.worlds({});
// resolves {"worlds":[]}
```

## Events

Read with `dsx.on(name, handler)`.

### anchors

Anchors were added, updated or removed in the session.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | int | yes | How many anchors were part of this change. |
| `kind` | string | yes | The kind of anchor that changed, such as a plane or image. |
| `phase` | string | yes | What happened: added, updated or removed. |

### error

The AR session failed or could not attach.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `message` | string | yes | What went wrong, in plain text. |

### image

The marker picture was found or lost.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `tracked` | boolean | yes | True while the marker is being tracked. |

### plane

A flat surface was found, with its center and size in the world.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `depth` | number | yes | The surface depth in meters; the web reports 0. |
| `width` | number | yes | The surface width in meters; the web reports 0. |
| `x` | number | yes | The surface center, left or right, in meters. |
| `y` | number | yes | The surface center, up or down, in meters. |
| `z` | number | yes | The surface center, forward or back, in meters. |

### relocalized

A restored world found its place again, so saved anchors are live.

_None._

### tracking

The camera's tracking quality changed to normal, limited or not available.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `reason` | string | yes | Why tracking is limited, or empty when it is not. |
| `state` | string | yes | The new tracking quality: normal, limited or notAvailable. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `camera_usage_description` | multiline | `Used to render augmented-reality experiences through your camera.` | The message iOS shows when an AR experience asks for camera access. |
| `default_mode` | string | `world` | Which ARKit configuration to start when a caller does not pass one: world, face, or image. |
| `plane_detection` | string | `horizontal` | For world tracking, which planes to detect: none, horizontal, vertical, or both. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
