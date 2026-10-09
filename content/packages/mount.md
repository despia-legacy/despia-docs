---
title: Mount
description: Places a component or a piece of markup over your screen or web page and tells you how much space it uses.
package: mount
---

Places a component or a piece of markup over your screen or web page and tells you how much space it uses.

Mounts any imported component, such as an ad banner, over a DSX screen or a web page, on the edge you choose. The package hands back the space it takes as CSS insets so your layout can make room. You write the markup or page that hosts the mount and the CSS that uses the insets.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to put a banner, bar or overlay from another package on top of a screen or web page without hand-placing it. Do not use it for normal page content, which belongs in your own layout.

## What native adds

On the web, nothing can reserve safe space for a native component. This package tells the page exactly how much room to leave, so the layout stays correct.

## Install

```sh
despia add Core/Mount
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | no |
| web | yes |
| macos | no |

Device classes: phone, tablet, desktop.

## Actions

### declare

`dsx.module.mount.declare`

Mounts a component or markup under an id, or updates it if the id already exists. If it cannot be mounted, the fallback appears, or nothing, and a failed event is sent.

**When not to.** To change only the props of something already mounted, use set.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `component` | string | no | The component to mount, written as package.Component. Pass this or markup, not both. |
| `edge` | string | no | Which edge of the host the mount reserves: top, bottom, start or end. |
| `fallback` | string | no | A component to show instead if the first choice cannot be mounted. |
| `id` | string | yes | A name for this mount, used later to update or withdraw it. |
| `markup` | string | no | DSX markup to mount instead of a named component. Pass this or component, not both. |
| `props` | object | no | Values handed to the mounted component; a strict mount takes plain data only. |
| `requires` | object | no | Extra conditions the device must meet, such as a role like tablet. |
| `target` | string | no | Where to render it: auto, native, web or a lane, tried in order if you give a list. |
| `version` | string | no | The version range of the package the mount accepts. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id the mount was declared under. |
| `mode` | string | yes | Whether the mount runs strict or unrestricted. |
| `renders` | string | yes | What is now showing: the primary component, the fallback, or nothing. |
| `resolution` | object | yes | The full answer tree that explains the result. |
| `resolution.code` | string | yes | A short stable code for the result, such as not_imported or a mount error code. |
| `resolution.evaluatedOn` | object | yes | Where the decision was made: the runtime, the host chain and the layer. |
| `resolution.fallback` | object | yes | The answer for the declared fallback component, when there is one. |
| `resolution.id` | string | yes | The id of the mount this answer is about. |
| `resolution.mode` | string | yes | Whether the mount runs strict, with limits, or unrestricted. |
| `resolution.nodes` | array of object | yes | One entry per package or component that was checked, each with its own status. |
| `resolution.reason` | string | yes | A plain sentence explaining the result. |
| `resolution.remedy` | object | yes | What to do about a problem, as a kind of fix plus the setting or target involved. |
| `resolution.renders` | string | yes | What will appear: the primary component, the fallback, or nothing. |
| `resolution.schema` | string | yes | The version label of the answer format, dsx.mount.resolution/1. |
| `resolution.status` | string | yes | The overall result: mountable, or the reason it cannot be mounted. |
| `resolution.target` | object | yes | Where the component will render, or why no target is available. |
| `status` | string | yes | The result of the check, such as mountable or not_imported. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid` | The mount has no id, or has both or neither of component and markup. | Pass an id and exactly one of component or markup. |

**Example: Mount a component at the bottom edge**

```js
const result = await dsx.module.mount.declare({"component":"legacy.ads.Strip","edge":"bottom","id":"promo"});
// resolves {"id":"promo","mode":"strict","renders":"primary","resolution":{"code":null,"evaluatedOn":{"chain":["app"],"layer":"app","runtime":"web"},"fallback":null,"id":"promo","mode":"strict","nodes":[{"code":null,"kind":"component","name":"legacy.ads.Strip","reason":null,"remedy":null,"status":"mountable"}],"reason":null,"remedy":null,"renders":"primary","schema":"dsx.mount.resolution/1","status":"mountable","target":null},"status":"mountable"}
```

### resolve

`dsx.module.mount.resolve`

Checks whether a component could be mounted, without mounting anything. It returns a tree that says what would happen and why.

