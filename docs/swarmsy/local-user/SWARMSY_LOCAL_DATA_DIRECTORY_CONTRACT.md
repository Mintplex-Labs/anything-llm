# SWARMSY Local User Data Directory Contract

## Purpose

Define the filesystem contract for future downloadable SWARMSY Local User mode so user-owned data lives in a real local app-data directory, not in hosted/admin server storage.

## Mode boundary

- This contract applies only to `mode: local_user`.
- Hosted/Admin mode continues to use hosted/server storage and existing deployment paths.
- This contract must not be used to read/write hosted server DB files.

## Platform roots

Target root path for Local User app data:

- **Windows:** `%APPDATA%\SWARMSY`
- **macOS:** `~/Library/Application Support/SWARMSY`
- **Linux:** `${XDG_CONFIG_HOME:-~/.config}/swarmsy`
- **Unknown platform fallback:** `~/.config/swarmsy`

Deterministic root resolution rules:

- `APPDATA` is used only when it is a strict absolute Windows path, either a drive-letter path like `C:\Users\Alice\AppData\Roaming` or a UNC path like `\\server\share\AppData\Roaming`; blank, whitespace, relative, drive-relative/root-relative values like `\foo`, and root-relative values like `/foo` fall back to `~/AppData/Roaming`.
- `XDG_CONFIG_HOME` is used only when it is an absolute POSIX path; blank/whitespace/relative values fall back to `~/.config`.

## Required directory layout

```text
<app-data-root>/
  profile/
  settings/
  hives/
  chats/
  uploads/
  memory-locks/
  backups/
  logs/
  runtime/
  temp/
```

### Folder responsibilities

- `profile/`
  - Local user profile metadata only.
  - No hosted auth/session tokens.
- `settings/`
  - Selected provider, selected Ollama model, local UI/app preferences.
  - Local-only settings for downloadable mode.
- `hives/`
  - Local SWARMSY HIVE state.
- `chats/`
  - Local chat/session exports for downloadable mode.
- `uploads/`
  - Local document/file references or copied files.
- `memory-locks/`
  - Local memory lock handoff/state.
- `backups/`
  - Exported local backups.
- `logs/`
  - Local diagnostics only.
  - No secrets.
- `runtime/`
  - Non-portable runtime metadata.
  - Safe to rebuild.
- `temp/`
  - Disposable working files.

## Data safety rules

- Never include hosted credentials, auth/session tokens, or API keys in this contract.
- Never include hosted/server DB exports.
- Keep backup data separated from runtime/temp directories.
- Treat `runtime/` and `temp/` as ephemeral and non-portable.

## Migration strategy (future PR)

Current browser-side Local User state remains active now:

- selected model in `localStorage`
- browser backup/export/import JSON
- Settings Hub browser state

Future downloadable migration target:

- `settings/` files for selected provider/model and Local User app preferences
- `backups/` directory for local backup files
- `hives/`, `chats/`, `uploads/`, `memory-locks/` for user-owned local data

Migration must be opt-in and safe:

- no forced migration in hosted/admin mode
- no server DB copy/export
- no secret/token migration

## Foundation helper

`server/utils/swarmsy/localUserStorageContract.js` defines pure helper utilities for:

- platform root resolution
- required directory layout shape
- path safety checks (must remain inside local root)
- versioned storage manifest creation/validation

This helper is intentionally not wired into production hosted runtime behavior in this PR.
