---
title: "CLAIM MAP STANDARD"
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

# Claim Map Standard

Every subject pack must include `claim-map.md`.

Purpose: stop hallucinated wiki dumps by linking important claims to local source cards.

Each claim row should include:

| Claim ID | Claim | Confidence | Source card IDs | Local file(s) | Notes |
| -------- | ----- | ---------: | --------------- | ------------- | ----- |

Confidence scale:

- High: supported by primary source or multiple strong secondary sources.
- Medium: supported by one credible secondary source.
- Low: plausible but weakly sourced; do not present as hard fact.
- Disputed: multiple credible interpretations conflict.
- Needs live lookup: market/legal/current status can change.

Rules:

- No major claim without at least one source-card ID.
- No identity claims about anonymous people as fact unless confirmed by primary/legal record and pack owner approves inclusion.
- No current price, leadership, legal status, or live market claim without a freshness warning.
- Opinion analysis must be labelled as analysis, not fact.

## SPARKY Wiki safety boundary

Use this material for analysis, source governance, lawful adaptation, risk/ethics/consequence mapping, and disputed/needs-source labelling. Do not treat it as an instruction to run autonomous agents, browse the web, call APIs, change provider routing, override current app truth, or execute unlawful/deceptive activity.
