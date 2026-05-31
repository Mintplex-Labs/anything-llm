# SWARMSY Build Readiness Audit

Audit date: 2026-05-31
Branch: post-PRs-1–10 checkpoint

---

## 1. Executive Summary

### Already merged

| Area | Status |
|---|---|
| Living Icon Engine docs (prompts 00–10) | docs/spec complete, manifest registered |
| SPARKY Persona system prompt | docs/spec complete, manifest registered |
| Operating Layer docs | docs/spec complete, manifest registered |
| Disruption Engine docs | docs/spec complete, manifest registered |
| App Mode docs | docs/spec complete, manifest registered |
| Spark Library docs | docs/spec complete, manifest registered (optional) |
| SPARKY Operator Playbooks | docs/spec complete, manifest registered (optional) |
| SWARMSY HIVE workspace preset JSON | runtime/config — file exists and is loaded |
| `applyWorkspacePreset.js` utility | runtime/config — workspace creation wired |
| `SWARMSY_REQUIRED_DOCS_MANIFEST.json` | runtime/config — all paths verified present |
| `requiredDocs.js` status helper | runtime/config — status helper wired |
| `POST /api/admin/swarmsy/workspace-preset/hive` | working runtime route |
| `GET /api/admin/swarmsy/required-docs/status` | working runtime route |
| `POST /api/admin/swarmsy/workspace-preset/hive/ingest-required-docs` | working runtime route |
| Runtime route docs (4 files) | docs/spec complete |
| Tests for `requiredDocs.js` | 460-line test file present |

### Runtime-wired

- SWARMSY HIVE workspace creation (on-demand admin route, not boot-time).
- SPARKY system prompt persistence after `Workspace.new()`.
- Refreshed workspace return after prompt update.
- Required docs status route.
- Required docs ingestion route (collector + embed pipeline).

### Docs/spec only — not runtime-wired

- First-run onboarding wizard / entrypoint UI.
- Face Identity / Hidden Identity choice flow (UI).
- Project sections surfaced in dashboard (UI).
- Memory lock viewer (UI).
- Boot-time auto-seeding of SWARMSY HIVE.
- SPARKY persona name surfaced in AnythingLLM UI settings.

### Optional advanced doctrine

- Spark Library (`required: false` in manifest) — 8 docs, folder present.
- SPARKY Operator Playbooks (`required: false` in manifest) — 9 docs, folder present.

### Not built yet

- First-run onboarding entrypoint route/component.
- Face/Hidden Identity selection UI flow.
- Dashboard project sections view.
- Memory lock viewer.
- Boot-time seeding guard.

---

## 2. Current Layer Status

### Living Icon Engine prompt tree

| Item | Status |
|---|---|
| `docs/swarmsy/living-icon-engine/README.md` | docs/spec complete |
| `docs/swarmsy/living-icon-engine/PROMPT_TREE_INDEX.md` | docs/spec complete |
| `docs/swarmsy/living-icon-engine/prompts/00–10` (11 files) | docs/spec complete |
| Manifest group `living-icon-engine` | runtime/config helper — all 13 paths verified present |
| Tests for ingestion | missing |

### SPARKY persona

| Item | Status |
|---|---|
| `docs/swarmsy/living-icon-engine/personas/11_SWARMSY_SPARKY_PERSONA_SYSTEM_PROMPT.md` | docs/spec complete |
| Manifest group `sparky-persona` | runtime/config helper — 1 path verified present |
| SPARKY prompt wired into workspace preset | working runtime (`applyWorkspacePreset.js`) |
| SPARKY prompt persistence after `Workspace.new()` | working runtime (`Workspace.update` + `Workspace.get` refresh) |
| SPARKY persona surfaced in UI settings | planned only |

### Operating Layer

| Item | Status |
|---|---|
| `docs/swarmsy/operating-layer/` (10 files) | docs/spec complete |
| Manifest group `operating-layer` | runtime/config helper — all 10 paths verified present |

### Disruption Engine

| Item | Status |
|---|---|
| `docs/swarmsy/disruption-engine/` (9 files) | docs/spec complete |
| Manifest group `disruption-engine` | runtime/config helper — all 9 paths verified present |

### App Mode

| Item | Status |
|---|---|
| `docs/swarmsy/app-mode/` (11 files) | docs/spec complete |
| Manifest group `app-mode` | runtime/config helper — all 11 paths verified present |
| First-run onboarding spec (`SWARMSY_FIRST_RUN_ONBOARDING_SPEC.md`) | docs/spec complete |
| First-run onboarding entrypoint route | planned only |
| Generic AnythingLLM demotion rules | docs/spec complete |

### SWARMSY HIVE workspace preset

| Item | Status |
|---|---|
| `server/config/swarmsy/SWARMSY_HIVE_WORKSPACE_PRESET.json` | working runtime |
| Workspace name, system prompt, 8 suggested messages, 14 sections | working runtime |
| `server/utils/swarmsy/applyWorkspacePreset.js` | working runtime |
| `createSwarmsyHiveWorkspace(creatorId)` | working runtime |
| `loadSwarmsyHivePreset()` | working runtime |
| Tests for `applyWorkspacePreset.js` | missing |

### SWARMSY HIVE admin creation route

| Item | Status |
|---|---|
| `POST /api/admin/swarmsy/workspace-preset/hive` | working runtime |
| Idempotency lock (per-creator) | working runtime |
| Existing workspace re-check inside lock | working runtime |
| `suggestedMessages` returned in response | working runtime |
| Route doc (`SWARMSY_HIVE_ADMIN_ROUTE.md`) | docs/spec complete |
| Tests for admin route | missing |

