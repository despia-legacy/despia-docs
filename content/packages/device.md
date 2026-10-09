---
title: Device
description: Read the device, the app's own identity, the screen, locale, battery and display capabilities.
package: device
---

Read the device, the app's own identity, the screen, locale, battery and display capabilities.

Gives you plain answers about the phone or tablet the app runs on: hardware and OS, the app's version and first-launch state, screen size with real safe-area insets, language and region, battery and thermal state, and which hardware features exist. It needs no permission and never polls. You decide how your screens adapt to the answers.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when a screen must adapt to the device: safe-area padding, a first-launch welcome, a what's-new sheet, lighter effects on old or hot hardware, or locale-aware formatting. It does not tell you whether the user granted a permission; use the package that owns that feature.

## What native adds

The numbers come straight from the OS, including real safe-area insets and screen corner radius that a web page cannot read reliably.

## Install

```sh
despia add Core/Device
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

### app

`dsx.module.device.app`

Returns the app's own identity, such as its name, version and bundle id, plus whether this is the first launch and which version was installed before.

**When to use it.** Use it to show onboarding once, or a what's-new sheet after an update.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `buildNumber` | string | yes | The app's build number. |
| `bundleId` | string | yes | The app's bundle or package identifier. |
| `installReferrer` | string | no | The install referrer string, where the platform provides one. |
| `installSource` | string | no | Where the app was installed from, such as a store or TestFlight, where the platform says. |
| `installTime` | number | no | When the app was first installed, as a timestamp. |
| `installationId` | string | no | A random id made for this install. It is not an advertising id and is absent when generating it is switched off. |
| `isFirstLaunch` | boolean | yes | True only on the first launch after install, and for the whole of that first session. |
| `lastUpdateTime` | number | no | When the app was last updated, as a timestamp. |
| `name` | string | yes | The name of the app as shown on the home screen. |
| `previousVersion` | string | no | The version that was installed before this one; absent on a fresh install. |
| `version` | string | yes | The app's version string. |

**Example: the very first launch after install**

```js
const result = await dsx.module.device.app({});
// resolves {"buildNumber":"412","bundleId":"com.acme.app","installSource":"appstore","installTime":1735689600000,"installationId":"6f1e2c00-6b3a-4a2e-9f0c-2f6f0a0c9c11","isFirstLaunch":true,"lastUpdateTime":1735689600000,"name":"Acme","version":"2.0.0"}
```

**Example: the first launch after an upgrade reports what was installed before**

```js
const result = await dsx.module.device.app({});
// resolves {"buildNumber":"412","bundleId":"com.acme.app","installSource":"appstore","installTime":1704067200000,"installationId":"6f1e2c00-6b3a-4a2e-9f0c-2f6f0a0c9c11","isFirstLaunch":false,"lastUpdateTime":1735689600000,"name":"Acme","previousVersion":"1.4.0","version":"2.0.0"}
```

### capabilities

`dsx.module.device.capabilities`

Returns yes-or-no facts about hardware and display features, such as cellular, Apple Pencil support, haptics and HDR.

**When not to.** It answers only whether the hardware exists, never whether the user granted a permission.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alwaysOnDisplay` | boolean | yes | True when the display can stay on at low power. |
| `cellular` | boolean | yes | True when the device has a cellular modem. |
| `haptics` | boolean | yes | True when the device has a haptic engine. |
| `hdr` | boolean | yes | True when the display supports HDR. |
| `pencil` | boolean | yes | True when the device supports Apple Pencil. |
| `telephony` | boolean | yes | True when the device can place phone calls. |
| `wideColor` | boolean | yes | True when the display supports wide color. |

**Example: a modern phone**

```js
const result = await dsx.module.device.capabilities({});
// resolves {"alwaysOnDisplay":true,"cellular":true,"haptics":true,"hdr":true,"pencil":false,"telephony":true,"wideColor":true}
```

**Example: a wifi-only tablet with a stylus**

```js
const result = await dsx.module.device.capabilities({});
// resolves {"alwaysOnDisplay":false,"cellular":false,"haptics":false,"hdr":true,"pencil":true,"telephony":false,"wideColor":true}
```

### info

`dsx.module.device.info`

Returns facts about the hardware and operating system, such as the brand, model, OS version and memory.

**When to use it.** Use it for support screens, diagnostics or to pick lighter effects on older hardware.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `brand` | string | no | The device brand, such as Apple or Google. |
| `designName` | string | no | The internal design or board name, where the platform has one. |
| `deviceType` | string | yes | The kind of device: phone, tablet, desktop, tv or watch. |
| `deviceYearClass` | number | no | A rough year bucket for how old the hardware class is, for dropping heavy effects on old devices. It is not a benchmark. |
| `isDevice` | boolean | no | True on a real device and false on a simulator or emulator. |
| `isRooted` | boolean | no | A hint that the device is rooted or jailbroken. Easy to fool, so use it only to soften features. |
| `manufacturer` | string | no | The company that made the device. |
| `model` | string | no | The model name as the platform reports it. Android gives the marketing name; iOS gives only the family such as iPhone. |
| `modelId` | string | no | The technical model identifier, such as iPhone16,1. Absent on Android. |
| `osBuild` | string | no | The operating system build string. |
| `osName` | string | yes | The name of the operating system, such as iOS or Android. |
| `osVersion` | string | yes | The version number of the operating system. |
| `supportedCpuArchitectures` | array of string | no | The processor architectures the device supports. |
| `totalMemory` | number | no | How much memory the device has in total, in bytes; useful to scale back heavy features. |

