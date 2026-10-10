---
title: Clerk
description: Add sign-in, sign-up and account screens to your app with Clerk.
package: Core/Clerk
section: packages
group: Sign-in and identity
icon: person.crop.circle
order: 105
---

# Clerk

Uses Clerk's native sign-in and sign-up views, email codes and social logins, and returns a session token for your own API calls. Use it if your users already live in Clerk. Needs a Clerk account and your publishable key.

**When to use it.** Add it when your people already have Clerk accounts or you want Clerk's sign-in, social logins, passkeys, organizations and prebuilt screens. If you do not use Clerk, use the Auth package instead.

<PackageSample/>

## What you need on your side

- A Clerk application and its **publishable key** (`pk_test_...` or `pk_live_...`) in the package settings.
- Your backend verifies the session token from `clerk.token()` with Clerk before it trusts a request.

Despia never hosts your app, your backend or your users' content: the accounts and servers above are your own.

For apps built on Despia V3, see [Migrate from Despia V3](/migrate/web-view-apps).

<PackageReference/>
