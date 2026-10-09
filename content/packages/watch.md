---
title: Watch
description: Adds an Apple Watch and Wear OS companion to your app and lets the phone control it.
package: watch
---

Adds an Apple Watch and Wear OS companion to your app and lets the phone control it.

Builds a watch app that shows your own screens, works offline and can be updated over the air. From the phone you can show screens, send state, play haptics and sounds, record, request a location, send notifications and read the battery. You write the watch screens in the same DSX markup as the rest of the app.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when your app needs a wrist companion that works with the phone. Skip it if you only need notifications mirrored to the watch, which the system already does.

## What native adds

A web page cannot run on a watch. The package ships a real watchOS and Wear OS app with haptics, the crown, the microphone and background sessions.

## Install

```sh
despia add Core/Extensions/Watch
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

## Actions

### ambient

`dsx.module.watch.ambient`

Reads whether the watch is in its dimmed always-on mode.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `reduced` | boolean | yes | True when the display is in its reduced, low power look. |
| `state` | string | yes | The display state of the watch, such as active or ambient. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: reads the wrist display state**

```js
const result = await dsx.module.watch.ambient({});
// resolves {"reduced":false,"state":"active"}
```

**Example: reads the always-on dim state**

```js
const result = await dsx.module.watch.ambient({});
// resolves {"reduced":true,"state":"ambient"}
```

### audio

`dsx.module.watch.audio`

Plays a sound on the watch speaker, either one bundled in the watch app or one fetched from a web address.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | no | The name of a sound bundled in the watch app. |
| `url` | string | no | A web address of a sound for the watch to download and play. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `playing` | boolean | yes | True once playback has started. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `audio_failed` | The watch speaker refused to play the clip. | Try again, and check that the watch is not muted. |
| `audio_fetch_failed` | The watch could not download the sound from the web address. | Check the address and the watch connection. |
| `audio_not_found` | No sound with that name is bundled in the watch app. | Check the name or add the sound to the watch app. |
| `cancelled` | A newer audio or audioStop call replaced this clip. | Treat it as normal when you start another sound. |
| `missing_audio` | Neither a bundled sound name nor a url was passed. | Pass a name or a url. |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: plays a bundled sound on the watch**

```js
const result = await dsx.module.watch.audio({"name":"chime"});
// resolves {"playing":true}
```

**Example: plays a remote sound on the watch**

```js
const result = await dsx.module.watch.audio({"url":"https://example.com/ding.wav"});
// resolves {"playing":true}
```

### audioStop

`dsx.module.watch.audioStop`

Stops sound playing on the watch at once. Calling it when nothing is playing does no harm.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `stopped` | boolean | yes | True if a sound was playing and has been stopped. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: stops the playing sound**

```js
const result = await dsx.module.watch.audioStop({});
// resolves {"stopped":true}
```

**Example: is a no-op on an idle speaker**

```js
const result = await dsx.module.watch.audioStop({});
// resolves {"stopped":false}
```

### battery

`dsx.module.watch.battery`

Reads the watch battery level and charging state.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | number | yes | The battery level as a number between 0 and 1. |
| `state` | string | yes | Whether the watch is charging, full or unplugged. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: reads the watch battery**

```js
const result = await dsx.module.watch.battery({});
// resolves {"level":80,"state":"unplugged"}
```

### command

`dsx.module.watch.command`

Calls a named feature of the watch app and waits for its answer.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `args` | object | no | Values passed to that feature. |
| `name` | string | yes | The name of the watch feature to call. |
| `queue` | boolean | no | Set to true to queue the call if the watch is not reachable. |
| `timeout` | number | no | How long to wait for an answer, in milliseconds. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `fixture_not_found` | The named test fixture is not part of this watch build. | Use a fixture that ships with the build. |
| `missing_command` | No command name was passed. | Pass a name. |
| `offline` | The watch answered but its link to the phone is offline. | Try again when the connection is back. |
| `unknown_command` | The watch app has no feature with that name. | Check the name. |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |
| `unsupported_on_surface` | That command does not exist on this kind of watch. | Use a command this watch supports. |

**Example: relays a raw feature command to the watch and resolves its reply**

```js
const result = await dsx.module.watch.command({"name":"battery"});
// resolves {"level":80,"state":"charging"}
```

### crown

`dsx.module.watch.crown`

Turns on or off the stream of Digital Crown turns from the watch.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | yes | True to start sending crown events, false to stop. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | yes | Whether the crown stream is now on. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: arms the crown stream**

```js
const result = await dsx.module.watch.crown({"on":true});
// resolves {"on":true}
```

**Example: releases the crown back to scrolling**

```js
const result = await dsx.module.watch.crown({"on":false});
// resolves {"on":false}
```

### dictate

`dsx.module.watch.dictate`

Opens the dictation sheet on the watch and returns what the wearer says as text.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `prompt` | string | no | A hint shown on the dictation sheet. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `text` | string | yes | The text the wearer dictated. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | Another dictation sheet is already on the watch screen. | Wait for the first one to finish. |
| `cancelled` | The wearer closed the dictation sheet without finishing. | Treat it as a normal outcome and leave the screen as it was. |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: opens the wrist input sheet and resolves the text**

```js
const result = await dsx.module.watch.dictate({"prompt":"Say something"});
// resolves {"text":"hello"}
```

### haptic

`dsx.module.watch.haptic`

Plays a haptic tap on the wrist.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `type` | string | no | The kind of haptic to play, such as success or notification. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `kind` | string | yes | The kind of haptic that was played. |
| `played` | boolean | yes | True if the tap was played. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: plays a success tap on the wrist**

```js
const result = await dsx.module.watch.haptic({"type":"success"});
// resolves {"kind":"success","played":true}
```

**Example: defaults to a click**

```js
const result = await dsx.module.watch.haptic({});
// resolves {"kind":"click","played":true}
```

### keepAwake

`dsx.module.watch.keepAwake`

Asks the watch to keep the app running while the wrist is down. If the watch app is not active, the request waits and starts on the next wrist raise.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | yes | True to keep the app awake, false to stop. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `deferred` | boolean | no | True when the request is waiting for the next wrist raise. |
| `on` | boolean | yes | Whether the keep-awake request is on. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `keepawake_failed` | watchOS refused to start the extended runtime session. | Try again while the watch app is on screen. |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: starts an extended runtime session**

```js
const result = await dsx.module.watch.keepAwake({"on":true});
// resolves {"on":true}
```

**Example: defers the arm to the next wrist-raise when the app is not active**

```js
const result = await dsx.module.watch.keepAwake({"on":true});
// resolves {"deferred":true,"on":true}
```

### locate

`dsx.module.watch.locate`

Asks the watch for its current location.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accuracy` | number | yes | How accurate the position is, in metres. |
| `lat` | number | yes | The latitude of the watch in degrees. |
| `lng` | number | yes | The longitude of the watch in degrees. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `location_denied` | The wearer has not allowed the watch app to use location. | Ask the wearer to allow location access on the watch. |
| `location_failed` | The watch could not get a position fix. | Try again somewhere with a clearer view of the sky. |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: reads a one-shot fix on the wrist**

