# SWARMSY Memory Lock Viewer Spec

## Purpose

This document defines what a future dedicated Memory Lock viewer should display and support.

No UI code should be added from this spec. This is a planning document only.

## What the Viewer Should Show

### Latest Memory Lock Panel

- Project name
- Lock version
- Lock date (created_at / updated_at)
- Identity mode (Face Identity / Hidden Identity / Existing Project)
- Public identity (if applicable and not hidden-identity-protected)
- Current priority
- Blocked tasks
- Open tasks
- Proof gaps
- Next best action

### Lock Metadata Panel

- Source of lock (pasted / generated / uploaded)
- Lock version number
- Created at timestamp
- Last updated timestamp
- Active / archived status

### Previous Lock History

- List of past locks for the same workspace, ordered newest to oldest
- Each entry shows: version, date, source, status (active / archived)
- Clicking an entry opens that lock's details

### Compare Latest vs Previous

- Side-by-side or diff view of latest lock vs a selected previous lock
- Fields that changed should be highlighted
- Fields that are unchanged should be visible but de-emphasized

## Actions

### Continue from This Lock

- Opens SWARMSY HIVE chat with the selected lock as the handoff source
- SPARKY is instructed not to restart identity
- SPARKY summarizes the locked state before proposing next action

### Mark Lock as Active

- Sets a lock to active status
- Only one lock per workspace should be active at a time
- Marking a lock active does not delete previous locks

### Archive Old Lock

- Moves a lock to archived status
- Archived locks remain in version history and are not deleted
- Archived locks can still be viewed or compared

## What the Viewer Must Not Do

- Must not auto-delete any lock without explicit user action
- Must not expose locks from other workspaces
- Must not show hidden identity fields to users without appropriate access
- Must not allow silent identity overwrite through viewer actions

## Notes

This spec does not include UI code, component files, or database migrations.

A future runtime PR should implement this viewer against the storage layer defined in [`MEMORY_LOCK_STORAGE_SPEC.md`](./MEMORY_LOCK_STORAGE_SPEC.md).
