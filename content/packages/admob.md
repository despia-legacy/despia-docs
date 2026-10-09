---
title: Google AdMob
description: Show banner, interstitial, rewarded and native ads from Google AdMob.
package: admob
---

Show banner, interstitial, rewarded and native ads from Google AdMob.

Shows full-screen and rewarded ads on demand and places banner and native ads inside your screens, with the consent prompt for users who need it. You decide where and when ads appear. Needs a Google AdMob account, your AdMob App ID and an ad unit ID for each ad type you use.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it to earn money from ads: call show for interstitial, rewarded or app-open ads at natural pauses, and place banner and native ads in your layout. Do not use it on the web, where AdMob is not served, or in children's apps without setting the child-directed option.

## Install

```sh
despia add Core/AdMob
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

### inspector

`dsx.module.admob.inspector`

Opens Google's ad inspector so you can check your ad setup and test ads. It works on test devices only.

**When not to.** Do not offer it in a release build.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `closed` | boolean | yes | True when the inspector was shown and closed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `inspector_unavailable` | The ad inspector opens on test devices only. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find a screen to present the ad inspector from. |  |
| `not_ready` | The ads SDK has not started yet. |  |
| `unsupported_platform` | AdMob does not serve the web. An AdSense unit is a different account and a different policy surface. | Not recoverable by retrying. |

**Example: Open the ad inspector on a test device**

```js
const result = await dsx.module.admob.inspector({});
// resolves {"closed":true}
```

### privacyOptions

`dsx.module.admob.privacyOptions`

Shows Google's privacy options form, where the user can change their ad consent. Google requires a visible way to reach it when the status says it is required.

**When to use it.** Put it behind a Privacy settings row in your app.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `presented` | boolean | yes | True when the privacy options form was shown. |
| `required` | boolean | yes | True when Google requires you to offer this entry point in your settings. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_presenter` | Couldn't find a screen to present the privacy options form from. |  |
| `present_failed` | The privacy options form couldn't be presented. |  |
| `unsupported_platform` | AdMob's privacy options form is a UMP surface and UMP does not serve the web. | Not recoverable by retrying. |

**Example: presents the privacy options form when Google requires the entry point**

```js
const result = await dsx.module.admob.privacyOptions({});
// resolves {"presented":true,"required":true}
```

**Example: resolves truthfully rather than failing when no entry point is required**

```js
const result = await dsx.module.admob.privacyOptions({});
// resolves {"presented":false,"required":false}
```

### resetConsent

`dsx.module.admob.resetConsent`

Forgets the stored ad consent so the consent form is shown again on the next launch. Use it only for testing.

**When not to.** Never call it in a release version of your app.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `reset` | boolean | yes | True when the stored consent was cleared. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | AdMob does not serve the web. An AdSense unit is a different account and a different policy surface. | Not recoverable by retrying. |

**Example: Show the consent form again on the next launch**

```js
const result = await dsx.module.admob.resetConsent({});
// resolves {"reset":true}
```

### show

`dsx.module.admob.show`

Shows a full-screen ad and tells you whether it was shown and whether the user earned a reward.