```js
const result = await dsx.module.watch.locate({});
// resolves {"accuracy":12,"lat":25.2,"lng":55.27}
```

### motion

`dsx.module.watch.motion`

Turns on or off a stream of motion samples from the watch sensors.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | yes | True to start sending motion samples, false to stop. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | yes | Whether the motion stream is now on. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `motion_unavailable` | This watch has no motion sensor the app can use. | Hide motion features on this device. |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: arms the wrist motion stream**

```js
const result = await dsx.module.watch.motion({"on":true});
// resolves {"on":true}
```

**Example: releases the sensors**

```js
const result = await dsx.module.watch.motion({"on":false});
// resolves {"on":false}
```

### notify

`dsx.module.watch.notify`

Shows a notification on the watch, now or after a delay, with optional action buttons and a reply field.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `actions` | array of object | no | Buttons to show, each with an id and a title. |
| `body` | string | no | The text shown under the headline. |
| `delay` | number | no | How many seconds to wait before showing it. |
| `reply` | boolean | no | Set to true to add a text reply field. |
| `title` | string | yes | The headline of the notification. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | The id to pass to notifyCancel to cancel it. |
| `scheduled` | boolean | yes | True if the notification was scheduled. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_title` | The call has no title, which every notification needs. | Pass a non-empty title. |
| `notifications_denied` | The wearer has not allowed notifications from this app on the watch. | Ask the wearer to allow notifications in the watch settings. |
| `notify_failed` | watchOS refused to schedule the notification. | Try again, and check the notification settings on the watch. |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: schedules a watch-local notification**

```js
const result = await dsx.module.watch.notify({"body":"From the phone","delay":5,"title":"Ping"});
// resolves {"scheduled":true}
```

**Example: attaches action buttons and a reply field**

```js
const result = await dsx.module.watch.notify({"actions":[{"id":"yes","title":"👍 Yes"}],"reply":true,"title":"Ping"});
// resolves {"scheduled":true}
```

### notifyCancel

`dsx.module.watch.notifyCancel`

Cancels one watch notification, whether it is still waiting or already shown.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id that notify returned. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancelled` | boolean | yes | True once the notification is cleared, even if it was already gone. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_id` | No notification id was passed. | Pass the id that notify returned. |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: cancels a scheduled notification by its id**

```js
const result = await dsx.module.watch.notifyCancel({"id":"despia.watch.notify.abc"});
// resolves {"cancelled":true}
```

### notifyClear

`dsx.module.watch.notifyClear`

Clears every notification this app has scheduled or shown on the watch.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cleared` | boolean | yes | True once all notifications are cleared, even if there were none. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: clears the app's wrist notifications**

