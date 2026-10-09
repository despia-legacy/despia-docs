---
title: Viewport
description: Keep chat boxes and footers visible when the on-screen keyboard opens.
package: viewport
---

Keep chat boxes and footers visible when the on-screen keyboard opens.

Fixes the common problem where the keyboard covers whatever sits at the bottom of the page. You choose in the settings whether the page shrinks to fit above the keyboard or stays full height while you are told the keyboard height, and the page can switch at runtime. You build any keyboard-aware layout yourself.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for screens with a text field near the bottom, such as a chat composer or a sticky button, so the keyboard does not cover them. Existing apps keep their old behavior until you change the setting.

## What native adds

The package works with the real keyboard events of iOS and Android, which a web page alone cannot see reliably.

## Install

```sh
despia add Core/Basics/Viewport
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

### keyboard

`dsx.module.viewport.keyboard`

Reports how the on-screen keyboard is affecting the page right now: which mode is in force, how tall the keyboard is and whether it is visible.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `degraded` | boolean | yes | True when the mode you asked for is not available on this device, so a simpler one is used. |
| `insetHeight` | number | yes | The height of the keyboard that covers the page, in points, or 0 when it is closed. |
| `mode` | string | yes | The keyboard mode currently in force: legacy, resize or overlay. |
| `overlaysContent` | boolean | yes | True when the keyboard overlays the page, false when the page shrinks to make room. |
| `visible` | boolean | yes | True when the keyboard is on screen. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_available` | The viewport state is not ready yet. |  |

**Example: reports the resolved mode and a dismissed keyboard at rest**

```js
const result = await dsx.module.viewport.keyboard({});
// resolves {"degraded":false,"insetHeight":0,"mode":"legacy","overlaysContent":true,"visible":false}
```

### overlays

`dsx.module.viewport.overlays`

Chooses at runtime whether the keyboard overlays the page or the page shrinks to fit above it. It is the same as setting navigator.virtualKeyboard.overlaysContent.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `enabled` | boolean | yes | True to overlay the page and publish the keyboard height, false to shrink the page above the keyboard. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `degraded` | boolean | yes | True when the request could not be fully honored on this device. |
| `mode` | string | yes | The keyboard mode now in force. |
| `overlaysContent` | boolean | yes | True when the keyboard now overlays the page. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_value` | overlays expects a boolean `enabled`. | Not recoverable by retrying. |

**Example: a page asking for the shortened viewport gets it, whatever the build declared**

```js
const result = await dsx.module.viewport.overlays({"enabled":false});
// resolves {"degraded":false,"mode":"resize","overlaysContent":false}
```

**Example: a page asking to keep the overlay gets it**

```js
const result = await dsx.module.viewport.overlays({"enabled":true});
// resolves {"degraded":false,"mode":"overlay","overlaysContent":true}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `disable_main_frame_scroll` | boolean | `false` | Stop the page itself from scrolling, for fixed-frame apps that scroll only inside their own panes. |
| `keyboard_mode` | string | `legacy` | How the soft keyboard affects the page's layout viewport. "legacy" keeps today's behavior (the keyboard overlays the page); "resize" shrinks the viewport so nothing sits under the keyboard; "overlay" keeps the overlay but tells the page how tall the keyboard is. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
