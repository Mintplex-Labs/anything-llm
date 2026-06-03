# SWARMSY Local User Backup Foundation

## Purpose

Define and implement the first Local User data ownership layer: a safe,
user-controlled backup/export/import contract for browser-stored SWARMSY
state that operates entirely on the client side and never exposes credentials
or hosted-admin data.

This is the browser-side foundation, not the final desktop filesystem storage contract.
Desktop-local directory + manifest contracts are defined in:

- `docs/swarmsy/local-user/SWARMSY_LOCAL_DATA_DIRECTORY_CONTRACT.md`
- `docs/swarmsy/local-user/SWARMSY_DESKTOP_STORAGE_CONTRACT.md`

---

## Storage Key Audit

The following table maps every SWARMSY browser-storage key found in the
codebase as of PRs #33–#36 to its storage type and backup eligibility.

| Logical name           | Storage key                                     | Storage type       | Backup?        |
| ---------------------- | ----------------------------------------------- | ------------------ | -------------- |
| ollamaModel            | `anythingllm_swarmsy_local_user_ollama_model`   | localStorage       | ✅             |
| appearanceSettings     | `anythingllm_appearance_settings`               | localStorage       | ✅             |
| promptDrafts           | `anythingllm_user_prompt_input_map`             | localStorage       | ✅             |
| lastVisitedWorkspace   | `anythingllm_last_visited_workspace`            | localStorage       | ✅             |
| completedQuestionnaire | `anythingllm_completed_questionnaire`           | localStorage       | ✅             |
| seenDocPinAlert        | `anythingllm_pinned_document_alert`             | localStorage       | ✅             |
| seenWatchAlert         | `anythingllm_watched_document_alert`            | localStorage       | ✅             |
| sidebarToggle          | `anythingllm_sidebar_toggle`                    | localStorage       | ✅             |
| showChatMetrics        | `anythingllm_show_chat_metrics`                 | localStorage       | ✅             |
| —                      | `anythingllm_user`                              | localStorage       | ❌ credentials |
| —                      | `anythingllm_authToken`                         | localStorage       | ❌ credentials |
| —                      | `anythingllm_authTimestamp`                     | localStorage       | ❌ credentials |
| —                      | `anythingllm_pending_home_message`              | **sessionStorage** | ❌ ephemeral   |
| —                      | `anythingllm_swarmsy_local_user_active_runtime` | **sessionStorage** | ❌ ephemeral   |

### Never-backup boundary

`NEVER_BACKUP_STORAGE_KEYS` (a `Set`) is enforced at both export time (fields
are simply not collected) and import time (any field whose storage key is in
the set is skipped even if somehow present in the backup object).

---

## Backup Schema

```json
{
  "schema": "swarmsy_local_user_backup",
  "version": 1,
  "exportedAt": "<ISO 8601 timestamp>",
  "state": {
    "ollamaModel": "llama3.1:8b",
    "appearanceSettings": "{\"theme\":\"dark\"}",
    "promptDrafts": null,
    "lastVisitedWorkspace": "swarmsy-hive",
    "completedQuestionnaire": null,
    "seenDocPinAlert": null,
    "seenWatchAlert": null,
    "sidebarToggle": null,
    "showChatMetrics": null
  }
}
```

### Field rules

- `schema` must equal `"swarmsy_local_user_backup"`.
- `version` must be a positive integer between 1 and `BACKUP_SCHEMA_VERSION`.
- `exportedAt` must be a valid ISO 8601 date string.
- `state` must be a plain object.
- Every key in `state` must be a known field name from `BACKUP_STATE_FIELDS`.
  Unknown field names are rejected to prevent hostile or stale backups from
  silently writing arbitrary data.
- State field values are stored/restored as raw strings (same representation
  used by `localStorage.setItem`). A `null` value signals "remove this key."

---

## Export flow

`exportLocalUserBackup({ storage? })` in `frontend/src/utils/localUserBackup.js`:

1. Iterates over every entry in `BACKUP_STATE_FIELDS`.
2. Calls `storage.getItem(storageKey)` for each entry.
3. Returns a versioned backup object with `schema`, `version`, `exportedAt`,
   and `state`.

The UI handler `exportBackupToFile()` (used by the Local User Settings Hub in onboarding and chat settings):