```js
const result = await dsx.module.watch.notifyClear({});
// resolves {"cleared":true}
```

### openOnPhone

`dsx.module.watch.openOnPhone`

Asks the phone to open a web address or one of the app's routes, from the watch.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `route` | string | no | An app route to open on the phone. |
| `url` | string | no | A web address to open on the phone. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `deferred` | boolean | no | True when it is waiting for the phone to wake up. |
| `sent` | boolean | yes | True when the request was sent to the phone. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_target` | Neither a url nor a route was passed. | Pass a url or a route. |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: opens a url on the iPhone**

```js
const result = await dsx.module.watch.openOnPhone({"url":"https://despia.com"});
// resolves {"deferred":false,"sent":true}
```

**Example: defers to the next foreground when the app is backgrounded (the watch relay wakes it in background)**

```js
const result = await dsx.module.watch.openOnPhone({"route":"/"});
// resolves {"deferred":true,"sent":true}
```

### present

`dsx.module.watch.present`

Shows one of the watch app's screens as a sheet and waits for the wearer's answer.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `route` | string | yes | The route of the watch screen to show. |
| `vars` | object | no | Values the screen can read. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `action` | string | yes | The name of the action that returned the answer. |
| `value` | any | yes | The value the screen returned when the wearer answered. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | Another presented screen is already on the watch. | Wait for it to close. |
| `cancelled` | The wearer dismissed the screen. | Treat it as a normal outcome. |
| `missing_route` | The call has no route for the screen to show. | Pass the route of the screen to show. |
| `timeout` | The wearer did not answer in time. | Try again or continue without an answer. |
| `unknown_route` | The watch app has no screen for that route. | Check the route against the watch route table. |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: shows the screen and resolves the value its action returns**

```js
const result = await dsx.module.watch.present({"route":"/confirm","vars":{"title":"Leave now?"}});
// resolves {"action":"answer","value":{"choice":"yes"}}
```

### reachable

`dsx.module.watch.reachable`

Tells you whether a watch is paired, whether it can be reached right now and whether it has a network connection.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `online` | boolean | yes | True if the watch has its own connection. |
| `paired` | boolean | yes | True if a watch is paired with this phone. |
| `reachable` | boolean | yes | True if the watch can answer right now. |

**Example: reports pairing and connectivity**

```js
const result = await dsx.module.watch.reachable({});
// resolves {"online":false,"paired":false,"reachable":false}
```

### record

`dsx.module.watch.record`

Records audio from the watch microphone. A recording sheet opens on the watch, and the audio file is sent to the phone when it ends.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `maxSeconds` | number | no | The longest recording in seconds; it stops itself then. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | yes | The file name of the recording sent to the phone. |
| `seconds` | number | yes | How long the recording lasted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A recording is already running on the watch. | Wait for it to finish or stop it. |
| `cancelled` | The wearer closed the recording sheet. | Treat it as a normal outcome. |
| `mic_denied` | The wearer has not allowed the watch app to use the microphone. | Ask the wearer to allow microphone access. |
| `record_failed` | The watch recorder could not start. | Try again. |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: records a take on the wrist and names it**

```js
const result = await dsx.module.watch.record({"maxSeconds":10});
// resolves {"name":"record-1717689600.m4a","seconds":4}
```

### recordCancel

`dsx.module.watch.recordCancel`

Stops the recording in progress and throws it away.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancelled` | boolean | yes | True when the recording was discarded. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_recording` | Nothing is recording on the watch. | Start a recording first. |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: cancels the live take, the record promise rejects cancelled**

```js
const result = await dsx.module.watch.recordCancel({});
// resolves {"cancelled":true}
```

### recordStop

`dsx.module.watch.recordStop`

Stops the recording in progress and keeps it, as if the wearer had tapped Stop.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `stopped` | boolean | yes | True when the recording was stopped. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_recording` | Nothing is recording on the watch. | Start a recording first. |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: stops the live take, the record promise resolves { name, seconds }**

