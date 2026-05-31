# SWARMSY User-Safe Required Docs Ingestion Route

This runtime slice adds a normal-user-safe route for loading required SWARMSY doctrine docs into the current user's own HIVE.

It does **not** add full onboarding UI, dashboard flows, new doctrine docs, optional Spark Library ingestion, or admin route exposure.

## Route

- **Method:** `POST`
- **Path:** `/api/swarmsy/onboarding/ingest-required-docs`

## Auth Requirement

This route uses the existing authenticated non-admin route convention:

- `validatedRequest`
- `flexUserRoleValid([ROLES.all])`

A normal authenticated user can call it.
It does **not** require admin or manager access.

## Targeting Rules

- The route resolves the current authenticated user/session.
- It targets only that user's own `SWARMSY HIVE`.
- In single-user mode, if no session user exists, it reuses the same global HIVE lookup behavior as the other onboarding routes.
- It does **not** accept `workspaceId` or `workspaceSlug`.
- It does **not** let a normal user target another user's workspace.

## Ingestion Scope

- Only required doctrine docs are ingested through this route.
- Optional advanced docs are not ingested here unless they are ever intentionally moved into the required-docs ingestion helper.
- The route reuses the shared SWARMSY required-docs ingestion logic used by the admin ingestion path.
- Successful ingestion keeps the persisted workspace document source intact so normal AnythingLLM document operations can still read the document later.

## Response Shape

### Success

```json
{
  "success": true,
  "workspace": {
    "exists": true,
    "id": 1,
    "slug": "swarmsy-hive",
    "name": "SWARMSY HIVE"
  },
  "ingested": [],
  "skipped": [],
  "failed": [],
  "partial": false,
  "message": "SWARMSY required docs ingested successfully.",
  "nextAction": {
    "type": "check_onboarding_status",
    "label": "Check HIVE readiness",
    "message": "Doctrine docs were processed. Check onboarding status before starting intake."
  }
}
```

### No HIVE

```json
{
  "success": false,
  "workspace": {
    "exists": false
  },
  "message": "No SWARMSY HIVE workspace exists for this user yet.",
  "nextAction": {
    "type": "create_hive",
    "label": "Create SWARMSY HIVE"
  }
}
```

### Collector Offline

```json
{
  "success": false,
  "errorCode": "COLLECTOR_OFFLINE",
  "message": "Document processing API is not online."
}
```

### Partial Failure

When one or more required docs fail collection or embedding, the route still returns the per-file `ingested`, `skipped`, and `failed` arrays with:

- `success: true`
- `partial: true`
- message: `SWARMSY required docs ingestion completed with partial failures.`

Clients should inspect the `failed` array, then follow the `nextAction` by checking onboarding status again.

## No Full UI Yet

This PR only adds the backend onboarding route.
It does **not** add the full onboarding UI, dashboard, or admin-route wiring for normal-user pages.

## Next Step After Ingestion

After this route completes, clients should call:

- `GET /api/swarmsy/onboarding/status`

to confirm required doctrine readiness before starting intake.

## Curl Example

```bash
AUTH_TOKEN="<YOUR_USER_JWT>"

curl http://localhost:3001/api/swarmsy/onboarding/ingest-required-docs \
  -X POST \
  -H "Authorization: Bearer $AUTH_TOKEN"
```
