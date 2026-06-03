"use strict";

/**
 * Desktop Diagnostics Integration Tests
 *
 * Verifies that the canonical diagnostic catalog maps correctly to the
 * failure codes produced by runtime launcher, backup store, and the
 * desktop foundation utilities — without requiring those utilities to
 * import the diagnostics module themselves.
 */

const path = require("path");
const {
  getDiagnosticForCode,
  isKnownDiagnosticCode,
} = require("../../../server/utils/swarmsy/desktopDiagnostics");

const launcherPath = path.resolve(
  __dirname,
  "../../..",
  "desktop/foundation/runtimeLauncher.cjs"
);

describe("runtime launcher failure → diagnostic mapping", () => {
  it("runtime_launch_failed reason is mapped in the catalog", () => {
    expect(isKnownDiagnosticCode("runtime_launch_failed")).toBe(true);
    const entry = getDiagnosticForCode("runtime_launch_failed");
    expect(entry.severity).toBe("error");
    expect(entry.title).toBeTruthy();
    expect(entry.action).toBeTruthy();
  });

  it("runtime_healthcheck_timeout reason is mapped in the catalog", () => {
    expect(isKnownDiagnosticCode("runtime_healthcheck_timeout")).toBe(true);
    const entry = getDiagnosticForCode("runtime_healthcheck_timeout");
    expect(entry.severity).toBe("warning");
  });

  it("waitForRuntimeHealthcheck produces runtime_healthcheck_timeout on timeout", async () => {
    const { waitForRuntimeHealthcheck } = require(launcherPath);

    // Use a real very-short timeout so the loop exits quickly
    const result = await waitForRuntimeHealthcheck({
      startUrl: "http://localhost:3001",
      timeoutMs: 20,
      retryIntervalMs: 5,
      runtimeHealthcheckImpl: async () => ({ ok: false, reason: "not_ready" }),
    });

    expect(result.ok).toBe(false);
    expect(result.reason).toBe("runtime_healthcheck_timeout");
    expect(isKnownDiagnosticCode(result.reason)).toBe(true);
  }, 10_000);

  it("launchDesktopLocalRuntime produces runtime_launch_failed on spawn error", async () => {
    const { launchDesktopLocalRuntime } = require(launcherPath);

    const brokenSpawn = () => {
      throw new Error("spawn failed");
    };

    const result = await launchDesktopLocalRuntime({
      rootDir: path.resolve(__dirname, "../../.."),
      env: { SWARMSY_DESKTOP_AUTO_START_RUNTIME: "true" },
      platform: "linux",
      spawnImpl: brokenSpawn,
      packageScripts: { "desktop:runtime:dev": "yarn dev:all" },
    });

    expect(result.ok).toBe(false);
    expect(result.reason).toBe("runtime_launch_failed");
    expect(isKnownDiagnosticCode(result.reason)).toBe(true);
  });
});

describe("backup store failure → diagnostic mapping", () => {
  const {
    validateLocalUserBackup,
    importLocalUserBackup,
  } = require("../../../desktop/foundation/localBackupStore.cjs");

  it("storage contract / path validation failures produce known diagnostic codes", () => {
    // backup_path_invalid maps via diagnosticFromResult to backup_directory_invalid
    expect(isKnownDiagnosticCode("backup_export_failed")).toBe(true);
    expect(isKnownDiagnosticCode("backup_directory_invalid")).toBe(true);
    expect(isKnownDiagnosticCode("backup_import_failed")).toBe(true);
    expect(isKnownDiagnosticCode("backup_file_symlink_rejected")).toBe(true);
  });

  it("validateLocalUserBackup returns a reason on schema failure", () => {
    const result = validateLocalUserBackup({ schema: "wrong_schema" });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("importLocalUserBackup produces backup_parse_failed on corrupt JSON input", async () => {
    const result = await importLocalUserBackup("not valid json {{{{");
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("backup_parse_failed");
    // backup_import_failed is the diagnostic umbrella shown to users
    expect(isKnownDiagnosticCode("backup_import_failed")).toBe(true);
  });

  it("storage_contract_invalid reason is mapped in the catalog", () => {
    expect(isKnownDiagnosticCode("storage_contract_invalid")).toBe(true);
    const entry = getDiagnosticForCode("storage_contract_invalid");
    expect(entry.severity).toBe("error");
  });

  it("settings_file_symlink_rejected reason is mapped in the catalog", () => {
    expect(isKnownDiagnosticCode("settings_file_symlink_rejected")).toBe(true);
    const entry = getDiagnosticForCode("settings_file_symlink_rejected");
    expect(entry.severity).toBe("error");
  });

  it("backup_file_symlink_rejected reason is mapped in the catalog", () => {
    expect(isKnownDiagnosticCode("backup_file_symlink_rejected")).toBe(true);
    const entry = getDiagnosticForCode("backup_file_symlink_rejected");
    expect(entry.severity).toBe("error");
  });
});

describe("Ollama detection failure → diagnostic mapping", () => {
  it("ollama_unreachable reason is mapped in the catalog", () => {
    expect(isKnownDiagnosticCode("ollama_unreachable")).toBe(true);
    const entry = getDiagnosticForCode("ollama_unreachable");
    expect(entry.severity).toBe("warning");
  });

  it("no_models_installed reason is mapped in the catalog", () => {
    expect(isKnownDiagnosticCode("no_models_installed")).toBe(true);
    const entry = getDiagnosticForCode("no_models_installed");
    expect(entry.severity).toBe("warning");
  });

  it("selected_model_missing reason is mapped in the catalog", () => {
    expect(isKnownDiagnosticCode("selected_model_missing")).toBe(true);
    const entry = getDiagnosticForCode("selected_model_missing");
    expect(entry.severity).toBe("warning");
  });

  it("selected_model_stale reason is mapped in the catalog", () => {
    expect(isKnownDiagnosticCode("selected_model_stale")).toBe(true);
    const entry = getDiagnosticForCode("selected_model_stale");
    expect(entry.severity).toBe("info");
  });

  it("detectLocalOllama unreachable status maps to a known diagnostic code", async () => {
    const {
      detectLocalOllama,
    } = require("../../../server/utils/swarmsy/localUserOllama");

    const fetchImpl = jest.fn().mockRejectedValue(
      Object.assign(new Error("ECONNREFUSED"), { code: "ECONNREFUSED" })
    );

    const result = await detectLocalOllama({ fetchImpl });
    expect(result.reachable).toBe(false);
    expect(result.status).toBe("unreachable");
    // The hub maps unreachable → ollama_unreachable diagnostic
    expect(isKnownDiagnosticCode("ollama_unreachable")).toBe(true);
  });

  it("detectLocalOllama no_models status maps to a known diagnostic code", async () => {
    const {
      detectLocalOllama,
    } = require("../../../server/utils/swarmsy/localUserOllama");

    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ models: [] }),
    });

    const result = await detectLocalOllama({ fetchImpl });
    expect(result.status).toBe("no_models");
    expect(isKnownDiagnosticCode("no_models_installed")).toBe(true);
  });
});
