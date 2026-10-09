---
title: Push to talk
description: Add walkie-talkie voice channels where people hold a button to speak.
package: ptt
---

Add walkie-talkie voice channels where people hold a button to speak.

One person holds a button and talks while everyone on the channel hears them live, and nobody else can speak until they let go. Works with the Calls package. Needs a call provider and a floor service with a token endpoint.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Add it for walkie-talkie style channels where one person speaks at a time, such as a team on a job site. For normal calls where everyone talks together, use the Calls package.

## What native adds

On iOS it uses the system push to talk screen and wakes the app to hear a speaker; on Android it runs a foreground service for background listening.

## Install

```sh
despia add Core/PushToTalk
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone.

## Actions

### join

`dsx.module.ptt.join`

Joins a push to talk channel with the microphone off and starts following who has the floor.

**When to use it.** Call it when the person opens a channel.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `channel` | string | yes | The channel name, 1 to 128 characters with no spaces. |
| `mode` | string | no | talk (the default) lets the person speak; listen only lets them hear. |
| `name` | string | no | The name other people see when you speak. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `channel` | string | yes | The channel that was joined. |
| `members` | array of object | yes | The people on the channel, each with id, name and whether it is you. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_joined` | A channel is already joined: leave it first. |  |
| `floor_unavailable` | The floor service did not answer. |  |
| `invalid_channel` | channel is 1 to 128 characters with no whitespace. |  |
| `invalid_mode` | mode is talk or listen. |  |
| `join_failed` | The provider could not connect the channel. |  |
| `no_provider` | No call provider package is in this build. | Not recoverable by retrying. |
| `not_configured` | Push to talk needs config server (the floor service) and tokenUrl (your back end's join token endpoint). | Not recoverable by retrying. |
| `system_unavailable` | The system push to talk channel is not available on this device. | Not recoverable by retrying. |
| `unknown_provider` | That provider package is not in this build. | Not recoverable by retrying. |

**Example: joins a channel**

```js
const result = await dsx.module.ptt.join({"channel":"ops","name":"Ann"});
// resolves {"channel":"ops","members":[{"id":"ann","name":"Ann","self":true}]}
```

### leave

`dsx.module.ptt.leave`

Leaves the channel, giving back the floor and closing the microphone if needed.

**When to use it.** Call it when the person closes the channel.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `channel` | string | yes | The channel that was left. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_joined` | No channel is joined: call join first. |  |

**Example: leaves**

```js
const result = await dsx.module.ptt.leave({});
// resolves {"channel":"ops"}
```

### permission.openSettings

`dsx.module.ptt.permission.openSettings`

Opens this app's page in the system settings, where a denied microphone can be allowed again.

**When to use it.** Use it after a refusal where canAsk is false, from a tap.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when the Settings page was opened. |

**Example: opens settings**

```js
const result = await dsx.module.ptt.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.ptt.permission.request`

Shows the system microphone permission dialog when it can still be shown, and returns the resulting state.

**When to use it.** Use it from an explicit step such as onboarding or a settings row.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system dialog can still be shown; false once the person has refused it. |
| `level` | string | no | Access level where the platform offers more than all-or-nothing; empty otherwise. |
| `status` | string | yes | Current permission: undetermined, granted, denied, restricted or unavailable. |

**Example: asks once**

```js
const result = await dsx.module.ptt.permission.request({});
// resolves {"canAsk":false,"level":"audio","status":"granted"}
```

### permission.status

`dsx.module.ptt.permission.status`

Reads the microphone permission without ever showing a dialog.

**When to use it.** Call it to show whether the microphone is allowed.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system dialog can still be shown; false once the person has refused it. |
| `level` | string | no | Access level where the platform offers more than all-or-nothing; empty otherwise. |
| `status` | string | yes | Current permission: undetermined, granted, denied, restricted or unavailable. |

**Example: never asked**

```js
const result = await dsx.module.ptt.permission.status({});
// resolves {"canAsk":true,"level":"audio","status":"undetermined"}
```

### stop

`dsx.module.ptt.stop`

Gives the floor back and closes the microphone.

**When to use it.** Call it when the talk button is released.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `floor` | string | yes | Who holds the floor now; nobody after this call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_joined` | No channel is joined: call join first. |  |

**Example: gives the floor back**

```js
const result = await dsx.module.ptt.stop({});
// resolves {"floor":""}
```

### transmit

`dsx.module.ptt.transmit`

Asks for the floor and opens the microphone so the person can speak to the channel.

**When to use it.** Call it when the talk button is pressed down.

**When not to.** It refuses while someone else is speaking; show that person instead of retrying.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `floor` | string | yes | Who now holds the floor: this device. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | Someone else holds the floor. The data carries { holder, name }. |  |
| `call_active` | A call is live: finish it before talking on a channel. |  |
| `floor_unavailable` | The floor service did not answer. |  |
| `listen_only` | This channel was joined in listen mode. | Not recoverable by retrying. |
| `not_joined` | No channel is joined: call join first. |  |
| `open_app_to_talk` | Open the app to talk: a background start may not open the microphone. |  |
| `permission_denied` | Microphone access is not granted. The data carries the contract state: { permission, status, canAsk }. |  |

**Example: takes the floor**

```js
const result = await dsx.module.ptt.transmit({});
// resolves {"floor":"ann"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `channelImage` | string | `` | iOS: the image the system push to talk UI shows for the channel (a path or URL; empty shows none). |
| `floorTimeout` | number | `10` | Seconds a silent holder keeps the floor before it is freed (3 to 120). |
| `maxTransmit` | number | `60` | Seconds one transmission may last before the floor is taken back, so a stuck button cannot hold a channel (5 to 600). |
| `provider` | string | `` | The call provider package that carries the channel's audio when more than one is installed. |
| `server` | string | `` | The address of your Despia Calls service (OpenSource/Services/calls), the one authority for who holds the floor. |
| `tokenUrl` | string | `` | Your own back end's endpoint that answers { token, peer, name? } for the signed in user and a channel: GET <tokenUrl>?channel=<channel>. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_joined` | A channel is already joined: leave it first. |  |
| `busy` | Someone else holds the floor. The data carries { holder, name }. |  |
| `call_active` | A call is live: finish it before talking on a channel. |  |
| `floor_unavailable` | The floor service did not answer. |  |
| `invalid_channel` | channel is 1 to 128 characters with no whitespace. |  |
| `invalid_mode` | mode is talk or listen. |  |
| `join_failed` | The provider could not connect the channel. |  |
| `listen_only` | This channel was joined in listen mode. |  |
| `no_provider` | No call provider package is in this build. |  |
| `not_configured` | Push to talk needs config server (the floor service) and tokenUrl (your back end's join token endpoint). |  |
| `not_joined` | No channel is joined: call join first. |  |
| `open_app_to_talk` | Open the app to talk: a background start may not open the microphone. |  |
| `permission_denied` | Microphone access is not granted. The data carries the contract state: { permission, status, canAsk }. |  |
| `system_unavailable` | The system push to talk channel is not available on this device. |  |
| `unknown_provider` | That provider package is not in this build. |  |

## Related packages

- Needs: [Call](/packages/call)
- Works better with: [Firebase](/packages/firebase)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
