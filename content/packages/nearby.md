---
title: Nearby
description: Connect two phones running your app directly and send them data, with no server.
package: nearby
---

Connect two phones running your app directly and send them data, with no server.

Finds nearby devices that run the same app, connects them and lets them exchange small messages, using Nearby Connections on Android and MultipeerConnectivity on iOS with the same calls. iPhones only connect to iPhones and Android phones to Android phones. You write the screens for picking a peer and the messages you send.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it for local multiplayer, file-less data sharing or classroom-style features between devices in the same room. Do not use it when an iPhone must talk to an Android phone, because the two systems cannot find each other; use a server for that.

## What native adds

Peer-to-peer radios work without internet and are not available to a web page.

## Install

```sh
despia add Core/Nearby
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

Device classes: phone.

## Actions

### capabilities

`dsx.module.nearby.capabilities`

Reports what this device's nearby connection can do, such as the largest message and the connection strategies on offer.

**When to use it.** Use it before sending, to split large messages.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `maxPayloadBytes` | number | yes | The largest message you can send, in bytes. |
| `strategies` | array of string | yes | The connection strategies this device supports. |

**Example: reports the payload ceiling and the strategies the platform honors**

```js
const result = await dsx.module.nearby.capabilities({});
// resolves {"maxPayloadBytes":32768,"strategies":["star","cluster","p2p"]}
```

### connect

`dsx.module.nearby.connect`

Asks a discovered device to connect. Connections are accepted automatically, so any device running the same app and service id can join.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `peer` | string | yes | The id of a device from a peerFound event. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `connected` | boolean | yes | True once the connection is made. |
| `peer` | object | yes | The device you connected to, with its id and name. |
| `peer.id` | string | yes | The session id of the device. |
| `peer.name` | string | yes | The display name of the device. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `connection_failed` | The connection could not be established. |  |
| `not_started` | No nearby session is running. |  |
| `peer_not_found` | No discovered peer has that id. |  |

**Example: connects to a discovered peer**

```js
const result = await dsx.module.nearby.connect({"peer":"4a2f"});
// resolves {"connected":true,"peer":{"id":"4a2f","name":"Bob"}}
```

### disconnect

`dsx.module.nearby.disconnect`

Closes the connection to one device, or to every connected device when no peer is given.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `peer` | string | no | The id of the device to disconnect. Leave it out to disconnect all. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `disconnected` | number | yes | How many connections were closed. |

**Example: disconnects one peer**

```js
const result = await dsx.module.nearby.disconnect({"peer":"4a2f"});
// resolves {"disconnected":1}
```

**Example: disconnects everyone when no peer is named**

```js
const result = await dsx.module.nearby.disconnect({});
// resolves {"disconnected":2}
```

### permission.manage

`dsx.module.nearby.permission.manage`

Lets the person change a limited selection of what the app can access, where the system offers that, and otherwise just reports the current state.

**When to use it.** Use it from a settings row such as Manage access. When nothing can be managed it returns changed as false.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when the system will still show its prompt, false once the person has refused and must change it in Settings. |
| `changed` | boolean | yes | True when the person changed their selection. |
| `level` | string | no | A finer detail of the grant where the system has one, for example limited access, otherwise left out. |
| `status` | string | yes | Whether nearby device access is granted, denied or not yet asked. |

**Example: nothing limited to manage**

```js
const result = await dsx.module.nearby.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.nearby.permission.openSettings`

Opens this app's page in the system Settings so the person can change a permission they refused earlier.

**When to use it.** Use it from a button after a request came back denied and canAsk is false.

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
| `unavailable` | Opening Settings needs the App Settings package (dsx.module.settings). | Not recoverable by retrying. |
| `unsupported_platform` | No page script can open browser or OS settings. | Not recoverable by retrying. |

**Example: opens the app page**

```js
const result = await dsx.module.nearby.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.nearby.permission.request`

Asks the person for nearby device access through the system prompt and reports the answer.

**When to use it.** Call it just before the feature is needed, after you have told the person why. Check permission.status first to avoid a pointless prompt.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when the system will still show its prompt, false once the person has refused and must change it in Settings. |
| `level` | string | no | A finer detail of the grant where the system has one, for example limited access, otherwise left out. |
| `status` | string | yes | Whether nearby device access is granted, denied or not yet asked. |

**Example: granted**

```js
const result = await dsx.module.nearby.permission.request({});
// resolves {"canAsk":false,"status":"granted"}
```

### permission.status

`dsx.module.nearby.permission.status`

Reports whether the app currently has nearby device access without asking the person.

**When to use it.** Use it to decide whether to show a button, a request screen or the feature itself.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True when the system will still show its prompt, false once the person has refused and must change it in Settings. |
| `level` | string | no | A finer detail of the grant where the system has one, for example limited access, otherwise left out. |
| `status` | string | yes | Whether nearby device access is granted, denied or not yet asked. |

**Example: never asked**

```js
const result = await dsx.module.nearby.permission.status({});
// resolves {"canAsk":true,"status":"undetermined"}
```

**Example: a final denial: only Settings helps**

```js
const result = await dsx.module.nearby.permission.status({});
// resolves {"canAsk":false,"status":"denied"}
```

### send

`dsx.module.nearby.send`

Sends a message to one connected device, or to all of them when no peer is given.

**When to use it.** Use it for small messages. It is limited to the size reported by capabilities.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `data` | string | yes | The message as a base64 string. |
| `peer` | string | no | The id of the device to send to. Leave it out to broadcast. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | number | yes | The size of the message in bytes. |
| `sent` | number | yes | How many devices the message was sent to. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_started` | No nearby session is running. |  |
| `peer_not_found` | No connected peer has that id. |  |
| `send_failed` | The payload could not be sent. |  |
| `too_large` | The payload exceeds the bytes-payload limit. | Not recoverable by retrying. |

