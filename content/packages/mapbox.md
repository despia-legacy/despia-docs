---
title: Mapbox
description: Draw your app's maps with Mapbox styles and tiles.
package: mapbox
---

Draw your app's maps with Mapbox styles and tiles.

Makes the Maps package draw through the Mapbox Maps SDK, so you can use Mapbox styles. Needs a Mapbox account and your public access token. Without a token the app falls back to the system map. Works with the Maps package.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it when you want your maps drawn with Mapbox styles instead of the system map. It has no calls of its own; you choose Mapbox in the Maps settings and add your public token. Without a token the system map is used.

## What native adds

Maps are drawn by the Mapbox native SDK on iOS and Android, so they pan and zoom smoothly with your Mapbox styles.

## Install

```sh
despia add Core/Maps/Modules/Mapbox
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone, tablet.

## Actions

_This package declares no actions._

## Related packages

- Needs: [Maps](/packages/map)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
