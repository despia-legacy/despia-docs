---
title: A web app with native screens
description: Keep your web app as the app, and make a few screens native, such as Settings. The native screens ship over the air, with no App Store or Play review, and share data with your pages.
section: guides
order: 10
---

# A web app with native screens

Most of the app stays your web app. A few screens, about one in ten, become real native screens:
SwiftUI on iPhone, Material 3 on Android. You add them over the air, so a new native screen is a
deploy, not a store review.

This guide builds **Studio**, a bookings web app whose **Settings** screen is native. The full
example is in the docs repository under `examples/web-app-native-screens`.

![Studio on iPhone: the web app, then the native Settings screen with the account the page shared](/guides/shots/web-first-flow.png)

*Left to right: the web app; Settings, a native screen showing the account the page shared; the
reminder switched off; back on the web page, which already shows the change. iPhone 17 simulator.*

## How it fits together

| Piece | Where it lives | What it does |
|---|---|---|
| `App.json` | in the app (a store build) | Names your host and the one OTA file the app reads |
| `/dsx/manifest.json` | on your site | Lists the files of the current deploy |
| `/dsx/routes.json` | on your site | Says which paths are native screens |
| `/dsx/settings/` | on your site | The native Settings screen, a DSX file |
| your web app | on your site | Unchanged, plus two calls to `window.dsx` |

Only `App.json` is baked into the app. Everything else is on your own site, so you change it with
a normal deploy.

## 1. Start from Web App to Mobile App

Create the app in the Despia console (**New App**, **Web App to Mobile App**) or with the CLI:

```sh
npx despia create studio --template web-view --set url=https://app.example.com --apply
```

You get an app whose screen is your web app:

```xml title="Components/App.dsx"
<DSXWebView origin="https://app.example.com" path="/" style="width: 100%; height: 100%"/>
```

Add the shared store, so your pages and the native screens can read and write the same values:

```json title="dsx.config.json"
{
  "name": "Studio",
  "command": "studio",
  "entry": "App",
  "modules": ["global"]
}
```

## 2. Turn on over-the-air routes

Add `ota` to the app's entry. This is the only change that needs a store build, and you make it once.

```json title="App.json"
{
  "name": "Studio",
  "host": "app.example.com",
  "entry": {
    "root": "/",
    "ota": "/dsx/manifest.json",
    "surfaces": ["App"]
  }
}
```

`/dsx/manifest.json`, not `/manifest.json`: many sites already serve a web app manifest at the root.
Apps moved from Despia V3 get this line for you, so they can add native screens later.

## 3. The two OTA files

The app reads two small files from your site, in this order:

<Steps>
<Step title="The manifest: what this deploy contains">
`entry.ota` points at it. It lists the files of the current deploy, and one of them is the
route table.

```json title="/dsx/manifest.json"
{
  "deployed_at": "2026-10-08T12:00:00Z",
  "assets": [
    "/dsx/routes.json",
    "/dsx/settings/manifest.json",
    "/dsx/settings/index.dsx"
  ]
}
```
</Step>
<Step title="The route table: which paths are native">
The app picks the file in `assets` whose name ends in `routes.json`. First match wins.
`/settings` is a native screen; every other path stays your web app.

```json title="/dsx/routes.json"
[
  { "path": "/settings", "view": "DSXView", "src": "/dsx/settings/" },
  { "path": "/*" }
]
```
</Step>
</Steps>

Why two files: the route table is one more file of your deploy, so it updates the same way as
everything else, cached and switched in one step. Pointing `ota` straight at `routes.json` does not
work: the app expects a manifest there and finds no table.

The app works offline: on launch it uses the copy it already has, then checks your site. A change
you deploy shows on the next open.

## 4. Write the native screen

A native screen is a DSX file in a folder on your site. This one uses only stock parts, so it looks
like the iOS Settings app on iPhone and follows Material 3 on Android.

```json title="/dsx/settings/manifest.json"
{ "root": "index.dsx", "assets": ["index.dsx"] }
```

```xml title="/dsx/settings/index.dsx"
<vstack style="flex: 1; align-items: stretch">
  <NavBar title="Settings" large="true"/>
  <list style="flex: 1">
    <sectionHeader value="Account"/>
    <SettingsRow icon="person.crop.circle.fill" title="{{ dsx.global.session.name }}" subtitle="{{ dsx.global.session.email }}"/>
    <SettingsRow icon="star" title="Plan" value="{{ dsx.global.session.plan }}"/>
    <sectionHeader value="Notifications"/>
    <SettingsRow icon="bell.badge" title="Class Reminders">
      <toggle bind="dsx.global.prefs.reminders" a11yLabel="Class Reminders"/>
    </SettingsRow>
    <sectionFooter value="A reminder one hour before each class."/>
  </list>
</vstack>
```

## 5. Connect your web app

Your pages reach the app through `window.dsx`. It exists only inside the app, so check for it and
the same page keeps working in a browser.

```js title="app.js"
const dsx = window.dsx;

if (dsx) {
  // Share data: the native screen reads dsx.global.session.
  dsx.global.set("session", { name: "Maya Chen", email: "maya@example.com", plan: "Pro" });

  // Hear back: the native screen writes dsx.global.prefs.
  dsx.global.watch("prefs", (prefs) => {
    showReminders(prefs && prefs.reminders);
  });

  // Open the native screen. A push keeps your page underneath, so Back returns to it.
  document.querySelector("#settings").addEventListener("click", (event) => {
    event.preventDefault();
    dsx.module.route.push({ path: "/settings" });
  });
}
```

Every `watch` returns a handle; call `stop()` on it when the page that started it goes away.

## 6. Ship a change over the air

Edit the screen, deploy your site, and the next open shows it. No new build, no review. Here a
**Language** row was added to `index.dsx` and the deploy date bumped in the manifest:

```xml title="/dsx/settings/index.dsx"
    <sectionHeader value="General"/>
    <SettingsRow icon="globe" title="Language" value="English" chevron="true"/>
```

::image{src="/guides/shots/web-first-ota.png" alt="The Settings screen after the deploy, with the new Language row" width="300" height="652"}

*The same installed app on its next open, after the deploy.*

The same goes for new native screens: add a row to `routes.json`, add the screen's folder, list
both in the manifest, deploy.

## Good to know

- **Which screens to make native.** Settings, checkout, a camera or scanner screen, anything that
  should feel like the platform. Keep content and long forms on the web.
- **Capability check.** A route can name the packages it needs (`"requires": ["payments"]`). If the
  installed app does not have them, the path stays on your web app instead of failing.
- **Your site's own address bar links.** A plain `<a href="/settings">` still loads the web page.
  Use `dsx.module.route.push` for the native screen, as above.
- **Testing builds.** Builds without a Despia license show a small Development Version bar at the
  bottom, as in the screenshots. Everything else is the same.

## Next

- [A native app with web views](/guides/native-app-with-web-views): the other way around.
- [The window.dsx API](/framework/guides/despia-api): everything your pages can call.
