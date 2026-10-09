---
title: Text recognition and body pose
description: Read text out of photos and scans, and track body movement from the camera, on the device.
package: vision
---

Read text out of photos and scans, and track body movement from the camera, on the device.

Reads the text in an image such as a receipt or a sign, using Apple Vision on iOS and Google ML Kit on Android. It can also follow a person's body joints from the camera or a video, for fitness or movement apps. Images are processed on the device, with no account or API key.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it to read text from a photo, receipt or scanned page, or to follow a person's body joints from the camera or a video for fitness and movement features. Do not use it to scan barcodes or documents for their own sake; the Scanner package does that.

## Install

```sh
despia add Core/Vision
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

## Actions

### ocr

`dsx.module.vision.ocr`

Starts reading the text in an image and answers at once with an id; the text arrives later on the ocr event with that same id. It keeps the event-style calling shape that older pages used; new code should await readText instead.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | Your own label for this read. It is repeated on every ocr event so you can match results to calls; one is generated when you leave it out. |
| `lang` | string | no | Comma separated language hints such as en,fr that help the recognizer. Left out, the language is detected for you where the platform supports it. |
| `src` | string | yes | Where the image comes from: an https address, a Files path, or one of the picker and scanner choices such as @imagepicker or @documentscanner. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The label for this read, either the one you passed or a generated one. Use it to match the later ocr events. |

**Example: Start reading text in an image**

```js
const result = await dsx.module.vision.ocr({"lang":"en","src":"documents:scans/receipt.jpg"});
// resolves {"id":"ocr-1"}
```

### pose.start

`dsx.module.vision.pose.start`

Starts tracking one person's body from the camera or from a video file. It resolves once the first frame is read, then publishes joints and joint angles into the pose context. Starting again replaces the running session.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `angles` | object | no | Your own named joint angles, each given as three joint names with the angle measured at the middle one. They are added beside the built-in angles, with at most 16 names. |
| `every` | number | no | The least number of milliseconds between published samples, from 33 to 1000. Defaults to 66. |
| `lens` | string | no | Which camera to use, front or back. It only applies when the source is the camera and defaults to front. |
| `minConfidence` | number | no | A number from 0 to 1. A joint the detector is less sure of than this is left out, and so are the angles that need it. Defaults to 0.3. |
| `smoothing` | number | no | How much weight the newest sample gets when joints are averaged over time, above 0 and at most 1. A value of 1 passes the raw detector output through. Defaults to 0.5. |
| `source` | object | no | What to analyse: the word camera, or an object with the video file's src (a Files path or https address) and an optional loop flag. Defaults to the camera. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `detector` | string | yes | The name of the pose detector doing the work on this platform. |
| `frame` | object | yes | The size in pixels of the frames being analysed, so you can scale joint positions. |
| `frame.height` | number | yes | The height of the analysed frame in pixels. |
| `frame.width` | number | yes | The width of the analysed frame in pixels. |
| `source` | string | yes | The kind of source now being analysed, camera or file. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_angles` | angles must map up to 16 names to three joint names each. | Not recoverable by retrying. |
| `invalid_confidence` | minConfidence must be a number from 0 to 1. | Not recoverable by retrying. |
| `invalid_every` | every must be whole milliseconds from 33 to 1000. | Not recoverable by retrying. |
| `invalid_lens` | lens must be front or back. | Not recoverable by retrying. |
| `invalid_smoothing` | smoothing must be a number above 0 and at most 1. | Not recoverable by retrying. |
| `invalid_source` | source must be 'camera' or { src, loop? } with a Core/Files path or an https URL. | Not recoverable by retrying. |
| `permission_denied` | The camera grant is not given. data carries Core/Camera's contract state { permission, status, canAsk }. |  |
| `source_unreadable` | The video file could not be opened or decoded. | Not recoverable by retrying. |
| `superseded` | A newer pose.start replaced this one before it resolved. |  |
| `unavailable` | No camera, Core/Camera is not in this build, or the pose detector could not load. | Not recoverable by retrying. |

**Example: Track a body with the front camera**

```js
const result = await dsx.module.vision.pose.start({"every":66,"lens":"front"});
// resolves {"detector":"vision","frame":{"height":1920,"width":1080},"source":"camera"}
```

### pose.stop

`dsx.module.vision.pose.stop`

Stops body tracking and releases the camera or the video file. It is safe to call when nothing is running.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `stopped` | boolean | yes | True once tracking is stopped, including when nothing was running. |

**Example: stopping when nothing runs is fine**

