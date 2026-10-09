---
title: Record
description: Record a voice note or audio message and get the file back, with a live level meter.
package: record
---

Record a voice note or audio message and get the file back, with a live level meter.

Starts, pauses, resumes and stops a microphone recording, and can also record a bus or input of the Audio package's live graph. You get a level meter while recording, a file in the format you choose, and a clean recovery when a call or another app interrupts. You write your own record button, meter and save or discard screen.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for voice notes, audio messages, pronunciation practice and field capture. For multitrack editing or mixing use the Edit package instead.

## What native adds

A native recorder keeps the audio session correct with calls and other apps, survives interruptions without losing the take, and writes real m4a, wav, opus or flac files, which a web page cannot guarantee.

## Install

```sh
despia add Core/Audio/Modules/Record
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

### cancel

`dsx.module.record.cancel`

Stops the recording and deletes the file.

**When to use it.** Use it when the person discards the take, so no unwanted file is left behind.

**When not to.** Use stop to keep the recording.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancelled` | boolean | yes | True when a recording was stopped and its file deleted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_recording` | There is no recording to cancel. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot record audio. | Not recoverable by retrying. |

**Example: discards the take and its file**

```js
const result = await dsx.module.record.cancel({});
// resolves {"cancelled":true}
```

### pause

`dsx.module.record.pause`

Pauses the recording without ending it, and leaves the paused time out of the file.

**When to use it.** Use it for a pause button. Resume continues in the same file.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `duration` | number | yes | Seconds recorded so far, not counting paused time. |
| `state` | string | yes | The recorder state: idle, recording, paused or interrupted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_recording` | There is no recording to pause. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot record audio. | Not recoverable by retrying. |

**Example: pauses a live take**

```js
const result = await dsx.module.record.pause({});
// resolves {"duration":1.5,"state":"paused"}
```

### permission.manage

`dsx.module.record.permission.manage`

Lets the person change a limited selection of what the app may access, where the system has such a screen.

**When to use it.** Use it when access was granted only in part and the person wants to widen or narrow it.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `changed` | boolean | yes | True when the person changed the selection; false where the system has no such screen. |
| `level` | string | no | How much access is granted when the system offers levels. |
| `status` | string | yes | The permission state after the screen closed. |

**Example: nothing limited to manage**

```js
const result = await dsx.module.record.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.record.permission.openSettings`

Opens this app's page in the system Settings so the person can change the permission there.

**When to use it.** Use it after a denial, from a button the person taps; it cannot run on its own.

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
| `unavailable` | Opening Settings needs the App Settings package (dsx.module.settings). | Install the App Settings package, which owns this page. |
| `unsupported_platform` | No page script can open browser or OS settings. | Show instructions instead, since a web page cannot open browser or system settings. |

**Example: opens the app page**

```js
const result = await dsx.module.record.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.record.permission.request`

Asks the person for the microphone by showing the system permission dialog when it can still be shown.

**When to use it.** Use it from a settings row or an onboarding step. Feature calls already ask just in time, so you rarely need it first.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `level` | string | no | How much access was granted when the system offers levels, such as full or limited. |
| `status` | string | yes | The permission state after the request. |

**Example: granted**

```js
const result = await dsx.module.record.permission.request({});
// resolves {"canAsk":false,"status":"granted"}
```

### permission.status

`dsx.module.record.permission.status`

Reads whether the app may use the microphone right now, without ever showing a dialog.

**When to use it.** Use it to decide what to show on a screen, for example on every appear of a settings row.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `level` | string | no | How much access was granted when the system offers levels, such as full or limited. |
| `status` | string | yes | The microphone permission state, such as granted, denied or undetermined. |

**Example: never asked**

```js
const result = await dsx.module.record.permission.status({});
// resolves {"canAsk":true,"status":"undetermined"}
```

**Example: a final denial: only Settings helps**

```js
const result = await dsx.module.record.permission.status({});
// resolves {"canAsk":false,"status":"denied"}
```

### resume

`dsx.module.record.resume`

Continues a paused recording, including after a call or other interruption has ended.

