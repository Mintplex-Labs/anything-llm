---
title: Street Swarm Core Lite Architecture
category: product planning archive
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

# STREET SWARM CORE/LITE ARCHITECTURE

**Current source of truth:** `/README.md` and `/STREET_SWARM_FINAL_MEGA_BUILD_TRUTH.md`.

**If this document conflicts with the root canon files, the root canon files win.**

Date: 2026-05-18  
Repository: `HODLKONG64/DIZ-A-REMIX`

## Product split (authoritative)

- **Street Swarm Core (Desktop)**
  - AI command centre / workstation
  - Main planning, orchestration, and higher-context command workflows
- **Street Swarm Lite (Mobile)**
  - Field / boots-on-ground companion
  - Fast execution, updates, and approvals while moving

## Why this split

- Desktop offers a better environment for deep command workflows.
- Mobile remains critical for in-field actions and rapid status feedback.
- Both products must converge on shared mission/project continuity.

## Shared domain that must sync (future layer)

1. Shared user identity
2. Shared projects
3. Missions/tasks
4. Status updates
5. Notes/photos/field reports
6. Approvals from mobile
7. Offline queueing
8. Transport path via future cloud relay or local network pairing

## Boundaries for this PR

- Defines architecture and language only.
- Does **not** implement sync.
- Does **not** add backend.
- Does **not** add auth.
- Does **not** change AI providers.
- Does **not** bundle models.
- Must not break existing mobile behavior.

## Implementation direction for next PRs

- Introduce a shared task/project data contract used by both Core and Lite.
- Add a local operation queue and deterministic merge strategy.
- Add transport adapters (cloud relay and local pairing) behind the same sync interface.
- Keep all sync features feature-flagged until fully validated.
