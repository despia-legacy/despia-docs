---
title: Capture
description: Turn any element or screen into an image, a PDF or a screen recording.
package: capture
---

Turn any element or screen into an image, a PDF or a screen recording.

Takes a picture of one named element, the whole app window or a component that was never shown, and writes it as a PNG, JPEG or WebP file in your app's storage. It can also make a PDF with real page sizes and record the app's own screen. Nothing goes into the photo library, and screens protected against capture are always refused. You write the markup you want captured and decide where the file goes.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to build share cards, receipts, exported pages and bug-report recordings from what your own app can draw. To put an image into the person's photo library, follow it with the media package's save.

## What native adds

The image is rendered by the device from your real layout, even for a component that is not on screen, so a share card can be made without showing it.

## Install

```sh
despia add Core/Capture
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

### element

`dsx.module.capture.element`

Takes a picture of one element in your layout, found by its ref name, and saves it as an image file.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `background` | string | no | A colour placed behind transparent parts; jpeg has no transparency so it always gets a background. |
| `format` | string | no | png (the default), jpeg or webp. |
| `quality` | number | no | Compression quality from 0 to 1 for jpeg and webp. |
| `ref` | string | yes | The ref name you gave the element in your markup. |
| `scale` | string | no | A multiplier up to 16, or the word device to match the screen's pixel density. |
| `to` | string | no | A Files path to save to; the app's cache folder is used when left out. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | int | yes | The size of the image file in bytes. |
| `format` | string | yes | The image format that was written. |
| `height` | int | yes | The height of the image in pixels. |
| `path` | string | yes | The Files path of the saved image. |
| `width` | int | yes | The width of the image in pixels. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_scale` | `scale` must be a positive number up to 16, or the word "device". | Not recoverable by retrying. |
| `invalid_size` | That element has no laid-out size to capture. |  |
| `not_rendered` | That element exists but is not currently on screen. |  |
| `render_failed` | The element could not be rendered to an image. |  |
| `secure_content` | This screen is protected against capture. | Not recoverable by retrying. |
| `too_large` | That capture would be too large to allocate. Lower the scale or the size. |  |
| `unknown_ref` | No element on this surface is named by that ref. | Not recoverable by retrying. |
| `unsupported_format` | That image format is not available. Use png, jpeg or webp. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot capture elements. | Not recoverable by retrying. |

**Example: captures a named card at the device scale**

```js
const result = await dsx.module.capture.element({"ref":"card"});
// resolves {"bytes":240311,"format":"png","height":1890,"path":"cache:captures/card.png","width":1170}
```

**Example: an explicit scale of one gives point-for-pixel output**

```js
const result = await dsx.module.capture.element({"ref":"card","scale":"1"});
// resolves {"bytes":40118,"format":"png","height":630,"path":"cache:captures/card.png","width":390}
```

### offscreen

`dsx.module.capture.offscreen`

Renders one of your components that is not on screen, at any size you choose, and saves it as an image, for example a share card.

**When to use it.** Use it to generate images such as a 1200 by 630 social share card without showing anything to the person.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attrs` | object | no | The values to give the component, as plain data and not markup. |
| `background` | string | no | A colour placed behind transparent parts of the image. |
| `component` | string | yes | The name of the component to render, as registered in your app. |
| `format` | string | no | png (the default), jpeg or webp. |
| `height` | number | yes | The height to lay the component out at, in pixels. |
| `quality` | number | no | Compression quality from 0 to 1 for jpeg and webp. |
| `scale` | string | no | A multiplier up to 16, or the word device to match the screen's pixel density. |
| `to` | string | no | A Files path to save to; the app's cache folder is used when left out. |
| `width` | number | yes | The width to lay the component out at, in pixels. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | int | yes | The size of the image file in bytes. |
| `format` | string | yes | The image format that was written. |
| `height` | int | yes | The height of the image in pixels. |
| `path` | string | yes | The Files path of the saved image. |
| `width` | int | yes | The width of the image in pixels. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_scale` | `scale` must be a positive number up to 16, or the word "device". | Not recoverable by retrying. |
| `invalid_size` | `width` and `height` must be positive numbers. | Not recoverable by retrying. |
| `render_failed` | The component could not be rendered to an image. |  |
| `too_large` | That render would be too large to allocate. Lower the scale or the size. |  |
| `unknown_component` | No component with that name is registered in this build. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot render a component offscreen. | Not recoverable by retrying. |

**Example: renders an Open Graph card at a size no screen ever held**

```js
const result = await dsx.module.capture.offscreen({"attrs":{"score":4200},"component":"ScoreCard","height":630,"width":1200});
// resolves {"bytes":142088,"format":"png","height":630,"path":"cache:captures/offscreen.png","width":1200}
```

**Example: the same card at 2x for a retina share sheet**

```js
const result = await dsx.module.capture.offscreen({"attrs":{"score":4200},"component":"ScoreCard","height":630,"scale":"2","width":1200});
// resolves {"bytes":402911,"format":"png","height":1260,"path":"cache:captures/offscreen.png","width":2400}
```

### pdf

`dsx.module.capture.pdf`

