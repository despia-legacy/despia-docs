---
title: Maps
description: Show maps with pins, routes and your user's location.
package: map
---

Show maps with pins, routes and your user's location.

Adds a map element with pins, routes, circles and user location, plus place search, directions, address lookup and map snapshots. iOS uses Apple Maps and needs no key. Android uses Google Maps and needs your Google Maps API key.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when your app shows places, routes or the person's location on a map, or needs place search, directions, address lookup or a map picture. For a plain address link, opening the system Maps app is simpler.

## What native adds

iOS draws with Apple Maps and needs no key; Android draws with Google Maps. You get smooth native panning, zooming and user location that a web map cannot match.

## Install

```sh
despia add Core/Maps
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

### camera

`dsx.module.map.camera`

Reads the area a map currently shows and can move the camera in the same call.

**When to use it.** Use it for a search this area button or a recenter button, since the map's own attributes only push values in and go stale once the person pans.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `animated` | boolean | no | True glides to the new position instead of jumping. |
| `lat` | number | no | The latitude to move the camera to; give it together with lon. |
| `lon` | number | no | The longitude to move the camera to; give it together with lat. |
| `ref` | string | no | The name of the map to use; it can be left out when only one map is on screen. |
| `zoom` | number | no | The zoom level to move to, from 0 to 21. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bounded` | boolean | yes | True when the edges of the visible area are known. |
| `east` | number | yes | The longitude of the right edge of the visible area. |
| `lat` | number | yes | The latitude of the center of the visible area. |
| `lon` | number | yes | The longitude of the center of the visible area. |
| `moved` | boolean | yes | True when this call moved the camera. |
| `north` | number | yes | The latitude of the top edge of the visible area. |
| `ref` | string | yes | The name of the map that was read. |
| `south` | number | yes | The latitude of the bottom edge of the visible area. |
| `west` | number | yes | The longitude of the left edge of the visible area. |
| `zoom` | number | yes | The zoom level the map is showing now. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `ambiguous` | several <map> surfaces are mounted; pass ref to say which |  |
| `invalid_param` | lat/lon must be given together and in range, and zoom between 0 and 21. | Not recoverable by retrying. |
| `not_found` | no <map> with that ref is mounted |  |

**Example: reads the visible region of the only mounted map**

```js
const result = await dsx.module.map.camera({});
// resolves {"bounded":true,"east":-122.3755,"lat":37.7749,"lon":-122.4194,"moved":false,"north":37.8188,"ref":"map#1","south":37.731,"west":-122.4633,"zoom":12}
```

**Example: moves a named map and answers where it was sent**

```js
const result = await dsx.module.map.camera({"animated":true,"lat":37.8044,"lon":-122.2712,"ref":"stops","zoom":15});
// resolves {"bounded":false,"east":-122.2657,"lat":37.8044,"lon":-122.2712,"moved":true,"north":37.8099,"ref":"stops","south":37.7989,"west":-122.2767,"zoom":15}
```

### directions

`dsx.module.map.directions`

Works out one or more routes between two points, with the line to draw and the turn-by-turn steps.

**When to use it.** Use it to draw a route on the map and list its steps beside it. On iOS only driving and walking are available.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alternatives` | boolean | no | True asks for other routes as well as the best one. |
| `fromLat` | number | yes | The latitude of the starting point. |
| `fromLon` | number | yes | The longitude of the starting point. |
| `mode` | string | no | How the person travels: driving, walking, cycling or transit, as far as the map provider supports it. |
| `toLat` | number | yes | The latitude of the destination. |
| `toLon` | number | yes | The longitude of the destination. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `routes` | array of object | yes | The routes found, each with a summary, mode, distance in meters, duration in seconds, the coordinates to draw and its steps. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `directions_failed` | The map provider could not compute a route between those points. |  |
| `invalid_param` | fromLat/toLat must be between -90 and 90 and fromLon/toLon between -180 and 180. | Not recoverable by retrying. |
| `missing_key` | No Maps API key is configured, so the routing service cannot be reached. | Not recoverable by retrying. |
| `network_unavailable` | The routing service could not be reached. |  |
| `unsupported_mode` | This map provider cannot route that travel mode. | Not recoverable by retrying. |

**Example: computes a driving route with the coords <map route> renders and its turn list**

```js
const result = await dsx.module.map.directions({"fromLat":37.7749,"fromLon":-122.4194,"mode":"driving","toLat":37.8044,"toLon":-122.2712});
// resolves {"routes":[{"coords":[{"lat":37.7749,"lon":-122.4194},{"lat":37.8044,"lon":-122.2712}],"distance":19312,"duration":1500,"mode":"driving","steps":[{"distance":420,"instruction":"Head east on Market St","lat":37.7749,"lon":-122.4194},{"distance":18892,"instruction":"Take I-80 E toward Oakland","lat":37.7825,"lon":-122.3894}],"summary":"I-80 E"}]}
```

### reverse

`dsx.module.map.reverse`

Turns a latitude and longitude into a readable place name and postal address.

**When to use it.** Use it to show what is at a spot the person tapped on the map.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `lat` | number | yes | The latitude of the point to look up. |
| `lon` | number | yes | The longitude of the point to look up. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `address` | string | yes | The postal address at that point. |
| `lat` | number | yes | The latitude of the matched place. |
| `lon` | number | yes | The longitude of the matched place. |
| `name` | string | yes | The name of the place at that point. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_param` | lat must be between -90 and 90 and lon between -180 and 180. | Not recoverable by retrying. |
| `missing_key` | No Maps API key is configured, so this platform's geocoder cannot be reached. | Not recoverable by retrying. |
| `network_unavailable` | The geocoder could not be reached. |  |
| `reverse_failed` | The geocoder could not answer for that coordinate. |  |