1. Calls `exportLocalUserBackup()`.
2. Serialises the result with `JSON.stringify(backup, null, 2)`.
3. Creates a `Blob` and triggers a browser download named
   `swarmsy-local-user-backup-<YYYY-MM-DD>.json`.
4. Shows a success toast.

---

## Validate flow

`validateLocalUserBackup(data)` returns `{ valid: boolean, errors: string[] }`.

Checks performed:

- `data` is a non-null, non-array plain object.
- `data.schema` matches `BACKUP_SCHEMA_NAME`.
- `data.version` is an integer in `[1, BACKUP_SCHEMA_VERSION]`.
- `data.exportedAt` parses as a valid date.
- `data.state` is a plain object.
- Every key in `data.state` is a known field name from `BACKUP_STATE_FIELDS`.

Any single failure produces a descriptive error string and sets `valid: false`.

---

## Import flow

`importLocalUserBackup(data, { storage? })` returns
`{ success, restored, skipped, errors }`.

1. Calls `validateLocalUserBackup(data)`. Returns `success: false` on failure.
2. Iterates over every entry in `BACKUP_STATE_FIELDS`.
3. **Skips** the field if:
   - The storage key is in `NEVER_BACKUP_STORAGE_KEYS` (defensive double-check).
   - The field is absent from `data.state`.
4. **Removes** the storage key when the backup value is `null`.
5. **Writes** the value via `storage.setItem` otherwise.
6. Returns `{ success: true, restored: [...], skipped: [...], errors: [] }`.

The Local User Settings Hub import handler (`importBackupFromText` + file picker wrapper):

1. Reads the selected `.json` file via `FileReader`.
2. `JSON.parse`s the content.
3. Calls `importLocalUserBackup(data)`.
4. Shows a success or error toast.
5. Resets the file input so the same file can be re-imported.

---

## Reject bad backup

`validateLocalUserBackup` rejects:

- Non-object payloads (null, string, array).
- Wrong or missing `schema` value.
- Version outside the supported range.
- Non-date `exportedAt`.
- Non-object `state`.
- Unknown field names in `state` (prevents hostile injection).

`importLocalUserBackup` independently enforces the never-backup key set even
after a backup passes validation.

---

## Hosted/Admin boundary

The Local User Settings Hub can render in hosted/admin surfaces, but local-only
controls are hidden behind explicit boundary state messaging:
`Local User Mode is not active in this hosted/admin environment`.

`BACKUP_STATE_FIELDS` contains only Local User client-side keys. No admin-only,
server-side, or multi-user keys are present.

The backup file is generated and consumed entirely in the browser. Nothing is
sent to the server.

Hosted/Admin mode still stores hosted data server-side and does not use this browser backup as a server data export path.

---

## Source files

| File                                                                                               | Purpose                                                           |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `frontend/src/utils/localUserBackup.js`                                                            | Schema constants, export, validate, import                        |
| `frontend/src/components/SwarmsyLocalUserSettingsHub/index.jsx`                                    | Local User Settings Hub UI (status, model, export/import actions) |
| `frontend/src/components/SwarmsyLocalUserSettingsHub/useLocalUserSettingsHub.js`                   | Shared Local User Settings Hub state + sync logic                 |
| `frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx`                                      | Onboarding integration of the Local User Settings Hub             |
| `frontend/src/components/WorkspaceChat/ChatContainer/ChatSettingsMenu/LocalUserSettingsHubRow.jsx` | Chat settings entrypoint modal for Local User Settings Hub        |
| `server/__tests__/frontend/localUserBackup.test.js`                                                | Full flow test suite (35 tests)                                   |

## Desktop filesystem-backed backup (desktop schema v1)

In trusted desktop Local User mode, the Local User Settings Hub now prefers the desktop filesystem-backed backup bridge when available. The Electron main process resolves the storage contract, writes backup JSON only inside `layout.paths.backups`, rejects backup directory/file symlinks, and validates all paths against the Local User root. Import accepts a parsed object or serialized JSON, rejects malformed JSON with a parse-specific reason, rejects unknown/forbidden fields, and restores only allowlisted desktop local settings through the desktop local settings store.

The browser backup v2 shape remains fallback and compatibility. No secrets, auth/session/API keys, runtime/pending state, server DB paths/data, or Hosted/Admin data are exported. Hosted/Admin separation is unchanged, and this backup foundation does not add an installer, signing, auto-update, bundled Ollama/models, or model auto-pull.
