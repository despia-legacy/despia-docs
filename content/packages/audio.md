---
title: Audio
description: Play music, podcasts and audiobooks with lock screen controls and background playback.
package: audio
---

Play music, podcasts and audiobooks with lock screen controls and background playback.

Describe what should sound and play, pause, seek and mix it. Handles the device audio session, the now-playing lock screen and remote controls, output routing and resuming where the listener left off. Use it for music, audiobooks, voice and sound effects. Works on phones and desktop.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it whenever your app makes sound: music, podcasts, audiobooks, voice, sound effects or live microphone audio. For recording to a file or editing audio use its Record and Edit children, and for video playback use the video components.

## What native adds

The native audio session lets sound keep playing with the screen locked, share the speaker politely with calls and other apps, and show controls on the lock screen and in the car, which a web page cannot do reliably.

## Install

```sh
despia add Core/Audio
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

### attach

`dsx.module.audio.attach`

Lets another live media surface, such as a video or call, take over the one system now-playing display and its remote controls.

**When to use it.** Use it when media is played by something other than an audio graph and still needs lock screen controls.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cameraActive` | boolean | no | True shows the camera as active on the web media session. |
| `claim` | boolean | no | True takes the surface over; otherwise the call updates a claim you already hold. |
| `command` | object | no | On iOS, the native handler that runs a remote command on your player. |
| `commands` | array of string | no | On iOS, which remote commands you answer: play, pause, seekBy, seek, next and prev. |
| `handlers` | object | no | On web, the handlers for media session actions such as hangup or togglemicrophone. |
| `info` | object | no | On iOS, what to display: title, artist, progress, length and speed. |
| `info.artist` | string | no | The artist shown on the now-playing surface. |
| `info.duration` | number | no | The total length in seconds. |
| `info.elapsed` | number | no | How many seconds have played. |
| `info.live` | boolean | no | True when what plays is a live stream. |
| `info.rate` | number | no | The playback speed; use 0 while paused. |
| `info.title` | string | no | The title shown on the now-playing surface. |
| `info.video` | boolean | no | True when what plays is video. |
| `metadata` | object | no | On web, the title, artist, album and artwork to show, or null. |
| `metadata.album` | string | no | The album shown on the now-playing surface. |
| `metadata.artist` | string | no | The artist shown on the now-playing surface. |
| `metadata.artwork` | string | no | The artwork address shown on the now-playing surface. |
| `metadata.title` | string | no | The title shown on the now-playing surface. |
| `microphoneActive` | boolean | no | True shows the microphone as active on the web media session. |
| `owner` | object | no | On iOS and web, an object that identifies who holds the surface; detach must give the same one. |
| `playbackState` | string | no | On web, playing, paused or none. |
| `player` | object | no | On Android, the live player to show on the now-playing surface. |
| `skip` | number | no | On iOS, the skip interval in seconds. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attached` | boolean | yes | True when the surface now belongs to the caller. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_value` | A value has the wrong shape for where it is used (see `path`). | Not recoverable by retrying. |

**Example: claims the surface for the caller**

```js
const result = await dsx.module.audio.attach({"claim":true,"owner":{"id":"fixture"}});
// resolves {"attached":true}
```

### capture

`dsx.module.audio.capture`

Records any input or bus of the live graph to a file or to a stream of audio frames, on behalf of the recording package.

**When to use it.** Used by the Record package; most apps call that instead of this action.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `channels` | number | no | 1 for mono or 2 for stereo; 2 by default. |
| `format` | string | no | The file format: m4a, wav, opus or flac; m4a by default. |
| `frames` | object | no | Delivers frame blocks to the owner instead of writing a file. Native only. |
| `frames.format` | string | yes | The frame sample format, pcm16 or f32. |
| `frames.rate` | int | no | The frame rate in hertz, from 8000 to 192000. |
| `from` | string | no | The input or bus id to capture; a bus needs the mix engine. |
| `owner` | string | yes | The identity of the capturing package; every call names it and each owner has one capture. |
| `path` | string | no | The file to write on native, or a label on web. Needed on start. |
| `paused` | boolean | no | True pauses the capture and false resumes it. |
| `release` | boolean | no | True finishes the capture and closes the file. |
| `sampleRate` | number | no | The sample rate in hertz, from 8000 to 192000. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | number | no | How many bytes have been written. |
| `channels` | number | no | The channel count in use. |
| `duration` | number | no | How many seconds of sound have been captured so far. |
| `format` | string | no | The file format in use. |
| `frames` | number | no | How many frames have been captured. |
| `from` | string | no | The node that was captured. |
| `level` | number | no | The current loudness of the capture. |
| `peak` | number | no | The highest level reached so far. |
| `rate` | number | no | The sample rate in use. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | This owner already has a capture running. |  |
| `invalid_value` | A value has the wrong shape for where it is used (see `path`). | Not recoverable by retrying. |
| `mix_unavailable` | A bus can be captured only on the mix tier (see `path`). | Not recoverable by retrying. |
| `not_recording` | This owner has no capture running. | Not recoverable by retrying. |
| `out_of_range` | A number is outside its range, or is not a number (see `path`). | Not recoverable by retrying. |
| `session_failed` | The capture could not be started on this engine. |  |
| `unknown_node` | The id names no node of the kind this place needs (see `path`). | Not recoverable by retrying. |
| `unsupported_format` | This renderer cannot write that format for a capture (see `path`). | Not recoverable by retrying. |
| `unsupported_platform` | The frames sink is native only (see `path`). | Not recoverable by retrying. |

