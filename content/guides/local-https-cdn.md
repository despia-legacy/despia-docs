---
title: Local CDN over HTTPS on iOS
description: Cached files from the local CDN load inside your HTTPS website on iOS from a private HTTPS address served by the app, with no Cloudflare Worker, no DNS change and no certificate to install. Your existing localcdn:// calls keep working.
section: guides
order: 20
---

# Local CDN over HTTPS on iOS

If your app shows your website over HTTPS, the files you cache with the local CDN can be loaded by that website on iOS. Your page reads them with `fetch`, `XMLHttpRequest`, an `<img>` or a `<video>`, and the bytes come from the phone, not from the network.

You change nothing in your hosting. You do not need a Cloudflare Worker, a DNS record, a certificate or a new SDK version.

<Info title="Availability">
This ships with the V4 pre-release. It is not published yet, and this guide describes how it behaves in that release.
</Info>

## What changed and why

The local CDN serves cached files from a small server that runs inside your app, on the phone's own loopback address. An HTTPS page is not allowed to load plain HTTP resources (browsers call this mixed content), and Apple's App Transport Security blocks plain HTTP in store builds. So the server now speaks **only HTTPS**, for every page the app shows: your remote website, a bundled page and a local page. There is no HTTP listener at all, and nothing falls back to HTTP.

## What you need

Nothing new.

- No Cloudflare Worker and no Cloudflare account.
- No DNS or hosting change.
- No certificate to install, on the phone or anywhere else.
- No new SDK. The published `despia-native` SDK stays at **1.0.28**, and your existing `localcdn://write`, `read`, `query` and `delete` calls keep their variables and callbacks (`cdnItems`, `deletedCdnItems`, `contentServerChange`). The SDK never looks inside the URLs, so their new HTTPS form is invisible to it.

Your app needs the optional Legacy local CDN package, which a V3 import adds when the app used the local CDN. Modern templates do not include it automatically.

<Note title="Android">
Android serves the same reads from its own virtual HTTPS address and opens no socket at all. The field names and the behaviour you build against are the same on both platforms.
</Note>

## The two URLs an item has

Every cached item carries two ways to reach it:

| Field | Looks like | Use it for |
|---|---|---|
| `scheme` | `cdn:/f/c.<handle>` | Display: `<img>`, `<video>`, `<audio>`, CSS `url()`. Durable: it does not contain a port or a time-limited token. |
| `local_cdn` / `loopback` | `https://127.0.0.1:<port>/despiabase/<bucket>/<name>?read=read.<token>` on a remote page | `fetch`, `XMLHttpRequest`, anything that needs the bytes or a `Range` request. |

Rules:

1. **Use the URLs exactly as returned.** Do not build one yourself, do not change the scheme, host or port, and do not strip the query.
2. **Store the item's `index` (or `bucket/name`), and read it again when you need to play it.** A `scheme` handle and a read token are valid after the app restarts, but the port is chosen by the phone, and a port that had to change makes an old `loopback` URL stop working. Reading the item again always gives a URL that works.
3. **`fetch` and `XMLHttpRequest` do not work on a `cdn:` URL on iOS.** It is a display URL for elements. Use the HTTPS `loopback` URL to read bytes.
4. **There is no silent fallback to HTTP.** If the private HTTPS address cannot serve, the call fails with a typed error (see Troubleshooting).

### A handle is a link, not a secret you can hide

The `cdn:/f/c.<handle>` form names an object and carries an unguessable signature made with a secret kept in the phone's Keychain for your app. Because WebKit sends no `Origin` or `Referer` for an element that loads a `cdn:` URL, the handle itself is what authorizes the load.

- A frame that was never given the handle cannot name the file, and a request that carries a foreign `Origin` or `Referer` is refused.
- Any script on your page can read the handle. Do not pass it to an embed or an ad frame; treat it like a signed link.
- A handle names a **slot**, not a version. If you delete a file and write another one under the same bucket and name, the old handle shows the new file. To revoke a handle, store the file under a different name.

## When the HTTPS address is used

