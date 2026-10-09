---
title: ActionSheet
description: Show the system's own action sheet and find out which option the user picked.
package: actionsheet
---

Show the system's own action sheet and find out which option the user picked.

Presents a list of choices in the platform's native action sheet or bottom sheet and gives you back the value of the row the user chose, or nothing if they dismissed it. You supply the rows, the title and the message, and mark destructive choices so the system styles them.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when the user must choose one action from a short list, such as share, edit or delete for an item. For choosing a value in a form or a long list, use a picker or list screen instead.

## What native adds

The sheet looks and behaves like the rest of the phone, with the right styling for destructive rows and the system's own dismiss gestures.

## Install

```sh
despia add Core/ActionSheet
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

### show

`dsx.module.actionsheet.show`

Shows the action sheet and waits. You get the value of the chosen row, or nothing when the user dismissed it.

**When not to.** Do not use it for long lists or for choices that need typed input.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `items` | array of object | no | The rows to show, top to bottom, each with a label, a value and an optional role; leave it out and nothing is shown, the call resolves null. |
| `message` | string | no | A line of explanation under the title; leave it out for none. |
| `title` | string | no | The title line shown at the top of the sheet; leave it out for none. |

**Resolves with**

_None._

**Example: picking a row resolves its value**

```js
const result = await dsx.module.actionsheet.show({"items":[{"label":"Edit","value":"edit"},{"label":"Delete","role":"destructive","value":"delete"}],"title":"Choose an action"});
// resolves "delete"
```

**Example: a missing items list resolves null without presenting**

```js
const result = await dsx.module.actionsheet.show({"title":"Nothing"});
```

## Events

Read with `dsx.on(name, handler)`.

### select

The user picked a row or dismissed the sheet. Dismissing sends no value.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `value` | string | no | The value of the row the user chose, or empty when they dismissed the sheet. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
