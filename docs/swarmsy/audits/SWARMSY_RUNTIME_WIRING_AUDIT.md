# SWARMSY Runtime Wiring Audit

Audit date: 2026-05-31

---

## Audited Pieces

### Config files

| File | Present | Status |
|---|---|---|
| `server/config/swarmsy/SWARMSY_HIVE_WORKSPACE_PRESET.json` | ✓ | working |
| `server/config/swarmsy/SWARMSY_REQUIRED_DOCS_MANIFEST.json` | ✓ | working |

### Utility files

| File | Present | Status |
|---|---|---|
| `server/utils/swarmsy/applyWorkspacePreset.js` | ✓ | working |
| `server/utils/swarmsy/requiredDocs.js` | ✓ | working |

### Test files

| File | Present | Lines | Coverage |
|---|---|---|---|
| `server/__tests__/utils/swarmsy/requiredDocs.test.js` | ✓ | 460 | status helper fully tested |
| Tests for `applyWorkspacePreset.js` | ✗ | — | missing |
| Tests for admin SWARMSY routes | ✗ | — | missing |

### Runtime docs

| File | Present | Accurate? |
|---|---|---|
| `docs/swarmsy/runtime/SWARMSY_DEFAULT_WORKSPACE_PRESET_WIRING.md` | ✓ | yes |
| `docs/swarmsy/runtime/SWARMSY_HIVE_ADMIN_ROUTE.md` | ✓ | yes |
| `docs/swarmsy/runtime/SWARMSY_REQUIRED_DOCS_STATUS_HELPER.md` | ✓ | **partially outdated** — see notes |
| `docs/swarmsy/runtime/SWARMSY_REQUIRED_DOCS_INGESTION_ROUTE.md` | ✓ | yes |

---

## Route Inventory

### `POST /api/admin/swarmsy/workspace-preset/hive`

| Property | Value |
|---|---|
| Route path | `/api/admin/swarmsy/workspace-preset/hive` |
| Method | POST |
| Auth | `validatedRequest` + `flexUserRoleValid([ROLES.admin, ROLES.manager])` |
| Request shape | No body required |
| Response shape | `{ success, workspace, message, preset, suggestedMessages }` |
| Implemented | ✅ yes — `server/endpoints/admin.js` |
| Doc present | ✅ yes — `docs/swarmsy/runtime/SWARMSY_HIVE_ADMIN_ROUTE.md` |
| Tests present | ✗ missing |
| Known gaps | Per-creator lock is route-local only; no DB-level uniqueness constraint yet |

### `GET /api/admin/swarmsy/required-docs/status`

| Property | Value |
|---|---|
| Route path | `/api/admin/swarmsy/required-docs/status` |
| Method | GET |
| Auth | `validatedRequest` + `flexUserRoleValid([ROLES.admin, ROLES.manager])` |
| Request shape | None |
| Response shape | `{ success, manifest, docsRoot, docsRootAvailable, docsRootMessage, groups, summary, documentsToIngest }` |
| Implemented | ✅ yes — `server/endpoints/admin.js` |
| Doc present | ✅ yes — `docs/swarmsy/runtime/SWARMSY_REQUIRED_DOCS_STATUS_HELPER.md` |
| Tests present | ✅ yes — `requiredDocs.test.js` covers the helper function; no HTTP route tests |
| Known gaps | HTTP route itself is not tested; `SWARMSY_REQUIRED_DOCS_STATUS_HELPER.md` still says "status-only, future PR for ingestion" but ingestion route has since landed |

### `POST /api/admin/swarmsy/workspace-preset/hive/ingest-required-docs`

| Property | Value |
|---|---|
| Route path | `/api/admin/swarmsy/workspace-preset/hive/ingest-required-docs` |
| Method | POST |
| Auth | `validatedRequest` + `flexUserRoleValid([ROLES.admin, ROLES.manager])` |
| Request shape | `{ workspaceId?: number }` or `{ workspaceSlug?: string }` or `{}` |
| Response shape | `{ success, workspace, ingested, skipped, failed, partial, message }` |
| Implemented | ✅ yes — `server/endpoints/admin.js` |
| Doc present | ✅ yes — `docs/swarmsy/runtime/SWARMSY_REQUIRED_DOCS_INGESTION_ROUTE.md` |
| Tests present | ✗ missing |
| Known gaps | Depends on external collector being online. `COLLECTOR_OFFLINE` is surfaced correctly as a 503 with `errorCode`. No unit/integration tests for the ingestion pipeline path. |

