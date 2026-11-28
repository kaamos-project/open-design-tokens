/*
 * Icons: the full Lucide set (https://lucide.dev, ISC) -> dist/
 *
 *   dist/flutter/fonts/KaamosIcons.ttf   icon font (Lucide's font, cleaned up)
 *   dist/flutter/lib/kaamos_icons.dart   KaamosIcons: one `static const IconData` per icon
 *   dist/icons/index.js (+ .d.ts)        one ES export per icon (SVG nodes), tree-shakeable
 *   dist/icons/sprite.svg                every icon as a <symbol>, for pages without a bundler
 *   dist/icons/icons.json                metadata: names, codepoints, search tags
 *
 * The source is the `lucide-static` npm package, pinned in package.json: to update
 * Lucide run `npm run icons:update` (see docs/icons.md).
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";

/** Reserved words in Dart or JavaScript: such names get a trailing underscore. */
const RESERVED = new Set([
  // Dart (reserved words and built-in identifiers)
  "abstract", "as", "assert", "async", "await", "base", "break", "case", "catch",
  "class", "const", "continue", "covariant", "default", "deferred", "do", "dynamic",
  "else", "enum", "export", "extends", "extension", "external", "factory", "false",
  "final", "finally", "for", "function", "get", "hide", "if", "implements", "import",
  "in", "interface", "is", "late", "library", "mixin", "new", "null", "of", "on",
  "operator", "part", "required", "rethrow", "return", "sealed", "set", "show",
  "static", "super", "switch", "sync", "this", "throw", "true", "try", "type",
  "typedef", "var", "void", "when", "while", "with", "yield",
  // JavaScript (strict mode)
  "delete", "instanceof", "let", "package", "private", "protected", "public",
  "typeof", "debugger", "arguments", "eval",
]);

/** "arrow-down-0-1" -> "arrowDown01"; "package" -> "package_" */
export function identifier(name) {
  const id = name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
  return RESERVED.has(id) ? `${id}_` : id;
}

/* ------------------------------------------------------------------------- */
/* Font: remove tables we don't want.                                        */
/* ------------------------------------------------------------------------- */

/** OpenType checksum: sum of the data as big-endian uint32, zero-padded to 4 bytes. */
function checksum(bytes) {
  const padded = new Uint8Array((bytes.length + 3) & ~3);
  padded.set(bytes);
  const view = new DataView(padded.buffer);
  let sum = 0;
  for (let i = 0; i < padded.length; i += 4) sum = (sum + view.getUint32(i)) >>> 0;
  return sum;
}

/**
 * Rewrites a TrueType/OpenType file without the given tables.
 *
 * Why: Lucide's font ships a GSUB table (ligatures: typing "mail" shows the icon)
 * that standard font tools reject as corrupted: fontTools' subsetter crashes and
 * HarfBuzz's hb-subset fails. Flutter's own subsetter happens to cope (it was
 * checked), but we want a font any tool can subset, e.g. a future web icon font
 * or our tests. We use codepoints, not ligatures, so the table can simply go,
 * and the font also gets ~70 KB lighter where it isn't tree-shaken (debug builds).
 *
 * The format is simple: a header, a directory of {tag, checksum, offset, length}
 * and the tables. We copy every table we keep, re-align them to 4 bytes and
 * recompute the checksums, including head.checkSumAdjustment.
 */
