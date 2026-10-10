---
title: React and Next.js
description: Where native calls may run in React, Next.js and other frameworks that render on the server, with TypeScript.
---

Every framework uses the same `dsx.module` calls. The only question is where a call may run: in the browser, after the page is on screen, or in response to the person. The server has no `dsx`.

## React

Call native features from event handlers, like any other async work:

```tsx title="SaveButton.tsx"
export function SaveButton({ onSave }: { onSave: () => Promise<void> }) {
  async function save() {
    await onSave();
    dsx.module.haptic.success();
  }
  return <button onClick={save}>Save</button>;
}
```

To run something when a component appears, use `useEffect`.

## Next.js (App Router)

The server renders your components first, and the server has no `dsx`. So:

1. Put the code in a client component: `"use client"` at the top of the file.
2. Call `dsx` only in event handlers or `useEffect`, which run in the browser. Never at the top of the component body, and never in a server component, a route handler or `generateMetadata`.

```tsx title="app/components/like-button.tsx"
"use client";
import { useState } from "react";

export function LikeButton() {
  const [liked, setLiked] = useState(false);

  async function like() {
    setLiked(true);
    await dsx.module.haptic.success();
  }

  return <button onClick={like}>{liked ? "Liked" : "Like"}</button>;
}
```

The Pages Router follows the same rule: handlers and `useEffect` only.

## Listening to events

Start listening in `useEffect` and return the stop function, so listening ends with the component:

```tsx
useEffect(() => dsx.on("notify", (event) => handle(event)), []);
```

## Other frameworks

| Framework | Call `dsx` from |
| :-- | :-- |
| React with Vite, Preact | event handlers, `useEffect` |
| Next.js, TanStack Start, React Router v7, Remix | event handlers, `useEffect` in a client component |
| Vue 3, Nuxt | event handlers, `onMounted` (Nuxt: also `<ClientOnly>`) |
| Svelte 5, SvelteKit | event handlers, `onMount` or `$effect` |
| SolidJS, SolidStart | event handlers, `onMount` |
| Angular | event handlers, `ngAfterViewInit` or `afterNextRender` |
| Astro | a client island (`client:load`) or a `<script>` tag |
| Plain HTML, jQuery | event handlers, or a script that runs after the page loads |

Apps built with Lovable or Base44 are React apps built with Vite: use the React section.

## TypeScript

Declare the global once in a `.d.ts` file. The quickest form is one line:

```ts title="despia.d.ts"
declare const dsx: any;
```

For a typed version with `has`, `on` and the error shape, see [Native features from JavaScript](/convert/native-features).

## In development

`next dev` in a normal browser has no `dsx`, so a bare call throws there. If you develop in a browser, use `window.dsx?.` for calls that also run outside the app. See [Running inside Despia](/convert/detect).
