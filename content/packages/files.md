---
title: Files
description: Save, read, download, upload and zip files in your app's own storage.
package: files
---

Save, read, download, upload and zip files in your app's own storage.

Write a file and get a path back, list folders, copy, move, hash, zip and unzip. Large downloads and uploads keep going while the app is in the background. Use it for documents, media and cached data. An App Group ID is optional, only if you share files with extensions on iOS.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when your app needs to save, read, download or share its own files, such as exports, cached media or unpacked bundles. For small settings or records, use app data instead of files.

## What native adds

Large downloads and uploads can continue in the background, writes are safe against crashes, and the person can grant lasting access to their own folders.

## Install

```sh
despia add Core/Files
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

### copy

`dsx.module.files.copy`

Copies a file or folder to a new path and keeps the original. A folder is copied with everything inside it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `from` | string | yes | The path of the file or folder to copy. |
| `overwrite` | boolean | no | Set true to replace an existing item at the destination. |
| `to` | string | yes | The path where the copy should be created. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `path` | string | yes | The path of the new copy. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `exists` | Something already exists at the destination. Pass overwrite to replace it. |  |
| `grant_revoked` | That access: grant is gone: the person withdrew it, or the file or folder was moved or deleted. Ask again with files.open. |  |
| `no_space` | There is not enough free space at the destination. |  |
| `not_found` | There is nothing at the source path. | Not recoverable by retrying. |
| `permission_denied` | That location cannot be written to. | Not recoverable by retrying. |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: copies a file and leaves the source in place**

```js
const result = await dsx.module.files.copy({"from":"documents:src.txt","to":"documents:copy.txt"});
// resolves {"path":"documents:copy.txt"}
```

**Example: copies a directory recursively**

```js
const result = await dsx.module.files.copy({"from":"documents:tree","to":"cache:tree"});
// resolves {"path":"cache:tree"}
```

### delete

`dsx.module.files.delete`

Deletes a file, or a folder when recursive is set. A missing path fails with not_found rather than pretending to succeed.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `path` | string | yes | The root-relative path to delete. |
| `recursive` | boolean | no | Set true to delete a folder that has things inside it. Without it a non-empty folder is refused. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `deleted` | number | yes | How many files and folders were removed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `grant_revoked` | That access: grant is gone: the person withdrew it, or the file or folder was moved or deleted. Ask again with files.open. |  |
| `is_directory` | That path is a directory. Pass recursive to remove it and its contents. | Not recoverable by retrying. |
| `not_found` | There is nothing at that path to delete. | Not recoverable by retrying. |
| `permission_denied` | That location cannot be deleted from. | Not recoverable by retrying. |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: deletes one file**

```js
const result = await dsx.module.files.delete({"path":"documents:log.txt"});
// resolves {"deleted":1}
```

**Example: deletes a tree and reports the count**

```js
const result = await dsx.module.files.delete({"path":"documents:tree","recursive":true});
// resolves {"deleted":3}
```

### download

`dsx.module.files.download`

Downloads a URL straight to a file on disk and reports progress as it goes. With background transfers enabled it keeps going while the app is in the background.

**When to use it.** Use it for large files such as media or updates, where the bytes should go straight to disk.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `background` | boolean | no | Set true to keep the transfer running while the app is in the background. |
| `headers` | object | no | Extra request headers to send, such as an Authorization header. |
| `resume` | boolean | no | Set true to continue a partly downloaded file instead of starting again. |
| `sha256` | string | no | The expected SHA-256 of the finished file. The download fails with hash_mismatch if it differs. |
| `to` | string | yes | The root-relative path to save the file to. |
| `url` | string | yes | The address to download from. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | number | yes | How many bytes were downloaded. |
| `headers` | object | no | The response headers sent back by the server. |
| `path` | string | yes | Where the file was saved. |
| `status` | number | yes | The HTTP status code of the response. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `hash_mismatch` | The downloaded file did not match the expected checksum. |  |
| `http_error` | The server refused that download. |  |
| `network_failed` | The download could not be completed. |  |
| `no_space` | There is not enough free space for that download. |  |
| `permission_denied` | That location cannot be written to. | Not recoverable by retrying. |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: streams monotonic progress and settles once**

```js
const result = await dsx.module.files.download({"to":"documents:media/video.mp4","url":"https://cdn.example.com/video.mp4"});
// resolves {"bytes":104857600,"path":"documents:media/video.mp4","status":200}
```

**Example: resumes an interrupted transfer instead of restarting it**

```js
const result = await dsx.module.files.download({"resume":true,"to":"documents:media/video.mp4","url":"https://cdn.example.com/video.mp4"});
// resolves {"bytes":104857600,"path":"documents:media/video.mp4","status":206}
```

### exclude

`dsx.module.files.exclude`

Marks a file or folder as excluded from, or included in, the device backup. Use it on large caches you keep in documents: so iOS does not count them against iCloud.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `fromBackup` | boolean | no | True to exclude the item from backup, false to include it again. |
| `path` | string | yes | The root-relative path to mark. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `path` | string | yes | The path that was marked. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_found` | There is nothing at that path to exclude. | Not recoverable by retrying. |
| `permission_denied` | The system refused to change that file's backup flag. | Not recoverable by retrying. |
| `unsupported_platform` | This runtime has no device-backup plane. | Not recoverable by retrying. |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: excludes a cached download from device backup**

