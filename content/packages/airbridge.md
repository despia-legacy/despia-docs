---
title: Airbridge
description: Attribute installs to ad campaigns and open deep links with Airbridge.
package: airbridge
---

Attribute installs to ad campaigns and open deep links with Airbridge.

Starts the Airbridge SDK at launch, reports which campaign led to an install and handles deferred deep links, so a new user lands on the right screen. It can wait for the iOS tracking permission decision. Needs an Airbridge account, your app name and app SDK token. Phones only.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it when you buy ads and want to know which campaign produced each install and sale, and to send new users to the right screen through deferred deep links. Skip it if you do not use Airbridge.

## What native adds

The native SDK reads install referrers and iOS attribution data that a web page cannot, and it survives the store install.

## Install

```sh
despia add Core/Airbridge
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone.

## Actions

### clearDeviceAlias

`dsx.module.airbridge.clearDeviceAlias`

Removes every alias that was set for this device.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: clears every device alias**

```js
const result = await dsx.module.airbridge.clearDeviceAlias({});
```

### clearUser

`dsx.module.airbridge.clearUser`

Removes all user information from Airbridge in one call.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: clears the whole user identity**

```js
const result = await dsx.module.airbridge.clearUser({});
```

### clearUserAlias

`dsx.module.airbridge.clearUserAlias`

Removes every alias from the person.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: clears every user alias**

```js
const result = await dsx.module.airbridge.clearUserAlias({});
```

### clearUserAttributes

`dsx.module.airbridge.clearUserAttributes`

Removes every custom attribute from the person.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: clears every user attribute**

```js
const result = await dsx.module.airbridge.clearUserAttributes({});
```

### clearUserEmail

`dsx.module.airbridge.clearUserEmail`

Removes the person's email from Airbridge.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: clears the user email**

```js
const result = await dsx.module.airbridge.clearUserEmail({});
```

### clearUserId

`dsx.module.airbridge.clearUserId`

Removes the user id from Airbridge, for example after sign-out.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: clears the user id**

```js
const result = await dsx.module.airbridge.clearUserId({});
```

### clearUserPhone

`dsx.module.airbridge.clearUserPhone`

Removes the person's phone number from Airbridge.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: clears the user phone number**

```js
const result = await dsx.module.airbridge.clearUserPhone({});
```

### clickTrackingLink

`dsx.module.airbridge.clickTrackingLink`

Records a click on an Airbridge tracking link so the visit is attributed to its campaign.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `url` | string | yes | The Airbridge tracking link that was clicked. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `click_failed` | The tracking link click could not be recorded, usually because of the network. | Try again when the device is back online. |
| `invalid_link` | The link is not one of this app's Airbridge tracking links. | Use a tracking link from your Airbridge dashboard. |
| `missing_param` | A parameter the action needs is missing or has the wrong type. | Pass the missing parameter and call again. |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |

**Example: tracks a click on a tracking link**

```js
const result = await dsx.module.airbridge.clickTrackingLink({"url":"https://myapp.airbridge.io/c/abc"});
```

### disableSdk

`dsx.module.airbridge.disableSdk`

Switches the Airbridge SDK off so it records nothing.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |

**Example: disables the SDK**

```js
const result = await dsx.module.airbridge.disableSdk({});
```

### enableSdk

`dsx.module.airbridge.enableSdk`

Switches the Airbridge SDK back on after it was disabled.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |

**Example: enables the SDK**

```js
const result = await dsx.module.airbridge.enableSdk({});
```

### logout

`dsx.module.airbridge.logout`

Clears the signed-in person's details from Airbridge when they sign out.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: logs out (alias of clearUser)**

```js
const result = await dsx.module.airbridge.logout({});
```

### removeDeviceAlias

`dsx.module.airbridge.removeDeviceAlias`

Removes one device alias by its name.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The name of the alias or attribute. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A parameter the action needs is missing or has the wrong type. | Pass the missing parameter and call again. |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: removes a device alias by key**

```js
const result = await dsx.module.airbridge.removeDeviceAlias({"key":"fleet"});
```

### removeUserAlias

`dsx.module.airbridge.removeUserAlias`

Removes one alias from the person by its name.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The name of the alias or attribute. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A parameter the action needs is missing or has the wrong type. | Pass the missing parameter and call again. |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: removes a user alias by key**

```js
const result = await dsx.module.airbridge.removeUserAlias({"key":"crm_id"});
```

### removeUserAttribute

`dsx.module.airbridge.removeUserAttribute`

Removes one custom attribute from the person by its name.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The name of the alias or attribute. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A parameter the action needs is missing or has the wrong type. | Pass the missing parameter and call again. |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: removes a user attribute by key**

```js
const result = await dsx.module.airbridge.removeUserAttribute({"key":"plan"});
```

### setDeviceAlias

`dsx.module.airbridge.setDeviceAlias`

Adds a named alias for this device in Airbridge.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The name of the alias or attribute. |
| `value` | string | yes | The value to store under that name. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A parameter the action needs is missing or has the wrong type. | Pass the missing parameter and call again. |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: sets a device alias**

```js
const result = await dsx.module.airbridge.setDeviceAlias({"key":"fleet","value":"unit_7"});
```

### setUserAlias

`dsx.module.airbridge.setUserAlias`

Adds a named alias for the person, such as an id from another system.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The name of the alias or attribute. |
| `value` | string | yes | The value to store under that name. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A parameter the action needs is missing or has the wrong type. | Pass the missing parameter and call again. |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: sets a user alias**

```js
const result = await dsx.module.airbridge.setUserAlias({"key":"crm_id","value":"abc123"});
```

### setUserAttribute

`dsx.module.airbridge.setUserAttribute`

Adds a custom attribute to the person, such as a plan name, that you can segment on in Airbridge.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The name of the alias or attribute. |
| `value` | string | yes | The value to store under that name. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A parameter the action needs is missing or has the wrong type. | Pass the missing parameter and call again. |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: sets a user attribute**

```js
const result = await dsx.module.airbridge.setUserAttribute({"key":"plan","value":"pro"});
```

### setUserEmail

`dsx.module.airbridge.setUserEmail`

Sets the person's email for Airbridge, hashed on the device by default.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `email` | string | yes | The person's email address. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A parameter the action needs is missing or has the wrong type. | Pass the missing parameter and call again. |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: accepts a user email**

```js
const result = await dsx.module.airbridge.setUserEmail({"email":"user@example.com"});
```

### setUserId

`dsx.module.airbridge.setUserId`

Tells Airbridge who the signed-in person is by your own user id.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | Your id for the signed-in person. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A parameter the action needs is missing or has the wrong type. | Pass the missing parameter and call again. |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: accepts a user id**

```js
const result = await dsx.module.airbridge.setUserId({"id":"u_12345"});
```

### setUserPhone

`dsx.module.airbridge.setUserPhone`

Sets the person's phone number for Airbridge, hashed on the device by default.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `phone` | string | yes | The person's phone number. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A parameter the action needs is missing or has the wrong type. | Pass the missing parameter and call again. |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: accepts a user phone number**

```js
const result = await dsx.module.airbridge.setUserPhone({"phone":"+15551234567"});
```

### startTracking

`dsx.module.airbridge.startTracking`

Starts sending Airbridge events, for example after the person agrees to tracking.

**When to use it.** Use it when you turned off automatic tracking to wait for consent.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: starts event tracking**

```js
const result = await dsx.module.airbridge.startTracking({});
```

### stopTracking

`dsx.module.airbridge.stopTracking`

Stops sending Airbridge events, for example when the person withdraws consent.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: stops event tracking**

```js
const result = await dsx.module.airbridge.stopTracking({});
```

### trackEvent

`dsx.module.airbridge.trackEvent`

Records an event such as a purchase or a sign-up in Airbridge, with an optional action, label, value and extra details.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `action` | string | no | The action within the category. |
| `category` | string | yes | The event category, such as a standard Airbridge event name. |
| `label` | string | no | A label to describe the event. |
| `semantics` | object | no | Extra standard fields Airbridge understands, such as currency or product list. |
| `value` | number | no | A number tied to the event, such as an amount. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |
| `unavailable` | The Airbridge SDK is present but refused the call. | Try again, and check the SDK is running. |

**Example: tracks a categorized event**

```js
const result = await dsx.module.airbridge.trackEvent({"category":"purchase","value":9.99});
```

### trackImpression

`dsx.module.airbridge.trackImpression`

Records that an Airbridge tracking link was shown, so ad views can be counted.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `url` | string | yes | The Airbridge tracking link that was shown. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Airbridge accepted the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `impression_failed` | The tracking link impression could not be recorded, usually because of the network. | Try again when the device is back online. |
| `invalid_link` | The link is not one of this app's Airbridge tracking links. | Use a tracking link from your Airbridge dashboard. |
| `missing_param` | A parameter the action needs is missing or has the wrong type. | Pass the missing parameter and call again. |
| `not_configured` | Airbridge has no app name and app token yet, so it is switched off. | Set the app name and app token in the Airbridge settings and rebuild. |

**Example: tracks an impression on a tracking link**

```js
const result = await dsx.module.airbridge.trackImpression({"url":"https://myapp.airbridge.io/i/abc"});
```

## Events

Read with `dsx.on(name, handler)`.

### deeplink

Fires when the SDK resolves a deep link, including the deferred link from before the install.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `deferred` | boolean | yes | True when the link came from before the app was installed. |
| `url` | string | yes | The deep link that was resolved. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `app_name` | string | `` | Your Airbridge app name from the Airbridge dashboard. |
| `app_token` | string | `` | Your Airbridge app SDK token from the Airbridge dashboard. |
| `associated_domains` | list | `[]` | Airbridge tracking-link domains that should open the app directly (universal links). |
| `auto_determine_tracking_authorization` | boolean | `true` | Hold the first events until the App Tracking Transparency prompt is answered, so the IDFA is attached. |
| `auto_start_tracking` | boolean | `true` | Start tracking automatically, or wait for user consent before any event is sent. |
| `event_transmit_interval_seconds` | number | `0` | How long the SDK batches events before sending them. |
| `hash_user_information` | boolean | `true` | Hash the user email and phone number before they leave the device. |
| `log_level` | string | `warning` | How verbose the Airbridge SDK logs are during integration. |
| `sdk_signature_id` | string | `` | Airbridge SDK signature ID, if your app enforces SDK signatures. |
| `sdk_signature_secret` | secret | `` | Airbridge SDK signature secret, paired with the signature ID. |
| `session_timeout_seconds` | number | `300` | How long the app can be backgrounded before a new Airbridge session starts. |
| `track_airbridge_deeplink_only` | boolean | `false` | Only record deep link opens that come from Airbridge tracking links. |
| `track_meta_deferred_app_link` | boolean | `false` | Resolve deferred deep links that originate from Meta (Facebook/Instagram) ads. |
| `tracking_authorization_timeout_seconds` | number | `30` | Longest the SDK waits for the App Tracking Transparency decision before sending events anyway. |
| `tracking_link_custom_domains` | list | `[]` | Extra (branded) domains Airbridge should recognize as tracking links. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
