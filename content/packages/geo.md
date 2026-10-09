---
title: Location
description: Get the user's location, track movement and trigger geofences.
package: geo
---

Get the user's location, track movement and trigger geofences.

Gets the current position, watches location changes, sets up geofences that fire when users arrive or leave, and reads compass heading and visits. Asks for permission only when a feature needs it, and you write the permission text users see. Use it for delivery, fitness and nearby offers. Phones only.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when a feature depends on where the user is: showing a position, tracking a trip, firing an alert on arrival, or offering something near a store. Skip it if you only need a rough country or language, which the device locale already gives you.

## What native adds

Native location gives you the operating system's own permission flow, battery-aware filtering, geofences that wake a closed app, compass heading and place visits, none of which a web page can do reliably.

## Install

```sh
despia add Core/Geo
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

### bearing

`dsx.module.geo.bearing`

Works out the compass direction from one point to another, in degrees clockwise from true north. Needs no permission.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `from` | object | yes | The point you are measuring the direction from. |
| `from.lat` | number | yes | Latitude of the starting point in degrees, from -90 to 90. |
| `from.lon` | number | yes | Longitude of the starting point in degrees, from -180 to 180. |
| `to` | object | yes | The point you are measuring the direction towards. |
| `to.lat` | number | yes | Latitude of the target point in degrees, from -90 to 90. |
| `to.lon` | number | yes | Longitude of the target point in degrees, from -180 to 180. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `degrees` | number | yes | The bearing from 0 up to 360, where 0 is north. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_argument` | from and to need a lat in [-90, 90] and a lon in [-180, 180]. | Not recoverable by retrying. |

**Example: due east**

```js
const result = await dsx.module.geo.bearing({"from":{"lat":0,"lon":0},"to":{"lat":0,"lon":1}});
// resolves {"degrees":90}
```

### current

`dsx.module.geo.current`

Gets the user's position once. A recent cached fix answers instantly; otherwise it asks for one fresh fix.

**When not to.** For continuous updates use watch.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accuracy` | string | no | How precise the fix should be: navigation, best, balanced (the default), low, passive or adaptive. |
| `maxAge` | int | no | Accept a cached fix no older than this many milliseconds. |
| `prompt` | boolean | no | Set false to fail with permission_denied instead of showing a system prompt. |
| `timeout` | int | no | How long to wait for a fix, in milliseconds (default 15000). |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accuracy` | number | yes | Horizontal accuracy of the fix, as a radius in metres. |
| `altitude` | number | yes | Altitude above sea level in metres, when the device knows it. |
| `altitudeAccuracy` | number | yes | How far off the altitude may be, in metres. |
| `heading` | number | yes | Direction of travel in degrees clockwise from north, when the device is moving. |
| `lat` | number | yes | Latitude of the fix in degrees. |
| `lon` | number | yes | Longitude of the fix in degrees. |
| `mocked` | boolean | yes | True when the fix comes from a mock or spoofing source, so you can refuse it. |
| `speed` | number | yes | Speed over the ground in metres per second. |
| `timestamp` | int | yes | When the fix was taken, in epoch milliseconds. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_argument` | accuracy must be navigation, best, balanced, low, passive or adaptive. | Not recoverable by retrying. |
| `permission_denied` | geo access is denied. Only Settings can change it: dsx.module.geo.permission.openSettings(). |  |
| `switched_off` | Location Services are turned off for the whole device. |  |
| `timeout` | No position within the timeout. |  |
| `unsupported_device` | This device has no location provider. | Not recoverable by retrying. |

**Example: answers one position**

```js
const result = await dsx.module.geo.current({"accuracy":"balanced"});
// resolves {"accuracy":5,"altitude":12.5,"altitudeAccuracy":8,"heading":0,"lat":25.1972,"lon":55.2744,"mocked":false,"speed":0,"timestamp":1700000000000}
```

### distance

`dsx.module.geo.distance`

Works out the straight-line distance in metres between two points on the earth. Needs no permission.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `from` | object | yes | The point you are measuring the distance from. |
| `from.lat` | number | yes | Latitude of the starting point in degrees, from -90 to 90. |
| `from.lon` | number | yes | Longitude of the starting point in degrees, from -180 to 180. |
| `to` | object | yes | The point you are measuring the distance to. |
| `to.lat` | number | yes | Latitude of the end point in degrees, from -90 to 90. |
| `to.lon` | number | yes | Longitude of the end point in degrees, from -180 to 180. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `meters` | number | yes | The straight-line distance between the two points, in metres. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_argument` | from and to need a lat in [-90, 90] and a lon in [-180, 180]. | Not recoverable by retrying. |