```js
const result = await dsx.module.files.exclude({"fromBackup":true,"path":"documents:media/video.mp4"});
// resolves {"path":"documents:media/video.mp4"}
```

### free

`dsx.module.files.free`

Reports the free and total space on the storage that backs a root, so you can refuse a large download before it starts.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `root` | string | no | Which root to measure, for example documents:. Defaults to documents:. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `free` | number | yes | The number of bytes still available to the app. |
| `total` | number | yes | The total capacity of the volume in bytes. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_root` | That is not a root this app can address. | Not recoverable by retrying. |

**Example: reports the volume backing documents by default**

```js
const result = await dsx.module.files.free({});
// resolves {"free":8589934592,"total":68719476736}
```

**Example: reports the volume backing a named root**

```js
const result = await dsx.module.files.free({"root":"cache"});
// resolves {"free":8589934592,"total":68719476736}
```

### grants

`dsx.module.files.grants`

Lists the folders and files the person has given the app lasting access to, oldest first. Grants that were withdrawn or whose item is gone are left out.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `grants` | array of object | yes | The current grants, each with grant, name, kind and writable. |

**Example: List the folders the person gave lasting access to**

```js
const result = await dsx.module.files.grants({});
// resolves {"grants":[{"grant":"g_1","kind":"directory","name":"Projects","writable":true}]}
```

### hash

`dsx.module.files.hash`

Computes a checksum of a file without loading it into memory. SHA-256 is the default.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `algorithm` | string | no | The algorithm: sha256 (the default) or md5, for services that still require it. |
| `path` | string | yes | The root-relative path of the file to hash. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `hash` | string | yes | The checksum as a lowercase hex string. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `grant_revoked` | That access: grant is gone: the person withdrew it, or the file or folder was moved or deleted. Ask again with files.open. |  |
| `is_directory` | The path is a folder, and only files can be hashed. | Hash a file inside the folder instead. |
| `not_found` | There is no file at that path. | Not recoverable by retrying. |
| `permission_denied` | The system refused access to that file. | Not recoverable by retrying. |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: hashes with sha256 by default**

```js
const result = await dsx.module.files.hash({"path":"documents:abc.txt"});
// resolves {"hash":"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"}
```

**Example: hashes with md5 when an upstream demands it**

```js
const result = await dsx.module.files.hash({"algorithm":"md5","path":"documents:abc.txt"});
// resolves {"hash":"900150983cd24fb0d6963f7d28e17f72"}
```

### info

`dsx.module.files.info`

Reports whether a file or folder exists and, if it does, its size, dates and type. A missing path is reported as exists false instead of failing.

**When to use it.** Use it to check that a file is there before reading it, or to show its size.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `path` | string | yes | The root-relative path to look at, for example documents:report.pdf. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `created` | number | no | Creation time as a Unix timestamp in milliseconds, when known. |
| `exists` | boolean | yes | True when something is at the path. |
| `isDirectory` | boolean | yes | True when the path is a folder. |
| `mimeType` | string | no | The guessed content type of the file, such as image/png. |
| `modified` | number | no | Last modified time as a Unix timestamp in milliseconds, when known. |
| `size` | number | no | Size in bytes, present only for an existing file. |
| `uri` | string | no | A platform address for the file, when the platform has one. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `grant_revoked` | That access: grant is gone: the person withdrew it, or the file or folder was moved or deleted. Ask again with files.open. |  |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: describes an existing file**

```js
const result = await dsx.module.files.info({"path":"documents:notes/today.txt"});
// resolves {"created":1755648000000,"exists":true,"isDirectory":false,"mimeType":"text/plain","modified":1755648000000,"size":12,"uri":"file:///documents/notes/today.txt"}
```

**Example: reports a missing path rather than failing**

```js
const result = await dsx.module.files.info({"path":"documents:nothing.bin"});
// resolves {"exists":false,"isDirectory":false}
```

### list

`dsx.module.files.list`

Lists the files and folders inside a folder. Each entry has a path you can pass straight to read, copy or delete.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `glob` | string | no | A pattern to filter by, such as **/*.png. * matches within a name, ? one character and ** any number of folders. |
| `path` | string | yes | The root-relative folder whose contents you want. |
| `recursive` | boolean | no | Set true to walk into sub-folders. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `entries` | array of object | yes | The items found, each with name, path, isDirectory, size and modified. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `grant_revoked` | That access: grant is gone: the person withdrew it, or the file or folder was moved or deleted. Ask again with files.open. |  |
| `not_directory` | That path is a file, not a directory. | Not recoverable by retrying. |
| `not_found` | There is no directory at that path. | Not recoverable by retrying. |
| `permission_denied` | The system refused access to that directory. | Not recoverable by retrying. |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: lists a directory one level deep**

```js
const result = await dsx.module.files.list({"path":"documents:media"});
// resolves {"entries":[{"isDirectory":false,"modified":1755648000000,"name":"one.png","path":"documents:media/one.png","size":1},{"isDirectory":true,"modified":1755648000000,"name":"sub","path":"documents:media/sub","size":0}]}
```

**Example: filters a recursive walk with a glob**

```js
const result = await dsx.module.files.list({"glob":"**/*.png","path":"documents:media","recursive":true});
// resolves {"entries":[{"isDirectory":false,"modified":1755648000000,"name":"one.png","path":"documents:media/one.png","size":1},{"isDirectory":false,"modified":1755648000000,"name":"three.png","path":"documents:media/sub/three.png","size":1}]}
```

### mkdir

`dsx.module.files.mkdir`

Creates a folder. With recursive set, missing parents are created and an existing folder is not an error.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `path` | string | yes | The root-relative path of the folder to create. |
| `recursive` | boolean | no | Create missing parent folders too, and succeed if the folder already exists. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `path` | string | yes | The path of the folder that now exists. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `exists` | A file already exists at that path. | Not recoverable by retrying. |
| `grant_revoked` | That access: grant is gone: the person withdrew it, or the file or folder was moved or deleted. Ask again with files.open. |  |
| `not_directory` | A folder in that path is a file. | Not recoverable by retrying. |
| `not_found` | A folder in that path does not exist. Pass recursive to create it. |  |
| `permission_denied` | That location cannot be written to. | Not recoverable by retrying. |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: creates a directory tree**

```js
const result = await dsx.module.files.mkdir({"path":"documents:x/y/z","recursive":true});
// resolves {"path":"documents:x/y/z"}
```

**Example: creating one that already exists is idempotent**

```js
const result = await dsx.module.files.mkdir({"path":"documents:x/y/z","recursive":true});
// resolves {"path":"documents:x/y/z"}
```

### move

`dsx.module.files.move`

Moves or renames a file or folder, including between roots. It refuses to overwrite an existing destination unless you ask, and a failed move leaves the source in place.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `from` | string | yes | The path of the item to move or rename. |
| `overwrite` | boolean | no | Set true to replace an existing item at the destination. |
| `to` | string | yes | The path the item should end up at. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `path` | string | yes | The path the item now lives at. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `exists` | Something already exists at the destination. Pass overwrite to replace it. |  |
| `grant_revoked` | That access: grant is gone: the person withdrew it, or the file or folder was moved or deleted. Ask again with files.open. |  |
| `no_space` | There is not enough free space at the destination. |  |
| `not_found` | There is nothing at the source path. | Not recoverable by retrying. |
| `permission_denied` | That location cannot be written to. | Not recoverable by retrying. |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: moves a staged file into place across roots**

```js
const result = await dsx.module.files.move({"from":"temp:staged.bin","to":"documents:kept.bin"});
// resolves {"path":"documents:kept.bin"}
```

**Example: overwrite replaces the destination**

```js
const result = await dsx.module.files.move({"from":"documents:src.txt","overwrite":true,"to":"documents:dst.txt"});
// resolves {"path":"documents:dst.txt"}
```

### open

`dsx.module.files.open`

Shows the system file picker. Chosen files are copied into the inbox by default, or kept as a lasting grant that still works after a relaunch.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `access` | string | no | copy (the default) copies each file into the inbox. persistent keeps a grant that survives relaunches. |
| `directory` | boolean | no | Pick a folder instead of files. A folder is always granted, never copied. |
| `multiple` | boolean | no | Allow choosing more than one item. |
| `types` | array of string | no | File types to allow, as content types or extensions. |
| `write` | boolean | no | With persistent access, ask for write access as well as read. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancelled` | boolean | yes | True when the person closed the picker without choosing. |
| `items` | array of string | yes | The chosen items, each with path, name, type and size. |
| `persistent` | boolean | yes | True when the choice is kept as a lasting grant. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | The file picker could not open. | Not recoverable by retrying. |
| `unsupported_platform` | This platform cannot pick a folder. | Not recoverable by retrying. |

