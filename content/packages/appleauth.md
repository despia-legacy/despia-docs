---
title: Sign in with Apple
description: Apple's native sign-in sheet, returning an identity token your backend verifies.
package: Core/Auth/AppleAuth
section: packages
group: Sign-in and identity
icon: apple.logo
order: 20
---

# Sign in with Apple

Apple's own sign-in sheet, with Face ID and Hide My Email, in one call. It returns a signed identity token that your
backend verifies, plus the person's name and email the first time they sign in. The build turns on the Sign in with
Apple entitlement for you when the package is in your app.

```js
const apple = await dsx.module.appleauth.signIn({ nonce, scopes: "name email" })
// apple.idToken, apple.nonce, apple.userIdentifier, apple.email, apple.givenName, apple.familyName
```

## Before you start

- An Apple Developer account, with **Sign in with Apple** enabled on your app's App ID. Without it the build is refused
  at signing.
- A backend endpoint that hands out a nonce and one that verifies the token (sketch below). Never trust a token the
  page reports without verifying it on the server.

## How the flow works

1. Your page asks your backend for a **nonce**: a random, single-use value tied to this sign-in attempt.
2. The page calls `dsx.module.appleauth.signIn({ nonce })`. Apple's sheet appears; the person confirms with Face ID.
3. The call resolves with `idToken` (a JWT signed by Apple) and the **raw** `nonce`. Apple put the SHA-256 hash of that
   nonce inside the token.
4. The page posts both to your backend, which verifies the token's signature, issuer, audience and nonce, and then signs
   the person in.

You can leave `nonce` out and one is created for you, but minting it on your backend is what ties the token to a request
your server started.

## React and Next.js

This is the whole button for a React app, and for a Next.js App Router app (the `"use client"` line keeps it out of the
server render; the call runs only when the person taps). See
[Using Despia from your web app](/web-apps) for why that matters.

```tsx title="components/apple-sign-in.tsx"
"use client"
import { useState } from "react"

export function AppleSignIn() {
  const [error, setError] = useState<string | null>(null)

  async function signIn() {
    // Android builds and plain browsers have no appleauth: use your web sign-in there
    if (!dsx.has("appleauth")) return startWebSignIn()

    const { nonce } = await fetch("/api/auth/apple/nonce", { method: "POST" }).then((r) => r.json())
    try {
      const apple = await dsx.module.appleauth.signIn({ nonce, scopes: "name email" })
      const res = await fetch("/api/auth/apple", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(apple),
      })
      if (!res.ok) throw new Error("Your sign-in could not be verified.")
      location.assign("/")
    } catch (err: any) {
      if (err.code === "cancelled") return // the person closed the sheet: stay on this screen
      setError(err.message)
    }
  }

  return (
    <>
      <button onClick={signIn}>Continue with Apple</button>
      {error && <p role="alert">{error}</p>}
    </>
  )
}

declare function startWebSignIn(): void
```

In DSX markup the same button is one line, and it only shows where the package exists:

```xml
<button label="Continue with Apple" visible-if="dsx.has('appleauth')" on:tap="dsx.module.appleauth.signIn()"/>
```

## Verify the token on your backend

A sketch for Node with the [`jose`](https://github.com/panva/jose) library. Store the nonce you hand out (in the
session, or a short-lived table) and accept it once.

```ts title="app/api/auth/apple/route.ts"
import { createHash } from "node:crypto"
import { createRemoteJWKSet, jwtVerify } from "jose"

const appleKeys = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"))

export async function POST(request: Request) {
  const { idToken, nonce, givenName, familyName, email } = await request.json()

  // 1. the nonce must be one this server issued and has not used yet
  if (!(await consumeNonce(nonce))) return new Response("Unknown nonce", { status: 400 })

  // 2. the token must be signed by Apple, for your app: the native sheet's tokens name your bundle identifier,
  //    Apple's web flow names your Services ID, so accept both if you use both
  const { payload } = await jwtVerify(idToken, appleKeys, {
    issuer: "https://appleid.apple.com",
    audience: [process.env.APPLE_BUNDLE_ID, process.env.APPLE_SERVICES_ID],
  })

  // 3. Apple put the SHA-256 hex of the raw nonce in the token
  if (payload.nonce !== createHash("sha256").update(nonce).digest("hex")) {
    return new Response("Nonce mismatch", { status: 400 })
  }

  // 4. payload.sub is Apple's stable id for this person; name and email arrive only on the first sign-in
  const user = await upsertUser({ appleId: payload.sub, email: email || payload.email, givenName, familyName })
  return startSession(user)
}

declare function consumeNonce(nonce: string): Promise<boolean>
declare function upsertUser(u: Record<string, unknown>): Promise<unknown>
declare function startSession(user: unknown): Response
```

## With Supabase

Supabase verifies Apple tokens itself: pass the token and the **raw** nonce straight through to `signInWithIdToken`.
Enable the Apple provider in your Supabase project and add your bundle identifier to its client IDs. With
`supabase-js` in your web app:

```ts
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const apple = await dsx.module.appleauth.signIn({ scopes: "name email" })
const { data, error } = await supabase.auth.signInWithIdToken({
  provider: "apple",
  token: apple.idToken,
  nonce: apple.nonce,
})

declare const SUPABASE_URL: string
declare const SUPABASE_ANON_KEY: string
```

If your app uses Despia's Supabase package instead of `supabase-js`, the same call is
`dsx.module.supabase.auth.signInWithIdToken({ provider: "apple", idToken: apple.idToken, nonce: apple.nonce })`.

## Name and email arrive once

Apple sends `email`, `givenName` and `familyName` only on the **first** sign-in for a given Apple ID in your app, and
empty on every later one. Save them the first time you see them. `userIdentifier` (the token's `sub`) always arrives:
use it as the account key.

## Errors

The call rejects with an error whose `code` says what happened and whose `message` is a sentence you can show.

| `err.code` | What happened | What to do |
| :-- | :-- | :-- |
| `cancelled` | The person closed the sheet. | Nothing: it is a normal choice. Leave them on the sign-in screen. |
| `busy` | Another Sign in with Apple request is already running. | Wait for the first one; disable the button while it runs. |
| `invalid_credential` | Apple finished without an identity token (a password or passkey credential). | Ask the person to try again. |
| `failed` | It did not complete for another reason. | Show `err.message` and let them retry. |

## Where it works

Sign in with Apple uses Apple's own API, so it exists on iOS and macOS only. On Android, and in a plain browser,
`dsx.has("appleauth")` is `false`: send people to your web sign-in there. Ask `dsx.has`, never the operating system.

<Note>
**Already using Apple's JS SDK?** If your web app calls `AppleID.auth.signIn()` with `usePopup: true`, you do not have
to change it. From iOS 17.5 that popup cannot complete inside an app's web view, so Despia's OAuth package answers it
with the native Apple sheet and resolves the same object the web SDK would (`authorization.id_token`, `code`, `state`,
and `user` on the first sign-in); closing the sheet rejects with `popup_closed_by_user`, as on the web. It applies on
your app's own pages only, and the redirect mode is left to Apple's SDK. The token's audience is then your bundle
identifier rather than your Services ID, so let your backend accept both. Use `dsx.module.appleauth.signIn()` when you
want the token in one awaited call.
</Note>

<PackageReference/>
