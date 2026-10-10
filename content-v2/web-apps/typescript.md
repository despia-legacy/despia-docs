---
title: TypeScript
description: Declare the dsx global once, either as any in one line or with a typed declaration for has, on and the error shape.
---

`dsx` is a global the page receives from the app at run time, so TypeScript does not know it until you declare it once.

## The one-line form

```ts title="despia.d.ts"
declare const dsx: any;
```

Put the file anywhere your `tsconfig.json` includes (`src/` in most projects). Every call type-checks, and nothing else changes.

## The typed form

When you want `has`, `on` and errors checked:

```ts title="despia.d.ts"
interface DsxError {
  event: "error";
  code: string;
  message?: string;
  recoverable?: boolean;
  data?: unknown;
}

interface DsxEvent {
  event: string;
  data: unknown;
}

interface Dsx {
  module: any;
  has(name: string): boolean;
  on(source: string, handler: (event: DsxEvent) => void): () => void;
}

declare const dsx: Dsx;
```

`module` stays `any`, because the packages in it are the ones your app was built with. Read the result fields from each package's page.

## Catching typed errors

```ts
try {
  await dsx.module.identityvault.read({ key: "token" });
} catch (e) {
  const err = e as DsxError;
  if (err.code !== "cancelled") showMessage(err.message ?? "Something went wrong.");
}
```

## Next.js and other server-rendered apps

The declaration only tells the compiler the name exists. It does not make `dsx` exist on the server: keep calls in handlers and effects, as on [Frameworks](/web-apps/frameworks).
