const fs = require("fs");
const path = require("path");
const vm = require("vm");

function readFrontendModule(relativePath) {
  return fs
    .readFileSync(
      path.resolve(__dirname, "../../../frontend/src", relativePath),
      "utf8"
    )
    .replace(/import\s*{[\s\S]*?}\s*from\s*".*?";\r?\n/g, "")
    .replace(/import .* from ".*?";\r?\n/g, "")
    .replace(/export const /g, "const ")
    .replace(/export function /g, "function ");
}

function loadActionHubModule() {
  const source = [
    readFrontendModule("components/SwarmsyFirstRunOnboarding/handoff.js"),
    readFrontendModule(
      "components/SwarmsyFirstRunOnboarding/campaignCalendar.js"
    ),
    readFrontendModule("components/SwarmsyFirstRunOnboarding/memoryLock.js"),
    readFrontendModule("components/SwarmsyFirstRunOnboarding/proofTracker.js"),
    readFrontendModule("components/SwarmsyFirstRunOnboarding/actionHub.js"),
  ].join("\n");

  const script = new vm.Script(
    `${source}
module.exports = {
  ACTION_HUB_TITLE,
  ACTION_HUB_HELPER_COPY,
  ACTION_BUSY_MESSAGE,
  ACTION_HUB_GROUPS,
  isActionHubReady,
  getIntakeDisabledMessage,
  getActionHubActionState
};`
  );
  const sandbox = {
    module: { exports: {} },
    exports: {},
  };
  vm.createContext(sandbox);
  script.runInContext(sandbox);
  return sandbox.module.exports;
}

function buildReadyStatus(overrides = {}) {
  return {
    workspace: {
      exists: true,
      ready: true,
      slug: "swarmsy-hive",
      ...overrides.workspace,
    },
    doctrine: {
      statusAvailable: true,
      docsRootAvailable: true,
      requiredMissing: 0,
      requiredNonLoadable: 0,
      ...overrides.doctrine,
    },
  };
}

