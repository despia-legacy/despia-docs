---
title: Key-value storage
description: Save small settings and values on the device so they are still there next time the app opens.
package: storage
---

Save small settings and values on the device so they are still there next time the app opens.

A simple store for things like a theme choice, a language or a last-seen date. Values keep their type: a number comes back a number. Read or write one value or many at once in a single call, list keys by prefix a page at a time, and every change is announced so two screens never disagree. Values stay on the device, with no account or keys needed.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it to remember small things between launches, such as a theme, a language or the last screen. It is not meant for large files or secrets; use files for big data and a secure store for credentials.

## What native adds

Values live in the app's own native storage, so they stay put across launches and keep their type.

## Install

```sh
despia add Core/Basics/ValueStore
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

### clear

`dsx.module.storage.clear`

Deletes every key in this app's store and says how many were removed.

**When not to.** It cannot be undone, so use it only for a reset or sign-out.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the change was made. |
| `removed` | number | yes | How many keys were actually deleted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `app_identity_missing` | A desktop app needs a stable app id before it can save values. | Set the app id in the project settings. |
| `persistence_unavailable` | The desktop store for this app could not be reached. | Restart the app and try again. |
| `storage_unavailable` | The key-value store is not available on this device yet. | Try again after the app has finished starting. |
| `value_too_large` | The value is bigger than the desktop store allows. | Save less data, or keep large content in a file. |

**Example: empties the keyed store and reports how many keys went**

```js
const result = await dsx.module.storage.clear({});
// resolves {"ok":true,"removed":2}
```

**Example: clearing an empty store is a no-op**

```js
const result = await dsx.module.storage.clear({});
// resolves {"ok":true,"removed":0}
```

### get

`dsx.module.storage.get`

Reads one saved value by its key, with its original type, and says whether the key was found.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The name the value is saved under; it must be a non-empty string. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `found` | boolean | yes | True when the key is saved, which tells a saved null from a missing key. For multiGet, the number of keys found. |
| `value` | any | yes | The saved value with its original type, or null when the key is not saved. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `app_identity_missing` | A desktop app needs a stable app id before it can save values. | Set the app id in the project settings. |
| `invalid_key` | The key is empty or not a string. | Use a non-empty string as the key. |
| `persistence_unavailable` | The desktop store for this app could not be reached. | Restart the app and try again. |
| `storage_unavailable` | The key-value store is not available on this device yet. | Try again after the app has finished starting. |

**Example: reads a stored key**

```js
const result = await dsx.module.storage.get({"key":"theme"});
// resolves {"found":true,"value":"dark"}
```

**Example: an absent key is found:false, never an error**

```js
const result = await dsx.module.storage.get({"key":"nothing-here"});
// resolves {"found":false,"value":null}
```

### list

`dsx.module.storage.list`

Returns one page of saved keys, optionally filtered by prefix or range and optionally with their values.

**When to use it.** Use it to show a list of saved items, such as drafts, and page through them with the cursor.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `after` | string | no | The cursor from the previous page, to continue after it. |
| `end` | string | no | Only return keys before this one, alphabetically (exclusive). |
| `limit` | number | no | How many keys to return at most; the default is 100 and the largest is 1000. |
| `prefix` | string | no | Only return keys that start with this text. |
| `reverse` | boolean | no | Set to true to walk the keys from last to first. |
| `start` | string | no | Only return keys from this one onward, alphabetically (inclusive). |
| `values` | boolean | no | Set to true to include each key's value in the results. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cursor` | string | yes | Pass this back as after to get the next page. |
| `items` | array of object | yes | The keys in this page, each with its key and, if asked for, its value. |
| `more` | boolean | yes | True when there are more keys after this page. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `app_identity_missing` | A desktop app needs a stable app id before it can save values. | Set the app id in the project settings. |
| `invalid_query` | One of the list options has the wrong type, or the limit is below 1. | Use strings for prefix, start, end and after, booleans for reverse and values, and a whole number of 1 or more for limit. |
| `persistence_unavailable` | The desktop store for this app could not be reached. | Restart the app and try again. |
| `storage_unavailable` | The key-value store is not available on this device yet. | Try again after the app has finished starting. |

