---
title: TikTokEvents
description: Report purchases and sign-ups to TikTok from your server, only for people who agreed.
package: tiktokevents
---

Report purchases and sign-ups to TikTok from your server, only for people who agreed.

Sends your conversion events to the TikTok Events API from your own server, with personal details hashed and each send checked against the user's consent. You get an answer saying whether the event was sent, skipped or refused, and why. You provide your TikTok access token and pixel or app id, and call it from server code, never from the app.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it when you run TikTok ads and want sign-ups, purchases and subscriptions counted for attribution. It only runs on your server, so a device cannot send a fake conversion. Leave it out if you do not advertise on TikTok.

## Install

```sh
despia add Core/Growth/Modules/TikTokEvents
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | no |
| web | no |
| macos | no |

## Actions

### forward

`dsx.module.tiktokevents.forward`

Sends one conversion event to TikTok, after checking consent and hashing the personal details, and reports whether it was sent, skipped or refused.

**When to use it.** Call it from server code such as a workflow or a queue, once for each event you want counted.

**When not to.** Do not call it from the app on the device; there is no public route for that on purpose.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `consent` | object | no | The consent recorded when the event was collected, used only when no consent record can be looked up for the user. |
| `device` | object | no | Details of the device for app events, such as its system and app version. |
| `device.adTrackingEnabled` | boolean | no | Whether the user allows ad tracking on the device. |
| `device.appBuild` | string | no | The app's build number, as shown in the store listing. |
| `device.appId` | string | no | The app's bundle or package id. |
| `device.appVersion` | string | no | The app's version number, such as 2.4.1. |
| `device.locale` | string | no | The language and region set on the device. |
| `device.model` | string | no | The device model name, such as iPhone 15. |
| `device.os` | string | no | The operating system name, such as iOS or Android. |
| `device.osVersion` | string | no | The operating system version. It is required for app events. |
| `device.timezone` | string | no | The time zone name set on the device. |
| `event` | object | yes | The conversion event to report, with its id, name, properties and time. |
| `event.anonymousId` | string | no | The id of an anonymous visitor. It is never sent to TikTok. |
| `event.at` | number | yes | When the event happened, as a timestamp in milliseconds. |
| `event.event` | string | yes | The event name, such as registration or purchase. Common names are matched to TikTok's own names. |
| `event.eventId` | string | yes | A unique id for this event, so TikTok can ignore a repeat. |
| `event.platform` | string | no | Where the event happened, such as ios, android or web. |
| `event.properties` | object | no | Extra details about the event, such as value, currency and order id. |
| `event.sessionId` | string | no | The id of the session the event came from. |
| `event.source` | string | no | The name of the part of your system that recorded the event. |
| `event.subject` | string | no | The id of the signed-in user the event belongs to; it is used to look up consent. |
| `page` | object | no | Details of the page for web events. |
| `page.referrer` | string | no | The address of the page the visitor came from. |
| `page.url` | string | no | The address of the page where the event happened. |
| `user` | object | no | What your server knows about the person. Email and phone are hashed before they are sent. |
| `user.clickIds` | object | no | The click ids from the ad link, such as ttclid, which TikTok uses to match the ad. |
| `user.email` | string | no | The user's email address. It is trimmed, lower-cased and hashed before sending. |
| `user.externalId` | string | no | Your own id for the user, hashed before sending. |
| `user.ip` | string | no | The user's IP address. |
| `user.locale` | string | no | The user's language and region. |
| `user.phone` | string | no | The user's phone number with the country code. It is hashed before sending. |
| `user.userAgent` | string | no | The browser or app user-agent text. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `provenance` | object | yes | A record of the decision, for you to keep. |
| `provenance.adapter` | string | yes | Which sender made the decision. |
| `provenance.at` | string | yes | When the decision was made. |
| `provenance.consent` | object | yes | The consent answers that were used. |
| `provenance.decision` | string | yes | What was decided: sent, skipped, rejected, retry or not_configured. |
| `provenance.eventId` | string | yes | The id of the event the decision is about. |
| `provenance.network` | string | yes | The ad network the event was for. |
| `provenance.rule` | string | yes | The reason for the decision, such as the consent answer or TikTok's code. |
| `provenance.vendorEvent` | string | yes | The TikTok event name the event was turned into. |
| `sent` | boolean | yes | True when TikTok accepted the event. |
| `skipped` | string | no | If the event was not sent, why, such as consent or no event mapping. |
| `vendor` | object | no | TikTok's answer to the request, with its status, result code and request id. |
| `vendor.code` | number | yes | TikTok's own result code; 0 means success. |
| `vendor.request_id` | string | yes | TikTok's id for the request, useful when asking support. |
| `vendor.status` | number | yes | The HTTP status TikTok returned. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The event is missing its id, name or time, or an app event has no operating system version. | Pass a complete event, and device.osVersion for app events. |
| `not_configured` | A setting the event needs is missing, or TikTok refused the credentials. | Set the access token, and the pixel code for web events or the app id for app events. |
| `unavailable` | TikTok could not be reached or is limiting requests. | Retry later with a growing delay. |
| `upstream` | TikTok rejected the event, so sending the same event again will not help. | Check the event details against TikTok's rules and fix the data. |

**Example: Send a purchase event to TikTok**

```js
const result = await dsx.module.tiktokevents.forward({"event":{"at":1791500000000,"event":"purchase","eventId":"evt_1001","platform":"web","properties":{"currency":"USD","value":9.99},"sessionId":"sess_1","source":"web","subject":"user_123"},"page":{"url":"https://example.com/checkout"},"user":{"email":"ada@example.com"}});
// resolves {"provenance":{"adapter":"growth.tiktokevents","consent":{"source":"identity","states":{"attribution":"granted","sharing:tiktok":"granted"}},"decision":"sent","eventId":"evt_1001","network":"tiktok","rule":"consent.identity: attribution + sharing:tiktok granted","vendorEvent":"Purchase"},"sent":true,"vendor":{"code":0,"request_id":"req_abc123","status":200}}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `access_token` | secret | `` | TikTok Events Manager, the pixel's or app's Settings: Generate access token. It never leaves this server. |
| `app_id` | string | `` | The TikTok App ID app events are reported under (event_source app). |
| `event_map` | string | `` | Optional JSON object: app event name -> TikTok event name. |
| `pixel_id` | string | `` | The pixel code web events are reported under (event_source web). |
| `test_event_code` | string | `` | Optional: Events Manager's test event code. |

## Related packages

- Needs: [Growth](/packages/growth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
