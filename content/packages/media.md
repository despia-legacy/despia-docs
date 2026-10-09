---
title: Photos and videos
description: Let users pick, crop, save and upload photos and videos.
package: media
---

Let users pick, crop, save and upload photos and videos.

Opens the system photo picker without asking for library access, so there is no permission prompt for the common case. Can also take a photo with the camera, pick documents, crop and resize images, make video thumbnails, save to the library and upload the result. Camera and library permissions are asked only when a feature needs them.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it whenever the user needs to choose, edit, save or upload a photo or video, or when you want to build your own photo grid. For taking a new photo with live camera controls, use the camera package instead.

## What native adds

The native pickers run outside your app, so the user chooses what you see and no photo library permission is needed for the common case. Image edits and video exports run on the device's own encoders.

## Install

```sh
despia add Core/Media
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

### albums

`dsx.module.media.albums`

Lists the albums in the person's photo library, each with a title, item count and cover image. It asks for library read access the first time it runs.

**When to use it.** Use it to build your own album list inside a custom picker.

**When not to.** If you only need the person to choose a photo, use pick, which needs no permission.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `kind` | string | no | Which albums to list: all (the default), smart (system albums such as Favorites) or user (albums the person made). |
| `prompt` | boolean | no | Defaults to true, which asks for library access on this call. Set false to never show a dialog. |
| `thumb` | number | no | The cover image size in pixels; it is rounded up to the nearest size the cache supports. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `albums` | array of object | yes | The list of albums found in the photo library. |
| `revision` | number | no | A number that changes whenever the library changes, so you know when to reload. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | Photo library access was not granted. permission.request can ask again while canAsk is true; otherwise permission.openSettings. |  |
| `unsupported_platform` | This platform has no photo library to enumerate. | Not recoverable by retrying. |

**Example: lists the albums with covers once the read grant is held**

```js
const result = await dsx.module.media.albums({});
// resolves {"albums":[{"count":12,"cover":"dsxmedia://thumb/1000000034?w=256&h=256","id":"smart:favorites","kind":"smart","title":"Favorites"},{"count":1842,"cover":"dsxmedia://thumb/1000000041?w=256&h=256","id":"-1739773001","kind":"user","title":"Camera"}],"revision":0}
```

### assets

`dsx.module.media.assets`

Returns one page of the person's photo library as rows with ids and thumbnail addresses, so you can draw your own grid. It asks for library read access the first time it runs.

**When to use it.** Use it to build a custom gallery or picker that scrolls through the whole library.

**When not to.** If the person just needs to choose a photo, use pick, which needs no permission.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `after` | string | no | The endCursor from the previous page, to continue where it stopped. |
| `album` | string | no | The album id to read from; leave out to read the whole library. |
| `favorite` | boolean | no | Set true to return only favourited items. Android needs version 11 or later. |
| `from` | number | no | Only items created at or after this time, in milliseconds since 1970. |
| `limit` | number | no | How many items per page; defaults to 60 and is kept between 1 and 500. |
| `prompt` | boolean | no | Defaults to true, which asks for library access on this call. Set false to never show a dialog. |
| `sortBy` | string | no | newest (the default) or oldest. |
| `thumb` | number | no | The thumbnail size in pixels; rounded up to 64, 128, 256, 384, 512, 768 or 1024. |
| `to` | number | no | Only items created at or before this time, in milliseconds since 1970. |
| `type` | string | no | Filter by any, image, video, live, screenshot, panorama, burst, slomo or timelapse. Android cannot filter by some of these and reports unsupported_platform. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `assets` | array of object | yes | The page of library items. |
| `endCursor` | string | no | Pass this as after to get the next page. |
| `hasNextPage` | boolean | yes | True when more items remain after this page. |
| `revision` | number | no | A number that changes whenever the library changes. |
| `total` | number | no | The total number of matching items, when the platform can count them. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_argument` | The date window ends before it starts. | Not recoverable by retrying. |
| `not_found` | There is no album with that id. | Not recoverable by retrying. |
| `permission_denied` | Photo library access was not granted. permission.request can ask again while canAsk is true; otherwise permission.openSettings. |  |
| `unsupported_format` | That is not a library type. Use any, image, video, live, screenshot, panorama, burst, slomo or timelapse. | Not recoverable by retrying. |
| `unsupported_platform` | This platform has no photo library to page through, or cannot filter it that way. | Not recoverable by retrying. |

**Example: pages the library with ids and thumbnail URLs**