**Example: Pick one image and copy it into the inbox**

```js
const result = await dsx.module.files.open({"multiple":false,"types":["image/*"]});
// resolves {"cancelled":false,"items":[{"name":"photo.jpg","path":"inbox:photo.jpg","size":248113,"type":"image/jpeg"}],"persistent":false}
```

### read

`dsx.module.files.read`

Reads a file, or one piece of it, and returns its contents as text or base64. Use offset and length for large files so the whole file never crosses the bridge at once.

**When not to.** Do not read a large file whole; read it in pieces, or use copy, move or upload which never load the bytes.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `encoding` | string | no | How to return the bytes: utf8 (the default), base64 or bytes. |
| `length` | number | no | How many bytes to read. Defaults to the rest of the file. |
| `offset` | number | no | Byte position to start reading from. Defaults to the start of the file. |
| `path` | string | yes | The root-relative path of the file to read. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | number | yes | How many bytes were read. |
| `data` | string | yes | The file contents in the requested encoding. Empty when the offset is past the end of the file. |
| `encoding` | string | yes | The encoding used for the data field, matching what you asked for. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `grant_revoked` | That access: grant is gone: the person withdrew it, or the file or folder was moved or deleted. Ask again with files.open. |  |
| `is_directory` | That path is a directory. Use list to read its contents. | Not recoverable by retrying. |
| `not_found` | There is no file at that path. | Not recoverable by retrying. |
| `permission_denied` | The system refused access to that file. | Not recoverable by retrying. |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: reads a small text file whole**

