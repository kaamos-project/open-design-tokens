#!/usr/bin/env bash
# Crea il commit di release sul branch `release` e il tag vX.Y.Z.
#
# Idea: il commit di release = file di main + dist/ generato + versione nel
# package.json. Il suo genitore è la release precedente, quindi `release` è una
# fila di "fotografie", una per tag, senza merge.
#
# Uso (dopo npm run build, dalla radice della repo su main):
#   scripts/commit-release.sh 0.1.0
# Non fa push: lo fa la pipeline, così si può provare anche in locale.
set -euo pipefail

VERSION="$1"
TAG="v${VERSION}"
MAIN_SHA="$(git rev-parse HEAD)"

# Genitore: l'ultima release, se esiste già.
PARENT_ARGS=()
if git ls-remote --exit-code --heads origin release >/dev/null 2>&1; then
  git fetch --quiet origin release
  PARENT_ARGS=(-p "$(git rev-parse FETCH_HEAD)")
fi

# Partiamo dall'indice di main e aggiungiamo il generato.
# -f perché dist/ è in .gitignore (su main non deve mai finire per sbaglio).
git add -f dist
git add package.json

TREE="$(git write-tree)"
COMMIT="$(git commit-tree "$TREE" "${PARENT_ARGS[@]}" \
  -m "release: ${TAG}" \
  -m "Generato da main@${MAIN_SHA}")"

# Tag annotato: porta autore, data e messaggio. Mai spostato dopo il push.
git tag -a "$TAG" "$COMMIT" -m "Kaamos design tokens ${TAG}"

echo "commit=${COMMIT}"
