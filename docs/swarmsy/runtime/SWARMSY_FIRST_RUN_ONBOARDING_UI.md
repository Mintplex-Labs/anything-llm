# SWARMSY First-Run Onboarding UI

This runtime slice adds the first visible SWARMSY onboarding surface for normal users.

It replaces the generic blank home/start surface with a SWARMSY-first readiness flow on the main home page when the SWARMSY onboarding mode is active.

## User-Safe Routes Used

The UI uses only these normal-user-safe routes:

- `GET /api/swarmsy/onboarding/status`
- `POST /api/swarmsy/onboarding/create-hive`
- `POST /api/swarmsy/onboarding/ingest-required-docs`

No `/api/admin/...` routes are used by this UI.

## Visible State Flow

### 1. No HIVE

When onboarding status reports no SWARMSY HIVE:

- show `No SWARMSY HIVE found.`
- show `Create your HIVE to begin.`
- show `Create SWARMSY HIVE`
- keep `Check HIVE Readiness` available

### 2. Doctrine readiness unavailable

When doctrine readiness cannot be trusted yet:

- show `Doctrine readiness cannot be confirmed right now.`
- show `Check your local/server setup or try again.`
- do not present the HIVE as ready
- keep `Check HIVE Readiness` available

This includes the cases where required docs status is unavailable, required docs are missing on disk, or required docs are present but not loadable.

### 3. HIVE exists but is underloaded

When the HIVE exists and the backend reports doctrine ingestion is still pending:

- show `Your SWARMSY HIVE exists, but the doctrine docs are not fully loaded yet.`
- show `Load required doctrine docs before starting intake.`
- show `Load Required Doctrine Docs`
- keep `Check HIVE Readiness` available

If ingestion returns `partial: true` or a failure payload:

- show `Some doctrine docs could not be loaded.`
- show failed items when available
- do not claim readiness until status later confirms `workspace.ready === true`

### 4. HIVE ready

When onboarding status confirms readiness:

- show `Your SWARMSY HIVE is ready.`
- show `Choose how you want to build.`
- show identity mode choices:
  - `Face Identity Mode`
  - `Hidden Identity Mode`
  - `Existing Project`
  - `Load Memory Lock`
- show `Start SWARMSY Intake`
- allow `Load Memory Lock` to open a paste panel for returning users

### 5. Returning user memory-lock continuation

When the user selects `Load Memory Lock` in a ready HIVE:

- show `Paste your latest SWARMSY memory lock.`
- show `SPARKY will continue from this state instead of restarting your identity.`
- block empty submit with `Paste a memory lock before continuing.`
- hand off the pasted memory lock into SWARMSY HIVE chat using the existing pending-home-message mechanism
- do not restart intake as part of this flow

When the HIVE is not ready:

- keep memory-lock continuation blocked
- show `Create and load your SWARMSY HIVE before continuing from a memory lock.`

### 6. Campaign calendar handoff

The onboarding UI now includes `SWARMSY Campaign Calendar` as a lightweight command surface.

- helper copy: `Pick a day and send SPARKY a campaign command.`
- user selects one date
- user can optionally add campaign focus and proof/assets/results context
- click `Create Campaign Day` to route to SWARMSY HIVE chat with a seeded campaign-day starter message

The starter references this reusable campaign-day engine path (not inlined):

- `docs/swarmsy/living-icon-engine/prompts/09_SWARMSY_DAY_1_PR_CAMPAIGN_BUILDER.md`

The starter also enforces:

- selected date only
- no Day 2 output
- no Week 2 output
- no 30-day calendar unless explicitly requested
- no invented missing facts (SPARKY must ask for minimum missing information)

When the HIVE is not ready, campaign calendar handoff is blocked with readiness-specific copy:

- `Create your SWARMSY HIVE before using the campaign calendar.`
- `Load required doctrine docs before using the campaign calendar.`
- `Doctrine readiness cannot be confirmed. Check HIVE readiness before using the campaign calendar.`

### 7. Proof tracker handoff

The onboarding UI now includes `SWARMSY Proof Tracker` as a lightweight proof-review handoff.

