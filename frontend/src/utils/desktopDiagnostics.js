/**
 * SWARMSY Desktop Diagnostics — frontend ES module mirror.
 *
 * Mirrors the canonical catalog defined in
 * server/utils/swarmsy/desktopDiagnostics.js so that the frontend has access
 * to the same reason-code → human-readable message mapping without a server
 * round-trip.
 *
 * Safety rules:
 *   - No secrets, auth tokens, API keys, session values, or server DB paths
 *     are ever included in diagnostic output.
 *   - No Hosted/Admin-only data is surfaced.
 *   - All messages are safe to display directly to Local User desktop users.
 */

/** @typedef {"error"|"warning"|"info"} DiagnosticSeverity */

/**
 * @typedef {Object} DiagnosticEntry
 * @property {string} code
 * @property {DiagnosticSeverity} severity
 * @property {string} title
 * @property {string} description
 * @property {string} action
 */

export const DESKTOP_DIAGNOSTIC_CATALOG = Object.freeze({
  // ── Runtime ──────────────────────────────────────────────────────────────
  runtime_missing: {
    severity: "error",
    title: "Runtime Not Found",
    description: "The local SWARMSY runtime could not be found.",
    action:
      "Ensure the runtime is installed and configured, then restart the desktop app.",
  },
  runtime_launch_failed: {
    severity: "error",
    title: "Runtime Launch Failed",
    description: "The local SWARMSY runtime failed to start.",
    action:
      "Check that the runtime script is correctly configured and restart the desktop app.",
  },
  runtime_healthcheck_failed: {
    severity: "error",
    title: "Runtime Healthcheck Failed",
    description: "The local runtime is not responding to health checks.",
    action: "Restart the runtime and try again.",
  },
  runtime_healthcheck_timeout: {
    severity: "warning",
    title: "Runtime Healthcheck Timeout",
    description: "The local runtime did not become healthy in time.",
    action: "Check that the local runtime is running and reachable.",
  },
  runtime_shutdown_failed: {
    severity: "warning",
    title: "Runtime Shutdown Failed",
    description: "The local runtime did not shut down cleanly.",
    action: "Restart the desktop app to recover.",
  },

  // ── Desktop ───────────────────────────────────────────────────────────────
  untrusted_origin: {
    severity: "error",
    title: "Untrusted Origin",
    description: "The desktop app detected an untrusted runtime origin.",
    action:
      "Only local runtime addresses are supported. Check your configuration.",
  },
  storage_contract_invalid: {
    severity: "error",
    title: "Storage Contract Invalid",
    description: "The local storage configuration is not valid.",
    action: "Restart the desktop app. If this persists, reinstall.",
  },
  local_user_root_invalid: {
    severity: "error",
    title: "Local User Root Invalid",
    description: "The local user data directory is not valid or accessible.",
    action: "Check that your home directory is accessible and try again.",
  },
  settings_file_missing: {
    severity: "warning",
    title: "Settings File Missing",
    description: "The local user settings file could not be found.",
    action: "Settings will be created automatically on the next save.",
  },
  settings_file_corrupt: {
    severity: "error",
    title: "Settings File Corrupt",
    description: "The local user settings file could not be read or parsed.",
    action: "Delete the settings file and restart the desktop app.",
  },
  settings_file_symlink_rejected: {
    severity: "error",
    title: "Settings File Symlink Rejected",
    description:
      "The settings file path resolved to a symbolic link, which is not allowed.",
    action: "Remove the symlink and restart the desktop app.",
  },
  backup_directory_invalid: {
    severity: "error",
    title: "Backup Directory Invalid",
    description: "The backup directory is not valid or accessible.",
    action: "Check that your local user data directory exists and is writable.",
  },
  backup_file_symlink_rejected: {
    severity: "error",
    title: "Backup File Symlink Rejected",
    description:
      "The backup file path resolved to a symbolic link, which is not allowed.",
    action: "Remove the symlink and retry the backup.",
  },
  backup_import_failed: {
    severity: "error",
    title: "Backup Import Failed",
    description: "The backup file could not be imported.",
    action: "Ensure the backup file is a valid SWARMSY backup and try again.",
  },
  backup_export_failed: {
    severity: "error",
    title: "Backup Export Failed",
    description: "The backup file could not be exported.",
    action: "Check that the backups directory is writable and try again.",
  },

  // ── Ollama ────────────────────────────────────────────────────────────────
  ollama_unreachable: {
    severity: "warning",
    title: "Ollama Unreachable",
    description: "Ollama could not be reached at the configured endpoint.",
    action: "Start Ollama or configure a compatible endpoint.",
  },
  ollama_not_installed: {
    severity: "warning",
    title: "Ollama Not Installed",
    description: "Ollama does not appear to be installed.",
    action: "Install Ollama and restart.",
  },
  no_models_installed: {
    severity: "warning",
    title: "No Models Installed",
    description: "Ollama is reachable but no models are installed.",
    action:
      "Pull at least one model using the Ollama CLI before using SWARMSY.",
  },
  selected_model_missing: {
    severity: "warning",
    title: "Selected Model Missing",
    description: "Your previously selected model is no longer installed.",
    action: "Select a new model from the available list.",
  },
  selected_model_stale: {
    severity: "info",
    title: "Selected Model May Be Stale",
    description:
      "Your selected model has not been verified against the current Ollama state.",
    action: "Refresh Ollama status to verify your model selection.",
  },
  selected_model_invalid: {
    severity: "error",
    title: "Selected Model Invalid",
    description: "The selected model name is not valid.",
    action: "Select a valid model from the available list.",
  },

  // ── Chat ──────────────────────────────────────────────────────────────────
  local_provider_unavailable: {
    severity: "error",
    title: "Local Provider Unavailable",
    description: "The local AI provider is not available for chat.",
    action: "Ensure Ollama is running and a model is selected.",
  },
  selected_model_not_ready: {
    severity: "warning",
    title: "Selected Model Not Ready",
    description: "The selected model is not ready for use.",
    action: "Wait for the model to finish loading or select a different model.",
  },
  model_restore_failed: {
    severity: "warning",
    title: "Model Restore Failed",
    description: "The previously saved model could not be restored.",
    action: "Select a model manually to continue.",
  },
});