**When to use it.** Call it before mounting to decide what to show if the component is not available.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `component` | string | no | The component to mount, written as package.Component. Pass this or markup, not both. |
| `edge` | string | no | Which edge of the host the mount reserves: top, bottom, start or end. |
| `fallback` | string | no | A component to show instead if the first choice cannot be mounted. |
| `id` | string | yes | A name for this mount, used later to update or withdraw it. |
| `markup` | string | no | DSX markup to mount instead of a named component. Pass this or component, not both. |
| `props` | object | no | Values handed to the mounted component; a strict mount takes plain data only. |
| `requires` | object | no | Extra conditions the device must meet, such as a role like tablet. |
| `target` | string | no | Where to render it: auto, native, web or a lane, tried in order if you give a list. |
| `version` | string | no | The version range of the package the mount accepts. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `code` | string | yes | A short stable code for the result, such as not_imported or a mount error code. |
| `evaluatedOn` | object | yes | Where the decision was made: the runtime, the host chain and the layer. |
| `evaluatedOn.chain` | array of string | yes | The list of hosts the decision looked through, from nearest to farthest. |
| `evaluatedOn.layer` | string | yes | The layer of the app where the decision was made. |
| `evaluatedOn.runtime` | string | yes | The runtime that made the decision, such as web, iOS or Android. |
| `fallback` | object | yes | The answer for the declared fallback component, when there is one. |
| `fallback.code` | string | yes | A short stable code for the result. |
| `fallback.evaluatedOn` | object | yes | Where the decision was made. |
| `fallback.id` | string | yes | The id of the mount this answer is about. |
| `fallback.mode` | string | yes | Whether the mount runs strict or unrestricted. |
| `fallback.nodes` | array of object | yes | The packages and components that were checked, each with its own status. |
| `fallback.reason` | string | yes | A plain sentence explaining the result. |
| `fallback.remedy` | object | yes | What to do about a problem. |
| `fallback.renders` | string | yes | What will appear: the primary component, the fallback, or nothing. |
| `fallback.schema` | string | yes | The version label of the answer format. |
| `fallback.status` | string | yes | The overall result: mountable, or the reason it cannot be mounted. |
| `fallback.target` | object | yes | Where the component will render, or why no target is available. |
| `id` | string | yes | The id of the mount this answer is about. |
| `mode` | string | yes | Whether the mount runs strict, with limits, or unrestricted. |
| `nodes` | array of object | yes | One entry per package or component that was checked, each with its own status. |
| `reason` | string | yes | A plain sentence explaining the result. |
| `remedy` | object | yes | What to do about a problem, as a kind of fix plus the setting or target involved. |
| `remedy.inCall` | boolean | yes | True if the fix can be done from inside the current call. |
| `remedy.kind` | string | yes | The kind of fix, such as grant a permission, open settings or use another target. |
| `remedy.needs` | string | yes | What is needed to fix the problem. |
| `remedy.setting` | string | yes | The setting to change, if the fix is a setting. |
| `remedy.targets` | array of string | yes | The targets that would work instead. |
| `renders` | string | yes | What will appear: the primary component, the fallback, or nothing. |
| `schema` | string | yes | The version label of the answer format, dsx.mount.resolution/1. |
| `status` | string | yes | The overall result: mountable, or the reason it cannot be mounted. |
| `target` | object | yes | Where the component will render, or why no target is available. |
| `target.component` | string | no | The component that will render on the target. |
| `target.conditions` | array of object | no | The conditions the target had to meet. |
| `target.fallback` | boolean | no | True if the target is the fallback rather than the first choice. |
| `target.lane` | string | no | The renderer lane that will draw the component. |
| `target.layer` | string | no | The layer of the app that will draw the component. |
| `target.reason` | string | no | Why no target is available, when that is the case. |
| `target.remedy` | object | no | What to do when no target is available. |
| `target.state` | string | yes | Whether a target was found or none is available. |

**Example: Check a component before mounting it**

```js
const result = await dsx.module.mount.resolve({"component":"legacy.ads.Strip","edge":"bottom","id":"promo"});
// resolves {"code":null,"evaluatedOn":{"chain":["app"],"layer":"app","runtime":"web"},"fallback":null,"id":"promo","mode":"strict","nodes":[{"code":null,"kind":"component","name":"legacy.ads.Strip","reason":null,"remedy":null,"status":"mountable"}],"reason":null,"remedy":null,"renders":"primary","schema":"dsx.mount.resolution/1","status":"mountable","target":null}
```

### set

`dsx.module.mount.set`

Updates the props of a mounted component. The component re-renders in place and is not mounted again.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the mount to update. |
| `props` | object | yes | The new prop values, merged into the existing ones. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the mount that was updated. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `props` | A strict mount takes plain data only, up to 2 KB, and one value was not data. | Send only strings, numbers, booleans, null and flat arrays of those. |
| `unknown_id` | Nothing is mounted under that id. | Declare the mount first, or check the id. |

