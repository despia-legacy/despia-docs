---
title: On-device AI
description: Run a language model and speech-to-text directly on the user's device, with no server.
package: intelligence
---

Run a language model and speech-to-text directly on the user's device, with no server.

Chat with a small language model, transcribe speech from a file or the microphone, detect language and search by meaning, all on the device. Models are downloaded once from approved hosts, and you can add your own. Not yet shipped: some actions are still missing, so check before relying on it.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it for private, offline chat, dictation or search by meaning where the data should stay on the device. Do not rely on it yet: it is not shipped and some actions are still absent. Models are large downloads, so check the device first.

## What native adds

The model runs on the phone's own processor and memory, so it works offline and the text never leaves the device.

## Install

```sh
despia add Core/LocalAI
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

`dsx.module.intelligence.cancel`

Stops a running answer or transcription.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | The id of the job to stop. |

**Resolves with**

_None._

**Example: cancels an in-flight job by id**

```js
const result = await dsx.module.intelligence.cancel({"id":"job_123"});
```

### completion

`dsx.module.intelligence.completion`

Starts a chat answer from a downloaded language model. It returns at once and the text streams back as events.

**When to use it.** Use it for chat and structured replies. Only one job runs at a time on the device.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `messages` | array of object | no | The conversation so far, as a list of messages with a role and content. |
| `model` | string | no | The id of the language model to use, from the models list. |
| `options` | object | no | Settings that shape the answer. |
| `options.frequency_penalty` | number | no | Lowers the chance of words that have already appeared often. |
| `options.max_tokens` | number | no | The longest answer to produce, counted in tokens. |
| `options.min_p` | number | no | Ignore words whose chance is below this fraction of the best word. |
| `options.presence_penalty` | number | no | Lowers the chance of words that have already appeared at all. |
| `options.repeat_last_n` | number | no | How many recent words the repeat penalty looks back over. |
| `options.repeat_penalty` | number | no | How strongly to discourage repeating recent words. |
| `options.response_format` | object | no | Ask for structured output instead of free text. |
| `options.seed` | number | no | A number that makes the answer repeatable when the same input is sent again. |
| `options.temperature` | number | no | How random the answer is; lower values give steadier answers. |
| `options.topK` | number | no | Same as top_k, kept for older code. |
| `options.top_k` | number | no | Only consider this many of the most likely next words. |
| `options.top_p` | number | no | Only consider the most likely words whose combined chance reaches this value. |
| `response_format` | object | no | Ask for structured output such as JSON that follows a schema. |
| `response_format.schema` | object | no | The shape the structured output must follow. |
| `response_format.type` | string | yes | The kind of structured output wanted, such as json. |
| `task` | string | no | A hint about what the answer is for, used when choosing a model. |
| `tools` | array of object | no | Tools the model may ask to call. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `started` | boolean | yes | True once the answer has begun; the text arrives as events. |

**Example: starts a chat completion**

```js
const result = await dsx.module.intelligence.completion({"messages":[{"content":"Hello","role":"user"}],"model":"qwen3-0.6"});
// resolves {"started":true}
```

**Example: streams sequenced deltas and settles on a terminal event**

```js
const result = await dsx.module.intelligence.completion({"messages":[{"content":"Hi","role":"user"}],"model":"qwen3-0.6"});
// resolves {"started":true}
```

### detectLanguage

`dsx.module.intelligence.detectLanguage`

Works out which language is spoken in an audio file.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `audio` | string | yes | The audio to analyse, as a file path. |
| `model` | string | yes | The speech model to use, from the models list. |
| `options` | object | yes | Settings for the speech model. |
| `options.language` | string | no | The language spoken, or left out to detect it. |
| `options.threshold` | number | no | How sure the model must be before it reports speech, from 0 to 1. |
| `options.translate` | boolean | no | Set to true to translate the speech into English. |
| `options.window_ms` | int | no | The length of audio the model looks at each step, in milliseconds. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `confidence` | number | no | How sure the model is, from 0 to 1, on the web only. |
| `language` | string | yes | The language code of the detected language. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `analysis_failed` | The audio could not be analyzed. |  |
| `unknown_model` | No such speech model is installed. | Not recoverable by retrying. |

**Example: detects the spoken language**

```js
const result = await dsx.module.intelligence.detectLanguage({"audio":"https://example.com/clip.wav","model":"whisper-tiny","options":{}});
// resolves {"confidence":0.98,"language":"en"}
```

### device

`dsx.module.intelligence.device`

Reports the numbers this device measures about itself that decide which models can run, such as memory limit, free disk and heat.

**When to use it.** Use it to explain why a model was refused or to choose a model yourself.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `availability` | string | no | Whether on-device AI can run here. |
| `calibrated` | object | no | Speed measurements already recorded for models on this device. |
| `chip` | string | no | The name of the device's processor. |
| `class` | string | no | The performance class of the device. |
| `cores` | number | no | How many processor cores the device has. |
| `device` | string | no | The model name of the device. |
| `engine` | string | no | The name of the AI engine in use. |
| `footprint_mb` | number | no | The memory the app currently uses, in megabytes. |
| `freeDiskMb` | number | no | Free storage space, in megabytes. |
| `free_disk_mb` | number | no | Free storage space, in megabytes. |
| `gpu` | boolean | no | True when a graphics processor is available to the engine. |
| `lowPower` | boolean | no | True when low power mode is on. |
| `low_power` | boolean | no | True when low power mode is on. |
| `memoryGb` | number | no | The total memory, in gigabytes. |
| `memory_limit_mb` | number | no | The memory the app is really allowed to use, in megabytes, which is less than the phone's total. |
| `platform` | string | no | The operating system the app runs on. |
| `quarantined` | array of string | no | Models that crashed earlier and are no longer tried. |
| `thermal` | string | no | How hot the device is running. |
| `total_memory_mb` | number | no | The total memory of the phone, in megabytes. |

**Example: reports the device class**

```js
const result = await dsx.module.intelligence.device({});
// resolves {}
```

### diarize

`dsx.module.intelligence.diarize`

Would split a recording by speaker. This engine does not carry it yet, so the call answers that it is absent.

**When not to.** Do not rely on it until it ships.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `audio` | string | yes | The audio to analyse, as a file path. |
| `model` | string | yes | The speech model to use, from the models list. |
| `options` | object | yes | Settings for the speech model. |
| `options.language` | string | no | The language spoken, or left out to detect it. |
| `options.threshold` | number | no | How sure the model must be before it reports speech, from 0 to 1. |
| `options.translate` | boolean | no | Set to true to translate the speech into English. |
| `options.window_ms` | int | no | The length of audio the model looks at each step, in milliseconds. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `speakers` | array of object | yes | The speaker segments found in the recording; empty when no speech was found. The engine does not carry diarization yet, so today the call answers that it is absent. |

**Example: diarizes speakers**

```js
const result = await dsx.module.intelligence.diarize({"audio":"https://example.com/clip.wav","model":"pyannote","options":{}});
// resolves {"speakers":[]}
```

### download

`dsx.module.intelligence.download`

Downloads a model after checking this device can run it, and refuses before downloading anything if it cannot.

**When to use it.** Call it after showing the person the size and licence. Progress arrives as events.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `model` | string | no | The id of the model to download. |

**Resolves with**

_None._

**Example: starts a model download**

```js
const result = await dsx.module.intelligence.download({"model":"qwen3-0.6"});
```

### embed

`dsx.module.intelligence.embed`

Turns text into a list of numbers that captures its meaning, so you can compare or search by meaning.

**When to use it.** Use it with an embedding model for semantic search. Image and audio input are not available yet.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `audio` | string | yes | Audio to embed; not available yet. |
| `image` | string | yes | An image to embed; not available yet. |
| `model` | string | yes | The embedding model to use. |
| `normalize` | boolean | yes | Scale the result to unit length so it can be compared directly. True by default. |
| `text` | string | yes | The text to turn into numbers. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dim` | number | yes | How many numbers the list holds. |
| `embedding` | array of number | yes | The list of numbers for the text. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `embed_failed` | The embedding could not be computed. |  |
| `unknown_model` | No such embedding model is installed. | Not recoverable by retrying. |

