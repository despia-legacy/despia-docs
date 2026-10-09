---
title: V3 compatibility
description: Keep the old window.despia calls from your V3 app working after you move to V4.
package: legacy
---

Keep the old window.despia calls from your V3 app working after you move to V4.

V3 pages talk to the native app with calls like window.despia = "lighthaptic://" and read old global variables and callbacks. This package catches those calls and runs them through the current packages, so your existing pages keep working without edits. Add it when moving a V3 app, and drop it once your pages use the new calls. It only covers features the other packages in your app provide.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when you are moving a V3 app to V4 and your pages still call window.despia with old spellings such as lighthaptic:// or read old globals. Leave it out of new apps, and drop it once your pages use the current calls.

## What native adds

It answers the old calls inside the native app, so existing pages keep working without edits while you migrate.

## Install

```sh
despia add Core/Legacy
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

### adTap

`dsx.module.legacy.adTap`

Counts one touch toward the old show-an-ad-after-X-taps behaviour and shows the full-screen ad when the count is reached.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `auto` | boolean | no | True when the call comes from the page script on every touch; the touch then counts only if counting taps is switched on. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `counting` | boolean | yes | True while taps are still being counted toward the next ad. |

**Example: counts a touch**

```js
const result = await dsx.module.legacy.adTap({});
// resolves {"counting":true}
```

### cameraBurst

`dsx.module.legacy.cameraBurst`

Takes a burst of photos for the old camera://burst call and returns them in the old shape, with file paths or base64 data.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `camera` | string | no | Which camera to use, such as front or back. |
| `count` | number | no | How many photos to take in the burst. |
| `encode` | string | no | Set to base64 to get the photos as base64 text instead of file paths. |
| `interval` | number | no | The time between photos, in milliseconds. |
| `quality` | number | no | The image quality of each photo. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many photos were taken. |
| `durationMs` | number | yes | How long the burst took, in milliseconds. |
| `photos` | array of object | yes | The photos taken, each in the old shape with a path or base64 data. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `busy` | A photo burst is already running. | Wait for the current burst to finish. |
| `capture_failed` | The camera session could not be started. | Try again, and check that no other app is using the camera. |
| `not_loaded` | The current package that this old call depends on is not part of this build. | Add that package and make a new build. |
| `permission_denied` | The user has not allowed the access this call needs, such as the camera or adding photos. | Ask for the permission, or send the user to Settings. |
| `unavailable` | This device has no camera. | Hide the camera feature on this device. |

**Example: Take a burst of three photos**

```js
const result = await dsx.module.legacy.cameraBurst({"camera":"back","count":3,"interval":300});
// resolves {"count":3,"durationMs":900,"photos":[{"bytes":182000,"height":1080,"path":"/cache/burst-1.jpg","timestamp":1790000000000,"width":1920}]}
```

### cameraCapabilities

`dsx.module.legacy.cameraCapabilities`

Answers the old camera://capabilities call with which cameras exist and the largest burst the device allows.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `back` | boolean | yes | True when the device has a back camera. |
| `front` | boolean | yes | True when the device has a front camera. |
| `maxBurst` | number | no | The largest number of photos one burst can take. |

**Example: reports the v3 capability shape, each lens from the one probe**

```js
const result = await dsx.module.legacy.cameraCapabilities({});
// resolves {"back":true,"front":true,"maxBurst":60}
```

### disableAds

`dsx.module.legacy.disableAds`

Handles the old disableads:// call by saving a compatibility setting that stops the old automatic ads.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ads` | string | yes | The state of the old ad setting after the call. |

**Example: switches the v3 configured ads off**

```js
const result = await dsx.module.legacy.disableAds({});
// resolves {"ads":"disabled"}
```

### enableAds

`dsx.module.legacy.enableAds`

Handles the old enableads:// call by clearing that setting so the configured ads run again. An ad-removal purchase still suppresses them.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ads` | string | yes | The state of the old ad setting after the call. |