describe("SWARMSY HIVE action hub", () => {
  it("shows the ready hub structure with all grouped actions", () => {
    const actionHub = loadActionHubModule();
    const readyStatus = buildReadyStatus();
    const state = actionHub.getActionHubActionState({
      status: readyStatus,
      selectedMode: "face",
      busyAction: null,
    });

    expect(actionHub.ACTION_HUB_TITLE).toBe("SWARMSY HIVE Action Hub");
    expect(actionHub.ACTION_HUB_HELPER_COPY).toContain(
      "Every action routes through your HIVE and keeps the project moving."
    );
    expect(actionHub.ACTION_HUB_GROUPS.map((group) => group.title)).toEqual([
      "Build",
      "Continue",
      "Launch",
      "Verify",
    ]);
    expect(
      actionHub.ACTION_HUB_GROUPS.flatMap((group) => group.actions)
    ).toEqual([
      "Start Intake",
      "Existing Project",
      "Load Memory Lock",
      "Campaign Calendar",
      "Review Proof / Find Proof Gaps",
    ]);
    expect(actionHub.isActionHubReady(readyStatus)).toBe(true);
    expect(state.ready).toBe(true);
    expect(state.actions.startIntake.disabled).toBe(false);
    expect(state.actions.loadMemoryLock.disabled).toBe(false);
    expect(state.actions.campaignCalendar.disabled).toBe(false);
    expect(state.actions.reviewProof.disabled).toBe(false);
  });

  it("blocks local-user intake without a selected installed Ollama model", () => {
    const actionHub = loadActionHubModule();
    const state = actionHub.getActionHubActionState({
      status: buildReadyStatus(),
      selectedMode: "face",
      busyAction: null,
      runtimeMode: "local_user",
      localOllamaStatus: "reachable",
      selectedLocalOllamaModel: "",
      localOllamaModels: [{ id: "llama3.1:8b" }],
    });

    expect(state.actions.startIntake.disabled).toBe(true);
    expect(state.actions.startIntake.disabledReason).toBe(
      "Select an installed Ollama model before starting intake."
    );
  });

  it("blocks local-user intake when selected model is not in verified model list", () => {
    const actionHub = loadActionHubModule();
    const state = actionHub.getActionHubActionState({
      status: buildReadyStatus(),
      selectedMode: "face",
      busyAction: null,
      runtimeMode: "local_user",
      localOllamaStatus: "reachable",
      selectedLocalOllamaModel: "missing:model",
      localOllamaModels: [{ id: "llama3.1:8b" }],
    });

    expect(state.actions.startIntake.disabled).toBe(true);
    expect(state.actions.startIntake.disabledReason).toBe(
      "Select an installed Ollama model before starting intake."
    );
  });

  it("blocks local-user intake when Ollama model list is not verified yet", () => {
    const actionHub = loadActionHubModule();
    const state = actionHub.getActionHubActionState({
      status: buildReadyStatus(),
      selectedMode: "face",
      busyAction: null,
      runtimeMode: "local_user",
      localOllamaStatus: "checking",
      selectedLocalOllamaModel: "llama3.1:8b",
      localOllamaModels: [{ id: "llama3.1:8b" }],
    });

    expect(state.actions.startIntake.disabled).toBe(true);
    expect(state.actions.startIntake.disabledReason).toBe(
      "Check Local User Mode Ollama status and select an installed model before starting intake."
    );
  });

  it("keeps the no-HIVE state in the create flow", () => {
    const actionHub = loadActionHubModule();
    const status = buildReadyStatus({ workspace: { exists: false } });
    const state = actionHub.getActionHubActionState({
      status,
      selectedMode: "face",
      busyAction: null,
    });

    expect(actionHub.isActionHubReady(status)).toBe(false);
    expect(state.ready).toBe(false);
    expect(state.actions.startIntake.disabledReason).toBe(
      "Create your SWARMSY HIVE before starting intake."
    );
    expect(state.actions.loadMemoryLock.disabledReason).toBe(
      "Create and load your SWARMSY HIVE before continuing from a memory lock."
    );
  });

  it("keeps the underloaded state in the load-docs flow", () => {
    const actionHub = loadActionHubModule();
    const status = buildReadyStatus({
      workspace: { ready: false },
      doctrine: { requiredMissing: 1 },
    });
    const state = actionHub.getActionHubActionState({
      status,
      selectedMode: "face",
      busyAction: null,
    });

    expect(actionHub.isActionHubReady(status)).toBe(false);
    expect(state.actions.startIntake.disabledReason).toBe(
      "Load required doctrine docs before starting intake."
    );
    expect(state.actions.campaignCalendar.disabledReason).toBe(
      "Load required doctrine docs before using the campaign calendar."
    );
  });

  it("does not expose ready actions when doctrine is unavailable", () => {
    const actionHub = loadActionHubModule();
    const status = buildReadyStatus({
      doctrine: { statusAvailable: false },
    });
    const state = actionHub.getActionHubActionState({
      status,
      selectedMode: "face",
      busyAction: null,
    });

    expect(actionHub.isActionHubReady(status)).toBe(false);
    expect(state.actions.reviewProof.disabledReason).toBe(
      "Doctrine readiness cannot be confirmed. Check HIVE readiness before reviewing proof."
    );
  });

  it("keeps actions disabled during busy states", () => {
    const actionHub = loadActionHubModule();
    const state = actionHub.getActionHubActionState({
      status: buildReadyStatus(),
      selectedMode: "hidden",
      busyAction: "proof-review",
    });

    expect(state.actions.startIntake.disabled).toBe(true);
    expect(state.actions.loadMemoryLock.disabled).toBe(true);
    expect(state.actions.campaignCalendar.disabled).toBe(true);
    expect(state.actions.reviewProof.disabled).toBe(true);
    expect(state.actions.reviewProof.busy).toBe(true);
    expect(state.actions.startIntake.disabledReason).toBe(
      actionHub.ACTION_BUSY_MESSAGE
    );
  });

  it("keeps the onboarding model on user-safe routes only", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "../../../frontend/src/models/swarmsyOnboarding.js"),
      "utf8"
    );

    expect(source).toContain("/swarmsy/onboarding/status");
    expect(source).toContain("/swarmsy/onboarding/create-hive");
    expect(source).toContain("/swarmsy/onboarding/ingest-required-docs");
    expect(source).toContain("/swarmsy/local-user/ollama/status");
    expect(source).not.toContain("/admin/");
  });

  it("includes action hub copy in the onboarding component", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(source).toContain("ACTION_HUB_TITLE");
    expect(source).toContain("Choose the next command for SPARKY.");
    expect(source).toContain("Local User Mode · Ollama");
    expect(source).toContain("Model selection shell");
    expect(source).toContain("Check again");
    expect(source).toContain("Ollama was not detected.");
    expect(source).toContain(
      "Model selection is stored in Local User Mode browser storage"
    );
  });

  it("wires abort-safe local-user Ollama sync in onboarding mount effect", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(source).toContain("const controller = beginLocalUserOllamaRequest();");
    expect(source).toContain(
      "syncLocalUserOllamaStatus({ signal: controller.signal });"
    );
    expect(source).toContain("releaseLocalUserOllamaRequest(controller);");
    expect(source).toContain("if (signal?.aborted || !isLatestLocalUserOllamaRequest(signal))");
    expect(source).toContain("return null;");
  });

  it("uses abort-safe manual refresh with shared ref in checkLocalUserOllama", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(source).toContain("localOllamaRefreshControllerRef");
    expect(source).toContain(
      "const controller = beginLocalUserOllamaRequest();"
    );
    expect(source).toContain("} finally {");
    expect(source).toContain(
      "releaseLocalUserOllamaRequest(controller)"
    );
    expect(source).toContain("!controller.signal.aborted");
  });

  it("guards Local Ollama updates so only the latest request may set state", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(source).toContain("isLatestLocalUserOllamaRequest");
    expect(source).toContain(
      "localOllamaRefreshControllerRef.current?.signal === signal"
    );
    expect(source).toContain("releaseLocalUserOllamaRequest");
  });

  it("clears stale fields when transitioning to checking state", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(source).toContain('status: "checking"');
    expect(source).toContain("models: [],");
    expect(source).toContain("endpoint: null,");
    expect(source).toContain("message: null,");
  });

  it("trims model.id before falling back to name in normalizeLocalUserModel", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(source).toContain('const rawId = String(model?.id ?? "").trim();');
    expect(source).toContain("id: rawId || name ||");
  });

  it("normalizeLocalUserOllamaStatus rejects fallback/unknown mode responses", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(source).toContain('response?.mode !== "local_user"');
    expect(source).toContain('response?.source === "fallback"');
  });

  it("network failure fallback uses mode unknown with source fallback, not local_user", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/models/swarmsyOnboarding.js"
      ),
      "utf8"
    );

    expect(source).toContain('mode: "unknown"');
    expect(source).toContain('source: "fallback"');
    expect(source).not.toMatch(/catch[\s\S]*?mode:\s*"local_user"/);
  });

  it("tracks confirmed local-user mode via hasConfirmedLocalUserModeRef", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(source).toContain("hasConfirmedLocalUserModeRef");
    expect(source).toContain("hasConfirmedLocalUserModeRef.current = true");
    expect(source).toContain("hasConfirmedLocalUserModeRef.current");
  });

  it("persists and restores local-user model selection via dedicated helper", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(source).toContain("readLocalUserOllamaModelSelection");
    expect(source).toContain("resolveLocalUserOllamaModelSelection");
    expect(source).toContain("persistLocalUserOllamaModelSelection");
    expect(source).toContain("stale_missing");
  });

  it("restores create-hive busy state before awaiting the request", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(source).toMatch(
      /async function createHive\(\) \{\s*setBusyAction\("create-hive"\);\s*setLastActionResult\(null\);\s*const result = await SwarmsyOnboarding\.createHive\(\);[\s\S]*setBusyAction\(null\);/m
    );
  });

  it("applies imported backups to live local-user model state immediately when already verified", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(source).toContain(
      "const restoredModelId = readLocalUserOllamaModelSelection();"
    );
    expect(source).toContain("} else if (hasVerifiedLocalOllamaModels) {");
    expect(source).toContain("const importedModelIsInstalled = localOllamaStatus.models.some(");
    expect(source).toContain("setSelectedLocalOllamaModel(restoredModelId);");
    expect(source).toContain("IMPORTED_LOCAL_OLLAMA_MODEL_MISSING_MESSAGE");
  });

  it("preserves imported model storage until verification finishes and then refreshes status", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(source).toContain("IMPORTED_LOCAL_OLLAMA_MODEL_PENDING_MESSAGE");
    expect(source).toContain(
      "const controller = beginLocalUserOllamaRequest();"
    );
    expect(source).toContain(
      "await syncLocalUserOllamaStatus({ signal: controller.signal });"
    );
    expect(source).toContain("releaseLocalUserOllamaRequest(controller);");
  });

  it("shows backup controls only in local-user mode", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(source).toMatch(/isLocalUserMode && \([\s\S]*Backup &amp; Restore/);
  });

  it("adds runtime handoff contract payload for local-user ollama selection", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(source).toContain("getLocalUserOllamaRuntimeSelection");
    expect(source).toContain("if (runtimeSelection)");
    expect(source).toContain("handoffPayload.runtime = runtimeSelection");
    expect(source).toContain('mode: isLocalUserMode ? "local_user" : "hosted_admin"');
  });

  it("preserves saved local-user model selection through unverified status states", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(source).toContain('localOllamaStatus.status === "reachable"');
    expect(source).toContain('localOllamaStatus.status === "no_models"');
    expect(source).toContain("if (!hasVerifiedLocalOllamaModels)");
    expect(source).not.toContain(
      "} else {\n      clearLocalUserOllamaModelSelection();"
    );
  });

  it("fallback before local-user mode confirmed hides the panel; fallback after confirmed keeps panel with error state", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(source).toContain('response?.source === "fallback"');
    expect(source).toContain("hasConfirmedLocalUserModeRef.current");
    expect(source).toContain('status: "error"');
  });

  it("setup guidance for unreachable only, not for error state", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(source).toContain('localOllamaStatus.status === "unreachable"');
    expect(source).not.toMatch(
      /localOllamaStatus\.status === "unreachable"[\s\S]*?localOllamaStatus\.status === "error"[\s\S]*?LOCAL_OLLAMA_SETUP_GUIDANCE/
    );
    expect(source).not.toMatch(
      /\(localOllamaStatus\.status === "unreachable" \|\|\s*localOllamaStatus\.status === "error"\)/
    );
  });
});
