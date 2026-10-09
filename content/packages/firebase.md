---
title: Firebase Cloud Messaging
description: Send push notifications to your app's users through Firebase Cloud Messaging.
package: firebase
---

Send push notifications to your app's users through Firebase Cloud Messaging.

Sets up your app's Firebase identity and registers each device with Firebase Cloud Messaging, so you can send pushes from the Firebase console or your server. Use it when your team already runs on Firebase. Needs a Firebase project; on Android it asks for the Firebase App ID, API key, project ID and sender ID, and on iOS your GoogleService-Info.plist.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when your team sends push notifications through Firebase Cloud Messaging. If you use another push provider such as OneSignal, you do not need it.

## Install

```sh
despia add Core/Firebase
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

`dsx.module.firebase.app`

Starts the shared Firebase app once and reports its identity. Other Firebase packages call it so initialisation happens in one place.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `appId` | string | yes | The Firebase app ID of this build. |
| `configured` | boolean | yes | True when this build carries a usable Firebase identity. |
| `projectId` | string | yes | The Firebase project ID of this build. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | This build carries no Firebase identity. Add GoogleService-Info.plist (Apple) or the android_app_id / android_api_key config keys (Android). | Not recoverable by retrying. |

**Example: brings the shared Firebase app up and reports the identity it started with**

```js
const result = await dsx.module.firebase.app({});
// resolves {"appId":"1:1234567890:ios:abc123","configured":true,"projectId":"despia-demo"}
```

**Example: a second call is the same app, not a second one**

```js
const result = await dsx.module.firebase.app({});
// resolves {"appId":"1:1234567890:ios:abc123","configured":true,"projectId":"despia-demo"}
```

### subscription.get

`dsx.module.firebase.subscription.get`

Returns this install's push subscription: its Firebase installation id, the FCM address your server sends to, and whether it is opted in.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The Firebase installation id. Empty until Firebase has started. |
| `optedIn` | boolean | yes | True when this app has push turned on with Firebase, which is separate from the system notification permission. |
| `token` | string | yes | The FCM registration value your server uses to reach this device. Empty until Firebase has started. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Firebase push is not turned on in this build. | Turn on push in the package config and ship the Firebase identity files or keys. |
| `unsupported_platform` | This runtime has no FCM registration value. | Use push only on iOS and Android. |

**Example: returns the installation id, the FCM token and the opt-in**

```js
const result = await dsx.module.firebase.subscription.get({});
// resolves {"id":"fid_abc","optedIn":true,"token":"fcm_registration_abc"}
```

**Example: before FCM has started the ids are empty, not a failure**

```js
const result = await dsx.module.firebase.subscription.get({});
// resolves {"id":"","optedIn":false,"token":""}
```

### subscription.set

`dsx.module.firebase.subscription.set`

Opts this install in or out of Firebase push. Opting out deletes the FCM registration so Firebase stops addressing the device.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `optedIn` | boolean | yes | True to turn push on, false to turn it off and delete the registration. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The Firebase installation id after the change. |
| `optedIn` | boolean | yes | Whether this install is now opted in. |
| `token` | string | yes | The FCM registration value after the change, empty when opted out. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | The optedIn value was missing or not true or false. | Pass true or false. |
| `not_configured` | Firebase push is not turned on in this build. | Turn on push in the package config and ship the Firebase identity files or keys. |
| `unavailable` | Firebase could not delete the registration this time. | Try again. |
| `unsupported_platform` | This runtime has no FCM registration value. | Use push only on iOS and Android. |

**Example: opts out and deletes the token**

```js
const result = await dsx.module.firebase.subscription.set({"optedIn":false});
// resolves {"id":"fid_abc","optedIn":false,"token":""}
```

### topics.subscribe

`dsx.module.firebase.topics.subscribe`

Subscribes this install to an FCM topic so you can send one message to everyone on it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `topic` | string | yes | The topic name, using letters, digits and - _ . ~ % only. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `topic` | string | yes | The topic this install is now subscribed to. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | The topic is empty or has characters that are not allowed. | Use a topic name made of letters, digits and - _ . ~ %. |
| `not_configured` | Firebase push is not turned on in this build. | Turn on push in the package config. |
| `unavailable` | Firebase has not started yet or could not change the topic. | Opt in once notifications are allowed, then try again. |
| `unsupported_platform` | This runtime has no FCM registration value. | Use push only on iOS and Android. |

**Example: changes the topic**

```js
const result = await dsx.module.firebase.topics.subscribe({"topic":"news"});
// resolves {"topic":"news"}
```

### topics.unsubscribe

`dsx.module.firebase.topics.unsubscribe`

Removes this install from an FCM topic so it stops receiving that topic's messages.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `topic` | string | yes | The topic name to leave. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `topic` | string | yes | The topic this install has left. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | The topic is empty or has characters that are not allowed. | Use a topic name made of letters, digits and - _ . ~ %. |
| `not_configured` | Firebase push is not turned on in this build. | Turn on push in the package config. |
| `unavailable` | Firebase has not started yet or could not change the topic. | Opt in once notifications are allowed, then try again. |
| `unsupported_platform` | This runtime has no FCM registration value. | Use push only on iOS and Android. |

**Example: changes the topic**

```js
const result = await dsx.module.firebase.topics.unsubscribe({"topic":"news"});
// resolves {"topic":"news"}
```

## Events

Read with `dsx.on(name, handler)`.

### subscription

Fires when the FCM registration arrives, changes or is deleted, or when you change the opt-in.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The Firebase installation id of this install. |
| `optedIn` | boolean | yes | Whether this install is opted in to push. |
| `token` | string | yes | The current FCM registration value. |

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `android_api_key` | string | `` | The Android app's Firebase API key, taken from google-services.json; it matches the API_KEY in the iOS plist. |
| `android_app_id` | string | `` | The Google App ID of the ANDROID app (Firebase console → Project settings → Your apps, e.g. 1:1234567890:android:abc123). Leave empty to keep Firebase push off on Android. |
| `android_project_id` | string | `` | The Firebase project ID (optional; needed for some Firebase services beyond plain FCM). |
| `android_sender_id` | string | `` | The Cloud Messaging sender ID, which is the numeric project number. It is optional because the app ID already includes it. |
| `enhance_url_with_push_id` | boolean | `false` | Extend the WebView main URL with ?firebase_push_id=XYZ so the web app can read the FCM token. |
| `fcm_topic` | string | `` | Optional Firebase topic to subscribe every device to. |
| `push_enabled` | boolean | `false` | Activate Firebase Cloud Messaging push (download and replace GoogleService-Info.plist from the Firebase dashboard first). |

## Related packages

- Used by: [Call](/packages/call), [PushToTalk](/packages/ptt), [FirebasePerformance](/packages/firebaseperformance)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
