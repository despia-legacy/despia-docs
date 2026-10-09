---
title: LegacyGyroscope
description: Keeps old pages that read the gyroscope and compass heading working.
package: gyroscope
---

Keeps old pages that read the gyroscope and compass heading working.

Supports pages written for the earlier Despia version that start the gyroscope with the old gyroscope address and listen for its change callback. It starts the device's motion sensors at 60 readings a second and passes the old-style readings back to the page. New apps should use the Motion package directly.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it only when you are keeping an older page that still calls the old gyroscope commands. For new work call the Motion package, which gives the same readings without this layer.

## Install

```sh
despia add Core/Legacy/Modules/Gyroscope
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

### start

`dsx.module.gyroscope.start`

Starts the gyroscope and compass heading stream for an older page, at 60 readings a second. A device without a gyroscope reports that it is unavailable.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `threshold` | number | no | Minimum rotation speed in degrees per second before a reading is sent. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the stream was started. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | This feature is unavailable on this device. | Not recoverable by retrying. |

**Example: starts the stream**

```js
const result = await dsx.module.gyroscope.start({"threshold":9.99});
// resolves {"ok":true}
```

### stop

`dsx.module.gyroscope.stop`

Stops the gyroscope and compass stream started by start.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `active` | boolean | yes | True when the stream is still running after the call. |

**Example: stops the stream**

```js
const result = await dsx.module.gyroscope.stop({});
// resolves {"active":false}
```

## Events

Read with `dsx.on(name, handler)`.

### calibration

The gyroscope sensor's calibration state changed, so older pages can react to it.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | yes | The new calibration state of the sensor. |

### change

A new gyroscope and compass reading, in the shape older pages expect.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `heading` | number | yes | Compass heading in degrees from magnetic north, or -1 until the first fix. |
| `headingAccuracy` | number | yes | An estimate of the heading error in degrees, or -1 until the first fix. |
| `status` | string | yes | The sensor state, which tells you whether the reading is valid. |
| `timestamp` | int | yes | When the reading was taken, in epoch milliseconds. |
| `x` | number | yes | Rotation around the x axis in radians per second. |
| `y` | number | yes | Rotation around the y axis in radians per second. |
| `z` | number | yes | Rotation around the z axis in radians per second. |

## Related packages

- Needs: [Motion](/packages/motion)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
