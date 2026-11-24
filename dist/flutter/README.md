# kaamos_design_tokens

Pacchetto Flutter **generato** da [open-design-tokens](https://github.com/kaamos-project/open-design-tokens).
Non modificarlo a mano: cambia i token in `tokens/` sul branch `main` e fai una release.

```yaml
dependencies:
  kaamos_design_tokens:
    git:
      url: https://github.com/kaamos-project/open-design-tokens
      ref: v0.1.0        # un tag di release
      path: dist/flutter
```

```dart
import 'package:kaamos_design_tokens/kaamos_design_tokens.dart';

Text('Ciao', style: KaamosTypography.bodyMd.copyWith(color: KaamosColors.body));
```

Il font Inter (SIL OFL 1.1, vedi `fonts/OFL.txt`) è incluso nel pacchetto.
