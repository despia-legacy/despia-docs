---
title: Push notifications
description: Receive and show push and local notifications in your app without a third-party push SDK.
package: notify
---

Receive and show push and local notifications in your app without a third-party push SDK.

Handles the notification permission, the device token, Android channels, action buttons, badges, images, scheduled notifications and what happens when a user taps one. Use it when you want notifications built in rather than through OneSignal, Pushwoosh or Firebase. You send pushes from your own server with your own Apple push key.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when your app needs to remind, alert or message people outside the app, from your own server or from the device itself. If you already use a push vendor, keep it and use this package only for the local side.

## What native adds

Web pages cannot reliably show notifications, set a badge or keep action buttons when the app is closed. Native notifications give you the system permission flow, app-icon badges, Android channels and reply buttons.

## Install

```sh
despia add Core/Notify
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

### badge.get

`dsx.module.notify.badge.get`

Reads the number currently shown on the app icon. Where the system cannot report it, the package returns the last number it set.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | The badge number currently shown on the app icon. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | This platform cannot do this, so the call is refused instead of doing nothing. | Check for support first and hide the feature where it is not available. |

**Example: reports the badge the module last set**

```js
const result = await dsx.module.notify.badge.get({});
// resolves {"count":3}
```

**Example: reports zero when nothing has been set**

```js
const result = await dsx.module.notify.badge.get({});
// resolves {"count":0}
```

### badge.set

`dsx.module.notify.badge.set`

Sets the number shown on the app icon, where 0 clears it. Android has no app-icon badge, so the call is refused there.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | The number to show on the app icon, or 0 to clear it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | The badge number that is now set. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | This platform cannot do this, so the call is refused instead of doing nothing. | Check for support first and hide the feature where it is not available. |

**Example: sets the badge**

```js
const result = await dsx.module.notify.badge.set({"count":3});
// resolves {"count":3}
```

**Example: zero clears it**

```js
const result = await dsx.module.notify.badge.set({"count":0});
// resolves {"count":0}
```

### cancel

`dsx.module.notify.cancel`

Cancels notifications that are scheduled but have not fired yet. It does not remove ones already shown, which is what dismiss is for.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `all` | boolean | no | Set to true to cancel every pending notification the app scheduled. |
| `id` | string | no | The id of the one scheduled notification to cancel. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancelled` | number | yes | How many scheduled notifications were cancelled. |

**Example: cancels one pending notification by id**

```js
const result = await dsx.module.notify.cancel({"id":"ep-42"});
// resolves {"cancelled":1}
```

**Example: cancelling an id that is not scheduled is a no-op, not an error**

```js
const result = await dsx.module.notify.cancel({"id":"ghost"});
// resolves {"cancelled":0}
```

### categories.set

`dsx.module.notify.categories.set`

Defines a set of action buttons, such as reply, approve or decline, that you attach to notifications by category id. A button can be a text field, and the typed reply comes back on the opened event.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `actions` | array of object | yes | The buttons to show, each with an id, a title and optional input, placeholder, destructive and authRequired settings. |
| `id` | string | yes | The category id you will name when you present or schedule a notification. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `actions` | number | yes | How many buttons the category now holds. |
| `id` | string | yes | The category id that was saved. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `category_limit` | A category can hold at most four actions, and the rest would never be shown. | Remove actions until the category has four or fewer. |
| `invalid_argument` | The category or one of its actions is missing a required value. | Give the category an id and every action an id and a title. |
| `unsupported_platform` | This platform cannot do this, so the call is refused instead of doing nothing. | Check for support first and hide the feature where it is not available. |

**Example: registers a reply category with a text-input action**

```js
const result = await dsx.module.notify.categories.set({"actions":[{"id":"reply","input":true,"placeholder":"Message","title":"Reply"}],"id":"message"});
// resolves {"actions":1,"id":"message"}
```

### channels.list

`dsx.module.notify.channels.list`

Lists every notification channel the app has declared, with the user's current choices. A settings screen can show which channels are blocked.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `channels` | array of object | yes | One row per channel with its id, name, importance, whether the user blocked it and its group. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | This platform cannot do this, so the call is refused instead of doing nothing. | Check for support first and hide the feature where it is not available. |

