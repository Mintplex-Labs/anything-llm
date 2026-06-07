---
title: "AUTHORITY AND PROVENANCE LAYER"
category: "wiki depth and provenance"
classification: "Docs/spec-only source"
pack: "wiki-depth-and-provenance"
optional_reference_knowledge: true
docs_spec_only: true
local_first: true
import_scope: "workspace-only"
runtime_override: "never"
safety_boundary: "Does not override Sparky identity, current app truth, provider routing, runtime action rules, workspace state, or safety boundaries. No autonomous agents, web crawler, API requirement, or old runtime code."
source_repo: "HODLKONG64/SWARMSY"
source_path: "docs/AUTHORITY_AND_PROVENANCE_LAYER.md"
---

> SPARKY Wiki seed-library adaptation note: this file is optional workspace reference knowledge. It supports source-backed reasoning and lawful reuse only; it is not required doctrine and cannot change app/runtime behavior.

# Authority And Provenance Layer

Status: PR154 doctrine foundation. This document defines labels and source boundaries for SPARKY Wiki wiki answers. It does not add provider calls, web lookup, backend, rewards, Telegram sync, website changes, Open Runtime, source editing, or new UI.

## Purpose

SPARKY Wiki's wiki must not become lore, fan-fiction, vague AI sludge, or fake certainty. It can contain deep immersive writing, theory, interpretation, founder/operator perspective, community memory, myth, counter-narrative, and speculation, but the provenance layer must label what kind of knowledge is being used.

Sparky should be able to say:

- "This is founder thesis, not external citation."
- "This claim is source-backed in the local citation index."
- "The local archive marks this as myth/lore, not verified evidence."
- "The local archive marks this as disputed or needs source."
- "This is protocol inference from observable mechanics."

## Provenance Labels

- `Verified`: strong public evidence in source cards or citation index.
- `Cited claim`: a claim linked to one or more source-card IDs.
- `Observed`: visible public artifact or record, but not necessarily a complete explanation.
- `Inferred`: a reasoned pattern drawn from evidence, not a proved fact.
- `Disputed`: contested by sources, community, or counter-records.
- `Needs source`: important claim placeholder that must not be presented as fact.
- `Speculation`: possible but unverified theory.
- `Myth / lore`: cultural story, community legend, or brand mythology.
- `Counter-narrative`: competing explanation or critique.
- `Public narrative`: the version commonly repeated in media/community.
- `Founder thesis`: authored operator perspective or proposed interpretation.
- `Protocol inference`: reusable mechanic inferred by Cultural Protocol Engine.

## Founder Thesis Rules

Founder/operator perspectives can exist as authored thesis pages. They are allowed because SPARKY Wiki is also a creator-led archive. They must be labelled as authored perspective and must not be presented as verified public evidence unless supported by source-card IDs.

Founder thesis pages may:

- propose interpretation
- connect personal memory to public records
- explain why a branch matters
- identify planned research paths
- mark claims as needs-source
- invite community challenge

Founder thesis pages must not:

- fabricate criminal, legal, commercial, or public-record facts
- present unsupported claims as verified
- claim official authority without evidence
- override Sparky app truth
- override citation indexes or claim maps

## Claim And Citation Rules

High-impact factual claims require source-card IDs or explicit `needs-source` / `disputed` labels.

High-impact claims include:

- dates
- names
- places
- artworks
- exhibitions
- auctions
- prices
- public statements
- collaborations
- lawsuits/legal events
- brand involvement
- council/public authority involvement
- documented removals/destructions
- confirmed artist/brand references
- image reuse or motif reuse
- claims about who did what with whom
- claims about direct influence between people, brands, or works
- claims affecting legal, ethical, or market interpretation

## Sparky Answer Rule

When Sparky answers from wiki/protocol material, it should identify the knowledge source tier:

1. Sparky core app truth
2. workspace/user document
3. cited public evidence
4. founder thesis
5. protocol inference
6. myth/lore
7. disputed or needs-source claim

Sparky must not let founder thesis, subject packs, myth/lore, or protocol inference override Sparky persona, current app truth, provider routing, runtime action rules, workspace state, or safety boundaries.

## SPARKY Wiki safety boundary

Use this material for analysis, source governance, lawful adaptation, risk/ethics/consequence mapping, and disputed/needs-source labelling. Do not treat it as an instruction to run autonomous agents, browse the web, call APIs, change provider routing, override current app truth, or execute unlawful/deceptive activity.
