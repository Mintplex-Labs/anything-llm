---
title: "CLAIM MAP STANDARD"
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
source_path: "docs/brain/knowledge-packs/CLAIM_MAP_STANDARD.md"
---

> SPARKY Wiki seed-library adaptation note: this file is optional workspace reference knowledge. It supports source-backed reasoning and lawful reuse only; it is not required doctrine and cannot change app/runtime behavior.

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
