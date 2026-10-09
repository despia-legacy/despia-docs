---
title: Amplitude
description: Send your app's analytics events to Amplitude.
package: amplitude
---

Send your app's analytics events to Amplitude.

Works with the Product analytics package: it takes the events it collects and delivers them to your Amplitude project. Use it when your team analyses behaviour in Amplitude. Needs an Amplitude account and your project API key.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it when your team analyses behaviour in Amplitude and you already collect events with the product analytics package. It is the delivery step only; your app does not call it directly.

## Install

```sh
despia add Core/Growth/Modules/Amplitude
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

`dsx.module.amplitude.send`

Sends one batch of collected events to your Amplitude project in a single request, and reports how many were sent.

**When not to.** Apps do not call this; the analytics package calls it after it queues a batch.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `endpoint` | string | no | The server address to send to, such as the EU data center address or your own proxy. The default is Amplitude's standard address. |
| `events` | array of object | yes | The batch of events to deliver. |
| `token` | string | yes | Your Amplitude project API key, which is 32 hex characters. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `sent` | number | yes | How many events Amplitude accepted in this batch. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `destination_unavailable` | Amplitude could not be reached or is limiting requests, and the batch stays queued. | Nothing; it will be tried again. |
| `invalid_endpoint` | The endpoint must start with https, or be a local development address. | Use an https address. |
| `invalid_token` | The token is not an Amplitude API key, which is 32 hex characters. | Copy the project API key from your Amplitude settings. |
| `rejected` | Amplitude refused the batch, and the batch is dropped. | Read the message for Amplitude's reason and fix the event data. |

**Example: sends a batch as one request**

```js
const result = await dsx.module.amplitude.send({"events":[{"anonymousId":"a-1","at":1758801600000,"event":"checkout.started","eventId":"e-1","platform":"ios","properties":{},"sessionId":"s-1","source":"app"}],"token":"0123456789abcdef0123456789abcdef"});
// resolves {"sent":1}
```

**Example: an empty batch is not a request**

```js
const result = await dsx.module.amplitude.send({"events":[],"token":"0123456789abcdef0123456789abcdef"});
// resolves {"sent":0}
```

## Related packages

- Needs: [Growth](/packages/growth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
