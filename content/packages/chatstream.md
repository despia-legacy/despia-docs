---
title: Stream Chat
description: Run your app's chat on Stream.
package: chatstream
---

Run your app's chat on Stream.

Works with the Chat package. Carries messages live through your Stream app on the web, iOS and Android. Needs a Stream account, your API key and a token endpoint on your server.

![A conversation drawn by the Chat package's bubbles, carried by Stream](media/chat.png)

## What moves live

Stream's SDK keeps a connection open, so new messages, reactions, read and delivery state and the other person's typing arrive as Stream sends them. A reaction, an edit and a delete are Stream's own, and a reply is a Stream thread reply that also shows in the channel.

## Set it up

1. Create an app in the [Stream dashboard](https://getstream.io/chat/) and copy its API key and secret.
2. Add **Stream Chat** to your app. Its server half answers `POST /stream/token` for the signed-in user, so the secret never reaches the device.
3. Set `STREAM_API_KEY` and `STREAM_SECRET_KEY` as secrets of your server.
4. Open a conversation from the Chat package's screen. A conversation id is Stream's channel id, such as `messaging:general`.

## What it adds

| Target | Library | Version |
| --- | --- | --- |
| Web | stream-chat | 9.53.0 |
| iOS | StreamChat (Swift Package Manager) | 5.12.0 |
| Android | stream-chat-android-client | 7.12.0 |

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when you want the Chat package to run on your own Stream Chat account, with live messages, reactions and typing. Skip it if you use the default chat provider or another vendor.

## Install

```sh
despia add Core/ChatStream
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, desktop.

## Actions

_This package declares no actions._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `apiKey` | string | `` | Only when your token route answers no apiKey: your Stream app's public API key. The secret stays on your server. |
| `channelType` | string | `messaging` | The Stream channel type a bare conversation id belongs to. |
| `tokenUrl` | string | `/stream/token` | The route answering { token, user, apiKey } for the signed in user (POST): by default the package's own server half, /stream/token. A native app names its absolute URL. |

## Related packages

- Needs: [Chat](/packages/chat), [Files](/packages/files)
- Used by: [Backend](/packages/chatstream-modules-backend)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
