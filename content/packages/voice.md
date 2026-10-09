---
title: Voice
description: Speak text aloud and list the available voices.
package: voice
---

Speak text aloud and list the available voices.

Turns text into speech using the voices already on the device, in every language the system ships, with no download and no added app size. You can have the device say the words directly, or ask for the audio in chunks as they are produced. You can also stop speech at any moment and list voices per language. You write the text and decide when to speak.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for spoken answers, read-aloud and voice assistants. Use speak when the device should just say the words; use synthesize only when you need the audio itself.

## What native adds

It uses the real voices installed on the phone, with streaming and background-safe playback, which a web page does not offer consistently.

## Install

```sh
despia add Core/LocalAI/Modules/Voice
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

### speak

`dsx.module.voice.speak`

Says the text aloud through the device, with progress events while it speaks.

**When to use it.** This is the usual way to have the app talk.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | Your own id for this utterance, so you can stop it later and match its events. |
| `language` | string | no | The language to speak in, such as en. |
| `options` | object | no | Extra settings for this call. |
| `options.pitch` | number | no | How high the voice sounds; 1 is the normal pitch. |
| `options.provider` | string | no | Which speech provider to use for this call, instead of the app default. |
| `options.rate` | number | no | Another name for speed; speed wins if both are given. |
| `options.speed` | number | no | How fast to speak; 1 is normal speed. |
| `options.volume` | number | no | How loud the voice is, from 0 to 1. |
| `provider` | string | no | Which speech provider to use, such as the device's own engine; a provider the app does not carry fails with an error. |
| `text` | string | yes | The words to say or turn into audio. |
| `voice` | string | no | The id of the voice to use; if left out, a voice for the language is chosen. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | Identifies this utterance, matching the id you passed or one that was made for you. |
| `provider` | string | yes | The speech provider that said the words. |
| `spoken` | boolean | yes | True when the speech finished. |
| `voice` | string | yes | The voice that was used. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_voice` | No installed voice serves that language. |  |
| `playback_failed` | The utterance could not be played. |  |
| `voice_engine_unavailable` | This build carries no speech-synthesis provider. | Not recoverable by retrying. |

**Example: speaks an utterance and settles when playback ends**

```js
const result = await dsx.module.voice.speak({"id":"utt_2","language":"en","options":{},"text":"hello there","voice":"voice-en"});
// resolves {"id":"utt_2","provider":"platform","spoken":true,"voice":"voice-en"}
```

### stop

`dsx.module.voice.stop`

Stops the speech that is playing right now, which is safe to call even if nothing is playing.

**When to use it.** Call it when the user interrupts or leaves the screen.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | The utterance to stop; if left out, the current one is stopped. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `stopped` | boolean | yes | True when something was actually speaking and was stopped. |

**Example: stops the current utterance**

```js
const result = await dsx.module.voice.stop({});
// resolves {"stopped":true}
```

**Example: stopping when nothing is speaking is not an error**

```js
const result = await dsx.module.voice.stop({"id":"utt_gone"});
// resolves {"stopped":false}
```

### synthesize

`dsx.module.voice.synthesize`

Turns text into audio chunks that arrive as they are produced, so playback can start before the end is ready.

