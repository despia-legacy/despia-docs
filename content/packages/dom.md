---
title: Dom
description: Control the web view that shows your web app: load pages, navigate, run scripts.
package: dom
---

Control the web view that shows your web app: load pages, navigate, run scripts.

Gives you the remote control for the web view that displays your site inside the app: load a page or a bundled file, go back and forward, reload, recover after a crash, run a script, add scripts that run on every page, manage cookies and clear web data. It ships with every app and drives the web view you place in your layout. You write the pages and the calls.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when your layout shows a web view and you need to steer it from buttons or code. Do not use it to pass data to new features; publish state on a package context and broadcast events instead of writing page globals.

## What native adds

It drives the real WKWebView or Android WebView, so back and forward, crash recovery, cookie handling and script injection behave like a native browser host.

## Install

```sh
despia add Core/Dom
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

### back

`dsx.module.dom.back`

Goes back one page in the web view's history, and does nothing at the start.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

_None._

**Example: navigates back**

```js
const result = await dsx.module.dom.back({});
```

### call

`dsx.module.dom.call`

Calls a named function on the page, such as window.fn or a dotted name, with the values you pass.

**When not to.** New features should publish context and broadcasts instead of calling page functions.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `args` | array | no | The values to pass to the function, as plain JSON data. |
| `fn` | string | yes | The function name on the page, which may be dotted, such as navigator.geolocation.helper.success. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_fn` | No function name was given. | Pass the function name in fn. |

**Example: invokes a web callback with args**

```js
const result = await dsx.module.dom.call({"args":["hello",1],"fn":"window.onNative"});
```

### clearWebData

`dsx.module.dom.clearWebData`

Wipes the web view's cache, cookies and stored site data, for example when the person resets the app.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

_None._

**Example: wipes the web data store**

```js
const result = await dsx.module.dom.clearWebData({});
```

### css

`dsx.module.dom.css`

Sets a CSS custom property on the page's root, so page styles can follow your app's values.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `property` | string | yes | The custom property name, such as --brand-color. |
| `value` | string | no | The value to give it; leave out to set it empty. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_property` | No custom property name was given. | Pass the property name. |

**Example: sets a custom property**

```js
const result = await dsx.module.dom.css({"property":"--menubar-height","value":"50px"});
```

### eval

`dsx.module.dom.eval`

Runs a piece of JavaScript in the current page and returns its result.

**When not to.** Do not use it to pass data to new features; broadcast events or publish context instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `js` | string | yes | The JavaScript expression to run in the page. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `eval_failed` | The script threw an error while running in the page. | Fix the script and try again. |
| `missing_js` | No script text was given to run. | Pass a non-empty js value. |
| `origin_denied` | Running scripts is not allowed on the page's current origin. | Only evaluate scripts on pages your app is allowed to control. |

**Example: runs a JS expression**

```js
const result = await dsx.module.dom.eval({"js":"document.title"});
```

### forward

`dsx.module.dom.forward`

Goes forward one page in the web view's history, and does nothing at the end.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

_None._

**Example: navigates forward**

```js
const result = await dsx.module.dom.forward({});
```

### home

`dsx.module.dom.home`

Returns the web view to its configured starting page, dropping any temporary link override.

**When to use it.** Use it for a home button on a web screen.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

_None._

**Example: returns the surface to its configured start**

```js
const result = await dsx.module.dom.home({});
```

### inject

`dsx.module.dom.inject`

Adds a script that runs in every page the web view loads, and also runs it once in the page that is showing now.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `atStart` | boolean | no | Run before the page content loads (the default) or, when false, after it. |
| `mainFrameOnly` | boolean | no | Run in the top page only (the default), or in embedded frames too when false. |
| `script` | string | yes | The JavaScript source to add. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_script` | No script text was given to add. | Pass a non-empty script. |

**Example: contributes a document script**

```js
const result = await dsx.module.dom.inject({"atStart":true,"mainFrameOnly":true,"script":"window.__ready = true;"});
```

### load

`dsx.module.dom.load`

Loads a web address, or a file bundled inside the app, into the web view.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `path` | string | no | A bundled file such as www/app.html, packaged with the app. Give this or url. |
| `readAccess` | string | no | Ignored for safety; only the one requested bundled file is made readable. |
| `url` | string | no | The http or https address to load. Give this or path. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_url` | Neither a url nor a bundled path was given. | Pass url or path. |
| `unsafe_file` | The file you named is outside the app's signed bundle. | Ship the file inside the app and use its bundled path. |
| `unsafe_url` | Only web addresses, registered app URL schemes, the local loopback address or bundled files can be loaded. | Use an allowed address. |

**Example: loads a url into the surface**

```js
const result = await dsx.module.dom.load({"url":"https://example.com"});
```

### proxy

`dsx.module.dom.proxy`

Delivers a result or event envelope from the app to the page so the page's DSX calls receive their answers.

**When not to.** The app calls this for you; you rarely need it yourself.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `payload` | object | yes | The envelope to hand to the page. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_payload` | No payload was given to deliver. | Pass a payload. |