**Example: one degree of longitude on the equator**

```js
const result = await dsx.module.geo.distance({"from":{"lat":0,"lon":0},"to":{"lat":0,"lon":1}});
// resolves {"meters":111195.08}
```

### geocode

`dsx.module.geo.geocode`

Turns an address into coordinates using the device's own geocoder. Your users' addresses are never sent to a third party.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `address` | string | yes | The address or place name to look up. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `results` | array of object | yes | The matching places, each with coordinates and address parts. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `geocode_failed` | The platform geocoder could not resolve that address. |  |
| `invalid_argument` | No address was given, so there was nothing to look up. | Pass a non-empty address. |
| `timeout` | The geocoder did not answer in time. |  |
| `unsupported_platform` | This platform has no geocoder. Reaching a third-party endpoint with a user's address is not a framework default. | Not recoverable by retrying. |

**Example: resolves an address to coordinates**

```js
const result = await dsx.module.geo.geocode({"address":"1 Infinite Loop, Cupertino CA"});
// resolves {"results":[{"components":{"city":"Cupertino","country":"US","postalCode":"95014","region":"CA","street":"Infinite Loop"},"formatted":"1 Infinite Loop, Cupertino, CA 95014, United States","lat":37.3318,"lon":-122.0312}]}
```

### geofence.add

`dsx.module.geo.geofence.add`

Starts watching a circular region and tells the app when the user enters or leaves it, even when the app is closed. Name a background task to run on a crossing.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dwell` | int | no | Seconds the user must stay inside before the entry counts, where the platform supports it. |
| `id` | string | yes | Your name for the region, used to remove it later. |
| `lat` | number | yes | Latitude of the region centre in degrees. |
| `lon` | number | yes | Longitude of the region centre in degrees. |
| `notifyEnter` | boolean | no | Report when the user enters the region. |
| `notifyExit` | boolean | no | Report when the user leaves the region. |
| `prompt` | boolean | no | Set false to fail with permission_denied instead of showing a system prompt. |
| `radius` | number | yes | Region radius in metres; values below 100 or above 100000 are corrected. |
| `task` | string | no | Name of the background task to run on a crossing. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `clamped` | boolean | yes | True when the requested radius was changed to fit the platform limits. |
| `count` | int | yes | How many regions are monitored now. |
| `id` | string | yes | The region id that was added. |
| `radius` | number | yes | The radius actually used, in metres. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `escalation_required` | Region monitoring in the background needs the always grant. Ask for whenInUse, then escalate in context. |  |
| `invalid_argument` | A region needs a non-empty id and a coordinate. | Not recoverable by retrying. |
| `permission_denied` | geo access is denied. Only Settings can change it: dsx.module.geo.permission.openSettings(). |  |
| `region_limit` | This platform monitors a limited number of regions and the limit is reached. Remove one before adding another. |  |
| `switched_off` | Location Services are turned off for the whole device. |  |
| `unsupported_device` | This device has no location provider. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot monitor regions. | Not recoverable by retrying. |

**Example: monitors a region and reports the live count**

```js
const result = await dsx.module.geo.geofence.add({"id":"store-42","lat":37.7749,"lon":-122.4194,"radius":150});
// resolves {"clamped":false,"count":1,"id":"store-42","radius":150}
```

**Example: a radius below the reliable floor is raised and the correction is visible**

```js
const result = await dsx.module.geo.geofence.add({"id":"kiosk","lat":37.7749,"lon":-122.4194,"radius":5});
// resolves {"clamped":true,"count":1,"id":"kiosk","radius":100}
```

### geofence.list

`dsx.module.geo.geofence.list`

Lists the regions being monitored and the platform limit, so you can stay under the cap.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | int | yes | How many regions are monitored now. |
| `limit` | int | yes | The most regions this platform lets the app monitor. |
| `regions` | array of object | yes | The list of regions the app is monitoring now. |

**Example: lists the live regions against the platform cap**

```js
const result = await dsx.module.geo.geofence.list({});
// resolves {"count":1,"limit":20,"regions":[{"id":"store-42","lat":37.7749,"lon":-122.4194,"radius":150,"task":"arrival"}]}
```

**Example: an empty set still reports the cap**

```js
const result = await dsx.module.geo.geofence.list({});
// resolves {"count":0,"limit":20,"regions":[]}
```

### geofence.remove

`dsx.module.geo.geofence.remove`

Stops monitoring one region and frees its slot. Removing a region that was never added is not an error.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the region to remove. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | int | yes | How many regions are monitored now. |
| `removed` | boolean | yes | True when a region with that id was being monitored. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_argument` | A region id is required. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot monitor regions. | Not recoverable by retrying. |

