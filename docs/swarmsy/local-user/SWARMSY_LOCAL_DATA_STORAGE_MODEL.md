# SWARMSY Local Data Storage Model

## Purpose

Define what Local User Mode stores on the user's machine and how that differs from hosted mode.

## Local Storage Rule

In Local User Mode, SWARMSY user data is stored on the user's machine by default.

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

## Backup Requirements

- User can export a backup of local SWARMSY data.
- User can import a backup of local SWARMSY data.
- Backup behavior should preserve ownership of local project state.

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