```js
const result = await dsx.module.media.assets({"limit":2});
// resolves {"assets":[{"created":1727690000000,"duration":0,"favorite":false,"height":3024,"id":"1000000041","subtypes":[],"thumb":"dsxmedia://thumb/1000000041?w=256&h=256","type":"image","width":4032},{"created":1727680000000,"duration":12400,"favorite":true,"height":1080,"id":"1000000040","subtypes":[],"thumb":"dsxmedia://thumb/1000000040?w=256&h=256","type":"video","width":1920}],"endCursor":"2","hasNextPage":true,"revision":0,"total":40}
```

**Example: a limited grant with nothing shared is an empty page, not a refusal**

```js
const result = await dsx.module.media.assets({"limit":20});
// resolves {"assets":[],"hasNextPage":false,"revision":0,"total":0}
```

### cache.clear

`dsx.module.media.cache.clear`

Deletes the files in the package's working folder, except ones written in the last minute, to free space.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `freedBytes` | number | yes | How many bytes were freed. |
| `removed` | number | yes | How many files were deleted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | This surface has no media cache. | Not recoverable by retrying. |

**Example: clears what the grace window allows**

```js
const result = await dsx.module.media.cache.clear({});
// resolves {"freedBytes":4709900,"removed":2}
```

### cache.stats

`dsx.module.media.cache.stats`

Reports how much space the picked, edited and exported files in the package's working folder are using, and the size limit.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | number | yes | The total size of the files in the folder. |
| `files` | number | yes | How many files the folder holds. |
| `limitBytes` | number | yes | The size limit the folder is trimmed to. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | This surface has no media cache. | Not recoverable by retrying. |

**Example: reports the folder and its budget**

```js
const result = await dsx.module.media.cache.stats({});
// resolves {"bytes":2411500,"files":3,"limitBytes":536870912}
```

### compose

`dsx.module.media.compose`

Turns an editing timeline of clips, tracks and transitions into something a video tag can play, so an editor can preview a cut without rendering a file.

**When to use it.** Use it to preview an edit; use export to produce the final file.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | A name for the composition; composing again with the same id replaces it. |
| `timeline` | object | yes | The edit: tracks of clips with source, in and out points, position, speed, volume and transitions. |
| `timeline.background` | string | no | The colour shown where no clip is playing. |
| `timeline.fps` | number | no | Frames per second of the result. |
| `timeline.size` | array of number | no | The output width and height in pixels, as a two-item list. |
| `timeline.tracks` | array of object | no | The list of tracks; each holds a kind (video, overlay or audio) and its clips. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `degraded` | array of object | yes | Features that were played in a simpler way, such as a slide transition shown as a crossfade. |
| `duration` | number | yes | The total length in seconds. |
| `refusals` | array of object | yes | Clips that were left out because they were invalid; the rest still plays. |
| `src` | string | yes | The address to give a video tag to play the composition. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `compose_failed` | The timeline could not be composed. |  |
| `invalid_id` | A clip or composition id is missing, repeated or malformed. |  |
| `invalid_source` | A clip source is not an https URL or a Files path. |  |
| `invalid_value` | The timeline is not valid. |  |
| `not_found` | A clip source could not be read. |  |
| `out_of_range` | A timeline value is outside its range. |  |
| `overlap` | Clips on a video track overlap without a transition. |  |
| `transition_too_long` | A transition is longer than the clips or overlap it spans. |  |
| `unsupported_platform` | This platform cannot compose video. | Not recoverable by retrying. |

**Example: Preview a one clip cut**

```js
const result = await dsx.module.media.compose({"timeline":{"fps":30,"size":[1920,1080],"tracks":[{"clips":[{"at":0,"id":"intro","in":0,"out":5,"src":"documents:clips/intro.mp4"}],"kind":"video"}]}});
// resolves {"degraded":[],"duration":5,"refusals":[],"src":"dsxmedia://composition/cut-1"}
```

### export

`dsx.module.media.export`

Renders a timeline, or a single video, to a file at the quality you choose and reports progress while it works.