**Example: removes a monitored region and frees a slot**

```js
const result = await dsx.module.geo.geofence.remove({"id":"store-42"});
// resolves {"count":1,"removed":true}
```

**Example: removing an unmonitored region is not an error**

```js
const result = await dsx.module.geo.geofence.remove({"id":"nowhere"});
// resolves {"count":1,"removed":false}
```

### heading.stop

`dsx.module.geo.heading.stop`

Stops the compass heading stream. Stopping when it is not running is not an error.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `stopped` | boolean | yes | True when a running stream was stopped. |

**Example: stops the compass**

```js
const result = await dsx.module.geo.heading.stop({});
// resolves {"stopped":true}
```

**Example: stopping nothing is not an error**

```js
const result = await dsx.module.geo.heading.stop({});
// resolves {"stopped":false}
```

### heading.watch

`dsx.module.geo.heading.watch`

Starts a stream of compass heading events until you stop it. Use it for compasses and direction arrows.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `filter` | number | no | Minimum change in degrees before a new heading is delivered. |
| `prompt` | boolean | no | Set false to fail with permission_denied instead of showing a system prompt. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | geo access is denied. Only Settings can change it: dsx.module.geo.permission.openSettings(). |  |
| `unsupported_device` | This device has no magnetometer. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot read a compass heading. | Not recoverable by retrying. |

**Example: streams magnetic and true heading with an accuracy**

```js
const result = await dsx.module.geo.heading.watch({"filter":2});
```

### last

`dsx.module.geo.last`

Returns the most recent cached position without turning on the location radio. Use it when a rough position is enough.

