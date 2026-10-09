---
title: Pushwoosh
description: Send push notifications to your app's users through Pushwoosh.
package: pushwoosh
---

Send push notifications to your app's users through Pushwoosh.

Registers each device with Pushwoosh and gives your app the device's subscription, your own user id and typed tags, so you can target pushes from the Pushwoosh dashboard. Use it when your team already runs its messaging on Pushwoosh. Needs a Pushwoosh account, your App ID and an API token.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when your team already sends its messages through Pushwoosh and you want each device registered, linked to your own user ids and tagged for targeting. If you do not use Pushwoosh, choose another push package.

## What native adds

Registration with the push services happens natively, so the device token reaches Pushwoosh without any web workaround.

## Install

```sh
despia add Core/Pushwoosh
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, desktop.

## Actions

### language.set

`dsx.module.pushwoosh.language.set`

Sets the language Pushwoosh uses to pick localized messages for this device; the device language is used by default.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `language` | string | yes | A two-letter ISO 639-1 language code such as de. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `language` | string | yes | The language code now in use. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required parameter was left out of the call. | Pass every required parameter, as listed for the action. |
| `not_configured` | The Pushwoosh App ID or API token has not been set to a real value in this build. | Enter your App ID and API token in the package settings and make a new build. |

**Example: sets the language**

```js
const result = await dsx.module.pushwoosh.language.set({"language":"fr"});
// resolves {"language":"fr"}
```

### login

`dsx.module.pushwoosh.login`

Links this device to your own user id so you can send to the person rather than to one device.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `externalId` | string | yes | Your own id for the signed-in user. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `externalId` | string | yes | Your user id for this device, or empty when anonymous. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required parameter was left out of the call. | Pass every required parameter, as listed for the action. |
| `not_configured` | The Pushwoosh App ID or API token has not been set to a real value in this build. | Enter your App ID and API token in the package settings and make a new build. |
| `unavailable` | Pushwoosh cannot do this yet, usually because the system notification permission or the device push token is not there. | Ask for notification permission first, wait for the token to arrive, then try again. |

**Example: logs in an external id**

```js
const result = await dsx.module.pushwoosh.login({"externalId":"u_12345"});
// resolves {"externalId":"u_12345"}
```

### logout

`dsx.module.pushwoosh.logout`

Unlinks your user id so the device becomes an anonymous Pushwoosh user again. Calling it when nobody is logged in is not an error.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `externalId` | string | yes | Your user id for this device, or empty when anonymous. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | The Pushwoosh App ID or API token has not been set to a real value in this build. | Enter your App ID and API token in the package settings and make a new build. |
| `unavailable` | Pushwoosh cannot do this yet, usually because the system notification permission or the device push token is not there. | Ask for notification permission first, wait for the token to arrive, then try again. |

**Example: logs out the current user**

```js
const result = await dsx.module.pushwoosh.logout({});
// resolves {"externalId":""}
```

### subscription.get

`dsx.module.pushwoosh.subscription.get`

Returns this device's Pushwoosh id, its push token and whether it is registered with Pushwoosh.

**When to use it.** Use it to show push status in settings. An empty token just means registration has not finished or the user has not allowed notifications yet.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The Pushwoosh hardware id for this device. |
| `optedIn` | boolean | yes | True when the device is registered with Pushwoosh. |
| `token` | string | yes | The push token Pushwoosh holds; empty until registration finishes. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | The Pushwoosh App ID or API token has not been set to a real value in this build. | Enter your App ID and API token in the package settings and make a new build. |

**Example: returns the subscription**

```js
const result = await dsx.module.pushwoosh.subscription.get({});
// resolves {"id":"00000000-0000-0000-0000-000000000000","optedIn":true,"token":"apns-token"}
```

**Example: an empty token with the SDK armed is not yet, not a failure**

```js
const result = await dsx.module.pushwoosh.subscription.get({});
// resolves {"id":"00000000-0000-0000-0000-000000000000","optedIn":false,"token":""}
```

### subscription.set

`dsx.module.pushwoosh.subscription.set`

Registers this device with Pushwoosh or unregisters it, without changing the system notification permission.

**When not to.** It does not ask the user for permission; ask through the notifications package first.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `optedIn` | boolean | yes | True to register this device with Pushwoosh, false to unregister it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The Pushwoosh hardware id for this device. |
| `optedIn` | boolean | yes | True when the device is registered with Pushwoosh. |
| `token` | string | yes | The push token Pushwoosh holds; empty until registration finishes. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required parameter was left out of the call. | Pass every required parameter, as listed for the action. |
| `not_configured` | The Pushwoosh App ID or API token has not been set to a real value in this build. | Enter your App ID and API token in the package settings and make a new build. |
| `unavailable` | Pushwoosh cannot do this yet, usually because the system notification permission or the device push token is not there. | Ask for notification permission first, wait for the token to arrive, then try again. |

**Example: opts out**

```js
const result = await dsx.module.pushwoosh.subscription.set({"optedIn":false});
// resolves {"id":"00000000-0000-0000-0000-000000000000","optedIn":false,"token":""}
```

### tags.get

`dsx.module.pushwoosh.tags.get`

Returns the tags Pushwoosh holds for this device.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `tags` | object | yes | The device's tags after the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | The Pushwoosh App ID or API token has not been set to a real value in this build. | Enter your App ID and API token in the package settings and make a new build. |
| `unavailable` | Pushwoosh cannot do this yet, usually because the system notification permission or the device push token is not there. | Ask for notification permission first, wait for the token to arrive, then try again. |

**Example: returns the tags**

```js
const result = await dsx.module.pushwoosh.tags.get({});
// resolves {"tags":{"plan":"pro"}}
```

### tags.remove

`dsx.module.pushwoosh.tags.remove`

Removes tags from this device by name and returns the tags afterward.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `keys` | array of string | yes | The names of the tags to remove. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `tags` | object | yes | The device's tags after the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required parameter was left out of the call. | Pass every required parameter, as listed for the action. |
| `not_configured` | The Pushwoosh App ID or API token has not been set to a real value in this build. | Enter your App ID and API token in the package settings and make a new build. |
| `unavailable` | Pushwoosh cannot do this yet, usually because the system notification permission or the device push token is not there. | Ask for notification permission first, wait for the token to arrive, then try again. |

**Example: removes a tag**

```js
const result = await dsx.module.pushwoosh.tags.remove({"keys":["plan"]});
// resolves {"tags":{}}
```

### tags.set

`dsx.module.pushwoosh.tags.set`

Adds or replaces tags on this device and returns the tags afterward. A value is a string, a number, a boolean or a list of strings.

**When to use it.** Use tags to build segments such as plan or level in the Pushwoosh dashboard.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `tags` | object | yes | An object of tag names and values; each value is a string, number, boolean or list of strings. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `tags` | object | yes | The device's tags after the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required parameter was left out of the call. | Pass every required parameter, as listed for the action. |
| `not_configured` | The Pushwoosh App ID or API token has not been set to a real value in this build. | Enter your App ID and API token in the package settings and make a new build. |
| `unavailable` | Pushwoosh cannot do this yet, usually because the system notification permission or the device push token is not there. | Ask for notification permission first, wait for the token to arrive, then try again. |

**Example: sets tags**

```js
const result = await dsx.module.pushwoosh.tags.set({"tags":{"level":3,"plan":"pro"}});
// resolves {"tags":{"level":3,"plan":"pro"}}
```

### user.get

`dsx.module.pushwoosh.user.get`

Returns the user id this device is currently linked to, or an empty value when anonymous.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `externalId` | string | yes | Your user id for this device, or empty when anonymous. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | The Pushwoosh App ID or API token has not been set to a real value in this build. | Enter your App ID and API token in the package settings and make a new build. |

**Example: returns the user**

```js
const result = await dsx.module.pushwoosh.user.get({});
// resolves {"externalId":"u_12345"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `api_token` | secret | `` | Your Pushwoosh device API token from the Pushwoosh control panel. |
| `app_id` | string | `XXXXX-XXXXX` | Your Pushwoosh application id, shown in the Pushwoosh dashboard, used to register devices. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