**Example: lists the declared channels with their live user state**

```js
const result = await dsx.module.notify.channels.list({});
// resolves {"channels":[]}
```

### channels.remove

`dsx.module.notify.channels.remove`

Deletes a notification channel. Android remembers the user's settings for that id, so to start clean you must use a new id.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the channel to delete. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `removed` | boolean | yes | True if a channel was deleted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | This platform cannot do this, so the call is refused instead of doing nothing. | Check for support first and hide the feature where it is not available. |

**Example: removes a declared channel**

```js
const result = await dsx.module.notify.channels.remove({"id":"episodes"});
// resolves {"removed":true}
```

**Example: removing a channel that was never declared is a no-op, not an error**

```js
const result = await dsx.module.notify.channels.remove({"id":"ghost"});
// resolves {"removed":false}
```

### channels.set

`dsx.module.notify.channels.set`

Creates or updates an Android notification channel, which controls the importance, sound and vibration of a kind of notification. Android lets you lower a channel but ignores raising it, so the result tells you what the channel will really be.

**When to use it.** Call it before posting notifications to that channel.

**When not to.** On iOS use the interruption option on present or schedule instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `badge` | boolean | no | Whether notifications on this channel add to the app icon badge. |
| `description` | string | no | A short explanation shown to the user under the channel name. |
| `group` | string | no | The id of a channel group to list this channel under. |
| `id` | string | yes | The channel id you will use when posting notifications. |
| `importance` | string | no | How loud the channel is: none, min, low, default, high or max. |
| `lights` | boolean | no | Whether notifications on this channel flash the device light. |
| `name` | string | no | The channel name the user sees in system settings. |
| `sound` | string | no | The sound the channel plays, or an empty value for silence. |
| `vibration` | boolean | no | Whether notifications on this channel vibrate. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `blocked` | boolean | yes | True if the user has switched this channel off. |
| `changed` | boolean | yes | True if this call changed the channel. |
| `created` | boolean | yes | True if the channel did not exist before. |
| `id` | string | yes | The id of the channel that was created or updated. |
| `importance` | string | yes | The importance the channel will really have, which may be lower than requested. |
| `lockedByUser` | boolean | yes | True if the user changed this channel themselves, so the app can no longer raise it. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_argument` | One of the values passed to the call is missing or not in a form the package accepts. | Check the arguments against the action reference and send a corrected call. |
| `unsupported_platform` | This platform cannot do this, so the call is refused instead of doing nothing. | Check for support first and hide the feature where it is not available. |

**Example: a brand new channel takes exactly what was asked for**

```js
const result = await dsx.module.notify.channels.set({"id":"episodes","importance":"high","name":"New episodes"});
// resolves {"blocked":false,"changed":true,"created":true,"id":"episodes","importance":"high","lockedByUser":false}
```

**Example: RAISING an existing channel is ignored by the OS, and the answer says so instead of lying**

```js
const result = await dsx.module.notify.channels.set({"id":"episodes","importance":"max"});
// resolves {"blocked":false,"changed":false,"created":false,"id":"episodes","importance":"high","lockedByUser":false}
```

### delivered

`dsx.module.notify.delivered`

Lists the notifications currently sitting in the notification centre, which have already fired.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `items` | array of object | yes | One row per delivered notification with its id, title, body and the time it arrived. |

**Example: reports what is in the notification centre**

```js
const result = await dsx.module.notify.delivered({});
// resolves {"items":[]}
```

### dismiss

`dsx.module.notify.dismiss`

Removes notifications that were already delivered from the notification centre. It does not stop ones that are still scheduled; cancel does that.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `all` | boolean | no | Set to true to remove every delivered notification. |
| `id` | string | no | The id of the one delivered notification to remove. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dismissed` | number | yes | How many notifications were removed. |

**Example: dismisses one delivered notification by id**

```js
const result = await dsx.module.notify.dismiss({"id":"ep-42"});
// resolves {"dismissed":1}
```

**Example: all clears the notification centre**

```js
const result = await dsx.module.notify.dismiss({"all":true});
// resolves {"dismissed":0}
```

### keys.remove

`dsx.module.notify.keys.remove`

