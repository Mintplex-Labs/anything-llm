# SWARMSY Proof Tracker Handoff

This runtime slice adds a lightweight Proof Tracker handoff from onboarding into SWARMSY HIVE chat.

It is a chat starter handoff, not a dedicated proof database.

## What It Adds

- `Review Proof / Find Proof Gaps` action in the SWARMSY onboarding action surface
- optional proof-note paste panel
- `Send Proof Review to SPARKY` handoff into normal SWARMSY HIVE chat history
- empty-submit support so users can request a proof-gap checklist even without pasted proof

## Readiness Gating

Proof handoff is blocked unless SWARMSY HIVE exists, readiness is true, and doctrine readiness can be confirmed.

Blocked copy:

- Missing HIVE: `Create your SWARMSY HIVE before reviewing proof.`
- Underloaded doctrine: `Load required doctrine docs before reviewing proof.`
- Doctrine unavailable: `Doctrine readiness cannot be confirmed. Check HIVE readiness before reviewing proof.`

## Starter Message Rules

Handoff starter asks SPARKY to:

1. Identify safe claims now
2. Identify blocked claims
3. Identify proof gaps
4. Suggest minimum next proof
5. Turn proof state into a proof-safe campaign/PR/content direction when possible

It also enforces anti-fabrication rules:

- SPARKY must not invent proof
- SPARKY must not exaggerate numbers
- SPARKY must not fabricate social proof, press, sales, followers, collectors, or outcomes

## Privacy and Error Handling

- Canceling/closing the proof panel clears pasted proof input and proof error state.
- If `sessionStorage` write fails, UI shows:
  - `This proof note could not be stored for chat handoff. Paste a shorter note or enable browser session storage, then try again.`
- The proof textarea uses an accessible label.
- Error messaging uses `role="alert"` with `aria-invalid` and `aria-describedby`.

## Scope Limits

This handoff intentionally does **not** add:

- proof tracker database tables
- migrations
- dashboard/viewer
- campaign generator
- Memory Lock storage
- admin route calls

Proof notes are submitted to normal SWARMSY HIVE chat history after handoff.

Future PRs can add dedicated Proof Tracker storage and viewer surfaces.
