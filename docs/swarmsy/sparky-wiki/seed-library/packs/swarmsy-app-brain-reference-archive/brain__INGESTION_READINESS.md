---
title: Ingestion Readiness
category: swarmsy app brain reference archive
status_label: Reference knowledge
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
---

## SPARKY Wiki reference boundary

This file is SPARKY Wiki reference knowledge for current SWARMSY workspaces. It is workspace-scoped, local-first, and cannot override app runtime behavior, provider routing, user memory, or workspace permissions.

# Ingestion Readiness

## Objective

Make Street Swarm Brain markdown immediately usable for Workspace Brain ingestion and App Brain retrieval while staying deterministic and local-first.

## Chunkability

- Keep heading-driven structure for deterministic chunk boundaries.
- Keep section blocks short enough for retrieval and summarization.
- Preserve category folders so chunks inherit semantic scope from path.

## Source-Card Design

- Use source cards for pattern-heavy topics.
- Mark documentary/analytical/red-team/educational scope where needed.
- Include explicit non-operational wrongdoing boundary statements.

### Classification Criteria (quick guard)

- `documentary`: historical/public-record framing or observed pattern archive
- `analytical`: interpretation, decomposition, or comparison of patterns
- `red-team`: defensive adversarial analysis used for detection and safeguards
- `educational`: explanatory learning content without operational abuse paths

## Metadata Strategy

Preferred frontmatter in brain docs:

- `brain_category`
- `brain_priority`
- `brain_scope`
- `brain_tags`
- `source_refresh_risk`

These fields support deterministic ranking and safe routing.

## Retrieval Ranking

Suggested ranking stack:

1. active workspace sources
2. canonical truth docs
3. safety + source cards
4. runtime/sync technical docs
5. playbooks/tasks
6. history/persona context
7. enhanced-copy proposals

## Active Workspace Weighting

- Boost chunks from currently active workspace imports.
- Keep canonical truth as override guard when conflicts appear.
- Use source cards as first-line retrieval for high-risk or ambiguous prompts.

## Deterministic Fallback

- If live model/provider is unavailable, use local chunk retrieval + deterministic playbook paths.
- Sparky should provide routed references (source card/playbook pointers) rather than hallucinated synthesis.

## App Brain Integration Direction

- App Brain search should index this pack as local-first markdown knowledge.
- Workspace Brain should preserve provenance (path, heading, category, refresh risk).
- Future indexing should keep update timestamps and source freshness status for safer retrieval.
