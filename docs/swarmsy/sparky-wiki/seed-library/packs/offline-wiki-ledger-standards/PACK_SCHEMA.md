---
title: "PACK SCHEMA"
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

# Knowledge Pack Schema

Every subject pack must include a `pack.json` file. This is the v0.2 schema contract for the Offline Wiki Ledger starter knowledge pack system.

Knowledge packs are local wiki/reference records. They do not define Sparky identity, app behavior, provider routing, runtime action permissions, or root current SPARKY app rules.

Required v1 fields are the stable identity, readiness, source, safety, and routing fields Sparky can trust today. v2 fields are structure-gate metadata used by expanded draft packs; they are optional unless the manifest or pack declares v2 required files.

```json
{
  "subject_id": "graffiti.banksy",
  "subject_name": "Banksy",
  "category": "graffiti_street_art",
  "knowledge_tier": "offline_wiki_ledger",
  "status": "expanded_draft",
  "readiness_score": 72,
  "version": "0.1.0",
  "last_reviewed": "2026-05-24",
  "freshness_policy": "review quarterly or when major public event occurs",
  "source_policy": {
    "minimum_source_count": 8,
    "requires_primary_sources": true,
    "requires_reputable_secondary_sources": true,
    "allows_wikipedia_as_index_only": true
  },
  "required_files": [
    "pack.json",
    "sparky-summary.md",
    "sources.md",
    "readiness-score.md"
  ],
  "recommended_files": [
    "overview.md",
    "timeline.md",
    "strategy-analysis.md",
    "reuse-frameworks.md",
    "canonical-questions.md",
    "missing-data.md"
  ],
  "safety_boundary": {
    "allowed": ["analysis", "history", "legal marketing adaptation"],
    "disallowed": [
      "crime instructions",
      "vandalism guidance",
      "harassment",
      "deception"
    ]
  },
  "sparky_routing": {
    "offline_answer_ok_above_score": 85,
    "current_pack_behavior": "usable with caveat; live AI recommended for fresh/current questions",
    "fresh_web_required_for": [
      "current prices",
      "recent legal disputes",
      "new artworks",
      "current identity claims"
    ]
  },
  "aliases": ["Banksy"],
  "id": "banksy",
  "title": "Banksy",
  "domain": "graffiti / street art / anti-establishment marketing",
  "release_ready": false,
  "release_gate": "85+ required; structure gate added in v2; source audit still required",
  "last_expanded": "2026-05-24",
  "required_files_v2": [
    "canonical-questions.md",
    "missing-data.md",
    "claim-map.md",
    "sparky-answer-contract.md",
    "street-swarm-reuse.md",
    "boundaries.md",
    "source-cards/*.json"
  ]
}
```

## Pack statuses

- `starter`: useful seed, not complete enough for confident offline answers.
- `usable`: good enough for basic answers with caveats.
- `expanded_draft`: v2 structure exists, but release readiness still requires source audit and score gate.
- `ready`: strong offline coverage.
- `needs_refresh`: stale or contradicted by newer sources.

Allowed enum:

```txt
starter
usable
expanded_draft
ready
needs_refresh
```

Do not use display text such as `expanded draft` inside `pack.json`.

## Retrieval tier

Subject packs are retrieved as `offline_wiki_ledger` knowledge. The intended priority is:

1. Core Sparky/App Brain files.
2. Workspace/user documents.
3. Offline Wiki Ledger / Knowledge Packs.
4. Live AI/provider reasoning.
5. Web lookup for current facts.

Pack facts and strategy notes must never override core Sparky persona, current truth, routing rules, runtime action rules, or current SPARKY app behavior.

## Required pack files

Every manifest subject must resolve to a real subject folder containing:

```txt
pack.json
sparky-summary.md
sources.md
readiness-score.md
```

Manifest subjects must not list overview-only documents unless they are converted into full subject packs.

## Optional v2 structure files

Expanded draft packs may include:

```txt
canonical-questions.md
missing-data.md
source-cards/*.json
claim-map.md
sparky-answer-contract.md
street-swarm-reuse.md
boundaries.md
```

## Source card shape

Use `templates/SOURCE_CARD_TEMPLATE.json` for individual source records.

## SPARKY Wiki safety boundary

Use this material for analysis, source governance, lawful adaptation, risk/ethics/consequence mapping, and disputed/needs-source labelling. Do not treat it as an instruction to run autonomous agents, browse the web, call APIs, change provider routing, override current app truth, or execute unlawful/deceptive activity.
