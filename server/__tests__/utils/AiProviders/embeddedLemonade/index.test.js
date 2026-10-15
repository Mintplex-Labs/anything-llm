const fs = require("fs");
const os = require("os");
const path = require("path");

jest.mock("../../../../utils/AiProviders/embeddedLemonade/config", () => ({
  ...jest.requireActual(
    "../../../../utils/AiProviders/embeddedLemonade/config"
  ),
  isEnabled: () => true,
}));

const {
  EmbeddedLemonadeLLM,
  getEmbeddedLemonadeModels,
} = require("../../../../utils/AiProviders/embeddedLemonade");
const {
  EmbeddedLemonadeEngine,
} = require("../../../../utils/AiProviders/embeddedLemonade/engine");
const MODEL_REGISTRY = require("../../../../utils/AiProviders/embeddedLemonade/models.json");

const ORIGINAL_ENV = process.env;
const ORIGINAL_FETCH = global.fetch;
const API = "http://127.0.0.1:13355/api/v1";
// A registry model lemond's own catalog has (no checkpoint) and one we register from a checkpoint.
const CATALOG_MODEL = MODEL_REGISTRY.models.find((m) => !m.checkpoint);
const CHECKPOINT_MODEL = MODEL_REGISTRY.models.find((m) => m.checkpoint);
let storage;

/** An SSE response body that arrives in exactly these chunks. */
function sseBody(chunks) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
}

function json(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    json: async () => body,
  };
}

/**
 * Routes fetch calls to handlers by "<METHOD> <path>", eg: "POST /load". Unrouted calls fail like a closed port.
 * @param {Record<string, (url: URL, body: object|null, init: object) => object>} routes
 */
function mockLemond(routes) {
  global.fetch = jest.fn(async (input, init = {}) => {
    const url = new URL(String(input));
    const route = `${init.method ?? "GET"} ${url.pathname.replace("/api/v1", "")}`;
    const handler = routes[route];
    if (!handler) throw new TypeError(`fetch failed (${route})`);
    return handler(url, init.body ? JSON.parse(init.body) : null, init);
  });
  return global.fetch;
}

function callsTo(route) {
  return global.fetch.mock.calls.filter(([input, init = {}]) => {
    const url = new URL(String(input));
    return (
      `${init.method ?? "GET"} ${url.pathname.replace("/api/v1", "")}` === route
    );
  });
}

beforeEach(() => {
  storage = fs.mkdtempSync(path.join(os.tmpdir(), "embedded-lemonade-"));
  process.env = { ...ORIGINAL_ENV, STORAGE_DIR: storage };
  delete process.env.EMBEDDED_LEMONADE_MODEL_TOKEN_LIMIT;
  delete process.env.EMBEDDED_LEMONADE_REGISTRY;
  EmbeddedLemonadeLLM.modelContextWindows = {};
  EmbeddedLemonadeLLM.registryFallbackActive = false;
  jest.spyOn(EmbeddedLemonadeEngine, "bootOrContinue").mockResolvedValue(true);
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  global.fetch = ORIGINAL_FETCH;
  fs.rmSync(storage, { recursive: true, force: true });
  jest.restoreAllMocks();
});

