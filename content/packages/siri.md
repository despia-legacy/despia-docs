---
title: LegacySiri
description: Let people add a spoken Siri phrase that opens your app and tells it what to do.
package: siri
---

Let people add a spoken Siri phrase that opens your app and tells it what to do.

Shows the system Add to Siri sheet for a phrase you choose. When the person later says the phrase, the app opens and receives a trigger event with the phrase and any data you attached. This keeps the older add to Siri behavior working for apps that already use it. It works on iOS only.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to keep an existing phrase-based Siri shortcut working. For new apps, declare assistant tools instead, which Siri and other assistants can discover without the person recording a phrase.

## Install

```sh
despia add Core/Legacy/Modules/Siri
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | no |
| web | no |
| macos | no |

## Actions

### add

`dsx.module.siri.add`

Shows the system Add to Siri sheet for a phrase. It returns as soon as the sheet is on screen, and whether the person records the phrase is up to them.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `command` | string | yes | The phrase the person will say to Siri. Keep it short and distinctive. |
| `payload` | object | no | Data handed back with the trigger event when Siri runs the phrase. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `phrase` | string | yes | The phrase that was offered. |
| `status` | string | yes | Always presented, meaning the sheet is on screen. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_args` | A Siri shortcut needs a `command` phrase to speak. | Not recoverable by retrying. |
| `no_presenter` | There is no screen on top to present the Add to Siri sheet from. |  |

**Example: presents the Add to Siri sheet for a phrase**

```js
const result = await dsx.module.siri.add({"command":"Order Coffee"});
// resolves {"phrase":"Order Coffee","status":"presented"}
```

**Example: a native app attaches a payload, and it rides the broadcast**

```js
const result = await dsx.module.siri.add({"command":"Start Workout","payload":{"kind":"run"}});
// resolves {"phrase":"Start Workout","status":"presented"}
```

## Events

Read with `dsx.on(name, handler)`.

### trigger

Fires when Siri runs a shortcut that your app added, even if the app was closed. It carries the spoken phrase and the data you attached.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `command` | string | yes | The phrase the person said to Siri. |
| `payload` | object | no | The data you attached when you added the shortcut, if any. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
