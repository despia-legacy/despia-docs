---
title: App
description: The app's own identity: its links, domains, copyright and export settings.
package: app
---

The app's own identity: its links, domains, copyright and export settings.

Holds the settings that describe the app itself rather than any feature: which web domains and link prefixes open the app, the copyright line, the Mac App Store category and the export compliance answer. Other packages add their own entries, so this one stays small. It ships in every app.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to set the domains and link prefixes that open your app directly, and the copyright and export compliance answers the app stores ask for. It has nothing to call at runtime.

## Install

```sh
despia add Mandatory/App
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | no |
| web | no |
| macos | no |

## Actions

_This package declares no actions._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `app_link_paths` | list | `[]` | Restrict Android App Links to these path prefixes. Empty claims every path on the associated domains. |
| `associated_domains` | list | `[]` | Web domains whose links open directly in the app (universal links and saved passwords). |
| `copyright` | multiline | `All rights reserved.` | The human-readable copyright line embedded in the app bundle. |
| `domains` | list | `[]` | Bare hosts this app owns, e.g. example.com. The build derives every platform registration from them. |
| `macos_category` | string | `public.app-category.utilities` | The Mac App Store category identifier used by the Catalyst build. |
| `url_schemes` | list | `["URLSCHEME"]` | Custom link prefixes that open this app; the first is the primary deep-link scheme. |
| `uses_non_exempt_encryption` | boolean | `false` | Turn on only if the app ships its own or non-standard cryptography. Apps that only use the operating system's HTTPS/TLS leave it off. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
