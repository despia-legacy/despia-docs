---
title: State
description: Read, write and watch the app-wide shared store from your web page.
package: global
---

Read, write and watch the app-wide shared store from your web page.

Connects your web layer to the one reactive store that native screens, packages and the page all share. You can read a value by its dot-path, write one, and watch a path so your page reacts the moment anything changes it, such as sign-in, credits or theme. You decide which paths your app uses.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when the web page and native parts of the app need to share live values such as the signed-in user or credits. Most apps use the dsx.global shortcuts instead of calling the actions directly; for values that belong to one page only, use that page's own variables.

## What native adds

The store is shared with native screens and packages, so a native change reaches your page without a reload.

## Install

```sh
despia add Mandatory/State
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

### apply

`dsx.module.global.apply`

Writes one variable of the calling document and marks where the change came from, such as the server or a restore.

**When to use it.** Used by cloud state to apply remote changes. For ordinary changes, assign the variable or use set.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `origin` | string | no | Where the change came from: remote, restore or transition; it defaults to remote and local is refused. |
| `value` | object | no | The new value of the variable. |
| `variable` | string | yes | The name of the variable in the calling document to write. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `origin` | string | yes | The origin that was recorded for the write. |
| `variable` | string | yes | The name of the variable that was written. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_origin` | origin must be remote, restore or transition; a local write is an assignment | Not recoverable by retrying. |
| `unknown_variable` | this document declares no variable by that name | Not recoverable by retrying. |

**Example: Apply a change that arrived from the server**

```js
const result = await dsx.module.global.apply({"value":{"credits":200},"variable":"session"});
// resolves {"origin":"remote","variable":"session"}
```

### get

`dsx.module.global.get`

Reads the value stored at a dot-path, or the whole store when you give no path.

**When to use it.** Use it to read shared values once. An unknown path gives null instead of an error.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | no | The dot-path to read, such as session.credits; leave it out to read everything. |

**Resolves with**

_None._

**Example: resolves the value at a dot-path**

```js
const result = await dsx.module.global.get({"key":"session"});
// resolves {"credits":200}
```

**Example: an omitted key resolves the whole store**

```js
const result = await dsx.module.global.get({});
// resolves {"session":{"credits":200}}
```

### set

`dsx.module.global.set`

Writes a value at a dot-path in the shared store, creating the path if needed.

**When to use it.** Use it to change shared values so native screens and every watcher see the new value.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The dot-path to write, such as session.credits. |
| `value` | string | no | The value to store; numbers, booleans, objects and arrays are stored as given. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_key` | The key was left out or empty, so there is no path to write to. | Pass a non-empty dot-path such as session.credits. |

**Example: writes a dot-path**

```js
const result = await dsx.module.global.set({"key":"session.credits","value":"200"});
```

### watch

`dsx.module.global.watch`

Sends the current value at a dot-path, then again every time that value changes.

**When to use it.** Use it to keep a screen in step with shared values. Stop the subscription when the screen closes.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | no | The dot-path to watch; leave it out to watch the whole store. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_stream` | No stream is available for this request. | Not recoverable by retrying. |

**Example: streams the current value then on every change**

```js
const result = await dsx.module.global.watch({"key":"session"});
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
