---
title: Encrypted chat
description: Make chat messages end-to-end encrypted so only the people in the conversation can read them.
package: chatmls
---

Make chat messages end-to-end encrypted so only the people in the conversation can read them.

Works with the Chat package. Encrypts each message on the sender's device and decrypts it on the others using the MLS standard, so the server never sees the text. Use it for private conversations. Needs the Chat package.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Include it when messages must be end-to-end encrypted so even your server cannot read them. If the encryption library is not built in, encrypted sends are refused rather than sent as plain text.

## Install

```sh
despia add Core/ChatMLS
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

## Related packages

- Needs: [Chat](/packages/chat)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
