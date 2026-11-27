[Home](README.md) › Token format

# Token format

Tokens follow the [W3C Design Tokens Community Group (DTCG) format](https://www.designtokens.org/tr/drafts/format/): JSON where every token has a `$value`, and a `$type` either on the token or inherited from its group. `$description` documents it.

```json
{
  "radius": {
    "$type": "dimension",
    "sm": { "$value": "6px" }
  }
}
```

## Categories

One file per category in `tokens/`:

| File | Group | Content | CSS name | Dart class |
|---|---|---|---|---|
| `color.json` | `color` | The dark Kaamos palette (`primary`, `ink`, `body`, `mute`, `canvas`, `surface`…) | `--color-*` | `KaamosColors` |
| `typography.json` | `typography` | Composite styles: `display-*`, `heading-*`, `body-*` (size, line height, letter spacing, weight) | `--text-*` | `KaamosTypography` |
| `font.json` | `font` | Family (`sans`), weights, OpenType features | `--font-*` | `KaamosFont` |
| `spacing.json` | `spacing` | `base` unit and `section` | `--spacing`, `--spacing-*` | `KaamosSpacing` |
| `radius.json` | `radius` | `none`, `xs` … `xl`, `full` | `--radius-*` | `KaamosRadius` |
| `motion.json` | `motion` | Durations and easing curves | `--duration-*`, `--ease-*` | `KaamosDuration`, `KaamosEasing` |

The CSS names follow **Tailwind v4 namespaces**, so plain CSS and Tailwind use the same names.

## Aliases

A token can point to another one with `{group.path}`, for example `"fontWeight": "{font.weight.medium}"`. Style Dictionary resolves aliases at build time. An alias to a token that doesn't exist **fails the build**.

## Units

- Dimensions are written in **px** in the sources, because Flutter works in logical pixels.
- In CSS, **spacing and text sizes become `rem`** (16px = 1rem), so they follow the font size the user picked in the browser.
- **Radii and letter spacing stay in px**: a corner shouldn't grow with the text, and tenths of a pixel of letter spacing make no visible difference.

## The custom `fontFeatures` kind

DTCG has no type for OpenType feature lists. `font.features.sans` (`calt`, `kern`, `liga`, `ss03`, where `ss03` is the alternate "g", the brand's typographic signature) is marked with an extension:

```json
"$extensions": { "dev.kaamos": { "kind": "fontFeatures" } }
```

The formats recognise it with `isFontFeatures()` and write it by hand. In Tailwind it becomes `--font-sans--font-feature-settings`, applied together with the `font-sans` class.

## Adding a category

The formats throw on unknown groups, on purpose: a new category needs a decision on how it maps to CSS and Dart. Add a case to `cssVariables()` in `config/formats/shared.mjs` and to `config/formats/dart.mjs`. See [Build pipeline](build-pipeline.md).

## See also

- [Build pipeline](build-pipeline.md)
- [Using the tokens](using-tokens.md)
