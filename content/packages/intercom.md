---
title: Intercom
description: Add Intercom's Messenger so users can chat with support, read help articles and track tickets.
package: intercom
---

Add Intercom's Messenger so users can chat with support, read help articles and track tickets.

Identifies the signed-in person to Intercom, keeps their name, email and custom details current, and opens the Messenger on home, messages, help or tickets. You can also show the unread count. Needs an Intercom account, your App ID and the iOS and Android API keys, plus a server-made identity hash. iOS and Android only.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when your support team answers customers in Intercom and you want its Messenger inside your app. If you only need a simple contact form, you do not need it.

## What native adds

The native Intercom Messenger opens as a real screen, with unread counts and notifications, instead of a web page inside the app.

## Install

```sh
despia add Core/Intercom
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone.

## Actions

### hide

`dsx.module.intercom.hide`

Closes the Intercom Messenger if it is open.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

_None._

**Example: hides**

```js
const result = await dsx.module.intercom.hide({});
// resolves {}
```

### login

`dsx.module.intercom.login`

Tells Intercom who the signed-in person is, using their user id or email and the identity hash your server made. A different person replaces the current one.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `email` | string | no | The person's email address. Give this or userId. |
| `userHash` | string | no | The identity-verification hash that your server computes for this person with your Intercom key. |
| `userId` | string | no | Your own id for the person. Give this or email. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `loggedIn` | boolean | yes | True when Intercom accepted the person. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_param` | Neither a user id nor an email was given. | Pass a userId or an email. |
| `not_configured` | Intercom has no app ID or API key for this platform. | Set the app ID and the platform API key in the package config. |
| `not_ready` | Intercom is not running yet, because consent is missing or the app has not finished launching. | Try again a moment later, after consent is given. |
| `sdk_error` | The Intercom SDK rejected the call for a reason it did not detail. | Try again later. |

**Example: logs in a user id**

```js
const result = await dsx.module.intercom.login({"userId":"u-42"});
// resolves {"loggedIn":true}
```

### loginAnonymous

`dsx.module.intercom.loginAnonymous`

Starts Intercom for a visitor who has not signed in yet, so they can still ask for help.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `loggedIn` | boolean | yes | True when Intercom accepted the anonymous visitor. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_configured` | Intercom has no app ID or API key for this platform. | Set the app ID and the platform API key in the package config. |
| `not_ready` | Intercom is not running yet, because consent is missing or the app has not finished launching. | Try again a moment later, after consent is given. |
| `sdk_error` | The Intercom SDK rejected the call for a reason it did not detail. | Try again later. |

**Example: starts an anonymous visitor**

```js
const result = await dsx.module.intercom.loginAnonymous({});
// resolves {"loggedIn":true}
```

### logout

`dsx.module.intercom.logout`

Makes Intercom forget the person on this device, for example when they sign out. It never fails.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

_None._

**Example: logs out**

```js
const result = await dsx.module.intercom.logout({});
// resolves {}
```

### present

`dsx.module.intercom.present`

Opens the Intercom Messenger on the part you choose: home, messages, help or tickets.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `space` | string | no | Which part to open: home (the default), messages, help or tickets. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_param` | The space is not one Intercom offers. | Use home, messages, help or tickets. |
| `not_configured` | Intercom has no app ID or API key for this platform. | Set the app ID and the platform API key in the package config. |
| `not_ready` | Intercom is not running yet, because consent is missing or the app has not finished launching. | Try again a moment later, after consent is given. |
| `sdk_error` | The Intercom SDK rejected the call for a reason it did not detail. | Try again later. |

**Example: opens messages**

```js
const result = await dsx.module.intercom.present({"space":"messages"});
// resolves {}
```

### update

`dsx.module.intercom.update`

Keeps the person's name, email, phone and custom details up to date in Intercom.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attributes` | object | no | Your own custom details as names with text, number or true/false values. Names cannot contain a period or a dollar sign. |
| `email` | string | no | The person's email address. |
| `name` | string | no | The person's full name as shown to your support team. |
| `phone` | string | no | The person's phone number. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_param` | One of the custom details cannot be stored by Intercom. | Use text, number or true/false values and avoid periods and dollar signs in names. |
| `missing_param` | There was nothing to update. | Pass at least one of name, email, phone or attributes. |
| `not_configured` | Intercom has no app ID or API key for this platform. | Set the app ID and the platform API key in the package config. |
| `not_ready` | Intercom is not running yet, because consent is missing or the app has not finished launching. | Try again a moment later, after consent is given. |
| `sdk_error` | The Intercom SDK rejected the call for a reason it did not detail. | Try again later. |

**Example: updates a custom attribute**

```js
const result = await dsx.module.intercom.update({"attributes":{"plan":"pro"}});
// resolves {}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `android_api_key` | string | `` | The Android SDK key from Intercom's installation settings (starts with android_sdk-). Public: it ships in every Intercom Android app. |
| `app_id` | string | `` | Your Intercom workspace's app ID (Settings, Installation). The web Messenger and both SDKs use it. |
| `ios_api_key` | string | `` | The iOS SDK key from Intercom's installation settings (starts with ios_sdk-). Public: it ships in every Intercom iOS app. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
