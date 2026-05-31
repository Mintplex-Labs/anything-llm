# SWARMSY Runtime Preset Backlog

## Phase 1 — App Mode Docs

- Goal: Ship the app-mode product specification as a stable reference.
- Likely files/directories: `docs/swarmsy/app-mode/`.
- Runtime risk: Low (docs-only).
- Acceptance criteria: Required app-mode docs exist and align with SWARMSY standards.
- Validation/tests: Documentation review and link/path sanity checks.
- Rollback note: Remove or revise docs without runtime impact.

## Phase 2 — Default Workspace Preset

- Goal: Create a `SWARMSY HIVE` workspace preset.
- Spec doc: [`SWARMSY_DEFAULT_WORKSPACE_PRESET.md`](./SWARMSY_DEFAULT_WORKSPACE_PRESET.md).
- Likely files/directories: frontend workspace creation flows, server workspace preset logic, SWARMSY docs references.
- Runtime risk: Medium.
- Acceptance criteria: New projects can start with a SWARMSY HIVE preset and required sections.
- Validation/tests: Workspace creation tests and manual preset flow checks.
- Rollback note: Feature-flag or remove preset and fall back to generic workspace creation.

## Phase 3 — SPARKY System Prompt Preset

- Goal: Expose SPARKY as default agent/system prompt preset.
- Spec doc: [`SPARKY_SYSTEM_PROMPT_PRESET.md`](./SPARKY_SYSTEM_PROMPT_PRESET.md).
- Likely files/directories: prompt preset config, agent/persona selection UI, server prompt routing.
- Runtime risk: Medium.
- Acceptance criteria: SPARKY preset is selectable/default for SWARMSY mode and loads doctrine safely.
- Validation/tests: Prompt preset tests and regression checks for generic presets.
- Rollback note: Revert default mapping to generic prompt while keeping preset optional.

## Phase 4 — First-Run Onboarding Copy

- Goal: Add first-run route/spec copy if safe.
- Likely files/directories: onboarding UI routes, copy resources, setup state handling.
- Runtime risk: Medium.
- Acceptance criteria: First-run users see SWARMSY framing and mode options.
- Validation/tests: Onboarding flow tests and copy rendering checks.
- Rollback note: Route users back to existing onboarding entry point.
- Runtime slice delivered:
  - `GET /api/swarmsy/onboarding/status`
  - `POST /api/swarmsy/onboarding/create-hive` (user-safe, idempotent, no docs ingestion)
  - `POST /api/swarmsy/onboarding/ingest-required-docs` (user-safe, current-user/global HIVE only, no arbitrary targeting)
- Runtime UI delivered:
  - normal-user home surface shows SWARMSY onboarding instead of the generic blank start where SWARMSY onboarding mode is active
  - no-HIVE, underloaded, ready, and doctrine-unavailable states are visible
  - Face Identity Mode, Hidden Identity Mode, Existing Project, and Load Memory Lock choices are visible once ready
  - `Start SWARMSY Intake` now hands off into SWARMSY HIVE chat with mode-specific SPARKY starter messages and readiness gating (no admin routes)
  - `Load Memory Lock` now opens a returning-user paste flow that hands the pasted lock to SPARKY without restarting intake or identity
- Remaining scope: dashboard, Memory Lock viewer/storage, and broader guided flow.

## Phase 5 — Required Docs Ingestion Helper

- Goal: Help users/admins load prompt tree, persona, operating layer, and disruption docs.
- Likely files/directories: document ingestion helpers, admin upload/import flows, docs indexing hooks.
- Runtime risk: Medium-High.
- Acceptance criteria: Required doctrine docs are discoverable and loadable with clear status.
- Validation/tests: Ingestion tests for missing/partial/full docs and retrieval checks.
- Rollback note: Disable helper and keep manual docs ingestion path.

## Phase 5.5 — SPARKY Operator Guidance Layer

