---
title: "INGESTION PLAN"
category: "offline wiki ledger standards"
classification: "Docs/spec-only source"
pack: "offline-wiki-ledger-standards"
optional_reference_knowledge: true
docs_spec_only: true
local_first: true
import_scope: "workspace-only"
runtime_override: "never"
safety_boundary: "Does not override Sparky identity, current app truth, provider routing, runtime action rules, workspace state, or safety boundaries. No autonomous agents, web crawler, API requirement, or old runtime code."
source_repo: "HODLKONG64/SWARMSY"
source_path: "docs/brain/knowledge-packs/INGESTION_PLAN.md"
---

> SPARKY Wiki seed-library adaptation note: this file is optional workspace reference knowledge. It supports source-backed reasoning and lawful reuse only; it is not required doctrine and cannot change app/runtime behavior.

# Offline Wiki Ledger Knowledge Pack Ingestion Plan

This is the staged route from markdown packs to live app usage.

Knowledge packs are the Offline Wiki Ledger/reference tier. They are not root Sparky persona files and must not override app truth, provider routing, runtime action rules, current SPARKY app rules, or user workspace state.

## Phase 1 - Docs only

Add structured wiki/reference packs under `docs/brain/knowledge-packs/`. Run the audit script or guard tests to validate required files.

Retrieval priority must remain:

1. Core Sparky/App Brain docs.
2. Workspace/user documents.
3. Offline Wiki Ledger / Knowledge Packs.
4. Live AI/provider reasoning.
5. Web lookup for freshness/current facts.

## Phase 2 - Local wiki import

Create an importer that reads pack markdown and JSON, chunks content, redacts secrets, and indexes into the local wiki/reference layer used by App Brain / Workspace Brain retrieval.

Suggested index fields:

```ts
type KnowledgePackChunk = {
  id: string;
  subjectId: string;
  subjectName: string;
  category: string;
  knowledgeTier: "offline_wiki_ledger";
  filePath: string;
  title: string;
  body: string;
  tags: string[];
  sourceTier?: string;
  readinessScore: number;
  safetyBoundary: string[];
  updatedAt: string;
};
```

## Phase 3 - Sparky routing

Sparky should check core app docs and workspace context before wiki packs. When a subject pack is relevant, Sparky should check pack score before answering:

```txt
score >= 85 and not freshness-sensitive -> answer from offline wiki pack
score 70-84 -> answer with caveat and offer live expansion
score <70 -> say local wiki data is limited, use live AI if available
freshness-sensitive -> require live lookup
```

Example answer frame:

```txt
I can answer from the local Banksy wiki pack. I know the verified timeline, major works, style analysis, cultural impact, marketing strategy, and known disputes. For new auctions, new works, or current legal disputes, use live lookup when online.
```

## Phase 4 - Wiki/Browse UI

Expose packs as Browse/Wiki cards:

- subject name
- category
- readiness score
- source count
- last reviewed
- missing data count
- Ask Sparky button
- Needs refresh warning

## Phase 5 - Canonical question tests

Add test fixtures for each pack with expected local answer coverage.

## SPARKY Wiki safety boundary

Use this material for analysis, source governance, lawful adaptation, risk/ethics/consequence mapping, and disputed/needs-source labelling. Do not treat it as an instruction to run autonomous agents, browse the web, call APIs, change provider routing, override current app truth, or execute unlawful/deceptive activity.
