---
title: OAuth
description: Sign users in with Google, Apple, GitHub or any other OAuth provider in the system sign-in sheet.
package: Core/Auth/OAuth
section: packages
group: Sign-in and identity
icon: key
order: 104
---

# OAuth

Opens your provider's sign-in page in the trusted system browser sheet and hands you back every value the provider sent to your redirect address, such as the code or the tokens. It checks the state value for you and can create and redeem a PKCE challenge. You write the authorize address and exchange the code with your own backend or the provider.

**When to use it.** Use it for social or enterprise sign-in with providers that refuse to load inside an embedded web view. If you only need a native Apple or Google button, use that provider's own package instead.

<PackageSample/>

## What you need on your side

- An app registered with each sign-in provider (Google, Apple and so on), with your redirect address.
- If the app redeems the authorization code itself, list the provider's token origin under **token endpoints**; otherwise your backend exchanges the code.

Despia never hosts your app, your backend or your users' content: the accounts and servers above are your own.

For apps built on Despia V3, see [Migrate from Despia V3](/migrate/web-view-apps).

<PackageReference/>
