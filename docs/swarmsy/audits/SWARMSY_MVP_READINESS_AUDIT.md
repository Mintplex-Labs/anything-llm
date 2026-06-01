# SWARMSY MVP Readiness Audit

Audit date: 2026-06-01
Branch: post-full-first-user-flow

---

## 1. Executive Summary

**MVP lane verdict: partially ready**

The first user flow — from first-run onboarding through to HIVE creation, doctrine ingestion, identity mode selection, and handoff into all four action paths — is implemented and functional.

However, several surfaces remain handoffs only (not persistent systems), and some capabilities exist only as docs/spec awaiting a future runtime PR.

No Day 2 runtime exists.
No Memory Lock database exists.
No Proof Tracker database exists.
No Campaign Calendar scheduler exists.
No Dashboard exists.

The current MVP represents a working, honest handoff layer that routes users into SPARKY chat correctly and safely.

### Status label reference

| Label | Meaning |
|---|---|
| **working runtime** | Code is implemented, deployed, and callable |
| **partial** | Some functionality works; edge cases or surfaces are missing |
| **docs/spec only** | Document exists, no runtime code |
| **planned** | Acknowledged future work, not started |
| **not built** | No doc, no code, no spec |

---

## 2. Current Working User Flow

| Step | Status | Notes |
|---|---|---|
| Open SWARMSY onboarding | **working runtime** | `SwarmsyFirstRunOnboarding` renders on home when mode is `swarmsy_onboarding` |
| Create SWARMSY HIVE | **working runtime** | `POST /api/swarmsy/onboarding/create-hive` creates workspace, idempotent |
| Check readiness | **working runtime** | `GET /api/swarmsy/onboarding/status` returns HIVE existence, doctrine readiness, nextAction |
| Ingest required docs | **working runtime** | `POST /api/swarmsy/onboarding/ingest-required-docs` runs collector + embed pipeline |
| Choose Face Identity Mode | **working runtime** | Identity mode selection renders in onboarding UI; seeds intake starter |
| Choose Hidden Identity Mode | **working runtime** | Same as above, different intake prompt |
| Choose Existing Project | **working runtime** | Same as above, import intake prompt |
| Start intake handoff | **working runtime** | Writes SPARKY starter to `sessionStorage` and navigates to HIVE chat |
| Load Memory Lock handoff | **working runtime** | Opens paste panel, validates non-empty, writes to `sessionStorage`, navigates to HIVE chat |
| Use Campaign Calendar handoff | **working runtime** | Date picker + optional focus/proof fields; writes campaign-day starter to `sessionStorage` and navigates |
| Use Proof Tracker handoff | **working runtime** | Optional paste panel; sends proof-gap review starter to SPARKY in HIVE chat |

**Critical honest label:**
All handoffs are `sessionStorage`-based pending-home-message chat starters. None of the handoffs write to a database. None create persistent records outside normal workspace chat history.

---

## 3. Route Truth

### User-safe onboarding routes (`/api/swarmsy/...`)

| Route | Implemented | User-safe | Used by frontend | Tested | Known gap |
|---|---|---|---|---|---|
| `GET /api/swarmsy/onboarding/status` | ✅ yes | ✅ yes — `flexUserRoleValid([ROLES.all])` | ✅ yes — `SwarmsyOnboarding.status()` | ✅ yes — `server/__tests__/endpoints/swarmsy.test.js` | none |
| `POST /api/swarmsy/onboarding/create-hive` | ✅ yes | ✅ yes — `flexUserRoleValid([ROLES.all])` | ✅ yes — `SwarmsyOnboarding.createHive()` | ✅ yes | none |
| `POST /api/swarmsy/onboarding/ingest-required-docs` | ✅ yes | ✅ yes — `flexUserRoleValid([ROLES.all])` | ✅ yes — `SwarmsyOnboarding.ingestRequiredDocs()` | ✅ yes — `server/__tests__/utils/swarmsy/ingestRequiredDocs.test.js` | `COLLECTOR_OFFLINE` state surfaces 503 but no retry UI |

### Admin-only routes (`/api/admin/swarmsy/...`)

