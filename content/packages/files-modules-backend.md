---
title: Backend
description: Let devices upload files straight to your own storage bucket with short-lived signed links.
package: backend
---

Let devices upload files straight to your own storage bucket with short-lived signed links.

The server half of Files. It signs a temporary storage link for one file of the signed-in person, so the device sends the file straight to your bucket without it passing through your server and without the storage keys leaving your server. You supply the bucket and decide who may sign.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when people upload or download their own documents to your storage. Keep the lifetime short, because the link is a bearer credential. It is not for sharing files between different people.

## Install

```sh
despia add Core/Files/Modules/Backend
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | no |
| web | no |
| macos | no |

## Actions

### presign

`dsx.module.backend.presign`

Signs a short-lived link for one file in the signed-in person's own area of your bucket, so the device can upload or download it directly.

**When not to.** Do not hand the link to anyone else; it works for whoever holds it until it expires.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `expiresIn` | number | no | How long the link works, from 1 to 3600 seconds; the default is 300. |
| `method` | string | no | put to upload (the default) or get to download. |
| `path` | string | yes | The documents: path of the file, such as documents:reports/q3.pdf. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `expires` | string | yes | When the link stops working. |
| `headers` | object | yes | Headers the request must send along with the link. |
| `method` | string | yes | The HTTP method the link must be used with. |
| `path` | string | yes | The documents: path the link was signed for. |
| `url` | string | yes | The signed link to send the file to or read it from. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `authentication_required` | A storage URL is signed for a signed in person, and there is none. | Not recoverable by retrying. |
| `bad_request` | The path is not a documents: file, or the method or lifetime is not one this action signs. | Not recoverable by retrying. |
| `bucket_not_declared` | The document declares no <bucket> by the name FILES_BUCKET gives (default files). | Not recoverable by retrying. |
| `key_invalid` | The documents: path does not make a legal storage key (a .. segment, a percent, a control character). | Not recoverable by retrying. |
| `not_configured` | No object store is bound to this deployment. | Not recoverable by retrying. |

**Example: Sign a five minute upload link**

```js
const result = await dsx.module.backend.presign({"expiresIn":300,"method":"put","path":"documents:reports/q3.pdf"});
// resolves {"expires":"2026-10-09T12:05:00.000Z","headers":{},"method":"PUT","path":"documents:reports/q3.pdf","url":"https://files.example.com/files/user_123/reports/q3.pdf"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `bucket` | string | `files` | The <bucket> in your server document that holds people's files. |

## Related packages

- Needs: [Files](/packages/files)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
