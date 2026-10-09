---
title: Alarms and timers
description: Set alarms and timers that ring even when the phone is on silent or locked.
package: alarms
---

Set alarms and timers that ring even when the phone is on silent or locked.

Schedule one-time or repeating alarms and countdown timers, with pause, snooze and stop. On iOS 26 they ring through Silent mode and Focus and show on the Lock Screen, and on Android they take over the lock screen. Good for clock, wake-up, cooking and reminder apps. Asks the user for permission.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to build alarm clocks, timers, wake-up and reminder features that must ring even when the phone is locked or silent. For a plain reminder text, a notification is enough.

## What native adds

On iOS 26 alarms ring through Silent mode and Focus and show on the Lock Screen, and Android takes over the lock screen, which a web page cannot do.

## Install

```sh
despia add Core/Alarms
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone.

## Actions

### cancel

`dsx.module.alarms.cancel`

Removes an alarm or timer in any state, including one that is ringing.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the alarm to act on, as returned when it was scheduled. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the alarm that was cancelled. |
| `removed` | boolean | yes | True when the alarm existed and was removed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_found` | No alarm with that id belongs to this app. | Call list to see current ids. |

**Example: removes a scheduled alarm**

```js
const result = await dsx.module.alarms.cancel({"id":"wake"});
// resolves {"id":"wake","removed":true}
```

### list

`dsx.module.alarms.list`

Returns every alarm and timer this app has, in the order they were created.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alarms` | array of object | yes | The alarms and timers this app currently has. |

**Example: nothing armed**

```js
const result = await dsx.module.alarms.list({});
// resolves {"alarms":[]}
```

### pause

`dsx.module.alarms.pause`

Pauses a running countdown, such as a timer or a snooze, and freezes the seconds left.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the alarm to act on, as returned when it was scheduled. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `at` | string | yes | The one-time date and time the alarm rings, as an ISO 8601 text with a zone. Empty for repeating alarms and timers. |
| `data` | object | yes | Your own payload, returned unchanged on this alarm and on every event. |
| `duration` | number | yes | The length of a timer in seconds. |
| `endsAt` | string | yes | The moment a running countdown reaches zero, as an ISO 8601 text. |
| `fireDate` | string | yes | The next moment this alarm will ring, as an ISO 8601 text. |
| `id` | string | yes | The id of the alarm, the one you gave or a generated one. |
| `kind` | string | yes | Whether this is an alarm or a countdown timer. |
| `layout` | string | no | The component drawn as this alarm's Live Activity or custom notification. |
| `mission` | string | no | The component the person must complete before the ring can end, when this is a mission alarm. |
| `missionLabel` | string | no | The label of the mission button shown on the alert. |
| `pending` | boolean | no | True while a silenced mission alarm counts down before ringing again. |
| `rearm` | number | no | Seconds after which a silenced mission alarm rings again if the mission is not done. |
| `remaining` | number | yes | The whole seconds left on a paused or running countdown. |
| `repeats` | array of string | yes | The weekdays a repeating alarm rings on; empty for a one-time alarm. |
| `skipUntil` | string | no | The skipped occurrence of a repeating alarm, set after you call skip. |
| `snooze` | number | yes | How many seconds a snooze waits before ringing again; 0 means there is no Snooze button. |
| `snoozeLimit` | number | no | How many times Snooze may be used before only Stop is offered. |
| `snoozed` | number | no | How many times this alarm has been snoozed so far. |
| `sound` | string | yes | The sound that plays: default, a tone from the package, or a sound bundled with your app. |
| `state` | string | yes | Where the alarm is now: scheduled, countdown, paused or alerting (ringing). |
| `time` | string | yes | The daily clock time the alarm rings, as HH:MM on the 24 hour clock. Empty for one-time alarms and timers. |
| `tint` | string | yes | The accent colour as #RRGGBB used on the alert and notification. |
| `title` | string | yes | The title shown on the alert, the Lock Screen and the notification. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_state` | The alarm is not in a state this call applies to. | Check the alarm's state first, for example only pause a running countdown. |
| `not_found` | No alarm with that id belongs to this app. | Call list to see current ids. |

**Example: pauses a running timer**

```js
const result = await dsx.module.alarms.pause({"id":"tea"});
// resolves {"at":null,"data":null,"duration":240,"endsAt":null,"fireDate":null,"id":"tea","kind":"timer","remaining":200,"repeats":[],"snooze":0,"sound":"default","state":"paused","time":null,"tint":null,"title":"Tea"}
```

### permission.openSettings

`dsx.module.alarms.permission.openSettings`

Opens this app's page in the system Settings so the person can change alarm access. Call it from a tap.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when Settings was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | Opening Settings needs the App Settings package in the build. | Add the App Settings package to the app. |
| `unsupported_platform` | The web cannot open browser or system settings. | Show instructions instead of a button. |

**Example: opens the app page**

```js
const result = await dsx.module.alarms.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.alarms.permission.request`

Asks the person for alarm permission, from a settings row or an onboarding step. For exact it opens the Android alarms page.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | string | no | notify (the default) for permission to ring and notify, or exact for Android's exact alarm access. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when asking again would still show a system dialog. |
| `level` | string | no | The level that was checked, notify or exact. |
| `status` | string | yes | The permission state, such as granted, denied or undetermined. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_level` | The level is not notify or exact. | Use notify or exact. |

**Example: granted**

```js
const result = await dsx.module.alarms.permission.request({});
// resolves {"canAsk":false,"level":"notify","status":"granted"}
```

### permission.status

`dsx.module.alarms.permission.status`

Reads whether alarms are allowed without ever showing a dialog.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | string | no | notify (the default) for permission to ring and notify, or exact for Android's exact alarm access. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when asking again would still show a system dialog. |
| `level` | string | no | The level that was checked, notify or exact. |
| `status` | string | yes | The permission state, such as granted, denied or undetermined. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_level` | The level is not notify or exact. | Use notify or exact. |

**Example: never asked**

