---
title: WebSocket
description: Keep a WebSocket connection open that reconnects by itself and never loses a message.
package: websocket
---

Keep a WebSocket connection open that reconnects by itself and never loses a message.

Opens named WebSocket connections, reconnects with a growing delay, and keeps outgoing and incoming messages in a durable queue so nothing is lost across a drop or a relaunch. You get connection state to show in your screens and an acknowledgement call to confirm each message. You write the messages your server expects.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when your app needs a live connection to your own server, such as chat, live feeds or presence, and messages must survive a dropped connection or a relaunch. For one-off requests use a normal API call instead.

## What native adds

The connection and its message queue live in the native app, so they survive the page reloading and are held through short network drops.

## Install

```sh
despia add Mandatory/WebSocket
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

### ack

`dsx.module.websocket.ack`

Confirms that one received message was handled, so it is not delivered again.

**When to use it.** Call it after you have processed each message. Unconfirmed messages are delivered again on the next page load, reconnect or relaunch.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The name you give this connection; use the same name in every later call. |
| `message_id` | string | yes | The id of the received message to confirm, taken from the message event. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The name of the connection the call applied to. |
| `message_id` | string | yes | The id of the message that was confirmed. |
| `ok` | boolean | yes | True when the call was accepted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required parameter was left out of the call. | Pass every required parameter, as listed for the action. |
| `not_found` | There is no connection with that id. | Call connect with that id first, and check the spelling. |

**Example: confirms a durable message so it stops replaying**

```js
const result = await dsx.module.websocket.ack({"id":"feed","message_id":"feed:7"});
// resolves {"id":"feed","message_id":"feed:7","ok":true}
```

### connect

`dsx.module.websocket.connect`

Opens a named connection to a ws:// or wss:// address, or updates it if it is already open, and reconnects automatically if it drops.

**When to use it.** Call it once at start-up, and subscribe to the events before you do.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `headers` | object | no | Extra headers to send when connecting. The web version ignores them, because browsers do not allow it. |
| `id` | string | yes | The name you give this connection; use the same name in every later call. |
| `protocols` | string | no | The WebSocket subprotocols to offer to the server. |
| `reconnect` | boolean | no | Set to false to turn off automatic reconnecting. It is on by default. |
| `url` | string | yes | The server address, starting with ws:// or wss://. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The name of the connection the call applied to. |
| `ok` | boolean | yes | True when the call was accepted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_param` | The address is not a ws:// or wss:// address. | Use an address that starts with ws:// or wss://. |
| `missing_param` | A required parameter was left out of the call. | Pass every required parameter, as listed for the action. |

**Example: opens a connection under a caller-chosen id**

```js
const result = await dsx.module.websocket.connect({"id":"feed","url":"wss://example.com/socket"});
// resolves {"id":"feed","ok":true}
```

**Example: opens with a subprotocol list and auto-reconnect off**

```js
const result = await dsx.module.websocket.connect({"id":"feed","protocols":"graphql-ws","reconnect":false,"url":"wss://example.com/socket"});
// resolves {"id":"feed","ok":true}
```

### disconnect

`dsx.module.websocket.disconnect`

Closes the connection and stops it reconnecting. The queues are kept, so connecting again under the same id carries on where it left off.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The name you give this connection; use the same name in every later call. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The name of the connection the call applied to. |
| `ok` | boolean | yes | True when the call was accepted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required parameter was left out of the call. | Pass every required parameter, as listed for the action. |
| `not_found` | There is no connection with that id. | Call connect with that id first, and check the spelling. |

**Example: closes the socket and stops reconnecting**

```js
const result = await dsx.module.websocket.disconnect({"id":"feed"});
// resolves {"id":"feed","ok":true}
```

### send

`dsx.module.websocket.send`

Adds a text message to the outgoing queue. Messages survive a drop and a relaunch and are sent in order once the connection is open.

**When not to.** A successful result means the message was queued, not that the server received it. Do not send large files this way.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The name you give this connection; use the same name in every later call. |
| `payload` | string | yes | The text of the message to send. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The name of the connection the call applied to. |
| `ok` | boolean | yes | True when the call was accepted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required parameter was left out of the call. | Pass every required parameter, as listed for the action. |
| `not_found` | There is no connection with that id. | Call connect with that id first, and check the spelling. |