**When not to.** If you need a fresh fix, use current.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `maxAge` | int | no | Oldest acceptable cached fix, in milliseconds; an older one fails with timeout. |
| `prompt` | boolean | no | Set false to fail with permission_denied instead of showing a system prompt. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accuracy` | number | yes | Horizontal accuracy of the fix, as a radius in metres. |
| `altitude` | number | yes | Altitude above sea level in metres, when the device knows it. |
| `altitudeAccuracy` | number | yes | How far off the altitude may be, in metres. |
| `heading` | number | yes | Direction of travel in degrees clockwise from north, when the device is moving. |
| `lat` | number | yes | Latitude of the fix in degrees. |
| `lon` | number | yes | Longitude of the fix in degrees. |
| `mocked` | boolean | yes | True when the fix comes from a mock or spoofing source, so you can refuse it. |
| `speed` | number | yes | Speed over the ground in metres per second. |
| `timestamp` | int | yes | When the fix was taken, in epoch milliseconds. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | geo access is denied. Only Settings can change it: dsx.module.geo.permission.openSettings(). |  |
| `switched_off` | Location Services are turned off for the whole device. |  |
| `timeout` | No cached position within maxAge. Start a watch, or raise maxAge. |  |
| `unsupported_platform` | This surface cannot read location. | Not recoverable by retrying. |

**Example: answers from the cache without waking the radio**

```js
const result = await dsx.module.geo.last({"maxAge":60000});
// resolves {"accuracy":5,"altitude":12.5,"altitudeAccuracy":8,"heading":92.5,"lat":37.7749,"lon":-122.4194,"mocked":false,"speed":1.4,"timestamp":1700000000000}
```

### permission.manage

`dsx.module.geo.permission.manage`

Asks iOS for one-time full accuracy when the user only granted approximate location. Android and the web already report the state unchanged.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `precise` | boolean | no | Pass true to request temporary precise location. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when the app can still show the system prompt; false means only Settings can change it. |
| `changed` | boolean | yes | True when the call changed the precision the app has. |
| `level` | string | no | Which level the state describes, whenInUse or always. |
| `precise` | boolean | yes | True when the user granted precise location rather than approximate. |
| `prompted` | boolean | yes | True when this call showed a system prompt. |
| `status` | string | yes | Current permission state: undetermined, granted, limited, denied, restricted or unavailable. |

**Example: an already precise grant is unchanged**

```js
const result = await dsx.module.geo.permission.manage({"precise":true});
// resolves {"canAsk":true,"changed":false,"level":"whenInUse","precise":true,"prompted":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.geo.permission.openSettings`

Opens this app's page in the system Settings so the user can change location access. Call it from a tap, never automatically.

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
| `unavailable` | Opening Settings needs the App Settings package (dsx.module.settings). | Not recoverable by retrying. |
| `unsupported_platform` | A page cannot open the browser's settings. | Not recoverable by retrying. |

**Example: opens the app's settings page**

```js
const result = await dsx.module.geo.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.geo.permission.request`

Asks the user for location permission at the moment you call it. Ask for whenInUse first and for always later, in context.

**When not to.** Do not ask for always before whenInUse is granted; that is refused with escalation_required.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | string | no | Which permission to ask for: whenInUse (the default) or always. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when the app can still show the system prompt; false means only Settings can change it. |
| `level` | string | no | Which level the state describes, whenInUse or always. |
| `precise` | boolean | yes | True when the user granted precise location rather than approximate. |
| `prompted` | boolean | yes | True when this call showed a system prompt. |
| `settingsLabel` | string | no | On Android 11 and later, the localized name of the Settings option the user must choose for always access. |
| `status` | string | yes | Current permission state: undetermined, granted, limited, denied, restricted or unavailable. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `escalation_required` | Ask for whenInUse and have it granted before asking for always. Requesting background location cold is refused by the platforms and flagged in review. |  |
| `invalid_argument` | level must be "whenInUse" or "always". | Not recoverable by retrying. |
| `switched_off` | Location Services are turned off for the whole device. |  |

**Example: a cold whenInUse request prompts and reports the grant**

```js
const result = await dsx.module.geo.permission.request({"level":"whenInUse"});
// resolves {"canAsk":true,"level":"whenInUse","precise":true,"prompted":true,"status":"granted"}
```

**Example: always on top of When In Use is the one legal escalation**

```js
const result = await dsx.module.geo.permission.request({"level":"always"});
// resolves {"canAsk":false,"level":"always","precise":true,"prompted":true,"status":"granted"}
```

### permission.status

`dsx.module.geo.permission.status`

