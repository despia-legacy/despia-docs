---
title: IMessage
description: Add an iMessage app to your product that renders your own screens inside Messages.
package: imessage
---

Add an iMessage app to your product that renders your own screens inside Messages.

Builds a Messages app extension that shows your screens in the iMessage app drawer and lets people send rich cards, stickers, text and files into a conversation. Your app can also stage a card for the extension to send. You write the screens in the same layout language as the rest of your app.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when you want your app to live inside Messages, for example to share a game move, an order or a sticker pack with friends. Skip it if you only need the standard share sheet.

## What native adds

People get a real iMessage app in the Messages drawer that can insert bubbles and stickers into the conversation, which a web page cannot do.

## Install

```sh
despia add Core/Extensions/IMessage
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | no |
| web | no |
| macos | no |

## Actions

### clear

`dsx.module.imessage.clear`

Removes the message card that was staged for the extension.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the staged card was removed. |

**Example: drops the pushed surface, vars, route and staged card back to the bundled floor**

```js
const result = await dsx.module.imessage.clear({});
// resolves {"ok":true}
```

### compose

`dsx.module.imessage.compose`

Stages a message card for the extension, which is how the phone app puts something onto the conversation. With auto set, the next time the extension opens it drops the card into the input field and the person still taps send.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `auto` | boolean | no | Set it to true to insert the card as soon as the extension opens. |
| `data` | object | no | Extra data carried with the card for your app. |
| `image` | string | no | A picture to show in the card, as a web address or file. |
| `layout` | string | no | Screen markup used to draw the card's image. |
| `session` | boolean | no | Set it to true to make the card an updatable session bubble. |
| `subtitle` | string | no | The line under the headline. |
| `summary` | string | no | The short text shown in the transcript summary. |
| `title` | string | no | The headline of the card. |
| `url` | string | no | The link the card opens when tapped. |
| `vars` | object | no | Values the layout can read. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `auto` | boolean | yes | True when the card will be inserted automatically. |
| `staged` | boolean | yes | True when the card was saved for the extension. |

**Example: stages a card the next activation inserts**

```js
const result = await dsx.module.imessage.compose({"auto":true,"data":{"kind":"invite"},"title":"Dinner?"});
// resolves {"auto":true,"staged":true}
```

**Example: stages a template card (no auto-insert)**

```js
const result = await dsx.module.imessage.compose({"title":"Dinner?"});
// resolves {"auto":false,"staged":true}
```

### conversation

`dsx.module.imessage.conversation`

Reads a snapshot of the live conversation: how many people are in it and whether a bubble is selected. Messages never exposes who the people are.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `active` | boolean | yes | True when the extension is open on a conversation. |
| `hasSelected` | boolean | yes | True when a message bubble is selected. |
| `participants` | number | yes | How many people are in the conversation. |
| `selected` | object | no | The data carried by the selected bubble, such as its link or summary. |
| `selected.at` | number | no | When the selected bubble was created, as a timestamp. |
| `selected.data` | object | no | The extra data your app attached to the selected bubble. |
| `selected.session` | boolean | no | True when the selected bubble is an updatable session bubble. |
| `selected.summary` | string | no | The short summary text of the selected bubble. |
| `selected.url` | string | no | The link carried by the selected bubble. |

**Example: reads the conversation snapshot**

```js
const result = await dsx.module.imessage.conversation({});
// resolves {"active":true,"hasSelected":false,"participants":2}
```

### dismiss

`dsx.module.imessage.dismiss`

Closes the extension and returns the person to the conversation.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dismissed` | boolean | yes | True when the extension was closed. |

**Example: dismisses the extension sheet**

```js
const result = await dsx.module.imessage.dismiss({});
// resolves {"dismissed":true}
```

### insert

`dsx.module.imessage.insert`

