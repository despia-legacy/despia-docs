// DocShell (the shell of the legacy, migration, troubleshooting, releases and App Review spaces) reads back what it
// declares: a declared name that collides with a reserved plane, as `platform` did, silently reads the runtime's
// value instead.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mount } from "@despia-native/cli/test";

const spaces = JSON.stringify([
  { id: "modern", label: "Despia V4", home: "/" },
  { id: "legacy", label: "Legacy (V3)", home: "/legacy/introduction" },
]);

test("DocShell state and the space label", async () => {
  const shell = await mount("DocShell", { attributes: { space: "legacy", route: "/legacy/introduction", spaces } });
  assert.equal(shell.variable("query"), "");
  assert.equal(shell.variable("navOpen"), false);
  assert.equal(shell.formula("spaceLabel"), "Legacy (V3)");
  assert.deepEqual(shell.formula("spaceMenu").filter((r) => !r.header).map((r) => [r.title, r.icon, r.href]),
    [["Despia V4", "book", "/"], ["Legacy (V3)", "checkmark", "/legacy/introduction"]]);
});

test("DocShell with no spaces falls back to the docs name", async () => {
  const shell = await mount("DocShell", { attributes: { space: "legacy", route: "/legacy/introduction" } });
  assert.equal(shell.formula("spaceLabel"), "Despia docs");
});
