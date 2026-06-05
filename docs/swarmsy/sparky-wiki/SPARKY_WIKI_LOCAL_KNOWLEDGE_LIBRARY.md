# SPARKY Wiki Local Knowledge Library

## Purpose

SPARKY Wiki is the future local-first knowledge vault for SWARMSY. It is the searchable reference layer that stores useful project knowledge, old SWARMSY salvage notes, proof material, campaign planning, artwork direction, local AI setup notes, and user-added reference material.

SPARKY Wiki is larger than required doctrine. It is not a replacement for system rules, required prompts, Current Truth labels, or behaviour constraints. It gives Sparky more context when answering, creating, proving, reviewing, or planning.

> SPARKY Wiki is where Sparky remembers the world. Required doctrine is how Sparky behaves.

## Product model

### Required Doctrine

Required doctrine should stay small, always-loaded, and behaviour-focused. It defines the minimum rules Sparky must follow even when no workspace knowledge has been added.

Examples of required doctrine include:

- SPARKY persona and operator stance.
- Output beats and instruction-following rules.
- Current Truth and status-label discipline.
- No fake provider output or false runtime claims.
- Core SWARMSY HIVE behaviour.

Required doctrine is the behavioural spine. It should not absorb every useful project note, old document, draft plan, or reference file.

### SPARKY Wiki

SPARKY Wiki should become the larger local and searchable knowledge base. It can include information that is useful to retrieve but too large, too situational, too private, or too changeable to force into always-loaded doctrine.

Examples of SPARKY Wiki knowledge include:

- Old SWARMSY legacy-salvage docs.
- Command-centre ideas and future HIVE plans.
- Doctor, sandbox, and repair notes.
- Local user notes and project references.
- Project lore and world-bible material.
- Proof notes, receipts, source maps, and evidence boundaries.
- Campaign plans, launches, and media beats.
- Artwork prompts, visual rules, and image-direction notes.
- Generated image metadata and asset provenance.
- API/provider setup notes for local and hosted use.
- User-added docs that belong to a specific workspace.

## Old SWARMSY wiki continuity

The old SWARMSY repo used a wiki-style knowledge model. In DIZ-A-REMIX, that idea should live on as useful local data inside SPARKY Wiki, not as old runtime code copied into the new AnythingLLM-based build.

The intended salvage pattern is:

1. Preserve old wiki and doctrine ideas as source-mapped reference knowledge.
2. Classify the material by category, source, status, workspace scope, and privacy level.
3. Retrieve the material only when it is relevant to the user's current task.
4. Keep current required doctrine small and behaviour-focused.
5. Let users add their own local notes into the same knowledge layer later.

## Non-goals for this spec

This document does not define a full wiki UI, runtime ingestion route, package dependency, Docker change, or deployment change. It defines the knowledge-library model that future implementation PRs can wire in safely.

SPARKY Wiki must not make the entire `docs/swarmsy/legacy-salvage/` folder required doctrine. Legacy salvage is optional reference knowledge unless a later Current Truth decision promotes a specific small rule into required doctrine.
