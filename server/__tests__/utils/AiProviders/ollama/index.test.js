/* eslint-env jest */

/**
 * Tests for the static config-resolution helpers on OllamaAILLM that bridge
 * the per-connection `ollama_connections` row and the env-var defaults.
 *
 * Related issue: #1440
 */

const ENV_KEYS = [
  "OLLAMA_BASE_PATH",
  "OLLAMA_AUTH_TOKEN",
  "OLLAMA_KEEP_ALIVE_TIMEOUT",
  "OLLAMA_MODEL_TOKEN_LIMIT",
];

const ORIGINAL_ENV = {};
for (const key of ENV_KEYS) ORIGINAL_ENV[key] = process.env[key];

function clearOllamaEnv() {
  for (const key of ENV_KEYS) delete process.env[key];
}

function restoreOllamaEnv() {
  for (const key of ENV_KEYS) {
    if (ORIGINAL_ENV[key] === undefined) delete process.env[key];
    else process.env[key] = ORIGINAL_ENV[key];
  }
}

describe("OllamaAILLM.resolveConfig", () => {
  const {
    OllamaAILLM,
  } = require("../../../../utils/AiProviders/ollama");

  beforeEach(clearOllamaEnv);
  afterAll(restoreOllamaEnv);

  it("falls back to env vars when no connection is provided", () => {
    process.env.OLLAMA_BASE_PATH = "http://env:11434";
    process.env.OLLAMA_AUTH_TOKEN = "env-token";
    process.env.OLLAMA_KEEP_ALIVE_TIMEOUT = "600";

    expect(OllamaAILLM.resolveConfig(null)).toEqual({
      basePath: "http://env:11434",
      authToken: "env-token",
      keepAlive: 600,
      tokenLimit: null,
    });
  });

  it("defaults keepAlive to 300 when neither connection nor env supplies one", () => {
    process.env.OLLAMA_BASE_PATH = "http://env:11434";
    const config = OllamaAILLM.resolveConfig(null);
    expect(config.keepAlive).toBe(300);
  });

  it("connection.basePath overrides env", () => {
    process.env.OLLAMA_BASE_PATH = "http://env:11434";
    const config = OllamaAILLM.resolveConfig({
      basePath: "http://conn:11434",
    });
    expect(config.basePath).toBe("http://conn:11434");
  });

  it("connection.authToken overrides env when set to a non-nullish value", () => {
    process.env.OLLAMA_AUTH_TOKEN = "env-token";
    const config = OllamaAILLM.resolveConfig({
      basePath: "http://conn:11434",
      authToken: "conn-token",
    });
    expect(config.authToken).toBe("conn-token");
  });

  it("falls back to env auth token when connection.authToken is null", () => {
    process.env.OLLAMA_AUTH_TOKEN = "env-token";
    const config = OllamaAILLM.resolveConfig({
      basePath: "http://conn:11434",
      authToken: null,
    });
    expect(config.authToken).toBe("env-token");
  });

  it("connection.keepAlive overrides env (numbers and numeric strings)", () => {
    process.env.OLLAMA_KEEP_ALIVE_TIMEOUT = "600";
    expect(
      OllamaAILLM.resolveConfig({
        basePath: "http://conn:11434",
        keepAlive: 0,
      }).keepAlive
    ).toBe(0);
    expect(
      OllamaAILLM.resolveConfig({
        basePath: "http://conn:11434",
        keepAlive: -1,
      }).keepAlive
    ).toBe(-1);
    expect(
      OllamaAILLM.resolveConfig({
        basePath: "http://conn:11434",
        keepAlive: "120",
      }).keepAlive
    ).toBe(120);
  });

  it("falls back to env keepAlive when connection.keepAlive is null", () => {
    process.env.OLLAMA_KEEP_ALIVE_TIMEOUT = "600";
    const config = OllamaAILLM.resolveConfig({
      basePath: "http://conn:11434",
      keepAlive: null,
    });
    expect(config.keepAlive).toBe(600);
  });

  it("returns tokenLimit from the connection when set, null otherwise", () => {
    expect(
      OllamaAILLM.resolveConfig({
        basePath: "http://conn:11434",
        tokenLimit: 32000,
      }).tokenLimit
    ).toBe(32000);
    expect(
      OllamaAILLM.resolveConfig({
        basePath: "http://conn:11434",
      }).tokenLimit
    ).toBeNull();
  });
});

describe("OllamaAILLM.promptWindowLimit", () => {
  const {
    OllamaAILLM,
  } = require("../../../../utils/AiProviders/ollama");

  // Snapshot + restore the static cache so tests don't pollute each other or
  // unrelated suites that may have populated it earlier.
  let savedCache;
  beforeEach(() => {
    savedCache = OllamaAILLM.modelContextWindows;
    OllamaAILLM.modelContextWindows = {};
    clearOllamaEnv();
  });
  afterEach(() => {
    OllamaAILLM.modelContextWindows = savedCache;
  });
  afterAll(restoreOllamaEnv);

  it("returns 4096 when nothing is cached and no env limit is set", () => {
    expect(
      OllamaAILLM.promptWindowLimit("llama3:latest", "http://x:11434")
    ).toBe(4096);
  });

  it("returns the env limit when nothing is cached", () => {
    process.env.OLLAMA_MODEL_TOKEN_LIMIT = "8000";
    expect(
      OllamaAILLM.promptWindowLimit("llama3:latest", "http://x:11434")
    ).toBe(8000);
  });

  it("uses the override limit when nothing is cached", () => {
    expect(
      OllamaAILLM.promptWindowLimit("llama3:latest", "http://x:11434", 12000)
    ).toBe(12000);
  });

  it("override wins over env limit when both are set", () => {
    process.env.OLLAMA_MODEL_TOKEN_LIMIT = "8000";
    OllamaAILLM.modelContextWindows["http://x:11434"] = {
      "llama3:latest": 32768,
    };
    expect(
      OllamaAILLM.promptWindowLimit("llama3:latest", "http://x:11434", 16000)
    ).toBe(16000);
  });

  it("falls back to env limit when no override is provided", () => {
    process.env.OLLAMA_MODEL_TOKEN_LIMIT = "8000";
    OllamaAILLM.modelContextWindows["http://x:11434"] = {
      "llama3:latest": 32768,
    };
    expect(
      OllamaAILLM.promptWindowLimit("llama3:latest", "http://x:11434")
    ).toBe(8000);
  });

  it("clamps the user-defined limit to the system limit when cache says less", () => {
    OllamaAILLM.modelContextWindows["http://x:11434"] = {
      "llama3:latest": 8192,
    };
    expect(
      OllamaAILLM.promptWindowLimit("llama3:latest", "http://x:11434", 64000)
    ).toBe(8192);
  });

  it("caps at 16,384 when no override/env is set and the model supports more", () => {
    OllamaAILLM.modelContextWindows["http://x:11434"] = {
      "llama3:latest": 131072,
    };
    expect(
      OllamaAILLM.promptWindowLimit("llama3:latest", "http://x:11434")
    ).toBe(16384);
  });

  it("does not pull windows from another basePath's cache bucket", () => {
    OllamaAILLM.modelContextWindows["http://other:11434"] = {
      "llama3:latest": 32768,
    };
    // The target basePath bucket is empty -> falls back to env-or-default path.
    expect(
      OllamaAILLM.promptWindowLimit("llama3:latest", "http://x:11434")
    ).toBe(4096);
  });
});
