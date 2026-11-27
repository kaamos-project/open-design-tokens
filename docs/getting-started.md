[Home](README.md) › Getting started

# Getting started

## Requirements

- Node.js 22 (CI uses 22 for the build, 24 for publishing).
- Optional: Flutter, to run `flutter analyze` on the generated Dart package like CI does.

## Build

```sh
npm ci
npm run build
```

`npm run build` runs `config/build.mjs` and writes everything to `dist/`. `dist/` is in `.gitignore`: it never goes on `main`, it only exists on the `release` branch (see [Releases](releases.md)).

## Repo layout

```
tokens/      token sources, W3C DTCG format, one file per category
assets/      shared assets: fonts/ (Inter 4.1, SIL OFL 1.1), icons/ (empty for now)
config/      Style Dictionary build: build.mjs, formats/, templates/
scripts/     changelog.mjs (release notes), commit-release.sh
dist/        GENERATED, ignored on main
docs/        this wiki
```

## Checks (the same as CI)

`.github/workflows/ci.yml` runs on every pull request to `main` and every push to `main`:

```sh
npm ci
npm run build                      # fails on broken JSON, unknown aliases or duplicate names
npm pack --dry-run                 # shows what would go into the npm package
node scripts/changelog.mjs --check # CHANGELOG.md has the right format
cd dist/flutter && flutter pub get && flutter analyze --fatal-infos
```

The goal is **fail fast**: `main` must always be ready for a release.

## Changing a token

1. Edit the right file in `tokens/` (see [Token format](token-format.md)).
2. `npm run build` and look at the diff in `dist/`.
3. Add a line under `## [Unreleased]` in `CHANGELOG.md`.
4. Open a pull request.

Token names are shared with `open-ui-web`'s `docs/DESIGN.md`: keep them in sync.

## See also

- [Build pipeline](build-pipeline.md)
- [Releases](releases.md)
