---
title: TV
description: Ship your app to Apple TV and Android TV with screens you write once in DSX.
package: tv
---

Ship your app to Apple TV and Android TV with screens you write once in DSX.

Adds a living-room app for Apple TV and Android TV next to your phone app. You write the TV screens and routes in DSX; they are bundled so the app opens offline and can refresh from a manifest you host. The package declares the tvOS app target and its start screen, and you supply the screens yourself.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when your product should also run on a television, with screens designed for a remote and a big display. Leave it out of apps that only target phones, tablets and desktops; it can be removed with the excluded packages list.

## Install

```sh
despia add Core/Extensions/TV
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | no |
| web | no |
| macos | no |

## Actions

_This package declares no actions._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `host` | string | `despia.com` | The domain the TV app fetches OTA screens from when an OTA manifest is set. Bundled screens work with no host. |
| `ota_manifest` | string | `` | Path to the over-the-air TV route manifest. Leave empty to ship bundled screens only (no network). |
| `start_route` | string | `/` | The first screen the TV shows on launch. Matched against the route table (bundled, then OTA). |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