**Example: embeds text into a vector**

```js
const result = await dsx.module.intelligence.embed({"audio":"","image":"","model":"nomic-embed","normalize":true,"text":"hello world"});
// resolves {"dim":3,"embedding":[0.1,0.2,0.3]}
```

### index.add

`dsx.module.intelligence.index.add`

Would add items to a vector search index. This engine does not carry an index yet, so the call answers that it is absent.

**When not to.** Do not rely on it until it ships.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `documents` | array of string | yes | The text of each item. |
| `embeddings` | array of array | yes | The embedding of each item. |
| `ids` | array of int | yes | The ids of the items to add. |
| `metadatas` | array of object | yes | Extra details for each item. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `added` | int | yes | How many items were added. |

**Example: adds vectors to the native index**

```js
const result = await dsx.module.intelligence.index.add({"documents":["a","b"],"embeddings":[[0.1,0.2],[0.3,0.4]],"ids":[1,2],"metadatas":[{"k":"v"}]});
// resolves {"added":2}
```

### index.compact

`dsx.module.intelligence.index.compact`

Would tidy a vector search index to save space. This engine does not carry an index yet, so the call answers that it is absent.

**When not to.** Do not rely on it until it ships.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

_None._

**Example: compacts the native index**

```js
const result = await dsx.module.intelligence.index.compact({});
// resolves {"ok":true}
```