**Example: Start recording the main mix to a file**

```js
const result = await dsx.module.audio.capture({"format":"m4a","from":"main","owner":"voice-notes","path":"note.m4a"});
// resolves {"channels":2,"format":"m4a","from":"main","rate":48000}
```

**Example: Finish the recording and close the file**

```js
const result = await dsx.module.audio.capture({"owner":"voice-notes","release":true});
// resolves {"bytes":98304,"duration":12.4,"format":"m4a","frames":595200}
```

### claim

`dsx.module.audio.claim`

Lets a package ask for the audio session behaviour it needs, such as call, voice or media, instead of changing the session itself.

**When to use it.** Use it from packages that make sound outside the graph so they share the session safely. Calling again with the same owner updates the claim.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `background` | boolean | no | True keeps sounding in the background; it defaults to true for call, voice, media and spoken. |
| `intent` | string | no | What the sound is for: call, voice, record, spoken, media, ambient or sfx. Required unless you release. |
| `others` | string | no | What other apps hear: interrupt, duck or mix. |
| `owner` | string | yes | A stable name for who is claiming, such as call:7; only the same owner can update or release it. |
| `release` | boolean | no | True withdraws the claim so the session is worked out again without it. |
| `unprocessed` | boolean | no | For record claims, captures without voice processing, gain control or noise suppression. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `claims` | array of object | yes | All claims that are currently held. |
| `generation` | number | yes | A counter that grows each time the session is reapplied. |
| `holder` | string | yes | The owner whose intent currently decides the session. |
| `intent` | string | yes | The intent the session is now set up for. |
| `interrupted` | array of string | yes | The owners that were paused by an interruption. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_value` | A value has the wrong shape for where it is used (see `path`). | Not recoverable by retrying. |
| `permission_denied` | The microphone permission is not granted: opening an input and a voice or record claim both need it. |  |
| `session_failed` | The audio session would not activate, so playback would produce no sound. |  |

**Example: posts a media claim**

```js
const result = await dsx.module.audio.claim({"intent":"media","owner":"video:3"});
// resolves {"claims":[{"intent":"media","owner":"video:3"}],"generation":1,"holder":"video:3","intent":"media","interrupted":[]}
```

### detach

`dsx.module.audio.detach`

Releases a now-playing claim so the graph's own player can take the surface back.

**When to use it.** Use it when your media surface ends.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `owner` | object | no | On iOS and web, the same owner that attached. |
| `player` | object | no | On Android, the live player that holds the claim. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attached` | boolean | yes | True while a claim is still held; false after a release. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_value` | A value has the wrong shape for where it is used (see `path`). | Not recoverable by retrying. |

**Example: a release naming no holder changes nothing**

```js
const result = await dsx.module.audio.detach({"owner":{"id":"nobody"}});
// resolves {"attached":false}
```

### graph.set

`dsx.module.audio.graph.set`

Declares everything that should sound as one document of nodes, and the audio engine reconciles it with what is already running.

**When to use it.** Use it to set up or rearrange your players, buses, inputs and outputs. Nodes you keep keep playing from where they were.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `graph` | object | yes | The audio graph document: a list of nodes plus how other apps are treated. |
| `graph.nodes` | array of object | yes | The nodes of the graph, each with an id and a kind such as player, bus, input, output or tap. |
| `graph.others` | string | no | What other apps hear while this graph sounds: interrupt them, duck them or mix with them. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `nodes` | array of object | yes | The nodes of the graph as accepted, with defaults filled in. |
| `tier` | string | yes | Which engine the graph runs on: stream for plain playback or mix when it needs buses, effects or inputs. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bus_cycle` | Buses route into each other in a loop. | Not recoverable by retrying. |
| `invalid_graph` | The graph is not an object with a `nodes` list. | Not recoverable by retrying. |
| `invalid_id` | A node id is missing, repeated, or `main` on something that is not the main bus. | Not recoverable by retrying. |
| `invalid_source` | A source is not an https URL or a Core/Files path naming a file. | Not recoverable by retrying. |
| `invalid_value` | A value has the wrong shape for where it is used (see `path`). | Not recoverable by retrying. |
| `mix_unavailable` | This graph needs a part of the mix tier this renderer does not run yet (an input or output node, a project audition or a socket, or the whole mix tier where the renderer has none); `path` names it. | Not recoverable by retrying. |
| `offline_only` | This effect only runs in edit.render (offline), not in a live graph. | Not recoverable by retrying. |
| `out_of_range` | A number is outside its range, or is not a number (see `path`). | Not recoverable by retrying. |
| `stream_tier_only` | HLS plays only in the stream tier. Download the episode first, then play its Files path. | Not recoverable by retrying. |
| `unknown_node` | The id names no node of the kind this place needs (see `path`). | Not recoverable by retrying. |
| `unknown_value` | A word is not in its closed vocabulary (see `path`). | Not recoverable by retrying. |

