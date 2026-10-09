---
title: Contacts
description: Let users share a contact, or read and edit the address book.
package: contacts
---

Let users share a contact, or read and edit the address book.

The default is the system contact picker, which needs no permission and only returns the contact the user chooses. For features that need more, it can list, search, add, update and remove contacts and groups after asking permission, with text you set.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use pick when the user needs to choose one or a few people for a feature such as an invite. Only use the list, add and remove actions when the feature really needs the address book, because App Review rejects apps that ask for more than they use.

## What native adds

The system picker returns only the contacts the user chooses and needs no permission, which a web page cannot match on iOS.

## Install

```sh
despia add Core/Contacts
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, desktop.

## Actions

### add

`dsx.module.contacts.add`

Saves a new contact in the address book; it needs the user's write permission.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `contact` | object | yes | The details of the new contact. |
| `contact.addresses` | array of object | no | Postal addresses as a list with label, street, city, region, postal code and country. |
| `contact.birthday` | string | no | The birthday written as YYYY-MM-DD. |
| `contact.company` | string | no | The company or organization the contact belongs to. |
| `contact.displayName` | string | no | The full name to show for the contact, used when no separate name parts are given. |
| `contact.emails` | array of object | no | Email addresses as a list of label and value pairs. |
| `contact.familyName` | string | no | The contact's last name. |
| `contact.givenName` | string | no | The contact's first name. |
| `contact.jobTitle` | string | no | The contact's job title at the company. |
| `contact.middleName` | string | no | The contact's middle name, saved between the first and last name. |
| `contact.nickname` | string | no | A short name the contact is known by. |
| `contact.note` | string | no | Free text notes saved on the contact. |
| `contact.phones` | array of object | no | Phone numbers as a list of label and value pairs. |
| `contact.prefix` | string | no | A title before the name, such as Dr. |
| `contact.suffix` | string | no | A suffix after the name, such as Jr. |
| `contact.urls` | array of object | no | Web addresses as a list of label and value pairs. |
| `prompt` | boolean | no | Leave it out or pass true to let the system permission dialog appear on this call when needed; pass false to never show a dialog and fail with the permission state instead. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the contact that was created. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_contact` | The contact has no name, phone number or email, so there is nothing to save. | Give the contact at least a name, a phone number or an email address. |
| `permission_denied` | Access was not granted, so the call could not run. The error data carries the permission, status and canAsk. | If canAsk is true call the permission request action first; otherwise offer a button that opens Settings. |
| `write_failed` | The address book refused to save the change. | Try again, and check that the user has granted write access. |

**Example: saves and returns the new id**

```js
const result = await dsx.module.contacts.add({"contact":{"emails":[{"label":"work","value":"ada@example.com"}],"familyName":"Lovelace","givenName":"Ada"}});
// resolves {"id":"c9"}
```

### get

`dsx.module.contacts.get`

