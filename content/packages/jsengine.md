---
title: JsEngine
description: Run heavier page logic safely in a separate JavaScript sandbox on Android.
package: jsengine
---

Run heavier page logic safely in a separate JavaScript sandbox on Android.

Gives Android a sandboxed JavaScript engine, separate from your app, so action logic that goes beyond the simple built-in subset still runs instead of failing. It has no actions to call and nothing to design; including the package switches it on. It needs Android 8 or newer with an up-to-date system WebView.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Include it when your Android app has action logic that uses more JavaScript than the built-in subset supports. Leave it out otherwise, because it adds weight to the app.

## What native adds

The sandbox runs JavaScript in a separate process on the device, so complex logic cannot slow down or crash the main screen.

## Install

```sh
despia add Core/JsEngine
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | yes |
| web | no |
| macos | no |

Device classes: phone.

## Actions

_This package declares no actions._

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `error` | An escalated action body reported an error of its own through dsx.error(...) and named no code. |  |
| `js_tier_exception` | The escalated action body threw inside the sandbox. |  |
| `js_tier_protocol` | The sandbox returned a result the V1 ops protocol does not describe, so that operation was not replayed. |  |
| `js_tier_timeout` | The escalated action body ran past the JS-tier watchdog and the sandbox was released. | Simplify the action so it finishes sooner, or move the heavy work to your server. |
| `js_tier_unavailable` | The JavaScript sandbox could not be reached on this device, so the escalated action body did not run. | Include this package on Android, and note that devices below Android 8 or without an up-to-date WebView cannot run it. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
