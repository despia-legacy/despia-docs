---
title: Fonts
description: Use custom fonts in your app and measure text before it is drawn.
package: font
---

Use custom fonts in your app and measure text before it is drawn.

Lets your screens use real font files at any weight, slant, variable-font axis and OpenType feature, with text that still scales with the user's accessibility size. You list the fonts your app ships, can load a themed font after launch, and can measure text for layout. You bring the font files and check their licences.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when your brand needs its own typefaces, or when you need exact text widths for layout or truncation. If the system font is fine for your app, you do not need it.

## What native adds

Fonts are registered with the operating system, so text renders with the true face and respects the user's text size settings, which web font tricks do not match.

## Install

```sh
despia add Core/Fonts
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

### families

`dsx.module.font.families`

Lists the font families this build can draw, so a font picker only offers fonts that are really there.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `families` | array of object | yes | The font families the build can render, including any loaded since launch. |

**Example: an empty build declares no families**

```js
const result = await dsx.module.font.families({});
// resolves {"families":[]}
```

**Example: reports each declared family with its weights, slants and axes**

```js
const result = await dsx.module.font.families({});
// resolves {"families":[{"axes":{},"italic":true,"name":"Inter","source":"bundled","variable":false,"weights":[400,700]},{"axes":{"wght":[100,900]},"italic":false,"name":"Fraunces","source":"bundled","variable":true,"weights":[400]}]}
```

### load

`dsx.module.font.load`

Downloads a font after the app has launched and makes it available, for themes whose typeface is chosen later. The file must match the checksum you give, or it is discarded.

**When not to.** For fonts you know at build time, declare them in the package instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `family` | string | yes | The name to register the font under. |
| `italic` | boolean | no | True when this face is the italic one. |
| `sha256` | string | yes | The expected SHA-256 checksum of the file, used to verify the download. |
| `url` | string | yes | The https address of the font file. |
| `weight` | number | no | The weight of this face, such as 400 or 700. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `family` | string | yes | The family name the font was registered under. |
| `loaded` | boolean | yes | True when the font was downloaded, verified and registered. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `integrity_failed` | The downloaded font does not match its sha256. It was discarded and never registered. | Not recoverable by retrying. |
| `load_failed` | The font could not be downloaded or registered. |  |
| `unsupported_format` | That font format cannot be loaded on this platform. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot load fonts at runtime. | Not recoverable by retrying. |

**Example: registers a hash-verified face and reports the family**

```js
const result = await dsx.module.font.load({"family":"Cadence","sha256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","url":"https://cdn.example.com/Cadence-Regular.ttf"});
// resolves {"family":"Cadence","loaded":true}
```

### metrics

`dsx.module.font.metrics`

Measures a piece of text in a font family and size, giving its width, height and font proportions. Use it for layout math and truncation decisions.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `family` | string | yes | The font family to measure with; it must be one the build ships. |
| `features` | string | no | OpenType features to apply, such as tabular numbers, as four-letter tags. |
| `size` | number | yes | The font size in points. |
| `text` | string | yes | The piece of text you want to measure. |
| `weight` | number | no | The font weight to measure, such as 400 or 700. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ascent` | number | yes | How far the font rises above the baseline, in points. |
| `capHeight` | number | yes | The height of capital letters in points. |
| `descent` | number | yes | How far the font drops below the baseline, in points. |
| `height` | number | yes | The line height of the text in points. |
| `lineGap` | number | yes | The extra space the font adds between lines, in points. |
| `width` | number | yes | The width of the text in points. |
| `xHeight` | number | yes | The height of lowercase letters without ascenders, in points. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `axis_out_of_range` | A requested variable-font axis is outside the range this family declares. |  |
| `unknown_family` | No enabled package declares that font family. | Not recoverable by retrying. |

**Example: Measure a line of text**

```js
const result = await dsx.module.font.metrics({"family":"Inter","size":17,"text":"Hello","weight":400});
// resolves {"ascent":16.5,"capHeight":12.4,"descent":4.1,"height":20.6,"lineGap":0,"width":38.2,"xHeight":9.2}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `allow_runtime_load` | boolean | `false` | Let the app fetch a typeface at runtime for an over-the-air theme. Every load is pinned to a sha256 and a mismatch is discarded, but an app that never ships OTA themes should leave this off so no font can arrive from the network at all. |
| `load_timeout_seconds` | number | `10` | How long to wait for an over-the-air font before giving up. The text renders in the fallback face meanwhile, so a slow font is a late repaint, never a blank screen. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `axis_out_of_range` | A fontVariation axis is outside the range its family declares; it was clamped to the bound. |  |
| `unknown_family` | No enabled package declares that font family. |  |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
