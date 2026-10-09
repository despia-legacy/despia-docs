---
title: Sendbird Chat
description: Run your app's chat on Sendbird.
package: chatsendbird
---

Run your app's chat on Sendbird.

Works with the Chat package. Carries messages, receipts, typing and attachments through your Sendbird application. Use it if your app already runs on Sendbird. Needs a Sendbird account and a small relay on your server that holds your Sendbird token.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when your app already runs its chat on Sendbird and you want the Chat package to use it. If you have no Sendbird account, pick another chat provider instead.

## Install

```sh
despia add Core/ChatSendbird
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
| `relayUrl` | string | `` | Your relay's base URL. It forwards /v3/... to https://api-<APP_ID>.sendbird.com/v3/... with your Api-Token, pins user_id to the signed-in user, and keeps uploads at /upload. |
| `sessionUrl` | string | `` | Your back end's URL that answers { user, token } for the signed-in user: the Sendbird user id and a bearer your relay accepts. |

## Related packages

- Needs: [Chat](/packages/chat), [Files](/packages/files)
- Used by: [Backend](/packages/chatsendbird-modules-backend)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
