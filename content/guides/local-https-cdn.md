---
title: Local CDN over HTTPS on iOS
description: Cached files from the local CDN now load inside an HTTPS website on iOS, with no Cloudflare Worker, no DNS change and no certificate to install. Your existing localcdn:// calls keep working.
section: guides
order: 20
---

# Local CDN over HTTPS on iOS

If your app shows your website over HTTPS, the files you cache with the local CDN can now be loaded by that website on iOS. Your page reads them with `fetch`, `XMLHttpRequest`, an `<img>` or a `<video>`, and the bytes come from the phone, not from the network.

You change nothing in your hosting. You do not need a Cloudflare Worker, a DNS record, a certificate or a new SDK version.

<Info title="Availability">
This ships with the V4 pre-release. It is not published yet, and this guide describes how it behaves in that release.
</Info>

## What changed and why

The local CDN has always served cached files from a small server that runs inside your app, on the phone's own loopback address. When your website was loaded over plain HTTP that was fine. An HTTPS page, however, is not allowed to load plain HTTP resources: browsers call this mixed content and block it. So a cached video or image that the app could play natively could not be loaded by your HTTPS website.

On iOS, for an app that shows its configured HTTPS website, the cached item's `local_cdn` URL is now an `https://127.0.0.1:<port>/...` address served by the app itself. The page can load it like any other HTTPS resource.

## What you need

Nothing new.

- No Cloudflare Worker and no Cloudflare account.
- No DNS or hosting change.
- No certificate to install, on the phone or anywhere else.
- No new SDK. The published `despia-native` SDK stays at **1.0.28**, and your existing `localcdn://write`, `read`, `query` and `delete` calls keep their variables and callbacks (`cdnItems`, `deletedCdnItems`, `contentServerChange`).

Your app needs the optional Legacy local CDN package, which a V3 import adds when the app used the local CDN. Modern templates do not include it automatically.

## When it applies

This applies only when all of these are true:

- The app runs on **iOS**.
- It shows your configured website, and that address is **HTTPS**.
- Both local-page settings (`onlyUseLocalServer` and `uselocalhtmlfolder`) are off.

<Warning title="Other setups are unchanged">
Android keeps its existing authenticated HTTP transport. iOS apps that serve a bundled or local page keep their existing HTTP flow. The HTTP bootstrap and upload paths remain in place everywhere.
</Warning>

If your website is HTTPS and you display cached media on **Android**, use the `cdn:` display URL (the `scheme` value of the module's `url` action). An HTTP loopback image or video URL can be blocked there as mixed content. On iOS remote-HTTPS pages you can use the HTTPS `local_cdn` URL instead.

## How it works

When the app first needs to serve a cached file to your page, it starts a small read-only server inside the app and creates a short-lived certificate for it, in memory.

- The certificate exists only in memory. Its private key is never written to disk, never exported and never stored in the Keychain.
- It lives for at most **24 hours**, and a new one is made when the server restarts.
- The app's own web view trusts it only for that one address: the numeric host, the port, the certificate and the server's current run. Nothing the page sends can change what is trusted.
- Nothing is installed on the phone, and the app does not loosen App Transport Security beyond local networking. Every other HTTPS site keeps normal certificate checks.
- The server is read-only. Each file has its own read capability in the URL, and the app still checks the page's origin, the media referrer and that the file sits inside the CDN folder.

## The URLs

A read URL looks like `https://127.0.0.1:<port>/...` followed by a capability query. Three rules:

1. **Use the URL exactly as returned.** Do not build a loopback URL yourself, do not change its scheme, host or port, and do not strip its query.
2. **URLs are temporary.** The port changes, and a URL stops working after a relaunch, a server restart or certificate expiry. Store the item's `index` (or `bucket/name`), not its URL, and read it again when you need to play it.
3. **There is no silent fallback to HTTP.** If a secure address cannot be prepared, the read fails with a typed error (see Troubleshooting).

## What works

Tested against the unchanged 1.0.28 SDK on an HTTPS page:

- `fetch`, with the exact bytes of the cached file.
- `XMLHttpRequest`.
- `<img>` elements.
- `<video>` elements, with byte-range (`Range`) requests supported.

## Delete

`localcdn://delete` removes the file and the item. Its old read URL stops working at once, and the deleted item's `local_cdn` is empty. Deleting works whether or not the secure server is running, because it only removes local data. After a delete you can write the same file again and read a fresh URL.

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

// 2. Read it again whenever you need a URL. Never store the URL itself.
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
<Accordion title="A read is refused because the secure address is not ready">
The error `secure_read_unavailable` means the app could not prepare the secure address for this read, so it refused to hand you a URL. It never falls back to plain HTTP. Read the item again with `localcdn://read` (or the module's `url` action). If it keeps failing, check that the app is in the mode described under "When it applies".
</Accordion>
<Accordion title="The video or image stops loading after a relaunch">
The URL expired. Read URLs are temporary. Run `localcdn://read` again and use the new `local_cdn`.
</Accordion>
<Accordion title="Blocked as mixed content">
The URL is plain HTTP on an HTTPS page. On Android, use the `cdn:` display URL (the `scheme` value). On iOS, make sure the app is showing your HTTPS website and read the item again; use the URL exactly as returned.
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
- This guide is verified against a simulator build and physical iPhones running a test build. On a physical phone, video was verified up to loading its metadata. Full playback was verified in the simulator.
- Deleting while the secure server is down or its certificate has expired is covered by simulator and unit tests. It was not reproduced on a physical phone.
- After a delete, the old URL is refused. A phone's web view reports this only as a failed load, so the exact HTTP status is not shown on device.
- Deleting and re-writing the same file at the very same moment is not covered. Do those in sequence: delete, wait for the result, then write.
- The URL is a temporary local address. Treat it as a short-lived handle and do not share it.
</Note>
