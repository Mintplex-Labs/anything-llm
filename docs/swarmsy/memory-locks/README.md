# SWARMSY Memory Locks

## What Is a Memory Lock?

A Memory Lock is SWARMSY's anti-drift mechanism.

It is a structured snapshot of a user's project state: identity, lore, campaign state, proof gaps, open tasks, blocked tasks, current priority, and next best action.

## Purpose

Memory Locks exist so that SPARKY can resume an existing project without restarting identity or rebuilding lore from scratch.

**New thread does not mean new project.**

**Memory Lock wins over fresh intake.**

## Current Runtime State

The current runtime supports a single Memory Lock continuation path:

- The user selects `Load Memory Lock` on the SWARMSY onboarding surface
- The user pastes the latest memory lock into the paste panel
- SPARKY is handed the lock through the HIVE chat handoff
- SPARKY is instructed not to restart identity and to treat the lock as source of truth

There is no dedicated Memory Lock storage or viewer in the current runtime.

Pasted locks follow normal workspace chat history retention after submission.

## Future Runtime Layer

This directory defines the future dedicated Memory Lock storage and viewer layer.

That layer is **not yet implemented**. These files are planning and specification documents only.

The future layer will add:

- dedicated workspace-scoped Memory Lock storage
- version history per lock
- a viewer that shows lock state, identity mode, priority, blocked tasks, and next action
- comparison between the latest lock and previous locks
- continue-from-lock action
- import flow with confirmation step
- privacy and retention controls per lock

## Files in This Directory

| File | Purpose |
|---|---|
| [`MEMORY_LOCK_VIEWER_SPEC.md`](./MEMORY_LOCK_VIEWER_SPEC.md) | What the future Memory Lock viewer should display and support |
| [`MEMORY_LOCK_STORAGE_SPEC.md`](./MEMORY_LOCK_STORAGE_SPEC.md) | How future dedicated storage should be scoped, versioned, and managed |
| [`MEMORY_LOCK_SCHEMA.md`](./MEMORY_LOCK_SCHEMA.md) | Structured schema for a Memory Lock document |
| [`MEMORY_LOCK_UPDATE_RULES.md`](./MEMORY_LOCK_UPDATE_RULES.md) | Rules governing when and how Memory Locks may be updated |
| [`MEMORY_LOCK_IMPORT_FLOW.md`](./MEMORY_LOCK_IMPORT_FLOW.md) | Flow for importing a Memory Lock into the dedicated storage layer |
| [`MEMORY_LOCK_PRIVACY_AND_RETENTION.md`](./MEMORY_LOCK_PRIVACY_AND_RETENTION.md) | Privacy boundaries, retention rules, and deletion/export rights |
| [`ANTI_DRIFT_RULES.md`](./ANTI_DRIFT_RULES.md) | Rules SPARKY must follow to prevent identity and project drift |

## Standards

- No fake claims
- No fake bots
- No fake proof
- Memory Lock only wins when it is provided by the user
- Hidden identity locks require extra caution
