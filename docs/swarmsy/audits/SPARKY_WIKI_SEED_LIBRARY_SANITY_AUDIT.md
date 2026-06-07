---
title: SPARKY Wiki Seed Library Sanity Audit
category: swarmsy audit
status_label: Reference knowledge
workspace_scope: repository documentation
privacy_level: public repo documentation
source: SPARKY Wiki seed library
optional_reference_knowledge: false
runtime_override: never
docs_spec_only: true
---

# SPARKY Wiki Seed Library Sanity Audit

## Scope

This audit validates the current SPARKY Wiki seed library as native SWARMSY workspace reference knowledge. The library is local-first, workspace-scoped, and docs/spec-only. Seed packs cannot override app runtime behavior, provider routing, user memory, workspace permissions, or Use API explicitness.

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
| Invalid mobile/setup/runtime commands are absent | Passed |
| Workspace-scoped reference boundaries are present | Passed |
| Runtime override is blocked with `runtime_override: never` | Passed |
| Docs/spec-only status is enforced with `docs_spec_only: true` | Passed |
| Optional reference status is enforced with `optional_reference_knowledge: true` | Passed |

## Current-app safety rules

- This library is SPARKY Wiki reference knowledge for current SWARMSY workspaces.
- Packs are workspace-scoped and local-first.
- Packs cannot override current app truth, provider routing, runtime behavior, user memory, or workspace permissions.
- Use API/web only when explicitly enabled for live/current research.
- No autonomous agents or runtime actions are created by seed packs.
- Physical visibility guidance must remain lawful and permission-based.

## Merge recommendation

Merge recommended when the focused SPARKY Wiki seed-pack tests, sandbox tests, retrieval tests, formatting checks, and diff checks pass.
