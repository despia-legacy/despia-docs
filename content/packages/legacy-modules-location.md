---
title: LegacyLocation
description: Keeps old location tracking pages working on the new location package.
package: location
---

Keeps old location tracking pages working on the new location package.

Gives pages written for the earlier Despia version the same start, stop and background tracking calls they used before, and passes each kept point back as the old change event. It builds on the Geo package, which owns the real location features. New apps should call Geo directly and not add this package.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Add it only for a page converted from the earlier Despia version that still uses its location tracking calls. For anything new, use the Geo package instead.

## Install

```sh
despia add Core/Legacy/Modules/Location
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

### background.off

`dsx.module.location.background.off`

Limits the running session to when the app is open.

**When to use it.** Call it when background tracking is no longer needed.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `background` | boolean | no | False once the session runs in the foreground only. |
| `ok` | boolean | yes | True when the setting was applied. |

**Example: switches the background continuation off**

```js
const result = await dsx.module.location.background.off({});
// resolves {"background":false,"ok":true}
```

### background.on

`dsx.module.location.background.on`

Lets the running session continue while the app is in the background.

**When to use it.** Call it after start when tracking must go on with the screen off; it asks for Always location access.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `background` | boolean | no | True when the session now runs in the background. |
| `ok` | boolean | yes | False when background tracking is switched off in the package config. |

**Example: switches the background continuation on**

```js
const result = await dsx.module.location.background.on({});
// resolves {"background":true,"ok":true}
```

### start

`dsx.module.location.start`

Starts a location tracking session that keeps points and optionally posts them to your server.

**When to use it.** Call it when an old page begins tracking.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `buffer` | number | no | Minimum seconds between kept points; the first point is always kept. |
| `movement` | number | no | Movement in centimetres that must pass before a new point is kept; 50000 or more tracks only significant movement and survives the app being closed. |
| `server` | string | no | Optional address that each kept point is sent to as JSON. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the session started. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_param` | A value such as buffer or movement is not a valid number. | Pass plain numbers and an absolute address for server. |

**Example: starts a session**

```js
const result = await dsx.module.location.start({"buffer":5});
// resolves {"ok":true}
```

### stop

`dsx.module.location.stop`

Ends the tracking session and returns all the points it kept.

**When to use it.** Call it when the old page finishes tracking.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the session ended. |
| `points` | array of object | yes | The points kept during the session, each with position, accuracy, speed, course, altitude, times and battery. |

**Example: stops and returns the points**

```js
const result = await dsx.module.location.stop({});
// resolves {"ok":true,"points":[]}
```

## Events

Read with `dsx.on(name, handler)`.

### change

Fires for every point the session keeps, and once more for the last point when the session stops.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `active` | boolean | yes | True while the session runs; false for the last point repeated when it stops. |
| `altitude` | number | yes | Height of the point above sea level. |
| `battery` | int | yes | Battery level of the device when the point was recorded. |
| `course` | number | yes | Direction of travel in degrees. |
| `gpsTimestamp` | number | yes | When the GPS system took the fix. |
| `horizontalAccuracy` | number | yes | How close the position is likely to be, as an error radius in metres. |
| `latitude` | number | yes | Latitude of the point in degrees. |
| `longitude` | number | yes | Longitude of the point in degrees. |
| `speed` | number | yes | Speed at the point, as reported by the system. |
| `timestamp` | number | yes | When the point was recorded. |
| `verticalAccuracy` | number | yes | How close the altitude is likely to be, as an error range in metres. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `background_enabled` | boolean | `false` | Allow the v3 location session to continue while the app is backgrounded. |

## Related packages

- Needs: [Geo](/packages/geo)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
