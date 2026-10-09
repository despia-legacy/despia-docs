---
title: Backend
description: The server side of LiveKit calls: it creates join tokens and receives LiveKit events.
package: backend
---

The server side of LiveKit calls: it creates join tokens and receives LiveKit events.

The secret-bearing LiveKit server half: join tokens for the verified caller and verified webhooks.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Add it whenever your calls run on LiveKit, because the LiveKit secret must stay on your server. It has nothing to do on a device and is not used with other call providers.

## Install

```sh
despia add Core/CallLiveKit/Modules/Backend
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | no |
| web | no |
| macos | no |

## Actions

### token

`dsx.module.backend.token`

Creates a short-lived LiveKit join token for the signed-in person and a room.

**When to use it.** Call it from your server when someone is about to join a call room.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | no | The display name other people see for this person. |
| `room` | string | yes | The name of the room to join; it must start with your allowed room prefix. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `expiresAt` | number | yes | When the token stops working, as a time. |
| `identity` | string | yes | The id used for this person in the room, taken from their sign-in. |
| `room` | string | yes | The room the token is valid for. |
| `token` | string | yes | The signed token the app uses to join the room. |
| `url` | string | yes | The LiveKit address the app connects to. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The room is missing or is not a valid room name. | Pass a room name made of letters, numbers and simple punctuation. |
| `forbidden` | The room name does not start with the prefix your server allows. | Use a room name that starts with the configured room prefix. |
| `not_configured` | The LiveKit key or secret is not set on your server. | Set the LiveKit key, secret and address in your server settings. |
| `unauthenticated` | There is no signed-in caller, or the webhook signature is missing or wrong. | Call it as a signed-in person; for webhooks check LiveKit's webhook settings. |

**Example: Create a join token for a room**

```js
const result = await dsx.module.backend.token({"name":"Ada","room":"standup"});
// resolves {"expiresAt":1791500000,"identity":"user_123","room":"standup","token":"example-join-token","url":"wss://example.livekit.cloud"}
```

### webhook

`dsx.module.backend.webhook`

Receives LiveKit's events, checks their signature and passes them on to your workflows.

**When to use it.** Point your LiveKit project's webhook at this route; you do not call it yourself.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `event` | string | yes | The kind of LiveKit event that was received. |
| `received` | boolean | yes | True when the event passed the signature check and was accepted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | The room is missing or is not a valid room name. | Pass a room name made of letters, numbers and simple punctuation. |
| `not_configured` | The LiveKit key or secret is not set on your server. | Set the LiveKit key, secret and address in your server settings. |
| `unauthenticated` | There is no signed-in caller, or the webhook signature is missing or wrong. | Call it as a signed-in person; for webhooks check LiveKit's webhook settings. |

**Example: Accept a LiveKit event**

```js
const result = await dsx.module.backend.webhook({});
// resolves {"event":"participant_joined","received":true}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `api_key` | string | `` | The API key of your LiveKit project or server (LiveKit Cloud: Settings, Keys). |
| `api_secret` | secret | `` | The API secret paired with the key. It signs join tokens and verifies webhooks. |
| `room_prefix` | string | `` | Optional: tokens are minted only for rooms whose name starts with this. |
| `url` | string | `` | The wss:// url devices connect to, returned beside each token so the app needs no second setting. |

## Related packages

- Needs: [CallLiveKit](/packages/calllivekit)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