```js
const result = await dsx.module.alarms.permission.status({});
// resolves {"canAsk":true,"level":"notify","status":"undetermined"}
```

### resume

`dsx.module.alarms.resume`

Restarts a paused countdown from now using the seconds that were left.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the alarm to act on, as returned when it was scheduled. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `at` | string | yes | The one-time date and time the alarm rings, as an ISO 8601 text with a zone. Empty for repeating alarms and timers. |
| `data` | object | yes | Your own payload, returned unchanged on this alarm and on every event. |
| `duration` | number | yes | The length of a timer in seconds. |
| `endsAt` | string | yes | The moment a running countdown reaches zero, as an ISO 8601 text. |
| `fireDate` | string | yes | The next moment this alarm will ring, as an ISO 8601 text. |
| `id` | string | yes | The id of the alarm, the one you gave or a generated one. |
| `kind` | string | yes | Whether this is an alarm or a countdown timer. |
| `layout` | string | no | The component drawn as this alarm's Live Activity or custom notification. |
| `mission` | string | no | The component the person must complete before the ring can end, when this is a mission alarm. |
| `missionLabel` | string | no | The label of the mission button shown on the alert. |
| `pending` | boolean | no | True while a silenced mission alarm counts down before ringing again. |
| `rearm` | number | no | Seconds after which a silenced mission alarm rings again if the mission is not done. |
| `remaining` | number | yes | The whole seconds left on a paused or running countdown. |
| `repeats` | array of string | yes | The weekdays a repeating alarm rings on; empty for a one-time alarm. |
| `skipUntil` | string | no | The skipped occurrence of a repeating alarm, set after you call skip. |
| `snooze` | number | yes | How many seconds a snooze waits before ringing again; 0 means there is no Snooze button. |
| `snoozeLimit` | number | no | How many times Snooze may be used before only Stop is offered. |
| `snoozed` | number | no | How many times this alarm has been snoozed so far. |
| `sound` | string | yes | The sound that plays: default, a tone from the package, or a sound bundled with your app. |
| `state` | string | yes | Where the alarm is now: scheduled, countdown, paused or alerting (ringing). |
| `time` | string | yes | The daily clock time the alarm rings, as HH:MM on the 24 hour clock. Empty for one-time alarms and timers. |
| `tint` | string | yes | The accent colour as #RRGGBB used on the alert and notification. |
| `title` | string | yes | The title shown on the alert, the Lock Screen and the notification. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_state` | The alarm is not in a state this call applies to. | Check the alarm's state first, for example only pause a running countdown. |
| `not_found` | No alarm with that id belongs to this app. | Call list to see current ids. |

**Example: Resume a paused timer**

```js
const result = await dsx.module.alarms.resume({"id":"tea"});
// resolves {"at":null,"data":null,"duration":240,"endsAt":"2026-10-01T08:04:00.000Z","fireDate":"2026-10-01T08:04:00.000Z","id":"tea","kind":"timer","mission":null,"missionLabel":null,"rearm":0,"remaining":240,"repeats":[],"snooze":0,"sound":"default","state":"countdown","time":null,"tint":null,"title":"Tea"}
```

### schedule

`dsx.module.alarms.schedule`

Sets an alarm for a date and time, or for a clock time that repeats on chosen weekdays, and returns the alarm with its next ring time.

**When to use it.** Use it for wake-up and reminder alarms.

**When not to.** Use timer for a countdown.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `at` | string | no | A one-time date and time as ISO 8601 text with a zone. Give exactly one of at and time. |
| `data` | object | no | Your own payload, handed back on the alarm and on every event it fires. |
| `id` | string | no | Your own id for the alarm, 1 to 64 letters, digits, underscore, dot or hyphen. One is generated when left out, and reusing an id replaces that alarm. |
| `layout` | string | no | The name of your own activity component drawn as this alarm's Live Activity on iOS and its notification on Android. Without it a built-in card is used. |
| `mission` | string | no | The name of your own component that the person must complete to end the ring. It receives the alarm id as alarmId and ends the alarm by calling stop. |
| `missionLabel` | string | no | The label of the mission button, up to 40 characters; defaults to Start mission. |
| `prompt` | boolean | no | Set false to never show a permission dialog; a call that would have asked then fails with permission_denied. |
| `rearm` | number | no | Seconds after which a mission alarm that was silenced before its mission rings again, 0 or 10 to 3600, default 30. Needs mission. |
| `repeats` | array of string | no | The weekdays to repeat on, from sun to sat. Only with time; leave empty to ring once at the next such time. |
| `snooze` | number | no | Seconds the Snooze button waits before ringing again, 0 for no Snooze button or 60 to 3600. Defaults to 540 for an alarm and 0 for a timer. |
| `snoozeLimit` | number | no | How many times Snooze may be used, 1 to 10, before only Stop is offered. Needs a snooze time; leave out for no limit. |
| `sound` | string | no | default, a tone from this package (pulse or chime), or a sound file bundled with your app. File paths are not accepted. |
| `time` | string | no | A clock time as HH:MM on the 24 hour clock, in the device's time zone when it rings. Give exactly one of at and time. |
| `tint` | string | no | An accent colour as #RRGGBB for the alert, notification or card. |
| `title` | string | no | The title shown on the alert, the Lock Screen and the notification; defaults to Alarm, or Timer for timers. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `at` | string | yes | The one-time date and time the alarm rings, as an ISO 8601 text with a zone. Empty for repeating alarms and timers. |
| `data` | object | yes | Your own payload, returned unchanged on this alarm and on every event. |
| `duration` | number | yes | The length of a timer in seconds. |
| `endsAt` | string | yes | The moment a running countdown reaches zero, as an ISO 8601 text. |
| `fireDate` | string | yes | The next moment this alarm will ring, as an ISO 8601 text. |
| `id` | string | yes | The id of the alarm, the one you gave or a generated one. |
| `kind` | string | yes | Whether this is an alarm or a countdown timer. |
| `layout` | string | no | The component drawn as this alarm's Live Activity or custom notification. |
| `mission` | string | no | The component the person must complete before the ring can end, when this is a mission alarm. |
| `missionLabel` | string | no | The label of the mission button shown on the alert. |
| `pending` | boolean | no | True while a silenced mission alarm counts down before ringing again. |
| `rearm` | number | no | Seconds after which a silenced mission alarm rings again if the mission is not done. |
| `remaining` | number | yes | The whole seconds left on a paused or running countdown. |
| `repeats` | array of string | yes | The weekdays a repeating alarm rings on; empty for a one-time alarm. |
| `skipUntil` | string | no | The skipped occurrence of a repeating alarm, set after you call skip. |
| `snooze` | number | yes | How many seconds a snooze waits before ringing again; 0 means there is no Snooze button. |
| `snoozeLimit` | number | no | How many times Snooze may be used before only Stop is offered. |
| `snoozed` | number | no | How many times this alarm has been snoozed so far. |
| `sound` | string | yes | The sound that plays: default, a tone from the package, or a sound bundled with your app. |
| `state` | string | yes | Where the alarm is now: scheduled, countdown, paused or alerting (ringing). |
| `time` | string | yes | The daily clock time the alarm rings, as HH:MM on the 24 hour clock. Empty for one-time alarms and timers. |
| `tint` | string | yes | The accent colour as #RRGGBB used on the alert and notification. |
| `title` | string | yes | The title shown on the alert, the Lock Screen and the notification. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `in_past` | The at time is already in the past. | Pick a future time. |
| `invalid_data` | The data value is not an object. | Pass a plain object. |
| `invalid_id` | The id is not 1 to 64 letters, digits, underscore, dot or hyphen. | Use a valid id or leave it out. |
| `invalid_layout` | The layout is not a component name. | Pass the name of your activity component. |
| `invalid_mission` | The mission is not a component name or the label is too long. | Use a component name and a label up to 40 characters. |
| `invalid_rearm` | Rearm needs a mission and must be 0 or 10 to 3600 seconds. | Add a mission and use a valid number of seconds. |
| `invalid_repeats` | Repeats is not a list of weekday names. | Use sun, mon, tue, wed, thu, fri or sat. |
| `invalid_schedule` | The time arguments do not fit this call. | Give exactly one of at and time for an alarm, or only a duration for a timer. |
| `invalid_snooze` | The snooze time is not 0 or between 60 and 3600 seconds. | Use 0 or a whole number from 60 to 3600. |
| `invalid_snooze_limit` | The snooze limit is not 1 to 10 or no snooze time is set. | Use a whole number from 1 to 10 together with a snooze time. |
| `invalid_sound` | The sound is not default or a bundled sound file name. | Use default, pulse, chime or a file bundled with the app. |
| `invalid_time` | The at value is not an ISO 8601 instant with a zone, or time is not HH:MM. | Fix the format of at or time. |
| `invalid_tint` | The tint is not written as #RRGGBB. | Use a six digit hex colour such as #FF3B30. |
| `invalid_title` | The title is empty or longer than 120 characters. | Give a title of 1 to 120 characters. |
| `permission_denied` | The person has not allowed alarms for this app. | If canAsk is true call permission.request, otherwise send them to Settings with permission.openSettings. |
| `schedule_failed` | The system refused to create the alarm, for example at its alarm limit or because exact alarms were turned off. | Remove an old alarm or ask the person to allow exact alarms, then try again. |
| `unavailable` | This device has no alarm service, because iOS alarms need iOS 26. | Hide the alarm feature or use a notification instead on older devices. |

**Example: a weekday alarm**

```js
const result = await dsx.module.alarms.schedule({"id":"wake","repeats":["mon","tue","wed","thu","fri"],"time":"07:30","title":"Wake up"});
// resolves {"at":null,"data":null,"duration":null,"endsAt":null,"fireDate":"2026-10-02T03:30:00.000Z","id":"wake","kind":"alarm","mission":null,"missionLabel":null,"rearm":0,"remaining":null,"repeats":["mon","tue","wed","thu","fri"],"snooze":540,"sound":"default","state":"scheduled","time":"07:30","tint":null,"title":"Wake up"}
```

### skip

`dsx.module.alarms.skip`

Skips the next ring of a repeating alarm so it next rings on the occurrence after that.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the alarm to act on, as returned when it was scheduled. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `at` | string | yes | The one-time date and time the alarm rings, as an ISO 8601 text with a zone. Empty for repeating alarms and timers. |
| `data` | object | yes | Your own payload, returned unchanged on this alarm and on every event. |
| `duration` | number | yes | The length of a timer in seconds. |
| `endsAt` | string | yes | The moment a running countdown reaches zero, as an ISO 8601 text. |
| `fireDate` | string | yes | The next moment this alarm will ring, as an ISO 8601 text. |
| `id` | string | yes | The id of the alarm, the one you gave or a generated one. |
| `kind` | string | yes | Whether this is an alarm or a countdown timer. |
| `layout` | string | no | The component drawn as this alarm's Live Activity or custom notification. |
| `mission` | string | no | The component the person must complete before the ring can end, when this is a mission alarm. |
| `missionLabel` | string | no | The label of the mission button shown on the alert. |
| `pending` | boolean | no | True while a silenced mission alarm counts down before ringing again. |
| `rearm` | number | no | Seconds after which a silenced mission alarm rings again if the mission is not done. |
| `remaining` | number | yes | The whole seconds left on a paused or running countdown. |
| `repeats` | array of string | yes | The weekdays a repeating alarm rings on; empty for a one-time alarm. |
| `skipUntil` | string | no | The skipped occurrence of a repeating alarm, set after you call skip. |
| `snooze` | number | yes | How many seconds a snooze waits before ringing again; 0 means there is no Snooze button. |
| `snoozeLimit` | number | no | How many times Snooze may be used before only Stop is offered. |
| `snoozed` | number | no | How many times this alarm has been snoozed so far. |
| `sound` | string | yes | The sound that plays: default, a tone from the package, or a sound bundled with your app. |
| `state` | string | yes | Where the alarm is now: scheduled, countdown, paused or alerting (ringing). |
| `time` | string | yes | The daily clock time the alarm rings, as HH:MM on the 24 hour clock. Empty for one-time alarms and timers. |
| `tint` | string | yes | The accent colour as #RRGGBB used on the alert and notification. |
| `title` | string | yes | The title shown on the alert, the Lock Screen and the notification. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_state` | The alarm is not in a state this call applies to. | Check the alarm's state first, for example only pause a running countdown. |
| `not_found` | No alarm with that id belongs to this app. | Call list to see current ids. |

