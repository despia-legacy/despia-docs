---
title: The despia CLI
description: Create, run, check, build and ship a DSX app from the terminal. The commands you use most, grouped by what you are doing.
---

The `despia` command is installed with every new project, so you run it with `npx despia`. To use it outside a project, install it once:

```sh
npm install -g @despia-native/cli
despia --help
```

`despia <command> --help` prints every flag of a command.

## Develop

| Command | What it does |
| :-- | :-- |
| `despia dev` | Build, serve, watch and reload on every save |
| `despia lint` | Check the markup and the code inside every document |
| `despia doctor` | Find the mistakes that would make a build fail later |
| `despia build` | Compile the project to a static site in `dist/` |
| `despia test` | Run the app's unit tests for actions, formulas and components |
| `despia review` | Check the design: accessible names, tap targets, type scale, contrast |
| `despia audit` | Score performance and accessibility on every platform |
| `despia create <Name> --route /path` | Write a new page document and its route together |
| `despia describe` | A document as a contract and a map of addresses |

## Packages

| Command | What it does |
| :-- | :-- |
| `despia search <word>` | Find a package |
| `despia add <package>` | Add a package to the project |
| `despia remove <package>` | Remove it |
| `despia packages` | Every package in the project, with its version |
| `despia outdated` | Only the packages with a newer version |
| `despia docs show <package>` | A package's documentation, in the terminal |
| `despia why <package>` | Why a package is in the build, or what keeps it out |

## Native

| Command | What it does |
| :-- | :-- |
| `despia run --target ios` | Build for a simulator or emulator, install, launch and stream the log |
| `despia device doctor` | Check your Xcode and Android tools, simulators and devices |
| `despia signing` | What Apple and Google need for this app, worked out from its packages |
| `despia validate` | What a store upload would refuse, before you upload |
| `despia manifest` | What is inside a built app: SDKs, permissions, entitlements |

## Ship

| Command | What it does |
| :-- | :-- |
| `despia login` | Sign in once on this machine |
| `despia build ios --cloud` | Build the iOS app on Despia Cloud (`android` for Android) |
| `despia builds` | List, follow, read the log of, cancel or download a cloud build |
| `despia stores add` | Connect an App Store Connect key or a Google Play service account |
| `despia testers add` | Invite a TestFlight tester, or open a Play testing track |
| `despia publish` | Upload to TestFlight or Play internal testing, then promote and release |
| `despia submit` | Submit a build for store review |
| `despia releases` | Where each store submission stands |
| `despia listing pull` / `push` | Your store listing as files you can edit and upload |

A cloud build checks everything first and prints the cost before it starts:

```sh
despia build ios --cloud --plan
despia build ios --cloud --wait
```

`--plan` runs the checks and prints the cost and your balance, and starts nothing. `--wait` follows the build step by step until it ends. A build that fails is refunded.

## Agents

| Command | What it does |
| :-- | :-- |
| `despia mcp` | Serve every command to a coding agent over MCP |
| `despia checkpoint` | Take a checkpoint of the project, or go back to one |
| `despia guard check '<command>'` | Judge a shell command before an agent runs it |
| `despia impact <target>` | What breaks if you delete something |

See [Use Despia with your AI agent](/dsx/agents).

## Account and workspace

| Command | What it does |
| :-- | :-- |
| `despia workspace list` | Your workspaces and your role in each |
| `despia workspace members` | Who belongs, and the open invitations |
| `despia workspace tokens` | API tokens for CI and the hosted MCP server |
| `despia workspace credits` | Your build credit balance |

## Changes are planned first

A command that changes something outside your project (a store, a workspace, a payment) prints what it would do and stops. Run it again with `--apply` to do it:

```sh
despia stores add asc --file AuthKey_ABC123DEFG.p8 --issuer-id <issuer-id> --key-id ABC123DEFG
despia stores add asc --file AuthKey_ABC123DEFG.p8 --issuer-id <issuer-id> --key-id ABC123DEFG --apply
```

Keys and secrets are read from a file or from standard input, never from a flag value, and are never printed back.

## For scripts

Every command takes `--json` and answers with one JSON document. The exit code is the same class everywhere: `0` done, `1` a failure the command found (lint findings, a failed build), `2` refused with nothing attempted (for example a missing credential), `3` a command line that cannot be acted on.
