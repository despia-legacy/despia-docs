---
title: App updates
description: Tell users when a newer version is available and take them to it.
package: appupdate
---

Tell users when a newer version is available and take them to it.

Checks whether a newer version of your app exists and lets you show an update banner. Opens the App Store sheet on iOS, and Google Play's flexible or immediate update flow on Android. Also supports installing a downloaded update. Phones only.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to tell people a newer version of your app is out and send them to it. It draws no screen, so you show your own banner when the update context says one is available.

## What native adds

On Android it uses Google Play's own update flow, and on iOS Apple's product sheet, so the update installs through the store without leaving your app.

## Install

```sh
despia add Core/AppUpdate
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone.

## Actions

### check

`dsx.module.appupdate.check`

Asks the store whether a newer version of your app is available and returns the current and latest versions.

**When to use it.** Call it at launch or when the app returns to the foreground, then show your own update banner.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `country` | string | no | The two-letter App Store country to look in, for example US; defaults to the device's store. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `available` | boolean | yes | True when a newer version can be installed. |
| `current` | string | yes | The version that is installed now. |
| `latest` | string | yes | The newest version found in the store. |
| `source` | string | yes | Where the answer came from: the App Store, Google Play or the web service worker. |
| `url` | string | yes | The store address of the app, which open can use. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `network_unavailable` | The App Store could not be reached. | Try again when the device is online. |
| `not_found` | The app is not in the App Store for this country. | Check that the app is published in this storefront. |
| `store_unavailable` | Google Play is not available on this device. | Skip the update check on devices without Google Play. |
| `unavailable` | This build has no bundle identifier or version to compare with the store. | Check the app's bundle id and version in your build settings. |
| `unreadable` | The store's answer could not be understood. | Try again later. |

**Example: reports a newer store version**

```js
const result = await dsx.module.appupdate.check({});
// resolves {"available":true,"current":"1.2.0","latest":"1.3.0","source":"appstore","url":"https://apps.apple.com/app/id123"}
```

### complete

`dsx.module.appupdate.complete`

On Android, installs a flexible update that has finished downloading, which restarts the app.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `installing` | boolean | yes | True when Play started installing the update. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_downloaded` | No downloaded update is waiting to be installed. | Wait until the update context says it has downloaded. |
| `store_unavailable` | Google Play is not available on this device. | Skip updates on devices without Google Play. |

**Example: installs the downloaded update**

```js
const result = await dsx.module.appupdate.complete({});
// resolves {"installing":true}
```

### open

`dsx.module.appupdate.open`

Takes the person to the update: Apple's product sheet on iOS, Google Play's update flow on Android, or a reload on the web.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `mode` | string | no | Android only: flexible (the default) downloads while the app runs and then needs complete, immediate shows Play's full-screen update. |
| `url` | string | no | iOS only: the store address to open; defaults to the app found by the last check. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `outcome` | string | yes | On Android, accepted or cancelled depending on what the person chose in Play. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_presenter` | No screen was found to show the update sheet from. | Try again while the app is in the foreground. |
| `not_available` | No update of that kind is available right now. | Check again, or try the other mode. |
| `not_checked` | There is no update to open yet because check has not run. | Call check first. |
| `unavailable` | The App Store could not be opened. | Try again later. |

**Example: opens the update**

```js
const result = await dsx.module.appupdate.open({"mode":"flexible"});
// resolves {"outcome":"accepted"}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
