---
title: SnapConversions
description: Send purchases and sign-ups to Snapchat as conversions, from your server.
package: snapconversions
---

Send purchases and sign-ups to Snapchat as conversions, from your server.

Takes one tracked event and sends it to the Snap Conversions API, with email and phone hashed first and only when the person agreed. It runs on your own server and tells you whether the event was sent, skipped or refused. You supply your Snap token and ids, and may map your own events to Snap events.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it to report conversions to Snapchat so your Snap campaigns can be measured, such as a confirmed purchase. Call it from your server only; it has no public route and sends nothing without recorded consent.

## Install

```sh
despia add Core/Growth/Modules/SnapConversions
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

`dsx.module.snapconversions.forward`

Sends one tracked event to the Snap Conversions API and reports whether it was sent, skipped or refused.

**When to use it.** Call it from a server workflow or queue each time an event you want counted as a conversion is recorded.

**When not to.** Do not call it from a device; there is no public route, so a conversion cannot be injected from outside your server.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `consent` | object | no | What the person agreed to when the event was recorded; read only when no consent record can be looked up. |
| `device` | object | no | Details of the device for app events. |
| `device.adTrackingEnabled` | boolean | no | Whether the person allowed ad tracking on the device. |
| `device.appBuild` | string | no | Build number of the app that recorded the event. |
| `device.appId` | string | no | Bundle or package id of the app. |
| `device.appVersion` | string | no | Version number of the app that recorded the event. |
| `device.locale` | string | no | Language and region set on the device. |
| `device.model` | string | no | Model name of the device, such as iPhone15,2. |
| `device.os` | string | no | Name of the device operating system, such as iOS. |
| `device.osVersion` | string | no | Version of the device operating system. |
| `device.timezone` | string | no | Time zone set on the device. |
| `event` | object | yes | The tracked event to forward, with its id, name, properties and time. |
| `event.anonymousId` | string | no | Anonymous visitor id; it is never sent to Snap. |
| `event.at` | number | yes | When the event happened, as a time in milliseconds. |
| `event.event` | string | yes | Name of the event, such as a purchase; it is mapped to a Snap standard event. |
| `event.eventId` | string | yes | Unique id of the event; Snap uses it to avoid counting the same conversion twice. |
| `event.platform` | string | no | Where the event came from, such as ios, android or web. |
| `event.properties` | object | no | Extra event data such as order id, value and currency. |
| `event.sessionId` | string | no | Id of the app or web session in which the event was recorded. |
| `event.source` | string | no | Which part of your system recorded the event. |
| `event.subject` | string | no | Id of the signed-in person the event belongs to. |
| `page` | object | no | Details of the page for web events. |
| `page.referrer` | string | no | Address of the page the visitor came from. |
| `page.url` | string | no | Address of the page where the event happened. |
| `user` | object | no | What your server knows about the person; email and phone are hashed before they are sent. |
| `user.clickIds` | object | no | Ad click ids such as sccid; sending one helps Snap match the conversion to an ad. |
| `user.email` | string | no | The person's email address, hashed before sending. |
| `user.externalId` | string | no | Your own id for the person. |
| `user.ip` | string | no | The person's IP address. |
| `user.locale` | string | no | The person's language and region. |
| `user.phone` | string | no | The person's phone number in international format, hashed before sending. |
| `user.userAgent` | string | no | The browser or app user agent string. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `provenance` | object | yes | A record of the decision, kept by you for audit. |
| `provenance.adapter` | string | yes | Which forwarding package made the decision. |
| `provenance.at` | string | yes | When the decision was made. |
| `provenance.consent` | object | yes | Which consent answer was used and where it came from. |
| `provenance.decision` | string | yes | What was decided: sent, skipped, rejected, retry or not_configured. |
| `provenance.eventId` | string | yes | The id of the event the decision is about. |
| `provenance.network` | string | yes | The ad network the event was sent to. |
| `provenance.rule` | string | yes | The reason behind the decision, such as the consent answer or the missing setting. |
| `provenance.vendorEvent` | string | yes | The conversion action the event was mapped to. |
| `sent` | boolean | yes | True when Snap accepted the event. |
| `skipped` | string | no | The reason nothing was sent, such as consent, no_match_key or no mapped conversion action. |
| `vendor` | object | no | Snap's own answer for a sent event. |
| `vendor.result` | string | yes | Snap's own short answer for the event. |
| `vendor.status` | number | yes | The HTTP status Snap returned. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The call did not contain a valid tracked event, or an app event lacks the operating system version. | Fix the caller so it passes a complete event. |
| `not_configured` | A required Snap setting is missing, or Snap refused the credentials. | Fill in the Snap settings of your deployment, then retry. |
| `unavailable` | Snap could not be reached or is throttling requests. | Retry later with a growing delay. |
| `upstream` | Snap refused this event, so sending the same data again will not help. | Drop the event. |

**Example: Send a purchase to the Snap Conversions API**

```js
const result = await dsx.module.snapconversions.forward({"consent":{"attribution":"granted","sharing:snap":"granted"},"event":{"at":1760000000000,"event":"purchase","eventId":"evt_1001","platform":"ios","properties":{"currency":"USD","orderId":"ord_77","value":19.99}},"user":{"clickIds":{"sccid":"snap-click-id"},"email":"ada@example.com"}});
// resolves {"provenance":{"adapter":"growth.snapconversions","at":"2026-10-09T10:15:00.000Z","consent":{"source":"event","states":{"attribution":"granted","sharing:snap":"granted"}},"decision":"sent","eventId":"evt_1001","network":"snap","rule":"consent.event: attribution + sharing:snap granted","vendorEvent":"PURCHASE"},"sent":true,"vendor":{"result":"VALID","status":200}}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `access_token` | secret | `` | Snap Ads Manager, Business Details: the Conversions API token. It never leaves this server. |
| `app_id` | string | `` | The Snap App ID app events are reported under (action_source MOBILE_APP). |
| `event_map` | string | `` | Optional JSON object: app event name -> Snap event name. |
| `pixel_id` | string | `` | The Snap Pixel web events are reported under (action_source WEB). |

## Related packages

- Needs: [Growth](/packages/growth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