**Example: lists every stored key, sorted**

```js
const result = await dsx.module.storage.list({});
// resolves {"cursor":"","items":[{"key":"locale"},{"key":"theme"}],"more":false}
```

**Example: an empty store lists nothing**

```js
const result = await dsx.module.storage.list({});
// resolves {"cursor":"","items":[],"more":false}
```

### multiGet

`dsx.module.storage.multiGet`

Reads several keys in one call. Keys that are not saved are left out of the answer.

**When to use it.** Use it instead of many get calls when a screen needs a dozen settings.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `keys` | array of string | yes | The list of key names to read or remove. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `found` | number | yes | True when the key is saved, which tells a saved null from a missing key. For multiGet, the number of keys found. |
| `values` | object | yes | The values found, keyed by name; missing keys are left out. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `app_identity_missing` | A desktop app needs a stable app id before it can save values. | Set the app id in the project settings. |
| `invalid_keys` | The keys are not a list of non-empty strings. | Pass an array of non-empty strings. |
| `persistence_unavailable` | The desktop store for this app could not be reached. | Restart the app and try again. |
| `storage_unavailable` | The key-value store is not available on this device yet. | Try again after the app has finished starting. |

**Example: a settings screen reads twelve keys in ONE call**

```js
const result = await dsx.module.storage.multiGet({"keys":["k1","k2","k3","k4","k5","k6","k7","k8","k9","k10","k11","k12"]});
// resolves {"found":12,"values":{"k1":"1","k10":"10","k11":"11","k12":"12","k2":"2","k3":"3","k4":"4","k5":"5","k6":"6","k7":"7","k8":"8","k9":"9"}}
```

**Example: absent keys are omitted, present ones still come back**

```js
const result = await dsx.module.storage.multiGet({"keys":["theme","missing"]});
// resolves {"found":1,"values":{"theme":"dark"}}
```

### multiRemove

`dsx.module.storage.multiRemove`

Deletes several keys in one call, written together. Keys that are not there are ignored.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `keys` | array of string | yes | The list of key names to read or remove. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the change was made. |
| `removed` | number | yes | How many keys were actually deleted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `app_identity_missing` | A desktop app needs a stable app id before it can save values. | Set the app id in the project settings. |
| `invalid_keys` | The keys are not a list of non-empty strings. | Pass an array of non-empty strings. |
| `persistence_unavailable` | The desktop store for this app could not be reached. | Restart the app and try again. |
| `storage_unavailable` | The key-value store is not available on this device yet. | Try again after the app has finished starting. |
| `value_too_large` | The value is bigger than the desktop store allows. | Save less data, or keep large content in a file. |

**Example: removes many keys in ONE call and counts what was there**

```js
const result = await dsx.module.storage.multiRemove({"keys":["a","b","missing"]});
// resolves {"ok":true,"removed":2}
```

**Example: removing absent keys is a no-op, and still announced**

```js
const result = await dsx.module.storage.multiRemove({"keys":["x"]});
// resolves {"ok":true,"removed":0}
```

### multiSet

`dsx.module.storage.multiSet`

Saves several values in one call, written together.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `values` | object | yes | Set to true to include each key's value in the results. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the change was made. |
| `written` | number | yes | How many values were saved. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `app_identity_missing` | A desktop app needs a stable app id before it can save values. | Set the app id in the project settings. |
| `invalid_values` | The values are not an object with non-empty string keys. | Pass an object such as { theme: "dark" }. |
| `persistence_unavailable` | The desktop store for this app could not be reached. | Restart the app and try again. |
| `storage_unavailable` | The key-value store is not available on this device yet. | Try again after the app has finished starting. |
| `unstorable_value` | The value cannot be turned into JSON, for example NaN or an infinite number. | Save a plain string, finite number, boolean, list or object. |
| `value_too_large` | The value is bigger than the desktop store allows. | Save less data, or keep large content in a file. |

**Example: writes a whole settings screen in ONE call**

```js
const result = await dsx.module.storage.multiSet({"values":{"locale":"en","theme":"dark"}});
// resolves {"ok":true,"written":2}
```

**Example: writes typed values in one call**

