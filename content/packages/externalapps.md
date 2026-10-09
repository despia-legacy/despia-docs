---
title: ExternalApps
description: Hand a link to another app on the phone, such as Maps, Instagram or the phone dialer.
package: externalapps
---

Hand a link to another app on the phone, such as Maps, Instagram or the phone dialer.

Opens a link in the app that handles it, and does the same automatically when someone taps a link such as mailto, tel or an Instagram link. If the app is not installed it can take the person to its store page. You choose which link types are handed off in settings.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it to open another app from a button or to make links like phone numbers and email addresses work. For ordinary web pages use a normal link instead.

## What native adds

It uses the phone's own app handoff, which opens the real app rather than a web page.

## Install

```sh
despia add Core/Basics/ExternalApps
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

### open

`dsx.module.externalapps.open`

Hands one link to the phone so the app that handles it opens.

**When to use it.** Use it for a button that opens another app. It reports honestly when no app can handle the link.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `url` | string | yes | The link to open, such as instagram://user?username=despia or tel:+14155550123. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when an app opened the link. |
| `url` | string | yes | The link that was handed over. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_url` | That is not a URL an app can be handed. | Not recoverable by retrying. |
| `blocked` | The browser blocked the new window. Call this from a click. |  |
| `no_handler` | No app on this device opens that kind of link. | Not recoverable by retrying. |
| `no_url` | No link was given, so there is nothing to open. | Pass a url value and call again. |

**Example: hands a mail link to the mail app**

```js
const result = await dsx.module.externalapps.open({"url":"mailto:hello@example.com?subject=Hi"});
// resolves {"opened":true,"url":"mailto:hello@example.com?subject=Hi"}
```

**Example: hands an app scheme to its app**

```js
const result = await dsx.module.externalapps.open({"url":"twitter://user?screen_name=despia"});
// resolves {"opened":true,"url":"twitter://user?screen_name=despia"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `handoff_schemes` | list | `["x","twitter","fb","instagram","youtube","coinbase","uber","lyft","mailto","tel","sms","maps","message","googlegmail","comgooglemaps","lpa"]` | The URL schemes a tapped link may hand to another app through the OS. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
