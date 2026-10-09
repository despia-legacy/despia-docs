---
title: Chat
description: Add messaging to your app with conversations, replies, attachments and typing.
package: chat
---

Add messaging to your app with conversations, replies, attachments and typing.

Gives your app conversation lists, message sending that shows at once and delivers when online, read receipts, typing indicators and attachments. It needs a chat provider package (Despia, Stream or Sendbird) to carry the messages.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it to add conversations, direct messages or an assistant chat to your app, with messages that show at once and send when the device is online. It needs a chat provider package to carry the messages, and it does not draw the screens by itself.

## What native adds

Messages are stored on the device and sent from an outbox, so the chat keeps working offline and survives the app being closed.

## Install

```sh
despia add Core/Chat
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

### close

`dsx.module.chat.close`

Stops syncing the open conversation; nothing is deleted.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `conversationId` | string | yes | The id of the conversation that was closed. |

**Example: closes**

```js
const result = await dsx.module.chat.close({});
// resolves {"conversationId":""}
```

### compose

`dsx.module.chat.compose`

Sets what the composer is doing: answering a message, rewriting one of yours, or neither to cancel.

**When to use it.** Call it from a context menu or a swipe on a message.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `conversationId` | string | no | The id of the conversation; if left out, the conversation that is currently open is used. |
| `editing` | string | no | The id of one of your messages to rewrite; it wins over replyTo. |
| `replyTo` | string | no | The id of the message to answer; the next send carries it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `conversationId` | string | yes | The id of the conversation being composed in. |
| `editing` | string | yes | The id of the message being rewritten, or empty. |
| `replyTo` | string | yes | The id of the message being answered, or empty. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_conversation` | No conversation is open. Call open({ conversationId }) first. | Not recoverable by retrying. |
| `not_found` | No message with that id is in this conversation. | Not recoverable by retrying. |
| `not_yours` | Only the sender can edit a message. | Not recoverable by retrying. |

**Example: Answer a message**

```js
const result = await dsx.module.chat.compose({"conversationId":"k1","replyTo":"m42"});
// resolves {"conversationId":"k1","editing":"","replyTo":"m42"}
```

### conversations

`dsx.module.chat.conversations`

Refreshes the list of conversations from the provider and returns it.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `conversations` | array of object | yes | The conversations, each with its title, last message, unread count and pinned or muted flags. |

**Example: lists conversations**

```js
const result = await dsx.module.chat.conversations({});
// resolves {"conversations":[{"avatar":"","id":"k1","muted":false,"pinned":false,"security":"server-readable","title":""}]}
```

### decide

`dsx.module.chat.decide`

Records a reviewer's decision on a report: dismiss, warn, remove or restrict.

**When to use it.** Use it in your review screen; what each decision does is for your app to implement.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `decision` | string | yes | The decision: dismiss, warn, remove or restrict. |
| `note` | string | no | Optional note kept with the decision. |
| `reportId` | string | yes | Which filed report this decision applies to, taken from the reviews list. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `decision` | string | yes | The decision that was recorded. |
| `reportId` | string | yes | The id of the report that was decided. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported` | The chat provider has no review flow. | Not recoverable by retrying. |

**Example: Record a reviewer decision on a report**

```js
const result = await dsx.module.chat.decide({"decision":"warn","note":"First offence","reportId":"r7"});
// resolves {"decision":"warn","reportId":"r7"}
```

### delete

`dsx.module.chat.delete`

Deletes one of your own messages and leaves a marker that later edits cannot bring back.

**When to use it.** Call it after the user confirms.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `messageId` | string | yes | The id of your message to delete, as the server knows it. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `messageId` | string | yes | The id of the message that was deleted. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_conversation` | No conversation is open. Call open({ conversationId }) first. | Not recoverable by retrying. |
| `not_found` | No message with that id is in this conversation. | Not recoverable by retrying. |
| `not_yours` | Only the member who sent a message may edit or delete it. | Not recoverable by retrying. |

**Example: Delete one of your messages**

```js
const result = await dsx.module.chat.delete({"messageId":"m42"});
// resolves {"messageId":"m42"}
```

### draft

`dsx.module.chat.draft`