**Example: Skip tomorrow morning ring of a weekday alarm**

```js
const result = await dsx.module.alarms.skip({"id":"wake"});
// resolves {"at":null,"data":null,"duration":null,"endsAt":null,"fireDate":"2026-10-12T03:30:00.000Z","id":"wake","kind":"alarm","mission":null,"missionLabel":null,"rearm":0,"remaining":null,"repeats":["mon","tue","wed","thu","fri"],"skipUntil":"2026-10-12T03:30:00.000Z","snooze":540,"sound":"default","state":"scheduled","time":"07:30","tint":null,"title":"Wake up"}
```

### snooze

`dsx.module.alarms.snooze`

Snoozes a ringing alarm so it goes quiet and rings again after its snooze time.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the alarm to act on, as returned when it was scheduled. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `at` | string | yes | The one-time date and time the alarm rings, as an ISO 8601 text with a zone. Empty for repeating alarms and timers. |
| `data` | object | yes | Your own payload, returned unchanged on this alarm and on every event. |
| `duration` | number | yes | The length of a timer in seconds. |
| `endsAt` | string | yes | The moment a running countdown reaches zero, as an ISO 8601 text. |
| `fireDate` | string | yes | The next moment this alarm will ring, as an ISO 8601 text. |
| `id` | string | yes | The id of the alarm, the one you gave or a generated one. |
| `kind` | string | yes | Whether this is an alarm or a countdown timer. |
| `layout` | string | no | The component drawn as this alarm's Live Activity or custom notification. |
| `mission` | string | no | The component the person must complete before the ring can end, when this is a mission alarm. |
| `missionLabel` | string | no | The label of the mission button shown on the alert. |
| `pending` | boolean | no | True while a silenced mission alarm counts down before ringing again. |
| `rearm` | number | no | Seconds after which a silenced mission alarm rings again if the mission is not done. |
| `remaining` | number | yes | The whole seconds left on a paused or running countdown. |
| `repeats` | array of string | yes | The weekdays a repeating alarm rings on; empty for a one-time alarm. |
| `skipUntil` | string | no | The skipped occurrence of a repeating alarm, set after you call skip. |
| `snooze` | number | yes | How many seconds a snooze waits before ringing again; 0 means there is no Snooze button. |
| `snoozeLimit` | number | no | How many times Snooze may be used before only Stop is offered. |
| `snoozed` | number | no | How many times this alarm has been snoozed so far. |
| `sound` | string | yes | The sound that plays: default, a tone from the package, or a sound bundled with your app. |
| `state` | string | yes | Where the alarm is now: scheduled, countdown, paused or alerting (ringing). |
| `time` | string | yes | The daily clock time the alarm rings, as HH:MM on the 24 hour clock. Empty for one-time alarms and timers. |
| `tint` | string | yes | The accent colour as #RRGGBB used on the alert and notification. |
| `title` | string | yes | The title shown on the alert, the Lock Screen and the notification. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_state` | The alarm is not in a state this call applies to. | Check the alarm's state first, for example only pause a running countdown. |
| `not_found` | No alarm with that id belongs to this app. | Call list to see current ids. |
| `snooze_exhausted` | The alarm has used all the snoozes its limit allows. | Call stop instead. |
| `snooze_unavailable` | This alarm was created without a snooze time. | Create it with a snooze time to allow snoozing. |

**Example: Snooze the ringing wake-up alarm**

```js
const result = await dsx.module.alarms.snooze({"id":"wake"});
// resolves {"at":null,"data":null,"duration":null,"endsAt":null,"fireDate":"2026-10-09T03:39:00.000Z","id":"wake","kind":"alarm","mission":null,"missionLabel":null,"rearm":0,"remaining":null,"repeats":["mon","tue","wed","thu","fri"],"skipUntil":"2026-10-12T03:30:00.000Z","snooze":540,"snoozed":1,"sound":"default","state":"scheduled","time":"07:30","tint":null,"title":"Wake up"}
```

### stop

`dsx.module.alarms.stop`

Dismisses a ringing alarm. A repeating alarm is set for its next day, while a one-time alarm or a timer is removed.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the alarm to act on, as returned when it was scheduled. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alarm` | object | no | The alarm after it was re-armed. Empty when the alarm was removed. |
| `alarm.at` | string | yes | The one-time date and time the alarm rings, as an ISO 8601 text with a zone. Empty for repeating alarms and timers. |
| `alarm.data` | object | yes | Your own payload, returned unchanged on this alarm and on every event. |
| `alarm.duration` | number | yes | The length of a timer in seconds. |
| `alarm.endsAt` | string | yes | The moment a running countdown reaches zero, as an ISO 8601 text. |
| `alarm.fireDate` | string | yes | The next moment this alarm will ring, as an ISO 8601 text. |
| `alarm.id` | string | yes | The id of the alarm, the one you gave or a generated one. |
| `alarm.kind` | string | yes | Whether this is an alarm or a countdown timer. |
| `alarm.layout` | string | no | The component drawn as this alarm's Live Activity or custom notification. |
| `alarm.mission` | string | no | The component the person must complete before the ring can end, when this is a mission alarm. |
| `alarm.missionLabel` | string | no | The label of the mission button shown on the alert. |
| `alarm.pending` | boolean | no | True while a silenced mission alarm counts down before ringing again. |
| `alarm.rearm` | number | no | Seconds after which a silenced mission alarm rings again if the mission is not done. |
| `alarm.remaining` | number | yes | The whole seconds left on a paused or running countdown. |
| `alarm.repeats` | array of string | yes | The weekdays a repeating alarm rings on; empty for a one-time alarm. |
| `alarm.skipUntil` | string | no | The skipped occurrence of a repeating alarm, set after you call skip. |
| `alarm.snooze` | number | yes | How many seconds a snooze waits before ringing again; 0 means there is no Snooze button. |
| `alarm.snoozeLimit` | number | no | How many times Snooze may be used before only Stop is offered. |
| `alarm.snoozed` | number | no | How many times this alarm has been snoozed so far. |
| `alarm.sound` | string | yes | The sound that plays: default, a tone from the package, or a sound bundled with your app. |
| `alarm.state` | string | yes | Where the alarm is now: scheduled, countdown, paused or alerting (ringing). |
| `alarm.time` | string | yes | The daily clock time the alarm rings, as HH:MM on the 24 hour clock. Empty for one-time alarms and timers. |
| `alarm.tint` | string | yes | The accent colour as #RRGGBB used on the alert and notification. |
| `alarm.title` | string | yes | The title shown on the alert, the Lock Screen and the notification. |
| `id` | string | yes | The id of the alarm that was stopped. |
| `removed` | boolean | yes | True when the alarm no longer exists, false when a repeating alarm was armed again. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_state` | The alarm is not in a state this call applies to. | Check the alarm's state first, for example only pause a running countdown. |
| `not_found` | No alarm with that id belongs to this app. | Call list to see current ids. |

**Example: Dismiss a ringing alarm**

```js
const result = await dsx.module.alarms.stop({"id":"wake"});
// resolves {"alarm":{"at":null,"data":null,"duration":null,"endsAt":null,"fireDate":"2026-10-12T03:30:00.000Z","id":"wake","kind":"alarm","mission":null,"missionLabel":null,"rearm":0,"remaining":null,"repeats":["mon","tue","wed","thu","fri"],"skipUntil":"2026-10-12T03:30:00.000Z","snooze":540,"sound":"default","state":"scheduled","time":"07:30","tint":null,"title":"Wake up"},"id":"wake","removed":false}
```

### timer

`dsx.module.alarms.timer`

Starts a countdown that rings when it reaches zero, and returns the running timer.

**When to use it.** Use it for cooking, workout and focus timers.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `data` | object | no | Your own payload, handed back on the alarm and on every event it fires. |
| `duration` | number | yes | How long the timer runs, as whole seconds from 1 to 86400. |
| `id` | string | no | Your own id for the alarm, 1 to 64 letters, digits, underscore, dot or hyphen. One is generated when left out, and reusing an id replaces that alarm. |
| `layout` | string | no | The name of your own activity component drawn as this alarm's Live Activity on iOS and its notification on Android. Without it a built-in card is used. |
| `mission` | string | no | The name of your own component that the person must complete to end the ring. It receives the alarm id as alarmId and ends the alarm by calling stop. |
| `missionLabel` | string | no | The label of the mission button, up to 40 characters; defaults to Start mission. |
| `prompt` | boolean | no | Set false to never show a permission dialog; a call that would have asked then fails with permission_denied. |
| `rearm` | number | no | Seconds after which a mission alarm that was silenced before its mission rings again, 0 or 10 to 3600, default 30. Needs mission. |
| `snooze` | number | no | Seconds the Snooze button waits before ringing again, 0 for no Snooze button or 60 to 3600. Defaults to 540 for an alarm and 0 for a timer. |
| `snoozeLimit` | number | no | How many times Snooze may be used, 1 to 10, before only Stop is offered. Needs a snooze time; leave out for no limit. |
| `sound` | string | no | default, a tone from this package (pulse or chime), or a sound file bundled with your app. File paths are not accepted. |
| `tint` | string | no | An accent colour as #RRGGBB for the alert, notification or card. |
| `title` | string | no | The title shown on the alert, the Lock Screen and the notification; defaults to Alarm, or Timer for timers. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `at` | string | yes | The one-time date and time the alarm rings, as an ISO 8601 text with a zone. Empty for repeating alarms and timers. |
| `data` | object | yes | Your own payload, returned unchanged on this alarm and on every event. |
| `duration` | number | yes | The length of a timer in seconds. |
| `endsAt` | string | yes | The moment a running countdown reaches zero, as an ISO 8601 text. |
| `fireDate` | string | yes | The next moment this alarm will ring, as an ISO 8601 text. |
| `id` | string | yes | The id of the alarm, the one you gave or a generated one. |
| `kind` | string | yes | Whether this is an alarm or a countdown timer. |
| `layout` | string | no | The component drawn as this alarm's Live Activity or custom notification. |
| `mission` | string | no | The component the person must complete before the ring can end, when this is a mission alarm. |
| `missionLabel` | string | no | The label of the mission button shown on the alert. |
| `pending` | boolean | no | True while a silenced mission alarm counts down before ringing again. |
| `rearm` | number | no | Seconds after which a silenced mission alarm rings again if the mission is not done. |
| `remaining` | number | yes | The whole seconds left on a paused or running countdown. |
| `repeats` | array of string | yes | The weekdays a repeating alarm rings on; empty for a one-time alarm. |
| `skipUntil` | string | no | The skipped occurrence of a repeating alarm, set after you call skip. |
| `snooze` | number | yes | How many seconds a snooze waits before ringing again; 0 means there is no Snooze button. |
| `snoozeLimit` | number | no | How many times Snooze may be used before only Stop is offered. |
| `snoozed` | number | no | How many times this alarm has been snoozed so far. |
| `sound` | string | yes | The sound that plays: default, a tone from the package, or a sound bundled with your app. |
| `state` | string | yes | Where the alarm is now: scheduled, countdown, paused or alerting (ringing). |
| `time` | string | yes | The daily clock time the alarm rings, as HH:MM on the 24 hour clock. Empty for one-time alarms and timers. |
| `tint` | string | yes | The accent colour as #RRGGBB used on the alert and notification. |
| `title` | string | yes | The title shown on the alert, the Lock Screen and the notification. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_data` | The data value is not an object. | Pass a plain object. |
| `invalid_duration` | The duration is not 1 to 86400 whole seconds. | Use a whole number of seconds in that range. |
| `invalid_id` | The id is not 1 to 64 letters, digits, underscore, dot or hyphen. | Use a valid id or leave it out. |
| `invalid_layout` | The layout is not a component name. | Pass the name of your activity component. |
| `invalid_mission` | The mission is not a component name or the label is too long. | Use a component name and a label up to 40 characters. |
| `invalid_rearm` | Rearm needs a mission and must be 0 or 10 to 3600 seconds. | Add a mission and use a valid number of seconds. |
| `invalid_schedule` | The time arguments do not fit this call. | Give exactly one of at and time for an alarm, or only a duration for a timer. |
| `invalid_snooze` | The snooze time is not 0 or between 60 and 3600 seconds. | Use 0 or a whole number from 60 to 3600. |
| `invalid_snooze_limit` | The snooze limit is not 1 to 10 or no snooze time is set. | Use a whole number from 1 to 10 together with a snooze time. |
| `invalid_sound` | The sound is not default or a bundled sound file name. | Use default, pulse, chime or a file bundled with the app. |
| `invalid_tint` | The tint is not written as #RRGGBB. | Use a six digit hex colour such as #FF3B30. |
| `invalid_title` | The title is empty or longer than 120 characters. | Give a title of 1 to 120 characters. |
| `permission_denied` | The person has not allowed alarms for this app. | If canAsk is true call permission.request, otherwise send them to Settings with permission.openSettings. |
| `schedule_failed` | The system refused to create the alarm, for example at its alarm limit or because exact alarms were turned off. | Remove an old alarm or ask the person to allow exact alarms, then try again. |
| `unavailable` | This device has no alarm service, because iOS alarms need iOS 26. | Hide the alarm feature or use a notification instead on older devices. |