```js
const result = await dsx.module.vision.pose.stop({});
// resolves {"stopped":true}
```

### readText

`dsx.module.vision.readText`

Reads the text in an image on the device and resolves with the joined text and each recognized line. Use it for receipts, signs, invoices and scanned pages.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | Your own label for this read, repeated on any related event. One is generated when you leave it out. |
| `lang` | string | no | Comma separated language hints such as en,fr that help the recognizer. Left out, the language is detected for you where the platform supports it. |
| `src` | string | yes | Where the image comes from: an https address, a Files path, or one of the picker and scanner choices such as @imagepicker or @documentscanner. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The label for this read, either the one you passed or a generated one. |
| `lines` | array of object | yes | The recognized lines in reading order, each with its text and, where the platform reports it, a confidence from 0 to 1. |
| `text` | string | yes | All recognized text joined and cleaned into one string. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `ocr_failed` | Text recognition could not complete. |  |
| `unsupported_platform` | This browser exposes no TextDetector, so text recognition cannot run here. | Not recoverable by retrying. |

**Example: reads the text in an image and resolves it**

```js
const result = await dsx.module.vision.readText({"id":"ocr_1","lang":"en","src":"https://example.com/invoice.png"});
// resolves {"id":"ocr_1","lines":[{"text":"INVOICE 42"}],"text":"INVOICE 42"}
```

## Events

Read with `dsx.on(name, handler)`.

### ocr

Reports progress of a read started with ocr: queued, then success with the text, or dismissed, or error. Every event carries the id of the call.

_None._

### pose

Reports the life of a pose session: started, found or lost when a person enters or leaves the frame, ended, and error. The joints themselves are not sent here; read them from the pose context.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `detector` | string | no | The name of the pose detector in use. |
| `error` | object | no | Present when status is error: what went wrong. |
| `error.code` | string | yes | A short machine readable code for the failure, such as unavailable. |
| `error.message` | string | yes | A readable sentence describing the failure. |
| `frame` | object | no | The size in pixels of the analysed frames. |
| `frame.height` | number | yes | The height of the analysed frame in pixels. |
| `frame.width` | number | yes | The width of the analysed frame in pixels. |
| `reason` | string | no | Why the session ended, for example because it was stopped, replaced, or the detector was unavailable. |
| `source` | string | no | The kind of source being analysed, camera or file. |
| `status` | string | yes | Where the pose session is now: started, found or lost when a person enters or leaves the frame, ended, or error. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `pose_web_bundle` | string | `` | Where the web build loads MediaPipe tasks-vision from (empty: the vendored copy). |
| `pose_web_model` | string | `` | The Pose Landmarker model file. |
| `pose_web_wasm` | string | `` | The folder holding the tasks-vision wasm files. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `camera_busy` | The camera is in use by another owner. |  |
| `cancelled` | The recognition job was cancelled before it finished. |  |
| `decode_failed` | That image could not be decoded. |  |
| `fetch_empty` | The image URL returned no bytes. |  |
| `fetch_failed` | The image could not be fetched. |  |
| `fetch_http_error` | The image URL answered with an error status. |  |
| `fetch_redirect` | The image URL redirected too many times. |  |
| `fetch_timeout` | Fetching the image took too long. |  |
| `file_unreadable` | That file could not be read. |  |
| `image_dimensions_unsupported` | That image is larger than recognition can handle. |  |
| `input_too_large` | That image exceeds the 16 MiB input limit. |  |
| `insecure_url` | Images are read over https only. |  |
| `invalid_id` | That is not a usable job id. |  |
| `invalid_lang` | That is not a recognition language this build has. |  |
| `invalid_src` | That is not a usable image source. |  |
| `invalid_url` | That is not a URL an image can be fetched from. |  |
| `local_file_forbidden` | That file is outside the paths this app may read. |  |
| `missing_src` | Text recognition needs an image source. |  |
| `no_presenter` | Couldn't find a screen to present from. |  |
| `no_webview` | No web view is available. |  |
| `ocr_busy` | Too many recognition requests are already queued. |  |
| `ocr_failed` | Text recognition could not complete. |  |
| `picker_busy` | An image picker is already open. |  |
| `picker_failed` | The selected image could not be loaded. |  |
| `picker_timeout` | The image picker timed out. |  |
| `scanner_failed` | The document scanner could not finish. |  |
| `scanner_unsupported` | This device has no document scanner. |  |
| `unavailable` | Body pose tracking is unavailable on this device. |  |
| `unknown_command` | That is not a vision command. |  |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
