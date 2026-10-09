---
title: Sign in with Facebook
description: Let people sign in to your iOS app with Facebook.
package: meta
---

Let people sign in to your iOS app with Facebook.

Adds a Facebook option using Meta's Limited Login, which returns a token your account service verifies and does not track people across apps. The build sets up the Facebook entries your app needs. Needs a Meta app with its App ID and client token. Works on iOS.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when you want a Sign in with Facebook button on iOS. Your account service must verify the token it returns, since this package only collects it. Skip it if your people do not use Facebook.

## What native adds

Limited Login runs in the native Facebook flow without tracking people across apps, and gives you a token your server can verify.

## Install

```sh
despia add Core/Auth/Meta
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

_This package declares no actions._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `app_id` | string | `` | Your Meta app's App ID (App settings, Basic). |
| `client_token` | string | `` | Your Meta app's Client Token (App settings, Advanced). Public: it ships in every Facebook Login app. |
| `display_name` | string | `` | The app name as it appears in your Meta app settings. |
| `ios_url_scheme` | string | `fbnotconfigured` | Superseded 2026-09-29: the Info.plist URL scheme is now derived as fb plus app_id, so this value is not read. Kept until the next whole-tree regeneration removes it. |

## Related packages

- Needs: [Auth](/packages/auth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
