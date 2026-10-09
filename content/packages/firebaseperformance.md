---
title: Firebase Performance
description: Measure how long key flows and network requests take with Firebase Performance Monitoring.
package: firebaseperformance
---

Measure how long key flows and network requests take with Firebase Performance Monitoring.

Works with the Error and crash reporting package: records custom timed traces such as checkout, and timings for the app's own network requests. Collection stays off until consent is granted. Needs your Firebase project set up in the app.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when you want to see how long key flows, such as checkout, and your own network requests take in the Firebase console. Skip it if you do not use Firebase.

## Install

```sh
despia add Core/Telemetry/Modules/FirebasePerformance
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone, desktop.

## Actions

### collect

`dsx.module.firebaseperformance.collect`

Turns performance collection on or off; turning it on is refused until the user has given consent, if the app asks for consent.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `enabled` | boolean | yes | True to start collecting performance data, false to stop. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `collecting` | boolean | yes | Whether collection is on after the call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `consent_denied` | Consent has not been granted, so performance data is not collected. |  |
| `missing_param` | A required argument is missing. | Not recoverable by retrying. |
| `not_configured` | Firebase Performance is not on this page (the firebase compat SDK with performance). | Not recoverable by retrying. |
| `unsupported_platform` | Firebase Performance has no SDK on this platform. | Not recoverable by retrying. |

**Example: Turn performance collection on**

```js
const result = await dsx.module.firebaseperformance.collect({"enabled":true});
// resolves {"collecting":true}
```

### request.end

`dsx.module.firebaseperformance.request.end`

Stops timing a network request and records its status, sizes and content type.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `contentType` | string | no | The content type of the response, such as application/json. |
| `id` | string | yes | The id that request.start returned. |
| `requestBytes` | number | no | How many bytes were sent in the request. |
| `responseBytes` | number | no | How many bytes came back in the response. |
| `status` | number | no | The HTTP status code of the response. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the request timing was recorded. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_result` | A status is 100 to 599 and byte counts are 0 or more. | Not recoverable by retrying. |
| `missing_param` | A required argument is missing. | Not recoverable by retrying. |
| `unknown_trace` | No open trace or request has that id. | Not recoverable by retrying. |
| `unsupported_platform` | Firebase Performance has no SDK on this platform. | Not recoverable by retrying. |

**Example: Stop timing and record the response**

```js
const result = await dsx.module.firebaseperformance.request.end({"contentType":"application/json","id":"r-1","requestBytes":0,"responseBytes":2048,"status":200});
// resolves {"ok":true}
```

### request.start

`dsx.module.firebaseperformance.request.start`

Starts timing a network request that the app is making.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `method` | string | yes | The HTTP method of the request, such as GET or POST. |
| `url` | string | yes | The full address that the app is requesting. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id to pass to request.end when the response has arrived. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_method` | Use an HTTP method: GET, PUT, POST, DELETE, HEAD, PATCH, OPTIONS, TRACE or CONNECT. | Not recoverable by retrying. |
| `invalid_url` | A request metric is an http(s) URL. | Not recoverable by retrying. |
| `unsupported_platform` | Firebase Performance has no SDK on this platform. | Not recoverable by retrying. |

**Example: Start timing a request**

```js
const result = await dsx.module.firebaseperformance.request.start({"method":"GET","url":"https://api.example.com/orders"});
// resolves {"id":"r-1"}
```

### trace.end

`dsx.module.firebaseperformance.trace.end`

Stops a trace and records it, with optional whole-number counters.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id that trace.start returned. |
| `metrics` | object | no | Whole-number counters to record with the trace, such as items processed. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the trace was recorded. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_metric` | A metric value is a whole number under a valid metric name. | Not recoverable by retrying. |
| `missing_param` | A required argument is missing. | Not recoverable by retrying. |
| `not_configured` | Firebase Performance is not on this page (the firebase compat SDK with performance). | Not recoverable by retrying. |
| `unknown_trace` | No open trace or request has that id. | Not recoverable by retrying. |
| `unsupported_platform` | Firebase Performance has no SDK on this platform. | Not recoverable by retrying. |

**Example: Stop the trace and record a counter**

```js
const result = await dsx.module.firebaseperformance.trace.end({"id":"t-1","metrics":{"items":3}});
// resolves {"ok":true}
```

### trace.start

`dsx.module.firebaseperformance.trace.start`

Starts a custom timed trace, for example around checkout, and returns an id to end it with.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attributes` | object | no | Up to five extra labels for the trace, as names with text values. |
| `name` | string | yes | A short name for the trace; Firebase's own naming limits apply. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id to pass to trace.end when the flow is done. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_attribute` | An attribute key is 1 to 40 letters, digits or underscores starting with a letter (not firebase_, google_ or ga_), and its value 1 to 100 characters. | Not recoverable by retrying. |
| `invalid_name` | A trace or metric name has no surrounding whitespace, no leading underscore and at most 100 characters. | Not recoverable by retrying. |
| `not_configured` | Firebase Performance is not on this page (the firebase compat SDK with performance). | Not recoverable by retrying. |
| `too_many_attributes` | A trace carries at most 5 custom attributes. | Not recoverable by retrying. |
| `unsupported_platform` | Firebase Performance has no SDK on this platform. | Not recoverable by retrying. |

**Example: Start timing checkout**

```js
const result = await dsx.module.firebaseperformance.trace.start({"attributes":{"plan":"pro"},"name":"checkout"});
// resolves {"id":"t-1"}
```

## Related packages

- Needs: [Firebase](/packages/firebase), [Telemetry](/packages/telemetry)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
