---
title: LicenseCheck
description: Check your app's license on launch and show a blocking screen if it was revoked.
package: licensecheck
---

Check your app's license on launch and show a blocking screen if it was revoked.

Asks your own license server whether the app's license is still valid each time it starts, and shows a full-screen notice if it was revoked. A network failure never blocks, so an offline phone keeps working. It stays dormant until you set a verify address. You run the server and write the wording.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it when you resell or license your app and need to be able to switch it off remotely. Leave the verify address empty and it does nothing.

## Install

```sh
despia add Mandatory/LicenseCheck
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, desktop.

## Actions

### status

`dsx.module.licensecheck.status`

Returns whether the license has been checked and whether the last answer said it is valid.

**When to use it.** Use it to show license state in an about or support screen.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `checked` | boolean | yes | True once the license check has finished at least once. |
| `valid` | boolean | yes | True unless your server said the license is invalid. |

**Example: resolves the last license verdict**

```js
const result = await dsx.module.licensecheck.status({});
// resolves {"checked":true,"valid":true}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `bar_title` | string | `Development Version` | The words on the evaluation bar. |
| `benefit_rows` | multiline | `{brand} maintains them and keeps them current as Apple, Google and the SDK vendors change
Commerce critical SDKs and features tested on every release
Easy access to {brand} cloud deployments and managed signing` | The reasons to license, one per line. |
| `benefits_label` | string | `Why developers license them` | The heading over the reasons to license. |
| `brand_accent` | string | `#5B2BE0` | The accent colour of the notice, as #RRGGBB. |
| `brand_accent_dark` | string | `#7A52F4` | The accent colour in dark mode, as #RRGGBB. |
| `brand_logo` | string | `despia` | The mark shown at the top of the evaluation sheet. |
| `brand_name` | string | `Despia` | The name the evaluation notice is branded with. |
| `button_label` | string | `Get help` | The label of the help button on the blocked screen. |
| `continue_label` | string | `Continue evaluating` | The text of the secondary button, which lets the person keep using the evaluation build. |
| `entitlement_public_key` | string | `/TFnZ+HFdxteX/kxNvZkszCVLEl30ImbVAML6EWwFTo=` | The Despia signing key this app checks its licence against. Fixed; not a per-app setting. |
| `fail_open` | boolean | `true` | Keep the app working when the license server can't be reached. |
| `footer_text` | multiline | `On the web every module is open source and unrestricted.` | The line under the buttons. |
| `learn_more_label` | string | `Learn more` | The text of the main button, which opens the page that explains licensing. |
| `learn_more_url` | url | `https://despia.com/pricing` | Where the primary button goes. |
| `message` | multiline | `This app's license is not active. Please contact the app provider to restore service.` | The explanation shown on the license-blocked screen. |
| `modules_label` | string | `Commercial modules in this build` | The heading above the list of commercial packages in this build. |
| `option_build_label` | string | `Build your own equivalent and import it` | The wording of the second option on the notice, about building your own replacement. |
| `option_remove_label` | string | `Remove these modules` | The wording of the first option on the notice, about removing the commercial packages. |
| `option_upgrade_label` | string | `Buy a commercial license to remove this bar` | The wording of the third option on the notice, about buying a license to remove the bar. |
| `options_label` | string | `Your options` | The heading over the options. |
| `purchase_code` | secret | `` | License and kill-switch token for this app. |
| `sheet_subtitle` | string | `This build runs {brand} commercial SDKs in evaluation mode.` | One line under the sheet's title. |
| `sheet_title` | string | `Development Version` | The evaluation sheet's title. |
| `support_email` | string | `` | A support address to show under the footer. |
| `support_url` | url | `` | Where the help button on the blocked screen takes the user. |
| `title` | string | `License required` | The headline on the license-blocked screen. |
| `verify_url` | url | `` | The web address the app asks whether this license is active. |
| `why_label` | string | `Why am I seeing this?` | The heading over the explanation. |
| `why_text` | multiline | `This project includes {brand} commercial SDKs and no license covers this build. You can ship this app as it is, app stores included: this bar is the only difference.` | The paragraph that explains why the evaluation bar appears and what the person can still do. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
