const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadDiagnosticsModule() {
  const source = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/utils/desktopDiagnostics.js"
      ),
      "utf8"
    )
    .replace(/export const /g, "const ")
    .replace(/export function /g, "function ")
    .replace(/export default /g, "");

  const script = new vm.Script(
    `${source}
module.exports = {
  DESKTOP_DIAGNOSTIC_CATALOG,
  SEVERITY_ORDER,
  getDiagnosticForCode,
  isKnownDiagnosticCode,
  allDiagnosticCodes,
  sortDiagnostics,
  diagnosticFromResult,
};`
  );

  const sandbox = { module: { exports: {} }, exports: {}, Object };
  vm.createContext(sandbox);
  script.runInContext(sandbox);
  return sandbox.module.exports;
}

describe("frontend desktopDiagnostics utility", () => {
  const mod = loadDiagnosticsModule();

  const REQUIRED_CODES = [
    "runtime_missing",
    "runtime_launch_failed",
    "runtime_healthcheck_failed",
    "runtime_healthcheck_timeout",
    "runtime_shutdown_failed",
    "untrusted_origin",
    "storage_contract_invalid",
    "local_user_root_invalid",
    "settings_file_missing",
    "settings_file_corrupt",
    "settings_file_symlink_rejected",
    "backup_directory_invalid",
    "backup_file_symlink_rejected",
    "backup_import_failed",
    "backup_export_failed",
    "ollama_unreachable",
    "ollama_not_installed",
    "no_models_installed",
    "selected_model_missing",
    "selected_model_stale",
    "selected_model_invalid",
    "local_provider_unavailable",
    "selected_model_not_ready",
    "model_restore_failed",
  ];

  it("catalog contains every required reason code", () => {
    for (const code of REQUIRED_CODES) {
      expect(mod.DESKTOP_DIAGNOSTIC_CATALOG).toHaveProperty(code);
    }
  });

  it("every catalog entry has a non-empty title, description, and action", () => {
    for (const [code, entry] of Object.entries(mod.DESKTOP_DIAGNOSTIC_CATALOG)) {
      expect(typeof entry.title).toBe("string");
      expect(entry.title.length).toBeGreaterThan(0);
      expect(typeof entry.description).toBe("string");
      expect(entry.description.length).toBeGreaterThan(0);
      expect(typeof entry.action).toBe("string");
      expect(entry.action.length).toBeGreaterThan(0);
    }
  });

  it("no catalog entry leaks secrets in visible text", () => {
    const SECRET_FRAGMENTS = [
      "auth",
      "token",
      "apikey",
      "secret",
      "password",
      "sessiontoken",
      "serverdb",
      "dbpath",
    ];
    for (const [code, entry] of Object.entries(mod.DESKTOP_DIAGNOSTIC_CATALOG)) {
      const text =
        `${entry.title} ${entry.description} ${entry.action}`.toLowerCase();
      for (const fragment of SECRET_FRAGMENTS) {
        expect(text).not.toContain(fragment);
      }
    }
  });

  it("getDiagnosticForCode returns full entry for known code", () => {
    const entry = mod.getDiagnosticForCode("runtime_healthcheck_timeout");
    expect(entry).not.toBeNull();
    expect(entry.code).toBe("runtime_healthcheck_timeout");
    expect(entry.severity).toBe("warning");
  });

  it("getDiagnosticForCode returns null for unknown codes", () => {
    expect(mod.getDiagnosticForCode("not_real")).toBeNull();
    expect(mod.getDiagnosticForCode("")).toBeNull();
  });

  it("diagnosticFromResult resolves known reason from result object", () => {
    const entry = mod.diagnosticFromResult({ ok: false, reason: "backup_import_failed" });
    expect(entry).not.toBeNull();
    expect(entry.code).toBe("backup_import_failed");
  });

  it("diagnosticFromResult maps backup_file_symlink to backup_file_symlink_rejected", () => {
    const entry = mod.diagnosticFromResult({ ok: false, reason: "backup_file_symlink" });
    expect(entry).not.toBeNull();
    expect(entry.code).toBe("backup_file_symlink_rejected");
  });

  it("diagnosticFromResult maps backup_path_invalid to backup_directory_invalid", () => {
    const entry = mod.diagnosticFromResult({ ok: false, reason: "backup_path_invalid" });
    expect(entry).not.toBeNull();
    expect(entry.code).toBe("backup_directory_invalid");
  });

  it("diagnosticFromResult maps backup_parse_failed to backup_import_failed", () => {
    const entry = mod.diagnosticFromResult({ ok: false, reason: "backup_parse_failed" });
    expect(entry).not.toBeNull();
    expect(entry.code).toBe("backup_import_failed");
  });

  it("diagnosticFromResult maps backup_validation_failed to backup_import_failed", () => {
    const entry = mod.diagnosticFromResult({
      ok: false,
      reason: "backup_validation_failed",
    });
    expect(entry).not.toBeNull();
    expect(entry.code).toBe("backup_import_failed");
  });

  it("diagnosticFromResult returns fallback diagnostic for unknown reason", () => {
    const entry = mod.diagnosticFromResult(
      { ok: false, reason: "unknown_xyz" },
      "backup_export_failed"
    );
    expect(entry).not.toBeNull();
    expect(entry.code).toBe("backup_export_failed");
  });

  it("diagnosticFromResult returns null for unknown reason without fallback", () => {
    expect(mod.diagnosticFromResult({ reason: "unknown_xyz" })).toBeNull();
  });

  it("diagnosticFromResult does not include message or path from result", () => {
    const entry = mod.diagnosticFromResult({
      ok: false,
      reason: "backup_import_failed",
      message: "SECRET_VALUE=abc123",
      path: "/root/.config/swarmsy/secret.json",
    });
    expect(entry).not.toBeNull();
    const text = `${entry.title} ${entry.description} ${entry.action}`;
    expect(text).not.toContain("SECRET_VALUE");
    expect(text).not.toContain("abc123");
    expect(text).not.toContain("/root");
  });

  it("sortDiagnostics correctly orders errors, warnings, then info", () => {
    const input = [
      { code: "a", severity: "info", title: "", description: "", action: "" },
      { code: "b", severity: "warning", title: "", description: "", action: "" },
      { code: "c", severity: "error", title: "", description: "", action: "" },
    ];
    const sorted = mod.sortDiagnostics(input);
    expect(sorted[0].severity).toBe("error");
    expect(sorted[1].severity).toBe("warning");
    expect(sorted[2].severity).toBe("info");
  });

  it("sortDiagnostics handles empty and null input safely", () => {
    expect(mod.sortDiagnostics([])).toEqual([]);
    expect(mod.sortDiagnostics(null)).toEqual([]);
    expect(mod.sortDiagnostics(undefined)).toEqual([]);
  });

  it("sortDiagnostics does not mutate the input array", () => {
    const original = [
      { code: "a", severity: "info", title: "", description: "", action: "" },
      { code: "b", severity: "error", title: "", description: "", action: "" },
    ];
    mod.sortDiagnostics(original);
    expect(original[0].code).toBe("a");
  });

  it("frontend catalog matches the server catalog in codes", () => {
    const serverMod = require("../../../server/utils/swarmsy/desktopDiagnostics");
    const frontendCodes = Object.keys(mod.DESKTOP_DIAGNOSTIC_CATALOG).sort();
    const serverCodes = serverMod.allDiagnosticCodes().sort();
    expect(frontendCodes).toEqual(serverCodes);
  });
});

