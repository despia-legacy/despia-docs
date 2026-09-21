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

## The visual editor

```sh
npx despia edit
```

serves the open-source canvas editor against your project: your documents in the sidebar,
the canvas rendering and simulating them, and saves that write straight back to your
files. No account, no hosting.

## Ship something

- `despia build` compiles the deployable web build.
- `dsx ota build` turns your screens into a sha-pinned content folder any static host can
  serve over the air ([self-hosted OTA](/framework/guides/combinations/c7-self-hosted-ota)).
- The [combination matrix](/framework/guides/combinations) is the map of everything else.
