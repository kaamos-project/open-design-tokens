import { HEADER, isFontFeatures } from "./shared.mjs";

export const DART_PACKAGE = "kaamos_design_tokens";

/** "on-dark-mute" -> "onDarkMute" */
function camel(name) {
  return name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

/** "16px" -> "16". In Flutter le misure sono pixel logici (double) senza unità. */
function px(value) {
  const m = /^(-?\d*\.?\d+)px$/.exec(value);
  if (!m) throw new Error(`Mi aspettavo una misura in px, ho trovato: ${value}`);
  return String(Number(m[1]));
}

/** "#rgb" | "#rrggbb" | "#rrggbbaa" | "rgba(r, g, b, a)" -> "Color(0xAARRGGBB)" */
function dartColor(value) {
  let r, g, b, a = 255;
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(value);
  const rgba = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(value);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = [...h].map((c) => c + c).join("");
    [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    if (h.length === 8) a = parseInt(h.slice(6, 8), 16);
  } else if (rgba) {
    [r, g, b] = rgba.slice(1, 4).map(Number);
    if (rgba[4] !== undefined) a = Math.round(Number(rgba[4]) * 255);
  } else {
    throw new Error(`Colore non supportato: ${value}`);
  }
  const hex2 = (n) => n.toString(16).padStart(2, "0").toUpperCase();
  return `Color(0x${hex2(a)}${hex2(r)}${hex2(g)}${hex2(b)})`;
}

function dartDuration(value) {
  const m = /^(\d+)(ms|s)$/.exec(value);
  if (!m) throw new Error(`Durata non supportata: ${value}`);
  const ms = m[2] === "s" ? Number(m[1]) * 1000 : Number(m[1]);
  return `Duration(milliseconds: ${ms})`;
}

function doc(token, indent = "  ") {
  return token.$description ? `${indent}/// ${token.$description}\n` : "";
}

/** Classe Dart con sole costanti: `abstract final` impedisce di istanziarla o estenderla. */
function dartClass(name, description, members) {
  return `/// ${description}\nabstract final class ${name} {\n${members.join("\n")}\n}\n`;
}

export const dartFormat = {
  name: "kaamos/dart",
  format: ({ dictionary }) => {
    const by = (...prefix) =>
      dictionary.allTokens.filter((t) => prefix.every((p, i) => t.path[i] === p));
    const last = (t) => camel(t.path.at(-1));

    const fontFamily = by("font", "family", "sans")[0].$value[0];
    const features = by("font", "features").find(isFontFeatures).$value;

    const colors = by("color").map(
      (t) => `${doc(t)}  static const Color ${last(t)} = ${dartColor(t.$value)};`,
    );
    const radius = by("radius").map(
      (t) => `${doc(t)}  static const double ${last(t)} = ${px(t.$value)};`,
    );
    const spacing = by("spacing").map(
      (t) => `${doc(t)}  static const double ${last(t)} = ${px(t.$value)};`,
    );
    const weights = by("font", "weight").map(
      (t) => `  static const FontWeight ${last(t)} = FontWeight.w${t.$value};`,
    );
    const durations = by("motion", "duration").map(
      (t) => `${doc(t)}  static const Duration ${last(t)} = ${dartDuration(t.$value)};`,
    );
    const easings = by("motion", "easing").map(
      (t) => `${doc(t)}  static const Cubic ${last(t)} = Cubic(${t.$value.join(", ")});`,
    );
    const styles = by("typography").map((t) => {
      const v = t.$value;
      return `${doc(t)}  static const TextStyle ${last(t)} = TextStyle(
    fontFamily: KaamosFont.family,
    package: KaamosFont.package,
    fontSize: ${px(v.fontSize)},
    height: ${v.lineHeight},
    letterSpacing: ${px(v.letterSpacing)},
    fontWeight: FontWeight.w${v.fontWeight},
    fontVariations: [FontVariation('wght', ${v.fontWeight})],
    fontFeatures: KaamosFont.features,
  );`;
    });

    return `${HEADER("//")}
import 'package:flutter/widgets.dart';

${dartClass("KaamosColors", "Palette del tema scuro Kaamos.", colors)}
${dartClass("KaamosRadius", "Raggi degli angoli, in pixel logici.", radius)}
${dartClass("KaamosSpacing", "Spaziature, in pixel logici.", spacing)}
${dartClass("KaamosFont", "Font del brand (Inter, incluso in questo pacchetto).", [
  "  /// Nome del pacchetto che contiene il font: serve a TextStyle(package: ...).",
  `  static const String package = '${DART_PACKAGE}';`,
  `  static const String family = '${fontFamily}';`,
  "",
  "  /// Feature OpenType sempre attive (ss03 = 'g' alternativa del brand).",
  `  static const List<FontFeature> features = [${features.map((f) => `FontFeature.enable('${f}')`).join(", ")}];`,
  "",
  ...weights,
])}
${dartClass(
  "KaamosTypography",
  "Stili di testo del design system.\n///\n/// Inter è un font variabile: su alcune piattaforme fontWeight da solo non\n/// muove l'asse \"wght\", quindi ogni stile imposta anche fontVariations.",
  styles,
)}
${dartClass("KaamosDuration", "Durate delle animazioni.", durations)}
${dartClass("KaamosEasing", "Curve delle animazioni.", easings)}`;
  },
};
