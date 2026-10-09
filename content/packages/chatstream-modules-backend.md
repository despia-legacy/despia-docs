---
title: Backend
description: The server half of Stream chat and video that keeps your Stream secret off devices.
package: backend
---

The server half of Stream chat and video that keeps your Stream secret off devices.

Runs on your own server and issues Stream user tokens for the signed-in person, creates chat channels and video calls with their members, and checks Stream's webhooks before acting on them. The chat and call packages on the device fetch their token from here. You need a Stream app with its API key and secret.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it whenever you use Stream chat or video, so the Stream secret stays on your server. Skip it only if you already run your own token service.

## Install

```sh
despia add Core/ChatStream/Modules/Backend
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

### call

`dsx.module.backend.call`

Creates a video call on the server with the members you name, and can ring them.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `callId` | string | yes | The id of the Stream call to create. |
| `callType` | string | no | The Stream call type to use, such as default. |
| `members` | array of string | no | The Stream user ids to invite to the call. |
| `ring` | boolean | no | Set true to ring the members on their devices. |
| `video` | boolean | no | Set false for an audio-only call. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `callId` | string | yes | The id of the call that was created. |
| `members` | array of string | yes | The Stream user ids that were added to the call. |
| `ringing` | boolean | yes | True when the members are being rung. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | callId must be a Stream call id and members Stream user ids. | Not recoverable by retrying. |
| `not_configured` | STREAM_API_KEY and STREAM_SECRET_KEY must both be set. | Not recoverable by retrying. |
| `unavailable` | Stream could not be reached. |  |

**Example: Create a video call and ring the members**

```js
const result = await dsx.module.backend.call({"callId":"standup-1","members":["user_123","agent_7"],"ring":true});
// resolves {"callId":"standup-1","members":["user_123","agent_7"],"ringing":true}
```

### channel

`dsx.module.backend.channel`

Creates a chat channel on the server, or joins one that exists, with the members you name. Stream requires this to be done server-side when you control who is in a channel.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `channelType` | string | no | The Stream channel type to use, such as messaging. |
| `conversationId` | string | yes | The id of the Stream channel to create or join. |
| `members` | array of string | no | The Stream user ids to put in the channel. |
| `name` | string | no | A display name for the channel. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `conversationId` | string | yes | The id of the channel that was created or joined. |
| `members` | array of string | yes | The Stream user ids that are in the channel. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_request` | conversationId must be a Stream channel id and members Stream user ids. | Not recoverable by retrying. |
| `not_configured` | STREAM_API_KEY and STREAM_SECRET_KEY must both be set. | Not recoverable by retrying. |
| `unavailable` | Stream could not be reached. |  |

**Example: Create a channel with two members**

```js
const result = await dsx.module.backend.channel({"channelType":"messaging","conversationId":"support-42","members":["user_123","agent_7"],"name":"Support"});
// resolves {"conversationId":"support-42","members":["user_123","agent_7"]}
```

### token

`dsx.module.backend.token`

Creates a Stream user token for the signed-in person. The Stream user id is always the verified caller, never something the app passes in.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | no | The display name to show for this person in Stream. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `apiKey` | string | yes | Your Stream API key, which is safe to give to the device. |
| `expiresAt` | number | yes | When the token stops working, as a Unix timestamp. |
| `token` | string | yes | The signed Stream user token for the device to use. |
| `user` | string | yes | The Stream user id the token was made for. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | STREAM_API_KEY and STREAM_SECRET_KEY must both be set, and Stream must accept them. | Not recoverable by retrying. |
| `unavailable` | Stream could not be reached. |  |

**Example: Make a Stream token for the signed-in person**

```js
const result = await dsx.module.backend.token({"name":"Ada Lovelace"});
// resolves {"apiKey":"stream-public-api-key","expiresAt":1760003600,"token":"signed-stream-user-token","user":"user_123"}
```

### webhook

`dsx.module.backend.webhook`

Receives Stream's webhook calls after checking their signature, so events are only acted on when they really came from Stream. It has no arguments because Stream calls it directly.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the webhook was verified and accepted. |
| `type` | string | yes | The type of the Stream event that was received. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | STREAM_API_KEY and STREAM_SECRET_KEY must both be set. | Not recoverable by retrying. |
| `unauthenticated` | The delivery's signature or API key does not match this Stream app. | Not recoverable by retrying. |

**Example: Accept a Stream event that Stream sends**

```js
const result = await dsx.module.backend.webhook({});
// resolves {"ok":true,"type":"message.new"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `api_key` | string | `` | Your Stream app's API key (Stream Dashboard, App, API key). Public; the devices receive it from the token route. |
| `secret_key` | secret | `` | Your Stream app's API secret. It signs every user token and verifies every webhook. |
| `token_ttl_seconds` | string | `86400` | How long a minted user token is valid, in seconds (default 86400, at most 30 days). The device SDKs ask for a new one when it expires. |

## Related packages

- Needs: [ChatStream](/packages/chatstream)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