**Example: describes an iPhone**

```js
const result = await dsx.module.device.info({});
// resolves {"brand":"Apple","deviceType":"phone","deviceYearClass":2023,"isDevice":true,"isRooted":false,"manufacturer":"Apple","model":"iPhone","modelId":"iPhone16,1","osBuild":"22C152","osName":"iOS","osVersion":"18.2","supportedCpuArchitectures":["arm64"],"totalMemory":8589934592}
```

**Example: describes an Android phone, where the design name is the board and there is no model id**

```js
const result = await dsx.module.device.info({});
// resolves {"brand":"google","designName":"shiba","deviceType":"phone","deviceYearClass":2023,"isDevice":true,"isRooted":false,"manufacturer":"Google","model":"Pixel 8","osBuild":"AP4A.250105.002","osName":"Android","osVersion":"15","supportedCpuArchitectures":["arm64-v8a"],"totalMemory":8589934592}
```

### locale

`dsx.module.device.locale`

Returns the user's language preferences, region, time zone, currency, measurement system and text direction.

**When to use it.** Use it to format dates, numbers and units the way the user expects.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `calendar` | string | yes | The calendar system in use, such as gregorian. |
| `currency` | string | no | The currency code for the user's region. |
| `hour12` | boolean | yes | True when the user prefers a 12-hour clock. |
| `isRTL` | boolean | yes | True when the language is written right to left. |
| `locales` | array of string | yes | The user's preferred language tags, most preferred first. |
| `measurementSystem` | string | yes | Metric, US or UK units. |
| `region` | string | no | The user's region code, such as CH. |
| `temperatureUnit` | string | no | The temperature unit the user prefers. |
| `timezone` | string | yes | The time zone name, such as Europe/Zurich. |

**Example: a US English device**

```js
const result = await dsx.module.device.locale({});
// resolves {"calendar":"gregorian","currency":"USD","hour12":true,"isRTL":false,"locales":["en-US"],"measurementSystem":"us","region":"US","temperatureUnit":"fahrenheit","timezone":"America/New_York"}
```

**Example: a German device keeps the whole preference list**

```js
const result = await dsx.module.device.locale({});
// resolves {"calendar":"gregorian","currency":"EUR","hour12":false,"isRTL":false,"locales":["de-DE","en-US"],"measurementSystem":"metric","region":"DE","temperatureUnit":"celsius","timezone":"Europe/Berlin"}
```

### power

`dsx.module.device.power`

Returns the battery level and charging state, whether low power mode is on, and how hot the device is.

**When to use it.** Use it to pause heavy work when the battery is low or the device is hot.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | number | no | The battery level from 0 to 1. |
| `lowPowerMode` | boolean | yes | True when the device is in low power or battery saver mode. |
| `state` | string | yes | The charging state: charging, full, unplugged or unknown. |
| `thermalState` | string | no | How hot the device is: nominal, fair, serious or critical. |

**Example: reports a charging battery**

```js
const result = await dsx.module.device.power({});
// resolves {"level":0.62,"lowPowerMode":false,"state":"charging","thermalState":"nominal"}
```

**Example: reports low power mode on an unplugged device**

```js
const result = await dsx.module.device.power({});
// resolves {"level":0.14,"lowPowerMode":true,"state":"unplugged","thermalState":"fair"}
```

### screen

`dsx.module.device.screen`

Returns the screen size, pixel scale, text scale, refresh rate, safe-area insets and corner radius.

**When to use it.** Use it to place custom bars above the home indicator or to match a card to the screen's corners.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cornerRadius` | number | no | The display's own corner radius in points; absent when the platform does not say. |
| `fontScale` | number | yes | The user's text size multiplier. |
| `hasDynamicIsland` | boolean | yes | True when the device has a Dynamic Island. |
| `hasNotch` | boolean | yes | True when the screen has a notch. |
| `height` | number | yes | The screen height in points. |
| `insets` | object | yes | The safe-area insets in points: the space taken by the notch, status bar and home indicator. |
| `insets.bottom` | number | yes | Safe-area space at the bottom, in points. |
| `insets.left` | number | yes | Safe-area space on the left, in points. |
| `insets.right` | number | yes | Safe-area space on the right, in points. |
| `insets.top` | number | yes | Safe-area space at the top, in points. |
| `refreshRate` | number | no | The screen refresh rate in hertz. |
| `scale` | number | yes | The number of pixels per point. |
| `width` | number | yes | The screen width in points. |

**Example: a Dynamic Island phone reports its insets and its display radius**

```js
const result = await dsx.module.device.screen({});
// resolves {"cornerRadius":55,"fontScale":1,"hasDynamicIsland":true,"hasNotch":false,"height":852,"insets":{"bottom":34,"left":0,"right":0,"top":59},"refreshRate":120,"scale":3,"width":393}
```

**Example: a notched phone is a notch, not an island**

```js
const result = await dsx.module.device.screen({});
// resolves {"cornerRadius":47.33,"fontScale":1,"hasDynamicIsland":false,"hasNotch":true,"height":844,"insets":{"bottom":34,"left":0,"right":0,"top":47},"refreshRate":60,"scale":3,"width":390}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `generate_installation_id` | boolean | `true` | Mint a random per-install UUID that survives across launches. |
| `track_battery` | boolean | `true` | Keep the battery level and charging state live, so markup can react to them. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
