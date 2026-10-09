---
title: V3 image widget
description: Keep your V3 image home-screen widget working after moving your app over from V3.
package: imagewidget
---

Keep your V3 image home-screen widget working after moving your app over from V3.

Part of the V3 compatibility layer. The widget you set up in V3 keeps its name, so widgets people already placed survive the move. It shows an image from a link, edge to edge, and fetches it again on a refresh interval in minutes. iOS and Android only. For new apps, build widgets with the Widgets package instead.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it only when converting an older Despia app that already has an image widget on people's home screens. For new widgets, use the Widgets package.

## Install

```sh
despia add Core/Legacy/Modules/ImageWidget
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | no |

Device classes: phone.

## Actions

### receive

`dsx.module.imagewidget.receive`

Accepts the old widget:// address that older pages used and sets the widget image from it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | yes | The old widget address, written as widget:// followed by the image web address. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the widget image was set. |
| `refresh` | number | no | How often the widget fetches the image again, in minutes. |
| `url` | string | yes | The image address the widget will show. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `container_unavailable` | The widget state could not be saved, so the widget was not updated. | Try again, and check that widgets are set up for the app. |
| `missing_uri` | The call has no uri in the old widget:// form. | Pass the old address, written as widget:// followed by the image address. |

**Example: keeps the image url and refresh of the old spelling**

```js
const result = await dsx.module.imagewidget.receive({"uri":"widget://https://example.com/w.svg?refresh=30"});
// resolves {"ok":true,"refresh":30,"url":"https://example.com/w.svg"}
```

**Example: repairs the colon the v3 host dropped and keeps the author's own parameters**

```js
const result = await dsx.module.imagewidget.receive({"uri":"widget://https//example.com/w.png?user=7&refresh=5"});
// resolves {"ok":true,"refresh":5,"url":"https://example.com/w.png?user=7"}
```

### set

`dsx.module.imagewidget.set`

Sets the image the widget shows, and optionally how often it is fetched again.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `refresh` | number | no | How often to fetch the image again, in minutes. |
| `url` | string | yes | The web address of the image to show. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the widget image was set. |
| `url` | string | yes | The image address the widget will show. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_url` | The call has no image address. | Pass the web address of the image in url. |

**Example: keeps an image url**

```js
const result = await dsx.module.imagewidget.set({"refresh":15,"url":"https://example.com/w.png"});
// resolves {"ok":true,"url":"https://example.com/w.png"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `description` | multiline | `` | The description shown in the widget gallery. |
| `fallback_url` | url | `` | The image the widget shows before the app has set one. |
| `name` | string | `` | The image widget's name in the widget gallery. |

## Related packages

- Needs: [Widgets](/packages/widget)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
