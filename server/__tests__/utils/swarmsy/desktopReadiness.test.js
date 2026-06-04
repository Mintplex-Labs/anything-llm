const fs = require("fs");
const path = require("path");

const {
  CHECK_IDS,
  READINESS_LEVELS,
  getDesktopReadiness,
  storageCheck,
} = require("../../../utils/swarmsy/desktopReadiness");

describe("SWARMSY Desktop readiness engine", () => {
  const readyRuntime = {
    ok: true,
    responding: true,
    startUrl: "http://127.0.0.1:3000",
  };
  const readyStorage = {
    ok: true,
    layout: { mode: "local_user", root: "/tmp/swarmsy" },
  };
  const readyBridge = { ok: true };
  const readyOllama = {
    reachable: true,
    status: "reachable",
    endpoint: "http://localhost:11434/api/tags",
    models: [{ id: "llama3.1:8b", name: "llama3.1:8b" }],
  };

  it("documents that server readiness mirrors the renderer wizard rules until production wiring lands", () => {
    const helperSource = fs.readFileSync(
      path.resolve(__dirname, "../../../utils/swarmsy/desktopReadiness.js"),
      "utf8"
    );
    const wizardSource = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../../frontend/src/components/SwarmsyDesktopFirstRunWizard/index.jsx"
      ),
      "utf8"
    );

    expect(helperSource).toContain("Server-side readiness mirror");
    expect(helperSource).toContain("TODO(desktop-readiness)");
    expect(helperSource).toContain("Models could not be verified");
    expect(wizardSource).toContain("Models could not be verified");
    expect(helperSource).toContain("Start or check Ollama");
    expect(wizardSource).toContain("Start or check Ollama");
  });

  it("returns ready when runtime, storage, bridge, Ollama, and selected model are available", async () => {
    const result = await getDesktopReadiness({
      runtimeStatus: readyRuntime,
      storageStatus: readyStorage,
      desktopBridgeStatus: readyBridge,
      ollamaStatus: readyOllama,
      selectedModel: "llama3.1:8b",
    });

    expect(result.status).toBe(READINESS_LEVELS.READY);
    expect(result.checks.map((check) => check.id)).toEqual([
      CHECK_IDS.RUNTIME_AVAILABLE,
      CHECK_IDS.STORAGE_AVAILABLE,
      CHECK_IDS.DESKTOP_BRIDGE_AVAILABLE,
      CHECK_IDS.OLLAMA_AVAILABLE,
      CHECK_IDS.MODEL_AVAILABLE,
    ]);
    expect(result.diagnostics).toEqual([]);
    const storageCheck = result.checks.find(
      (check) => check.id === CHECK_IDS.STORAGE_AVAILABLE
    );
    expect(storageCheck.metadata).toEqual({});
    expect(JSON.stringify(result)).not.toContain("/tmp/swarmsy");
  });


  it("accepts safe storage status shapes without exposing local paths", () => {
    const minimalStorage = storageCheck({ ok: true, mode: "local_user" });
    const layoutStorage = storageCheck({
      ok: true,
      layout: { mode: "local_user", root: "/tmp/swarmsy" },
    });

    expect(minimalStorage).toMatchObject({
      id: CHECK_IDS.STORAGE_AVAILABLE,
      status: READINESS_LEVELS.READY,
      metadata: {},
    });
    expect(layoutStorage).toMatchObject({
      id: CHECK_IDS.STORAGE_AVAILABLE,
      status: READINESS_LEVELS.READY,
      metadata: {},
    });
    expect(JSON.stringify(layoutStorage)).not.toContain("/tmp/swarmsy");
  });

  it("rejects non-local-user storage modes", () => {
    expect(storageCheck({ ok: true, mode: "hosted" })).toMatchObject({
      id: CHECK_IDS.STORAGE_AVAILABLE,
      status: READINESS_LEVELS.BLOCKED,
      diagnosticCode: "storage_contract_invalid",
    });
    expect(storageCheck({ ok: true, layout: { mode: "hosted" } })).toMatchObject({
      id: CHECK_IDS.STORAGE_AVAILABLE,
      status: READINESS_LEVELS.BLOCKED,
      diagnosticCode: "storage_contract_invalid",
    });
  });

  it("blocks readiness when runtime is unavailable", async () => {
    const result = await getDesktopReadiness({
      runtimeStatus: {
        ok: false,
        responding: false,
        reason: "runtime_unreachable",
      },
      storageStatus: readyStorage,
      desktopBridgeStatus: readyBridge,
      ollamaStatus: readyOllama,
    });

    expect(result.status).toBe(READINESS_LEVELS.BLOCKED);
    expect(
      result.checks.find((check) => check.id === CHECK_IDS.RUNTIME_AVAILABLE)
    ).toMatchObject({
      status: READINESS_LEVELS.BLOCKED,
      diagnosticCode: "runtime_healthcheck_failed",
    });
  });

  it("warns when Ollama is unavailable without claiming models are missing", async () => {
    const result = await getDesktopReadiness({
      runtimeStatus: readyRuntime,
      storageStatus: readyStorage,
      desktopBridgeStatus: readyBridge,
      ollamaStatus: { reachable: false, status: "unreachable", models: [] },
    });

    const diagnosticCodes = result.diagnostics.map(
      (diagnostic) => diagnostic.code
    );
    const modelCheck = result.checks.find(
      (check) => check.id === CHECK_IDS.MODEL_AVAILABLE
    );

    expect(result.status).toBe(READINESS_LEVELS.WARNING);
    expect(diagnosticCodes).toContain("ollama_unreachable");
    expect(diagnosticCodes).not.toContain("no_models_installed");
    expect(modelCheck).toMatchObject({
      status: READINESS_LEVELS.WARNING,
      title: "Models could not be verified",
      diagnosticCode: null,
      action: "Start or check Ollama, then run readiness checks again.",
    });
    expect(modelCheck.action).not.toContain("ollama pull");
  });

  it("warns when reachable Ollama has no models and suggests the default pull command", async () => {
    const result = await getDesktopReadiness({
      runtimeStatus: readyRuntime,
      storageStatus: readyStorage,
      desktopBridgeStatus: readyBridge,
      ollamaStatus: { reachable: true, status: "no_models", models: [] },
      defaultModel: "llama3.1:8b",
    });

    const modelCheck = result.checks.find(
      (check) => check.id === CHECK_IDS.MODEL_AVAILABLE
    );
    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toContain(
      "no_models_installed"
    );
    expect(modelCheck).toMatchObject({
      status: READINESS_LEVELS.WARNING,
      diagnosticCode: "no_models_installed",
      action: "Run: ollama pull llama3.1:8b",
    });
  });

  it("warns when the saved model is not installed", async () => {
    const result = await getDesktopReadiness({
      runtimeStatus: readyRuntime,
      storageStatus: readyStorage,
      desktopBridgeStatus: readyBridge,
      ollamaStatus: readyOllama,
      selectedModel: "missing:model",
    });

    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).not.toContain(
      "no_models_installed"
    );
    expect(
      result.checks.find((check) => check.id === CHECK_IDS.MODEL_AVAILABLE)
    ).toMatchObject({
      status: READINESS_LEVELS.WARNING,
      diagnosticCode: "selected_model_missing",
    });
  });
});
