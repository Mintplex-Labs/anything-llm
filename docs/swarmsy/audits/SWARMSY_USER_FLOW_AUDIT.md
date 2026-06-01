# SWARMSY User Flow Audit

Audit date: 2026-06-01
Branch: post-full-first-user-flow

---

## Overview

This document describes the actual current user journeys through the SWARMSY MVP layer, as implemented in the codebase today.

Every claim in this document is based on code that exists. Features described as handoffs are handoffs. Features described as chat history are chat history. No persistence is implied unless explicitly stated.

---

## Journey 1 — New User

### User lands in onboarding

**What works now:**

- The home page renders `SwarmsyFirstRunOnboarding` when the server returns `mode: swarmsy_onboarding` from `GET /api/swarmsy/onboarding/status`.
- The onboarding surface displays a HIVE snapshot panel and a status card that shows one of three states: HIVE missing, doctrine underloaded, or HIVE ready.
- A loading spinner shows while status is being fetched.

**What is still manual:**

- Nothing is seeded or initialized at boot time. The user must initiate setup by clicking buttons.

**Future PR:**

- Auto-detection of returning users vs. truly first-run users could pre-populate the identity mode selection based on prior chat history.

---

### User creates HIVE

**What works now:**

- The onboarding surface exposes a `Create SWARMSY HIVE` action.
- Clicking it calls `POST /api/swarmsy/onboarding/create-hive`.
- The route is idempotent: if a HIVE already exists for the user (scoped by user ID in multi-user mode, or global slug in single-user mode), it returns the existing workspace without duplicating.
- On success, the UI re-polls `GET /api/swarmsy/onboarding/status` and updates the snapshot.
- Toast feedback is shown for success and failure states.

**What is still manual:**

- There is no boot-time auto-creation of HIVE. Users must create it via the onboarding UI or via the admin route.

**Future PR:**

- Optional boot-time HIVE auto-creation with a server-side guard could reduce the first-run step count.

---

### User loads docs

**What works now:**

- When HIVE exists, the onboarding surface exposes a `Load Required Doctrine Docs` action.
- Clicking it calls `POST /api/swarmsy/onboarding/ingest-required-docs`.
- The route discovers required doctrine docs, verifies they are present in the docs root, and runs the collector + embed pipeline.
- Already-attached docs are skipped via `chunkSource` deduplication.
- Partial-failure results show a warning toast, and the onboarding surface renders a failed-item list with paths and reasons.
- `COLLECTOR_OFFLINE` returns a 503 and shows an error toast.
- On success, the UI re-polls status to confirm readiness.

**What is still manual:**

- If the collector is offline, users must restart the collector and retry manually.
- There is no retry button; the user must click the action button again.

**Future PR:**

- A retry-with-backoff flow or a persistent ingestion status indicator could reduce friction on collector-offline recovery.

---

### User chooses identity mode

**What works now:**

- Three identity modes are selectable: Face Identity Mode, Hidden Identity Mode, Existing Project.
- Load Memory Lock is a fourth IDENTITY_MODES entry but is treated as a `continue` action rather than a build action.
- Identity selection is only meaningful once the HIVE exists and doctrine is loaded.
- Selected mode is local state in the component; it is not persisted anywhere outside the current browser session.

**What is still manual:**

- Mode selection has no persistence beyond the current session.

**Future PR:**

- Persisting the selected mode to the HIVE workspace metadata could enable returning users to skip re-selection.

---

### User starts intake

**What works now:**

- When HIVE is ready and a mode is selected (face, hidden, or existing-project), `Start Intake` becomes enabled.
- Clicking it builds a mode-specific SPARKY starter message referencing `01_SWARMSY_USER_INTAKE_76_QUESTIONS.md`.
- The starter message is written to `sessionStorage` under `PENDING_HOME_MESSAGE` key.
- The user is navigated to `paths.workspace.chat(slug)`.
- SPARKY receives the starter message and begins the intake dialogue.

**What is still manual:**

- The full 76-question intake is driven by SPARKY through normal chat dialogue. No automated question-stepping exists.
- The user must answer questions one at a time in chat.

**Future PR:**

- A structured intake form UI could reduce manual dialogue time for the 76-question flow.
- An intake progress tracker could show how many questions have been answered.

---

## Journey 2 — Returning User

### User opens HIVE

**What works now:**

- When the user navigates to the home page and their HIVE already exists, the onboarding surface shows a `HIVE ready` status card.
- The user can proceed directly to any action without re-creating the HIVE or re-loading docs (assuming docs are already attached).
- If docs are not attached (e.g., new installation), the user must re-ingest them.