```js
const result = await dsx.module.watch.recordStop({});
// resolves {"stopped":true}
```

### render

`dsx.module.watch.render`

Shows a DSX layout on the watch right now, with the values you pass in.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `layout` | string | yes | The DSX markup to show on the watch. |
| `vars` | object | no | Values the layout can read. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the layout was sent. |
| `reachable` | boolean | yes | True when the watch could be reached. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_layout` | The call has no layout for the watch to show. | Pass a non-empty layout. |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: ships a DSX layout to the watch**

```js
const result = await dsx.module.watch.render({"layout":"<DSXView/>"});
// resolves {"ok":true,"reachable":false}
```

### route

`dsx.module.watch.route`

Opens one of the watch app's screens by its route.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `path` | string | no | Another name for the route. |
| `route` | string | no | The route to open, such as /orders. |
| `vars` | object | no | Values the screen can read. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the route was sent. |
| `reachable` | boolean | yes | True when the watch could be reached. |
| `route` | string | yes | The route that was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: routes the watch to a path**

```js
const result = await dsx.module.watch.route({"route":"/notes"});
// resolves {"ok":true,"reachable":true,"route":"/notes"}
```

### status

`dsx.module.watch.status`

Reports which long-running features are active on the watch, such as keep-awake, the crown, motion, recording, dictation and playback.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `crown` | boolean | yes | True if crown events are being sent. |
| `dictating` | boolean | yes | True if the dictation sheet is showing. |
| `keepAwake` | boolean | yes | True if the keep-awake session is running. |
| `keepAwakeArmed` | boolean | yes | True if a keep-awake request is waiting for the next wrist raise. |
| `motion` | boolean | yes | True if motion samples are being sent. |
| `playing` | boolean | yes | True if a sound is playing. |
| `recording` | boolean | yes | True if a recording is in progress. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: reads the idle wrist snapshot**

```js
const result = await dsx.module.watch.status({});
// resolves {"crown":false,"dictating":false,"keepAwake":false,"keepAwakeArmed":false,"motion":false,"playing":false,"recording":false}
```

**Example: reports the live sessions**

```js
const result = await dsx.module.watch.status({});
// resolves {"crown":true,"dictating":false,"keepAwake":true,"keepAwakeArmed":false,"motion":true,"playing":true,"recording":false}
```

### transfer

`dsx.module.watch.transfer`

Sends a file to the watch storage, from a file on the phone or a web address. The transfer is queued and arrives when the watch is ready.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | yes | The file name to store on the watch. |
| `path` | string | no | A file path on the phone to send. |
| `url` | string | no | A web address the phone downloads and sends. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `queued` | boolean | yes | True when the transfer was accepted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_url` | The web address could not be read. | Check the address. |
| `fetch_failed` | The phone could not download the source. | Check the address and the connection. |
| `file_not_found` | No file exists at that path on the phone. | Check the path. |
| `missing_name` | No file name was passed. | Pass a non-empty name. |
| `missing_source` | Neither a path nor a url was passed. | Pass exactly one of path or url. |
| `transfer_failed` | The file could not be prepared for sending. | Try again. |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: queues a fetched asset for the watch**

