---
title: Builds
description: Build your iOS and Android app on Despia Cloud, follow each step, read the log of a failure and download what it made.
---

A build turns your project into a signed app: an `.ipa` for iOS and an `.aab` for Android. Builds run on Despia Cloud, so you need neither Xcode nor Android Studio.

## Start a build

In the console, open your app and press **Build**. From a terminal:

```sh
npx despia build ios --cloud --plan
npx despia build ios --cloud --wait
```

`--plan` runs every check, prints the cost in credits and your balance, and starts nothing. Without it, the same checks run first, and a failing check stops the request with nothing charged:

```text
despia build ios --cloud (release): revision r7, 9 file(s), com.acme.app
  ok   Project is ready to build
  FIX  Link App Store Connect to sign and upload  -> console: Settings, Integrations, connect the store account, then link it to this project
  ok   Build machines are ready
  cost 5 credits, balance 12
```

Each failing row names the command or the console page that fixes it.

| Flag | Meaning |
| :-- | :-- |
| `--profile release` | The default: signed for the store. Needs the bundle ID and a connected store account. |
| `--profile debug` | No signing and no store account, for trying the app. |
| `--publish testflight` | iOS: upload to TestFlight once built. |
| `--publish internal` | Android: upload to the Play track (`internal`, `closed`, `open` or `production`). |
| `--wait` | Follow the build step by step until it ends. |
| `--project <id>` | The project, when the folder is not linked to one. |

## Follow a build

```sh
npx despia builds list
npx despia builds show <build-id> --wait
npx despia builds logs <build-id> --follow
```

A build moves through fetch, packages, compile, sign and upload. `builds logs` prints the log with secrets removed, and for a failure it adds the diagnosis of the cause. The console also explains a failure in plain words.

## Credits

A build costs credits, shown before it starts. A build that fails is refunded, and so is a cancelled build that never reached a machine. `despia workspace credits` shows your balance.

## Download

```sh
npx despia builds download <build-id> --out ./builds
```

Each file is checked against the checksum the build recorded.

## When a build fails

Read the diagnosis first: `npx despia builds logs <build-id>`. The common causes are a missing store connection, a bundle ID or capability that does not exist yet in your Apple account, and a build number lower than the one already in the store. `npx despia doctor` and `npx despia signing plan --check` find most of them before you build.
