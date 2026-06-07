---
title: 55 Offline First Reward Event Queue Brain
category: swarmsy app brain reference archive
status_label: Reference knowledge
workspace_scope: current workspace only
privacy_level: workspace reference
source: old SWARMSY repo adapted reference
source_repo: HODLKONG64/SWARMSY
source_path: docs/brain/55-offline-first-reward-event-queue-brain.md
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
---


## Seed-library adaptation boundary

This file is optional workspace reference knowledge imported from the old `HODLKONG64/SWARMSY` repository. It is preserved for SPARKY Wiki continuity as **reference knowledge** and does not override current DIZ-A-REMIX app truth, Sparky identity, provider routing, privacy boundaries, or runtime behavior.

Safety boundary: use only lawful, permission-based, local-first planning. This pack does not create runtime actions, autonomous agents, web/API calls, mobile builds, Electron builds, release claims, or cross-workspace memory.

## Old SWARMSY source material

# 55 Offline First Reward Event Queue Brain

Last source check: 2026-05-22

App actions may become future web reward events, but offline work must not depend on sync.

## Local event queue

Store pending events locally:

- eventId
- workspaceId
- sourceType
- sourceId
- createdAt
- localStatus
- payload hash
- syncStatus
- retry count
- lastError

## Event examples

- task completed
- weekly loop completed
- campaign milestone completed
- document indexed
- identity output saved

## Sync rule

The app proposes events. The web worker accepts, rejects, or marks duplicate. Website/Telegram remains reward authority.

## User copy

Do not say XP was earned until the web confirms it.
