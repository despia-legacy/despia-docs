---
title: Permissions
description: Find out which permissions your app build is allowed to ask for, so you can hide features it can never turn on.
package: permissions
---

Find out which permissions your app build is allowed to ask for, so you can hide features it can never turn on.

Reads the permissions declared inside the installed app, such as camera, microphone or location, and gives you the list in one common vocabulary on iOS and Android. You use it to hide buttons for features the build cannot support, instead of prompting and getting a silent refusal. It does not ask the person for anything.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when a screen should only show a feature if the build can request that permission. It lists what the app may ask for, not what the person has granted, so use the permission actions of each feature package for the person's answer.

## What native adds

The answer comes from the installed app itself, so it always matches the build the person is running.

## Install

```sh
despia add Core/Basics/Permissions
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

## Actions

### list

`dsx.module.permissions.list`

Returns the permissions this app build is allowed to ask for, such as camera_usage or location_when_in_use.

**When to use it.** Call it once at start to decide which feature buttons to show.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `permissions` | array of string | yes | The permission names the installed app declares, the same names on iOS and Android. |

**Example: reports the capability keys this build ships, sorted and de-duplicated**

```js
const result = await dsx.module.permissions.list({});
// resolves {"permissions":[]}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