**When to use it.** Use it to produce the final video once the edit is done.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bitrate` | number | no | The target bits per second, kept between 32 kb/s and 200 Mb/s. |
| `codec` | string | no | h264 (the default) or hevc. If the device cannot write hevc, h264 is used and fellBack is true. |
| `fps` | number | no | Frames per second to write; defaults to the preset's or the source's. |
| `hdr` | boolean | no | Ask for HDR output. HDR is not written yet, so the result is standard range and fellBack is true. |
| `preset` | string | no | The size to fit within: 480p, 720p, 1080p, 4k, source (the default) or social. Video is never enlarged. |
| `src` | string | no | A single video to re-encode, as a Files path or https address. Give this or timeline. |
| `timeline` | object | no | The edit to render, the same one you preview with compose. Give this or src. |
| `timeline.background` | string | no | The colour shown where no clip is playing. |
| `timeline.fps` | number | no | Frames per second of the result. |
| `timeline.size` | array of number | no | The output width and height in pixels, as a two-item list. |
| `timeline.tracks` | array of object | no | The list of tracks; each holds a kind and its clips. |
| `to` | string | yes | Where to write the file, as a Files path. |
| `trim` | object | no | The part of a single source video to keep. |
| `trim.from` | number | no | Start point in milliseconds; defaults to the beginning. |
| `trim.to` | number | no | End point in milliseconds; defaults to the end. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bitrate` | number | no | The bitrate used, when it was set. |
| `bytes` | number | yes | The size of the finished file in bytes. |
| `codec` | string | yes | The codec that was actually used. |
| `duration` | number | yes | The length of the finished video in seconds. |
| `fellBack` | boolean | yes | True when a codec or HDR request had to be replaced with H.264 or standard range. |
| `fps` | number | yes | The frame rate that was actually used. |
| `hdr` | boolean | yes | True if the file is HDR. |
| `height` | number | yes | The pixel height of the finished video. |
| `path` | string | yes | The Files path of the finished video. |
| `width` | number | yes | The pixel width of the finished video. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `export_failed` | The export could not be rendered. |  |
| `invalid_value` | An export option or the timeline is not valid. |  |
| `not_found` | There is no file at that path. | Not recoverable by retrying. |
| `out_of_range` | An export option is outside its range. |  |
| `too_large` | That export would be too large for the space available. |  |
| `unsupported_format` | That is not a container this device can write. | Not recoverable by retrying. |
| `unsupported_platform` | This platform has no video encoder. | Not recoverable by retrying. |

**Example: Re-encode one video at 720p**

```js
const result = await dsx.module.media.export({"preset":"720p","src":"documents:clips/intro.mp4","to":"documents:exports/intro-720p.mp4"});
// resolves {"bytes":2400000,"codec":"h264","duration":5,"fellBack":false,"fps":30,"hdr":false,"height":720,"path":"documents:exports/intro-720p.mp4","width":1280}
```

### load

`dsx.module.media.load`

Copies the full file behind a library id into your app's cache and returns its path, reporting progress while it downloads from iCloud if needed.

