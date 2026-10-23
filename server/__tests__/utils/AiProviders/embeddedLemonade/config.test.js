const fs = require("fs");

const CONFIG = "../../../../utils/AiProviders/embeddedLemonade/config";
const ORIGINAL_ENV = process.env;
const ORIGINAL_PLATFORM = process.platform;
const ORIGINAL_ARCH = process.arch;
const readFileSync = fs.readFileSync;

/**
 * Loads a fresh config module (isEnabled is cached per process) with the given startup environment.
 * @param {{environ?: Record<string,string>|null, runtime?: string, platform?: string, arch?: string}} options
 * environ null makes /proc/self/environ unreadable.
 */
function loadConfig({
  environ = {},
  runtime = "docker",
  platform = "linux",
  arch = "x64",
} = {}) {
  Object.defineProperty(process, "platform", { value: platform });
  Object.defineProperty(process, "arch", { value: arch });
  process.env = { ...ORIGINAL_ENV, ANYTHING_LLM_RUNTIME: runtime };
  jest.spyOn(fs, "readFileSync").mockImplementation((file, ...args) => {
    if (file !== "/proc/self/environ") return readFileSync(file, ...args);
    if (environ === null) throw new Error("ENOENT");
    return Object.entries(environ)
      .map(([key, value]) => `${key}=${value}\0`)
      .join("");
  });
  let config;
  jest.isolateModules(() => (config = require(CONFIG)));
  return config;
}

const DOCKER_ENABLED = {
  ANYTHING_LLM_RUNTIME: "docker",
  ENABLE_BUILT_IN_LLM: "true",
};

afterEach(() => {
  process.env = ORIGINAL_ENV;
  Object.defineProperty(process, "platform", { value: ORIGINAL_PLATFORM });
  Object.defineProperty(process, "arch", { value: ORIGINAL_ARCH });
  jest.restoreAllMocks();
});

describe("isEnabled", () => {
  it.each(["true", "TRUE", "1", "yes"])(
    "is enabled in Docker with ENABLE_BUILT_IN_LLM=%s",
    (flag) => {
      const config = loadConfig({
        environ: { ...DOCKER_ENABLED, ENABLE_BUILT_IN_LLM: flag },
      });
      expect(config.isEnabled()).toBe(true);
      expect(config.supportedProviders()).toEqual(["embedded_lemonade"]);
    }
  );

  it.each(["false", "0", "", " true"])(
    "is disabled with ENABLE_BUILT_IN_LLM=%p",
    (flag) => {
      const config = loadConfig({
        environ: { ...DOCKER_ENABLED, ENABLE_BUILT_IN_LLM: flag },
      });
      expect(config.isEnabled()).toBe(false);
      expect(config.supportedProviders()).toEqual([]);
    }
  );

  it("ignores ENABLE_BUILT_IN_LLM set only in process.env (eg: the .env file)", () => {
    const config = loadConfig({
      environ: { ANYTHING_LLM_RUNTIME: "docker" },
    });
    process.env.ENABLE_BUILT_IN_LLM = "true";
    expect(config.isEnabled()).toBe(false);
  });

  it("is disabled outside the Docker runtime", () => {
    expect(
      loadConfig({ environ: { ENABLE_BUILT_IN_LLM: "true" } }).isEnabled()
    ).toBe(false);
    expect(
      loadConfig({ environ: DOCKER_ENABLED, runtime: "" }).isEnabled()
    ).toBe(false);
  });

  it("is disabled when there is no lemond build for the platform", () => {
    expect(
      loadConfig({ environ: DOCKER_ENABLED, platform: "darwin" }).isEnabled()
    ).toBe(false);
    expect(
      loadConfig({ environ: DOCKER_ENABLED, arch: "ia32" }).isEnabled()
    ).toBe(false);
    expect(
      loadConfig({ environ: DOCKER_ENABLED, arch: "arm64" }).isEnabled()
    ).toBe(true);
  });

  it("is disabled when /proc/self/environ cannot be read", () => {
    expect(loadConfig({ environ: null }).isEnabled()).toBe(false);
  });

  it("keeps values that contain '=' intact", () => {
    const config = loadConfig({
      environ: { ...DOCKER_ENABLED, OTHER: "a=b=c" },
    });
    expect(config.isEnabled()).toBe(true);
  });

  it("decides once per process", () => {
    const config = loadConfig({ environ: DOCKER_ENABLED });
    expect(config.isEnabled()).toBe(true);
    fs.readFileSync.mockImplementation(() => "");
    expect(config.isEnabled()).toBe(true);
  });
});

