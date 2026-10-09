---
title: Bluetooth
description: Connect your app to nearby Bluetooth Low Energy devices.
package: bluetooth
---

Connect your app to nearby Bluetooth Low Energy devices.

Scans for Bluetooth Low Energy devices, connects, discovers services and reads, writes and subscribes to their data. Use it for wearables, sensors and other accessories. Asks for Bluetooth permission the first time it is used, with text you set. Works on phones and desktop.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to talk to Bluetooth Low Energy accessories such as heart rate straps, sensors and smart devices. It does not handle classic Bluetooth audio or pairing screens.

## What native adds

Native Bluetooth scans passively, keeps connections and notifications running in the background, and replays what you missed, which Web Bluetooth cannot.

## Install

```sh
despia add Core/Bluetooth
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

### connect

`dsx.module.bluetooth.connect`

Connects to a device found by scanning, waiting for the radio to be on if needed.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `auto_connect` | boolean | yes | Pass true to reconnect automatically after an unexpected drop; an explicit disconnect turns it off. |
| `id` | string | yes | The device id from a device event while scanning; it is not a hardware address and can change after a reinstall. |
| `server` | string | yes | An https address that receives a copy of connection events for your backend. |
| `timeout` | number | yes | How long to wait for the connection, in milliseconds, before giving up. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the connected device. |
| `state` | string | yes | The connection state, connected on success. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | Bluetooth permission has not been granted. |  |
| `switched_off` | Bluetooth is turned off on this device and the user did not turn it on. | Ask the user to switch Bluetooth on, then try again. |
| `unsupported_device` | This device has no Bluetooth radio this app can use. | Not recoverable by retrying. |

**Example: connects to a peripheral**

```js
const result = await dsx.module.bluetooth.connect({"auto_connect":false,"id":"1A2B3C4D-0000-1111-2222-3344556677AA","server":"","timeout":5000});
// resolves {"id":"1A2B3C4D-0000-1111-2222-3344556677AA","state":"connected"}
```

### disconnect

`dsx.module.bluetooth.disconnect`

Disconnects from a device and turns off automatic reconnecting for it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The device id from a device event while scanning; it is not a hardware address and can change after a reinstall. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | Identifies the device that was disconnected, matching the id you passed. |
| `state` | string | yes | The connection state, disconnected on success. |

**Example: disconnects a peripheral**

```js
const result = await dsx.module.bluetooth.disconnect({"id":"1A2B3C4D-0000-1111-2222-3344556677AA"});
// resolves {"id":"1A2B3C4D-0000-1111-2222-3344556677AA","state":"disconnected"}
```

### discover

`dsx.module.bluetooth.discover`

Finds the services and characteristics a connected device offers, which you need before reading or writing.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The device id from a device event while scanning; it is not a hardware address and can change after a reinstall. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | Identifies the device whose services were found, matching the id you passed. |
| `services` | array of object | yes | The services on the device, each with its characteristics. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | Bluetooth permission has not been granted. |  |
| `unsupported_device` | This device has no Bluetooth radio this app can use. | Not recoverable by retrying. |

**Example: discovers services and characteristics**

```js
const result = await dsx.module.bluetooth.discover({"id":"1A2B3C4D-0000-1111-2222-3344556677AA"});
// resolves {"id":"1A2B3C4D-0000-1111-2222-3344556677AA","services":[]}
```

### permission.manage

`dsx.module.bluetooth.permission.manage`

Lets the user change which items this app can see when Bluetooth is limited, without leaving the app; elsewhere it only reports the current state.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog for Bluetooth; false means only Settings can change it. |
| `changed` | boolean | yes | True when the user changed the selection in the system picker. |
| `level` | string | no | Always empty for Bluetooth, which has no permission levels. |
| `status` | string | yes | The current state of Bluetooth: undetermined, granted, limited, denied, restricted or unavailable. |

**Example: nothing limited to manage**

```js
const result = await dsx.module.bluetooth.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.bluetooth.permission.openSettings`

Opens this app's page in the system Settings so the user can change a denied permission.

**When to use it.** Call it only from a button the user taps, never automatically after a denial.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when the Settings page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | Opening Settings needs the App Settings package, which is not part of this app. | Add the App Settings package to the app, or tell the user where to find Settings. |
| `unsupported_platform` | A web page cannot open browser or system settings. | Show the user a short instruction for changing the permission in their browser instead. |

**Example: opens the app page**

```js
const result = await dsx.module.bluetooth.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.bluetooth.permission.request`

Asks for Bluetooth with the system dialog, for a settings row or an onboarding step; the dialog only appears while the system still allows it.

**When to use it.** Use it when the user taps something that clearly needs the permission, or on a priming screen you design.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog for Bluetooth; false means only Settings can change it. |
| `level` | string | no | Always empty for Bluetooth, which has no permission levels. |
| `status` | string | yes | The current state of Bluetooth: undetermined, granted, limited, denied, restricted or unavailable. |

**Example: granted**

```js
const result = await dsx.module.bluetooth.permission.request({});
// resolves {"canAsk":false,"status":"granted"}
```

### permission.status

`dsx.module.bluetooth.permission.status`

Reads the current state of Bluetooth without ever showing a dialog, so a settings screen can call it every time it appears.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog for Bluetooth; false means only Settings can change it. |
| `level` | string | no | Always empty for Bluetooth, which has no permission levels. |
| `status` | string | yes | The current state of Bluetooth: undetermined, granted, limited, denied, restricted or unavailable. |

**Example: never asked**

```js
const result = await dsx.module.bluetooth.permission.status({});
// resolves {"canAsk":true,"status":"undetermined"}
```

**Example: a final denial: only Settings helps**

```js
const result = await dsx.module.bluetooth.permission.status({});
// resolves {"canAsk":false,"status":"denied"}
```

### raw

`dsx.module.bluetooth.raw`

Sends a base64 payload straight to a device and returns what was sent.

**When not to.** Use write instead when you know the service and characteristic.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The device id from a device event while scanning; it is not a hardware address and can change after a reinstall. |
| `payload` | string | yes | The bytes to send, as base64 text. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | Identifies the device the bytes were sent to, matching the id you passed. |
| `meta` | object | yes | Extra details; always empty for now. |
| `payload` | string | yes | The bytes that were written, as base64 text. |

**Example: writes a raw base64 payload**

```js
const result = await dsx.module.bluetooth.raw({"id":"1A2B3C4D-0000-1111-2222-3344556677AA","payload":"AGQ="});
// resolves {"id":"1A2B3C4D-0000-1111-2222-3344556677AA","meta":{},"payload":"AGQ="}
```

### read

`dsx.module.bluetooth.read`

Reads the current value of one characteristic on a connected device.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `char` | string | yes | The characteristic identifier, as a 16-bit, 32-bit or full 128-bit UUID. |
| `id` | string | yes | The device id from a device event while scanning; it is not a hardware address and can change after a reinstall. |
| `service` | string | yes | The service identifier, as a 16-bit, 32-bit or full 128-bit UUID. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `char` | string | yes | The characteristic that was read. |
| `id` | string | yes | Identifies the device that was read, matching the id you passed. |
| `service` | string | yes | The service that was read. |
| `value` | string | yes | The value as base64 text. |
| `valueHex` | string | yes | The same value as upper-case hexadecimal text. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | Bluetooth permission has not been granted. |  |
| `unsupported_device` | This device has no Bluetooth radio this app can use. | Not recoverable by retrying. |

**Example: reads a characteristic value**

```js
const result = await dsx.module.bluetooth.read({"char":"2a37","id":"1A2B3C4D-0000-1111-2222-3344556677AA","service":"180d"});
// resolves {"char":"2a37","id":"1A2B3C4D-0000-1111-2222-3344556677AA","service":"180d","value":"AGQ=","valueHex":"0064"}
```

### rssi

`dsx.module.bluetooth.rssi`

Reads the signal strength of a connected device, which tells you roughly how near it is.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The device id from a device event while scanning; it is not a hardware address and can change after a reinstall. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | Identifies the device that was measured, matching the id you passed. |
| `rssi` | number | yes | The signal strength in decibels; closer to zero is stronger. |

**Example: reads the live rssi**

```js
const result = await dsx.module.bluetooth.rssi({"id":"1A2B3C4D-0000-1111-2222-3344556677AA"});
// resolves {"id":"1A2B3C4D-0000-1111-2222-3344556677AA","rssi":-52}
```

### scan

`dsx.module.bluetooth.scan`

Scans for nearby Bluetooth Low Energy devices and sends a device event for each one found, until the duration ends or you stop it.

**When to use it.** Use it to let the user choose a nearby accessory.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `duration` | number | yes | How long to scan, in milliseconds. |
| `services` | array of string | yes | Only report devices that advertise these service UUIDs, as a list; filtering by service is more reliable than by name. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ended` | boolean | yes | True when the scan finished. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | Bluetooth permission has not been granted. |  |
| `switched_off` | Bluetooth is turned off on this device and the user did not turn it on. | Ask the user to switch Bluetooth on, then try again. |
| `unsupported_device` | This device has no Bluetooth radio this app can use. | Not recoverable by retrying. |

