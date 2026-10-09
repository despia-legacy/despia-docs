---
title: AppsFlyer
description: Attribute installs and purchases to ad campaigns with AppsFlyer.
package: appsflyer
---

Attribute installs and purchases to ad campaigns with AppsFlyer.

Starts the AppsFlyer SDK at launch, logs in-app events and ad revenue, reports where an install came from and resolves OneLink deep links into your app. Does nothing until a dev key is set. Needs an AppsFlyer account, your dev key and, on iOS, your Apple app ID.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when you buy ads and need to know which campaign produced an install or a purchase. It does nothing until you set your AppsFlyer dev key.

## What native adds

The native SDK matches installs to ad clicks and resolves OneLink deep links at the moment the app opens, which a web page cannot do.

## Install

```sh
despia add Core/AppsFlyer
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

## Actions

### get_attribution

`dsx.module.appsflyer.get_attribution`

Returns where this install came from: the ad network, campaign, ad and deep link details AppsFlyer recorded.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attribution` | object | yes | The attribution record. Fields AppsFlyer did not report are missing. |
| `attribution.ad` | string | no | The ad or creative name. |
| `attribution.ad_id` | string | no | The id of the ad that drove the install. |
| `attribution.ad_set` | string | no | The ad set or ad group name. |
| `attribution.ad_set_id` | string | no | The id of the ad set that drove the install. |
| `attribution.affiliate_code` | string | no | The affiliate code that referred the install. |
| `attribution.apps_flyer_uid` | string | no | The AppsFlyer id of this device install. |
| `attribution.c` | string | no | The AppsFlyer campaign parameter, as sent in the link. |
| `attribution.campaign` | string | no | The name of the campaign that drove the install. |
| `attribution.campaign_id` | string | no | The id of the campaign that drove the install. |
| `attribution.channel` | string | no | The channel within the media source. |
| `attribution.click_id` | string | no | The id of the ad click that led to the install. |
| `attribution.click_time` | string | no | When the ad was clicked. |
| `attribution.cost_currency` | string | no | The currency in which the install cost is given. |
| `attribution.cost_model` | string | no | How the ad was paid for, for example CPI. |
| `attribution.cost_value` | string | no | The cost of the install, as reported by the ad network. |
| `attribution.deep_link_sub1` | string | no | The first extra value carried by the deep link. |
| `attribution.deep_link_sub2` | string | no | The second extra value carried by the deep link. |
| `attribution.deep_link_value` | string | no | The value your link asked the app to open. |
| `attribution.install_time` | string | no | When the app was installed. |
| `attribution.install_type` | string | no | How the install was matched, as reported by AppsFlyer. |
| `attribution.is_first_launch` | boolean | no | True on the first launch after install. |
| `attribution.is_organic` | boolean | no | True when the install was not attributed to an ad. |
| `attribution.media_source` | string | no | The ad network or source that brought the install. |
| `attribution.page_id` | string | no | The landing page id from the link. |
| `attribution.partner_name` | string | no | The partner that delivered the install, when there is one. |
| `attribution.pid` | string | no | The AppsFlyer media source parameter, as sent in the link. |
| `attribution.priest_name` | string | no | A custom link parameter, passed through as sent. |
| `attribution.raw` | object | no | The complete record AppsFlyer returned, with every field unchanged. |
| `attribution.site_id` | string | no | The id of the publisher site that showed the ad. |
| `attribution.utm_campaign` | string | no | The UTM campaign value from the link that was clicked. |
| `attribution.utm_content` | string | no | The UTM content value from the link that was clicked. |
| `attribution.utm_medium` | string | no | The UTM medium value from the link that was clicked. |
| `attribution.utm_source` | string | no | The UTM source value from the link that was clicked. |
| `attribution.utm_term` | string | no | The UTM term value from the link that was clicked. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | The AppsFlyer SDK is not running in this build. | Set the dev key in the package config, then rebuild. |
| `sdk_error` | The AppsFlyer SDK rejected the call. | Try again, and check the AppsFlyer dashboard if it keeps failing. |
| `unsupported_platform` | AppsFlyer's browser product has no equivalent for this call. | Use this call only on iOS and Android. |

**Example: returns the cached attribution**

```js
const result = await dsx.module.appsflyer.get_attribution({});
// resolves {"attribution":{"is_organic":true,"media_source":"organic"}}
```

### get_uid

