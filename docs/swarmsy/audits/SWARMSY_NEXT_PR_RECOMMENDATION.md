# SWARMSY Next PR Recommendation

Audit date: 2026-07-12
Based on: `SWARMSY_MVP_KNOWN_GAPS.md`, current `server/endpoints/swarmsy.js`, and current SWARMSY endpoint tests.

---

## Current State

The previous 2026-05-31 recommendation targeted a first-run onboarding entrypoint and user-safe route layer. That work has now landed.

Current runtime evidence:

| Area | Current status |
|---|---|
| User-safe onboarding status route | Implemented: `GET /api/swarmsy/onboarding/status` |
| User-safe HIVE creation route | Implemented: `POST /api/swarmsy/onboarding/create-hive` |
| User-safe required-docs ingestion route | Implemented: `POST /api/swarmsy/onboarding/ingest-required-docs` |
| Onboarding route tests | Present in `server/__tests__/endpoints/swarmsy.test.js` |
| Required-docs ingestion utility tests | Present in `server/__tests__/utils/swarmsy/ingestRequiredDocs.test.js` |
| Workspace preset tests | Present in `server/__tests__/utils/swarmsy/applyWorkspacePreset.test.js` |
| Frontend onboarding tests | Present in `server/__tests__/frontend/swarmsyOnboarding.test.js` |

The old recommendation should no longer be used as the active next-PR plan because it points contributors at work that is already represented in the codebase.

---

## Recommended Next PR

`Add SWARMSY Memory Lock storage and viewer`

Memory Lock continuity is the highest-priority remaining gap documented in `SWARMSY_MVP_KNOWN_GAPS.md`.

Today, the Load Memory Lock path can hand a pasted lock to SPARKY through the normal chat flow. The lock is then only recoverable from ordinary workspace chat history. There is no dedicated storage, retrieval API, or viewer for returning users.

A focused next PR should add the smallest durable Memory Lock layer that supports returning-user continuity:

1. Store imported Memory Locks in a dedicated persistence layer instead of relying only on chat history.
2. Associate every stored lock with both the owning user and the owning SWARMSY HIVE workspace, matching `MEMORY_LOCK_STORAGE_SPEC.md`'s `userId` and `workspaceId` requirements.
3. Enforce that only the owning user, or an explicitly authorized admin path, can list, view, update, archive, delete, export, or activate a lock; other users in the same workspace must not see it without explicit delegation.
4. Add an authenticated route for listing and retrieving only the current user's stored Memory Locks for the selected workspace. If single-user mode needs a fallback owner, document and test that fallback separately from multi-user behavior.
5. Add a minimal viewer/import surface that lets a returning user select or inspect a previous lock.
6. Preserve existing chat handoff behavior so the current Load Memory Lock flow keeps working.
7. Add focused tests for ownership checks, same-workspace isolation, import behavior, and retrieval behavior.

---

## Scope Guardrails

Keep the PR limited to Memory Lock continuity. Do not bundle it with unrelated Phase 2 systems.

Do not include:

- Proof Tracker database/viewer work.
- Campaign calendar persistence.
- Space Agent integration.
- Optional advanced doctrine ingestion UI.
- Legacy SWARMSY migration tooling.
- Broad dashboard redesign.
- Package or build-system changes unless directly required by the Memory Lock implementation.

---

## Why This Is Next

Memory Lock storage is the most direct gap between a functional first-run experience and a usable returning-user experience.

The current onboarding and HIVE setup path can get a user into SWARMSY mode, but returning users still need to manually recover and re-paste their lock from previous chat history. That is brittle and easy to lose. A dedicated storage/viewer path gives the app a concrete continuity primitive before larger dashboard, proof, campaign, or agent features are built.

---

## Secondary Actions

These remain valid follow-up candidates, but they should not be mixed into the Memory Lock PR:

| Item | Suggested follow-up |
|---|---|
| Proof Tracker persistence | Add proof-review storage and history viewer after Memory Locks are durable |
| SWARMSY dashboard | Surface active project state after core continuity primitives exist |
| Campaign persistence | Store campaign-day output and show completed dates |
| Collector setup helper | Add in-app recovery guidance for `COLLECTOR_OFFLINE` first-run failures |
| Admin route tests | Add coverage for admin-only SWARMSY routes separately from user-safe onboarding tests |

---

## Historical Note

The previous version of this document recommended first-run onboarding and user-safe route wiring. That recommendation has been superseded by the current codebase. Use this document with `SWARMSY_MVP_KNOWN_GAPS.md` when choosing the next runtime PR.
