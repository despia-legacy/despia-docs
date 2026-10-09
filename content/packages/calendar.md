---
title: Calendar and reminders
description: Add events to the user's calendar and read events and reminders.
package: calendar
---

Add events to the user's calendar and read events and reminders.

The default opens the system event editor filled in with your event, and the user taps save, so no permission is needed. For features that need more, it can list calendars, read, create, update and remove events, and read reminders after asking permission.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when a feature needs to put an event in front of the user, such as a booking or a class, and let them save it. Use the store actions only when the app really has to read or change events itself; an app that adds one event at a time rarely needs them.

## What native adds

The system event editor is the calendar the user already trusts, and it needs no permission to show. On the web the same call hands over an .ics file instead.

## Install

```sh
despia add Core/Calendar
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

### calendars

`dsx.module.calendar.calendars`

Lists the calendars on this device, with their names, kinds and whether they accept new events.

**When to use it.** Use it to let the user choose which calendar an event goes into.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `prompt` | boolean | no | Set to false to skip the system permission dialog; the call then fails with permission_denied instead of asking. |
| `type` | string | no | Only return calendars of this kind: local, caldav, exchange, subscribed or birthdays. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `calendars` | array of object | yes | The calendars found, each with its id, title, kind, colour, whether it is writable and whether it is the default. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | Calendar access has not been granted and the call could not ask, or asking was turned off with prompt false. | Call permission.request while canAsk is true, otherwise point the user to permission.openSettings. |
| `read_failed` | The calendar store could not be read. | Try again, and check that access is still granted. |
| `unsupported_platform` | This action does not exist on the current platform, for example reminders off iOS or the calendar store on the web. | Hide the feature there or use present, which works everywhere. |

**Example: lists the visible calendars and marks the writable ones**

```js
const result = await dsx.module.calendar.calendars({});
// resolves {"calendars":[{"color":"#3478f6","id":"cal1","isDefault":true,"title":"Home","type":"local","writable":true},{"color":"#8e8e93","id":"cal2","isDefault":false,"title":"Holidays","type":"subscribed","writable":false}]}
```

### create

`dsx.module.calendar.create`

Adds an event straight to the calendar without showing an editor, and returns its id.

**When to use it.** Use it when the user has already agreed in your own screen to add the event.

**When not to.** For a single event the user should review, prefer present, which needs no permission.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alarms` | array of number | no | Alert times as minutes before the start, for example [10, 60] for ten minutes and one hour before. |
| `allDay` | boolean | no | Set to true for an event that lasts the whole day with no start time. |
| `attendees` | array of object | no | People to invite, as a list of objects with email, optional name and optional required flag. iOS ignores this list. |
| `availability` | string | no | How the event shows the user's time: busy, free, tentative or unavailable. |
| `calendarId` | string | no | Limit the call to this calendar; when left out, every visible calendar (or the default one for new events) is used. |
| `end` | string | yes | When the event or window ends, as an ISO-8601 date-time string or epoch seconds. It must not be before the start. |
| `location` | string | no | A place name or address shown with the event. |
| `notes` | string | no | Free text notes saved with the event or reminder. |
| `prompt` | boolean | no | Set to false to skip the system permission dialog; the call then fails with permission_denied instead of asking. |
| `recurrence` | string | no | How the item repeats, as an RFC 5545 RRULE string such as FREQ=WEEKLY;BYDAY=MO. |
| `start` | string | yes | When the event or window starts, as an ISO-8601 date-time string or epoch seconds. |
| `title` | string | yes | The title shown for the event or reminder. |
| `url` | string | no | A web address saved with the event. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the event or reminder. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_date` | A start or end time could not be read, or the end comes before the start. | Send ISO-8601 strings or epoch seconds, with the end after the start. |
| `invalid_recurrence` | The recurrence text is not a valid RRULE. | Use an RFC 5545 rule such as FREQ=DAILY;COUNT=5. |
| `not_found` | No event, reminder or calendar has the id you passed. | Look the id up again; it may have been deleted. |
| `permission_denied` | Calendar access has not been granted and the call could not ask, or asking was turned off with prompt false. | Call permission.request while canAsk is true, otherwise point the user to permission.openSettings. |
| `read_only_calendar` | The target calendar, such as a subscribed or holiday calendar, cannot take changes. | Pick a calendar whose writable flag is true. |
| `unsupported_platform` | This action does not exist on the current platform, for example reminders off iOS or the calendar store on the web. | Hide the feature there or use present, which works everywhere. |
| `write_failed` | The calendar store refused to save the change. | Check the values and try again, or let the user retry in the system editor. |

**Example: creates a plain event**

```js
const result = await dsx.module.calendar.create({"end":"2026-09-01T09:15:00Z","start":"2026-09-01T09:00:00Z","title":"Standup"});
// resolves {"id":"e1"}
```

**Example: the last Friday of every month round-trips**

```js
const result = await dsx.module.calendar.create({"end":"2026-09-25T17:00:00Z","recurrence":"FREQ=MONTHLY;BYDAY=-1FR","start":"2026-09-25T16:00:00Z","title":"Retro"});
// resolves {"id":"e2"}
```

### events

`dsx.module.calendar.events`

Returns the events that fall between a start and an end time, from one calendar or all visible ones.

**When to use it.** Use it to show the user's schedule or check for clashes. Always keep the time window small.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `calendarId` | string | no | Limit the call to this calendar; when left out, every visible calendar (or the default one for new events) is used. |
| `end` | string | yes | When the event or window ends, as an ISO-8601 date-time string or epoch seconds. It must not be before the start. |
| `prompt` | boolean | no | Set to false to skip the system permission dialog; the call then fails with permission_denied instead of asking. |
| `start` | string | yes | When the event or window starts, as an ISO-8601 date-time string or epoch seconds. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `events` | array of object | yes | The events in the window, each with its id, calendar, title, start, end and optional details. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_date` | A start or end time could not be read, or the end comes before the start. | Send ISO-8601 strings or epoch seconds, with the end after the start. |
| `not_found` | No event, reminder or calendar has the id you passed. | Look the id up again; it may have been deleted. |
| `permission_denied` | Calendar access has not been granted and the call could not ask, or asking was turned off with prompt false. | Call permission.request while canAsk is true, otherwise point the user to permission.openSettings. |
| `read_failed` | The calendar store could not be read. | Try again, and check that access is still granted. |
| `unsupported_platform` | This action does not exist on the current platform, for example reminders off iOS or the calendar store on the web. | Hide the feature there or use present, which works everywhere. |

