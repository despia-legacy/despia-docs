---
title: AppRating
description: Ask the system to show its in-app rating prompt.
package: apprating
---

Ask the system to show its in-app rating prompt.

Asks iOS or Android to show its own rating sheet inside your app, so people can rate without leaving it. The system decides whether the sheet really appears and limits how often it can, and it never tells you whether the user rated. You choose a good moment to ask.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it after a moment when the user is likely to be happy, such as finishing a task. Do not attach it to a button labelled rate us, because the system may show nothing; link to your store page for that.

## What native adds

The system sheet lets people leave a rating in one tap without going to the store, and the platforms keep it from being shown too often.

## Install

```sh
despia add Core/Basics/AppRating
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | yes |

Device classes: phone, desktop.

## Actions

### request

`dsx.module.apprating.request`

Asks the system to show its rating sheet. It reports that the system was asked, not that the sheet appeared, because the system decides.

**When not to.** Do not call it from a rate-us button, since the system may show nothing.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `requested` | boolean | yes | True when the system was asked to show the sheet; false when it could not be asked, for example when no screen was in front. |

**Example: asks the OS for the rating sheet**

```js
const result = await dsx.module.apprating.request({});
// resolves {"requested":true}
```

**Example: reports honestly when the OS could not be asked**

```js
const result = await dsx.module.apprating.request({});
// resolves {"requested":false}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