### Required docs manifest / status helper

| Item | Status |
|---|---|
| `server/config/swarmsy/SWARMSY_REQUIRED_DOCS_MANIFEST.json` | working runtime |
| `server/utils/swarmsy/requiredDocs.js` | working runtime |
| `getSwarmsyRequiredDocsStatus()` | working runtime |
| `getSwarmsyRequiredDocPaths()` | working runtime |
| `SWARMSY_DOCTRINE_DOCS_ROOT` env override | working runtime |
| Path containment guard (`isPathInsideRoot`) | working runtime |
| Symlink rejection | working runtime |
| `GET /api/admin/swarmsy/required-docs/status` | working runtime |
| Tests for `requiredDocs.js` | working runtime (460 lines) |
| `SWARMSY_REQUIRED_DOCS_STATUS_HELPER.md` doc | **needs correction** — says status-only/future ingestion, but ingestion route is already merged |

### Required docs ingestion route

| Item | Status |
|---|---|
| `POST /api/admin/swarmsy/workspace-preset/hive/ingest-required-docs` | working runtime |
| Collector online check (`COLLECTOR_OFFLINE`) | working runtime |
| Per-file partial-failure handling | working runtime |
| Already-attached dedup via `chunkSource` | working runtime |
| `SWARMSY_REQUIRED_DOCS_INGESTION_ROUTE.md` doc | docs/spec complete |
| Tests for ingestion route | missing |

### Spark Library

| Item | Status |
|---|---|
| `docs/swarmsy/spark-library/` (8 files) | docs/spec complete |
| Manifest group `spark-library` (`required: false`) | optional doctrine |
| Blocks first-run? | no — optional flag confirmed |

### SPARKY Operator Playbooks

| Item | Status |
|---|---|
| `docs/swarmsy/sparky-operator/` (9 files) | docs/spec complete |
| Manifest group `sparky-operator` (`required: false`) | optional doctrine |
| Blocks first-run? | no — optional flag confirmed |

### Optional advanced doctrine registration

| Item | Status |
|---|---|
| Both optional groups registered in manifest with `required: false` | working runtime/config |
| Neither optional group included in first-run readiness check | confirmed safe |

---

## 3. Do Not Overclaim

### `docs/swarmsy/runtime/SWARMSY_REQUIRED_DOCS_STATUS_HELPER.md`

**Problem:** This doc states:

> "This change is status-only. It does not add a POST ingestion route."
> "A future PR will add ingestion behavior."

**Reality:** The ingestion route (`POST /api/admin/swarmsy/workspace-preset/hive/ingest-required-docs`) has since been merged. The status helper doc is factually outdated. It describes a pre-ingestion state that no longer reflects the codebase.

**Label:** needs correction

**Action needed:** Update `SWARMSY_REQUIRED_DOCS_STATUS_HELPER.md` to acknowledge that the ingestion route is implemented and documented separately in `SWARMSY_REQUIRED_DOCS_INGESTION_ROUTE.md`.

---

No other doc was found to claim something is working when it is only planned/docs-only. The workspace preset wiring doc (`SWARMSY_DEFAULT_WORKSPACE_PRESET_WIRING.md`) accurately distinguishes working runtime from docs-only phases.

---

## 4. Immediate Risk List

| Risk | Severity | Detail |
|---|---|---|
| `SWARMSY_REQUIRED_DOCS_STATUS_HELPER.md` says no ingestion route when one exists | medium | Stale doc. Misleads future contributors. Needs update. |
| No tests for `applyWorkspacePreset.js` | medium | `createSwarmsyHiveWorkspace` and `loadSwarmsyHivePreset` are untested. Regression risk if Workspace API changes. |
| No tests for SWARMSY admin routes | low-medium | `POST /hive`, `GET /required-docs/status`, `POST /ingest-required-docs` are untested. |
| No broken manifest paths | none | All 44 manifest paths (required) + 17 optional paths were verified present in the filesystem. |
| No missing required docs | none | All required groups have exact file count match between manifest and filesystem. |
| No docs referencing non-existent files | none | Runtime docs reference only files confirmed present. |
| Ingestion route has no test coverage | medium | The ingestion pipeline (collector + embed) path is untested at unit or integration level. |
| Boot-time seeding not present | informational | Intentional. On-demand only. Not a risk unless first-run UX requires auto-seeding. |
| Optional docs are not blocked | none | `spark-library` and `sparky-operator` have `required: false`. Confirmed not blocking first-run. |

---

## 5. Current Best Next Step

**Recommended next runtime PR:**

> Add SWARMSY first-run onboarding entrypoint

**Why:**

- All required doctrine doc groups are present and manifest-registered.
- Required docs status route is live and returns accurate readiness data.
- Ingestion route is live and can be called during or after first-run setup.
- SWARMSY HIVE workspace creation route is live and idempotent.
- The only missing piece before a user can meaningfully enter SWARMSY mode is a first-run entrypoint.

**Pre-condition check:**

- ✓ Required docs status route is stable.
- ✓ Ingestion route is implemented and documented.
- ✓ HIVE workspace preset creation route is implemented.
- ✓ Doctrine manifest is consistent with filesystem.

**Conclusion:** The pre-conditions are met. Proceed with the first-run onboarding entrypoint PR.

See `SWARMSY_NEXT_PR_RECOMMENDATION.md` for the full decision tree and specification.
