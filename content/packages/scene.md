---
title: Scene
description: Inspect and control the 3D scenes on screen from code, markup or an AI agent.
package: scene
---

Inspect and control the 3D scenes on screen from code, markup or an AI agent.

Lets any action, or an AI agent through the MCP package, look at the nodes of a mounted scene, change their attributes, move the camera, take a picture, test what is under a point and read collisions and statistics. It adds no screen of its own and works on the scene elements you already have.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when you want to change or inspect a 3D scene while the app runs, for testing, debugging or letting an AI agent drive the scene. To build the scene itself, use the scene markup elements.

## Install

```sh
despia add Core/Scene
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

### camera

`dsx.module.scene.camera`

Reads the camera, or moves it. With flyTo the camera glides to the new position instead of jumping.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `durationMs` | number | no | How long the glide takes, in milliseconds. Defaults to 600. |
| `flyTo` | string | no | A position as x y z to glide the camera to. |
| `lookAt` | string | no | The point the camera should look at, as x y z. |
| `position` | string | no | A new camera position as x y z, set at once. |
| `scene` | string | no | Which scene to use, by its id. Defaults to the first scene on screen. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `authored` | boolean | yes | True when the scene markup defines the camera. |
| `fov` | number | yes | The camera's field of view in degrees. |
| `lookAt` | string | yes | The point the camera looks at, as x y z. |
| `position` | string | yes | The camera position as x y z. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_value` | position/lookAt/flyTo must be a space-separated numeric triple. | Not recoverable by retrying. |
| `no_camera` | The scene authors no <camera> node to move. | Not recoverable by retrying. |
| `scene_not_found` | No mounted <scene> matches the requested target. |  |

**Example: reads the camera**

```js
const result = await dsx.module.scene.camera({});
// resolves {"authored":true,"fov":60,"lookAt":"0 0 0","position":"0 0 5"}
```

### capture

`dsx.module.scene.capture`

Takes a picture of the scene as a PNG file and returns where it was saved. Use it to see what the scene looks like right now.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `scene` | string | no | Which scene to use, by its id. Defaults to the first scene on screen. |
| `to` | string | no | A path to save the PNG to. Defaults to a new file in the cache. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `height` | number | yes | The picture height in pixels. |
| `path` | string | yes | The path of the saved PNG. |
| `width` | number | yes | The picture width in pixels. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `capture_failed` | The scene has no live framebuffer to capture (renderer unavailable or zero-sized). |  |
| `is_directory` | The save path points at a folder instead of a file name. | Pass a full file path ending in .png. |
| `no_space` | There is not enough free space to write that file. |  |
| `not_directory` | A folder in that path is a file. | Not recoverable by retrying. |
| `not_loaded` | Core/Files is excluded from this build. | Not recoverable by retrying. |
| `permission_denied` | That location cannot be written to. | Not recoverable by retrying. |
| `scene_not_found` | No mounted <scene> matches the requested target. |  |
| `unsupported_root` | That path is not inside a root this app can address. | Not recoverable by retrying. |

**Example: Save a picture of the scene**

```js
const result = await dsx.module.scene.capture({"to":"documents:scene.png"});
// resolves {"height":2532,"path":"documents:scene.png","width":1170}
```

### contacts

`dsx.module.scene.contacts`

Lists the pairs of nodes that overlap right now, with how deep each overlap is.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `scene` | string | no | Which scene to use, by its id. Defaults to the first scene on screen. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `contacts` | array of object | yes | The current overlaps, each with the two node ids and the depth. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `scene_not_found` | No mounted <scene> matches the requested target. |  |

**Example: reads the currently overlapping collider pairs**

```js
const result = await dsx.module.scene.contacts({});
// resolves {"contacts":[]}
```

### nodes

`dsx.module.scene.nodes`

Returns the nodes of a scene with their kind, id, current attribute values and position in the world. Pass an id for one node.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | The id of one node to return. Leave out to get every node. |
| `scene` | string | no | Which scene to use, by its id. Defaults to the first scene on screen. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `nodes` | array of object | yes | The nodes found, each with kind, id, resolved attributes and world position. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `node_not_found` | No scene node carries the requested id. |  |
| `scene_not_found` | No mounted <scene> matches the requested target. |  |

**Example: reads the resolved node tree of the only mounted scene**

```js
const result = await dsx.module.scene.nodes({});
// resolves {"nodes":[]}
```

### pick

`dsx.module.scene.pick`