**Example: Update the props of a mounted component**

```js
const result = await dsx.module.mount.set({"id":"promo","props":{"title":"Sale"}});
// resolves {"id":"promo"}
```

### withdraw

`dsx.module.mount.withdraw`

Removes one mounted component. Withdrawing an id that is not mounted does nothing.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the mount to remove. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the mount that was removed. |
| `withdrawn` | boolean | yes | True if something was mounted and has been removed. |

**Example: Remove a mounted component**

```js
const result = await dsx.module.mount.withdraw({"id":"promo"});
// resolves {"id":"promo","withdrawn":true}
```

## Events

Read with `dsx.on(name, handler)`.

### event

A mounted component raised one of the events it declares, such as a banner impression.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `detail` | object | yes | Simple values that came with the event. |
| `mountId` | string | yes | The id of the mount that raised the event. |
| `name` | string | yes | The name of the event the component raised. |

### failed

A mount could not be shown as asked. The fallback appears, or nothing.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `mountId` | string | yes | The id of the mount that could not be shown as asked. |
| `renders` | string | yes | What is showing instead: the fallback or nothing. |
| `resolution` | object | yes | The answer tree that explains why it failed. |
| `resolution.code` | string | yes | A short stable code for the result, such as not_imported or a mount error code. |
| `resolution.evaluatedOn` | object | yes | Where the decision was made: the runtime, the host chain and the layer. |
| `resolution.fallback` | object | yes | The answer for the declared fallback component, when there is one. |
| `resolution.id` | string | yes | The id of the mount this answer is about. |
| `resolution.mode` | string | yes | Whether the mount runs strict, with limits, or unrestricted. |
| `resolution.nodes` | array of object | yes | One entry per package or component that was checked, each with its own status. |
| `resolution.reason` | string | yes | A plain sentence explaining the result. |
| `resolution.remedy` | object | yes | What to do about a problem, as a kind of fix plus the setting or target involved. |
| `resolution.renders` | string | yes | What will appear: the primary component, the fallback, or nothing. |
| `resolution.schema` | string | yes | The version label of the answer format, dsx.mount.resolution/1. |
| `resolution.status` | string | yes | The overall result: mountable, or the reason it cannot be mounted. |
| `resolution.target` | object | yes | Where the component will render, or why no target is available. |

### insets

The space the mounts take on each edge changed. Use it to make room in your own layout.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bottom` | number | yes | Points to keep clear at the bottom. |
| `end` | number | yes | Points to keep clear at the end edge. |
| `start` | number | yes | Points to keep clear at the start edge. |
| `top` | number | yes | Points to keep clear at the top. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `allow` | list | `[]` | Components a page you do not fully trust may mount (written as package.Component). |
| `trusted_origins` | list | `[]` | Exact page origins that may mount any component anywhere (scheme://host[:port]). |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `escalation` | A page tried to choose its own mode, which only the app's trusted origins can decide. | List the page's exact origin in trusted origins if it should be trusted. |
| `invalid` | The mount has no id, or has both or neither of component and markup. | Pass an id and exactly one of component or markup. |
| `limit` | Strict mode allows only three mounts per host. | Withdraw one before adding another. |
| `markup_action` | In strict mode, markup may read package context but cannot call package actions or scripts. | Remove the action call, or mount it from your own markup. |
| `not_allowed` | In strict mode, the component is not on the allow list. | Add it to the allow list in the Mount settings. |
| `not_declared` | The package does not publicly offer that component. | Check the component name against the package reference. |
| `not_imported` | The package is installed but the app does not import it. | Add the package to the app's imports. |
| `not_overlay_safe` | In strict mode, the component's package does not say it is safe to mount from a page. | Mount it from your own markup, or list the page's exact origin in trusted origins. |
| `placement` | In strict mode, a mount must reserve an edge and cannot float or fill. | Set edge to top, bottom, start or end. |
| `props` | A strict mount takes plain data only, up to 2 KB. | Send only strings, numbers, booleans, null and flat arrays of those. |
| `rate_limited` | Too many mounts and withdrawals happened within ten seconds. | Wait a few seconds and try again. |
| `trusted_not_origin` | A trusted origins entry is not an exact origin in the form scheme://host[:port]. | Write the full origin, such as https://app.example.com. |
| `trusted_wildcard` | Trusted origins must be exact origins, and wildcards are refused. | Write the full origin, such as https://app.example.com. |
| `unknown_id` | Nothing is mounted under that id. | Declare the mount first, or check the id. |
| `version_mismatch` | The installed package is outside the version range the mount asked for. | Update the package or widen the version range. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
