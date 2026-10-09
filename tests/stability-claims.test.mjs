import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { claimsNativeProductionReady } from "../scripts/stability-claims.mjs";

test("the actual alpha boundary is not a current production claim", () => {
  const pages = JSON.parse(readFileSync(new URL("../public/search-index.json", import.meta.url), "utf8")).pages;
  for (const route of ["/framework/guides/quickstart", "/framework/guides/release-status"]) {
    const page = pages.find((p) => p.route === route);
    assert.ok(page);
    assert.match(page.text, /native UI rendering as production ready only from 1\.0\.0/);
    assert.equal(claimsNativeProductionReady(page.text), false);
  }
});

test("current or ambiguous native claims remain refused, including beside the future boundary", () => {
  for (const text of [
    "Native UI is production ready.",
    "Production-ready native UI.",
    "Native UI rendering is production-ready in 0.1.0.",
    "Native UI rendering as production-ready only from 1.0.0. Native UI is production ready now.",
    "Native UI rendering as production-ready only from 0.1.0.",
    "Native UI rendering as production-ready only after review.",
  ]) assert.equal(claimsNativeProductionReady(text), true, text);
});
