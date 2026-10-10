---
title: Wallet
description: Let people add a boarding pass, ticket or card to Apple Wallet.
package: Core/Wallet
section: packages
group: Media, files and sharing
icon: creditcard
order: 136
---

# Wallet

Downloads a pass file from a web address and shows the system sheet to add it to Apple Wallet on iOS. On Android and the web it hands the pass to the system or browser handler. You host the pass file yourself. Only iOS tells you when the sheet closes.

**When to use it.** Use it to offer an Add to Wallet button for a ticket, coupon, loyalty card or boarding pass you already generate as a pass file. It does not create passes.

<PackageSample/>

## What you need on your side

- Your server produces signed `.pkpass` files (Apple Wallet passes are signed with your own Pass Type ID certificate); `wallet.pkpass({ url })` downloads one from your address.

Despia never hosts your app, your backend or your users' content: the accounts and servers above are your own.

For apps built on Despia V3, see [Migrate from Despia V3](/migrate/web-view-apps).

<PackageReference/>
