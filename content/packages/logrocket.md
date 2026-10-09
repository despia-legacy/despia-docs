---
title: LogRocket
description: Send errors and logs to LogRocket, with optional session replay.
package: logrocket
---

Send errors and logs to LogRocket, with optional session replay.

Works with the Error and crash reporting package: it hands captured errors and log lines to LogRocket and lets you identify users. Session replay is off by default and only runs when you enable it and the user consents. Needs a LogRocket account and your app ID. iOS and Android only.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it if you already use LogRocket and want captured app errors and logs to show up there. Session replay is optional and stays off unless you enable it and the person agrees.

## Install

```sh
despia add Core/Telemetry/Modules/LogRocket
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone.

## Actions

### identify

`dsx.module.logrocket.identify`

Tells LogRocket who the current person is, with traits you choose. Nothing is sent about the person unless you call this.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | Your own id for the person. |
| `traits` | object | no | Extra details to attach, such as plan or role. Values are sent as text. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id that was set for the person. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_traits` | Traits are a flat object of string, boolean or whole-number values. | Not recoverable by retrying. |
| `missing_param` | A required argument is missing. | Not recoverable by retrying. |
| `not_started` | LogRocket has not started: set config app_id, and grant consent when Core/Consent is in the build. |  |

**Example: Tell LogRocket who the person is**

```js
const result = await dsx.module.logrocket.identify({"id":"user_42","traits":{"plan":"pro"}});
// resolves {"id":"user_42"}
```

### replay

`dsx.module.logrocket.replay`

Turns session replay on or off. Turning it off always works, and turning it on needs the project setting, the consent package and the person's agreement.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `enabled` | boolean | yes | True to record the session, false to stop recording. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `replaying` | boolean | yes | True when the session is being recorded now. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `consent_denied` | Consent has not been granted, so LogRocket does not record. |  |
| `consent_required` | Session replay needs Core/Consent in the build, so the end user can grant and revoke it. |  |
| `missing_param` | A required argument is missing. | Not recoverable by retrying. |
| `not_started` | LogRocket has not started: set config app_id, and grant consent when Core/Consent is in the build. |  |
| `replay_not_declared` | Session replay is off for this project: declare config replay "consented" to offer it. | Not recoverable by retrying. |
| `restart_required` | The web SDK chooses replay at start: it begins on the next launch. |  |

**Example: Stop recording the session**

```js
const result = await dsx.module.logrocket.replay({"enabled":false});
// resolves {"replaying":false}
```

### send

`dsx.module.logrocket.send`

Passes a batch of captured errors and log lines from the error reporting package to LogRocket. Errors and warnings become messages, and other entries become log lines.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dropped` | number | no | How many events were dropped before this batch because of limits. |
| `dsn` | string | no | The LogRocket app id to use for this call, if you do not set it in the settings. |
| `endpoint` | string | no | A custom address to send the data to, when you use one. |
| `environment` | string | no | The environment name to tag the events with, such as production. |
| `events` | array of object | yes | The batch of captured events to forward, each with an id, a code, a message, a level, a time and its trail of breadcrumbs. |
| `release` | string | no | The app version to tag the events with. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `sent` | number | yes | How many events were passed to LogRocket. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `consent_denied` | Consent has not been granted, so LogRocket does not record. |  |
| `invalid_app_id` | That is not a LogRocket app id (org-slug/app-slug, from the LogRocket dashboard). | Not recoverable by retrying. |
| `not_configured` | The LogRocket script did not load on this page. |  |

**Example: an empty batch sends nothing**

```js
const result = await dsx.module.logrocket.send({"events":[]});
// resolves {"sent":0}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `app_id` | string | `` | Your LogRocket app ID, org-slug/app-slug (LogRocket, Settings, Project Setup). Public: it ships in every LogRocket app. Core/Telemetry's configure({ sink: "logrocket", dsn }) may pass the same value. |
| `mask` | string | `inputs` | inputs (the default) masks every input on the web; all masks all text too. The iOS and Android apps always mask all text. |
| `replay` | string | `off` | off (the default): nothing on screen is ever recorded. consented: the app may offer session replay, and it records only while Core/Consent is in the build and the end user has granted; a revoke stops it. |

## Related packages

- Needs: [Telemetry](/packages/telemetry)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
