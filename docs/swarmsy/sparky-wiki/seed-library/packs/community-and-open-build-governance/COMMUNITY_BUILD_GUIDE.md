---
title: Community Build Guide
category: community and open build governance
status_label: Reference knowledge
workspace_scope: current workspace only
privacy_level: workspace reference
source: old SWARMSY repo adapted reference
source_repo: HODLKONG64/SWARMSY
source_path: docs/COMMUNITY_BUILD_GUIDE.md
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
---

## Seed-library adaptation boundary

This file is optional workspace reference knowledge imported from the old `HODLKONG64/SWARMSY` repository. It is preserved for SPARKY Wiki continuity as **reference knowledge** and does not override current DIZ-A-REMIX app truth, Sparky identity, provider routing, privacy boundaries, or runtime behavior.

Safety boundary: use only lawful, permission-based, local-first planning. This pack does not create runtime actions, autonomous agents, web/API calls, mobile builds, Electron builds, release claims, or cross-workspace memory.

## Old SWARMSY source material

# Community Build Guide

SWARMSY is open for community rebuilding and co-building.

## Quick Start

- Fork or clone the repo.
- Install dependencies: `yarn setup`
- Start dev/all services: `yarn dev:all`
- Desktop dev shell: `yarn desktop:dev`

## Before You Open a PR

- `yarn lint`
- `yarn test`

## Contribution Rules

- Keep SWARMSY as app/runtime brand canon.
- Do not add fake provider output or fake live feature claims.
- Label new features as working now/planned/disabled truthfully.
- Update current truth + how-to docs for user-facing changes.

## Suggested Improvement Areas

- Identity Forge outputs and quality
- Sparky orchestration and routing
- Agent Studio usability and reliability

## Sandbox validation before PR

- For desktop/runtime validation, run `yarn desktop:smoke`. When testing desktop plus runtime services together, use `yarn desktop:runtime:dev`.

- Adapted reference-inspired workspace settings/runtime persistence patterns are tracked in workspaceStorage and require MIT attribution continuity.