It applies on iOS whenever the app uses the local CDN: for your configured HTTPS website, and for apps that serve a bundled or local page (`onlyUseLocalServer`, `uselocalhtmlfolder`).

A V3 local page that uploads with `http://${window.location.host}/api/upload` keeps working: the app upgrades a request to its own host from `http://` to `https://` for you, including a `fetch(new Request(...))` call with a form body.

## How it works

When the app first needs to serve a cached file to your page, it starts a small read-only server inside the app and creates a short-lived certificate for it, in memory.

- The certificate's private key exists only in memory. It is never written to disk and never stored in the Keychain. The only thing in the Keychain is a 32-byte secret that signs handles and read tokens.
- A certificate lives for at most **24 hours**. A new one is made before it expires, on the **same port**, and files that are being sent keep sending (a long video does not stop at a renewal).
- The app's own web view trusts the certificate only for that one address: the numeric host, the port, the certificate and the server's current run. Nothing the page sends can change what is trusted.
- Nothing is installed on the phone, and the app declares no App Transport Security exception. Every other HTTPS site keeps normal certificate checks.
- The server is read-only. Each read URL names one file and one page origin, and the app checks the origin, the media referrer and that the file sits inside the CDN folder.
- The port is derived from your app, remembered between launches and reused, so the page's origin (and its cookies and `localStorage`) stays the same across launches. If another app holds the port, yours moves to the next free one. Never store a port.

## What works

Tested against the unchanged 1.0.28 SDK on an HTTPS page:

- `fetch` (with the exact bytes of the cached file) and `XMLHttpRequest` on the `loopback` URL.
- `<img>` and `<video>` elements, with byte-range (`Range`) requests supported.
- `<img>`, `<video>` and `<audio>` elements on the `cdn:` `scheme` URL.
- A 200 MB file read to the end across three certificate renewals.
- Coming back from the background: if the phone took the server away, or the certificate lapsed while the app was suspended, the app restarts the server on the same port when it returns to the foreground.

## Know when it is ready: `originState` and `isDurable`

The module tells you what state the private address is in, so you do not have to poll:

- The `originState` broadcast carries `state`: `ready`, `recovering` (a short, bounded restart is running) or `unavailable` (with `code: secure_origin_unavailable`). The origin does not change across a recovery, so your page only needs to retry its failed requests.
- `isDurable` (module variable `isDurable`, also on `originState`) tells you whether stored `cdn:/f/` and `?read=` URLs will survive a restart. It is `true` normally. It is `false` if the Keychain could not keep the secret: for example the app was launched in the background before the phone was first unlocked (iOS tries again every time the app returns to the foreground), or the app's Keychain was set up so the default group is shared with other apps. When it is `false`, `nonDurableReason` says why (`group_unverified`, `group_not_own` or `keychain_unavailable`); do not store those URLs, store `bucket/name` and ask for the URL again.

The secret is kept on this phone only and is not synced to iCloud. It stays in the Keychain when the app is deleted and reinstalled on the same phone (iOS keeps Keychain items), so a handle that was stored outside the app (for example on your server) keeps working after a reinstall.

## Delete

`localcdn://delete` removes the file and the item. The read URL stops working at once and the deleted item's `local_cdn` is empty; a stored `cdn:/f/` handle answers that the file is gone. Deleting works whether or not the secure server is running, because it only removes local data. After a delete you can write the same file again and read a fresh URL.

## Cache before you need it offline

The first `write` downloads the file from your server, so it needs a connection. A cached read then uses the stored copy on the phone.

**Write caches before going offline.** This feature serves files you have already cached. It does not make a website you never cached available offline, and it does not change how your bundled web content updates.

## Example

Cache a video, wait for it to land, then play it. The same code runs on the unchanged SDK.

```javascript title="cache-and-play.js"
import despia from 'despia-native';

const index = 'trailer';

// 1. Cache the file. Do not await a result: large downloads take a while.
window.contentServerChange = async (item) => {
  if (item.index !== index) return;
  await play();
};
despia(`localcdn://write?url=https://example.com/media/trailer.mp4&filename=videos/trailer.mp4&index=${index}`);

