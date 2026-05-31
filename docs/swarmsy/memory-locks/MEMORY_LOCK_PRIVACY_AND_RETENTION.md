# SWARMSY Memory Lock Privacy and Retention

## Purpose

This document defines privacy boundaries, retention rules, and user rights for SWARMSY Memory Locks.

## Why Privacy Matters for Memory Locks

Memory Locks can contain sensitive information, including:

- Project identity (public or hidden)
- Founder or operator identity details
- Hidden identity references that are not intended for public disclosure
- Campaign strategy and competitive positioning
- Product and offer details not yet publicly announced
- Privacy boundaries explicitly set by the user (e.g., no real name in outputs)

Privacy rules for Memory Locks must be explicit, not assumed.

## Current Runtime: Paste-to-Chat Retention

In the current runtime, the paste-to-chat Memory Lock continuation path does not use dedicated lock storage.

The pasted lock content is included in the chat message sent to SPARKY and follows normal workspace chat history retention.

Users should be aware that their pasted lock content is stored as part of workspace chat history, consistent with how all messages in AnythingLLM are retained.

No special lock-specific retention policies apply in the current runtime.

## Future Runtime: Dedicated Storage Privacy Rules

When dedicated Memory Lock storage is implemented, the following rules must apply.

### Workspace Isolation

- A lock stored for Workspace A must never be visible in Workspace B.
- No cross-workspace lock access is permitted under any circumstances.
- Workspace isolation must be enforced at the data layer, not only at the UI layer.

### User-Scoped Ownership

- Each lock is owned by the user who created or imported it.
- Other users of the same workspace may not view or access another user's locks without explicit delegation.

### Retention Disclosure

- The system must clearly disclose to users when their lock content is being retained and for how long.
- Retention policy must be surfaced in the import confirmation step and in the viewer.
- No silent indefinite retention without disclosure.

### Export Capability

- Users must be able to export any or all of their locks as plain text or JSON at any time.
- Export must be accessible without requiring admin access.

### Delete Capability

- Users must be able to delete individual locks or all locks for their account.
- Deletion is permanent and cannot be recovered.
- Delete must be accessible without requiring admin access.

### Hidden Identity Locks

- Locks with `identityMode: hidden_identity` require extra caution.
- The `hiddenIdentity` field must not be surfaced in outputs, logs, or summaries accessible to other users.
- If a hidden-identity lock is displayed in the viewer, the hidden identity field should be masked or omitted unless the owning user is viewing it in a secure context.

### No Lock Exposure in Shared Contexts

- Lock content must not appear in shared workspaces, shared outputs, or any surface accessible to users other than the owning user.
- SPARKY must not reference hidden identity fields in generated content unless the user has explicitly requested it and consented to that use.

## Summary of User Rights

| Right | Supported |
|---|---|
| View own locks | Yes |
| Export own locks | Yes (future dedicated storage) |
| Delete own locks | Yes (future dedicated storage) |
| Access other users' locks | No |
| Access locks from other workspaces | No |
| Request retention disclosure | Yes |
