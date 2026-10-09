---
title: Assistants
description: Let Siri, Shortcuts, Spotlight and Gemini run actions from your app.
package: assistants
---

Let Siri, Shortcuts, Spotlight and Gemini run actions from your app.

Turns the tools your screens declare into things system assistants can do: Siri, Shortcuts, Spotlight and the Action button on iOS, and Gemini and launcher shortcuts on Android. A tool that changes something asks the person to confirm first. The shortcut files are produced at build time, so you write each tool once.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when you want people to say or tap a request to the phone's assistant and have your app do it, such as logging a drink or starting a timer. It cannot let an assistant change things without the person confirming.

## What native adds

Siri, Shortcuts, Spotlight and Gemini discover your actions by themselves, which a web app cannot be part of.

## Install

```sh
despia add Core/Assistants
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

Device classes: phone, tablet.

## Actions

### tools

`dsx.module.assistants.tools`

Lists what assistants can run in your app right now, so a settings screen can tell the person what Siri or Gemini can do.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `tools` | array of object | yes | The tools that mounted screens declare. |

**Example: lists the mounted tools with their effect class**

```js
const result = await dsx.module.assistants.tools({});
// resolves {"tools":[{"description":"Add a task.","mutates":"tasks","name":"addTask"},{"description":"How many are open.","mutates":null,"name":"countOpen"}]}
```

**Example: an app with no mounted tool lists none**

```js
const result = await dsx.module.assistants.tools({});
// resolves {"tools":[]}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