/** Ordered severity levels for sorting (lower index = higher priority). */
export const SEVERITY_ORDER = Object.freeze(["error", "warning", "info"]);

/** Maps lower-level bridge/foundation reasons to catalog diagnostic codes. */
const FOUNDATION_REASON_TO_DIAGNOSTIC_CODE = Object.freeze({
  backup_file_symlink: "backup_file_symlink_rejected",
  backup_file_unsafe: "backup_file_symlink_rejected",
  backup_path_invalid: "backup_directory_invalid",
  backup_parse_failed: "backup_import_failed",
  backup_validation_failed: "backup_import_failed",
  backup_write_failed: "backup_export_failed",
  backup_settings_invalid: "backup_export_failed",
  untrusted_origin: "untrusted_origin",
});

/**
 * Returns a copy of the catalog entry for the given reason code, or null if
 * the code is not registered.
 *
 * @param {string} code
 * @returns {DiagnosticEntry|null}
 */
export function getDiagnosticForCode(code) {
  const normalized = String(code || "").trim();
  const entry = DESKTOP_DIAGNOSTIC_CATALOG[normalized];
  if (!entry) return null;
  return { code: normalized, ...entry };
}

/**
 * Returns true when the given reason code is present in the catalog.
 *
 * @param {string} code
 * @returns {boolean}
 */
export function isKnownDiagnosticCode(code) {
  return Object.prototype.hasOwnProperty.call(
    DESKTOP_DIAGNOSTIC_CATALOG,
    String(code || "").trim()
  );
}

/**
 * Returns every registered diagnostic code in catalog order.
 *
 * @returns {string[]}
 */
export function allDiagnosticCodes() {
  return Object.keys(DESKTOP_DIAGNOSTIC_CATALOG);
}

/**
 * Sorts an array of diagnostic entries: errors first, warnings second,
 * info last. Entries with equal severity preserve their original order.
 *
 * @param {DiagnosticEntry[]} diagnostics
 * @returns {DiagnosticEntry[]}
 */
export function sortDiagnostics(diagnostics) {
  if (!Array.isArray(diagnostics)) return [];
  return [...diagnostics].sort(
    (a, b) =>
      SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
  );
}

/**
 * Builds a DiagnosticEntry from an operation result that carries a `reason`
 * field.  If the reason is not in the catalog the function returns null.
 *
 * No message/path values from the result are forwarded into the diagnostic so
 * that secrets are never leaked through this pathway.
 *
 * @param {{ reason?: string }} result
 * @param {string} [fallbackCode]
 * @returns {DiagnosticEntry|null}
 */
export function diagnosticFromResult(result, fallbackCode) {
  const reason = String(result?.reason || "").trim();
  const mappedCode = FOUNDATION_REASON_TO_DIAGNOSTIC_CODE[reason] || reason;
  const mappedEntry = getDiagnosticForCode(mappedCode);
  if (mappedEntry) return mappedEntry;

  if (fallbackCode) return getDiagnosticForCode(fallbackCode);
  return null;
}
