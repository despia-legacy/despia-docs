---
title: LiveKit Calls
description: Run your app's calls and group rooms on LiveKit.
package: calllivekit
---

Run your app's calls and group rooms on LiveKit.

Works with the Calls package. Joins LiveKit rooms, shares microphone and camera and shows everyone's video. Needs a LiveKit server and an endpoint on your back end that issues join tokens.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it when you want your calls and group rooms to run on LiveKit. It needs the call package, a LiveKit server and a way to get a join token for each person.

## Install

```sh
despia add Core/CallLiveKit
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

### session

`dsx.module.calllivekit.session`

Gives the LiveKit provider the join token and server address for the next call, and reports whether it is ready.

**When to use it.** Call it with a token from your server just before you start or answer a call.

**When not to.** Never create tokens on the device; get them from your server.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `token` | string | yes | The join token for this person and room, made by your server. |
| `url` | string | no | The LiveKit server address, starting with wss://. When left out, the address from the package settings is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ready` | boolean | yes | True when the provider holds a token and server address and can join. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | There is no join token or no LiveKit server address. | Pass a token and a server address, or set the token endpoint and server address in the package settings. |

**Example: Hand LiveKit the token for the next call**

```js
const result = await dsx.module.calllivekit.session({"token":"join-token-made-by-your-server","url":"wss://calls.example.com"});
// resolves {"ready":true}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `tokenUrl` | string | `` | Optional: your own back end's endpoint that answers { token, url? } for the signed in user: GET <tokenUrl>?room=<room>. Unused when the app hands a token in through session. |
| `url` | string | `` | The websocket url of your LiveKit server or LiveKit Cloud project (wss://<project>.livekit.cloud). Takes {{ }}. |

## Related packages

- Needs: [Call](/packages/call)
- Used by: [Backend](/packages/calllivekit-modules-backend)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
