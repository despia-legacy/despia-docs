---
title: DeviceUsage
description: Block chosen apps and websites for a set time, on a daily schedule, or after a daily limit is used up.
package: deviceusage
---

Block chosen apps and websites for a set time, on a daily schedule, or after a daily limit is used up.

Lets the person pick apps to block, then blocks them now for a set time, every day in a time window, or once a daily limit is reached. It uses Screen Time on iOS and a blocking service on Android, with the same calls on both. You get the picker, the rules and the block screen, and you write the screens that explain why.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it for focus, digital wellbeing or parental-style features where your app limits other apps. Do not use it to limit your own app, and note that it needs special system permissions the person must grant.

## What native adds

The operating system enforces the blocks even when your app is closed on iOS, which a web page cannot do at all.

## Install

```sh
despia add Core/DeviceUsage
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

### block

`dsx.module.deviceusage.block`

Blocks the selected apps right now, for a number of minutes, until a given time, or until you call unblock.

**When to use it.** Use it for a one-off focus session. For a repeating window use schedule, and for a daily allowance use limit.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | A name for this rule. Using the same id again replaces the earlier rule. |
| `minutes` | number | no | How long to block for, in minutes. |
| `prompt` | boolean | no | Set to false to fail with permission_denied instead of showing a permission prompt. |
| `selection` | string | yes | The selection handle returned by pick, beginning with sel_. It stands for the chosen apps without revealing them. |
| `until` | number | no | When the block ends, as a time in epoch milliseconds. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `days` | array of number | no | The days the schedule runs on, 1 for Monday to 7 for Sunday. |
| `degraded` | array of string | no | Names of features that could not be fully applied on this device, for example notifications_not_silenced on Android or custom_screen_unsupported on iOS. |
| `end` | string | no | The daily end time, as HH:MM. |
| `id` | string | yes | The id of the rule, either the one you gave or a generated one. |
| `kind` | string | yes | Which kind of rule this is: block, schedule or limit. |
| `minutes` | number | no | The length of the block or the daily limit, in minutes. |
| `selection` | string | yes | The selection handle the rule applies to. |
| `start` | string | no | The daily start time, as HH:MM. |
| `until` | number | no | When a timed block ends, in epoch milliseconds. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_duration` | Give minutes (> 0) or a future until, not both. |  |
| `invalid_id` | id must be a non-empty string. |  |
| `invalid_selection` | selection must be a handle from pick() (sel_...). |  |
| `permission_denied` | Screen Time access is off for this app. Ask again with permission.request(), or open Settings. |  |
| `unknown_selection` | No selection with this handle exists on this device (forgotten, or picked on another install). |  |
| `unsupported_platform` | Blocking other apps needs Screen Time on iOS or a usage-access service on Android. The web, macOS, Windows and Linux have no public API for it, so use the iOS or Android app. | Not recoverable by retrying. |

**Example: blocks for three hours**

```js
const result = await dsx.module.deviceusage.block({"id":"yt","minutes":180,"selection":"sel_1"});
// resolves {"id":"yt","kind":"block","selection":"sel_1","until":10800000}
```

### forget

`dsx.module.deviceusage.forget`

Deletes a selection handle and every rule that uses it.