```js
const result = await dsx.module.files.read({"path":"documents:notes/hello.txt"});
// resolves {"bytes":5,"data":"hello","encoding":"utf8"}
```

**Example: reads a seam so a large file is never materialised**

```js
const result = await dsx.module.files.read({"length":4,"offset":3,"path":"documents:big.txt"});
// resolves {"bytes":4,"data":"defg","encoding":"utf8"}
```

### revoke

`dsx.module.files.revoke`

Ends a lasting access grant. Paths that used it then fail with grant_revoked.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `grant` | string | yes | The grant identifier from grants or open. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `revoked` | boolean | yes | True when the grant existed and was ended. |

**Example: an unknown grant revokes nothing**

```js
const result = await dsx.module.files.revoke({"grant":"0123456789abcdef"});
// resolves {"revoked":false}
```

### revokeUrl

`dsx.module.files.revokeUrl`

Ends a temporary file address before it expires.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `url` | string | yes | The address returned by url. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `revoked` | boolean | yes | True when the address was active and is now ended, false when it was unknown or already over. |

**Example: an unknown URL revokes nothing**

```js
const result = await dsx.module.files.revokeUrl({"url":"dsxfile://f/00"});
// resolves {"revoked":false}
```

### save

`dsx.module.files.save`

Shows the system save dialog and writes a copy of a file where the person chooses.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `from` | string | yes | The path of the file to save a copy of. |
| `name` | string | no | The file name suggested in the save dialog. |
| `types` | array of string | no | The file types the dialog should offer to save as. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancelled` | boolean | no | True when the person cancelled the dialog. |
| `path` | string | no | Where the copy was saved, when the platform can say. |
| `saved` | boolean | yes | True when the copy was saved. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `grant_revoked` | That access: grant is gone: the person withdrew it, or the file or folder was moved or deleted. Ask again with files.open. |  |
| `not_found` | There is no file at that path to save. | Not recoverable by retrying. |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: Save a copy of a file where the person chooses**

```js
const result = await dsx.module.files.save({"from":"documents:report.pdf","name":"Report.pdf"});
// resolves {"cancelled":false,"saved":true}
```

### unwatch

`dsx.module.files.unwatch`

Stops watching a path, or every watch when no path is given.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `path` | string | no | The path to stop watching. Leave empty to stop all watches. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `stopped` | number | yes | How many watches were ended. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: ending no stream reports zero**

```js
const result = await dsx.module.files.unwatch({});
// resolves {"stopped":0}
```

### unzip

`dsx.module.files.unzip`

Expands a zip archive into a folder. Entries that try to escape the destination folder make the whole call fail, so a hostile archive cannot write elsewhere.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `from` | string | yes | The zip file to expand. |
| `password` | string | no | The password, if the archive has one. |
| `to` | string | yes | The folder to expand into. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `entries` | number | yes | How many entries were extracted. |
| `path` | string | yes | The folder the archive was expanded into. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_space` | There is not enough free space to expand that archive. |  |
| `not_directory` | The destination is a file, not a directory. | Not recoverable by retrying. |
| `not_found` | There is no archive at that path. | Not recoverable by retrying. |
| `permission_denied` | That location cannot be written to. | Not recoverable by retrying. |
| `unsupported_platform` | This runtime has no archive plane. | Not recoverable by retrying. |
| `unsupported_root` | An entry in that archive points outside the destination. | Not recoverable by retrying. |

