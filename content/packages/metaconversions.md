---
title: MetaConversions
description: Send your app's conversion events to Meta ads from your own server.
package: metaconversions
---

Send your app's conversion events to Meta ads from your own server.

Takes a Growth event on your server, checks that the person agreed to attribution and sharing with Meta, hashes their contact details and sends the event to the Meta Conversions API. It answers with whether it was sent and a record of the decision. You need a Meta dataset id and an access token, and nothing can call it from a device.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it to report sign-ups, purchases and other conversions to Meta for ad measurement. It only runs on your server and only sends events for people who have given consent.

## Install

```sh
despia add Core/Growth/Modules/MetaConversions
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

`dsx.module.metaconversions.forward`

Sends one Growth event to Meta, but only if consent allows it. Events with no matching Meta event name are skipped, and the result always says what was decided.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `consent` | object | no | The consent recorded when the event was collected, used only when the identity record cannot answer. |
| `device` | object | no | Details of the phone for app events, such as its system and app version. |
| `device.adTrackingEnabled` | boolean | no | Whether the person allowed ad tracking on the device. |
| `device.appBuild` | string | no | The build number of the app that sent the event. |
| `device.appId` | string | no | The bundle id or package name of the app. |
| `device.appVersion` | string | no | The version of the app that sent the event. |
| `device.locale` | string | no | The phone's language and region setting. |
| `device.model` | string | no | The phone model, such as iPhone15,2. |
| `device.os` | string | no | The phone's operating system, such as ios or android. |
| `device.osVersion` | string | no | The operating system version. Meta requires it for app events. |
| `device.timezone` | string | no | The phone's time zone name. |
| `event` | object | yes | The Growth event to send, with its id, name, properties, time, session and source. |
| `event.anonymousId` | string | no | The anonymous visitor id, when the person is not signed in. |
| `event.at` | number | yes | When the event happened, as a Unix timestamp in milliseconds. |
| `event.event` | string | yes | The name of the event, such as purchase or registration. |
| `event.eventId` | string | yes | The unique id of the event. Meta uses it to avoid counting the same event twice. |
| `event.platform` | string | no | Where the event came from: ios, android or web. |
| `event.properties` | object | no | Extra details of the event, such as value, currency and product ids. |
| `event.sessionId` | string | no | The id of the app or web session the event happened in. |
| `event.source` | string | no | Which part of your system recorded the event. |
| `event.subject` | string | no | The signed-in person's id, when known. |
| `page` | object | no | Details of the page for web events. |
| `page.referrer` | string | no | The address of the page the person came from. |
| `page.url` | string | no | The address of the page where the event happened. |
| `user` | object | no | What your server knows about the person, such as email and phone. Contact details are hashed before they are sent. |
| `user.clickIds` | object | no | Ad click ids you captured, such as Meta's fbc and fbp values. |
| `user.email` | string | no | The person's email address. It is trimmed, lower cased and hashed before sending. |
| `user.externalId` | string | no | Your own id for the person. It defaults to the signed-in subject and is hashed before sending. |
| `user.ip` | string | no | The person's IP address, sent to help Meta match the event. |
| `user.locale` | string | no | The person's language and region, such as en_US. |
| `user.phone` | string | no | The person's phone number with its country code. It is hashed before sending. |
| `user.userAgent` | string | no | The browser or app user agent string, sent to help Meta match the event. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `provenance` | object | yes | A record of what was decided about this event and why. |
| `provenance.adapter` | string | yes | The name of the forwarding adapter that made the decision. |
| `provenance.at` | string | yes | When the decision was made. |
| `provenance.consent` | object | yes | Which consent answer was used and what it said. |
| `provenance.decision` | string | yes | What happened: sent, skipped, rejected, retry or not_configured. |
| `provenance.eventId` | string | yes | The id of the event the decision is about. |
| `provenance.network` | string | yes | The ad network the event was meant for. |
| `provenance.rule` | string | yes | The rule that led to the decision. |
| `provenance.vendorEvent` | string | yes | The Meta event name the event was mapped to, if any. |
| `sent` | boolean | yes | True when the event was accepted by Meta. |
| `skipped` | string | no | Why nothing was sent: unmapped, consent, or a reason from the Meta side. |
| `vendor` | object | no | A summary of Meta's answer, present when the event was sent. |
| `vendor.events_received` | number | yes | How many events Meta says it received. |
| `vendor.fbtrace_id` | string | yes | Meta's trace id, useful when asking Meta for support. |
| `vendor.status` | number | yes | The HTTP status code Meta returned. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The envelope is not an admitted Growth event (eventId, event, at), or an app event lacks device.osVersion. | Not recoverable by retrying. |
| `not_configured` | A setting this event needs is not set (META_PIXEL_ID, META_ACCESS_TOKEN), or the vendor refused the credentials; data.what names it. | Not recoverable by retrying. |
| `unavailable` | Transport, throttling or the vendor's own outage (data.verdict retry); retry with backoff. |  |
| `upstream` | The vendor rejected the event (data.verdict rejected, data.vendorCode its own code); resending the same event cannot help. | Not recoverable by retrying. |

**Example: Send a purchase event to Meta**

```js
const result = await dsx.module.metaconversions.forward({"event":{"at":1791500000000,"event":"purchase","eventId":"evt_1001","platform":"web","properties":{"currency":"USD","value":9.99},"sessionId":"sess_1","source":"web","subject":"user_123"},"page":{"url":"https://example.com/checkout"},"user":{"email":"ada@example.com"}});
// resolves {"provenance":{"adapter":"growth.metaconversions","consent":{"source":"identity","states":{"attribution":"granted","sharing:meta":"granted"}},"decision":"sent","eventId":"evt_1001","network":"meta","rule":"consent.identity: attribution + sharing:meta granted","vendorEvent":"Purchase"},"sent":true,"vendor":{"events_received":1,"fbtrace_id":"AbCdEf123","status":200}}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `access_token` | secret | `` | Events Manager, the dataset's Settings, Conversions API: Generate access token. It never leaves this server. |
| `api_version` | string | `` | Optional; empty is v25.0. |
| `event_map` | string | `` | Optional JSON object: app event name -> Meta event name, for events beyond registration, purchase, subscription, trial_started, view_content and add_to_cart. |
| `pixel_id` | string | `` | Events Manager, Data sources: the dataset that receives web and app events. |
| `test_event_code` | string | `` | Optional: Events Manager's Test events code; while set, events land in Test events only. |

## Related packages

- Needs: [Growth](/packages/growth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