Saves what the user has typed in a conversation, on this device only, until they send it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `conversationId` | string | no | The id of the conversation; if left out, the conversation that is currently open is used. |
| `text` | string | yes | The draft text; an empty text removes the draft. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `conversationId` | string | yes | The id of the conversation the draft belongs to. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_conversation` | No conversation is open. Call open({ conversationId }) first. | Not recoverable by retrying. |

**Example: Save what the user has typed so far**

```js
const result = await dsx.module.chat.draft({"conversationId":"k1","text":"See you at"});
// resolves {"conversationId":"k1"}
```

### edit

`dsx.module.chat.edit`

Replaces the text of one of your own messages, and the change shows on every member's device.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ask` | boolean | no | Pass true to also have the assistant answer the edited question again and replace its earlier answer. |
| `messageId` | string | yes | The id of your message to change, as the server knows it. |
| `text` | string | yes | The new text of the message. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `messageId` | string | yes | The id of the message that was edited. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `agent_refused` | This conversation's security mode does not let the agent read it (an end-to-end conversation reaches only an on-device model). | Not recoverable by retrying. |
| `no_agent` | No agent is installed: answer chat.agent from a package, or set config agentServer and agentId. | Not recoverable by retrying. |
| `no_conversation` | No conversation is open. Call open({ conversationId }) first. | Not recoverable by retrying. |
| `not_agent_turn` | That message is not one the agent answers (a person's text message, or the agent's answer to one). | Not recoverable by retrying. |
| `not_found` | No message with that id is in this conversation. | Not recoverable by retrying. |
| `not_yours` | Only the member who sent a message may edit or delete it. | Not recoverable by retrying. |

**Example: Change the text of one of your messages**

```js
const result = await dsx.module.chat.edit({"messageId":"m42","text":"See you at 8"});
// resolves {"messageId":"m42"}
```

### mark

`dsx.module.chat.mark`

Pins or mutes a conversation on this device; a flag you leave out keeps its current value.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `conversationId` | string | no | The id of the conversation; if left out, the conversation that is currently open is used. |
| `muted` | boolean | no | True to silence notifications for the conversation. |
| `pinned` | boolean | no | True to pin the conversation to the top of the list. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `conversationId` | string | yes | The id of the conversation that was changed. |
| `muted` | boolean | yes | Whether the conversation is now muted. |
| `pinned` | boolean | yes | Whether the conversation is now pinned. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_conversation` | No conversation is open. Call open({ conversationId }) first. | Not recoverable by retrying. |

**Example: Pin a conversation**

```js
const result = await dsx.module.chat.mark({"conversationId":"k1","pinned":true});
// resolves {"conversationId":"k1","muted":false,"pinned":true}
```

### markRead

`dsx.module.chat.markRead`

Marks messages as read up to a point and tells the other members.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `conversationId` | string | no | The id of the conversation; if left out, the conversation that is currently open is used. |
| `upTo` | number | no | The position of the newest message to mark as read; if left out, the newest message is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `upTo` | number | yes | The position that was marked as read. |

**Example: marks read**

```js
const result = await dsx.module.chat.markRead({"conversationId":"k1","upTo":5});
// resolves {"upTo":5}
```

### open

`dsx.module.chat.open`

Opens a conversation: the saved messages show at once, then it syncs and keeps the conversation up to date.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `conversationId` | string | yes | Which conversation to open, taken from the conversations list. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `conversationId` | string | yes | The id of the conversation that is now open. |
| `messages` | array of object | yes | The messages in the conversation, in display order. |

**Example: opens a conversation**

```js
const result = await dsx.module.chat.open({"conversationId":"k1"});
// resolves {"conversationId":"k1","messages":[]}
```

### react

`dsx.module.chat.react`

Adds your emoji reaction to a message, or takes it back.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `emoji` | string | yes | The single emoji character to add or take back, such as a thumbs up. |
| `messageId` | string | yes | The id of the message, as the server knows it. |
| `on` | boolean | no | True to add the reaction and false to remove it; true if left out. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `emoji` | string | yes | The emoji that was added or removed. |
| `messageId` | string | yes | The id of the message that was reacted to. |
| `on` | boolean | yes | Whether the reaction is now on. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_conversation` | No conversation is open. Call open({ conversationId }) first. | Not recoverable by retrying. |
| `not_found` | No message with that id is in this conversation. | Not recoverable by retrying. |

**Example: Add a thumbs up to a message**

```js
const result = await dsx.module.chat.react({"emoji":"👍","messageId":"m42"});
// resolves {"emoji":"👍","messageId":"m42","on":true}
```

### regenerate

`dsx.module.chat.regenerate`