**When to use it.** Call it at a natural break, such as between levels, or when the user chooses to watch for a reward.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `format` | string | yes | Which kind of ad to show: interstitial, rewarded, rewardedInterstitial or appOpen. |
| `ssv` | object | no | Details for server-side reward verification, a userId and customData for rewarded ads. |
| `unit` | string | no | The ad unit id to use; leave it out to use the one in the package settings. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `amount` | number | yes | The size of the reward, as set up in your AdMob account. |
| `earned` | boolean | yes | True when the user watched enough to earn the reward. |
| `format` | string | yes | The ad format that was shown. |
| `shown` | boolean | yes | True when the ad was shown to the user. |
| `type` | string | yes | The kind of reward, as named in your AdMob account. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `consent_pending` | Consent has not been resolved yet. |  |
| `consent_required` | A consent form is outstanding. Gather consent before showing an ad. |  |
| `invalid_format` | format is one of interstitial, rewarded, rewardedInterstitial, appOpen. | Not recoverable by retrying. |
| `missing_ad_unit` | This placement has no ad unit id. | Not recoverable by retrying. |
| `no_fill` | AdMob had no ad to show right now. | Carry on without the ad and try again later. |
| `no_presenter` | Couldn't find a screen to present the ad from. |  |
| `not_ready` | The ads SDK has not started yet. |  |
| `show_failed` | The ad failed to present. |  |
| `unsupported_platform` | AdMob does not serve the web. An AdSense unit is a different account and a different policy surface. | Not recoverable by retrying. |
| `withdrawn` | The page that asked for this ad is gone; it was not shown. | Not recoverable by retrying. |

**Example: Show a rewarded ad**

```js
const result = await dsx.module.admob.show({"format":"rewarded"});
// resolves {"amount":10,"earned":true,"format":"rewarded","shown":true,"type":"coins"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `app_open_id` | string | `ca-app-pub-3940256099942544/5575463023` | AdMob ad unit ID for app open ads (default is Google's test unit). |
| `ask_for_ad_consent` | boolean | `true` | Gather consent with Google's UMP form before the ads SDK starts and before any ad request. |
| `banner_id` | string | `ca-app-pub-3940256099942544/2934735716` | AdMob ad unit ID for banner ads (default is Google's test unit). |
| `child_directed` | boolean | `false` | Tag every ad request for child-directed treatment (COPPA). |
| `consent_debug` | string | `` | Test the consent form as if the device were in this region: EEA, regulated_us_state or other (empty: off). |
| `enable_interstitial_ads` | boolean | `false` | Keep one interstitial ad loaded for the whole app, so showing one is instant. |
| `enable_rewarded_ads` | boolean | `false` | Keep one rewarded ad loaded for the whole app, so showing one is instant. |
| `gad_app_id` | string | `ca-app-pub-3940256099942544~1458002511` | Your AdMob application ID from the Google AdMob console (the default is Google's test ID). |
| `interstitial_id` | string | `ca-app-pub-3940256099942544/4411468910` | AdMob ad unit ID for full-screen interstitial ads (default is Google's test unit). |
| `max_ad_content_rating` | string | `` | The highest content rating of ads this app may show: G, PG, T or MA (empty: no cap). |
| `native_id` | string | `ca-app-pub-3940256099942544/3986624511` | AdMob ad unit ID for native ads (default is Google's test unit). |
| `native_pool` | number | `2` | How many native ads per unit are kept loaded ahead for feed rows (0 turns the pool off). |
| `rewarded_id` | string | `ca-app-pub-3940256099942544/1712485313` | AdMob ad unit ID for rewarded ads (default is Google's test unit). |
| `rewarded_interstitial_id` | string | `ca-app-pub-3940256099942544/6978759866` | AdMob ad unit ID for rewarded interstitial ads (default is Google's test unit). |
| `skadnetwork_items` | json | `[{"SKAdNetworkIdentifier":"cstr6suwn9.skadnetwork"}]` | The SKAdNetwork identifiers of the ad networks that may serve this app. Without them iOS drops every SKAdNetwork postback for those networks. The default is Google's own identifier; add Google's selected third-party buyers (developers.google.com/admob/ios/3p-skadnetworks) as needed. |
| `test_devices` | list | `[]` | Hashed device IDs that receive test ads (the SDK logs the ID of the running device). |
| `under_age_of_consent` | boolean | `false` | Tag every ad request for users under the age of consent (GDPR). |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `consent_pending` | Consent has not been resolved yet. |  |
| `consent_required` | A consent form is outstanding. Gather consent before requesting an ad. |  |
| `no_presenter` | Couldn't find a screen to present the ad from. |  |
| `present_failed` | The ad couldn't be presented. |  |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
