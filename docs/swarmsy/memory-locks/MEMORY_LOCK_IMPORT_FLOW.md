# SWARMSY Memory Lock Import Flow

## Purpose

This document defines the flow for importing a Memory Lock into SWARMSY, whether through the current paste-to-chat path or a future dedicated storage path.

## Current Path: Paste to Chat

The current runtime supports paste-to-chat import only.

1. User selects `Load Memory Lock` on the SWARMSY onboarding surface.
2. User pastes the memory lock content into the paste panel.
3. Empty input is blocked — user sees: `Paste a memory lock before continuing.`
4. On submit, the lock is routed into SWARMSY HIVE chat via pending-home-message handoff.
5. SPARKY is instructed to continue without restarting identity.
6. No dedicated storage is created in this path — the lock follows normal workspace chat history retention.

## Future Path: Dedicated Storage Import

When dedicated Memory Lock storage is available, the import flow should follow these steps.

### Step 1 — Provide the Lock

The user provides the lock content through one of:

- **Paste**: User pastes raw lock text or JSON into the import panel.
- **Upload**: User uploads a Memory Lock document through the AnythingLLM document upload interface (if upload support is available for the relevant file type).

### Step 2 — Validate Non-Empty Content

- Reject empty input with a clear message.
- Reject content that does not appear to be a valid Memory Lock (e.g., too short, no recognizable fields).
- If content is oversized, reject with a size limit message.

### Step 3 — Summarize the Imported Lock

Before saving, SPARKY (or the system) must output a plain-language summary of the imported lock content:

- Project name
- Identity mode
- Current priority
- Open task count
- Blocked task count
- Lock version and date (if present in the content)

### Step 4 — Ask Confirmation Before Making Active

The system must present the summary and ask the user:

> "Does this look correct? Do you want to save this as your active Memory Lock?"

The user must explicitly confirm before the lock is saved and marked active.

### Step 5 — Handle Unclear Content

If the lock content is ambiguous, incomplete, or does not match the expected schema, SPARKY must ask clarifying questions rather than guess:

- "This lock is missing a project name. What is the project name?"
- "The identity mode is not specified. Is this a Face Identity, Hidden Identity, or Existing Project lock?"

SPARKY must not fabricate missing values.

### Step 6 — Do Not Restart Intake

Importing a Memory Lock is a continuation action, not a fresh intake.

SPARKY must not trigger intake questions (mode selection, lore gathering, product discovery) when a lock import is confirmed.

If the lock is successfully imported and activated, SPARKY should summarize the locked state and propose the next best action.

## What the Import Flow Must Not Do

- Must not silently overwrite an existing active lock without user confirmation
- Must not skip the summary step
- Must not fabricate missing fields
- Must not restart intake or identity-building flows after a successful import
- Must not route the lock into chat without the user's awareness of what is being submitted
