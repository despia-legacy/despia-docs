---
title: The console
description: console.despia.com is where your team creates apps, builds them, connects the stores and ships. Everything in it also works from the CLI.
---

The [Despia console](https://console.despia.com) is the browser side of Despia. Use it to create apps, start and follow builds, connect your store accounts and manage your team. Every action in it has a CLI command too, so anything you do here can also run in CI.

## Workspace pages

| Page | What you do there |
| :-- | :-- |
| Apps | Create an app and open each one |
| Builds | Start iOS and Android builds and follow them |
| Packages | Browse native features and add them to an app |
| Members | Invite people and choose what each one can do |
| App Stores | Connect App Store Connect and Google Play once for the whole workspace |
| Connections | Link GitHub and the services your apps use |
| Access Tokens | Create tokens for the CLI in CI |
| Plan and Credits | Your plan, licences and build credits |

## Inside an app

Each app has its own pages: its builds, store submissions and releases, the packages it uses and their settings, its identifiers and signing, its secrets, and its settings such as the name and icon.

## Connecting the stores

Store connections belong to the workspace, so you add them once and every app can use them. You need:

- for iOS, an **App Store Connect API key**: the `.p8` file, its Key ID and your Issuer ID. See [App Store Connect key](/ship/app-store-connect).
- for Android, a **Google Play service account**: its JSON key file. See [Google Play service account](/ship/google-play).

The console tests a key with the store before it saves it, checks that it has the role it needs, and stores it encrypted. Nothing is saved if the test fails.

## The same from the terminal

| In the console | In the CLI |
| :-- | :-- |
| Apps, New app | `despia account create --web https://your-app.com` |
| Builds, Build | `despia build ios --cloud` |
| App Stores, Add | `despia stores add asc` or `despia stores link asc` |
| Members, Invite | `despia account invite` |
| Access Tokens | `despia workspace tokens` |
| Plan and Credits | `despia workspace credits` |

`despia stores link asc` prints a short-lived link that opens the console's upload page, for when you would rather pick the key file in a browser.
