---
title: Apps
description: See which Despia app surfaces are on the screen right now.
package: apps
---

See which Despia app surfaces are on the screen right now.

Lets the editor page ask which Despia app surfaces, such as a side rail or a panel, are currently mounted, and whether one particular app is showing. It also holds the declarations that turn a package into an app and the host that mounts one. It runs on the web in the Studio editor only. You write the app itself.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it from the editor page when you need to know what app surfaces are showing. A mounted app cannot call it on itself, and phone builds do not include it.

## Install

```sh
despia add Core/Apps
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | no |
| web | yes |
| macos | no |

## Actions

### isMounted

`dsx.module.apps.isMounted`

Tells whether an app has a surface on this page, or one particular surface when you name the contribution.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `app` | string | yes | The name of the app to look for; an empty name always answers false. |
| `contribution` | string | no | Narrows the question to this one surface of the app, such as a rail. |

**Resolves with**

_None._

**Example: Ask whether an app has any surface on the page**

```js
const result = await dsx.module.apps.isMounted({"app":"notes"});
// resolves true
```

**Example: Ask about one surface of an app**

```js
const result = await dsx.module.apps.isMounted({"app":"notes","contribution":"rail"});
// resolves false
```

### mounted

`dsx.module.apps.mounted`

Lists every app surface mounted on this page right now, ordered by app and then by contribution.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

_None._

**Example: List the mounted app surfaces**

```js
const result = await dsx.module.apps.mounted({});
// resolves [{"app":"notes","contribution":"rail","mountedAt":1760000000000}]
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
