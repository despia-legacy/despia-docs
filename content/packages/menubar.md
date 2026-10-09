---
title: MenuBar
description: A native bottom menu bar and a slide-over sidebar that your web page controls.
package: menubar
---

A native bottom menu bar and a slide-over sidebar that your web page controls.

Shows a bottom bar of icons and labels, and a sidebar that slides over the screen, using the system look including Liquid Glass on iOS 26. Your page gives the items and gets an event when one is tapped, and it decides what the tap means. The bar also tells your page how much room it takes so you can leave space.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when a web-based app needs a real native menu at the bottom or a slide-in side menu. If you build your screens in DSX, use the tab bar or navigation components instead.

## What native adds

A native bar keeps its place while pages change, follows the system look and safe areas, and responds instantly, which an HTML bar cannot match.

## Install

```sh
despia add Mandatory/MenuBar
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

### close

`dsx.module.menubar.close`

Slides the sidebar away from the screen.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `open` | boolean | yes | Whether the sidebar is still showing, which is false after this call. |

**Example: dismisses the sidebar**

```js
const result = await dsx.module.menubar.close({});
// resolves {"open":false}
```

### hide

`dsx.module.menubar.hide`

Removes the bottom menu bar from the screen.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `shown` | boolean | yes | Whether the bar is still showing, which is false after this call. |

**Example: removes the menu bar**

```js
const result = await dsx.module.menubar.hide({});
// resolves {"shown":false}
```

### open

`dsx.module.menubar.open`

Slides the sidebar onto the screen.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `open` | boolean | yes | True while the sidebar is showing. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_items` | No sidebar items were set, so there is nothing to show. | Call sidebar with items before calling open. |
| `unavailable` | The menu bar could not be shown on this screen. | Try again after the screen has finished loading. |

**Example: presents the sidebar**

```js
const result = await dsx.module.menubar.open({});
// resolves {"open":true}
```

### show

`dsx.module.menubar.show`

Shows the bottom menu bar with your items, or replaces the one already showing. An empty list hides it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dark` | boolean | no | Set to true for the dark look of the bar. |
| `items` | array of object | yes | The menu entries to show, each with an id, a name and an icon. Anything else you add is handed back when the item is tapped. |
| `selected` | number | no | The position of the item to show as selected, counting from zero. |
| `tint` | string | no | The colour used for the selected item. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | int | no | How many items the bar shows. |
| `shown` | boolean | yes | True while the bar is showing. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | The menu bar could not be shown on this screen. | Try again after the screen has finished loading. |

**Example: renders the menu bar and publishes metrics**

```js
const result = await dsx.module.menubar.show({"dark":true,"items":[{"icon":"house","id":"home","name":"Home"},{"icon":"cart","id":"cart","name":"Cart"}],"tint":"#FFD700"});
// resolves {"count":2,"shown":true}
```

**Example: seeds the presented bar from the demo payload (3 items, system appearance when dark omitted, selected coerced)**

```js
const result = await dsx.module.menubar.show({"items":[{"icon":"house","id":"home","name":"Home"},{"icon":"magnifyingglass","id":"search","name":"Search"},{"icon":"cart","id":"cart","name":"Cart"}],"selected":1});
// resolves {"count":3,"shown":true}
```

### sidebar

`dsx.module.menubar.sidebar`

Sets the items of the slide-over sidebar without showing it. Call open to show it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `items` | array of object | yes | The menu entries to show, each with an id, a name and an icon. Anything else you add is handed back when the item is tapped. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the sidebar items were saved. |

**Example: stores the sidebar payload**

```js
const result = await dsx.module.menubar.sidebar({"items":[{"icon":"house","id":"home","name":"Home"}]});
// resolves {"ok":true}
```

## Events

Read with `dsx.on(name, handler)`.

### dismiss

The user closed the sidebar without choosing anything.

_None._

### metrics

The bar changed size or visibility, for example after show, hide or a rotation. Use it to leave room at the bottom of your page.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bar` | number | yes | The height of the bar itself. |
| `glass` | boolean | yes | True if the Liquid Glass material is in use. |
| `height` | number | yes | The bar height plus the bottom safe area, or 0 when hidden. |
| `safeArea` | object | yes | The safe area insets of the screen. |
| `safeArea.bottom` | number | yes | The inset in pixels reserved at the bottom of the screen, such as for the home indicator. |
| `safeArea.left` | number | yes | The inset in pixels reserved on the left edge of the screen. |
| `safeArea.right` | number | yes | The inset in pixels reserved on the right edge of the screen. |
| `safeArea.top` | number | yes | The inset in pixels reserved at the top of the screen, such as for the notch. |
| `shown` | boolean | yes | True if the bar is showing. |

### select

An item was tapped. You get back the item exactly as you gave it, plus its position and where it was tapped.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `icon` | string | no | The icon of the tapped item. |
| `id` | string | no | The id of the tapped item. |
| `index` | int | no | The position of the tapped item, counting from zero. |
| `name` | string | no | The label of the tapped item. |
| `source` | string | yes | Which one was tapped: menubar or sidebar. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
