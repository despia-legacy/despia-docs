// The generated index pages filter their own articles: an unfiltered index lists every one.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mount } from "@despia-native/cli/test";

test("Troubleshooting lists every article unfiltered and filters by platform", async () => {
  const page = await mount("PageTroubleshooting");
  assert.equal(page.formula("items").length, 3);
  assert.equal(page.formula("shown").length, 3);
  page.set("platformFilter", "V4");
  assert.equal(page.formula("shown").length, 0);
});

test("App Review lists every guideline and finds 4.2 by number", async () => {
  const page = await mount("PageAppReview");
  assert.equal(page.formula("shown").length, 13);
  page.set("q", "4.2");
  assert.ok(page.formula("shown").some((g) => g.guideline === "4.2"));
});
