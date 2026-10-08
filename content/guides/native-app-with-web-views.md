---
title: A native app with web views
description: Build the app native, and keep a few screens, such as your help center, as web pages from your own site. The pages share data with the native screens both ways.
section: guides
order: 11
---

# A native app with web views

Most of the app is native: SwiftUI on iPhone, Material 3 on Android. A few screens, about one in
ten, stay web pages you already have, such as a help center, terms or a long article. They open as
routes of the app and share data with the native screens.

This guide builds **Notes**, a native notes app whose **Help Center** is a page from your own site.
The full example is in the docs repository under `examples/native-app-web-views`.

![Notes on iPhone: the native home screen, with the Plan picker and the Help Center row](/guides/shots/native-first-home.png)

*The native home screen. iPhone 17 simulator.*

## How it fits together

| Piece | Where it lives | What it does |
|---|---|---|
| `Components/App.dsx` | in the app | The native home screen |
| `Components/Help.dsx` | in the app | A route whose screen is a web view |
| `dsx.config.json` | in the app | Declares both routes and the shared store |
| `/help` | on your site | Your help center, unchanged, plus one small script |

The web page is not copied into the app. It loads from your site, so you change it with a normal
deploy.

## 1. Declare the routes

Each route names one component. `/help` is a route like any other; only its component differs.

```json title="dsx.config.json"
{
  "name": "Notes",
  "command": "notes",
  "entry": "App",
  "modules": ["global"],
  "routes": [
    { "path": "/", "component": "notes.App", "meta": { "title": "Notes" } },
    { "path": "/help", "component": "notes.Help", "meta": { "title": "Help" } }
  ]
}
```

`global` is the shared store. The native screens and your pages read and write the same values
through it.

## 2. The native home screen

Stock parts only, so it looks like a standard iOS list on iPhone and follows Material 3 on
Android. The plan lives in `dsx.global.plan`, where the web page can read it.

```xml title="Components/App.dsx"
<vstack style="flex: 1; align-items: stretch">
  <head>
    <variable as="plans">return ['Free', 'Pro']</variable>
  </head>

  <NavBar title="Notes" large="true"/>
  <list style="flex: 1">
    <sectionHeader value="Account"/>
    <SettingsRow icon="star" title="Plan">
      <segmented bind="dsx.global.plan" options="{{ dsx.variable.plans }}" label="Plan"/>
    </SettingsRow>
    <SettingsRow icon="questionmark.circle" title="Help Center"
                 value="{{ dsx.global.support.lastTopic || '' }}" chevron="true"
                 tappable="true" on:tap="dsx.module.route.push({ path: '/help' })"/>
    <sectionFooter value="The Help Center is a web page from your own site, shown in the app."/>
  </list>
</vstack>
```

The example adds a **Recent** section with the notes; it is left out here.

## 3. The web view route

The `/help` screen is one element: a web view of your page.

```xml title="Components/Help.dsx"
<DSXWebView origin="https://help.example.com" path="/help" style="width: 100%; height: 100%"/>
```

The push from the home screen keeps the native screen underneath, so Back returns to it with the
native gesture.

## 4. Connect your page

Your page reaches the app through `window.dsx`. It exists only inside the app, so check for it and
the same page keeps working in a browser.

```js title="help.js"
const dsx = window.dsx;

if (dsx) {
  // Native to web: the plan the reader picked on the native screen, live.
  dsx.global.watch("plan", (value) => {
    const plan = value || "Free";
    document.getElementById("plan").textContent = `Help for the ${plan} plan`;
    document.getElementById("priority").hidden = plan !== "Pro";
  });
}

for (const button of document.querySelectorAll("[data-topic]")) {
  button.addEventListener("click", () => {
    // Web to native: the home screen shows the last topic next to Help Center.
    if (dsx) dsx.global.set("support.lastTopic", button.dataset.topic);
  });
}
```

Every `watch` returns a handle; call `stop()` on it when the page that started it goes away.

## Good to know

- **Which screens to keep on the web.** Help, terms, long articles, a marketing page you already
  maintain. Screens people use every day are better native.
- **Allowed origins.** A web view loads only the origins your app allows. During development on
  your own machine (`http://127.0.0.1`), allow that address in the app's settings first.
- **Your page in a browser.** Without `window.dsx` the page is a plain help center: the same
  files serve your website and the app.
- **Testing builds.** Builds without a Despia license show a small Development Version bar at the
  bottom, as in the screenshot. Everything else is the same.

## Next

- [A web app with native screens](/guides/web-app-with-native-screens): the other way around.
- [The window.dsx API](/framework/guides/despia-api): everything your pages can call.