### index.delete

`dsx.module.intelligence.index.delete`

Would remove items from a vector search index. This engine does not carry an index yet, so the call answers that it is absent.

**When not to.** Do not rely on it until it ships.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ids` | array of int | yes | The ids of the items to remove. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `deleted` | int | yes | How many items were removed. |

**Example: deletes index rows by id**

```js
const result = await dsx.module.intelligence.index.delete({"ids":[1,2]});
// resolves {"deleted":2}
```

### index.get

`dsx.module.intelligence.index.get`

Would fetch items from a vector search index by id. This engine does not carry an index yet, so the call answers that it is absent.

**When not to.** Do not rely on it until it ships.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ids` | array of int | yes | The ids of the items to fetch. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `rows` | array of object | yes | The items found for the ids you asked for. |

**Example: gets index rows by id**

```js
const result = await dsx.module.intelligence.index.get({"ids":[1,2]});
// resolves {"rows":[]}
```

### index.query

`dsx.module.intelligence.index.query`

Would find the items closest in meaning to an embedding. This engine does not carry an index yet, so the call answers that it is absent.

**When not to.** Do not rely on it until it ships.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `embedding` | array of number | yes | The list of numbers to search with, from the embed action. |
| `topK` | number | yes | How many results to return. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `results` | array of object | yes | The closest items, best first. |

**Example: queries the native index**

```js
const result = await dsx.module.intelligence.index.query({"embedding":[0.1,0.2],"topK":5});
// resolves {"results":[]}
```

### listen

`dsx.module.intelligence.listen`

Starts live dictation from the microphone and streams the words back as events until you stop it.

**When to use it.** Use it for voice input. It asks for the microphone at the moment you call it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `model` | string | yes | The speech model to use. |
| `prompt` | boolean | no | Set to false to fail with permission_denied instead of showing the microphone prompt. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `started` | boolean | yes | True once listening has begun. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | Microphone access is not granted. The data carries the contract state: { permission, status, canAsk }. |  |

**Example: starts real-time mic transcription**

```js
const result = await dsx.module.intelligence.listen({"model":"whisper-tiny"});
// resolves {"started":true}
```

**Example: streams transcription deltas and settles**

```js
const result = await dsx.module.intelligence.listen({"model":"whisper-tiny"});
// resolves {"started":true}
```

### models

`dsx.module.intelligence.models`

Lists the models in the catalog, or only the installed ones, with their category and licence.

**When to use it.** Use it to build a model picker or a consent screen.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `category` | string | no | Limit the list to one kind, such as text, asr or embedding. |
| `installed` | boolean | no | Set to true to list only models already on the device. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `models` | array of object | yes | The models, each with its id, name and category. |

**Example: lists installed asr models**

```js
const result = await dsx.module.intelligence.models({"category":"asr","installed":true});
// resolves {"models":[]}
```

### models.add

`dsx.module.intelligence.models.add`

Adds a model from a public registry or file address to your catalog, and tells you whether this device can run it. It does not download the model.

