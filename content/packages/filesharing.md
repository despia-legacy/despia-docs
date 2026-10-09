---
title: FileSharing
description: Send a file to other apps through the system share sheet.
package: filesharing
---

Send a file to other apps through the system share sheet.

Opens the share sheet with a file attached, so the user can send it to Messages, Mail, AirDrop, Drive, Files or any app that accepts shared files. You can share a file that is already on the device, or give an https address and the package downloads it first. Links that the server marks as attachments are shared automatically. You write the button or link that asks for the share.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when the user should send, save or open a file in another app, such as a report, a ticket or an exported image. If you only want to show a link or a short text, a normal web share is enough.

## What native adds

The native share sheet attaches the real file and offers every app and service on the device, which a browser cannot do reliably.

## Install

```sh
despia add Core/FileSharing
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

### share

`dsx.module.filesharing.share`

Opens the system share sheet with a file, taken from a device path or downloaded first from an https address.

**When to use it.** Use it for a file the user asked to send or save.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `filename` | string | no | The name to give the shared file; if left out, the name from the path or address is used. |
| `path` | string | no | A path to a file already on the device, such as cache: or documents:; give this or url. |
| `url` | string | no | An https address of the file to download and share; give this or path, not both. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancelled` | boolean | no | True only when the user closed the share sheet without choosing. |
| `delivery` | string | yes | How the file reached the user: share_sheet, or download in a browser that cannot share files. |
| `path` | string | no | The device path that was shared; it is only returned when you passed a path. |
| `shared` | boolean | yes | True when the user picked a destination, false when they closed the sheet. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `download_failed` | Could not download the file. Check the connection and try again. |  |
| `download_too_large` | The file exceeds the 64 MB native download limit. | Not recoverable by retrying. |
| `invalid_url` | Only valid HTTPS download URLs are allowed. | Not recoverable by retrying. |
| `missing_param` | Pass the file as `path` (a Core/Files path) or `url`. | Not recoverable by retrying. |
| `no_presenter` | Could not find a screen to share from. | Not recoverable by retrying. |
| `not_found` | There is no file at that path. | Not recoverable by retrying. |
| `share_failed` | The share could not be completed. |  |
| `unsupported_platform` | This browser cannot hand a file to the user. | Not recoverable by retrying. |
| `write_failed` | Could not save the file. | Not recoverable by retrying. |

**Example: shares a downloaded file through the system sheet**

```js
const result = await dsx.module.filesharing.share({"url":"https://files.example.com/report.pdf"});
// resolves {"delivery":"share_sheet","shared":true}
```

**Example: shares a Core/Files path where it lies and echoes the path**

```js
const result = await dsx.module.filesharing.share({"path":"inbox:6f1c/0/report.pdf"});
// resolves {"delivery":"share_sheet","path":"inbox:6f1c/0/report.pdf","shared":true}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `extensions` | list | `["pdf","mp3","mp4","wav","epub","pkpass","pptx","ppt","doc","docx","xlsx","ics"]` | File types the app exposes for sharing. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