**Example: a four minute tea timer**

```js
const result = await dsx.module.alarms.timer({"duration":240,"id":"tea","title":"Tea"});
// resolves {"at":null,"data":null,"duration":240,"endsAt":"2026-10-01T08:04:00.000Z","fireDate":"2026-10-01T08:04:00.000Z","id":"tea","kind":"timer","mission":null,"missionLabel":null,"rearm":0,"remaining":240,"repeats":[],"snooze":0,"sound":"default","state":"countdown","time":null,"tint":null,"title":"Tea"}
```

## Events

Read with `dsx.on(name, handler)`.

### alert

Fires when an alarm or timer starts ringing.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alarm` | object | yes | The alarm or timer this event is about. |
| `alarm.at` | string | yes | The one-time date and time the alarm rings, as an ISO 8601 text with a zone. Empty for repeating alarms and timers. |
| `alarm.data` | object | yes | Your own payload, returned unchanged on this alarm and on every event. |
| `alarm.duration` | number | yes | The length of a timer in seconds. |
| `alarm.endsAt` | string | yes | The moment a running countdown reaches zero, as an ISO 8601 text. |
| `alarm.fireDate` | string | yes | The next moment this alarm will ring, as an ISO 8601 text. |
| `alarm.id` | string | yes | The id of the alarm, the one you gave or a generated one. |
| `alarm.kind` | string | yes | Whether this is an alarm or a countdown timer. |
| `alarm.layout` | string | no | The component drawn as this alarm's Live Activity or custom notification. |
| `alarm.mission` | string | no | The component the person must complete before the ring can end, when this is a mission alarm. |
| `alarm.missionLabel` | string | no | The label of the mission button shown on the alert. |
| `alarm.pending` | boolean | no | True while a silenced mission alarm counts down before ringing again. |
| `alarm.rearm` | number | no | Seconds after which a silenced mission alarm rings again if the mission is not done. |
| `alarm.remaining` | number | yes | The whole seconds left on a paused or running countdown. |
| `alarm.repeats` | array of string | yes | The weekdays a repeating alarm rings on; empty for a one-time alarm. |
| `alarm.skipUntil` | string | no | The skipped occurrence of a repeating alarm, set after you call skip. |
| `alarm.snooze` | number | yes | How many seconds a snooze waits before ringing again; 0 means there is no Snooze button. |
| `alarm.snoozeLimit` | number | no | How many times Snooze may be used before only Stop is offered. |
| `alarm.snoozed` | number | no | How many times this alarm has been snoozed so far. |
| `alarm.sound` | string | yes | The sound that plays: default, a tone from the package, or a sound bundled with your app. |
| `alarm.state` | string | yes | Where the alarm is now: scheduled, countdown, paused or alerting (ringing). |
| `alarm.time` | string | yes | The daily clock time the alarm rings, as HH:MM on the 24 hour clock. Empty for one-time alarms and timers. |
| `alarm.tint` | string | yes | The accent colour as #RRGGBB used on the alert and notification. |
| `alarm.title` | string | yes | The title shown on the alert, the Lock Screen and the notification. |

### dismiss

Fires when a ringing alarm is stopped.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alarm` | object | yes | The alarm or timer this event is about. |
| `alarm.at` | string | yes | The one-time date and time the alarm rings, as an ISO 8601 text with a zone. Empty for repeating alarms and timers. |
| `alarm.data` | object | yes | Your own payload, returned unchanged on this alarm and on every event. |
| `alarm.duration` | number | yes | The length of a timer in seconds. |
| `alarm.endsAt` | string | yes | The moment a running countdown reaches zero, as an ISO 8601 text. |
| `alarm.fireDate` | string | yes | The next moment this alarm will ring, as an ISO 8601 text. |
| `alarm.id` | string | yes | The id of the alarm, the one you gave or a generated one. |
| `alarm.kind` | string | yes | Whether this is an alarm or a countdown timer. |
| `alarm.layout` | string | no | The component drawn as this alarm's Live Activity or custom notification. |
| `alarm.mission` | string | no | The component the person must complete before the ring can end, when this is a mission alarm. |
| `alarm.missionLabel` | string | no | The label of the mission button shown on the alert. |
| `alarm.pending` | boolean | no | True while a silenced mission alarm counts down before ringing again. |
| `alarm.rearm` | number | no | Seconds after which a silenced mission alarm rings again if the mission is not done. |
| `alarm.remaining` | number | yes | The whole seconds left on a paused or running countdown. |
| `alarm.repeats` | array of string | yes | The weekdays a repeating alarm rings on; empty for a one-time alarm. |
| `alarm.skipUntil` | string | no | The skipped occurrence of a repeating alarm, set after you call skip. |
| `alarm.snooze` | number | yes | How many seconds a snooze waits before ringing again; 0 means there is no Snooze button. |
| `alarm.snoozeLimit` | number | no | How many times Snooze may be used before only Stop is offered. |
| `alarm.snoozed` | number | no | How many times this alarm has been snoozed so far. |
| `alarm.sound` | string | yes | The sound that plays: default, a tone from the package, or a sound bundled with your app. |
| `alarm.state` | string | yes | Where the alarm is now: scheduled, countdown, paused or alerting (ringing). |
| `alarm.time` | string | yes | The daily clock time the alarm rings, as HH:MM on the 24 hour clock. Empty for one-time alarms and timers. |
| `alarm.tint` | string | yes | The accent colour as #RRGGBB used on the alert and notification. |
| `alarm.title` | string | yes | The title shown on the alert, the Lock Screen and the notification. |

