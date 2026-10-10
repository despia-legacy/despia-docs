---
title: Quickstart
description: Scaffold a DSX app, run it, change it, check it and build it, in about five minutes.
---

You need Node 22.18 or newer, and nothing else. No Xcode, no Android Studio and no account to start.

::: steps

### Create the app

```sh
npm create despia@latest my-app
cd my-app
npm install
```

This writes a small project: `dsx.json` (the app's name and scheme), `dsx.config.json` (its entry component and routes), `Components/App.dsx` (the first screen), and an `AGENTS.md` and `CLAUDE.md` for the coding agent you use. See [Project structure](/dsx/project).

### Check it

```sh
npx despia doctor
```

`doctor` finds the project and machine mistakes that would make a build fail later. Every line should say `ok`.

### Run it

```sh
npx despia dev
```

Open `http://localhost:5273/`. The dev server rebuilds on every save. It also serves a framed preview at `/__dsx/preview` with device sizes and a light and dark switch. It listens on your machine only; `--host` opens it to your network and `--port` moves it.

### Change the screen

Replace `Components/App.dsx` with this and save:

```dsx title="Components/App.dsx"
<stack class="screen">
  <head>
    <attribute as="title" default="'Hello, DSX'"/>
    <variable as="count">return 0</variable>
    <action as="bump">
      dsx.variable.count = dsx.variable.count + 1;
    </action>
    <style>
      .screen { gap: 16px; padding: 32px; }
      .title { font-size: 28px; font-weight: 700; }
    </style>
  </head>
  <text class="title" value="{{ dsx.attribute.title }}"/>
  <text value="Tapped {{ dsx.variable.count }} times"/>
  <button label="Tap me" on:tap="dsx.action.bump()"/>
</stack>
```

The page updates as soon as the file is written. The look is standard CSS in the `<style>` sheet; the text and the count come from the head. [Pages and components](/dsx/documents) explains each part.

### Add a native feature

```sh
npx despia add haptic
```

This pins the Haptics package and adds it to `"modules"` in `dsx.config.json`. Now any action can call it:

```dsx title="Components/App.dsx"
<stack class="screen">
  <head>
    <variable as="count">return 0</variable>
    <action as="bump">
      dsx.variable.count = dsx.variable.count + 1;
      dsx.module.haptic.light();
    </action>
    <style>
      .screen { gap: 16px; padding: 32px; }
    </style>
  </head>
  <text value="Tapped {{ dsx.variable.count }} times"/>
  <button label="Tap me" on:tap="dsx.action.bump()"/>
</stack>
```

On a phone, each tap now gives a light vibration. [Native features](/dsx/packages) covers results, errors and events.

### Lint it

```sh
npx despia lint
```

The linter checks every document: the markup, the code inside it, and the packages it calls. A call to a package you have not added is an error, with the command that fixes it.

### Build it

```sh
npx despia build
```

This compiles the project to a static site in `dist/`. To build the iOS or Android app on Despia Cloud, sign in and build with a platform:

```sh
npx despia login
npx despia build ios --cloud
```

A release build needs your App Store Connect key or Google Play service account. See [Build and ship](/ship).

:::

## Next

::: cards
- [Pages and components](/dsx/documents) {doc.plaintext} What a document is made of.
- [Data and state](/dsx/data) {curlybraces} Variables, formulas, actions and lists.
- [Styling is CSS](/dsx/styling) {paintbrush} Classes, sheets and design tokens.
- [Use Despia with your AI agent](/dsx/agents) {sparkles} Let your agent build with you.
:::