**When to use it.** Use it when the person removes a list of apps from your screens.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `selection` | string | yes | The selection handle returned by pick, beginning with sel_. It stands for the chosen apps without revealing them. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `removed` | array of string | yes | The ids of the rules that were removed along with the handle. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_selection` | selection must be a handle from pick() (sel_...). |  |
| `unsupported_platform` | Blocking other apps needs Screen Time on iOS or a usage-access service on Android. The web, macOS, Windows and Linux have no public API for it, so use the iOS or Android app. | Not recoverable by retrying. |

**Example: forgets a handle and its rules**

```js
const result = await dsx.module.deviceusage.forget({"selection":"sel_1"});
// resolves {"removed":["yt"]}
```

### limit

`dsx.module.deviceusage.limit`

Blocks the selected apps for the rest of the day once they have been used for a set number of minutes.

**When to use it.** Use it for a daily allowance, for example 30 minutes of a social app.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | A name for this rule. Using the same id again replaces the earlier rule. |
| `minutes` | number | yes | The daily allowance in minutes, from 1 to 1440. |
| `prompt` | boolean | no | Set to false to fail with permission_denied instead of showing a permission prompt. |
| `selection` | string | yes | The selection handle returned by pick, beginning with sel_. It stands for the chosen apps without revealing them. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `days` | array of number | no | The days the schedule runs on, 1 for Monday to 7 for Sunday. |
| `degraded` | array of string | no | Names of features that could not be fully applied on this device, for example notifications_not_silenced on Android or custom_screen_unsupported on iOS. |
| `end` | string | no | The daily end time, as HH:MM. |
| `id` | string | yes | The id of the rule, either the one you gave or a generated one. |
| `kind` | string | yes | Which kind of rule this is: block, schedule or limit. |
| `minutes` | number | no | The length of the block or the daily limit, in minutes. |
| `selection` | string | yes | The selection handle the rule applies to. |
| `start` | string | no | The daily start time, as HH:MM. |
| `until` | number | no | When a timed block ends, in epoch milliseconds. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_id` | id must be a non-empty string. |  |
| `invalid_minutes` | minutes must be a whole number from 1 to 1440. |  |
| `invalid_selection` | selection must be a handle from pick() (sel_...). |  |
| `permission_denied` | Screen Time access is off for this app. Ask again with permission.request(), or open Settings. |  |
| `schedule_failed` | The system refused the schedule. |  |
| `unknown_selection` | No selection with this handle exists on this device (forgotten, or picked on another install). |  |
| `unsupported_platform` | Blocking other apps needs Screen Time on iOS or a usage-access service on Android. The web, macOS, Windows and Linux have no public API for it, so use the iOS or Android app. | Not recoverable by retrying. |

**Example: thirty minutes a day**

```js
const result = await dsx.module.deviceusage.limit({"id":"daily","minutes":30,"selection":"sel_1"});
// resolves {"id":"daily","kind":"limit","minutes":30,"selection":"sel_1"}
```

### permission.openSettings

`dsx.module.deviceusage.permission.openSettings`

Opens this app's page in the system Settings so the person can change a permission they refused earlier.

**When to use it.** Use it from a button after a request came back denied and canAsk is false.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when the Settings page was opened. |

**Example: opens settings**

```js
const result = await dsx.module.deviceusage.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.deviceusage.permission.request`

Asks the person for Screen Time and blocking access through the system prompt and reports the answer.

**When to use it.** Call it just before the feature is needed, after you have told the person why. Check permission.status first to avoid a pointless prompt.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when the system will still show its prompt, false once the person has refused and must change it in Settings. |
| `granted` | array of string | no | On Android, the permissions that are on: usage, overlay or notifications. iOS has a single grant and omits this. |
| `missing` | array of string | no | On Android, the permissions still off: usage and overlay are required for blocking, notifications is optional. iOS omits this. |
| `status` | string | yes | Whether Screen Time and blocking access is granted, denied or not yet asked. |

**Example: a cold request asks and reports the grant**

```js
const result = await dsx.module.deviceusage.permission.request({});
// resolves {"canAsk":false,"status":"granted"}
```

### permission.status

`dsx.module.deviceusage.permission.status`

Reports whether the app currently has Screen Time and blocking access without asking the person.

**When to use it.** Use it to decide whether to show a button, a request screen or the feature itself.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when the system will still show its prompt, false once the person has refused and must change it in Settings. |
| `granted` | array of string | no | On Android, the permissions that are on: usage, overlay or notifications. iOS has a single grant and omits this. |
| `missing` | array of string | no | On Android, the permissions still off: usage and overlay are required for blocking, notifications is optional. iOS omits this. |
| `status` | string | yes | Whether Screen Time and blocking access is granted, denied or not yet asked. |

