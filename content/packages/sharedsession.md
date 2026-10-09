---
title: Watch together
description: Let people watch or listen together with playback in sync.
package: sharedsession
---

Let people watch or listen together with playback in sync.

Two or more people open the same video, song or document. One person presses play and everyone follows, and anyone who joins late catches up. Shares a members list and one state. Needs a session service address.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for watch-together, listen-together or shared-document features where everyone sees the same state and the same playback position. It does not draw a members list or a call screen; you build those from the package context.

## What native adds

Starting a group session from inside a FaceTime call (SharePlay) is only possible natively on iOS.

## Install

```sh
despia add Core/SharedSession
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

### clock

`dsx.module.sharedsession.clock`

Plays, pauses, seeks or changes the speed for everyone at once. Every member's player follows the shared clock.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `playing` | boolean | no | True to play and false to pause for the whole session. |
| `position` | number | no | The playback position to jump to, in seconds. |
| `rate` | number | no | The playback speed, from 0.25 to 4. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `clock` | object | yes | The shared clock after your change. |
| `clock.at` | number | yes | The time at which the position was recorded. |
| `clock.playing` | boolean | yes | Whether the group is playing right now. |
| `clock.position` | number | yes | The playback position in seconds at the moment stamped by at. |
| `clock.rate` | number | yes | The playback speed everyone is following, where 1 is normal. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `ambiguous_media` | The page has more than one player and none is the one playing: start the one to share first. |  |
| `frame_too_large` | That update is larger than one frame can carry. |  |
| `invalid_playing` | playing is true or false. | Not recoverable by retrying. |
| `invalid_position` | position is a number of seconds, zero or more. | Not recoverable by retrying. |
| `invalid_rate` | rate is a number from 0.25 to 4. | Not recoverable by retrying. |
| `missing_param` | A required argument is missing. | Not recoverable by retrying. |
| `not_joined` | No shared session is joined: call join first. |  |

**Example: plays together**

```js
const result = await dsx.module.sharedsession.clock({"playing":true});
// resolves {"clock":{"at":0,"playing":true,"position":0,"rate":1}}
```

### join

`dsx.module.sharedsession.join`

Joins a shared session, or creates it if nobody is there yet. The state you pass seeds the shared document only when the session is new.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The session id. Everyone who passes the same id joins the same session. |
| `name` | string | no | The display name other members see. |
| `state` | object | no | The starting shared state, used only if you are the first member to join. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the session you joined. |
| `members` | array of object | yes | Everyone currently in the session, including you. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_joined` | A different shared session is already joined: leave it first. |  |
| `invalid_endpoint` | The endpoint must be a wss (or https) origin, or a loopback ws (or http) origin for a local service. | Not recoverable by retrying. |
| `invalid_id` | id is 1 to 64 characters of letters, digits, underscore, dot, tilde and hyphen. | Not recoverable by retrying. |
| `invalid_name` | name is a string of at most 64 characters. | Not recoverable by retrying. |
| `invalid_state` | state is an object (a non-empty object for set) whose keys are 1 to 128 characters. | Not recoverable by retrying. |
| `missing_param` | A required argument is missing. | Not recoverable by retrying. |
| `no_endpoint` | No session service is configured: set the endpoint config to your own service. |  |
| `refused` | The session service refused this join. |  |
| `transport_mismatch` | This session id belongs to a different transport (SharePlay and the app service never mix). | Not recoverable by retrying. |
| `unreachable` | The session service could not be reached. |  |

**Example: joins a session**

```js
const result = await dsx.module.sharedsession.join({"id":"movie-night","name":"Ada"});
// resolves {"id":"movie-night","members":[{"id":"m-1","name":"Ada","self":true,"status":"active"}]}
```

### leave

`dsx.module.sharedsession.leave`

Leaves the current shared session. The session keeps going for as long as anyone else remains in it.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the session you left. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_joined` | No shared session is joined: call join first. |  |

**Example: leaves**

```js
const result = await dsx.module.sharedsession.leave({});
// resolves {"id":"movie-night"}
```

### set

`dsx.module.sharedsession.set`

Merges changes into the shared state document that every member sees. The newest write to each top-level key wins, and setting a key to null deletes it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `state` | object | yes | An object whose top-level keys are written into the shared state. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `state` | object | yes | The shared state after your changes were merged in. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `frame_too_large` | That update is larger than one frame can carry; split it into smaller keys. |  |
| `invalid_state` | state is an object (a non-empty object for set) whose keys are 1 to 128 characters. | Not recoverable by retrying. |
| `missing_param` | A required argument is missing. | Not recoverable by retrying. |
| `not_joined` | No shared session is joined: call join first. |  |

**Example: writes a key**

```js
const result = await dsx.module.sharedsession.set({"state":{"scene":"intro"}});
// resolves {"state":{"scene":"intro"}}
```

### start

`dsx.module.sharedsession.start`

Starts a system group session (SharePlay) for this app. Inside a FaceTime call it starts the activity, and otherwise it shows the system sharing sheet. It is iOS only.

**When not to.** Do not use it on Android or the web, which have no system group session; share the session id yourself and use join.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `activity` | object | yes | What the group will do: an id, a title and a kind. |
| `activity.id` | string | yes | A stable identifier for the activity. |
| `activity.kind` | string | no | The type of activity: watch, listen or other. |
| `activity.title` | string | no | The title people see when the activity is offered. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when the activity or sharing sheet was opened, false when the person cancelled. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_argument` | activity is { id, title, kind } with kind watch, listen or other. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find a screen to present the sharing sheet from. |  |
| `no_transport` | This build has no SharePlay transport package (Core/SharePlay). | Not recoverable by retrying. |
| `unsupported_os` | SharePlay needs iOS 15 or newer (the sharing sheet 15.4). | Not recoverable by retrying. |
| `unsupported_platform` | This platform has no system group session. Share the session id yourself: the session works on every platform. | Not recoverable by retrying. |

**Example: opens the sharing sheet**

```js
const result = await dsx.module.sharedsession.start({"activity":{"id":"movie-night","kind":"watch","title":"Movie night"}});
// resolves {"opened":true}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `drop` | number | `60` | Seconds after a member's last heartbeat when it is removed from the member list. |
| `endpoint` | string | `` | The origin of your own shared-session service (OpenSource/Services/shared-session, a DSX server project you host). A ws or wss origin; loopback is allowed for a local service. Empty means the app transport is unconfigured and join refuses. |
| `heartbeat` | number | `5` | Seconds between the presence heartbeats a member sends. |
| `joinWait` | number | `0.5` | Seconds a joining member waits for the other members' snapshots before it reads the session as new and applies its seed state. |
| `liveness` | number | `15` | Seconds a member stays active after its last heartbeat before it reads away. |
| `maxFrame` | number | `16384` | The largest message in bytes; a bigger set is refused with frame_too_large and never truncated. Match your service's maxFrame. |
| `nudge` | number | `0.05` | The largest change to the playback rate (a fraction of normal speed) used to close a small gap smoothly. |
| `seekAt` | number | `2` | Seconds off the shared clock beyond which the package seeks instead of adjusting the playback rate. |
| `stallWait` | number | `8` | Seconds the whole group waits for a member whose player has stalled before it carries on without them. |
| `tolerance` | number | `0.25` | Seconds a player may be off the shared clock before the package corrects it. |

## Related packages

- Used by: [SharePlay](/packages/shareplay)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
