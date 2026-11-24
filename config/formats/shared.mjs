/*
 * Funzioni condivise dai formati.
 * Style Dictionary ci consegna i token già letti, validati e con gli alias
 * ({font.weight.medium}) risolti: qui decidiamo solo COME scriverli.
 */

/** Famiglie generiche CSS: vanno scritte senza virgolette. */
const GENERIC_FAMILIES = new Set([
  "serif", "sans-serif", "monospace", "cursive", "fantasy",
  "system-ui", "ui-sans-serif", "ui-serif", "ui-monospace", "emoji", "math",
]);

/** ["Inter", "system-ui"] -> "Inter", system-ui */
export function cssFontFamily(families) {
  return families
    .map((f) => (GENERIC_FAMILIES.has(f) ? f : `"${f}"`))
    .join(", ");
}

/** ["calt", "ss03"] -> "calt", "ss03" */
export function cssFontFeatures(features) {
  return features.map((f) => `"${f}"`).join(", ");
}

/** [0, 0, 0.58, 1] -> cubic-bezier(0, 0, 0.58, 1) */
export function cssCubicBezier([x1, y1, x2, y2]) {
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}

/** Un token è una lista di feature OpenType? (tipo non standard, vedi tokens/font.json) */
export function isFontFeatures(token) {
  return token.$extensions?.["dev.kaamos"]?.kind === "fontFeatures";
}

/**
 * Trasforma i token in coppie [nome variabile CSS, valore].
 * I nomi seguono i namespace di Tailwind v4 (--color-*, --radius-*, --text-*...),
 * così lo stesso elenco serve sia al CSS puro sia al blocco @theme.
 */
export function cssVariables(tokens) {
  const vars = [];
  for (const token of tokens) {
    const [group, ...rest] = token.path;
    const key = rest.join("-");
    const v = token.$value;

    switch (group) {
      case "color":
        vars.push([`--color-${key}`, v]);
        break;
      case "radius":
        vars.push([`--radius-${key}`, v]);
        break;
      case "spacing":
        // spacing.base è l'unità di Tailwind: --spacing (p-1 = 1 × --spacing).
        vars.push([key === "base" ? "--spacing" : `--spacing-${key}`, v]);
        break;
      case "font": {
        const [kind, name] = rest;
        if (kind === "family") vars.push([`--font-${name}`, cssFontFamily(v)]);
        else if (kind === "weight") vars.push([`--font-weight-${name}`, String(v)]);
        else if (kind === "features" && isFontFeatures(token))
          // Sotto-chiave di Tailwind: applicata insieme alla classe font-sans.
          vars.push([`--font-${name}--font-feature-settings`, cssFontFeatures(v)]);
        else throw new Error(`Token font non gestito: ${token.path.join(".")}`);
        break;
      }
      case "typography":
        // In Tailwind v4 --text-* può portarsi dietro line-height, letter-spacing
        // e font-weight: la classe text-body-md applica tutto insieme.
        vars.push([`--text-${key}`, v.fontSize]);
        vars.push([`--text-${key}--line-height`, String(v.lineHeight)]);
        vars.push([`--text-${key}--letter-spacing`, v.letterSpacing]);
        vars.push([`--text-${key}--font-weight`, String(v.fontWeight)]);
        break;
      case "motion": {
        const [kind, name] = rest;
        if (kind === "duration") vars.push([`--duration-${name}`, v]);
        else if (kind === "easing") vars.push([`--ease-${name}`, cssCubicBezier(v)]);
        else throw new Error(`Token motion non gestito: ${token.path.join(".")}`);
        break;
      }
      default:
        throw new Error(`Gruppo di token sconosciuto: ${group}`);
    }
  }
  return vars;
}

export const HEADER = (comment) =>
  `${comment} GENERATO da open-design-tokens: non modificare a mano.\n${comment} Sorgente: tokens/*.json (formato W3C DTCG).\n`;
