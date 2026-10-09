---
title: Firebase Analytics
description: Send user properties and events to Google Analytics for Firebase.
package: analytics
---

Send user properties and events to Google Analytics for Firebase.

Collects nothing until you turn it on after the user agrees. Its main use is setting user properties that Firebase Remote Config targeting and Crashlytics crash-free-users numbers depend on. Needs your Firebase project set up in the app.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when you need Firebase Remote Config targeting by user property, or Crashlytics crash-free-user numbers. For product analytics in general, pick one analytics tool; this package is not meant to be a second event pipe.

## Install

```sh
despia add Core/Firebase/Modules/Analytics
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, tablet, desktop.

## Actions

### collect

`dsx.module.analytics.collect`

Turns measurement on or off; nothing is collected until you turn it on, which you do after the user agrees.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `enabled` | boolean | yes | True to start collecting analytics, false to stop. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `enabled` | boolean | yes | The collection setting now in effect. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | collect needs enabled: true or false. | Not recoverable by retrying. |
| `not_configured` | Firebase is not configured in this build, so there is no Analytics to enable. | Not recoverable by retrying. |

**Example: turns collection on after a consent answer**

```js
const result = await dsx.module.analytics.collect({"enabled":true});
// resolves {"enabled":true}
```

**Example: turns it back off, which is the withdrawal path and must exist**

```js
const result = await dsx.module.analytics.collect({"enabled":false});
// resolves {"enabled":false}
```

### consent

`dsx.module.analytics.consent`

Sets what the collected data may be used for, using Google Consent Mode, separately from turning collection on.

**When to use it.** Apps used in the EEA need both this and collect.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `values` | object | yes | The consent choices, each granted or denied. |
| `values.ad_personalization` | string | no | Whether ads may be personalized, granted or denied. |
| `values.ad_storage` | string | no | Whether advertising data may be stored, granted or denied. |
| `values.ad_user_data` | string | no | Whether user data may be sent to Google for advertising, granted or denied. |
| `values.analytics_storage` | string | no | Whether analytics data may be stored, granted or denied. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many consent choices were set. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_consent` | consent takes analytics_storage, ad_storage, ad_user_data or ad_personalization, each granted or denied. | Not recoverable by retrying. |
| `not_configured` | Firebase is not configured in this build, so there is no Analytics to record consent for. | Not recoverable by retrying. |

**Example: records a consent answer for measurement but not for ads**

```js
const result = await dsx.module.analytics.consent({"values":{"ad_storage":"denied","analytics_storage":"granted"}});
// resolves {"count":2}
```

### identify

`dsx.module.analytics.identify`

Attributes events to a user id that you choose; an empty id clears it, which you should do at sign out.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | Your own id for the person; an empty text removes the attribution. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The user id now in effect, empty when cleared. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_collecting` | Analytics collection is off. Call analytics.collect({ enabled: true }) after the user agrees. | Not recoverable by retrying. |

**Example: attributes events to a user id**

```js
const result = await dsx.module.analytics.identify({"id":"user_123"});
// resolves {"id":"user_123"}
```

**Example: an empty id is the logout path and clears the attribution**

```js
const result = await dsx.module.analytics.identify({"id":""});
// resolves {"id":""}
```

### log

`dsx.module.analytics.log`

Records one analytics event with optional parameters.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | yes | The event name: it starts with a letter, then letters, digits and underscores, up to 40 characters. |
| `params` | object | no | Extra values for the event as names with text or number values, up to 25 of them. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `logged` | boolean | yes | True when the event was handed to Firebase. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_event` | A GA4 event name must start with a letter and contain only letters, digits and underscores, up to 40 characters. | Not recoverable by retrying. |
| `not_collecting` | Analytics collection is off. Call analytics.collect({ enabled: true }) after the user agrees. | Not recoverable by retrying. |

**Example: logs an event with parameters**

```js
const result = await dsx.module.analytics.log({"name":"checkout_started","params":{"currency":"EUR","value":9.99}});
// resolves {"logged":true}
```

### property

`dsx.module.analytics.property`

Sets user properties such as plan or cohort, which Remote Config conditions can use to target a rollout.

**When to use it.** This is the main reason to use the package.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `values` | object | yes | The properties to set, as names with text, number or yes or no values. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many properties were set. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_properties` | property needs a non-empty object whose names start with a letter and contain only letters, digits and underscores. | Not recoverable by retrying. |
| `not_collecting` | Analytics collection is off. Call analytics.collect({ enabled: true }) after the user agrees. | Not recoverable by retrying. |

**Example: sets the properties a Remote Config condition can target**

```js
const result = await dsx.module.analytics.property({"values":{"cohort":"beta","plan":"pro"}});
// resolves {"count":2}
```

### send

`dsx.module.analytics.send`

Receives error events from the telemetry package and records them in Google Analytics; apps do not call it directly.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dropped` | number | no | How many events the device could not keep. |
| `dsn` | string | no | Not used by this destination; it is part of the shared telemetry call. |
| `endpoint` | string | no | Not used by this destination; it is part of the shared telemetry call. |
| `environment` | string | no | The environment name, such as production, sent with the events. |
| `events` | array of object | yes | The telemetry events to record, already cleaned and de-duplicated. |
| `release` | string | no | The app version sent with the events. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `sent` | number | yes | How many events were recorded. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_collecting` | Analytics collection is off, so the batch was not recorded. |  |

**Example: records a batch as app_exception events**

```js
const result = await dsx.module.analytics.send({"environment":"production","events":[{"code":"native_crash","eventId":"evt_1","message":"SIGSEGV"}]});
// resolves {"sent":1}
```

**Example: an empty batch records nothing**

```js
const result = await dsx.module.analytics.send({"events":[]});
// resolves {"sent":0}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
