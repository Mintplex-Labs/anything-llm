# SWARMSY Desktop Diagnostics

## Overview

The SWARMSY Desktop Diagnostics layer provides Local User desktop mode users with clear, human-readable explanations of why runtime, backup, storage, model, or Ollama operations have failed — without requiring them to read log files or open DevTools.

Diagnostics are **visibility only**. They never expose secrets, auth tokens, API keys, session values, server DB paths, or Hosted/Admin-only data.

---

## Diagnostic Model

```json
{
  "code": "string",
  "severity": "error | warning | info",
  "title": "string",
  "description": "string",
  "action": "string"
}
```

### Severity levels

| Level     | Meaning                                                  |
|-----------|----------------------------------------------------------|
| `error`   | Something failed and action is required to proceed.      |
| `warning` | Something is degraded or missing; operation may continue.|
| `info`    | Informational — non-blocking, may need attention later.  |

Diagnostics are always displayed sorted: **errors first**, then warnings, then info.

---

## Catalog

### Runtime

| Code                          | Severity | Title                          | Suggested Action                                      |
|-------------------------------|----------|--------------------------------|-------------------------------------------------------|
| `runtime_missing`             | error    | Runtime Not Found              | Ensure the local runtime is installed and accessible. |
| `runtime_launch_failed`       | error    | Runtime Launch Failed          | Restart the application. Check runtime installation.  |
| `runtime_healthcheck_failed`  | error    | Runtime Healthcheck Failed     | Check that the local runtime is running and reachable.|
| `runtime_healthcheck_timeout` | warning  | Runtime Healthcheck Timeout    | Check that the local runtime is running and reachable.|
| `runtime_shutdown_failed`     | warning  | Runtime Shutdown Failed        | Restart the application if the runtime appears stuck. |

### Desktop

| Code                            | Severity | Title                         | Suggested Action                                           |
|---------------------------------|----------|-------------------------------|------------------------------------------------------------|
| `untrusted_origin`              | error    | Untrusted Origin              | Only open this app from the official desktop installer.    |
| `storage_contract_invalid`      | error    | Storage Contract Invalid      | Restart the app. Contact support if the issue persists.    |
| `local_user_root_invalid`       | error    | Local User Root Invalid       | Check that the app data directory exists and is writable.  |
| `settings_file_missing`         | warning  | Settings File Missing         | Settings will be initialized on next save.                 |
| `settings_file_corrupt`         | error    | Settings File Corrupt         | Reset settings or restore from backup.                     |
| `settings_file_symlink_rejected`| error    | Settings File Symlink Rejected| The settings file must not be a symlink. Restore the file. |
| `backup_directory_invalid`      | error    | Backup Directory Invalid      | Check that the backup directory exists and is writable.    |
| `backup_file_symlink_rejected`  | error    | Backup File Symlink Rejected  | The backup file must not be a symlink. Check the directory.|
| `backup_import_failed`          | error    | Backup Import Failed          | Ensure the backup file is valid and was not corrupted.     |
| `backup_export_failed`          | error    | Backup Export Failed          | Check available disk space and backup directory access.    |

### Ollama

| Code                    | Severity | Title                   | Suggested Action                                           |
|-------------------------|----------|-------------------------|------------------------------------------------------------|
| `ollama_unreachable`    | warning  | Ollama Unreachable      | Ensure Ollama is running and accessible at the configured address. |
| `ollama_not_installed`  | warning  | Ollama Not Installed    | Install Ollama from https://ollama.com.                    |
| `no_models_installed`   | warning  | No Models Installed     | Pull a model with `ollama pull <model>`.                   |
| `selected_model_missing`| warning  | Selected Model Missing  | Select a different model or pull the missing model.        |
| `selected_model_stale`  | info     | Selected Model May Be Stale | Refresh Ollama status to verify your model selection.      |
| `selected_model_invalid`| error    | Selected Model Invalid  | Select a valid model from the model list.                  |

### Chat

| Code                       | Severity | Title                       | Suggested Action                                               |
|----------------------------|----------|-----------------------------|----------------------------------------------------------------|
| `local_provider_unavailable`| error   | Local Provider Unavailable  | Ensure Ollama is running and a model is selected.              |
| `selected_model_not_ready` | warning  | Selected Model Not Ready    | Wait for the model to finish loading or select a different model. |
| `model_restore_failed`     | warning  | Model Restore Failed        | Select a model manually to continue.                           |

---

## File locations

| File | Purpose |
|------|---------|
| `server/utils/swarmsy/desktopDiagnostics.js` | Canonical CJS diagnostic catalog (source of truth for all codes) |
| `frontend/src/utils/desktopDiagnostics.js` | ES module mirror of the catalog for frontend use |
| `frontend/src/components/SwarmsyDesktopDiagnosticsPanel/index.jsx` | UI panel rendered in the Local User Settings Hub |
| `frontend/src/components/SwarmsyLocalUserSettingsHub/useLocalUserSettingsHub.js` | Hook that collects and manages active diagnostics |

---

## Integration points

### Runtime

- `runtimeLauncher.cjs` → `launchDesktopLocalRuntime` → `runtime_launch_failed`
- `runtimeLauncher.cjs` → `waitForRuntimeHealthcheck` → `runtime_healthcheck_timeout`

### Desktop backup

- `localBackupStore.cjs` → `importLocalUserBackup` → `backup_parse_failed` → displayed as `backup_import_failed`
- `localBackupStore.cjs` → `validateLocalUserBackup` → schema errors → displayed as `backup_import_failed`
- Desktop bridge export failure → `backup_export_failed`
- Symlink checks → `backup_file_symlink_rejected`, `settings_file_symlink_rejected`

### Ollama

- `localUserOllama.js` → `detectLocalOllama` → `unreachable` → `ollama_unreachable`
- `detectLocalOllama` → `no_models` → `no_models_installed`
- Model resolution → stale selection → `selected_model_stale`
- Model resolution → missing selection → `selected_model_missing`

### Chat/model restore

- Import restores a model slug that is no longer installed → `model_restore_failed`

---

## Security guarantees

- `diagnosticFromResult(result)` only reads `result.reason` to look up the catalog. It never forwards `result.message`, `result.path`, or any other field from the underlying failure result.
- Catalog entries contain only generic, user-safe text — no paths, no credentials, no server identifiers.
- Diagnostics are never shown for Hosted/Admin mode operations.
- Diagnostics are Local User desktop mode only.

---

## UI

The `SwarmsyDesktopDiagnosticsPanel` is rendered in the Local User Settings Hub after the backup section. It:

- Renders nothing (no empty-state clutter) when there are no active diagnostics.
- Sorts entries: errors first, then warnings, then info.
- Shows severity icon, reason code, human-readable title, description, and suggested action for each entry.
- Supports a `showWhenEmpty` prop for test/debug use.

---

## Tests

| File | Coverage |
|------|---------|
| `server/__tests__/utils/swarmsy/desktopDiagnostics.test.js` | All 24 codes present, required fields, no secret leakage, sort order, diagnosticFromResult safety |
| `server/__tests__/desktop/desktopDiagnosticsIntegration.test.js` | Runtime timeout/launch failure, backup parse/schema failures, Ollama unreachable/no-models |
| `server/__tests__/frontend/desktopDiagnosticsPanel.test.js` | Frontend catalog mirror, sort order, empty state, code→entry rendering |