- Goal: Add SPARKY operator playbooks that map AnythingLLM tools, intent routing, and recovery flows.
- Likely files/directories: `docs/swarmsy/sparky-operator/`.
- Runtime risk: Low (docs-only).
- Acceptance criteria: SPARKY operator docs clearly define tool choice, wrong-click recovery, provider troubleshooting, and project-command routing.
- Validation/tests: Documentation review and path/link sanity checks.
- Rollback note: Remove or revise docs without runtime impact.

## Phase 6 — Project Dashboard Surface

- Goal: Add dashboard UI or dashboard-like output surface.
- Likely files/directories: dashboard components/pages, project state APIs, task/proof widgets.
- Runtime risk: High.
- Acceptance criteria: Users can see current priority, blockers, proof needs, and next actions.
- Validation/tests: Dashboard UI tests, state integration tests, manual workflow checks.
- Rollback note: Hide dashboard route behind flag and keep existing interfaces.

## Phase 7 — Memory Lock Viewer

- Goal: Show latest identity/lore/campaign locks.
- Spec docs: [`docs/swarmsy/memory-locks/`](../memory-locks/README.md) — viewer spec, storage spec, schema, update rules, import flow, privacy/retention rules, and anti-drift rules are defined there. These are planning documents only; no runtime code has been added yet.
- Likely files/directories: memory lock storage/read endpoints, lock display components, project history views.
- Runtime risk: Medium.
- Acceptance criteria: Latest lock is visible and continuity is preserved across sessions.
- Validation/tests: Lock retrieval/display tests and continuity regression checks.
- Rollback note: Fall back to raw document view for lock files.

## Phase 8 — Campaign Day Command Generator

- Goal: Add a lightweight campaign calendar handoff command surface.
- Likely files/directories: onboarding UI handoff panel, campaign starter-message helper, runtime handoff docs.
- Runtime risk: Medium.
- Acceptance criteria: Users can pick a selected date and route one campaign-day command to SWARMSY HIVE using the reusable Day 1 prompt reference.
- Validation/tests: Onboarding UI regression checks and message-content verification for selected-date-only constraints.
- Rollback note: Remove campaign calendar surface and keep manual campaign command entry in chat.
- Runtime slice delivered:
  - `SWARMSY Campaign Calendar` panel in onboarding UI with native date selector
  - `Create Campaign Day` handoff into SWARMSY HIVE chat via pending-home-message storage
  - starter message references `docs/swarmsy/living-icon-engine/prompts/09_SWARMSY_DAY_1_PR_CAMPAIGN_BUILDER.md`
  - starter enforces selected-date-only output and explicitly blocks Day 2, Week 2, and 30-day generation unless user asks
  - readiness gating mirrors onboarding guardrails (missing HIVE, underloaded doctrine, doctrine unavailable)
- Explicitly out of scope:
  - Day 2 templates
  - Week 2 templates
  - full 30-day campaign generation
  - scheduler/notifications/automation
  - persistent campaign database or dashboard management UI

## Phase 9 — Proof Tracker

- Goal: Track proof gaps, proof created, claims allowed, claims blocked.
- Likely files/directories: proof data models, claim validation logic, proof tracker UI/reporting.
- Runtime risk: High.
- Acceptance criteria: Claims are clearly marked as proven, blocked, or proof-gap.
- Validation/tests: Proof state tests, claim gating tests, and UI validation.
- Rollback note: Disable automated gating and keep proof logging as advisory.

## Phase 10 — Local AI Setup Helper

- Goal: Guide AnythingLLM + Ollama + local model + embedder.
- Likely files/directories: setup assistant UI, provider checks, configuration guidance paths.
- Runtime risk: Medium.
- Acceptance criteria: Users receive truthful setup status and actionable local AI guidance.
- Validation/tests: Provider/model readiness checks and setup path manual verification.
- Rollback note: Remove helper and retain existing provider settings pages.
