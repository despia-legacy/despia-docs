---
title: LegacyAudioPlayer
description: Keeps the old audio:// player calls from version 3 pages working.
package: audioplayer
---

Keeps the old audio:// player calls from version 3 pages working.

Lets pages written for the version 3 native audio player keep calling audio:// links such as setqueue, play and seek, and keep receiving their events in the old window.onAudioEvent hook. It owns no player of its own and hands every call to the Audio package. New apps should call the Audio package directly and leave this out.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it only when an app converted from version 3 still has pages that call audio:// links. New apps should use the Audio package directly.

## Install

```sh
despia add Core/Legacy/Modules/AudioPlayer
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

Device classes: phone.

## Actions

### config

`dsx.module.audioplayer.config`

Changes controls, loop, skip interval or speed on the fly, touching only the settings given and leaving the queue as it is.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | no | The whole old-style link, written as audio://verb?query, exactly as a version 3 page would have used it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was accepted and handed to the Audio package. |

**Example: answers config**

```js
const result = await dsx.module.audioplayer.config({"uri":"audio://config"});
// resolves {"ok":true}
```

### next

`dsx.module.audioplayer.next`

Moves to the next track. In a loop it restarts the current track, and at the end of a feed it fetches the next page first.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | no | The whole old-style link, written as audio://verb?query, exactly as a version 3 page would have used it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was accepted and handed to the Audio package. |

**Example: answers next**

```js
const result = await dsx.module.audioplayer.next({"uri":"audio://next"});
// resolves {"ok":true}
```

### pause

`dsx.module.audioplayer.pause`

Pauses playback and keeps the current position.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | no | The whole old-style link, written as audio://verb?query, exactly as a version 3 page would have used it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was accepted and handed to the Audio package. |

**Example: answers pause**

```js
const result = await dsx.module.audioplayer.pause({"uri":"audio://pause"});
// resolves {"ok":true}
```

### play

`dsx.module.audioplayer.play`

Resumes playback, or starts the current track if the player was torn down. It reports an error when the queue is empty.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | no | The whole old-style link, written as audio://verb?query, exactly as a version 3 page would have used it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was accepted and handed to the Audio package. |

**Example: answers play**

```js
const result = await dsx.module.audioplayer.play({"uri":"audio://play"});
// resolves {"ok":true}
```

### playat

`dsx.module.audioplayer.playat`

Starts playing the queue item at the given index. An index outside the queue is ignored.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | no | The whole old-style link, written as audio://verb?query, exactly as a version 3 page would have used it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was accepted and handed to the Audio package. |

**Example: answers playat**

```js
const result = await dsx.module.audioplayer.playat({"uri":"audio://playat"});
// resolves {"ok":true}
```

### prev

`dsx.module.audioplayer.prev`

Moves to the previous track. It does nothing when the first track is playing.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | no | The whole old-style link, written as audio://verb?query, exactly as a version 3 page would have used it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was accepted and handed to the Audio package. |

**Example: answers prev**

```js
const result = await dsx.module.audioplayer.prev({"uri":"audio://prev"});
// resolves {"ok":true}
```

### routepicker

`dsx.module.audioplayer.routepicker`

Shows the system picker for choosing where audio plays, such as speakers or Bluetooth headphones.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | no | The whole old-style link, written as audio://verb?query, exactly as a version 3 page would have used it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was accepted and handed to the Audio package. |

**Example: answers routepicker**

```js
const result = await dsx.module.audioplayer.routepicker({"uri":"audio://routepicker"});
// resolves {"ok":true}
```

### seek

`dsx.module.audioplayer.seek`

Jumps to an absolute position in the current track, in seconds. It reports an error when there is no player.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | no | The whole old-style link, written as audio://verb?query, exactly as a version 3 page would have used it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was accepted and handed to the Audio package. |

**Example: answers seek**

```js
const result = await dsx.module.audioplayer.seek({"uri":"audio://seek"});
// resolves {"ok":true}
```

### setfeed

`dsx.module.audioplayer.setfeed`

Loads a paginated feed of tracks from a web address, fetching further pages as the listener nears the end, and reports feed_loading and feed_updated as pages arrive.

**When to use it.** Use it for long or endless lists that your server serves in pages.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | no | The whole old-style link, written as audio://verb?query, exactly as a version 3 page would have used it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was accepted and handed to the Audio package. |

**Example: answers setfeed**

```js
const result = await dsx.module.audioplayer.setfeed({"uri":"audio://setfeed"});
// resolves {"ok":true}
```

### setqueue

`dsx.module.audioplayer.setqueue`

Replaces the play queue with the tracks in the link and starts with the player stopped, then answers feed_updated. Tracks missing an id, url or title are dropped.

**When to use it.** Use it to load a fixed list of tracks before calling play.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | no | The whole old-style link, written as audio://verb?query, exactly as a version 3 page would have used it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was accepted and handed to the Audio package. |

**Example: answers setqueue**

```js
const result = await dsx.module.audioplayer.setqueue({"uri":"audio://setqueue"});
// resolves {"ok":true}
```

### skipback

`dsx.module.audioplayer.skipback`

Jumps back by a number of seconds, or by the configured skip interval when none is given, staying inside the track.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | no | The whole old-style link, written as audio://verb?query, exactly as a version 3 page would have used it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was accepted and handed to the Audio package. |

**Example: answers skipback**

```js
const result = await dsx.module.audioplayer.skipback({"uri":"audio://skipback"});
// resolves {"ok":true}
```

### skipforward

`dsx.module.audioplayer.skipforward`

Jumps ahead by a number of seconds, or by the configured skip interval when none is given, staying inside the track.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | no | The whole old-style link, written as audio://verb?query, exactly as a version 3 page would have used it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was accepted and handed to the Audio package. |

**Example: answers skipforward**

```js
const result = await dsx.module.audioplayer.skipforward({"uri":"audio://skipforward"});
// resolves {"ok":true}
```

### speed

`dsx.module.audioplayer.speed`

Sets the playback speed, limited to between 0.5 and 3, and keeps it for the following tracks.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | no | The whole old-style link, written as audio://verb?query, exactly as a version 3 page would have used it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was accepted and handed to the Audio package. |

**Example: answers speed**

```js
const result = await dsx.module.audioplayer.speed({"uri":"audio://speed"});
// resolves {"ok":true}
```

### sync

`dsx.module.audioplayer.sync`

Asks for the whole player state and queue, so a freshly loaded page can pick up where the player already is.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | no | The whole old-style link, written as audio://verb?query, exactly as a version 3 page would have used it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was accepted and handed to the Audio package. |

**Example: answers sync**

```js
const result = await dsx.module.audioplayer.sync({"uri":"audio://sync"});
// resolves {"ok":true}
```

### terminate

`dsx.module.audioplayer.terminate`

Stops the player, releases the audio session and the now-playing card, and clears the queue and feed.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | no | The whole old-style link, written as audio://verb?query, exactly as a version 3 page would have used it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was accepted and handed to the Audio package. |

**Example: answers terminate**

```js
const result = await dsx.module.audioplayer.terminate({"uri":"audio://terminate"});
// resolves {"ok":true}
```

### unknown

`dsx.module.audioplayer.unknown`

Answers any other audio:// verb with an unknown_command error, as version 3 did.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | no | The whole old-style link, written as audio://verb?query, exactly as a version 3 page would have used it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was accepted and handed to the Audio package. |

**Example: answers unknown**

```js
const result = await dsx.module.audioplayer.unknown({"uri":"audio://unknown"});
// resolves {"ok":true}
```

### webhook

`dsx.module.audioplayer.webhook`

Sends every player milestone, such as play, pause, next and ended, to a web address as a small JSON message. An empty address turns it off.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | no | The whole old-style link, written as audio://verb?query, exactly as a version 3 page would have used it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call was accepted and handed to the Audio package. |

**Example: answers webhook**

```js
const result = await dsx.module.audioplayer.webhook({"uri":"audio://webhook"});
// resolves {"ok":true}
```

## Events

Read with `dsx.on(name, handler)`.

### event

Delivers each old-style audio event, such as play, pause, ended or error, to window.onAudioEvent after an action or an Audio package update.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `error` | string | no | The error text, present only for error events. |
| `skipSeconds` | number | no | How many seconds a skip moved, present for skip events. |
| `state` | object | yes | The player state that goes with the event. |
| `state.current_index` | int | yes | The position of the current track in the queue, counting from 0. |
| `state.duration_seconds` | number | yes | The length of the current track in seconds. |
| `state.feed_exhausted` | boolean | yes | True once the feed has returned an empty page, so no more tracks will load. |
| `state.loop` | boolean | yes | True when the current track restarts instead of moving on at its end. |
| `state.mode` | string | yes | Whether the queue is a fixed list (inline) or a paginated feed (feed). |
| `state.position_seconds` | number | yes | How far into the current track playback is, in seconds. |
| `state.queue` | array of object | no | The tracks now in the queue, sent only with the queue events. |
| `state.skip_interval` | number | yes | How many seconds a skip forward or back moves. |
| `state.speed_rate` | number | yes | The playback speed as a multiplier, where 1 is normal speed. |
| `state.status` | string | yes | The player status right now: playing, buffering, paused or stopped. |
| `type` | string | yes | The kind of event, such as play, pause, ended or error. |
| `webhook_url` | string | no | The web address now receiving milestones, or null when it was cleared. |

### position

Ticks once a second while a track is live with the current position, delivered to the old page hook.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `durationSeconds` | number | yes | The track length in seconds, or null while it is not known yet. |
| `positionSeconds` | number | yes | How far into the track playback is, in seconds. |
| `status` | string | yes | Whether the player is playing, paused or buffering. |
| `type` | string | yes | Always the word position for this event. |

## Related packages

- Needs: [Audio](/packages/audio)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
