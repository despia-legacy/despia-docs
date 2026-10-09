---
title: SpeechSynthesis
description: Speaks text aloud with the device voices, or turns text into audio files.
package: speechsynthesis
---

Speaks text aloud with the device voices, or turns text into audio files.

Lists the voices installed on the device, speaks text with a chosen voice, speed, pitch and volume, and reports progress word by word. It can also render speech into audio files that your app keeps. You write the text and decide when to speak or stop.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to read content aloud, give spoken feedback or make audio from text. For recorded or streamed audio, use the audio packages instead.

## What native adds

Native speech uses the high quality system voices, can be turned into files, and plays correctly alongside other audio. The browser voices vary by device and cannot produce files.

## Install

```sh
despia add Core/WebPlatform/SpeechSynthesis
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

### render

`dsx.module.speechsynthesis.render`

Turns text into audio files that your app owns and does not play aloud. Each finished piece arrives as a chunk event, and the result gives the final file.

**When to use it.** Use it to make narration you save, edit or send.

**When not to.** To just read text aloud, use start. It does not work in the browser.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | A name for this render; one is made if you leave it out. |
| `language` | string | no | The language to speak in, such as en-US. |
| `pitch` | number | no | How high or low the voice sounds, where 1 is normal. |
| `rate` | number | no | How fast to speak, where 1 is the normal system rate. |
| `text` | string | yes | The text to turn into audio. |
| `to` | string | no | The file path to save the finished audio to. |
| `voice` | string | no | The identifier of the voice to use, from the voices list. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `chunks` | number | yes | How many pieces the audio was written in. |
| `duration` | number | yes | The length of the audio in seconds. |
| `id` | string | yes | The id this render ran under, which matches its chunk events. |
| `path` | string | yes | The path of the finished audio file, or empty if you gave no destination. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `audio_session_failed` | The speech engine could not be started. | Try again in a moment. |
| `duplicate_id` | A speech session with that id already exists. | Use a new id, or leave the id out so one is made. |
| `file_write_failed` | An audio file could not be written. | Check that the device has free space and try again. |
| `no_text` | No text was passed, so there was nothing to render. | Pass some text to render. |
| `unsupported_platform` | The browser cannot capture speech into audio. | Render on a native device instead. |

**Example: renders chunks and settles with the take**

```js
const result = await dsx.module.speechsynthesis.render({"text":"Hello there","to":"documents:take.wav"});
// resolves {"chunks":3,"duration":1.2,"id":"utterance-2","path":"documents:take.wav"}
```

### start

`dsx.module.speechsynthesis.start`

Speaks one piece of text, or saves the speech to a file. Progress arrives as events while it speaks.

**When to use it.** Use it to read something aloud now.

**When not to.** To make audio you keep without playing it, use render.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | A name for this speech session; one is made if you leave it out. |
| `lang` | string | no | The language to speak in, such as en-US. |
| `output` | string | no | Where the speech goes: stream plays it aloud, file saves it as an audio file. |
| `pitch` | number | no | How high or low the voice sounds, where 1 is normal. |
| `speed` | number | no | How fast to speak, where 1 is the normal system rate. |
| `text` | string | yes | The words you want the device to speak aloud. |
| `voice` | string | no | The identifier of the voice to use, from the voices list. |
| `volume` | number | no | How loud to speak, from 0 to 1. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the speech session. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_started` | Another speech stream is already playing, and only one can play at a time. | Call stop first, or wait for it to end. |
| `audio_session_failed` | The audio session could not be started, or failed part way through. | Check that nothing else is holding the audio, then try again. |
| `duplicate_id` | A speech session with that id already exists. | Use a new id, or leave the id out so one is made. |
| `file_write_failed` | The audio file could not be written. | Check that the device has free space and try again. |
| `no_text` | No text was passed, so there was nothing to speak. | Pass some text to speak. |
| `unsupported_platform` | This runtime cannot do that, for example the browser cannot save speech to a file. | Use streamed speech here, or run it on a native device. |

**Example: speaks text and streams to the end**

```js
const result = await dsx.module.speechsynthesis.start({"speed":1,"text":"Hello there"});
// resolves {"id":"utterance-1"}
```

