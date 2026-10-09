---
title: Calls
description: Add voice and video calls that ring like real phone calls.
package: call
---

Add voice and video calls that ring like real phone calls.

Handles incoming and outgoing calls with the phone's own call screen, ringing, picture in picture and audio routing, plus ready-made call screens. It needs a call provider package (Despia, LiveKit, Twilio or Stream) to carry the audio and video.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it when your app needs voice or video calls that ring and show up like real phone calls, with the lock screen call screen, picture in picture and audio routing. It carries no audio or video itself, so you also need a call provider package.

## What native adds

Calls use the operating system's own call screen, so incoming calls ring even when the app is closed and a call survives the user leaving the app.

## Install

```sh
despia add Core/Call
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, desktop.

## Actions

### answer

`dsx.module.call.answer`

Answers a ringing call. If another call is active, it is put on hold.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | The id of the call; when left out, the current call is used. |
| `prompt` | boolean | no | Set to false to skip the system permission dialog; the call then fails with permission_denied instead of asking. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | The state of the call or permission after the action, such as ringing, active, held or ended. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_state` | That action does not fit the call's current status, for example answering a call that is not ringing. | Check the call status before calling. |
| `permission_denied` | A permission the call needs, such as the microphone, has not been granted and could not be asked for. | Ask with permission.request, or send the user to Settings. |
| `unknown_call` | There is no call with that id. | Use an id from the current calls list, or leave the id out for the current call. |

**Example: Answer the ringing call**

```js
const result = await dsx.module.call.answer({"id":"call_123"});
// resolves {"status":"connecting"}
```

### audioRoute

`dsx.module.call.audioRoute`

Chooses where call audio plays, such as the earpiece, speaker, Bluetooth, wired headset or car.

**When to use it.** Use it for an audio output picker; offer only the routes the call reports as available.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `to` | string | yes | Who to call: an account id, phone number or address, in the form your call provider understands. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `audioRoute` | string | yes | The audio route now in use. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_event` | That is not a valid call event. | Use ring, cancel, answeredElsewhere or declinedElsewhere. |
| `route_unavailable` | That audio route is not available right now. | Pick one of the available routes shown in the call state. |

**Example: Play call audio on a Bluetooth headset**

```js
const result = await dsx.module.call.audioRoute({"to":"bluetooth"});
// resolves {"audioRoute":"bluetooth"}
```

### camera

`dsx.module.call.camera`

Turns the camera on or off during a call.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | no | True to turn it on and false to turn it off; when left out, it flips the current state. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | yes | True when the feature is now on. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | A permission the call needs, such as the microphone, has not been granted and could not be asked for. | Ask with permission.request, or send the user to Settings. |

**Example: Turn the camera on**

```js
const result = await dsx.module.call.camera({"on":true});
// resolves {"on":true}
```

### decline

`dsx.module.call.decline`

Declines a ringing call so the caller is told it was refused.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | The id of the call; when left out, the current call is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | The state of the call or permission after the action, such as ringing, active, held or ended. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_state` | That action does not fit the call's current status, for example answering a call that is not ringing. | Check the call status before calling. |
| `unknown_call` | There is no call with that id. | Use an id from the current calls list, or leave the id out for the current call. |

**Example: Decline the ringing call**

```js
const result = await dsx.module.call.decline({"id":"call_123"});
// resolves {"status":"ended"}
```

### dtmf

`dsx.module.call.dtmf`

Sends keypad tones during a call, for providers that connect to a phone network.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `digits` | string | yes | The keypad digits to send, such as 1234#. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `sent` | string | yes | The digits that were sent. |

**Example: Press 1 and 2 on the keypad**

```js
const result = await dsx.module.call.dtmf({"digits":"12"});
// resolves {"sent":"12"}
```

### end

`dsx.module.call.end`