**Example: resolves the postal address at a coordinate**

```js
const result = await dsx.module.map.reverse({"lat":37.7749,"lon":-122.4194});
// resolves {"address":"1 Dr Carlton B Goodlett Pl, San Francisco, CA 94102","lat":37.7749,"lon":-122.4194,"name":"San Francisco City Hall"}
```

**Example: a coordinate with no address resolves empty strings, not an error**

```js
const result = await dsx.module.map.reverse({"lat":0,"lon":0});
// resolves {"address":"","lat":0,"lon":0,"name":""}
```

### search

`dsx.module.map.search`

Finds places and addresses that match a text query, optionally near a point.

**When to use it.** Use it for a search box that returns places to pin on the map. On Android it finds addresses rather than businesses.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `lat` | number | no | The latitude to search near; with lon it also fills in the distance of each result. |
| `limit` | number | no | The most results to return. |
| `lon` | number | no | The longitude to search near; give it together with lat. |
| `query` | string | yes | The text to search for, such as a place name, an address or a kind of shop. |
| `radius` | number | no | How far around the point to look, in meters. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `results` | array of object | yes | The matching places, each with an id, name, address, latitude, longitude, category and distance in meters. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_param` | lat must be between -90 and 90 and lon between -180 and 180. | Not recoverable by retrying. |
| `missing_key` | No Maps API key is configured, so this platform's geocoder cannot be reached. | Not recoverable by retrying. |
| `missing_param` | search needs a non-empty `query`. | Not recoverable by retrying. |
| `network_unavailable` | The map provider could not be reached. |  |
| `search_failed` | The map provider could not complete the search. |  |

**Example: resolves matching places for a query**

```js
const result = await dsx.module.map.search({"lat":37.7749,"limit":2,"lon":-122.4194,"query":"coffee","radius":2000});
// resolves {"results":[{"address":"66 Mint St, San Francisco, CA 94103","category":"cafe","distance":1310,"id":"0","lat":37.7823,"lon":-122.4076,"name":"Blue Bottle Coffee"}]}
```

**Example: a query that matches nothing is an empty list, not an error**

```js
const result = await dsx.module.map.search({"query":"zzzzzzzz"});
// resolves {"results":[]}
```

### snapshot

`dsx.module.map.snapshot`

Makes a still picture of a map area, for places where a live map is too heavy.

**When to use it.** Use it for list rows, share sheets and receipts. For something the person can pan, use the map element.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `height` | number | no | The picture height in pixels, from 1 to 2048. |
| `lat` | number | yes | The latitude of the center of the picture. |
| `lon` | number | yes | The longitude of the center of the picture. |
| `style` | string | no | The map style to draw, such as standard, satellite or hybrid. |
| `width` | number | no | The picture width in pixels, from 1 to 2048. |
| `zoom` | number | no | How close the picture is zoomed in. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `height` | number | yes | The height of the picture in pixels. |
| `kind` | string | yes | Whether you got a file path or a web address: file or url. |
| `path` | string | no | On phones, the saved image as a Files path in the cache. |
| `url` | string | no | On the web, the https address of the image. |
| `width` | number | yes | The width of the picture in pixels. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_param` | lat/lon must be in range and width/height between 1 and 2048. | Not recoverable by retrying. |
| `missing_key` | No Maps API key is configured, so a static map image cannot be requested. | Not recoverable by retrying. |
| `network_unavailable` | The static map service could not be reached. |  |
| `snapshot_failed` | The map image could not be rendered. |  |

**Example: renders a still map image for a coordinate**

```js
const result = await dsx.module.map.snapshot({"height":400,"lat":37.7749,"lon":-122.4194,"width":600,"zoom":14});
// resolves {"height":400,"kind":"file","path":"cache:despia-maps/snapshot-1.png","width":600}
```

**Example: a browser answers the same keys with a fetchable url instead of bytes**

```js
const result = await dsx.module.map.snapshot({"height":400,"lat":37.7749,"lon":-122.4194,"width":600,"zoom":14});
// resolves {"height":400,"kind":"url","url":"https://maps.googleapis.com/maps/api/staticmap?center=37.7749,-122.4194&zoom=14&size=600x400&maptype=roadmap&key=AIza","width":600}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `maps_api_key` | string |  | Your Google Maps Android API key from the Google Cloud console. Android-only: iOS renders through Apple MapKit and needs no key. |
| `provider` | string | `` | Optional: a map provider package (for example maplibre) that draws <map> instead of the system map. Empty means the system map on every platform. |
| `provider_token` | string | `` | The provider's public access token, when its row requires one (Mapbox). A public client token, never a secret key (K8). |
| `renderer` | string | `` | Retired spelling of `provider`; still read as the same choice. Set `provider` instead. |
| `renderer_token` | string | `` | Retired spelling of `provider_token`; still read as the same choice. Set `provider_token` instead. |

## Related packages

- Used by: [Mapbox](/packages/mapbox), [MapLibre](/packages/maplibre)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
