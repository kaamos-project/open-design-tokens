// Checks the generated icons. Run after `npm run build`: npm test
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, test } from "node:test";
import { Blob, Face } from "harfbuzzjs";
import subsetFont from "subset-font";
import { dropTables, identifier, tableTags } from "../config/icons.mjs";

const root = new URL("../", import.meta.url);
const read = (p) => readFile(new URL(p, root));

const lucide = JSON.parse(await read("node_modules/lucide-static/icon-nodes.json"));
const meta = JSON.parse(await read("dist/icons/icons.json"));
const font = new Uint8Array(await read("dist/flutter/fonts/KaamosIcons.ttf"));
const dart = String(await read("dist/flutter/lib/kaamos_icons.dart"));

describe("identifier", () => {
  test("kebab-case becomes camelCase", () => {
    assert.equal(identifier("arrow-down-0-1"), "arrowDown01");
    assert.equal(identifier("mail"), "mail");
  });
  test("reserved words get a trailing underscore", () => {
    assert.equal(identifier("package"), "package_");
    assert.equal(identifier("import"), "import_");
    assert.equal(identifier("delete"), "delete_");
  });
});

describe("icon set", () => {
  test("contains every canonical Lucide icon, and nothing else", () => {
    assert.deepEqual(meta.icons.map((i) => i.name), Object.keys(lucide).sort());
  });
  test("names and codepoints are unique", () => {
    assert.equal(new Set(meta.icons.map((i) => i.id)).size, meta.icons.length);
    assert.equal(new Set(meta.icons.map((i) => i.codepoint)).size, meta.icons.length);
  });
});

describe("Flutter font", () => {
  const face = new Face(new Blob(font));

  test("has no GSUB table", () => {
    assert.ok(!tableTags(font).includes("GSUB"));
    assert.equal(face.referenceTable("GSUB"), undefined);
  });

  test("has a glyph for every icon", () => {
    const unicodes = new Set(face.collectUnicodes());
    const missing = meta.icons.filter((i) => !unicodes.has(i.codepoint)).map((i) => i.name);
    assert.deepEqual(missing, []);
  });

  test("can be subset by HarfBuzz (what tree-shaking does)", async () => {
    const used = String.fromCodePoint(...meta.icons.slice(0, 3).map((i) => i.codepoint));
    const subset = await subsetFont(Buffer.from(font), used, { targetFormat: "truetype" });
    assert.ok(subset.length < 5_000, `3 icons weigh ${subset.length} bytes`);
  });

  test("dropTables keeps a valid font", () => {
    // Dropping again changes nothing and keeps every other table.
    const again = dropTables(font, ["GSUB"]);
    assert.deepEqual(tableTags(again), tableTags(font));
    assert.deepEqual(again, font);
  });
});

describe("Dart", () => {
  test("one const IconData per icon, with the right codepoint", () => {
    const found = new Map(
      [...dart.matchAll(/static const IconData (\w+) = IconData\(0x([0-9a-f]+),/g)].map((m) => [
        m[1],
        parseInt(m[2], 16),
      ]),
    );
    assert.equal(found.size, meta.icons.length);
    for (const i of meta.icons) assert.equal(found.get(i.id), i.codepoint, i.name);
  });
});

describe("web", () => {
  test("one ES export per icon, with Lucide's nodes", async () => {
    const mod = await import(new URL("dist/icons/index.js", root));
    for (const i of meta.icons) assert.deepEqual(mod[i.id], lucide[i.name], i.name);
    assert.equal(mod.lucideVersion, meta.lucideVersion);
  });

  test("the sprite has one symbol per icon", async () => {
    const sprite = String(await read("dist/icons/sprite.svg"));
    const ids = [...sprite.matchAll(/<symbol id="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(ids, meta.icons.map((i) => i.name));
  });
});
