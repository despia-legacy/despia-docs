---
title: Keyboard
description: Ship your own system-wide iOS keyboard, drawn from your own layout.
package: keyboard
---

Ship your own system-wide iOS keyboard, drawn from your own layout.

Adds a custom keyboard that people can turn on in iOS Settings and use in every app. It ships with a full QWERTY keyboard and you can replace its layout from your app at runtime. The keys are written in the same layout language as the rest of your app, and the keyboard can send key events back to your page.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when you want your own keyboard, for example for emoji, stickers, templates or a branded typing experience. Skip it if you only need the normal keyboard in your own text fields.

## What native adds

It is a real iOS keyboard extension that works in every app on the device, which a web page cannot be.

## Install

```sh
despia add Core/Extensions/Keyboard
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

## Actions

### clear

`dsx.module.keyboard.clear`

Removes your custom layout so the keyboard goes back to the bundled one.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the custom layout was removed. |

**Example: drops the pushed layout and vars back to the bundled floor**

```js
const result = await dsx.module.keyboard.clear({});
// resolves {"ok":true}
```

### layout

`dsx.module.keyboard.layout`

Replaces the keyboard's layout, which takes effect the next time the keyboard appears. Values passed here replace the previous ones.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `layout` | string | yes | The keyboard markup, with at least one button as a key. |
| `vars` | object | no | Values the layout can read. They replace the earlier values. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the layout was saved for the keyboard. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_layout` | The layout could not be parsed. | Fix the layout markup and try again. |
| `missing_layout` | A layout is needed and none was supplied. | Pass a non-empty layout string. |
| `no_keys` | A keyboard layout needs at least one button key, and this one has none. | Add at least one button to the layout. The keyboard keeps its current layout meanwhile. |

**Example: pushes a DSX keyboard layout to the shared container**

```js
const result = await dsx.module.keyboard.layout({"layout":"<vstack><hstack height=\"40\"><button insert=\"a\">a</button></hstack></vstack>"});
// resolves {"ok":true}
```

### openSettings

`dsx.module.keyboard.openSettings`

Opens the iOS Settings screen where the person can turn the keyboard on, since apps cannot enable a keyboard themselves.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when Settings was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `cannot_open` | The system Settings screen could not be opened. | Ask the person to open Settings, then General, then Keyboard themselves. |

**Example: opens this app's Settings page (where Keyboards is enabled)**

```js
const result = await dsx.module.keyboard.openSettings({});
// resolves {"ok":true}
```

### status

`dsx.module.keyboard.status`

Tells you whether the person has used the keyboard and whether they gave it full access, so you can guide them through setup.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `fullAccess` | boolean | yes | True when the person turned on Allow Full Access. |
| `lastSeen` | number | yes | When the keyboard was last seen, as a timestamp. |
| `used` | boolean | yes | True when the keyboard has appeared at least once. |

**Example: reports whether the keyboard has run with the shared container reachable**

```js
const result = await dsx.module.keyboard.status({});
// resolves {"fullAccess":false,"lastSeen":0,"used":false}
```

### update

`dsx.module.keyboard.update`

Merges new values into the current keyboard layout without replacing it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `vars` | object | no | The values to add or change. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the values were saved for the keyboard. |

**Example: merges vars for the keyboard's interpolation scope**

```js
const result = await dsx.module.keyboard.update({"vars":{"suggestion":"hello"}});
// resolves {"ok":true}
```

## Events

Read with `dsx.on(name, handler)`.

### keyboard

Delivers a key event from the keyboard to your page when the app comes to the foreground, for keys in your layout that emit an event.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `event` | string | yes | The name of the event your layout key emits. |
| `payload` | object | yes | The data your layout key attached to the event. |

### keyboard.alternates

Fires on Android when a key that has alternate characters is long pressed.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `path` | string | yes | The path of the key that was long pressed. |

### keyboard.key

Fires on Android when a key in the rendered layout is tapped.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The key's path in the layout. |

### keyboard.repeat

Fires on Android when a long press starts on a repeating key such as backspace.

_None._

### keyboard.repeatEnd

Fires on Android when the long press on a repeating key ends.

_None._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `primary_language` | string | `en-US` | The BCP-47 language tag the keyboard declares to iOS (shown in Settings and used for input-mode grouping). |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `cannot_open` | The system Settings screen could not be opened. | Ask the person to open Settings, then General, then Keyboard themselves. |
| `invalid_layout` | The layout could not be parsed. | Fix the layout markup and try again. |
| `missing_layout` | A layout is needed and none was supplied. | Pass a non-empty layout string. |
| `no_keys` | A keyboard layout needs at least one button key, and this one has none. | Add at least one button to the layout. The keyboard keeps its current layout meanwhile. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
