---
title: Camera burst
description: Capture photos from the camera in code, with no preview screen.
package: camera
---

Capture photos from the camera in code, with no preview screen.

Takes a set number of photos as fast as the hardware allows and returns them as files, with no preview or shutter button. Use it when your app captures frames alongside a sensor reading or other event. Asks for camera permission the first time it runs. Phones only.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when your app needs the camera in code: a burst of photos matched to a sensor reading, a held-open session with controls and recording, or a live preview you draw yourself. For a picker where the person chooses a photo, use the platform file picker instead.

## What native adds

Uses the real camera pipelines (AVFoundation, CameraX) for low-latency capture, HDR, ProRes, RAW and lens control that a web page cannot reach.

## Install

```sh
despia add Core/Camera
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone.

## Actions

### burst

`dsx.module.camera.burst`

Takes a number of photos in a row as fast as the hardware allows, with no preview, and returns them as files.

**When to use it.** Use it to capture frames alongside a sensor reading or another event.

**When not to.** Do not use it for a camera screen the person looks at; use a session with a preview instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `camera` | string | no | Which camera to use: back or front. |
| `count` | number | no | How many photos to take, from 1 up to the configured maximum burst length. |
| `interval` | number | no | Minimum milliseconds between photos; 0 means as fast as the sensor delivers. |
| `prompt` | boolean | no | Set false to never show the permission dialog; the call then fails with permission_denied instead. |
| `quality` | number | no | JPEG quality from 0.01 to 1; the default is 0.9. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many photos were really captured; compare it with what you asked for. |
| `durationMs` | number | yes | How long the burst itself took in milliseconds, not counting camera warm-up. |
| `photos` | array of object | yes | The photos in capture order, each with a Files path, size, byte count and timestamp. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | Another capture is already using the camera. | Wait for the running capture to finish, and disable your shutter control while context.capturing or a session is active. |
| `capture_failed` | The camera session or the output folder could not be set up, or the capture itself failed. | Try again; if it keeps failing, check that another app is not holding the camera and that the device has free storage. |
| `permission_denied` | The camera permission is not granted, so nothing was captured. | Read data.canAsk: if true call permission.request first, otherwise show a row that opens Settings. |
| `unavailable` | There is no camera, or none on the side you asked for. | Check dsx.has before offering the feature, and hide the control on devices without a camera. |
| `unsupported_device` | This device has no camera at all. | Hide camera features on this device; ask dsx.has first. |

**Example: captures a burst and resolves its file paths**

```js
const result = await dsx.module.camera.burst({"count":3,"interval":0,"quality":0.8});
// resolves {"count":3,"durationMs":240,"photos":[{"bytes":2411500,"height":3024,"path":"cache:despia-burst/0.jpg","timestamp":1700000000000,"width":4032},{"bytes":2409800,"height":3024,"path":"cache:despia-burst/1.jpg","timestamp":1700000000120,"width":4032},{"bytes":2412100,"height":3024,"path":"cache:despia-burst/2.jpg","timestamp":1700000000240,"width":4032}]}
```

### capabilities

`dsx.module.camera.capabilities`

Reports the limits of burst capture on this device.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `maxBurst` | number | yes | The largest number of photos one burst may take. |

**Example: reports the burst ceiling**

```js
const result = await dsx.module.camera.capabilities({});
// resolves {"maxBurst":60}
```

### clear

`dsx.module.camera.clear`

Deletes every photo file that earlier bursts wrote.

**When to use it.** Call it when you have finished reading or uploading a burst.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `deleted` | number | yes | How many files were deleted; 0 when there was nothing to delete. |

**Example: deletes the burst directory**

```js
const result = await dsx.module.camera.clear({});
// resolves {"deleted":3}
```

**Example: a clear with nothing to delete reports zero**

```js
const result = await dsx.module.camera.clear({});
// resolves {"deleted":0}
```

### permission.manage

`dsx.module.camera.permission.manage`

Lets the person change a limited selection where the system offers one; otherwise returns the current state unchanged.

**When to use it.** Call it from a settings row; for the camera it only reports the state.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system dialog can still be shown; false once the user has refused it. |
| `changed` | boolean | yes | True when the person changed the selection; always false for the camera. |
| `level` | string | no | Access level where the platform has more than all-or-nothing; empty for the camera. |
| `status` | string | yes | Current camera permission: undetermined, granted, denied, restricted or unavailable. |

**Example: nothing limited to manage**

```js
const result = await dsx.module.camera.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.camera.permission.openSettings`

Opens this app's page in the system Settings so the person can change the camera permission.

**When to use it.** Use it after a refusal where canAsk is false, from a tap.

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
| `unavailable` | There is no camera, or none on the side you asked for. | Check dsx.has before offering the feature, and hide the control on devices without a camera. |
| `unsupported_platform` | This platform has no system settings page to open. | Skip the settings row on the web and explain how to change the permission in the browser. |

**Example: opens the app page**

```js
const result = await dsx.module.camera.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.camera.permission.request`

Shows the system camera permission dialog when it can still be shown, and returns the resulting state.

**When to use it.** Use it from an explicit step such as onboarding or a settings row; capture calls ask on their own when needed.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system dialog can still be shown; false once the user has refused it. |
| `level` | string | no | Access level where the platform has more than all-or-nothing; empty for the camera. |
| `status` | string | yes | Current camera permission: undetermined, granted, denied, restricted or unavailable. |

**Example: granted**

```js
const result = await dsx.module.camera.permission.request({});
// resolves {"canAsk":false,"status":"granted"}
```

### permission.status

`dsx.module.camera.permission.status`

Reads the camera permission without ever showing a dialog.

**When to use it.** Call it on a settings screen or at launch to decide what to show.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system dialog can still be shown; false once the user has refused it. |
| `level` | string | no | Access level where the platform has more than all-or-nothing; empty for the camera. |
| `status` | string | yes | Current camera permission: undetermined, granted, denied, restricted or unavailable. |

**Example: never asked**

```js
const result = await dsx.module.camera.permission.status({});
// resolves {"canAsk":true,"status":"undetermined"}
```

**Example: a final denial: only Settings helps**

```js
const result = await dsx.module.camera.permission.status({});
// resolves {"canAsk":false,"status":"denied"}
```

### photo

`dsx.module.camera.photo`

Takes one or more photos, opening the camera by itself if no session is running.

**When to use it.** Use it for a still from a running session or a quick capture without a session.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | no | How many photos to take; more than one makes a burst, up to 60. |
| `interval` | number | no | Minimum number of milliseconds between two photos. |
| `prompt` | boolean | no | Set false to never show the permission dialog. |
| `to` | string | no | Folder in a writable Files root to save to; defaults to a cache folder. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `photos` | array of object | yes | The photos taken, each with a Files path, size, byte count and timestamp. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | Another capture is already using the camera. | Wait for the running capture to finish, and disable your shutter control while context.capturing or a session is active. |
| `capture_failed` | The camera session or the output folder could not be set up, or the capture itself failed. | Try again; if it keeps failing, check that another app is not holding the camera and that the device has free storage. |
| `invalid_config` | The request contains a value or a key the camera does not know. | Fix the field named in data.field and call again; unknown keys are refused, never ignored. |
| `permission_denied` | The camera permission is not granted, so nothing was captured. | Read data.canAsk: if true call permission.request first, otherwise show a row that opens Settings. |
| `unavailable` | There is no camera, or none on the side you asked for. | Check dsx.has before offering the feature, and hide the control on devices without a camera. |
| `unsupported_device` | This device has no camera at all. | Hide camera features on this device; ask dsx.has first. |
| `unsupported_root` | The destination is not a writable Files root, for example an absolute path or a URL. | Pass a path on a writable root such as cache: or documents:, or leave it out for the default. |

**Example: takes one photo into the default Files directory**

```js
const result = await dsx.module.camera.photo({});
// resolves {"photos":[{"bytes":31244,"height":480,"path":"cache:despia-camera/photo-lq2w8x01.jpg","timestamp":1700000000000,"width":640}]}
```

**Example: a burst writes count photos into documents:**

```js
const result = await dsx.module.camera.photo({"count":3,"interval":100,"to":"documents:shots"});
// resolves {"photos":[{"bytes":31244,"height":480,"path":"documents:shots/photo-lq2w8x01.jpg","timestamp":1700000000000,"width":640},{"bytes":31101,"height":480,"path":"documents:shots/photo-lq2w8x02.jpg","timestamp":1700000000104,"width":640},{"bytes":31310,"height":480,"path":"documents:shots/photo-lq2w8x03.jpg","timestamp":1700000000207,"width":640}]}
```

### record.start

`dsx.module.camera.record.start`

Starts recording a video take from the running session.

**When to use it.** Call it after start with mode video or both; the take includes sound unless audio is switched off.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `maxBytes` | number | no | Stop by itself after the file reaches this many bytes. |
| `maxDuration` | number | no | Stop by itself after this many milliseconds. |
| `prompt` | boolean | no | Set false to never show the permission dialog. |
| `to` | string | no | Folder in a writable Files root to save the take to; defaults to a cache folder. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `started` | boolean | yes | True once recording has begun. |
| `to` | string | yes | The Files path the take is being written to. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | Another capture is already using the camera. | Wait for the running capture to finish, and disable your shutter control while context.capturing or a session is active. |
| `invalid_config` | The request contains a value or a key the camera does not know. | Fix the field named in data.field and call again; unknown keys are refused, never ignored. |
| `permission_denied` | The camera permission is not granted, so nothing was captured. | Read data.canAsk: if true call permission.request first, otherwise show a row that opens Settings. |
| `unavailable` | There is no camera, or none on the side you asked for. | Check dsx.has before offering the feature, and hide the control on devices without a camera. |
| `unsupported_config` | The device cannot satisfy a requirement that has no fallback, for example more cameras than it can run at once. | Ask for fewer devices or a simpler setup, or read the devices list from start to see what exists. |
| `unsupported_device` | This device has no camera at all. | Hide camera features on this device; ask dsx.has first. |
| `unsupported_root` | The destination is not a writable Files root, for example an absolute path or a URL. | Pass a path on a writable root such as cache: or documents:, or leave it out for the default. |

**Example: starts a take of the running video session**

```js
const result = await dsx.module.camera.record.start({"to":"documents:takes"});
// resolves {"started":true,"to":"documents:takes/take-lq2w8x01.webm"}
```

### record.stop

`dsx.module.camera.record.stop`

Stops the recording and returns the finished take.

**When to use it.** Call it when the person ends the recording; it also reports a take that already ended by itself.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | number | yes | Size of the recorded file in bytes. |
| `codec` | string | yes | Codec the video was encoded with. |
| `duration` | number | yes | Length of the take in milliseconds. |
| `ended` | string | no | Why the take ended by itself: maxDuration or maxBytes; absent when you stopped it. |
| `fellBack` | boolean | no | True on the web when the browser could not encode the codec you asked for and used another. |
| `fps` | number | yes | Frame rate of the recorded video. |
| `hdr` | string | yes | HDR format of the video, or off. |
| `height` | number | yes | Height of the recorded video in pixels. |
| `interrupted` | boolean | no | True when the take was cut short by an interruption. |
| `path` | string | yes | The Files path of the recorded video. |
| `width` | number | yes | Width of the recorded video in pixels. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `capture_failed` | The camera session or the output folder could not be set up, or the capture itself failed. | Try again; if it keeps failing, check that another app is not holding the camera and that the device has free storage. |
| `permission_denied` | The camera permission is not granted, so nothing was captured. | Read data.canAsk: if true call permission.request first, otherwise show a row that opens Settings. |
| `unavailable` | There is no camera, or none on the side you asked for. | Check dsx.has before offering the feature, and hide the control on devices without a camera. |
| `unsupported_root` | The destination is not a writable Files root, for example an absolute path or a URL. | Pass a path on a writable root such as cache: or documents:, or leave it out for the default. |

**Example: stops the take and resolves its Files path**

```js
const result = await dsx.module.camera.record.stop({});
// resolves {"bytes":412339,"codec":"vp8","duration":2034,"fellBack":true,"fps":30,"hdr":"off","height":480,"path":"documents:takes/take-lq2w8x01.webm","width":640}
```

### start

`dsx.module.camera.start`

Opens a camera session from one description of what you want and keeps it open for photos, recording and a preview.

**When to use it.** Use it for a pro viewfinder, recording, or live analysis; it asks for the camera and microphone the first time.

**When not to.** For one-off photos call photo or burst, which open and close the camera themselves.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `analyze` | array of object | no | Recognition passes to run on the camera frames, such as codes or a histogram; results appear in context.analysis. |
| `audio` | object | no | Sound settings for takes; sound is on by default for video. |
| `audio.enabled` | boolean | no | Record the microphone with video takes; set false for silent video. |
| `audio.input` | string | no | Which audio input to record from. |
| `controls` | object | no | Live camera controls: zoom, focus, exposure, white balance, torch, low light and system extensions. |
| `controls.exposure` | object | no | Exposure mode, point, bias, ISO and shutter time. |
| `controls.extension` | string | no | System camera extension to use, such as night or bokeh. |
| `controls.focus` | object | no | Focus mode and the point or lens position to focus at. |
| `controls.lowLight` | string | no | Low light boost: auto or off. |
| `controls.torch` | number | no | Torch level from 0 (off) to 1. |
| `controls.whiteBalance` | object | no | White balance mode, color temperature and tint. |
| `controls.zoom` | object | no | Zoom factor to move to and how fast. |
| `devices` | array of object | no | Which cameras to open, each by lens (for example back.wide) or by id; the first is the main one. |
| `effects` | array of object | no | Effects applied to the picture, such as color adjustments, a LUT, blur, chroma key, overlays and guides. |
| `mirror` | string | no | Whether the picture is mirrored; the front camera is mirrored by default. |
| `mode` | string | no | What the session produces: photo, video or both. |
| `orientation` | string | no | Which way the picture is rotated, for example following the device or locked. |
| `photo` | object | no | Photo settings: format, RAW, Live Photo, depth, quality, flash and maximum size. |
| `photo.deferred` | boolean | no | Let the system finish processing the photo later so the shutter returns faster. |
| `photo.depth` | boolean | no | Include depth data where the device supports it. |
| `photo.flash` | string | no | Flash mode: auto, on or off. |
| `photo.format` | string | no | Photo file format: heif, jpeg, dng or proraw. |
| `photo.livePhoto` | boolean | no | Capture a Live Photo where the device supports it. |
| `photo.maxDimensions` | array of number | no | Largest photo size to capture, as width and height in pixels. |
| `photo.quality` | string | no | Trade speed for quality: speed, balanced or quality. |
| `photo.raw` | boolean | no | Also capture a RAW file where the device supports it. |
| `video` | object | no | Video settings: size, frame rate, codec, HDR, log, stabilization and bitrate. |
| `video.bakeEffects` | boolean | no | Burn the effects into the recorded file instead of only showing them in the preview. |
| `video.bitrate` | number | no | Target video bitrate in bits per second. |
| `video.codec` | string | no | Video codec: h264, hevc or prores. |
| `video.fps` | number | no | Video frame rate in frames per second. |
| `video.hdr` | string | no | HDR format: off, hlg, dolbyVision or hdr10. |
| `video.height` | number | no | Height of the video picture in pixels. |
| `video.log` | boolean | no | Record in a flat log profile for later grading. |
| `video.stabilization` | string | no | Stabilization strength, from off to cinematic extended. |
| `video.width` | number | no | Width of the video picture in pixels. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `devices` | array of object | yes | Every camera the device offers with its formats, zoom range and supported features. |
| `effective` | object | yes | The settings the camera really applied after clamping each value to what the device supports. |
| `effective.analyze` | array of object | yes | Recognition passes to run on the camera frames, such as codes or a histogram; results appear in context.analysis. |
| `effective.audio` | object | yes | Sound settings for takes; sound is on by default for video. |
| `effective.controls` | object | yes | The live camera controls in effect: zoom, focus, exposure, white balance, torch, low light and system extensions. |
| `effective.devices` | array of object | yes | The cameras opened, each by lens (for example back.wide) or by id; the first is the main one. |
| `effective.effects` | array of object | yes | Effects applied to the picture, such as color adjustments, a LUT, blur, chroma key, overlays and guides. |
| `effective.mirror` | string | yes | Whether the picture is mirrored; the front camera is mirrored by default. |
| `effective.mode` | string | yes | What the session produces: photo, video or both. |
| `effective.orientation` | string | yes | Which way the picture is rotated, for example following the device or locked. |
| `effective.photo` | object | yes | Photo settings: format, RAW, Live Photo, depth, quality, flash and maximum size. |
| `effective.video` | object | yes | Video settings: size, frame rate, codec, HDR, log, stabilization and bitrate. |
| `refusals` | array of object | no | Features that were asked for but not applied, each with a code and the field concerned. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | Another capture is already using the camera. | Wait for the running capture to finish, and disable your shutter control while context.capturing or a session is active. |
| `capture_failed` | The camera session or the output folder could not be set up, or the capture itself failed. | Try again; if it keeps failing, check that another app is not holding the camera and that the device has free storage. |
| `invalid_config` | The request contains a value or a key the camera does not know. | Fix the field named in data.field and call again; unknown keys are refused, never ignored. |
| `permission_denied` | The camera permission is not granted, so nothing was captured. | Read data.canAsk: if true call permission.request first, otherwise show a row that opens Settings. |
| `unavailable` | There is no camera, or none on the side you asked for. | Check dsx.has before offering the feature, and hide the control on devices without a camera. |
| `unsupported_config` | The device cannot satisfy a requirement that has no fallback, for example more cameras than it can run at once. | Ask for fewer devices or a simpler setup, or read the devices list from start to see what exists. |
| `unsupported_device` | This device has no camera at all. | Hide camera features on this device; ask dsx.has first. |

**Example: starts the default session and resolves the effective document**

```js
const result = await dsx.module.camera.start({});
// resolves {"devices":[{"bias":null,"deferred":false,"depth":false,"exposureModes":["continuous"],"extensions":[],"flash":false,"focusModes":["continuous"],"formats":[{"codecs":["h264"],"fpsMax":30,"hdr":[],"height":720,"log":false,"stabilization":["off"],"width":1280}],"id":"webcam-1","iso":null,"kelvin":null,"lens":"unknown","livePhoto":false,"photoFormats":["jpeg"],"position":"front","raw":false,"shutter":null,"torch":false,"whiteBalanceModes":["continuous"],"zoom":{"max":1,"min":1,"switchOvers":[]}}],"effective":{"analyze":[],"audio":{"enabled":false,"input":null},"controls":{"exposure":{"bias":0,"iso":null,"mode":"continuous","point":null,"shutter":null},"extension":null,"focus":{"lens":null,"mode":"continuous","point":null},"lowLight":"auto","torch":0,"whiteBalance":{"kelvin":null,"mode":"continuous","tint":null},"zoom":{"rate":null,"to":1}},"devices":[{"id":"webcam-1","lens":"unknown"}],"effects":[],"mirror":"auto","mode":"photo","orientation":"auto","photo":{"deferred":false,"depth":false,"flash":"off","format":"jpeg","livePhoto":false,"maxDimensions":null,"quality":"balanced","raw":false},"video":{"bakeEffects":true,"bitrate":null,"codec":"h264","fps":30,"hdr":"off","height":720,"log":false,"stabilization":"off","width":1280}},"refusals":[]}
```

### stop

`dsx.module.camera.stop`

Closes the camera session and releases the camera.

**When to use it.** Call it when the camera screen goes away; unmounting a preview does not release the camera.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `stopped` | boolean | yes | True once the camera is released; calling stop again is not an error. |

**Example: stops the running session**

```js
const result = await dsx.module.camera.stop({});
// resolves {"stopped":true}
```

**Example: stopping twice is not an error**

```js
const result = await dsx.module.camera.stop({});
// resolves {"stopped":true}
```

### update

`dsx.module.camera.update`

Changes a running session by merging your changes into the current description.

**When to use it.** Use it for live controls such as a zoom slider, a focus tap or switching lens; rapid calls are coalesced to one per frame.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `analyze` | array of object | no | Recognition passes to run on the camera frames, such as codes or a histogram; results appear in context.analysis. |
| `audio` | object | no | Sound settings for takes; sound is on by default for video. |
| `audio.enabled` | boolean | no | Record the microphone with video takes; set false for silent video. |
| `audio.input` | string | no | Which audio input to record from. |
| `controls` | object | no | Live camera controls: zoom, focus, exposure, white balance, torch, low light and system extensions. |
| `controls.exposure` | object | no | Exposure mode, point, bias, ISO and shutter time. |
| `controls.extension` | string | no | System camera extension to use, such as night or bokeh. |
| `controls.focus` | object | no | Focus mode and the point or lens position to focus at. |
| `controls.lowLight` | string | no | Low light boost: auto or off. |
| `controls.torch` | number | no | Torch level from 0 (off) to 1. |
| `controls.whiteBalance` | object | no | White balance mode, color temperature and tint. |
| `controls.zoom` | object | no | Zoom factor to move to and how fast. |
| `devices` | array of object | no | Which cameras to open, each by lens (for example back.wide) or by id; the first is the main one. |
| `effects` | array of object | no | Effects applied to the picture, such as color adjustments, a LUT, blur, chroma key, overlays and guides. |
| `mirror` | string | no | Whether the picture is mirrored; the front camera is mirrored by default. |
| `mode` | string | no | What the session produces: photo, video or both. |
| `orientation` | string | no | Which way the picture is rotated, for example following the device or locked. |
| `photo` | object | no | Photo settings: format, RAW, Live Photo, depth, quality, flash and maximum size. |
| `photo.deferred` | boolean | no | Let the system finish processing the photo later so the shutter returns faster. |
| `photo.depth` | boolean | no | Include depth data where the device supports it. |
| `photo.flash` | string | no | Flash mode: auto, on or off. |
| `photo.format` | string | no | Photo file format: heif, jpeg, dng or proraw. |
| `photo.livePhoto` | boolean | no | Capture a Live Photo where the device supports it. |
| `photo.maxDimensions` | array of number | no | Largest photo size to capture, as width and height in pixels. |
| `photo.quality` | string | no | Trade speed for quality: speed, balanced or quality. |
| `photo.raw` | boolean | no | Also capture a RAW file where the device supports it. |
| `video` | object | no | Video settings: size, frame rate, codec, HDR, log, stabilization and bitrate. |
| `video.bakeEffects` | boolean | no | Burn the effects into the recorded file instead of only showing them in the preview. |
| `video.bitrate` | number | no | Target video bitrate in bits per second. |
| `video.codec` | string | no | Video codec: h264, hevc or prores. |
| `video.fps` | number | no | Video frame rate in frames per second. |
| `video.hdr` | string | no | HDR format: off, hlg, dolbyVision or hdr10. |
| `video.height` | number | no | Height of the video picture in pixels. |
| `video.log` | boolean | no | Record in a flat log profile for later grading. |
| `video.stabilization` | string | no | Stabilization strength, from off to cinematic extended. |
| `video.width` | number | no | Width of the video picture in pixels. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `effective` | object | yes | The settings the camera really applied after clamping each value to what the device supports. |
| `effective.analyze` | array of object | yes | Recognition passes to run on the camera frames, such as codes or a histogram; results appear in context.analysis. |
| `effective.audio` | object | yes | Sound settings for takes; sound is on by default for video. |
| `effective.controls` | object | yes | The live camera controls in effect: zoom, focus, exposure, white balance, torch, low light and system extensions. |
| `effective.devices` | array of object | yes | The cameras opened, each by lens (for example back.wide) or by id; the first is the main one. |
| `effective.effects` | array of object | yes | Effects applied to the picture, such as color adjustments, a LUT, blur, chroma key, overlays and guides. |
| `effective.mirror` | string | yes | Whether the picture is mirrored; the front camera is mirrored by default. |
| `effective.mode` | string | yes | What the session produces: photo, video or both. |
| `effective.orientation` | string | yes | Which way the picture is rotated, for example following the device or locked. |
| `effective.photo` | object | yes | Photo settings: format, RAW, Live Photo, depth, quality, flash and maximum size. |
| `effective.video` | object | yes | Video settings: size, frame rate, codec, HDR, log, stabilization and bitrate. |
| `refusals` | array of object | no | Features that were asked for but not applied, each with a code and the field concerned. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | Another capture is already using the camera. | Wait for the running capture to finish, and disable your shutter control while context.capturing or a session is active. |
| `capture_failed` | The camera session or the output folder could not be set up, or the capture itself failed. | Try again; if it keeps failing, check that another app is not holding the camera and that the device has free storage. |
| `invalid_config` | The request contains a value or a key the camera does not know. | Fix the field named in data.field and call again; unknown keys are refused, never ignored. |
| `unavailable` | There is no camera, or none on the side you asked for. | Check dsx.has before offering the feature, and hide the control on devices without a camera. |
| `unsupported_config` | The device cannot satisfy a requirement that has no fallback, for example more cameras than it can run at once. | Ask for fewer devices or a simpler setup, or read the devices list from start to see what exists. |

**Example: a patch is merged and the clamped value is published**

```js
const result = await dsx.module.camera.update({"controls":{"zoom":{"to":2}}});
// resolves {"effective":{"analyze":[],"audio":{"enabled":false,"input":null},"controls":{"exposure":{"bias":0,"iso":null,"mode":"continuous","point":null,"shutter":null},"extension":null,"focus":{"lens":null,"mode":"continuous","point":null},"lowLight":"auto","torch":0,"whiteBalance":{"kelvin":null,"mode":"continuous","tint":null},"zoom":{"rate":null,"to":1}},"devices":[{"id":"webcam-1","lens":"unknown"}],"effects":[],"mirror":"auto","mode":"photo","orientation":"auto","photo":{"deferred":false,"depth":false,"flash":"off","format":"jpeg","livePhoto":false,"maxDimensions":null,"quality":"balanced","raw":false},"video":{"bakeEffects":true,"bitrate":null,"codec":"h264","fps":30,"hdr":"off","height":720,"log":false,"stabilization":"off","width":1280}},"refusals":[]}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `max_burst` | number | `60` | Upper bound on how many frames one burst may request. |
| `usage_camera` | multiline | `Capturing photos from your camera at your request` | The message shown when iOS asks for camera access. |
| `usage_microphone` | multiline | `Recording sound with your videos at your request` | The message shown when iOS asks for microphone access. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