**Example: streams device hits then resolves on end**

```js
const result = await dsx.module.bluetooth.scan({"duration":10000,"services":["180d"]});
// resolves {"ended":true}
```

### status

`dsx.module.bluetooth.status`

Reports whether Bluetooth is on and whether the app is allowed to use it.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `authorized` | boolean | yes | True when the user has allowed Bluetooth for this app. |
| `state` | string | yes | The radio state: on, off, unauthorized or unsupported. |

**Example: returns radio state and authorization**

```js
const result = await dsx.module.bluetooth.status({});
// resolves {"authorized":true,"state":"on"}
```

### stopScan

`dsx.module.bluetooth.stopScan`

Stops the scan that is currently running, if any.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the scan was stopped. |

**Example: stops an active scan**

```js
const result = await dsx.module.bluetooth.stopScan({});
// resolves {"ok":true}
```

### subscribe

`dsx.module.bluetooth.subscribe`

Starts receiving notifications from a characteristic as data events, for as long as the device stays connected.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `char` | string | yes | The characteristic identifier, as a 16-bit, 32-bit or full 128-bit UUID. |
| `id` | string | yes | The device id from a device event while scanning; it is not a hardware address and can change after a reinstall. |
| `server` | string | no | An https address that receives a copy of each notification for your backend. |
| `service` | string | yes | The service identifier, as a 16-bit, 32-bit or full 128-bit UUID. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | Bluetooth permission has not been granted. |  |
| `unsupported_device` | This device has no Bluetooth radio this app can use. | Not recoverable by retrying. |