**Example: a one-player graph streams**

```js
const result = await dsx.module.audio.graph.set({"graph":{"nodes":[{"id":"music","kind":"player","src":"documents:a.m4a"}]}});
// resolves {"nodes":[{"id":"music","kind":"player"},{"id":"main","kind":"bus"}],"tier":"stream"}
```

### pause

`dsx.module.audio.pause`

Pauses a player or closes an input, keeping its place.

**When to use it.** Use it when the listener pauses. A paused player is not restarted when a system interruption ends.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the player or input to pause. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `buffered` | number | no | How many seconds of the current item are loaded ahead and ready to play. |
| `chapter` | object | no | The chapter that playback is inside right now, when the item has chapters. |
| `chapter.end` | number | no | The second at which the current chapter ends, when known. |
| `chapter.index` | int | yes | The position of the current chapter in the item's chapter list. |
| `chapter.start` | number | yes | The second at which the current chapter starts. |
| `chapter.title` | string | no | The heading text of the chapter that playback is inside. |
| `cue` | string | no | The text of the transcript cue that is being spoken now, when a transcript is loaded. |
| `duration` | number | no | The length of the current item in seconds, when it is known. |
| `id` | string | yes | The id of the node this call acted on. |
| `index` | number | no | The position in the queue of the item that is current. |
| `interrupted` | string | no | Why playback is paused by the system, for example a call, when it is. |
| `item` | object | no | The queue item that is current, with the fields you gave it. |
| `item.album` | string | no | The album of the current item, as you declared it. |
| `item.artist` | string | no | The artist of the current item, as you declared it. |
| `item.artwork` | string | no | The artwork address of the current item, shown on the lock screen. |
| `item.chapters` | array of object | no | The chapters of the current item, each with a start, optional end and title. |
| `item.duration` | number | no | The declared length of the current item in seconds. |
| `item.id` | string | yes | The id of the current item; when you gave none it is the item's index. |
| `item.live` | boolean | no | True when the current item is a live stream with no fixed length. |
| `item.src` | string | yes | The https URL or Files path the current item plays from. |
| `item.title` | string | no | The title of the current item, as you declared it. |
| `item.transcript` | string | no | The transcript address of the current item, when you gave one. |
| `live` | boolean | no | True when the current item is a live stream. |
| `metadata` | object | no | The title, artist and album the stream itself is announcing right now. |
| `metadata.album` | string | no | The album the stream is announcing right now. |
| `metadata.artist` | string | no | The artist the stream is announcing right now. |
| `metadata.title` | string | no | The title the stream is announcing right now. |
| `monitor` | boolean | no | True when an input is also being played back to the listener. |
| `position` | number | no | How far into the current item playback is, in seconds. |
| `rate` | number | no | The current playback speed, where 1 is normal speed. |
| `sleep` | object | no | The sleep timer that is running on this player, if any. |
| `sleep.at` | number | yes | When the timer fires, on the clock named in clock. |
| `sleep.clock` | string | yes | Whether the timer counts wall clock time or the media timeline. |
| `status` | string | yes | Where the player or input is now: idle, loading, playing, paused, buffering, interrupted, ended or error. |
| `voiceProcessing` | boolean | no | True when an input is running with echo cancellation and noise suppression. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_id` | A node id is missing, repeated, or `main` on something that is not the main bus. | Not recoverable by retrying. |
| `invalid_value` | A value has the wrong shape for where it is used (see `path`). | Not recoverable by retrying. |
| `unknown_node` | The id names no node of the kind this place needs (see `path`). | Not recoverable by retrying. |

**Example: pauses**

```js
const result = await dsx.module.audio.pause({"id":"music"});
// resolves {"buffered":0,"id":"music","index":0,"live":false,"position":0,"rate":1,"status":"paused"}
```

### play

`dsx.module.audio.play`

Starts or resumes a player, or opens an input such as the microphone.

**When to use it.** Use it to begin or continue sound. The microphone only opens through this call.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `at` | number | no | The graph clock time in seconds at which to start; not allowed on an input. |
| `id` | string | yes | The id of the player or input to start. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `buffered` | number | no | How many seconds of the current item are loaded ahead and ready to play. |
| `chapter` | object | no | The chapter that playback is inside right now, when the item has chapters. |
| `chapter.end` | number | no | The second at which the current chapter ends, when known. |
| `chapter.index` | int | yes | The position of the current chapter in the item's chapter list. |
| `chapter.start` | number | yes | The second at which the current chapter starts. |
| `chapter.title` | string | no | The heading text of the chapter that playback is inside. |
| `cue` | string | no | The text of the transcript cue that is being spoken now, when a transcript is loaded. |
| `duration` | number | no | The length of the current item in seconds, when it is known. |
| `id` | string | yes | The id of the node this call acted on. |
| `index` | number | no | The position in the queue of the item that is current. |
| `interrupted` | string | no | Why playback is paused by the system, for example a call, when it is. |
| `item` | object | no | The queue item that is current, with the fields you gave it. |
| `item.album` | string | no | The album of the current item, as you declared it. |
| `item.artist` | string | no | The artist of the current item, as you declared it. |
| `item.artwork` | string | no | The artwork address of the current item, shown on the lock screen. |
| `item.chapters` | array of object | no | The chapters of the current item, each with a start, optional end and title. |
| `item.duration` | number | no | The declared length of the current item in seconds. |
| `item.id` | string | yes | The id of the current item; when you gave none it is the item's index. |
| `item.live` | boolean | no | True when the current item is a live stream with no fixed length. |
| `item.src` | string | yes | The https URL or Files path the current item plays from. |
| `item.title` | string | no | The title of the current item, as you declared it. |
| `item.transcript` | string | no | The transcript address of the current item, when you gave one. |
| `live` | boolean | no | True when the current item is a live stream. |
| `metadata` | object | no | The title, artist and album the stream itself is announcing right now. |
| `metadata.album` | string | no | The album the stream is announcing right now. |
| `metadata.artist` | string | no | The artist the stream is announcing right now. |
| `metadata.title` | string | no | The title the stream is announcing right now. |
| `monitor` | boolean | no | True when an input is also being played back to the listener. |
| `position` | number | no | How far into the current item playback is, in seconds. |
| `rate` | number | no | The current playback speed, where 1 is normal speed. |
| `sleep` | object | no | The sleep timer that is running on this player, if any. |
| `sleep.at` | number | yes | When the timer fires, on the clock named in clock. |
| `sleep.clock` | string | yes | Whether the timer counts wall clock time or the media timeline. |
| `status` | string | yes | Where the player or input is now: idle, loading, playing, paused, buffering, interrupted, ended or error. |
| `voiceProcessing` | boolean | no | True when an input is running with echo cancellation and noise suppression. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `gesture_required` | The browser blocks audible playback until the user interacts with the page; the next tap unlocks it. |  |
| `invalid_id` | A node id is missing, repeated, or `main` on something that is not the main bus. | Not recoverable by retrying. |
| `invalid_value` | A value has the wrong shape for where it is used (see `path`). | Not recoverable by retrying. |
| `no_input` | No microphone is available, or the input's source names no device. | Not recoverable by retrying. |
| `out_of_range` | A number is outside its range, or is not a number (see `path`). | Not recoverable by retrying. |
| `permission_denied` | The microphone permission is not granted: opening an input and a voice or record claim both need it. |  |
| `session_failed` | The audio session would not activate, so playback would produce no sound. |  |
| `unknown_node` | The id names no node of the kind this place needs (see `path`). | Not recoverable by retrying. |

**Example: starts a player**

```js
const result = await dsx.module.audio.play({"id":"music"});
// resolves {"buffered":0,"id":"music","index":0,"live":false,"position":0,"rate":1,"status":"playing"}
```

### route.pick

`dsx.module.audio.route.pick`

Opens the system output picker so the listener can choose a speaker, Bluetooth device or AirPlay target.

**When to use it.** Use it behind an output button. A dismissed picker is reported as cancelled, not as an error.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancelled` | boolean | no | True when the listener dismissed the picker without choosing. |
| `opened` | boolean | yes | True when the system picker was shown. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | This action has no implementation on this platform. | Not recoverable by retrying. |