**Example: broadcasts to every connected peer**

```js
const result = await dsx.module.nearby.send({"data":"aGVsbG8="});
// resolves {"bytes":5,"sent":2}
```

**Example: sends to one peer**

```js
const result = await dsx.module.nearby.send({"data":"aGVsbG8=","peer":"4a2f"});
// resolves {"bytes":5,"sent":1}
```

### start

`dsx.module.nearby.start`

Starts the single nearby session: advertises this device, looks for others, or both, and streams what it finds as events.

**When to use it.** Call it when the person opens a nearby screen and stop it when they leave. Both devices must run the same app with the same service id.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `mode` | string | no | Whether to advertise, discover or do both. Defaults to both. |
| `name` | string | no | The name other devices see for this one. Defaults to the device name. |
| `prompt` | boolean | no | Set to false to fail with permission_denied instead of showing the system permission dialog. |
| `strategy` | string | no | On Android, how devices connect: star, cluster or p2p. iOS ignores it. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A nearby session is already running. |  |
| `invalid_argument` | mode must be advertise\|discover\|both; strategy star\|cluster\|p2p. | Not recoverable by retrying. |
| `permission_denied` | Nearby access is not granted. The data carries the contract state: { permission, status, canAsk }. |  |
| `switched_off` | Bluetooth, and Wi-Fi if the device has it, is switched off, so nearby devices cannot be found. | Ask the person to turn Bluetooth on, then start again. |
| `unavailable` | Nearby could not start right now. |  |
| `unsupported_device` | This device cannot run a nearby session: no Google Play services, or no Bluetooth or Wi-Fi radio to discover and advertise over. | Not recoverable by retrying. |

**Example: advertises and discovers, streaming peer and payload events**

```js
const result = await dsx.module.nearby.start({"mode":"both","name":"Alice","strategy":"star"});
```

### stop

`dsx.module.nearby.stop`

Ends the nearby session and disconnects everyone.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `active` | boolean | yes | False once the session has ended. |

**Example: ends the session**

```js
const result = await dsx.module.nearby.stop({});
// resolves {"active":false}
```

## Events

Read with `dsx.on(name, handler)`.

### connected

The connection to a device is established and you can send messages.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `peer` | object | yes | The device that is now connected, with its id and name. |
| `peer.id` | string | yes | An opaque id for the device that lasts only for this session; use it to connect or send. |
| `peer.name` | string | yes | The human readable device name other devices see. |
| `status` | string | yes | The state this event reports, connected. |
| `timestamp` | int | yes | When it happened, in epoch milliseconds. |

### connecting

A connection to a device is being set up.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `auth` | string | no | On Android, digits both screens can show so the two people can confirm they are the right devices. |
| `peer` | object | yes | The device being connected, with its id and name. |
| `peer.id` | string | yes | An opaque id for the device that lasts only for this session; use it to connect or send. |
| `peer.name` | string | yes | The human readable device name other devices see. |
| `status` | string | yes | The state this event reports, connecting. |
| `timestamp` | int | yes | When it happened, in epoch milliseconds. |

### disconnected

A device disconnected, or a connection attempt ended without connecting on iOS.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `peer` | object | yes | The device that disconnected, with its id and name. |
| `peer.id` | string | yes | An opaque id for the device that lasts only for this session; use it to connect or send. |
| `peer.name` | string | yes | The human readable device name other devices see. |
| `status` | string | yes | The state this event reports, disconnected. |
| `timestamp` | int | yes | When it happened, in epoch milliseconds. |

### payload

A message arrived from a connected device.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | int | yes | The size of the decoded message in bytes. |
| `data` | string | yes | The message as a base64 string. |
| `peer` | object | yes | The device that sent the message. |
| `peer.id` | string | yes | An opaque id for the device that lasts only for this session; use it to connect or send. |
| `peer.name` | string | yes | The human readable device name other devices see. |
| `status` | string | yes | The state this event reports, payload. |
| `timestamp` | int | yes | When it arrived, in epoch milliseconds. |

### peerFound

A nearby device running the same app and service id was found.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `peer` | object | yes | The device that was found. |
| `peer.id` | string | yes | An opaque id for the device that lasts only for this session; use it to connect or send. |
| `peer.name` | string | yes | The human readable device name other devices see. |
| `status` | string | yes | The state this event reports, found. |
| `timestamp` | int | yes | When it happened, in epoch milliseconds. |

### peerLost

A device that had been found has stopped advertising or gone out of range.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `peer` | object | yes | The device that was lost. |
| `peer.id` | string | yes | An opaque id for the device that lasts only for this session; use it to connect or send. |
| `peer.name` | string | yes | The human readable device name other devices see. |
| `status` | string | yes | The state this event reports, lost. |
| `timestamp` | int | yes | When it happened, in epoch milliseconds. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `service_id` | string | `despia-nearby` | The identifier peers use to find each other. Both sides of a connection must use the same value. |
| `usage_local_network` | multiline | `Connecting to nearby devices running this app to share data directly` | The message shown when iOS asks for local-network access. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
