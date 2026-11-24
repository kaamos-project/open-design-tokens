/*
 * Legge CHANGELOG.md (formato "Keep a Changelog").
 *
 *   node scripts/changelog.mjs 0.1.0    stampa le note della versione 0.1.0
 *   node scripts/changelog.mjs --check  controlla solo che il file sia leggibile
 *
 * Esce con errore se la versione non c'è o non ha note: la release si ferma
 * PRIMA di creare tag o pubblicare qualcosa.
 */
import { readFile } from "node:fs/promises";

const text = await readFile(new URL("../CHANGELOG.md", import.meta.url), "utf8");
const arg = process.argv[2];

// Ogni sezione inizia con "## [x.y.z]" (o "## [Unreleased]").
const sections = new Map();
let current = null;
for (const line of text.split("\n")) {
  const m = /^## \[([^\]]+)\]/.exec(line);
  if (m) {
    current = m[1];
    sections.set(current, []);
  } else if (current) {
    sections.get(current).push(line);
  }
}

if (arg === "--check") {
  if (sections.size === 0) {
    console.error("CHANGELOG.md: nessuna sezione '## [versione]' trovata.");
    process.exit(1);
  }
  console.log(`CHANGELOG.md ok: ${[...sections.keys()].join(", ")}`);
  process.exit(0);
}

if (!arg) {
  console.error("Uso: node scripts/changelog.mjs <versione> | --check");
  process.exit(1);
}

// Togliamo la riga dei link in fondo e le righe vuote ai bordi.
const notes = (sections.get(arg) ?? [])
  .filter((l) => !/^\[[^\]]+\]:\s/.test(l))
  .join("\n")
  .trim();

if (!notes) {
  console.error(`CHANGELOG.md: manca la sezione "## [${arg}]" o è vuota.`);
  console.error("Aggiungila su main prima di lanciare la release.");
  process.exit(1);
}
console.log(notes);
