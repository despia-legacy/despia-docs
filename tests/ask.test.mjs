// Ask AI (worker/ask.ts): retrieval -> passages -> prompt, citation mapping, refusal on empty retrieval, the spend guard
// (paused and fail closed), the per-client rate limit, the stub model and the model stream. No network: every
// upstream (OpenRouter, the guard binding, the search) is a stand-in.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createAsk, selectPassages, buildPrompt, linkCitations, citedNumbers, sourcesOf, stubText, refusalText, RateLimiter,
  DEFAULT_MODEL, STUB_MODEL, REFUSAL, SYSTEM_PROMPT, LIMITS,
} from "../worker/ask.ts";

const SITE = "https://docs.despia.com";
const CHUNKS = [
  { id: "/packages/haptic#install", route: "/packages/haptic", space: "modern", title: "Haptics", heading: "Install", text: "## Install\n\nRun `despia add haptic` in your project." },
  { id: "/packages/haptic#play-a-haptic", route: "/packages/haptic", space: "modern", title: "Haptics", heading: "Play a haptic", text: "## Play a haptic\n\nCall the haptic module from an action.\n\n```xml\n<button label=\"Tap\" on:tap=\"dsx.module.haptic.light()\"/>\n```" },
  { id: "/packages/haptic#platforms", route: "/packages/haptic", space: "modern", title: "Haptics", heading: "Platforms", text: "## Platforms\n\nWorks on iOS and Android. The web does nothing." },
  { id: "/quickstart#install-node", route: "/quickstart", space: "modern", title: "Quickstart", heading: "Install Node", text: "## Install Node\n\nYou need Node.js 22 or later for haptic demos." },
  { id: "/legacy/push", route: "/legacy/push", space: "legacy", title: "Push", heading: "", text: "Push notifications in V3." },
];
const HITS = [
  { route: "/packages/haptic", title: "Haptics", url: `${SITE}/packages/haptic` },
  { route: "/quickstart", title: "Quickstart", url: `${SITE}/quickstart` },
];

function parseSse(text) {
  const out = [];
  for (const block of text.split("\n\n")) {
    if (block.trim() === "") continue;
    let event = "message"; const data = [];
    for (const line of block.split("\n")) {
      if (line.startsWith("event: ")) event = line.slice(7);
      else if (line.startsWith("data: ")) data.push(line.slice(6));
    }
    out.push({ event, data: JSON.parse(data.join("\n")) });
  }
  return out;
}
const answerOf = (frames) => frames.filter((f) => f.data.type === "delta").map((f) => f.data.text).join("");

let ipSeq = 0;
function req(body, init = {}) {
  ipSeq += 1;
  return new Request(`${SITE}/api/ask`, {
    method: "POST",
    headers: { "content-type": "application/json", "cf-connecting-ip": init.ip ?? `10.0.0.${ipSeq}`, ...(init.origin ? { origin: init.origin } : {}) },
    body: JSON.stringify(body),
  });
}
function makeAsk({ hits = HITS, fetchImpl } = {}) {
  const calls = [];
  const ask = createAsk({
    site: SITE,
    retrieve: async () => hits,
    chunks: async () => CHUNKS,
    fetch: async (url, init) => { calls.push({ url, init, body: JSON.parse(init.body) }); return fetchImpl(url, init, calls.length); },
  });
  return { ask, calls };
}
const guardSaying = (body, status = 200) => ({ fetch: async () => status === 204 ? new Response(null, { status }) : new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }) });
function openRouterStream(pieces, usage) {
  const lines = [": OPENROUTER PROCESSING", ...pieces.map((t) => `data: ${JSON.stringify({ choices: [{ delta: { content: t } }] })}`),
    ...(usage ? [`data: ${JSON.stringify({ choices: [{ delta: {} }], usage })}`] : []), "data: [DONE]"];
  return new Response(lines.join("\n\n") + "\n\n", { status: 200, headers: { "content-type": "text/event-stream" } });
}

// ── retrieval -> prompt ──────────────────────────────────────────────────────────────────────────

