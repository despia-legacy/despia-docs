---
title: Motion sensors
description: Read accelerometer, gyroscope, steps and activity from the device.
package: motion
---

Read accelerometer, gyroscope, steps and activity from the device.

Streams motion sensor data at the rate you choose, and reads the barometer, step count and activity type such as walking or driving. Use it for fitness, games and gesture features. Asks for motion permission when needed, with text you set. Phones only.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for fitness, games, gestures and movement-aware features that need motion data at a rate you choose. For a one-off compass or orientation reading on a page, the browser sensors may be enough.

## What native adds

Native sampling runs up to 100 Hz, keeps collecting while the app is in the background and can post batches to your server, none of which a web page can do.

## Install

```sh
despia add Core/Basics/Motion
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

### activity

`dsx.module.motion.activity`

Starts or stops classification of what the person is doing, such as walking, running, cycling or driving.

**When to use it.** Use it to adapt the app to movement, for example to hush notifications while driving. It is not available in the browser.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | no | True starts the classification and false stops it. |
| `prompt` | boolean | no | True lets the system permission dialog appear on this call when it can; false never shows it and fails if access is missing. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | Motion & fitness access is not granted. The data carries the contract state: { permission, status, canAsk }. |  |
| `start_failed` | Activity recognition could not be started. |  |
| `unsupported_device` | Activity recognition is not available on this device. | Not recoverable by retrying. |
| `unsupported_platform` | This runtime has no sensor of that kind. | Not recoverable by retrying. |

**Example: streams a recognized activity**

```js
const result = await dsx.module.motion.activity({"on":true});
```

### barometer

`dsx.module.motion.barometer`

Starts or stops air pressure readings and the altitude change since the first reading.

**When to use it.** Use it for floors climbed, altitude change and weather features. It is not available in the browser.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | no | True starts the readings and false stops them. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_device` | This device has no barometer. | Not recoverable by retrying. |
| `unsupported_platform` | This runtime has no sensor of that kind. | Not recoverable by retrying. |

**Example: streams pressure and relative altitude**

```js
const result = await dsx.module.motion.barometer({"on":true});
```

### capabilities

`dsx.module.motion.capabilities`

Reports which motion sensors this device has and the highest sampling rate it allows.

**When to use it.** Use it before offering a feature, so you can hide what the device cannot do.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accelerometer` | boolean | yes | True when the device has an accelerometer. |
| `activity` | boolean | yes | True when the device can tell walking from driving and similar activities. |
| `barometer` | boolean | yes | True when the device has an air pressure sensor. |
| `deviceMotion` | boolean | yes | True when the device can report fused motion such as attitude and gravity. |
| `gyroscope` | boolean | yes | True when the device has a gyroscope. |
| `magnetometer` | boolean | yes | True when the device has a magnetometer or compass. |
| `maxHz` | number | yes | The highest sampling rate in hertz that start may use. |
| `pedometer` | boolean | yes | True when the device can count steps. |

**Example: reports the device's sensor capabilities**

```js
const result = await dsx.module.motion.capabilities({});
// resolves {"accelerometer":true,"activity":true,"barometer":true,"deviceMotion":true,"gyroscope":true,"magnetometer":true,"maxHz":100,"pedometer":true}
```

### pedometer

`dsx.module.motion.pedometer`

Reads the steps, distance and floors the person has covered since a moment you choose.

**When to use it.** Use it for step counters and daily goals. It answers once; it does not stream.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `from` | number | no | The start of the period to count, as a time in milliseconds since 1970; leave it out for a default period. |
| `prompt` | boolean | no | True lets the system permission dialog appear on this call when it can; false never shows it and fails if access is missing. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `distance` | number | yes | The distance walked or run in the period, in meters. |
| `end` | number | yes | The end of the counted period, in milliseconds since 1970. |
| `floorsAscended` | number | yes | The number of floors climbed up in the period. |
| `floorsDescended` | number | yes | The number of floors walked down in the period. |
| `start` | number | yes | The start of the counted period, in milliseconds since 1970. |
| `steps` | number | yes | The number of steps taken in the period. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_reading` | The step counter delivered no reading. |  |
| `permission_denied` | Motion & fitness access is not granted. The data carries the contract state: { permission, status, canAsk }. |  |
| `unsupported_device` | Step counting is not available on this device. | Not recoverable by retrying. |
| `unsupported_platform` | This runtime has no sensor of that kind. | Not recoverable by retrying. |

**Example: resolves the step count since a given instant**

```js
const result = await dsx.module.motion.pedometer({"from":1700000000000});
// resolves {"distance":2410.5,"end":1700003600000,"floorsAscended":3,"floorsDescended":1,"start":1700000000000,"steps":3120}
```