`dsx.module.appsflyer.get_uid`

Returns the AppsFlyer id of this install, which you can send to your server to match it with AppsFlyer reports.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uid` | string | yes | The AppsFlyer id of this install. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | The AppsFlyer SDK is not running in this build. | Set the dev key in the package config, then rebuild. |
| `sdk_error` | The AppsFlyer SDK rejected the call. | Try again, and check the AppsFlyer dashboard if it keeps failing. |
| `unsupported_platform` | AppsFlyer's browser product has no equivalent for this call. | Use this call only on iOS and Android. |

**Example: returns the AppsFlyer uid**

```js
const result = await dsx.module.appsflyer.get_uid({});
// resolves {"uid":"1700000000000-1234567"}
```

### install

`dsx.module.appsflyer.install`

Gives the growth package this install's attribution as a normalised record, or nothing for organic installs.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `token` | string | no | Ignored. It exists only so the growth package can call every attribution source the same way. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `adGroup` | string | no | The ad set that referred the install. |
| `campaign` | string | no | The campaign that referred the install. |
| `creative` | string | no | The ad that referred the install. |
| `method` | string | yes | How the install was matched, always deterministic. |
| `referrer` | string | no | The media source that referred the install. |
| `source` | string | yes | The attribution source, always appsflyer. |

**Example: answers a paid install's touch**

```js
const result = await dsx.module.appsflyer.install({});
// resolves {"method":"deterministic","referrer":"tiktokglobal_int","source":"appsflyer"}
```

### logAdRevenue

`dsx.module.appsflyer.logAdRevenue`

Reports the money earned from showing one ad, so AppsFlyer can include ad revenue in your campaign return.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ad_platform` | string | yes | The ad network that paid, for example admob. |
| `ad_type` | string | no | The kind of ad, for example banner or interstitial. |
| `ad_unit_id` | string | no | The id of the ad unit that was shown. |
| `currency` | string | no | The currency code of the revenue, such as USD. |
| `revenue` | number | yes | The amount earned for the impression. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the revenue was reported. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_param` | An argument has a value the call cannot use. | Check the argument types and values. |
| `missing_param` | A required argument was not given. | Pass every required argument. |
| `not_configured` | The AppsFlyer SDK is not running in this build. | Set the dev key in the package config, then rebuild. |
| `sdk_error` | The AppsFlyer SDK rejected the call. | Try again, and check the AppsFlyer dashboard if it keeps failing. |

**Example: logs ad revenue**

```js
const result = await dsx.module.appsflyer.logAdRevenue({"ad_platform":"admob","currency":"USD","revenue":0.05});
// resolves {"ok":true}
```

### logEvent

`dsx.module.appsflyer.logEvent`

Records an in-app event, such as a purchase or sign-up, so AppsFlyer can credit it to the campaign that brought the user.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `event_name` | string | yes | The name of the in-app event, such as purchase or sign_up. |
| `event_values` | object | no | Extra details about the event, such as price or item, sent along with it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the event was handed to AppsFlyer. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required argument was not given. | Pass every required argument. |
| `not_configured` | The AppsFlyer SDK is not running in this build. | Set the dev key in the package config, then rebuild. |
| `sdk_error` | The AppsFlyer SDK rejected the call. | Try again, and check the AppsFlyer dashboard if it keeps failing. |

**Example: logs a named event**

```js
const result = await dsx.module.appsflyer.logEvent({"event_name":"purchase","event_values":{"value":9.99}});
// resolves {"ok":true}
```

### logout

`dsx.module.appsflyer.logout`

Clears your user id from AppsFlyer when the person signs out.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the id was cleared. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | The AppsFlyer SDK is not running in this build. | Set the dev key in the package config, then rebuild. |
| `sdk_error` | The AppsFlyer SDK rejected the call. | Try again, and check the AppsFlyer dashboard if it keeps failing. |
| `unsupported_platform` | AppsFlyer's browser product has no equivalent for this call. | Use this call only on iOS and Android. |

**Example: clears the customer user id**

```js
const result = await dsx.module.appsflyer.logout({});
// resolves {"ok":true}
```

### setConsent

`dsx.module.appsflyer.setConsent`

Records the person's privacy consent with AppsFlyer, and makes sure it is applied before the install is reported.

**When to use it.** Call it as soon as you know the person's consent choice, for people in regions that need consent.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ads_personalization` | boolean | no | True if the person agreed to personalised ads. |
| `has_consent` | boolean | no | True if the person agreed to data collection. |
| `is_gdpr` | boolean | no | True if the person is subject to GDPR. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the consent was recorded. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required argument was not given. | Pass every required argument. |
| `not_configured` | The AppsFlyer SDK is not running in this build. | Set the dev key in the package config, then rebuild. |
| `sdk_error` | The AppsFlyer SDK rejected the call. | Try again, and check the AppsFlyer dashboard if it keeps failing. |
| `unsupported_platform` | AppsFlyer's browser product has no equivalent for this call. | Use this call only on iOS and Android. |

