---
title: GoogleAdsConversions
description: Send purchases and sign-ups to Google Ads as conversions, from your server.
package: googleadsconversions
---

Send purchases and sign-ups to Google Ads as conversions, from your server.

Takes one tracked event and uploads it to Google Ads as a click conversion, matched by the ad click id or by a hashed email or phone number. It runs only on your own server, checks that the person agreed to share the data, and tells you whether the event was sent, skipped or refused. You supply your Google Ads credentials and say which conversion action each event maps to.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it to report conversions that happen outside the ad click, such as a server confirmed purchase, so Google Ads can measure your campaigns. Do not call it from the app itself: it is meant for your server, and it sends nothing without recorded consent.

## Install

```sh
despia add Core/Growth/Modules/GoogleAdsConversions
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

`dsx.module.googleadsconversions.forward`

Uploads one tracked event to Google Ads as a click conversion and reports whether it was sent, skipped or refused.

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
| `event.anonymousId` | string | no | Anonymous visitor id; it is never sent to Google. |
| `event.at` | number | yes | When the event happened, as a time in milliseconds. |
| `event.event` | string | yes | Name of the event, such as a purchase; it selects the conversion action. |
| `event.eventId` | string | yes | Unique id of the event; Google uses it to avoid counting the same conversion twice. |
| `event.platform` | string | no | Where the event came from, such as ios, android or web. |
| `event.properties` | object | no | Extra event data such as order id, value and currency. |
| `event.sessionId` | string | no | Id of the app or web session in which the event was recorded. |
| `event.source` | string | no | Which part of your system recorded the event. |
| `event.subject` | string | no | Id of the signed-in person the event belongs to. |
| `page` | object | no | Details of the page for web events. |
| `page.referrer` | string | no | Address of the page the visitor came from. |
| `page.url` | string | no | Address of the page where the event happened. |
| `user` | object | no | What your server knows about the person; email and phone are hashed before they are sent. |
| `user.clickIds` | object | no | Ad click ids such as gclid, gbraid or wbraid; at least one id or an email or phone is needed to match. |
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
| `sent` | boolean | yes | True when Google Ads accepted the conversion. |
| `skipped` | string | no | The reason nothing was sent, such as consent, no_match_key or no mapped conversion action. |
| `vendor` | object | no | Google's own answer for a sent conversion. |
| `vendor.jobId` | string | yes | Google's job id for the upload, when it gives one. |
| `vendor.results` | number | yes | How many conversions Google reported back. |
| `vendor.status` | number | yes | The HTTP status Google returned. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The call did not contain a valid tracked event. | Fix the caller so it passes a complete event. |
| `not_configured` | A required setting is missing, or Google refused the credentials. | Fill in the Google Ads settings of your deployment and check the refresh token, then retry. |
| `unavailable` | Google Ads could not be reached or is throttling requests. | Retry later with a growing delay. |
| `upstream` | Google Ads refused this conversion. | Drop the event; sending the same data again will not help. |

**Example: Upload a purchase as a Google Ads click conversion**

```js
const result = await dsx.module.googleadsconversions.forward({"consent":{"attribution":"granted","sharing:google_ads":"granted"},"event":{"at":1760000000000,"event":"purchase","eventId":"evt_1001","platform":"ios","properties":{"currency":"USD","orderId":"ord_77","value":19.99}},"user":{"clickIds":{"gclid":"Cj0KCQiA-example"},"email":"ada@example.com"}});
// resolves {"provenance":{"adapter":"growth.googleadsconversions","at":"2026-10-09T10:15:00.000Z","consent":{"source":"event","states":{"attribution":"granted","sharing:google_ads":"granted"}},"decision":"sent","eventId":"evt_1001","network":"google_ads","rule":"consent.event: attribution + sharing:google_ads granted","vendorEvent":"customers/1234567890/conversionActions/987654321"},"sent":true,"vendor":{"jobId":"job-1001","results":1,"status":200}}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `api_version` | string | `` | Optional Google Ads API version to call; leave empty to use the package default, v25. |
| `client_id` | string | `` | The Google Cloud OAuth client the refresh token was issued to. |
| `client_secret` | secret | `` | That OAuth client's secret. It never leaves this server. |
| `conversion_actions` | string | `` | JSON object: Despia concept or app event name -> conversion action id or resource name (customers/<id>/conversionActions/<id>). |
| `customer_id` | string | `` | The Google Ads account that owns the conversion actions (dashes allowed). |
| `developer_token` | secret | `` | Google Ads API Center (a manager account). It must have uploaded offline or enhanced conversions before 2026-06-15, or Google refuses UploadClickConversions. |
| `login_customer_id` | string | `` | Optional: the manager account the call is made through. |
| `refresh_token` | secret | `` | A refresh token with the https://www.googleapis.com/auth/adwords scope. It never leaves this server. |
| `validate_only` | string | `` | Optional: true makes Google validate the upload without recording it. |

## Related packages

- Needs: [Growth](/packages/growth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
