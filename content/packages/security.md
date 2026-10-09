---
title: Security
description: Switch on app security policies such as blocking jailbroken devices and screenshots.
package: security
---

Switch on app security policies such as blocking jailbroken devices and screenshots.

Holds the security settings for your app: refuse to run on jailbroken devices, reject invalid TLS certificates and block screenshots and screen recording. It has no actions to call, you choose each policy in settings. Each one is off until you turn it on.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for banking, health or other sensitive apps that must protect their screens and connections. Leave policies off for ordinary apps, since blocking screenshots or rooted devices can frustrate honest users.

## What native adds

These checks run in the native app, below the web page, so a page script cannot switch them off.

## Install

```sh
despia add Mandatory/Security
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | yes |

Device classes: phone, desktop.

## Actions

_This package declares no actions._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `block_faulty_certs` | boolean | `false` | Reject connections with invalid TLS certificates. |
| `jailbreak_block` | boolean | `false` | Refuse to run on jailbroken devices. |
| `prevent_screen_capture` | boolean | `false` | Block screenshots and screen recording. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
