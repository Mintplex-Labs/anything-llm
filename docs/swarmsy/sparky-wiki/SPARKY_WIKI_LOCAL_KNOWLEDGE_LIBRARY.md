# SPARKY Wiki Local Knowledge Library

## Purpose

SPARKY Wiki is the future local-first knowledge vault for SWARMSY. It is the searchable reference layer that stores useful project knowledge, proof material, campaign planning, artwork direction, local AI setup notes, and user-added reference material.

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

Required doctrine is the behavioural spine. It should not absorb every useful project note, draft plan, or reference file.

### SPARKY Wiki

SPARKY Wiki should become the larger local and searchable knowledge base. It can include information that is useful to retrieve but too large, too situational, too private, or too changeable to force into always-loaded doctrine.

Examples of SPARKY Wiki knowledge include:

- SPARKY Wiki seed-library docs.
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

## SPARKY Wiki seed-library continuity

SPARKY Wiki stores useful local data inside the current DIZ-A-REMIX / SWARMSY app without changing runtime code or required doctrine.

The intended seed-library pattern is:

1. Maintain wiki and doctrine ideas as workspace-scoped reference knowledge.
2. Classify the material by category, source, status, workspace scope, and privacy level.
3. Retrieve the material only when it is relevant to the user's current task.
4. Keep current required doctrine small and behaviour-focused.
5. Let users add their own local notes into the same knowledge layer later.

## Non-goals for this spec

This document does not define a full wiki UI, runtime ingestion route, package dependency, Docker change, or deployment change. It defines the knowledge-library model that future implementation PRs can wire in safely.

SPARKY Wiki must not make the entire `docs/swarmsy/seed-library/` folder required doctrine. Seed-library reference is optional reference knowledge unless a later Current Truth decision promotes a specific small rule into required doctrine.

## Seed-library reference files

The starter SPARKY Wiki seed library is stored at:

```text
docs/swarmsy/sparky-wiki/seed-library/
```

Seed-library files are preloaded/reference files. Users/admins can add them to a workspace, upload them, import them, or select them for a future local bundle the same way they would use other workspace documents.

Seed-library files are not required doctrine. They do not require a special loader, ingestion route, UI, Docker/deployment change, package/build change, dependency, or runtime change. Sparky should treat them as workspace reference documents when they are present in the current workspace or future Local User local data bundle.

Future Local User builds can bundle the seed-library as local data so users can opt into useful knowledge packs without sending that data to hosted/admin workspaces or making it globally mandatory.

## Identity Empire seed pack (seed-library)

The seed library now includes `packs/identity-empire/`, a local-first SPARKY knowledge pack for building identity, story, brand, offer ladders, launch plans, PR angles, campaign systems, content calendars, lawful physical visibility, digital wall distribution, swarm coordination, and next actions before any web/API lookup.

This pack is still **Docs/spec only** reference knowledge. It does not add runtime automation, autonomous agents, package changes, hosted/admin changes, desktop packaging changes, Ollama/ComfyUI/API routing changes, or a separate deterministic offline brain. Sparky should use it with local Ollama first when available in the workspace or future Local User bundle. API/web lookup remains optional and only for live/current research such as trends, competitor checks, press contacts, platform rules, legal/regulatory facts, or current market research when the user turns Use API on.

## SPARKY Wiki seed pack set

The seed library provides optional SPARKY Wiki packs under `docs/swarmsy/sparky-wiki/seed-library/packs/` plus a native sanity audit and manifest. These files are current-app reference knowledge and do not add runtime code, mobile screens, desktop packaging code, build scripts, test-suite changes, deterministic Offline App Brain runtime, or global doctrine. Draft packs are draft-importable only and must not override current app truth, Sparky identity, provider routing, privacy boundaries, user memory, or workspace scoping.