Reads the current location permission without ever showing a prompt. Use it to decide what your screen should offer.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | string | no | Which permission to read: whenInUse (the default) or always. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when the app can still show the system prompt; false means only Settings can change it. |
| `level` | string | no | Which level the state describes, whenInUse or always. |
| `precise` | boolean | yes | True when the user granted precise location rather than approximate. |
| `prompted` | boolean | yes | True when this call showed a system prompt. |
| `status` | string | yes | Current permission state: undetermined, granted, limited, denied, restricted or unavailable. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_argument` | level must be "whenInUse" or "always". | Not recoverable by retrying. |

**Example: never asked**

```js
const result = await dsx.module.geo.permission.status({});
// resolves {"canAsk":true,"precise":false,"prompted":false,"status":"undetermined"}
```

**Example: When In Use with the escalation still on offer**

```js
const result = await dsx.module.geo.permission.status({});
// resolves {"canAsk":true,"level":"whenInUse","precise":true,"prompted":false,"status":"granted"}
```

### places

`dsx.module.geo.places`

Searches for points of interest such as coffee shops or pharmacies through your own geo proxy. Needs a signed-in user and a configured geocoder endpoint.

**When not to.** For the keyless platform search, use the Maps package search instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `lat` | number | no | Latitude to bias the search towards; give it together with lon. |
| `limit` | int | no | How many places to return, from 1 to 20 (default 10). |
| `lon` | number | no | Longitude to bias the search towards; give it together with lat. |
| `query` | string | yes | What to search for, from 1 to 256 characters. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `places` | array of object | yes | The matching places, each with id, name, label, coordinates, kind and address. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `geocoder_unconfigured` | No geocoder_endpoint is configured for this build. Deploy OpenSource/Services/geo and set it, or use dsx.module.maps.search for the platform search. | Not recoverable by retrying. |
| `invalid_argument` | query must be 1 to 256 characters, lat and lon come together, and limit is 1 to 20. | Not recoverable by retrying. |
| `places_failed` | The place search could not answer that request. |  |
| `signed_out` | A signed in session is required to search places. |  |
| `timeout` | The place search did not answer in time. |  |

**Example: Find coffee shops near a point**

```js
const result = await dsx.module.geo.places({"lat":52.52,"limit":3,"lon":13.405,"query":"coffee"});
// resolves {"places":[{"address":{"city":"Berlin","country":"Germany","countryCode":"DE","housenumber":"1","postcode":"10119","street":"Torstrasse"},"id":"node/123456","kind":"cafe","label":"Cafe Example, Torstrasse 1, Berlin","lat":52.5201,"lon":13.4049,"name":"Cafe Example"}]}
```

### reverseGeocode

`dsx.module.geo.reverseGeocode`

Turns coordinates into a street address using the device's own geocoder.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `lat` | number | yes | Latitude of the point to look up, in degrees. |
| `lon` | number | yes | Longitude of the point to look up, in degrees. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `results` | array of object | yes | The matching addresses for that point. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `geocode_failed` | The platform geocoder could not resolve that coordinate. |  |
| `invalid_argument` | A latitude and longitude are required. | Not recoverable by retrying. |
| `timeout` | The geocoder did not answer in time. |  |
| `unsupported_platform` | This platform has no reverse geocoder. Reaching a third-party endpoint with a user's coordinates is not a framework default. | Not recoverable by retrying. |

**Example: resolves a coordinate to an address**

```js
const result = await dsx.module.geo.reverseGeocode({"lat":37.3318,"lon":-122.0312});
// resolves {"results":[{"components":{"city":"Cupertino","country":"US","postalCode":"95014","region":"CA","street":"Infinite Loop"},"formatted":"1 Infinite Loop, Cupertino, CA 95014, United States","lat":37.3318,"lon":-122.0312}]}
```

### significant.start

`dsx.module.geo.significant.start`

Starts battery-cheap location updates that arrive only after the device has moved a long way, roughly 500 metres. On iOS it can relaunch a closed app.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `prompt` | boolean | no | Set false to fail with permission_denied instead of showing a system prompt. |
| `task` | string | no | Name of the background task to run on each change. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `started` | boolean | yes | True when significant-change monitoring has begun. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `escalation_required` | Significant-change monitoring needs the always grant. Ask for whenInUse, then escalate in context. |  |
| `permission_denied` | geo access is denied. Only Settings can change it: dsx.module.geo.permission.openSettings(). |  |
| `switched_off` | Location Services are turned off for the whole device. |  |
| `unavailable` | This device cannot monitor significant location changes. | Not recoverable by retrying. |
| `unsupported_platform` | This surface has no significant-change monitoring. | Not recoverable by retrying. |

**Example: starts the cheap background mode with the always grant**

```js
const result = await dsx.module.geo.significant.start({});
// resolves {"started":true}
```

### significant.stop

`dsx.module.geo.significant.stop`

Stops significant-change monitoring. Stopping when it is not running is not an error.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `stopped` | boolean | yes | True when monitoring was running and is now stopped. |

**Example: stops the cheap background mode**

```js
const result = await dsx.module.geo.significant.stop({});
// resolves {"stopped":true}
```

**Example: stopping nothing is not an error**

```js
const result = await dsx.module.geo.significant.stop({});
// resolves {"stopped":false}
```

### stop

`dsx.module.geo.stop`

Stops the position stream started by watch. Stopping a stream that is not running is not an error.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | Which stream to stop; leave it out to stop the current one. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `stopped` | boolean | yes | True when a running stream was stopped. |

**Example: stops a running stream**

```js
const result = await dsx.module.geo.stop({});
// resolves {"stopped":true}
```

**Example: stopping nothing is not an error**

```js
const result = await dsx.module.geo.stop({});
// resolves {"stopped":false}
```

### visits.stop

`dsx.module.geo.visits.stop`

Stops the visit stream. It reports stopped false on platforms without visit detection.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `stopped` | boolean | yes | True when a running visit stream was stopped. |

**Example: Stop the visit stream**

```js
const result = await dsx.module.geo.visits.stop({});
// resolves {"stopped":true}
```

### visits.watch

`dsx.module.geo.visits.watch`

Starts a stream of places the user stayed at, reported by the operating system, as visit events. Available on iOS only.

**When to use it.** Use it to learn where users spend time without tracking them continuously.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `prompt` | boolean | no | Set false to fail with permission_denied instead of showing a system prompt. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `escalation_required` | Visit monitoring needs the always grant. Ask for whenInUse, then escalate in context. |  |
| `permission_denied` | geo access is denied. Only Settings can change it: dsx.module.geo.permission.openSettings(). |  |
| `unsupported_platform` | This surface has no visit detection. | Not recoverable by retrying. |

**Example: streams a visit with an open departure as null**

```js
const result = await dsx.module.geo.visits.watch({});
```

### watch

`dsx.module.geo.watch`

Starts a stream of position updates, delivered as position events, until you stop it. Use it for maps, trips and tracking.

**When not to.** For a single lookup use current, which stops by itself.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accuracy` | string | no | How precise the fixes should be: navigation, best, balanced (the default), low or passive. |
| `activityType` | string | no | What the user is doing, such as fitness or automotive, so iOS can tune battery use. |
| `background` | boolean | no | Set true to keep updates coming while the app is in the background; needs the always permission. |
| `distanceFilter` | number | no | Minimum movement in metres before a new position is delivered. |
| `interval` | int | no | Minimum time in milliseconds between delivered positions. |
| `pausesAutomatically` | boolean | no | Let iOS pause updates when the user stops moving. |
| `prompt` | boolean | no | Set false to fail with permission_denied instead of showing a system prompt. |
| `showsIndicator` | boolean | no | Show the system indicator that the app is using location in the background. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `escalation_required` | Background location needs the always grant. Ask for whenInUse, then escalate in context. |  |
| `invalid_argument` | accuracy must be navigation, best, balanced, low or passive. | Not recoverable by retrying. |
| `permission_denied` | geo access is denied. Only Settings can change it: dsx.module.geo.permission.openSettings(). |  |
| `switched_off` | Location Services are turned off for the whole device. |  |
| `timeout` | No position arrived before the timeout. |  |
| `unsupported_device` | This device has no location provider. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot stream location. | Not recoverable by retrying. |