Returns one contact with all its fields, found by the id that pick or list gave you.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `fields` | array of string | no | A list of contact fields to load; leave it out for all of them. |
| `id` | string | yes | The id of the contact to load. |
| `prompt` | boolean | no | Leave it out or pass true to let the system permission dialog appear on this call when needed; pass false to never show a dialog and fail with the permission state instead. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `contact` | object | yes | The contact that was found. |
| `contact.addresses` | array of object | no | Postal addresses as a list with label, street, city, region, postal code and country. |
| `contact.birthday` | string | no | The birthday written as YYYY-MM-DD. |
| `contact.company` | string | no | The company or organization the contact belongs to. |
| `contact.displayName` | string | no | The full name to show for the contact, used when no separate name parts are given. |
| `contact.emails` | array of object | no | Email addresses as a list of label and value pairs. |
| `contact.familyName` | string | no | The contact's last name. |
| `contact.givenName` | string | no | The contact's first name. |
| `contact.id` | string | yes | The id of this contact in this device's address book. |
| `contact.image` | string | no | A small thumbnail as a data:image/jpeg;base64 URL, on iOS. |
| `contact.jobTitle` | string | no | The contact's job title at the company. |
| `contact.middleName` | string | no | The contact's middle name, kept between the first and last name. |
| `contact.nickname` | string | no | A short name the contact is known by. |
| `contact.note` | string | no | Free text notes saved on the contact. |
| `contact.phones` | array of object | no | Phone numbers as a list of label and value pairs. |
| `contact.prefix` | string | no | A title before the name, such as Dr. |
| `contact.socialProfiles` | array of object | no | Social media profiles saved on the contact. |
| `contact.suffix` | string | no | A suffix after the name, such as Jr. |
| `contact.urls` | array of object | no | Web addresses as a list of label and value pairs. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_found` | No contact with that id exists on this device. | Load the list again, because ids are not shared between devices. |
| `permission_denied` | Access was not granted, so the call could not run. The error data carries the permission, status and canAsk. | If canAsk is true call the permission request action first; otherwise offer a button that opens Settings. |

**Example: hydrates the vCard shape**

```js
const result = await dsx.module.contacts.get({"id":"c1"});
// resolves {"contact":{"addresses":[{"city":"Lisbon","country":"PT","label":"home","postalCode":"1000-001","region":"","street":"1 Main St"}],"birthday":"1990-04-02","company":"Example Inc","displayName":"Jane Doe","emails":[{"label":"work","value":"jane@example.com"}],"familyName":"Doe","givenName":"Jane","id":"c1","jobTitle":"Engineer","phones":[{"label":"mobile","value":"+15551234567"}]}}
```

### groups

`dsx.module.contacts.groups`

Lists the contact groups in the address book; groups can be read but not edited.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `prompt` | boolean | no | Leave it out or pass true to let the system permission dialog appear on this call when needed; pass false to never show a dialog and fail with the permission state instead. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `groups` | array of object | yes | The contact groups found on the device. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | Access was not granted, so the call could not run. The error data carries the permission, status and canAsk. | If canAsk is true call the permission request action first; otherwise offer a button that opens Settings. |
| `read_failed` | The contact groups could not be read. | Try again, and check that the user has granted read access. |

**Example: lists the store groups**

```js
const result = await dsx.module.contacts.groups({});
// resolves {"groups":[{"count":4,"id":"g1","name":"Family"},{"count":12,"id":"g2","name":"Work"}]}
```

### list

`dsx.module.contacts.list`

Returns one page of contacts from the address book, optionally filtered by name and limited to the fields you ask for.

**When to use it.** Use it for a contact list screen that needs more than the system picker offers.

**When not to.** Do not use it just to let the user choose one person; use pick.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `after` | string | no | The end cursor from the previous page, to get the next page. |
| `fields` | array of string | no | A list of contact fields to load; asking for fewer fields makes the call faster. |
| `limit` | int | no | How many contacts to return in this page; defaults to 100 and never exceeds 500. |
| `prompt` | boolean | no | Leave it out or pass true to let the system permission dialog appear on this call when needed; pass false to never show a dialog and fail with the permission state instead. |
| `query` | string | no | Text to look for inside the contact display names, ignoring case. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `access` | string | yes | Whether the app can see the whole address book or only a limited selection the user shared. |
| `contacts` | array of object | yes | The contacts found in this page, with the fields you asked for. |
| `endCursor` | string | no | Pass this as after to load the next page. |
| `hasNextPage` | boolean | yes | True when another page is available. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `permission_denied` | Access was not granted, so the call could not run. The error data carries the permission, status and canAsk. | If canAsk is true call the permission request action first; otherwise offer a button that opens Settings. |
| `read_failed` | The address book could not be read. | Try again, and check that the user has granted read access. |

**Example: pages with a cursor**

```js
const result = await dsx.module.contacts.list({"limit":2});
// resolves {"access":"granted","contacts":[{"displayName":"Jane Doe","id":"c1"},{"displayName":"Sam Ray","id":"c2"}],"endCursor":"2","hasNextPage":true}
```

**Example: the last page carries no cursor**

```js
const result = await dsx.module.contacts.list({"after":"2","limit":2});
// resolves {"access":"granted","contacts":[{"displayName":"Ada L","id":"c3"}],"hasNextPage":false}
```

### permission.manage

`dsx.module.contacts.permission.manage`

Lets the user change which items this app can see when the address book is limited, without leaving the app; elsewhere it only reports the current state.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog for the address book; false means only Settings can change it. |
| `changed` | boolean | yes | True when the user changed the selection in the system picker. |
| `level` | string | no | The permission level that this answer is about. |
| `status` | string | yes | The current state of the address book: undetermined, granted, limited, denied, restricted or unavailable. |

**Example: not limited: nothing to manage**

```js
const result = await dsx.module.contacts.permission.manage({});
// resolves {"canAsk":false,"changed":false,"status":"granted"}
```

### permission.openSettings

`dsx.module.contacts.permission.openSettings`

Opens this app's page in the system Settings so the user can change a denied permission.

**When to use it.** Call it only from a button the user taps, never automatically after a denial.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when the Settings page was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unavailable` | Opening Settings needs the App Settings package, which is not part of this app. | Add the App Settings package to the app, or tell the user where to find Settings. |
| `unsupported_platform` | A web page cannot open browser or system settings. | Show the user a short instruction for changing the permission in their browser instead. |

