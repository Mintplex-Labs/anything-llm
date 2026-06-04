const fs = require("fs");
const path = require("path");

function wizardSource() {
  return fs.readFileSync(
    path.resolve(
      __dirname,
      "../../../frontend/src/components/SwarmsyDesktopFirstRunWizard/index.jsx"
    ),
    "utf8"
  );
}

describe("SWARMSY Desktop first-run wizard frontend", () => {
  it("first launch starts on Welcome and displays wizard until desktopFirstRunCompleted is stored", () => {
    const source = wizardSource();
    expect(source).toContain("const [stepIndex, setStepIndex] = useState(0)");
    expect(source).toContain("readDesktopLocalUserFirstRunCompleted");
    expect(source).toContain("mirrorDesktopLocalUserFirstRunCompleted");
    expect(source).toContain("setVisible(true)");
    expect(source).toContain("!completed");
  });

  it("completed launch skips the wizard", () => {
    const source = wizardSource();
    expect(source).toContain("desktopCompletion.completed");
    expect(source).toContain("if (!completed)");
    expect(source).toContain("return null");
  });

  it("manual relaunch is gated to trusted desktop bridge sessions", () => {
    const source = wizardSource();
    expect(source).toContain("DESKTOP_FIRST_RUN_RELAUNCH_EVENT");
    expect(source).toContain("window.addEventListener(DESKTOP_FIRST_RUN_RELAUNCH_EVENT, relaunch)");
    expect(source).toContain("!hasTrustedDesktopBridge(window)");
    expect(source).toContain("setManualLaunch(true)");
  });

  it("Continue and Back advance through real wizard steps", () => {
    const source = wizardSource();
    expect(source).toContain("function goNext()");
    expect(source).toContain("function goBack()");
    expect(source).toMatch(/setStepIndex\(\(current\) =>\s*Math\.min\(WIZARD_STEPS\.length - 1, current \+ 1\)\s*\)/);
    expect(source).toContain("setStepIndex((current) => Math.max(0, current - 1))");
    expect(source).toContain("Continue");
    expect(source).toContain("Back");
  });

  it("blocks false completion unless readiness gates pass or setup is explicitly skipped", () => {
    const source = wizardSource();
    expect(source).toMatch(/const runtimeStepReady =\s*runtimeCheck && storageCheck && desktopBridgeAvailable/);
    expect(source).toContain("const selectedModelReady = !!selectedModel && selectedModelInstalled");
    expect(source).toContain("runtimeStepReady && ollamaCheck && modelCheck && selectedModelReady");
    expect(source).toContain("disabled={!canFinish}");
    expect(source).toContain("Skip for now");
  });

  it("runs readiness checks and maps failures to existing diagnostics without storing local paths", () => {
    const source = wizardSource();
    const readinessStart = source.indexOf("const runReadinessChecks = useCallback");
    const readinessEnd = source.indexOf("useEffect", readinessStart);
    const readinessBody = source.slice(readinessStart, readinessEnd);

    expect(readinessBody).toContain("getRuntimeStatus");
    expect(readinessBody).toContain("getStorageContract");
    expect(readinessBody).toContain("localUserOllamaStatus");
    expect(readinessBody).toContain("{ ok: true, mode: \"local_user\" }");
    expect(readinessBody).not.toContain("layout: storage.layout");
    expect(readinessBody).not.toContain("layout.root");
    expect(source).toContain("runtime_healthcheck_failed");
    expect(source).toContain("ollama_unreachable");
    expect(source).toContain("selected_model_missing");
  });

  it("does not recreate readiness checks when model selection changes", () => {
    const source = wizardSource();
    const readinessStart = source.indexOf("const runReadinessChecks = useCallback");
    const readinessEnd = source.indexOf("useEffect", readinessStart);
    const readinessBody = source.slice(readinessStart, readinessEnd);

    expect(readinessBody).toContain(
      "const storedModelId = readLocalUserOllamaModelSelection()"
    );
    expect(readinessBody).toContain("selectedModelId: storedModelId");
    expect(readinessBody).toContain("}, [isHostedAdminMode])");
    expect(readinessBody).not.toContain("[isHostedAdminMode, selectedModel]");
  });

  it("manual relaunch Close and X are close-only and do not persist completion", () => {
    const source = wizardSource();
    const closeStart = source.indexOf("function closeManualWizard()");
    const closeEnd = source.indexOf("const handleDismissWizard", closeStart);
    const closeBody = source.slice(closeStart, closeEnd);

    expect(closeBody).toContain("setVisible(false)");
    expect(closeBody).toContain("setManualLaunch(false)");
    expect(closeBody).toContain("setStepIndex(0)");
    expect(closeBody).not.toContain("persistDesktopFirstRunCompleted");
    expect(closeBody).not.toContain("mirrorDesktopLocalUserFirstRunCompleted");
    expect(source).toContain(
      "const handleDismissWizard = manualLaunch ? closeManualWizard : skipWizard"
    );
    expect(source).toContain("onClick={handleDismissWizard}");
    expect(source).toContain('? "Close SWARMSY Desktop first-run wizard"');
    expect(source).toContain(': "Skip SWARMSY Desktop first-run wizard"');
  });

  it("first-run Skip and Complete still persist completion through completeWizard", () => {
    const source = wizardSource();
    const completeStart = source.indexOf("const completeWizard = useCallback");
    const completeEnd = source.indexOf("const skipWizard", completeStart);
    const completeBody = source.slice(completeStart, completeEnd);
    const skipStart = source.indexOf("const skipWizard = useCallback");
    const skipEnd = source.indexOf("function closeManualWizard", skipStart);
    const skipBody = source.slice(skipStart, skipEnd);

    expect(completeBody).toContain("mirrorDesktopLocalUserFirstRunCompleted");
    expect(completeBody).toContain("persistDesktopFirstRunCompleted(true)");
    expect(skipBody).toContain("const saved = await completeWizard()");
    expect(skipBody).toContain("if (saved) return");
  });

  it("does not show no_models_installed or pull guidance until Ollama is reachable", () => {
    const source = wizardSource();
    expect(source).toContain(
      "Models could not be verified until Ollama is reachable"
    );
    expect(source).toContain("Start or check Ollama first");
    expect(source).toMatch(/diagnostic: !ollamaCheck\s*\? null/);
    expect(source).toMatch(
      /: `No models found\. Run: ollama pull \$\{DEFAULT_MODEL\}`/
    );
    expect(source).toContain(': "no_models_installed"');
  });

  it("keeps Complete honest while first-run Skip closes for the current session when desktop settings mirror fails", () => {
    const source = wizardSource();
    const completeStart = source.indexOf("const completeWizard = useCallback");
    const completeEnd = source.indexOf("const skipWizard", completeStart);
    const completeBody = source.slice(completeStart, completeEnd);
    const skipStart = source.indexOf("const skipWizard = useCallback");
    const skipEnd = source.indexOf("function closeManualWizard", skipStart);
    const skipBody = source.slice(skipStart, skipEnd);

    expect(completeBody).toContain(
      "const mirrored = await mirrorDesktopLocalUserFirstRunCompleted"
    );
    expect(completeBody).toContain("if (!mirrored?.ok)");
    expect(completeBody).toContain("setup completion could not be saved");
    expect(completeBody).toContain("return false");
    expect(completeBody.indexOf("if (!mirrored?.ok)")).toBeLessThan(
      completeBody.indexOf("setVisible(false)")
    );
    expect(completeBody).toContain("SWARMSY Desktop setup saved.");
    expect(skipBody).toContain("const saved = await completeWizard()");
    expect(skipBody).toContain("if (saved) return");
    expect(skipBody).toContain("setVisible(false)");
  });

  it("surfaces desktop model mirror failures while keeping browser fallback active", () => {
    const source = wizardSource();
    const selectStart = source.indexOf("const selectModel = useCallback");
    const selectEnd = source.indexOf("if (!visible)", selectStart);
    const selectBody = source.slice(selectStart, selectEnd);

    expect(selectBody).toContain(
      "const mirrored = await mirrorDesktopLocalUserOllamaModelSelection"
    );
    expect(selectBody).toContain("if (!mirrored?.ok)");
    expect(selectBody).toContain(
      "Desktop local settings sync failed. Browser Local User storage remains active."
    );
    expect(selectBody).toContain("dispatchSettingsSync(normalized)");
  });

  it("shows manual Ollama and model install actions without automatic installs", () => {
    const source = wizardSource();
    expect(source).toContain("https://ollama.com");
    expect(source).toContain("ollama pull");
    expect(source).toContain("never installs software");
    expect(source).toContain("downloads");
    expect(source).not.toContain("auto-pull");
  });
});
