---
title: Block editor
description: Add a Notion-style editor where people write notes and documents in blocks.
package: blocks
---

Add a Notion-style editor where people write notes and documents in blocks.

Type, use a slash menu for headings and lists, drag blocks around, format text and undo changes. The document is saved as markdown, so you can show it anywhere markdown is shown. Use it for notes, journals or any writing screen. No account or keys needed.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Reach for it when you want a Notion-style writing screen for notes, journals or documents, stored as markdown. If you only need to display markdown, use the markdown element instead; if you need one plain text field, use an input.

## What native adds

Each block is editable text with a native text view on iOS and Android, so selection, the keyboard and the format bar behave like the platform's own.

## Install

```sh
despia add Core/Blocks
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone, desktop.

## Actions

### close

`dsx.module.blocks.close`

Closes a document and forgets its content and undo history.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |

**Resolves with**

_None._

**Example: closes**

```js
const result = await dsx.module.blocks.close({});
// resolves {}
```

### dismiss

`dsx.module.blocks.dismiss`

Closes the link prompt without applying a link.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Close the link prompt**

```js
const result = await dsx.module.blocks.dismiss({});
// resolves {"version":11}
```

### drag

`dsx.module.blocks.drag`

Reports a drag of a block by its handle, in phases, and moves the block to the drop spot when the drag ends as one undo step.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `block` | string | yes | The id of the block to act on. |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |
| `dy` | number | no | How far the pointer has moved vertically since the drag began. |
| `phase` | string | yes | The stage of the drag: began, changed, ended or cancelled. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `moved` | boolean | yes | True when blocks actually moved. |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_move` | The blocks cannot be moved to that spot, for example into themselves. | Choose a different target or position. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Finish dragging a block by its handle**

```js
const result = await dsx.module.blocks.drag({"block":"b2","dy":-48,"phase":"ended"});
// resolves {"moved":true,"version":12}
```

### duplicate

`dsx.module.blocks.duplicate`

Copies blocks with new ids and places the copies right after the originals.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `blocks` | array of string | no | The ids of the blocks to act on; when left out, the currently selected blocks are used. |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `blocks` | array of string | yes | The ids of the new copies. |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Copy a block**

```js
const result = await dsx.module.blocks.duplicate({"blocks":["b2"]});
// resolves {"blocks":["b8"],"version":13}
```

### edit

`dsx.module.blocks.edit`

Replaces a stretch of one block's text, as when the user types, and applies typing shortcuts and the slash menu. It reports the shortcut that fired, if any.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `block` | string | yes | The id of the block to act on. |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |
| `from` | number | yes | The start position inside the block's text, counted in characters. |
| `text` | string | yes | The text to put in place of the range, as typed by the user. |
| `to` | number | no | The end position inside the block's text, counted in characters. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `rule` | string | yes | The name of the typing shortcut that fired, such as a list or heading shortcut. |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Type a list shortcut at the start of a paragraph**

```js
const result = await dsx.module.blocks.edit({"block":"b1","from":0,"text":"- "});
// resolves {"rule":"bullet","version":1}
```

### fold

`dsx.module.blocks.fold`

Folds or unfolds a toggle block. It changes only the view, so it is not an undo step.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `block` | string | yes | The id of the block to act on. |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |
| `folded` | boolean | no | True to fold the toggle, false to unfold it; when left out, the current state is flipped. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Fold a toggle block**

```js
const result = await dsx.module.blocks.fold({"block":"b3","folded":true});
// resolves {"version":2}
```

### indent

`dsx.module.blocks.indent`

Nests blocks under the block before them, where markdown can express it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `blocks` | array of string | no | The ids of the blocks to act on; when left out, the currently selected blocks are used. |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `moved` | boolean | yes | True when blocks actually moved. |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Nest a block under the one before it**

```js
const result = await dsx.module.blocks.indent({"blocks":["b2"]});
// resolves {"moved":true,"version":14}
```

### insert

`dsx.module.blocks.insert`

Adds a new block after a chosen block, after the caret block, or at the end, and returns its id.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `after` | string | no | The id of the block to insert after. |
| `attrs` | object | no | Attributes for the block, such as level for headings or checked for to-do items. |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |
| `text` | string | no | The text of the new block. |
| `type` | string | yes | The block type, such as paragraph, heading, list or quote. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `block` | string | yes | The id of the block that was created or chosen. |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Add a heading after the first block**

```js
const result = await dsx.module.blocks.insert({"after":"b1","attrs":{"level":2},"text":"Next steps","type":"heading"});
// resolves {"block":"b4","version":3}
```

### key

`dsx.module.blocks.key`

Handles a key press at the caret, such as Enter, Backspace, Tab or an arrow at a block edge, and reports whether the editor handled it.