**Example: opens the app page**

```js
const result = await dsx.module.contacts.permission.openSettings({});
// resolves {"opened":true}
```

### permission.request

`dsx.module.contacts.permission.request`

Asks for the address book with the system dialog, for a settings row or an onboarding step; the dialog only appears while the system still allows it.

**When to use it.** Use it when the user taps something that clearly needs the permission, or on a priming screen you design.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | string | no | Which permission level to check, read, write or full; it defaults to read when left out. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog for the address book; false means only Settings can change it. |
| `level` | string | no | The permission level that this answer is about. |
| `status` | string | yes | The current state of the address book: undetermined, granted, limited, denied, restricted or unavailable. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_level` | The level you passed is not one this package knows. | Pass read, write or full, or leave the level out to use read. |

**Example: a granted read**

```js
const result = await dsx.module.contacts.permission.request({"level":"read"});
// resolves {"canAsk":false,"level":"read","status":"granted"}
```

**Example: a refused prompt**

```js
const result = await dsx.module.contacts.permission.request({"level":"full"});
// resolves {"canAsk":false,"level":"full","status":"denied"}
```

### permission.status

`dsx.module.contacts.permission.status`

Reads the current state of the address book without ever showing a dialog, so a settings screen can call it every time it appears.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `level` | string | no | Which permission level to check, read, write or full; it defaults to read when left out. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canAsk` | boolean | yes | True while the system can still show its permission dialog for the address book; false means only Settings can change it. |
| `level` | string | no | The permission level that this answer is about. |
| `status` | string | yes | The current state of the address book: undetermined, granted, limited, denied, restricted or unavailable. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_level` | The level you passed is not one this package knows. | Pass read, write or full, or leave the level out to use read. |

**Example: a granted read**

```js
const result = await dsx.module.contacts.permission.status({"level":"read"});
// resolves {"canAsk":false,"level":"read","status":"granted"}
```

**Example: iOS 17 limited access is its own status, not a denial**

```js
const result = await dsx.module.contacts.permission.status({});
// resolves {"canAsk":false,"level":"read","status":"limited"}
```

### pick

`dsx.module.contacts.pick`

Opens the system contact picker and returns only the contacts the user chooses, without asking for any permission.

**When to use it.** This is the default way to let someone share or select a contact.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `fields` | array of string | no | A list of contact fields to return; leave it out to get every field the picker provides. |
| `multiple` | boolean | no | Pass true to allow choosing several contacts; Android allows only one and says so in the result. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cancelled` | boolean | yes | True when the user closed the picker without choosing. |
| `contacts` | array of object | yes | The contacts the user chose, empty when the picker was dismissed. |
| `multiple` | boolean | no | Only present as false when several were requested but the platform picker can return just one. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `pick_unavailable` | There is no contact picker to show right now, or one is already on screen. | Wait for the current picker to close, then try again. |
| `unsupported_device` | This device has no contact picker the app can open. | Let the user type the details by hand instead. |

**Example: returns the chosen contact and asks for no permission**

```js
const result = await dsx.module.contacts.pick({});
// resolves {"cancelled":false,"contacts":[{"displayName":"Jane Doe","familyName":"Doe","givenName":"Jane","id":"c1","phones":[{"label":"mobile","value":"+15551234567"}]}]}
```

**Example: a dismissed picker resolves cancelled, it does not fail**

```js
const result = await dsx.module.contacts.pick({});
// resolves {"cancelled":true,"contacts":[]}
```

### read

`dsx.module.contacts.read`

Returns the whole address book at once as names mapped to phone numbers, asking for access first.

