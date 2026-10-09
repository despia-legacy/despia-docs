---
title: ContentServer
description: Keeps the old local content server and file store working for apps converted from the previous Despia version.
package: cdn
---

Keeps the old local content server and file store working for apps converted from the previous Despia version.

Stores files on the device, serves them to your pages through local addresses and keeps the older local CDN calls (write, read, query, delete) working. Add it when a converted app depends on them. New apps should use the Files package instead.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when converting an older Despia app that served pages or media from the local content server. For new work, use the Files package.

## Install

```sh
despia add Core/Legacy/Modules/ContentServer
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

Device classes: phone.

## Actions

### delete

`dsx.module.cdn.delete`

Deletes the files named by the paths a page sent, as the old localcdn delete did.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `index` | string | no | A JSON list of file paths to delete. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `items` | array of object | yes | The files that were removed. |

**Example: answers what was removed**

```js
const result = await dsx.module.cdn.delete({"index":"[\"movie_a\"]"});
// resolves {"items":[]}
```

### list

`dsx.module.cdn.list`

Lists every item stored in a bucket. A bucket nothing was stored in gives an empty list.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bucket` | string | no | The bucket whose items you want to list. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bucket` | string | yes | The bucket that was listed. |
| `items` | array of string | yes | The stored items, each with its name and size. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_bucket` | The bucket name contains a path segment that is not allowed. | Use a plain bucket name, with folders separated by slashes and no dots. |

**Example: lists a bucket's items**

```js
const result = await dsx.module.cdn.list({"bucket":"media"});
// resolves {"bucket":"media","items":[]}
```

### localStorageSync

`dsx.module.cdn.localStorageSync`

Receives a copy of the page's localStorage so it can be restored on the next launch. A bad or empty copy is ignored so a blank page cannot erase saved data.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `action` | string | no | The kind of change the page is reporting. |
| `data` | string | no | The page's localStorage contents as JSON text. |

**Resolves with**

_None._

**Example: persists a localStorage snapshot**

```js
const result = await dsx.module.cdn.localStorageSync({"action":"syncAll","data":"{\"token\":\"abc\"}"});
```

**Example: an empty snapshot is ignored so a blank page cannot wipe the saved store**

```js
const result = await dsx.module.cdn.localStorageSync({"action":"syncAll","data":"{}"});
```

### query

`dsx.module.cdn.query`

Lists every file in the store, as the old localcdn query did.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `items` | array of object | yes | Every stored file, in store order. |

**Example: answers the whole ledger**

```js
const result = await dsx.module.cdn.query({});
// resolves {"items":[]}
```

### read

`dsx.module.cdn.read`

Looks up cached files by the paths a page sent, as the old localcdn read did.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `index` | string | no | A JSON list of file paths or page index names. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `items` | array of object | yes | The matching files, in store order. |

**Example: answers the rows the paths name**

```js
const result = await dsx.module.cdn.read({"index":"[\"movie_a\"]"});
// resolves {"items":[]}
```

**Example: an invalid array names nothing**

```js
const result = await dsx.module.cdn.read({"index":"movie_a"});
// resolves {"items":[]}
```

### remove

`dsx.module.cdn.remove`

Deletes one stored item, or the whole bucket when all is set to true.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `all` | boolean | no | Set to true to delete the whole bucket. |
| `bucket` | string | no | The bucket the item is stored in, or the bucket to empty. |
| `name` | string | no | The name of the item to delete. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `all` | boolean | no | True if the whole bucket was deleted. |
| `bucket` | string | yes | The bucket that was affected. |
| `name` | string | no | The item that was deleted. |
| `removed` | boolean | yes | True if something was deleted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_bucket` | The bucket name contains a path segment that is not allowed. | Use a plain bucket name, with folders separated by slashes and no dots. |
| `invalid_name` | The name is not a single safe file name. | Use a plain file name without slashes. |
| `missing_name` | No item name was passed, so nothing could be found. | Pass the name of the stored item. |

**Example: removes a single item**

```js
const result = await dsx.module.cdn.remove({"bucket":"media","name":"thumb.png"});
// resolves {"bucket":"media","name":"thumb.png","removed":true}
```

### restoreCookies

`dsx.module.cdn.restoreCookies`

Restores the web cookies saved earlier, before the first page loads.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

_None._

**Example: resolves once the cookie store is repopulated**

```js
const result = await dsx.module.cdn.restoreCookies({});
```

**Example: resolves immediately when the app is not in local-server mode**

```js
const result = await dsx.module.cdn.restoreCookies({});
```

### stats

`dsx.module.cdn.stats`

Reports how much storage is used, for one bucket or for every bucket, to build a manage storage screen.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bucket` | string | no | The bucket to measure; leave it out to measure all. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bucket` | string | no | The bucket that was measured. |
| `buckets` | array of object | no | One row per bucket with its item count and bytes. |
| `bytes` | int | no | How many bytes the bucket uses. |
| `items` | int | no | How many items are in the bucket. |
| `totalBytes` | int | no | How many bytes all buckets use together. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_bucket` | The bucket name contains a path segment that is not allowed. | Use a plain bucket name, with folders separated by slashes and no dots. |

