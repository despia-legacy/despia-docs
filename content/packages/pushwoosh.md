---
title: Pushwoosh
description: Send push notifications to your app's users through Pushwoosh.
package: Core/Pushwoosh
section: packages
group: Notifications
icon: bell
order: 110
---

# Pushwoosh

Registers each device with Pushwoosh and gives your app the device's subscription, your own user id and typed tags, so you can target pushes from the Pushwoosh dashboard. Use it when your team already runs its messaging on Pushwoosh. Needs a Pushwoosh account, your App ID and an API token.

**When to use it.** Reach for it when your team already sends its messages through Pushwoosh and you want each device registered, linked to your own user ids and tagged for targeting. If you do not use Pushwoosh, choose another push package.

<PackageSample/>

## What you need on your side

- A Pushwoosh application: its **application id** and **device API token** in the package settings.
- Send pushes from the Pushwoosh control panel or your server.

Despia never hosts your app, your backend or your users' content: the accounts and servers above are your own.

For apps built on Despia V3, see [Migrate from Despia V3](/migrate/web-view-apps).

<PackageReference/>
