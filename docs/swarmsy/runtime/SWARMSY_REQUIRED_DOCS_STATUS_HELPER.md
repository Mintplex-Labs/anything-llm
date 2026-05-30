# What Was Added — Required Docs Status Helper

This runtime addition is status-only. It reports whether required SWARMSY doctrine docs are present, readable, grouped correctly, and ready to be ingested later.

It does not ingest documents into any workspace.

## Purpose

Provide a truthful status view for SWARMSY doctrine docs so runtime checks can verify readiness before a future ingestion PR.

## Manifest

- Path: `server/config/swarmsy/SWARMSY_REQUIRED_DOCS_MANIFEST.json`
- Scope: lists required SWARMSY doctrine docs grouped as:
  - Living Icon Engine Prompt Tree
  - SPARKY Persona
  - Operating Layer
  - Disruption Engine
  - App Mode

Manifest paths include the `docs/` prefix.

## Helper Functions

File: `server/utils/swarmsy/requiredDocs.js`

Exports:

- `loadSwarmsyRequiredDocsManifest()`
- `getSwarmsyRequiredDocsStatus()`
- `getSwarmsyRequiredDocPaths()`

This helper only reports status and candidate document paths for future ingestion. It does not ingest docs and does not write workspace documents.

## Status Route

- `GET /api/admin/swarmsy/required-docs/status`
- Uses existing admin/manager auth middleware conventions
- Returns grouped file status, summary counts, docs root availability, and `documentsToIngest` for later ingestion work

`documentsToIngest` means: documents that should be ingested later.

## Doctrine Docs Root Resolver

Default docs root:

- repository root

Optional environment override:

- `SWARMSY_DOCTRINE_DOCS_ROOT`

Important: manifest paths already include `docs/`.

The env var must point to the parent directory that contains `docs/`.

Correct examples:

- `SWARMSY_DOCTRINE_DOCS_ROOT=/app`
- `SWARMSY_DOCTRINE_DOCS_ROOT=/path/to/repo-root`

Incorrect example:

- `SWARMSY_DOCTRINE_DOCS_ROOT=/app/docs`

Why incorrect:

- It would resolve to `/app/docs/docs/swarmsy/...`

## Local/Dev Default

If `SWARMSY_DOCTRINE_DOCS_ROOT` is not set, the helper resolves docs from the local repository root.

## Docker/Runtime Caveat

The helper resolves paths from the server runtime filesystem (`SWARMSY_DOCTRINE_DOCS_ROOT`).
In Docker, mount docs into the container and set the root to the mount parent (for docs at `/app/docs`, use `/app`, not `/app/docs`).

## Status-Only Limitation

This change is status-only. It does not:

- add a POST ingestion route
- call collector/document ingestion pipelines
- attach docs to workspaces
- auto-run ingestion on boot

A future PR will add ingestion behavior.

## Rollback Notes

Rollback is safe and limited:

1. Remove the status route registration.
2. Remove the helper and manifest references.
3. Keep existing runtime behavior unchanged (no ingestion side effects to revert).

## Manual Check

```bash
AUTH_TOKEN="<YOUR_ADMIN_JWT>"
AUTH_HEADER="Bearer ${AUTH_TOKEN}"

curl http://localhost:3001/api/admin/swarmsy/required-docs/status \
  -H "Authorization: ${AUTH_HEADER}"
```

Replace `<YOUR_ADMIN_JWT>` with your admin JWT, and redact token values in shared logs/screenshots.
