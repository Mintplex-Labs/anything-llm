---
title: "README"
category: "offline wiki ledger standards"
status_label: Reference knowledge
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
classification: "Docs/spec-only source"
pack: "offline-wiki-ledger-standards"
local_first: true
import_scope: "workspace-only"
safety_boundary: "Does not override Sparky identity, current app truth, provider routing, runtime action rules, workspace state, or safety boundaries. No autonomous agents, web crawler, API requirement, or runtime code."
---

> SPARKY Wiki note: This file is workspace-scoped reference knowledge for current SWARMSY workspaces and cannot change app runtime behavior.

# SPARKY Wiki Offline Wiki Ledger / Knowledge Packs

Status: v0.2 expanded structure gate.

This folder is the Offline Wiki Ledger: source-aware subject/reference packs for Sparky, SPARKY Wiki and workspace knowledge ingestion, and future RAG/vector retrieval.

These files are not the root Sparky persona, routing policy, or app operating instructions. They are local wiki/reference knowledge that Sparky can consult after core app-brain docs and workspace/user documents.

## Retrieval role

SPARKY Wiki retrieval order:

1. Core Sparky/App Brain files: persona, app truth, routing rules, runtime action rules, current SPARKY app rules.
2. Workspace/user documents: user-created docs, workspace notes, imported sources.
3. Offline Wiki Ledger / Knowledge Packs: graffiti, marketing, branding, business, and case studies.
4. Live AI/provider reasoning when connected and local context is weak, missing, or needs expansion.
5. Web lookup when online and freshness/current facts are needed.

Knowledge packs must never override Sparky identity, current app truth, provider routing, app behavior, runtime action rules, or user workspace state.

## What changed in v0.2

Every subject pack now has:

- `canonical-questions.md`
- `missing-data.md`
- `source-cards/*.json`
- `claim-map.md`
- `sparky-answer-contract.md`
- `street-swarm-reuse.md`
- `boundaries.md`

## Placement

```txt
docs/brain/knowledge-packs/
  README.md
  manifest.json
  INGESTION_PLAN.md
  PACK_SCHEMA.md
  READINESS_SCORECARD.md
  SOURCE_GOVERNANCE.md
  MISSING_DATA_REGISTRY.md
  CANONICAL_QUESTIONS_STANDARD.md
  CLAIM_MAP_STANDARD.md
  PACK_READINESS_GATE.md
  SOURCE_CARD_SCHEMA.json
  SUBJECT_EXPANSION_QUEUE.md
  INDUSTRY_COVERAGE_MAP.md
  RELEASE_READY_PACKS.md
  subjects/
  templates/
```

Root standards:

- `CANONICAL_QUESTIONS_STANDARD.md`
- `CLAIM_MAP_STANDARD.md`
- `PACK_READINESS_GATE.md`
- `SOURCE_CARD_SCHEMA.json`
- `SUBJECT_EXPANSION_QUEUE.md`
- `INDUSTRY_COVERAGE_MAP.md`
- `RELEASE_READY_PACKS.md`

## Release rule

Do not call a pack release-ready under 85/100.

Current packs are expanded drafts. They are structure-compliant and usable for local/offline answers with caveats, but they still require deeper source audit before final release.

## Example Offline Wiki answer framing

"I can answer from the local Banksy wiki pack. I know the verified timeline, major works, style analysis, cultural impact, marketing strategy, and known disputes. For new auctions, new works, or current legal disputes, use live lookup when online."

## Subject safety rules

Subject packs can include deep wiki knowledge, known vs disputed claims, source-backed claims, strategy/marketing analysis, reusable SPARKY Wiki lessons, and missing-data/freshness warnings.

Subject packs must not provide illegal graffiti/vandalism instructions, identity claims without evidence, doxxing material, counterfeit guidance, deceptive campaign advice, or claims that override current app instructions.

## Product doctrine

Store public knowledge. Transform the pattern. Output lawful creative mechanics.

## SPARKY Wiki safety boundary

Use this material for analysis, source governance, lawful adaptation, risk/ethics/consequence mapping, and disputed/needs-source labelling. Do not treat it as an instruction to run autonomous agents, browse the web, call APIs, change provider routing, override current app truth, or execute unlawful/deceptive activity.