### finish

Fires when a countdown reaches zero, just before it rings.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alarm` | object | yes | The alarm or timer this event is about. |
| `alarm.at` | string | yes | The one-time date and time the alarm rings, as an ISO 8601 text with a zone. Empty for repeating alarms and timers. |
| `alarm.data` | object | yes | Your own payload, returned unchanged on this alarm and on every event. |
| `alarm.duration` | number | yes | The length of a timer in seconds. |
| `alarm.endsAt` | string | yes | The moment a running countdown reaches zero, as an ISO 8601 text. |
| `alarm.fireDate` | string | yes | The next moment this alarm will ring, as an ISO 8601 text. |
| `alarm.id` | string | yes | The id of the alarm, the one you gave or a generated one. |
| `alarm.kind` | string | yes | Whether this is an alarm or a countdown timer. |
| `alarm.layout` | string | no | The component drawn as this alarm's Live Activity or custom notification. |
| `alarm.mission` | string | no | The component the person must complete before the ring can end, when this is a mission alarm. |
| `alarm.missionLabel` | string | no | The label of the mission button shown on the alert. |
| `alarm.pending` | boolean | no | True while a silenced mission alarm counts down before ringing again. |
| `alarm.rearm` | number | no | Seconds after which a silenced mission alarm rings again if the mission is not done. |
| `alarm.remaining` | number | yes | The whole seconds left on a paused or running countdown. |
| `alarm.repeats` | array of string | yes | The weekdays a repeating alarm rings on; empty for a one-time alarm. |
| `alarm.skipUntil` | string | no | The skipped occurrence of a repeating alarm, set after you call skip. |
| `alarm.snooze` | number | yes | How many seconds a snooze waits before ringing again; 0 means there is no Snooze button. |
| `alarm.snoozeLimit` | number | no | How many times Snooze may be used before only Stop is offered. |
| `alarm.snoozed` | number | no | How many times this alarm has been snoozed so far. |
| `alarm.sound` | string | yes | The sound that plays: default, a tone from the package, or a sound bundled with your app. |
| `alarm.state` | string | yes | Where the alarm is now: scheduled, countdown, paused or alerting (ringing). |
| `alarm.time` | string | yes | The daily clock time the alarm rings, as HH:MM on the 24 hour clock. Empty for one-time alarms and timers. |
| `alarm.tint` | string | yes | The accent colour as #RRGGBB used on the alert and notification. |
| `alarm.title` | string | yes | The title shown on the alert, the Lock Screen and the notification. |

### silenced

Fires when a mission alarm is silenced before its mission is done; it will ring again after the rearm time.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alarm` | object | yes | The alarm or timer this event is about. |
| `alarm.at` | string | yes | The one-time date and time the alarm rings, as an ISO 8601 text with a zone. Empty for repeating alarms and timers. |
| `alarm.data` | object | yes | Your own payload, returned unchanged on this alarm and on every event. |
| `alarm.duration` | number | yes | The length of a timer in seconds. |
| `alarm.endsAt` | string | yes | The moment a running countdown reaches zero, as an ISO 8601 text. |
| `alarm.fireDate` | string | yes | The next moment this alarm will ring, as an ISO 8601 text. |
| `alarm.id` | string | yes | The id of the alarm, the one you gave or a generated one. |
| `alarm.kind` | string | yes | Whether this is an alarm or a countdown timer. |
| `alarm.layout` | string | no | The component drawn as this alarm's Live Activity or custom notification. |
| `alarm.mission` | string | no | The component the person must complete before the ring can end, when this is a mission alarm. |
| `alarm.missionLabel` | string | no | The label of the mission button shown on the alert. |
| `alarm.pending` | boolean | no | True while a silenced mission alarm counts down before ringing again. |
| `alarm.rearm` | number | no | Seconds after which a silenced mission alarm rings again if the mission is not done. |
| `alarm.remaining` | number | yes | The whole seconds left on a paused or running countdown. |
| `alarm.repeats` | array of string | yes | The weekdays a repeating alarm rings on; empty for a one-time alarm. |
| `alarm.skipUntil` | string | no | The skipped occurrence of a repeating alarm, set after you call skip. |
| `alarm.snooze` | number | yes | How many seconds a snooze waits before ringing again; 0 means there is no Snooze button. |
| `alarm.snoozeLimit` | number | no | How many times Snooze may be used before only Stop is offered. |
| `alarm.snoozed` | number | no | How many times this alarm has been snoozed so far. |
| `alarm.sound` | string | yes | The sound that plays: default, a tone from the package, or a sound bundled with your app. |
| `alarm.state` | string | yes | Where the alarm is now: scheduled, countdown, paused or alerting (ringing). |
| `alarm.time` | string | yes | The daily clock time the alarm rings, as HH:MM on the 24 hour clock. Empty for one-time alarms and timers. |
| `alarm.tint` | string | yes | The accent colour as #RRGGBB used on the alert and notification. |
| `alarm.title` | string | yes | The title shown on the alert, the Lock Screen and the notification. |

