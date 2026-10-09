---
title: Platform
description: Despia's own hosted platform backend, written in DSX, kept as a working example of a full server.
package: platform
---

Despia's own hosted platform backend, written in DSX, kept as a working example of a full server.

A server written entirely in DSX that runs Despia's hosted platform: its data, routes, workers and actions are declared and compiled like any other package. It runs on Cloudflare Workers with a Postgres database and a build runner, without naming any of them in the code. It is for reading and learning from, not something you add to an app.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Read it as an example of a full DSX backend. Do not add it to your own app, because it is the backend that runs Despia's hosted platform.

## Install

```sh
despia add Custom/Platform
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | no |
| web | no |
| macos | yes |

Device classes: phone, desktop.

## Actions

_This package declares no actions._

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