**When to use it.** Use it to let people bring their own model. The host must be allowed in your settings.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | The id to give the new model. |
| `prefer` | string | no | Which file of the repository to prefer. |
| `revision` | string | no | The version of the repository to pin. |
| `source` | string | yes | The registry name such as org/repo, or a file address. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `added` | boolean | yes | True when the model was added, false when it was already known. |
| `entry` | object | yes | The catalog row that was created for the model. |
| `entry.category` | string | no | The kind of model it is. |
| `entry.context_length` | int | no | How much text the model handles at once when served. |
| `entry.context_length_max` | int | no | The most text the model could handle. |
| `entry.engine` | string | no | The engine that runs it. |
| `entry.family` | string | no | The model family it belongs to. |
| `entry.files` | array of object | no | The files that make up the model. |
| `entry.format` | string | no | The file format of the model. |
| `entry.id` | string | yes | The id of the catalog row. |
| `entry.inputs` | array of string | no | The kinds of input it accepts. |
| `entry.languages` | array of string | no | The languages the model supports. |
| `entry.license` | object | no | The terms the model is released under. |
| `entry.origin` | object | no | Where the model came from. |
| `entry.outputs` | array of string | no | The kinds of output it makes. |
| `entry.parameters` | number | no | The size of the model in parameters. |
| `entry.requirements` | object | no | How much memory and disk it needs. |
| `entry.requires` | object | no | What the engine must support to load it. |
| `entry.schema_version` | int | no | The catalog format version of the row. |
| `entry.status` | string | no | Whether the row is ready to use. |
| `notice` | object | no | A message about the addition, such as a licence notice. |
| `notice.code` | string | yes | A short code naming the kind of notice, for example a licence notice. |
| `notice.model` | string | yes | The id of the model the notice is about. |
| `notice.repo` | string | yes | The repository the notice is about. |
| `verdict` | object | yes | How well this model is expected to run on this device. |
| `verdict.decode_tps` | number | no | How many tokens per second the device is expected to produce. |
| `verdict.footprint_mb` | number | no | Memory the running model uses, in megabytes. |
| `verdict.footprint_measured` | boolean | no | True when the memory use was measured instead of estimated. |
| `verdict.footprint_rejected` | boolean | no | True when the model was refused because it would use too much memory. |
| `verdict.mapped_mb` | number | no | Memory the model's files take when loaded, in megabytes. |
| `verdict.measured` | boolean | no | True when the speed was measured on this device instead of estimated. |
| `verdict.predicted` | boolean | no | True when the verdict is a prediction and not a measurement. |
| `verdict.reason` | string | no | Why the model got that verdict, in words you can show. |
| `verdict.verdict` | string | yes | Whether the model runs well, slowly or not at all on this device. |

**Example: turns a registry reference into a catalog entry**

```js
const result = await dsx.module.intelligence.models.add({"source":"hf:acme/tiny-gguf/tiny-Q4_K_M.gguf"});
// resolves {"added":true,"entry":{"engine":"gguf","id":"tiny-gguf-tiny-q4-k-m","origin":{"added":true,"revision":"1111111111111111111111111111111111111111"}},"verdict":{"predicted":true,"verdict":"runs_well"}}
```

**Example: picks a file by quantization preference**

```js
const result = await dsx.module.intelligence.models.add({"prefer":"Q4_K_M","source":"hf:acme/tiny-gguf"});
// resolves {"added":true,"entry":{"id":"tiny-gguf-tiny-q4-k-m"},"verdict":{"predicted":true,"verdict":"runs_well"}}
```

### models.added

`dsx.module.intelligence.models.added`

Lists the models this install has added beyond the shipped catalog.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `rows` | array of object | yes | The added models, one catalog row each. |

**Example: lists the rows this device added**

```js
const result = await dsx.module.intelligence.models.added({});
// resolves {"rows":[]}
```

### models.best

`dsx.module.intelligence.models.best`

Picks the largest model in a category that runs well on this device, and says whether it is installed and how big the download is.

**When to use it.** Use it instead of hard-coding a model id, so weaker phones get a model they can run.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `category` | string | no | The kind of model wanted, such as text or asr. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `download_mb` | number | yes | How much would be downloaded, in megabytes. |
| `installed` | boolean | yes | True when the model is already on the device. |
| `model` | string | yes | The id of the chosen model. |
| `name` | string | yes | The display name of the chosen model. |
| `reason` | string | yes | Why this model was chosen. |
| `verdict` | object | yes | How well this model is expected to run on this device. |
| `verdict.decode_tps` | number | no | How many tokens per second the device is expected to produce. |
| `verdict.footprint_mb` | number | no | Memory the running model uses, in megabytes. |
| `verdict.footprint_measured` | boolean | no | True when the memory use was measured instead of estimated. |
| `verdict.footprint_rejected` | boolean | no | True when the model was refused because it would use too much memory. |
| `verdict.mapped_mb` | number | no | Memory the model's files take when loaded, in megabytes. |
| `verdict.measured` | boolean | no | True when the speed was measured on this device instead of estimated. |
| `verdict.predicted` | boolean | no | True when the verdict is a prediction and not a measurement. |
| `verdict.reason` | string | no | Why the model got that verdict, in words you can show. |
| `verdict.verdict` | string | yes | Whether the model runs well, slowly or not at all on this device. |

**Example: recommends the largest model that runs here**

