---
title: Terra
description: Pull Apple Health and wearable data into your app through Terra.
package: Core/Health/Terra
section: packages
group: Health
icon: link
order: 139
---

# Terra

Connects Apple Health and wearables such as Fitbit, Garmin, Oura and Whoop through Terra, then syncs and reads the data. Needs a Terra account and developer ID, and your own server to start sessions with Terra's API. It is off by default and you turn it on when you want it.  ## How it connects  - **Apple Health** is read on the device through HealthKit. iOS asks the person once, with the purpose strings you set. - **Wearables** (Fitbit, Garmin, Oura, Whoop and more) connect through Terra's Connect widget, opened from your app. - **Your server** mints the session token with Terra's API, so your Terra API key never ships in the app.  ## Set it up  1. Create a developer account at [Terra](https://tryterra.co) and copy your developer ID. 2. Add **Terra Health** and set **Developer ID**. Leaving it empty keeps the integration off. 3. Write the **Health read prompt** iOS shows when it asks to read Health data. 4. Add a route on your server that asks Terra for a session token for the signed-in user.  \| Setting \| What it is \| \| --- \| --- \| \| Developer ID \| Your Terra developer ID \| \| Health read prompt \| The message iOS shows before reading Health data \| \| Health write prompt \| The message iOS shows before saving to Health \| 

**When to use it.** Add it when your app should read Apple Health or wearable data (Fitbit, Garmin, Oura, Whoop) and forward it to your own backend through Terra. It needs a Terra account; if you only want Apple Health data inside the app, use the HealthKit package.

<PackageSample/>

## What you need on your side

- A Terra developer account: your **developer ID** in the package settings.
- Your server creates the Terra token that `terra.connect({ session })` needs; your Terra API key stays on your server.

Despia never hosts your app, your backend or your users' content: the accounts and servers above are your own.

For apps built on Despia V3, see [Migrate from Despia V3](/migrate/web-view-apps).

<PackageReference/>
