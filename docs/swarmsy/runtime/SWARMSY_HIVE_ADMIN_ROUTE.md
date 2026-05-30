# SWARMSY HIVE Admin Route

This document describes the runtime admin/API route that creates the `SWARMSY HIVE` workspace preset on demand.

## Route

- **Method:** `POST`
- **Path:** `/api/admin/swarmsy/workspace-preset/hive`
- **Preset:** `SWARMSY HIVE`

## Auth and Admin Requirement

This route uses the existing authenticated admin middleware pattern:

- `validatedRequest`
- `flexUserRoleValid([ROLES.admin, ROLES.manager])`

Behavior:

- In multi-user mode, only `admin` and `manager` roles can call it.
- In single-user mode, it remains authenticated and available through the existing validated request flow.

## Request Shape

No request body is required.

## Response Shape

Success response:

```json
{
  "success": true,
  "workspace": {},
  "message": null,
  "preset": "SWARMSY HIVE",
  "suggestedMessages": []
}
```

Failure response:

```json
{
  "success": false,
  "workspace": null,
  "message": "Reason here",
  "preset": "SWARMSY HIVE"
}
```

## Runtime Behavior

The route:

1. Resolves the current authenticated user (if present).
2. Checks for an existing `SWARMSY HIVE` workspace for the same creator:
   - In multi-user mode, by workspace name plus workspace-user relationship.
   - In single-user mode, by workspace name.
3. Returns the existing workspace if found (no silent duplicate creation).
4. Otherwise calls `createSwarmsyHiveWorkspace(creatorId)`.
5. Returns the refreshed workspace from the preset utility.
6. Returns suggested messages from `WorkspaceSuggestedMessages.getMessages(slug)`.

## Duplicate Behavior

- Duplicate creation for the same creator is prevented by checking existing workspace ownership and name before invoking preset creation.
- If one already exists, the route returns `success: true` with the existing workspace and a clear message.

## Manual Test Steps

1. Start the backend.
2. Authenticate as an admin or manager.
3. Call:
   - `POST /api/admin/swarmsy/workspace-preset/hive`
4. Verify response includes:
   - `success: true`
   - `preset: "SWARMSY HIVE"`
   - `workspace.name === "SWARMSY HIVE"`
5. Verify workspace settings:
   - SPARKY system prompt is present on workspace.
   - Suggested messages are present.
6. Call the same endpoint again with the same authenticated user and verify:
   - No new duplicate workspace is created.
   - Existing workspace is returned with a duplicate-safe message.

## Rollback Notes

To roll back this runtime wiring:

1. Remove route `POST /api/admin/swarmsy/workspace-preset/hive` from `server/endpoints/admin.js`.
2. Remove this documentation file.
3. Keep `applyWorkspacePreset.js` and preset JSON if docs-only availability is still desired.

No database rollback is required.

## What Remains for Future Onboarding Wizard

This PR adds an on-demand runtime admin route only.

Still pending:

- First-run onboarding wizard integration to call this route as an explicit user action.
- Optional UX around selecting SWARMSY mode during guided setup.