**Example: opens the picker**

```js
const result = await dsx.module.audio.route.pick({});
// resolves {"opened":true}
```

### route.set

`dsx.module.audio.route.set`

Sends the live sound to the speaker, receiver, Bluetooth, wired output or a device id, as far as the platform lets an app choose.

**When to use it.** Use it for a speaker or earpiece toggle. Where only the user may choose, use route.pick.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `output` | string | yes | The target output: speaker, receiver, bluetooth, wired or a device id. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `latency` | number | yes | The output delay in seconds. |
| `output` | object | yes | The output now in use. |
| `output.id` | string | yes | The id of the output, usable in route.set. |
| `output.kind` | string | yes | The kind of the output, such as speaker, bluetooth or wired. |
| `output.name` | string | yes | The name of the output as the system shows it. |
| `outputs` | array of object | yes | The list of all outputs the device offers right now. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_value` | A value has the wrong shape for where it is used (see `path`). | Not recoverable by retrying. |
| `picker_only` | This platform lets only the user choose this output, through the system picker (route.pick). | Not recoverable by retrying. |
| `unknown_value` | A word is not in its closed vocabulary (see `path`). | Not recoverable by retrying. |
| `unsupported_platform` | This action has no implementation on this platform. | Not recoverable by retrying. |

**Example: moves a voice session to the speaker**

```js
const result = await dsx.module.audio.route.set({"output":"speaker"});
// resolves {"latency":0,"output":{"kind":"speaker"},"outputs":[]}
```

### seek

`dsx.module.audio.seek`

Moves a player to a time, a relative offset, another queue item or another chapter.

**When to use it.** Use it for scrubbing, skip buttons and chapter navigation. Give exactly one target.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `by` | number | no | A relative move in seconds; negative goes back. |
| `chapter` | object | no | A chapter index, or the word next or prev. |
| `id` | string | yes | The id of the player to move. |
| `item` | object | no | A queue index, an item id, or the word next or prev. |
| `to` | number | no | An absolute position in seconds. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `buffered` | number | yes | How many seconds of the current item are loaded ahead and ready to play. |
| `chapter` | object | no | The chapter that playback is inside right now, when the item has chapters. |
| `chapter.end` | number | no | The second at which the current chapter ends, when known. |
| `chapter.index` | int | yes | The position of the current chapter in the item's chapter list. |
| `chapter.start` | number | yes | The second at which the current chapter starts. |
| `chapter.title` | string | no | The heading text of the chapter that playback is inside. |
| `cue` | string | no | The text of the transcript cue that is being spoken now, when a transcript is loaded. |
| `duration` | number | no | The length of the current item in seconds, when it is known. |
| `id` | string | yes | The id of the node this call acted on. |
| `index` | number | yes | The position in the queue of the item that is current. |
| `item` | object | no | The queue item that is current, with the fields you gave it. |
| `item.album` | string | no | The album of the current item, as you declared it. |
| `item.artist` | string | no | The artist of the current item, as you declared it. |
| `item.artwork` | string | no | The artwork address of the current item, shown on the lock screen. |
| `item.chapters` | array of object | no | The chapters of the current item, each with a start, optional end and title. |
| `item.duration` | number | no | The declared length of the current item in seconds. |
| `item.id` | string | yes | The id of the current item; when you gave none it is the item's index. |
| `item.live` | boolean | no | True when the current item is a live stream with no fixed length. |
| `item.src` | string | yes | The https URL or Files path the current item plays from. |
| `item.title` | string | no | The title of the current item, as you declared it. |
| `item.transcript` | string | no | The transcript address of the current item, when you gave one. |
| `live` | boolean | yes | True when the current item is a live stream. |
| `metadata` | object | no | The title, artist and album the stream itself is announcing right now. |
| `metadata.album` | string | no | The album the stream is announcing right now. |
| `metadata.artist` | string | no | The artist the stream is announcing right now. |
| `metadata.title` | string | no | The title the stream is announcing right now. |
| `position` | number | yes | How far into the current item playback is, in seconds. |
| `rate` | number | yes | The current playback speed, where 1 is normal speed. |
| `sleep` | object | no | The sleep timer that is running on this player, if any. |
| `sleep.at` | number | yes | When the timer fires, on the clock named in clock. |
| `sleep.clock` | string | yes | Whether the timer counts wall clock time or the media timeline. |
| `status` | string | yes | Where the player or input is now: idle, loading, playing, paused, buffering, interrupted, ended or error. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_id` | A node id is missing, repeated, or `main` on something that is not the main bus. | Not recoverable by retrying. |
| `invalid_value` | A value has the wrong shape for where it is used (see `path`). | Not recoverable by retrying. |
| `out_of_range` | A number is outside its range, or is not a number (see `path`). | Not recoverable by retrying. |
| `unknown_node` | The id names no node of the kind this place needs (see `path`). | Not recoverable by retrying. |
| `unknown_value` | A word is not in its closed vocabulary (see `path`). | Not recoverable by retrying. |

