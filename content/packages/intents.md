---
title: Intents
description: Open Android system screens and other apps by intent, and check which apps can handle one.
package: intents
---

Open Android system screens and other apps by intent, and check which apps can handle one.

Lets your app launch Android intents, which reach system settings pages that have no web address, hand a file to one specific app, or trigger a phone maker feature. It can also list the apps that could handle an intent and tell you whether any can. It does nothing on iOS or the web.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it on Android when you need a settings page such as your app's own details screen, or want to hand something to a named app. For ordinary web links use the external apps package instead.

## What native adds

Intents are Android's own way to reach settings pages and other apps, and a web page has no way to start them.

## Install

```sh
despia add Core/Intents
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

### canHandle

`dsx.module.intents.canHandle`

Answers yes or no to whether any app can handle an intent, so you can hide a button nothing could act on.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `action` | string | yes | The intent action to ask about. |
| `data` | string | no | The address the intent would work on. |
| `type` | string | no | The kind of content, as a MIME type, that the intent would carry. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canHandle` | boolean | yes | True when at least one app can handle the intent. |
| `visible` | boolean | yes | False when your manifest does not declare this query, so a false answer cannot be trusted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_action` | The action is not a valid intent action. | Use a dotted constant such as android.intent.action.VIEW. |
| `invalid_data` | The data is not an address an intent can carry. | Pass a valid URI such as package:com.example.app. |
| `invalid_type` | The type is not a valid MIME type. | Pass a type such as image/png. |

**Example: a browser is installed**

```js
const result = await dsx.module.intents.canHandle({"action":"android.intent.action.VIEW","data":"https://example.com"});
// resolves {"canHandle":true,"visible":true}
```

**Example: nothing is installed, and the manifest is not at fault**

```js
const result = await dsx.module.intents.canHandle({"action":"com.example.NOBODY_HAS_THIS"});
// resolves {"canHandle":false,"visible":true}
```

### launch

`dsx.module.intents.launch`

Starts an Android activity from an intent, such as a system settings page or a file handoff to a named app. It resolves launched only when an activity really started.

**When to use it.** Use it to open a settings page that has no web address.

**When not to.** Use the external apps package to open a normal web link.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `action` | string | yes | The intent action, as a dotted constant such as android.settings.APPLICATION_DETAILS_SETTINGS. |
| `categories` | array of string | no | Extra intent categories to add. |
| `data` | string | no | The address or content the intent works on, such as package:com.example.app. |
| `extras` | object | no | Extra values to pass along with the intent, as simple values or lists of them. |
| `flags` | array of string | no | Launch flags such as newTask or clearTop. Case and separators are ignored. |
| `package` | string | no | Limit the intent to one app by its package name. |
| `type` | string | no | The MIME type of the data, such as text/plain. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancelled` | boolean | no | True when the person dismissed a chooser without picking an app. |
| `launched` | boolean | yes | True when an activity actually started. |
| `resultCode` | int | no | The result code the launched activity returned, when it returned one. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_action` | The action is not a valid intent action. | Use a dotted constant such as android.intent.action.VIEW. |
| `invalid_data` | The data is not an address an intent can carry. | Pass a valid URI such as package:com.example.app. |
| `invalid_extras` | Intent extras may only be simple values or lists of simple values. | Flatten the extras to text, numbers, booleans or lists of them. |
| `invalid_package` | The package is not a valid Android package name. | Pass a name such as com.example.app. |
| `invalid_type` | The type is not a valid MIME type. | Pass a type such as image/png. |
| `no_handler` | No app on this device can handle that intent. | Hide the button on this device, or offer another way. |
| `not_visible` | Your app's manifest does not declare that it looks for this intent, so Android hides the apps that could handle it. | Add a queries row for this action to your app's Android manifest settings. |
| `unknown_flag` | That intent flag is not one this package supports. | Use one of the supported flags, such as newTask or clearTop. |

**Example: opens the app's own settings page, which has no URL scheme at all**

```js
const result = await dsx.module.intents.launch({"action":"android.settings.APPLICATION_DETAILS_SETTINGS","data":"package:com.example.app","flags":["newTask"]});
// resolves {"launched":true}
```

**Example: hands a file to one named app**

```js
const result = await dsx.module.intents.launch({"action":"android.intent.action.SEND","extras":{"android.intent.extra.SUBJECT":"Hello"},"flags":["grantReadUri"],"package":"com.google.android.gm","type":"image/png"});
// resolves {"launched":true}
```

### query

`dsx.module.intents.query`

Lists the apps that could handle an intent, by package name. The visible flag tells you whether an empty list means no app exists or your manifest hides them.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `action` | string | yes | The intent action to ask about. |
| `data` | string | no | The address the intent would work on. |
| `type` | string | no | The kind of content, as a MIME type, that the intent would carry. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `handlers` | array of string | yes | The package names of the apps that can handle the intent. |
| `visible` | boolean | yes | False when your manifest does not declare this query, so an empty list cannot be trusted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_action` | The action is not a valid intent action. | Use a dotted constant such as android.intent.action.VIEW. |
| `invalid_data` | The data is not an address an intent can carry. | Pass a valid URI such as package:com.example.app. |
| `invalid_type` | The type is not a valid MIME type. | Pass a type such as image/png. |

**Example: lists the browsers that can open a link**

```js
const result = await dsx.module.intents.query({"action":"android.intent.action.VIEW","data":"https://example.com"});
// resolves {"handlers":["com.android.chrome","org.mozilla.firefox"],"visible":true}
```

**Example: an empty list with visible true means the device genuinely has nothing**

```js
const result = await dsx.module.intents.query({"action":"com.example.NOBODY_HAS_THIS"});
// resolves {"handlers":[],"visible":true}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