**Example: never asked**

```js
const result = await dsx.module.deviceusage.permission.status({});
// resolves {"canAsk":true,"status":"undetermined"}
```

**Example: granted**

```js
const result = await dsx.module.deviceusage.permission.status({});
// resolves {"canAsk":false,"status":"granted"}
```

### pick

`dsx.module.deviceusage.pick`

Shows the system app chooser and returns a handle for the apps the person selected, without revealing which apps they are.

**When to use it.** Call it first, then pass the handle to block, schedule, limit or usage. Pass an existing handle to let the person edit that choice.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `prompt` | boolean | no | Set to false to fail with permission_denied instead of asking for access. |
| `selection` | string | no | An existing selection handle to edit in place, instead of starting a new choice. |
| `title` | string | no | The title shown at the top of the chooser. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `apps` | number | yes | How many apps were chosen. |
| `cancelled` | boolean | yes | True when the person closed the chooser without choosing, and the handle is unchanged. |
| `categories` | number | yes | How many app categories were chosen, iOS only. |
| `domains` | number | yes | How many websites were chosen, iOS only. |
| `selection` | string | yes | The handle for the chosen apps, beginning with sel_. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | Screen Time access is off for this app. Ask again with permission.request(), or open Settings. |  |
| `unknown_selection` | No selection with this handle exists on this device (forgotten, or picked on another install). |  |
| `unsupported_platform` | Blocking other apps needs Screen Time on iOS or a usage-access service on Android. The web, macOS, Windows and Linux have no public API for it, so use the iOS or Android app. | Not recoverable by retrying. |

**Example: a pick resolves a handle and its counts**

```js
const result = await dsx.module.deviceusage.pick({});
// resolves {"apps":1,"cancelled":false,"categories":0,"domains":0,"selection":"sel_1"}
```

### schedule

`dsx.module.deviceusage.schedule`

Blocks the selected apps every day inside a time window, for example 22:00 to 07:00.

