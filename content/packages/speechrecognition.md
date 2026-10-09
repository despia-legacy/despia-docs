---
title: SpeechRecognition
description: Turn the user's speech into text with the standard web speech API.
package: speechrecognition
---

Turn the user's speech into text with the standard web speech API.

Adds the browser SpeechRecognition API to your web pages inside the app, because the iOS and Android web views do not have it, and also offers a simple start, stop and abort call. It listens through the microphone, streams interim and final transcripts, and asks for speech and microphone permission the first time. You write the page that shows the text.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for dictation, voice search or voice commands in a web page. Code written for the standard speech recognition API keeps working without changes.

## What native adds

It uses the phone's own speech recognizer and permission flow, which the web views do not expose.

## Install

```sh
despia add Core/WebPlatform/SpeechRecognition
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

### abort

`dsx.module.speechrecognition.abort`

Stops listening and throws away what was heard; it is safe to call when nothing is running.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the recognizer is stopped. |

**Example: aborts the active session**

```js
const result = await dsx.module.speechrecognition.abort({});
// resolves {"ok":true}
```

**Example: stopping nothing is a no-op, so teardown paths need no bookkeeping**

```js
const result = await dsx.module.speechrecognition.abort({});
// resolves {"ok":true}
```

### permission.manage

`dsx.module.speechrecognition.permission.manage`

Lets the user change which items this app can see when speech recognition and the microphone is limited, without leaving the app; elsewhere it only reports the current state.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog for speech recognition and the microphone; false means only Settings can change it. |
| `changed` | boolean | yes | True when the user changed the selection in the system picker. |
| `level` | string | no | Not used here; this permission has no separate levels, so it is normally empty. |
| `status` | string | yes | The current state of speech recognition and the microphone: undetermined, granted, limited, denied, restricted or unavailable. |

**Example: nothing limited to manage**

```js
const result = await dsx.module.speechrecognition.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.speechrecognition.permission.openSettings`

Opens this app's page in the system Settings so the user can change a denied permission.

**When to use it.** Call it only from a button the user taps, never automatically after a denial.

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
| `unavailable` | Opening Settings needs the App Settings package, which is not part of this app. | Add the App Settings package to the app, or tell the user where to find Settings. |
| `unsupported_platform` | A web page cannot open browser or system settings. | Show the user a short instruction for changing the permission in their browser instead. |

**Example: opens the app page**

```js
const result = await dsx.module.speechrecognition.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.speechrecognition.permission.request`

Asks for speech recognition and the microphone with the system dialog, for a settings row or an onboarding step; the dialog only appears while the system still allows it.

**When to use it.** Use it when the user taps something that clearly needs the permission, or on a priming screen you design.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog for speech recognition and the microphone; false means only Settings can change it. |
| `level` | string | no | Not used here; this permission has no separate levels, so it is normally empty. |
| `status` | string | yes | The current state of speech recognition and the microphone: undetermined, granted, limited, denied, restricted or unavailable. |

**Example: granted**

```js
const result = await dsx.module.speechrecognition.permission.request({});
// resolves {"canAsk":false,"status":"granted"}
```

### permission.status

`dsx.module.speechrecognition.permission.status`

Reads the current state of speech recognition and the microphone without ever showing a dialog, so a settings screen can call it every time it appears.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog for speech recognition and the microphone; false means only Settings can change it. |
| `level` | string | no | Not used here; this permission has no separate levels, so it is normally empty. |
| `status` | string | yes | The current state of speech recognition and the microphone: undetermined, granted, limited, denied, restricted or unavailable. |

**Example: never asked**

```js
const result = await dsx.module.speechrecognition.permission.status({});
// resolves {"canAsk":true,"status":"undetermined"}
```

**Example: a final denial: only Settings helps**

```js
const result = await dsx.module.speechrecognition.permission.status({});
// resolves {"canAsk":false,"status":"denied"}
```

### polyfill

`dsx.module.speechrecognition.polyfill`

The internal route the SpeechRecognition polyfill uses to talk to the phone; you do not call it by hand.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `action` | string | yes | What the polyfill asks for, such as start, stop or abort. |
| `config` | object | no | The settings of the recognizer, copied from the page. |
| `config.continuous` | boolean | no | True to keep listening after the user pauses. |
| `config.interimResults` | boolean | no | True to report partial results while the user is still speaking. |
| `config.lang` | string | no | The language to listen for, such as en-US. |
| `config.maxAlternatives` | int | no | How many alternative transcripts to return for each result. |
| `recognizerId` | string | yes | Identifies which recognizer object on the page the request belongs to. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | A browser needs no SpeechRecognition polyfill because it already owns that constructor. | Not recoverable by retrying. |

**Example: accepts a shim start message**

```js
const result = await dsx.module.speechrecognition.polyfill({"action":"start","config":{"lang":"en-US"},"recognizerId":"speech_1_abc"});
```

### start

`dsx.module.speechrecognition.start`

Starts listening and streams what the user says as results, asking for speech and microphone permission first if needed.

**When to use it.** Use it from a microphone button when you do not need the standard web API.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `continuous` | boolean | no | True to keep listening after the user pauses. |
| `interim` | boolean | no | True to receive partial transcripts while the user is still speaking. |
| `language` | string | no | The language to listen for, such as en-US. |
| `max` | number | no | How many alternative transcripts to return for each result. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `type` | string | yes | Always end, which marks that the listening session is over. |

**Example: recognizes speech and streams to the end**

```js
const result = await dsx.module.speechrecognition.start({"continuous":false,"interim":true,"language":"en-US","max":1});
// resolves {"type":"end"}
```

### stop

`dsx.module.speechrecognition.stop`

Stops listening and lets the recognizer finish the words it already heard; it is safe to call when nothing is running.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the recognizer is stopped. |

**Example: stops the active session**

```js
const result = await dsx.module.speechrecognition.stop({});
// resolves {"ok":true}
```

**Example: stopping nothing is a no-op, so teardown paths need no bookkeeping**

```js
const result = await dsx.module.speechrecognition.stop({});
// resolves {"ok":true}
```

## Events

Read with `dsx.on(name, handler)`.

### polyfill

Carries the standard web speech events to the polyfill on the page; you should not read it by hand.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `error` | string | no | For error events, the standard error code such as no-speech or not-allowed. |
| `message` | string | no | For error events, a readable explanation. |
| `recognizerId` | string | yes | Identifies which recognizer object on the page the event is for. |
| `resultIndex` | int | no | For result events, where the new results begin in the list. |
| `results` | array of object | no | For result events, every result so far. |
| `type` | string | yes | The standard event name, such as start, result, error or end. |

### result

The recognizer heard something and has a best transcript with its alternatives.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alternatives` | array of object | yes | Other possible transcripts, each with its own confidence. |
| `confidence` | number | yes | How sure the recognizer is, from 0 to 1. |
| `isFinal` | boolean | yes | True when this transcript will not change any more. |
| `transcript` | string | yes | The best guess of what was said. |
| `type` | string | yes | Always result for this event. |

### start

The recognizer has started listening.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `type` | string | yes | Always start for this event. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `usage_description` | multiline | `Converting your voice into text for in-app speech recognition features` | The message shown when iOS asks the user for speech recognition. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `aborted` | The recognition session was aborted. |  |
| `audio_capture` | The microphone could not be captured, or the recognizer failed without naming a reason. |  |
| `bad_grammar` | The supplied grammar could not be compiled. |  |
| `language_not_supported` | The recognizer does not support the requested language. |  |
| `network` | The recognizer's network transport failed. |  |
| `no_speech` | No speech was detected before the recognizer gave up. |  |
| `not_allowed` | Speech recognition is not permitted: the microphone permission was refused, or the platform forbids it here. |  |
| `service_not_allowed` | The recognition service refused this app: it is unavailable, busy, or out of quota. |  |

## Related packages

- Needs: [Audio](/packages/audio)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
