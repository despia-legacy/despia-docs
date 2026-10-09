---
title: RudderStack
description: Send your app's analytics events to your RudderStack data plane.
package: rudderstack
---

Send your app's analytics events to your RudderStack data plane.

Works with the Product analytics package: it delivers the events it collects to RudderStack, so you can route them on to your other tools. Delivery onward from RudderStack is not visible to the app. Needs a RudderStack source write key and the address of your data plane, cloud or self-hosted.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when your analytics events should flow into RudderStack, either RudderStack Cloud or a data plane you host yourself. Skip it if you send events to another destination, or if you cannot give it your own data plane address.

## Install

```sh
despia add Core/Growth/Modules/RudderStack
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

`dsx.module.rudderstack.send`

Sends one batch of collected analytics events to your RudderStack data plane as a single request. Growth calls it for you; a successful answer means the data plane accepted the batch, not that RudderStack delivered it onward.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `endpoint` | string | no | The address of your RudderStack data plane, such as the https URL of your cloud or self-hosted data plane. It is required in practice, because there is no default host. |
| `events` | array of object | yes | The batch of analytics events to deliver, in the order Growth collected them. |
| `token` | string | yes | Your RudderStack source write key, 20 to 64 letters and digits. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `confirmed` | boolean | yes | Always false, because a success answer only shows that your data plane received the batch. |
| `sent` | number | yes | How many events were in the batch the data plane accepted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `destination_unavailable` | RudderStack could not be reached. |  |
| `invalid_endpoint` | The RudderStack data plane URL is required and must be https, or http to a local development host. | Not recoverable by retrying. |
| `invalid_token` | That is not a RudderStack write key (20 to 64 letters and digits). | Not recoverable by retrying. |
| `rejected` | The data plane refused the batch with a bad request or a too large payload answer. The batch is dropped and not retried. | Check the write key and the event contents on your RudderStack source, and keep batches smaller if the payload is too large. |

**Example: sends a batch as one request**

```js
const result = await dsx.module.rudderstack.send({"endpoint":"https://example.dataplane.rudderstack.com","events":[{"anonymousId":"a-1","at":1758801600000,"event":"checkout.started","eventId":"e-1","platform":"ios","properties":{},"sessionId":"s-1","source":"app"}],"token":"abcdefghijklmnopqrstuvwxyz012345"});
// resolves {"confirmed":false,"sent":1}
```

**Example: an empty batch is not a request**

```js
const result = await dsx.module.rudderstack.send({"events":[],"token":"abcdefghijklmnopqrstuvwxyz012345"});
// resolves {"sent":0}
```

## Related packages

- Needs: [Growth](/packages/growth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
