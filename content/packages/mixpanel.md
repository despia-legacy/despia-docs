---
title: Mixpanel
description: Send your app's analytics events to Mixpanel.
package: mixpanel
---

Send your app's analytics events to Mixpanel.

Works with the Product analytics package: it takes the events it collects and delivers them to your Mixpanel project, tied to the signed-in user or an anonymous id. Use it when your team analyses behaviour in Mixpanel. Needs a Mixpanel account and your project token.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when your team analyses behaviour in Mixpanel. Pick it as the Growth destination, and use another destination package if you use a different tool.

## Install

```sh
despia add Core/Growth/Modules/Mixpanel
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

`dsx.module.mixpanel.send`

Sends one batch of Growth events to Mixpanel as a single request. Only the Growth package calls it.

**When not to.** Do not call it yourself. Use the track action of the Growth package.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `endpoint` | string | no | A custom host, such as the EU data residency host or your own proxy. |
| `events` | array of object | yes | The batch of analytics events to deliver. |
| `token` | string | yes | Your Mixpanel project token, which is 32 hex characters. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `sent` | number | yes | How many events Mixpanel accepted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `destination_unavailable` | Mixpanel could not be reached. | The events stay queued; try again later. |
| `invalid_endpoint` | The Mixpanel endpoint must be https, or http only for a local development host. | Use an https address. |
| `invalid_token` | That is not a Mixpanel project token, which is 32 hex characters. | Copy the project token from your Mixpanel project settings. |
| `rejected` | Mixpanel refused the batch, for example because the token or an event was not accepted. | Check the project token and the event contents. |

**Example: sends a batch as one request**

```js
const result = await dsx.module.mixpanel.send({"events":[{"anonymousId":"a-1","at":1758801600000,"event":"checkout.started","eventId":"e-1","platform":"ios","properties":{},"sessionId":"s-1","source":"app"}],"token":"0123456789abcdef0123456789abcdef"});
// resolves {"sent":1}
```

**Example: an empty batch is not a request**

```js
const result = await dsx.module.mixpanel.send({"events":[],"token":"0123456789abcdef0123456789abcdef"});
// resolves {"sent":0}
```

## Related packages

- Needs: [Growth](/packages/growth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