**Example: seeks to a position**

```js
const result = await dsx.module.audio.seek({"id":"music","to":30});
// resolves {"buffered":0,"id":"music","index":0,"live":false,"position":30,"rate":1,"status":"playing"}
```

### set

`dsx.module.audio.set`

Changes one node of the running graph, with an optional glide, without rebuilding anything.

**When to use it.** Use it for live changes such as volume, speed, pan, loop or a new queue.

**When not to.** Use graph.set when you are adding or removing nodes.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `background` | boolean | no | True keeps this node sounding when the app goes to the background. |
| `bands` | number | no | How many frequency bands a spectrum tap reports. |
| `cache` | string | no | Whether the player keeps downloaded audio on the device or only streams it. |
| `channels` | number | no | How many channels an input or output uses, 1 for mono or 2 for stereo. |
| `crossfade` | number | no | Seconds of overlap between one item and the next. |
| `duck` | object | no | Lowers this node's volume while the listed intents are sounding, then brings it back. |
| `duck.ramp` | number | no | The seconds the fade into and out of ducking takes. |
| `duck.to` | number | yes | The gain this node drops to while ducked, from 0 to 1. |
| `duck.when` | array of string | yes | The audio intents, such as call or voice, that make this node duck while they sound. |
| `effects` | array of object | no | The effects applied to this node in order, such as equaliser, compressor, reverb or delay. |
| `from` | string | no | The id of the node an output or tap reads its sound from. |
| `gain` | number | no | The volume of this node, where 1 is unchanged and 0 is silent. |
| `gapless` | boolean | no | True removes the silence between consecutive items. |
| `id` | string | yes | The id of the node to change. |
| `index` | number | no | The queue position the player is on. |
| `intent` | string | no | What the sound is for, such as media, spoken, ambient or sfx, so the session behaves correctly for it. |
| `items` | array of object | no | The queue a player plays, each item with a src and optional title, artist, album, artwork, transcript, duration and chapters. |
| `kind` | string | no | The kind of node, such as player, bus, input, output or tap. |
| `loop` | string | no | Whether the player repeats: off, one item or the whole queue. |
| `measure` | object | no | What a tap reports, such as level, peak or spectrum bands. |
| `monitor` | boolean | no | True plays the input back to the listener while it is open. |
| `mute` | boolean | no | True silences this node without losing its other settings. |
| `nowPlaying` | boolean | no | True lets this player drive the lock screen and system now-playing surface. |
| `of` | string | no | The id of the node a tap measures. |
| `pan` | number | no | Where the sound sits between the speakers, from -1 for left to 1 for right. |
| `pitch` | string | no | Whether pitch follows the speed or is kept natural when the rate changes. |
| `preload` | boolean | no | True loads the sound ahead of time so it starts without delay. |
| `project` | object | no | An edit project that is played live on this node so you can audition it. |
| `project.master` | object | no | The master section of the project, with effects applied to the whole mix. |
| `project.sampleRate` | int | no | The number of samples per second that the project is mixed at, in hertz. |
| `project.tracks` | array of object | yes | The tracks of the project, each with clips, gain, pan and effects. |
| `ramp` | number | no | Seconds over which the change glides in instead of jumping. |
| `rate` | number | no | The playback speed, where 1 is normal. |
| `remote` | object | no | What the lock screen and headset controls offer for this player. |
| `remote.buttons` | array of object | no | Extra custom buttons on the remote surface, each with an id and a title. |
| `remote.next` | string | no | Whether next and previous move by item or by chapter. |
| `remote.rates` | array of number | no | The playback speeds the remote controls offer. |
| `remote.skip` | array of number | no | The skip buttons to offer, in seconds; a negative number skips back. |
| `resume` | string | no | Whether the player remembers where the listener stopped and resumes there next time. |
| `shuffle` | boolean | no | True plays the queue in a shuffled order. |
| `sleep` | object | no | A sleep timer that stops the player after a time or at the end of the chapter or item. |
| `sleep.at` | object | no | Seconds from now to stop, or the word chapterEnd or itemEnd; when left out it stops at the end of the item. |
| `sleep.fade` | number | no | Seconds of fade-out before the player stops. |
| `socket` | object | no | Connects this node to a realtime socket carrying raw audio frames, such as a voice assistant. |
| `socket.as` | string | yes | Whether the socket is used as a source or as a sink for audio. |
| `socket.format` | string | no | The audio format on the socket; pcm16 is the one supported. |
| `socket.frame` | string | no | How outgoing audio frames are wrapped into messages for an output node. |
| `socket.rate` | int | no | The socket sample rate in hertz, from 8000 to 48000. |
| `socket.unframe` | string | no | How incoming messages are unwrapped into audio frames for a player node. |
| `source` | string | no | Which device input an input node listens to, such as the microphone. |
| `src` | string | no | The https URL or Files path a single-source player plays. |
| `to` | string | no | The id of the bus this node sends its sound to; leave it out to send to the main bus. |
| `voiceProcessing` | boolean | no | True turns on echo cancellation and noise suppression for this input. |
| `voices` | number | no | How many sounds a sound-effect player may play at the same time. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `buffered` | number | yes | How many seconds of the current item are loaded ahead and ready to play. |
| `chapter` | object | no | The chapter that playback is inside right now, when the item has chapters. |
| `chapter.end` | number | no | The second at which the current chapter ends, when known. |
| `chapter.index` | int | yes | The position of the current chapter in the item's chapter list. |
| `chapter.start` | number | yes | The second at which the current chapter starts. |
| `chapter.title` | string | no | The heading text of the chapter that playback is inside. |
| `cue` | string | no | The text of the transcript cue that is being spoken now, when a transcript is loaded. |
| `duration` | number | no | The length of the current item in seconds, when it is known. |
| `id` | string | yes | The id of the node this call acted on. |
| `index` | number | yes | The position in the queue of the item that is current. |
| `item` | object | no | The queue item that is current, with the fields you gave it. |
| `item.album` | string | no | The album of the current item, as you declared it. |
| `item.artist` | string | no | The artist of the current item, as you declared it. |
| `item.artwork` | string | no | The artwork address of the current item, shown on the lock screen. |
| `item.chapters` | array of object | no | The chapters of the current item, each with a start, optional end and title. |
| `item.duration` | number | no | The declared length of the current item in seconds. |
| `item.id` | string | yes | The id of the current item; when you gave none it is the item's index. |
| `item.live` | boolean | no | True when the current item is a live stream with no fixed length. |
| `item.src` | string | yes | The https URL or Files path the current item plays from. |
| `item.title` | string | no | The title of the current item, as you declared it. |
| `item.transcript` | string | no | The transcript address of the current item, when you gave one. |
| `live` | boolean | yes | True when the current item is a live stream. |
| `metadata` | object | no | The title, artist and album the stream itself is announcing right now. |
| `metadata.album` | string | no | The album the stream is announcing right now. |
| `metadata.artist` | string | no | The artist the stream is announcing right now. |
| `metadata.title` | string | no | The title the stream is announcing right now. |
| `position` | number | yes | How far into the current item playback is, in seconds. |
| `rate` | number | yes | The current playback speed, where 1 is normal speed. |
| `sleep` | object | no | The sleep timer that is running on this player, if any. |
| `sleep.at` | number | yes | When the timer fires, on the clock named in clock. |
| `sleep.clock` | string | yes | Whether the timer counts wall clock time or the media timeline. |
| `status` | string | yes | Where the player or input is now: idle, loading, playing, paused, buffering, interrupted, ended or error. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_id` | A node id is missing, repeated, or `main` on something that is not the main bus. | Not recoverable by retrying. |
| `invalid_source` | A source is not an https URL or a Core/Files path naming a file. | Not recoverable by retrying. |
| `invalid_value` | A value has the wrong shape for where it is used (see `path`). | Not recoverable by retrying. |
| `mix_unavailable` | This graph needs a part of the mix tier this renderer does not run yet (an input or output node, a project audition or a socket, or the whole mix tier where the renderer has none); `path` names it. | Not recoverable by retrying. |
| `offline_only` | This effect only runs in edit.render (offline), not in a live graph. | Not recoverable by retrying. |
| `out_of_range` | A number is outside its range, or is not a number (see `path`). | Not recoverable by retrying. |
| `stream_tier_only` | HLS plays only in the stream tier. Download the episode first, then play its Files path. | Not recoverable by retrying. |
| `unknown_node` | The id names no node of the kind this place needs (see `path`). | Not recoverable by retrying. |
| `unknown_value` | A word is not in its closed vocabulary (see `path`). | Not recoverable by retrying. |

**Example: ramps a player down**

```js
const result = await dsx.module.audio.set({"gain":0.3,"id":"music","ramp":2});
// resolves {"buffered":0,"id":"music","index":0,"live":false,"position":0,"rate":1,"status":"playing"}
```

### stop

`dsx.module.audio.stop`

Stops a player and clears its buffers, or closes an input back to idle.

**When to use it.** Use it when playback is finished and the place should not be kept.

**When not to.** Use pause to keep the position.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the player or input to stop. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `buffered` | number | no | How many seconds of the current item are loaded ahead and ready to play. |
| `chapter` | object | no | The chapter that playback is inside right now, when the item has chapters. |
| `chapter.end` | number | no | The second at which the current chapter ends, when known. |
| `chapter.index` | int | yes | The position of the current chapter in the item's chapter list. |
| `chapter.start` | number | yes | The second at which the current chapter starts. |
| `chapter.title` | string | no | The heading text of the chapter that playback is inside. |
| `cue` | string | no | The text of the transcript cue that is being spoken now, when a transcript is loaded. |
| `duration` | number | no | The length of the current item in seconds, when it is known. |
| `id` | string | yes | The id of the node this call acted on. |
| `index` | number | no | The position in the queue of the item that is current. |
| `interrupted` | string | no | Why playback is paused by the system, for example a call, when it is. |
| `item` | object | no | The queue item that is current, with the fields you gave it. |
| `item.album` | string | no | The album of the current item, as you declared it. |
| `item.artist` | string | no | The artist of the current item, as you declared it. |
| `item.artwork` | string | no | The artwork address of the current item, shown on the lock screen. |
| `item.chapters` | array of object | no | The chapters of the current item, each with a start, optional end and title. |
| `item.duration` | number | no | The declared length of the current item in seconds. |
| `item.id` | string | yes | The id of the current item; when you gave none it is the item's index. |
| `item.live` | boolean | no | True when the current item is a live stream with no fixed length. |
| `item.src` | string | yes | The https URL or Files path the current item plays from. |
| `item.title` | string | no | The title of the current item, as you declared it. |
| `item.transcript` | string | no | The transcript address of the current item, when you gave one. |
| `live` | boolean | no | True when the current item is a live stream. |
| `metadata` | object | no | The title, artist and album the stream itself is announcing right now. |
| `metadata.album` | string | no | The album the stream is announcing right now. |
| `metadata.artist` | string | no | The artist the stream is announcing right now. |
| `metadata.title` | string | no | The title the stream is announcing right now. |
| `monitor` | boolean | no | True when an input is also being played back to the listener. |
| `position` | number | no | How far into the current item playback is, in seconds. |
| `rate` | number | no | The current playback speed, where 1 is normal speed. |
| `sleep` | object | no | The sleep timer that is running on this player, if any. |
| `sleep.at` | number | yes | When the timer fires, on the clock named in clock. |
| `sleep.clock` | string | yes | Whether the timer counts wall clock time or the media timeline. |
| `status` | string | yes | Where the player or input is now: idle, loading, playing, paused, buffering, interrupted, ended or error. |
| `voiceProcessing` | boolean | no | True when an input is running with echo cancellation and noise suppression. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_id` | A node id is missing, repeated, or `main` on something that is not the main bus. | Not recoverable by retrying. |
| `invalid_value` | A value has the wrong shape for where it is used (see `path`). | Not recoverable by retrying. |
| `unknown_node` | The id names no node of the kind this place needs (see `path`). | Not recoverable by retrying. |

**Example: stops**

```js
const result = await dsx.module.audio.stop({"id":"music"});
// resolves {"buffered":0,"id":"music","index":0,"live":false,"position":0,"rate":1,"status":"idle"}
```

## Events

Read with `dsx.on(name, handler)`.

### audio

Tells you what happened to audio playback: an item or chapter changed, playback ended, was interrupted or resumed, the output route changed, or a remote button was pressed.

_None._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `cache_max_mb` | number | `512` | The most space, in megabytes, that players with cache: "cache" may keep in cache:dsx.audio before the oldest files are removed. |

## Related packages

- Used by: [LegacyAudioPlayer](/packages/audioplayer), [LocalAI](/packages/intelligence), [SpeechRecognition](/packages/speechrecognition)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
