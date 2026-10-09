---
title: OneSignal
description: Send push notifications to your app's users through OneSignal.
package: onesignal
---

Send push notifications to your app's users through OneSignal.

Registers the device with OneSignal, asks for notification permission and links each device to your signed-in user, so you can send pushes from the OneSignal dashboard. Use it when your team already runs its messaging on OneSignal. Needs a OneSignal account and your OneSignal App ID.

## Set it up

1. Create an app in the [OneSignal dashboard](https://onesignal.com) and add your Apple push key and Firebase project.
2. Add **OneSignal** and paste your **OneSignal App ID**.
3. Build the app. The first launch registers the device; the permission prompt shows when your app asks for it.

## Settings

| Setting | What it does |
| --- | --- |
| OneSignal App ID | Your OneSignal application ID |
| Push enabled | Turns OneSignal push on or off |
| Open deeplink in browser | Opens a tapped notification's link in Safari instead of the app |

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Add it when your team already sends push, email and text messages from OneSignal and you want devices linked to your signed-in people. If you do not use OneSignal, use the plain notifications package.

## What native adds

Uses the real OneSignal SDK and the system push permission, so delivery, opt-in state and background handling are handled the native way.

## Install

```sh
despia add Core/OneSignal
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

### aliases.remove

`dsx.module.onesignal.aliases.remove`

Removes aliases from this user by label.

**When to use it.** Call it when an outside id should no longer be linked.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `labels` | array of string | yes | The labels of the aliases to remove. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `labels` | array of string | yes | The labels that were removed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required value was not given. | Pass the value named in the error data and call again. |
| `not_configured` | OneSignal is not set up because no app id is configured or the package is switched off. | Set the OneSignal app id in the package config and rebuild. |

**Example: removes an alias**

```js
const result = await dsx.module.onesignal.aliases.remove({"labels":["crm"]});
// resolves {"labels":["crm"]}
```

### aliases.set

`dsx.module.onesignal.aliases.set`

Adds ids from your other systems to this user, or replaces them.

**When to use it.** Use it to link a CRM or billing id to the OneSignal user.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `aliases` | object | yes | The aliases to write, as label and id pairs. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `labels` | array of string | yes | The labels that were written. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required value was not given. | Pass the value named in the error data and call again. |
| `not_configured` | OneSignal is not set up because no app id is configured or the package is switched off. | Set the OneSignal app id in the package config and rebuild. |

**Example: sets an alias**

```js
const result = await dsx.module.onesignal.aliases.set({"aliases":{"crm":"c_42"}});
// resolves {"labels":["crm"]}
```

### email.add

`dsx.module.onesignal.email.add`

Adds an email address to this user so you can message them by email through OneSignal.

**When to use it.** Call it when the person gives their email.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `email` | string | yes | The email address to add. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `email` | string | yes | The email address that was added. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required value was not given. | Pass the value named in the error data and call again. |
| `not_configured` | OneSignal is not set up because no app id is configured or the package is switched off. | Set the OneSignal app id in the package config and rebuild. |

**Example: adds an email subscription**

```js
const result = await dsx.module.onesignal.email.add({"email":"a@b.co"});
// resolves {"email":"a@b.co"}
```

### email.remove

`dsx.module.onesignal.email.remove`

Removes an email address from this user.

**When to use it.** Call it when the person opts out of email.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `email` | string | yes | The email address to remove. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `email` | string | yes | The email address that was removed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required value was not given. | Pass the value named in the error data and call again. |
| `not_configured` | OneSignal is not set up because no app id is configured or the package is switched off. | Set the OneSignal app id in the package config and rebuild. |

**Example: removes an email subscription**

```js
const result = await dsx.module.onesignal.email.remove({"email":"a@b.co"});
// resolves {"email":"a@b.co"}
```

### language.set

`dsx.module.onesignal.language.set`

Sets the language OneSignal uses for this user's localized messages.

**When to use it.** Call it when the person picks a language different from the device language.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `language` | string | yes | A two letter language code such as fr. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `language` | string | yes | The language code now in use. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required value was not given. | Pass the value named in the error data and call again. |
| `not_configured` | OneSignal is not set up because no app id is configured or the package is switched off. | Set the OneSignal app id in the package config and rebuild. |

**Example: sets the language**

```js
const result = await dsx.module.onesignal.language.set({"language":"fr"});
// resolves {"language":"fr"}
```

### login

`dsx.module.onesignal.login`

Links this device to your own user id so you can send pushes to a person instead of a device.

**When to use it.** Call it whenever your app knows who is signed in; calling it again is safe.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `externalId` | string | yes | Your own id for the signed-in person. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `externalId` | string | yes | Your own id for the person; empty when the user is anonymous. |
| `onesignalId` | string | yes | OneSignal's own id for the user; empty until OneSignal has created the user. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required value was not given. | Pass the value named in the error data and call again. |
| `not_configured` | OneSignal is not set up because no app id is configured or the package is switched off. | Set the OneSignal app id in the package config and rebuild. |

**Example: logs in an external id**

```js
const result = await dsx.module.onesignal.login({"externalId":"u_12345"});
// resolves {"externalId":"u_12345","onesignalId":""}
```

### logout

`dsx.module.onesignal.logout`

Unlinks your user id from this device, which then continues as an anonymous user.

**When to use it.** Call it when the person signs out.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `externalId` | string | yes | Your own id for the person; empty when the user is anonymous. |
| `onesignalId` | string | yes | OneSignal's own id for the user; empty until OneSignal has created the user. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | OneSignal is not set up because no app id is configured or the package is switched off. | Set the OneSignal app id in the package config and rebuild. |

**Example: logs out the current user**

```js
const result = await dsx.module.onesignal.logout({});
// resolves {"externalId":"","onesignalId":""}
```

### sms.add

`dsx.module.onesignal.sms.add`

Adds a phone number to this user so you can message them by text through OneSignal.

**When to use it.** Call it when the person gives their phone number.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `number` | string | yes | The phone number in international format. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `number` | string | yes | The phone number that was added. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required value was not given. | Pass the value named in the error data and call again. |
| `not_configured` | OneSignal is not set up because no app id is configured or the package is switched off. | Set the OneSignal app id in the package config and rebuild. |

**Example: adds an sms subscription**

```js
const result = await dsx.module.onesignal.sms.add({"number":"+15555550100"});
// resolves {"number":"+15555550100"}
```

### sms.remove

`dsx.module.onesignal.sms.remove`

Removes a phone number from this user.

**When to use it.** Call it when the person opts out of text messages.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `number` | string | yes | The phone number to remove. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `number` | string | yes | The phone number that was removed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required value was not given. | Pass the value named in the error data and call again. |
| `not_configured` | OneSignal is not set up because no app id is configured or the package is switched off. | Set the OneSignal app id in the package config and rebuild. |

**Example: removes an sms subscription**

```js
const result = await dsx.module.onesignal.sms.remove({"number":"+15555550100"});
// resolves {"number":"+15555550100"}
```

### subscription.get

`dsx.module.onesignal.subscription.get`

Reads this device's push subscription: its id, token and whether it is opted in.

**When to use it.** Call it to show the notification state or to learn the subscription id.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id OneSignal gave this device's push subscription; empty before registration finishes. |
| `optedIn` | boolean | yes | True when this device is opted in to push for this app. |
| `token` | string | yes | The push token of this device; empty before the system provides one. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | OneSignal is not set up because no app id is configured or the package is switched off. | Set the OneSignal app id in the package config and rebuild. |

**Example: returns the subscription**

```js
const result = await dsx.module.onesignal.subscription.get({});
// resolves {"id":"0f8e2c1a-1111-4222-8333-944455556666","optedIn":true,"token":"apns-token"}
```

**Example: an empty id with the SDK running is not yet, not a failure**

```js
const result = await dsx.module.onesignal.subscription.get({});
// resolves {"id":"","optedIn":false,"token":""}
```

### subscription.set

`dsx.module.onesignal.subscription.set`

Opts this device in or out of push for this app without changing the system permission.

**When to use it.** Call it from a notifications toggle in your settings.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `optedIn` | boolean | yes | True to receive push, false to stop. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id OneSignal gave this device's push subscription; empty before registration finishes. |
| `optedIn` | boolean | yes | True when this device is opted in to push for this app. |
| `token` | string | yes | The push token of this device; empty before the system provides one. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required value was not given. | Pass the value named in the error data and call again. |
| `not_configured` | OneSignal is not set up because no app id is configured or the package is switched off. | Set the OneSignal app id in the package config and rebuild. |

**Example: opts out**

```js
const result = await dsx.module.onesignal.subscription.set({"optedIn":false});
// resolves {"id":"0f8e2c1a-1111-4222-8333-944455556666","optedIn":false,"token":"apns-token"}
```

### tags.get

`dsx.module.onesignal.tags.get`

Reads the tags stored on this user.

**When to use it.** Call it to show or check segments the user belongs to.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `tags` | object | yes | The tags as key and text value pairs. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | OneSignal is not set up because no app id is configured or the package is switched off. | Set the OneSignal app id in the package config and rebuild. |

**Example: returns the tags**

```js
const result = await dsx.module.onesignal.tags.get({});
// resolves {"tags":{"plan":"pro"}}
```

### tags.remove

`dsx.module.onesignal.tags.remove`

Removes tags from this user by key.

**When to use it.** Call it when a segment no longer applies.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `keys` | array of string | yes | The keys of the tags to remove. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `tags` | object | yes | All tags left on the user after the change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required value was not given. | Pass the value named in the error data and call again. |
| `not_configured` | OneSignal is not set up because no app id is configured or the package is switched off. | Set the OneSignal app id in the package config and rebuild. |

**Example: removes a tag**

```js
const result = await dsx.module.onesignal.tags.remove({"keys":["plan"]});
// resolves {"tags":{}}
```

### tags.set

`dsx.module.onesignal.tags.set`

Adds tags to this user or replaces tags with the same key.

**When to use it.** Use tags to segment people, for example a plan or a favorite team.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `tags` | object | yes | The tags to write as key and value pairs; values are kept as text. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `tags` | object | yes | All tags on the user after the change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required value was not given. | Pass the value named in the error data and call again. |
| `not_configured` | OneSignal is not set up because no app id is configured or the package is switched off. | Set the OneSignal app id in the package config and rebuild. |

**Example: sets tags**

```js
const result = await dsx.module.onesignal.tags.set({"tags":{"level":3,"plan":"pro"}});
// resolves {"tags":{"level":"3","plan":"pro"}}
```

### user.get

`dsx.module.onesignal.user.get`

Reads the current user: your external id and OneSignal's own id.

**When to use it.** Call it to check who the device is linked to.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `externalId` | string | yes | Your own id for the person; empty when the user is anonymous. |
| `onesignalId` | string | yes | OneSignal's own id for the user; empty until OneSignal has created the user. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | OneSignal is not set up because no app id is configured or the package is switched off. | Set the OneSignal app id in the package config and rebuild. |

**Example: returns the user**

```js
const result = await dsx.module.onesignal.user.get({});
// resolves {"externalId":"u_12345","onesignalId":"5e0f0000-aaaa-4bbb-8ccc-dddddddddddd"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `app_id` | string | `` | Your OneSignal application ID (from the OneSignal dashboard). |
| `enabled` | boolean | `true` | Master switch for OneSignal push. |
| `open_deeplink_in_browser` | boolean | `false` | Open a tapped notification's deeplink in Safari instead of the in-app web view. |
| `reload_on_user_id` | boolean | `false` | Reload the web view once OneSignal returns the push subscription ID. |

## Related packages

- Needs: [Notify](/packages/notify)
- Used by: [OneSignalLiveActivity](/packages/liveactivitypush), [Stream](/packages/stream)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