**Example: delivers a result envelope to web**

```js
const result = await dsx.module.dom.proxy({"payload":{"data":{},"event":"native","final":true,"id":"1"}});
```

### recover

`dsx.module.dom.recover`

Reloads the page, or rebuilds the web view if the system killed its renderer process, so a blank page comes back.

**When to use it.** Use it when the web view has gone blank or stopped responding.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

_None._

**Example: reloads a live surface or recreates a terminated renderer**

```js
const result = await dsx.module.dom.recover({});
```

### reload

`dsx.module.dom.reload`

Reloads the page the web view is showing.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

_None._

**Example: reloads the surface**

```js
const result = await dsx.module.dom.reload({});
```

### restoreCookies

`dsx.module.dom.restoreCookies`

Puts back a saved copy of cookies into the web view; call it before loading the page.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | no | The name the copy was saved under; defaults to SavedCookies. |

**Resolves with**

_None._

**Example: restores a saved cookie snapshot**

```js
const result = await dsx.module.dom.restoreCookies({"key":"SavedLocalhostCookies"});
```

### saveCookies

`dsx.module.dom.saveCookies`

Saves a copy of the web view's cookies so they can be put back after a restart.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `domains` | array | no | Only save cookies whose domain contains one of these; all cookies are saved when left out. |
| `key` | string | no | The name to save the copy under; defaults to SavedCookies. |

**Resolves with**

_None._

**Example: snapshots cookies for the given domains**

```js
const result = await dsx.module.dom.saveCookies({"domains":["localhost"],"key":"SavedLocalhostCookies"});
```

### serveScheme

`dsx.module.dom.serveScheme`

Lets a package answer requests for its own URL scheme from the web view, such as app-served files or images.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `host` | string | no | Android only: the reserved https host appassets.androidplatform.net, so pages on any https site can fetch the bytes. Other hosts are refused. |
| `scheme` | string | yes | The custom URL scheme to answer, for example cdn. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `base` | string | no | On the web only: the path prefix to build URLs from, because a custom URL scheme cannot be addressed in a browser. iOS and Android answer the requests themselves and resolve nothing. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `host_refused` | Only the reserved Android asset host can be answered over https. | Leave host out, or use the reserved host. |
| `missing_responder` | No function was given to answer the requests. | Pass a responder. |
| `missing_scheme` | No URL scheme name was given. | Pass the name of the URL scheme to serve. |
| `worker_unavailable` | On the web, the app's service worker is not yet controlling the page. | Reload the page once the service worker is active. |

**Example: Serve the cdn scheme on the web**

```js
const result = await dsx.module.dom.serveScheme({"scheme":"cdn"});
// resolves {"base":"/__dsx/scheme/cdn/"}
```

### set

`dsx.module.dom.set`

Assigns a value to a named global on the page's window, using a dotted name if needed.

**When not to.** New features should publish context and broadcasts instead of writing page globals.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | yes | The name of the window global to set, which may be dotted. |
| `value` | string | no | The value to assign; leave out to set it empty. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `missing_name` | No global name was given. | Pass the name to set. |

**Example: assigns a window global**

```js
const result = await dsx.module.dom.set({"name":"sharedData","value":"ready"});
```

### stop

`dsx.module.dom.stop`

Stops the page that the web view is still loading.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

_None._

**Example: stops loading**

