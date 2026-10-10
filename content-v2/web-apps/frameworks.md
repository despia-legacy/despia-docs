---
title: Frameworks
description: The same dsx.module call in React, Next.js, Vue, Svelte and plain JavaScript. The one rule is where the call runs - in the browser, never on the server.
---

Every framework calls native features the same way. The only question is where a call may run: in the browser, in response to the person or after the page is on screen. A server has no `dsx`.

## React

Call native features from event handlers, like any other async work:

```tsx title="SaveButton.tsx"
export function SaveButton({ onSave }: { onSave: () => Promise<void> }) {
  async function save() {
    await onSave();
    await dsx.module.haptic.success();
  }
  return <button onClick={save}>Save</button>;
}
```

To listen to events while a component is on screen, start in `useEffect` and return the stop function:

```tsx
useEffect(() => dsx.on("notify", (event) => handle(event)), []);
```

## Next.js (App Router)

Next.js renders your components on the server first, and the server has no `dsx`. So:

1. Put the code in a client component: `"use client"` at the top of the file.
2. Call `dsx` only in event handlers or `useEffect`, which run in the browser. Never at the top of a component body, and never in a server component, a route handler, a server action or `generateMetadata`.

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

With the Pages Router the rule is the same: handlers and `useEffect` only.

## Vue

Call from a method or handler, and listen in `onMounted`:

```vue title="SaveButton.vue"
<script setup>
import { onMounted, onUnmounted } from "vue";

async function save() {
  await dsx.module.haptic.success();
}

let stop;
onMounted(() => { stop = dsx.on("notify", (event) => handle(event)); });
onUnmounted(() => stop?.());
</script>

<template>
  <button @click="save">Save</button>
</template>
```

In Nuxt, the same: handlers and `onMounted`, which only run in the browser.

## Svelte

Call from a handler, and listen in `onMount` (return the stop function):

```svelte title="SaveButton.svelte"
<script>
  import { onMount } from "svelte";

  async function save() {
    await dsx.module.haptic.success();
  }

  onMount(() => dsx.on("notify", (event) => handle(event)));
</script>

<button onclick={save}>Save</button>
```

In SvelteKit, `onMount` and handlers run in the browser only, so the rule holds.

## Plain JavaScript

A script on the page can call at any time, because `dsx` is defined before it runs:

```html title="index.html"
<button id="save">Save</button>
<script>
  document.getElementById("save").addEventListener("click", async () => {
    await dsx.module.haptic.success();
  });
</script>
```

## Other frameworks

| Framework | Call `dsx` from |
| :-- | :-- |
| Preact, Solid | event handlers, `useEffect` / `onMount` |
| TanStack Start, React Router v7, Remix | event handlers, `useEffect` in client code |
| Angular | event handlers, `afterNextRender` or `ngAfterViewInit` |
| Astro | a client island (`client:load`) or a `<script>` tag |
| jQuery | event handlers |

Apps made with Lovable or Base44 are React apps built with Vite: use the React section.