**Example: returns the occurrences inside the window**

```js
const result = await dsx.module.calendar.events({"end":"2026-09-08T00:00:00Z","start":"2026-09-01T00:00:00Z"});
// resolves {"events":[{"allDay":false,"calendarId":"cal1","end":"2026-09-01T09:15:00Z","id":"e1","recurring":true,"start":"2026-09-01T09:00:00Z","title":"Standup"}]}
```

### permission.manage

`dsx.module.calendar.permission.manage`

Lets the user change a limited calendar selection where the system offers one; otherwise it just reports the current state with changed set to false.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `changed` | boolean | yes | True when the selection was changed; always false when there is nothing to change. |
| `level` | string | no | The level of access granted, such as write for write-only access. |
| `status` | string | yes | The permission state: granted, denied, not determined, restricted or unavailable. |

**Example: nothing limited to manage**

```js
const result = await dsx.module.calendar.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.calendar.permission.openSettings`

Opens this app's page in the system Settings so the user can change the calendar permission.

**When to use it.** Call it from a button the user tapped, after a request failed because the OS can no longer ask.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when the Settings page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | The system Settings page could not be opened on this device. | Tell the user to open Settings by hand. |
| `unsupported_platform` | This action does not exist on the current platform, for example reminders off iOS or the calendar store on the web. | Hide the feature there or use present, which works everywhere. |

**Example: opens the app page**

```js
const result = await dsx.module.calendar.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.calendar.permission.request`

Shows the system calendar permission dialog when the OS can still ask, and reports the resulting state.