```js
const result = await dsx.module.dom.stop({});
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `always_open_in_inapp_tab` | list | `[]` | Hosts always opened in an in-app tab. |
| `append_language` | boolean | `false` | Append the device language to requests. |
| `audio_mix_with_others` | boolean | `false` | Let app audio mix with other apps. |
| `auto_refresh_on_foreground` | boolean | `false` | Reload the page when the app returns to the foreground. |
| `block_trigger` | list | `[]` | URL fragments that block navigation. |
| `bridge_origins` | list | `[]` | Extra origins granted the native bridge under the 'app' policy. |
| `bridge_policy` | string | `app` | Which pages on the app web view may use the native bridge. |
| `bridge_subdomains` | boolean | `false` | Whether subdomains of the app host inherit the native bridge under the 'app' policy. |
| `cancel_button` | string | `Cancel` | The default label of the Cancel button in web view dialogs. |
| `delete_cache` | boolean | `false` | Clear the web cache on launch. |
| `delete_cache_on_exit` | boolean | `false` | Clear the web cache when the app closes. |
| `disable_callout` | boolean | `true` | Disable the long-press callout menu. |
| `enable_swipe_navigation` | boolean | `true` | Allow swipe back and forward gestures. |
| `enhance_url_uuid` | boolean | `false` | Append a per-device UUID to requests. |
| `external_link_handling` | number | `0` | How external links open; see the codes above. |
| `facebook_login_helper_triggers` | list | `[]` | URL fragments that trigger the Facebook login helper. |
| `force_ipad_mobile_mode` | boolean | `true` | Request the mobile site on iPad. |
| `google_login_helper_triggers` | list | `[]` | URL fragments that trigger the Google login helper. |
| `hide_horizontal_scrollbar` | boolean | `false` | Hide the horizontal scroll indicator. |
| `hide_vertical_scrollbar` | boolean | `false` | Hide the vertical scroll indicator. |
| `host` | string | `` | The domain only, written without https:// and without www. |
| `indicator_color` | color | `#41464D` | The colour of the loading spinner or bar shown while pages load. |
| `link_drag_and_drop` | boolean | `true` | Allow dragging links out of the web view. |
| `merge_custom_user_agent` | boolean | `true` | Append the custom user-agent below to the default one. |
| `never_open_in_inapp_tab` | list | `[]` | Hosts never opened in an in-app tab. |
| `ok_button` | string | `OK` | The default label of the OK button in web view dialogs. |
| `orientation_ipad` | string | `auto` | Allowed orientations for a full-screen-only iPad app. Resizable Split View and Stage Manager apps always use auto. |
| `orientation_iphone` | string | `auto` | Allowed orientations on iPhone: portrait, landscape, or auto. |
| `prevent_overscroll` | boolean | `true` | Block the rubber-band overscroll bounce. |
| `prevent_zoom` | boolean | `true` | Block pinch / double-tap zoom in the web view (native feel). Set false to allow zoom. |
| `runtime_identifier` | string | `despia` | Value exposed as window.native_runtime for the web app to detect. |
| `safari_blacklist` | list | `["www.neveropeninsafari.com"]` | Hosts never opened in Safari. |
| `safari_whitelist` | list | `[]` | Hosts always opened in Safari. |
| `show_external_link` | boolean | `false` | Show a small indicator when a link leads to another website. |
| `special_link_handling` | number | `1` | How special links such as tel and mailto open. |
| `use_custom_picker` | boolean | `true` | Use the native file picker for file inputs. |
| `use_loading_progress_bar` | boolean | `false` | Show a top progress bar while pages load. |
| `use_loading_sign` | boolean | `true` | Show the spinner while pages load. |
| `useragent_android` | string | `despia-android` | Custom user-agent fragment on Android; empty uses the default. |
| `useragent_ipad` | string | `` | Custom user-agent fragment on iPad; empty uses the default. |
| `useragent_iphone` | string | `despia-iphone` | Custom user-agent fragment on iPhone. |
| `vision_kit_enable` | boolean | `false` | Turn on Apple VisionKit features such as selecting text in images. |
| `web_bundle_path` | string | `Assets/Web/` | The project folder holding your static export (it needs an index.html). |
| `web_source` | string | `remote` | remote opens your website; bundled ships a folder of static files inside the app and serves it from a real local origin. |
| `web_spa_fallback` | boolean | `true` | Unknown paths without a file extension answer index.html so your router can handle them. |
| `webview_url` | url | `` | Full URL the web view loads on launch. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `eval_failed` | The script you ran in the page threw an error. | Check the script for mistakes and test it in the page. |
| `invalid_url` | The address uses a URL scheme or local path that is not allowed. | Use http or https, or a bundled path. |
| `load_failed` | The web view could not load the address. | Check the address and the network connection, then try again. |
| `no_webview` | No web view is showing, so there is nothing to control. | Show a web view in your layout first. |
| `unsafe_url` | The address is not one this web view may be sent to. | Use an http or https address, a registered app URL scheme, or a bundled file. |
| `webview_failed` | The web view refused the operation it was asked to do. | Try again, and check that a web view is showing. |

## Related packages

- Used by: [DSXWebView](/packages/dsxwebview), [Legacy](/packages/legacy), [ContentServer](/packages/cdn)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