**When to use it.** Use it when the person taps resume, or after the resumable event arrives.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `duration` | number | yes | Seconds recorded so far, not counting paused time. |
| `state` | string | yes | The recorder state: idle, recording, paused or interrupted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_recording` | There is no paused recording to resume. | Not recoverable by retrying. |
| `session_failed` | The audio session could not be reclaimed. |  |
| `unsupported_platform` | This surface cannot record audio. | Not recoverable by retrying. |

**Example: resumes a paused take**

```js
const result = await dsx.module.record.resume({});
// resolves {"duration":1.5,"state":"recording"}
```

**Example: resumes straight out of an interruption**

```js
const result = await dsx.module.record.resume({});
// resolves {"duration":1.5,"state":"recording"}
```

### start

`dsx.module.record.start`

Begins a recording and streams a level meter reading about ten times a second until you stop.

**When to use it.** Use it when the person taps record. Only one recording can run at a time.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `channels` | int | no | 1 for mono or 2 for stereo. |
| `format` | string | no | The file format: m4a, wav, opus or flac; it defaults to the default format setting. |
| `from` | string | no | What to record: mic for the device microphone, or the id of an input or bus of the Audio package's graph, where main is the whole mix. |
| `maxDuration` | number | no | The most seconds to record; the recording then stops by itself and the file is still valid. |
| `meter` | boolean | no | True streams level readings while recording; false turns the meter off. |
| `prompt` | boolean | no | True lets the microphone permission dialog appear on this call when it can; false never shows it and fails if access is missing. |
| `quality` | string | no | How good the recording should sound, which trades file size against quality. |
| `sampleRate` | int | no | Samples per second, such as 44100 for music or 16000 for speech. |
| `to` | string | no | Where to save the file, as a Files path such as documents:memos/note.m4a; leave it out to save a temporary file in the app cache. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | number | yes | The size of the recording file in bytes. |
| `duration` | number | yes | The length of the recording in seconds. |
| `format` | string | yes | The audio format of the file, such as m4a or wav. |
| `path` | string | yes | Where the finished recording file was saved. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A recording is already running. |  |
| `disk_full` | There is not enough free space to record. |  |
| `invalid_value` | `from` names a player or an output; record the bus it feeds. | Not recoverable by retrying. |
| `mix_unavailable` | A bus can be recorded only while the graph runs on the mix tier. | Not recoverable by retrying. |
| `no_input` | No microphone is available on this device. | Not recoverable by retrying. |
| `permission_denied` | Microphone access is not granted. The data carries the contract state: { permission, status, canAsk }. |  |
| `session_failed` | The audio session could not be configured for recording. |  |
| `unknown_node` | `from` names no node of Core/Audio's live graph. | Not recoverable by retrying. |
| `unsupported_format` | That audio format is not available. Use m4a, wav, opus or flac. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot record audio. | Not recoverable by retrying. |

**Example: records to a chosen path and streams a meter**

```js
const result = await dsx.module.record.start({"format":"m4a","meter":true,"to":"documents:memos/note.m4a"});
// resolves {"bytes":32100,"duration":2,"format":"m4a","path":"documents:memos/note.m4a"}
```

**Example: maxDuration stops cleanly with a valid file**

```js
const result = await dsx.module.record.start({"maxDuration":1});
// resolves {"bytes":16050,"duration":1,"format":"m4a","path":"cache:recordings/take.m4a"}
```

### status

`dsx.module.record.status`

Reports the current recorder state, duration and level without changing anything.

**When to use it.** Use it when a screen appears while a take is already running, for example after a page reload.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `duration` | number | yes | Seconds recorded so far, not counting paused time. |
| `level` | number | yes | The current loudness from 0 to 1. |
| `peak` | number | yes | The highest loudness reached so far, from 0 to 1. |
| `state` | string | yes | The recorder state: idle, recording, paused or interrupted. |

**Example: reports an idle recorder**

```js
const result = await dsx.module.record.status({});
// resolves {"duration":0,"level":0,"peak":0,"state":"idle"}
```

**Example: reports a live take**

```js
const result = await dsx.module.record.status({});
// resolves {"duration":8.4,"level":0.6667,"peak":0.95,"state":"recording"}
```

### stop

`dsx.module.record.stop`

Ends the recording, saves the file and gives you its location.

**When to use it.** Use it when the person is done and wants to keep the take. It also works for a paused or interrupted recording.

**When not to.** Use cancel to throw the take away.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | number | yes | The size of the recording file in bytes. |
| `duration` | number | yes | The length of the recording in seconds. |
| `format` | string | yes | The audio format of the file, such as m4a or wav. |
| `path` | string | yes | Where the finished recording file was saved. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `disk_full` | There is not enough free space to finalise the recording. |  |
| `not_recording` | There is no recording to stop. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot record audio. | Not recoverable by retrying. |

**Example: hands back the finished take**

```js
const result = await dsx.module.record.stop({});
// resolves {"bytes":48200,"duration":3,"format":"m4a","path":"cache:recordings/take.m4a"}
```

**Example: an interrupted take still stops into a playable file**

```js
const result = await dsx.module.record.stop({});
// resolves {"bytes":67400,"duration":4.2,"format":"m4a","path":"cache:recordings/take.m4a"}
```

## Events

Read with `dsx.on(name, handler)`.

### interrupted

Tells you the system paused the recording, for example for a phone call.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `duration` | number | yes | Seconds recorded before the interruption. |
| `reason` | string | yes | Why it was paused: call, background, route or other. |

### meter

Reports the current loudness while recording, about ten times a second, so you can draw a level meter.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `duration` | number | yes | How many seconds have been recorded so far. |
| `level` | number | yes | The current loudness, from 0 to 1. |
| `peak` | number | yes | The highest loudness reached so far, from 0 to 1. |

### resumable

Tells you the interruption has ended and the recording can be resumed.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `duration` | number | yes | How many seconds have been recorded so far. |

### stateChanged

Tells you each time the recorder moves between idle, recording, paused and interrupted.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `state` | string | yes | The state the recorder is now in. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `default_format` | string | `m4a` | The container a recording uses when the caller does not name one. m4a (AAC) is small and plays everywhere; wav is uncompressed; opus is the best quality per byte where it is supported; flac is lossless and about half the size of wav. |
| `default_sample_rate` | number | `44100` | Samples per second. 44100 is CD quality and the safe default; 16000 is plenty for speech and produces much smaller files. |
| `duck_others` | boolean | `true` | Lower other apps' audio while recording, then restore it. Turn this off only if your app has its own mixing policy. |
| `meter_interval_ms` | number | `100` | How often the level meter updates, in milliseconds. 100 is ten times a second, which looks continuous. |
| `usage_description` | multiline | `Records audio when you tap record, so you can capture a voice note.` | The message shown when the app asks for permission to use the microphone. Say what the recording is for, in the user's words. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
