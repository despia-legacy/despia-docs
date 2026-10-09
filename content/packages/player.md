---
title: Player
description: Play videos and streams in your app, with offline downloads.
package: player
---

Play videos and streams in your app, with offline downloads.

A complete video player for your app: the picture, touch controls that hide themselves, a seek bar with chapters, speed, quality, audio and subtitle choices, Picture in Picture and offline copies. You can put the player inside a screen like any other element, or open it full screen with one call. You write the video addresses, titles and the screens around the player.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it whenever the app plays a video or a streamed playlist, inline in a card or full screen. For plain audio, use the audio package instead.

## What native adds

Playback runs on the phone's own video pipeline, so you get Picture in Picture, lock screen controls and background audio behaviour that users expect.

## Install

```sh
despia add Core/Player
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

### cancelDownload

`dsx.module.player.cancelDownload`

Stops a download that is running and forgets it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the download to stop. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancelled` | boolean | yes | True when a running download was stopped, false for an id that is not downloading. |

**Example: cancels a running download**

```js
const result = await dsx.module.player.cancelDownload({"id":"a"});
// resolves {"cancelled":true}
```

**Example: an unknown id is a no-op**

```js
const result = await dsx.module.player.cancelDownload({"id":"nope"});
// resolves {"cancelled":false}
```

### close

`dsx.module.player.close`

Closes the full screen player if it is open; it is safe to call when nothing is playing.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `closed` | boolean | yes | True when a player was open and is now closed. |

**Example: dismisses a live screen**

```js
const result = await dsx.module.player.close({});
// resolves {"closed":true}
```

**Example: closing when nothing plays is a no-op, not a failure**

```js
const result = await dsx.module.player.close({});
// resolves {"closed":false}
```

### download

`dsx.module.player.download`

Starts keeping a copy of a video on the device for offline viewing and answers at once with its state.

**When to use it.** Use it for a save for offline button; follow the progress in the downloads state.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | Your own id for this video; if left out, one is made from the address. |
| `meta` | object | no | Any extra details you want stored with the copy, such as a show and episode, returned exactly as given. |
| `poster` | string | no | The address of a still picture to keep with the saved copy. |
| `title` | string | no | The title to keep with the saved copy. |
| `url` | string | yes | The https or http address of the video: a single file or an HLS playlist. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the saved copy in the download catalog. |
| `state` | string | yes | Where the download is now, such as downloading or finished. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `download_failed` | The download could not start. |  |
| `invalid_url` | The download address could not be used. | Not recoverable by retrying. |
| `no_url` | The call did not include a video address, so there was nothing to save. | Pass the url of the video. |
| `unsupported_device` | A segmented stream cannot be kept on this device. | Not recoverable by retrying. |

**Example: starts a download and says so**

```js
const result = await dsx.module.player.download({"id":"a","url":"https://cdn.example.com/a.mp4"});
// resolves {"id":"a","state":"downloading"}
```

**Example: a download already finished starts nothing**

```js
const result = await dsx.module.player.download({"id":"a","url":"https://cdn.example.com/a.mp4"});
// resolves {"id":"a","state":"downloaded"}
```

### play

`dsx.module.player.play`

Opens the player full screen over the app and plays a video file or HLS playlist.

**When to use it.** Use it when a tap should start a video; to show the video inside a card, place the player element in your layout instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `artist` | string | no | The author or show name shown with the title. |
| `autoplay` | boolean | no | True to start playing as soon as the player opens. |
| `chapters` | array of object | no | A list of chapters, each with a time in seconds and a title. |
| `gravity` | string | no | How the picture fills the screen: fit keeps it whole (the default), fill crops it to cover. |
| `id` | string | no | The name this video has in your download catalog; with it the player offers to save it offline and plays the saved copy when there is one. |
| `loop` | boolean | no | True to start over when the video ends. |
| `muted` | boolean | no | True to start without sound. |
| `pip` | boolean | no | Whether to offer Picture in Picture on devices that support it. |
| `poster` | string | no | The address of a still picture shown before the video starts. |
| `skipStep` | number | no | How many seconds the skip buttons jump. |
| `speed` | number | no | The starting playback speed, where 1 is normal. |
| `speeds` | array of number | no | The playback speeds to offer in the speed menu. |
| `start` | number | no | Where to begin, in seconds. |
| `title` | string | no | The title shown in the player and on the lock screen. |
| `url` | string | yes | The address of the video: a single file or an HLS playlist. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `pictureInPicture` | boolean | yes | True when this device can show the video in Picture in Picture. |
| `playing` | boolean | yes | True when the player is now on screen. |
| `url` | string | yes | The address of the video that was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_url` | The video URL could not be parsed. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find a screen to present the player from. | Not recoverable by retrying. |
| `no_url` | The call did not include a video address, so there was nothing to play. | Pass the url of the video. |
| `playback_failed` | The player could not start. |  |

**Example: plays a stream full screen**

```js
const result = await dsx.module.player.play({"url":"https://cdn.example.com/clip.m3u8"});
// resolves {"pictureInPicture":true,"playing":true,"url":"https://cdn.example.com/clip.m3u8"}
```

**Example: a device without Picture in Picture still plays**

```js
const result = await dsx.module.player.play({"url":"https://cdn.example.com/clip.mp4"});
// resolves {"pictureInPicture":false,"playing":true,"url":"https://cdn.example.com/clip.mp4"}
```

### removeDownload

`dsx.module.player.removeDownload`

Deletes a saved video and its files from the device, whether it is still downloading or finished.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the saved copy to delete. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `removed` | boolean | yes | True when the copy was deleted, false when no such copy exists. |

**Example: removes a finished download**

```js
const result = await dsx.module.player.removeDownload({"id":"a"});
// resolves {"removed":true}
```

**Example: an unknown id is a no-op**

```js
const result = await dsx.module.player.removeDownload({"id":"nope"});
// resolves {"removed":false}
```

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `download_failed` | The download could not start. |  |
| `invalid_url` | The address could not be used. |  |
| `no_presenter` | Couldn't find a screen to present the player from. |  |
| `no_url` | The call did not include a video address, so there was nothing to play or save. | Pass the url of the video. |
| `playback_failed` | The player could not start. |  |
| `unsupported_device` | A segmented stream cannot be kept on this device. |  |

## Related packages

- Needs: [Cast](/packages/cast)
- Used by: [VerticalPlayerStack](/packages/verticalplayer)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