### skip

Fires when a repeating alarm skips its next ring.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alarm` | object | yes | The alarm or timer this event is about. |
| `alarm.at` | string | yes | The one-time date and time the alarm rings, as an ISO 8601 text with a zone. Empty for repeating alarms and timers. |
| `alarm.data` | object | yes | Your own payload, returned unchanged on this alarm and on every event. |
| `alarm.duration` | number | yes | The length of a timer in seconds. |
| `alarm.endsAt` | string | yes | The moment a running countdown reaches zero, as an ISO 8601 text. |
| `alarm.fireDate` | string | yes | The next moment this alarm will ring, as an ISO 8601 text. |
| `alarm.id` | string | yes | The id of the alarm, the one you gave or a generated one. |
| `alarm.kind` | string | yes | Whether this is an alarm or a countdown timer. |
| `alarm.layout` | string | no | The component drawn as this alarm's Live Activity or custom notification. |
| `alarm.mission` | string | no | The component the person must complete before the ring can end, when this is a mission alarm. |
| `alarm.missionLabel` | string | no | The label of the mission button shown on the alert. |
| `alarm.pending` | boolean | no | True while a silenced mission alarm counts down before ringing again. |
| `alarm.rearm` | number | no | Seconds after which a silenced mission alarm rings again if the mission is not done. |
| `alarm.remaining` | number | yes | The whole seconds left on a paused or running countdown. |
| `alarm.repeats` | array of string | yes | The weekdays a repeating alarm rings on; empty for a one-time alarm. |
| `alarm.skipUntil` | string | no | The skipped occurrence of a repeating alarm, set after you call skip. |
| `alarm.snooze` | number | yes | How many seconds a snooze waits before ringing again; 0 means there is no Snooze button. |
| `alarm.snoozeLimit` | number | no | How many times Snooze may be used before only Stop is offered. |
| `alarm.snoozed` | number | no | How many times this alarm has been snoozed so far. |
| `alarm.sound` | string | yes | The sound that plays: default, a tone from the package, or a sound bundled with your app. |
| `alarm.state` | string | yes | Where the alarm is now: scheduled, countdown, paused or alerting (ringing). |
| `alarm.time` | string | yes | The daily clock time the alarm rings, as HH:MM on the 24 hour clock. Empty for one-time alarms and timers. |
| `alarm.tint` | string | yes | The accent colour as #RRGGBB used on the alert and notification. |
| `alarm.title` | string | yes | The title shown on the alert, the Lock Screen and the notification. |

### snooze

Fires when a ringing alarm is snoozed.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alarm` | object | yes | The alarm or timer this event is about. |
| `alarm.at` | string | yes | The one-time date and time the alarm rings, as an ISO 8601 text with a zone. Empty for repeating alarms and timers. |
| `alarm.data` | object | yes | Your own payload, returned unchanged on this alarm and on every event. |
| `alarm.duration` | number | yes | The length of a timer in seconds. |
| `alarm.endsAt` | string | yes | The moment a running countdown reaches zero, as an ISO 8601 text. |
| `alarm.fireDate` | string | yes | The next moment this alarm will ring, as an ISO 8601 text. |
| `alarm.id` | string | yes | The id of the alarm, the one you gave or a generated one. |
| `alarm.kind` | string | yes | Whether this is an alarm or a countdown timer. |
| `alarm.layout` | string | no | The component drawn as this alarm's Live Activity or custom notification. |
| `alarm.mission` | string | no | The component the person must complete before the ring can end, when this is a mission alarm. |
| `alarm.missionLabel` | string | no | The label of the mission button shown on the alert. |
| `alarm.pending` | boolean | no | True while a silenced mission alarm counts down before ringing again. |
| `alarm.rearm` | number | no | Seconds after which a silenced mission alarm rings again if the mission is not done. |
| `alarm.remaining` | number | yes | The whole seconds left on a paused or running countdown. |
| `alarm.repeats` | array of string | yes | The weekdays a repeating alarm rings on; empty for a one-time alarm. |
| `alarm.skipUntil` | string | no | The skipped occurrence of a repeating alarm, set after you call skip. |
| `alarm.snooze` | number | yes | How many seconds a snooze waits before ringing again; 0 means there is no Snooze button. |
| `alarm.snoozeLimit` | number | no | How many times Snooze may be used before only Stop is offered. |
| `alarm.snoozed` | number | no | How many times this alarm has been snoozed so far. |
| `alarm.sound` | string | yes | The sound that plays: default, a tone from the package, or a sound bundled with your app. |
| `alarm.state` | string | yes | Where the alarm is now: scheduled, countdown, paused or alerting (ringing). |
| `alarm.time` | string | yes | The daily clock time the alarm rings, as HH:MM on the 24 hour clock. Empty for one-time alarms and timers. |
| `alarm.tint` | string | yes | The accent colour as #RRGGBB used on the alert and notification. |
| `alarm.title` | string | yes | The title shown on the alert, the Lock Screen and the notification. |

### tick

Fires once a second for each running countdown while the app is in the foreground.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the countdown that ticked. |
| `remaining` | number | yes | The whole seconds left on the countdown. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `channel_name` | string | `Alarms` | The name Android shows for this app's alarm notifications in Settings. |
| `usage_description` | multiline | `Ring the alarms and timers you set, even in Silent mode or a Focus` | The message iOS shows when the app first asks to schedule alarms and timers. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
