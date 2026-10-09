---
title: WatchFace
description: Show a short text and value on the watch face complication.
package: face
---

Show a short text and value on the watch face complication.

Pushes one glanceable pair, such as Orders and 12, to the watchOS complication and the Wear OS tile through the Watch package. The last pair stays on the face while the watch is offline. You also need the generated watch face extension on Apple Watch.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to show one small live number or label on the watch face, such as unread orders. For richer glanceable screens, define widgets for the watch instead.

## Install

```sh
despia add Core/Extensions/Watch/Modules/Face
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

`dsx.module.face.clear`

Removes the pushed text and value so the face shows its placeholder again.

**When to use it.** Call it when there is nothing to show; clearing an already empty face is harmless.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the face was cleared. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unreachable` | The watch is not reachable right now. The last pushed pair keeps rendering on the face. |  |
| `watch_unavailable` | The watch surface is not in this build. | Not recoverable by retrying. |

**Example: clears the pushed pair back to the placeholder**

```js
const result = await dsx.module.face.clear({});
// resolves {"ok":true}
```

### set

`dsx.module.face.set`

Shows a short text and an optional value on the watch face.

**When to use it.** Call it whenever the number or label you want on the wrist changes.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `text` | string | yes | The label to show; it must not be empty. |
| `value` | string | no | An optional value shown with the label, such as a count. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the pair was sent to the watch. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_text` | watch.face.set needs a non-empty "text". | Not recoverable by retrying. |
| `unreachable` | The watch is not reachable right now. The last pushed pair keeps rendering on the face. |  |
| `watch_unavailable` | The watch surface is not in this build. | Not recoverable by retrying. |

**Example: pushes a text + value onto the watch face**

```js
const result = await dsx.module.face.set({"text":"Orders","value":"12"});
// resolves {"ok":true}
```

**Example: pushes a text alone**

```js
const result = await dsx.module.face.set({"text":"All clear"});
// resolves {"ok":true}
```

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `fixture_not_found` | The named conformance fixture does not ship in this watch build. |  |
| `missing_command` | watch.command requires a "name". |  |
| `missing_text` | watch.face.set needs a non-empty "text". |  |
| `offline` | The watch answered but the phone leg is offline. |  |
| `unknown_command` | The watch app carries no feature by that name. |  |
| `unreachable` | The watch is not reachable right now. The last pushed pair keeps rendering on the face. |  |
| `unsupported_on_surface` | That command does not exist on the surface it was routed to. |  |
| `watch_failed` | The watch could not complete that command, and named a reason this build does not model. |  |
| `watch_unavailable` | The watch surface is not in this build. |  |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