**When to use it.** Forward key presses from your own text input; when handled is false, let the platform deal with the key.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `alt` | boolean | no | True when the alt or option key is held. |
| `block` | string | no | The id of the block to act on. |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |
| `firstLine` | boolean | no | True when the caret is on the first line of the block, so an up arrow should leave the block. |
| `from` | number | no | The start position inside the block's text, counted in characters. |
| `goalX` | number | no | The horizontal caret position to keep when moving between lines or blocks. |
| `key` | string | yes | The key pressed, such as Enter, Backspace, Delete, Tab, Escape or an arrow key. |
| `lastLine` | boolean | no | True when the caret is on the last line of the block, so a down arrow should leave the block. |
| `mod` | boolean | no | True when the command or control key is held. |
| `shift` | boolean | no | True when the shift key is held. |
| `to` | number | no | The end position inside the block's text, counted in characters. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `handled` | boolean | yes | True when the editor used the key; false means the platform should handle it. |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Press Enter inside a block**

```js
const result = await dsx.module.blocks.key({"block":"b1","from":5,"key":"Enter"});
// resolves {"handled":true,"version":4}
```

### mark

`dsx.module.blocks.mark`

Turns bold, italic, strikethrough, code or a link on or off over the selection or a given range.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `block` | string | no | The block holding the range; when left out, the selection is used. |
| `clear` | boolean | no | Set to true to remove the link instead of adding one. |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |
| `from` | number | no | The start position of the range to mark; when left out, the selection is used. |
| `href` | string | no | The link address when adding a link: http, https, mailto, tel or a relative path. |
| `mark` | string | yes | Which mark to toggle: strong, em, del, code or a for a link. |
| `to` | number | no | The end position of the range to mark; when left out, the selection is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |
| `refused_href` | That link address is not allowed. | Use an http, https, mailto or tel address, or a relative path. |
| `unrepresentable` | Markdown cannot carry that mark over this text. | Apply the mark to different text, or skip it. |

**Example: Make a range bold**

```js
const result = await dsx.module.blocks.mark({"block":"b1","from":0,"mark":"strong","to":5});
// resolves {"version":5}
```

### markdown

`dsx.module.blocks.markdown`

Returns the document as markdown, ready to save or show anywhere markdown is shown.

**When to use it.** Use it whenever you want to store the document.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `markdown` | string | yes | The document written as markdown. |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: writes markdown**

```js
const result = await dsx.module.blocks.markdown({});
// resolves {"markdown":"","version":0}
```

### move

`dsx.module.blocks.move`

