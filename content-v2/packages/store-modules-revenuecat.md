---
package: Core/RevenueCat
also: Core/Store/Modules/RevenueCat
---

## Apple Ads attribution (iOS)

RevenueCat can attribute installs and purchases to your Apple Ads campaigns, from Apple's AdServices token. AdServices is not tracking, so it needs no App Tracking Transparency prompt. It is off by default.

Turn it on for every launch with the `apple_ads_attribution` setting of the RevenueCat package (`true`). In the console it is in the package's settings; in a DSX project it is in `dsx.config.json`:

```json title="dsx.config.json"
{
  "moduleConfig": {
    "revenuecat": { "apple_ads_attribution": true }
  }
}
```

Or turn it on at runtime when your app asks first, for example after its own consent screen:

```js
const result = await dsx.module.revenuecat.attributes({ appleAdsAttribution: true });
```

Calling it again is harmless: RevenueCat sends the token once per install. It needs iOS 14.3 or later. On Android and older iOS the call still succeeds, and `result.unsupported` is `["appleAdsAttribution"]`.

You must also connect Apple Ads in the RevenueCat dashboard (its Apple Ads integration) for the attribution to show up there.