**When to use it.** Use it from an explicit step such as an onboarding screen or a settings row. The store actions already ask on their own when needed.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | string | no | Which kind of access to ask about: full, write (add events only) or read, which counts as full. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `level` | string | no | The level of access granted, such as write for write-only access. |
| `status` | string | yes | The permission state: granted, denied, not determined, restricted or unavailable. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_level` | The level value is not one of full, write or read. | Pass full, write or read. |

**Example: granted**

```js
const result = await dsx.module.calendar.permission.request({});
// resolves {"canAsk":false,"level":"full","status":"granted"}
```

### permission.status

`dsx.module.calendar.permission.status`

Reads the current calendar permission without ever showing a dialog, so a settings screen can call it every time it appears.

**When to use it.** Use it to show or hide a row that depends on calendar access.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | string | no | Which kind of access to ask about: full, write (add events only) or read, which counts as full. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `level` | string | no | The level of access granted, such as write for write-only access. |
| `status` | string | yes | The permission state: granted, denied, not determined, restricted or unavailable. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_level` | The level value is not one of full, write or read. | Pass full, write or read. |

**Example: never asked**

```js
const result = await dsx.module.calendar.permission.status({});
// resolves {"canAsk":true,"level":"full","status":"undetermined"}
```

**Example: a final denial: only Settings helps**

```js
const result = await dsx.module.calendar.permission.status({});
// resolves {"canAsk":false,"level":"full","status":"denied"}
```

### present

`dsx.module.calendar.present`

Opens the system event editor, optionally filled in with your event, and tells you whether the user saved, cancelled or deleted it.

**When to use it.** This is the default way to add an event. The user taps save themselves, so no permission is needed.

**When not to.** Do not use it when you need to add or change many events without the user looking at each one; use create for that.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `event` | object | no | The event to fill the editor with, using the same fields as create. Leave it out when you pass an id. |
| `event.alarms` | array of number | no | Alert times as minutes before the start, for example [10, 60] for ten minutes and one hour before. |
| `event.allDay` | boolean | no | Set to true for an event that lasts the whole day with no start time. |
| `event.availability` | string | no | How the event shows the user's time: busy, free, tentative or unavailable. |
| `event.end` | object | yes | When the event or window ends, as an ISO-8601 date-time string or epoch seconds. It must not be before the start. |
| `event.location` | string | no | A place name or address shown with the event. |
| `event.notes` | string | no | Free text notes saved with the event or reminder. |
| `event.recurrence` | string | no | How the item repeats, as an RFC 5545 RRULE string such as FREQ=WEEKLY;BYDAY=MO. |
| `event.start` | object | yes | When the event or window starts, as an ISO-8601 date-time string or epoch seconds. |
| `event.title` | string | no | The title shown for the event or reminder. |
| `event.url` | string | no | A web address saved with the event. |
| `id` | string | no | The id of the existing item to work on, as returned by an earlier call. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | The id of the event or reminder. |
| `result` | string | yes | What the user did in the editor: saved, cancelled, deleted or unknown. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `editor_unavailable` | There is no screen to show the system event editor in right now. | Call it again when the app is in the foreground. |
| `invalid_date` | A start or end time could not be read, or the end comes before the start. | Send ISO-8601 strings or epoch seconds, with the end after the start. |
| `invalid_recurrence` | The recurrence text is not a valid RRULE. | Use an RFC 5545 rule such as FREQ=DAILY;COUNT=5. |
| `not_found` | No event, reminder or calendar has the id you passed. | Look the id up again; it may have been deleted. |
| `permission_denied` | Calendar access has not been granted and the call could not ask, or asking was turned off with prompt false. | Call permission.request while canAsk is true, otherwise point the user to permission.openSettings. |

**Example: the user saves the prefilled event, with no permission asked**

```js
const result = await dsx.module.calendar.present({"event":{"end":"2026-09-01T09:15:00Z","start":"2026-09-01T09:00:00Z","title":"Standup"}});
// resolves {"id":"e1","result":"saved"}
```

**Example: a dismissed editor is cancelled, not an error**

```js
const result = await dsx.module.calendar.present({"event":{"end":"2026-09-01T09:15:00Z","start":"2026-09-01T09:00:00Z","title":"Standup"}});
// resolves {"result":"cancelled"}
```

### reminders.create

`dsx.module.calendar.reminders.create`

