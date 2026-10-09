---
title: Converse
description: Hold a spoken conversation with an AI model entirely on the device, with no network.
package: converse
---

Hold a spoken conversation with an AI model entirely on the device, with no network.

Runs a voice call loop: it listens to the person, turns speech into text, asks a local language model for an answer and speaks the reply, one turn at a time. The person can interrupt the reply by talking over it. It works on top of the on-device AI and voice packages, which must be included. You choose the models and write the call screen.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it for a private voice assistant or concierge that must work offline. It is not shipped yet and needs the on-device AI package, a speech model, a language model and a voice. Only one call can run at a time.

## What native adds

Everything stays on the phone, so the conversation works offline and nothing is sent to a server.

## Install

```sh
despia add Core/LocalAI/Modules/Converse
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

### interrupt

`dsx.module.converse.interrupt`

Stops the assistant from speaking right now, the same as when the person talks over it.

**When to use it.** Wire it to a Stop button.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `interrupted` | boolean | yes | True when something was speaking and was stopped. |

**Example: cuts off the current reply**

```js
const result = await dsx.module.converse.interrupt({});
// resolves {"interrupted":true}
```

### say

`dsx.module.converse.say`

Speaks a line you wrote into the live call without asking the model, such as a greeting or a notice. The person can interrupt it like any reply.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `text` | string | yes | The words you want the assistant to speak aloud. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `spoken` | boolean | yes | True when the line was spoken. |

**Example: speaks an app-authored line into the call**

```js
const result = await dsx.module.converse.say({"text":"One moment."});
// resolves {"spoken":true}
```

### start

`dsx.module.converse.start`

Starts a spoken conversation. The device listens, thinks and speaks in turns until you stop it.

**When to use it.** Call it when the person opens a voice screen. A second call while one is running is refused.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `asr` | string | no | The speech model that turns what the person says into text. |
| `id` | string | no | A name for this call, used to match its events. |
| `language` | string | no | The spoken language of the conversation, such as en. |
| `model` | string | no | The language model that writes the replies. |
| `options` | object | no | Reserved for future settings; nothing is read from it today. |
| `system` | string | no | Instructions that set the assistant's role and style, such as be brief. |
| `tools` | array of object | no | Tools the model may call during the conversation. |
| `voice` | string | no | The voice used to speak the replies. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the call that started. |
| `started` | boolean | yes | True once the call is running. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_in_call` | A conversation is already running. |  |
| `listen_unavailable` | Speech input is not available in this build. | Not recoverable by retrying. |
| `speech_unavailable` | Speech output is not available in this build. | Not recoverable by retrying. |

**Example: starts a duplex conversation**

```js
const result = await dsx.module.converse.start({"asr":"whisper-tiny","id":"call_1","language":"en","model":"qwen3-0.6","options":{},"system":"Be brief.","tools":[],"voice":"voice-en"});
// resolves {"id":"call_1","started":true}
```

### stop

`dsx.module.converse.stop`

Ends the conversation and releases the microphone.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | The id of the call to end. Defaults to the running call. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `stopped` | boolean | yes | True once the call has ended. |
| `turns` | number | yes | How many turns the conversation had. |

**Example: ends the conversation**

```js
const result = await dsx.module.converse.stop({});
// resolves {"stopped":true,"turns":0}
```

**Example: stopping when no call is running is not an error**

```js
const result = await dsx.module.converse.stop({});
// resolves {"stopped":false,"turns":0}
```

## Events

Read with `dsx.on(name, handler)`.

### complete

The assistant finished writing its reply for a turn. It carries the full text and how long the first words took.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The call this finished reply belongs to. |
| `latency` | object | yes | How long the reply took to start, measured from the end of the person's speech. |
| `latency.firstAudioMs` | int | yes | Milliseconds until the first sound of the reply, or -1 if it never came. |
| `latency.firstTokenMs` | int | yes | Milliseconds until the first word of the reply, or -1 if it never came. |
| `text` | string | yes | The complete reply the assistant wrote for this turn. |
| `turn` | int | yes | The turn this finished reply belongs to. |

### partial

The words the person is saying right now, before they finish. Speaking over the assistant interrupts its reply.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The call this partial text belongs to. |
| `text` | string | yes | The words heard so far. |

### speaking

The spoken reply started, ended, stopped or failed, or was interrupted by the person.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The call whose reply is being spoken. |
| `state` | string | yes | What the playback is doing, such as started, ended or interrupted. |
| `turn` | int | yes | The number of the turn being spoken. |

### state

The conversation moved to a new state, such as listening, thinking or speaking, or the call started, ended or failed.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The call whose state changed. |
| `reason` | string | no | Why the call fell back to listening or failed, when it did. |
| `started` | boolean | no | True when this event announces that the call has started. |
| `state` | string | yes | The new state: listening, thinking, speaking, ended or error. |
| `turn` | int | no | The turn the call is on now. |

### token

A new piece of the assistant's reply text as it is written.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `delta` | object | yes | The new piece of text. |
| `delta.text` | string | yes | The new words to append to the reply. |
| `delta.type` | string | yes | The kind of content, which is text. |
| `id` | string | yes | The call this piece of reply belongs to. |
| `turn` | int | yes | The number of the turn being answered. |

### tool

Reserved for when the model asks to call a tool during a call. Nothing sends it yet.

_None._

### user

The person finished speaking and this is their final text for the turn. The model starts answering.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The call this final text belongs to. |
| `text` | string | yes | The final words the person said. |
| `turn` | int | yes | The turn that the final text starts. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