---

## Helper and Config Detail

### `applyWorkspacePreset.js`

| Capability | Status |
|---|---|
| `loadSwarmsyHivePreset()` — loads JSON preset | working |
| `createSwarmsyHiveWorkspace(creatorId)` — creates workspace via `Workspace.new()` | working |
| SPARKY prompt re-applied via `Workspace.update()` after `Workspace.new()` | working |
| Workspace refreshed via `Workspace.get({ id })` before returning | working |
| Suggested messages seeded via `WorkspaceSuggestedMessages.saveAll()` | working |
| Tests | missing |
| Auto-invoked on boot | no — intentionally on-demand only |

### `requiredDocs.js`

| Capability | Status |
|---|---|
| `loadSwarmsyRequiredDocsManifest()` | working |
| `getSwarmsyRequiredDocsStatus()` | working |
| `getSwarmsyRequiredDocPaths()` | working |
| `SWARMSY_DOCTRINE_DOCS_ROOT` env override | working |
| Path containment guard (`isPathInsideRoot` via `path.relative`) | working |
| Symlink rejection (`pathHasSymlinkComponent`) | working |
| Path traversal rejection | working |
| Absolute path rejection | working |
| `COLLECTOR_OFFLINE` error surfaced by ingestion route | working |
| Tests (460 lines) | working |

### `SWARMSY_HIVE_WORKSPACE_PRESET.json`

| Field | Present |
|---|---|
| `presetName: "SWARMSY HIVE"` | ✓ |
| `workspaceName: "SWARMSY HIVE"` | ✓ |
| SPARKY system prompt (full, multi-paragraph) | ✓ |
| 8 suggested messages | ✓ |
| 14 project sections | ✓ |
| `requiredDoctrineDocuments` (5 paths) | ✓ |
| Face/Hidden Identity first-run directions | ✓ |
| Proof-safe rules | ✓ |

### `SWARMSY_REQUIRED_DOCS_MANIFEST.json`

| Field | Present |
|---|---|
| 7 groups total | ✓ |
| 5 required groups | ✓ |
| 2 optional groups | ✓ |
| 61 total paths | ✓ |
| All paths valid (no broken refs) | ✓ |
| No duplicate groups | ✓ |
| No absolute paths | ✓ |

---

## Runtime Wiring Truth

| Piece | Truth |
|---|---|
| SWARMSY HIVE workspace preset config | **working** |
| `applyWorkspacePreset.js` workspace creation utility | **working** |
| SPARKY prompt persistence after `Workspace.new()` | **working** |
| Refreshed workspace returned from creation | **working** |
| Admin route: create SWARMSY HIVE workspace | **working** |
| Required docs manifest | **working** |
| Required docs status helper | **working** |
| Required docs status route | **working** |
| Required docs ingestion route | **working** |
| Route docs (4 runtime docs) | **working** |
| Tests: `requiredDocs.js` helper | **working** |
| Tests: `applyWorkspacePreset.js` | **missing** |
| Tests: admin routes (all 3 SWARMSY routes) | **missing** |
| First-run onboarding entrypoint | **planned** |
| Face/Hidden Identity UI flow | **planned** |
| Dashboard project sections | **planned** |
| Memory lock viewer | **planned** |
| Boot-time auto-seeding | **planned** (intentionally deferred) |
| `SWARMSY_REQUIRED_DOCS_STATUS_HELPER.md` accuracy | **partial** — "future PR for ingestion" is outdated; ingestion route has landed |

---

## Known Gaps Summary

| Gap | Risk | Action |
|---|---|---|
| `SWARMSY_REQUIRED_DOCS_STATUS_HELPER.md` says "status-only, future PR for ingestion" | medium | Update doc to reflect that ingestion route has since landed |
| No tests for `applyWorkspacePreset.js` | medium | Add unit tests for `createSwarmsyHiveWorkspace` covering prompt persistence, suggested messages, and duplicate workspace guard |
| No tests for admin SWARMSY routes | medium | Add HTTP route integration/unit tests for all three SWARMSY admin routes |
| Ingestion route depends on external collector | informational | Already handled correctly with `COLLECTOR_OFFLINE` 503. No further action needed unless collector availability checking is added to status route. |
| No DB-level uniqueness constraint for HIVE workspace | low | Route-local per-creator lock is safe for now. Track as future hardening. |
