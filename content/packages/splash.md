---
title: Splash
description: The launch screen shown while your app starts, with your logo and background.
package: splash
---

The launch screen shown while your app starts, with your logo and background.

Shows your logo and background color the moment the app opens, then hands over to your app once it is ready and the first frame has settled. You can set the minimum time it stays up, the fade, the spinner and the logo size. If the customizable splash is turned off or its settings are invalid, the standard launch screen is used. You provide the logo and colors.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

It is always part of the app. Use its settings to match the launch screen to your brand; the minimum time only keeps the splash up longer, it never delays your app's start.

## Install

```sh
despia add Mandatory/Splash
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

_This package declares no actions._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `background` | string | `` | The splash screen background color. Empty follows the system light or dark background. |
| `boot_bridge_ms` | number | `0` | How long the instant first frame holds before phase-2 takes over (engine-ready bridge). |
| `dsx_min_ms` | number | `0` | How long the DSX phase-2 splash stays visible at minimum, measured from when it appears. 0 (the default) hides it the moment the app is ready. |
| `dsx_ui` | boolean | `true` | Render the customizable DSX <Splash/> as a second splash phase behind the instant first frame. |
| `enabled` | boolean | `true` | Show the splash screen on launch. Off shows the loading sign instead. |
| `fade_time` | number | `300` | Duration of the splash fade-out animation, in milliseconds. |
| `fallback_brand` | string | `icon` | What the splash shows when the logo is empty or cannot be found: the app icon (rounded like the home screen), or nothing. |
| `logo` | string | `splash_logo` | The splash logo: an image set (iOS) and drawable (Android) name. The default is the Despia mark; set your own to replace it on every splash frame. |
| `min_ms` | number | `0` | How long the splash screen stays visible at minimum, in milliseconds. 0 (the default) hides it the moment the app is ready; set a value only if the app wants the splash on screen longer. |
| `present_splash` | boolean | `true` | Show a launch splash at all. Off boots straight to the entry surface (no splash). |
| `remain_until_loaded` | boolean | `true` | Keep the splash visible until the homepage finishes loading. |
| `scale_image` | number | `0` | Splash logo size: 0 draws it at its own size (the launch-screen size); 1 to 99 is a percentage of the device's smallest dimension; 100 is full-screen. |
| `show_spinner` | boolean | `false` | Show the loading spinner on the launch splash. Off (default) gives a clean brand splash whenever a brand (logo, splash file, or the app icon) resolves. |
| `timeout` | number | `10000` | Maximum time the splash is shown before proceeding, in milliseconds. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