**Example: expands an archive and reports the entry count**

```js
const result = await dsx.module.files.unzip({"from":"documents:tree.zip","to":"documents:expanded"});
// resolves {"entries":3,"path":"documents:expanded"}
```

### upload

`dsx.module.files.upload`

Uploads a file from disk to a URL and reports progress as it goes. It sends a multipart form by default, or the raw file when the method is PUT.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `background` | boolean | no | Set true to keep the transfer running while the app is in the background. |
| `field` | string | no | The name of the form part that carries the file. |
| `fields` | object | no | Extra text fields to include in the form. |
| `headers` | object | no | Extra request headers to send. |
| `method` | string | no | The HTTP method: POST (the default) or PUT. PUT sends the file as the raw body. |
| `path` | string | yes | The root-relative path of the file to send. |
| `url` | string | yes | The address to upload to. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `body` | string | yes | The response body as text. |
| `status` | number | yes | The HTTP status code of the response. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `http_error` | The server refused that upload. |  |
| `network_failed` | The upload could not be completed. |  |
| `not_found` | There is no file at that path to upload. | Not recoverable by retrying. |
| `permission_denied` | The system refused access to that file. | Not recoverable by retrying. |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: streams monotonic progress and settles with the response**

```js
const result = await dsx.module.files.upload({"field":"file","method":"POST","path":"documents:media/clip.mp4","url":"https://api.example.com/v1/media"});
// resolves {"body":"{\"id\":\"m_1\"}","status":201}
```