Ends a call. Ending a call that is still ringing declines it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | The id of the call; when left out, the current call is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `endReason` | string | yes | Why the call ended, such as hung up, declined, missed or failed. |
| `status` | string | yes | The state of the call or permission after the action, such as ringing, active, held or ended. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_state` | That action does not fit the call's current status, for example answering a call that is not ringing. | Check the call status before calling. |
| `unknown_call` | There is no call with that id. | Use an id from the current calls list, or leave the id out for the current call. |

**Example: Hang up the current call**

```js
const result = await dsx.module.call.end({});
// resolves {"endReason":"hangup","status":"ended"}
```

### flipCamera

`dsx.module.call.flipCamera`

Switches between the front and the back camera during a video call.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `facing` | string | yes | Which camera is now in use: front or back. |

**Example: Switch to the back camera**

```js
const result = await dsx.module.call.flipCamera({});
// resolves {"facing":"back"}
```

### hold

`dsx.module.call.hold`

Puts a call on hold or takes it off hold. Resuming a call puts any other active call on hold.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | The id of the call; when left out, the current call is used. |
| `on` | boolean | yes | True to turn it on and false to turn it off; when left out, it flips the current state. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `held` | boolean | yes | True when the call is now on hold. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_state` | That action does not fit the call's current status, for example answering a call that is not ringing. | Check the call status before calling. |
| `unknown_call` | There is no call with that id. | Use an id from the current calls list, or leave the id out for the current call. |

**Example: Put a call on hold**

```js
const result = await dsx.module.call.hold({"id":"call_123","on":true});
// resolves {"held":true}
```

### mic

`dsx.module.call.mic`

Mutes or unmutes the microphone for the current call.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | no | True to turn it on and false to turn it off; when left out, it flips the current state. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | yes | True when the feature is now on. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | A permission the call needs, such as the microphone, has not been granted and could not be asked for. | Ask with permission.request, or send the user to Settings. |

**Example: Mute the microphone**

```js
const result = await dsx.module.call.mic({"on":false});
// resolves {"on":false}
```

### permission.manage

`dsx.module.call.permission.manage`

Lets the user change a limited permission selection where the system offers one; otherwise it reports the current state with changed set to false.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `changed` | boolean | yes | True when the selection was changed; always false when there is nothing to change. |
| `level` | string | no | The level of access granted. |
| `status` | string | yes | The state of the call or permission after the action, such as ringing, active, held or ended. |

**Example: nothing limited to manage**

```js
const result = await dsx.module.call.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.call.permission.openSettings`

Opens this app's page in the system Settings so the user can change the microphone or camera permission.

**When to use it.** Call it from a button the user tapped, after the OS can no longer ask.

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
| `unavailable` | The system Settings page could not be opened on this device. | Tell the user to open Settings by hand. |
| `unsupported_platform` | This action does not exist on the current platform. | Hide the control on this platform. |

**Example: opens the app page**

```js
const result = await dsx.module.call.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.call.permission.request`

Shows the system microphone or camera permission dialog when the OS can still ask, and reports the resulting state.

**When to use it.** Use it from an onboarding step or a settings row. Starting or answering a call asks on its own when needed.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | string | no | Which access to ask for: audio for the microphone, or video to include the camera. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `level` | string | no | The level of access granted. |
| `status` | string | yes | The state of the call or permission after the action, such as ringing, active, held or ended. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_level` | The level is not audio or video. | Pass audio or video. |

**Example: granted**

```js
const result = await dsx.module.call.permission.request({});
// resolves {"canAsk":false,"level":"audio","status":"granted"}
```

### permission.status

`dsx.module.call.permission.status`

Reads the microphone and camera permission without ever showing a dialog, so a settings screen can call it every time it appears.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | string | no | Which access to ask about: audio for the microphone, or video to include the camera. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `level` | string | no | The level of access granted. |
| `status` | string | yes | The state of the call or permission after the action, such as ringing, active, held or ended. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_level` | The level is not audio or video. | Pass audio or video. |

**Example: never asked**

```js
const result = await dsx.module.call.permission.status({});
// resolves {"canAsk":true,"level":"audio","status":"undetermined"}
```

**Example: a final denial: only Settings helps**

```js
const result = await dsx.module.call.permission.status({});
// resolves {"canAsk":false,"level":"audio","status":"denied"}
```