Inserts a message bubble into the conversation with a title, subtitle, image and link. The person taps send.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `data` | object | no | Extra data carried with the bubble for your app. |
| `image` | string | no | A picture to show in the bubble, as a web address or file. |
| `imageSubtitle` | string | no | A subtitle drawn over the image. |
| `imageTitle` | string | no | A title drawn over the image. |
| `layout` | string | no | Screen markup drawn into the bubble's image. |
| `session` | boolean | no | Set it to true to make the bubble an updatable session bubble. |
| `subtitle` | string | no | The line under the headline. |
| `summary` | string | no | The short text shown in the transcript summary. |
| `title` | string | no | The headline of the bubble. |
| `trailing` | string | no | Text shown on the right of the bubble caption. |
| `trailingSubtitle` | string | no | A second line shown on the right of the caption. |
| `url` | string | no | The link the bubble opens when tapped. |
| `vars` | object | no | Values the layout can read. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `inserted` | boolean | yes | True when the bubble was placed in the input field. |
| `session` | boolean | no | True when the bubble was inserted as a session bubble. |

**Example: stages a card bubble in the conversation**

```js
const result = await dsx.module.imessage.insert({"data":{"turn":3},"session":true,"title":"Turn 3"});
// resolves {"inserted":true,"session":true}
```

### insertAttachment

`dsx.module.imessage.insertAttachment`

Stages a file in the Messages input field for the person to send. The file must live in the folder the app and the extension share.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | no | The file name to show in the conversation. |
| `path` | string | no | A path in the shared folder that your app wrote with the Files package. |
| `url` | string | no | A web address to download the file from. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `inserted` | boolean | yes | True when the file was staged. |
| `name` | string | yes | The file name that was staged. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_source` | Neither a bundled sticker name nor a web address was given. | Pass the name of a sticker bundled in the extension, or a url to download one. |
| `unsupported_root` | The file path is not on the shared folder that the app and the extension both can read. | Write the file with the Files package to the shared folder first, then pass that path. |

**Example: stages a fetched file**

```js
const result = await dsx.module.imessage.insertAttachment({"url":"https://example.com/guide.pdf"});
// resolves {"inserted":true,"name":"guide.pdf"}
```

**Example: stages a file the app wrote to the shared App Group**

```js
const result = await dsx.module.imessage.insertAttachment({"path":"shared:attachments/note.txt"});
// resolves {"inserted":true,"name":"note.txt"}
```

### insertSticker

`dsx.module.imessage.insertSticker`

Inserts a sticker into the conversation, either one bundled in the extension or one downloaded from a web address. Stickers follow Apple's limits of 500 KB and PNG, APNG, GIF or JPEG.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `description` | string | no | A short description of the sticker for accessibility. |
| `name` | string | no | The name of a sticker bundled in the extension. |
| `url` | string | no | A web address to download and cache a sticker from. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `inserted` | boolean | yes | True when the sticker was placed in the conversation. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_source` | Neither a bundled sticker name nor a web address was given. | Pass the name of a sticker bundled in the extension, or a url to download one. |

**Example: stages a fetched sticker**

```js
const result = await dsx.module.imessage.insertSticker({"url":"https://example.com/wave.png"});
// resolves {"inserted":true}
```

### insertText

`dsx.module.imessage.insertText`

Puts plain text into the Messages input field for the person to send.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `text` | string | yes | The words to place in the Messages input field. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `inserted` | boolean | yes | True when the text was placed in the input field. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_text` | No text was given to insert. | Pass a non-empty text value. |

**Example: stages plain text in the input field**

```js
const result = await dsx.module.imessage.insertText({"text":"On my way! 🏃"});
// resolves {"inserted":true}
```

### openParent

`dsx.module.imessage.openParent`

Opens your main app from the extension by deep link, which is the one outward door Messages allows.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `url` | string | yes | The deep link of your app to open. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when the app was asked to open. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_target` | No valid link was given to hand off to the app. | Pass the url of a deep link your app handles. |

**Example: opens the containing app**

```js
const result = await dsx.module.imessage.openParent({"url":"https://myapp.com/orders/7"});
// resolves {"opened":true}
```

### presentation

`dsx.module.imessage.presentation`

