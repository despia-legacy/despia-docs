---
title: Product analytics
description: Track what users do in your app and send it to the analytics tool you pick.
package: growth
---

Track what users do in your app and send it to the analytics tool you pick.

Records the events you declare, such as sign-ups or checkouts, plus first open and session start automatically, and forwards them in batches to one analytics destination. It keeps an anonymous per-install id until you identify the user, and can record where an install came from. Needs a destination from the list and that tool's project token.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it to measure sign-ups, purchases and where installs come from, and to send them to your analytics tool. If you only need crash reports or performance, use the monitoring packages instead.

## Install

```sh
despia add Core/Growth
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

### attribute

`dsx.module.growth.attribute`

Records where a user came from, for example a signed link, a referral code or the install referrer. The first accepted one is treated as the install source.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ad` | object | no | Details of an ad click, which Growth only passes on. |
| `ad.campaignId` | string | no | The ad network's id for the campaign. |
| `ad.clickId` | string | no | The click id the ad network added to the link. |
| `ad.clickIdType` | string | no | The kind of click id, such as gclid or ttclid. |
| `ad.network` | string | yes | The ad network that served the click. |
| `ad.token` | string | no | An unopened network token, passed on as it is. |
| `adGroup` | string | no | The ad group within the campaign. |
| `campaign` | string | no | The campaign name, if there is one. |
| `confidence` | number | no | For a probabilistic touch, how likely it is right, strictly between 0 and 1. |
| `creative` | string | no | The ad creative that was shown. |
| `link` | string | no | The link the user opened. |
| `method` | string | yes | How sure the source is: deterministic or probabilistic. |
| `referrer` | string | no | The referrer text, if the source gave one. |
| `source` | string | yes | Where the user came from, in lower case, such as signed_link or referral. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attributionId` | string | yes | An id for the recorded attribution touch. |
| `install` | boolean | yes | True if this touch became the install source. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `consent_denied` | Growth is off because the user has not given consent. | Ask for consent first, and do not record until it is granted. |
| `invalid_confidence` | A probabilistic touch must give a confidence strictly between 0 and 1. | Pass a number above 0 and below 1. |
| `invalid_field` | Campaign, ad group, creative, referrer and link must be text of at most 256 characters. | Shorten the value that is too long. |
| `invalid_method` | The method must be deterministic or probabilistic. | Use one of those two words. |
| `invalid_source` | The source must be lower case letters, digits, underscore, dot or dash, up to 64 characters. | Rename the source to follow that form. |
| `missing_param` | A required value was missing from the call. | Pass every value the action requires. |
| `not_configured` | Growth has no destination yet, so nothing can be recorded. | Call configure with a destination first. |
| `probabilistic_disallowed` | Probabilistic attribution is turned off for this project. | Turn on allow_probabilistic in the settings if you want it, or send a deterministic touch. |

**Example: Record a signed-link install**

```js
const result = await dsx.module.growth.attribute({"campaign":"spring_launch","method":"deterministic","source":"signed_link"});
// resolves {"attributionId":"att_01","install":true}
```

### configure

`dsx.module.growth.configure`

Turns on collection and chooses where events are sent. Nothing is recorded or sent until a destination is set, here or in the package settings.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `destination` | string | yes | The name of the analytics destination, from the destinations in your build. |
| `endpoint` | string | no | A custom server address, for destinations that allow one. |
| `token` | string | no | The project token for that destination. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `configured` | boolean | yes | True when the destination was set up. |
| `destination` | string | yes | The destination now in use. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_token` | That destination needs a project token, and none was given. | Pass the token from your analytics project. |
| `unknown_destination` | No destination with that name is in this build. | Add that destination package or use a name that exists. |

**Example: configures a declared destination**

```js
const result = await dsx.module.growth.configure({"destination":"mixpanel","token":"0123456789abcdef0123456789abcdef"});
// resolves {"configured":true,"destination":"mixpanel"}
```

