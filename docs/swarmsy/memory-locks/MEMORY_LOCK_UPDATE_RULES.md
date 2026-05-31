# SWARMSY Memory Lock Update Rules

## Purpose

This document defines the rules governing when and how a SWARMSY Memory Lock may be updated.

These rules apply to SPARKY's behavior during sessions and to any future automated or UI-driven update flows.

## Core Rules

### Only Update from User-Approved Project Changes

A Memory Lock must only be updated when the user has explicitly approved the change.

SPARKY must not silently write or overwrite a lock based on assumptions, inferred preferences, or single conversational exchanges.

### Do Not Overwrite Identity Silently

Identity fields (`identityMode`, `publicIdentity`, `hiddenIdentity`, `coreLore`) must never be overwritten without explicit user confirmation.

If SPARKY determines that identity-related information has changed in a session, SPARKY must surface what changed and ask the user whether to apply the update.

### Major Identity and Lore Changes Require Confirmation

Changes to `coreLore`, `publicIdentity`, `hiddenIdentity`, or `privacyBoundaries` are major changes.

Major changes require:

1. SPARKY to state clearly what has changed
2. User to explicitly confirm the change
3. A new version of the lock to be saved rather than overwriting the current version

### Weekly Review Can Propose Updates

SPARKY may propose a lock update during a weekly review session.

In this context, SPARKY should:

- Summarize what has happened since the last lock
- Identify fields that may be outdated
- Propose specific changes as a diff (old value → new value)
- Wait for user confirmation before saving

### SPARKY Must Summarize What Changed Before Saving or Updating

Before any lock save or update, SPARKY must output a plain-language summary of:

- Which fields are being updated
- What the old value was (if applicable)
- What the new value will be
- Why the change is proposed

Only after this summary should SPARKY ask for confirmation to proceed.

### Preserve Old Lock History

Updating a lock must never destroy the previous version.

Each approved update increments the version and creates a new lock record. Previous versions remain accessible in history.

### If User Says "Small Adjustment," Do Not Rebuild Identity

When a user describes a change as a small adjustment, refinement, or tweak, SPARKY must treat it as a targeted field update — not a prompt to rebuild identity, lore, or project structure from scratch.

If SPARKY is uncertain whether the request is a small adjustment or a full rebuild, SPARKY must ask:

> "Is this a small adjustment to one part, or do you want to rebuild this section from scratch?"

### Fields Listed in doNotChangeWithoutApproval

Any field the user has placed in the `doNotChangeWithoutApproval` list must not be updated without explicit user approval, even in a review session where other fields are being updated.

SPARKY should call out these fields specifically when proposing a lock update and require separate confirmation for each protected field.
