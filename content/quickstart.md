---
title: Quickstart
description: From an empty directory to a running DSX app.
order: 1
section:
---

# Quickstart

```sh
npm create despia@latest my-app
cd my-app
npm install
npx despia dev
```

`despia dev` builds, serves, watches and reloads. The scaffold is a complete DSX package:

| Path | What it is |
|---|---|
| `dsx.json` | package identity: the `scheme` that namespaces every component |
| `dsx.config.json` | app configuration: entry component, output directory |
| `Components/App.dsx` | your first screen |

## Your first edit

Open `Components/App.dsx`. A DSX document is a head (the contract, state and logic) and a
body (pure markup):

```xml
<stack style="gap: 1rem; padding: 2rem">
  <head>
    <variable as="count">return 0</variable>
    <action as="bump">
      dsx.variable.count = dsx.variable.count + 1;
    </action>
  </head>
  <text value="Tapped {{ dsx.variable.count }} times"/>
  <button label="Tap me" on:tap="dsx.action.bump()"/>
</stack>
```

Save, and the page reloads. The same document renders natively on iOS and Android through
the Despia app runtimes; markup is never platform-forked.

## Manual edits

```sh
npx despia edit
npx despia edit Component/Card
```

mints an editing link for the running project and prints it with a QR: open it on any device and
the editor renders your documents live, scoped to what you named (a component, a page such as
`route:/checkout`, or one element such as `Component/Card#0.2.1`) and zooming out or in from there.
A manual edit is applied to your files at exact bytes, the same way an agent's edit is, and lands as
one commit on the branch you are on (`--no-commit` keeps it uncommitted). No account, no hosting.

## Ship something

- `despia build` compiles the deployable web build.
- `despia ota build` turns your screens into a sha-pinned content folder any static host can
  serve over the air ([self-hosted OTA](/framework/guides/combinations/c7-self-hosted-ota)).
- The [combination matrix](/framework/guides/combinations) is the map of everything else.
