---
title: Cast to TV
description: Let users play your app's video and audio on a TV or speaker.
package: cast
---

Let users play your app's video and audio on a TV or speaker.

Adds a cast button flow: users pick a TV or speaker and your media plays there, with play, pause, seek and queue controls. Uses AirPlay on iOS, the system output switcher on Android and Remote Playback on the web. Add the Google Cast package to also reach Chromecast and Google TV devices.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to let the person watch your video or listen to your audio on a TV or speaker. It only chooses the route; your app draws its own cast button from the context.

## What native adds

AirPlay on iOS, the system output switcher on Android and Remote Playback in the browser give the native device picker and background playback that a page cannot reproduce.

## Install

```sh
despia add Core/Cast
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

### connect

`dsx.module.cast.connect`

Starts a session on a receiver from a provider, such as a Chromecast, using an id from the devices list.

**When not to.** System routes have no connect; their chooser connects.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the receiver to connect to, from the devices list. |
| `route` | string | no | The provider that owns the receiver; by default the one provider that lists the id. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `device` | object | yes | The receiver that is now connected. |
| `device.id` | string | no | The unique id of the connected receiver. |
| `device.model` | string | no | The model name of the connected receiver. |
| `device.name` | string | no | The display name of the connected receiver. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required argument was not given. | Pass every required argument. |
| `offline` | The device is offline, so it cannot reach cast receivers. | Wait until the connection returns and try again. |
| `unknown_device` | No cast provider lists a receiver with that id. | Refresh the device list and use an id from it. |
| `unknown_route` | The route name you gave is not one this device offers. | Read routes first and use one of the names it returns. |
| `unsupported_device` | This browser has neither Remote Playback nor a cast provider that works here. | Hide the cast button on this browser. |

**Example: connects to a receiver**

```js
const result = await dsx.module.cast.connect({"id":"device-1"});
// resolves {"device":{"id":"device-1","model":"Chromecast","name":"Living Room"}}
```

### disconnect

`dsx.module.cast.disconnect`

Ends the provider session so the receiver's app stops.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the session ended. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_connected` | No cast session is running. | Connect to a device first. |
| `system_route` | AirPlay, the output switcher and Remote Playback play the app's own player, so this call does not apply. | Control the app's own player instead, or pick a provider route. |

**Example: ends the session**

```js
const result = await dsx.module.cast.disconnect({});
// resolves {"ok":true}
```

### load

`dsx.module.cast.load`

Plays a media address on the connected provider receiver.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `contentType` | string | no | The MIME type of the media, such as video/mp4; guessed from the file ending when left out. |
| `image` | string | no | The address of a poster image shown on the receiver. |
| `live` | boolean | no | Set true when the media is a live stream with no end. |
| `position` | number | no | Where to start playing, in seconds. |
| `subtitle` | string | no | A second line of text shown under the title. |
| `title` | string | no | The title shown on the TV or speaker. |
| `url` | string | yes | The address of the media to play, starting with http or https. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the receiver accepted the media. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_connected` | No cast session is running. | Connect to a device first. |
| `system_route` | AirPlay, the output switcher and Remote Playback play the app's own player, so this call does not apply. | Control the app's own player instead, or pick a provider route. |

**Example: loads media on the receiver**

```js
const result = await dsx.module.cast.load({"url":"https://example.com/a.m3u8"});
// resolves {"ok":true}
```

### pause

`dsx.module.cast.pause`

Pauses playing on the connected provider receiver.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the receiver paused. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_connected` | No cast session is running. | Connect to a device first. |
| `system_route` | AirPlay, the output switcher and Remote Playback play the app's own player, so this call does not apply. | Control the app's own player instead, or pick a provider route. |

**Example: pauses**

```js
const result = await dsx.module.cast.pause({});
// resolves {"ok":true}
```

### pick

`dsx.module.cast.pick`

Opens the chooser where the person selects a TV or speaker. Dismissing it is not an error.

**When to use it.** Call it when the person taps your cast button.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `route` | string | no | Which route's chooser to open: airplay, system, remote or a provider's name. The first route is used when left out. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when the chooser was shown, false when the person dismissed it. |
| `route` | string | yes | The route whose chooser was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_argument` | An argument has a value the call cannot use. | Check the argument against the route list or the documented range. |
| `no_media` | Remote Playback casts a video or audio element and the page has none. | Show the media element first, then call pick. |
| `no_presenter` | No screen was available to present the chooser from. | Try again when the app is in the foreground. |
| `unknown_route` | The route name you gave is not one this device offers. | Read routes first and use one of the names it returns. |
| `unsupported` | Nothing on this device can cast, because it has no system route and no cast provider package. | Hide the cast button when the cast context says it is unavailable. |
| `unsupported_device` | This browser has neither Remote Playback nor a cast provider that works here. | Hide the cast button on this browser. |

**Example: opens the first route**

```js
const result = await dsx.module.cast.pick({});
// resolves {"opened":true,"route":"airplay"}
```

### play

`dsx.module.cast.play`

Resumes playing on the connected provider receiver.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the receiver resumed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_connected` | No cast session is running. | Connect to a device first. |
| `system_route` | AirPlay, the output switcher and Remote Playback play the app's own player, so this call does not apply. | Control the app's own player instead, or pick a provider route. |

