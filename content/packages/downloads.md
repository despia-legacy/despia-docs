---
title: Downloads
description: Watch file downloads as they start, progress and finish.
package: downloads
---

Watch file downloads as they start, progress and finish.

Reports the app's content downloads to your page as events when each one starts, moves forward and ends, and can list the downloads that are in flight right now. It only observes. It never starts, pauses or cancels a download, and it works for the downloads the app's content system makes itself.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when you want a progress bar or a done message for the app's content downloads. If you need to start or control downloads, use the Files package instead.

## Install

```sh
despia add Core/Downloads
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

### list

`dsx.module.downloads.list`

Reads the downloads that are in flight right now, with their progress. It is a pure read and changes nothing.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many downloads are in flight. |
| `items` | array of object | yes | The downloads in flight, each with its id, file name, progress and status. |

**Example: returns the in-flight snapshot**

```js
const result = await dsx.module.downloads.list({});
// resolves {"count":0,"items":[]}
```

**Example: lists a transfer while it is running**

```js
const result = await dsx.module.downloads.list({});
// resolves {"count":1,"items":[{"fileName":"clip.mp4","id":"dl-1","progress":0.42}]}
```

## Events

Read with `dsx.on(name, handler)`.

### completed

Fires when a download ends, whether it worked or not.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The download's stable id. |
| `success` | boolean | yes | False when the download failed. |

### progressed

Fires when a download moves forward, with its new progress and status.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `fileName` | string | no | The name of the file being downloaded. |
| `id` | string | yes | The download's stable id. |
| `progress` | number | no | How far the download has got, from 0 to 1. |
| `status` | string | no | A label for the download's state, once one was reported. |

### started

Fires when a download begins, with its file name and progress when the downloader reported them.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `fileName` | string | no | The name of the file being downloaded. |
| `id` | string | yes | The download's stable id. |
| `progress` | number | no | How far the download has got, from 0 to 1. |
| `status` | string | no | A label for the download's state, once one was reported. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