**When to use it.** Use it when the person picks a row from your own grid and you need the real file.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `as` | string | no | original (the default), current (the edited version on iOS) or jpeg (converts a photo to JPEG). |
| `id` | string | yes | The library id from assets. |
| `prompt` | boolean | no | Defaults to true, which asks for library access on this call. Set false to never show a dialog. |
| `to` | string | no | A Files path to copy the file to instead of the default cache folder. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `fileName` | string | no | The name of the copied file on disk. |
| `height` | number | no | The pixel height of the loaded item. |
| `id` | string | no | The library id that was loaded. |
| `mimeType` | string | no | The MIME type of the loaded file. |
| `path` | string | no | The Files path of the copied file. |
| `size` | number | no | The size of the loaded file in bytes. |
| `type` | string | no | Whether the loaded item is an image, video or audio. |
| `width` | number | no | The pixel width of the loaded item. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_argument` | `as` is original, current or jpeg. | Not recoverable by retrying. |
| `load_failed` | That asset could not be read. |  |
| `not_found` | There is no asset with that id in the library you can see. | Not recoverable by retrying. |
| `permission_denied` | Photo library access was not granted. permission.request can ask again while canAsk is true; otherwise permission.openSettings. |  |
| `too_large` | That asset is larger than the configured copy budget. |  |
| `unsupported_platform` | This platform has no photo library to load from. | Not recoverable by retrying. |

**Example: loads an asset into the cache**

```js
const result = await dsx.module.media.load({"id":"1000000041"});
// resolves {"fileName":"dsx-media-1.jpg","height":3024,"id":"1000000041","mimeType":"image/jpeg","path":"cache:despia-media/dsx-media-1.jpg","size":2411500,"type":"image","width":4032}
```

### manipulate

`dsx.module.media.manipulate`

Resizes, crops, rotates, flips or blurs an image, applying the steps in the order you list them, and writes the result to a new file.

**When to use it.** Use it for avatars, uploads and thumbnails.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `format` | string | no | The output format: jpeg, png, webp or heic. A format the device cannot write falls back to jpeg. |
| `ops` | array of object | no | The steps to apply in order, each one resize, crop, rotate, flip or blur. |
| `path` | string | yes | The image to edit, as a Files path. |
| `quality` | number | no | Output quality from 0 to 1 for lossy formats. |
| `to` | string | no | A Files path for the result; a file in the cache folder is used when left out. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | number | yes | The result's file size. |
| `fellBack` | boolean | yes | True when the requested format could not be written and jpeg was used instead. |
| `format` | string | yes | The format that was actually written. |
| `height` | number | yes | The result's pixel height. |
| `path` | string | yes | The Files path of the new image. |
| `width` | number | yes | The result's pixel width. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `decode_failed` | That file could not be decoded as an image. | Not recoverable by retrying. |
| `invalid_ops` | That operation list could not be applied. Check the op name, its arguments and their order. | Not recoverable by retrying. |
| `not_found` | There is no file at that path. | Not recoverable by retrying. |
| `too_large` | That operation would produce an image too large to allocate. | Not recoverable by retrying. |
| `unsupported_format` | That is not an output format. Use jpeg, png, webp or heic. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot manipulate images. | Not recoverable by retrying. |

**Example: the avatar path - crop the square the user drew, then resize it**

```js
const result = await dsx.module.media.manipulate({"format":"jpeg","ops":[{"crop":{"height":2000,"width":2000,"x":500,"y":250}},{"resize":{"height":512,"width":512}}],"path":"cache:despia-media/pick-1.jpg","quality":0.8});
// resolves {"bytes":41200,"fellBack":false,"format":"jpeg","height":512,"path":"cache:despia-media/manip-1.jpg","width":512}
```

**Example: a format the platform cannot encode falls back to jpeg and says so**

```js
const result = await dsx.module.media.manipulate({"format":"webp","ops":[{"resize":{"width":400}}],"path":"cache:despia-media/pick-1.jpg"});
// resolves {"bytes":18800,"fellBack":true,"format":"jpeg","height":300,"path":"cache:despia-media/manip-2.jpg","width":400}
```

### metadata

`dsx.module.media.metadata`

Reads a photo or video file's size, length, codec, bitrate and EXIF details without decoding the whole file.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `path` | string | yes | The photo or video file, as a Files path. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bitrate` | number | yes | The average bitrate in bits per second. |
| `codec` | string | yes | The codec the file is encoded with. |
| `duration` | number | yes | Length in seconds; 0 for a still image. |
| `exif` | object | yes | The EXIF fields found in the file. |
| `height` | number | yes | The pixel height of the image or video. |
| `location` | object | no | Where the file was captured. Missing when the file has no location. |
| `location.latitude` | number | yes | The latitude where the file was captured, in degrees. |
| `location.longitude` | number | yes | The longitude where the file was captured, in degrees. |
| `width` | number | yes | The pixel width of the image or video. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `decode_failed` | That file's metadata could not be read. | Not recoverable by retrying. |
| `not_found` | There is no file at that path. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot read media metadata. | Not recoverable by retrying. |

**Example: reads an image, reporting duration 0 rather than omitting it**

```js
const result = await dsx.module.media.metadata({"path":"cache:despia-media/pick-1.jpg"});
// resolves {"bitrate":0,"codec":"jpeg","duration":0,"exif":{"DateTimeOriginal":"2026:03:11 09:14:02","Orientation":6},"height":3024,"width":4032}
```

**Example: reads a video, and carries its GPS block only when there is one**

```js
const result = await dsx.module.media.metadata({"path":"cache:despia-media/pick-3.mp4"});
// resolves {"bitrate":11800000,"codec":"h264","duration":12400,"exif":{},"height":1080,"location":{"latitude":52.520008,"longitude":13.404954},"width":1920}
```

### permission.manage

`dsx.module.media.permission.manage`

When the person gave limited access, lets them change which photos your app can see without leaving the app.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when the system would still show a dialog if asked again. |
| `changed` | boolean | yes | True when the person changed their selection. It is false on platforms with nothing to manage. |
| `level` | string | no | The permission level, read or add. |
| `status` | string | yes | The permission state after the person finished. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | This surface has no photo library selection to manage. | Not recoverable by retrying. |

**Example: presents the selection sheet under limited access**