**Example: reports buckets and total bytes**

```js
const result = await dsx.module.cdn.stats({});
// resolves {"buckets":[],"totalBytes":0}
```

### upload

`dsx.module.cdn.upload`

Stores a file on the device under a name and bucket, and gives you addresses the page can use to show it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `base64` | string | no | The file content as base64 text, for small files. |
| `bucket` | string | no | The folder-like group to store it in. |
| `file` | string | no | A file picked in the page, sent without loading it into memory. |
| `move` | boolean | no | Set to true to move the file instead of copying it. |
| `name` | string | yes | The file name to store it under. |
| `path` | string | no | A file path on the device to copy in. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bucket` | string | yes | The bucket the file was stored in. |
| `loopback` | string | yes | A local web address with a key, for pages that can use it. |
| `name` | string | yes | The name the file was stored under. |
| `ok` | boolean | yes | True when the file was stored. |
| `scheme` | string | yes | A cdn address that secure pages can use to show the file. |
| `size` | int | yes | The size of the stored file in bytes. |
| `url` | string | yes | A file address for native code and media players. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_bucket` | The bucket name contains a path segment that is not allowed. | Use a plain bucket name, with folders separated by slashes and no dots. |
| `invalid_name` | The name is not a single safe file name. | Use a plain file name without slashes. |
| `missing_name` | No file name was passed. | Pass a name for the file. |
| `missing_payload` | No file, path or base64 data was passed. | Pass one of file, path or base64. |
| `upload_failed` | The upload did not finish. | Try again, and check that the device has free space. |

**Example: uploads base64 data into a bucket**

```js
const result = await dsx.module.cdn.upload({"base64":"aGVsbG8=","bucket":"media","name":"thumb.png"});
// resolves {"bucket":"media","loopback":"http://localhost:9123/cdn/media/thumb.png","name":"thumb.png","ok":true,"scheme":"cdn:/api/file/data?bucket=media&name=thumb.png","size":5,"url":"file:///cdn/media/thumb.png"}
```

### url

`dsx.module.cdn.url`

