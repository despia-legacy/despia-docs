---
title: Meta Audience Network
description: Show full-screen Meta Audience Network ads in your app.
package: metaads
---

Show full-screen Meta Audience Network ads in your app.

Gets a bidder token from the device and shows a full-screen ad once your own bidding server returns the winning ad. Audience Network only works through server bidding, so you need that backend. Needs a Meta Audience Network account and your placement ID.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when you sell full-screen ads through Meta Audience Network and already run a bidding server. It does nothing without your own server that returns a fresh winning bid for every ad.

## What native adds

Meta's native ad SDK draws the full-screen ad and reports the device bidder token, which a web page cannot produce.

## Install

```sh
despia add Core/MetaAudienceNetwork
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

Device classes: phone.

## Actions

### bidderToken

`dsx.module.metaads.bidderToken`

Prepares the Meta ad SDK and returns the device token that your bidding server needs to run an auction.

**When to use it.** Call it before each auction, after your app's ad privacy flow is complete. Send the token to your server over a secure connection.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `privacy_ready` | boolean | yes | Must be true to confirm that the person has been through your app's ad privacy flow; it is checked on every call. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bidder_token` | string | yes | The device token to send to your bidding server. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bidder_token_busy` | Too many Meta bidder-token requests are already running. |  |
| `bidder_token_too_large` | The bidder token Meta returned exceeds the size this bridge will carry. | Not recoverable by retrying. |
| `bidder_token_unavailable` | Meta Audience Network did not provide a bidder token. |  |
| `disabled` | Meta ads are switched off for this app (use_facebook_ads) or suppressed by App Tracking policy. | Not recoverable by retrying. |
| `module_unavailable` | The Meta ads package was torn down while SDK initialization was in flight. |  |
| `not_ready` | Meta Audience Network has not received an application context yet, so the SDK cannot be initialized. |  |
| `privacy_not_ready` | Complete the app's ad privacy flow before requesting a bidder token. |  |
| `sdk_init_busy` | Too many Meta actions are already waiting for SDK initialization. |  |
| `sdk_init_failed` | Meta Audience Network failed to initialize. Relaunch the app before trying again. | Not recoverable by retrying. |
| `sdk_init_timeout` | Meta Audience Network initialization timed out. Relaunch the app before trying again. | Not recoverable by retrying. |

**Example: returns a fresh device bidder token after the app privacy flow**

```js
const result = await dsx.module.metaads.bidderToken({"privacy_ready":true});
// resolves {"bidder_token":"opaque-device-token"}
```

### interstitial

`dsx.module.metaads.interstitial`

Shows a full-screen Meta ad using the winning bid your server returned.

**When to use it.** Use it at a natural pause in your app, after bidderToken and a fresh server auction. A bid cannot be reused or queued.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bid_payload` | string | yes | The fresh winning bid your server got from Meta for this ad. |
| `privacy_ready` | boolean | yes | Must be true to confirm that the person has been through your app's ad privacy flow; it is checked on every call. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `shown` | boolean | yes | True once the ad was shown on screen. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `ad_create_failed` | Meta Audience Network could not create the interstitial for that placement. |  |
| `ad_load_failed` | Meta Audience Network failed to load the interstitial. The bid is spent; run a new auction. | Not recoverable by retrying. |
| `bid_payload_too_large` | The Meta bid payload exceeds the size this bridge will carry. | Not recoverable by retrying. |
| `busy` | A Meta interstitial is already loading or presenting. |  |
| `disabled` | Meta ads are switched off for this app (use_facebook_ads) or suppressed by App Tracking policy. | Not recoverable by retrying. |
| `missing_bid_payload` | A fresh server-side Meta bid payload is required; this package never caches or infers one. |  |
| `no_presenter` | No foreground screen was available to present the Meta interstitial. The bid is spent; run a new auction. | Not recoverable by retrying. |
| `not_configured` | facebook_ads_id is empty, so there is no placement to present. | Not recoverable by retrying. |
| `not_ready` | Meta Audience Network has not received an application context yet. |  |
| `privacy_not_ready` | Complete the app's ad privacy flow before presenting a Meta ad. |  |
| `sdk_not_ready` | Request a bidder token before starting the server auction: a single-use bid is never queued behind cold SDK initialization. |  |
| `show_failed` | The Meta interstitial could not be presented. The bid is spent; run a new auction. | Not recoverable by retrying. |
| `timeout` | The Meta interstitial did not load in time. The bid is spent; run a new auction. | Not recoverable by retrying. |

**Example: consumes one fresh privacy-approved server-side bid and shows the interstitial**

```js
const result = await dsx.module.metaads.interstitial({"bid_payload":"opaque-server-bid","privacy_ready":true});
// resolves {"shown":true}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `facebook_ads_id` | string | `` | Your Meta Audience Network interstitial placement ID. A placement ID does not replace the required server-side bid payload. |
| `fb_ads_trigger_urls` | list | `[]` | Reserved for a future trigger-time bid provider. Action-only bidding never loads an ad from a stored URL trigger. |
| `use_facebook_ads` | boolean | `false` | Enable action-only Meta Audience Network bidding. Every interstitial call requires current privacy approval and a fresh server-side bid payload. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
