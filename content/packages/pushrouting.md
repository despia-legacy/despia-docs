---
title: PushRouting
description: Delivers the notification a user tapped to your app's pages once they are ready.
package: pushrouting
---

Delivers the notification a user tapped to your app's pages once they are ready.

When a user taps a push notification, this package holds the payload until the page has loaded, then sends it to your app as a notification event and opens any deep-link path. It also queues silent pushes so you can read them later. It works with any push provider; you write the code that reacts to the event.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Listen to its events when you want to react to a tapped notification or to a silent push. You do not need to call it yourself for ordinary tap routing, it runs on every page load.

## Install

```sh
despia add Mandatory/PushRouting
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

### deliver

`dsx.module.pushrouting.deliver`

Sends the stored tapped-notification payload to your app now, then clears it. Nothing is sent when no notification was tapped or the page is not ready yet.

**When not to.** You rarely need it, because delivery already runs when the page finishes loading.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `delivered` | boolean | yes | True when a stored notification was handed to your app. |

**Example: flushes the stored notification payload when ready**

```js
const result = await dsx.module.pushrouting.deliver({});
// resolves {"delivered":true}
```

**Example: reports honestly that there was nothing stored**

```js
const result = await dsx.module.pushrouting.deliver({});
// resolves {"delivered":false}
```

### silent

`dsx.module.pushrouting.silent`

Returns the silent pushes that arrived while the page could not run and clears the queue. A silent push has no visible alert and exists to wake the app.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many payloads are returned. |
| `dropped` | number | yes | How many older payloads were discarded because the queue was full. |
| `payloads` | array of object | yes | The queued silent push payloads, oldest first. |

**Example: drains the queued silent payloads**

```js
const result = await dsx.module.pushrouting.silent({});
// resolves {"count":1,"dropped":0,"payloads":[{"id":"42","type":"sync"}]}
```

**Example: resolves empty when nothing is queued**

```js
const result = await dsx.module.pushrouting.silent({});
// resolves {"count":0,"dropped":0,"payloads":[]}
```

## Events

Read with `dsx.on(name, handler)`.

### notification

A notification the user tapped has been delivered to the page, with its payload and any deep-link path.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `event` | object | no | The full notification payload as the push provider sent it. |
| `path` | string | no | The in-app path to open, when the notification carried one. |
| `url` | string | no | The web address to open, when the notification carried one. |

### silent

Silent pushes that arrived in the background are ready for the page to read.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | int | yes | How many payloads were delivered. |
| `dropped` | int | yes | How many older payloads were discarded because the queue was full. |
| `payloads` | array of object | yes | The silent push payloads, oldest first. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_payload` | The notification payload is not a JSON object, or exceeds the size this bridge will carry. |  |
| `missing_param` | A stored notification needs its `event` payload. |  |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
