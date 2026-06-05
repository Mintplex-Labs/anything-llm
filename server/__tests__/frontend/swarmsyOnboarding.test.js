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

  it("posts local ComfyUI generation requests without API keys", async () => {
    const payload = {
      prompt: "street art poster",
      negativePrompt: "blurry",
      workflowJson: { "1": {} },
    };
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        success: true,
        mode: "local_user",
        engine: "comfyui",
        status: "completed",
      }),
    });
    const onboardingModel = loadSwarmsyOnboardingModule(fetchImpl);

    const response = await onboardingModel.localUserImageEngineGenerate(payload);

    expect(response.status).toBe("completed");
    expect(fetchImpl).toHaveBeenCalledWith(
      "http://localhost/api/swarmsy/local-user/image-engine/generate",
      {
        method: "POST",
        headers: {},
        body: JSON.stringify(payload),
        signal: undefined,
      }
    );
  });

  it("returns the clear local ComfyUI missing-engine message on generation network failure", async () => {
    const fetchImpl = jest.fn().mockRejectedValue(new Error("network down"));
    const onboardingModel = loadSwarmsyOnboardingModule(fetchImpl);

    const response = await onboardingModel.localUserImageEngineGenerate({
      prompt: "poster",
    });

    expect(response).toEqual({
      success: false,
      mode: "unknown",
      engine: "comfyui",
      status: "unavailable",
      source: "fallback",
      message:
        "ComfyUI is not connected. Start your local image engine before image generation.",
    });
  });

  it("passes local ComfyUI generation abort signals to fetch", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    });
    const onboardingModel = loadSwarmsyOnboardingModule(fetchImpl);
    const signal = { aborted: false };

    await onboardingModel.localUserImageEngineGenerate(
      { prompt: "poster" },
      { signal }
    );

    expect(fetchImpl).toHaveBeenCalledWith(
      "http://localhost/api/swarmsy/local-user/image-engine/generate",
      expect.objectContaining({ signal })
    );
  });

  it("rethrows local ComfyUI generation abort errors", async () => {
    const abortError = Object.assign(new Error("aborted"), {
      name: "AbortError",
    });
    const fetchImpl = jest.fn().mockRejectedValue(abortError);
    const onboardingModel = loadSwarmsyOnboardingModule(fetchImpl);

    await expect(
      onboardingModel.localUserImageEngineGenerate({ prompt: "poster" })
    ).rejects.toBe(abortError);
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
