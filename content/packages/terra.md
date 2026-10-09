---
title: Terra Health
description: Pull Apple Health and wearable data into your app through Terra.
package: terra
---

Pull Apple Health and wearable data into your app through Terra.

Connects Apple Health and wearables such as Fitbit, Garmin, Oura and Whoop through Terra, then syncs and reads the data. Needs a Terra account and developer ID, and your own server to start sessions with Terra's API. It is off by default and you turn it on when you want it.

## How it connects

- **Apple Health** is read on the device through HealthKit. iOS asks the person once, with the purpose strings you set.
- **Wearables** (Fitbit, Garmin, Oura, Whoop and more) connect through Terra's Connect widget, opened from your app.
- **Your server** mints the session token with Terra's API, so your Terra API key never ships in the app.

## Set it up

1. Create a developer account at [Terra](https://tryterra.co) and copy your developer ID.
2. Add **Terra Health** and set **Developer ID**. Leaving it empty keeps the integration off.
3. Write the **Health read prompt** iOS shows when it asks to read Health data.
4. Add a route on your server that asks Terra for a session token for the signed-in user.

| Setting | What it is |
| --- | --- |
| Developer ID | Your Terra developer ID |
| Health read prompt | The message iOS shows before reading Health data |
| Health write prompt | The message iOS shows before saving to Health |

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Add it when your app should read Apple Health or wearable data (Fitbit, Garmin, Oura, Whoop) and forward it to your own backend through Terra. It needs a Terra account; if you only want Apple Health data inside the app, use the HealthKit package.

## What native adds

Reads Apple Health through the real HealthKit and Health Connect permission sheets and background delivery, which a web page cannot do.

## Install

```sh
despia add Core/Health/Terra
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

## Actions

### connect

`dsx.module.terra.connect`

Links Apple Health or a wearable provider to Terra for this person and starts the first sync.

**When to use it.** Call it when the person chooses to share health data; calling it again for the same user just resyncs.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `backfill_days` | number | no | How many days of history to load when connecting; defaults to the last value, then 7. |
| `ignored_sources` | array of string | no | App ids whose Apple Health data should be left out, for example to avoid duplicates with a wearable provider. |
| `session` | string | no | A Terra token from your server for Apple Health, or a Connect widget address for other providers. |
| `user_id` | string | no | Your own stable id for the person; Terra stores it as the reference id. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alreadyConnected` | boolean | no | True when the source was already linked and was only resynced. |
| `params` | object | no | Extra values the widget returned. |
| `provider` | string | yes | The linked source, such as healthkit. |
| `referenceId` | string | no | Your own id for the person, as stored in Terra. |
| `resource` | string | no | The provider that was linked through the widget. |
| `userId` | string | no | The Terra user id for the person. |
| `via` | string | no | Set to widget when a provider was linked through the Connect widget. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `connect_failed` | Terra could not link the data source. | Try again; check that your session token is fresh and was made for this user. |
| `invalid_widget_url` | The session looks like a web address but could not be read as one. | Pass the exact https address your server got from Terra. |
| `missing_session` | The first connection needs a session token from your server. | Ask your server to create a Terra session and pass it as session. |
| `missing_user_id` | The call needs a user_id and none was given. | Pass your own stable id for the person as user_id. |
| `not_configured` | Terra is not set up: the developer id is empty or the device has no health data store. | Fill in the Terra developer id in the package config and rebuild, and only offer this on devices with Apple Health. |
| `sdk_init_failed` | The Terra SDK could not start. | Check the developer id and try again; if it persists, update the app. |
| `widget_auth_failed` | The provider sign-in failed for a reason other than the person cancelling. | Show a retry button and check the provider and redirect settings. |
| `widget_cancelled` | The person closed the sign-in sheet of the data provider. | Treat it as a normal choice and let them try again later. |

**Example: links and resolves the connection**

```js
const result = await dsx.module.terra.connect({"session":"https://widget.tryterra.co/session/abc","user_id":"ref_123"});
// resolves {"provider":"fitbit","via":"widget"}
```

### data

`dsx.module.terra.data`

Reads health data straight from the device for display in your app, without sending it to your destination.

**When to use it.** Use it to draw charts or summaries in the app; it needs a successful connect first.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `end` | number | no | End of the window as a time in milliseconds; overrides query. |
| `query` | string | no | The time window: daily (since the start of today), weekly (last 7 days) or hourly (last hour). |
| `resources` | array of string | no | Which kinds of data to read, such as daily, activity, sleep, body, nutrition, menstruation or athlete. |
| `start` | number | no | Start of the window as a time in milliseconds; overrides query. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `endMs` | int | no | End of the window as a time in milliseconds. |
| `failed` | array of object | no | The data kinds that could not be read, each with the reason. |
| `query` | string | yes | The window that was read. |
| `resources` | array of string | no | The data kinds that were read. |
| `results` | object | no | The data read, grouped by kind. |
| `startMs` | int | no | Start of the window as a time in milliseconds. |
| `succeeded` | array of string | yes | The data kinds that were read. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Terra is not set up: the developer id is empty or the device has no health data store. | Fill in the Terra developer id in the package config and rebuild, and only offer this on devices with Apple Health. |
| `not_connected` | No data source is linked yet. | Call connect first, then retry. |
| `sdk_init_failed` | The Terra SDK could not start. | Check the developer id and try again; if it persists, update the app. |

**Example: reads the requested resources**

```js
const result = await dsx.module.terra.data({"query":"daily","resources":["daily","sleep"]});
// resolves {"query":"daily","succeeded":["daily"]}
```

### disconnect

`dsx.module.terra.disconnect`

Unlinks the person inside the app; your server must remove them in Terra itself.

**When to use it.** Call it when the person turns health sharing off.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Terra is not set up: the developer id is empty or the device has no health data store. | Fill in the Terra developer id in the package config and rebuild, and only offer this on devices with Apple Health. |
| `not_connected` | No data source is linked yet. | Call connect first, then retry. |

**Example: clears app-side state and broadcasts**

```js
const result = await dsx.module.terra.disconnect({});
// resolves {}
```

### permission.manage

`dsx.module.terra.permission.manage`

Lets the person change a limited selection where the system has one; otherwise returns the current state unchanged.

**When to use it.** Call it from a settings row; it reports changed false where there is no selection to change.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `user_id` | string | no | Your id for the person; optional here. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system dialog can still be shown; false once the person has refused it. |
| `changed` | boolean | yes | True when the selection was changed; false where the platform has no limited selection. |
| `level` | string | no | Access level where the platform offers more than all-or-nothing; empty otherwise. |
| `status` | string | yes | Current permission: undetermined, granted, denied, restricted or unavailable. |

**Example: nothing limited to manage**

```js
const result = await dsx.module.terra.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.terra.permission.openSettings`

Opens this app's page in the system Settings so the person can change the health data permission.

**When to use it.** Use it after a refusal where canAsk is false, from a tap.

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
| `unavailable` | Opening Settings needs the App Settings package, which is not in this build. | Add the App Settings package, or tell the person where to change the permission. |
| `unsupported_platform` | This platform has no system settings page to open. | Skip the settings row here and explain how to change the permission. |

**Example: opens the app page**

```js
const result = await dsx.module.terra.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.terra.permission.request`

Shows the system health data permission dialog when it can still be shown, and returns the resulting state.

**When to use it.** Use it from an explicit step such as onboarding or a settings row.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `user_id` | string | no | Your id for the person; optional here. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system dialog can still be shown; false once the person has refused it. |
| `level` | string | no | Access level where the platform offers more than all-or-nothing; empty otherwise. |
| `message` | string | no | A plain-language note about the result, for logging. |
| `requested` | boolean | no | True when the system sheet was shown by this call. |
| `status` | string | yes | Current permission: undetermined, granted, denied, restricted or unavailable. |

**Example: granted**

```js
const result = await dsx.module.terra.permission.request({});
// resolves {"canAsk":false,"status":"granted"}
```

### permission.status

`dsx.module.terra.permission.status`

Reads the health data permission without ever showing a dialog.

**When to use it.** Call it on a settings screen to decide what to show.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `user_id` | string | no | Your id for the person; optional here. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system dialog can still be shown; false once the person has refused it. |
| `level` | string | no | Access level where the platform offers more than all-or-nothing; empty otherwise. |
| `message` | string | no | A plain-language note about the state, for logging. |
| `status` | string | yes | Current permission: undetermined, granted, denied, restricted or unavailable. |

**Example: never asked**

```js
const result = await dsx.module.terra.permission.status({});
// resolves {"canAsk":true,"status":"undetermined"}
```

**Example: a final denial: only Settings helps**

```js
const result = await dsx.module.terra.permission.status({});
// resolves {"canAsk":false,"status":"denied"}
```

### sync

`dsx.module.terra.sync`

Sends the latest health data to your Terra destination now, without asking the person again.

**When to use it.** Call it to refresh before showing data, or from a pull to refresh.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `backfill_days` | number | no | How many days to include in this sync; defaults to the last value, then 7. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `days` | int | no | How many days of data the sync covered. |
| `durationMs` | int | no | How long the sync took in milliseconds. |
| `failed` | array of object | no | The data types that failed, each with the reason. |
| `reason` | string | no | Why the sync was skipped, such as in_progress. |
| `skipped` | boolean | no | True when another sync was already running, so none was started. |
| `source` | string | yes | What started the sync, such as sync, connect or launch_resync. |
| `succeeded` | array of string | no | The data types that synced. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_user_id` | The call needs a user_id and none was given. | Pass your own stable id for the person as user_id. |
| `not_configured` | Terra is not set up: the developer id is empty or the device has no health data store. | Fill in the Terra developer id in the package config and rebuild, and only offer this on devices with Apple Health. |
| `not_connected` | No data source is linked yet. | Call connect first, then retry. |
| `sdk_init_failed` | The Terra SDK could not start. | Check the developer id and try again; if it persists, update the app. |

**Example: backfills and resolves the run**

```js
const result = await dsx.module.terra.sync({"backfill_days":7});
// resolves {"days":7,"source":"sync"}
```

## Events

Read with `dsx.on(name, handler)`.

### connected

A source was linked; it carries the same values the connect call returns.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alreadyConnected` | boolean | no | True when the source was already linked. |
| `params` | object | no | Extra values the widget returned. |
| `provider` | string | yes | The linked source, such as healthkit. |
| `referenceId` | string | yes | Your own id for the person, as stored in Terra. |
| `resource` | string | no | The provider linked through the widget. |
| `userId` | string | yes | The Terra user id for the person. |
| `via` | string | no | Set to widget for providers linked through the Connect widget. |

### disconnected

The person was unlinked inside the app.

_None._

### ready

Fires on every page load with the current connection state, so the page needs no setup call.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `available` | boolean | yes | True when Terra is configured and health data exists on the device. |
| `connected` | boolean | yes | True when Apple Health is linked. |
| `provider` | string | yes | The linked source, or empty. |
| `sync` | object | yes | The state of the latest sync. |
| `sync.days` | int | yes | How many days the current or last sync covered. |
| `sync.durationMs` | int | yes | How long the last finished sync took, in milliseconds. |
| `sync.finishedAt` | int | yes | When the last sync ended, in milliseconds. |
| `sync.inProgress` | boolean | yes | True while a sync is running. |
| `sync.lastSuccessAt` | int | yes | When the last successful sync finished, in milliseconds. |
| `sync.source` | string | yes | What started the current or last sync. |
| `sync.startedAt` | int | yes | When the current or last sync started, in milliseconds. |
| `sync.status` | string | yes | Whether the sync is idle, syncing or synced. |
| `userId` | string | yes | The Terra user id, or empty. |

### sync_started

A sync began, whether you asked for it or the app started it.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `days` | int | yes | How many days of data the sync covers. |
| `source` | string | yes | What started the sync, such as connect, sync or launch_resync. |

### synced

A sync finished, with how it went.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `days` | int | yes | How many days of data the sync covered. |
| `durationMs` | int | yes | How long the sync took in milliseconds. |
| `failed` | array of object | yes | The data types that failed, each with the reason. |
| `source` | string | yes | What started the sync, such as connect or sync. |
| `succeeded` | array of string | yes | The data types that synced. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `devId` | string | `` | Your Terra developer ID; leave empty to keep the integration off. |
| `usage_share_description` | multiline | `Read your health and workout data to sync it with the app.` | The message shown when iOS asks permission to read Health data. |
| `usage_update_description` | multiline | `Save the health data you choose to record in the app.` | The message shown when iOS asks permission to save data to Health. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `connect_failed` | The connection could not be completed. |  |
| `invalid_widget_url` | That is not a usable Terra Connect widget URL. |  |
| `missing_session` | A session token is required for a first-time connect. |  |
| `missing_user_id` | The call needs a user_id and none was given. | Pass your own stable id for the person as user_id. |
| `not_configured` | Terra is not configured. Fill in the dev-id in this package's config.json. |  |
| `not_connected` | The health store is not connected yet. Call connect first. |  |
| `sdk_init_failed` | The Terra SDK could not start. |  |
| `widget_auth_failed` | The provider's sign-in sheet did not authenticate. |  |
| `widget_cancelled` | The sign-in sheet was dismissed before it finished. |  |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
