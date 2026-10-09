---
title: PostHog
description: Send your app's analytics events to PostHog.
package: posthog
---

Send your app's analytics events to PostHog.

Works with the Product analytics package: it takes the events it collects and delivers them to your PostHog project. PostHog accepts events without confirming it kept them, so check its activity view when you first connect. Needs a PostHog account and your project key.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when you analyse your product in PostHog. It sends the events your app already records to your PostHog project; you do not call it yourself.

## Install

```sh
despia add Core/Growth/Modules/PostHog
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

`dsx.module.posthog.send`

Sends a batch of recorded events to your PostHog project in one request. The product analytics package calls it for you.

**When not to.** Do not call it directly; record events through the product analytics package.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `endpoint` | string | no | The PostHog address to send to, such as the EU cloud, your own server or a proxy; defaults to the US cloud. |
| `events` | array of object | yes | The batch of events to send, each with its id, name, properties and time. |
| `token` | string | yes | Your PostHog project token, which starts with phc_ and is safe to ship in an app. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `confirmed` | boolean | yes | Always false: PostHog accepted the request but that is not a delivery receipt. |
| `sent` | number | yes | How many events were sent in the batch. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `destination_unavailable` | PostHog could not be reached, so the batch stays queued. | Nothing; it will be retried when the connection returns. |
| `invalid_endpoint` | The endpoint is not an https address or a local development host. | Use an https address. |
| `invalid_token` | The token is not a PostHog project token. | Copy the project token, which starts with phc_, from your PostHog project settings. |
| `rejected` | PostHog refused the batch and it was dropped. | Check the project token and the event data. |

**Example: sends a batch as one request**

```js
const result = await dsx.module.posthog.send({"events":[{"anonymousId":"a-1","at":1758801600000,"event":"checkout.started","eventId":"e-1","platform":"ios","properties":{},"sessionId":"s-1","source":"app"}],"token":"phc_abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG"});
// resolves {"confirmed":false,"sent":1}
```

**Example: an empty batch is not a request**

```js
const result = await dsx.module.posthog.send({"events":[],"token":"phc_abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG"});
// resolves {"sent":0}
```

## Related packages

- Needs: [Growth](/packages/growth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
