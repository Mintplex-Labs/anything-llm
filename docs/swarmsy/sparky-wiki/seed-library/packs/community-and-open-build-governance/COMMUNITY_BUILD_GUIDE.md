---
title: Community Build Guide
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

- reference knowledge-inspired workspace settings/runtime persistence patterns are tracked in workspaceStorage and require MIT attribution continuity.