```js
const result = await dsx.module.storage.multiSet({"values":{"beta":true,"fontSize":14,"name":"Ada"}});
// resolves {"ok":true,"written":3}
```

### open

`dsx.module.storage.open`

Brings the store up to the version your app declares by running your declared upgrade steps, and refuses a store written by a newer app.

**When to use it.** Call it once on your first screen, before reading any value, if your app ever changes the shape of what it saves.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `from` | number | yes | The storage version the store was at before. |
| `migrated` | number | yes | How many upgrade steps were run. |
| `version` | number | yes | The storage version the store is now at. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `app_identity_missing` | A desktop app needs a stable app id before it can save values. | Set the app id in the project settings. |
| `persistence_unavailable` | The desktop store for this app could not be reached. | Restart the app and try again. |
| `storage_unavailable` | The key-value store is not available on this device yet. | Try again after the app has finished starting. |
| `store_ahead` | The saved data was written by a newer version of the app, and cannot be read by this one. | Update the app to the newer version. |
| `store_declaration_invalid` | The app's storage declaration could not be read, so the saved data was not opened. | Fix the storage declaration in the app's settings. |
| `store_migration_missing` | The app has no declared upgrade step for every version between the saved data and the current one. | Add the missing upgrade steps to the app's storage declaration. |
| `store_unreadable` | The saved data has a storage version this app cannot read. | Update the app, or clear the saved data. |
| `value_too_large` | The value is bigger than the desktop store allows. | Save less data, or keep large content in a file. |

**Example: a fresh store is stamped with the declared version and migrates nothing**

```js
const result = await dsx.module.storage.open({});
```

**Example: a store one version behind runs its migration and is stamped forward**

```js
const result = await dsx.module.storage.open({});
```

### remove

`dsx.module.storage.remove`

Deletes one saved key. Removing a key that is not there does nothing.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The name the value is saved under; it must be a non-empty string. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the change was made. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `app_identity_missing` | A desktop app needs a stable app id before it can save values. | Set the app id in the project settings. |
| `invalid_key` | The key is empty or not a string. | Use a non-empty string as the key. |
| `persistence_unavailable` | The desktop store for this app could not be reached. | Restart the app and try again. |
| `storage_unavailable` | The key-value store is not available on this device yet. | Try again after the app has finished starting. |
| `value_too_large` | The value is bigger than the desktop store allows. | Save less data, or keep large content in a file. |

**Example: removes a key**

```js
const result = await dsx.module.storage.remove({"key":"theme"});
// resolves {"ok":true}
```

**Example: removing an absent key is a no-op, never an error**

```js
const result = await dsx.module.storage.remove({"key":"nothing-here"});
// resolves {"ok":true}
```

### set

`dsx.module.storage.set`

Saves one value under a key. Strings, numbers, true or false, null, lists and objects are all kept with their type.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The name the value is saved under; it must be a non-empty string. |
| `value` | any | yes | The value to save: a string, number, boolean, null, list or object. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the change was made. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `app_identity_missing` | A desktop app needs a stable app id before it can save values. | Set the app id in the project settings. |
| `invalid_key` | The key is empty or not a string. | Use a non-empty string as the key. |
| `persistence_unavailable` | The desktop store for this app could not be reached. | Restart the app and try again. |
| `storage_unavailable` | The key-value store is not available on this device yet. | Try again after the app has finished starting. |
| `unstorable_value` | The value cannot be turned into JSON, for example NaN or an infinite number. | Save a plain string, finite number, boolean, list or object. |
| `value_too_large` | The value is bigger than the desktop store allows. | Save less data, or keep large content in a file. |

**Example: persists a value under a key**

```js
const result = await dsx.module.storage.set({"key":"theme","value":"dark"});
// resolves {"ok":true}
```

**Example: stores a number as a number**

```js
const result = await dsx.module.storage.set({"key":"fontSize","value":14});
// resolves {"ok":true}
```

## Events

Read with `dsx.on(name, handler)`.

### change

Sent after any write to the store: set, remove, clear, their multi versions, and an open that upgraded the store.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `keys` | array of string | yes | The keys the write touched, without repeats. |
| `op` | string | yes | The kind of write: set, remove or clear. |

## Related packages

- Used by: [Supabase](/packages/supabase)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