```js
const result = await dsx.module.watch.transfer({"name":"guide.png","url":"https://example.com/guide.png"});
// resolves {"queued":true}
```

### transferClear

`dsx.module.watch.transferClear`

Deletes one file, or all files, from the watch transfer storage.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | no | The file to delete; leave it out to delete everything. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cleared` | number | yes | How many files were deleted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: clears one delivered file by name**

```js
const result = await dsx.module.watch.transferClear({"name":"guide.png"});
// resolves {"cleared":1}
```

**Example: clears the whole store**

```js
const result = await dsx.module.watch.transferClear({});
// resolves {"cleared":2}
```

### transferList

`dsx.module.watch.transferList`

Lists the files that were sent to the watch storage, newest first.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many files are stored on the watch. |
| `files` | array of object | yes | One row per file with its name, size in bytes and modified time. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: lists the delivered transfers, newest first**

```js
const result = await dsx.module.watch.transferList({});
// resolves {"count":1,"files":[{"at":1717689600,"bytes":1024,"name":"guide.png"}]}
```

**Example: resolves empty when nothing was delivered**

```js
const result = await dsx.module.watch.transferList({});
// resolves {"count":0,"files":[]}
```

### update

`dsx.module.watch.update`

Sends new values to the watch so the screens that show them refresh.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `vars` | object | no | The values to send to the watch. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the values were sent. |
| `reachable` | boolean | yes | True when the watch could be reached. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unreachable` | The watch cannot be reached right now, for example because it is not paired, out of range or its app is not open. | Ask the wearer to open the watch app, then try again. |

**Example: pushes state vars to the watch**

```js
const result = await dsx.module.watch.update({"vars":{"count":3}});
// resolves {"ok":true,"reachable":true}
```

## Events

Read with `dsx.on(name, handler)`.

### watch

The watch sent a message to the phone. Every message arrives as one event with an event name and a payload.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `event` | string | yes | The kind of message, such as motion, crown or file. |
| `payload` | object | yes | The data that came with the message. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `host` | string | `despia.com` | The domain the watch fetches OTA screens from when an OTA manifest is set. Bundled screens work with no host. |
| `location_usage_description` | string | `Your location is used to show position and nearby content on your watch.` | Shown on the watch when a screen asks for a one-shot location fix (the watch.locate action). Required by watchOS before CoreLocation will answer. |
| `microphone_usage_description` | string | `The microphone records short voice notes on your watch.` | Shown on the watch when a screen starts a wrist recording (the watch.record action). Required by watchOS before the microphone will answer. |
| `ota_manifest` | string | `` | Path to the over-the-air watch route manifest. Leave empty to ship bundled screens only (no network). |
| `relay_allow` | list | `[]` | Extra phone commands, written as package.action, that the watch may call, added to the ones packages already allow. Leaving it empty is normal and does not stop the watch from using those. |
| `start_route` | string | `/` | The first screen the watch shows on launch. Matched against the route table (bundled, then OTA). |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `link_failed` | The phone and the watch could not exchange messages. | Check that the watch is paired and nearby, then try again. |
| `watch_failed` | The watch reported a problem while running a command from the phone. | Read the error message, check that the watch app is open and try again. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
