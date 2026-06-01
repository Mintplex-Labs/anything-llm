const {
  DEFAULT_LOCAL_OLLAMA_TAGS_URL,
  detectLocalOllama,
  normalizeOllamaModels,
} = require("../../../utils/swarmsy/localUserOllama");

describe("swarmsy local-user Ollama detection", () => {
  const originalSwarmsyLocalOllamaTagsUrl =
    process.env.SWARMSY_LOCAL_OLLAMA_TAGS_URL;
  const originalOllamaBasePath = process.env.OLLAMA_BASE_PATH;

  afterEach(() => {
    if (typeof originalSwarmsyLocalOllamaTagsUrl === "undefined") {
      delete process.env.SWARMSY_LOCAL_OLLAMA_TAGS_URL;
    } else {
      process.env.SWARMSY_LOCAL_OLLAMA_TAGS_URL =
        originalSwarmsyLocalOllamaTagsUrl;
    }

    if (typeof originalOllamaBasePath === "undefined") {
      delete process.env.OLLAMA_BASE_PATH;
    } else {
      process.env.OLLAMA_BASE_PATH = originalOllamaBasePath;
    }
  });

  it("lists installed Ollama models when localhost is reachable", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        models: [
          {
            name: "llama3.1:8b",
            size: 4_200,
            digest: "sha256:abc",
            modified_at: "2026-05-31T00:00:00Z",
          },
        ],
      }),
    });

    const status = await detectLocalOllama({ fetchImpl });

    expect(fetchImpl).toHaveBeenCalledWith(DEFAULT_LOCAL_OLLAMA_TAGS_URL, {
      method: "GET",
      signal: expect.any(AbortSignal),
    });
    expect(status).toEqual({
      success: true,
      mode: "local_user",
      provider: "ollama",
      endpoint: DEFAULT_LOCAL_OLLAMA_TAGS_URL,
      reachable: true,
      status: "reachable",
      models: [
        {
          id: "llama3.1:8b",
          name: "llama3.1:8b",
          size: 4_200,
          digest: "sha256:abc",
          modifiedAt: "2026-05-31T00:00:00Z",
        },
      ],
      message: "Local Ollama is reachable and installed models were detected.",
    });
  });

  it("returns no_models when localhost responds without installed models", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ models: [] }),
    });

    const status = await detectLocalOllama({ fetchImpl });

    expect(status).toMatchObject({
      success: true,
      status: "no_models",
      reachable: true,
      models: [],
      message: "Local Ollama is reachable, but no models are installed yet.",
    });
  });

  it("returns unreachable when localhost cannot be contacted", async () => {
    const fetchImpl = jest
      .fn()
      .mockRejectedValue(new TypeError("fetch failed: ECONNREFUSED"));

    const status = await detectLocalOllama({ fetchImpl });

    expect(status).toMatchObject({
      success: true,
      status: "unreachable",
      reachable: false,
      models: [],
      message: `Local Ollama is not reachable at ${DEFAULT_LOCAL_OLLAMA_TAGS_URL}.`,
    });
  });

  it("returns error when localhost responds with a bad status", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const status = await detectLocalOllama({ fetchImpl });

    expect(status).toMatchObject({
      success: true,
      status: "error",
      reachable: false,
      models: [],
      message: "Local Ollama returned an unexpected status (500).",
    });
  });

  it("returns error when localhost returns an invalid tags payload", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ nope: [] }),
    });

    const status = await detectLocalOllama({ fetchImpl });

    expect(status).toMatchObject({
      success: true,
      status: "error",
      message: "Local Ollama returned an unexpected response payload.",
    });
  });

  it("normalizes only models with valid names", () => {
    expect(
      normalizeOllamaModels([
        { name: "mistral", size: 1 },
        { name: "" },
        { nope: true },
      ])
    ).toEqual([
      {
        id: "mistral",
        name: "mistral",
        size: 1,
        digest: null,
        modifiedAt: null,
      },
    ]);
  });

  it("uses an explicit endpoint over environment configuration", async () => {
    process.env.SWARMSY_LOCAL_OLLAMA_TAGS_URL =
      "http://ignored-env:11434/api/tags";
    process.env.OLLAMA_BASE_PATH = "http://ignored-base:11434";
    const endpoint = "http://explicit:11434/api/tags";
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ models: [] }),
    });

    await detectLocalOllama({ endpoint, fetchImpl });

    expect(fetchImpl).toHaveBeenCalledWith(endpoint, {
      method: "GET",
      signal: expect.any(AbortSignal),
    });
  });

  it("uses SWARMSY_LOCAL_OLLAMA_TAGS_URL when set", async () => {
    const endpoint = "http://docker-ollama:11434/api/tags";
    process.env.SWARMSY_LOCAL_OLLAMA_TAGS_URL = endpoint;
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ models: [] }),
    });

    await detectLocalOllama({ fetchImpl });

    expect(fetchImpl).toHaveBeenCalledWith(endpoint, {
      method: "GET",
      signal: expect.any(AbortSignal),
    });
  });

  it("derives tags endpoint from OLLAMA_BASE_PATH when set", async () => {
    process.env.OLLAMA_BASE_PATH = "http://hermes-ollama:11434";
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ models: [] }),
    });

    await detectLocalOllama({ fetchImpl });

    expect(fetchImpl).toHaveBeenCalledWith("http://hermes-ollama:11434/api/tags", {
      method: "GET",
      signal: expect.any(AbortSignal),
    });
  });

  it("trims model names in normalized id and name fields", () => {
    expect(
      normalizeOllamaModels([
        { name: "  qwen3:8b  ", size: 1 },
        { name: "   " },
      ])
    ).toEqual([
      {
        id: "qwen3:8b",
        name: "qwen3:8b",
        size: 1,
        digest: null,
        modifiedAt: null,
      },
    ]);
  });

  it("includes the checked endpoint in unreachable responses", async () => {
    const endpoint = "http://hermes-ollama:11434/api/tags";
    const fetchImpl = jest
      .fn()
      .mockRejectedValue(new TypeError("fetch failed: ECONNREFUSED"));

    const status = await detectLocalOllama({ endpoint, fetchImpl });

    expect(status.message).toBe(`Local Ollama is not reachable at ${endpoint}.`);
    expect(status.endpoint).toBe(endpoint);
  });
});
