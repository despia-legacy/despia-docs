---
title: Firebase Remote Config
description: Change app settings and switch features off without releasing a new version.
package: remoteconfig
---

Change app settings and switch features off without releasing a new version.

Fetches values from Firebase Remote Config, caches them and lets your screens react to them, so you can turn off a broken feature or stage a rollout. You set safe default values for when the device is offline. Needs your Firebase project set up in the app.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it to switch off a broken feature, stage a rollout or change a banner without publishing a new build. Always set defaults first so the app behaves safely when the server cannot be reached. Do not use it for private data, since the values are not secret.

## What native adds

Native listeners get changes pushed to a running app, so a switch-off can reach people already using it.

## Install

```sh
despia add Core/Firebase/Modules/RemoteConfig
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

### all

`dsx.module.remoteconfig.all`

Returns every active value at once, with the time they were fetched.

**When to use it.** Use it for a settings or debug screen. It refuses when nothing was fetched and no defaults were set.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many parameters there are. |
| `fetchedAt` | number | yes | When the values were last fetched, in epoch milliseconds. |
| `values` | object | yes | A map of every parameter name to its current value as text. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_ready` | No Remote Config snapshot is active yet: call defaults or fetch first. |  |

**Example: returns the active snapshot and when it was fetched**

```js
const result = await dsx.module.remoteconfig.all({});
// resolves {"count":2,"fetchedAt":1756108800000,"values":{"banner_text":"Back soon","checkout_enabled":"false"}}
```

**Example: a defaults-only snapshot answers with fetchedAt 0, which is how a caller sees it has never reached the server**

```js
const result = await dsx.module.remoteconfig.all({});
// resolves {"count":1,"fetchedAt":0,"values":{"checkout_enabled":"true"}}
```

### defaults

`dsx.module.remoteconfig.defaults`

Sets the built-in values the app uses before anything is fetched, when offline, or when the server is throttling you.

**When to use it.** Call it first on every launch. Choose values that are safe when the server cannot be heard.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `values` | object | yes | A map of parameter names to their default values. Numbers and booleans are kept as text and other types are skipped. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many defaults were set. |
| `ready` | boolean | yes | True once values can be read, which defaults alone make true. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_defaults` | defaults needs a non-empty object of key/value pairs. | Not recoverable by retrying. |

**Example: sets the in-app defaults and becomes readable at once**

```js
const result = await dsx.module.remoteconfig.defaults({"values":{"banner_text":"Welcome","checkout_enabled":"true"}});
// resolves {"count":2,"ready":true}
```

### fetch

`dsx.module.remoteconfig.fetch`

Downloads the latest values from the server and switches to them in one step.

**When to use it.** Call it at startup or when a screen opens. A throttled fetch is refused but your previous values stay in use.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `minimumInterval` | number | no | The shortest wait between server requests, in seconds. Use 0 while developing. |
| `timeout` | number | no | How long to wait for the server, in seconds. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `activated` | boolean | yes | True when new values are now in use. |
| `changed` | array of string | yes | The names of the parameters whose values changed, sorted. |
| `fetchedAt` | number | yes | When the values were fetched, in epoch milliseconds. |
| `status` | string | yes | The outcome of the fetch. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | Remote Config could not be reached; the previous snapshot is still active. |  |
| `not_configured` | Firebase is not configured in this build, so there is no Remote Config to fetch. | Not recoverable by retrying. |
| `throttled` | Remote Config refused this fetch for coming too soon; the previous snapshot is still active. |  |

**Example: fetches a new template, activates it and names the keys that moved**

```js
const result = await dsx.module.remoteconfig.fetch({});
// resolves {"activated":true,"changed":["checkout_enabled"],"fetchedAt":1756108800000,"status":"success"}
```

**Example: a fetch that returns the template already active activates nothing, changes nothing and still succeeds**

```js
const result = await dsx.module.remoteconfig.fetch({"minimumInterval":0});
// resolves {"activated":false,"changed":[],"fetchedAt":1756108800000,"status":"success"}
```

### listen

`dsx.module.remoteconfig.listen`

Keeps the app up to date by telling it whenever a published change arrives, so a running app can react to a switch-off.

**When to use it.** Call it once at startup if flags must change while the app is open. Stop it when you no longer need it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `interval` | number | no | On the web, how often to check for changes, in seconds. Phones are told as soon as a change is published. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_listening` | This package is already listening for Remote Config updates. | Not recoverable by retrying. |
| `not_configured` | Firebase is not configured in this build, so there is nothing to listen to. | Not recoverable by retrying. |

**Example: emits an update naming the keys a newly published template moved**

```js
const result = await dsx.module.remoteconfig.listen({});
```

### signals

`dsx.module.remoteconfig.signals`

Sets facts about this device or person, such as plan or city, that the Firebase console can use to decide who gets which value.

**When to use it.** Use it for staged rollouts and targeting. Call it before fetch so the right values arrive.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `values` | object | yes | A map of signal names to values. Setting a key merges it with the others, and an empty text removes the key. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many signals are set now. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_signals` | signals needs a non-empty object of custom signal keys and string values. | Not recoverable by retrying. |

**Example: sets the custom signals a console condition can target**

```js
const result = await dsx.module.remoteconfig.signals({"values":{"city":"Tokyo","plan":"pro"}});
// resolves {"count":2}
```

### stop

`dsx.module.remoteconfig.stop`

Ends the change subscription that listen started.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `stopped` | boolean | yes | True once the subscription has ended. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_listening` | There is no Remote Config subscription to stop. | Not recoverable by retrying. |

**Example: stops an open subscription**

```js
const result = await dsx.module.remoteconfig.stop({});
// resolves {"stopped":true}
```

### value

`dsx.module.remoteconfig.value`

Reads one parameter as text, number and true or false, and says where the value came from.

**When to use it.** Use it to read a single flag. Check the source, because a value sent by the server and one that was never set look different.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The name of the parameter to read. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `boolean` | boolean | yes | The value as true or false. |
| `key` | string | yes | The name of the parameter that was read. |
| `number` | number | yes | The value as a number, zero if it is not one. |
| `source` | string | yes | Where it came from: remote for the server, default for your defaults, or static when neither has it. |
| `value` | string | yes | The parameter's current value as text. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_key` | value needs a non-empty Remote Config parameter key. | Not recoverable by retrying. |

**Example: reads a fetched parameter and says it came from the server**

```js
const result = await dsx.module.remoteconfig.value({"key":"checkout_enabled"});
// resolves {"boolean":false,"key":"checkout_enabled","number":0,"source":"remote","value":"false"}
```

**Example: a key the template does not carry falls back to static zero and SAYS so, so a real false is distinguishable**

```js
const result = await dsx.module.remoteconfig.value({"key":"never_published"});
// resolves {"boolean":false,"key":"never_published","number":0,"source":"static","value":""}
```

## Events

Read with `dsx.on(name, handler)`.

### update

A published change arrived and was applied. The values your screens read are already up to date when it fires.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `keys` | array of string | yes | The names of the parameters that changed. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `auto_fetch` | boolean | `true` | Fetch and activate the Remote Config template automatically when the app starts, so a kill-switch works without the app calling anything. |
| `fetch_timeout_seconds` | number | `60` | How long a fetch may take before it is treated as unreachable. The previous values stay active either way. |
| `minimum_fetch_interval_seconds` | number | `3600` | How long the app waits before asking the server again. DSX defaults to one hour (3600 seconds); set 0 while developing to see every change immediately. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | Remote Config could not be reached; the previous snapshot is still active. |  |
| `not_configured` | Firebase is not configured in this build, so there is no Remote Config to fetch. |  |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