test("passages come from the retrieved pages only, ranked by the question, at most two per page, numbered, with anchors", () => {
  const p = selectPassages("How do I play a haptic on tap?", HITS, CHUNKS, SITE);
  assert.ok(p.length >= 2);
  assert.deepEqual(p.map((x) => x.n), p.map((_, i) => i + 1));
  assert.equal(p[0].id, "/packages/haptic#play-a-haptic");
  assert.equal(p[0].url, `${SITE}/packages/haptic#play-a-haptic`);
  assert.ok(p.filter((x) => x.route === "/packages/haptic").length <= LIMITS.perPage);
  assert.ok(!p.some((x) => x.route === "/legacy/push"), "a page the search did not return is never a passage");
  assert.ok(p.reduce((n, x) => n + x.text.length, 0) <= LIMITS.contextChars);
});

test("the prompt carries the numbered passages, their URLs, the rules and the question", () => {
  const p = selectPassages("play a haptic", HITS, CHUNKS, SITE);
  const { system, user } = buildPrompt("play a haptic", p);
  assert.equal(system, SYSTEM_PROMPT);
  assert.match(system, /ONLY the numbered passages/);
  assert.match(system, /cite it inline as \[n\]/);
  assert.match(system, /Show code only when that exact code/);
  assert.match(system, /I could not find this in the Despia docs/);
  assert.match(user, /^Passages:/);
  assert.match(user, /\[1\] Haptics › Play a haptic \(https:\/\/docs\.despia\.com\/packages\/haptic#play-a-haptic\)/);
  assert.match(user, /dsx\.module\.haptic\.light\(\)/, "code inside a passage reaches the model");
  assert.match(user, /Question: play a haptic$/);
});

test("a pasted credential never reaches the model", () => {
  const { user } = buildPrompt("my key sk-or-v1-abcdefghijklmnopqrstuvwxyz0123 fails", []);
  assert.ok(!user.includes("abcdefghijklmnopqrstuvwxyz0123"));
  assert.match(user, /\[redacted\]/);
});

// ── citations ────────────────────────────────────────────────────────────────────────────────────

test("citations map to page URLs; unknown numbers are dropped; code is left alone", () => {
  const sources = sourcesOf(selectPassages("play a haptic install", HITS, CHUNKS, SITE));
  const text = "Install it first [2]. Then call it [1, 2]. Not a source [9].\n\n```js\nconst a = b[0]; // [1]\n```";
  const md = linkCitations(text, sources);
  assert.ok(md.includes(`[[2]](${sources[1].url})`));
  assert.ok(md.includes(`[[1]](${sources[0].url})[[2]](${sources[1].url})`));
  assert.ok(!md.includes("[9]"));
  assert.ok(md.includes("const a = b[0]; // [1]"), "a bracket inside a code fence is not a citation");
  assert.deepEqual(citedNumbers(text, sources.length), [2, 1]);
  assert.deepEqual(citedNumbers("see [7]", 3), []);
});

// ── refusal ──────────────────────────────────────────────────────────────────────────────────────

test("empty retrieval refuses without calling a model", async () => {
  const { ask, calls } = makeAsk({ hits: [], fetchImpl: () => { throw new Error("must not be called"); } });
  const res = await ask.handle(req({ question: "what is the airspeed of a swallow" }), { OPENROUTER_API_KEY: "test-key", SPEND_GUARD: guardSaying({ mode: "on", paused: [] }) });
  assert.equal(res.status, 200);
  const frames = parseSse(await res.text());
  assert.equal(frames[0].data.type, "meta");
  assert.equal(frames[0].data.mode, "refusal");
  assert.deepEqual(frames[0].data.sources, []);
  assert.ok(answerOf(frames).startsWith(REFUSAL));
  assert.equal(frames.at(-1).data.type, "done");
  assert.equal(calls.length, 0);
});

test("pages found but no passage holds the question's words: refusal that lists the closest pages", async () => {
  const { ask, calls } = makeAsk({ fetchImpl: () => { throw new Error("must not be called"); } });
  const res = await ask.handle(req({ question: "zebra quantum lasagne" }), {});
  const frames = parseSse(await res.text());
  assert.equal(frames[0].data.mode, "refusal");
  assert.equal(frames[0].data.related.length, 2);
  assert.ok(answerOf(frames).includes(`[Haptics](${SITE}/packages/haptic)`));
  assert.equal(calls.length, 0);
  assert.equal(refusalText([]).startsWith(REFUSAL), true);
});

// ── spend guard ──────────────────────────────────────────────────────────────────────────────────

for (const [name, env] of [
  ["the guard pauses product ai", { OPENROUTER_API_KEY: "k", SPEND_GUARD: guardSaying({ mode: "on", paused: ["ai"], reason: "AI budget reached" }) }],
  ["the account is off", { OPENROUTER_API_KEY: "k", SPEND_GUARD: guardSaying({ mode: "off", paused: [] }) }],
  ["the account is read-only", { OPENROUTER_API_KEY: "k", SPEND_GUARD: guardSaying({ mode: "read-only", paused: [] }) }],
  ["the guard answers 500 (fail closed)", { OPENROUTER_API_KEY: "k", SPEND_GUARD: guardSaying({}, 500) }],
  ["the guard throws (fail closed)", { OPENROUTER_API_KEY: "k", SPEND_GUARD: { fetch: async () => { throw new Error("unreachable"); } } }],
  ["a key but no guard bound (fail closed)", { OPENROUTER_API_KEY: "k" }],
  ["the manual switch, even in stub mode", { DOCS_AI_PAUSED: "1" }],
]) {
  test(`paused fallback: ${name} -> 503 ai_paused with the matching pages, no model call`, async () => {
    const { ask, calls } = makeAsk({ fetchImpl: () => { throw new Error("must not be called"); } });
    const res = await ask.handle(req({ question: "play a haptic" }), env);
    assert.equal(res.status, 503);
    const body = await res.json();
    assert.equal(body.error, "ai_paused");
    assert.deepEqual(body.pages.map((p) => p.route), ["/packages/haptic", "/quickstart"]);
    assert.equal(calls.length, 0);
  });
}

test("the guard verdict is cached, and a guard that never ran (204) lets AI through", async () => {
  let reads = 0;
  const env = { OPENROUTER_API_KEY: "k", SPEND_GUARD: { fetch: async () => { reads += 1; return new Response(null, { status: 204 }); } } };
  const { ask } = makeAsk({ fetchImpl: () => openRouterStream(["Hi [1]."]) });
  assert.equal((await ask.handle(req({ question: "play a haptic" }), env)).status, 200);
  assert.equal((await ask.handle(req({ question: "play a haptic" }), env)).status, 200);
  assert.equal(reads, 1);
});

// ── rate limit ───────────────────────────────────────────────────────────────────────────────────

test(`rate limit: ${LIMITS.perMinute} asks a minute per client, then 429 with retry-after; another client is unaffected`, async () => {
  const { ask } = makeAsk({ fetchImpl: () => { throw new Error("stub mode: no call"); } });
  for (let i = 0; i < LIMITS.perMinute; i += 1) assert.equal((await ask.handle(req({ question: "play a haptic" }, { ip: "203.0.113.7" }), {})).status, 200);
  const limited = await ask.handle(req({ question: "play a haptic" }, { ip: "203.0.113.7" }), {});
  assert.equal(limited.status, 429);
  assert.equal((await limited.json()).error, "rate_limited");
  assert.ok(Number(limited.headers.get("retry-after")) >= 1);
  assert.equal((await ask.handle(req({ question: "play a haptic" }, { ip: "203.0.113.8" }), {})).status, 200);
});

test("the bucket refills over time", () => {
  const r = new RateLimiter(2);
  assert.equal(r.take("a", 0), 0);
  assert.equal(r.take("a", 0), 0);
  assert.ok(r.take("a", 0) > 0);
  assert.equal(r.take("a", 31_000), 0);
});

// ── request checks ───────────────────────────────────────────────────────────────────────────────

test("bad requests: GET 405, empty or long question 400, another origin 403", async () => {
  const { ask } = makeAsk({ fetchImpl: () => { throw new Error("no"); } });
  assert.equal((await ask.handle(new Request(`${SITE}/api/ask`), {})).status, 405);
  assert.equal((await ask.handle(req({ question: " " }), {})).status, 400);
  assert.equal((await ask.handle(req({ question: "x".repeat(LIMITS.questionChars + 1) }), {})).status, 400);
  assert.equal((await ask.handle(req({ question: "play a haptic" }, { origin: "https://evil.example" }), {})).status, 403);
  assert.equal((await ask.handle(req({ question: "play a haptic" }, { origin: SITE }), {})).status, 200);
});

// ── stub ─────────────────────────────────────────────────────────────────────────────────────────

test("stub mode (no key): labelled, retrieval and citations still shown, nothing called", async () => {
  const { ask, calls } = makeAsk({ fetchImpl: () => { throw new Error("must not be called"); } });
  const res = await ask.handle(req({ question: "How do I play a haptic?" }), {});
  assert.equal(res.headers.get("content-type"), "text/event-stream; charset=utf-8");
  const frames = parseSse(await res.text());
  const meta = frames[0].data;
  assert.equal(meta.mode, "stub");
  assert.equal(meta.model, STUB_MODEL);
  assert.ok(meta.sources.length >= 2);
  const text = answerOf(frames);
  assert.match(text, /^_Stub model: no AI key is set on this deployment/);
  assert.equal(text, stubText(selectPassages("How do I play a haptic?", HITS, CHUNKS, SITE)));
  const done = frames.at(-1).data;
  assert.equal(done.type, "done");
  assert.ok(done.cited.length >= 2);
  assert.ok(done.markdown.includes(`(${SITE}/packages/haptic#play-a-haptic)`));
  assert.equal(calls.length, 0);
});

// ── model ────────────────────────────────────────────────────────────────────────────────────────

test("model mode: the Support AI's provider and model, zero retention, capped, streamed, citations resolved", async () => {
  const { ask, calls } = makeAsk({ fetchImpl: () => openRouterStream(["Call ", "`dsx.module.haptic.light()` from an action [1]", ". It does nothing on the web [2]."], { prompt_tokens: 900, completion_tokens: 40, cost: 0.003 }) });
  const res = await ask.handle(req({ question: "How do I play a haptic?" }), { OPENROUTER_API_KEY: "test-key", SPEND_GUARD: guardSaying({ mode: "on", paused: [] }) });
  assert.equal(res.status, 200);
  const frames = parseSse(await res.text());
  assert.equal(calls.length, 1);
  const { url, init, body } = calls[0];
  assert.equal(url, "https://openrouter.ai/api/v1/chat/completions");
  assert.equal(init.headers.authorization, "Bearer test-key");
  assert.equal(body.model, DEFAULT_MODEL);
  assert.equal(DEFAULT_MODEL, "anthropic/claude-sonnet-4.5");
  assert.deepEqual(body.provider, { data_collection: "deny", zdr: true });
  assert.equal(body.stream, true);
  assert.equal(body.max_tokens, LIMITS.maxTokens);
  assert.equal(body.messages[0].role, "system");
  assert.equal(body.messages[0].content, SYSTEM_PROMPT);
  assert.ok(init.signal instanceof AbortSignal);
  assert.equal(frames[0].data.mode, "model");
  assert.equal(answerOf(frames), "Call `dsx.module.haptic.light()` from an action [1]. It does nothing on the web [2].");
  const done = frames.at(-1).data;
  assert.deepEqual(done.cited, [1, 2]);
  assert.equal(done.usage.outputTokens, 40);
  assert.ok(done.markdown.includes(`[[1]](${frames[0].data.sources[0].url})`));
});

test("model mode: no zero-retention endpoint -> one retry with data collection still denied", async () => {
  const { ask, calls } = makeAsk({ fetchImpl: (_u, _i, n) => n === 1
    ? new Response(JSON.stringify({ error: { message: "No endpoints found matching your data policy" } }), { status: 404 })
    : openRouterStream(["Yes [1]."]) });
  const res = await ask.handle(req({ question: "play a haptic" }), { OPENROUTER_API_KEY: "k", SPEND_GUARD: guardSaying({ mode: "on", paused: [] }) });
  assert.equal(res.status, 200);
  await res.text();
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[1].body.provider, { data_collection: "deny" });
});

test("model mode: upstream 429 -> 503 ai_busy with pages; refused key -> 503 ai_paused", async () => {
  const env = { OPENROUTER_API_KEY: "k", SPEND_GUARD: guardSaying({ mode: "on", paused: [] }) };
  const busy = makeAsk({ fetchImpl: () => new Response("{}", { status: 429 }) });
  const r1 = await busy.ask.handle(req({ question: "play a haptic" }), env);
  assert.equal(r1.status, 503);
  assert.equal((await r1.json()).error, "ai_busy");
  const refused = makeAsk({ fetchImpl: () => new Response("{}", { status: 401 }) });
  const r2 = await refused.ask.handle(req({ question: "play a haptic" }), env);
  assert.equal((await r2.json()).error, "ai_paused");
});