// 2. Read it again whenever you need a URL. Store the index, not the URL.
async function play() {
  const data = await despia(
    `localcdn://read?index=${encodeURIComponent(JSON.stringify([index]))}`,
    ['cdnItems']
  );
  const item = data.cdnItems?.[0];
  if (item?.status !== 'cached') return;

  document.querySelector('video').src = item.local_cdn; // https://127.0.0.1:...
}

// 3. Delete when done.
// despia(`localcdn://delete?index=${encodeURIComponent(JSON.stringify([index]))}`);
```

## Troubleshooting

<AccordionGroup>
<Accordion title="A call fails with secure_origin_unavailable">
The app could not prepare the private HTTPS address for this call, so it refused to hand you a URL. It never falls back to plain HTTP. The app already retried after 250 ms, 1 s and 3 s. Wait for the `originState` broadcast to say `ready`, then read the item again with `localcdn://read` (or the module's `url` action).
</Accordion>
<Accordion title="The video or image stops loading after a relaunch">
A `cdn:/f/` handle survives a relaunch. A `loopback` URL survives it only while the port is unchanged. If it does not load, run `localcdn://read` again and use the new `local_cdn`.
</Accordion>
<Accordion title="fetch of a cdn: URL fails with Load failed">
That is expected on iOS: `cdn:` is a display URL for elements. Use the HTTPS `loopback` URL for `fetch` and `XMLHttpRequest`.
</Accordion>
<Accordion title="Blocked as mixed content, or a page will not open at all">
A plain `http://` start page, `http://localhost`, a LAN address or a `.local` name is blocked by App Transport Security in a store build. The page reports a main-frame failure whose `data.reason` is `insecure_origin_blocked`, with a remedy: serve it over HTTPS. This is reported for the main page only. A secure page that loads an `http://` image, script or video from somewhere else just fails to load that resource, with no typed error: serve every resource over HTTPS. For cached files use the `scheme` or `loopback` URL.
</Accordion>
<Accordion title="An Android HTTPS page cannot upload a file">
The error `upload_unsupported` means an Android HTTPS page cannot stream a file upload into the CDN. Use a native file path, or a small `base64` payload, there.
</Accordion>
<Accordion title="A module action rejects a name, bucket or payload">
The errors `missing_name`, `invalid_name`, `invalid_bucket`, `missing_payload` and `upload_failed` are returned when a name, bucket or payload is empty, malformed or could not be stored. A name is one path component, and a bucket may nest folders. Empty, dot, backslash and reserved `.dsx-` components are rejected.
</Accordion>
<Accordion title="A localcdn:// call is rejected">
The errors `invalid_url`, `invalid_filename`, `invalid_param`, `missing_param`, `unknown_verb` and `download_failed` come from `localcdn://` calls: the URL or filename is not valid, a required parameter is missing, the verb is not one of `write`, `read`, `query` and `delete`, or the download failed.
</Accordion>
<Accordion title="An item is not there on a first read">
That is not an error. A missing item reads as absent, because "is this cached?" is the question. Write it, wait for `contentServerChange`, then read.
</Accordion>
</AccordionGroup>

## Known limits

<Note title="What this guide does not claim">
- Verified on a simulator and on a physical iPhone running a test build, including returning from the background, certificate renewal during a 200 MB read, and a third-party frame refused. Video on a physical phone was verified up to loading its metadata and byte-range reads; full playback was verified in the simulator.
- A `cdn:` handle in a sandboxed `srcdoc` frame was not decided on device, so this guide makes no claim about it.
- After a delete, the old read URL is refused. A phone's web view reports this only as a failed load, so the exact HTTP status is not visible on device.
- Deleting and re-writing the same file at the very same moment is not covered. Do those in sequence: delete, wait for the result, then write.
- Airplane mode, Low Power Mode and a launch before the first unlock after a restart are covered by the `isDurable` rules above; the launch-before-unlock case was reasoned from the code and not reproduced on a physical phone.
</Note>
