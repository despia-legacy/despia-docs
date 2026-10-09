---
title: DevSettings
description: A hidden developer panel for switching a test build between staging and production.
package: dev
---

A hidden developer panel for switching a test build between staging and production.

Adds a developer panel to test installs that you open by shaking the phone. It lets testers point the same build at a staging server, scan a QR code to switch, read a live console of errors, and copy a report for support. It is switched off on App Store installs, so shipped apps never show it.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it in TestFlight and QA builds, when testers need to try your staging server without installing a different build. It does nothing in the App Store build, so it is safe to leave in.

## Install

```sh
despia add Core/DevSettings
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | yes |

Device classes: phone, desktop.

## Actions

### info

`dsx.module.dev.info`

Reads a snapshot of the current environment, version and build, which is what a staging banner or a QA bug report would print.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `build` | string | yes | The app build number, as shown in TestFlight. |
| `environment` | string | yes | The name of the environment the app is using, such as production or a staging name. |
| `host` | string | yes | The host part of that address. |
| `origin` | string | yes | The full address the app is currently pointed at. |
| `persistence` | boolean | yes | True when the choice is saved across relaunches. |
| `switchedAt` | string | yes | When the environment was last switched, as a date and time. |
| `version` | string | yes | The app version number, as shown in the store. |

**Example: reports the channel and the active origin**

```js
const result = await dsx.module.dev.info({});
// resolves {"build":"128","environment":"testflight","host":"example.com","origin":"https://staging.example.com","persistence":true,"switchedAt":"2026-08-25T09:14:00Z","version":"4.0.0"}
```

### open

`dsx.module.dev.open`

Opens the developer panel over the current screen, the same panel the shake gesture opens. Useful behind a long press in a QA build.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the panel was opened. |

**Example: opens the dev centre over the current surface**

```js
const result = await dsx.module.dev.open({});
// resolves {"ok":true}
```

### reset

`dsx.module.dev.reset`

Returns the app to the production environment without asking, so a QA build stuck on a broken staging host can get out with one tap.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the app went back to production. |

**Example: clears the override and returns to production**

```js
const result = await dsx.module.dev.reset({});
// resolves {"ok":true}
```

### set

`dsx.module.dev.set`

Points the app at a different origin. Unless the call comes from the native panel, the person must confirm it first, and the host must be on the allowed list.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `origin` | string | yes | The http or https address to switch to, such as https://staging.example.com. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `origin` | string | yes | The origin the app is now using. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `cancelled` | The person declined the confirmation for switching environment. | Nothing to do. The app stays on its current environment. |
| `invalid_origin` | The origin is not a valid http or https address. | Pass an origin such as https://staging.example.com. |
| `origin_not_allowed` | That host is not in this app's allowed hosts list. | Add the host to the allowed hosts setting, or choose one that is listed. |

**Example: switches to an allowed staging origin after the user confirms**

```js
const result = await dsx.module.dev.set({"origin":"https://staging.example.com"});
// resolves {"origin":"https://staging.example.com"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `access_code` | string | `` | A code the panel asks for before it opens, for shared QA devices. It is only a speed bump and not real security, and empty means no code. |
| `allow_custom_origin` | boolean | `true` | Show the free-text origin field in the developer panel (presets always work). |
| `allowed_hosts` | list | `[]` | Optional allowlist of hosts the panel may switch to on TestFlight and ad-hoc installs. |
| `clear_web_data_on_switch` | boolean | `false` | Wipe cookies, caches and service workers whenever the environment is switched. |
| `enabled` | boolean | `true` | Master switch for the developer settings panel on test installs (it is always off on App Store installs regardless of this value). |
| `environments` | json | `` | Named staging environments shown as one-tap rows in the developer panel. |
| `show_environment_badge` | boolean | `true` | Show a floating STAGING badge while an origin override is active. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `cancelled` | The person declined the confirmation for switching environment. | Nothing to do. The app stays on its current environment. |
| `channel_locked` | Simulating another release channel is only possible in debug builds. | Use a debug build to try this. |
| `invalid_channel` | That release channel name is not known. | Use simulator, debug, testflight, adhoc or appstore. An empty value resets it. |
| `invalid_origin` | The origin is not a valid http or https address. | Pass an origin such as https://staging.example.com. |
| `invalid_path` | A path into the app's global state is required and was not valid. | Pass a dotted path such as user.name. |
| `invalid_url` | The address is not a full URL. | Pass a full URL, for example https://example.com/page. |
| `origin_not_allowed` | That host is not in this app's allowed hosts list. | Add the host to the allowed hosts setting, or choose one that is listed. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