describe("modelSelected", () => {
  const { modelSelected } = require(CONFIG);

  it("accepts a model id", () => {
    expect(modelSelected("Qwen3.5-4B-GGUF")).toBeNull();
  });

  it.each(["", "   ", null, undefined])("rejects %p", (input) => {
    expect(modelSelected(input)).toBe(
      "Select or download a model for the Built-in LLM first."
    );
  });
});

describe("validTokenLimit", () => {
  const { validTokenLimit } = require(CONFIG);
  const ERROR = "Context window must be a whole number greater than zero.";

  it.each(["", "  ", null, undefined])(
    "accepts %p as the model's own context window",
    (input) => {
      expect(validTokenLimit(input)).toBeNull();
    }
  );

  it.each(["1", "8192", " 8192 ", "262144"])("accepts %p", (input) => {
    expect(validTokenLimit(input)).toBeNull();
  });

  it.each(["0", "-1", "4096.5", "abc", "Infinity", "NaN", "1e400"])(
    "rejects %p",
    (input) => {
      expect(validTokenLimit(input)).toBe(ERROR);
    }
  );

  it("is the check updateENV runs for the context window", () => {
    const { ENV_KEYS } = require(CONFIG);
    expect(ENV_KEYS.EmbeddedLemonadeTokenLimit.checks).toEqual([
      validTokenLimit,
    ]);
    expect(ENV_KEYS.EmbeddedLemonadeModelPref.checks).toEqual([
      require(CONFIG).modelSelected,
    ]);
  });
});

describe("manageEngineOnProviderChange", () => {
  function loadWithEngine(environ = DOCKER_ENABLED) {
    const engine = {
      prepareInBackground: jest.fn(),
      stop: jest.fn(() => Promise.resolve()),
      log: jest.fn(),
    };
    // config requires ./engine lazily, from the shared registry - drop any engine an earlier test cached there.
    jest.resetModules();
    jest.doMock(
      "../../../../utils/AiProviders/embeddedLemonade/engine",
      () => ({ EmbeddedLemonadeEngine: engine })
    );
    const config = loadConfig({ environ });
    return { config, engine };
  }

  afterEach(() => {
    jest.dontMock("../../../../utils/AiProviders/embeddedLemonade/engine");
  });

  it("starts the engine when moving onto the provider", () => {
    const { config, engine } = loadWithEngine();
    config.manageEngineOnProviderChange(
      "LLMProvider",
      "openai",
      "embedded_lemonade"
    );
    expect(engine.prepareInBackground).toHaveBeenCalledTimes(1);
    expect(engine.stop).not.toHaveBeenCalled();
  });

  it("stops the engine when moving off the provider", () => {
    const { config, engine } = loadWithEngine();
    config.manageEngineOnProviderChange(
      "LLMProvider",
      "embedded_lemonade",
      "ollama"
    );
    expect(engine.stop).toHaveBeenCalledTimes(1);
    expect(engine.prepareInBackground).not.toHaveBeenCalled();
  });

  it("logs rather than throws when stopping fails", async () => {
    const { config, engine } = loadWithEngine();
    engine.stop.mockImplementation(() => Promise.reject(new Error("boom")));
    expect(() =>
      config.manageEngineOnProviderChange(
        "LLMProvider",
        "embedded_lemonade",
        "ollama"
      )
    ).not.toThrow();
    await new Promise((r) => setImmediate(r));
    expect(engine.log).toHaveBeenCalledWith("Stop failed: boom");
  });

  it.each([
    ["embedded_lemonade", "embedded_lemonade"],
    ["openai", "ollama"],
    [undefined, "openai"],
  ])("does nothing for %p -> %p", (prev, next) => {
    const { config, engine } = loadWithEngine();
    config.manageEngineOnProviderChange("LLMProvider", prev, next);
    expect(engine.prepareInBackground).not.toHaveBeenCalled();
    expect(engine.stop).not.toHaveBeenCalled();
  });

  it("does nothing when the engine is not enabled", () => {
    const { config, engine } = loadWithEngine({
      ANYTHING_LLM_RUNTIME: "docker",
    });
    config.manageEngineOnProviderChange(
      "LLMProvider",
      "openai",
      "embedded_lemonade"
    );
    config.manageEngineOnProviderChange(
      "LLMProvider",
      "embedded_lemonade",
      "openai"
    );
    expect(engine.prepareInBackground).not.toHaveBeenCalled();
    expect(engine.stop).not.toHaveBeenCalled();
  });
});