```js
const result = await dsx.module.intelligence.models.best({});
// resolves {"download_mb":1750,"installed":false,"model":"qwen3-1.7b-q8_0","name":"Qwen3 1.7B (Q8_0)","reason":"best-that-runs","verdict":{"verdict":"runs_well"}}
```

**Example: recommends within one category**

```js
const result = await dsx.module.intelligence.models.best({"category":"asr"});
// resolves {"download_mb":466,"installed":false,"model":"whisper-small","name":"Whisper Small","reason":"best-that-runs","verdict":{"verdict":"runs_well"}}
```

### permission.manage

`dsx.module.intelligence.permission.manage`

Lets the person change a limited selection of what the app can access, where the system offers that, and otherwise just reports the current state.

**When to use it.** Use it from a settings row such as Manage access. When nothing can be managed it returns changed as false.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when the system will still show its prompt, false once the person has refused and must change it in Settings. |
| `changed` | boolean | yes | True when the person changed their selection. |
| `level` | string | no | A finer detail of the grant where the system has one, for example limited access, otherwise left out. |
| `status` | string | yes | Whether microphone access is granted, denied or not yet asked. |

**Example: nothing limited to manage**

```js
const result = await dsx.module.intelligence.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.intelligence.permission.openSettings`

Opens this app's page in the system Settings so the person can change a permission they refused earlier.

**When to use it.** Use it from a button after a request came back denied and canAsk is false.

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
| `unavailable` | Opening Settings needs the App Settings package (dsx.module.settings). | Not recoverable by retrying. |
| `unsupported_platform` | No page script can open browser or OS settings. | Not recoverable by retrying. |

**Example: opens the app page**

```js
const result = await dsx.module.intelligence.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.intelligence.permission.request`

Asks the person for microphone access through the system prompt and reports the answer.

**When to use it.** Call it just before the feature is needed, after you have told the person why. Check permission.status first to avoid a pointless prompt.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when the system will still show its prompt, false once the person has refused and must change it in Settings. |
| `level` | string | no | A finer detail of the grant where the system has one, for example limited access, otherwise left out. |
| `status` | string | yes | Whether microphone access is granted, denied or not yet asked. |

**Example: granted**

```js
const result = await dsx.module.intelligence.permission.request({});
// resolves {"canAsk":false,"status":"granted"}
```

### permission.status

`dsx.module.intelligence.permission.status`

Reports whether the app currently has microphone access without asking the person.

**When to use it.** Use it to decide whether to show a button, a request screen or the feature itself.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when the system will still show its prompt, false once the person has refused and must change it in Settings. |
| `level` | string | no | A finer detail of the grant where the system has one, for example limited access, otherwise left out. |
| `status` | string | yes | Whether microphone access is granted, denied or not yet asked. |

**Example: never asked**

```js
const result = await dsx.module.intelligence.permission.status({});
// resolves {"canAsk":true,"status":"undetermined"}
```

**Example: a final denial: only Settings helps**

```js
const result = await dsx.module.intelligence.permission.status({});
// resolves {"canAsk":false,"status":"denied"}
```

### prefill

`dsx.module.intelligence.prefill`

Would load a conversation into the model ahead of time to speed up the next answer. This engine does not carry it yet, so the call answers that it is absent.

