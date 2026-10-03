// DocShell's own state reads back what it declares (a declared name that collides with a
// reserved plane, as `platform` did, silently reads the runtime's value instead).
import { test } from "node:test";
import assert from "node:assert/strict";
import { mount } from "@despia-native/cli/test";

test("DocShell state and the space label", async () => {
  const shell = await mount("DocShell", { attributes: { space: "legacy", route: "/legacy/introduction" } });
  assert.equal(shell.variable("scope"), "This space");
  assert.equal(shell.variable("query"), "");
  assert.equal(shell.variable("spacePick"), "Legacy v3");
  assert.equal(shell.formula("spaceLabel"), "Legacy v3");
  assert.equal(JSON.parse(shell.formula("crumbs"))[0].label, "Legacy v3");
});
