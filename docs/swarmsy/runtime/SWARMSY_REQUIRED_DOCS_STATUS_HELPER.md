# What Was Added — Required Docs Status Helper

The helper is read-only. It reports whether required SWARMSY doctrine docs are present, readable, grouped correctly, and ready for ingestion.

It does not ingest or attach documents itself. Dedicated admin and user-safe onboarding routes now perform ingestion.

## Purpose

Provide a truthful status view for SWARMSY doctrine docs so runtime checks and ingestion routes can verify readiness before processing files.

## Manifest

- Path: `server/config/swarmsy/SWARMSY_REQUIRED_DOCS_MANIFEST.json`
- Scope: lists required SWARMSY doctrine docs grouped as:
  - Living Icon Engine Prompt Tree
  - SPARKY Persona (including core SPARKY output-over-instructions rules)
  - Operating Layer
  - Disruption Engine
  - App Mode

Manifest paths include the `docs/` prefix.

Optional advanced doctrine groups, such as Spark Library and remaining SPARKY Operator Playbooks, may appear in the manifest with `required: false`. They are useful after the core SWARMSY HIVE setup, but they must not block first-run readiness. Core SPARKY output-over-instructions rules are required doctrine and are loaded with the SPARKY Persona group.

## Helper Functions

File: `server/utils/swarmsy/requiredDocs.js`

Exports:

- `loadSwarmsyRequiredDocsManifest()`
- `getSwarmsyRequiredDocsStatus()`
- `getSwarmsyRequiredDocPaths()`

This helper only reports status and candidate document paths. It does not ingest docs or write workspace documents.

## Status Route

- `GET /api/admin/swarmsy/required-docs/status`
- Uses existing admin/manager auth middleware conventions
- Returns grouped file status, summary counts, docs root availability, and `documentsToIngest` for later ingestion work

`documentsToIngest` lists loadable candidates for an ingestion request. It does not mean those documents have already been attached.

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

## Helper Boundary and Ingestion Routes

The helper remains status-only. It does not:

- call collector/document ingestion pipelines
- attach docs to workspaces
- auto-run ingestion on boot

Runtime ingestion is implemented separately:

- `POST /api/admin/swarmsy/workspace-preset/hive/ingest-required-docs` allows an admin or manager to target a SWARMSY HIVE workspace.
- `POST /api/swarmsy/onboarding/ingest-required-docs` allows an authenticated user to ingest required docs into their own SWARMSY HIVE workspace.

See [SWARMSY_REQUIRED_DOCS_INGESTION_ROUTE.md](SWARMSY_REQUIRED_DOCS_INGESTION_ROUTE.md) and [SWARMSY_USER_SAFE_REQUIRED_DOCS_INGESTION_ROUTE.md](SWARMSY_USER_SAFE_REQUIRED_DOCS_INGESTION_ROUTE.md) for authorization, response, and failure behavior. Neither route runs automatically on boot.

## Rollback Notes

Rollback of the status surface is limited:

1. Remove the status route registration.
2. Remove the helper and manifest references only after updating both ingestion routes, which consume the helper output.
3. No database migration is required.

## Manual Check

```bash
AUTH_TOKEN="<YOUR_ADMIN_JWT>"
AUTH_HEADER="Bearer ${AUTH_TOKEN}"

curl http://localhost:3001/api/admin/swarmsy/required-docs/status \
  -H "Authorization: ${AUTH_HEADER}"
```

Replace `<YOUR_ADMIN_JWT>` with your admin JWT, and redact token values in shared logs/screenshots.
