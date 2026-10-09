---
title: Despia Chat
description: Run your app's chat on your own self-hosted Despia Chat service.
package: chatdespia
---

Run your app's chat on your own self-hosted Despia Chat service.

Works with the Chat package. Delivers messages live and uploads attachments directly to storage. Needs the Despia Chat service deployed and a token endpoint on your back end.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it with the Chat package when you want to run messaging on your own Despia Chat service instead of a hosted chat vendor. You need to deploy that service and provide a token endpoint on your back end. If you do not want to host anything, choose a hosted chat package.

## What native adds

Messages arrive live and attachments upload directly to storage from the device, with your own back end deciding who the person is.

## Install

```sh
despia add Core/ChatDespia
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
| `server` | string | `` | The address of your Despia Chat service (OpenSource/Services/chat). |
| `tokenUrl` | string | `` | Your own back end's endpoint that answers { token, user } for the signed in user: GET <tokenUrl>. |

## Related packages

- Needs: [Chat](/packages/chat), [Files](/packages/files)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
