---
title: Stream Video
description: Run your app's video calls on Stream.
package: stream
---

Run your app's video calls on Stream.

Works with the Calls package. Stream carries the audio and video while the Calls package handles ringing and call screens. Needs a Stream account, your API key and a token endpoint on your server.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Add it when your calls should run on Stream's video network. You still start, answer and draw calls with the call package; this package supplies the media and Stream-only features such as cloud recording and captions.

## What native adds

Uses Stream's native video SDKs together with the system call screen, ringing and background audio, which a web page cannot match.

## Install

```sh
despia add Core/Stream
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

### caption

`dsx.module.stream.caption`

Starts or stops closed captions on the current call.

**When to use it.** Call it from a captions button; read context.captioning to show whether it is on.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | no | True to start, false to stop; leave out to switch. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | yes | True when captions are running after this call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `caption_unavailable` | Closed captions could not be started or stopped on this call. | Check that captions are enabled for the call type in your Stream dashboard. |
| `not_ready` | There is no live Stream call to act on. | Start a call with the call package first. |
| `unsupported_platform` | This feature is not available on the web. | Skip the call on the web. |

**Example: starts closed captions on a live call**

```js
const result = await dsx.module.stream.caption({"on":true});
// resolves {"on":true}
```

### end

`dsx.module.stream.end`

Leaves the Stream call that is running.

**When to use it.** Call it to hang up; the call package's end does the same.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was left or none was running. |

**Example: leaves the active call**

```js
const result = await dsx.module.stream.end({});
// resolves {"ok":true}
```

### login

`dsx.module.stream.login`

Signs the person in to Stream so calls can be made and answered.

**When to use it.** Call it once your app knows who is signed in, before starting or answering a call.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `token` | string | no | The Stream user token your server created for this person; the user id is read from it. |
| `token_url` | string | no | Optional address your server offers to give a fresh token when the old one expires. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call succeeded. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | The call did not include a required value. | Pass a user token or a token_url to login. |

**Example: logs in with a token and refresh url**

```js
const result = await dsx.module.stream.login({"token":"eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoidV8xIn0.sig","token_url":"https://example.com/stream/token"});
// resolves {"ok":true}
```

### logout

`dsx.module.stream.logout`

Signs the person out of Stream and disconnects.

**When to use it.** Call it when the person signs out of your app.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call succeeded. |

**Example: logs out the current user**

```js
const result = await dsx.module.stream.logout({});
// resolves {"ok":true}
```

### permission.manage

`dsx.module.stream.permission.manage`

Lets the person change a limited selection where the system has one; otherwise returns the current state unchanged.

**When to use it.** Call it from a settings row; it reports changed false where there is no selection to change.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system dialog can still be shown; false once the person has refused it. |
| `changed` | boolean | yes | True when the selection was changed; false where the platform has no limited selection. |
| `level` | string | no | Access level where the platform offers more than all-or-nothing; empty otherwise. |
| `status` | string | yes | Current permission: undetermined, granted, denied, restricted or unavailable. |

**Example: nothing limited to manage**

```js
const result = await dsx.module.stream.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.stream.permission.openSettings`

Opens this app's page in the system Settings so the person can change the camera and microphone permission.

**When to use it.** Use it after a refusal where canAsk is false, from a tap.

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
| `unavailable` | Opening Settings needs the App Settings package, which is not in this build. | Add the App Settings package, or tell the person where to change the permission. |
| `unsupported_platform` | This feature is not available on the web. | Skip the call on the web. |

**Example: opens the app page**

```js
const result = await dsx.module.stream.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.stream.permission.request`

Shows the system camera and microphone permission dialog when it can still be shown, and returns the resulting state.

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

**Example: granted**

```js
const result = await dsx.module.stream.permission.request({});
// resolves {"canAsk":false,"status":"granted"}
```

### permission.status

`dsx.module.stream.permission.status`

Reads the camera and microphone permission without ever showing a dialog.

**When to use it.** Call it on a settings screen to decide what to show.

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
const result = await dsx.module.stream.permission.status({});
// resolves {"canAsk":true,"status":"undetermined"}
```

**Example: a final denial: only Settings helps**

```js
const result = await dsx.module.stream.permission.status({});
// resolves {"canAsk":false,"status":"denied"}
```

### record

`dsx.module.stream.record`

Starts or stops cloud recording of the current call.

**When to use it.** Call it from a record button; read context.recording to show whether it is on.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | no | True to start, false to stop; leave out to switch. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | yes | True when the call is being recorded after this call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | There is no live Stream call to act on. | Start a call with the call package first. |
| `recording_unavailable` | Recording could not be started or stopped, for example because the call or the account does not allow it. | Check that recording is enabled for the call type in your Stream dashboard. |
| `unsupported_platform` | This feature is not available on the web. | Skip the call on the web. |

**Example: starts recording on a live call**

```js
const result = await dsx.module.stream.record({"on":true});
// resolves {"on":true}
```

### theme

`dsx.module.stream.theme`

Records whether calls should follow the light or dark look.

**When to use it.** Call it when your app changes theme; the call screen itself comes from the call package.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `mode` | string | no | The look to use: auto, light or dark. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `mode` | string | yes | The look now in effect. |

**Example: sets the call-sheet theme**

```js
const result = await dsx.module.stream.theme({"mode":"dark"});
// resolves {"mode":"dark"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `apiKey` | string | `` | Your Stream API key from the Stream dashboard, used to connect to your Stream app. |
| `tokenUrl` | string | `/stream/token` | On the web, when no login token was given: the route answering { token, user, apiKey } for the signed in user, by default the Stream server half's POST /stream/token. |
| `usage_camera` | string | `This app uses the camera so other people on your call can see you.` | Why this app turns on the camera during a call. Shown by iOS the first time a call needs video. |
| `usage_microphone` | string | `This app uses the microphone so other people on your call can hear you.` | Why this app turns on the microphone during a call. Shown by iOS the first time a call needs audio. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `call_failed` | The call could not be joined. |  |
| `caption_unavailable` | Closed captions could not be started or stopped on this call. | Check that captions are enabled for the call type in your Stream dashboard. |
| `invalid_token` | That Stream user token could not be read. |  |
| `join_failed` | The join attempt did not land. |  |
| `no_call_engine` | No call engine is running. Sign in with dsx.module.stream.login first. |  |
| `not_configured` | Stream is not configured: this build has no apiKey. |  |
| `recording_unavailable` | Recording could not be started or stopped, for example because the call or the account does not allow it. | Check that recording is enabled for the call type in your Stream dashboard. |

## Related packages

- Needs: [Call](/packages/call)
- Works better with: [OneSignal](/packages/onesignal)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
