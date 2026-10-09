---
title: Customer.io
description: Send your app's analytics events to Customer.io.
package: customerio
---

Send your app's analytics events to Customer.io.

Works with the Product analytics package: it delivers the events it collects to Customer.io so you can trigger messages from them. Customer.io accepts events without confirming it kept them, so check its activity log when you first connect. Needs the write key of a Customer.io browser or mobile source.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when you want your app's analytics events to reach Customer.io so you can trigger messages from them. Growth calls it for you after you select Customer.io; you never call it directly.

## Install

```sh
despia add Core/Growth/Modules/CustomerIO
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

`dsx.module.customerio.send`

Sends one batch of tracked events to Customer.io in a single request. Growth calls it for you.

**When not to.** Do not call it yourself; select Customer.io in the Growth settings and Growth does the sending.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `endpoint` | string | no | An alternative address such as the EU region or your own proxy; the default is the US region. |
| `events` | array of object | yes | The tracked events to send in this batch. |
| `token` | string | yes | The write key of a Customer.io browser or mobile source, never a server API key. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `confirmed` | boolean | yes | Always false, because Customer.io accepts events without confirming it kept them; check its activity log. |
| `sent` | number | yes | How many events were handed to Customer.io. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `destination_unavailable` | Customer.io could not be reached. |  |
| `invalid_endpoint` | The Customer.io endpoint must be https, or http to a local development host. | Not recoverable by retrying. |
| `invalid_token` | That is not a Customer.io write key (20 to 64 letters and digits). | Not recoverable by retrying. |
| `rejected` | Customer.io refused the batch. | Not recoverable by retrying. |

**Example: sends a batch as one request**

```js
const result = await dsx.module.customerio.send({"events":[{"anonymousId":"a-1","at":1758801600000,"event":"checkout.started","eventId":"e-1","platform":"ios","properties":{},"sessionId":"s-1","source":"app"}],"token":"abcdefghijklmnopqrstuvwxyz012345"});
// resolves {"confirmed":false,"sent":1}
```

**Example: an empty batch is not a request**

```js
const result = await dsx.module.customerio.send({"events":[],"token":"abcdefghijklmnopqrstuvwxyz012345"});
// resolves {"sent":0}
```

## Related packages

- Needs: [Growth](/packages/growth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