**When not to.** Do not rely on it until it ships.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `messages` | array of object | no | The conversation to load into the model ahead of time. |
| `model` | string | yes | The id of the model to prepare ahead of time. |
| `options` | object | no | Settings that shape the answer. |
| `options.frequency_penalty` | number | no | Lowers the chance of words that have already appeared often. |
| `options.max_tokens` | number | no | The longest answer to produce, counted in tokens. |
| `options.min_p` | number | no | Ignore words whose chance is below this fraction of the best word. |
| `options.presence_penalty` | number | no | Lowers the chance of words that have already appeared at all. |
| `options.repeat_last_n` | number | no | How many recent words the repeat penalty looks back over. |
| `options.repeat_penalty` | number | no | How strongly to discourage repeating recent words. |
| `options.response_format` | object | no | Ask for structured output instead of free text. |
| `options.seed` | number | no | A number that makes the answer repeatable when the same input is sent again. |
| `options.temperature` | number | no | How random the answer is; lower values give steadier answers. |
| `options.topK` | number | no | Same as top_k, kept for older code. |
| `options.top_k` | number | no | Only consider this many of the most likely next words. |
| `options.top_p` | number | no | Only consider the most likely words whose combined chance reaches this value. |
| `tools` | array of object | no | Tools the model may call. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `result` | string | yes | The outcome of the preparation. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unknown_model` | No such model is installed. | Not recoverable by retrying. |

**Example: prefills the kv cache**

```js
const result = await dsx.module.intelligence.prefill({"messages":[{"content":"Hi","role":"user"}],"model":"qwen3-0.6","options":{},"tools":[]});
// resolves {"result":"ok"}
```

### remove

`dsx.module.intelligence.remove`

Deletes a downloaded model from the device, or every model when given all.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `model` | string | no | The id of the model to delete, or all to delete every model. |

**Resolves with**

_None._

**Example: removes a model by id**

```js
const result = await dsx.module.intelligence.remove({"model":"qwen3-0.6"});
```

### score

`dsx.module.intelligence.score`

Would rate how likely a run of tokens is under the model. This engine does not carry it yet, so the call answers that it is absent.

**When not to.** Do not rely on it until it ships.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `context` | number | no | How many earlier tokens to use as context. |
| `end` | number | no | Where in the tokens to stop scoring. |
| `model` | string | yes | The id of the model used to rate the tokens. |
| `start` | number | no | Where in the tokens to start scoring. |
| `tokens` | array of int | yes | The token ids to score. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `perplexity` | number | yes | How surprised the model is by the scored tokens; lower means the tokens were more likely. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unknown_model` | No such model is installed. | Not recoverable by retrying. |

**Example: scores a token window**

```js
const result = await dsx.module.intelligence.score({"context":0,"end":3,"model":"qwen3-0.6","start":0,"tokens":[1,2,3]});
// resolves {"perplexity":12.3}
```

### speakerEmbed

`dsx.module.intelligence.speakerEmbed`

Would turn a voice into a fingerprint for telling speakers apart. This engine does not carry it yet, so the call answers that it is absent.

**When not to.** Do not rely on it until it ships.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `audio` | string | yes | The audio to analyse, as a file path. |
| `model` | string | yes | The speech model to use, from the models list. |
| `options` | object | yes | Settings for the speech model. |
| `options.language` | string | no | The language spoken, or left out to detect it. |
| `options.threshold` | number | no | How sure the model must be before it reports speech, from 0 to 1. |
| `options.translate` | boolean | no | Set to true to translate the speech into English. |
| `options.window_ms` | int | no | The length of audio the model looks at each step, in milliseconds. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `embedding` | array of number | yes | The numbers that fingerprint the speaker's voice. |

**Example: computes a speaker embedding**

```js
const result = await dsx.module.intelligence.speakerEmbed({"audio":"https://example.com/clip.wav","model":"ecapa","options":{}});
// resolves {"embedding":[]}
```

### stopListening

`dsx.module.intelligence.stopListening`

Stops live dictation and releases the microphone.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

_None._

**Example: stops the live mic session**

```js
const result = await dsx.module.intelligence.stopListening({});
```

### tokenize

`dsx.module.intelligence.tokenize`

Would split text into the model's tokens. This engine does not carry it yet, so the call answers that it is absent.

**When not to.** Do not rely on it until it ships.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `model` | string | yes | The model whose tokens to use. |
| `text` | string | yes | The text to split into tokens. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many tokens there are. |
| `tokens` | array of int | yes | The ids of the tokens the text was split into. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `tokenize_failed` | The text could not be split into tokens by the model. | Check the model id and try again, or avoid relying on this action until it ships. |
| `unknown_model` | No such model is installed. | Not recoverable by retrying. |

**Example: tokenizes text into ids**

```js
const result = await dsx.module.intelligence.tokenize({"model":"qwen3-0.6","text":"hello"});
// resolves {"count":1,"tokens":[9707]}
```

### transcribe

`dsx.module.intelligence.transcribe`

Turns a recorded audio file into text with a speech model. It returns at once and the text arrives as events.

**When to use it.** Use it for files. For live microphone dictation use listen.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `audio` | string | yes | The audio file to transcribe. |
| `id` | string | yes | A name for this job, to match its events. |
| `model` | string | yes | The speech model to use, from the models list. |
| `options` | object | yes | Settings for the speech model. |
| `options.language` | string | no | The language spoken, or left out to detect it. |
| `options.threshold` | number | no | How sure the model must be before it reports speech, from 0 to 1. |
| `options.translate` | boolean | no | Set to true to translate the speech into English. |
| `options.window_ms` | int | no | The length of audio the model looks at each step, in milliseconds. |
| `prompt` | string | yes | Words that may appear, to help the model spell names correctly. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `started` | boolean | yes | True once transcription has begun; the text arrives as events. |