describe("SwarmsyDesktopDiagnosticsPanel rendering (logic-level)", () => {
  const mod = loadDiagnosticsModule();

  it("multiple diagnostics with mixed severities sort correctly", () => {
    const diagnostics = [
      mod.getDiagnosticForCode("selected_model_stale"),    // info
      mod.getDiagnosticForCode("ollama_unreachable"),       // warning
      mod.getDiagnosticForCode("runtime_launch_failed"),    // error
    ];
    const sorted = mod.sortDiagnostics(diagnostics);
    expect(sorted[0].code).toBe("runtime_launch_failed");
    expect(sorted[1].code).toBe("ollama_unreachable");
    expect(sorted[2].code).toBe("selected_model_stale");
  });

  it("empty diagnostics array produces empty sorted output", () => {
    expect(mod.sortDiagnostics([])).toEqual([]);
  });

  it("all required codes produce a renderable (non-null) entry", () => {
    for (const code of Object.keys(mod.DESKTOP_DIAGNOSTIC_CATALOG)) {
      const entry = mod.getDiagnosticForCode(code);
      expect(entry).not.toBeNull();
      expect(entry.code).toBe(code);
      expect(entry.title.length).toBeGreaterThan(0);
      expect(entry.description.length).toBeGreaterThan(0);
      expect(entry.action.length).toBeGreaterThan(0);
    }
  });
});
