---
title: WatchHealth
description: Read heart rate, steps, workouts and other health readings from the paired watch.
package: health
---

Read heart rate, steps, workouts and other health readings from the paired watch.

Starts and stops heart rate monitoring and workouts on the user's watch, and reads today's steps, calories, distance and the latest heart rate variability, resting heart rate, oxygen and breathing readings. The watch asks the user for health permission. You decide what to show and what to do with the readings.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when your app should use health data recorded on the user's watch, such as a fitness or wellness feature. It needs a paired watch with your watch app installed; for health data kept on the phone, use a phone health package instead.

## What native adds

Readings come from the watch's own sensors and health store, which no web page can reach.

## Install

```sh
despia add Core/Extensions/Watch/Modules/Health
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

## Actions

### heartRate

`dsx.module.health.heartRate`

Starts or stops live heart rate readings from the watch. While on, readings arrive as watch.health events.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | yes | True to start, false to stop. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | yes | True when it is now running. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `health_denied` | The user refused health access on the watch. | Explain why you need the data and ask the user to allow it in the watch's settings. |
| `health_unavailable` | The watch has no health data source for that request. | Hide the feature for this watch. |
| `unreachable` | The watch could not be reached. | Ask the user to wake the watch and keep it near the phone, then try again. |
| `watch_unavailable` | The watch app is not part of this build. | Include the watch app, or hide the feature. |

**Example: starts the wrist heart-rate stream**

```js
const result = await dsx.module.health.heartRate({"on":true});
// resolves {"on":true}
```

**Example: stops the stream**

```js
const result = await dsx.module.health.heartRate({"on":false});
// resolves {"on":false}
```

### read

`dsx.module.health.read`

Reads one health value from the watch's health store, such as today's calories or the latest resting heart rate.

**When to use it.** Use it for a single value; use heartRate for a live stream.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `metric` | string | yes | Which value to read: calories, distance, hrv, restingHeartRate, oxygen or respiratory. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `metric` | string | yes | The metric that was read. |
| `unit` | string | yes | The unit of the value, such as kcal, meters, ms, bpm, percent or breaths per minute. |
| `value` | number | yes | The reading itself, in the unit given. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | Another read from the watch is still in progress. | Try again when it has finished. |
| `health_denied` | The user refused health access on the watch. | Explain why you need the data and ask the user to allow it in the watch's settings. |
| `health_unavailable` | The watch has no health data source for that request. | Hide the feature for this watch. |
| `no_data` | The watch has never recorded that metric, so there is no latest value. | Show an empty state. |
| `unreachable` | The watch could not be reached. | Ask the user to wake the watch and keep it near the phone, then try again. |
| `unsupported_metric` | This watch has no source for that metric. | Choose another metric or hide the feature. |
| `watch_unavailable` | The watch app is not part of this build. | Include the watch app, or hide the feature. |

**Example: reads today's active calories from the wrist**

```js
const result = await dsx.module.health.read({"metric":"calories"});
// resolves {"metric":"calories","unit":"kcal","value":320}
```

**Example: reads the latest HRV sample**

```js
const result = await dsx.module.health.read({"metric":"hrv"});
// resolves {"metric":"hrv","unit":"ms","value":54}
```

### steps

`dsx.module.health.steps`

Returns today's step count from the watch.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `steps` | number | yes | The number of steps counted by the watch so far today. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | Another read from the watch is still in progress. | Try again when it has finished. |
| `health_denied` | The user refused health access on the watch. | Explain why you need the data and ask the user to allow it in the watch's settings. |
| `health_unavailable` | The watch has no health data source for that request. | Hide the feature for this watch. |
| `unreachable` | The watch could not be reached. | Ask the user to wake the watch and keep it near the phone, then try again. |
| `watch_unavailable` | The watch app is not part of this build. | Include the watch app, or hide the feature. |

**Example: reads today's step count from the wrist health store**

```js
const result = await dsx.module.health.steps({});
// resolves {"steps":4210}
```

### workout

`dsx.module.health.workout`

Starts, pauses, resumes or ends a workout session on the watch and reports its state.

**When to use it.** Use on to start or stop a workout, or control to pause, resume or end a session that is running.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `activity` | string | no | The kind of workout to start, such as running. |
| `control` | string | no | Controls a running workout: pause, resume or end. When given, on is ignored. |
| `on` | boolean | no | True to start, false to stop. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `duration` | number | no | How long the workout has been running, in seconds. |
| `on` | boolean | yes | True when it is now running. |
| `paused` | boolean | no | True when the workout is paused. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_control` | The control value is not pause, resume or end. | Pass pause, resume or end. |
| `health_denied` | The user refused health access on the watch. | Explain why you need the data and ask the user to allow it in the watch's settings. |
| `health_unavailable` | The watch has no health data source for that request. | Hide the feature for this watch. |
| `no_workout` | There is no workout running to control. | Start a workout first. |
| `unreachable` | The watch could not be reached. | Ask the user to wake the watch and keep it near the phone, then try again. |
| `watch_unavailable` | The watch app is not part of this build. | Include the watch app, or hide the feature. |
| `workout_failed` | The watch could not start or end the workout. | Try again. |

**Example: starts a workout session on the wrist**

```js
const result = await dsx.module.health.workout({"activity":"running","on":true});
// resolves {"on":true}
```

**Example: pauses the live session in place**

```js
const result = await dsx.module.health.workout({"control":"pause"});
// resolves {"on":true,"paused":true}
```

## Events

Read with `dsx.on(name, handler)`.

### watch.health

Sent when the watch reports a health reading, about every two seconds during a workout and with each reading while heart rate is on.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `at` | number | yes | When the reading was taken, in epoch seconds. |
| `bpm` | int | no | The heart rate in beats per minute. |
| `calories` | number | no | Active calories burned so far. |
| `distance` | number | no | Distance covered so far, in meters. |
| `heartRate` | int | no | The latest heart rate in beats per minute. |
| `kind` | string | yes | What kind of reading it is. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `update_usage_description` | string | `Workouts you record on your watch are saved to Health.` | Shown when the watch asks permission to save workouts to Health. Explain why the app records health data. |
| `usage_description` | string | `Heart rate, workouts and steps are read on your watch to power this app's health screens.` | Shown when the watch asks permission to read heart rate, workouts and steps. Explain why the app wants Health data. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `fixture_not_found` | The test data you named is not part of this watch build. | Use a test data name that ships with the build. |
| `missing_command` | A watch command was sent without a name. | Pass the command name. |
| `offline` | The watch answered but the phone has no connection. | Try again when the phone is online. |
| `unknown_command` | The watch app has no feature with that name. | Check the command name against your watch app. |
| `unsupported_on_surface` | That command does not exist on the surface it was sent to. | Send it to the surface that supports it. |
| `watch_failed` | The watch could not complete the command and gave a reason this package does not know. | Check data.code for the watch's own reason. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