**Example: starts a file transcription**

```js
const result = await dsx.module.intelligence.transcribe({"audio":"https://example.com/clip.wav","id":"job_123","model":"whisper-tiny","options":{},"prompt":""});
// resolves {"started":true}
```

### vad

`dsx.module.intelligence.vad`

Finds the parts of an audio file where someone is speaking.

**When to use it.** Use it to skip silence before transcribing.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `audio` | string | yes | The audio to analyse, as a file path. |
| `model` | string | yes | The speech model to use, from the models list. |
| `options` | object | yes | Settings for the speech model. |
| `options.language` | string | no | The language spoken, or left out to detect it. |
| `options.threshold` | number | no | How sure the model must be before it reports speech, from 0 to 1. |
| `options.translate` | boolean | no | Set to true to translate the speech into English. |
| `options.window_ms` | int | no | The length of audio the model looks at each step, in milliseconds. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `segments` | array of object | yes | The speech parts, each with a start and end time in milliseconds. |
| `speech` | boolean | no | True when any speech was found. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `analysis_failed` | The audio could not be analyzed. |  |
| `unknown_model` | No such speech model is installed. | Not recoverable by retrying. |

**Example: runs voice-activity detection**

```js
const result = await dsx.module.intelligence.vad({"audio":"https://example.com/clip.wav","model":"silero-vad","options":{}});
// resolves {"segments":[]}
```

## Events

Read with `dsx.on(name, handler)`.

### complete

The chat answer is finished, or was stopped, and this carries the whole answer.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancelled` | boolean | no | True when the answer was stopped before it finished. |
| `id` | string | yes | The id of the chat job that finished. |
| `snapshot` | array of object | yes | The full answer as a list of content blocks. |

### downloadEnd

A model finished downloading and is installed.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the model that was installed. |

### downloadError

A model download failed. Kept for older code.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the model that failed. |
| `message` | string | yes | A readable description of what went wrong. |

### downloadProgress

How far a model download has got.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the model being downloaded. |
| `progress` | number | yes | The fraction downloaded, from 0 to 1. |

### downloadStart

A model download has begun.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the model being downloaded. |

### error

A chat answer failed on the device. Kept for older code.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `errorCode` | int | yes | A number naming the engine error. |
| `errorMessage` | string | yes | A readable description of what went wrong. |
| `id` | string | yes | The id of the chat job that failed. |

### installedModels

The list of installed models changed after a download or removal.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `models` | array of object | yes | The list of models now installed on the device. |

### listenError

A live dictation session failed.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `errorCode` | int | yes | A number naming the engine error. |
| `errorMessage` | string | yes | A readable description of what went wrong. |

### listenFinal

The final text of a live dictation session.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `text` | string | yes | The final text of everything that was dictated. |

### listenPartial

The words heard so far in a live dictation session.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `text` | string | yes | The words heard so far in this dictation. |

### removeAllError

Deleting all models failed. Kept for older code.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `message` | string | yes | A readable description of what went wrong. |

### removeAllSuccess

Every downloaded model was deleted from the device.

_None._

### removeError

Deleting a model failed. Kept for older code.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the model that could not be deleted. |
| `message` | string | yes | A readable description of what went wrong. |

### removeSuccess

A model was deleted from the device.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the model that was deleted. |

### routing

Tells you which model is answering a chat request and why, before the first piece arrives.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the chat job being routed. |
| `model` | string | yes | The model that will answer. |
| `reason` | string | yes | Why this model was chosen. |

### sync

Reserved for a late-joining screen to catch up on an answer in progress. Nothing sends it yet.

_None._

### token

One new piece of a running chat answer. Add each piece to what you have shown so far.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `delta` | object | yes | The new piece of text that was produced, with its type. |
| `delta.text` | string | yes | The new words to append. |
| `delta.type` | string | yes | The kind of content, such as text. |
| `id` | string | yes | The id of the job this piece belongs to. |
| `seq` | int | yes | The position of this piece, counting from 0, so you can spot a missed one. |

### tool

Reserved for when the model asks to call a tool. Nothing sends it yet.

_None._

### transcribeComplete

A file transcription is finished and carries the whole text.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancelled` | boolean | no | True when the job was stopped before it finished. |
| `id` | string | yes | The id of the transcription job. |
| `text` | string | yes | The full transcript, empty if the job was stopped. |

### transcribeError

