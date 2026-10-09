---
title: Despia Calls
description: Carry your app's calls over WebRTC through your own Despia Calls service.
package: calldespia
---

Carry your app's calls over WebRTC through your own Despia Calls service.

Works with the Calls package. One-to-one calls go peer to peer, and group calls go through a media server your service names. Needs the Despia Calls service deployed, plus a token endpoint on your back end.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it as the call engine when you run your own Despia Calls service and want one-to-one calls to go directly between devices. You still use the calls package for the commands.

## Install

```sh
despia add Core/CallDespia
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
| `server` | string | `` | The address of your Despia Calls service (OpenSource/Services/calls), which carries the call's signalling. |
| `tokenUrl` | string | `` | Your own back end's endpoint that answers { token, peer } for the signed in user and a call id: GET <tokenUrl>?callId=<id>. |

## Related packages

- Needs: [Call](/packages/call)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
