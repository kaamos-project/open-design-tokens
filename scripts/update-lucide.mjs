#!/usr/bin/env node
/*
 * Updates Lucide and tells you what changed for the apps.
 *
 *   npm run icons:update            -> latest version
 *   npm run icons:update -- 1.90.0  -> a specific version
 *
 * It installs lucide-static at an exact version, rebuilds, and prints the icons
 * added and removed. A removed icon breaks the apps that use it (the Dart
 * constant and the JS export disappear), so it needs a MAJOR release.
 */
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const target = process.argv[2] ?? "latest";

async function installed() {
  const dir = new URL("node_modules/lucide-static/", root);
  const { version } = JSON.parse(await readFile(new URL("package.json", dir), "utf8"));
  const names = Object.keys(JSON.parse(await readFile(new URL("icon-nodes.json", dir), "utf8")));
  return { version, names: new Set(names) };
}

const run = (cmd, args) => execFileSync(cmd, args, { cwd: root, stdio: "inherit" });

const before = await installed();
run("npm", ["install", "--save-dev", "--save-exact", `lucide-static@${target}`]);
const after = await installed();

if (before.version === after.version) {
  console.log(`\nLucide is already at ${after.version}: nothing to do.`);
  process.exit(0);
}

run("npm", ["run", "build"]);
run("npm", ["test"]);

const added = [...after.names].filter((n) => !before.names.has(n)).sort();
const removed = [...before.names].filter((n) => !after.names.has(n)).sort();

console.log(`\nLucide ${before.version} -> ${after.version}`);
console.log(`Added (${added.length}): ${added.join(", ") || "none"}`);
console.log(`Removed (${removed.length}): ${removed.join(", ") || "none"}`);
console.log(`\nAdd to CHANGELOG.md, under [Unreleased]:\n`);
console.log(`- Icone Lucide aggiornate da ${before.version} a ${after.version} (${added.length} nuove, ${removed.length} rimosse).`);
if (removed.length) {
  console.log(`\n⚠ Removed icons break the apps that use them: this needs a MAJOR release.`);
  console.log(`  Search the apps for the old names before releasing.`);
}