**When not to.** Use speak if you only need the device to say the words.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | Your own id for this utterance, so you can stop it later and match its events. |
| `language` | string | no | The language to speak in, such as en. |
| `options` | object | no | Extra settings for this call. |
| `options.pitch` | number | no | How high the voice sounds; 1 is the normal pitch. |
| `options.provider` | string | no | Which speech provider to use for this call, instead of the app default. |
| `options.rate` | number | no | Another name for speed; speed wins if both are given. |
| `options.speed` | number | no | How fast to speak; 1 is normal speed. |
| `options.volume` | number | no | How loud the voice is, from 0 to 1. |
| `provider` | string | no | Which speech provider to use, such as the device's own engine; a provider the app does not carry fails with an error. |
| `text` | string | yes | The words to say or turn into audio. |
| `voice` | string | no | The id of the voice to use; if left out, a voice for the language is chosen. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | Identifies this utterance, matching the id you passed or one that was made for you. |
| `provider` | string | yes | The speech provider that produced the audio. |
| `snapshot` | array of object | yes | Every audio chunk produced, in order. |
| `voice` | string | yes | The voice that was used. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_voice` | No installed voice serves that language. |  |
| `synthesis_failed` | The speech engine could not turn the text into audio. | Try a different voice or shorter text, then try again. |
| `voice_engine_unavailable` | This build carries no speech-synthesis provider. | Not recoverable by retrying. |

**Example: streams audio chunks as references and settles**

```js
const result = await dsx.module.voice.synthesize({"id":"utt_1","language":"en","options":{},"text":"hello there","voice":"voice-en"});
// resolves {"id":"utt_1","provider":"platform","snapshot":[{"type":"audio","url":"loopback:///utt/utt_1/0.wav"}],"voice":"voice-en"}
```

### voices

`dsx.module.voice.voices`

Lists the voices available for a language, from the device and any downloaded voice packs.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `installed` | boolean | no | Pass true to list only voices that are already on the device. |
| `language` | string | no | Only list voices for this language, such as en. |
| `provider` | string | no | Only list voices from this speech provider. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `engine` | string | yes | Names the speech engine that answered this request. |
| `providers` | array of object | yes | Each speech provider and whether this build can use it. |
| `voices` | array of object | yes | The voices that match, with their names and quality. |

**Example: lists the voices this build can use**

```js
const result = await dsx.module.voice.voices({"installed":true});
// resolves {"engine":"platform","providers":[{"available":true,"engine":"tts","id":"platform"}],"voices":[]}
```

**Example: lists the voices that serve one language**

```js
const result = await dsx.module.voice.voices({"installed":false,"language":"en"});
// resolves {"engine":"platform","providers":[{"available":true,"engine":"tts","id":"platform"}],"voices":[]}
```

## Events

Read with `dsx.on(name, handler)`.

### complete

The last chunk was produced and, for speak, played.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | Identifies the utterance that has just finished. |
| `provider` | string | yes | The speech provider that was used. |
| `snapshot` | array of object | yes | Every audio chunk in order; empty on the web. |
| `voice` | string | yes | The voice that was used. |

### playback

Reports the stages of spoken playback: started, speaking, progress at each word, then ended, failed or stopped.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `charIndex` | number | no | Where the current word starts in the text. |
| `charLength` | number | no | How many characters the current word covers. |
| `id` | string | yes | Identifies the utterance that is being played. |
| `provider` | string | no | The speech provider being used, when known. |
| `state` | string | yes | Which stage of playback was reached: started, speaking, progress, ended, failed or stopped. |
| `voice` | string | no | The voice being used, when known. |

### sync

Lets a late listener catch up with a stream; no platform sends it today.

_None._

### token

One chunk of synthesized audio is ready, as a file reference.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `delta` | object | yes | The audio chunk, with its file address, length and type. |
| `delta.duration_ms` | int | yes | How long this chunk plays, in milliseconds. |
| `delta.mime` | string | yes | The audio file type, such as audio/wav. |
| `delta.type` | string | yes | What the chunk holds, always audio. |
| `delta.url` | string | yes | Where the audio file for this chunk can be played from. |
| `id` | string | yes | The utterance this chunk belongs to. |
| `seq` | int | yes | The position of this chunk, starting from the first one. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `voice_provider` | string | `` | Which synthesizer this app speaks with. Leave it empty and the app uses the best one it carries, which is the device's own speech engine, every language the OS ships, no download, no extra app size. Set it to a provider id (for example neural) to insist on that one; if the app does not carry it, speaking fails with a clear error instead of quietly using a different voice. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
