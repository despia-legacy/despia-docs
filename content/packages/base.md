---
title: Base
description: A private on-device database for your app's own data, with documents, queries, backups and vector search.
package: base
---

A private on-device database for your app's own data, with documents, queries, backups and vector search.

Gives the app one local database file holding key and value documents, queries over them, savepoints you can roll back, durable snapshots and a vector index for similarity search. Live queries keep a list in your screens up to date as data changes. You decide the stores and the shape of your data; nothing is sent off the device.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when the app needs to store and search its own data on the device, offline and fast, including notes, caches, drafts or embeddings for search. Do not use it for data that must be shared between users; that belongs on your backend.

## What native adds

A real on-device database is faster, works offline and survives restarts, which browser storage cannot promise, and it can keep durable backups.

## Install

```sh
despia add Core/Base
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

### capabilities

`dsx.module.base.capabilities`

Reports which actions and features this build of the database supports, so your code can adapt instead of guessing.

**When to use it.** Call it once before using the vector index or backups, which not every platform carries yet.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `abi` | number | yes | The version of the database interface this build provides. |
| `actions` | array of string | yes | The names of the actions this build supports. |
| `features` | array of string | yes | Optional features this build includes, such as vector search. |

**Example: reports the surface this build actually carries**

```js
const result = await dsx.module.base.capabilities({});
// resolves {"abi":1,"actions":[],"features":[]}
```

### declare

`dsx.module.base.declare`

Creates a named store if it does not exist yet. Writing to a store you never declared is refused.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `store` | string | yes | The name of the store, using letters, digits, dot, dash or underscore. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the store exists. |

**Example: declares a store before anything writes to it**

```js
const result = await dsx.module.base.declare({"store":"notes"});
// resolves {"ok":true}
```

### delete

`dsx.module.base.delete`

Removes one document by key. Removing a key that does not exist reports zero deleted.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The key of the document to remove. |
| `store` | string | yes | The name of the store to delete from. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `deleted` | number | yes | How many documents were removed, one or zero. |

**Example: reports what it removed**

```js
const result = await dsx.module.base.delete({"key":"n1","store":"notes"});
// resolves {"deleted":1}
```

**Example: reports zero rather than pretending**

```js
const result = await dsx.module.base.delete({"key":"n1","store":"notes"});
// resolves {"deleted":0}
```

### export

`dsx.module.base.export`

Writes a snapshot out as a file you can share and returns where it is. The data itself is never returned inline.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `label` | string | yes | The label of the snapshot to export. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | number | yes | The size of the exported file in bytes. |
| `url` | string | yes | Where the exported file is, relative to the app container. |

**Example: hands back a container-relative url, never inline bytes**

```js
const result = await dsx.module.base.export({"label":"pre-agent"});
// resolves {"bytes":0,"url":"file:///snapshots/pre-agent.db"}
```

### get

`dsx.module.base.get`

Reads one document by key. A missing key is a normal answer with an empty value, not an error.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The key of the document to read. |
| `store` | string | yes | The name of the store to read from. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `value` | object | no | The saved document, or nothing when the key does not exist. |

**Example: reads a document back**

```js
const result = await dsx.module.base.get({"key":"n1","store":"notes"});
// resolves {"value":{"title":"Invoice"}}
```

**Example: answers a miss with null rather than an error**

```js
const result = await dsx.module.base.get({"key":"nope","store":"notes"});
// resolves {}
```

### index.delete

`dsx.module.base.index.delete`

Removes one entry from a vector index.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `index` | string | yes | The name of the vector index. |
| `key` | string | yes | The key of the entry to remove. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the call completed. |

**Example: removes a document's vector so it cannot answer again**

```js
const result = await dsx.module.base.index.delete({"index":"docs","key":"d1"});
// resolves {"ok":true}
```

### index.info

`dsx.module.base.index.info`

Reports how many entries an index holds and which embedding they were made with.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `index` | string | yes | The name of the vector index. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many entries the index holds. |
| `embedding` | object | no | The embedding every entry in the index was made with. |
| `embedding.dimension` | int | yes | How many numbers each vector from that model holds. |
| `embedding.model` | string | yes | The name of the embedding model that produced the vectors. |
| `embedding.revision` | string | no | An optional version label of the embedding model. |

**Example: answers may-I-search-this-with-what-I-have**

```js
const result = await dsx.module.base.index.info({"index":"docs"});
// resolves {"count":1,"embedding":{"dimension":4,"model":"emb","revision":"r1"}}
```

**Example: reports an index nobody has written to as empty**

```js
const result = await dsx.module.base.index.info({"index":"cold"});
// resolves {"count":0}
```

### index.reindex

`dsx.module.base.index.reindex`

Replaces every vector in an index after you switch embedding models, since old vectors cannot be converted.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `embedding` | object | yes | The embedding that produced the vector: model name, number of dimensions and optional revision. |
| `embedding.dimension` | int | yes | How many numbers each vector from that model holds. |
| `embedding.model` | string | yes | The name of the embedding model that produced the vectors. |
| `embedding.revision` | string | no | An optional version label of the embedding model. |
| `index` | string | yes | The name of the vector index to rebuild. |
| `vectors` | array of object | yes | The new entries, each with a key, a vector and an optional value. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `count` | number | yes | How many entries the index now holds. |
| `ok` | boolean | yes | True when the index was rebuilt. |

**Example: adopts a new embedding and re-admits the refused query**

```js
const result = await dsx.module.base.index.reindex({"embedding":{"dimension":2,"model":"emb2","revision":"r1"},"index":"docs","vectors":[{"key":"d1","vector":[0,1]}]});
// resolves {"count":1,"ok":true}
```

### index.search

`dsx.module.base.index.search`

Finds the entries nearest to a query vector, nearest first. It refuses a query made with a different embedding than the index holds.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `embedding` | object | yes | The embedding that produced the vector: model name, number of dimensions and optional revision. |
| `embedding.dimension` | int | yes | How many numbers each vector from that model holds. |
| `embedding.model` | string | yes | The name of the embedding model that produced the vectors. |
| `embedding.revision` | string | no | An optional version label of the embedding model. |
| `index` | string | yes | The name of the vector index to search. |
| `k` | number | no | How many nearest entries to return. |
| `vector` | array of number | yes | The query vector, a list of numbers. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `hits` | array of object | yes | The nearest entries, each with its key, stored value and distance. |

**Example: returns nearest first with the distance attached**

```js
const result = await dsx.module.base.index.search({"embedding":{"dimension":4,"model":"emb","revision":"r1"},"index":"docs","k":2,"vector":[1,0,0,0]});
// resolves {"hits":[]}
```

### index.upsert

`dsx.module.base.index.upsert`

Adds or replaces a vector in a similarity index, together with the embedding that produced it so mixed-up vectors are caught.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `embedding` | object | yes | The embedding that produced the vector: model name, number of dimensions and optional revision. |
| `embedding.dimension` | int | yes | How many numbers each vector from that model holds. |
| `embedding.model` | string | yes | The name of the embedding model that produced the vectors. |
| `embedding.revision` | string | no | An optional version label of the embedding model. |
| `index` | string | yes | The name of the vector index. |
| `key` | string | yes | The key that identifies this entry. |
| `value` | object | no | Optional data to store with the vector, such as a title. |
| `vector` | array of number | yes | The vector, a list of numbers. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the entry was saved. |

**Example: records the embedding provenance with the entry**

```js
const result = await dsx.module.base.index.upsert({"embedding":{"dimension":4,"model":"emb","revision":"r1"},"index":"docs","key":"d1","value":{"title":"alpha"},"vector":[1,0,0,0]});
// resolves {"ok":true}
```

### live

`dsx.module.base.live`

Runs a query and keeps its rows available to your screens under a name, refreshing them automatically after every change to the stores it reads.

**When to use it.** Use it for lists that should always show the current data without you re-running the query.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `as` | string | yes | The name to publish the rows under; they appear as live.name in the package data. |
| `include` | object | no | Related rows from other stores to attach, named by field, store and parent key field. |
| `limit` | number | no | The most rows to return. |
| `order` | array of object | no | How to sort the rows, a list of fields with a direction of asc or desc. |
| `store` | string | yes | The name of the store to read, declared earlier with declare. |
| `where` | object | no | Conditions the rows must match, such as { amount: { gte: 20 } }. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `rows` | array of object | yes | The rows the query returned the first time. |

**Example: registers a live query and answers its first rows**

```js
const result = await dsx.module.base.live({"as":"openNotes","store":"notes","where":{"paid":{"eq":false}}});
// resolves {"rows":[]}
```

### put

`dsx.module.base.put`

Saves a document under a key in a store, replacing any document already there.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `key` | string | yes | The key that identifies the document in the store. |
| `store` | string | yes | The name of the store to write to. |
| `value` | object | yes | The document to save, a JSON object. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the document was saved. |

**Example: writes a document with its types intact**

```js
const result = await dsx.module.base.put({"key":"n1","store":"notes","value":{"amount":42,"paid":false,"title":"Invoice"}});
// resolves {"ok":true}
```

### query

`dsx.module.base.query`

Finds documents in a store that match conditions, sorted and limited as you ask.

**When not to.** For a list that should update itself when data changes, use live.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `include` | object | no | Related rows from other stores to attach, named by field, store and parent key field. |
| `limit` | number | no | The most rows to return. |
| `order` | array of object | no | How to sort the rows, a list of fields with a direction of asc or desc. |
| `store` | string | yes | The name of the store to read, declared earlier with declare. |
| `where` | object | no | Conditions the rows must match, such as { amount: { gte: 20 } }. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `rows` | array of object | yes | The documents that matched, in the order you asked for. |

**Example: filters and orders deterministically**

```js
const result = await dsx.module.base.query({"order":[{"dir":"desc","field":"amount"}],"store":"notes","where":{"amount":{"gte":20}}});
// resolves {"rows":[]}
```

**Example: treats a value as a parameter, never as SQL**

```js
const result = await dsx.module.base.query({"store":"notes","where":{"title":{"eq":"x'; DROP TABLE notes; --"}}});
// resolves {"rows":[]}
```

### release

`dsx.module.base.release`

Keeps the changes made since a savepoint and discards the marker.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | yes | The name of the savepoint to release. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the savepoint was released. |

**Example: keeps the writes made inside the scope**

```js
const result = await dsx.module.base.release({"name":"tool"});
// resolves {"ok":true}
```

### restore

`dsx.module.base.restore`

Replaces the database with a snapshot taken earlier.

**When not to.** It overwrites the current data, so take a new snapshot first if you may want to return to it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `label` | string | yes | The label of the snapshot to restore. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the snapshot was restored. |

**Example: returns the store to the snapshotted state**

```js
const result = await dsx.module.base.restore({"label":"pre-agent"});
// resolves {"ok":true}
```

### rollback

`dsx.module.base.rollback`

Undoes every change made since a savepoint, in one step.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | yes | The name of the savepoint to return to. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the changes were undone. |

**Example: unwinds the scope atomically**

```js
const result = await dsx.module.base.rollback({"name":"tool"});
// resolves {"ok":true}
```

### savepoint

`dsx.module.base.savepoint`

Marks a point you can return to if a group of changes goes wrong. It does not survive an app crash.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | yes | A name for the savepoint, using letters, digits and underscore. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True when the savepoint was created. |

**Example: opens a transactional scope**

```js
const result = await dsx.module.base.savepoint({"name":"tool"});
// resolves {"ok":true}
```

### snapshot

`dsx.module.base.snapshot`

Saves a durable copy of the whole database under a label, which survives crashes and restarts.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `label` | string | yes | A name for the snapshot, using letters, digits, dot, dash or underscore. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `label` | string | yes | The label the snapshot was saved under. |
| `ok` | boolean | yes | True when the snapshot was saved. |
| `url` | string | yes | Where the snapshot file is, relative to the app container. |

**Example: takes a durable point-in-time copy**

```js
const result = await dsx.module.base.snapshot({"label":"pre-agent"});
// resolves {"label":"pre-agent","ok":true,"url":"file:///snapshots/pre-agent.db"}
```

### snapshots

`dsx.module.base.snapshots`

Lists the snapshots that have been saved, with their sizes.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `snapshots` | array of object | yes | The saved snapshots, each with its label and size. |

**Example: lists snapshots with their size**

```js
const result = await dsx.module.base.snapshots({});
// resolves {"snapshots":[]}
```

### stats

`dsx.module.base.stats`

Reports the stores that exist and how much space the database uses.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | number | yes | The total size of the database in bytes. |
| `stores` | array of object | yes | The stores that have been declared. |

**Example: reports size so a UI can account for it**

```js
const result = await dsx.module.base.stats({});
// resolves {"bytes":0,"stores":[]}
```

### unlive

`dsx.module.base.unlive`

Stops a live query and removes its rows from the package data. A name that was never registered is not an error.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `as` | string | yes | The name the live query was registered under. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `removed` | number | yes | How many live queries were removed, one or zero. |

**Example: answers zero for a name nobody registered**

```js
const result = await dsx.module.base.unlive({"as":"ghost"});
// resolves {"removed":0}
```

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `call_failed` | The binding raised an error this package does not name itself; the underlying message is carried through unchanged. |  |
| `closed` | This store has been closed. |  |
| `embedding_mismatch` | This vector was produced by a different embedding than the index holds. Reindex to adopt the new one. |  |
| `invalid_config` | The store could not be opened with that configuration. |  |
| `invalid_embedding` | An embedding carries a model, a dimension and an optional revision. |  |
| `invalid_include` | An include names a field, a store and the field holding the parent's key, at most four levels deep. |  |
| `invalid_index` | An index name is letters, digits, dot, dash or underscore. |  |
| `invalid_label` | A snapshot label is letters, digits, dot, dash or underscore. |  |
| `invalid_live` | A live query name is a letter followed by letters, digits or underscore. |  |
| `invalid_savepoint` | A savepoint name is letters, digits and underscore. |  |
| `invalid_store` | A store name is letters, digits, dot, dash or underscore. |  |
| `invalid_vector` | The vector was not a plain list of numbers. | Pass the vector as an array of numbers. |
| `missing_param` | A required argument was not supplied. |  |
| `not_available` | This build's binding does not carry that action yet. Ask base.capabilities which actions it does. |  |
| `open_failed` | The store could not be opened. |  |
| `readonly` | This store was opened read-only. |  |
| `restore_failed` | The snapshot could not be restored. |  |
| `sql_failed` | The store could not complete that operation. |  |
| `unavailable` | The snapshot store is not available in this context. |  |
| `unknown_operator` | That query operator is not one this store understands. |  |
| `unknown_snapshot` | No snapshot was taken under that label. |  |
| `unknown_store` | No store by that name has been declared. |  |
| `vectors_unavailable` | This build carries no vector backend. |  |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