Makes a PDF from one element or a list of elements, each on its own page at a real paper size.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `margins` | number | no | The page margin in points. |
| `pageSize` | string | no | a4, a3, a5, letter, legal or tabloid, optionally with /landscape, or an explicit width and height in points. Unknown names are refused instead of guessing. |
| `ref` | string | no | The ref name of a single element to turn into a one-page PDF. |
| `refs` | array of string | no | A list of ref names, each placed on its own page in order. |
| `to` | string | no | A Files path to save to; the app's cache folder is used when left out. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | int | yes | The size of the PDF file in bytes. |
| `pages` | int | yes | How many pages the finished PDF contains, one per element. |
| `path` | string | yes | The Files path of the saved PDF. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_page_size` | Use a4, a3, a5, letter, legal or tabloid (optionally "/landscape"), or an explicit width and height in points. | Not recoverable by retrying. |
| `not_rendered` | That element exists but is not currently on screen. |  |
| `render_failed` | The document could not be rendered. |  |
| `secure_content` | This screen is protected against capture. | Not recoverable by retrying. |
| `unknown_ref` | No element on this surface is named by that ref. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot produce a PDF. | Not recoverable by retrying. |

**Example: one element becomes a one-page A4 document**

```js
const result = await dsx.module.capture.pdf({"ref":"receipt"});
// resolves {"bytes":18422,"pages":1,"path":"cache:captures/document.pdf"}
```

**Example: several elements become several pages, where the caller asked**

```js
const result = await dsx.module.capture.pdf({"margins":24,"pageSize":"letter","refs":["page1","page2","page3"],"to":"documents:export/report.pdf"});
// resolves {"bytes":96140,"pages":3,"path":"documents:export/report.pdf"}
```

### record.start

`dsx.module.capture.record.start`

Starts recording your app's own screen, for a bug report or a tutorial, and stops by itself after the maximum duration.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `audio` | string | no | none (the default) or mic to record the microphone as well. |
| `maxDuration` | number | no | The longest the recording may run, in whole seconds from 1 to 3600; defaults to 600. |
| `to` | string | no | Where to save the video, as a Files path; defaults to a recording in the cache captures folder. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `maxDuration` | int | yes | The maximum duration in seconds that will apply. |
| `started` | boolean | yes | True when the recording is running. |
| `to` | string | yes | The Files path the recording will be written to. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A recording is already running. |  |
| `invalid_argument` | audio is none or mic, and maxDuration is whole seconds from 1 to 3600. | Not recoverable by retrying. |
| `permission_denied` | The person declined the system prompt that allows screen recording. | Explain why you need it and let them try again. |
| `unavailable` | Screen recording isn't available right now. |  |
| `unsupported_format` | A screen recording is an mp4 here (webm on the web); name the file that way or give no extension. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot record the screen. | Not recoverable by retrying. |

**Example: starts a silent recording with the default plan**

```js
const result = await dsx.module.capture.record.start({});
// resolves {"maxDuration":600,"started":true,"to":"cache:captures/recording.mp4"}
```

### record.stop

`dsx.module.capture.record.stop`

Stops the screen recording and returns the finished video file. It also works after a recording already stopped by itself.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | int | yes | The size of the video file in bytes. |
| `duration` | int | yes | The length of the recording in milliseconds. |
| `format` | string | yes | The video format that was written, such as mp4. |
| `path` | string | yes | The Files path of the finished video. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_recording` | No screen recording is running. | Not recoverable by retrying. |
| `render_failed` | The recording couldn't be written. |  |

**Example: answers the written file**

```js
const result = await dsx.module.capture.record.stop({});
// resolves {"bytes":2400000,"duration":12000,"format":"mp4","path":"cache:captures/recording.mp4"}
```

### screen

`dsx.module.capture.screen`

Takes a picture of your app's whole window, but not other apps or the system status bar, and saves it as an image file.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `excludeSecure` | boolean | no | Set true to leave protected parts out of the picture instead of refusing it, so the rest of the screen is captured. |
| `format` | string | no | png (the default), jpeg or webp. |
| `quality` | number | no | Compression quality from 0 to 1 for jpeg and webp. |
| `to` | string | no | A Files path to save to; the app's cache folder is used when left out. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | int | yes | The size of the image file in bytes. |
| `format` | string | yes | The image format that was written. |
| `height` | int | yes | The height of the image in pixels. |
| `path` | string | yes | The Files path of the saved image. |
| `width` | int | yes | The width of the image in pixels. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `render_failed` | The screen could not be rendered to an image. |  |
| `secure_content` | This screen is protected against capture. | Not recoverable by retrying. |
| `too_large` | That capture would be too large to allocate. |  |
| `unsupported_format` | That image format is not available. Use png, jpeg or webp. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot capture the screen. | Not recoverable by retrying. |

**Example: captures the window**

```js
const result = await dsx.module.capture.screen({});
// resolves {"bytes":811402,"format":"png","height":2532,"path":"cache:captures/screen.png","width":1170}
```

**Example: a jpeg screen capture**

```js
const result = await dsx.module.capture.screen({"format":"jpeg","quality":0.8});
// resolves {"bytes":204118,"format":"jpeg","height":2532,"path":"cache:captures/screen.jpg","width":1170}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `default_format` | string | `png` | The format a capture uses when the caller does not name one. png keeps transparency; jpeg is much smaller for a photographic screen; webp is smaller still where the platform can write it. |
| `default_quality` | number | `0.9` | Compression quality for jpeg and webp, from 0 to 1. Ignored for png, which is lossless. |
| `default_root` | string | `cache:captures` | The Core/Files root a capture goes to when the caller does not name a path. cache: is right for images the user has not decided to keep. |
| `max_pixels` | number | `40000000` | The largest capture this app will attempt, in total pixels. The default is about 8000 by 5000, which is larger than any share card or receipt and small enough that a phone will not run out of memory trying. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
