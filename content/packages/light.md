---
title: LightSensor
description: Read the ambient light level around the device, in lux and in simple words like dark or sunlight.
package: light
---

Read the ambient light level around the device, in lux and in simple words like dark or sunlight.

Reports how bright the room is, either once or as a stream that only changes when the light really changes. Each reading comes with a plain category such as dark, indoor or sunlight, so you can dim a reader or brighten a screen without choosing your own thresholds. It works on Android; iOS has no public light sensor.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it to adapt your screen to the room, for example a night theme or a brighter display in sun. It does not work on iOS, so keep a manual choice for those people.

## What native adds

It reads the phone's own light sensor, which a web page cannot do.

## Install

```sh
despia add Core/LightSensor
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone, tablet.

## Actions

### read

`dsx.module.light.read`

Takes one fresh light reading without leaving a stream open.

**When to use it.** Use it to choose a theme when a screen appears.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `category` | string | yes | The light level in words: dark, dim, indoor, overcast, daylight or sunlight. |
| `lux` | number | yes | How bright it is, in lux. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `timeout` | The light sensor did not report in time. |  |
| `unsupported_device` | This device has no ambient-light sensor. | Not recoverable by retrying. |
| `unsupported_platform` | This platform exposes no ambient-light sensor to apps. | Not recoverable by retrying. |

**Example: reads an office**

```js
const result = await dsx.module.light.read({});
// resolves {"category":"indoor","lux":400}
```

**Example: reads a dark room**

```js
const result = await dsx.module.light.read({});
// resolves {"category":"dark","lux":4}
```

### start

`dsx.module.light.start`

Begins streaming light readings. Only readings that really changed are delivered, so the stream does not wake your app for noise.

**When to use it.** Call it when a screen that adapts to light opens, and stop it when it closes.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `interval` | int | no | The fastest the sensor is asked to report, in milliseconds. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_device` | This device has no ambient-light sensor. | Not recoverable by retrying. |
| `unsupported_platform` | This platform exposes no ambient-light sensor to apps. | Not recoverable by retrying. |

**Example: streams readings, and only the ones that moved**

```js
const result = await dsx.module.light.start({"interval":500});
```

**Example: no interval streams at the default second**

```js
const result = await dsx.module.light.start({});
```

### stop

`dsx.module.light.stop`

Stops the light stream and releases the sensor. Stopping when nothing is running is fine.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `active` | boolean | yes | False once the stream has stopped. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_device` | This device has no ambient-light sensor. | Not recoverable by retrying. |
| `unsupported_platform` | This platform exposes no ambient-light sensor to apps. | Not recoverable by retrying. |

**Example: stops a running stream**

```js
const result = await dsx.module.light.stop({});
// resolves {"active":false}
```

**Example: stopping nothing is a no-op, so a teardown path needs no bookkeeping**

```js
const result = await dsx.module.light.stop({});
// resolves {"active":false}
```

## Events

Read with `dsx.on(name, handler)`.

### reading

A new light reading arrived while the stream is running.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `category` | string | yes | The light level in words, from dark to sunlight. |
| `lux` | number | yes | How bright it is, in lux. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
