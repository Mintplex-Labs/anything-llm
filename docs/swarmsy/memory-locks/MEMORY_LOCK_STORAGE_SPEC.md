# SWARMSY Memory Lock Storage Spec

## Purpose

This document defines how a future dedicated Memory Lock storage layer should be scoped, versioned, and managed.

No database schema, migrations, or runtime code should be added from this spec. This is a planning document only.

## Scope

### Workspace-Scoped Storage

- Each Memory Lock belongs to a specific workspace.
- A lock created in Workspace A is never visible in Workspace B.
- No cross-workspace leakage is permitted under any circumstances.

### User-Scoped Ownership

- Each lock has an owning user.
- Only the owning user (or an authorized admin) may view, update, archive, or delete a lock.
- Locks may not be accessed or modified by other users of the same workspace without explicit delegation.

## Required Fields

Each stored lock should track at minimum:

| Field | Description |
|---|---|
| `id` | Unique lock identifier |
| `workspaceId` | Owning workspace |
| `userId` | Owning user |
| `isActive` | Whether this is the current active lock for the workspace |
| `version` | Monotonically incrementing version number per workspace |
| `source` | How the lock was created: `pasted`, `generated`, or `uploaded` |
| `content` | Full structured lock content (see [`MEMORY_LOCK_SCHEMA.md`](./MEMORY_LOCK_SCHEMA.md)) |
| `createdAt` | Timestamp when the lock was first saved |
| `updatedAt` | Timestamp when the lock was last modified |
| `archivedAt` | Timestamp when the lock was archived (nullable) |

## Active Lock Marker

- At most one lock per workspace should carry `isActive: true` at any time.
- Setting a new lock as active should automatically deactivate the previous active lock (not delete it).
- If no lock is active, the viewer should show an empty/no-lock state.

## Version History

- Every save or update creates a new version record rather than overwriting the previous version.
- Previous versions are retained indefinitely unless explicitly deleted by the user.
- Versions are ordered by `version` number, with the highest version being the latest.

## Source Values

| Value | Meaning |
|---|---|
| `pasted` | User pasted raw lock content into the paste panel |
| `generated` | SPARKY generated/output a lock during a session |
| `uploaded` | User uploaded a lock document through the AnythingLLM document upload interface |

## Privacy Implications

- Lock content can contain sensitive project identity, hidden identity fields, and campaign strategy.
- Storage must clearly disclose to users that their lock content is retained and how long.
- Future dedicated storage should include an explicit retention policy surfaced in the UI.
- See [`MEMORY_LOCK_PRIVACY_AND_RETENTION.md`](./MEMORY_LOCK_PRIVACY_AND_RETENTION.md) for full privacy rules.

## Export and Delete Capability

- Users must be able to export any or all of their locks as plain text or JSON.
- Users must be able to delete individual locks or all locks for their account.
- Deletion is permanent. Deleted locks cannot be recovered.
- Export and delete must be accessible to users without requiring admin access.

## What This Spec Does Not Define

- Database schema, table DDL, or migrations (these belong in a future runtime PR)
- API routes or server endpoint logic
- UI components or frontend pages
- Encryption at rest (addressed separately if/when required)

## Notes

This spec should be implemented in a future runtime PR alongside the viewer defined in [`MEMORY_LOCK_VIEWER_SPEC.md`](./MEMORY_LOCK_VIEWER_SPEC.md).