Finds which node is under a point of the scene, as a tap would, without triggering any tap handlers.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `scene` | string | no | Which scene to use, by its id. Defaults to the first scene on screen. |
| `x` | number | yes | The horizontal position of the point, from 0 on the left to 1 on the right. |
| `y` | number | yes | The vertical position of the point, from 0 at the top to 1 at the bottom. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `hit` | boolean | yes | True when a node is under the point. |
| `id` | string | no | The id of the node that was hit. |
| `kind` | string | no | The kind of node that was hit, such as sphere. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_point` | x and y must be normalized coordinates in [0, 1]. | Not recoverable by retrying. |
| `scene_not_found` | No mounted <scene> matches the requested target. |  |

**Example: answers what a tap would hit, without firing handlers**

```js
const result = await dsx.module.scene.pick({"x":0.5,"y":0.5});
// resolves {"hit":true,"id":"ball","kind":"sphere"}
```

### restore

`dsx.module.scene.restore`

Puts back the attributes and camera saved in a snapshot. Only values that have changed since are written.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `label` | string | yes | The name of the snapshot to restore. |
| `scene` | string | no | Which scene to use, by its id. Defaults to the first scene on screen. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `label` | string | yes | The name of the snapshot that was restored. |
| `ok` | boolean | yes | True when the snapshot was restored. |
| `restored` | number | yes | How many values were written back. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `scene_not_found` | No mounted <scene> matches the requested target. |  |
| `unknown_snapshot` | This scene has no snapshot with that label. |  |

**Example: Put a snapshot back**

```js
const result = await dsx.module.scene.restore({"label":"before-edit"});
// resolves {"label":"before-edit","ok":true,"restored":3}
```

### set

`dsx.module.scene.set`

Changes one attribute of a node. If the attribute has a transition, it glides to the new value instead of jumping.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attr` | string | yes | The name of the attribute to change, such as position or color. |
| `id` | string | yes | The id of the node to change. |
| `scene` | string | no | Which scene to use, by its id. Defaults to the first scene on screen. |
| `value` | string | yes | The new value for the attribute, written as it would be in markup. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the attribute was written. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_attr` | Handlers, id and __css are not writable scene attributes. | Not recoverable by retrying. |
| `node_not_found` | No scene node carries the requested id. |  |
| `scene_not_found` | No mounted <scene> matches the requested target. |  |

**Example: writes one attribute on a node**

```js
const result = await dsx.module.scene.set({"attr":"position","id":"ball","value":"0 2 0"});
// resolves {"ok":true}
```

### snapshot

`dsx.module.scene.snapshot`

Saves a named copy of every node's attributes and the camera, so you can put them back later. Each scene keeps up to 32 snapshots in memory.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `label` | string | yes | A name for the snapshot, used later by restore. |
| `scene` | string | no | Which scene to use, by its id. Defaults to the first scene on screen. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `label` | string | yes | The name the snapshot was saved under. |
| `nodes` | number | yes | How many nodes were saved. |
| `ok` | boolean | yes | True when the snapshot was saved. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_label` | A snapshot label is 1 to 128 of A-Z a-z 0-9 . _ -. | Not recoverable by retrying. |
| `scene_not_found` | No mounted <scene> matches the requested target. |  |

**Example: Save the scene as a snapshot**

```js
const result = await dsx.module.scene.snapshot({"label":"before-edit"});
// resolves {"label":"before-edit","nodes":12,"ok":true}
```

### snapshots

`dsx.module.scene.snapshots`

Lists the names of the snapshots saved for a scene.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `scene` | string | no | Which scene to use, by its id. Defaults to the first scene on screen. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `snapshots` | array of string | yes | The labels of the saved snapshots. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `scene_not_found` | No mounted <scene> matches the requested target. |  |

**Example: List the saved snapshots**

```js
const result = await dsx.module.scene.snapshots({});
// resolves {"snapshots":["before-edit"]}
```

### stats

`dsx.module.scene.stats`

Reports simple statistics about a scene: how many nodes and animations it has and how long the last frame took.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `scene` | string | no | Which scene to use, by its id. Defaults to the first scene on screen. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `animations` | number | yes | How many animations are running. |
| `boundRows` | number | yes | How many nodes were created from data bindings. |
| `lastFrameDt` | number | yes | How long the last frame took, in seconds. |
| `nodes` | number | yes | How many nodes the scene has. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `scene_not_found` | No mounted <scene> matches the requested target. |  |

**Example: reads the honest v0 profiler counters**

```js
const result = await dsx.module.scene.stats({});
// resolves {"animations":0,"boundRows":0,"lastFrameDt":0,"nodes":3}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