### url

`dsx.module.files.url`

Creates a temporary address for one file so a page can display or fetch it without the bytes crossing the bridge. The address expires and can be revoked.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `expiresIn` | number | no | How long the address stays valid, in seconds. |
| `path` | string | yes | The root-relative path of the file to expose. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `display` | boolean | yes | True when the address can be shown in an image, video or similar element. |
| `expires` | number | yes | When the address stops working, as a Unix timestamp in milliseconds. |
| `fetch` | boolean | yes | True when the address can also be read with fetch. |
| `name` | string | yes | The file name, useful as a download or display label. |
| `size` | number | yes | How large the file is in bytes, handy for showing a download size. |
| `type` | string | yes | The content type of the file. |
| `url` | string | yes | The temporary address to use in an image, video or fetch. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `grant_revoked` | That access: grant is gone: the person withdrew it, or the file or folder was moved or deleted. Ask again with files.open. |  |
| `is_directory` | The path points at a folder, which this call cannot handle. | Pass the path of a file inside the folder instead. |
| `not_found` | There is no file at that path. | Not recoverable by retrying. |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: Get a temporary address to show a file**

```js
const result = await dsx.module.files.url({"expiresIn":300,"path":"documents:photos/cat.jpg"});
// resolves {"display":true,"expires":1760000300000,"fetch":true,"name":"cat.jpg","size":248113,"type":"image/jpeg","url":"https://app.example.com/files/9f2c/cat.jpg"}
```

### watch

`dsx.module.files.watch`

Starts a stream of changes under a file or folder until you stop it. Each change arrives as a changed, removed or renamed event.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `path` | string | yes | The file or folder to watch. |
| `recursive` | boolean | no | Set true to include sub-folders. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `grant_revoked` | That access: grant is gone: the person withdrew it, or the file or folder was moved or deleted. Ask again with files.open. |  |
| `not_found` | There is nothing at that path to watch. | Not recoverable by retrying. |
| `permission_denied` | That path cannot be watched. | Not recoverable by retrying. |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: Watch a folder and its sub-folders for changes**

```js
const result = await dsx.module.files.watch({"path":"documents:notes","recursive":true});
```

### write

`dsx.module.files.write`