**Example: streams positions with the mock flag on every fix**

```js
const result = await dsx.module.geo.watch({"accuracy":"balanced","distanceFilter":100});
```

**Example: a spoofed fix is delivered with mocked true rather than dropped**

```js
const result = await dsx.module.geo.watch({"accuracy":"best"});
```

## Events

Read with `dsx.on(name, handler)`.

### geoerror

Location updates failed, in the standard web geolocation error shape.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `code` | int | yes | A numeric code saying why location failed. |
| `message` | string | yes | A readable description of what failed. |

### geoposition

A new position in the standard web geolocation shape, sent alongside position.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accuracy` | number | yes | How precise the horizontal position is, in metres. |
| `altitude` | number | yes | Height above sea level in metres, when known. |
| `altitudeAccuracy` | number | yes | How far off the altitude may be, in metres. |
| `heading` | number | yes | Direction of travel in degrees. |
| `latitude` | number | yes | Latitude of the position in degrees. |
| `longitude` | number | yes | Longitude of the position in degrees. |
| `speed` | number | yes | Speed in metres per second. |
| `timestamp` | number | yes | When the fix was taken, in epoch milliseconds. |

### heading

A new compass heading from heading.watch.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accuracy` | number | yes | Estimated error of the heading in degrees. |
| `magnetic` | number | yes | Heading relative to magnetic north, in degrees. |
| `true` | number | yes | Heading relative to true north, in degrees; empty until a location fix is available. |

