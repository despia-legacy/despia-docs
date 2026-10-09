---
title: Home screen widgets
description: Put your app on the home screen and lock screen with widgets you design in DSX.
package: widget
---

Put your app on the home screen and lock screen with widgets you design in DSX.

Each widget is a DSX document that becomes a native iOS WidgetKit widget or an Android Glance widget. Widgets refresh on a schedule, can respond to taps and be configured by the user. Use it to show the next task, a score or a counter at a glance.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when people should see something from your app on the home screen or lock screen without opening it, such as the next task, a score or a counter. Widgets are glanceable; use live activities for something that runs for a few hours.

## What native adds

Each widget is a real WidgetKit widget on iOS and a Glance widget on Android, so it appears in the system widget gallery and updates on the system's schedule, which the web cannot do.

## Install

```sh
despia add Core/Widgets
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

## Actions

### pin

`dsx.module.widget.pin`

Asks the Android launcher to place a widget on the home screen.

**When to use it.** Use it behind an add this widget button. Some launchers do not allow it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `widget` | string | yes | The name of the widget document to place. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the launcher was asked to place the widget. |
| `widget` | string | yes | The name of the widget that was offered. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `pin_unsupported` | This launcher does not accept pinned widgets. |  |
| `unknown_widget` | widget.pin names no widget document of this app. | Not recoverable by retrying. |

**Example: asks the launcher to place a widget**

```js
const result = await dsx.module.widget.pin({"widget":"NextUp"});
// resolves {"ok":true,"widget":"NextUp"}
```

### placed

`dsx.module.widget.placed`

Lists the widgets the person has actually placed on their screens.

**When to use it.** Use it to learn whether a widget is in use before nudging the person to add one.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the list was read. |
| `placed` | array of object | yes | The placed widgets, one entry for each instance on a screen. |

**Example: lists the placed widgets**

```js
const result = await dsx.module.widget.placed({});
// resolves {"ok":true,"placed":[]}
```

### reload

`dsx.module.widget.reload`

Asks the system to rebuild one widget, or every widget of the app, from its document.

**When to use it.** Use it after changes that do not go through update, so the widgets redraw.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `widget` | string | no | The name of the widget to rebuild; leave it out to rebuild all of them. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the rebuild was asked for. |

**Example: reloads one kind**

```js
const result = await dsx.module.widget.reload({"widget":"NextUp"});
// resolves {"ok":true}
```

**Example: reloads every kind**

```js
const result = await dsx.module.widget.reload({});
// resolves {"ok":true}
```

### state

`dsx.module.widget.state`

Reads a widget's current state, including what the widget itself changed while the app was closed.

**When to use it.** Use it to pick up changes made on the home screen, such as a to-do checked off in the widget.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `widget` | string | yes | The name of the widget document to read. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the state was read. |
| `state` | object | yes | The widget's current state values, by name. |
| `widget` | string | yes | The name of the widget that was read. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_widget` | widget.state requires "widget", the widget document's name. | Not recoverable by retrying. |

**Example: reads a widget's state**

```js
const result = await dsx.module.widget.state({"widget":"NextUp"});
// resolves {"ok":true,"state":{},"widget":"NextUp"}
```

### update

`dsx.module.widget.update`

Merges new values into a widget's state and refreshes the widget so it shows them.

**When to use it.** Use it when your app has fresh data for a widget, such as a new task or score.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `state` | object | yes | The values to merge into the widget's state, by name. |
| `widget` | string | yes | The name of the widget document to update. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the state was saved and the widget refresh was asked for. |
| `widget` | string | yes | The name of the widget that was updated. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `container_unavailable` | The App Group is not provisioned for this build; the widget cannot read what the app writes. | Not recoverable by retrying. |
| `invalid_state` | widget.update requires "state", an object of JSON values. | Not recoverable by retrying. |
| `missing_widget` | widget.update requires "widget", the widget document's name. | Not recoverable by retrying. |

**Example: merges state into a widget document and reloads its kind**

```js
const result = await dsx.module.widget.update({"state":{"task":"Ship widgets"},"widget":"NextUp"});
// resolves {"ok":true,"widget":"NextUp"}
```

## Events

Read with `dsx.on(name, handler)`.

### event

Tells your app that a button or toggle inside a widget sent a named event; on iOS it arrives when the app next runs.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `data` | object | yes | The extra values the handler sent along with the event. |
| `name` | string | yes | The event name that the widget handler sent. |
| `widget` | string | yes | The name of the widget the event came from. |

## Related packages

- Used by: [LegacyWidgets](/packages/imagewidget)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
