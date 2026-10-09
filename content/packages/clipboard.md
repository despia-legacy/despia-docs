---
title: Clipboard
description: Read from and write to the system clipboard, with a way to peek without triggering the paste alert.
package: clipboard
---

Read from and write to the system clipboard, with a way to peek without triggering the paste alert.

Gives you one call to read text, links, rich text, images and files from the clipboard, one to write them with options such as expiry and sensitive content, and one to check what is there without reading it. A change notification tells you when the clipboard changes. You write the buttons and screens that use it.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it for copy buttons, paste buttons and share-to-clipboard features. For plain copy of a short string on a web page the browser clipboard may be enough, but this also handles images and expiry.

## What native adds

Checking what is on the clipboard first avoids the system paste alert on iOS and Android, which web pages cannot do.

## Install

```sh
despia add Core/Clipboard
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

### inspect

`dsx.module.clipboard.inspect`

Checks what kinds of content are on the clipboard without reading it, so no paste alert appears.

**When to use it.** Use it to decide whether to show a paste suggestion. It never gives you the content itself.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `patterns` | array of string | no | Content types to look for without reading, such as webURL, phoneNumber or emailAddress. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `changeCount` | number | no | A number that goes up each time the clipboard changes, on iOS only. |
| `hasFiles` | boolean | yes | True when the clipboard holds files. |
| `hasHTML` | boolean | yes | True when the clipboard holds rich text. |
| `hasImage` | boolean | yes | True when the clipboard holds an image. |
| `hasText` | boolean | yes | True when the clipboard holds text. |
| `hasURL` | boolean | yes | True when the clipboard holds a link. |
| `patterns` | object | no | For each pattern you asked about, whether the clipboard matches it. |
| `pendingPatterns` | array of string | no | Patterns Android has not finished classifying yet; ask again shortly. |
| `unsupportedPatterns` | array of string | no | Patterns this device cannot detect. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_param` | patterns takes canonical detection words. | Not recoverable by retrying. |
| `permission_denied` | The browser will not report clipboard contents without a clipboard-read grant. |  |
| `unsupported_platform` | This context has no clipboard API. | Not recoverable by retrying. |

**Example: reports availability flags**

```js
const result = await dsx.module.clipboard.inspect({});
// resolves {"hasFiles":false,"hasHTML":false,"hasImage":false,"hasText":true,"hasURL":false}
```

### read

`dsx.module.clipboard.read`

Reads the current clipboard as text, a link, rich text, an image or files.

**When to use it.** Use inspect first if you only need to know what is there, because reading other apps' content shows a paste alert on iOS and a toast on Android.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `type` | string | no | What to read: text (the default), url, html, image or files. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `files` | array of string | no | Temporary file paths of the files on the clipboard. |
| `html` | string | no | The rich text as HTML, when type is html. |
| `image` | string | no | A temporary file path to the image, or null when there is none. |
| `text` | string | no | The clipboard text, when type is text. |
| `url` | string | no | The link on the clipboard, or null when the clip is not a whole web address. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `denied` | The browser did not allow this page to read the clipboard. |  |
| `invalid_param` | type takes text, url, html, image or files. | Not recoverable by retrying. |
| `unavailable` | Core/Files did not take the clipboard content. |  |
| `unsupported_platform` | This platform's clipboard cannot carry that type. | Not recoverable by retrying. |

**Example: reads clipboard text**

```js
const result = await dsx.module.clipboard.read({});
// resolves {"text":"Hello clipboard"}
```

**Example: reads an image as a Files path**

```js
const result = await dsx.module.clipboard.read({"type":"image"});
// resolves {"image":"temp:clipboard/1/image.png"}
```

### write

`dsx.module.clipboard.write`

Puts text, a link, rich text, an image or files on the clipboard, with optional expiry and privacy settings.

**When to use it.** Use it for copy buttons. Mark passwords and codes as sensitive and give them an expiry.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `expiresIn` | number | no | Seconds after which the clipboard is cleared, if it still holds this copy. |
| `files` | array of string | no | File paths to copy. Works on iOS only today. |
| `html` | string | no | Rich text to copy, as HTML. |
| `image` | string | no | A file path to a PNG image to copy. |
| `localOnly` | boolean | no | On iOS, keeps the copy off Universal Clipboard so it does not reach the person's other devices. |
| `sensitive` | boolean | no | On Android 13 and later, hides the copy in the clipboard preview. |
| `text` | string | no | The plain text to put on the clipboard. |
| `url` | string | no | A web address to copy. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `expiry` | string | no | Who clears the copy: system, app, or unsupported when expiry could not be set. |
| `ignored` | array of string | no | Options this device could not apply, listed by name. |
| `ok` | boolean | yes | True when the clipboard was written. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `denied` | The browser did not allow this page to write to the clipboard. |  |
| `invalid_param` | write takes text, url, html, image or files, and expiresIn/localOnly/sensitive options. | Not recoverable by retrying. |
| `missing_param` | A text value is required. | Not recoverable by retrying. |
| `unsupported_platform` | This platform's clipboard cannot carry that item. | Not recoverable by retrying. |

**Example: writes text to the clipboard**

```js
const result = await dsx.module.clipboard.write({"text":"Copied value"});
// resolves {"ok":true}
```

## Events

Read with `dsx.on(name, handler)`.

### change

The system clipboard changed. It starts after the first inspect call.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `changeCount` | number | no | On iOS, the new change counter; other platforms send nothing. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
