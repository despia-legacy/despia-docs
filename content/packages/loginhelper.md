---
title: LoginHelper
description: Keeps Google and Facebook sign-in links out of your web view and opens them in the system sign-in sheet.
package: loginhelper
---

Keeps Google and Facebook sign-in links out of your web view and opens them in the system sign-in sheet.

Watches for sign-in links to Google and Facebook in your app's web content, stops them from loading inside the web view, and opens the same address in the system sign-in sheet, which these providers require. It needs no calls from you. It works with the OAuth package; without it iOS leaves the link alone and Android opens a Custom Tab.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Keep it when your web pages offer Google or Facebook sign-in and you want it to just work, because those providers refuse to load inside an embedded web view. It has nothing to call; leave it out only if your app has no social sign-in.

## Install

```sh
despia add Core/Auth/LoginHelper
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

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