**Example: sets GDPR consent**

```js
const result = await dsx.module.appsflyer.setConsent({"has_consent":true,"is_gdpr":true});
// resolves {"ok":true}
```

**Example: records a refusal of ad personalization separately from data-usage consent**

```js
const result = await dsx.module.appsflyer.setConsent({"ads_personalization":false,"has_consent":true,"is_gdpr":true});
// resolves {"ok":true}
```

### setEmail

`dsx.module.appsflyer.setEmail`

Gives AppsFlyer the person's email address, hashed, to improve matching of their activity.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `email` | string | yes | The person's email address. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the email was set. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required argument was not given. | Pass every required argument. |
| `not_configured` | The AppsFlyer SDK is not running in this build. | Set the dev key in the package config, then rebuild. |
| `sdk_error` | The AppsFlyer SDK rejected the call. | Try again, and check the AppsFlyer dashboard if it keeps failing. |
| `unsupported_platform` | AppsFlyer's browser product has no equivalent for this call. | Use this call only on iOS and Android. |

**Example: hashes and sets the email**

```js
const result = await dsx.module.appsflyer.setEmail({"email":"user@example.com"});
// resolves {"ok":true}
```

### setPhone

`dsx.module.appsflyer.setPhone`

Gives AppsFlyer the person's phone number, hashed, to improve matching of their activity.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `phone` | string | yes | The person's phone number. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the number was set. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required argument was not given. | Pass every required argument. |
| `not_configured` | The AppsFlyer SDK is not running in this build. | Set the dev key in the package config, then rebuild. |
| `sdk_error` | The AppsFlyer SDK rejected the call. | Try again, and check the AppsFlyer dashboard if it keeps failing. |
| `unsupported_platform` | AppsFlyer's browser product has no equivalent for this call. | Use this call only on iOS and Android. |

**Example: hashes and sets the phone**

```js
const result = await dsx.module.appsflyer.setPhone({"phone":"+15551234567"});
// resolves {"ok":true}
```

### setUserId

`dsx.module.appsflyer.setUserId`

Tells AppsFlyer your own id for the signed-in person so their events are tied together across devices.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `customer_user_id` | string | yes | Your own id for the person, such as their account id. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the id was set. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required argument was not given. | Pass every required argument. |
| `not_configured` | The AppsFlyer SDK is not running in this build. | Set the dev key in the package config, then rebuild. |
| `sdk_error` | The AppsFlyer SDK rejected the call. | Try again, and check the AppsFlyer dashboard if it keeps failing. |

**Example: sets the customer user id**

```js
const result = await dsx.module.appsflyer.setUserId({"customer_user_id":"u_12345"});
// resolves {"ok":true}
```

## Events

Read with `dsx.on(name, handler)`.

### deep_link

Fires when a OneLink or deferred deep link opens the app, or when an install is attributed.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `af_status` | string | no | AppsFlyer's status for the install, such as Organic or Non-organic. |
| `campaign` | string | no | The campaign that produced this link or install. |
| `deep_link_sub1` | string | no | The first extra value carried by the deep link. |
| `deep_link_sub2` | string | no | The second extra value carried by the deep link. |
| `deep_link_value` | string | no | The value your link asked the app to open. |
| `media_source` | string | no | The ad network or source of the link. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `apple_app_id` | string | `` | The app's numeric App Store ID used by AppsFlyer. |
| `debug_mode` | boolean | `false` | Verbose AppsFlyer SDK logging for integration testing. |
| `dev_key` | secret | `` | Your AppsFlyer developer key from the AppsFlyer dashboard. |
| `onelink_domains` | list | `["testlinknew.onelink.me","despia-demo.onelink.me"]` | Your OneLink domains, so those links go to AppsFlyer instead of opening in the app. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
