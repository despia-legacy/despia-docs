---
title: Sign in with Google
description: Let people sign in to your app with their Google account.
package: google
---

Let people sign in to your app with their Google account.

Adds a Continue with Google option that uses Google's own sign-in on the web, iOS and Android, then passes the Google ID token to your account service. Needs a Google Cloud project with OAuth client ids for web and iOS, plus the reversed iOS client id as the URL scheme.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Add it when you want a Continue with Google button in your sign-in. You call the shared sign-in with the method google; this package has no calls of its own. Skip it if your app offers no account sign-in.

## What native adds

Uses Google's own sign-in on each platform (Google Identity Services, the Google Sign-In SDK, Android Credential Manager), so people get the account chooser they already know.

## Install

```sh
despia add Core/Auth/Google
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

_This package declares no actions._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `clientId` | string | `` | The OAuth client id of type Web application from your Google Cloud project. The web lane signs in with it, and Android uses it as the server client id. |
| `iosClientId` | string | `` | The OAuth client id of type iOS from the same project. |
| `iosUrlScheme` | string | `com.googleusercontent.apps.not-configured` | The iOS client id reversed (com.googleusercontent.apps.<number>-<suffix>), which the Google Sign-In SDK requires as a URL scheme. |

## Related packages

- Needs: [Auth](/packages/auth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