describe("promptWindowLimit", () => {
  const LONG = MODEL_REGISTRY.models.find((m) => m.contextWindow > 16384);

  it("uses the model's context window capped at 16384 when unset", () => {
    expect(EmbeddedLemonadeLLM.promptWindowLimit(LONG.id)).toBe(16384);
    EmbeddedLemonadeLLM.modelContextWindows["small-model"] = 4096;
    expect(EmbeddedLemonadeLLM.promptWindowLimit("small-model")).toBe(4096);
  });

  it("uses 16384 for a model with no known context window", () => {
    expect(EmbeddedLemonadeLLM.promptWindowLimit("unknown-model")).toBe(16384);
    expect(EmbeddedLemonadeLLM.promptWindowLimit(null)).toBe(16384);
  });

  it.each(["", "0", "-1", "abc"])("treats %p like unset", (value) => {
    process.env.EMBEDDED_LEMONADE_MODEL_TOKEN_LIMIT = value;
    expect(EmbeddedLemonadeLLM.promptWindowLimit(LONG.id)).toBe(16384);
  });

  it("uses a set value, capped to the model's context window", () => {
    process.env.EMBEDDED_LEMONADE_MODEL_TOKEN_LIMIT = "32768";
    expect(EmbeddedLemonadeLLM.promptWindowLimit(LONG.id)).toBe(32768);
    EmbeddedLemonadeLLM.modelContextWindows["small-model"] = 4096;
    expect(EmbeddedLemonadeLLM.promptWindowLimit("small-model")).toBe(4096);
  });

  it("prefers the context window lemond reports over the registry's", () => {
    process.env.EMBEDDED_LEMONADE_MODEL_TOKEN_LIMIT = "999999";
    EmbeddedLemonadeLLM.modelContextWindows[LONG.id] = 65536;
    expect(EmbeddedLemonadeLLM.promptWindowLimit(LONG.id)).toBe(65536);
  });

  it("splits the window into history, system and user limits", () => {
    const llm = new EmbeddedLemonadeLLM(null, LONG.id);
    expect(llm.limits).toEqual({
      history: 16384 * 0.15,
      system: 16384 * 0.15,
      user: 16384 * 0.7,
    });
  });
});

describe("loadModel", () => {
  it("loads the model with the prompt window as its context size", async () => {
    mockLemond({
      [`GET /models/${CATALOG_MODEL.id}`]: () => json({}),
      "GET /health": () => json({ all_models_loaded: [] }),
      "POST /load": () => json({ status: "success" }),
    });
    await EmbeddedLemonadeLLM.loadModel(CATALOG_MODEL.id);
    expect(JSON.parse(callsTo("POST /load")[0][1].body)).toEqual({
      model_name: CATALOG_MODEL.id,
      ctx_size: EmbeddedLemonadeLLM.promptWindowLimit(CATALOG_MODEL.id),
    });
  });

  it("skips the load when the model is already loaded with that context size", async () => {
    mockLemond({
      "GET /models/m": () => json({ max_context_window: 8192 }),
      "GET /health": () =>
        json({
          all_models_loaded: [
            { model_name: "m", recipe_options: { ctx_size: 8192 } },
          ],
        }),
    });
    await EmbeddedLemonadeLLM.loadModel("m");
    expect(callsTo("POST /load")).toHaveLength(0);
  });

  it("reloads a model loaded with a different context size", async () => {
    mockLemond({
      "GET /models/m": () => json({ max_context_window: 8192 }),
      "GET /health": () =>
        json({
          all_models_loaded: [
            { model_name: "m", recipe_options: { ctx_size: 4096 } },
          ],
        }),
      "POST /load": () => json({ status: "success" }),
    });
    await EmbeddedLemonadeLLM.loadModel("m");
    expect(callsTo("POST /load")).toHaveLength(1);
  });

  it.each([
    [json({ error: { message: "out of memory" } }, 500), "out of memory"],
    [json({ status: "error", message: "not downloaded" }), "not downloaded"],
    [json({ status: "error", error: "bad gguf" }), "bad gguf"],
    [json({}, 503), "Error"],
  ])("throws lemond's reason when the load fails", async (response, reason) => {
    mockLemond({
      "GET /models/m": () => json({}),
      "GET /health": () => json({ all_models_loaded: [] }),
      "POST /load": () => response,
    });
    await expect(EmbeddedLemonadeLLM.loadModel("m")).rejects.toThrow(
      `Could not load m: ${reason}`
    );
  });

  it("says lemond crashed when it stops while loading, with its last error", async () => {
    mockLemond({
      "GET /models/m": () => json({}),
      "GET /health": () => json({ all_models_loaded: [] }),
    });
    jest.spyOn(EmbeddedLemonadeEngine, "isRunning").mockResolvedValue(false);
    jest
      .spyOn(EmbeddedLemonadeEngine, "failureReason")
      .mockReturnValue("cudaMalloc failed: out of memory");
    await expect(EmbeddedLemonadeLLM.loadModel("m")).rejects.toThrow(
      "Could not load m: The built-in LLM engine stopped unexpectedly: cudaMalloc failed: out of memory"
    );
  });

  it("keeps the connection error when lemond is still running", async () => {
    mockLemond({
      "GET /models/m": () => json({}),
      "GET /health": () => json({ all_models_loaded: [] }),
    });
    jest.spyOn(EmbeddedLemonadeEngine, "isRunning").mockResolvedValue(true);
    await expect(EmbeddedLemonadeLLM.loadModel("m")).rejects.toThrow(
      "Could not load m: fetch failed (POST /load)"
    );
  });
});