### permission

The location permission changed, for example after a prompt or when the app returned from Settings.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when the app can still show the system prompt; false means only Settings can change it. |
| `level` | string | no | Which level the state describes, whenInUse or always. |
| `status` | string | yes | Current permission state: undetermined, granted, limited, denied, restricted or unavailable. |

### position

A new position from watch.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accuracy` | number | yes | Horizontal accuracy of the fix, as a radius in metres. |
| `altitude` | number | yes | Altitude above sea level in metres, when the device knows it. |
| `altitudeAccuracy` | number | yes | How far off the altitude may be, in metres. |
| `heading` | number | yes | Direction of travel in degrees clockwise from north, when the device is moving. |
| `lat` | number | yes | Latitude of the fix in degrees. |
| `lon` | number | yes | Longitude of the fix in degrees. |
| `mocked` | boolean | yes | True when the fix comes from a mock or spoofing source, so you can refuse it. |
| `speed` | number | yes | Speed over the ground in metres per second. |
| `timestamp` | int | yes | When the fix was taken, in epoch milliseconds. |

### significant

The device moved a significant distance, from significant.start.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `lat` | number | yes | Latitude of the new position. |
| `lon` | number | yes | Longitude of the new position. |

### visit

The user stayed at a place, from visits.watch.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `accuracy` | number | yes | Accuracy of the place in metres. |
| `arrival` | int | yes | When the user arrived, in epoch milliseconds, or empty if unknown. |
| `departure` | int | yes | When the user left, in epoch milliseconds, or empty while the visit is ongoing. |
| `lat` | number | yes | Latitude of the place the user stayed at. |
| `lon` | number | yes | Longitude of the place the user stayed at. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `background_notification_text` | string |  | Body of the ongoing Android notification shown while location is tracked in the background. |
| `background_notification_title` | string |  | Title of the ongoing Android notification shown while geo.watch({ background: true }) runs. |
| `default_accuracy` | string | `balanced` | The accuracy a watch uses when the caller names none: navigation, best, balanced, low or passive. |
| `default_distance_filter` | number | `10` | Minimum movement in metres before a new position is delivered, when the caller names none. 0 delivers every fix. |
| `geocoder_endpoint` | string | `` | The origin of your own geo proxy deployment. When set, web builds geocode and reverse geocode through it. Empty keeps the web refusal. |
| `require_explicit_service_session` | boolean | `true` | Require explicit native location sessions on iOS 18 and later. Turn off for migrated WebView apps that also use browser geolocation. |
| `usage_temporary_precise` | multiline | `Precise location is needed to place you accurately on the map for this trip.` | The sentence iOS shows when the app asks a user who granted approximate location to allow precise location once. |
| `usage_when_in_use` | multiline | `Your location is used to show where you are and what is nearby while you are using the app.` | The sentence iOS shows when the app first asks to use location while it is open. Say what the feature does for the user. |

## Related packages

- Works better with: [Background Location](/packages/backgroundlocation)
- Used by: [LegacyLocation](/packages/legacy-modules-location)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
