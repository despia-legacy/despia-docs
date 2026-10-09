---
title: Edit
description: Mixes an audio project down to a file, and measures loudness, peaks and silences in a file.
package: edit
---

Mixes an audio project down to a file, and measures loudness, peaks and silences in a file.

Takes a project made of tracks and clips with trims, fades, gain, pan, effects and ducking, and renders it to a single audio file. It can also read a file and report its waveform, loudness, silences and chapters. You build the project and decide where the file goes.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for editing audio in the app, such as trimming a recording, joining clips, mixing a voice over music or evening out loudness. For simply playing audio, use the Audio package.

## What native adds

Mixing and measuring audio on the device is fast, works offline and keeps recordings private. The same project gives the same length on every platform.

## Install

```sh
despia add Core/Audio/Modules/Edit
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

### analyze

`dsx.module.edit.analyze`

Reads an audio file and reports its length, waveform peaks, loudness, silent stretches and embedded chapters. Detecting key and notes needs the Vocal pack, which is not available yet.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `chapters` | boolean | no | Set to true to read chapters embedded in the file. |
| `key` | boolean | no | Set to true to detect the musical key; needs the Vocal pack. |
| `loudness` | boolean | no | Set to true to measure loudness. |
| `notes` | boolean | no | Set to true to detect the notes; needs the Vocal pack. |
| `path` | string | yes | The Files path of the audio file to read. |
| `peaks` | int | no | How many waveform points to return, each the largest level in its slice from 0 to 1. |
| `silences` | object | no | Settings for finding silent stretches. |
| `silences.below` | number | no | The level in dBFS below which sound counts as silence; the default is minus 50. |
| `silences.min` | number | no | The shortest silence to report, in seconds; the default is 0.5. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `channels` | number | yes | How many audio channels the file has. |
| `chapters` | array of object | no | The chapters found, each with a title, start and end in seconds. |
| `duration` | number | yes | The length of the audio in seconds. |
| `loudness` | object | no | The loudness measurements, if you asked for them. |
| `loudness.integrated` | number | yes | The overall loudness in LUFS. |
| `loudness.peak` | number | no | The highest sample peak found in the file. |
| `loudness.truePeak` | number | yes | The highest true peak in dBTP. |
| `peaks` | array of number | no | The waveform points you asked for. |
| `sampleRate` | number | yes | The sample rate of the audio in hertz. |
| `silences` | array of object | no | The silent stretches found, each with a start and end in seconds. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `decode_failed` | A source file is not audio this platform can decode. | Convert the file to a common format such as wav or m4a. |
| `invalid_source` | A source must be an https address or a Files path, and a destination must be a Files path. | Fix the path named in the error data. |
| `invalid_value` | A value has the wrong shape for where it is used. | Read the path in the error data to find the value, and correct it. |
| `not_found` | A source file could not be opened. | Check that the file exists at the path named in the error data. |
| `out_of_range` | A number is outside the range allowed for it. | Use the path in the error data to find the number, and bring it into range. |
| `unsupported_platform` | This surface cannot render audio, or the request needs the Vocal pack, which is not available yet. | Remove the request that needs it, or run on a native device. |

**Example: peaks, loudness and silences of a file**

```js
const result = await dsx.module.edit.analyze({"loudness":true,"path":"documents:raw/host.m4a","peaks":4,"silences":{"below":-45,"min":1.2}});
// resolves {"channels":1,"duration":8,"loudness":{"integrated":-20.1,"peak":-6,"truePeak":-5.9},"peaks":[0.5,0.5,0,0.5],"sampleRate":48000,"silences":[{"end":6,"start":4}]}
```

### render

`dsx.module.edit.render`

Mixes a project down to one audio file. Trims, splits, joins, fades, gain, pan, effects and ducking are all part of the project, and a master loudness effect can bring the mix to an exact target.

**When to use it.** Use it to export an edit.

**When not to.** To just listen to a project, play it in the Audio package.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bitDepth` | int | no | The bits per sample for wav and flac output. |
| `bitrate` | int | no | The bitrate for m4a and opus output, in bits per second. |
| `format` | string | no | The file format: m4a, wav, opus or flac. If left out it follows the extension of the destination, else m4a. |
| `project` | object | yes | The project to mix, made of tracks, clips and master effects. |
| `project.master` | object | no | Effects applied to the final mix, such as loudness. |
| `project.sampleRate` | int | no | The sample rate to mix at, in hertz. |
| `project.tracks` | array of object | yes | The tracks of the project, each with an id, clips, gain, pan and effects. |
| `quality` | string | no | The encoding quality for formats that have a quality setting. |
| `to` | string | yes | The Files path where the finished audio file is written. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | number | yes | The size of the finished file in bytes. |
| `duration` | number | yes | The length of the finished audio in seconds. |
| `format` | string | yes | The format of the finished file. |
| `loudness` | object | no | The measured loudness of the mix. |
| `loudness.integrated` | number | yes | The overall loudness of the mix in LUFS. |
| `loudness.truePeak` | number | yes | The highest peak of the mix in dBTP. |
| `path` | string | yes | The Files path of the finished audio file. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A render is already running. | Wait for it to finish before starting another. |
| `decode_failed` | A source file is not audio this platform can decode. | Convert the file to a common format such as wav or m4a. |
| `disk_full` | The finished file could not be written. | Free some space on the device and try again. |
| `invalid_id` | A track id is missing or used twice. | Give every track its own unique id. |
| `invalid_source` | A source must be an https address or a Files path, and a destination must be a Files path. | Fix the path named in the error data. |
| `invalid_value` | A value has the wrong shape for where it is used. | Read the path in the error data to find the value, and correct it. |
| `not_found` | A source file could not be opened. | Check that the file exists at the path named in the error data. |
| `out_of_range` | A number is outside the range allowed for it. | Use the path in the error data to find the number, and bring it into range. |
| `unknown_node` | A ducking rule names a track that does not exist. | Use the id of a track in the project. |
| `unknown_value` | A word is not one of the values allowed for it. | Check the word against the list of allowed values. |
| `unsupported_format` | That audio format is not available here. | Use m4a, wav, opus or flac; m4a and opus need the platform encoder. |
| `unsupported_platform` | This surface cannot render audio, or the request needs the Vocal pack, which is not available yet. | Remove the request that needs it, or run on a native device. |

**Example: mixes a project and streams progress**

```js
const result = await dsx.module.edit.render({"format":"m4a","project":{"master":{"effects":[{"target":-16,"truePeak":-1,"type":"loudness"}]},"sampleRate":48000,"tracks":[{"clips":[{"at":0,"fadeIn":0.5,"from":12.5,"src":"documents:raw/host.m4a","to":905}],"id":"host"}]},"to":"documents:episodes/ep-12.m4a"});
// resolves {"bytes":7140000,"duration":892.5,"format":"m4a","loudness":{"integrated":-16,"truePeak":-1.2},"path":"documents:episodes/ep-12.m4a"}
```

## Events

Read with `dsx.on(name, handler)`.

### progress

Reports how far a render has got, so you can show a progress bar.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `fraction` | number | yes | How much of the render is done, from 0 to 1. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `default_format` | string | `m4a` | The container a render uses when the call names no format and the destination has no known extension. m4a (AAC) is small and plays everywhere; wav is uncompressed; opus is the best quality per byte; flac is lossless. |
| `default_quality` | string | `medium` | The bitrate class of lossy renders (m4a, opus) when the call names none: low, medium or high. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
