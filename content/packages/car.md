---
title: Car
description: Show lists, grids and messages on the car's screen with CarPlay and Android Auto.
package: car
---

Show lists, grids and messages on the car's screen with CarPlay and Android Auto.

Takes a short car layout from your app and shows it on the vehicle's own dashboard using the templates that CarPlay and Android Auto allow: lists, grids, panes, messages and tab bars. Taps on rows come back to your app as events. Apple must grant the CarPlay entitlement for your app category before it works on a real car. You write the layout and handle the taps.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when your app fits a car app category such as audio, messaging or navigation and you want a simple list-based screen in the car. It cannot show custom drawings or web pages, because cars only allow their fixed templates.

## What native adds

The car system itself draws the templates, so they follow the vehicle's design and driving safety rules, which an app cannot bypass.

## Install

```sh
despia add Core/Extensions/Car
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

`dsx.module.car.clear`

Removes your layout from the car screen.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the screen was cleared. |

**Example: drops the pushed document and vars back to the bundled floor**

```js
const result = await dsx.module.car.clear({});
// resolves {"ok":true}
```

### show

`dsx.module.car.show`

Shows a car layout on the connected car screen, or keeps it ready for the next time a car connects.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `document` | string | yes | The car layout as text, a list, grid, pane, message or tab bar, optionally inside a car element. Rows carry a title, detail, image and an action name. |
| `vars` | object | no | Values the layout can use. They replace the values of the previous layout, so send them again with every show. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the layout was accepted. |

**Example: pushes a car document to the shared store**

```js
const result = await dsx.module.car.show({"document":"<car><list title=\"Stations\"><row title=\"Jazz FM\" action=\"station.jazzfm\"/></list></car>"});
// resolves {"ok":true}
```

### status

`dsx.module.car.status`

Tells you whether a car screen has ever connected to the app and whether one is connected right now.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `connected` | boolean | yes | True while a car screen is connected, as far as the app can tell. |
| `lastSeen` | number | yes | When a car screen last connected, as a time stamp. |
| `used` | boolean | yes | True once a car screen has connected at least one time. |

**Example: reports whether a car screen has connected**

```js
const result = await dsx.module.car.status({});
// resolves {"connected":false,"lastSeen":0,"used":false}
```

## Events

Read with `dsx.on(name, handler)`.

### car

Fires when something happens on the car screen, such as a connect, a disconnect or a tap on a row.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `event` | string | yes | What happened: connected, disconnected, tap, or an event your layout sends. |
| `payload` | object | yes | Details of the event; a tap carries the action name of the row that was tapped. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `android_category` | string | `androidx.car.app.category.IOT` | The androidx.car.app category DespiaCarAppService declares (Android Auto validates the app's behavior against this at review). Pick the category matching what this app actually does in the car; IOT is the generic placeholder for anything that isn't navigation/parking/charging/etc. |
| `entry` | string | `` | The project component whose root is <car> that the car shows when the phone app has not pushed one with car.show. Android Automotive OS always needs it: the car is the device and the app's screens never run there. Empty keeps the bundled empty list. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_document` | The car layout could not be understood. | Check that it is a list, grid, pane, message, tab bar or a car element wrapping one of them. |
| `missing_document` | The show call was made without any document text. | Pass the car layout in document. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
