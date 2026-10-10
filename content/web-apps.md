---
title: Using Despia from your web app
description: How dsx.module calls work in React, Next.js, Vue and plain JavaScript inside a Despia app, and every difference from a DSX page, in one place.
label: Using Despia from your web app
section:
icon: globe
order: 3
---

# Using Despia from your web app

Inside a Despia app, your web app calls native features exactly the way a DSX page does:

```js
await dsx.module.haptic.success()
```

That line works in React, Next.js, Vue, Svelte and plain JavaScript. Despia defines `dsx` on the page before any of your
scripts run, so there is nothing to install or import. Every package page in these docs shows this one form, and it is
the code you ship.

The rest of this page is every place where a web app differs, written once: server rendering, TypeScript, sites that
also run outside Despia, events, and which pages get `dsx` at all.

## The short version

- Write `dsx.module.<package>.<action>(...)`. Calls return a promise; `await` it.
- **Next.js and other server-rendered frameworks:** `dsx` exists only in the browser, inside the app. Call it from event
  handlers or `useEffect` in a `"use client"` component, never while the server renders.
- **TypeScript:** add one line, `declare const dsx: any`, or the typed declaration below.
- **Your site also runs in a normal browser** (your public website, `next dev` in Chrome): write
  `window.dsx?.module...` instead, so the code does nothing where Despia is absent.
- **A package exists on some builds only** (Sign in with Apple is iOS only): ask `dsx.has("<package>")` and route to
  your fallback. Never check the operating system.