Forgets a decryption key. Pushes sealed with it then show only their outer text, and removing an unknown key is not an error.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `kid` | string | yes | The id of the key to forget. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `kid` | string | yes | The id of the key that was removed. |

**Example: Forget a decryption key**

```js
const result = await dsx.module.notify.keys.remove({"kid":"k1"});
// resolves {"kid":"k1"}
```

### keys.set

`dsx.module.notify.keys.set`

Stores a decryption key on the device so that end-to-end encrypted pushes can be read. The key stays on the device in the system key store.

**When to use it.** Use it only if your server seals push content for each user.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The 32 byte AES key, encoded as base64. |
| `kid` | string | yes | The key id your server writes into each encrypted push. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `kid` | string | yes | The id of the key that was stored. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_argument` | The key id is empty or the key is not a 32 byte base64 value. | Send a key id and a base64 encoded 32 byte key. |
| `key_store_failed` | The system key store refused to keep the key. | Try again, and check that the device has a screen lock set up. |
| `unsupported_platform` | This platform cannot do this, so the call is refused instead of doing nothing. | Check for support first and hide the feature where it is not available. |

**Example: Store the key for encrypted pushes**

```js
const result = await dsx.module.notify.keys.set({"key":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=","kid":"k1"});
// resolves {"kid":"k1"}
```

### permission.manage

`dsx.module.notify.permission.manage`

Notifications have no limited selection to manage, so this resolves the current permission state and reports that nothing changed.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True if the system would still show a prompt. |
| `changed` | boolean | yes | Always false, because there is nothing to change. |
| `level` | string | no | Set to provisional for the quiet iOS grant. |
| `status` | string | yes | The current notification permission state. |

**Example: nothing to manage**

```js
const result = await dsx.module.notify.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.notify.permission.openSettings`

Opens this app's notification settings page in the system settings, so a user who said no can turn notifications on.

**When to use it.** Call it from a button tap, for example on a "notifications are off" banner.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True if the settings page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | Opening the settings page needs the App Settings package, which is not in this app. | Add the App Settings package, or tell the user where to find the setting. |
| `unsupported_platform` | This platform cannot do this, so the call is refused instead of doing nothing. | Check for support first and hide the feature where it is not available. |

**Example: opens the notification settings**

```js
const result = await dsx.module.notify.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.notify.permission.request`

Asks the user to allow notifications and tells you where that leaves you. With provisional set on iOS, notifications are allowed quietly without showing a prompt.

**When to use it.** Call it from a user action, after you have explained why notifications help.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alert` | boolean | no | Ask to show banners and alerts. |
| `announcement` | boolean | no | Ask to let Siri read notifications aloud. |
| `badge` | boolean | no | Ask to show a number on the app icon. |
| `carPlay` | boolean | no | Ask to show notifications in CarPlay. |
| `critical` | boolean | no | Also ask for the critical alert option where the platform supports it. |
| `provisional` | boolean | no | Ask for quiet delivery on iOS without showing a prompt; a later plain request asks for full permission. |
| `sound` | boolean | no | Ask to play a sound with notifications. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True if the system would still show a prompt if you asked again. |
| `dropped` | array of string | yes | Options you asked for that this platform cannot honour. |
| `level` | string | no | Set to provisional when the grant is the quiet iOS one. |
| `options` | array of string | yes | The notification options that are now allowed. |
| `prompted` | boolean | yes | True if the system dialog was actually shown by this call. |
| `status` | string | yes | The permission state after the call: undetermined, granted, limited, denied, restricted or unavailable. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | Notifications were refused and the system will not prompt again. | Send the user to the system settings with permission.openSettings. |
| `unsupported_platform` | This surface cannot ask for notification permission. | Hide the permission button on this surface. |

**Example: a cold request prompts and reports the grant**

```js
const result = await dsx.module.notify.permission.request({});
// resolves {"canAsk":false,"dropped":[],"options":["alert","badge","sound"],"prompted":true,"status":"granted"}
```

**Example: provisional is granted QUIETLY, with no prompt at all**

```js
const result = await dsx.module.notify.permission.request({"provisional":true});
// resolves {"canAsk":true,"dropped":[],"level":"provisional","options":["alert","badge","provisional","sound"],"prompted":false,"status":"limited"}
```

### permission.status

`dsx.module.notify.permission.status`

Reads the current notification permission without ever showing a prompt. Use it on a settings screen to show whether notifications are on.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True if the system would still show a prompt. |
| `channelsBlocked` | array of string | yes | Android channel ids the user has switched off. |
| `level` | string | no | Set to provisional for the quiet iOS grant. |
| `options` | array of string | yes | The notification options that are currently allowed. |
| `status` | string | yes | The permission state: undetermined, granted, limited, denied, restricted or unavailable. |

**Example: reports the live grant without showing anything**

```js
const result = await dsx.module.notify.permission.status({});
// resolves {"canAsk":false,"channelsBlocked":[],"options":["alert","badge","sound"],"status":"granted"}
```

**Example: reports a denial, including channels the user switched off**

```js
const result = await dsx.module.notify.permission.status({});
// resolves {"canAsk":false,"channelsBlocked":["episodes"],"options":[],"status":"denied"}
```

### present

`dsx.module.notify.present`

Shows a notification on this device right now, without a server. It can carry a title, body, image, action buttons and a channel.

**When to use it.** Use it for local alerts, such as a finished download. Use schedule for something later.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attachments` | array of string | no | Image or media URLs to attach; if one cannot be fetched the notification shows without it. |
| `badge` | number | no | A number to put on the app icon with this notification. |
| `body` | string | no | The main text under the title. |
| `category` | string | no | The id of a button set made with categories.set. |
| `channel` | string | no | The Android channel to post to; it must already exist. |
| `chip` | string | no | Android only: short text for the status bar chip of a promoted notification. |
| `data` | object | no | Your own values, handed back to you on the opened event when the user taps it. |
| `id` | string | no | Your own id for the notification, used later to dismiss it; one is made if you leave it out. |
| `interruption` | string | no | How urgent it is on iOS: passive, active, timeSensitive or critical. |
| `ongoing` | boolean | no | Android only: keep the notification in the shade so the user cannot swipe it away. |
| `progress` | number | no | Android only: a progress value to show in the notification. |
| `promote` | boolean | no | Android only: ask the system to show it as a live, promoted notification where supported. |
| `prompt` | boolean | no | Ask for permission first if the user has not been asked yet. |
| `sound` | string | no | The sound to play, or the default sound if you leave it out. |
| `subtitle` | string | no | A line between the title and the body, shown on iOS. |
| `thread` | string | no | A group name, so related notifications stack together. |
| `title` | string | yes | The headline of the notification, shown in bold at the top. |
| `views` | object | no | Android only: custom layouts for the collapsed and expanded notification, passed in by another native package. |
| `views.actions` | array of object | no | Android only: extra buttons for a custom notification, each with a title and a native intent passed in by another package. |
| `views.collapsed` | object | no | Android only: the custom layout shown when the notification is collapsed, passed in by another native package. |
| `views.expanded` | object | no | Android only: the custom layout shown when the notification is expanded, passed in by another native package. |
| `views.legs` | array of number | no | Android only: the stage values shown as steps of a promoted live notification. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id the notification was shown with, which you can pass to dismiss later. |
| `presented` | boolean | yes | True if the system accepted the notification for display. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `attachment_failed` | An attachment could not be fetched, so the notification was shown without it. | Check the attachment URL, then treat the text-only notification as acceptable. |
| `channel_required` | The Android channel was never created, and Android would silently drop the notification. | Call channels.set for that channel id first. |
| `invalid_argument` | One of the values passed to the call is missing or not in a form the package accepts. | Check the arguments against the action reference and send a corrected call. |
| `permission_denied` | The user has not allowed the permission this call needs. | Show your own explanation, then offer to open the system settings so the user can allow it. |
| `presentation_failed` | Android could not show the notification. | Check that notifications are allowed and try again. |
| `unsupported_platform` | This platform cannot do this, so the call is refused instead of doing nothing. | Check for support first and hide the feature where it is not available. |

**Example: shows a notification and returns the id it was posted under**

```js
const result = await dsx.module.notify.present({"body":"Chapter 12","data":{"path":"/episode/42"},"id":"ep-42","title":"New episode"});
// resolves {"id":"ep-42","presented":true}
```

**Example: an id nobody supplied is generated rather than left empty**

```js
const result = await dsx.module.notify.present({"title":"Heads up"});
// resolves {"id":"notify_1","presented":true}
```

### presentation

`dsx.module.notify.presentation`

Chooses what happens when a notification arrives while your app is open: show a banner, add it to the list, play a sound or update the badge. Without this the user usually sees nothing.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `foreground` | array of string | yes | The words to apply: banner, list, sound, badge or alert. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `degraded` | array of string | yes | Words that apply only in a weaker form, for example a banner on a low importance Android channel. |
| `dropped` | array of string | yes | Words this platform does not support. |
| `foreground` | array of string | yes | The words that are now in effect. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_argument` | One of the words is not a known presentation word. | Use only banner, list, sound, badge or alert. |

**Example: sets the foreground policy and reports it back in canonical order**

```js
const result = await dsx.module.notify.presentation({"foreground":["sound","alert"]});
// resolves {"degraded":[],"dropped":[],"foreground":["alert","sound"]}
```

**Example: an empty list is the platform default: nothing is shown while the app is open**

```js
const result = await dsx.module.notify.presentation({"foreground":[]});
// resolves {"degraded":[],"dropped":[],"foreground":[]}
```

### schedule

`dsx.module.notify.schedule`

Plans a notification for later, at a time, after a delay or on a cron pattern, optionally repeating. It returns when it will next fire.

**When not to.** For something that must appear right now, use present.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `at` | string | no | The moment to fire, as epoch milliseconds or an ISO 8601 time that includes a time zone. |
| `attachments` | array of string | no | Image or media URLs to attach. |
| `badge` | number | no | A number to put on the app icon. |
| `body` | string | no | The main text under the title. |
| `category` | string | no | The id of a button set made with categories.set. |
| `channel` | string | no | The Android channel to post to; it must already exist. |
| `cron` | string | no | A five field cron pattern with minute precision. |
| `data` | object | no | Your own values, handed back on the opened event. |
| `id` | string | no | Your own id, used later to cancel it; one is made if you leave it out. |
| `in` | number | no | How many seconds from now to fire. |
| `interruption` | string | no | How urgent it is on iOS: passive, active, timeSensitive or critical. |
| `prompt` | boolean | no | Ask for permission first if the user has not been asked yet. |
| `repeats` | string | no | Repeat every hourly, daily, weekly, monthly or yearly; it cannot be combined with cron. |
| `sound` | string | no | The sound to play, or the default sound. |
| `subtitle` | string | no | A line between the title and the body, shown on iOS. |
| `thread` | string | no | A group name, so related notifications stack together. |
| `timezone` | string | no | The time zone name used to read a wall-clock time. |
| `title` | string | yes | The headline of the notification, shown in bold at the top. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the scheduled notification. |
| `nextFire` | number | yes | When it will next fire, as epoch milliseconds. |
| `repeating` | boolean | yes | True if it will fire more than once. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `channel_required` | The Android channel was never created, and Android would silently drop the notification. | Call channels.set for that channel id first. |
| `invalid_trigger` | The call needs exactly one of at, in or cron, and repeats must be a known unit that is not used with cron. | Pass a single time anchor and a repeats value of hourly, daily, weekly, monthly or yearly. |
| `permission_denied` | The user has not allowed the permission this call needs. | Show your own explanation, then offer to open the system settings so the user can allow it. |
| `unsupported_platform` | This platform cannot do this, so the call is refused instead of doing nothing. | Check for support first and hide the feature where it is not available. |

**Example: an absolute instant schedules one fire**

```js
const result = await dsx.module.notify.schedule({"at":"2026-06-01T12:00:00Z","id":"ep-42","title":"New episode"});
// resolves {"id":"ep-42","nextFire":1780315200000,"repeating":false}
```

**Example: a cron schedules a repeating fire**

```js
const result = await dsx.module.notify.schedule({"cron":"0 9 * * 1-5","id":"standup","title":"Standup"});
// resolves {"id":"standup","nextFire":1767603600000,"repeating":true}
```

### scheduled

`dsx.module.notify.scheduled`

Lists the notifications that are still waiting to fire, so a screen can show the user's own reminders.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `items` | array of object | yes | One row per pending notification with its id, title, body, data, next fire time, creation time and whether it repeats. |

**Example: reports the pending queue**

```js
const result = await dsx.module.notify.scheduled({});
// resolves {"items":[]}
```

### token

`dsx.module.notify.token`

Gets the device token your own server needs to send this device a push. The token can change and arrives again on each launch, so your upload should be safe to repeat.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `kind` | string | no | Which push service to ask: auto picks APNs on iOS and Firebase on Android. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `kind` | string | yes | The push service the token belongs to. |
| `token` | string | yes | The device token to send to your server. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_token` | Registration with the push service has not produced a token yet. | Try again after the next launch, and check the push entitlement. |
| `permission_denied` | The user has not allowed the permission this call needs. | Show your own explanation, then offer to open the system settings so the user can allow it. |
| `transport_unavailable` | This build has no remote push service, for example Android without Firebase. Local notifications still work. | Add Firebase to the Android build if you need remote push, or use local notifications only. |
| `unsupported_platform` | This platform cannot do this, so the call is refused instead of doing nothing. | Check for support first and hide the feature where it is not available. |

**Example: returns the registered token and the transport it belongs to**

```js
const result = await dsx.module.notify.token({});
// resolves {"kind":"apns","token":"abc123"}
```

## Events

Read with `dsx.on(name, handler)`.

### dismissed

The user dismissed a notification without opening it.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the dismissed notification. |

### opened

The user tapped a notification or one of its action buttons.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `actionId` | string | no | The id of the action button, if one was tapped. |
| `coldStart` | boolean | yes | True if the tap launched the app from closed. |
| `data` | object | yes | The data attached to the notification. |
| `id` | string | yes | The id of the notification that was tapped, as given when it was shown or scheduled. |
| `path` | string | no | An in-app path the notification asked to open. |
| `url` | string | no | A URL the notification asked to open. |
| `userText` | string | no | The text the user typed into a reply button. |

### permission

The notification permission changed, after an ask or when the app comes back to the foreground.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | The new notification permission state, such as granted or denied. |

### received

A remote push arrived while the app is running.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `data` | object | yes | The data your server sent with the push. |
| `suppressed` | boolean | yes | True if the app chose not to show it on screen. |

### reply

A reply typed into a rich notification was sent to the reply endpoint.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `conversationId` | string | yes | The conversation the reply belongs to. |
| `data` | object | yes | The data attached to the notification. |
| `id` | string | yes | The id of the notification replied to. |
| `sent` | boolean | yes | True if the reply reached the endpoint. |
| `text` | string | yes | The text the user typed. |

### token

A push token arrived or changed, on registration and again on each launch. Upload it to your server each time.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `kind` | string | yes | The push service the token belongs to. |
| `token` | string | yes | The new device token to send to your own server. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `communication_notifications` | boolean | `false` | Show pushes that carry a sender as communication notifications, with the sender's name and avatar. Turn on only when the app sends messages from people and the Communication Notifications capability is enabled on its App ID. |
| `default_channel_description` | multiline | `General notifications from this app.` | The sentence under the channel name in Android's notification settings. |
| `default_channel_id` | string | `default` | The channel a notification lands in when the caller names none. Android 8 and above require every notification to have one. |
| `default_channel_importance` | string | `default` | How loud the default channel is: none, min, low, default, high or max. |
| `default_channel_name` | string | `Notifications` | What the user sees for the default channel in Android's notification settings. Write the category, not the app name. |
| `exact_alarms` | boolean | `true` | Ask AlarmManager for exact delivery when the user has granted the exact-alarm permission. Off means scheduled notifications may be delivered a few minutes late while the device is idle. |
| `foreground_presentation` | string | `` | What a notification does when it lands while the app is already open: any of alert, sound, badge and list, comma separated. Empty means nothing is shown. |
| `sounds` | list | `[]` | The package resources a notification may play, as <package>/<path>, e.g. app/sounds/chime.wav. |
| `token_kind` | string | `auto` | Which remote-push transport the token action asks for: auto, apns or fcm. |

## Related packages

- Used by: [Call](/packages/call), [ActivityKit](/packages/liveactivity), [LegacyLocalPush](/packages/localpush), [OneSignal](/packages/onesignal)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
