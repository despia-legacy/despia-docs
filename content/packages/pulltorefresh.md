---
title: PullToRefresh
description: Let people pull down on a web page in your app to reload it.
package: pulltorefresh
---

Let people pull down on a web page in your app to reload it.

Adds the familiar pull-down-to-refresh control to the web page your app shows, with a spinner whose colours you can set for light and dark. It reloads the page, and you can also start a refresh from code. Screens built with DSX use the native refreshable element instead.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when your app shows a web page and people expect to pull down to refresh it. For native DSX screens use the refreshable element instead.

## What native adds

It uses the native overscroll gesture and spinner, so it feels like the rest of the phone.

## Install

```sh
despia add Mandatory/PullToRefresh
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

### refresh

`dsx.module.pulltorefresh.refresh`

Starts a refresh from code, as if the person had pulled down. It shows the spinner, reloads the page and finishes when the reloaded page is ready or after 10 seconds.

**When to use it.** Use it for a Refresh button. A refresh already running is joined, not restarted.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `refreshed` | boolean | yes | True when the page finished reloading. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | There is no web surface to refresh. | Not recoverable by retrying. |

**Example: reloads the page and resolves when it commits**

```js
const result = await dsx.module.pulltorefresh.refresh({});
// resolves {"refreshed":true}
```

### set

`dsx.module.pulltorefresh.set`

Turns the pull-to-refresh control on or off and sets its spinner and background colours. Anything you leave out stays as it was.

**When to use it.** Most apps never call it, because the control attaches itself when it is enabled in settings.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `background` | string | no | The background colour behind the spinner as #RRGGBB, applied to both light and dark mode. |
| `enabled` | boolean | no | True to attach the control to the page, false to remove it. |
| `tint` | string | no | The spinner colour as #RRGGBB, applied to both light and dark mode. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `enabled` | boolean | yes | Whether the control is attached now. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | There is no web surface to attach pull-to-refresh to. | Not recoverable by retrying. |

**Example: attaches the refresh control**

```js
const result = await dsx.module.pulltorefresh.set({"enabled":true});
// resolves {"enabled":true}
```

**Example: removes the refresh control**

```js
const result = await dsx.module.pulltorefresh.set({"enabled":false});
// resolves {"enabled":false}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `background_color_dark` | color | `#FFFFFF` | Pull-to-refresh background in dark mode. |
| `background_color_light` | color | `#FFFFFF` | Pull-to-refresh background in light mode. |
| `enabled` | boolean | `false` | Turns pull-to-refresh on for the pages your app shows, so people can pull down to reload. |
| `loading_color_dark` | color | `#808080` | Spinner color in dark mode. |
| `loading_color_light` | color | `#808080` | Spinner color in light mode. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
