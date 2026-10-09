---
title: Segment
description: Send your app's analytics events to Segment.
package: segment
---

Send your app's analytics events to Segment.

Works with the Product analytics package: it delivers the events it collects to Segment, which can pass them to your other tools. Segment accepts events without confirming it kept them, so check its Debugger when you first connect. Needs a Segment source write key.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it when you already use Segment and want your app's analytics events delivered there. Pick it as the destination in the product analytics settings. Do not rely on it to confirm delivery, because Segment accepts events first and rejects some later.

## Install

```sh
despia add Core/Growth/Modules/Segment
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, desktop.

## Actions

### send

`dsx.module.segment.send`

Sends one batch of analytics events to Segment in a single request. The analytics package calls it for you.

**When to use it.** You do not call it yourself. A success only means Segment accepted the request, so check Segment's Debugger to see what it kept.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `endpoint` | string | no | The Segment host to send to, for a regional host or your own proxy. Defaults to api.segment.io. |
| `events` | array of object | yes | The batch of analytics events to send. |
| `token` | string | yes | Your Segment source write key. It is public and ships in the app. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `confirmed` | boolean | yes | Always false, because Segment accepting a request does not confirm each event was kept. |
| `sent` | number | yes | How many events were sent in the request. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `destination_unavailable` | Segment could not be reached. |  |
| `invalid_endpoint` | The Segment endpoint must be https, or http to a local development host. | Not recoverable by retrying. |
| `invalid_token` | That is not a Segment write key (20 to 64 letters and digits). | Not recoverable by retrying. |
| `rejected` | Segment refused the whole batch, for example because the write key is wrong. | Check the write key and the endpoint in your analytics settings, then try again. |

**Example: sends a batch as one request**

```js
const result = await dsx.module.segment.send({"events":[{"anonymousId":"a-1","at":1758801600000,"event":"checkout.started","eventId":"e-1","platform":"ios","properties":{},"sessionId":"s-1","source":"app"}],"token":"abcdefghijklmnopqrstuvwxyz012345"});
// resolves {"confirmed":false,"sent":1}
```

**Example: an empty batch is not a request**

```js
const result = await dsx.module.segment.send({"events":[],"token":"abcdefghijklmnopqrstuvwxyz012345"});
// resolves {"sent":0}
```

## Related packages

- Needs: [Growth](/packages/growth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