### conversion

`dsx.module.growth.conversion`

Reports Apple's privacy-friendly ad attribution state for this install: the frameworks in use, the conversion window and the last value sent. Only iOS has this.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `coarse` | string | yes | The last coarse value sent: low, medium or high. |
| `fine` | number | yes | The last fine conversion value sent, from 0 to 63. |
| `frameworks` | array of string | yes | The Apple attribution frameworks available on this device. |
| `locked` | boolean | yes | True if the window is locked and no more values will be sent. |
| `updates` | number | yes | How many times a value has been sent. |
| `window` | number | yes | The current Apple conversion window. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_conversion_map` | The conversion setting must map event names to a fine value from 0 to 63 and a coarse value of low, medium or high. | Correct the conversion values in the package settings. |
| `unsupported_os` | Apple's conversion values need iOS 16.1 or newer. | Skip this call on older iOS versions. |
| `unsupported_platform` | Apple's conversion values exist only on iOS. | Skip this call on other platforms. |

**Example: Read the conversion state**

```js
const result = await dsx.module.growth.conversion({});
// resolves {"coarse":"medium","fine":12,"frameworks":["skadnetwork"],"locked":false,"updates":3,"window":1}
```

### flush

`dsx.module.growth.flush`

Sends the queued events now instead of waiting for the next batch.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `pending` | number | yes | How many events are still waiting. |
| `sent` | number | yes | How many events were sent. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `destination_unavailable` | The destination did not accept the batch. | The events stay queued; try again later. |

**Example: an empty queue sends nothing**

```js
const result = await dsx.module.growth.flush({});
// resolves {"pending":0,"sent":0}
```

### identify

`dsx.module.growth.identify`

Links this device's anonymous history to a signed-in user from now on, once the user has consented to collection.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `subject` | string | yes | Your own id for the signed-in user. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `subject` | string | yes | The user id now linked to this device. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `consent_denied` | Growth is off because the user has not given consent. | Ask for consent first, and do not record until it is granted. |
| `missing_param` | A required value was missing from the call. | Pass every value the action requires. |

**Example: identifies a subject**

```js
const result = await dsx.module.growth.identify({"subject":"user_42"});
// resolves {"subject":"user_42"}
```

### open_link

`dsx.module.growth.open_link`

Opens a signed deep link, checks that it is genuine and sends the user to the screen it names. A link that does not check out opens nothing.

**When to use it.** Use it for a link the user pasted or a screen carries; links opened by the system are handled automatically.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `code` | string | no | A short code from the link, as an alternative to the full url. |
| `url` | string | no | The full signed link that you want to open. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the link was valid and was opened. |
| `path` | string | yes | The in-app path that the link led to. |
| `route` | string | yes | The app route the link opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `destination_unavailable` | The link service did not answer. | Try again in a moment. |
| `expired_link` | That link has passed its expiry time. | Create a fresh link. |
| `invalid_link` | That link is not signed by this project's key, or it is damaged. | Create the link again with your signing key. |
| `missing_param` | A required value was missing from the call. | Pass every value the action requires. |
| `not_a_link` | That is not a link on this app's link domain. | Check the link domain in the package settings. |

**Example: Open a signed link**

```js
const result = await dsx.module.growth.open_link({"url":"https://example.com/l/abc.def"});
// resolves {"ok":true,"path":"/products/42","route":"product"}
```

### reset

`dsx.module.growth.reset`

Signs the user out of analytics: a new anonymous id is made and no user is linked, so the next person on the device is not tied to the last.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `anonymousId` | string | yes | The new anonymous id for this device. |

**Example: starts a new anonymous identity**

```js
const result = await dsx.module.growth.reset({});
// resolves {"anonymousId":"a-2"}
```

### track

`dsx.module.growth.track`

Records one event that you decide matters, such as a sign-up or a checkout. Events are queued on the device and sent in batches.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `event` | string | yes | The event name, in lower snake case, such as sign_up. |
| `properties` | object | no | Extra values to store with the event. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `eventId` | string | yes | An id you can use to refer to the recorded event. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `consent_denied` | Growth is off because the user has not given consent. | Ask for consent first, and do not record until it is granted. |
| `invalid_event` | An event name must be lower snake case, with optional dotted parts, up to 64 characters. | Rename the event to follow that form. |
| `invalid_properties` | Properties must be a JSON object and no key may start with a dollar sign. | Pass a plain object and rename any key that starts with a dollar sign. |
| `missing_param` | A required value was missing from the call. | Pass every value the action requires. |
| `not_configured` | Growth has no destination yet, so nothing can be recorded. | Call configure with a destination first. |

**Example: tracks a declared event**

```js
const result = await dsx.module.growth.track({"event":"checkout.started","properties":{"value":9.99}});
// resolves {"eventId":"e-1"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `adattributionkit_network_ids` | json | `[]` | Optional, iOS publisher apps: the ad networks that may show ads in this app, as a list of lower case ids (for example "example.adattributionkit"). |
| `allow_probabilistic` | boolean | `false` | Off by default: only deterministic touches (a signed link, an install referrer, a referral code) are admitted. Turn on only where your privacy rules permit matching on coarse device facts. |
| `attribution` | string | `` | Optional: the attribution row asked once for this install's touch (for example adjust). Empty means only touches the app reports through growth.attribute. |
| `attribution_report_endpoint` | string | `` | Optional, iOS: https://<your domain>. Apple then sends copies of winning postbacks to /.well-known/skadnetwork/report-attribution/ and /.well-known/appattribution/report-attribution/ on that domain, which growth.backend verifies. Apple uses only the registrable domain. |
| `auto_start` | boolean | `false` | Select the destination below at launch, the same explicit decision as calling growth.configure. |
| `conversion_values` | json | `{}` | Optional, iOS: your declared events mapped to Apple's ad attribution values, for example { "signup.completed": { "fine": 10, "coarse": "low" }, "purchase.completed": { "fine": 40, "coarse": "high", "lock": true } }. fine is 0 to 63, coarse is low, medium or high, lock finalises the conversion window. Empty is off. Growth sends only a rise, and app.first_open registers the install. |
| `destination` | string | `` | Retired spelling of `provider`; still read as the same choice. Set `provider` instead. |
| `endpoint` | string | `` | Optional: the destination's residency host or your own proxy. https, or http only to a local development host. |
| `link_domain` | string | `` | The domain your signed deep links live on, for example links.example.com. It must be one of your app's associated domains (dsx.config.domains), so universal links and Android App Links are registered for it. Never a Despia domain. |
| `link_public_key` | string | `` | The Ed25519 public key (base64url, 32 bytes) that verifies your signed deep links. The matching signing key stays on your own server; the device never holds it. |
| `provider` | string | `` | The provider package to send events to (for example mixpanel). |
| `skadnetwork_items` | json | `[]` | Optional, iOS publisher apps: the ad networks that may show ads in this app, as [{ "SKAdNetworkIdentifier": "<id>.skadnetwork" }], lower case, from each network. |
| `token` | string | `` | The destination's public project token. Never a secret key: secrets stay server-side (K8). |

## Related packages

- Used by: [Adjust](/packages/adjust), [Amplitude](/packages/amplitude), [Backend](/packages/growth-modules-backend), [Branch](/packages/branch), [Braze](/packages/braze), [CustomerIO](/packages/customerio), [GoogleAdsConversions](/packages/googleadsconversions), [MetaConversions](/packages/metaconversions), [Mixpanel](/packages/mixpanel), [PostHog](/packages/growth-modules-posthog), [RudderStack](/packages/rudderstack), [Segment](/packages/segment), [SnapConversions](/packages/snapconversions), [TikTokEvents](/packages/tiktokevents)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
