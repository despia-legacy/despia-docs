---
title: VerticalPlayerStack
description: A full-screen vertical video player for short dramas, with paywalls, coins and offline downloads.
package: verticalplayer
---

A full-screen vertical video player for short dramas, with paywalls, coins and offline downloads.

Presents a swipeable full-screen player for short episodic videos, with a seek bar, speed menu, picture in picture, a paywall and coin unlocks, a Downloads library and a share sheet. You hand it a JSON list of episodes and it streams every viewing event back to your page. You write the episode data and your own server for access and credits.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when you are building a short drama or episodic video app in the style of TikTok, with paid episodes and offline viewing. Do not use it for ordinary single-video playback, where a plain video element is enough.

## What native adds

It uses the native video pipeline, lock-screen controls, picture in picture, background downloads and the store purchase sheet, which a web page cannot match.

## Install

```sh
despia add Custom/VerticalPlayerStack
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

### buy

`dsx.module.verticalplayer.buy`

Buys a plan or coin pack through the store purchase sheet. The paywall buttons call it for you, so you only need it for a custom flow.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `coins` | string | no | Set it to 1 when the product is a coin pack rather than a plan. |
| `product` | string | yes | The store product id to buy. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `purchased` | boolean | yes | True when the purchase went through. |

**Example: buys a product and reports the result**

```js
const result = await dsx.module.verticalplayer.buy({"product":"coins_100"});
// resolves {"purchased":true}
```

### close

`dsx.module.verticalplayer.close`

Closes the player and returns the viewer to your page.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `closed` | boolean | yes | True when the player was dismissed. |

**Example: dismisses the player**

```js
const result = await dsx.module.verticalplayer.close({});
// resolves {"closed":true}
```

### download

`dsx.module.verticalplayer.download`

Saves an episode, or a whole show, to the device for offline viewing, once access is checked. The batch form needs no open player, so a show page can offer Download all.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `episode` | string | no | The id of one episode to save, while the player is open. |
| `episodes` | array of object | no | The episodes to save, each with a url and optional id and number. |
| `show` | object | no | The show the episodes belong to. |
| `show.id` | string | no | The id of the show the episodes belong to. |
| `show.poster` | string | no | The poster image of the show, kept with the download. |
| `show.title` | string | no | The title of the show, kept with the download. |

**Resolves with**

_None._

**Example: saves the current episode by id**

```js
const result = await dsx.module.verticalplayer.download({"episode":"ep_1"});
// resolves {"ok":true}
```

### downloads

`dsx.module.verticalplayer.downloads`

Reads what is saved offline, grouped by show, with each episode's progress and a local play address, so you can build a Downloads tab. It needs no open player.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `show` | string | no | The id of one show to read. Leave it out to read the whole library. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | number | no | With a show id, the size of that show's saved files, in bytes. |
| `count` | int | no | Without a show id, how many episodes are saved. |
| `episodes` | array of object | no | With a show id, that show's saved episodes with their state and progress. |
| `poster` | string | no | With a show id, the poster image of that show. |
| `showId` | string | no | With a show id, the id of the show this snapshot describes. |
| `shows` | array of object | no | Without a show id, the library grouped by show. |
| `title` | string | no | With a show id, the title of that show. |
| `totalBytes` | number | no | Without a show id, the total size of everything saved, in bytes. |

**Example: queries the offline library snapshot**

```js
const result = await dsx.module.verticalplayer.downloads({});
// resolves {}
```

### getcoins

`dsx.module.verticalplayer.getcoins`

Shows a rewarded ad that gives the viewer coins when they watch it.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `earned` | boolean | yes | True when the viewer earned the coins. |

**Example: shows a rewarded ad and reports whether coins were earned**

```js
const result = await dsx.module.verticalplayer.getcoins({});
// resolves {"earned":true}
```

### refresh

`dsx.module.verticalplayer.refresh`

Asks the player to re-check access and coin balance with your server, for example after a push message or a websocket event.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `refreshed` | boolean | yes | True when the check was started. |

**Example: re-polls access and confirms the refresh**

```js
const result = await dsx.module.verticalplayer.refresh({});
// resolves {"refreshed":true}
```

### removeAllDownloads

`dsx.module.verticalplayer.removeAllDownloads`

Clears the whole offline library.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when everything was deleted. |

**Example: clears the whole offline library**

```js
const result = await dsx.module.verticalplayer.removeAllDownloads({});
// resolves {"ok":true}
```

### removeDownload

`dsx.module.verticalplayer.removeDownload`

Deletes one saved episode, or every saved episode of a show.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `episode` | string | no | The id of the episode to delete. |
| `show` | string | no | The id of the show to delete all saved episodes of. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the saved files were deleted. |

**Example: removes one episode download**

```js
const result = await dsx.module.verticalplayer.removeDownload({"episode":"ep_1"});
// resolves {"ok":true}
```

### restore

`dsx.module.verticalplayer.restore`

Restores purchases the viewer made before and checks their access again.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `restored` | boolean | yes | True when the restore completed. |

**Example: restores purchases and reports the result**

```js
const result = await dsx.module.verticalplayer.restore({});
// resolves {"restored":true}
```

### skip

`dsx.module.verticalplayer.skip`

Jumps forward or back in the current episode by a number of seconds.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `by` | number | yes | How many seconds to jump. Use a negative number to go back. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `skipped` | number | yes | The number of seconds that was skipped. |

**Example: relative-seeks by the given delta**

```js
const result = await dsx.module.verticalplayer.skip({"by":10});
// resolves {"skipped":10}
```

### start

`dsx.module.verticalplayer.start`

Opens the full-screen player with your episodes and streams viewing events back. Only one player can be open at a time.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | The id of the show, used to cache its configuration offline. |
| `share` | string | no | The link shown in the share sheet. |
| `token` | string | no | The viewer's identity, sent to your server on every access call. |

**Resolves with**

_None._

**Example: Open the player with a viewer identity**

```js
const result = await dsx.module.verticalplayer.start({"id":"show-1","share":"https://app.example.com/shows/1","token":"viewer-token-from-your-server"});
```

### update

`dsx.module.verticalplayer.update`

Does the same as refresh. Any state you pass is ignored, since your server decides access.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `refreshed` | boolean | yes | True when the check was started. |

**Example: re-polls access and confirms the refresh**

```js
const result = await dsx.module.verticalplayer.update({});
// resolves {"refreshed":true}
```

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `already_open` | A player is already open, and only one can be open at a time. | Close the open player before starting another. |
| `config_failed` | The player configuration could not be loaded. | Check the configUrl or payload address and the connection. |
| `invalid_payload` | The player payload is not valid. | Check the payload has an episodes list and valid fields. |
| `no_presenter` | There is no screen to show the player over. | Call again once the app is in the foreground. |
| `no_product` | No product was named to buy. | Pass the product id to buy. |
| `playback_error` | A clip failed to play. | Check the episode url and the connection, then let the viewer retry. |

## Related packages

- Needs: [Player](/packages/player)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
