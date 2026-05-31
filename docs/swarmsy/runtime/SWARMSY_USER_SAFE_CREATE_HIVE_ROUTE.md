# SWARMSY User-Safe Create HIVE Route

This runtime slice adds a normal-user-safe route for creating a SWARMSY HIVE workspace without exposing admin setup routes.

It does **not** ingest doctrine docs in this PR, and it does **not** add full onboarding UI.

## Route

- **Method:** `POST`
- **Path:** `/api/swarmsy/onboarding/create-hive`

## Auth Requirement

This route uses the existing authenticated non-admin route convention:

- `validatedRequest`
- `flexUserRoleValid([ROLES.all])`

In multi-user mode, the route resolves the authenticated user from session/JWT and scopes create/existing checks to that user.
In single-user mode, if no session user is attached, the route creates/reuses a global SWARMSY HIVE (`creatorId = null`).

## Request Shape

No request body is required.

## Response Shape

### Existing HIVE

```json
{
  "success": true,
  "created": false,
  "workspace": {
    "exists": true,
    "id": 1,
    "slug": "swarmsy-hive",
    "name": "SWARMSY HIVE"
  },
  "nextAction": {
    "type": "check_onboarding_status",
    "label": "Continue setup",
    "message": "Your SWARMSY HIVE already exists. Check onboarding status before starting intake."
  }
}
```

### New HIVE

```json
{
  "success": true,
  "created": true,
  "workspace": {
    "exists": true,
    "id": 1,
    "slug": "swarmsy-hive",
    "name": "SWARMSY HIVE"
  },
  "nextAction": {
    "type": "check_onboarding_status",
    "label": "Continue setup",
    "message": "SWARMSY HIVE was created. Next, check doctrine readiness before starting intake."
  }
}
```

### Failure

```json
{
  "success": false,
  "created": false,
  "workspace": null,
  "message": "Reason here"
}
```

## Idempotency and Duplicate Safety

- The route uses a per-user route-local lock to handle double-click/retry/concurrent create requests safely.
- If one request is creating the HIVE, concurrent requests for the same user wait, then re-check and return the existing HIVE.
- The route is idempotent for a given authenticated user and prevents duplicate user-owned HIVE creation from concurrent requests.

## Preset and Content Preservation

- Workspace creation uses the SWARMSY HIVE preset utility.
- SPARKY system prompt is explicitly persisted by preset utility logic.
- Starter suggested messages are saved by preset utility logic.

## Scope Limits in This PR

- No doctrine docs ingestion from this route.
- No full onboarding UI or dashboard.
- No admin route exposure for normal user flow.
- Admin-only setup routes remain admin/manager only:
  - `POST /api/admin/swarmsy/workspace-preset/hive`
  - `GET /api/admin/swarmsy/required-docs/status`
  - `POST /api/admin/swarmsy/workspace-preset/hive/ingest-required-docs`

## Next Step After Create

After create (or if already exists), clients should call:

- `GET /api/swarmsy/onboarding/status`

to resolve doctrine readiness and next safe onboarding action.

## Curl Example

```bash
AUTH_TOKEN="<YOUR_USER_JWT>"

curl http://localhost:3001/api/swarmsy/onboarding/create-hive \
  -X POST \
  -H "Authorization: ******"
```
