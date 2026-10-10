---
title: CLI
description: The despia command line: sign in, add packages, build, connect stores and manage your workspace.
icon: terminal
order: 10
section:
---

# CLI

The CLI does from a terminal what the console does in a browser. Run it with `npx`, or install it once.

```sh title="Terminal"
npx @despia-native/cli login
```

```sh title="Terminal"
npm install -g @despia-native/cli
despia login
```

The examples below use the installed `despia` command.

## Safe by default

A command that changes something only shows what it would do. Add `--apply` to do it.

```sh title="Terminal"
despia project packages add Core/OneSignal
despia project packages add Core/OneSignal --apply
```

## Packages

| Command | What it does |
| :-- | :-- |
| `despia search camera` | Find packages by word |
| `despia add revenuecat` | Add a package to this project |
| `despia packages` | List the packages in this project |
| `despia project config <path>` | Show one package's settings (secrets by name only) |

## Builds and stores

| Command | What it does |
| :-- | :-- |
| `despia build ios --cloud` | Build the iOS app in the cloud |
| `despia build android --cloud` | Build the Android app in the cloud |
| `despia stores add asc --apply` | Connect App Store Connect (an API key file, issuer ID and key ID) |
| `despia stores add play --apply` | Connect Google Play (a service account file) |
| `despia testers add ada@example.com --target ios --apply` | Invite a tester |
| `despia listing pull --project <id>` | Download your store listing to edit |
| `despia listing push --project <id> --apply` | Upload your edited listing |

## Workspace

| Command | What it does |
| :-- | :-- |
| `despia workspace` | Your workspaces and your role in each |
| `despia workspace members` | Who belongs, and open invitations |
| `despia workspace tokens` | API tokens for CI |
| `despia workspace credits` | Your build credits |

`--project` and `--workspace` choose what a command acts on. Without them the CLI uses `DESPIA_PROJECT_ID` and
`DESPIA_WORKSPACE`.