**Example: plays**

```js
const result = await dsx.module.cast.play({});
// resolves {"ok":true}
```

### queue

`dsx.module.cast.queue`

Loads a list of media items into the receiver as a queue and starts playing at the item you choose.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `index` | number | no | The position in the list to start at; defaults to the first. |
| `items` | array of object | yes | One to 100 items, each with the same fields as load. |
| `repeat` | string | no | off (the default), all or one. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the receiver accepted the queue. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_index` | The start index is not a whole number inside the items. | Pass an index that exists in the list. |
| `invalid_items` | The items are not a list of 1 to 100 objects that each have an http or https url. | Fix the list and try again. |
| `invalid_repeat` | The repeat value is not off, all or one. | Use off, all or one. |
| `missing_param` | A required argument was not given. | Pass every required argument. |
| `not_connected` | No cast session is running. | Connect to a device first. |
| `system_route` | AirPlay, the output switcher and Remote Playback play the app's own player, so this call does not apply. | Control the app's own player instead, or pick a provider route. |

**Example: loads a queue**

```js
const result = await dsx.module.cast.queue({"items":[{"url":"https://example.com/a.m3u8"},{"url":"https://example.com/b.m3u8"}]});
// resolves {"ok":true}
```

### routes

`dsx.module.cast.routes`

Lists the cast routes available on this device, such as AirPlay or a cast provider.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `routes` | array of object | yes | The routes found, each with a name and a kind. |

**Example: lists the routes**

```js
const result = await dsx.module.cast.routes({});
// resolves {"routes":[{"kind":"system","name":"airplay"}]}
```

### seek

`dsx.module.cast.seek`

Jumps the receiver's playback to a position in the media.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `position` | number | yes | The position to jump to, in seconds from the start. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the receiver moved. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_connected` | No cast session is running. | Connect to a device first. |
| `system_route` | AirPlay, the output switcher and Remote Playback play the app's own player, so this call does not apply. | Control the app's own player instead, or pick a provider route. |

**Example: seeks**

```js
const result = await dsx.module.cast.seek({"position":30});
// resolves {"ok":true}
```

### set

`dsx.module.cast.set`

Changes volume, mute, subtitle track, audio track or speed on the receiver. Only the values you give are changed.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `audio` | string | no | The id of the audio track to play, from the media's tracks. |
| `muted` | boolean | no | True to mute the receiver, false to unmute. |
| `rate` | number | no | Playback speed from 0.5 to 2. |
| `text` | string | no | The id of the subtitle track to show, from the media's tracks, or off to hide subtitles. |
| `volume` | number | no | Volume from 0 to 1. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the receiver applied the changes. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_muted` | The muted value is not true or false. | Pass true or false. |
| `invalid_rate` | The playback rate is not between 0.5 and 2. | Pass a rate from 0.5 to 2. |
| `invalid_track` | The text or audio value is not a track id from the media's tracks. | Use an id from the media tracks, or off for text. |
| `invalid_volume` | The volume is not a number from 0 to 1. | Pass a volume between 0 and 1. |
| `missing_param` | A required argument was not given. | Pass every required argument. |
| `not_connected` | No cast session is running. | Connect to a device first. |
| `system_route` | AirPlay, the output switcher and Remote Playback play the app's own player, so this call does not apply. | Control the app's own player instead, or pick a provider route. |

**Example: sets the volume**

```js
const result = await dsx.module.cast.set({"volume":0.4});
// resolves {"ok":true}
```

### skip

`dsx.module.cast.skip`

Moves the receiver's queue forward or back by a number of items.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `by` | number | yes | How many items to move; 1 is next, -1 is previous. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `index` | number | yes | The position in the queue that is now playing. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_argument` | An argument has a value the call cannot use. | Check the argument against the route list or the documented range. |
| `no_queue` | No queue is loaded on the receiver. | Load a queue first. |
| `not_connected` | No cast session is running. | Connect to a device first. |
| `queue_end` | There is no item that far along the queue. | Skip fewer items or turn on repeat all. |
| `system_route` | AirPlay, the output switcher and Remote Playback play the app's own player, so this call does not apply. | Control the app's own player instead, or pick a provider route. |

**Example: skips to the next item**

```js
const result = await dsx.module.cast.skip({"by":1});
// resolves {"index":1}
```

### stop

`dsx.module.cast.stop`

Stops the media on the receiver but keeps the session open.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the media stopped. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_connected` | No cast session is running. | Connect to a device first. |
| `system_route` | AirPlay, the output switcher and Remote Playback play the app's own player, so this call does not apply. | Control the app's own player instead, or pick a provider route. |

**Example: stops**

```js
const result = await dsx.module.cast.stop({});
// resolves {"ok":true}
```

## Related packages

- Used by: [GoogleCast](/packages/googlecast), [Player](/packages/player)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
