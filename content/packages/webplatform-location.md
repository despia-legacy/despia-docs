---
title: Location
description: Lets a web page in your app ask for the person's location through the browser's own location call.
package: location
---

Lets a web page in your app ask for the person's location through the browser's own location call.

Has no actions or elements. It adds the location permission text on iOS and the location permissions on Android, so a page that uses the browser's geolocation call can actually be given a position. For background tracking or geofences add the background location package as well.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Add it when a web page you show in the app calls the browser's location feature. If your screens use the location package, that package already declares what it needs, and for background location you also need the background location package.

## Install

```sh
despia add Core/WebPlatform/Location
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | no |
| web | no |
| macos | yes |

Device classes: phone, desktop.

## Actions

_This package declares no actions._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `usage_when_in_use` | multiline | `Processing your current location data in order to display your current location` | The message shown when iOS asks for location access while using the app. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
