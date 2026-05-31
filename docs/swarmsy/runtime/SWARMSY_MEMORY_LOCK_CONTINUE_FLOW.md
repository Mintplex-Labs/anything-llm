# SWARMSY Memory Lock Continue Flow

This runtime slice adds the first returning-user continuation path for SWARMSY onboarding.

## Purpose

`Load Memory Lock` is for returning users who already have a SWARMSY memory lock and want SPARKY to continue from that state without restarting intake.

This slice is a continuation handoff only.

It does **not** add:

- Memory Lock database persistence
- Memory Lock viewer/history UI
- dashboard surface
- proof tracker UI
- campaign day generator
- admin-route access

## UI Flow

When the user's SWARMSY HIVE is ready:

- `Load Memory Lock` opens a paste panel in onboarding
- the user can paste the latest SWARMSY memory lock
- empty input is blocked with `Paste a memory lock before continuing.`
- `Continue from Memory Lock` hands off into SWARMSY HIVE chat

When the HIVE is not ready:

- continuation stays blocked
- the UI tells the user: `Create and load your SWARMSY HIVE before continuing from a memory lock.`

## SPARKY Handoff

The pasted lock is handed to SPARKY through the existing pending-home-message chat handoff used elsewhere in AnythingLLM.

The starter message instructs SPARKY to:

- continue the existing SWARMSY project
- avoid restarting identity
- avoid rebuilding lore unless explicitly requested
- treat the memory lock as the source of truth over fresh intake
- ask for clarification if the pasted lock is unclear
- summarize the locked state before proposing the next action

## Persistence

There is no dedicated Memory Lock database persistence in this PR.

The pasted memory lock is included in the immediate handoff message routed into chat, so it follows normal workspace chat history storage and retention after submission.

A future PR can add Memory Lock storage, viewing, import history, or richer continuity tooling.
