# SWARMSY Next PR Recommendation

Audit date: 2026-05-31
Based on: `SWARMSY_BUILD_READINESS_AUDIT.md`, `SWARMSY_DOCTRINE_COVERAGE_AUDIT.md`, `SWARMSY_RUNTIME_WIRING_AUDIT.md`

---

## Decision Tree

### Step 1 — Are doctrine and manifest consistent?

**Check:** Do all required doctrine groups have 100% file coverage, and do all manifest paths point to real files?

**Result:** ✅ Yes.

- 5 required groups, 44 required files, 0 missing.
- 2 optional groups, 17 optional files, 0 missing.
- 61 manifest paths, 61 verified present.
- No broken manifest references.
- No duplicate groups.

→ Proceed to Step 2.

---

### Step 2 — Are required docs ingested or ingestible?

**Check:** Is the ingestion route implemented, stable, and documented?

**Result:** ✅ Yes.

- `POST /api/admin/swarmsy/workspace-preset/hive/ingest-required-docs` is implemented.
- Route handles: collector-offline (503), already-attached dedup, per-file partial failures.
- Route is documented in `docs/swarmsy/runtime/SWARMSY_REQUIRED_DOCS_INGESTION_ROUTE.md`.
- Required docs status route (`GET /api/admin/swarmsy/required-docs/status`) is also implemented and working.

→ Proceed to Step 3.

---

### Step 3 — Are SWARMSY routes documented?

**Check:** Do the runtime routes have matching docs?

**Result:** ✅ Yes, with one caveat.

- `SWARMSY_HIVE_ADMIN_ROUTE.md` — accurate.
- `SWARMSY_REQUIRED_DOCS_INGESTION_ROUTE.md` — accurate.
- `SWARMSY_DEFAULT_WORKSPACE_PRESET_WIRING.md` — accurate.
- `SWARMSY_REQUIRED_DOCS_STATUS_HELPER.md` — **partially outdated**: still says "status-only, future PR for ingestion" when ingestion route has already landed. Needs correction but does not block the next PR.

→ Proceed to Step 4.

---

### Step 4 — Does the manifest miss any required files?

**Result:** ✅ No. Zero missing files.

→ Proceed to recommendation.

---

## Recommended Next PR

`Add SWARMSY first-run onboarding entrypoint with user-safe route strategy`

The first-run onboarding flow must not require a normal user to call admin-only endpoints directly.

The next PR should define or implement a user-safe onboarding route layer that can:

1. Detect whether the current user already has a SWARMSY HIVE workspace.
2. Offer to create/select that workspace through a user-safe route or an admin-only setup path.
3. Check required docs readiness through an allowed setup/status path.
4. Trigger docs ingestion only through a route the current user is authorized to use.
5. Preserve strict workspace ownership/permission checks.
6. Avoid exposing admin-only controls to normal users.

If user-safe route wiring is not implemented in that PR, scope the feature clearly as an admin/manager setup flow and do not present it as normal-user first-run onboarding.

---

## Risk Note

**Admin-only route dependency is a blocker for normal-user onboarding.** A user-facing onboarding wizard must either wrap the existing admin/setup actions in user-safe endpoints or remain explicitly admin/manager-only.

The existing routes (`POST /api/admin/swarmsy/workspace-preset/hive`, `GET /api/admin/swarmsy/required-docs/status`, `POST /api/admin/swarmsy/workspace-preset/hive/ingest-required-docs`) are admin/manager protected. Normal users cannot rely on them directly. The next PR must resolve this before presenting first-run onboarding as a normal-user feature.

---

## Secondary Actions (can follow but do not block)

These are not blockers for the next PR. They should be tracked for a future cleanup PR:

| Item | Action |
|---|---|
| `SWARMSY_REQUIRED_DOCS_STATUS_HELPER.md` says no ingestion route | Update doc to acknowledge ingestion route has landed |
| No tests for `applyWorkspacePreset.js` | Add unit tests (separate PR or alongside first-run PR) |
| No tests for admin SWARMSY routes | Add integration/unit tests (separate PR or alongside first-run PR) |

---

## What This PR Must Not Do

- Do not add new doctrine folders.
- Do not add new feature systems.
- Do not add runtime code beyond the first-run entrypoint.
- Do not add Spark Library expansions.
- Do not add Space Agent.
- Do not add old SWARMSY salvage.
- Do not change package or build files.
- Do not add dependencies.
- Do not break generic AnythingLLM behavior for non-SWARMSY users.
