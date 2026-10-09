---
title: WebView
description: Show any web page inside your app.
package: webview
---

Show any web page inside your app.

Adds a web view element that embeds a page from a link, with events for start, finish, failure and messages from the page. The page gets no access to native features; it can only send text or JSON back to your app through window.app.send. It is free and open. You decide what to do with each message.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to embed an ordinary web page, such as a checkout, a help page or a map, inside a native UI app screen. It is not the web app shell for hybrid apps, which makes a whole web app native.

## Install

```sh
despia add Core/WebView
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
