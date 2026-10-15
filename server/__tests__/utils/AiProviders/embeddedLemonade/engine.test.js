const fs = require("fs");
const os = require("os");
const path = require("path");

jest.mock("../../../../utils/AiProviders/embeddedLemonade/config", () => ({
  ...jest.requireActual(
    "../../../../utils/AiProviders/embeddedLemonade/config"
  ),
  isEnabled: () => true,
  lemondPlatform: () => "linux-x64",
}));

const {
  EmbeddedLemonadeEngine,
} = require("../../../../utils/AiProviders/embeddedLemonade/engine");
const {
  LEMOND_VERSION,
} = require("../../../../utils/AiProviders/embeddedLemonade/config");

const ORIGINAL_ENV = process.env;
const ORIGINAL_FETCH = global.fetch;
let storage;

/**
 * Puts an "installed" lemond in a temp STORAGE_DIR so boot skips the download and goes straight to spawning it.
 * @param {string} script - the executable's contents
 * @param {number} mode - its file mode
 */
function installLemond(script, mode) {
  const dir = path.join(storage, "engines", "embedded-lemonade", "lemond");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "lemond"), script);
  fs.chmodSync(path.join(dir, "lemond"), mode);
  fs.writeFileSync(path.join(dir, ".lemond-version"), LEMOND_VERSION);
}

beforeEach(() => {
  storage = fs.mkdtempSync(path.join(os.tmpdir(), "embedded-lemonade-"));
  process.env = { ...ORIGINAL_ENV, STORAGE_DIR: storage };
  // Nothing listens on lemond's port in tests.
  global.fetch = jest.fn(async () => {
    throw new TypeError("fetch failed");
  });
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  EmbeddedLemonadeEngine.kill();
  process.env = ORIGINAL_ENV;
  global.fetch = ORIGINAL_FETCH;
  fs.rmSync(storage, { recursive: true, force: true });
  jest.restoreAllMocks();
});

describe("EmbeddedLemonadeEngine boot", () => {
  it("reports a lemond that cannot be executed instead of crashing the server", async () => {
    installLemond("#!/bin/sh\nsleep 30\n", 0o644);

    await expect(EmbeddedLemonadeEngine.bootOrContinue()).resolves.toBe(false);
    expect(EmbeddedLemonadeEngine.process).toBeNull();
    expect(EmbeddedLemonadeEngine.status.state).toBe("error");
    expect(EmbeddedLemonadeEngine.status.message).toMatch(
      /^The local LLM engine could not be started: spawn .*lemond EACCES$/
    );
  });

  it("retries the boot on the next call after a failure", async () => {
    installLemond("#!/bin/sh\nsleep 30\n", 0o644);
    await EmbeddedLemonadeEngine.bootOrContinue();

    fs.chmodSync(
      path.join(storage, "engines", "embedded-lemonade", "lemond", "lemond"),
      0o755
    );
    const booting = EmbeddedLemonadeEngine.bootOrContinue();
    // Wait for the spawn, then let the health check succeed.
    while (!EmbeddedLemonadeEngine.process)
      await new Promise((r) => setTimeout(r, 10));
    global.fetch = jest.fn(async () => ({ ok: true }));
    await expect(booting).resolves.toBe(true);
    expect(EmbeddedLemonadeEngine.status.state).toBe("ready");
  });

  it("reports a lemond that exits during startup", async () => {
    installLemond("#!/bin/sh\nexit 3\n", 0o755);

    await expect(EmbeddedLemonadeEngine.bootOrContinue()).resolves.toBe(false);
    expect(EmbeddedLemonadeEngine.status).toEqual({
      state: "error",
      message: "lemond exited while starting up.",
      progress: null,
    });
  });

  it("shares one boot between concurrent callers", async () => {
    installLemond("#!/bin/sh\nsleep 30\n", 0o644);
    const results = await Promise.all([
      EmbeddedLemonadeEngine.bootOrContinue(),
      EmbeddedLemonadeEngine.bootOrContinue(),
    ]);
    expect(results).toEqual([false, false]);
    expect(
      console.log.mock.calls.filter(([line]) => line.includes("lemond started"))
    ).toHaveLength(1);
  });

  it("writes lemond's config, keeping keys lemond wrote", async () => {
    installLemond("#!/bin/sh\nsleep 30\n", 0o644);
    const configDir = path.join(
      storage,
      "engines",
      "embedded-lemonade",
      "config"
    );
    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(
      path.join(configDir, "config.json"),
      JSON.stringify({ log_level: "debug", llamacpp: { backend: "cpu" } })
    );
    process.env.EMBEDDED_LEMONADE_LLAMACPP_BACKEND = "vulkan";

    await EmbeddedLemonadeEngine.bootOrContinue();
    const config = JSON.parse(
      fs.readFileSync(path.join(configDir, "config.json"), "utf8")
    );
    expect(config).toEqual({
      log_level: "debug",
      models_dir: path.join(storage, "models", "embedded-lemonade"),
      no_fetch_executables: false,
      disable_model_filtering: true,
      llamacpp: { backend: "vulkan", prefer_system: false },
    });
  });

  it("rewrites an unparseable config and drops a stale backend", async () => {
    installLemond("#!/bin/sh\nsleep 30\n", 0o644);
    const configDir = path.join(
      storage,
      "engines",
      "embedded-lemonade",
      "config"
    );
    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(path.join(configDir, "config.json"), "{not json");

    await EmbeddedLemonadeEngine.bootOrContinue();
    const config = JSON.parse(
      fs.readFileSync(path.join(configDir, "config.json"), "utf8")
    );
    expect(config.llamacpp).toEqual({ prefer_system: false });
  });
});

