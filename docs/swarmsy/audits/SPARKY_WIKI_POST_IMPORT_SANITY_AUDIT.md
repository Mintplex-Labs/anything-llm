---
title: SPARKY Wiki Post-Import Sanity Audit
category: swarmsy audit
status_label: Reference knowledge
workspace_scope: repository documentation
privacy_level: public repo documentation
source: SPARKY Wiki seed library
optional_reference_knowledge: false
runtime_override: never
docs_spec_only: true
---

# SPARKY Wiki Post-Import Sanity Audit

## Scope

Focused sanity audit after the old SWARMSY wiki/reference import was completed and consolidated into the native SPARKY Wiki seed library.

This audit covers:

- seed-pack registry integrity
- registered seed-pack file presence and path containment
- frontmatter/metadata completeness for every registered markdown file
- JSON/source-card parsing and metadata invariants
- broken relative markdown links
- forbidden local paths and real secret material
- stale mobile/Expo/Electron/runtime commands presented as current
- retrieval gates and workspace isolation (covered by dedicated tests)

The seed library is docs/spec-only, workspace-scoped reference knowledge. It cannot override current app truth, provider routing, user memory, workspace permissions, or Use API explicitness.

## Totals

| Metric | Result |
| --- | ---: |
| Registered seed packs | 16 |
| Registered seed files | 299 |
| Registered markdown files | 282 |
| Registered JSON/source-card files | 17 |

## Validation results

| Check | Result |
| --- | --- |
| Registry entries resolve to current seed-library files | Passed |
| Required native frontmatter is complete | Passed |
| JSON/source-card files parse cleanly | Passed |
| Relative markdown links resolve | Passed |
| Local absolute Windows paths are absent | Passed |
| Private keys, API keys, and token material are absent | Passed |
| Direct `.env` file links are absent | Passed |
| Invalid mobile/setup/runtime commands are absent | Passed |
| Workspace-scoped reference boundaries are present | Passed |
| Runtime override is blocked with `runtime_override: never` | Passed |
| Docs/spec-only status is enforced with `docs_spec_only: true` | Passed |
| Optional reference status is enforced with `optional_reference_knowledge: true` | Passed |

## Notes on provenance

The seed library treats the imported historical SWARMSY material as read-only reference content and keeps it from presenting itself as current runtime truth. Seed-pack files carry native SPARKY Wiki frontmatter and are intentionally scrubbed of visible old-repo/old-path provenance strings to prevent accidental retrieval bias and to keep workspace reference knowledge clean.

Pack-level provenance is maintained by the local seed-pack registry (`sourcePath` + included files) rather than by exposing old repo/path metadata inside seed documents.

## Merge recommendation

Merge recommended when the focused SPARKY Wiki seed-pack tests, sandbox tests, retrieval tests, formatting checks, and diff checks pass.