A transcription of an audio file failed before it finished.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `errorCode` | int | no | A number naming the engine error, on phones only. |
| `errorMessage` | string | yes | A readable description of what went wrong. |
| `id` | string | yes | The id of the transcription job. |

### transcribeToken

A piece of a file transcription has been decoded.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the transcription job. |
| `text` | string | yes | The words decoded for this piece of the audio. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `allowed_model_hosts` | list | `["huggingface.co","*.huggingface.co"]` | Hosts this app may download AI models from, https only. The shipped catalog's models live on huggingface.co, so those hosts are here already and downloads work out of the box. Add your own host to serve your own models, for example models.yourcompany.com, or *.yourcompany.com for its subdomains. Empty this list and nothing downloads at all. |
| `model_memory_budget_percent` | number | `70` | How much of the memory this app still has left may be held by loaded AI models at once, as a percentage. At the default 70, loading a model that would push the total past 70% of what the app has left unloads the least recently used model first, so the rest stays free for your screens, images and the next model's load. Raise it toward 100 to keep more models loaded at the same time and leave the app less room for everything else. Set it to 0 for no limit: models are never unloaded automatically, which is the right answer on a desktop or a dedicated device with memory to spare, and a way to get the app killed on a phone. |
| `model_sources` | json | `{"hf":{"api":"https://huggingface.co/api/models/{repo}/revision/{revision}?blobs=true","default_revision":"main","file":"https://huggingface.co/{repo}/resolve/{commit}/{path}","page":"https://huggingface.co/{repo}"}}` | Where despia.intelligence.models.add may look up a model, as URL templates. Hugging Face is here already, so models.add({ source: "hf:org/repo/file.gguf" }) works out of the box. Add your own registry to resolve your own models, where the key is the source prefix your app writes. Empty this and models.add resolves nothing. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `ambiguous_file` | That repository publishes several model files. Name one, or pass a prefer. |  |
| `catalog_unavailable` | This build cannot resolve models at runtime. |  |
| `digest_mismatch` | The downloaded model does not match its pinned digest and was deleted. |  |
| `download_failed` | The delivery layer refused the fetch itself: the source named no files, the fetched file was unreadable, or the worker refused without naming a lock. |  |
| `engine_unavailable` | LocalAI requires an arm64 iOS simulator or a physical iOS device. |  |
| `failed` | The operation failed for a reason the engine did not name more specifically. | Try again, and show the message to the person if it keeps failing. |
| `file_not_found` | That repository has no such file. |  |
| `format_malformed` | The downloaded model's header did not parse and it was deleted. |  |
| `format_unrecognized` | The downloaded file is not a model this engine can read and was deleted. |  |
| `format_unsupported` | The downloaded model uses a format version this build does not carry. |  |
| `id_conflict` | This app already ships a model with that id. |  |
| `inference_busy` | Another inference is already running. |  |
| `inference_failed` | The model could not produce an answer. | Try again, or choose a smaller model if the device is short on memory. |
| `insufficient_storage` | There is not enough free space for this model. |  |
| `license_unknown` | That repository declares no licence. |  |
| `listen_failed` | The live microphone session failed. |  |
| `model_download_failed` | A model could not be downloaded. | Check the connection and free space, then download again. |
| `model_quarantined` | This model did not survive its last load on this device and is quarantined until it is cleared. |  |
| `model_remove_failed` | A model could not be removed. |  |
| `model_too_big` | This model needs more memory or storage than this device has. |  |
| `model_unsupported` | This build does not carry what this model needs. |  |
| `no_matching_file` | No file in that repository matches. |  |
| `no_model_available` | No model of that kind runs on this device. |  |
| `origin_not_allowed` | The model origin is not on this app's allowed_model_hosts list. |  |
| `prefill_failed` | The model could not be prepared ahead of time. | Skip preparation and ask for the answer directly. |
| `rag_failed` | The search over stored documents failed. | Try again later; this feature is not available on every engine yet. |
| `resolve_failed` | That model registry did not answer. |  |
| `revision_not_immutable` | That repository did not resolve to a commit, and a moving revision is never stored. |  |
| `source_malformed` | That model source is not a registry reference. |  |
| `source_unsupported` | This app does not resolve sources from that registry. |  |
| `transcribe_failed` | The audio could not be turned into text. | Check that the file is readable audio and the speech model is installed, then try again. |
| `unsupported` | That file is not one this build can serve. |  |

## Related packages

- Needs: [Audio](/packages/audio), [Microphone](/packages/microphone)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
