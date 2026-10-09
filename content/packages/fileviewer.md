---
title: FileViewer
description: Preview PDFs, images and documents in a native viewer.
package: fileviewer
---

Preview PDFs, images and documents in a native viewer.

Opens a file in the phone's own preview screen, which handles PDFs, images, Office documents and more, or draws the same preview inside your layout. It can fetch files from an https address, including links that need the user's sign-in, and can show several files as pages to swipe through. It can also make a small thumbnail image of a file for lists. You write the screen that decides which file to show.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when the user should look at a document, invoice or image without leaving the app. If you only need to send the file to another app, use the file sharing package instead.

## What native adds

The native previewer renders many file types with zoom, paging and sharing built in, which a plain web view does not do well.

## Install

```sh
despia add Core/FileViewer
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

### preview

`dsx.module.fileviewer.preview`

Opens one or more files in a full screen preview, downloading https addresses first.

**When to use it.** Use it for a tap on a document row.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `src` | any | yes | What to show: a files path, an https address, a File or Blob, or a list mixing them, which opens as swipeable pages. |
| `theme` | string | no | Pass dark or light to choose the look of the viewer; it follows the system if left out. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `file` | string | no | The name of the file that was previewed, when it was a single file. |
| `files` | array of string | no | The names of the files that were previewed, when there were several. |
| `status` | string | yes | How the preview ended, such as presented. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `download_failed` | Couldn't download the file. Check the connection and try again. |  |
| `download_too_large` | The file exceeds the 64 MB native download limit. | Not recoverable by retrying. |
| `invalid_src` | No file to preview, `src` is missing, or none of the sources is a Core/Files path or an HTTPS URL that resolved. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find a screen to present the file viewer. | Not recoverable by retrying. |
| `no_previewer` | No installed app can preview this file type. |  |
| `too_many_files` | Too many files in one request, the native file-transfer policy caps a single preview. | Not recoverable by retrying. |
| `write_failed` | Couldn't save the downloaded file for preview. | Not recoverable by retrying. |

**Example: presents a file overlay**

```js
const result = await dsx.module.fileviewer.preview({"src":"https://files.app/invoice.pdf"});
// resolves {"status":"presented"}
```

### thumbnail

`dsx.module.fileviewer.thumbnail`

Makes a small picture of a file and saves it in the cache, so a list can show real previews without opening a viewer.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `height` | number | no | The picture height in pixels; it defaults to the width. |
| `src` | string | yes | The file to draw, as a files path or an https address. |
| `width` | number | no | The picture width in pixels; it defaults to 256 and is kept between 16 and 2048. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `height` | number | yes | The height of the thumbnail in pixels. |
| `path` | string | yes | The cache path of the saved thumbnail picture. |
| `src` | string | yes | The address to give an image element so it can draw the thumbnail. |
| `width` | number | yes | The width of the thumbnail in pixels. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_src` | No file at that path: use a Core/Files path or an HTTPS URL. | Not recoverable by retrying. |
| `no_previewer` | No installed app can preview this file type. |  |
| `write_failed` | Couldn't save the preview image. | Not recoverable by retrying. |

**Example: renders a PDF's first page**

```js
const result = await dsx.module.fileviewer.thumbnail({"src":"documents:invoice.pdf","width":256});
// resolves {"height":256,"path":"cache:despia-fileviewer/thumb-1.jpg","src":"file:///var/mobile/Containers/Data/Application/X/Library/Caches/despia-fileviewer/thumb-1.jpg","width":181}
```

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `download_failed` | Couldn't download the file. Check the connection and try again. |  |
| `download_too_large` | The file exceeds the 64 MB native download limit. |  |
| `invalid_src` | No file to preview, `src` is missing, or none of the sources is a Core/Files path or an HTTPS URL that resolved. |  |
| `no_presenter` | Couldn't find a screen to present the file viewer. |  |
| `no_previewer` | No installed app can preview this file type. |  |
| `too_many_files` | Too many files in one request, the native file-transfer policy caps a single preview. |  |
| `write_failed` | Couldn't save the downloaded file for preview. |  |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