**Example: streams notification data events**

```js
const result = await dsx.module.bluetooth.subscribe({"char":"2a37","id":"1A2B3C4D-0000-1111-2222-3344556677AA","server":"","service":"180d"});
```

### unsubscribe

`dsx.module.bluetooth.unsubscribe`

Stops notifications from a characteristic.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `char` | string | yes | The characteristic identifier, as a 16-bit, 32-bit or full 128-bit UUID. |
| `id` | string | yes | The device id from a device event while scanning; it is not a hardware address and can change after a reinstall. |
| `service` | string | yes | The service identifier, as a 16-bit, 32-bit or full 128-bit UUID. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `char` | string | yes | The characteristic that was unsubscribed. |
| `id` | string | yes | Identifies the device that was unsubscribed, matching the id you passed. |
| `service` | string | yes | The service that was unsubscribed. |

**Example: stops notifications for a characteristic**

```js
const result = await dsx.module.bluetooth.unsubscribe({"char":"2a37","id":"1A2B3C4D-0000-1111-2222-3344556677AA","service":"180d"});
// resolves {"char":"2a37","id":"1A2B3C4D-0000-1111-2222-3344556677AA","service":"180d"}
```

### write

`dsx.module.bluetooth.write`

Writes bytes to a characteristic on a connected device, from text, hex or base64.

**When to use it.** Use it to send commands or settings to an accessory.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `char` | string | yes | The characteristic identifier, as a 16-bit, 32-bit or full 128-bit UUID. |
| `hex` | string | no | Bytes to send as hexadecimal text. |
| `id` | string | yes | The device id from a device event while scanning; it is not a hardware address and can change after a reinstall. |
| `service` | string | yes | The service identifier, as a 16-bit, 32-bit or full 128-bit UUID. |
| `text` | string | no | Text to send as the bytes; if more than one of text, hex and value is given, text wins. |
| `value` | string | no | Bytes to send as base64 text. |
| `with_response` | boolean | no | True by default so the device confirms the write; false sends it without waiting, so success only means it was sent. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `char` | string | yes | The characteristic that was written. |
| `id` | string | yes | Identifies the device that was written to, matching the id you passed. |
| `service` | string | yes | The service that was written. |
| `success` | boolean | yes | True when the write was accepted or, without a response, dispatched. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | Bluetooth permission has not been granted. |  |
| `unsupported_device` | This device has no Bluetooth radio this app can use. | Not recoverable by retrying. |

