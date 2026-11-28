# kaamos_design_tokens

Flutter package **generated** by [open-design-tokens](https://github.com/kaamos-project/open-design-tokens).
Don't edit it by hand: change the tokens in `tokens/` on the `main` branch and make a release.

```yaml
dependencies:
  kaamos_design_tokens:
    git:
      url: https://github.com/kaamos-project/open-design-tokens
      ref: v0.1.0        # a release tag
      path: dist/flutter
```

```dart
import 'package:kaamos_design_tokens/kaamos_design_tokens.dart';

Text('Hello', style: KaamosTypography.bodyMd.copyWith(color: KaamosColors.body));
```

```dart
import 'package:kaamos_design_tokens/kaamos_icons.dart';

const Icon(KaamosIcons.mail);
```

Included in the package:

- the Inter font (SIL OFL 1.1, see `fonts/OFL.txt`);
- the [Lucide](https://lucide.dev) icons as the `KaamosIcons` font (ISC License, see `fonts/LUCIDE-LICENSE.txt`). Use them only as `const`: release builds keep just the icons you use.
