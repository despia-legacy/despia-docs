---
title: Live Activities
description: Show live progress on the iPhone Lock Screen and Dynamic Island, and as ongoing notifications on Android.
package: liveactivity
---

Show live progress on the iPhone Lock Screen and Dynamic Island, and as ongoing notifications on Android.

Start, update and end a live activity from your page, for things like a download, a delivery or a timer. On iPhone it appears on the Lock Screen and in the Dynamic Island, and on Android it shows as an ongoing notification. You design the layout as part of your app.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for something that unfolds over minutes or hours and that people want to glance at without opening the app, such as a delivery, a download, a timer or a ride. Do not make it the only way progress is shown.

## What native adds

The activity lives on the iPhone Lock Screen and in the Dynamic Island, and as an ongoing notification on Android, so progress stays visible when the app is closed.

## Install

```sh
despia add Core/Extensions/ActivityKit
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

### end

`dsx.module.liveactivity.end`

Ends a live activity, optionally with a final status line.

**When to use it.** Use it when the delivery arrives, the download finishes or the timer is done.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dismiss` | string | no | How soon the card disappears: immediate, or a number of seconds to keep the last frame; the default is 4 seconds. |
| `id` | string | yes | The id of the activity to end. |
| `status` | string | no | A final status line, such as Delivered. |
| `success` | boolean | no | True shows a successful finish, which is the default; false shows it as not completed. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ended` | boolean | yes | True when the activity was ended. |
| `id` | string | yes | The id of the activity that was ended. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `activity_failed` | The activity state or presentation could not be updated. |  |
| `invalid_argument` | The activity request contains an invalid value. | Not recoverable by retrying. |
| `missing_id` | A live activity needs an id: it is the handle every later update and end call names. | Not recoverable by retrying. |
| `unknown_id` | No live activity is running under that id; it was never started, or it has already ended. | Not recoverable by retrying. |

**Example: ends an activity for an id**

```js
const result = await dsx.module.liveactivity.end({"id":"dl_1","success":true});
// resolves {"ended":true,"id":"dl_1"}
```

**Example: ends with a final status line**

```js
const result = await dsx.module.liveactivity.end({"id":"order_7","status":"Delivered — enjoy!","success":true});
// resolves {"ended":true,"id":"order_7"}
```

### layout

`dsx.module.liveactivity.layout`

Sets the default layout that new live activities use when a start call names none.

**When to use it.** Use it once at launch if every activity in your app shares a design.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `layout` | string | no | The name of a layout document, or layout markup, to use as the default. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the default layout was set. |

**Example: sets the default DSX layout**

```js
const result = await dsx.module.liveactivity.layout({"layout":"<DSXView/>"});
// resolves {"ok":true}
```

### start

`dsx.module.liveactivity.start`

Starts a live activity on the Lock Screen and Dynamic Island, or as an ongoing notification on Android.

**When to use it.** Use it when the long-running thing begins. Keep the id, because update and end need it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `channel` | object | no | A server-issued descriptor that lets your server update the activity remotely with push messages. |
| `channel.apns` | string | yes | The Apple channel address your server issued for pushes. |
| `channel.id` | string | yes | The channel id; it must equal the activity id. |
| `id` | string | yes | A name you choose for this activity; every later update and end call uses it. |
| `images` | object | no | Pictures to show, by name, each an https address that the app downloads before the first frame. |
| `layout` | string | no | The name of the layout document to draw, or layout markup; it overrides the default layout. |
| `name` | string | no | The main title of the activity, such as a file name or restaurant. |
| `progress` | number | no | How far along the activity is, from 0 to 1. |
| `promote` | boolean | no | On Android 16, asks to show the activity as a promoted live update notification. |
| `stale` | number | no | Seconds after which the system marks the activity as out of date. |
| `status` | string | no | A short status line shown on the activity, such as Order confirmed. |
| `vars` | object | no | Your own values, by name, that the activity layout can show. |
| `widget` | string | no | On Android, the name of the app's widget that this activity also feeds; it needs the Widgets package. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the activity that was started. |
| `started` | boolean | yes | True when the activity was started. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `activities_disabled` | Live Activities are switched off for this app in Settings, so the system will not start one. |  |
| `activity_failed` | The activity state or presentation could not be updated. |  |
| `invalid_argument` | The activity request contains an invalid value. | Not recoverable by retrying. |
| `missing_id` | A live activity needs an id: it is the handle every later update and end call names. | Not recoverable by retrying. |
| `platform_unavailable` | Broadcast Live Activities require iOS18 or newer on Apple devices. | Not recoverable by retrying. |

**Example: starts an activity for an id**

```js
const result = await dsx.module.liveactivity.start({"id":"dl_1","name":"movie.mp4","progress":0});
// resolves {"id":"dl_1","started":true}
```

**Example: seeds the first frame's status line**

```js
const result = await dsx.module.liveactivity.start({"id":"order_7","name":"Sakura Sushi","progress":0.1,"status":"Order confirmed"});
// resolves {"id":"order_7","started":true}
```

### status

`dsx.module.liveactivity.status`

Checks whether a live activity still exists and whether the system sees it as stale.

**When to use it.** Use it to test an activity or to decide whether to start a new one. It changes nothing.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the activity to check. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `exists` | boolean | yes | True while the activity is running. |
| `isStale` | boolean | yes | True when the system has marked the activity as out of date. |
| `staleDate` | number | yes | When the activity becomes stale, as a time in seconds. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `activity_failed` | The activity state or presentation could not be updated. |  |
| `invalid_argument` | The activity request contains an invalid value. | Not recoverable by retrying. |

**Example: an unknown id does not exist and is not stale**

```js
const result = await dsx.module.liveactivity.status({"id":"dl_missing"});
// resolves {"exists":false,"isStale":false,"staleDate":0}
```

### update

`dsx.module.liveactivity.update`

Changes the progress, status line or values of a running live activity.

**When to use it.** Use it each time something worth showing changes. To finish, use end.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the running activity to change. |
| `images` | object | no | Pictures to show, by name, each an https address that the app downloads before the first frame. |
| `progress` | number | no | How far along the activity is, from 0 to 1. |
| `stale` | number | no | Seconds after which the system marks the activity as out of date. |
| `status` | string | no | A short status line shown on the activity, such as Order confirmed. |
| `vars` | object | no | Your own values, by name, that the activity layout can show. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the activity that was updated. |
| `updated` | boolean | yes | True when the activity was updated. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `activity_failed` | The activity state or presentation could not be updated. |  |
| `invalid_argument` | The activity request contains an invalid value. | Not recoverable by retrying. |
| `unknown_id` | No live activity is running under that id; it was never started, or it has already ended. | Not recoverable by retrying. |

**Example: Move a delivery to half way**

```js
const result = await dsx.module.liveactivity.update({"id":"dl_1","progress":0.5,"status":"On the way"});
// resolves {"id":"dl_1","updated":true}
```

## Events

Read with `dsx.on(name, handler)`.

### event

Tells your app that the person tapped something in a live activity that sends a named event.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `activity` | string | yes | The id of the live activity the tap came from. |
| `data` | object | yes | The extra values the layout sent along with the event. |
| `name` | string | yes | The event name that the activity layout sent. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `download_activity_layout` | json | `{"file":"Components/DownloadActivity.dsx"}` | The DSX layout for the download Live Activity (lock screen and Dynamic Island). |

## Related packages

- Needs: [Notify](/packages/notify)
- Used by: [OneSignalLiveActivity](/packages/liveactivitypush)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