**Example: switches the v3 configured ads back on**

```js
const result = await dsx.module.legacy.enableAds({});
// resolves {"ads":"enabled"}
```

### has

`dsx.module.legacy.has`

Answers the old biometric://available call by saying whether a named feature is available on this device.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `member` | string | yes | The name of the feature to check, for example biometric.authenticate. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `available` | boolean | yes | True when the feature can be used on this device. |

**Example: an unknown member is not available**

```js
const result = await dsx.module.legacy.has({"member":"nosuchmodule.nosuchaction"});
// resolves {"available":false}
```

### inline

`dsx.module.legacy.inline`

Turns a shared image file into the old data URL form that V3 pages expected when something was shared into the app.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `path` | string | yes | The path of a file the app received from a share, starting with inbox:. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `dataURL` | string | yes | The image as a data URL, in the form V3 pages expect. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_path` | The path is not a shared file path. | Pass an inbox: path that came from a share. |
| `not_found` | No shared file exists at that path. | Check the path from the share result. |
| `too_large` | The image is too large to pass inline the way V3 pages did. | Share a smaller image. |
| `type_refused` | The file is not an image, and V3 pages only ever received images. | Share an image. |

**Example: Read a shared image as a data URL**

```js
const result = await dsx.module.legacy.inline({"path":"inbox:photo.jpg"});
// resolves {"dataURL":"data:image/jpeg;base64,/9j/4AAQ"}
```

### interstitial

`dsx.module.legacy.interstitial`

Shows a full-screen ad for the old admob://interstitial call and reports whether it was shown, unless ads are disabled.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `shown` | boolean | yes | True when the ad was shown. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `disabled` | Ads are switched off, either by the old disable-ads setting or by an ad-removal purchase. | Do not show ads, or call enableAds if the setting should be lifted. |

**Example: shows through admob.show**

```js
const result = await dsx.module.legacy.interstitial({});
// resolves {"shown":true}
```

### map

`dsx.module.legacy.map`

Tells you which current call an old V3 spelling would become, without running anything.

**When to use it.** Use it to check a migration, one old call at a time.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | yes | The whole old spelling to look up or run, such as lighthaptic://. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `action` | string | no | The action it maps to. |
| `chain` | string | no | The package the old spelling maps to. |
| `mapped` | boolean | yes | True when the old spelling has a current call. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_uri` | No old spelling was passed. | Pass the whole old scheme://... text as uri. |

**Example: names the modern target of a mapped spelling**

```js
const result = await dsx.module.legacy.map({"uri":"lighthaptic://"});
// resolves {"action":"light","chain":"haptic","mapped":true}
```

**Example: answers an unmapped spelling honestly**

```js
const result = await dsx.module.legacy.map({"uri":"zz-nobody-owns-this://"});
// resolves {"mapped":false}
```

### nearbyCapabilities

`dsx.module.legacy.nearbyCapabilities`

Answers the old nearby://capabilities call with the availability, Bluetooth and Wi-Fi facts and payload limits V3 pages expect.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `available` | boolean | yes | True when the feature can be used on this device. |
| `bluetooth` | boolean | yes | True when Bluetooth can be used. |
| `maxPayloadBytes` | number | no | The largest message that can be sent, in bytes. |
| `strategies` | array of string | no | The connection strategies the device supports. |
| `wifi` | boolean | yes | True when Wi-Fi can be used. |

**Example: reports the v3 capability shape, all three booleans from the one probe**

```js
const result = await dsx.module.legacy.nearbyCapabilities({});
// resolves {"available":true,"bluetooth":true,"maxPayloadBytes":32768,"strategies":["star","cluster","p2p"],"wifi":true}
```

### oauthLand

`dsx.module.legacy.oauthLand`

Loads the sign-in callback into the app after an old-style OAuth login finishes, so V3 pages see the result.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `url` | string | yes | The web address to use. It must be an http or https address, or a path on the app's own site. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `loaded` | boolean | yes | True when the callback was loaded into the app. |

