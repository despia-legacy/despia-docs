---
title: See
description: Describe and understand images with an AI model that runs on the device.
package: see
---

Describe and understand images with an AI model that runs on the device.

Looks at an image and writes a description or answers a question about it, using a vision model that runs on the phone or in the browser, so the picture does not leave the device. The text streams in as it is written. You supply the image as a link or file handle and install a vision-capable model.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Add it when your app should understand pictures privately, such as describing a photo or answering a question about a receipt. Do not use it to read text for exact copying; the text recognition in the Vision package is better for that.

## What native adds

Runs the model on the device with native speed and keeps the image private; the web version relies on the browser's built-in model.

## Install

```sh
despia add Core/LocalAI/Modules/See
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

### describe

`dsx.module.see.describe`

Describes an image, or answers a question about it, with an on-device vision model, streaming the text as it is written.

**When to use it.** Call it when the person picks or takes a photo and you want to say what is in it.

**When not to.** For reading printed text exactly, use text recognition instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | Your own id for this description, to match its streamed events; one is made if you leave it out. |
| `image` | string | yes | The image as a link or file handle; inline data is refused. |
| `model` | string | no | The vision model to use; by default an installed vision model is picked. |
| `options` | object | no | Extra generation settings for the model. |
| `prompt` | string | no | What to ask about the image, for example what is on this receipt. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `model` | string | yes | The model that wrote the description. |
| `snapshot` | array of object | yes | The finished description as a list of text parts. |
| `text` | string | yes | The full description once it is finished. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `describe_failed` | The image could not be described, for example because it was inline data, the stream timed out or the engine is missing. | Pass the image as a link or file handle, not inline data, and try again. |
| `no_vision_model` | No installed model can look at images. | Offer to download a vision model, then call again. |
| `unavailable` | The browser's built-in model would not open a session right now, because it needs a tap or click first. | Call describe directly from a tap handler. |

**Example: describes an image with the installed vision model**

```js
const result = await dsx.module.see.describe({"id":"see_1","image":"content:///photos/1.jpg","model":"qwen2-vl-2b","options":{},"prompt":"what is this?"});
// resolves {"model":"qwen2-vl-2b","snapshot":[{"text":"a falcon","type":"text"}],"text":"a falcon"}
```

## Events

Read with `dsx.on(name, handler)`.

### complete

The description is finished and carries the whole text.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the description that finished. |
| `model` | string | yes | The model that wrote the description. |
| `snapshot` | array of object | yes | The full description as a list of text parts. |

### sync

Lets a listener that joined late catch up; nothing sends it yet.

_None._

### token

A new piece of the description arrived while the model is writing.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `delta` | object | yes | The new piece of text. |
| `delta.text` | string | yes | The text of the new piece. |
| `delta.type` | string | yes | The kind of piece; always text. |
| `id` | string | yes | The id of the description this piece belongs to. |
| `seq` | int | yes | The position of this piece, counting from the first. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