### permission.manage

`dsx.module.motion.permission.manage`

Lets the person change a limited selection of what the app may access, where the system has such a screen.

**When to use it.** Use it when access was granted only in part and the person wants to widen or narrow it.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `changed` | boolean | yes | True when the person changed the selection; false where the system has no such screen. |
| `level` | string | no | How much access is granted when the system offers levels. |
| `status` | string | yes | The permission state after the screen closed. |

**Example: nothing limited to manage**

```js
const result = await dsx.module.motion.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.motion.permission.openSettings`

Opens this app's page in the system Settings so the person can change the permission there.

**When to use it.** Use it after a denial, from a button the person taps; it cannot run on its own.

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
| `unavailable` | Opening Settings needs the App Settings package (dsx.module.settings). | Install the App Settings package, which owns this page. |
| `unsupported_platform` | No page script can open browser or OS settings. | Show instructions instead, since a web page cannot open browser or system settings. |

**Example: opens the app page**

```js
const result = await dsx.module.motion.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.motion.permission.request`

Asks the person for motion and fitness data by showing the system permission dialog when it can still be shown.

**When to use it.** Use it from a settings row or an onboarding step. Feature calls already ask just in time, so you rarely need it first.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `level` | string | no | How much access was granted when the system offers levels, such as full or limited. |
| `status` | string | yes | The permission state after the request. |

**Example: granted**

```js
const result = await dsx.module.motion.permission.request({});
// resolves {"canAsk":false,"status":"granted"}
```

### permission.status

`dsx.module.motion.permission.status`

Reads whether the app may use motion and fitness data right now, without ever showing a dialog.

**When to use it.** Use it to decide what to show on a screen, for example on every appear of a settings row.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog. |
| `level` | string | no | How much access was granted when the system offers levels, such as full or limited. |
| `status` | string | yes | The Motion and Fitness permission state, such as granted, denied or undetermined. |

**Example: never asked**

```js
const result = await dsx.module.motion.permission.status({});
// resolves {"canAsk":true,"status":"undetermined"}
```

**Example: a final denial: only Settings helps**

```js
const result = await dsx.module.motion.permission.status({});
// resolves {"canAsk":false,"status":"denied"}
```

### start

`dsx.module.motion.start`

Starts one motion stream with the sensors and sampling rate you choose, and sends each sample as a single object.

**When to use it.** Use it for games, gesture detection and fitness tracking. Ask only for the sensors you need to save battery.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `buffer` | number | no | While the app is in the background, seconds between the samples that are kept for later. |
| `cap` | number | no | How many samples to keep while in the background; the oldest are dropped and counted. |
| `hz` | number | no | How many samples per second to take; it is capped by the maximum sampling rate setting. |
| `sensors` | array of string | no | The sensor blocks to include in each sample, such as accelerometer, gyroscope, magnetometer, attitude, gravity or userAcceleration. |
| `server` | string | no | A web address that the app posts the background samples to by itself, even if the app is never reopened. |
| `threshold` | number | no | A movement size in g below which samples are skipped, so a still phone sends nothing. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | Motion and orientation access was not granted. |  |
| `unsupported_device` | This device has none of the requested motion sensors. | Not recoverable by retrying. |
| `unsupported_sensor` | One of the requested sensors is not a known sensor name. | Not recoverable by retrying. |

**Example: streams a fused accelerometer + gyroscope sample**

```js
const result = await dsx.module.motion.start({"hz":60,"sensors":["accelerometer","gyroscope"]});
```

**Example: streams attitude when device motion is requested**

```js
const result = await dsx.module.motion.start({"hz":100,"sensors":["attitude","gravity","userAcceleration"]});
```

### stop

`dsx.module.motion.stop`

Stops the motion stream and releases the sensors.

**When to use it.** Use it when the screen that needs motion data closes, to save battery.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `active` | boolean | yes | True while the stream is still running; false once it has stopped. |

**Example: stops the IMU stream**

```js
const result = await dsx.module.motion.stop({});
// resolves {"active":false}
```

## Events

Read with `dsx.on(name, handler)`.

### activity

Delivers the activity the device thinks the person is doing, each time it changes.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `automotive` | boolean | yes | True when the person is in a vehicle. |
| `confidence` | number | yes | How sure the system is, from 0 to 1. |
| `cycling` | boolean | yes | True when the person is cycling. |
| `running` | boolean | yes | True when the person is running. |
| `stationary` | boolean | yes | True when the person is still. |
| `status` | string | yes | Whether the classification was delivered successfully. |
| `timestamp` | int | yes | When the classification was made, in milliseconds since 1970. |
| `type` | string | yes | The detected activity: stationary, walking, running, automotive, cycling or unknown. |
| `unknown` | boolean | yes | True when the activity could not be determined. |
| `walking` | boolean | yes | True when the person is walking. |