**What is still manual:**

- No returning-user dashboard exists. The user sees the full onboarding surface, not a project summary view.

**Future PR:**

- A dashboard surface showing project state, last session, active memory lock, and quick-action shortcuts would reduce friction for returning users.

---

### User loads Memory Lock

**What works now:**

- `Load Memory Lock` is available in the Continue group of the Action Hub when HIVE is ready.
- Clicking it opens a paste panel inside the onboarding surface.
- The user pastes their latest SWARMSY memory lock (a structured project-state document).
- Empty input is blocked with a validation message: `Paste a memory lock before continuing.`
- On submit, the pasted lock is bundled into a SPARKY continuation starter message and written to `sessionStorage` under `PENDING_HOME_MESSAGE`.
- The user is navigated to HIVE chat, where SPARKY receives the lock and resumes the project.

**What is still manual:**

- The user must locate and copy-paste their memory lock manually. There is no lock storage or retrieval UI.
- SPARKY's continuation is driven by whatever the user pasted. If the pasted lock is incomplete or outdated, SPARKY will ask for clarification.

**Future PR:**

- A dedicated Memory Lock storage layer (spec exists in `docs/swarmsy/memory-locks/`) would allow retrieving the latest lock without manual paste.
- A Memory Lock viewer UI would let users browse, compare, and restore past lock states.

---

### User continues project

**What works now:**

- After SPARKY receives the memory lock starter, the returning user is in normal HIVE chat.
- SPARKY is instructed to continue from the locked state, avoid restarting identity, and summarize the project state before proposing next steps.
- The memory lock message is stored in workspace chat history, which means it is retained for the session duration according to the workspace chat retention settings.

**What is still manual:**

- If the user closes the chat and wants to continue again later, they must paste the lock again.
- There is no automated lock update trigger after each session.

**Future PR:**

- A "Generate Memory Lock from this session" action could create an exportable lock after each conversation.

---

## Journey 3 — Campaign User

### User uses Campaign Calendar

**What works now:**

- `Campaign Calendar` is available in the Launch group of the Action Hub when HIVE is ready.
- The user sees a date picker (defaults to today's local date), an optional campaign focus text field, and an optional proof/assets field.
- Selecting a date and clicking `Create Campaign Day` builds a campaign-day starter message referencing `09_SWARMSY_DAY_1_PR_CAMPAIGN_BUILDER.md`.
- The starter message instructs SPARKY to create a campaign-day plan for the selected date only.
- The message is written to `sessionStorage` and the user is navigated to HIVE chat.

**What is still manual:**

- The user must manually select a date for each campaign day.
- Campaign output lives in chat history only; there is no persistent campaign storage or calendar view.

**Selected date only:**

- The starter message explicitly instructs SPARKY: `Selected date only. Do not create Day 2. Do not create Week 2. Do not create a 30-day calendar unless I explicitly ask.`
- No Day 2 exists in the system today.
- No 30-day calendar exists in the system today.

**Future PR:**

- A campaign storage layer could persist generated campaign-day packs.
- A calendar view could show which dates have existing campaign output.

---

## Journey 4 — Proof User

### User opens proof handoff

**What works now:**

- `Review Proof / Find Proof Gaps` is available in the Verify group of the Action Hub when HIVE is ready.
- Clicking it opens an optional paste panel.
- The user can paste proof notes, links, results, or claims for SPARKY to review.
- Empty submission is allowed — if no proof is pasted, the starter message uses `No proof supplied yet.` as the proof section.
- Clicking `Send Proof Review to SPARKY` writes the proof review starter to `sessionStorage` and navigates to HIVE chat.

**What is still manual:**

- Users must copy-paste their proof manually. There is no integrated proof store.

**SPARKY reviews proof safety:**

**What works now:**

- The starter message instructs SPARKY to:
  1. Identify what claims are safe to make now.
  2. Identify what claims are blocked.
  3. Identify proof gaps.
  4. Suggest the minimum proof needed next.
  5. Turn proof state into a proof-safe campaign or content direction when possible.
- Anti-fabrication rules are embedded in the starter: SPARKY must not invent proof, must not exaggerate numbers, must not fabricate social proof.

**Future PR:**

- A dedicated Proof Tracker storage layer (spec referenced in `SWARMSY_PROOF_TRACKER_HANDOFF.md`) would allow tracking proof claims across sessions.
- A proof-gap viewer could surface unresolved gaps from prior sessions.