Asks Messages to show the extension as a compact strip or as the full expanded sheet.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `style` | string | no | The sheet size to request, either compact or expanded. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `style` | string | yes | The style the sheet is now in. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_style` | The requested sheet size is not compact or expanded. | Ask for compact or expanded. Messages chooses the transcript style itself. |

**Example: expands the extension sheet**

```js
const result = await dsx.module.imessage.presentation({"style":"expanded"});
// resolves {"style":"expanded"}
```

### render

`dsx.module.imessage.render`

Shows a layout on the extension's surface, replacing the previous screen and its values.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `layout` | string | yes | The screen markup to show in the extension. |
| `vars` | object | no | Values the layout can read. They replace the earlier values. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the layout was sent to the extension. |

**Example: pushes a DSX surface to the shared container**

```js
const result = await dsx.module.imessage.render({"layout":"<vstack><text>Hi</text></vstack>"});
// resolves {"ok":true}
```

### route

`dsx.module.imessage.route`

Moves the extension to another screen by route name or path.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `path` | string | no | The path of the screen to show, as an alternative to a route name. |
| `route` | string | no | The name of the screen to show. |
| `vars` | object | no | Values to hand to the screen. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the route was sent to the extension. |
| `route` | string | yes | The route the extension was asked to show. |

**Example: routes the iMessage app to a path**

```js
const result = await dsx.module.imessage.route({"route":"/game"});
// resolves {"ok":true,"route":"/game"}
```

### status

`dsx.module.imessage.status`

Tells you whether the person has opened the iMessage app, which is the best signal of setup that Apple offers.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `active` | boolean | yes | True when the extension looks open right now, as a best-effort flag. |
| `lastSeen` | number | yes | When the iMessage app was last active, as a timestamp. |
| `used` | boolean | yes | True when the iMessage app has run at least once. |

**Example: reports whether the iMessage app has run**

```js
const result = await dsx.module.imessage.status({});
// resolves {"active":false,"lastSeen":0,"used":false}
```

### update

`dsx.module.imessage.update`

Merges new values into what the extension's screen shows, without replacing the screen.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `vars` | object | no | The values to add or change in the screen. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the values were sent to the extension. |

**Example: merges vars for the extension's interpolation scope**

```js
const result = await dsx.module.imessage.update({"vars":{"score":3}});
// resolves {"ok":true}
```

## Events

Read with `dsx.on(name, handler)`.

### imessage

Passes the extension's lifecycle events, such as opening or closing, to your page as one event with a payload.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `event` | string | yes | The name of the lifecycle event. |
| `payload` | object | yes | The details that go with the event. |
| `payload.at` | number | no | When the event happened, as a timestamp. |
| `payload.data` | object | no | The extra data that came with the bubble or event. |
| `payload.error` | string | no | The error text, present when something went wrong. |
| `payload.inserted` | boolean | no | True when something was inserted into the conversation. |
| `payload.selected` | object | no | The bubble that is selected in the conversation, if any. |
| `payload.session` | boolean | no | True when the bubble belongs to an updatable session. |
| `payload.style` | string | no | The sheet style the extension is now showing. |
| `payload.summary` | string | no | The short summary text of the bubble. |
| `payload.url` | string | no | The link carried by the bubble. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `host` | string | `despia.com` | The domain the iMessage app fetches OTA screens from when an OTA manifest is set. Bundled screens work with no host. |
| `ota_manifest` | string | `` | Path to the over-the-air route manifest for the iMessage app. Leave empty to ship bundled screens only (no network). |
| `relay_allow` | list | `[]` | Command and action pairs the iMessage app may call on the phone app, such as orders.recent. Leave it empty to allow only what the manifest declares. |
| `start_route` | string | `/` | The first screen the iMessage app shows on activation. Matched against the route table (bundled, then OTA). |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_layout` | The layout could not be parsed. | Fix the layout markup and try again. |
| `missing_content` | A card needs at least one field such as a title, layout, image or data. | Add a title, layout, image or data to the call. |
| `missing_layout` | Rendering needs a layout and none was supplied. | Pass a non-empty layout string. |
| `not_active` | This call only runs inside the iMessage app, where the live conversation exists. | From the phone, stage a card with compose instead. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