```js
const result = await dsx.module.media.permission.manage({});
// resolves {"canAsk":false,"changed":true,"status":"limited"}
```

### permission.openSettings

`dsx.module.media.permission.openSettings`

Opens this app's page in the system Settings so the person can change photo access. Call it from a tap.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when Settings was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | Opening Settings needs the App Settings package (dsx.module.settings). | Not recoverable by retrying. |
| `unsupported_platform` | No page script can open browser or OS settings. | Not recoverable by retrying. |

**Example: opens Settings**

```js
const result = await dsx.module.media.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.media.permission.request`

Shows the system photo library permission dialog when it can still be shown, for example from a settings row or an onboarding step.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | string | no | read to ask for library access, or add to ask for permission to save. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when the system would still show a dialog if asked again. |
| `level` | string | no | The level that was asked for. |
| `status` | string | yes | The permission state after the person answered. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_level` | level must be "read" or "add". |  |
| `unsupported_platform` | This surface has no photo library grant to ask for. | Not recoverable by retrying. |

**Example: asks and reports the answer**

```js
const result = await dsx.module.media.permission.request({"level":"read"});
// resolves {"canAsk":false,"level":"read","status":"granted"}
```

### permission.status

`dsx.module.media.permission.status`

Reads the current photo library permission without ever showing a dialog.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | string | no | read to check full library access, or add to check permission to save. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when asking again would still show a system dialog. |
| `level` | string | no | The level that was checked, read or add. |
| `status` | string | yes | The permission state, such as granted, limited, denied or undetermined. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_level` | level must be "read" or "add". |  |
| `unsupported_platform` | This surface has no photo library grant to read. | Not recoverable by retrying. |

**Example: reads the grant without prompting**

```js
const result = await dsx.module.media.permission.status({});
// resolves {"canAsk":false,"level":"read","status":"limited"}
```

### pick

`dsx.module.media.pick`

Opens the system photo and video picker and returns the files the person chose, copied into your app's cache. It does not ask for photo library access.

**When to use it.** Use it for any 'choose a photo' step, such as an avatar or an attachment.

**When not to.** Do not use it to browse the whole library yourself; use assets for that.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `edit` | boolean | no | Set true to let the person crop or adjust the picture before it comes back. |
| `limit` | number | no | The most items the person may choose when multiple is on. |
| `mimeType` | string | no | Limits the pick to one MIME type such as image/gif. Platforms without a MIME filter fall back to the kind. |
| `multiple` | boolean | no | Set true to let the person choose more than one item. |
| `ordered` | boolean | no | Set true to show numbers on the selection so the order the person tapped is kept. |
| `preselected` | array of string | no | Asset ids from an earlier pick to show already selected. Only iOS supports it; other platforms ignore it. |
| `quality` | number | no | Compression quality for chosen images, from 0 to 1. |
| `source` | string | no | library (the default) to choose existing items, or camera to capture a new one, which shows the system camera prompt. |
| `type` | string | no | What to offer: image, video or any, or a narrower kind such as live, screenshot, panorama, burst, portrait, slomo, timelapse, cinematic or spatial. Platforms that cannot filter that narrowly offer the whole kind. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `assets` | array of object | yes | The chosen items; empty when the person cancelled. |
| `cancelled` | boolean | yes | True when the person closed the picker without choosing; this is not an error. |
| `filter` | string | no | The filter that was actually applied, which can be wider than the one asked for on platforms that cannot filter narrowly. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_source` | That is not a pick source. Use library or camera. | Not recoverable by retrying. |
| `no_camera` | This device has no camera. | Not recoverable by retrying. |
| `permission_denied` | Camera access was not granted. You can allow it in Settings. |  |
| `too_large` | That selection was too large to copy into the cache. |  |
| `unsupported_format` | That is not a media type this picker understands. Use image, video or any. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot present a media picker. | Not recoverable by retrying. |

**Example: the default pick returns one asset and prompts for nothing**

```js
const result = await dsx.module.media.pick({});
// resolves {"assets":[{"fileName":"IMG_0042.JPG","height":3024,"mimeType":"image/jpeg","orientation":6,"path":"cache:despia-media/pick-1.jpg","size":2411500,"width":4032}],"cancelled":false}
```

**Example: a dismissed picker RESOLVES rather than failing**

```js
const result = await dsx.module.media.pick({});
// resolves {"assets":[],"cancelled":true}
```

### pickDocument

`dsx.module.media.pickDocument`

Opens the system document picker and returns the files the person chose, copied into your app's cache. No permission is needed because the person picks each file.

**When to use it.** Use it to attach PDFs, text files or other non-photo documents.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `copyToCache` | boolean | no | Set true to copy each document into the cache so you get a normal Files path. |
| `multiple` | boolean | no | Set true to let the person choose more than one document. |
| `types` | array of string | no | A list of file types to offer, as UTIs or MIME types such as application/pdf. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `assets` | array of object | yes | The chosen documents; empty when the person cancelled. |
| `cancelled` | boolean | yes | True when the person closed the picker without choosing. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `too_large` | That document was too large to copy into the cache. |  |
| `unsupported_platform` | This surface cannot present a document picker. | Not recoverable by retrying. |

**Example: picks a document and hands back a document path**

```js
const result = await dsx.module.media.pickDocument({"types":["application/pdf"]});
// resolves {"assets":[{"fileName":"invoice.pdf","mimeType":"application/pdf","path":"cache:despia-media/doc-1.pdf","size":148200}],"cancelled":false}
```

**Example: a dismissed document picker RESOLVES too**

```js
const result = await dsx.module.media.pickDocument({});
// resolves {"assets":[],"cancelled":true}
```

### preheat

`dsx.module.media.preheat`

Warms the thumbnails for a set of library items so they appear instantly when the grid scrolls to them.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ids` | array of string | yes | The library ids to prepare thumbnails for. |
| `prompt` | boolean | no | Defaults to true, which asks for library access on this call. Set false to never show a dialog. |
| `thumb` | number | no | The thumbnail size in pixels, matching what your grid draws. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | no | How many thumbnails were queued for warming. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | Photo library access was not granted. permission.request can ask again while canAsk is true; otherwise permission.openSettings. |  |
| `unsupported_platform` | This platform has no photo library to preheat. | Not recoverable by retrying. |

