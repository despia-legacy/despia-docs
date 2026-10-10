// The Ask AI panel (Components/DocAsk.dsx): every state renders real text, never "[object Object]" (owner 2026-10-10:
// the old panel's suggestion rows painted "[object Object]"), the stream folds into one answer with linked citations,
// and a paused or failed answer falls back to the matching pages.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mount } from "@despia-native/cli/test";

const SOURCES = [
  { n: 1, title: "Haptics", heading: "Wire it to a button", url: "https://docs.despia.com/packages/haptic#wire-it-to-a-button", route: "/packages/haptic" },
  { n: 2, title: "Haptics", heading: "When to use it", url: "https://docs.despia.com/packages/haptic#when-to-use-it", route: "/packages/haptic" },
];
const PAGES = [{ title: "Haptics", url: "https://docs.despia.com/packages/haptic", route: "/packages/haptic" }];
const NO_OBJECT = (t) => assert.ok(!t.includes("[object Object]"), `rendered text holds [object Object]: ${t.slice(0, 400)}`);

test("empty state: the suggestion rows carry their labels", async () => {
  const panel = await mount("DocAsk");
  const html = panel.html();
  NO_OBJECT(panel.text());
  NO_OBJECT(html);
  for (const s of panel.variable("suggestions")) assert.ok(panel.text().includes(s.label), `missing suggestion ${s.label}`);
  assert.ok(panel.text().includes("Ask the Despia docs"));
});

test("a streamed answer: deltas fold into one answer, [n] links to the cited section on this site, sources are rows", async () => {
  const panel = await mount("DocAsk", { attributes: { space: "modern" } });
  panel.set("question", "How do I play a haptic on tap?");
  panel.set("phase", "asking");
  await panel.action("take", { chunk: { type: "meta", mode: "model", model: "anthropic/claude-sonnet-4.5", sources: SOURCES, related: PAGES } });
  await panel.action("take", { chunk: { type: "delta", text: "Call `dsx.module.haptic.success()` from the button's tap [1]" } });
  await panel.action("take", { chunk: { type: "delta", text: ", for a small confirmation [2]. Not a source [7]." } });
  assert.equal(panel.variable("phase"), "streaming");
  await panel.action("take", { chunk: { type: "done", text: "", markdown: "", cited: [1, 2], usage: null } });
  assert.equal(panel.variable("phase"), "done");
  const md = panel.variable("answerMarkdown");
  assert.ok(md.includes("[[1](/packages/haptic#wire-it-to-a-button)]"), md);
  assert.ok(md.includes("[[2](/packages/haptic#when-to-use-it)]"), md);
  assert.ok(!md.includes("[7]"), "a number with no source is dropped");
  assert.deepEqual(panel.variable("sourceRows").map((r) => r.title), ["1. Haptics", "2. Haptics"]);
  const text = panel.text();
  NO_OBJECT(text);
  NO_OBJECT(panel.html());
  assert.ok(text.includes("Sources"));
  assert.ok(text.includes("Wire it to a button"));
  assert.ok(text.includes("Written by AI from the Despia docs"));
});

test("stub mode says so", async () => {
  const panel = await mount("DocAsk");
  panel.set("question", "haptics");
  await panel.action("take", { chunk: { type: "meta", mode: "stub", model: "stub", sources: SOURCES, related: PAGES } });
  await panel.action("take", { chunk: { type: "delta", text: "_Stub model: no AI key is set on this deployment._ [1]" } });
  await panel.action("take", { chunk: { type: "done" } });
  assert.match(panel.variable("footnote"), /^Stub model/);
  NO_OBJECT(panel.text());
});

test("a refusal lists the closest pages", async () => {
  const panel = await mount("DocAsk");
  panel.set("question", "airspeed of a swallow");
  await panel.action("take", { chunk: { type: "meta", mode: "refusal", model: "", sources: [], related: PAGES } });
  await panel.action("take", { chunk: { type: "delta", text: "I could not find this in the Despia docs." } });
  await panel.action("take", { chunk: { type: "done" } });
  const text = panel.text();
  NO_OBJECT(text);
  assert.ok(text.includes("Closest pages"));
  assert.equal(panel.variable("pageRows")[0].title, "Haptics");
});

test("AI paused: the panel falls back to the matching pages", async () => {
  const panel = await mount("DocAsk");
  panel.set("question", "play a haptic");
  panel.set("phase", "asking");
  await panel.action("failed", { error: { status: 503, message: "http 503", body: { error: "ai_paused", message: "AI answers are paused for now. These docs pages match your question.", pages: PAGES } } });
  assert.equal(panel.variable("phase"), "paused");
  assert.equal(panel.variable("failureTitle"), "AI answers are paused");
  assert.equal(panel.variable("failureTone"), "info");
  assert.deepEqual(panel.variable("pageRows").map((r) => r.route), ["/packages/haptic"]);
  const text = panel.text();
  NO_OBJECT(text);
  assert.ok(text.includes("Pages that match"));
});

test("rate limited and network errors read as words, with Try again", async () => {
  const panel = await mount("DocAsk");
  panel.set("question", "play a haptic");
  await panel.action("failed", { error: { status: 429, message: "http 429", body: { error: "rate_limited", message: "Too many questions at once. Try again in 10 s." } } });
  assert.equal(panel.variable("failureTitle"), "Too many questions");
  assert.equal(panel.variable("phase"), "error");
  await panel.action("failed", { error: { status: 0, message: "network", body: null } });
  assert.match(panel.variable("failure").message, /Could not reach the docs server/);
  NO_OBJECT(panel.text());
});

test("the docs shell mounts the panel with no [object Object] anywhere", async () => {
  const shell = await mount("DocShell", { attributes: { space: "modern", route: "/quickstart" }, variables: { askOpen: true } });
  NO_OBJECT(shell.text());
});