**Example: writes a value with response**

```js
const result = await dsx.module.bluetooth.write({"char":"2a37","hex":"","id":"1A2B3C4D-0000-1111-2222-3344556677AA","service":"180d","text":"ping","value":"","with_response":true});
// resolves {"char":"2a37","id":"1A2B3C4D-0000-1111-2222-3344556677AA","service":"180d","success":true}
```

## Events

Read with `dsx.on(name, handler)`.

### bluetooth

Reports radio state changes, device disconnects and notifications that arrive when no call is waiting; missed ones are replayed when the app returns.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `authorized` | boolean | no | For state events, whether Bluetooth is allowed. |
| `background` | boolean | yes | True when the event was queued while the app was in the background. |
| `char` | string | no | For data events, the characteristic UUID. |
| `event` | string | yes | What happened: state, disconnect or data. |
| `id` | string | no | For disconnect and data events, the device id. |
| `reason` | string | no | For disconnect events, why, when the system says. |
| `service` | string | no | For data events, the service UUID. |
| `source` | string | no | For data events, where the value came from. |
| `state` | string | no | For state events, the radio state. |
| `timestamp` | number | no | For data events, seconds since 1970. |
| `value` | string | no | For data events, the value as base64 text. |
| `valueHex` | string | no | For data events, the value as hexadecimal text. |
| `willReconnect` | boolean | no | For disconnect events, true when automatic reconnecting is on. |

### data

A characteristic you subscribed to sent a new value.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `background` | boolean | no | True when the value was captured while the app was in the background. |
| `char` | string | yes | The characteristic identifier, as a 16-bit, 32-bit or full 128-bit UUID. |
| `event` | string | yes | Names the kind of event, which is always data here. |
| `id` | string | yes | The device id from a device event while scanning; it is not a hardware address and can change after a reinstall. |
| `service` | string | yes | The service identifier, as a 16-bit, 32-bit or full 128-bit UUID. |
| `source` | string | yes | Where the value came from, always notification. |
| `timestamp` | number | yes | When the value arrived, in seconds since 1970. |
| `value` | string | yes | The value as base64 text. |
| `valueHex` | string | yes | The value as upper-case hexadecimal text. |

### device

A device was found during a scan, with its name, signal strength and advertised services.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The device id from a device event while scanning; it is not a hardware address and can change after a reinstall. |
| `isConnectable` | boolean | yes | True when the device accepts connections. |
| `manufacturerData` | string | yes | Advertised manufacturer bytes as base64, empty when none or on the web. |
| `name` | string | yes | The advertised name of the device, if it has one. |
| `rssi` | number | yes | The signal strength in decibels when it was seen. |
| `services` | array of string | yes | The service UUIDs the device advertises. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `usage_description` | multiline | `Connect to and exchange data with nearby Bluetooth devices.` | The message shown when iOS asks the user for Bluetooth access. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `connect_failed` | The connection to the device could not be made. | Scan again to get a fresh id and retry. |
| `connect_timeout` | The peripheral did not answer before the connect timeout. |  |
| `connection_failed` | The connection to the device could not be made. | Scan again to get a fresh id and retry. |
| `discover_failed` | The device did not return its list of services. | Reconnect and try discovering again. |
| `permission_denied` | Bluetooth permission has not been granted. |  |
| `read_failed` | The device did not return a value for that characteristic. | Check that the characteristic can be read, then try again. |
| `rssi_failed` | Couldn't read the signal strength. |  |
| `subscribe_failed` | Couldn't subscribe to the characteristic. |  |
| `timeout` | The peripheral did not answer before the connect timeout. |  |
| `unavailable` | The radio is there but cannot serve this call right now, on the web lane, a chooser that needs a user gesture and was reached without one. |  |
| `unknown_device` | That device is unknown or not connected. |  |
| `write_failed` | The device did not accept the data written to that characteristic. | Check that the characteristic can be written and that the data is the right size. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
