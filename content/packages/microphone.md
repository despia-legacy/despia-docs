---
title: Microphone
description: Let your web page use the microphone, with the permission text and Android grant it needs.
package: microphone
---

Let your web page use the microphone, with the permission text and Android grant it needs.

Adds the microphone usage message on iOS and the record audio permission on Android, so a page that asks for the microphone with the browser audio API is allowed to. It has no actions of its own. You set the wording the person sees when asked.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Include it when your page calls the browser microphone API directly, for example for voice chat or recording in the page. For native recording with a level meter, use the Record package instead.

## Install

```sh
despia add Core/WebPlatform/Microphone
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | no |
| web | no |
| macos | yes |

Device classes: phone, desktop.

## Actions

_This package declares no actions._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `usage_description` | multiline | `Processing your voice and your video input for video recording and video processing` | The message shown when iOS asks the user for microphone access. |

## Related packages

- Used by: [LocalAI](/packages/intelligence)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