Adds a reminder with an optional due date, notes and priority, and returns its id. Reminders exist on iOS only.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `due` | string | no | When the reminder is due, as an ISO-8601 date-time string or epoch seconds. |
| `listId` | string | no | The id of the reminders list to use. |
| `notes` | string | no | Free text notes saved with the event or reminder. |
| `priority` | int | no | Reminder priority as a whole number, where 1 is highest and 9 is lowest and 0 means none. |
| `prompt` | boolean | no | Set to false to skip the system permission dialog; the call then fails with permission_denied instead of asking. |
| `recurrence` | string | no | How the item repeats, as an RFC 5545 RRULE string such as FREQ=WEEKLY;BYDAY=MO. |
| `title` | string | yes | The title shown for the event or reminder. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the event or reminder. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_date` | A start or end time could not be read, or the end comes before the start. | Send ISO-8601 strings or epoch seconds, with the end after the start. |
| `invalid_recurrence` | The recurrence text is not a valid RRULE. | Use an RFC 5545 rule such as FREQ=DAILY;COUNT=5. |
| `permission_denied` | Calendar access has not been granted and the call could not ask, or asking was turned off with prompt false. | Call permission.request while canAsk is true, otherwise point the user to permission.openSettings. |
| `unsupported_platform` | This action does not exist on the current platform, for example reminders off iOS or the calendar store on the web. | Hide the feature there or use present, which works everywhere. |
| `write_failed` | The calendar store refused to save the change. | Check the values and try again, or let the user retry in the system editor. |

**Example: creates a reminder**

```js
const result = await dsx.module.calendar.reminders.create({"due":"2026-09-02T18:00:00Z","title":"Buy milk"});
// resolves {"id":"r1"}
```

### reminders.list

`dsx.module.calendar.reminders.list`

Lists reminders, the unfinished ones by default or the finished ones when completed is true. Reminders exist on iOS only.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `completed` | boolean | no | For list, true returns finished reminders. For update, true marks the reminder complete. |
| `listId` | string | no | The id of the reminders list to use. |
| `prompt` | boolean | no | Set to false to skip the system permission dialog; the call then fails with permission_denied instead of asking. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `reminders` | array of object | yes | The reminders found, with their ids, titles and due dates. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | Calendar access has not been granted and the call could not ask, or asking was turned off with prompt false. | Call permission.request while canAsk is true, otherwise point the user to permission.openSettings. |
| `read_failed` | The calendar store could not be read. | Try again, and check that access is still granted. |
| `unsupported_platform` | This action does not exist on the current platform, for example reminders off iOS or the calendar store on the web. | Hide the feature there or use present, which works everywhere. |

**Example: lists the incomplete reminders**

```js
const result = await dsx.module.calendar.reminders.list({});
// resolves {"reminders":[{"completed":false,"due":"2026-09-02T18:00:00Z","id":"r1","listId":"l1","priority":0,"title":"Buy milk"}]}
```

### reminders.permission.manage

`dsx.module.calendar.reminders.permission.manage`

Reports the current reminders permission with changed set to false, because reminders have no limited selection to change.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `changed` | boolean | yes | True when the selection was changed; always false when there is nothing to change. |
| `level` | string | no | The level of access granted, such as write for write-only access. |
| `status` | string | yes | The permission state: granted, denied, not determined, restricted or unavailable. |

**Example: nothing to manage**

```js
const result = await dsx.module.calendar.reminders.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### reminders.permission.openSettings

`dsx.module.calendar.reminders.permission.openSettings`

Opens this app's page in the system Settings so the user can change the reminders permission.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when the Settings page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | The system Settings page could not be opened on this device. | Tell the user to open Settings by hand. |
| `unsupported_platform` | This action does not exist on the current platform, for example reminders off iOS or the calendar store on the web. | Hide the feature there or use present, which works everywhere. |

**Example: opens**

```js
const result = await dsx.module.calendar.reminders.permission.openSettings({});
// resolves {"opened":true}
```

### reminders.permission.request

`dsx.module.calendar.reminders.permission.request`

Shows the system reminders permission dialog when the OS can still ask. Reminders exist on iOS only.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `level` | string | no | The level of access granted, such as write for write-only access. |
| `status` | string | yes | The permission state: granted, denied, not determined, restricted or unavailable. |

**Example: granted**

```js
const result = await dsx.module.calendar.reminders.permission.request({});
// resolves {"canAsk":false,"status":"granted"}
```

### reminders.permission.status

