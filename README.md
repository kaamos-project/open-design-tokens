# open-design-tokens

Design tokens and shared assets of the **Kaamos** design system: a single source from which the web version (CSS, Tailwind v4) and the Flutter version are generated.

```
tokens/      token sources, W3C DTCG format, one file per category
assets/      shared assets: fonts/ (Inter 4.1, SIL OFL 1.1), icons/
config/      Style Dictionary build: build.mjs, formats/, templates/
scripts/     changelog.mjs (release notes), commit-release.sh
dist/        GENERATED, ignored on main: only exists on the `release` branch
```

## Quick start

```sh
npm ci
npm run build
```

Use it from the web:

```sh
npm install @kaamos-project/open-design-tokens
```

Or from Flutter, as a git dependency at a release tag with `path: dist/flutter`.

## Documentation

Everything lives in the wiki in [`docs/`](docs/README.md):

- [Getting started](docs/getting-started.md)
- [Token format](docs/token-format.md)
- [Build pipeline](docs/build-pipeline.md)
- [Using the tokens](docs/using-tokens.md)
- [Releases](docs/releases.md)
- [Decisions](docs/decisions.md)

## Licenses

- Code and tokens: GPL-3.0-only, see [LICENSE](LICENSE).
- Inter font: SIL Open Font License 1.1, see [assets/fonts/OFL.txt](assets/fonts/OFL.txt).