### pip

`dsx.module.call.pip`

Enters or leaves picture in picture by hand.

**When to use it.** Use it for your own minimise button. Automatic entry is controlled by the pip setting.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | yes | True to turn it on and false to turn it off; when left out, it flips the current state. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `pip` | boolean | yes | True when picture in picture is now showing. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `system_unavailable` | The operating system's call screen is not available here. | Check that the call permissions and entitlements are set up, and that you are on a real device. |

**Example: Enter picture in picture**

```js
const result = await dsx.module.call.pip({"on":true});
// resolves {"pip":true}
```

### register

`dsx.module.call.register`

Returns the device token that incoming calls are sent to, so your server can ring this device.

**When to use it.** Call it after sign-in and send the token to the service that delivers your incoming call pushes.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `platform` | string | yes | Which push route the token belongs to, such as ios, android or web. |
| `token` | string | yes | The device token that incoming calls are sent to. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `system_unavailable` | The operating system's call screen is not available here. | Check that the call permissions and entitlements are set up, and that you are on a real device. |

**Example: Get the device token incoming calls are sent to**

```js
const result = await dsx.module.call.register({});
// resolves {"platform":"ios","token":"example-device-token"}
```

### report

`dsx.module.call.report`

Tells the package about an incoming call that arrived by a route other than a push, such as a socket or a foreground message.

