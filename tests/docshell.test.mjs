// DocShell's own state reads back what it declares (a declared name that collides with a
// reserved plane, as `platform` did, silently reads the runtime's value instead).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mount } from "@despia-native/cli/test";

test("DocShell state and the space label", async () => {
  // Use the same generated space declaration the compiler supplies to every page.
  const spaces = JSON.parse(readFileSync(new URL("../public/nav.json", import.meta.url), "utf8")).spaces
    .map(({ id, label, home }) => ({ id, label, home }));
  assert.ok(spaces.some(({ id, label }) => id === "legacy" && label === "Legacy (V3)"));
  const shell = await mount("DocShell", { attributes: { spaces: JSON.stringify(spaces), space: "legacy", route: "/legacy/introduction" } });
  assert.equal(shell.variable("scope"), "This space");
  assert.equal(shell.variable("query"), "");
  assert.equal(shell.variable("spacePick"), "Legacy (V3)");
  assert.equal(shell.formula("spaceLabel"), "Legacy (V3)");
  // the trail starts below the space: the section (when it is not the space itself), then the page
  assert.deepEqual(JSON.parse(shell.formula("crumbs")).map((c) => c.title), ["Despia docs"]);
});