- action: `Review Proof / Find Proof Gaps`
- optional panel lets users paste proof, links, notes, screenshot descriptions, sales/product/social evidence, and campaign results
- `Send Proof Review to SPARKY` routes to SWARMSY HIVE chat with a proof-review starter
- empty proof is allowed and still requests a proof-gap checklist

When the HIVE is not ready, proof review handoff is blocked with readiness-specific copy:

- `Create your SWARMSY HIVE before reviewing proof.`
- `Load required doctrine docs before reviewing proof.`
- `Doctrine readiness cannot be confirmed. Check HIVE readiness before reviewing proof.`

This is intentionally lightweight:

- no dedicated proof database yet
- no proof dashboard/viewer yet
- proof notes submit into normal SWARMSY HIVE chat history after handoff
- SPARKY must not invent proof when reviewing claims

## Start Intake Handoff

The onboarding UI now hands users directly into SWARMSY HIVE chat when they click `Start SWARMSY Intake` in a ready state.

The selected identity mode is preserved in a mode-specific starter message sent to SPARKY, and the intake file stays referenced (not inlined):

- `docs/swarmsy/living-icon-engine/prompts/01_SWARMSY_USER_INTAKE_76_QUESTIONS.md`

The handoff uses existing AnythingLLM chat routing and message-seeding flow so users do not land in a generic blank chat.

For blocked readiness states (no HIVE, underloaded HIVE, doctrine unavailable), `Start SWARMSY Intake` remains blocked.

See: [`SWARMSY_START_INTAKE_HANDOFF.md`](./SWARMSY_START_INTAKE_HANDOFF.md)
See also: [`SWARMSY_MEMORY_LOCK_CONTINUE_FLOW.md`](./SWARMSY_MEMORY_LOCK_CONTINUE_FLOW.md)
See also: [`SWARMSY_CAMPAIGN_CALENDAR_HANDOFF.md`](./SWARMSY_CAMPAIGN_CALENDAR_HANDOFF.md)
See also: [`SWARMSY_PROOF_TRACKER_HANDOFF.md`](./SWARMSY_PROOF_TRACKER_HANDOFF.md)

## Scope Limits Preserved

This UI does **not** add:

- dashboard UI
- Memory Lock viewer/storage
- Campaign dashboard/scheduler automation
- Spark Library changes
- new doctrine docs
- new dependencies
- package/build file changes
- admin-route access for normal users

## Manual Verification

1. Sign in as a normal authenticated user and open `/`.
2. Confirm the page calls only:
   - `GET /api/swarmsy/onboarding/status`
   - `POST /api/swarmsy/onboarding/create-hive`
   - `POST /api/swarmsy/onboarding/ingest-required-docs`
3. Confirm the no-HIVE state shows `Create SWARMSY HIVE`.
4. Confirm the underloaded state shows `Load Required Doctrine Docs`.
5. Confirm the ready state shows the four identity mode buttons and `Start SWARMSY Intake`.
6. Confirm `Load Memory Lock` opens a paste panel only when the HIVE is ready.
7. Confirm empty memory-lock input is blocked with the expected validation copy.
8. Confirm continuing from a pasted memory lock routes to SWARMSY HIVE chat with the continuation starter message.
9. Confirm campaign calendar handoff stays blocked for missing-HIVE, underloaded-HIVE, and doctrine-unavailable states with the expected blocked copy.
10. Confirm `Create Campaign Day` starter includes selected date and `09_SWARMSY_DAY_1_PR_CAMPAIGN_BUILDER.md`, and says selected date only with no Day 2/Week 2/30-day generation unless asked.
11. Confirm doctrine-unavailable, missing-HIVE, and underloaded-HIVE states keep `Start SWARMSY Intake` blocked and memory-lock continuation blocked.
12. Confirm partial ingestion shows failed items and retry guidance.
13. Confirm `Review Proof / Find Proof Gaps` is blocked for missing-HIVE, underloaded-HIVE, and doctrine-unavailable states with the expected blocked copy.
14. Confirm empty proof submission still routes to SWARMSY HIVE chat and requests proof-gap checklist behavior.
15. Confirm pasted proof appears in the proof-review starter and includes anti-invention rules.
16. Confirm canceling the proof panel clears pasted proof and proof error state.
17. Confirm proof handoff `sessionStorage` failures show the expected accessible error copy.
