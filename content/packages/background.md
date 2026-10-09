---
title: Background
description: Runs your app's declared tasks in the background and tells you honestly when they ran.
package: background
---

Runs your app's declared tasks in the background and tells you honestly when they ran.

Lets you declare periodic, one-time and refresh tasks and ask the system to run them while the app is closed. Neither iOS nor Android promises exact timing, so the status report shows when each task really ran, how long it took, how it ended and why it has not run yet. You write the action each task calls.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for work that can wait and does not need exact timing, such as syncing data, uploading a queue or warming content. Do not use it for anything that must happen at a fixed time, which needs a scheduled notification or a server.

## What native adds

The web has no background execution at all. This package uses the real system schedulers, and the status report lets you see what the system actually did.

## Install

```sh
despia add Core/Background
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

`dsx.module.background.cancel`

Withdraws a pending task request. Cancelling all clears every request but keeps the task declarations.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `all` | boolean | no | Set to true to withdraw the requests of every task. |
| `id` | string | no | The id of the task whose request you want to withdraw. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancelled` | array of string | yes | The ids of the tasks whose requests were withdrawn. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unknown_task` | No task with that id is declared by any package in the app. | Check the id against the background tasks declared in the package manifests. |
| `unsupported_platform` | This platform has no deferred background execution. | Skip background work on this platform, or do the work while the app is open. |

**Example: cancels one pending task**

```js
const result = await dsx.module.background.cancel({"id":"sync"});
// resolves {"cancelled":["sync"]}
```

**Example: cancels everything pending**

```js
const result = await dsx.module.background.cancel({"all":true});
// resolves {"cancelled":["sync","upload"]}
```

### deliver

`dsx.module.background.deliver`

Lets another package hand a background wake, such as a location change, to a declared task. The run is recorded in the same status report as every other run.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `data` | object | no | Values to pass to the task. |
| `id` | string | yes | The id of the declared task to run. |
| `reason` | string | no | Why the wake happened, for the run record. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `durationMs` | int | yes | How long the run took in milliseconds. |
| `id` | string | yes | The id of the task that ran. |
| `result` | string | yes | How the background run ended, such as success. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `budget_exceeded` | The run used its whole time budget and was stopped. | Make the task do less work per run, or split it into smaller tasks. |
| `run_failed` | The task's own action threw an error, which is recorded as the result of the run. | Fix the action the task calls, then check status for the last result. |
| `unknown_task` | No task with that id is declared by any package in the app. | Check the id against the background tasks declared in the package manifests. |
| `unsupported_platform` | This platform has no deferred background execution. | Skip background work on this platform, or do the work while the app is open. |

**Example: delivers a geofence crossing to a declared task with no screen mounted**

```js
const result = await dsx.module.background.deliver({"data":{"region":"store-42"},"id":"sync","reason":"geo.enter"});
// resolves {"durationMs":120,"id":"sync","result":"success"}
```

### run

`dsx.module.background.run`

Runs a declared task right now, for testing. It works only in debug builds, and on a release build it does nothing.

**When not to.** Never rely on it in a released app, because the system must be the one to run your tasks.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the declared task to run. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `durationMs` | int | yes | How long the run took in milliseconds. |
| `id` | string | yes | The id of the task that ran. |
| `result` | string | yes | How the run ended, such as success or failure. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `budget_exceeded` | The run used its whole time budget and was stopped. | Make the task do less work per run, or split it into smaller tasks. |
| `debug_only` | This action is for debugging and does nothing on a release build. | Let the system schedule the task, and use it only in debug builds. |
| `run_failed` | The task's own action threw an error, which is recorded as the result of the run. | Fix the action the task calls, then check status for the last result. |
| `unknown_task` | No task with that id is declared by any package in the app. | Check the id against the background tasks declared in the package manifests. |

**Example: runs a declared task now on a debug build**

```js
const result = await dsx.module.background.run({"id":"sync"});
// resolves {"durationMs":4200,"id":"sync","result":"success"}
```

### schedule

`dsx.module.background.schedule`

Asks the system to run a declared task. The earliest time is a hint and not a promise, and scheduling a task again replaces its earlier request.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `earliest` | int | no | The earliest delay before the task may run, in seconds from now. |
| `id` | string | yes | The id of the declared task to schedule. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the task that was scheduled. |
| `nextEarliest` | int | yes | The earliest time the task may run, as a Unix time in seconds. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `restricted` | Background activity is switched off for this app by the user or the device maker. | Explain this to the user and point them to the system settings. |
| `unavailable` | The system scheduler refused the request. | Try again later. |
| `unknown_task` | No task with that id is declared by any package in the app. | Check the id against the background tasks declared in the package manifests. |
| `unsupported_platform` | This platform has no deferred background execution. | Skip background work on this platform, or do the work while the app is open. |

**Example: schedules a declared task and reports the earliest the OS may run it**

```js
const result = await dsx.module.background.schedule({"id":"sync"});
// resolves {"id":"sync","nextEarliest":1700000900000}
```

**Example: an explicit earliest hint is carried into the request**

```js
const result = await dsx.module.background.schedule({"earliest":3600,"id":"sync"});
// resolves {"id":"sync","nextEarliest":1700003600000}
```

### status

`dsx.module.background.status`

Reports whether background work is available, and for each declared task, when it last ran, how it ended and when it can run next. Use it to see what the system really did.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `available` | boolean | yes | True if this platform can run background work. |
| `restricted` | boolean | yes | True if the user or the device maker has switched background activity off for the app. |
| `tasks` | array of object | yes | One row per declared task with its kind, last run, last result and earliest next run. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | This platform has no deferred background execution. | Skip background work on this platform, or do the work while the app is open. |

**Example: reports every declared task with its last outcome**

```js
const result = await dsx.module.background.status({});
// resolves {"available":true,"restricted":false,"tasks":[{"action":"syncNow","id":"sync","kind":"periodic","lastDurationMs":4200,"lastResult":"success","lastRun":1700000000000,"nextEarliest":1700000900000,"registered":true,"requires":["network"],"unmet":[]}]}
```

**Example: reports a run the OS killed mid-flight rather than leaving it running**

```js
const result = await dsx.module.background.status({});
// resolves {"available":true,"restricted":false,"tasks":[{"action":"flushQueue","id":"upload","kind":"deferred","lastDurationMs":0,"lastResult":"killed","lastRun":1700000000000,"nextEarliest":0,"registered":true,"requires":["network","charging"],"unmet":["charging"]}]}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `default_earliest_seconds` | number | `900` | How long to wait, in seconds, before a scheduled task first becomes eligible to run when the caller gives no hint. |
| `log_runs` | boolean | `true` | Write one line to the app log each time a background task starts and finishes, with its outcome and duration. |
| `wake_on_boot` | boolean | `true` | Re-submit every declared periodic task when the device restarts. Off means background work stops until the user next opens the app. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