`dsx.module.calendar.reminders.permission.status`

Reads the reminders permission without ever showing a dialog. Reminders exist on iOS only.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `level` | string | no | The level of access granted, such as write for write-only access. |
| `status` | string | yes | The permission state: granted, denied, not determined, restricted or unavailable. |

**Example: never asked**

```js
const result = await dsx.module.calendar.reminders.permission.status({});
// resolves {"canAsk":true,"status":"undetermined"}
```

### reminders.remove

`dsx.module.calendar.reminders.remove`

Deletes a reminder by id. Reminders exist on iOS only.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the existing item to work on, as returned by an earlier call. |
| `prompt` | boolean | no | Set to false to skip the system permission dialog; the call then fails with permission_denied instead of asking. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `removed` | boolean | yes | True when the item was deleted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_found` | No event, reminder or calendar has the id you passed. | Look the id up again; it may have been deleted. |
| `permission_denied` | Calendar access has not been granted and the call could not ask, or asking was turned off with prompt false. | Call permission.request while canAsk is true, otherwise point the user to permission.openSettings. |
| `unsupported_platform` | This action does not exist on the current platform, for example reminders off iOS or the calendar store on the web. | Hide the feature there or use present, which works everywhere. |
| `write_failed` | The calendar store refused to save the change. | Check the values and try again, or let the user retry in the system editor. |

**Example: removes the reminder**

```js
const result = await dsx.module.calendar.reminders.remove({"id":"r1"});
// resolves {"removed":true}
```

### reminders.update

`dsx.module.calendar.reminders.update`

Changes a reminder's title, due date, notes or priority, or marks it complete. Reminders exist on iOS only.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `completed` | boolean | no | For list, true returns finished reminders. For update, true marks the reminder complete. |
| `due` | string | no | When the reminder is due, as an ISO-8601 date-time string or epoch seconds. |
| `id` | string | yes | The id of the existing item to work on, as returned by an earlier call. |
| `notes` | string | no | Free text notes saved with the event or reminder. |
| `priority` | int | no | Reminder priority as a whole number, where 1 is highest and 9 is lowest and 0 means none. |
| `prompt` | boolean | no | Set to false to skip the system permission dialog; the call then fails with permission_denied instead of asking. |
| `title` | string | no | The title shown for the event or reminder. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the event or reminder. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_found` | No event, reminder or calendar has the id you passed. | Look the id up again; it may have been deleted. |
| `permission_denied` | Calendar access has not been granted and the call could not ask, or asking was turned off with prompt false. | Call permission.request while canAsk is true, otherwise point the user to permission.openSettings. |
| `unsupported_platform` | This action does not exist on the current platform, for example reminders off iOS or the calendar store on the web. | Hide the feature there or use present, which works everywhere. |
| `write_failed` | The calendar store refused to save the change. | Check the values and try again, or let the user retry in the system editor. |

**Example: marks a reminder complete**

```js
const result = await dsx.module.calendar.reminders.update({"completed":true,"id":"r1"});
// resolves {"id":"r1"}
```

### remove

`dsx.module.calendar.remove`

Deletes an existing event, for this occurrence only unless futureEvents is true.

