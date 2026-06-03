# SWARMSY Local Data Storage Model

## Purpose

Define what Local User Mode stores on the user's machine and how that differs from hosted mode.

## Local Storage Rule

In Local User Mode, SWARMSY user data is stored on the user's machine by default.

The concrete desktop/local contract is defined in:

- `docs/swarmsy/local-user/SWARMSY_LOCAL_DATA_DIRECTORY_CONTRACT.md`
- `docs/swarmsy/local-user/SWARMSY_DESKTOP_STORAGE_CONTRACT.md`

## Local Data Scope

Local user data should include:

- local user profile
- `SWARMSY HIVE`
- chats
- tasks
- memory locks
- uploaded docs
- proof notes
- campaign handoffs
- settings
- selected AI provider and model

Desktop-local folder contract:

- `profile/`
- `settings/`
- `hives/`
- `chats/`
- `uploads/`
- `memory-locks/`
- `backups/`
- `logs/`
- `runtime/` (non-portable)
- `temp/` (disposable)

## Backup Requirements

- User can export a backup of local SWARMSY data.
- User can import a backup of local SWARMSY data.
- Backup behavior should preserve ownership of local project state.
- Backup/export/import controls are managed from the Local User Settings Hub.
- The hub copy must remain explicit: browser-side Local User settings backup is not a full desktop filesystem backup.
- Current backup/export/import remains browser-side Local User state only.
- Future downloadable app backup uses the real local data directory and `backups/` folder contract.
- Hosted/admin server data, secrets, API keys, auth/session tokens, and ephemeral runtime/pending handoff storage are excluded from backup/export/import.

## Privacy Rules

- Hosted server should not receive private project data by default from Local User Mode.
- Local User Mode should clearly communicate that data remains on the user's machine unless the user explicitly enables a future sync feature.
- Hosted/Admin Mode should show a clear warning that hosted usage stores data on the hosted server.

## Hosted Boundary

- Do not describe the current hosted browser app as fully local storage.
- Do not assume hosted/admin data and local-user data use the same default storage path.
- Do not route Local User Mode private project data to the hosted server unless the user intentionally opts in later.

## Future Storage Work

Implementation should define a stable local app data directory, a backup format, and restore behavior that preserves HIVE state, uploaded materials, and provider settings.

This repository now includes a pure helper foundation for that contract at:

- `server/utils/swarmsy/localUserStorageContract.js`

The helper defines platform path resolution, required folder layout shape, and manifest validation, but is not wired into hosted/admin runtime behavior.

Current desktop foundation adds a limited Local User settings file path (`settings/local-user-settings.json`) for trusted desktop/local mode only, while browser `localStorage` stays the fallback/current compatibility layer. This phase does not migrate all browser data, does not export server DB data, and does not store auth/API/session secrets.

## Desktop Local User backups

Desktop Local User backup/export/import now uses the Local User data directory contract. Backups are created by the Electron main process under `layout.paths.backups`; browser/renderer code does not choose filesystem paths. The desktop backup schema is intentionally small and future-safe: it currently includes only allowlisted desktop local settings needed to preserve the selected Ollama model/provider.

Browser Local User backup remains available as fallback and compatibility for browser-only state. Desktop backups do not contain secrets, auth/session/API keys, runtime/pending state, server DB data, or Hosted/Admin data.
