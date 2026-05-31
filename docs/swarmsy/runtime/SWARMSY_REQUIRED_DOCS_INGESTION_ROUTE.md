# SWARMSY Required Docs Ingestion Route

This runtime slice adds an admin/manager-only route to ingest SWARMSY required doctrine docs into an existing SWARMSY HIVE workspace on demand.

## Route

- **Method:** `POST`
- **Path:** `/api/admin/swarmsy/workspace-preset/hive/ingest-required-docs`

## Auth Requirement

This route uses existing authenticated admin middleware:

- `validatedRequest`
- `flexUserRoleValid([ROLES.admin, ROLES.manager])`

## Request Body

You may target a workspace by `workspaceId` or `workspaceSlug`.

If neither is provided, the route targets the current creator's existing SWARMSY HIVE workspace.

> **Cross-creator targeting**: admins and managers may target any workspace by `workspaceId` or `workspaceSlug`, including workspaces owned by other users. The route still enforces that the resolved workspace is the `SWARMSY HIVE` preset, but it does not restrict targeting to workspaces owned by the caller.

```json
{
  "workspaceId": 12
}
```

```json
{
  "workspaceSlug": "swarmsy-hive"
}
```

```json
{}
```

## Success Response Shape

```json
{
  "success": true,
  "workspace": {
    "id": 12,
    "name": "SWARMSY HIVE",
    "slug": "swarmsy-hive"
  },
  "ingested": [],
  "skipped": [],
  "failed": [],
  "partial": false,
  "message": "SWARMSY required docs ingested successfully."
}
```

## Response Behaviors

- `ingested`: required docs successfully attached.
- `skipped`: docs not ingested because they were unavailable/not loadable or already attached.
- `failed`: per-file failures (read/collect/embed) captured without aborting the run.
- `partial`: `true` when one or more files failed at the collect or embed stage.

### Duplicate/Skip Behavior

If existing document metadata already shows the same SWARMSY required doctrine source (`chunkSource`), that file is skipped as `already_attached`.

If required docs are not present/loadable, they are skipped with `not_loadable` and include the status error.

### Partial Failure Behavior

One file failure does not stop the remaining files.

If some files ingest and some fail:

```json
{
  "success": true,
  "partial": true,
  "message": "SWARMSY required docs ingestion completed with partial failures."
}
```

### No Available Docs

If no required docs are loadable, response is a clear non-fake success:

```json
{
  "success": true,
  "ingested": [],
  "failed": [],
  "message": "No SWARMSY required docs are currently available to ingest."
}
```

### Already Attached

If all loadable required docs are already attached:

```json
{
  "success": true,
  "ingested": [],
  "failed": [],
  "message": "All loadable SWARMSY required docs are already attached to this workspace."
}
```

## Error Responses

### Collector Offline

```json
{
  "success": false,
  "errorCode": "COLLECTOR_OFFLINE",
  "message": "Document processing API is not online."
}
```

### Target Workspace Missing

Returns `404` with a target-specific message.

### Target Not SWARMSY HIVE

Returns `400` if the resolved workspace is not `SWARMSY HIVE`.

## Manual curl Examples

```bash
AUTH_TOKEN="<YOUR_ADMIN_JWT>"
AUTH_HEADER="TOKEN"

curl -X POST http://localhost:3001/api/admin/swarmsy/workspace-preset/hive/ingest-required-docs \
  -H "Authorization: ${AUTH_HEADER}" \
  -H "Content-Type: application/json" \
  -d '{"workspaceSlug":"swarmsy-hive"}'
```

Set `AUTH_HEADER` to your bearer token header value before running the command.

```bash
AUTH_TOKEN="<YOUR_ADMIN_JWT>"
AUTH_HEADER="TOKEN"

curl -X POST http://localhost:3001/api/admin/swarmsy/workspace-preset/hive/ingest-required-docs \
  -H "Authorization: ${AUTH_HEADER}" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Rollback Notes

Rollback scope is runtime-only:

1. Remove route registration in `server/endpoints/admin.js`.
2. Remove this documentation file.

No schema/database rollback is required.