**When not to.** Be careful on recurring events: deleting future events cannot be undone from inside the app.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `futureEvents` | boolean | no | Set to true to apply the change to this and all later events of a recurring series; by default only this occurrence changes. |
| `id` | string | yes | The id of the existing item to work on, as returned by an earlier call. |
| `prompt` | boolean | no | Set to false to skip the system permission dialog; the call then fails with permission_denied instead of asking. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `removed` | boolean | yes | True when the item was deleted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_found` | No event, reminder or calendar has the id you passed. | Look the id up again; it may have been deleted. |
| `permission_denied` | Calendar access has not been granted and the call could not ask, or asking was turned off with prompt false. | Call permission.request while canAsk is true, otherwise point the user to permission.openSettings. |
| `read_only_calendar` | The target calendar, such as a subscribed or holiday calendar, cannot take changes. | Pick a calendar whose writable flag is true. |
| `unsupported_platform` | This action does not exist on the current platform, for example reminders off iOS or the calendar store on the web. | Hide the feature there or use present, which works everywhere. |
| `write_failed` | The calendar store refused to save the change. | Check the values and try again, or let the user retry in the system editor. |

**Example: omitting futureEvents removes this occurrence only**

```js
const result = await dsx.module.calendar.remove({"id":"e1"});
// resolves {"removed":true}
```

**Example: futureEvents true removes this occurrence and every later one**

```js
const result = await dsx.module.calendar.remove({"futureEvents":true,"id":"e1"});
// resolves {"removed":true}
```

### update

`dsx.module.calendar.update`

Changes fields of an existing event, for this occurrence only unless futureEvents is true.

**When to use it.** Use it to move or rename an event your app created earlier.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alarms` | array of number | no | Alert times as minutes before the start, for example [10, 60] for ten minutes and one hour before. |
| `allDay` | boolean | no | Set to true for an event that lasts the whole day with no start time. |
| `availability` | string | no | How the event shows the user's time: busy, free, tentative or unavailable. |
| `end` | string | no | When the event or window ends, as an ISO-8601 date-time string or epoch seconds. It must not be before the start. |
| `futureEvents` | boolean | no | Set to true to apply the change to this and all later events of a recurring series; by default only this occurrence changes. |
| `id` | string | yes | The id of the existing item to work on, as returned by an earlier call. |
| `location` | string | no | A place name or address shown with the event. |
| `notes` | string | no | Free text notes saved with the event or reminder. |
| `prompt` | boolean | no | Set to false to skip the system permission dialog; the call then fails with permission_denied instead of asking. |
| `recurrence` | string | no | How the item repeats, as an RFC 5545 RRULE string such as FREQ=WEEKLY;BYDAY=MO. |
| `start` | string | no | When the event or window starts, as an ISO-8601 date-time string or epoch seconds. |
| `title` | string | no | The title shown for the event or reminder. |
| `url` | string | no | A web address saved with the event. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the event or reminder. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_date` | A start or end time could not be read, or the end comes before the start. | Send ISO-8601 strings or epoch seconds, with the end after the start. |
| `invalid_recurrence` | The recurrence text is not a valid RRULE. | Use an RFC 5545 rule such as FREQ=DAILY;COUNT=5. |
| `not_found` | No event, reminder or calendar has the id you passed. | Look the id up again; it may have been deleted. |
| `permission_denied` | Calendar access has not been granted and the call could not ask, or asking was turned off with prompt false. | Call permission.request while canAsk is true, otherwise point the user to permission.openSettings. |
| `read_only_calendar` | The target calendar, such as a subscribed or holiday calendar, cannot take changes. | Pick a calendar whose writable flag is true. |
| `unsupported_platform` | This action does not exist on the current platform, for example reminders off iOS or the calendar store on the web. | Hide the feature there or use present, which works everywhere. |
| `write_failed` | The calendar store refused to save the change. | Check the values and try again, or let the user retry in the system editor. |

**Example: omitting futureEvents touches this occurrence only**

```js
const result = await dsx.module.calendar.update({"id":"e1","title":"Standup (moved)"});
// resolves {"id":"e1"}
```

**Example: futureEvents true rewrites this occurrence and every later one**

```js
const result = await dsx.module.calendar.update({"end":"2026-09-01T10:15:00Z","futureEvents":true,"id":"e1","start":"2026-09-01T10:00:00Z"});
// resolves {"id":"e1"}
```

## Events

Read with `dsx.on(name, handler)`.

### canceled

Sent after present when the user closed the system editor without saving.

_None._

### deleted

Sent after present when the user deleted the event from the system editor.

_None._

### saved

Sent after present when the user saved the event in the system editor.

_None._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `full_usage_description` | multiline | `Show what is already on your calendar so plans can be made around it` | The message iOS 17 and later shows when the app asks to read and change the user's calendar. |
| `reminders_usage_description` | multiline | `Create and complete reminders on your behalf` | The message iOS shows when the app asks for access to Reminders. Reminders exist on iOS only. |
| `usage_description` | multiline | `Add the events you choose to your calendar and show what is already scheduled` | The message iOS shows when the app asks for calendar access on iOS 16 and earlier. |
| `write_usage_description` | multiline | `Add the events you choose straight to your calendar` | The message iOS 17 and later shows when the app asks to add events without reading the user's schedule. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