**Example: warms the named rows**

```js
const result = await dsx.module.media.preheat({"ids":["1000000041","1000000040"]});
// resolves {"count":2}
```

### save

`dsx.module.media.save`

Saves a file, or a batch of files and web addresses, into the person's photo library. It asks only for the add-only permission, once, and never reads the library back.

**When to use it.** Use it after editing or downloading something the person should keep in their Photos.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `album` | string | no | The name of the album to put the saved items in. |
| `path` | string | no | One Files path to save; the result then carries its library id. |
| `paths` | array of string | no | Several Files paths to save in one call, with one result row each. |
| `prompt` | boolean | no | Defaults to true, which asks for the add permission on this call. Set false to never show a dialog; the call then fails if permission was not already granted. |
| `type` | string | no | Force the kind of item, image or video, when it cannot be guessed from the file. |
| `urls` | array of string | no | Several http or https addresses to download and save in one call. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancelled` | boolean | no | True when the person cancelled the save, on platforms that show a save dialog. |
| `failed` | number | no | How many items failed (batch only). |
| `id` | string | no | The library id of the saved item (single path only). |
| `results` | array of object | no | One row per item in a batch, saying whether it was saved or why not. |
| `saved` | number | no | How many items were saved (batch only). |
| `total` | number | no | How many items were attempted (batch only). |
| `uri` | string | no | The library address of the saved item (single path only). |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `gesture_required` | A browser only opens a save picker from a user gesture. Call this from a tap or click handler. |  |
| `not_found` | There is no file at that path to save. | Not recoverable by retrying. |
| `permission_denied` | Photo library access was not granted. permission.request can ask again while canAsk is true; otherwise permission.openSettings. |  |
| `unsupported_format` | The photo library does not accept that kind of file. | Not recoverable by retrying. |
| `unsupported_platform` | This platform has no photo library to save into. | Not recoverable by retrying. |

**Example: saves a file and reports the new library identifier**

```js
const result = await dsx.module.media.save({"path":"cache:despia-media/edit-1.jpg"});
// resolves {"id":"9F1C0A72-3D94-4E88-B5A1-0C7E2D9B3F41/L0/001","uri":"ph://9F1C0A72-3D94-4E88-B5A1-0C7E2D9B3F41"}
```

**Example: saves into a named album, creating it when it does not exist**

```js
const result = await dsx.module.media.save({"album":"Receipts","path":"cache:despia-media/edit-1.jpg"});
// resolves {"id":"9F1C0A72-3D94-4E88-B5A1-0C7E2D9B3F42/L0/001","uri":"ph://9F1C0A72-3D94-4E88-B5A1-0C7E2D9B3F42"}
```

### thumbnail

`dsx.module.media.thumbnail`

Saves one exact frame of a video as an image file, for a poster or preview.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `at` | number | no | The moment to capture, in milliseconds from the start; defaults to 0. |
| `path` | string | yes | The video file, as a Files path. |
| `quality` | number | no | Image quality from 0 to 1. |
| `width` | number | no | The width of the picture in pixels; the height follows the video's shape. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `height` | number | yes | The image's pixel height. |
| `path` | string | yes | The Files path of the image. |
| `width` | number | yes | The image's pixel width. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `decode_failed` | No frame could be read from that file. | Not recoverable by retrying. |
| `not_found` | There is no file at that path. | Not recoverable by retrying. |
| `unsupported_format` | That file is not a video this device can read. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot generate video thumbnails. | Not recoverable by retrying. |

**Example: takes the frame at the requested time, scaled to the requested width**

```js
const result = await dsx.module.media.thumbnail({"at":2000,"path":"cache:despia-media/pick-3.mp4","width":320});
// resolves {"height":180,"path":"cache:despia-media/thumb-1.jpg","width":320}
```

### transcode

`dsx.module.media.transcode`

Re-encodes a video, or an audio file, to a smaller size or another container, optionally trimming it, and reports progress while it runs.

**When to use it.** Use it to shrink a video before uploading it. For new work, export does the same with more options.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bitrate` | number | no | The target bits per second for the video. It cannot be combined with passthrough. |
| `path` | string | yes | The video or audio file, as a Files path. |
| `preset` | string | no | A size to fit within, 480p up to 2160p, or passthrough to copy without re-encoding where the platform allows it. |
| `to` | string | yes | Where to write the result, as a Files path. |
| `trim` | object | no | The part of the file to keep. |
| `trim.from` | number | no | Start point in milliseconds; defaults to the beginning. |
| `trim.to` | number | no | End point in milliseconds; defaults to the end. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | number | yes | The result's file size. |
| `duration` | number | yes | The result's length in seconds. |
| `path` | string | yes | The Files path of the result. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_found` | There is no file at that path. | Not recoverable by retrying. |
| `too_large` | That export would be too large for the space available. |  |
| `transcode_failed` | That video could not be re-encoded. |  |
| `unsupported_format` | That is not a container this device can write. | Not recoverable by retrying. |
| `unsupported_platform` | This platform has no video encoder. | Not recoverable by retrying. |

**Example: streams monotonic progress and settles once**

```js
const result = await dsx.module.media.transcode({"path":"cache:despia-media/pick-3.mp4","preset":"720p","to":"cache:despia-media/small.mp4"});
// resolves {"bytes":4180000,"duration":12400,"path":"cache:despia-media/small.mp4"}
```

**Example: trims before encoding, so the output is only the range asked for**

```js
const result = await dsx.module.media.transcode({"path":"cache:despia-media/pick-3.mp4","to":"cache:despia-media/clip.mp4","trim":{"from":2000,"to":6000}});
// resolves {"bytes":1340000,"duration":4000,"path":"cache:despia-media/clip.mp4"}
```

### upload

`dsx.module.media.upload`

Uploads a file from the device to your app's own media storage in chunks, as the signed-in person, and returns the key it was stored under.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `contentType` | string | no | The MIME type to store with the file, for example image/jpeg; guessed from the file when left out. |
| `name` | string | no | The file name to store the object under; defaults to the file's own name. |
| `path` | string | yes | The file to upload, as a Files path such as cache:despia-media/photo.jpg. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `contentType` | string | yes | The MIME type the storage deployment recorded for the file. |
| `key` | string | yes | The storage key of the uploaded object; pass it to url to get a link. |
| `size` | number | yes | The number of bytes that were stored. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_argument` | The call was missing the file path or gave an unusable value. | Pass a Files path in path. |
| `not_found` | There is no file at that path. | Not recoverable by retrying. |
| `signed_out` | A signed in session is required to upload. |  |
| `storage_unconfigured` | Media storage has no endpoint configured for this build. | Not recoverable by retrying. |
| `too_large` | The file is larger than the storage deployment accepts. | Not recoverable by retrying. |
| `type_not_accepted` | The storage deployment does not accept that content type. | Not recoverable by retrying. |
| `unsupported_platform` | Media storage is not supported on this platform. | Not recoverable by retrying. |
| `upload_failed` | The upload could not be completed. |  |

