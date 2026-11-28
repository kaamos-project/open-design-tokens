# Changelog

Tutte le modifiche rilevanti di questo progetto sono annotate qui.
Formato: [Keep a Changelog](https://keepachangelog.com/it/1.1.0/).
Versioni: [Semantic Versioning](https://semver.org/lang/it/).

Per fare una release: aggiungi qui una sezione `## [x.y.z] - AAAA-MM-GG`,
fai il merge su main, poi lancia il workflow **Release** con la stessa versione.

## [Unreleased]

## [0.2.0] - 2026-11-28

### Aggiunto

- Icone Lucide 1.83.0 (set completo, 2140 icone, licenza ISC) generate dal pacchetto npm `lucide-static`:
  - Flutter: font `KaamosIcons` e classe `KaamosIcons` (`package:kaamos_design_tokens/kaamos_icons.dart`) con una `IconData` const per icona;
  - web: `@kaamos-project/open-design-tokens/icons` (un export per icona), `icons/sprite.svg`, `icons/icons.json`.
- `npm test` con i test delle icone e controllo del tree-shaking delle icone in CI.
- `npm run icons:update` per aggiornare Lucide.

## [0.1.0] - 2026-11-24

### Aggiunto

- Token in formato W3C DTCG estratti da open-ui-web: colori, tipografia, font, raggi, spaziature, animazioni.
- Font Inter 4.1 variabile (woff2 per il web, ttf per Flutter) con licenza SIL OFL 1.1.
- Generazione con Style Dictionary di variabili CSS, tema Tailwind v4 e pacchetto Flutter.
- Workflow di CI e di release (branch `release`, tag, GitHub Release, npm).
