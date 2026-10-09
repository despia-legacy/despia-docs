---
title: Import
description: Use an npm package from your backend code.
package: import
---

Use an npm package from your backend code.

Lets backend code call a real library, such as a payment SDK, without writing an import statement. You pin the npm package in the same manifest and give it a name, and your code reaches every export of it through that name. It applies to the server side only. You write the calls and handle their results.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when your backend logic needs a published npm library such as a payment or email SDK. Skip it if built-in data, queue and secret features cover the job.

## Install

```sh
despia add Core/Server/Modules/Import
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | no |
| web | no |
| macos | no |

## Actions

_This package declares no actions._

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
