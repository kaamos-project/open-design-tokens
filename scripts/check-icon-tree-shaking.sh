#!/usr/bin/env bash
# Builds a tiny Flutter web app that uses 3 icons and checks that the release
# build tree-shakes KaamosIcons.ttf down to a few KB.
#
# It proves two things the unit tests can't: the generated package works in a
# real app, and Flutter's font subsetter (HarfBuzz) accepts our font.
#
# Usage: scripts/check-icon-tree-shaking.sh   (after `npm run build`, needs flutter)
set -euo pipefail

MAX_BYTES=20000
pkg="$(cd "$(dirname "$0")/.." && pwd)/dist/flutter"
app="$(mktemp -d)/icons_check"

flutter create --platforms web --empty --project-name icons_check "$app" > /dev/null
cd "$app"
flutter pub add kaamos_design_tokens --path "$pkg" > /dev/null
cat > lib/main.dart <<'DART'
import 'package:flutter/widgets.dart';
import 'package:kaamos_design_tokens/kaamos_icons.dart';

void main() => runApp(
      const Directionality(
        textDirection: TextDirection.ltr,
        child: Row(children: [
          Icon(KaamosIcons.mail),
          Icon(KaamosIcons.search),
          Icon(KaamosIcons.package_),
        ]),
      ),
    );
DART

log="$(flutter build web --release --no-web-resources-cdn 2>&1)" || { echo "$log"; exit 1; }
line="$(grep 'KaamosIcons.ttf" was tree-shaken' <<< "$log" || true)"
if [[ -z "$line" ]]; then
  echo "$log"
  echo "::error::KaamosIcons.ttf was not tree-shaken"
  exit 1
fi
echo "$line"
after="$(sed -E 's/.* to ([0-9]+) bytes.*/\1/' <<< "$line")"
if (( after > MAX_BYTES )); then
  echo "::error::KaamosIcons.ttf is still $after bytes after tree-shaking (limit $MAX_BYTES)"
  exit 1
fi
