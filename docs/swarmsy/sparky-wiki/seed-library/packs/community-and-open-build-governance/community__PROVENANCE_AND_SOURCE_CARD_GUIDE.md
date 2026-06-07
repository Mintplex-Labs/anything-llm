---
title: Provenance And Source Card Guide
category: community and open build governance
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

# Provenance and Source Card Guide

Use this guide when adding or updating source cards, claim maps, and citation indexes.

## Source-card JSON shape

Source cards live under `docs/wiki/subjects/<subject>/source-cards/<id>.json`. A source card must include:

- `id` — kebab-case unique identifier matching the filename
- `title` — human-readable title for the source
- `tier` — `"primary"` or `"secondary"` (see tiers below)
- `publisher` — publisher, author, or organisation name
- `url` — canonical URL or archive reference
- `used_for` — array of strings describing what claims this source supports
- `freshness_risk` — `"low"`, `"medium"`, or `"high"` (how likely the source content has changed)

Example:

```json
{
  "id": "example-source-2024",
  "title": "Example Source Title",
  "tier": "secondary",
  "publisher": "Example Publisher",
  "url": "https://example.com/article",
  "used_for": ["context for claim X", "background on event Y"],
  "freshness_risk": "medium"
}
```

## Source tiers

- **primary:** primary/public records, official communications, authenticated sources, legal filings
- **secondary:** reputable mainstream reporting, specialist analysis, public statements, academic references

Community can re-grade source strength over time as better evidence appears.

## Required linked updates

When important claims change:

- update citation-index entries
- update claim-map rows
- connect claims to source-card IDs
- mark unresolved claims as `disputed` or `needs-source`

## Perspective labeling rules

- If personal blog/social/community sources are used, use them only as supporting context and clearly label them as lower-confidence perspective evidence, keeping stronger primary or secondary sources linked when available.
- Mark founder thesis vs cited evidence vs myth/lore clearly.
- Avoid unsupported factual certainty.
- Do not include operational illegal guidance.
