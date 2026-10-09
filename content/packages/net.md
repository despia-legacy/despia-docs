---
title: Net
description: Know what kind of connection the device has and whether your app can really reach the internet.
package: net
---

Know what kind of connection the device has and whether your app can really reach the internet.

Tells your app whether the device is online, whether the link is wifi or cellular, whether it is metered or in data saver mode, and can run a real round trip to check that your backend answers. The same facts are also available as live variables you can bind to a layout, so a banner can appear when the connection drops.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it to show an offline banner, hold back big downloads on a metered link, or check that your backend is reachable before a sync. You rarely need to call it, since the variables update on their own.

## What native adds

It reads the operating system's own connection monitor, including metered and data saver state and the cellular generation, which a web page cannot see.

## Install

```sh
despia add Core/Net
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

### carrier

`dsx.module.net.carrier`

Reads the mobile carrier behind the cellular radio, such as its name and country. Every field can be missing, since newer systems hide most of it.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `allowsVoip` | boolean | no | True when the carrier allows internet calling. |
| `isoCountryCode` | string | no | The two-letter country code of the carrier. |
| `mcc` | string | no | The mobile country code of the carrier. |
| `mnc` | string | no | The mobile network code of the carrier. |
| `name` | string | no | The carrier's display name, such as the company that provides the SIM. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | This device has no cellular subscription to report on. | Treat the carrier details as unknown on this device. |

**Example: reports the subscription behind the radio**

```js
const result = await dsx.module.net.carrier({});
// resolves {"allowsVoip":true,"isoCountryCode":"de","mcc":"262","mnc":"02","name":"Vodafone"}
```

**Example: reports what it has when the OS withholds the operator identity**

```js
const result = await dsx.module.net.carrier({});
// resolves {"allowsVoip":true,"isoCountryCode":"us"}
```

### probe

`dsx.module.net.probe`

Makes a real request to check that a server answers, because a connection can be up while a captive portal blocks everything. Redirects are not followed.

**When to use it.** Use it before a sync, or when status says online but requests fail.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `timeout` | number | no | How long to wait for an answer, in milliseconds. |
| `url` | string | no | The address to check. Leave it out to check your app's own origin. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `latencyMs` | number | yes | How long the round trip took, in milliseconds. |
| `reachable` | boolean | yes | True when the server answered in time. |
| `status` | number | yes | The HTTP status code the server answered with. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_url` | The address is not an http or https URL. | Pass a full http or https address. |
| `no_origin` | No address was given and the app declares no origin to check. | Pass a url, or set the probe address in the Net settings. |
| `probe_timeout` | The connectivity check did not get an answer in time. | Treat the backend as unreachable for now and try again later. |

**Example: a completed round trip is reachable, with its latency**

```js
const result = await dsx.module.net.probe({"url":"https://app.example.com/health"});
// resolves {"latencyMs":38,"reachable":true,"status":200}
```

**Example: a captive portal redirect to another host is NOT reachable**

```js
const result = await dsx.module.net.probe({"url":"https://app.example.com/health"});
// resolves {"latencyMs":12,"reachable":false,"status":302}
```

### status

`dsx.module.net.status`

Reads the current connection once: whether the device is online, the link type, and whether it is metered. It never prompts and never waits on the network.

**When to use it.** Use it when you need a one-off answer in code.

**When not to.** For banners and buttons, bind to the live context variables instead.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `constrained` | boolean | yes | True when the person turned on Low Data Mode or Data Saver. |
| `expensive` | boolean | yes | True when the link is metered, so heavy downloads should wait. |
| `generation` | string | no | The cellular generation, such as 4g or 5g, when on cellular. |
| `ipv4` | string | no | The device's IPv4 address on the current link, when known. |
| `ipv6` | string | no | The device's IPv6 address on the current link, when known. |
| `online` | boolean | yes | True when the device has a link and the last connectivity check did not fail. |
| `reachable` | boolean | yes | True when the device has a network interface that is up. |
| `ssid` | string | no | The wifi network name, when the platform shares it. |
| `type` | string | yes | The link type: wifi, cellular, ethernet, vpn, other or none. |

**Example: reports an unmetered wifi link with its local address**

```js
const result = await dsx.module.net.status({});
// resolves {"constrained":false,"expensive":false,"ipv4":"192.168.1.24","online":true,"reachable":true,"type":"wifi"}
```

**Example: reports a metered cellular link with its radio generation**

```js
const result = await dsx.module.net.status({});
// resolves {"constrained":false,"expensive":true,"generation":"5g","online":true,"reachable":true,"type":"cellular"}
```

### unwatch

`dsx.module.net.unwatch`

Stops the change stream for this caller. The live variables keep updating.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `watching` | boolean | yes | False once this caller's stream has stopped. |

**Example: ends the stream**

```js
const result = await dsx.module.net.unwatch({});
// resolves {"watching":false}
```

### watch

`dsx.module.net.watch`

Streams a change event whenever the connection settles into a new state. Quick flaps, such as a wifi handoff, are filtered out.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

_None._

**Example: emits one settled transition from wifi to cellular**

```js
const result = await dsx.module.net.watch({});
```

**Example: a flap shorter than the debounce window emits nothing**

```js
const result = await dsx.module.net.watch({});
```

## Events

Read with `dsx.on(name, handler)`.

### change

Fires when the connection settles into a new state, after a short debounce, with the new status and the previous link type.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `constrained` | boolean | yes | True when Low Data Mode or Data Saver is on. |
| `expensive` | boolean | yes | True when the new link is metered. |
| `generation` | string | no | The cellular generation, when on cellular. |
| `ipv4` | string | no | The device's IPv4 address on the new link, when known. |
| `ipv6` | string | no | The device's IPv6 address on the new link, when known. |
| `online` | boolean | yes | True when the device is online. |
| `previous` | string | yes | The link type before this change. |
| `reachable` | boolean | yes | True when a network interface is up. |
| `ssid` | string | no | The wifi network name, when the platform shares it. |
| `type` | string | yes | The new link type, such as wifi or cellular. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `debounce_ms` | number | `500` | How long a new connection state must hold, in milliseconds, before it counts as a change. |
| `probe_timeout_ms` | number | `5000` | How long probe() waits, in milliseconds, before failing with probe_timeout. |
| `probe_url` | string | `` | The URL probe() checks when the caller names none. Empty means the app's own origin. |
| `watch_on_launch` | boolean | `true` | Keep the connectivity context variables live from app start, without anyone calling watch(). |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