- **Only your app's own pages can call it.** On another domain, calls fail with `origin_not_allowed`; inside an iframe
  there is no `dsx`. See [Which pages get dsx](#which-pages-get-dsx).

## React

Call native features from event handlers, the same as any other async work.

```tsx title="SaveButton.tsx"
export function SaveButton({ onSave }: { onSave: () => Promise<void> }) {
  async function save() {
    await onSave()
    dsx.module.haptic.success()
  }
  return <button onClick={save}>Save</button>
}
```

To run something when a component appears, use `useEffect`, and stop listening when it goes away (see
[Events](#events)).

## Next.js (App Router)

The server renders your components first, and the server has no `dsx`. So:

1. Put the code in a client component: `"use client"` at the top of the file.
2. Call `dsx` only in event handlers or `useEffect`, which run in the browser. Never at the top of the component body,
   and never in a server component, a route handler or `generateMetadata`.

```tsx title="app/components/like-button.tsx"
"use client"
import { useEffect, useState } from "react"

export function LikeButton() {
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    // runs in the browser, after the first paint
    dsx.module.haptic.light()
  }, [])

  async function like() {
    setLiked(true)
    await dsx.module.haptic.success()
  }

  return <button onClick={like}>{liked ? "Liked" : "Like"}</button>
}
```

The Pages Router follows the same rule: handlers and `useEffect` only. Nuxt, SvelteKit, Astro and Remix work the same
way: `onMounted`, `onMount`, a client island, or an event handler.

## Vue

```vue title="SaveButton.vue"
<script setup lang="ts">
async function save() {
  await saveDocument()
  dsx.module.haptic.success()
}
</script>

<template>
  <button @click="save">Save</button>
</template>
```

Use `onMounted` for work when the component appears. In Nuxt, the same rule as Next.js applies: never during the server
render.

## Plain JavaScript

```html
<button id="save">Save</button>
<script>
  document.getElementById("save").addEventListener("click", async () => {
    await saveDocument()
    dsx.module.haptic.success()
  })
</script>
```

## Other frameworks

Every framework uses the same `dsx.module...` calls. The only question is where the call may run: in the browser, after
the page is on screen, or in response to the person. Lovable and Base44 build React apps with Vite, so use the React
section above.

| Framework | Call `dsx` from |
| :-- | :-- |
| React with Vite, Preact | event handlers, `useEffect` |
| Next.js, TanStack Start, React Router v7, Remix | event handlers, `useEffect` in a client component (`"use client"` where the framework has it) |
| Vue 3, Nuxt | event handlers, `onMounted` (Nuxt: also `<ClientOnly>`) |
| Svelte 5, SvelteKit | event handlers, `onMount` or `$effect` |
| SolidJS, SolidStart | event handlers, `onMount` |
| Angular | event handlers, `ngAfterViewInit` or `afterNextRender` |
| Astro | a client island (`client:load`) or a `<script>` tag |
| Qwik | event handlers (`onClick$`), `useVisibleTask$` |
| Lit, web components | event handlers, `firstUpdated` or `connectedCallback` |
| Plain HTML, jQuery, anything else | event handlers, or a script that runs after the page loads |

## TypeScript

`dsx` is a global the page receives at runtime, so TypeScript needs to be told it exists. The quickest form is one line
in any `.d.ts` file in your project:

```ts title="despia.d.ts"
declare const dsx: any
```

For autocompletion of the calls themselves, declare the shape you use:

```ts title="despia.d.ts"
interface DsxError {
  event: "error"
  code: string
  message?: string
  recoverable?: boolean
  data?: unknown
}

interface Dsx {
  module: any
  has(name: string): boolean
  on(source: string, handler: (event: { event: string; data: unknown }) => void): () => void
}

declare const dsx: Dsx

interface Window {
  dsx?: Dsx
}
```

`module` stays `any` because each package adds its own actions; the package pages list every action with its arguments
and result.

## Errors

A call that fails rejects its promise with an error object: `code` is a stable, machine-readable name, and `message`
is a sentence you can show the person. Each package page lists its codes.

```js
try {
  await dsx.module.appleauth.signIn()
} catch (err) {
  if (err.code === "cancelled") return // the person closed the sheet: a normal choice
  showMessage(err.message)
}
```

The full shape is `{ event: "error", code, message, recoverable, data }`; `data` carries details when a package has
any. A call with no answer after 30 seconds rejects with the code `timeout`.

## Feature detection

Your app's build includes the packages you added to it, and some packages exist only where the platform has the feature.
Ask `dsx.has` with the package name before you rely on one that may be missing:

```js
if (dsx.has("appleauth")) {
  await dsx.module.appleauth.signIn()
} else {
  startWebSignIn()
}
```

Never decide by operating system or user agent. `dsx.has` answers for the build that is actually running, so it stays
right when you add or remove a package later. It answers at once, with no round trip to the app.

## Events

Some packages tell you about things that happen outside a call: a notification was tapped, the app came back to the
foreground. Listen with `dsx.on`, which returns a function that stops listening:

```js
const stop = dsx.on("notify", (event) => {
  if (event.event === "opened") openConversation(event.data)
})

// later, when you no longer need it
stop()
```

In React, start listening in `useEffect` and return the stop function so it ends with the component:

```tsx
useEffect(() => dsx.on("notify", (event) => handle(event)), [])
```

## Sites that also run outside Despia

If the same code also runs where Despia is absent (your public website in a normal browser, `next dev` in Chrome, a
preview deploy), a bare `dsx` throws `ReferenceError: dsx is not defined` there. For that code, write `window.dsx?.`
instead: it is `undefined` outside Despia, and the call is skipped.

```js
window.dsx?.module.haptic.success()

if (window.dsx?.has("appleauth")) {
  await window.dsx.module.appleauth.signIn()
}
```

Check at the moment you call, not once when the page loads: the result is the same, but a call-time check also covers
code that moves between pages and frameworks that render on the server.

## Which pages get dsx

Native calls work only from pages your app trusts. The default policy is `app`: the bridge answers your app's own
pages and nothing else. On any other page `dsx` is still there, but every call rejects at once with the code
`origin_not_allowed`, and the message names the page's origin. If you see that code, check this list.

Trusted by default:

- your app's start URL, with exactly that scheme, host and port;
- the hosts bundled in your app's configuration, over HTTPS on the default port;
- the app's own local content and the schemes Despia packages serve;
- any origin you list in `bridge_origins`.

Not trusted unless you say so:

- **`www` and other subdomains.** `example.com` does not cover `www.example.com`. List the subdomain, or list
  `*.example.com`, or set `bridge_subdomains` to `true` when every subdomain is equally yours.
- **Pages you redirect to on another domain:** a sign-in provider, a checkout, a preview deploy
  (`my-app-git-branch.vercel.app`). Add each one you want to call Despia from.
- **`http://` when you configured `https://`.** The scheme is part of the origin.
- **Iframes.** Only the top-level page gets `dsx`. Code inside an iframe cannot call Despia, whatever its origin.

Set these on the **Dom** package, in your project's `dsx.config.json`:

```json title="dsx.config.json"
{
  "moduleConfig": {
    "dom": {
      "bridge_policy": "app",
      "bridge_origins": ["www.example.com", "*.example.com", "https://checkout.partner.com"],
      "bridge_subdomains": false
    }
  }
}
```

An entry with a scheme (`https://checkout.partner.com`) matches that exact origin; a bare host (`www.example.com`) means
HTTPS on the default port; `*.example.com` opts in every subdomain. `bridge_policy` also takes `none` (no page gets the
bridge) and `full` (every page does, an explicit opt-in you should rarely need).

## A Despia app inside a Despia app

When a Despia app shows a web view that hosts another web app, each page gets its own `dsx`, connected to the same app.
The code is the same as everywhere else on this page.
