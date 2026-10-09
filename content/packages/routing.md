---
title: Routing
description: Keeps your app's list of screens and addresses up to date from your server, even over the air.
package: routing
---

Keeps your app's list of screens and addresses up to date from your server, even over the air.

Downloads the route table from your server and saves it on the device, so the app uses the saved copy straight away at launch and then refreshes it. The router reads that table to decide which screen each address opens. You write the routes; this package only fetches and keeps them. Without an over-the-air setting there is no table and every address opens the web page.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

It is always included, so you do not add it. Know that routes update over the air when your app has an over-the-air setting, and that a reload can be forced if you need the latest table.

## Install

```sh
despia add Mandatory/Routing
```

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

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
