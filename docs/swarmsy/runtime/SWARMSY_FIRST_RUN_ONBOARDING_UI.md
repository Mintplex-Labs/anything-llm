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

This PR keeps the intake handoff visible without inventing the intake itself.

For Face and Hidden Identity modes, the UI tells the user to open `SWARMSY HIVE` and start intake with SPARKY using:

- `docs/swarmsy/living-icon-engine/prompts/01_SWARMSY_USER_INTAKE_76_QUESTIONS.md`

The direct chat wiring is intentionally left as the next PR if more automation is needed.

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
6. Confirm doctrine-unavailable states do not show the HIVE as ready.
7. Confirm partial ingestion shows failed items and retry guidance.

## Next PR

The next SWARMSY onboarding PR should wire the `Start SWARMSY Intake` handoff directly into chat safely if the product still wants a one-click transition.
