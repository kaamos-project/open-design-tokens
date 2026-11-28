[Home](README.md) › Using the tokens

# Using the tokens

## Web (npm)

```sh
npm install @kaamos-project/open-design-tokens
```

The package exports:

| Import | File |
|---|---|
| `@kaamos-project/open-design-tokens/tokens.css` | CSS variables |
| `@kaamos-project/open-design-tokens/fonts.css` | `@font-face` for Inter |
| `@kaamos-project/open-design-tokens/tailwind.css` | Tailwind v4 `@theme` |
| `@kaamos-project/open-design-tokens/fonts/*` | The `.woff2` files |
| `@kaamos-project/open-design-tokens/icons` | Lucide icons, one ES export per icon ([Icons](icons.md#web)) |
| `@kaamos-project/open-design-tokens/icons/sprite.svg` | All the icons as an SVG sprite |
| `@kaamos-project/open-design-tokens/icons/icons.json` | Icon names, codepoints and search tags |

With Tailwind v4:

```css
@import "tailwindcss";
@import "@kaamos-project/open-design-tokens/fonts.css";
@import "@kaamos-project/open-design-tokens/tailwind.css";
```

Without Tailwind:

```css
@import "@kaamos-project/open-design-tokens/fonts.css";
@import "@kaamos-project/open-design-tokens/tokens.css";

body { background: var(--color-canvas); color: var(--color-body); }
```

## Flutter (git, no pub.dev)

```yaml
dependencies:
  kaamos_design_tokens:
    git:
      url: https://github.com/kaamos-project/open-design-tokens
      ref: v0.1.0        # always a tag: it never moves
      path: dist/flutter
```

```dart
import 'package:kaamos_design_tokens/kaamos_design_tokens.dart';

Container(
  color: KaamosColors.surface,
  padding: const EdgeInsets.all(KaamosSpacing.base * 4),
  child: Text('Hello', style: KaamosTypography.bodyMd.copyWith(color: KaamosColors.body)),
);
```

`ref` must be a **tag**: `dist/flutter` only exists on the commits of the `release` branch, and tags are never moved. See [Releases](releases.md).

The Inter font (SIL OFL 1.1) is bundled in the package, and so are the Lucide icons (ISC):

```dart
import 'package:kaamos_design_tokens/kaamos_icons.dart';

const Icon(KaamosIcons.inbox);
```

See [Icons](icons.md#flutter), and read the tree-shaking rules before building an icon from a runtime value.

## Who uses them

- `open-ui-web` (web components) and `open-ui-flutter` (`kaamos_project_ui`) build their components on these tokens.
- Apps use the UI libraries, and the tokens directly only when they need a raw value.

## See also

- [Icons](icons.md)
- [Token format](token-format.md)
- [Releases](releases.md)
