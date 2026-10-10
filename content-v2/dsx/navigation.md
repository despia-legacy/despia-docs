---
title: Navigation
description: One navigation model on every platform: a route table, a stack of pages, tabs, sheets and deep links. You write the pages; DSX draws the back button.
---

A DSX app has one navigation model on iOS, Android and the web: a stack of pages, a path that says where the current page sits, and the platform's own way of showing it. You declare the routes and write the pages. You do not write back buttons or breadcrumbs.

## The route table

Routes live in `dsx.config.json`. Each row maps a path to a component:

```json title="dsx.config.json"
{
  "routes": [
    { "path": "/", "component": "trails.App", "meta": { "title": "Trails" } },
    { "path": "/trail/:id", "component": "trails.Detail" },
    { "path": "/settings", "component": "trails.Settings" },
    { "path": "/files/*", "component": "trails.Browser" }
  ],
  "notFound": "trails.Missing"
}
```

- **Order is precedence.** The first match wins, so put specific paths above general ones.
- **Params.** `:id` binds one path segment. Query string values arrive the same way, and on a name clash the query wins.
- **Catch-all.** A trailing `*` matches the rest of the path. It binds no param.
- **Unmatched paths** open the `notFound` component.
- **`meta.title` and `meta.description`** become the page's title and description on the web, for search and sharing.

Routes, screens and styles ship in the over-the-air bundle. Adding a screen or changing a path does not need a store review.

## Moving between pages

Navigation is state. The route module's verbs change it:

```dsx title="Components/Home.dsx"
<stack style="gap: 12px; padding: 20px">
  <head>
    <action as="open">
      await dsx.module.route.push({ path: '/trail/42' });
    </action>
    <action as="home">
      await dsx.module.route.reset({ path: '/' });
    </action>
  </head>
  <button label="Open trail" on:tap="dsx.action.open()"/>
  <button label="Settings" href="/settings"/>
  <button label="Start over" on:tap="dsx.action.home()"/>
</stack>
```

| Call | What it does |
| :-- | :-- |
| `dsx.module.route.push({ path })` | Opens a page on top of the current one |
| `dsx.module.route.pop()` | Goes back one page |
| `dsx.module.route.replace({ path })` | Swaps the current page for another |
| `dsx.module.route.reset({ path })` | Clears the stack and starts again at a page |

`href` on a `<button>` or `<pressable>` pushes a page. On the web it renders a real link a search engine can follow, so your app can be indexed without a second web build.

::: warning Back and close pop, they never href
An `href` pushes, so a back button wired to one stacks a second copy of the previous page on every tap. Close and back controls call `dsx.module.route.pop()`.
:::

Read the stack back as state: `dsx.nav.stack`, `dsx.nav.depth` and `dsx.nav.canPop`. A control that should only appear when there is somewhere to go back to is `visible-if="dsx.nav.canPop"`.

## Back and breadcrumbs

DSX draws the path the way each platform does: the back button on iPhone, iPad and Mac, the top app bar on Android, and breadcrumbs on the web in a wide window. A page reached from a link or a sidebar still shows Back, and it goes up to the page above it.

The path follows the route hierarchy, not the history. `/trail/42/photos` sits under `/trail/42` however you got there. A route marked `"tabRoot": true` starts its own hierarchy, so the path never climbs past the section you are in.

How the path is drawn is presentation, so you change it in CSS:

```css
:root { --dsx-navigation-style: back; }
```

## Tabs

`<tabs>` is the bottom tab bar. Each child is one tab, with its own `tabTitle` and `tabIcon`:

```dsx title="Components/App.dsx"
<tabs>
  <stack tabTitle="Home" tabIcon="house.fill" style="padding: 20px">
    <text value="Home"/>
  </stack>
  <stack tabTitle="Library" tabIcon="books.vertical" style="padding: 20px">
    <text value="Library"/>
  </stack>
</tabs>
```

## Sheets

A sheet presents its children while an expression is true. Swiping it down, or setting the value to false, dismisses it:

```dsx title="Components/Filters.dsx"
<stack style="padding: 20px">
  <head>
    <variable as="showFilters">return false</variable>
  </head>
  <button label="Filters" on:tap="dsx.variable.showFilters = true"/>
  <sheet present="dsx.variable.showFilters" detents="half,full" title="Filters" close="trailing" on:dismiss="dsx.variable.showFilters = false">
    <text value="Sort and filter options" style="padding: 20px"/>
  </sheet>
</stack>
```

`detents` sets where the sheet can rest (`content`, `half`, `full`), `mode="cover"` makes it full screen, and `title`, `close` and `action` give it the system's own header. On iPad, Mac and the desktop web the same sheet is presented centred.

## Screens without a path

Not every screen belongs in the URL. If a user should be able to link to it, bookmark it or land on it from a notification, give it a route. If it is a step inside a flow, a sheet or a pushed component is the better fit.

## Deep links

The route table is also the app's deep-link table. `https://app.example/trail/42` opens the installed app on `trails.Detail` with `id` set to `42`. You declare the route once; there is no second URL scheme to keep in sync.

An `https` link opens the app only when iOS and Android have verified that the domain and the app belong together. Declare both once: the domains in `dsx.config.json`, and the app ids that may answer in `dsx.json`. `despia build` then writes the `apple-app-site-association` and `assetlinks.json` files your site must serve.

```json title="dsx.json"
{
  "web": {
    "links": {
      "appleAppIds": ["ABCDE12345.com.example.app"],
      "androidPackages": [{ "package": "com.example.app", "sha256": ["AA:BB:..."] }],
      "exclude": ["/admin/*"]
    }
  }
}
```

## Guards and redirects

A route row can carry a `guard` (a condition on app state), a `redirect` to another path, and `requires` (capabilities the build must have). A guard is a routing decision, not security: always check access on your server.
