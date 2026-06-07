---
title: Street Swarm Core Lite Architecture
category: product planning archive
status_label: Draft reference
workspace_scope: current workspace only
privacy_level: workspace reference
source: old SWARMSY repo adapted reference
source_repo: HODLKONG64/SWARMSY
source_path: docs/STREET_SWARM_CORE_LITE_ARCHITECTURE.md
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
---

## Seed-library adaptation boundary

This file is optional workspace reference knowledge imported from the old `HODLKONG64/SWARMSY` repository. It is preserved for SPARKY Wiki continuity as **draft reference** and does not override current DIZ-A-REMIX app truth, Sparky identity, provider routing, privacy boundaries, or runtime behavior.

Safety boundary: use only lawful, permission-based, local-first planning. This pack does not create runtime actions, autonomous agents, web/API calls, mobile builds, Electron builds, release claims, or cross-workspace memory.

## Old SWARMSY source material

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