Moves blocks before, after or inside another block.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `blocks` | array of string | no | The ids of the blocks to act on; when left out, the currently selected blocks are used. |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |
| `position` | string | no | Where to place the blocks relative to the target: before, after or inside. The default is after. |
| `target` | string | yes | The id of the block to move relative to. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_move` | The blocks cannot be moved to that spot, for example into themselves. | Choose a different target or position. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Move a block after another one**

```js
const result = await dsx.module.blocks.move({"blocks":["b4"],"position":"after","target":"b1"});
// resolves {"version":6}
```

### open

`dsx.module.blocks.open`

Opens a document from markdown under a name, replacing any open document with that name, and returns its version and block count.

**When to use it.** Call it first, before any other action on a document.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |
| `markdown` | string | no | The markdown source text. For open, leaving it out or empty starts one empty paragraph. |
| `placeholder` | string | no | The hint shown in a focused empty paragraph. The default is Type / for commands. |
| `placeholders` | object | no | Hints shown for empty blocks of specific types, such as heading1, list, todo, quote or code. |
| `placeholders.callout` | string | no | The hint shown in an empty callout. |
| `placeholders.code` | string | no | The hint shown in an empty code block. |
| `placeholders.heading1` | string | no | The hint shown in an empty first-level heading. |
| `placeholders.heading2` | string | no | The hint shown in an empty second-level heading. |
| `placeholders.heading3` | string | no | The hint shown in an empty third-level heading. |
| `placeholders.list` | string | no | The hint shown in an empty list item. |
| `placeholders.quote` | string | no | The hint shown in an empty quote. |
| `placeholders.todo` | string | no | The hint shown in an empty to-do item. |
| `placeholders.toggle` | string | no | The hint shown in an empty toggle block. |
| `slash` | array of object | no | A custom list of slash menu items, each with an id, label and either a block type or markdown. When left out, the default menu is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `blocks` | number | yes | The number of blocks in the opened document. |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Example: opens a document**

```js
const result = await dsx.module.blocks.open({"markdown":"# Hi"});
// resolves {"blocks":1,"version":0}
```

### outdent

`dsx.module.blocks.outdent`

Moves nested blocks out one level, to their parent's level.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `blocks` | array of string | no | The ids of the blocks to act on; when left out, the currently selected blocks are used. |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `moved` | boolean | yes | True when blocks actually moved. |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Move a nested block out one level**

```js
const result = await dsx.module.blocks.outdent({"blocks":["b2"]});
// resolves {"moved":true,"version":15}
```

### paste

`dsx.module.blocks.paste`

Pastes plain text, markdown or HTML at the selection.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |
| `html` | string | no | HTML to paste. Only a fixed set of safe tags is kept. |
| `text` | string | no | Plain text or markdown to paste. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Paste markdown at the selection**

```js
const result = await dsx.module.blocks.paste({"text":"**Hello** world"});
// resolves {"version":16}
```

### redo

`dsx.module.blocks.redo`

Redoes the step that was last undone.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Redo the step that was undone**

```js
const result = await dsx.module.blocks.redo({});
// resolves {"version":17}
```

### remove

`dsx.module.blocks.remove`

Deletes blocks. The document is never left empty.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `blocks` | array of string | no | The ids of the blocks to act on; when left out, the currently selected blocks are used. |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Delete a block**

```js
const result = await dsx.module.blocks.remove({"blocks":["b8"]});
// resolves {"version":19}
```

### replace

`dsx.module.blocks.replace`

Replaces one block with the blocks that a piece of markdown describes, for editing a rich block's source.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `block` | string | yes | The id of the block to act on. |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |
| `markdown` | string | yes | The markdown that replaces the block. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `blocks` | array of string | yes | The ids of the blocks that now stand in place of the old one. |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Replace a block with the blocks its markdown describes**

```js
const result = await dsx.module.blocks.replace({"block":"b2","markdown":"## Goals\n\n- Ship it"});
// resolves {"blocks":["b5","b6"],"version":7}
```

### select

`dsx.module.blocks.select`

Moves the caret, sets a text range, or selects whole blocks.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `block` | string | no | The id of the block to act on. |
| `blocks` | array of string | no | The ids of whole blocks to select. |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |
| `from` | number | no | The start position inside the block's text, counted in characters. |
| `goalX` | number | no | The horizontal caret position to keep when moving between lines or blocks. |
| `to` | number | no | The end position inside the block's text, counted in characters. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Put the caret inside a block**

```js
const result = await dsx.module.blocks.select({"block":"b1","from":3,"to":3});
// resolves {"version":19}
```

### set

`dsx.module.blocks.set`

Changes a block's attributes, such as checked, heading level or code language; a null value removes the attribute.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attrs` | object | yes | Attributes for the block, such as level for headings or checked for to-do items. |
| `block` | string | yes | The id of the block to act on. |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Check a to-do block**

```js
const result = await dsx.module.blocks.set({"attrs":{"checked":true},"block":"b2"});
// resolves {"version":8}
```

### slash

`dsx.module.blocks.slash`

Drives the slash menu: moves the highlight, chooses an item, or closes the menu.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `by` | number | no | How many items to move the highlight, negative to go up. |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |
| `item` | string | no | The id of the slash menu item to choose; when left out, the highlighted item is chosen. |
| `op` | string | yes | What to do in the slash menu: move, choose or close. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `block` | string | yes | The id of the block that was created or chosen. |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Choose the highlighted slash menu item**

```js
const result = await dsx.module.blocks.slash({"op":"choose"});
// resolves {"block":"b7","version":9}
```

### turnInto

`dsx.module.blocks.turnInto`

Changes blocks to another type, such as a heading or a list, while keeping their text.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attrs` | object | no | Attributes for the block, such as level for headings or checked for to-do items. |
| `blocks` | array of string | no | The ids of the blocks to act on; when left out, the currently selected blocks are used. |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |
| `type` | string | yes | The block type, such as paragraph, heading, list or quote. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Turn a block into a quote**

```js
const result = await dsx.module.blocks.turnInto({"blocks":["b2"],"type":"quote"});
// resolves {"version":10}
```

### undo

`dsx.module.blocks.undo`

Undoes the last editing step.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `doc` | string | no | The name of the document to work on; when left out, the document named main is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `version` | number | yes | The document's version number after this call, which goes up with every change. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `bad_range` | The range or value lies outside the block's text. | Keep positions between zero and the block's text length. |
| `no_block` | No block with that id is in the document, or the caret cannot go into it. | Read the document again and use a current block id. |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |

**Example: Undo the last editing step**

```js
const result = await dsx.module.blocks.undo({});
// resolves {"version":18}
```

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_document` | No document with that name is open. | Call open with the document name and its markdown first. |
| `unknown_verb` | The editor has no action with that name. | Check the action name against the list for this package. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