**Example: a callback with no path loads nothing**

```js
const result = await dsx.module.legacy.oauthLand({"url":"myapp://oauth"});
// resolves {"loaded":false}
```

### pageSheet

`dsx.module.legacy.pageSheet`

Opens a web address in a sheet over the app for the old pagesheet://open call.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `url` | string | yes | The web address to use. It must be an http or https address, or a path on the app's own site. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `surface` | string | yes | The name of the surface the sheet opened on. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_url` | The address is not an http or https address or a path on the app's own site. | Pass a full http or https address. |

**Example: Open a page in a sheet**

```js
const result = await dsx.module.legacy.pageSheet({"url":"https://example.com/terms"});
// resolves {"surface":"legacy.pagesheet.1"}
```

### receive

`dsx.module.legacy.receive`

Runs one old V3 spelling as if a page had sent it, then delivers the old-style reply.

**When to use it.** Use it to test an old call from your own code.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uri` | string | yes | The whole old spelling to look up or run, such as lighthaptic://. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `handled` | boolean | yes | True when the old spelling was recognised and run. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_uri` | No old spelling was passed. | Pass the whole old scheme://... text as uri. |

**Example: drops an unmapped spelling**

```js
const result = await dsx.module.legacy.receive({"uri":"zz-nobody-owns-this://"});
// resolves {"handled":false}
```

### rewarded

`dsx.module.legacy.rewarded`

Shows a rewarded ad for the old displayrewardedad:// call and reports whether the user earned the reward.

**When not to.** New code should show rewarded ads through the ads package directly.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `amount` | number | yes | The size of the reward, when the ad network reports one. |
| `earned` | boolean | yes | True when the user earned the reward. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `disabled` | Ads are switched off, either by the old disable-ads setting or by an ad-removal purchase. | Do not show ads, or call enableAds if the setting should be lifted. |

**Example: shows through admob.show**

```js
const result = await dsx.module.legacy.rewarded({});
// resolves {"amount":10,"earned":true}
```

### saveImage

`dsx.module.legacy.saveImage`

Saves an image from a web address to the photo library for the old savethisimage:// call and shows the old confirmation alert.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `url` | string | yes | The web address to use. It must be an http or https address, or a path on the app's own site. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `saved` | boolean | yes | True when the image was saved to the photo library. |

**Example: saves the image and confirms**

```js
const result = await dsx.module.legacy.saveImage({"url":"https://example.com/a.png"});
// resolves {"saved":true}
```

### scanningMode

`dsx.module.legacy.scanningMode`

Turns the old scanning mode on or off, which raises the screen brightness to full and keeps the screen awake.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `mode` | string | yes | on holds full brightness, off restores it, and auto holds it until the next page loads. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | yes | True when scanning mode is now on. |
| `persistent` | boolean | yes | True when the setting stays until turned off rather than until the next page. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_mode` | The mode is not one of the three allowed values. | Pass on, off or auto. |

**Example: on holds the boost**

```js
const result = await dsx.module.legacy.scanningMode({"mode":"on"});
// resolves {"on":true,"persistent":true}
```

**Example: off restores**

```js
const result = await dsx.module.legacy.scanningMode({"mode":"off"});
// resolves {"on":false,"persistent":false}
```

### takeScreenshot

`dsx.module.legacy.takeScreenshot`

Takes a screenshot of the app and saves it to the photo library for the old takescreenshot:// call, then shows the old confirmation alert.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `saved` | boolean | yes | True when the image was saved to the photo library. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | The user has not allowed the access this call needs, such as the camera or adding photos. | Ask for the permission, or send the user to Settings. |
| `render_failed` | The screen could not be turned into an image. | Try again. |
| `save_failed` | The screenshot could not be saved to the photo library. | Try again, and check that there is free space. |

**Example: renders, saves and confirms**

```js
const result = await dsx.module.legacy.takeScreenshot({});
// resolves {"saved":true}
```

### visionOcr

`dsx.module.legacy.visionOcr`

Reads text from an inline image for the old vision://ocr call and starts the recognition.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | A name for this recognition, used in the temporary file. |
| `lang` | string | no | The language of the text in the image. |
| `src` | string | yes | The image to read, as a data URI or bare base64 text. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The label for this read, either the one you passed or a generated one. |
| `lines` | array of object | yes | The recognized lines in reading order, each with its text and, on iOS, a confidence from 0 to 1. |
| `text` | string | yes | All recognized text joined and cleaned into one string. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_data_uri` | The value is not a usable image data URI. | Pass a data:image/... URI or bare base64 image data. |
| `invalid_src` | The value is not a usable inline image. | Pass a data:image/... URI or bare base64 image data. |
| `not_loaded` | The current package that this old call depends on is not part of this build. | Add that package and make a new build. |

