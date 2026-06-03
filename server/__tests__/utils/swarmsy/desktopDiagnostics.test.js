"use strict";

const {
  DESKTOP_DIAGNOSTIC_CATALOG,
  SEVERITY_ORDER,
  getDiagnosticForCode,
  isKnownDiagnosticCode,
  allDiagnosticCodes,
  sortDiagnostics,
  diagnosticFromResult,
} = require("../../../utils/swarmsy/desktopDiagnostics");

describe("SWARMSY desktop diagnostics utility", () => {
  // ── Catalog completeness ─────────────────────────────────────────────────

  const REQUIRED_REASON_CODES = [
    // Runtime
    "runtime_missing",
    "runtime_launch_failed",
    "runtime_healthcheck_failed",
    "runtime_healthcheck_timeout",
    "runtime_shutdown_failed",
    // Desktop
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
    // Ollama
    "ollama_unreachable",
    "ollama_not_installed",
    "no_models_installed",
    "selected_model_missing",
    "selected_model_stale",
    "selected_model_invalid",
    // Chat
    "local_provider_unavailable",
    "selected_model_not_ready",
    "model_restore_failed",
  ];

  it("contains every required reason code", () => {
    for (const code of REQUIRED_REASON_CODES) {
      expect(DESKTOP_DIAGNOSTIC_CATALOG).toHaveProperty(code);
    }
  });

  it("every catalog entry has severity, title, description, and action", () => {
    for (const [code, entry] of Object.entries(DESKTOP_DIAGNOSTIC_CATALOG)) {
      expect(SEVERITY_ORDER).toContain(entry.severity);
      expect(typeof entry.title).toBe("string");
      expect(entry.title.length).toBeGreaterThan(0);
      expect(typeof entry.description).toBe("string");
      expect(entry.description.length).toBeGreaterThan(0);
      expect(typeof entry.action).toBe("string");
      expect(entry.action.length).toBeGreaterThan(0);
    }
  });

  it("allDiagnosticCodes() returns every catalog key", () => {
    const codes = allDiagnosticCodes();
    for (const code of REQUIRED_REASON_CODES) {
      expect(codes).toContain(code);
    }
  });

  // ── Secret leakage guard ─────────────────────────────────────────────────

  const SECRET_FRAGMENTS = [
    "auth",
    "token",
    "apikey",
    "api_key",
    "secret",
    "sessiontoken",
    "session_token",
    "serverdb",
    "server_db",
    "dbpath",
    "db_path",
    "adminpass",
    "password",
  ];

  it("no catalog entry leaks secrets in any text field", () => {
    for (const [code, entry] of Object.entries(DESKTOP_DIAGNOSTIC_CATALOG)) {
      const combined =
        `${entry.title} ${entry.description} ${entry.action}`.toLowerCase();
      for (const fragment of SECRET_FRAGMENTS) {
        expect(combined).not.toContain(fragment);
      }
    }
  });

  // ── getDiagnosticForCode ──────────────────────────────────────────────────

  it("getDiagnosticForCode returns a full entry for a known code", () => {
    const entry = getDiagnosticForCode("runtime_healthcheck_timeout");
    expect(entry).not.toBeNull();
    expect(entry.code).toBe("runtime_healthcheck_timeout");
    expect(entry.severity).toBe("warning");
    expect(typeof entry.title).toBe("string");
    expect(typeof entry.description).toBe("string");
    expect(typeof entry.action).toBe("string");
  });

  it("getDiagnosticForCode returns null for an unknown code", () => {
    expect(getDiagnosticForCode("this_does_not_exist")).toBeNull();
    expect(getDiagnosticForCode("")).toBeNull();
    expect(getDiagnosticForCode(null)).toBeNull();
    expect(getDiagnosticForCode(undefined)).toBeNull();
  });

  it("getDiagnosticForCode trims whitespace from code", () => {
    const entry = getDiagnosticForCode("  runtime_missing  ");
    expect(entry).not.toBeNull();
    expect(entry.code).toBe("runtime_missing");
  });

  // ── isKnownDiagnosticCode ─────────────────────────────────────────────────

  it("isKnownDiagnosticCode returns true for known codes and false otherwise", () => {
    expect(isKnownDiagnosticCode("ollama_unreachable")).toBe(true);
    expect(isKnownDiagnosticCode("not_a_real_code")).toBe(false);
    expect(isKnownDiagnosticCode("")).toBe(false);
  });

  // ── sortDiagnostics ───────────────────────────────────────────────────────

  it("sortDiagnostics orders errors first, warnings second, info last", () => {
    const input = [
      { code: "a", severity: "info", title: "", description: "", action: "" },
      { code: "b", severity: "error", title: "", description: "", action: "" },
      {
        code: "c",
        severity: "warning",
        title: "",
        description: "",
        action: "",
      },
      { code: "d", severity: "error", title: "", description: "", action: "" },
    ];

    const sorted = sortDiagnostics(input);
    expect(sorted[0].severity).toBe("error");
    expect(sorted[1].severity).toBe("error");
    expect(sorted[2].severity).toBe("warning");
    expect(sorted[3].severity).toBe("info");
  });

  it("sortDiagnostics preserves relative order for equal severity", () => {
    const input = [
      {
        code: "first",
        severity: "warning",
        title: "",
        description: "",
        action: "",
      },
      {
        code: "second",
        severity: "warning",
        title: "",
        description: "",
        action: "",
      },
    ];
    const sorted = sortDiagnostics(input);
    expect(sorted[0].code).toBe("first");
    expect(sorted[1].code).toBe("second");
  });

  it("sortDiagnostics returns [] for non-array input", () => {
    expect(sortDiagnostics(null)).toEqual([]);
    expect(sortDiagnostics(undefined)).toEqual([]);
    expect(sortDiagnostics("not an array")).toEqual([]);
  });

  it("sortDiagnostics does not mutate the original array", () => {
    const original = [
      {
        code: "a",
        severity: "info",
        title: "",
        description: "",
        action: "",
      },
      {
        code: "b",
        severity: "error",
        title: "",
        description: "",
        action: "",
      },
    ];
    sortDiagnostics(original);
    expect(original[0].code).toBe("a");
  });

  // ── diagnosticFromResult ──────────────────────────────────────────────────

  it("diagnosticFromResult resolves a known reason code from a result object", () => {
    const result = { ok: false, reason: "runtime_launch_failed" };
    const entry = diagnosticFromResult(result);
    expect(entry).not.toBeNull();
    expect(entry.code).toBe("runtime_launch_failed");
    expect(entry.severity).toBe("error");
  });

  it("diagnosticFromResult returns null for unknown reason codes", () => {
    expect(diagnosticFromResult({ reason: "unknown_xyz" })).toBeNull();
    expect(diagnosticFromResult({})).toBeNull();
    expect(diagnosticFromResult(null)).toBeNull();
  });

  it("diagnosticFromResult does not forward message or path values", () => {
    const result = {
      ok: false,
      reason: "backup_import_failed",
      message: "SECRET_TOKEN=abcdef123456",
      path: "/home/user/.config/swarmsy/secret.json",
    };
    const entry = diagnosticFromResult(result);
    expect(entry).not.toBeNull();
    const text = `${entry.title} ${entry.description} ${entry.action}`;
    expect(text).not.toContain("SECRET_TOKEN");
    expect(text).not.toContain("abcdef123456");
    expect(text).not.toContain("/home/user");
  });
});