**Example: uploads a picked photo and resolves its key**

```js
const result = await dsx.module.media.upload({"path":"cache:despia-media/pick-1.jpg"});
// resolves {"contentType":"image/jpeg","key":"u/0a1b2c3d4e5f6071/8f0e2d7c-1111-4222-8333-944455556666/pick-1.jpg","size":48213}
```

### url

`dsx.module.media.url`

Returns a signed link for one of the signed-in person's stored files, optionally as a resized image variant, so you can show it or share it for a limited time.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `expiresIn` | number | no | How many seconds the signed link stays valid. |
| `key` | string | yes | The storage key returned by upload. |
| `transform` | object | no | One image variant to produce, with width w, height h, fit, format fmt and quality q. |
| `transform.fit` | string | no | How the image fills the box: cover, contain or inside. |
| `transform.fmt` | string | no | Output format: webp, avif, jpeg or png. |
| `transform.h` | number | no | The target image height in pixels. |
| `transform.q` | number | no | Output quality as a number you choose for the encoder. |
| `transform.w` | number | no | The target image width in pixels. |
| `widths` | array of number | no | A list of pixel widths from the fixed ladder 64 to 3840; asks for one link per width so an image can pick the best size. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `expires` | number | yes | When the link stops working, as a time stamp. |
| `sources` | string | yes | A ready-made value for the sources attribute of an image, listing each width and its link. Only present when widths was given. |
| `url` | string | yes | The signed link; with widths it is the widest variant. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_argument` | A width off the ladder or an unknown transform was refused. | Not recoverable by retrying. |
| `not_found` | There is no stored object with that key for this person. | Not recoverable by retrying. |
| `signed_out` | A signed in session is required. |  |
| `storage_unconfigured` | Media storage has no endpoint configured for this build. | Not recoverable by retrying. |
| `unsupported_platform` | Media storage is not supported on this platform. | Not recoverable by retrying. |
| `upload_failed` | The URL could not be signed. |  |

**Example: signs a responsive set for an image element**

```js
const result = await dsx.module.media.url({"key":"u/0a1b2c3d4e5f6071/8f0e2d7c-1111-4222-8333-944455556666/pick-1.jpg","widths":[256,640]});
// resolves {"expires":1790000000,"sources":"256:https://media.example.com/media/o/u/0a1b2c3d4e5f6071/8f0e2d7c-1111-4222-8333-944455556666/pick-1.jpg?w=256&exp=1790000000&sig=b2f1, 640:https://media.example.com/media/o/u/0a1b2c3d4e5f6071/8f0e2d7c-1111-4222-8333-944455556666/pick-1.jpg?w=640&exp=1790000000&sig=c1e6","url":"https://media.example.com/media/o/u/0a1b2c3d4e5f6071/8f0e2d7c-1111-4222-8333-944455556666/pick-1.jpg?w=640&exp=1790000000&sig=c1e6"}
```

## Events

Read with `dsx.on(name, handler)`.

### libraryChanged

Fires when the photo library changes, so a custom grid knows to reload its first page.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `revision` | number | yes | The new library revision number. |

### progress

Fires while a load, transcode or export is running, so you can show a progress bar.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `fraction` | number | yes | How far along the work is, from 0 to 1. |

### uploadProgress

Fires as an upload sends chunks, so you can show a progress bar.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id that identifies this upload session. |
| `offset` | number | yes | How many bytes have been sent so far. |
| `size` | number | yes | The total number of bytes to send. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `cache_directory` | string | `despia-media` | The folder under cache: that picked, manipulated and transcoded files are written to. |
| `cache_max_mb` | number | `512` | The most space, in megabytes, that picked, loaded and edited media may keep in the cache before the oldest files are removed. |
| `max_copy_bytes` | number | `536870912` | The largest single file a picker may copy into the cache, in bytes. Larger selections fail with too_large. |
| `storage_endpoint` | string | `` | The origin of your own media storage deployment. media.upload and media.url reach it; empty refuses both by name. |
| `usage_add` | multiline | `Saving photos and videos you create in this app to your library` | The message shown when iOS asks for permission to add a photo or video to the library. |
| `usage_camera` | multiline | `Taking a photo or video at your request` | The message shown when iOS asks for camera access. |
| `usage_library` | multiline | `Browsing your photo library so you can choose from it inside the app` | The message shown when iOS asks for full access to the photo library. Only media.albums and media.assets ever trigger it. |

## Related packages

- Used by: [Chat](/packages/chat)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
