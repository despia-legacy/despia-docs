---
title: Backend
description: Run the small server relay that lets your app chat through Sendbird without exposing your keys.
package: backend
---

Run the small server relay that lets your app chat through Sendbird without exposing your keys.

Gives your server a session route that creates the signed-in user's Sendbird account and a one-hour token, and a relay that passes only the allowed chat requests on to Sendbird after checking who is asking. Uploads go to your own storage bucket. You supply your Sendbird application id, API token and a relay secret, and run it on your own deployment.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it when you use the Sendbird chat package and need the server half that keeps your Sendbird API token off the device. It is not something the app calls directly; the chat package talks to its routes.

## Install

```sh
despia add Core/ChatSendbird/Modules/Backend
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

### channelInfo

`dsx.module.backend.channelInfo`

Passes the request for one channel's details on to Sendbird, after checking the user is a member of it.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `answer` | object | yes | Sendbird's own answer to the forwarded request. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `forbidden` | The request names another user, or the user is not a member of the channel. | Send requests only for the signed-in user and for channels they belong to. |
| `not_configured` | The Sendbird application id, API token or relay secret has not been set. | Set all three in the package settings on your server. |
| `unauthenticated` | The relay token is missing, forged or has expired. | Ask for a new session to get a fresh token. |
| `unavailable` | Sendbird could not be reached. | Try again in a moment. |

**Example: Read one channel**

```js
const result = await dsx.module.backend.channelInfo({});
// resolves {"answer":{"channel_url":"sendbird_group_channel_1","member_count":3,"name":"Team"}}
```

### markRead

`dsx.module.backend.markRead`

Passes the request that marks a channel as read on to Sendbird, after checking the user is a member of it.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `answer` | object | yes | Sendbird's own answer to the forwarded request. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `forbidden` | The request names another user, or the user is not a member of the channel. | Send requests only for the signed-in user and for channels they belong to. |
| `not_configured` | The Sendbird application id, API token or relay secret has not been set. | Set all three in the package settings on your server. |
| `unauthenticated` | The relay token is missing, forged or has expired. | Ask for a new session to get a fresh token. |
| `unavailable` | Sendbird could not be reached. | Try again in a moment. |

**Example: Mark a channel as read**

```js
const result = await dsx.module.backend.markRead({});
// resolves {"answer":{}}
```

### messages

`dsx.module.backend.messages`

Passes the request for a channel's messages on to Sendbird, after checking the user is a member of it.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `answer` | object | yes | Sendbird's own answer to the forwarded request. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `forbidden` | The request names another user, or the user is not a member of the channel. | Send requests only for the signed-in user and for channels they belong to. |
| `not_configured` | The Sendbird application id, API token or relay secret has not been set. | Set all three in the package settings on your server. |
| `unauthenticated` | The relay token is missing, forged or has expired. | Ask for a new session to get a fresh token. |
| `unavailable` | Sendbird could not be reached. | Try again in a moment. |

**Example: Read the messages of a channel**

```js
const result = await dsx.module.backend.messages({});
// resolves {"answer":{"messages":[{"message":"Hello team","message_id":1001,"user":{"user_id":"user_123"}}]}}
```

### myChannels

`dsx.module.backend.myChannels`

Passes the request for the signed-in user's chat channels on to Sendbird after checking the relay token.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `answer` | object | yes | Sendbird's own answer to the forwarded request. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `forbidden` | The request names another user, or the user is not a member of the channel. | Send requests only for the signed-in user and for channels they belong to. |
| `not_configured` | The Sendbird application id, API token or relay secret has not been set. | Set all three in the package settings on your server. |
| `unauthenticated` | The relay token is missing, forged or has expired. | Ask for a new session to get a fresh token. |
| `unavailable` | Sendbird could not be reached. | Try again in a moment. |

**Example: List the signed-in user chat channels**

```js
const result = await dsx.module.backend.myChannels({});
// resolves {"answer":{"channels":[{"channel_url":"sendbird_group_channel_1","name":"Team"}]}}
```

### session

`dsx.module.backend.session`

Creates the signed-in user's Sendbird account on first use and returns their Sendbird user id with a relay token that is valid for one hour.

**When to use it.** The chat package calls this route when it starts a chat session.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `token` | string | yes | The relay token the app sends with later requests; it is valid for one hour. |
| `user` | string | yes | The Sendbird user id of the signed-in person. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `authentication_required` | There is no signed-in user to create a Sendbird session for. | Sign the user in before opening chat. |
| `bad_request` | The signed-in user's id cannot be used as a Sendbird user id. | Check the characters in your user ids against Sendbird's rules. |
| `not_configured` | The Sendbird application id, API token or relay secret has not been set. | Set all three in the package settings on your server. |
| `unavailable` | Sendbird could not be reached. | Try again in a moment. |

**Example: Open a chat session for the signed-in person**

```js
const result = await dsx.module.backend.session({});
// resolves {"token":"example-relay-token","user":"user_123"}
```

### typing

`dsx.module.backend.typing`

Passes the typing indicator on to Sendbird, after checking the user is a member of the channel.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `answer` | object | yes | Sendbird's own answer to the forwarded request. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `forbidden` | The request names another user, or the user is not a member of the channel. | Send requests only for the signed-in user and for channels they belong to. |
| `not_configured` | The Sendbird application id, API token or relay secret has not been set. | Set all three in the package settings on your server. |
| `unauthenticated` | The relay token is missing, forged or has expired. | Ask for a new session to get a fresh token. |
| `unavailable` | Sendbird could not be reached. | Try again in a moment. |

**Example: Tell a channel the user is typing**

```js
const result = await dsx.module.backend.typing({});
// resolves {"answer":{}}
```

### upload

`dsx.module.backend.upload`

Stores an attached file in your own storage bucket for a channel the user belongs to, and returns a link to it.

**When not to.** Needs a storage bucket declared in your server document, otherwise it answers bucket_not_declared.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The name the file was stored under in the bucket. |
| `url` | string | yes | The link to the stored file; a plain link for a public bucket, otherwise a signed link valid for one hour. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bucket_not_declared` | Your server document does not declare the storage bucket that uploads need. | Add a bucket named chatsendbird_uploads to your server document. |
| `forbidden` | The request names another user, or the user is not a member of the channel. | Send requests only for the signed-in user and for channels they belong to. |
| `not_configured` | The Sendbird application id, API token or relay secret has not been set. | Set all three in the package settings on your server. |
| `unauthenticated` | The relay token is missing, forged or has expired. | Ask for a new session to get a fresh token. |
| `unavailable` | Sendbird could not be reached. | Try again in a moment. |

**Example: Store a file attached to a channel message**

```js
const result = await dsx.module.backend.upload({});
// resolves {"key":"sendbird_group_channel_1/user_123/photo.jpg","url":"https://uploads.example.com/sendbird_group_channel_1/user_123/photo.jpg"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `api_token` | secret | `` | The master or a secondary API token (Settings, Application, General). It never leaves this backend. |
| `app_id` | string | `` | The Application ID from the Sendbird Dashboard (Settings, Application, General). |
| `relay_secret` | secret | `` | Any long random string; it signs the relay bearers devices carry. Rotating it signs every device out of chat. |
| `upload_public_base` | string | `` | When the chatsendbird_uploads bucket is served publicly, its base URL; uploads then answer a lasting URL. Empty answers a one hour signed URL. |

## Related packages

- Needs: [ChatSendbird](/packages/chatsendbird)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