describe("EmbeddedLemonadeEngine CUDA selection", () => {
  // These lemonds are running - wait for them to exit so their exit log lands while console.log is still mocked.
  afterEach(() => EmbeddedLemonadeEngine.stop());

  /**
   * Boots a lemond that comes online and answers system-info with the given devices and llama.cpp CUDA state.
   * @returns {Promise<object[]>} the bodies sent to /internal/set
   */
  async function bootWithSystemInfo({ nvidiaGpus, cudaState }) {
    installLemond("#!/bin/sh\nsleep 30\n", 0o755);
    const booting = EmbeddedLemonadeEngine.bootOrContinue();
    while (!EmbeddedLemonadeEngine.process)
      await new Promise((r) => setTimeout(r, 10));

    const sets = [];
    global.fetch = jest.fn(async (url, options) => {
      if (url.endsWith("/api/v1/system-info"))
        return {
          ok: true,
          json: async () => ({
            devices: { nvidia_gpu: nvidiaGpus },
            recipes: {
              llamacpp: { backends: { cuda: { state: cudaState } } },
            },
          }),
        };
      if (url.endsWith("/internal/set")) sets.push(JSON.parse(options.body));
      return { ok: true };
    });
    await expect(booting).resolves.toBe(true);
    return sets;
  }

  it.each(["installable", "installed"])(
    "selects CUDA when lemond sees an NVIDIA GPU and CUDA is %s",
    async (cudaState) => {
      const sets = await bootWithSystemInfo({
        nvidiaGpus: [{ available: true, name: "NVIDIA GeForce RTX 4070" }],
        cudaState,
      });
      expect(sets).toEqual([{ llamacpp: { backend: "cuda" } }]);
    }
  );

  it("leaves lemond's pick alone without an NVIDIA GPU", async () => {
    const sets = await bootWithSystemInfo({
      nvidiaGpus: [],
      cudaState: "installable",
    });
    expect(sets).toEqual([]);
  });

  it("leaves lemond's pick alone when CUDA does not support the GPU", async () => {
    const sets = await bootWithSystemInfo({
      nvidiaGpus: [{ available: true, name: "NVIDIA GeForce GTX 1080" }],
      cudaState: "unsupported",
    });
    expect(sets).toEqual([]);
  });

  it("does not override EMBEDDED_LEMONADE_LLAMACPP_BACKEND", async () => {
    process.env.EMBEDDED_LEMONADE_LLAMACPP_BACKEND = "vulkan";
    const sets = await bootWithSystemInfo({
      nvidiaGpus: [{ available: true, name: "NVIDIA GeForce RTX 4070" }],
      cudaState: "installable",
    });
    expect(sets).toEqual([]);
  });

  it("still boots when system-info cannot be read", async () => {
    installLemond("#!/bin/sh\nsleep 30\n", 0o755);
    const booting = EmbeddedLemonadeEngine.bootOrContinue();
    while (!EmbeddedLemonadeEngine.process)
      await new Promise((r) => setTimeout(r, 10));
    global.fetch = jest.fn(async (url) => {
      if (url.endsWith("/api/v1/system-info")) throw new Error("boom");
      return { ok: true };
    });
    await expect(booting).resolves.toBe(true);
    expect(EmbeddedLemonadeEngine.status.state).toBe("ready");
  });
});

describe("EmbeddedLemonadeEngine stop", () => {
  it("is a no-op when lemond is not running", async () => {
    await expect(EmbeddedLemonadeEngine.stop()).resolves.toBeUndefined();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