**Example: Read text from an image**

```js
const result = await dsx.module.legacy.visionOcr({"lang":"en","src":"data:image/png;base64,iVBORw0KGgo="});
// resolves {"id":"ocr_1","lines":[{"confidence":0.98,"text":"Hello world"}],"text":"Hello world"}
```

### webReset

`dsx.module.legacy.webReset`

Clears the app's web data, shows the old reset confirmation and reloads the page, for the old reset:// call.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cleared` | boolean | yes | True when the web data was cleared. |
| `reloaded` | boolean | yes | True when the page was reloaded. |

**Example: clears, confirms and reloads**

```js
const result = await dsx.module.legacy.webReset({});
// resolves {"cleared":true,"reloaded":true}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `admob_ads_trigger_urls` | list | `[]` | Navigations whose URL contains one of these substrings show a full-screen ad and proceed. |
| `ask_push_permission_at_first_run` | boolean | `false` | The v3 "Ask for push permission at first run" setting: ask for notification permission when the app starts. |
| `blockTrigger` | json | `[]` | Old page calls, listed by their prefix, that a page opened with pagesheet:// is not allowed to make. |
| `first_run_enabled` | boolean | `false` | Opt in to a one-time client-authored first-run notice on first launch. |
| `first_run_message` | multiline | `Thank you for downloading this app!` | Body of the first-run notice. |
| `first_run_title` | string | `Welcome!` | The heading of the one-time welcome alert shown the first time the app opens. |
| `increment_with_taps` | boolean | `true` | Count screen taps instead of page loads for the automatic full-screen ad cadence. |
| `interstitial_ads` | boolean | `true` | Let the v3 page and the automatic ads show interstitial ads, as the v3 dashboard's interstitial switch did. |
| `legacy_shortcuts` | json | `` | The v3 home-screen quick actions as JSON (redirection-link items). |
| `rate_app_enabled` | boolean | `false` | Opt in to the automatic rate-this-app prompt (1/10 chance, once) after the first screen settles. |
| `save_image_not_found_title` | string | `Image not found.` | Alert message shown when savethisimage:// could not load or save the image. |
| `save_image_saved_title` | string | `Image saved to your photo gallery.` | Alert message shown after savethisimage:// saved an image to the photo library. |
| `show_ad_after_x` | number | `5` | How many page loads (or taps) before the automatic full-screen ad shows. |
| `show_att_at_start` | boolean | `false` | The v3 "Show ATT at start" setting: ask for App Tracking Transparency when the app launches. |
| `show_full_screen_ad` | boolean | `false` | Show an interstitial/rewarded ad automatically after X page loads or taps. |
| `use_rewarded_ads_where_possible` | boolean | `false` | Use a rewarded ad instead of an interstitial for the automatic full-screen ad. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `package_missing` | An old call maps to a package that is not in this build, so the page gets no answer. | Add the missing package and make a new build. |

## Related packages

- Works better with: [Dom](/packages/dom)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
