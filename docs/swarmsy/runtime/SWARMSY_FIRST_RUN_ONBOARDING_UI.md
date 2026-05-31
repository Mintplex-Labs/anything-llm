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

## Start Intake Handoff

The onboarding UI now hands users directly into SWARMSY HIVE chat when they click `Start SWARMSY Intake` in a ready state.

The selected identity mode is preserved in a mode-specific starter message sent to SPARKY, and the intake file stays referenced (not inlined):

- `docs/swarmsy/living-icon-engine/prompts/01_SWARMSY_USER_INTAKE_76_QUESTIONS.md`

The handoff uses existing AnythingLLM chat routing and message-seeding flow so users do not land in a generic blank chat.

For blocked readiness states (no HIVE, underloaded HIVE, doctrine unavailable), `Start SWARMSY Intake` remains blocked.

See: [`SWARMSY_START_INTAKE_HANDOFF.md`](./SWARMSY_START_INTAKE_HANDOFF.md)

## Scope Limits Preserved

This UI does **not** add:

- dashboard UI
- Memory Lock viewer
- Campaign Day generator
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
6. Confirm selecting each identity mode and starting intake routes to SWARMSY HIVE chat with the mapped starter instruction.
7. Confirm doctrine-unavailable, missing-HIVE, and underloaded-HIVE states keep `Start SWARMSY Intake` blocked.
8. Confirm partial ingestion shows failed items and retry guidance.