**When not to.** You do not need it for calls that arrive by the normal incoming call push.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `payload` | object | yes | The incoming call details: version, call id, event, and optionally provider, reference, video, caller and expiry. |
| `payload.callId` | string | yes | The id your service gave this call, used to answer, decline or end it later. |
| `payload.caller` | object | no | Who is calling, shown on the incoming call screen. |
| `payload.event` | string | yes | What happened: ring, cancel, answeredElsewhere or declinedElsewhere. |
| `payload.expiresAt` | number | no | When the ring should stop, as a timestamp. |
| `payload.provider` | string | no | The call provider package that carries this call. |
| `payload.ref` | string | no | A provider reference needed to join the call. |
| `payload.v` | int | yes | The version number of the payload format; use the number your push sender uses. |
| `payload.video` | boolean | no | True when the call includes video. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `callId` | string | yes | The id of the call that was reported. |
| `end` | string | yes | If set, the reason the call was ended straight away instead of ringing, for example because it expired. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_payload` | The incoming call details were not valid. | Send the neutral payload with a version, call id and event. |

**Example: Report an incoming call that arrived on a socket**

```js
const result = await dsx.module.call.report({"payload":{"callId":"call_123","caller":{"handle":"ada@example.com","handleType":"email","name":"Ada Lovelace"},"event":"ring","v":1,"video":true}});
// resolves {"callId":"call_123","end":""}
```

### speaker

`dsx.module.call.speaker`

Sends call audio to the loudspeaker or back to the earpiece.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | no | True to turn it on and false to turn it off; when left out, it flips the current state. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | yes | True when the feature is now on. |

**Example: Switch audio to the loudspeaker**

```js
const result = await dsx.module.call.speaker({"on":true});
// resolves {"on":true}
```

### start

`dsx.module.call.start`

Starts an outgoing call. The system is told about the call first, then the call provider connects it.

**When to use it.** Call it when the user taps a call button.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `caller` | object | no | Who is shown in the system call log, as an object with name, handle and handleType. |
| `caller.handle` | string | no | The phone number, email or other handle shown for the caller. |
| `caller.handleType` | string | no | What kind of handle it is: phone, email or generic. |
| `caller.id` | string | no | Your own id for the caller. |
| `caller.name` | string | no | The caller's display name. |
| `conversationId` | string | no | The chat conversation this call belongs to, so the call and the chat can be linked. |
| `prompt` | boolean | no | Set to false to skip the system permission dialog; the call then fails with permission_denied instead of asking. |
| `provider` | string | no | The call provider package to use; when left out, the default provider setting is used. |
| `route` | string | no | The screen to return to when the user taps the picture in picture window for this call. |
| `to` | string | yes | Who to call: an account id, phone number or address, in the form your call provider understands. |
| `video` | boolean | no | True to start the call with video. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `callId` | string | yes | The id of the new call, used to answer, hold or end it later. |
| `status` | string | yes | The state of the call or permission after the action, such as ringing, active, held or ended. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `duplicate_call` | A live call already has this id. | End the existing call or use a new id. |
| `not_configured` | The chosen call provider is not set up in this build, because its keys or SDK are missing. | Add the provider's credentials in the package settings and make a new build. |
| `permission_denied` | A permission the call needs, such as the microphone, has not been granted and could not be asked for. | Ask with permission.request, or send the user to Settings. |
| `provider_ambiguous` | More than one call provider package is in this build and none was chosen. | Name a provider in the call or in the provider setting. |
| `provider_unavailable` | The call provider is installed but cannot serve right now. | Try again in a moment. |
| `unsupported_provider` | The provider you named is not in this build. | Add that provider package or name one that is installed. |

**Example: Start a video call**

```js
const result = await dsx.module.call.start({"to":"user_456","video":true});
// resolves {"callId":"call_123","status":"dialing"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `pip` | string | `auto` | auto enters picture in picture when the app is left during a video call; manual only on the pip verb; off never. |
| `provider` | string | `` | The provider package that carries calls when a call names none. |
| `ringSeconds` | number | `45` | Seconds an unanswered incoming call rings before it is missed. |
| `route` | string | `/call` | Where a tap on the picture in picture window or the system call UI returns. |
| `usage_camera` | string | `This app uses the camera so the people on your call can see you.` | Why the app uses the camera, shown by iOS the first time a video call asks for it. |
| `usage_microphone` | string | `This app uses the microphone so the people on your call can hear you.` | Why the app uses the microphone, shown by iOS the first time a call asks for it. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `duplicate_call` | A live call already has this id. | End the existing call or use a new id. |
| `e2ee_unsupported` | This provider cannot encrypt the call end to end. | Use a provider that supports it, or call without end-to-end encryption. |
| `full_screen_denied` | The permission to show incoming calls over the lock screen is not granted. | Ask the user to allow full screen call notifications in Settings. |
| `invalid_event` | That is not a valid call event. | Use ring, cancel, answeredElsewhere or declinedElsewhere. |
| `invalid_payload` | The incoming call details were not valid. | Send the neutral payload with a version, call id and event. |
| `invalid_state` | That action does not fit the call's current status, for example answering a call that is not ringing. | Check the call status before calling. |
| `join_failed` | The call provider could not join the call. | Check the connection and try again. |
| `network_unavailable` | The provider's server could not be reached. | Check the connection and try again. |
| `not_configured` | The chosen call provider is not set up in this build, because its keys or SDK are missing. | Add the provider's credentials in the package settings and make a new build. |
| `permission_denied` | A permission the call needs, such as the microphone, has not been granted and could not be asked for. | Ask with permission.request, or send the user to Settings. |
| `provider_ambiguous` | More than one call provider package is in this build and none was chosen. | Name a provider in the call or in the provider setting. |
| `provider_unavailable` | The call provider is installed but cannot serve right now. | Try again in a moment. |
| `route_unavailable` | That audio route is not available right now. | Pick one of the available routes shown in the call state. |
| `system_unavailable` | The operating system's call screen is not available here. | Check that the call permissions and entitlements are set up, and that you are on a real device. |
| `unauthorized` | The provider refused the call's join token, because it expired or is wrongly scoped. | Get a fresh token from your server and try again. |
| `unknown_call` | There is no call with that id. | Use an id from the current calls list, or leave the id out for the current call. |
| `unsupported_provider` | The provider you named is not in this build. | Add that provider package or name one that is installed. |

## Related packages

- Needs: [Notify](/packages/notify)
- Works better with: [Firebase](/packages/firebase)
- Used by: [CallDespia](/packages/calldespia), [CallLiveKit](/packages/calllivekit), [CallTwilio](/packages/calltwilio), [PushToTalk](/packages/ptt), [Stream](/packages/stream)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
