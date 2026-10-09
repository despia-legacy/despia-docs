---
title: LivePreview
description: Shows a live, safe, working DSX example inside a document or page.
package: livepreview
---

Shows a live, safe, working DSX example inside a document or page.

Renders a piece of DSX in a sandbox next to your text, fitted into the column, with a Preview and Code switch and a zoomable detail view. The example can only use what you explicitly grant it and answers from sample data, never from your real app. You supply the source and the sample data.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it in documentation, guides or a design review where readers should see and try a component. Do not use it to show real app screens that need your live data.

## What native adds

The example is drawn by the device's own renderer, so readers see exactly how it looks and behaves on that device rather than a screenshot.

## Install

```sh
despia add Core/LivePreview
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | no |
| web | yes |
| macos | no |

Device classes: phone, tablet, desktop.

## Actions

### resolve

`dsx.module.livepreview.resolve`

Checks whether a preview can run in this build without showing it. If it cannot, it lists exactly which components, packages or files are missing.

**When to use it.** Call it from a tool or a doc check to learn why a preview would not render.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `component` | string | no | The tag name of a component to preview. |
| `data` | object | no | Sample data the preview answers from. |
| `data.api` | object | no | Sample answers for network calls the preview makes. |
| `data.samples` | object | no | Sample answers for the capabilities you granted. |
| `data.vars` | object | no | Sample values for the preview's variables. |
| `grants` | string | no | A space separated list of the capabilities the preview may use, such as clipboard, net or storage. |
| `source` | string | no | DSX markup written inline as text. |
| `src` | string | no | A relative path to a .dsx file inside the app, never a web address. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `error` | string | yes | A plain explanation if the preview could not be resolved. |
| `files` | array of object | yes | The source files that make up the preview, each with its name and text. |
| `missing` | array of object | yes | What is missing, each with its kind, name, reason and where it was needed. |
| `notices` | array of object | yes | Warnings about problems found while resolving the preview. |
| `ok` | boolean | yes | True if the preview can run in this build. |
| `title` | string | yes | The title found for the preview. |

**Example: Check that an inline preview can run in this build**

```js
const result = await dsx.module.livepreview.resolve({"source":"<Text>Hello</Text>"});
// resolves {"files":[{"name":"preview.dsx","text":"<Text>Hello</Text>"}],"missing":[],"notices":[],"ok":true,"title":"Hello"}
```

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `preview_capability_undeclared` | The preview did not declare this capability in grants, so it cannot reach it. | Add the capability to the grants list of the preview. |
| `preview_sample_unavailable` | The preview declared this capability, but no sample provider answers this action in this build. | Add sample data for it, or remove the capability from grants. |
| `preview_source_invalid` | A preview needs exactly one source: inline source, a component tag, or a relative .dsx path. | Pass exactly one of source, component or src. |
| `preview_unresolved` | The preview reaches a component or package that this build does not ship. | Add the missing package to the app, or remove it from the preview. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
