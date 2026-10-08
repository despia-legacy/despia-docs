// The Help hub as docs pages (scripts/sync-hub.mjs): published public articles land at the hub's own addresses with the
// site's front matter; hand written pages are never touched; an unpublished article leaves; a hub that does not answer
// changes nothing; a second run writes nothing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readHub, writeTree } from "../scripts/sync-hub.mjs";

const art = (o) => ({ status: "published", audience: "public", platform: "all", codes: [], tags: [], summary: "S.", body: "Body.\n\n## Fix\n1. Do it.", publishedAt: "2026-10-08T10:00:00.000Z", ...o });

test("articles become pages at the hub's addresses; hand written pages stay; unpublished pages leave; idempotent", () => {
  const root = mkdtempSync(join(tmpdir(), "hub-"));
  mkdirSync(join(root, "content", "troubleshooting"), { recursive: true });
  writeFileSync(join(root, "content", "troubleshooting", "white-screen-on-launch.md"), "---\ntitle: Hand written\n---\n");
  const snap = { announcements: [{ id: "n1", title: "Android 16 builds are here", body: "API 36.", kind: "feature", link: "https://docs.despia.com/releases/android-16" }], articles: [
    art({ id: "a1", space: "troubleshooting", slug: "ios-certificate-expired", title: "An iOS distribution certificate has expired", codes: ["signing.cert_expired"] }),
    art({ id: "a2", space: "changelog", slug: "android-16", title: "Android 16 builds", tags: ["dsx"] }),
    art({ id: "a3", space: "guides", slug: "move-a-v3-app-to-v4", title: "Move a V3 app to V4" }),
    art({ id: "a4", space: "docs", slug: "push", title: "Push notifications" }),
    art({ id: "a5", space: "blog", slug: "why-native", title: "Why native" }),
    art({ id: "a6", space: "troubleshooting", slug: "white-screen-on-launch", title: "Collides with a hand written page" }),
  ] };
  const r = writeTree(root, snap);
  const page = readFileSync(join(root, "content", "troubleshooting", "ios-certificate-expired.md"), "utf8");
  assert.match(page, /^---\ntitle: An iOS distribution certificate has expired\ndescription: S\.\nsource: help-hub\nhub: a1\nsymptom: S\.\nplatform: v4\ncodes: signing\.cert_expired\norder: 50\n---\n\n# An iOS/);
  assert.match(readFileSync(join(root, "content", "releases", "android-16.md"), "utf8"), /\ndate: 2026-10-08\npackage: dsx\n/);
  assert.ok(existsSync(join(root, "content", "guides", "move-a-v3-app-to-v4.md")));
  assert.ok(existsSync(join(root, "content", "help", "push.md")));
  assert.equal(existsSync(join(root, "content", "blog")), false, "the blog lives on despia.com");
  assert.equal(readFileSync(join(root, "content", "troubleshooting", "white-screen-on-launch.md"), "utf8"), "---\ntitle: Hand written\n---\n");
  assert.equal(r.skipped.length, 1);
  assert.equal(JSON.parse(readFileSync(join(root, "public", "announcements.json"), "utf8")).items[0].title, "Android 16 builds are here");

  const again = writeTree(root, snap, { check: true });
  assert.deepEqual([again.written.length, again.removed.length], [0, 0], "a second run writes nothing");

  const gone = writeTree(root, { ...snap, announcements: [], articles: snap.articles.filter((a) => a.id !== "a3") });
  assert.equal(existsSync(join(root, "content", "guides", "move-a-v3-app-to-v4.md")), false, "an unpublished article leaves");
  assert.equal(gone.removed.length, 1);
  assert.deepEqual(JSON.parse(readFileSync(join(root, "public", "announcements.json"), "utf8")).items, []);
});

test("a hub that does not answer is an error, never an empty snapshot", async () => {
  const snap = await readHub("https://api.despia.test", async () => new Response("{}", { status: 404 }));
  assert.ok(snap.error);
  assert.equal(snap.articles, undefined);
});

test("a live read takes every space's list, then each article, then the docs announcements", async () => {
  const asked = [];
  const snap = await readHub("https://api.despia.test", async (url) => {
    const u = new URL(url); asked.push(u.pathname + u.search);
    if (u.pathname === "/v1/help/articles" && u.searchParams.get("space") === "troubleshooting") return Response.json({ items: [{ space: "troubleshooting", slug: "x" }] });
    if (u.pathname === "/v1/help/articles") return Response.json({ items: [] });
    if (u.pathname.startsWith("/v1/help/articles/")) return Response.json({ article: art({ id: "a1", space: "troubleshooting", slug: "x", title: "X" }) });
    return Response.json({ items: [] });
  });
  assert.equal(snap.articles.length, 1);
  assert.ok(asked.includes("/v1/help/articles/troubleshooting/x"));
  assert.equal(asked.at(-1), "/v1/help/announcements?channel=docs");
});
