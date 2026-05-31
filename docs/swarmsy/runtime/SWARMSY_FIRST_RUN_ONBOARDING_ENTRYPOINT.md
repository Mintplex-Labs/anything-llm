# SWARMSY First-Run Onboarding Entrypoint

This runtime slice adds user-safe onboarding routes for SWARMSY first-run flows.

It does **not** add the full onboarding wizard, dashboard UI, Spark Library changes, or new doctrine docs.

## Route

- **Method:** `GET`
- **Path:** `/api/swarmsy/onboarding/status`

## Auth Requirement

This route uses the existing authenticated route convention:

- `validatedRequest`
- `flexUserRoleValid([ROLES.all])`

The route is available to a normal authenticated user. It does **not** require admin or manager role access.

## What It Returns

The route reports:

1. Whether the current authenticated user already has a `SWARMSY HIVE` workspace.
2. Whether required doctrine docs appear available on disk.
3. Whether required doctrine docs still appear pending ingestion for that workspace.
4. Whether the workspace looks `ready`, `underloaded`, or `setup_needed`.
5. The next safe action for a future onboarding UI.

## User-Safe Route Strategy

Existing admin SWARMSY routes remain setup/admin tools:

- `POST /api/admin/swarmsy/workspace-preset/hive`
- `GET /api/admin/swarmsy/required-docs/status`
- `POST /api/admin/swarmsy/workspace-preset/hive/ingest-required-docs`

Normal onboarding must use user-safe endpoints instead of calling `/api/admin/...` directly.

User-safe onboarding routes:

- `GET /api/swarmsy/onboarding/status`
- `POST /api/swarmsy/onboarding/create-hive`

This route reads the existing required-docs status helper and user-owned workspace state without exposing admin-only controls to normal users.

The create route remains idempotent and should be followed by status checks to confirm doctrine readiness.

- Docs: [`SWARMSY_USER_SAFE_CREATE_HIVE_ROUTE.md`](./SWARMSY_USER_SAFE_CREATE_HIVE_ROUTE.md)

## Response Shape

Example when the current user already has a HIVE workspace but doctrine ingestion is still pending:

```json
{
  "success": true,
  "mode": "swarmsy_onboarding",
  "workspace": {
    "exists": true,
    "id": 1,
    "slug": "swarmsy-hive",
    "name": "SWARMSY HIVE",
    "state": "underloaded",
    "ready": false
  },
  "doctrine": {
    "statusAvailable": true,
    "docsRootAvailable": true,
    "requiredMissing": 0,
    "requiredNonLoadable": 0,
    "optionalMissing": 0,
    "requiredLoadable": 44,
    "requiredAttached": 0,
    "requiredPendingIngestion": 44,
    "ingestionRequired": true,
    "note": "Docs status is available. Ingestion state must be confirmed before claiming HIVE is fully loaded."
  },
  "nextAction": {
    "type": "continue_or_load_docs",
    "label": "Continue setup",
    "message": "Your SWARMSY HIVE exists. Next, confirm required docs are loaded before starting intake."
  }
}
```

Example when the current user has no HIVE workspace yet:

```json
{
  "success": true,
  "mode": "swarmsy_onboarding",
  "workspace": {
    "exists": false,
    "state": "setup_needed",
    "ready": false
  },
  "doctrine": {
    "statusAvailable": true,
    "docsRootAvailable": true,
    "requiredMissing": 0,
    "requiredNonLoadable": 0,
    "optionalMissing": 0,
    "requiredLoadable": 44,
    "requiredAttached": 0,
    "requiredPendingIngestion": 44,
    "ingestionRequired": false,
    "note": "Docs status is available. Create or select a SWARMSY HIVE before loading doctrine."
  },
  "nextAction": {
    "type": "create_hive",
    "label": "Create SWARMSY HIVE",
    "message": "No SWARMSY HIVE workspace exists for this user yet."
  }
}
```

## Manual Verification

### Authenticated user

```bash
AUTH_TOKEN="<YOUR_USER_JWT>"

curl http://localhost:3001/api/swarmsy/onboarding/status \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

Replace `<YOUR_USER_JWT>` with your user JWT.

### Unauthenticated request

```bash
curl http://localhost:3001/api/swarmsy/onboarding/status
```

Expected result: reject the request with the existing auth middleware response.

### Admin/setup reminder

If doctrine docs are unavailable on disk or still pending ingestion, normal user UI must not call admin routes directly. Use an authorized setup path instead.
