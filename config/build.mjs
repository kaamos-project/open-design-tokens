/*
 * Build dei token: tokens/*.json (W3C DTCG) -> dist/
 *
 *   dist/css/tokens.css       variabili CSS in :root (web senza Tailwind)
 *   dist/css/fonts.css        @font-face di Inter
 *   dist/tailwind/theme.css   blocco @theme per Tailwind v4
 *   dist/flutter/             pacchetto Dart completo (pubspec, lib, font)
 *
 * Uso: npm run build
 */
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import StyleDictionary from "style-dictionary";
import { cssVariablesFormat, tailwindThemeFormat } from "./formats/css.mjs";
import { dartFormat, DART_PACKAGE } from "./formats/dart.mjs";

const root = new URL("../", import.meta.url);
const path = (p) => new URL(p, root);

const { version } = JSON.parse(await readFile(path("package.json"), "utf8"));

await rm(path("dist/"), { recursive: true, force: true });

for (const f of [cssVariablesFormat, tailwindThemeFormat, dartFormat]) {
  StyleDictionary.registerFormat(f);
}

const sd = new StyleDictionary({
  source: ["tokens/**/*.json"],
  // I file usano $value/$type del formato W3C DTCG.
  usesDtcg: true,
  // Un alias che punta a un token inesistente, o due token con lo stesso nome,
  // devono far FALLIRE la build (e quindi la CI), non solo stampare un avviso.
  log: { warnings: "error", verbosity: "verbose" },
  // name/kebab: il nome interno di ogni token è il percorso completo
  // (font.weight.normal -> font-weight-normal). Senza, SD userebbe solo l'ultima
  // chiave e "normal" esisterebbe due volte. I nomi finali li decidono i formati.
  platforms: {
    css: {
      transforms: ["name/kebab"],
      buildPath: "dist/css/",
      files: [{ destination: "tokens.css", format: "kaamos/css-variables" }],
    },
    tailwind: {
      transforms: ["name/kebab"],
      buildPath: "dist/tailwind/",
      files: [{ destination: "theme.css", format: "kaamos/tailwind-theme" }],
    },
    flutter: {
      transforms: ["name/kebab"],
      buildPath: "dist/flutter/lib/",
      files: [{ destination: `${DART_PACKAGE}.dart`, format: "kaamos/dart" }],
    },
  },
});

await sd.buildAllPlatforms();

// File che non sono token: font e manifesto del pacchetto Flutter.
await cp(path("config/templates/fonts.css"), path("dist/css/fonts.css"));

const flutter = path("dist/flutter/");
const pubspec = await readFile(path("config/templates/flutter/pubspec.yaml"), "utf8");
await writeFile(new URL("pubspec.yaml", flutter), pubspec.replace("__VERSION__", version));
await cp(path("config/templates/flutter/README.md"), new URL("README.md", flutter));
await cp(path("LICENSE"), new URL("LICENSE", flutter));
await mkdir(new URL("fonts/", flutter), { recursive: true });
for (const f of ["InterVariable.ttf", "InterVariable-Italic.ttf", "OFL.txt"]) {
  await cp(path(`assets/fonts/${f}`), new URL(`fonts/${f}`, flutter));
}

console.log(`\nToken ${version} generati in dist/`);
