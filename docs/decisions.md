[Home](README.md) › Decisions

# Decisions

Lightweight ADRs: when a decision changes, update its entry and say why.

## One central token repo

**Decision**: tokens live here, not inside each UI library.
**Why**: web and Flutter must look identical; one source means one place to change a colour.
**Trade-off**: a change needs a release here and a dependency bump in the libraries.

## W3C DTCG format

**Decision**: tokens in DTCG JSON.
**Why**: an open, tool-independent standard (Style Dictionary, Figma plugins and others read it).
**Trade-off**: it has no type for OpenType features, so we use a `dev.kaamos` extension. See [Token format](token-format.md#the-custom-fontfeatures-kind).

## Style Dictionary with custom formats

**Decision**: Style Dictionary reads and validates; our own formats write CSS, Tailwind and Dart.
**Why**: Style Dictionary handles parsing, aliases and validation; custom formats give exact control over names (Tailwind namespaces) and over the Dart API.
**Trade-off**: the formats are our code to maintain. See [Build pipeline](build-pipeline.md).

## px in the sources, rem in CSS

**Decision**: sources in px; spacing and text in rem for CSS; radii and letter spacing in px.
**Why**: Flutter uses logical pixels; on the web, rem respects the user's font size setting.

## Generated files only on the `release` branch

**Decision**: `dist/` is never committed on `main`; each release is a snapshot commit on `release`, tagged `vX.Y.Z`.
**Why**: no noisy diffs and no merge conflicts on generated files; Flutter can still use a git dependency (`path: dist/flutter`) pinned to an immutable tag.
**Trade-off**: you can't point a git dependency at `main`; you need a release. See [Releases](releases.md).

## Manual releases

**Decision**: `workflow_dispatch` with the version as input, notes from `CHANGELOG.md`.
**Why**: a release is a conscious decision, and the changelog is written by a person.

## npm Trusted Publishing, no token

**Decision**: OIDC publishing with provenance.
**Why**: no long-lived secret to leak; anyone can verify which commit built the package.
**Trade-off**: the first publish is manual. See [Releases](releases.md#npm-trusted-publishing).

## Flutter: git dependency, no pub.dev (for now)

**Decision**: the Dart package is consumed from git at a tag.
**Why**: no pub.dev account and publishing process to maintain while the design system is young.

## Licenses

- Code and tokens: GPL-3.0-only.
- Inter: SIL Open Font License 1.1.

## See also

- [Home](README.md)
