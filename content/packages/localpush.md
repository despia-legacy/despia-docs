---
title: LegacyLocalPush
description: Keeps the old local push calls working for web pages written for the previous Despia version.
package: localpush
---

Keeps the old local push calls working for web pages written for the previous Despia version.

Answers the old localpush verbs (send, cronjob, skip, unschedule, schedule and cronjobs) by using the Notify package underneath. Add it when you convert an app whose pages still call those verbs. New apps call Notify directly and do not need it.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when converting an older Despia app whose pages still schedule local notifications with the old calls. For anything new, use the Notify package directly.

## Install

```sh
despia add Core/Legacy/Modules/LocalPush
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

Device classes: phone.

## Actions

### cronjob

`dsx.module.localpush.cronjob`

Schedules a notification that repeats every week on each of the given days and times, in the phone's own time zone, until you unschedule it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dates` | array of object | yes | The weekly time slots, each with a day (a weekday name or 1 to 7 starting on Sunday) and either an hour and minute or a time written as HH:mm. |
| `id` | string | no | A name for this notification; using the same id again replaces the earlier schedule. |
| `message` | string | no | The body text shown under the notification headline. |
| `target` | string | no | A routing value handed to your app when the user taps the notification. |
| `title` | string | no | The headline of the notification, shown at the top. |
| `url` | string | no | A web address handed to your app when the user taps the notification. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dates` | array of object | yes | The weekly slots that were valid and scheduled. |
| `id` | string | yes | The id the schedule was created under. |
| `intervals` | number | yes | How many weekly repeats were scheduled. |
| `ok` | boolean | yes | True when the schedule was created. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_dates` | No weekly slots were passed. | Pass at least one slot in dates. |
| `no_valid_slots` | None of the slots had a valid day plus an hour or a HH:mm time. | Give each slot a weekday and either an hour or a HH:mm time. |
| `permission_denied` | Notifications are off for this app, so nothing was scheduled. | Ask the user to allow notifications, or open the notification settings for them. |
| `unavailable` | Notifications are not available in this build. | Add the Notify package to the app. |

**Example: schedules a weekly cron**

```js
const result = await dsx.module.localpush.cronjob({"dates":[{"day":"monday","hour":9,"minute":0}],"id":"weekly_1","message":"Standup","title":"Reminder"});
// resolves {"dates":[{"day":"monday","hour":9,"minute":0}],"id":"weekly_1","intervals":0,"ok":true}
```

### cronjobs

`dsx.module.localpush.cronjobs`

Lists the weekly repeating schedules that are registered, in the shape the old calls returned.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cronJobs` | array of object | yes | One row per weekly schedule with its id, slots, title, message, url, target and how many repeats it holds. |

**Example: returns the still-pending cron jobs**

```js
const result = await dsx.module.localpush.cronjobs({});
// resolves {"cronJobs":[]}
```

### schedule

`dsx.module.localpush.schedule`

Lists the one-time notifications that are still pending, in the shape the old calls returned.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `schedule` | array of object | yes | One row per pending notification with its id, delay, title, message, url and target. |

**Example: returns the still-pending one-shot schedule**

```js
const result = await dsx.module.localpush.schedule({});
// resolves {"schedule":[]}
```

### send

`dsx.module.localpush.send`

Shows a notification once, after the given number of seconds. A tap hands back the id, url and target you passed.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | A name for this notification; using the same id again replaces the earlier schedule. |
| `message` | string | no | The body text shown under the notification headline. |
| `seconds` | number | yes | How many seconds from now to show the notification; it must be a positive number. |
| `target` | string | no | A routing value handed to your app when the user taps the notification. |
| `title` | string | no | The headline of the notification, shown at the top. |
| `url` | string | no | A web address handed to your app when the user taps the notification. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `delayInSeconds` | number | yes | The delay that was applied, in seconds. |
| `id` | string | yes | The id the notification was scheduled under. |
| `ok` | boolean | yes | True when the notification was scheduled. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_seconds` | The seconds value is missing or is not a positive number. | Pass a number of seconds greater than zero. |
| `permission_denied` | Notifications are off for this app, so nothing was scheduled. | Ask the user to allow notifications, or open the notification settings for them. |
| `unavailable` | Notifications are not available in this build. | Add the Notify package to the app. |

**Example: schedules a one-shot notification**

```js
const result = await dsx.module.localpush.send({"id":"promo_1","message":"Come back","seconds":60,"title":"Hello","url":"https://example.com"});
// resolves {"delayInSeconds":60,"id":"promo_1","ok":true}
```

### skip

`dsx.module.localpush.skip`

Schedules a limited run of notifications at the given weekly slots, up to 48 occurrences, instead of repeating forever.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dates` | array of object | yes | The weekly time slots, each with a day (a weekday name or 1 to 7 starting on Sunday) and either an hour and minute or a time written as HH:mm. |
| `id` | string | no | A name for this notification; using the same id again replaces the earlier schedule. |
| `intervals` | number | no | How many occurrences to schedule across the slots; 48 is the most. |
| `message` | string | no | The body text shown under the notification headline. |
| `target` | string | no | A routing value handed to your app when the user taps the notification. |
| `title` | string | no | The headline of the notification, shown at the top. |
| `url` | string | no | A web address handed to your app when the user taps the notification. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dates` | array of object | yes | The weekly slots that were valid and used. |
| `id` | string | yes | The id the run was scheduled under. |
| `intervals` | number | yes | How many notifications were scheduled. |
| `ok` | boolean | yes | True when the notifications were scheduled. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_dates` | No weekly slots were passed. | Pass at least one slot in dates. |
| `no_valid_slots` | None of the slots had a valid day plus an hour or a HH:mm time. | Give each slot a weekday and either an hour or a HH:mm time. |
| `permission_denied` | Notifications are off for this app, so nothing was scheduled. | Ask the user to allow notifications, or open the notification settings for them. |
| `unavailable` | Notifications are not available in this build. | Add the Notify package to the app. |

**Example: schedules a bounded run of fires**

```js
const result = await dsx.module.localpush.skip({"dates":[{"day":"friday","hour":18,"minute":30}],"id":"skip_1","intervals":3,"message":"Weekend","title":"Heads up"});
// resolves {"dates":[{"day":"friday","hour":18,"minute":30}],"id":"skip_1","intervals":3,"ok":true}
```

### unschedule

`dsx.module.localpush.unschedule`

Cancels every pending notification scheduled under an id, whether it came from send, cronjob or skip.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the notification or schedule to cancel. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id that was cancelled. |
| `ok` | boolean | yes | True when the cancel was carried out. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_id` | No id was passed, so nothing could be cancelled. | Pass the id you used when scheduling. |

**Example: unschedules a job by id**

```js
const result = await dsx.module.localpush.unschedule({"id":"promo_1"});
// resolves {"id":"promo_1","ok":true}
```

## Related packages

- Needs: [Notify](/packages/notify)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