**When not to.** For paging, field choice or ids, use permission and list; for one contact, use pick.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `groupBy` | string | no | Use contact to keep contacts with the same name apart with numbered suffixes, or name to merge them into one entry. |
| `prompt` | boolean | no | Leave it out or pass true to let the system permission dialog appear on this call when needed; pass false to never show a dialog and fail with the permission state instead. |

**Resolves with**

_None._

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `fetch_failed` | The contacts could not be read. | Try again, and check that the user has granted read access. |
| `fetch_unavailable` | The address book returned nothing to read when grouping by name. | Try again, or use the list action instead. |
| `permission_denied` | Access was not granted, so the call could not run. The error data carries the permission, status and canAsk. | If canAsk is true call the permission request action first; otherwise offer a button that opens Settings. |

**Example: reads the address book once granted**

```js
const result = await dsx.module.contacts.read({});
// resolves {"Jane Doe":["+15551234567"]}
```

### remove

`dsx.module.contacts.remove`

Deletes one contact from the address book, which the app cannot undo.

**When to use it.** Call it only after the user has confirmed.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the contact to delete. |
| `prompt` | boolean | no | Leave it out or pass true to let the system permission dialog appear on this call when needed; pass false to never show a dialog and fail with the permission state instead. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `removed` | boolean | yes | True when the contact was deleted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_found` | No contact with that id exists on this device. | Load the list again before trying to delete. |
| `permission_denied` | Access was not granted, so the call could not run. The error data carries the permission, status and canAsk. | If canAsk is true call the permission request action first; otherwise offer a button that opens Settings. |
| `write_failed` | The address book refused to delete the contact. | Try again, and check that the user has granted write access. |

**Example: removes the contact**

```js
const result = await dsx.module.contacts.remove({"id":"c1"});
// resolves {"removed":true}
```

### update

`dsx.module.contacts.update`

Changes fields on an existing contact and leaves every field you do not send as it was; an empty list clears that field.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `contact` | object | yes | The fields to change on the contact; fields you leave out stay as they are. |
| `contact.addresses` | array of object | no | Postal addresses as a list with label, street, city, region, postal code and country. |
| `contact.birthday` | string | no | The birthday written as YYYY-MM-DD. |
| `contact.company` | string | no | The company or organization the contact belongs to. |
| `contact.displayName` | string | no | The full name to show for the contact, used when no separate name parts are given. |
| `contact.emails` | array of object | no | Email addresses as a list of label and value pairs. |
| `contact.familyName` | string | no | The contact's last name. |
| `contact.givenName` | string | no | The contact's first name. |
| `contact.jobTitle` | string | no | The contact's job title at the company. |
| `contact.middleName` | string | no | A second given name that sits between the first and last name. |
| `contact.nickname` | string | no | A short name the contact is known by. |
| `contact.note` | string | no | Free text notes saved on the contact. |
| `contact.phones` | array of object | no | Phone numbers as a list of label and value pairs. |
| `contact.prefix` | string | no | A title before the name, such as Dr. |
| `contact.suffix` | string | no | A suffix after the name, such as Jr. |
| `contact.urls` | array of object | no | Web addresses as a list of label and value pairs. |
| `id` | string | yes | The id of the contact to change. |
| `prompt` | boolean | no | Leave it out or pass true to let the system permission dialog appear on this call when needed; pass false to never show a dialog and fail with the permission state instead. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The id of the contact that was changed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_found` | No contact with that id exists on this device. | Load the contact again before changing it. |
| `permission_denied` | Access was not granted, so the call could not run. The error data carries the permission, status and canAsk. | If canAsk is true call the permission request action first; otherwise offer a button that opens Settings. |
| `write_failed` | The address book refused to save the change. | Try again, and check that the user has granted write access. |

**Example: merges the supplied fields**

```js
const result = await dsx.module.contacts.update({"contact":{"jobTitle":"Principal Engineer"},"id":"c1"});
// resolves {"id":"c1"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `page_size` | number | `100` | How many contacts one dsx.module.contacts.list() page returns when the caller does not pass a limit. |
| `usage_description` | multiline | `Find the people you already know so you can reach them from inside the app` | The message iOS shows when the app asks to read the user's contacts. Say what the app does with them, in one concrete sentence. |
| `write_usage_description` | multiline | `Save new contacts you create here straight to your address book` | The message iOS shows when the app asks to add or change contacts without reading the rest of the address book. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
