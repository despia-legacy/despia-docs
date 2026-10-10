---
title: Project structure
description: What each file and folder in a DSX project is for, which ones you write, and which ones the tools generate.
---

A new project has a handful of files. Everything not listed on this page is yours: no Despia command creates, rewrites or deletes it.

```text
my-app/
  dsx.json            the app's identity: name, scheme, version
  dsx.config.json     entry component, routes, packages and their settings
  dsx.lock.json       the exact version of every package you added
  Components/         your .dsx documents
  Modules/            your own native packages (optional)
  public/             static files served as they are
  AGENTS.md           instructions for coding agents
  CLAUDE.md
  dist/               build output (generated)
```

## The files you write

| Path | What it holds |
| :-- | :-- |
| `dsx.json` | The project's identity: `name`, `scheme` and `version`. Written once by `npm create despia` and never rewritten by a build. |
| `dsx.config.json` | The build's input: the `entry` component, the `routes` table, the `modules` (packages) your app uses and each package's settings under `moduleConfig`. |
| `Components/` | Your `.dsx` documents. `despia dev`, `despia lint` and `despia build` read them from here. |
| `public/` | Files copied into the build as they are: `robots.txt`, an icon, anything the site serves verbatim. |
| `Modules/<Name>/` | Your own native packages: a `dsx.json` manifest, `swift/` and `kotlin/` folders, and `Components/`. |

## dsx.config.json

The routes, the packages and their settings all live here, so adding a screen or a package is a change to this file and a new bundle, not a store review.

```json title="dsx.config.json"
{
  "name": "Trails",
  "entry": "trails.App",
  "description": "Find and save hiking trails near you.",
  "routes": [
    { "path": "/", "component": "trails.App", "meta": { "title": "Trails" } },
    { "path": "/trail/:id", "component": "trails.Detail" },
    { "path": "/settings", "component": "trails.Settings" }
  ],
  "modules": ["haptic"]
}
```

- `routes` is the app's screen table. The first match wins, so put specific paths above general ones. See [Navigation](/dsx/navigation).
- `modules` lists the packages you added with `npx despia add`. Calling a package that is not listed is a lint error.
- `description` is one sentence. It becomes the page description and the web manifest's description.

## Packages and the lock file

`npx despia add <package>` pins the package in `dsx.lock.json` and adds it to `modules`. `npx despia remove <package>` unpins it. Commit the lock file: it records exactly which version of each package your app builds with.

```sh
npx despia add revenuecat
npx despia packages
npx despia outdated
```

`packages` lists every pinned package with its version, and `outdated` shows only those with a newer version and what the update changes.

## What the tools generate

| Path | Written by | Rule |
| :-- | :-- | :-- |
| `dist/` | `despia build` | Deleted and rewritten on every build. Never commit it or edit it. |
| `dist-ota/` | `despia ota build` | Over-the-air content, ready to publish. |
| `deploy/` | `despia build` | Deployment files for projects with a server document. |
| `export/ios/`, `export/android/` | `despia export` | Complete Xcode and Android Studio projects, rewritten on every export. |

Anything in a generated folder can be deleted and rebuilt by the command that wrote it.

## Instructions for your agent

`AGENTS.md` and `CLAUDE.md` tell a coding agent how this project works: where documents live, how to check them and which commands are safe. Keep them in the repository. See [Use Despia with your AI agent](/dsx/agents).
