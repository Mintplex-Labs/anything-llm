---
title: "PACK READINESS GATE"
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
source_path: "docs/brain/knowledge-packs/PACK_READINESS_GATE.md"
---

> SPARKY Wiki seed-library adaptation note: this file is optional workspace reference knowledge. It supports source-backed reasoning and lawful reuse only; it is not required doctrine and cannot change app/runtime behavior.

# Pack Readiness Gate

A subject pack is not release-ready merely because it has files.

Subject packs are Offline Wiki Ledger/reference knowledge. Readiness gates answer whether Sparky can use a pack for local subject answers; they do not grant authority to override Sparky persona, app truth, provider routing, runtime action rules, or workspace/user documents.

## Required structure gate

A pack must contain:

- `pack.json`
- `readiness-score.md`
- `canonical-questions.md`
- `missing-data.md`
- `claim-map.md`
- `sparky-answer-contract.md`
- `street-swarm-reuse.md`
- `boundaries.md`
- `source-cards/` containing at least 5 valid JSON source cards for normal packs, 8+ for major packs

## Required content gate

A pack should include, where relevant:

- biography / origin
- timeline
- key works or campaign index
- why-it-worked analysis
- psychology and distribution mechanics
- failures/backlash
- modern application notes
- SPARKY Wiki lawful reuse
- safety and do-not-say boundaries

## Score gate

- 0–49: archive only / not usable
- 50–69: starter
- 70–84: usable draft
- 85–94: release-ready
- 95–100: premium/expert pack

Do not mark a pack release-ready below 85.

## Release-ready evidence

A release-ready pack must have:

- no unsupported high-impact claims
- 25+ canonical questions answered locally
- all live lookup triggers documented
- source cards for all important claims
- clear boundaries for unsafe or manipulative use
- source freshness reviewed within the past 6 months for volatile subjects

## SPARKY Wiki safety boundary

Use this material for analysis, source governance, lawful adaptation, risk/ethics/consequence mapping, and disputed/needs-source labelling. Do not treat it as an instruction to run autonomous agents, browse the web, call APIs, change provider routing, override current app truth, or execute unlawful/deceptive activity.
