---
title: Http
description: Server routes for health checks, webhooks, live updates and a small notes example.
package: http
---

Server routes for health checks, webhooks, live updates and a small notes example.

Adds a set of ready-made routes to your server: a health check that reports the build, a signed webhook receiver with a retry queue and dead letters, a live update stream, and a simple notes example with a summary. It runs only on your server and has no iOS or Android code. You supply the webhook secret and decide which routes to expose.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it as the starting set of server routes when you deploy your own backend, for example to check that a deployment is alive or to receive webhooks safely. Do not look for it in the app itself, since it has no native code.

## Install

```sh
despia add Core/Server/Modules/Http
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | no |
| web | no |
| macos | no |

## Actions

### drainWebhooks

`dsx.module.http.drainWebhooks`

Processes the webhooks waiting on the queue and reports how many were handled. It runs on a schedule and is for your own server only.

**When not to.** Do not call it from the app; clients cannot reach it.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `by` | string | no | Which worker did the processing. |
| `drained` | number | yes | How many webhooks were taken from the queue and finished. |
| `ok` | boolean | yes | True when the run finished. |
| `queue` | string | yes | The name of the queue that was processed. |

**Example: an empty queue drains nothing, and says so**

```js
const result = await dsx.module.http.drainWebhooks({});
// resolves {"drained":0,"ok":true,"queue":"webhooks"}
```

### health

`dsx.module.http.health`

Reports that the server is running, with the version and identity of the build that is deployed.

**When to use it.** Use it as a deployment health check.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `digest` | string | no | A fingerprint that identifies exactly which build is deployed. |
| `modules` | number | no | How many packages the deployed build contains. |
| `ok` | boolean | yes | True when the server is up and answering. |
| `version` | string | no | The version of the deployed build. |

**Example: reports build identity**

```js
const result = await dsx.module.http.health({});
// resolves {"ok":true}
```

### listWebhookDeadLetters

`dsx.module.http.listWebhookDeadLetters`

Lists the webhooks that failed every retry, so you can see what went wrong. It is for your own server code only and is hidden from clients.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many failed webhooks are waiting. |
| `messages` | array of object | yes | The failed webhooks, each with its id, key, number of attempts, reason and the time it was given up on. |
| `queue` | string | yes | The name of the queue the failed webhooks are on. |

**Example: See which webhooks failed every retry**

```js
const result = await dsx.module.http.listWebhookDeadLetters({});
// resolves {"count":1,"messages":[{"attempts":5,"deadLetteredAt":"2026-10-09T09:30:00.000Z","id":"msg_1","key":"stripe:evt_1","reason":"handler threw"}],"queue":"webhooks"}
```

### notes.summary

`dsx.module.http.notes.summary`

Counts the notes in the example notes table and how many of them are pinned. It only reads data.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many notes there are in total. |
| `pinned` | number | yes | How many of those notes are pinned. |

**Example: Count the notes and the pinned ones**

```js
const result = await dsx.module.http.notes.summary({});
// resolves {"count":12,"pinned":3}
```

### receiveWebhook

`dsx.module.http.receiveWebhook`

Accepts a webhook from an outside service after checking its signature, and queues it for processing. A bad signature is refused and a repeated delivery is recognised.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accepted` | boolean | yes | True when the webhook was verified and queued. |
| `duplicate` | boolean | no | True when this exact delivery was received before and was not queued again. |

**Example: Accept a signed webhook from an outside service**

```js
const result = await dsx.module.http.receiveWebhook({});
// resolves {"accepted":true,"duplicate":false}
```

### replayWebhookDeadLetters

`dsx.module.http.replayWebhookDeadLetters`

Puts chosen failed webhooks back on the queue to be processed again. You name the exact ones, never everything at once, so one bad message cannot flood production. It is for your own server code only.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ids` | array of string | no | The ids of the failed webhooks to put back on the queue, taken from the dead letter list; with none given, nothing is replayed. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `queue` | string | yes | The name of the queue the webhooks were put back on. |
| `replayed` | number | yes | How many webhooks were put back for another try. |

**Example: Replay one failed webhook**

```js
const result = await dsx.module.http.replayWebhookDeadLetters({"ids":["msg_1"]});
// resolves {"queue":"webhooks","replayed":1}
```

### subscribe

`dsx.module.http.subscribe`

Opens a live stream of server events that the client keeps open and reads as they arrive.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `stream` | boolean | yes | True when the live stream was opened. |

**Example: Open the live stream of server events**

```js
const result = await dsx.module.http.subscribe({});
// resolves {"stream":true}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
