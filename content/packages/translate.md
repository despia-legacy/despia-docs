---
title: Translate
description: Translate text between languages, on the device first.
package: translate
---

Translate text between languages, on the device first.

Translates text using the phone's own translation models, and detects the source language on Android and the web. If the device cannot do a language pair, it can fall back to your own LibreTranslate-compatible translation service. That service is optional and is set in the settings.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to translate short texts such as chat messages or labels, privately on the device. For long documents or languages the device lacks, point it at your own LibreTranslate-compatible service; it also never translates text that is already in the target language.

## What native adds

Uses the translation models built into the phone and browser, so text stays on the device and works offline once the language is installed.

## Install

```sh
despia add Core/Translate
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone.

## Actions

### translate

`dsx.module.translate.translate`

Translates a text into another language, on the device when it can and through your own service otherwise.

**When to use it.** Call it when you want to show a message or label in the person's language.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `from` | string | no | The language of the text; leave out to detect it on Android and the web. |
| `prompt` | boolean | no | Set false to never show the system download sheet for a language; the call then uses your service or fails with unavailable. |
| `text` | string | yes | The text to translate; up to 5000 characters. |
| `to` | string | yes | The language to translate into, as a tag such as de or pt-BR. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `engine` | string | yes | What did the work: device, service, or none when no translation was needed. |
| `from` | string | yes | The language the text was in. |
| `skipped` | boolean | yes | True when the text was already in the target language and was returned unchanged. |
| `text` | string | yes | The text translated into the target language. |
| `to` | string | yes | The language it was translated into. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_argument` | from and to are language tags such as en, pt-BR or zh-Hant. | Not recoverable by retrying. |
| `missing_param` | text and to are required. | Not recoverable by retrying. |
| `network_unavailable` | The translation endpoint could not be reached. |  |
| `service_failed` | The translation endpoint didn't answer with a translation. |  |
| `too_long` | That text is longer than 5000 characters; translate it in parts. | Not recoverable by retrying. |
| `unavailable` | The device can't translate this pair, and no translation endpoint is configured. The error data carries a `reason`: pack-not-installed (iOS, downloadable but not installed and prompt was false or declined), pair-unsupported or source-unknown. | Not recoverable by retrying. |

**Example: translates on device**

```js
const result = await dsx.module.translate.translate({"from":"en","text":"Hello","to":"de"});
// resolves {"engine":"device","from":"en","skipped":false,"text":"Hallo","to":"de"}
```

**Example: skips a text already in the target language**

```js
const result = await dsx.module.translate.translate({"from":"fr","text":"Bonjour","to":"fr"});
// resolves {"engine":"none","from":"fr","skipped":true,"text":"Bonjour","to":"fr"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `endpoint` | string | `` | The origin of your own translation service (LibreTranslate-compatible: POST /translate). Used when the device cannot translate on its own. Empty means on-device only. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