export function dropTables(font, drop) {
  const src = new DataView(font.buffer, font.byteOffset, font.byteLength);
  const numTables = src.getUint16(4);
  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const rec = 12 + i * 16;
    const tag = String.fromCharCode(...font.subarray(rec, rec + 4));
    if (drop.includes(tag)) continue;
    const offset = src.getUint32(rec + 8);
    const length = src.getUint32(rec + 12);
    // A copy with its own buffer: Node's Buffer.slice() would return a view on the
    // whole file, and the head edit below would then write in the wrong place.
    tables.push({ tag, data: new Uint8Array(font.subarray(offset, offset + length)) });
  }
  // The directory must be sorted by tag.
  tables.sort((a, b) => (a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0));

  const headerSize = 12 + tables.length * 16;
  const size = tables.reduce((n, t) => n + ((t.data.length + 3) & ~3), headerSize);
  const out = new Uint8Array(size);
  const view = new DataView(out.buffer);

  // Binary search hints required by the spec.
  const entrySelector = Math.floor(Math.log2(tables.length));
  const searchRange = 2 ** entrySelector * 16;
  view.setUint32(0, src.getUint32(0)); // sfntVersion
  view.setUint16(4, tables.length);
  view.setUint16(6, searchRange);
  view.setUint16(8, entrySelector);
  view.setUint16(10, tables.length * 16 - searchRange);

  let offset = headerSize;
  let headOffset = -1;
  tables.forEach((t, i) => {
    if (t.tag === "head") {
      // checkSumAdjustment (byte 8 of head) is computed last, over the whole file.
      new DataView(t.data.buffer).setUint32(8, 0);
      headOffset = offset;
    }
    const rec = 12 + i * 16;
    for (let c = 0; c < 4; c++) out[rec + c] = t.tag.charCodeAt(c);
    view.setUint32(rec + 4, checksum(t.data));
    view.setUint32(rec + 8, offset);
    view.setUint32(rec + 12, t.data.length);
    out.set(t.data, offset);
    offset += (t.data.length + 3) & ~3;
  });
  if (headOffset < 0) throw new Error("The font has no head table");
  view.setUint32(headOffset + 8, (0xb1b0afba - checksum(out)) >>> 0);
  return out;
}

/** Tags of the tables in a font file (used by the tests too). */
export function tableTags(font) {
  const view = new DataView(font.buffer, font.byteOffset, font.byteLength);
  return Array.from({ length: view.getUint16(4) }, (_, i) =>
    String.fromCharCode(...font.subarray(12 + i * 16, 16 + i * 16)),
  );
}

/* ------------------------------------------------------------------------- */
/* Reading Lucide                                                            */
/* ------------------------------------------------------------------------- */

/**
 * Reads lucide-static and returns the icons, sorted by name.
 *
 * lucide-static also contains ~300 deprecated aliases (alert-circle ->
 * circle-alert): identical SVGs under old names. We publish only the canonical
 * names, the ones listed in icon-nodes.json, so every icon has exactly one name.
 */
export async function readLucide(lucideDir) {
  const json = async (p) => JSON.parse(await readFile(new URL(p, lucideDir), "utf8"));
  const { version } = await json("package.json");
  const nodes = await json("icon-nodes.json");
  const codepoints = await json("font/codepoints.json");
  const tags = await json("tags.json");

  const icons = Object.keys(nodes)
    .sort()
    .map((name) => {
      const codepoint = codepoints[name];
      if (!Number.isInteger(codepoint)) throw new Error(`Lucide icon without a codepoint: ${name}`);
      return { name, id: identifier(name), codepoint, tags: tags[name] ?? [], nodes: nodes[name] };
    });

  // Two icons with the same identifier or codepoint would silently shadow each other.
  for (const key of ["id", "codepoint"]) {
    const seen = new Map();
    for (const icon of icons) {
      if (seen.has(icon[key])) {
        throw new Error(`Icons ${seen.get(icon[key])} and ${icon.name} share the ${key} ${icon[key]}`);
      }
      seen.set(icon[key], icon.name);
    }
  }
  return { version, icons };
}

/* ------------------------------------------------------------------------- */
/* Writers                                                                   */
/* ------------------------------------------------------------------------- */

const HEADER = "GENERATED by open-design-tokens from Lucide";

const hex = (n) => `0x${n.toString(16)}`;
const escapeXml = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** [["path", {d: "..."}]] -> '<path d="..."/>' */
function svgChildren(nodes) {
  return nodes
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs).map(([k, v]) => ` ${k}="${escapeXml(v)}"`).join("");
      return `<${tag}${a}/>`;
    })
    .join("");
}