**When to use it.** Use it for bedtime or work-hour rules that repeat. An end time earlier than the start runs past midnight.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `days` | array of number | no | The days of the week to apply it, 1 for Monday to 7 for Sunday. Every day when left out. |
| `end` | string | yes | The time the block ends each day, as HH:MM. |
| `id` | string | no | A name for this rule. Using the same id again replaces the earlier rule. |
| `prompt` | boolean | no | Set to false to fail with permission_denied instead of showing a permission prompt. |
| `selection` | string | yes | The selection handle returned by pick, beginning with sel_. It stands for the chosen apps without revealing them. |
| `start` | string | yes | The time the block starts each day, as HH:MM. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `days` | array of number | no | The days the schedule runs on, 1 for Monday to 7 for Sunday. |
| `degraded` | array of string | no | Names of features that could not be fully applied on this device, for example notifications_not_silenced on Android or custom_screen_unsupported on iOS. |
| `end` | string | no | The daily end time, as HH:MM. |
| `id` | string | yes | The id of the rule, either the one you gave or a generated one. |
| `kind` | string | yes | Which kind of rule this is: block, schedule or limit. |
| `minutes` | number | no | The length of the block or the daily limit, in minutes. |
| `selection` | string | yes | The selection handle the rule applies to. |
| `start` | string | no | The daily start time, as HH:MM. |
| `until` | number | no | When a timed block ends, in epoch milliseconds. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_days` | days must be a non-empty list of 1..7. |  |
| `invalid_id` | id must be a non-empty string. |  |
| `invalid_selection` | selection must be a handle from pick() (sel_...). |  |
| `invalid_time` | start and end must be HH:MM and differ. |  |
| `permission_denied` | Screen Time access is off for this app. Ask again with permission.request(), or open Settings. |  |
| `schedule_failed` | The system refused the schedule. |  |
| `unknown_selection` | No selection with this handle exists on this device (forgotten, or picked on another install). |  |
| `unsupported_platform` | Blocking other apps needs Screen Time on iOS or a usage-access service on Android. The web, macOS, Windows and Linux have no public API for it, so use the iOS or Android app. | Not recoverable by retrying. |

**Example: a nightly window**

```js
const result = await dsx.module.deviceusage.schedule({"end":"07:00","id":"night","selection":"sel_1","start":"22:00"});
// resolves {"days":[1,2,3,4,5,6,7],"end":"07:00","id":"night","kind":"schedule","selection":"sel_1","start":"22:00"}
```

### unblock

`dsx.module.deviceusage.unblock`

Removes one rule, every rule on a selection, or every rule when called with no arguments.

**When to use it.** Use it to end a block early or to clear everything.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | The id of the one rule to remove. |
| `selection` | string | no | Remove every rule that uses this selection handle. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `removed` | array of string | yes | The ids of the rules that were removed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | Blocking other apps needs Screen Time on iOS or a usage-access service on Android. The web, macOS, Windows and Linux have no public API for it, so use the iOS or Android app. | Not recoverable by retrying. |

**Example: removes one rule**

```js
const result = await dsx.module.deviceusage.unblock({"id":"yt"});
// resolves {"removed":["yt"]}
```

**Example: an unknown id removes nothing**

```js
const result = await dsx.module.deviceusage.unblock({"id":"nope"});
// resolves {"removed":[]}
```

### usage

`dsx.module.deviceusage.usage`

Returns how long the selected apps have been in the foreground today, in seconds.

**When to use it.** Use it to show progress towards a daily limit. It works on Android only, because iOS never gives apps usage numbers.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `prompt` | boolean | no | Set to false to fail with permission_denied instead of showing a permission prompt. |
| `selection` | string | yes | The selection handle returned by pick, beginning with sel_. It stands for the chosen apps without revealing them. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `seconds` | number | yes | Seconds the selected apps were in the foreground today. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_selection` | selection must be a handle from pick() (sel_...). |  |
| `permission_denied` | Screen Time access is off for this app. Ask again with permission.request(), or open Settings. |  |
| `unknown_selection` | No selection with this handle exists on this device (forgotten, or picked on another install). |  |
| `unsupported_platform` | Blocking other apps needs Screen Time on iOS or a usage-access service on Android. The web, macOS, Windows and Linux have no public API for it, so use the iOS or Android app. | Not recoverable by retrying. |
| `usage_private` | iOS keeps app usage private: an app cannot read it, only show it inside a DeviceActivityReport extension. | Not recoverable by retrying. |

**Example: reports today's seconds**

```js
const result = await dsx.module.deviceusage.usage({"selection":"sel_1"});
// resolves {"seconds":1260}
```

## Events

Read with `dsx.on(name, handler)`.

### blocked

A block, schedule or limit rule was saved.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the rule that was saved. |

### shield

The person pressed a button on the block screen. On iOS it arrives the next time the app opens.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `block` | string | yes | The id of the rule that was showing the block screen. |
| `button` | string | yes | Which button was pressed: primary or secondary. |

### unblocked

A rule was removed, either by you, because a timed block ran out, or because its selection was forgotten.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the rule that was removed. |
| `reason` | string | yes | Why it ended: manual, expired or forgotten. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `screen` | string | `` | A project component that replaces the default block screen (Android). Empty: the default screen. |
| `shield_accent` | color | `` | Primary button colour. Empty: the system's. |
| `shield_background` | color | `` | Background colour. Empty: the system's. |
| `shield_primary` | string | `` | Label of the button that closes the blocked app. Empty: Close. |
| `shield_secondary` | string | `` | Label of a second button that opens this app (for an unlock condition). Empty: no second button. |
| `shield_subtitle` | multiline | `` | Body text of the block screen. Empty uses the platform's own text. |
| `shield_title` | string | `` | Headline of the block screen. Empty uses the platform's own text. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | No screen is up to present UI, or the package is not set up yet (the app is still launching). |  |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
