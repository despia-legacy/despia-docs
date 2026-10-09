---
title: SystemBars
description: Control the status bar, the navigation bar and fullscreen mode from your screens.
package: systembars
---

Control the status bar, the navigation bar and fullscreen mode from your screens.

Sets the colour, icon style and visibility of the status bar and the navigation bar, and switches fullscreen modes for video or immersive content. Unstated fields keep their value, so each screen changes only what it needs. You write the colours and when each screen applies them.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when a screen needs its own bar colours, hidden bars or a fullscreen video mode. Leave it alone if the default bar look already suits the app.

## What native adds

It drives the real system bars, with icons that stay readable on your colours, which a web page cannot change.

## Install

```sh
despia add Core/SystemBars
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone, tablet.

## Actions

### body

`dsx.module.systembars.body`

Reports the page's top colour and background change so the bar can follow the page. The package calls it for you, not your code.

**When not to.** You do not need to call it from a page.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `color` | string | no | The page's top colour as seen by the page. |
| `duration` | number | no | How long the page's colour transition takes, in milliseconds. |
| `easing` | string | no | The easing curve of the page's colour transition. |
| `style` | string | no | The bar style the page asks for. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `applied` | boolean | yes | True when the bar colour was changed to match. |
| `ok` | boolean | yes | True when the report was accepted. |
| `transparent` | boolean | yes | True when the bar is drawn transparent over the page. |

**Example: follows the page body color**

```js
const result = await dsx.module.systembars.body({"color":"#FFFFFF","duration":300,"easing":"ease-in-out","style":"solid"});
// resolves {"applied":true,"ok":true,"transparent":false}
```

### env

`dsx.module.systembars.env`

Reports whether the page can read the safe-area values on its own. The package calls it for you, not your code.

**When not to.** You do not need to call it from a page.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `native` | boolean | yes | True when the page already receives native safe-area values. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `native` | boolean | yes | True when native safe-area values are in use. |
| `ok` | boolean | yes | True when the report was accepted. |

**Example: records a surface that delivers env() natively**

```js
const result = await dsx.module.systembars.env({"native":true});
// resolves {"native":true,"ok":true}
```

**Example: records a surface where the shim is standing in for the platform**

```js
const result = await dsx.module.systembars.env({"native":false});
// resolves {"native":false,"ok":true}
```

### immersive

`dsx.module.systembars.immersive`

Goes fullscreen or back, the same as setting the immersive field. Use it for video players and other full-screen content.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `mode` | string | yes | none to return to normal, leanback to hide bars until a tap, or sticky to hide them and reveal them briefly on a swipe. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `behavior` | string | yes | How hidden bars come back: default or swipe. |
| `diagnostics` | array of string | yes | Notes about anything that could not be applied on this device. |
| `hidesHomeIndicator` | boolean | yes | True when the iOS home indicator is hidden. |
| `immersive` | string | yes | The fullscreen mode in effect: none, leanback or sticky. |
| `navigation` | object | yes | The navigation bar state after the change. |
| `navigation.background` | object | yes | Whether the background colour was applied and how. |
| `navigation.color` | object | yes | The resolved colour of the navigation bar as red, green, blue and alpha. |
| `navigation.contrast` | boolean | yes | True when the navigation bar keeps a contrast scrim behind its buttons. |
| `navigation.divider` | object | yes | Whether the divider line above the navigation bar was applied. |
| `navigation.follow` | boolean | yes | True when the bar follows the page's own colour. |
| `navigation.hidden` | boolean | yes | True when the navigation bar is hidden. |
| `navigation.iconsDark` | boolean | yes | True when the navigation bar icons are drawn dark. |
| `navigation.style` | string | yes | The icon style in use: light, dark or auto. |
| `status` | object | yes | The status bar state after the change. |
| `status.background` | object | yes | Whether the background colour was applied and how. |
| `status.color` | object | yes | The resolved colour of the status bar as red, green, blue and alpha. |
| `status.follow` | boolean | yes | True when the bar follows the page's own colour. |
| `status.hidden` | boolean | yes | True when the status bar is hidden. |
| `status.iconsDark` | boolean | yes | True when the status bar icons are drawn dark. |
| `status.style` | string | yes | The icon style in use: light, dark or auto. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unknown_mode` | That is not an immersive mode. Use none, leanback or sticky. | Not recoverable by retrying. |

**Example: sticky is the video-player mode**

```js
const result = await dsx.module.systembars.immersive({"mode":"sticky"});
// resolves {"behavior":"default","diagnostics":[],"hidesHomeIndicator":false,"immersive":"sticky","navigation":{"background":{"applied":true,"reason":null,"via":"none"},"color":{"a":0,"b":0,"g":0,"r":0},"contrast":true,"divider":null,"follow":false,"hidden":true,"iconsDark":true,"style":"dark"},"status":{"background":{"applied":true,"reason":null,"via":"none"},"color":{"a":0,"b":0,"g":0,"r":0},"follow":false,"hidden":true,"iconsDark":true,"style":"dark"}}
```

**Example: separators are ignored so lean-back folds too**

```js
const result = await dsx.module.systembars.immersive({"mode":"lean-back"});
// resolves {"behavior":"default","diagnostics":[],"hidesHomeIndicator":false,"immersive":"leanback","navigation":{"background":{"applied":true,"reason":null,"via":"none"},"color":{"a":0,"b":0,"g":0,"r":0},"contrast":true,"divider":null,"follow":false,"hidden":true,"iconsDark":true,"style":"dark"},"status":{"background":{"applied":true,"reason":null,"via":"none"},"color":{"a":0,"b":0,"g":0,"r":0},"follow":false,"hidden":true,"iconsDark":true,"style":"dark"}}
```

### set

`dsx.module.systembars.set`