describe("chat completions", () => {
  it("surfaces a failed model load instead of sending the chat", async () => {
    mockLemond({
      "GET /models/m": () => json({}),
      "GET /health": () => json({ all_models_loaded: [] }),
      "POST /load": () => json({ error: { message: "out of memory" } }, 500),
    });
    const llm = new EmbeddedLemonadeLLM(null, "m");
    await expect(llm.getChatCompletion([])).rejects.toThrow(
      "Could not load m: out of memory"
    );
    await expect(llm.streamGetChatCompletion([])).rejects.toThrow(
      "Could not load m: out of memory"
    );
  });

  it("reports why the engine will not start", async () => {
    mockLemond({});
    EmbeddedLemonadeEngine.bootOrContinue.mockResolvedValue(false);
    jest.replaceProperty(EmbeddedLemonadeEngine, "status", {
      state: "error",
      message:
        "lemond exited while starting up: error while loading libvulkan.so.1",
      progress: null,
    });
    const llm = new EmbeddedLemonadeLLM(null, "m");
    const expected =
      "The built-in LLM engine could not be started: lemond exited while starting up: error while loading libvulkan.so.1";
    await expect(llm.getChatCompletion([])).rejects.toThrow(expected);
    await expect(llm.streamGetChatCompletion([])).rejects.toThrow(expected);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("explains a chat whose connection drops because lemond crashed", async () => {
    mockLemond({
      "GET /models/m": () => json({}),
      "GET /health": () => json({ all_models_loaded: [] }),
      "POST /load": () => json({ status: "success" }),
    });
    jest.spyOn(EmbeddedLemonadeEngine, "isRunning").mockResolvedValue(false);
    jest
      .spyOn(EmbeddedLemonadeEngine, "failureReason")
      .mockReturnValue("ggml_cuda_init: failed to initialize CUDA");
    const llm = new EmbeddedLemonadeLLM(null, "m");
    llm.client = {
      chat: {
        completions: {
          create: async () => {
            throw new TypeError("fetch failed");
          },
        },
      },
    };
    await expect(llm.getChatCompletion([])).rejects.toThrow(
      "The built-in LLM engine stopped unexpectedly: ggml_cuda_init: failed to initialize CUDA"
    );
  });

  it("puts reasoning_content in think tags", async () => {
    mockLemond({
      "GET /models/m": () => json({}),
      "GET /health": () => json({ all_models_loaded: [] }),
      "POST /load": () => json({ status: "success" }),
    });
    const llm = new EmbeddedLemonadeLLM(null, "m");
    llm.client = {
      chat: {
        completions: {
          create: async () => ({
            choices: [{ message: { content: "4", reasoning_content: "2+2" } }],
            usage: { prompt_tokens: 3, completion_tokens: 1, total_tokens: 4 },
          }),
        },
      },
    };
    const { textResponse } = await llm.getChatCompletion([]);
    expect(textResponse).toBe("<think>2+2</think>4");
  });
});

describe("pullModel", () => {
  const PULL_COMPLETE = [
    'event: progress\ndata: {"percent": 12.4, "file": "model.gguf"}\n\n',
    "event: complete\ndata: {}\n\n",
  ];

  function mockCheckpointPull({ variants = {}, pull = {} } = {}) {
    return mockLemond({
      "GET /pull/variants": (url) => {
        const handler = variants[url.searchParams.get("source")];
        if (handler) return handler(url);
        return json({
          recipe: "llamacpp",
          variants: [{ name: "Q8_0" }, { name: "Q4_K_M" }],
          mmproj_files: ["mmproj-BF16.gguf", "mmproj-F16.gguf"],
          suggested_labels: ["chat", "vision"],
        });
      },
      "POST /pull": (_url, body) => {
        const chunks = pull[body.registry_source] ?? PULL_COMPLETE;
        return { ok: true, body: sseBody(chunks) };
      },
      "POST /delete": () => json({ status: "success" }),
    });
  }

  it("registers a Hugging Face checkpoint with its quant, vision projector and labels", async () => {
    process.env.EMBEDDED_LEMONADE_REGISTRY = "huggingface";
    mockCheckpointPull();
    const result = await EmbeddedLemonadeLLM.pullModel("owner/Repo-GGUF:q8_0");
    expect(result).toEqual({ modelId: "Repo-GGUF-Q8_0" });
    expect(JSON.parse(callsTo("POST /pull")[0][1].body)).toEqual({
      model_name: "user.Repo-GGUF-Q8_0",
      checkpoint: "owner/Repo-GGUF:Q8_0",
      recipe: "llamacpp",
      mmproj: "mmproj-F16.gguf",
      labels: ["chat", "vision"],
      registry_source: "huggingface",
      stream: true,
    });
  });

  it.each([
    [
      ["mmproj-F32.gguf", "mmproj-BF16.gguf", "mmproj-f16.gguf"],
      "mmproj-f16.gguf",
    ],
    [["mmproj-BF16.gguf", "mmproj-F32.gguf"], "mmproj-BF16.gguf"],
    [[], undefined],
  ])(
    "picks the F16 vision projector from %p",
    async (mmproj_files, expected) => {
      process.env.EMBEDDED_LEMONADE_REGISTRY = "huggingface";
      mockCheckpointPull({
        variants: {
          huggingface: () =>
            json({
              recipe: "llamacpp",
              variants: [{ name: "Q4_K_M" }],
              mmproj_files,
            }),
        },
      });
      await EmbeddedLemonadeLLM.pullModel("owner/Repo-GGUF");
      expect(JSON.parse(callsTo("POST /pull")[0][1].body).mmproj).toBe(
        expected
      );
    }
  );

  it("picks Q4_K_M when no quant is requested", async () => {
    process.env.EMBEDDED_LEMONADE_REGISTRY = "huggingface";
    mockCheckpointPull();
    await expect(
      EmbeddedLemonadeLLM.pullModel("owner/Repo-GGUF")
    ).resolves.toEqual({ modelId: "Repo-GGUF-Q4_K_M" });
  });

  it("rejects a quant the repo does not have", async () => {
    process.env.EMBEDDED_LEMONADE_REGISTRY = "huggingface";
    mockCheckpointPull();
    await expect(
      EmbeddedLemonadeLLM.pullModel("owner/Repo-GGUF:Q2_K")
    ).rejects.toThrow("owner/Repo-GGUF has no Q2_K variant.");
    expect(callsTo("POST /pull")).toHaveLength(0);
  });

  it("rejects a repo that is not a GGUF model", async () => {
    process.env.EMBEDDED_LEMONADE_REGISTRY = "huggingface";
    mockCheckpointPull({
      variants: { huggingface: () => json({ recipe: "vllm", variants: [] }) },
    });
    await expect(EmbeddedLemonadeLLM.pullModel("owner/Repo")).rejects.toThrow(
      "owner/Repo is not a GGUF model that AnythingLLM can run."
    );
  });

  it("pulls a catalog model by id", async () => {
    process.env.EMBEDDED_LEMONADE_REGISTRY = "huggingface";
    mockCheckpointPull();
    await expect(
      EmbeddedLemonadeLLM.pullModel(CATALOG_MODEL.id)
    ).resolves.toEqual({ modelId: CATALOG_MODEL.id });
    expect(JSON.parse(callsTo("POST /pull")[0][1].body)).toEqual({
      model_name: CATALOG_MODEL.id,
      registry_source: "huggingface",
      stream: true,
    });
  });

  it("registers a registry model from its checkpoint", async () => {
    process.env.EMBEDDED_LEMONADE_REGISTRY = "huggingface";
    mockCheckpointPull();
    await expect(
      EmbeddedLemonadeLLM.pullModel(CHECKPOINT_MODEL.id)
    ).resolves.toEqual({ modelId: CHECKPOINT_MODEL.id });
    expect(JSON.parse(callsTo("POST /pull")[0][1].body)).toMatchObject({
      model_name: `user.${CHECKPOINT_MODEL.id}`,
      checkpoint: CHECKPOINT_MODEL.checkpoint,
      labels: CHECKPOINT_MODEL.labels,
    });
  });

  it("parses progress events split across chunks", async () => {
    process.env.EMBEDDED_LEMONADE_REGISTRY = "huggingface";
    mockCheckpointPull({
      pull: {
        huggingface: [
          "event: prog",
          'ress\ndata: {"percent": 49.6, "fi',
          'le": "a.gguf"}\n\nevent: progress\ndata: {"percent": 100}\n\nevent: complete\n',
          "data: {}\n\n",
        ],
      },
    });
    const onProgress = jest.fn();
    await EmbeddedLemonadeLLM.pullModel("owner/Repo-GGUF", { onProgress });
    expect(onProgress.mock.calls).toEqual([
      [50, "Downloading a.gguf"],
      [100, "Downloading model..."],
    ]);
  });

  it("fails when lemond sends an error event", async () => {
    process.env.EMBEDDED_LEMONADE_REGISTRY = "huggingface";
    mockCheckpointPull({
      pull: { huggingface: ['event: error\ndata: {"error": "disk full"}\n\n'] },
    });
    await expect(
      EmbeddedLemonadeLLM.pullModel("owner/Repo-GGUF")
    ).rejects.toThrow("disk full");
  });

  it("fails when the stream ends before completing", async () => {
    process.env.EMBEDDED_LEMONADE_REGISTRY = "huggingface";
    mockCheckpointPull({
      pull: { huggingface: ['event: progress\ndata: {"percent": 3}\n\n'] },
    });
    await expect(
      EmbeddedLemonadeLLM.pullModel("owner/Repo-GGUF")
    ).rejects.toThrow("The download ended before completing.");
  });

  it("falls back to ModelScope and keeps using it", async () => {
    mockCheckpointPull({
      pull: { huggingface: ['event: error\ndata: {"error": "blocked"}\n\n'] },
    });
    await expect(
      EmbeddedLemonadeLLM.pullModel("owner/Repo-GGUF")
    ).resolves.toEqual({ modelId: "Repo-GGUF-Q4_K_M" });
    expect(
      callsTo("POST /pull").map(
        ([, init]) => JSON.parse(init.body).registry_source
      )
    ).toEqual(["huggingface", "modelscope"]);
    expect(EmbeddedLemonadeLLM.registriesToTry()).toEqual(["modelscope"]);
  });

  it("throws the last registry's error when every registry fails", async () => {
    mockCheckpointPull({
      pull: {
        huggingface: ['event: error\ndata: {"error": "blocked"}\n\n'],
        modelscope: ['event: error\ndata: {"error": "not found"}\n\n'],
      },
    });
    await expect(
      EmbeddedLemonadeLLM.pullModel("owner/Repo-GGUF")
    ).rejects.toThrow("not found");
    expect(EmbeddedLemonadeLLM.registryFallbackActive).toBe(false);
  });

  it("removes the registration and partial files when cancelled", async () => {
    process.env.EMBEDDED_LEMONADE_REGISTRY = "huggingface";
    const repoDir = path.join(
      storage,
      "models",
      "embedded-lemonade",
      "models--owner--Repo-GGUF"
    );
    fs.mkdirSync(path.join(repoDir, "blobs"), { recursive: true });
    fs.writeFileSync(path.join(repoDir, "blobs", "other-quant.gguf"), "");
    fs.writeFileSync(path.join(repoDir, "blobs", "this.gguf.partial"), "");
    fs.writeFileSync(path.join(repoDir, ".download_manifest.json"), "");

    const controller = new AbortController();
    mockCheckpointPull();
    global.fetch.mockImplementationOnce(global.fetch.getMockImplementation());
    const pull = global.fetch.getMockImplementation();
    global.fetch.mockImplementation(async (input, init = {}) => {
      if (String(input).endsWith("/pull") && init.method === "POST") {
        controller.abort();
        throw new DOMException("aborted", "AbortError");
      }
      return pull(input, init);
    });
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate"] });
    const result = EmbeddedLemonadeLLM.pullModel("owner/Repo-GGUF", {
      signal: controller.signal,
    }).catch((e) => e);
    await jest.advanceTimersByTimeAsync(1000);
    jest.useRealTimers();

    expect(await result).toBeInstanceOf(DOMException);
    expect(JSON.parse(callsTo("POST /delete")[0][1].body)).toEqual({
      model_name: "Repo-GGUF-Q4_K_M",
    });
    // The repo folder existed before (another quant), so only in-progress files go.
    expect(fs.existsSync(path.join(repoDir, "blobs", "other-quant.gguf"))).toBe(
      true
    );
    expect(
      fs.existsSync(path.join(repoDir, "blobs", "this.gguf.partial"))
    ).toBe(false);
    expect(fs.existsSync(path.join(repoDir, ".download_manifest.json"))).toBe(
      false
    );
  });

  it("fails with why the engine will not start", async () => {
    EmbeddedLemonadeEngine.bootOrContinue.mockResolvedValue(false);
    jest.replaceProperty(EmbeddedLemonadeEngine, "status", {
      state: "error",
      message: "Download of https://cdn.example/lemond.tar.gz failed: 404",
      progress: null,
    });
    await expect(EmbeddedLemonadeLLM.pullModel("owner/Repo")).rejects.toThrow(
      "The built-in LLM engine could not be started: Download of https://cdn.example/lemond.tar.gz failed: 404"
    );
  });
});

describe("registriesToTry", () => {
  it.each([
    [undefined, ["huggingface", "modelscope"]],
    ["auto", ["huggingface", "modelscope"]],
    ["huggingface", ["huggingface"]],
    ["modelscope", ["modelscope"]],
    ["bogus", ["huggingface", "modelscope"]],
  ])("EMBEDDED_LEMONADE_REGISTRY=%p tries %p", (setting, expected) => {
    if (setting !== undefined) process.env.EMBEDDED_LEMONADE_REGISTRY = setting;
    expect(EmbeddedLemonadeLLM.registriesToTry()).toEqual(expected);
  });
});

describe("availableModels", () => {
  function mockCatalog(data) {
    mockLemond({ "GET /models": () => json({ data }) });
  }

  it("lists registry models in registry order, then downloaded custom chat models", async () => {
    mockCatalog([
      { id: "my-custom-GGUF", recipe: "llamacpp", downloaded: true, size: 1 },
      {
        id: "embedder-GGUF",
        recipe: "llamacpp",
        downloaded: true,
        labels: ["embeddings"],
      },
      { id: "not-downloaded-GGUF", recipe: "llamacpp", downloaded: false },
      { id: "whisper", recipe: "whispercpp", downloaded: true },
      { id: CATALOG_MODEL.id, recipe: "llamacpp", downloaded: true },
    ]);
    const models = await EmbeddedLemonadeLLM.availableModels();
    const ids = models.map((m) => m.id);

    // Registry models lemond does not have are listed only when we can register them from a checkpoint.
    const expectedRegistry = MODEL_REGISTRY.models
      .filter((m) => m.checkpoint || m.id === CATALOG_MODEL.id)
      .map((m) => m.id);
    expect(ids).toEqual([...expectedRegistry, "my-custom-GGUF"]);
    expect(models.find((m) => m.id === CATALOG_MODEL.id).downloaded).toBe(true);
    expect(models.find((m) => m.id === "my-custom-GGUF")).toMatchObject({
      name: "my-custom",
      family: "Custom",
      downloaded: true,
      size: "1.0 GiB",
    });
  });

  it("is empty when lemond cannot be reached or started", async () => {
    mockLemond({});
    await expect(EmbeddedLemonadeLLM.availableModels()).resolves.toEqual([]);
    EmbeddedLemonadeEngine.bootOrContinue.mockResolvedValue(false);
    await expect(EmbeddedLemonadeLLM.availableModels()).resolves.toEqual([]);
  });

  it("lists only downloaded models, without the flag, for the model pickers", async () => {
    mockCatalog([
      { id: CATALOG_MODEL.id, recipe: "llamacpp", downloaded: true },
    ]);
    const { models } = await getEmbeddedLemonadeModels();
    expect(models.map((m) => m.id)).toEqual([CATALOG_MODEL.id]);
    expect(models[0]).not.toHaveProperty("downloaded");

    const { models: all } = await getEmbeddedLemonadeModels(true);
    expect(all.length).toBeGreaterThan(1);
    expect(all.every((m) => "downloaded" in m)).toBe(true);
  });
});

describe("deleteModel", () => {
  const repoDir = () =>
    path.join(
      storage,
      "models",
      "embedded-lemonade",
      "models--owner--Repo-GGUF"
    );

  function mockDelete(downloaded = []) {
    mockLemond({
      "GET /models/Repo-GGUF-Q4_K_M": () =>
        json({ checkpoint: "owner/Repo-GGUF:Q4_K_M" }),
      "POST /delete": () => json({ status: "success" }),
      "GET /models": () => json({ data: downloaded }),
    });
  }

  it("removes the repo folder when no other downloaded model uses it", async () => {
    fs.mkdirSync(repoDir(), { recursive: true });
    mockDelete([]);
    await expect(
      EmbeddedLemonadeLLM.deleteModel("Repo-GGUF-Q4_K_M")
    ).resolves.toBe(true);
    expect(fs.existsSync(repoDir())).toBe(false);
  });

  it("keeps the repo folder another quant still uses", async () => {
    fs.mkdirSync(repoDir(), { recursive: true });
    fs.writeFileSync(path.join(repoDir(), "q8.gguf"), "");
    mockDelete([
      {
        id: "Repo-GGUF-Q8_0",
        downloaded: true,
        checkpoint: "owner/Repo-GGUF:Q8_0",
      },
    ]);
    await EmbeddedLemonadeLLM.deleteModel("Repo-GGUF-Q4_K_M");
    expect(fs.existsSync(path.join(repoDir(), "q8.gguf"))).toBe(true);
  });

  it("surfaces lemond's delete error", async () => {
    mockLemond({
      "GET /models/x": () => json({}),
      "POST /delete": () => json({ status: "error", message: "in use" }),
    });
    await expect(EmbeddedLemonadeLLM.deleteModel("x")).rejects.toThrow(
      "in use"
    );
  });

  it("does nothing without a model id", async () => {
    mockLemond({});
    await expect(EmbeddedLemonadeLLM.deleteModel("")).resolves.toBe(true);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
