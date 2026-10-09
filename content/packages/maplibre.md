---
title: MapLibre
description: Draw your app's maps with the open source MapLibre renderer.
package: maplibre
---

Draw your app's maps with the open source MapLibre renderer.

Makes the Maps package draw through MapLibre instead of the system map. Needs no key or account and defaults to free public map tiles. You can point it at any MapLibre style, such as a self-hosted or Protomaps style. Works with the Maps package.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when you want maps that need no API key or vendor account, or when you want to draw your own style, such as a self-hosted or Protomaps one. Skip it if you need routes, regions, circles or the user location layer, which stay with the system map for now.

## Install

```sh
despia add Core/Maps/Modules/MapLibre
```

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
