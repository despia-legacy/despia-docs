---
title: ShareExtension
description: Lets people share text, links, photos and files into your app from the system share sheet.
package: sharetarget
---

Lets people share text, links, photos and files into your app from the system share sheet.

Adds your app to the share sheet on iPhone, Mac and Android and to the Open with list on desktop. Everything shared is saved safely in an inbox until your app takes it, even if the app was closed. You write what the app does with each shared item.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when people should be able to send things to your app from other apps, such as saving a link or uploading a photo. Do not use it if your app only needs to share content out.

## What native adds

Web pages cannot appear in the system share sheet on iOS. A native share extension puts your app next to Messages and Notes and keeps what was shared even when the app is closed.

## Install

```sh
despia add Core/Extensions/ShareExtension
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

### capabilities

`dsx.module.sharetarget.capabilities`

Tells you what this device can receive, such as whether the share sheet is offered, whether Open with works, how many items one share may hold and which types are accepted.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accept` | array of string | yes | The list of file types the app accepts. |
| `maxItems` | number | yes | The most items one share may carry. |
| `multiple` | boolean | yes | True if one share can carry several items. |
| `open` | boolean | yes | True if the app can be offered as a place to open files. |
| `share` | boolean | yes | True if the system share sheet can send items to this app. |

**Example: reports the share sheet capability**

```js
const result = await dsx.module.sharetarget.capabilities({});
// resolves {"accept":["text/plain","text/uri-list","image/*","video/*","application/pdf"],"maxItems":50,"multiple":true,"open":false,"share":true}
```

### release

`dsx.module.sharetarget.release`

Deletes a share from the inbox right away once your app is done with it. Move any file you want to keep to your documents first.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `all` | boolean | no | Set to true to delete every share in the inbox. |
| `id` | string | no | The id of one share, as returned by take. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `released` | number | yes | How many shares were deleted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_id` | Neither a share id nor all was passed, so nothing could be deleted. | Pass the id from a share that take returned, or pass all as true. |

**Example: an unknown share releases nothing**

```js
const result = await dsx.module.sharetarget.release({"id":"0123456789abcdef"});
// resolves {"released":0}
```

### take

`dsx.module.sharetarget.take`

Hands you every share waiting in the inbox, oldest first. Each share lists its items as text, links or files, and files arrive as inbox paths rather than raw data.

**When to use it.** Call it when the app opens or after the received event.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `peek` | boolean | no | Set to true to read the waiting shares without claiming them. |

**Resolves with**

_None._

**Example: nothing pending resolves an empty list**

```js
const result = await dsx.module.sharetarget.take({});
// resolves []
```

## Events

Read with `dsx.on(name, handler)`.

### received

A new share finished arriving in the inbox. It is a hint to call take, and the shared items themselves come from take.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | int | yes | How many items the share holds. |
| `first` | object | yes | The first item of the share, so you can show a preview. |
| `first.id` | string | no | The id of the first item in the share, so you can match it later. |
| `first.kind` | string | no | What the first item is: text, url or file. |
| `first.name` | string | no | The file name of the first item. |
| `first.path` | string | no | The inbox path of the first item, if it is a file. |
| `first.size` | number | no | The size of the first item in bytes, if it is a file. |
| `first.text` | string | no | The text of the first item, if it is text. |
| `first.title` | string | no | The title that came with the first item. |
| `first.type` | string | no | The file type of the first item. |
| `first.url` | string | no | The web address of the first item, if it is a link. |
| `id` | string | yes | The id of the new share. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `accept` | list | `["text/plain","text/uri-list","image/*","video/*","application/pdf"]` | The MIME types this app offers to receive in the system share sheet: a type (application/pdf), a family (image/*) or */* for anything. |
| `inbox_ttl_hours` | number | `72` | Hours a received share stays in the inbox before it is removed, if the app never releases it. |
| `max_item_bytes` | number | `4294967296` | A shared file larger than this is refused (share_item_refused, too_large) and the rest of the share proceeds. |
| `max_items` | number | `50` | How many items one share may carry. Extra items are dropped (share_item_refused, too_many). |
| `open_in` | list | `[]` | The file types this app offers to open (Open in, Share to from Files, a file association). Empty means the app registers no document types. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `share_item_refused` | One shared item was turned away, for example because it was too large, of a type you do not accept, or past the item limit. The rest of the share still goes through. | Check the accepted types and size limits in the package settings if items you expect are being refused. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