Writes text or base64 data to a file, creating missing folders. It replaces the file by default and replaces it safely, so a reader never sees half a file. Pass append to add to the end instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `append` | boolean | no | When true the data is added to the end of the file instead of replacing it. |
| `data` | string | yes | The contents to write, as text or base64 according to encoding. |
| `encoding` | string | no | How data is encoded: utf8 (the default) or base64. |
| `path` | string | yes | The root-relative path to write. Missing parent folders are created. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | number | yes | How many bytes were written. |
| `path` | string | yes | The path that was written. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `grant_revoked` | That access: grant is gone: the person withdrew it, or the file or folder was moved or deleted. Ask again with files.open. |  |
| `is_directory` | The path points at a folder, which this call cannot handle. | Pass the path of a file inside the folder instead. |
| `no_space` | There is not enough free space to write that file. |  |
| `not_directory` | A folder in that path is a file. | Not recoverable by retrying. |
| `permission_denied` | That location cannot be written to. | Not recoverable by retrying. |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: writes utf8 and reports the byte count**

```js
const result = await dsx.module.files.write({"data":"hello","path":"documents:notes/hello.txt"});
// resolves {"bytes":5,"path":"documents:notes/hello.txt"}
```

**Example: creates the missing parent directories**

```js
const result = await dsx.module.files.write({"data":"x","path":"documents:a/b/c/deep.txt"});
// resolves {"bytes":1,"path":"documents:a/b/c/deep.txt"}
```

### zip

`dsx.module.files.zip`

Packs a file or folder into a zip archive, optionally with a password. It is not available on the web.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `from` | string | yes | The file or folder to archive. |
| `password` | string | no | Optional password to protect the archive. |
| `to` | string | yes | The path of the zip file to create. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `entries` | number | yes | How many files went into the archive. |
| `path` | string | yes | The path of the zip file. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `exists` | Something already exists at the destination. |  |
| `no_space` | There is not enough free space for that archive. |  |
| `not_found` | There is nothing at the source path to archive. | Not recoverable by retrying. |
| `permission_denied` | That location cannot be written to. | Not recoverable by retrying. |
| `unsupported_platform` | This runtime has no archive plane. | Not recoverable by retrying. |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: archives a directory and reports what went in**

```js
const result = await dsx.module.files.zip({"from":"documents:tree","to":"documents:tree.zip"});
// resolves {"entries":3,"path":"documents:tree.zip"}
```

## Events

Read with `dsx.on(name, handler)`.

### changed

Reports that a watched file was created or rewritten.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `path` | string | yes | The root-relative path of the changed file. |

### progress

Reports how many bytes a running download or upload has moved so far.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `fraction` | number | yes | Progress from 0 to 1, or 0 when the size is unknown. |
| `received` | number | no | Bytes received so far, for a download. |
| `sent` | number | no | Bytes sent so far, for an upload. |
| `total` | number | yes | Total bytes expected, or 0 when the size is unknown. |

### removed

Reports that a watched file or folder was deleted.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `path` | string | yes | The path that was removed. |

### renamed

Reports that an item inside a watched folder was moved or renamed.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `from` | string | yes | The old root-relative path of the item. |
| `path` | string | yes | The new root-relative path of the item. |

### transfer

Reports that a background download or upload finished, including one that finished after the app was relaunched with no call waiting.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `error` | string | no | The error code when the transfer failed. |
| `fraction` | number | yes | How much was done, from 0 to 1. |
| `id` | string | yes | The identifier of the transfer. |
| `kind` | string | yes | Whether it was a download or an upload. |
| `path` | string | yes | The root-relative path of the file transferred. |
| `result` | object | no | What the download or upload would have resolved, when it succeeded. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `background_transfers` | boolean | `false` | Opt into downloads and uploads that continue while the app is in the background. On Android, enable this before exporting the app. |
| `max_inline_bytes` | number | `8388608` | The largest file read or write that may cross the bus in one piece, in bytes. Larger files must be read or written with offset and length. |
| `shared_group` | string | `` | The App Group identifier backing the shared: root on iOS (for example group.com.example.app). Leave empty if the app has no extensions to share files with. |

## Related packages

- Used by: [ChatDespia](/packages/chatdespia), [ChatSendbird](/packages/chatsendbird), [ChatStream](/packages/chatstream), [Backend](/packages/files-modules-backend), [ContentServer](/packages/cdn)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