Asks the assistant to answer again, either from its own answer or from the question that led to it, and replaces the old answer.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `messageId` | string | yes | The id of the assistant answer or of the question, which can be a clientId while it is not yet synced. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `messageId` | string | yes | The id of the question being answered again. |
| `replaces` | string | yes | The id of the answer that will be replaced. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `agent_refused` | This conversation's security mode does not let the agent read it (an end-to-end conversation reaches only an on-device model). | Not recoverable by retrying. |
| `no_agent` | No agent is installed: answer chat.agent from a package, or set config agentServer and agentId. | Not recoverable by retrying. |
| `no_conversation` | No conversation is open. Call open({ conversationId }) first. | Not recoverable by retrying. |
| `not_agent_turn` | That message is not one the agent answers (a person's text message, or the agent's answer to one). | Not recoverable by retrying. |
| `not_found` | No message with that id is in this conversation. | Not recoverable by retrying. |

**Example: Ask the assistant to answer again**

```js
const result = await dsx.module.chat.regenerate({"messageId":"m43"});
// resolves {"messageId":"m42","replaces":"m43"}
```

### report

`dsx.module.chat.report`

Reports a message in the open conversation to the app's reviewers.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `messageId` | string | yes | The id of the message, as the server knows it. |
| `note` | string | no | Optional extra detail for the reviewer. |
| `reason` | string | yes | A short reason of your choosing, up to 64 characters. |
| `share` | boolean | no | In an end-to-end conversation, pass true to send the message text with the report. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `reportId` | string | yes | The id of the report that was filed. |
| `status` | string | yes | The state of the report, such as open. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_found` | No message with that id is in this conversation. | Not recoverable by retrying. |
| `unsupported` | The chat provider has no review flow. | Not recoverable by retrying. |

**Example: Report a message to the reviewers**

```js
const result = await dsx.module.chat.report({"messageId":"m42","reason":"spam"});
// resolves {"reportId":"r7","status":"open"}
```

### reviews

`dsx.module.chat.reviews`

Lists the reports waiting for a reviewer, oldest first; only people the service lists as reviewers can use it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `status` | string | no | Which reports to list: open (the default) or resolved. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `reports` | array of object | yes | The reports, each with what was preserved about the message. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported` | The chat provider has no review flow. | Not recoverable by retrying. |

**Example: List the open reports**

```js
const result = await dsx.module.chat.reviews({"status":"open"});
// resolves {"reports":[{"conversationId":"k1","excerpt":"Buy now","id":"r7","messageId":"m42","note":"","reason":"spam","reporter":"u2","status":"open"}]}
```

### search

`dsx.module.chat.search`

Searches the conversations saved on this device for messages containing every word you give, ignoring case and accents.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `query` | string | yes | The words to look for. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `results` | array of object | yes | The matching messages, with the conversation each belongs to. |

**Example: Find messages that contain a word**

```js
const result = await dsx.module.chat.search({"query":"invoice"});
// resolves {"results":[{"clientId":"c42","conversationId":"k1","id":"m42","sender":"u2","text":"The invoice is attached"}]}
```

### send

`dsx.module.chat.send`

Sends a message, which appears on screen as pending straight away and is delivered when the device is online.

**When to use it.** Use it from your send button; sending the same clientId twice never creates a duplicate.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `attachment` | object | no | A file to attach, as returned by the media, recording or files packages. |
| `attachment.bytes` | number | no | The size of the file in bytes. |
| `attachment.durationMs` | number | no | The length of audio or video in milliseconds. |
| `attachment.mime` | string | no | The type of the file, such as image/jpeg. |
| `attachment.name` | string | no | The file name to show to the other person. |
| `attachment.path` | string | no | The path of the file on the device. |
| `attachment.uri` | string | no | The address of the file on the device. |
| `attachment.url` | string | no | The https address of the file, if it is already online. |
| `clientId` | string | no | Your own unique id for this message so a retry is safe; one is created if you leave it out. |
| `conversationId` | string | no | The id of the conversation; if left out, the conversation that is currently open is used. |
| `replyTo` | string | no | The id of the message this one answers; if left out, the message the composer is answering is used. |
| `text` | string | yes | What the message says; it can be left empty only if an attachment is given. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `clientId` | string | yes | The id that identifies this message while it is pending. |
| `status` | string | yes | Where the message is now, such as pending or sent. |

**Example: sends text**

```js
const result = await dsx.module.chat.send({"clientId":"c1","conversationId":"k1","text":"hello"});
// resolves {"clientId":"c1","status":"sent"}
```

### stop

`dsx.module.chat.stop`