### stop

`dsx.module.speechsynthesis.stop`

Stops a speech session, or the one currently playing if you give no id. Stopping one that already ended is fine.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | The session to stop; leave it out to stop the one playing. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the session that was stopped. |
| `ok` | boolean | yes | True once the session is stopped. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | This platform cannot do this, so the call is refused instead of doing nothing. | Check for support first and hide the feature where it is not available. |

**Example: stops the active stream**

```js
const result = await dsx.module.speechsynthesis.stop({"id":"utterance-1"});
// resolves {"id":"utterance-1","ok":true}
```

**Example: stopping an already-finished session is not an error**

```js
const result = await dsx.module.speechsynthesis.stop({"id":"utterance-9"});
// resolves {"id":"utterance-9","ok":true}
```

### voices

`dsx.module.speechsynthesis.voices`

Lists the voices installed on the device, with their language and quality. You can filter them by gender, which is guessed from the voice name on Android and the web.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `gender` | string | no | Only return voices of this gender, such as female or male. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `voices` | array of object | yes | The installed voices, each with an identifier, name, language, quality and gender. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | This platform cannot do this, so the call is refused instead of doing nothing. | Check for support first and hide the feature where it is not available. |

**Example: lists female voices**

```js
const result = await dsx.module.speechsynthesis.voices({"gender":"female"});
// resolves {"voices":[{"gender":"female","identifier":"com.apple.voice.compact.en-US.Samantha","language":"en-US","name":"Samantha","quality":"default"}]}
```

**Example: lists every voice when no gender is named**

```js
const result = await dsx.module.speechsynthesis.voices({});
// resolves {"voices":[{"gender":"female","identifier":"com.apple.voice.compact.en-US.Samantha","language":"en-US","name":"Samantha","quality":"default"}]}
```

## Events

Read with `dsx.on(name, handler)`.

### boundary

A word is about to be spoken, so you can highlight it.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `charIndex` | int | yes | The position in the text where the word starts. |
| `charLength` | int | yes | How many characters long the word is. |
| `id` | string | yes | The id of the speech session. |
| `type` | string | yes | The kind of event, matching its name. |

### cancel

The session was stopped before it finished.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the speech session this event is about. |
| `type` | string | yes | The kind of event, matching its name. |

### chunk

One piece of a render was written to a file.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `duration` | number | yes | The length of this piece in seconds. |
| `id` | string | yes | The id of the render this piece belongs to. |
| `index` | int | yes | The position of this piece, counting from zero. |
| `path` | string | yes | The path of the file holding this piece. |
| `type` | string | yes | The kind of event, matching its name. |

### end

The session finished: the speech reached the end or the file job completed.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the speech session this event is about. |
| `type` | string | yes | The kind of event, matching its name. |

### file

A speech job that saves to a file has written its audio.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `byteSize` | int | yes | How large the saved audio file is, in bytes. |
| `filename` | string | yes | The name of the saved file. |
| `id` | string | yes | The id of the speech session. |
| `mimeType` | string | yes | The audio type of the file. |
| `path` | string | yes | The path of the saved file. |
| `type` | string | yes | The kind of event, matching its name. |
| `url` | string | yes | A web address for the file, empty if the Files package is not in the build. |

### pause

The stream paused, on iOS and the web.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the speech session this event is about. |
| `type` | string | yes | The kind of event, matching its name. |

### queued

A speech or render session was accepted, before any audio starts.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the speech session this event is about. |
| `type` | string | yes | The kind of event, matching its name. |

### resume

The stream continued after a pause, on iOS and the web.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the speech session this event is about. |
| `type` | string | yes | The kind of event, matching its name. |

### start

The stream has begun speaking the text aloud.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the speech session this event is about. |
| `type` | string | yes | The kind of event, matching its name. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_started` | A speech stream is already playing. |  |
| `audio_session_failed` | The speech session could not be started or failed part way through. |  |
| `duplicate_id` | A speech session with that id already exists. |  |
| `file_write_failed` | The speech audio file could not be written. |  |
| `no_text` | No text was provided to speak. |  |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