### batch

Delivers the samples kept while the app was in the background, as one event when the app comes back or the stream stops.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | int | yes | How many samples the batch holds. |
| `dropped` | int | yes | How many samples were lost because the background buffer was full. |
| `from` | int | yes | The time of the first sample, in milliseconds since 1970. |
| `samples` | array of object | yes | The kept samples, oldest first. |
| `status` | string | yes | Whether the batch was delivered successfully. |
| `to` | int | yes | The time of the last sample, in milliseconds since 1970. |

### calibration

Tells you the compass heading has become unreliable and the device needs to be moved in a figure of eight.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | Always calibration_required for this event. |

### change

Delivers one sample of the sensors you asked for while the app is open.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accelerometer` | object | no | Acceleration on three axes in g, present when you asked for it. |
| `accelerometer.x` | number | yes | Acceleration along the x axis in g. |
| `accelerometer.y` | number | yes | Acceleration along the y axis in g. |
| `accelerometer.z` | number | yes | Acceleration along the z axis in g. |
| `attitude` | object | no | The device's orientation as roll, pitch and yaw angles. |
| `attitude.pitch` | number | yes | The pitch angle of the device. |
| `attitude.quaternion` | object | no | The same orientation as a quaternion, on phones only. |
| `attitude.roll` | number | yes | The roll angle of the device. |
| `attitude.yaw` | number | yes | The yaw angle of the device. |
| `gravity` | object | no | The direction and strength of gravity on three axes. |
| `gravity.x` | number | yes | Gravity along the x axis. |
| `gravity.y` | number | yes | Gravity along the y axis. |
| `gravity.z` | number | yes | Gravity along the z axis. |
| `gyroscope` | object | no | Rotation speed on three axes, in radians per second natively and degrees per second on the web. |
| `gyroscope.x` | number | yes | Rotation speed around the x axis. |
| `gyroscope.y` | number | yes | Rotation speed around the y axis. |
| `gyroscope.z` | number | yes | Rotation speed around the z axis. |
| `heading` | object | no | The compass heading of the device. |
| `heading.accuracy` | number | yes | How accurate the heading is, in degrees; negative when it is not calibrated or unknown. |
| `heading.magnetic` | number | yes | The heading in degrees from magnetic north. |
| `magnetometer` | object | no | The magnetic field on three axes, on phones only. |
| `magnetometer.x` | number | yes | The magnetic field along the x axis. |
| `magnetometer.y` | number | yes | The magnetic field along the y axis. |
| `magnetometer.z` | number | yes | The magnetic field along the z axis. |
| `rotationRate` | object | no | How fast the device is rotating on three axes. |
| `rotationRate.x` | number | yes | Rotation rate around the x axis. |
| `rotationRate.y` | number | yes | Rotation rate around the y axis. |
| `rotationRate.z` | number | yes | Rotation rate around the z axis. |
| `status` | string | yes | Whether the sample was delivered successfully. |
| `timestamp` | int | yes | When the sample was taken, in milliseconds since 1970. |
| `userAcceleration` | object | no | Acceleration caused by the person moving the device, with gravity removed. |
| `userAcceleration.x` | number | yes | User acceleration along the x axis. |
| `userAcceleration.y` | number | yes | User acceleration along the y axis. |
| `userAcceleration.z` | number | yes | User acceleration along the z axis. |

### pressure

Delivers one air pressure reading while the barometer stream is on.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `pressure` | number | yes | The air pressure in kilopascals. |
| `relativeAltitude` | number | yes | The height change in meters since the first reading of this barometer session. |
| `status` | string | yes | Whether the reading was delivered successfully. |
| `timestamp` | int | yes | When the reading was taken, in milliseconds since 1970. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `background_enabled` | boolean | `false` | Keep the motion stream alive while the app is in the background. |
| `background_notification_text` | string |  | Body of the ongoing Android notification shown while motion is tracked in the background. |
| `background_notification_title` | string |  | Title of the ongoing Android notification shown while motion is tracked in the background. |
| `max_hz` | number | `100` | Upper bound, in hertz, on the sampling rate a page may ask for. |
| `usage_motion` | multiline | `Reading your device's motion sensors to detect movement and count your steps` | The message shown when iOS asks for motion & fitness access. |

## Related packages

- Used by: [LegacyGyroscope](/packages/gyroscope)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