**Example: accepts a frame onto the durable outbound queue**

```js
const result = await dsx.module.websocket.send({"id":"feed","payload":"{\"op\":\"ping\"}"});
// resolves {"id":"feed","ok":true}
```

### status

`dsx.module.websocket.status`

Returns the connection's state and how many messages are waiting, at the moment you ask.

**When to use it.** Use it when you run several connections. For one connection, read the live state values instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The name you give this connection; use the same name in every later call. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The name of the connection the call applied to. |
| `ok` | boolean | yes | True when the call was accepted. |
| `pendingOutbound` | number | yes | How many outgoing messages are still waiting to be sent. |
| `reconnectAttempt` | number | yes | How many reconnect attempts have been made since the last open connection. |
| `state` | string | yes | The connection state: idle, connecting, open, closing, closed or waitingReconnect. |
| `unacked` | number | yes | How many received messages have not been confirmed yet. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required parameter was left out of the call. | Pass every required parameter, as listed for the action. |
| `not_found` | There is no connection with that id. | Call connect with that id first, and check the spelling. |

**Example: reports the live connection state and the durable counts**

```js
const result = await dsx.module.websocket.status({"id":"feed"});
// resolves {"id":"feed","ok":true,"pendingOutbound":0,"reconnectAttempt":0,"state":"open","unacked":0}
```

### subscribe

`dsx.module.websocket.subscribe`

Stores one message that is sent first on every connect and reconnect, for example a login or channel-join frame. An empty frame clears it.

**When to use it.** Use it when your server needs to be told what to resume after each reconnect.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `frame` | string | no | The text message to send first on every connect. Leave it out or empty to clear the stored one. |
| `id` | string | yes | The name you give this connection; use the same name in every later call. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The name of the connection the call applied to. |
| `ok` | boolean | yes | True when the call was accepted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required parameter was left out of the call. | Pass every required parameter, as listed for the action. |
| `not_found` | There is no connection with that id. | Call connect with that id first, and check the spelling. |

**Example: stores the frame replayed on every reconnect**

```js
const result = await dsx.module.websocket.subscribe({"frame":"{\"op\":\"subscribe\",\"channel\":\"orders\"}","id":"feed"});
// resolves {"id":"feed","ok":true}
```

**Example: clears the stored frame when none is given**

```js
const result = await dsx.module.websocket.subscribe({"id":"feed"});
// resolves {"id":"feed","ok":true}
```

## Events

Read with `dsx.on(name, handler)`.

### event

Sent for everything that happens on a connection: it connects, opens, receives a message, waits to reconnect, closes, fails or drops messages. Check the type field to tell them apart.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attempt` | int | no | Which connection attempt this is, on connecting and reconnecting events. |
| `clean` | boolean | no | True when the connection closed in an orderly way. |
| `code` | int | no | The WebSocket close code, on closed events. |
| `count` | int | no | How many stored messages were discarded, on dropped events. |
| `dataType` | string | no | The kind of message body: text, json or binary, on message events. |
| `delay` | number | no | How many seconds until the next attempt, on reconnecting events. |
| `error` | string | no | A short description of what went wrong, on error and send_failed events. |
| `id` | string | yes | The name of the connection the event belongs to. |
| `message_id` | string | no | The id to pass to ack for this message, on message events. |
| `oid` | string | no | The id of the outgoing message that failed, on send_failed events. |
| `payload` | object | no | The message body: text, base64 for binary, or the parsed object when the type is json. |
| `pendingOutbound` | int | no | How many outgoing messages are waiting, on connection events. |
| `protocol` | string | no | The subprotocol the server agreed to, on open events. |
| `reason` | string | no | Why the connection closed or messages were dropped. |
| `ts` | number | yes | When the event happened, as a timestamp. |
| `type` | string | yes | What happened: connecting, open, message, reconnecting, closed, error, dropped or send_failed. |
| `unacked` | int | no | How many received messages are not yet confirmed, on connection events. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | A required parameter was left out of the call. | Pass every required parameter, as listed for the action. |
| `not_found` | There is no connection with that id. | Call connect with that id first, and check the spelling. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
