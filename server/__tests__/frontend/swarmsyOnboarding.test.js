const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadSwarmsyOnboardingModule(fetchImpl) {
  const source = fs
    .readFileSync(
      path.resolve(__dirname, "../../../frontend/src/models/swarmsyOnboarding.js"),
      "utf8"
    )
    .replace(/import\s*{[\s\S]*?}\s*from\s*".*?";\r?\n/g, "")
    .replace(/import .* from ".*?";\r?\n/g, "")
    .replace(/export default SwarmsyOnboarding;\r?\n?/, "")
    .concat("\nmodule.exports = SwarmsyOnboarding;");

  const script = new vm.Script(
    `const API_BASE = "http://localhost/api";
const baseHeaders = () => ({});
const fetch = __mockFetch;
${source}`
  );
  const sandbox = {
    module: { exports: {} },
    exports: {},
    __mockFetch: fetchImpl,
  };
  vm.createContext(sandbox);
  script.runInContext(sandbox);
  return sandbox.module.exports;
}

describe("Swarmsy onboarding model", () => {
  it("returns an unknown/fallback shape on network failure (not local_user mode)", async () => {
    const fetchImpl = jest.fn().mockRejectedValue(new Error("network down"));
    const onboardingModel = loadSwarmsyOnboardingModule(fetchImpl);

    const response = await onboardingModel.localUserOllamaStatus();

    expect(response).toEqual({
      success: false,
      mode: "unknown",
      provider: "ollama",
      status: "error",
      reachable: false,
      models: [],
      source: "fallback",
      message: "Failed to resolve SWARMSY local-user Ollama status.",
    });
    expect(response.mode).not.toBe("local_user");
    expect(response.source).toBe("fallback");
  });

  it("returns an image engine fallback shape on network failure without API keys", async () => {
    const fetchImpl = jest.fn().mockRejectedValue(new Error("network down"));
    const onboardingModel = loadSwarmsyOnboardingModule(fetchImpl);

    const response = await onboardingModel.localUserImageEngineStatus();

    expect(response).toEqual({
      success: false,
      mode: "unknown",
      available: false,
      engine: "comfyui",
      url: "http://localhost:8188",
      source: "fallback",
      message: "Failed to resolve SWARMSY local image engine status.",
    });
    expect(fetchImpl).toHaveBeenCalledWith(
      "http://localhost/api/swarmsy/local-user/image-engine/status",
      expect.objectContaining({ headers: {} })
    );
  });

  it("rethrows abort errors so callers can bail out safely", async () => {
    const abortError = Object.assign(new Error("aborted"), {
      name: "AbortError",
    });
    const fetchImpl = jest.fn().mockRejectedValue(abortError);
    const onboardingModel = loadSwarmsyOnboardingModule(fetchImpl);
    const signal = { aborted: false };

    await expect(
      onboardingModel.localUserOllamaStatus({ signal })
    ).rejects.toBe(abortError);
    expect(fetchImpl).toHaveBeenCalledWith(
      "http://localhost/api/swarmsy/local-user/ollama/status",
      expect.objectContaining({ signal })
    );
  });
});
