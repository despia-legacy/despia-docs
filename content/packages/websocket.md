---
title: WebSocket
description: Keep a WebSocket connection open that reconnects by itself and never loses a message.
package: Mandatory/WebSocket
section: packages
group: Connectivity
icon: network
order: 141
---

# WebSocket

Opens named WebSocket connections, reconnects with a growing delay, and keeps outgoing and incoming messages in a durable queue so nothing is lost across a drop or a relaunch. You get connection state to show in your screens and an acknowledgement call to confirm each message. You write the messages your server expects.

**When to use it.** Reach for it when your app needs a live connection to your own server, such as chat, live feeds or presence, and messages must survive a dropped connection or a relaunch. For one-off requests use a normal API call instead.

<PackageSample/>

<PackageReference/>