Finds a stored item and gives you its addresses. An item that is not there is not an error, it just reports that it does not exist.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bucket` | string | no | The bucket the item is stored in. |
| `name` | string | yes | The name of the stored item. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bucket` | string | no | The bucket the item is stored in. |
| `exists` | boolean | yes | True if the item is stored. |
| `loopback` | string | no | A local web address with a key. |
| `name` | string | no | The name the item is stored under. |
| `scheme` | string | no | A cdn address that secure pages can use. |
| `size` | int | no | How large the stored item is, in bytes. |
| `url` | string | no | A file address for native code and media players. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_bucket` | The bucket name contains a path segment that is not allowed. | Use a plain bucket name, with folders separated by slashes and no dots. |
| `invalid_name` | The name is not a single safe file name. | Use a plain file name without slashes. |
| `missing_name` | No item name was passed, so nothing could be found. | Pass the name of the stored item. |

**Example: reports a missing item**

```js
const result = await dsx.module.cdn.url({"bucket":"media","name":"absent.png"});
// resolves {"exists":false}
```

### write

`dsx.module.cdn.write`

Starts downloading a web address into the store, as the old localcdn write did. It returns as soon as the download is accepted and the cached event announces the finished file.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `filename` | string | yes | Where to store it, as folder/file; a plain name goes in the root bucket. |
| `index` | string | no | A name the page uses to find this file later. |
| `push` | boolean | no | Set to true to show a notification when the file is cached. |
| `pushmessage` | string | no | The text of that notification. |
| `url` | string | yes | The web address to download. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accepted` | boolean | yes | True when the download was accepted. |
| `index_full` | string | yes | The full path that identifies the file in the store. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_filename` | The filename must be a safe folder and file path. | Use a plain path such as folder/file.mp4. |
| `invalid_url` | The address must be an http or https web address. | Pass a full http or https address. |

**Example: accepts a download and answers at once**

```js
const result = await dsx.module.cdn.write({"filename":"videos/a.mp4","index":"a","url":"https://cdn.example.com/a.mp4"});
// resolves {"accepted":true,"index_full":"videos/a.mp4"}
```

## Events

Read with `dsx.on(name, handler)`.

### cached

A file started by write has finished downloading and is saved on the device.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cdn` | string | yes | The remote address the file came from. |
| `created_at` | string | yes | When the entry was created, written as text. |
| `extension` | string | yes | The file extension, such as mp4. |
| `index` | string | yes | The short index name the page gave the file. |
| `index_full` | string | yes | The full path that identifies the file in the store. |
| `local_cdn` | string | yes | The local address a page can load the file from. |
| `local_path` | string | yes | Where the file sits on the device. |
| `size` | string | yes | The file size in bytes, written as text. |
| `status` | string | yes | Whether the file is cached or still pending download. |

### contentUpdated

A newer version of the offline web content is available.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `deployedAt` | string | yes | When the new content was published. |
| `generation` | string | yes | The version number of the new content. |
| `manifest` | string | yes | The name of the new content list. |
| `origin` | string | no | The web address the content is served from. |
| `path` | string | yes | The content path that has a new version. |
| `root` | string | yes | The folder the new content is stored in. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `asset_json_path` | string | `/despia/local.json` | Path to the local asset manifest JSON. |
| `auto_retry` | boolean | `false` | Retry automatically when back online. |
| `button_text` | string | `Try again now` | The label of the retry button on the offline screen. |
| `dynamic_port_max_retries` | number | `20` | How many ports to try before giving up. |
| `local_cdn_folder` | string | `despiabase` | Folder name for the local CDN cache. |
| `local_files_directory` | string | `localUploads` | Folder name for local uploads. |
| `local_host` | string | `localhost` | Hostname the bundled local server binds to. |
| `local_host_port` | number | `9123` | Port for the local server (4 digits). |
| `local_html_switch` | boolean | `false` | Serve the bundled index.html as the offline floor. |
| `local_share_folder` | string | `sharedFolder` | Folder name for files coming from the share extension. |
| `main_content_folder` | string | `app` | Folder name for the main app content. |
| `message` | multiline | `Please check your connection.` | The message shown on the offline screen when there is no connection. |
| `only_use_local_server` | boolean | `false` | Serve only the bundled HTML and never the remote URL. |
| `screen_line1` | multiline | `Connection down?` | The first line of text shown on the offline screen. |
| `screen_line2` | multiline | `WiFi and mobile data are supported.` | The second line of text shown on the offline screen. |
| `title` | string | `Connection error` | The title shown on the offline screen when there is no connection. |
| `use_dynamic_port` | boolean | `true` | Pick a random free port for the local server. |
| `use_local_html_folder` | boolean | `false` | Load the bundled local-www/index.html instead of the server. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_path` | No content path was passed. | Pass the path of the content you want to work with. |
| `origin_not_allowed` | Only the app's own content address can be used from here, so the call was refused. | Use a path on the app's own content origin. |
| `pin_not_allowed` | Pinning content so it is never cleared is the app's decision and cannot be made from a web page. | Pin content from the app itself; unpinning is allowed from a page. |
| `protected_path` | The app's own content bundle cannot be changed from here. | Leave the app's bundle alone, and use a different path. |
| `secure_read_unavailable` | The private read service that serves files on iOS is not ready yet. | Try again in a moment. |

## Related packages

- Needs: [Files](/packages/files)
- Works better with: [Dom](/packages/dom)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