export function dartIcons({ version, icons }, { fontFamily, fontPackage }) {
  const members = icons.map((i) => {
    const tags = i.tags.length ? `\n  ///\n  /// Tags: ${i.tags.join(", ")}.` : "";
    return (
      `  /// Lucide \`${i.name}\`.${tags}\n` +
      `  static const IconData ${i.id} = IconData(${hex(i.codepoint)}, fontFamily: _family, fontPackage: _package);`
    );
  });
  return `// ${HEADER} ${version}: do not edit by hand.
// Lucide icons: ISC License, some derived from Feather (MIT). See fonts/LUCIDE-LICENSE.txt.

import 'package:flutter/widgets.dart';

/// All ${icons.length} [Lucide](https://lucide.dev) ${version} icons, as [IconData] for the [Icon] widget.
///
/// Every icon is a \`const\`: in release builds Flutter keeps only the glyphs you
/// use (icon tree-shaking), so the full set costs a few KB in the final app.
/// Don't build an [IconData] from a value read at runtime (a map from names,
/// a JSON file): Flutter could no longer tell which icons are used.
///
/// Icons are drawn on a 24x24 grid with a 2px stroke; the stroke scales with
/// the icon size.
abstract final class KaamosIcons {
  static const String _family = '${fontFamily}';
  static const String _package = '${fontPackage}';

  /// Version of Lucide the icons come from.
  static const String lucideVersion = '${version}';

${members.join("\n\n")}
}
`;
}

export function jsIcons({ version, icons }) {
  const js = icons.map((i) => `/** Lucide \`${i.name}\` */\nexport const ${i.id} = ${JSON.stringify(i.nodes)};`);
  const dts = icons.map((i) => `/** Lucide \`${i.name}\` */\nexport declare const ${i.id}: IconNode;`);
  return {
    js: `// ${HEADER} ${version}: do not edit by hand. Lucide: ISC License, see LICENSE.txt.
// Each export is the content of a 24x24 SVG as [tag, attributes] pairs. Import only
// what you use: bundlers drop the rest (tree-shaking).
export const lucideVersion = ${JSON.stringify(version)};

${js.join("\n")}
`,
    dts: `// ${HEADER} ${version}: do not edit by hand.
/** The children of a 24x24 SVG: [tag, attributes] pairs. */
export type IconNode = ReadonlyArray<readonly [tag: string, attributes: Readonly<Record<string, string>>]>;

export declare const lucideVersion: string;

${dts.join("\n")}
`,
  };
}

export function spriteSvg({ version, icons }) {
  const symbols = icons.map(
    (i) => `<symbol id="${i.name}" viewBox="0 0 24 24">${svgChildren(i.nodes)}</symbol>`,
  );
  return `<?xml version="1.0" encoding="utf-8"?>
<!-- ${HEADER} ${version}. Lucide: ISC License, see LICENSE.txt. -->
<svg xmlns="http://www.w3.org/2000/svg"><defs>
${symbols.join("\n")}
</defs></svg>
`;
}

export function iconsJson({ version, icons }) {
  return JSON.stringify(
    {
      lucideVersion: version,
      icons: icons.map(({ name, id, codepoint, tags }) => ({ name, id, codepoint, tags })),
    },
    null,
    2,
  ) + "\n";
}

/* ------------------------------------------------------------------------- */

export const ICON_FONT_FAMILY = "KaamosIcons";

/** Writes every icon output; called by config/build.mjs. */
export async function buildIcons({ root, dartPackage }) {
  const lucideDir = new URL("node_modules/lucide-static/", root);
  const lucide = await readLucide(lucideDir);
  const license = await readFile(new URL("LICENSE", lucideDir));

  // Flutter
  const flutter = new URL("dist/flutter/", root);
  await mkdir(new URL("fonts/", flutter), { recursive: true });
  const font = await readFile(new URL("font/lucide.ttf", lucideDir));
  await writeFile(new URL(`fonts/${ICON_FONT_FAMILY}.ttf`, flutter), dropTables(font, ["GSUB"]));
  await writeFile(new URL("fonts/LUCIDE-LICENSE.txt", flutter), license);
  await writeFile(
    new URL("lib/kaamos_icons.dart", flutter),
    dartIcons(lucide, { fontFamily: ICON_FONT_FAMILY, fontPackage: dartPackage }),
  );

  // Web
  const web = new URL("dist/icons/", root);
  await mkdir(web, { recursive: true });
  const { js, dts } = jsIcons(lucide);
  await writeFile(new URL("index.js", web), js);
  await writeFile(new URL("index.d.ts", web), dts);
  await writeFile(new URL("sprite.svg", web), spriteSvg(lucide));
  await writeFile(new URL("icons.json", web), iconsJson(lucide));
  await writeFile(new URL("LICENSE.txt", web), license);

  return lucide;
}