| Route | Implemented | User-safe | Used by frontend | Tested | Known gap |
|---|---|---|---|---|---|
| `POST /api/admin/swarmsy/workspace-preset/hive` | ✅ yes | ❌ admin-only | ❌ not called by user UI | ❌ no unit tests | no unit tests; superseded by user-safe route for normal flow |
| `GET /api/admin/swarmsy/required-docs/status` | ✅ yes | ❌ admin-only | ❌ not called by user UI | ❌ no unit tests | status endpoint used by admin panel only |
| `POST /api/admin/swarmsy/workspace-preset/hive/ingest-required-docs` | ✅ yes | ❌ admin-only | ❌ not called by user UI | ❌ no unit tests | full ingestion pipeline; user flow uses user-safe route instead |

**Important:** The frontend onboarding UI calls only user-safe `/api/swarmsy/...` routes. Admin routes are not called from any user-facing component.

---

## 4. UI Truth

### Onboarding UI (`SwarmsyFirstRunOnboarding/index.jsx`)

| Property | Status | Detail |
|---|---|---|
| Visible | ✅ yes | Renders on home when `mode === swarmsy_onboarding` |
| Gated correctly | ✅ yes | Falls through to `children` if mode is not `swarmsy_onboarding` |
| Uses user-safe routes | ✅ yes | Only calls `/api/swarmsy/...` endpoints |
| No admin route calls | ✅ confirmed | No calls to `/api/admin/...` in component tree |
| Uses pending-home-message handoff | ✅ yes | `sessionStorage.setItem(PENDING_HOME_MESSAGE, ...)` before navigate |
| Known risks | `sessionStorage` write failures surface as either toast errors (intake/campaign) or inline panel errors (memory lock/proof); no silent drops |

### Action Hub (`actionHub.js`)

| Property | Status | Detail |
|---|---|---|
| Visible | ✅ yes | Groups and action buttons render in onboarding surface |
| Gated correctly | ✅ yes | Each action uses `disabled` + `disabledReason` computed from readiness |
| Uses user-safe routes | ✅ yes | Inherits from onboarding status only |
| No admin route calls | ✅ confirmed | No admin routes invoked |
| Uses pending-home-message handoff | ✅ yes | All four handoff actions write to `sessionStorage` before navigate |
| Known risks | `isActionHubReady` requires all four sub-features ready simultaneously; may over-gate in edge states |

### Start Intake (`handoff.js`)

| Property | Status | Detail |
|---|---|---|
| Visible | ✅ yes | Rendered when HIVE ready and identity mode selected |
| Gated correctly | ✅ yes | `canStartSwarmsyIntake` checks workspace, readiness, doctrine, slug, and mode |
| Uses user-safe routes | ✅ yes | No additional route calls at handoff time |
| No admin route calls | ✅ confirmed | |
| Uses pending-home-message handoff | ✅ yes | |
| Known risks | Intake starter message is a chat prompt only; no automated 76-question flow exists beyond manual chat dialogue |

### Memory Lock (`memoryLock.js`)

| Property | Status | Detail |
|---|---|---|
| Visible | ✅ yes | Paste panel opens when HIVE ready |
| Gated correctly | ✅ yes | `canContinueFromMemoryLock` checks HIVE exists and readiness |
| Uses user-safe routes | ✅ yes | No additional routes |
| No admin route calls | ✅ confirmed | |
| Uses pending-home-message handoff | ✅ yes | |
| Known risks | No dedicated Memory Lock storage; pasted lock lives only in chat history after submission |

### Campaign Calendar (`campaignCalendar.js`)

| Property | Status | Detail |
|---|---|---|
| Visible | ✅ yes | Date picker and optional fields render when HIVE ready |
| Gated correctly | ✅ yes | `canUseCampaignCalendar` checks HIVE, readiness, doctrine |
| Uses user-safe routes | ✅ yes | |
| No admin route calls | ✅ confirmed | |
| Uses pending-home-message handoff | ✅ yes | |
| Known risks | Starter message explicitly says "Selected date only. Do not create Day 2." No 30-day calendar unless user asks. No scheduling persistence. |

### Proof Tracker (`proofTracker.js`)

| Property | Status | Detail |
|---|---|---|
| Visible | ✅ yes | Optional paste panel in onboarding |
| Gated correctly | ✅ yes | `canReviewProof` checks HIVE, readiness, doctrine, slug |
| Uses user-safe routes | ✅ yes | |
| No admin route calls | ✅ confirmed | |
| Uses pending-home-message handoff | ✅ yes | |
| Known risks | No Proof Tracker database; proof notes live only in chat history after submission |
