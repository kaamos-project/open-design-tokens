# open-design-tokens

Design token e asset condivisi del design system **Kaamos**: un'unica sorgente
da cui si generano le versioni per il web (CSS, Tailwind v4) e per Flutter.

```
tokens/      sorgente dei token, formato W3C DTCG, un file per categoria
assets/      asset condivisi: fonts/ (Inter 4.1, SIL OFL 1.1), icons/
config/      build con Style Dictionary: build.mjs, formats/, templates/
scripts/     changelog.mjs (note di release), commit-release.sh
dist/        GENERATO, ignorato su main: esiste solo sul branch `release`
```

## Come funziona

1. Modifichi un token in `tokens/*.json` (formato [DTCG](https://www.designtokens.org/tr/drafts/format/)).
2. `npm run build` lancia [Style Dictionary](https://styledictionary.com), che legge i token,
   risolve gli alias (`{font.weight.medium}`) e scrive:

   | File | Per chi |
   | --- | --- |
   | `dist/css/tokens.css` | variabili CSS in `:root`, web senza Tailwind |
   | `dist/css/fonts.css` | `@font-face` di Inter |
   | `dist/tailwind/theme.css` | blocco `@theme` di Tailwind v4 (classi `bg-canvas`, `text-body-md`...) |
   | `dist/flutter/` | pacchetto Dart `kaamos_design_tokens` con il font Inter |

3. La CI rifà la build su ogni PR: un JSON rotto o un alias sbagliato la fanno fallire.

Nei token le misure sono in px (Flutter usa pixel logici). Nel CSS spaziature e dimensioni
del testo diventano `rem` (16px = 1rem), così seguono il font scelto dall'utente nel browser;
raggi e letter-spacing restano in px.

I nomi delle variabili CSS seguono i namespace di Tailwind (`--color-*`, `--radius-*`,
`--text-*`, `--font-*`, `--spacing`...), così CSS puro e Tailwind usano gli stessi nomi.

## Usarlo

### Web (npm)

```sh
npm install @kaamos-project/open-design-tokens
```

Con Tailwind v4:

```css
@import "tailwindcss";
@import "@kaamos-project/open-design-tokens/fonts.css";
@import "@kaamos-project/open-design-tokens/tailwind.css";
```

Senza Tailwind:

```css
@import "@kaamos-project/open-design-tokens/fonts.css";
@import "@kaamos-project/open-design-tokens/tokens.css";

body { background: var(--color-canvas); color: var(--color-body); }
```

### Flutter (git, niente pub.dev)

```yaml
dependencies:
  kaamos_design_tokens:
    git:
      url: https://github.com/kaamos-project/open-design-tokens
      ref: v0.1.0        # sempre un tag: è immutabile
      path: dist/flutter
```

```dart
import 'package:kaamos_design_tokens/kaamos_design_tokens.dart';

Container(
  color: KaamosColors.surface,
  padding: const EdgeInsets.all(KaamosSpacing.base * 4),
  child: Text('Ciao', style: KaamosTypography.bodyMd.copyWith(color: KaamosColors.body)),
);
```

Flutter non legge i `.woff2`: per questo `assets/fonts/` contiene Inter sia in `.woff2`
(web) sia in `.ttf` (Flutter).

## Fare una release

1. Su `main`, aggiungi a `CHANGELOG.md` una sezione `## [x.y.z] - AAAA-MM-GG`.
2. GitHub → **Actions** → **Release** → **Run workflow** (branch `main`) → scrivi `x.y.z`.

La pipeline:

1. controlla che la versione sia semver, che il tag `vx.y.z` non esista e che il changelog abbia la sezione;
2. genera `dist/` partendo da `main` e scrive la versione in `package.json`;
3. crea un commit sul branch `release` (file di main + `dist/`) il cui genitore è la release
   precedente, e mette il tag `vx.y.z` su quel commit;
4. crea la GitHub Release con le note del changelog;
5. pubblica `@kaamos-project/open-design-tokens` su npm (job separato, rilanciabile da solo).

`main` non contiene mai file generati; i tag non vengono mai spostati.
Una versione con suffisso (`0.2.0-beta.1`) diventa una pre-release e su npm va sul tag `next`.

### Prima release su npm

Serve una volta sola:

1. crea l'organizzazione `kaamos-project` su [npmjs.com](https://www.npmjs.com/org/create) (gratis per pacchetti pubblici);
2. crea un token *Granular Access* con permesso di scrittura sullo scope `@kaamos-project`;
3. salvalo nella repo come secret `NPM_TOKEN` (Settings → Secrets and variables → Actions).

Senza `NPM_TOKEN` la release crea comunque tag e GitHub Release, e salta solo npm con un avviso.

## Licenze

- Codice e token: GPL-3.0-only, vedi [LICENSE](LICENSE).
- Font Inter: SIL Open Font License 1.1, vedi [assets/fonts/OFL.txt](assets/fonts/OFL.txt).
