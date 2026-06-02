# SWARMSY Desktop Storage Contract

## Scope

This document defines the first version of the downloadable-app local storage manifest and validation boundary for SWARMSY Local User mode.

This is a spec + helper foundation only. It does not package desktop runtime yet.
Desktop wrapper foundation now consumes this contract via `desktop/foundation/storageContractBridge.cjs` and keeps browser `localStorage` as the active state until migration work.

## Manifest schema (v1)

```json
{
  "schema": "swarmsy_local_user_storage_manifest",
  "version": 1,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "app": "SWARMSY",
  "mode": "local_user",
  "paths": {
    "profile": "...",
    "settings": "...",
    "hives": "...",
    "chats": "...",
    "uploads": "...",
    "memoryLocks": "...",
    "backups": "...",
    "logs": "...",
    "runtime": "...",
    "temp": "..."
  }
}
```

## Validation rules

- `schema` must equal `swarmsy_local_user_storage_manifest`.
- `version` must equal `1`.
- `app` must equal `SWARMSY`.
- `mode` must equal `local_user`.
- `createdAt` and `updatedAt` must be valid ISO date strings.
- `paths` must include all required contract keys.
- Every path must remain inside the resolved Local User data root.
- Hosted/server paths are rejected by root-boundary validation.
- Only the v1 schema keys are allowed at the top level (`schema`, `version`, `createdAt`, `updatedAt`, `app`, `mode`, `paths`); any other top-level key is rejected.
- Only the required contract path keys are allowed inside `paths`; any unknown path key is rejected.

## Security boundary

The manifest is metadata only. It must not contain:

- auth/session tokens
- hosted credentials
- API keys
- hosted/server database locations

`runtime/` and `temp/` are explicitly non-portable and rebuildable.

## Hosted/Admin boundary

Hosted/Admin mode stays unchanged:

- hosted app data remains server-side
- Docker/VPS deployment is unchanged
- existing AnythingLLM DB paths are unchanged

This local storage contract must not be applied to hosted/admin runtime flows.

## Stress-test coverage in this PR

Tests cover:

- platform root resolution (Windows/macOS/Linux + fallback)
- required folder layout shape
- manifest schema/version/path validation
- missing required paths rejection
- path traversal/hosted-path rejection
- unknown top-level field rejection (allowlist enforcement)
- unknown paths key rejection (allowlist enforcement)
- secret/auth/session/API-key field rejection

## Non-goals (this PR)

- no signed production Electron/Tauri installer packaging
- no auto-update pipeline
- no real production data migration
- no hosted data migration
- no Docker/VPS path changes
- no server DB export
- no auto-install/pull for Ollama
