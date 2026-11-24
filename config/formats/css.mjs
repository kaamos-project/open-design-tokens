import { cssVariables, HEADER } from "./shared.mjs";

/** Variabili CSS pure in :root, per chi NON usa Tailwind. */
export const cssVariablesFormat = {
  name: "kaamos/css-variables",
  format: ({ dictionary }) => {
    const lines = cssVariables(dictionary.allTokens).map(([n, v]) => `  ${n}: ${v};`);
    return `/*\n${HEADER(" *")} */\n:root {\n${lines.join("\n")}\n}\n`;
  },
};

/** Blocco @theme di Tailwind v4: genera sia le classi (bg-canvas) sia le variabili. */
export const tailwindThemeFormat = {
  name: "kaamos/tailwind-theme",
  format: ({ dictionary }) => {
    const lines = cssVariables(dictionary.allTokens).map(([n, v]) => `  ${n}: ${v};`);
    return `/*\n${HEADER(" *")} */\n@theme {
  /* Togliamo palette e raggi di default di Tailwind:
     in un design system si usano solo i token ufficiali. */
  --color-*: initial;
  --radius-*: initial;

${lines.join("\n")}
}\n`;
  },
};
