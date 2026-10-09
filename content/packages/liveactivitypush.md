---
title: Live Activity updates via OneSignal
description: Update a running iPhone Live Activity from your server through OneSignal.
package: liveactivitypush
---

Update a running iPhone Live Activity from your server through OneSignal.

Connects the Live Activities package to OneSignal so your backend can push new values to an activity that is already running on the Lock Screen. Works with the Live Activities and OneSignal packages and needs both. iOS only.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Include it when your server needs to update a Live Activity that is already running on the Lock Screen, using OneSignal. Skip it if the activity is only ever updated from inside the app.

## Install

```sh
despia add Core/OneSignalLiveActivity
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

## Related packages

- Needs: [ActivityKit](/packages/liveactivity), [OneSignal](/packages/onesignal)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