Changes the status bar, the navigation bar or the fullscreen mode. Anything you leave out keeps its current value.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `behavior` | string | no | How hidden bars come back: default, or swipe to show them briefly on a swipe. |
| `immersive` | string | no | A fullscreen mode: none, leanback or sticky. |
| `navigation` | object | no | Settings for the navigation bar at the bottom. |
| `navigation.background` | string | no | The bar colour as #RRGGBB, #RRGGBBAA, an R,G,B triple, transparent or page. |
| `navigation.contrast` | boolean | no | Set true to keep a contrast scrim behind the navigation buttons. |
| `navigation.divider` | string | no | The colour of the line above the navigation bar, or null for none. |
| `navigation.hidden` | boolean | no | Set true to hide the navigation bar. |
| `navigation.style` | string | no | Icon style: light, dark or auto. |
| `status` | object | no | Settings for the status bar at the top. |
| `status.background` | string | no | The bar colour as #RRGGBB, #RRGGBBAA, an R,G,B triple, transparent or page. |
| `status.hidden` | boolean | no | Set true to hide the status bar. |
| `status.style` | string | no | Icon style: light icons for dark content, dark icons for light content, or auto to choose from the colour. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `behavior` | string | yes | How hidden bars come back: default or swipe. |
| `diagnostics` | array of string | yes | Notes about anything that could not be applied on this device. |
| `hidesHomeIndicator` | boolean | yes | True when the iOS home indicator is hidden. |
| `immersive` | string | yes | The fullscreen mode in effect: none, leanback or sticky. |
| `navigation` | object | yes | The navigation bar state after the change. |
| `navigation.background` | object | yes | Whether the background colour was applied and how. |
| `navigation.color` | object | yes | The resolved colour of the navigation bar as red, green, blue and alpha. |
| `navigation.contrast` | boolean | yes | True when the navigation bar keeps a contrast scrim behind its buttons. |
| `navigation.divider` | object | yes | Whether the divider line above the navigation bar was applied. |
| `navigation.follow` | boolean | yes | True when the bar follows the page's own colour. |
| `navigation.hidden` | boolean | yes | True when the navigation bar is hidden. |
| `navigation.iconsDark` | boolean | yes | True when the navigation bar icons are drawn dark. |
| `navigation.style` | string | yes | The icon style in use: light, dark or auto. |
| `status` | object | yes | The status bar state after the change. |
| `status.background` | object | yes | Whether the background colour was applied and how. |
| `status.color` | object | yes | The resolved colour of the status bar as red, green, blue and alpha. |
| `status.follow` | boolean | yes | True when the bar follows the page's own colour. |
| `status.hidden` | boolean | yes | True when the status bar is hidden. |
| `status.iconsDark` | boolean | yes | True when the status bar icons are drawn dark. |
| `status.style` | string | yes | The icon style in use: light, dark or auto. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_color` | That is not a colour. Use #RRGGBB, #RRGGBBAA, an R,G,B triple, transparent or page. | Not recoverable by retrying. |
| `unknown_behavior` | That is not a system-bar behavior. Use default or swipe. | Not recoverable by retrying. |
| `unknown_mode` | That is not an immersive mode. Use none, leanback or sticky. | Not recoverable by retrying. |
| `unknown_style` | That is not a system-bar style. Use light, dark or auto. | Not recoverable by retrying. |

**Example: a dark status background paints through the backdrop and gets light icons**

```js
const result = await dsx.module.systembars.set({"status":{"background":"#1A1A2E"}});
// resolves {"behavior":"default","diagnostics":[],"hidesHomeIndicator":false,"immersive":"none","navigation":{"background":{"applied":true,"reason":null,"via":"none"},"color":{"a":0,"b":0,"g":0,"r":0},"contrast":true,"divider":null,"follow":false,"hidden":false,"iconsDark":true,"style":"dark"},"status":{"background":{"applied":true,"reason":null,"via":"backdrop"},"color":{"a":255,"b":46,"g":26,"r":26},"follow":false,"hidden":false,"iconsDark":false,"style":"light"}}
```

**Example: a navigation colour paints the backdrop under the transparent gesture bar**

```js
const result = await dsx.module.systembars.set({"navigation":{"background":"#1E90FF"}});
// resolves {"behavior":"default","diagnostics":[],"hidesHomeIndicator":false,"immersive":"none","navigation":{"background":{"applied":true,"reason":null,"via":"backdrop"},"color":{"a":255,"b":255,"g":144,"r":30},"contrast":true,"divider":null,"follow":false,"hidden":false,"iconsDark":false,"style":"light"},"status":{"background":{"applied":true,"reason":null,"via":"none"},"color":{"a":0,"b":0,"g":0,"r":0},"follow":false,"hidden":false,"iconsDark":true,"style":"dark"}}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `bottombar` | boolean | `false` | Show the home-bar safe-area filler (home-indicator devices, no home button). |
| `bottombar_background_color` | color | `#FFFFFF` | Bottom bar background color in light mode (#RRGGBB or #RRGGBBAA). |
| `dark_mode_bottombar_background_color` | color | `#FFFFFF` | Bottom bar background color in dark mode (#RRGGBB or #RRGGBBAA). |
| `dark_mode_status_bar_background_color` | color | `#41464D` | Status bar background color in dark mode (#RRGGBB or #RRGGBBAA). |
| `smart_status_bar` | boolean | `true` | Auto-tint the status bar to the web page's color and animate it 1:1 with the body. |
| `status_bar_background_color` | color | `#FFFFFF` | Status bar background color in light mode (#RRGGBB or #RRGGBBAA). |
| `status_bar_fullscreen` | string | `auto` | How the bar behaves for edge-to-edge web apps: auto, shown, or hidden. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