Stops the assistant's answer while it is still being written and keeps the text that already arrived.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `conversationId` | string | yes | The id of the conversation whose answer was stopped. |
| `posted` | boolean | yes | True when the partial answer was kept as a message. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_answering` | The agent is not answering in this conversation, so there is nothing to stop. | Not recoverable by retrying. |

**Example: Stop the assistant while it is still writing**

```js
const result = await dsx.module.chat.stop({});
// resolves {"conversationId":"k1","posted":true}
```

### sync

`dsx.module.chat.sync`

Sends any waiting messages from the outbox, then fetches new messages from the provider.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `conversationId` | string | no | The id of the conversation; if left out, the conversation that is currently open is used. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `received` | number | yes | How many new messages were fetched. |
| `sent` | number | yes | How many waiting messages were sent. |

**Example: syncs**

```js
const result = await dsx.module.chat.sync({});
// resolves {"received":0,"sent":0}
```

### thread

`dsx.module.chat.thread`

Opens the thread of a message in the open conversation, with its replies, or closes it when given an empty id.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `messageId` | string | yes | The id of the message that starts the thread; an empty id closes the thread. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `messageId` | string | yes | The id of the message whose thread is open. |
| `messages` | array of object | yes | The first message and the replies to it. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `not_found` | No message with that id is in this conversation. | Not recoverable by retrying. |

**Example: Open the thread of a message**

```js
const result = await dsx.module.chat.thread({"messageId":"m42"});
// resolves {"messageId":"m42","messages":[{"id":"m42","sender":"u2","text":"Who is coming?"},{"id":"m44","sender":"u3","text":"I am"}]}
```

### typing

`dsx.module.chat.typing`

Tells the other members that you are typing, or that you stopped, in the open conversation.

**When to use it.** Call it on every keystroke; it only sends a change and one renewal per half lifetime.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | no | True while typing and false when done; true if left out. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `on` | boolean | yes | Whether the typing signal is now on. |

**Example: signals typing**

```js
const result = await dsx.module.chat.typing({"on":true});
// resolves {"on":true}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `agent` | string | `` | The AI participant this device speaks for, by name: a package answering chat.agent (an on-device model), or server for the agent this app declares on its own server; empty means the first one. |
| `agentId` | string | `` | The participant id (kind ai) the server agent posts as. Needed with agentServer. |
| `agentName` | string | `` | The server agent's display name; empty is its id. |
| `agentServer` | string | `` | A route on this app's OWN server that answers { conversationId, agent, context } with { text } (owner decision 6). The server holds the model provider's key and calls the model; the key never ships in the app, and despia lint refuses a provider key or a provider's API host here. Absolute https for native apps. |
| `agentWindow` | number | `20` | How many of the newest live text messages the agent's model may read (0 or less is 20). |
| `maxAttachmentBytes` | number | `8388608` | Bytes; a larger photo, file or voice note is refused too_large before it reaches the outbox. 0 is no ceiling. The open chat service keeps at most 8 MiB per attachment. |
| `pollMs` | number | `1500` | Milliseconds between syncs while a conversation is open (floor 500). Only the fallback: a provider with an open realtime feed runs no timer. |
| `provider` | string | `` | The chat provider package; empty means the first installed one. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `agent_failed` | The agent's model did not answer. |  |
| `agent_refused` | This conversation's security mode does not let the agent read it (an end-to-end conversation reaches only an on-device model). |  |
| `blocked` | This app's content policy does not allow that message. |  |
| `e2ee_unavailable` | This conversation is end to end, and no encryption package is installed (or it cannot encrypt this yet); nothing was sent in the clear. |  |
| `invalid_message` | A message needs text or an attachment with a path. |  |
| `no_agent` | No agent is installed: answer chat.agent from a package, or set config agentServer and agentId. |  |
| `no_conversation` | No conversation is open. Call open({ conversationId }) first. |  |
| `not_agent_turn` | That message is not one the agent answers (a person's text message, or the agent's answer to one). |  |
| `not_answering` | The agent is not answering in this conversation, so there is nothing to stop. |  |
| `not_configured` | No chat provider is installed. Add Core/ChatDespia or another chat provider package. |  |
| `not_found` | No message with that id is in this conversation. |  |
| `not_yours` | Only the member who sent a message may edit or delete it. |  |
| `offline` | The chat service did not answer; the outbox keeps the message and the next sync sends it. |  |
| `provider_unavailable` | The chat provider is installed but cannot serve right now. |  |
| `refused` | The chat service refused the request. |  |
| `too_large` | That attachment is larger than this app allows (config maxAttachmentBytes). |  |
| `unsupported` | The chat provider has no review flow. |  |
| `unsupported_provider` | The configured chat provider is not installed. |  |

## Related packages

- Needs: audio.record, [Media](/packages/media)
- Used by: [ChatDespia](/packages/chatdespia), [ChatMLS](/packages/chatmls), [ChatSendbird](/packages/chatsendbird), [ChatStream](/packages/chatstream)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
