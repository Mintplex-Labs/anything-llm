const fs = require("fs");
const path = require("path");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  handleDefaultStreamResponseV2,
  formatChatHistory,
} = require("../../helpers/chat/responses");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const { OpenAI: OpenAIApi } = require("openai");
const { humanFileSize } = require("../../helpers");
const {
  temperatureParam,
} = require("../../agents/aibitat/providers/helpers/tooled");
const {
  PROVIDER_REASONING_EFFORTS,
  reasoningParams,
} = require("../../helpers/reasoningEffort");
const { EmbeddedLemonadeEngine } = require("./engine");
const {
  REGISTRIES,
  DEFAULT_CONTEXT_WINDOW,
  isEnabled,
  paths,
} = require("./config");

/**
 * The models offered in the model table, in order, with their capabilities. Maintained by hand since lemond's own
 * labels are often wrong (eg. Qwen3.5 has a thinking toggle lemond does not label).
 */
const MODEL_REGISTRY = require("./models.json");
const REGISTRY_BY_ID = new Map(MODEL_REGISTRY.models.map((m) => [m.id, m]));

/** The lemond recipes this engine runs. lemond's catalog also lists recipes (image, speech, vllm...) we do not offer. */
const SUPPORTED_RECIPES = {
  llamacpp: { deviceType: "GPU", runtime: "Llama.cpp" },
};

/**
 * The embedded Lemonade engine (`embedded_lemonade`) - a lemond server this instance installs and runs itself
 * (see engine.js). Same API as the external Lemonade provider, plus engine lifecycle and model management.
 */
class EmbeddedLemonadeLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!isEnabled())
      throw new Error(
        "The built-in LLM engine is not enabled. Set ENABLE_BUILT_IN_LLM=true when starting the AnythingLLM Docker container."
      );
    this.className = "EmbeddedLemonadeLLM";
    this.model = modelPreference || process.env.EMBEDDED_LEMONADE_MODEL_PREF;
    this.embedder = embedder ?? new NativeEmbedder();
    this.client = new OpenAIApi({
      baseURL: EmbeddedLemonadeLLM.openaiBasePath(),
      apiKey: "not-used",
    });
    this.#setLimits();
    this.#log(`initialized with model: ${this.model}`);
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[EmbeddedLemonade]\x1b[0m ${text}`, ...args);
  }

  static slog(text, ...args) {
    console.log(`\x1b[32m[EmbeddedLemonade]\x1b[0m ${text}`, ...args);
  }

  /** The OpenAI-compatible API root of the embedded lemond server. */
  static openaiBasePath() {
    return `${EmbeddedLemonadeEngine.baseUrl}/api/v1`;
  }

  static async bootOrContinue() {
    return await EmbeddedLemonadeEngine.bootOrContinue();
  }

  #setLimits() {
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };
  }

  /**
   * Boots the engine and looks up the model's trained context window so prompt limits match what the model is
   * loaded with. Safe to call on every request - the lookup is cached per model.
   */
  async assertModelContextLimits() {
    if (!(await EmbeddedLemonadeLLM.bootOrContinue())) return;
    await EmbeddedLemonadeLLM.cacheContextWindow(this.model);
    this.#setLimits();
  }

  /**
   * A fetch for OpenAI-compatible clients (agents, langchain) that boots the engine and loads the model before every
   * request. The engine may not be running when this provider is only a workspace or agent LLM and not the system LLM.
   * @param {string|null} model
   * @returns {typeof fetch}
   */
  static bootingFetch(model = null) {
    return async (input, init = {}) => {
      await EmbeddedLemonadeEngine.ensureRunning();
      if (model) await EmbeddedLemonadeLLM.loadModel(model);
      return await fetch(input, init);
    };
  }

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  /**
   * The context window models are loaded with.
   * - Unset (the default): the model's trained context length (as lemond reports it once downloaded, otherwise
   *   from the registry), capped to DEFAULT_CONTEXT_WINDOW so a long-context model cannot run a GPU out of memory.
   * - Set: the user's value, capped to the model's trained context length when known.
   */
  static promptWindowLimit(modelName = null) {
    const userDefinedLimit = Number(
      process.env.EMBEDDED_LEMONADE_MODEL_TOKEN_LIMIT
    );
    const maxContextWindow =
      EmbeddedLemonadeLLM.modelContextWindows[modelName] ??
      REGISTRY_BY_ID.get(modelName)?.contextWindow ??
      null;
    if (isNaN(userDefinedLimit) || userDefinedLimit <= 0)
      return Math.min(
        maxContextWindow ?? DEFAULT_CONTEXT_WINDOW,
        DEFAULT_CONTEXT_WINDOW
      );
    return maxContextWindow
      ? Math.min(userDefinedLimit, maxContextWindow)
      : userDefinedLimit;
  }

  /**
   * The trained context length of each downloaded model, as lemond reports it once the model's files are on disk.
   * @type {Record<string, number>}
   */
  static modelContextWindows = {};

  static async cacheContextWindow(model) {
    if (!model || EmbeddedLemonadeLLM.modelContextWindows[model]) return;
    const info = await fetch(
      `${EmbeddedLemonadeLLM.openaiBasePath()}/models/${encodeURIComponent(model)}`
    )
      .then((res) => (res.ok ? res.json() : {}))
      .catch(() => ({}));
    const maxContextWindow = Number(
      info?.max_context_window ?? info?.context_length
    );
    if (maxContextWindow > 0)
      EmbeddedLemonadeLLM.modelContextWindows[model] = maxContextWindow;
  }

  promptWindowLimit() {
    return this.constructor.promptWindowLimit(this.model);
  }

  async isValidChatCompletionModel(_ = "") {
    return true;
  }

  #appendContext(contextTexts = []) {
    if (!contextTexts || !contextTexts.length) return "";
    return (
      "\nContext:\n" +
      contextTexts
        .map((text, i) => {
          return `[CONTEXT ${i}]:\n${text}\n[END CONTEXT ${i}]\n\n`;
        })
        .join("")
    );
  }

  /**
   * Generates appropriate content array for a message + attachments.
   * @param {{userPrompt:string, attachments: import("../../helpers").Attachment[]}}
   * @returns {string|object[]}
   */
  #generateContent({ userPrompt, attachments = [] }) {
    if (!attachments.length) return userPrompt;
    const content = [{ type: "text", text: userPrompt }];
    for (let attachment of attachments) {
      content.push({
        type: "image_url",
        image_url: { url: attachment.contentString, detail: "auto" },
      });
    }
    return content.flat();
  }

  /**
   * Construct the user prompt for this model.
   * @param {{attachments: import("../../helpers").Attachment[]}} param0
   * @returns
   */
  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
    attachments = [],
  }) {
    const prompt = {
      role: "system",
      content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
    };
    return [
      prompt,
      ...formatChatHistory(chatHistory, this.#generateContent),
      {
        role: "user",
        content: this.#generateContent({ userPrompt, attachments }),
      },
    ];
  }

  /**
   * Prepends reasoning (llama.cpp returns it as `reasoning_content`) to the response text so it renders as thinking.
   * @param {Object} choice - The first choice of a chat completion response.
   * @returns {string}
   */
  #parseReasoningFromResponse({ message }) {
    let textResponse = message?.content ?? "";
    if (message?.reasoning_content?.trim()?.length > 0)
      textResponse = `<think>${message.reasoning_content}</think>${textResponse}`;
    return textResponse;
  }

  async #error(e) {
    if (e?.message?.includes("fetch failed") || e?.code === "ECONNREFUSED")
      return await EmbeddedLemonadeEngine.connectionError(e);
    return e;
  }

  /**
   * Boots lemond if needed and loads the model with our context window so every request shares one loaded
   * instance instead of lemond reloading it with its own defaults.
   */
  async #prepare() {
    await EmbeddedLemonadeEngine.ensureRunning();
    await EmbeddedLemonadeLLM.loadModel(this.model);
  }

  async getChatCompletion(
    messages = null,
    { temperature = this.temperature, reasoningEffort = null } = {}
  ) {
    await this.#prepare();
    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.client.chat.completions.create({
        model: this.model,
        messages,
        ...temperatureParam(temperature),
        ...reasoningParams("lemonade", reasoningEffort, this.model),
      })
    ).catch(async (e) => {
      throw await this.#error(e);
    });

    if (!result.output?.choices?.length) return null;
    return {
      textResponse: this.#parseReasoningFromResponse(result.output.choices[0]),
      metrics: {
        prompt_tokens: result.output.usage?.prompt_tokens || 0,
        completion_tokens: result.output.usage?.completion_tokens || 0,
        total_tokens: result.output.usage?.total_tokens || 0,
        outputTps: result.output.usage?.completion_tokens / result.duration,
        duration: result.duration,
        model: this.model,
        provider: this.className,
        timestamp: new Date(),
      },
    };
  }

  async streamGetChatCompletion(
    messages = null,
    { temperature = this.temperature, reasoningEffort = null } = {}
  ) {
    await this.#prepare();
    return await LLMPerformanceMonitor.measureStream({
      func: this.client.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        ...temperatureParam(temperature),
        ...reasoningParams("lemonade", reasoningEffort, this.model),
      }),
      messages,
      runPromptTokenCalculation: true,
      modelTag: this.model,
      provider: this.className,
    }).catch(async (e) => {
      throw await this.#error(e);
    });
  }

  handleStream(response, stream, responseProps) {
    return handleDefaultStreamResponseV2(response, stream, responseProps);
  }

  /**
   * The model's capabilities - the registry's for the models we offer, otherwise lemond's labels (eg. a Hugging
   * Face model the registry does not have).
   * reasoningOptions are the reasoning efforts the chat's thinking picker offers (eg: on/off, or low/medium/high
   * for gpt-oss) - sent with each request through reasoningParams.
   * @returns {Promise<{tools: 'unknown' | boolean, reasoning: 'unknown' | boolean, reasoningOptions: string[], imageGeneration: 'unknown' | boolean, vision: 'unknown' | boolean}>}
   */
  async getModelCapabilities() {
    try {
      const { vision, tools, reasoning, reasoningOptions } =
        REGISTRY_BY_ID.get(this.model)?.capabilities ??
        (await EmbeddedLemonadeLLM.capabilitiesFromLabels(this.model));
      return {
        tools,
        reasoning,
        reasoningOptions: reasoning
          ? reasoningOptions ?? PROVIDER_REASONING_EFFORTS.lemonade(this.model)
          : [],
        imageGeneration: false,
        vision,
      };
    } catch (error) {
      console.error("Error getting model capabilities:", error);
      return {
        tools: "unknown",
        reasoning: "unknown",
        reasoningOptions: [],
        imageGeneration: "unknown",
        vision: "unknown",
      };
    }
  }

  static async capabilitiesFromLabels(modelId) {
    await EmbeddedLemonadeLLM.bootOrContinue();
    const { labels = [], checkpoints = {} } = await fetch(
      `${EmbeddedLemonadeLLM.openaiBasePath()}/models/${encodeURIComponent(modelId)}`
    )
      .then((res) => (res.ok ? res.json() : {}))
      .catch(() => ({}));
    return {
      vision: labels.includes("vision") || !!checkpoints.mmproj,
      tools: labels.includes("tool-calling"),
      reasoning: labels.includes("reasoning"),
    };
  }

  /**
   * The models lemond currently has loaded, with the context size each was loaded with.
   * @returns {Promise<{model_name: string, ctx_size: number}[]>}
   */
  static async getCurrentlyLoadedModels() {
    return await fetch(`${EmbeddedLemonadeLLM.openaiBasePath()}/health`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(({ all_models_loaded = [] } = {}) =>
        all_models_loaded.map((model) => ({
          model_name: model.model_name,
          ctx_size: model?.recipe_options?.ctx_size ?? null,
        }))
      );
  }

  /**
   * Loads a model with our context window unless it is already loaded with it.
   * @param {string} model
   * @returns {Promise<void>}
   * @throws {Error} lemond's reason when the model cannot be loaded (eg: out of memory, not downloaded)
   */
  static async loadModel(model) {
    await EmbeddedLemonadeLLM.cacheContextWindow(model);
    const desiredCtxSize = Number(EmbeddedLemonadeLLM.promptWindowLimit(model));
    const loaded = await EmbeddedLemonadeLLM.getCurrentlyLoadedModels().catch(
      () => []
    );
    if (loaded.find((m) => m.model_name === model)?.ctx_size === desiredCtxSize)
      return;

    EmbeddedLemonadeLLM.slog(
      `Loading model ${model} with context size ${desiredCtxSize}`
    );
    // The first load of a backend downloads llama.cpp, so this can take a while.
    const response = await fetch(
      `${EmbeddedLemonadeLLM.openaiBasePath()}/load`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_name: String(model),
          ctx_size: desiredCtxSize,
        }),
      }
    ).catch(async (e) => {
      const error = await EmbeddedLemonadeEngine.connectionError(e);
      throw new Error(`Could not load ${model}: ${error.message}`);
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.status !== "success") {
      const reason =
        data?.error?.message ||
        data?.message ||
        data?.error ||
        response.statusText;
      EmbeddedLemonadeLLM.slog(`Error loading model ${model}:`, reason);
      throw new Error(`Could not load ${model}: ${reason}`);
    }
    EmbeddedLemonadeLLM.slog(`Model ${model} loaded successfully`);
  }

  /**
   * The models offered through lemond, in registry order (see models.json), plus any downloaded model the registry
   * does not have in a "Custom" family.
   * @returns {Promise<{id: string, name: string, family: string, organization: string, size: string, downloaded: boolean, capabilities: object|null, recipe: string, deviceType: string, runtime: string, tags: string[]}[]>}
   */
  static async availableModels() {
    if (!(await EmbeddedLemonadeLLM.bootOrContinue())) return [];
    const lemondModels = await fetch(
      `${EmbeddedLemonadeLLM.openaiBasePath()}/models?show_all=true`
    )
      .then((res) => res.json())
      .then(({ data = [] }) =>
        data.filter((model) => SUPPORTED_RECIPES.hasOwnProperty(model.recipe))
      )
      .catch((e) => {
        EmbeddedLemonadeLLM.slog(`Error getting models`, e.message);
        return null;
      });
    if (!lemondModels) return [];

    const byId = new Map(lemondModels.map((model) => [model.id, model]));
    // lemond reports sizes in GB
    const size = (gb) => (gb ? humanFileSize(gb * 1024 ** 3) : "Unknown size");
    const listing = (model, downloaded) => ({
      id: model.id,
      name: model.name,
      family: model.family,
      organization: model.organization,
      size: size(model.size),
      downloaded,
      capabilities: model.capabilities,
      recipe: model.recipe,
      tags: model.tags ?? [],
      ...SUPPORTED_RECIPES[model.recipe],
    });

    const models = [];
    for (const model of MODEL_REGISTRY.models) {
      const lemondModel = byId.get(model.id);
      if (!lemondModel && !model.checkpoint) continue;
      models.push(listing(model, lemondModel?.downloaded ?? false));
    }

    for (const lemondModel of lemondModels) {
      if (!lemondModel.downloaded || REGISTRY_BY_ID.has(lemondModel.id))
        continue;
      if (
        ["embeddings", "reranking", "image"].some((label) =>
          lemondModel.labels?.includes(label)
        )
      )
        continue;
      models.push(
        listing(
          {
            id: lemondModel.id,
            name: lemondModel.id.replace(/-(GGUF|gguf)/, ""),
            family: "Custom",
            organization: "Custom",
            size: lemondModel.size,
            capabilities: null,
            recipe: lemondModel.recipe,
          },
          true
        )
      );
    }
    return models;
  }

  /** The registries to try, in order, for the EMBEDDED_LEMONADE_REGISTRY setting. */
  static registriesToTry() {
    const setting = REGISTRIES.includes(process.env.EMBEDDED_LEMONADE_REGISTRY)
      ? process.env.EMBEDDED_LEMONADE_REGISTRY
      : "auto";
    if (setting !== "auto") return [setting];
    // Once ModelScope worked where Hugging Face did not, keep using it for this session.
    return EmbeddedLemonadeLLM.registryFallbackActive
      ? ["modelscope"]
      : ["huggingface", "modelscope"];
  }

  static registryFallbackActive = false;

  /**
   * Downloads a model into lemond, falling back from Hugging Face to ModelScope when the registry setting is `auto`.
   * @param {string} modelId - a lemond model id (eg: Qwen3-4B-GGUF), a registry model with a checkpoint, or any
   * Hugging Face style checkpoint (eg: unsloth/Qwen3-4B-GGUF:Q4_K_M), which is registered as a `user.*` model first.
   * @param {{onProgress?: (percentage: number, message: string) => void, signal?: AbortSignal}} options
   * @returns {Promise<{modelId: string}>} The lemond id of the downloaded model.
   */
  static async pullModel(modelId, { onProgress = null, signal = null } = {}) {
    await EmbeddedLemonadeEngine.ensureRunning();

    const registries = EmbeddedLemonadeLLM.registriesToTry();
    let definition = { model_name: modelId };
    let lastError = null;
    let repoDir = null;
    let repoExisted = true;

    for (const registry of registries) {
      try {
        definition = await EmbeddedLemonadeLLM.#definitionFor(
          modelId,
          registry
        );
        repoDir = await EmbeddedLemonadeLLM.#repoDirFor(definition);
        repoExisted = !!repoDir && fs.existsSync(repoDir);
        await EmbeddedLemonadeLLM.#pullFrom(registry, definition, {
          onProgress,
          signal,
        });
        if (registry === "modelscope" && registries[0] === "huggingface")
          EmbeddedLemonadeLLM.registryFallbackActive = true;
        return { modelId: definition.model_name.replace(/^user\./, "") };
      } catch (e) {
        if (signal?.aborted) {
          // A checkpoint pull registers a user.* model before downloading - drop it so it does not linger.
          if (definition.model_name.startsWith("user."))
            await EmbeddedLemonadeLLM.#lemondDelete(
              definition.model_name.replace(/^user./, "")
            ).catch(() => null);
          // Give lemond a moment to stop writing once the stream is closed.
          await new Promise((r) => setTimeout(r, 1000));
          EmbeddedLemonadeLLM.#cleanRepoDir(repoDir, !repoExisted);
          throw e;
        }
        lastError = e;
        EmbeddedLemonadeLLM.slog(
          `Pull of ${definition.model_name} from ${registry} failed: ${e.message}`
        );
      }
    }
    throw lastError ?? new Error("Model download failed.");
  }

  /**
   * The Hugging Face cache folder lemond downloads a model into: <models_dir>/models--<owner>--<repo>.
   * Every quantization of a repo shares this folder.
   * @param {{model_name: string, checkpoint?: string}} definition
   * @returns {Promise<string|null>}
   */
  static async #repoDirFor(definition) {
    let checkpoint = definition.checkpoint;
    if (!checkpoint) {
      const info = await fetch(
        `${EmbeddedLemonadeLLM.openaiBasePath()}/models/${encodeURIComponent(definition.model_name)}`
      )
        .then((res) => (res.ok ? res.json() : {}))
        .catch(() => ({}));
      checkpoint = info?.checkpoint ?? info?.checkpoints?.main ?? null;
    }
    const repo = checkpoint?.split(":")[0];
    if (!repo || !repo.includes("/")) return null;
    return path.join(paths().models, `models--${repo.split("/").join("--")}`);
  }

  /**
   * Cleans a model's repo folder after a cancelled download or an uninstall.
   * @param {string|null} repoDir
   * @param {boolean} removeAll - remove the whole folder. Otherwise only in-progress files are removed, since the
   * folder holds other downloaded quantizations of the same repo.
   */
  static #cleanRepoDir(repoDir, removeAll) {
    if (!repoDir || !fs.existsSync(repoDir)) return;
    try {
      if (removeAll) {
        fs.rmSync(repoDir, { recursive: true, force: true });
      } else {
        const inProgress = (file) =>
          file.endsWith(".partial") || file === ".download_manifest.json";
        const sweep = (dir) => {
          for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) sweep(full);
            else if (inProgress(entry.name)) fs.rmSync(full, { force: true });
          }
        };
        sweep(repoDir);
      }
      EmbeddedLemonadeLLM.slog(
        `Cleaned ${removeAll ? "" : "in-progress files in "}${repoDir}`
      );
    } catch (e) {
      EmbeddedLemonadeLLM.slog(`Could not clean ${repoDir}: ${e.message}`);
    }
  }

  /**
   * The /pull body for a model id on a registry.
   * - A registry model lemond's catalog does not have is pulled from its checkpoint with what the registry knows.
   * - A lemond id (catalog or already registered) is pulled as-is.
   * - A checkpoint (eg: unsloth/Qwen3-4B-GGUF:Q4_K_M) is resolved through lemond's pull/variants so it is registered
   *   with a real quant, its vision projector (mmproj) and its labels.
   * @param {string} modelId
   * @param {string} registry
   * @returns {Promise<{model_name: string, checkpoint?: string, recipe?: string, mmproj?: string, labels?: string[]}>}
   */
  static async #definitionFor(modelId, registry) {
    const registryModel = REGISTRY_BY_ID.get(modelId);
    if (registryModel?.checkpoint)
      return {
        model_name: `user.${registryModel.id}`,
        checkpoint: registryModel.checkpoint,
        recipe: registryModel.recipe,
        ...(registryModel.mmproj ? { mmproj: registryModel.mmproj } : {}),
        labels: registryModel.labels ?? ["chat"],
      };
    if (!modelId.includes("/")) return { model_name: modelId };

    const [repo, requestedQuant = null] = modelId.split(":");
    const url = new URL(
      `${EmbeddedLemonadeLLM.openaiBasePath()}/pull/variants`
    );
    url.searchParams.set("checkpoint", repo);
    url.searchParams.set("source", registry);
    const response = await fetch(url.toString());
    const info = await response.json().catch(() => ({}));
    if (!response.ok)
      throw new Error(info?.error || `Could not find ${repo} on ${registry}.`);
    if (info.recipe && info.recipe !== "llamacpp")
      throw new Error(`${repo} is not a GGUF model that AnythingLLM can run.`);

    const variants = (info.variants ?? []).map((v) => v.name);
    const quant =
      variants.find((v) => v.toLowerCase() === requestedQuant?.toLowerCase()) ??
      variants.find((v) => v === "Q4_K_M") ??
      variants[0] ??
      requestedQuant;
    if (requestedQuant && quant?.toLowerCase() !== requestedQuant.toLowerCase())
      throw new Error(`${repo} has no ${requestedQuant} variant.`);

    const mmprojFiles = info.mmproj_files ?? [];
    const mmproj =
      mmprojFiles.find((f) => /(?<!b)f16/i.test(f)) ?? mmprojFiles[0] ?? null;
    const checkpoint = quant ? `${repo}:${quant}` : repo;
    return {
      model_name: `user.${modelIdForCheckpoint(checkpoint)}`,
      checkpoint,
      recipe: "llamacpp",
      ...(mmproj ? { mmproj } : {}),
      labels: info.suggested_labels ?? ["chat"],
    };
  }

  /**
   * One streamed /pull against a single registry. Rejects on any error event so the caller can try the next one.
   * Aborting `signal` closes the stream, which makes lemond cancel the download.
   */
  static async #pullFrom(registry, definition, { onProgress, signal }) {
    EmbeddedLemonadeLLM.slog(
      `Pulling ${definition.model_name} from ${registry}...`
    );
    const response = await fetch(
      `${EmbeddedLemonadeLLM.openaiBasePath()}/pull`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal,
        body: JSON.stringify({
          ...definition,
          registry_source: registry,
          stream: true,
        }),
      }
    );
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(
        body?.error?.message || body?.error || response.statusText
      );
    }

    const { decodeHtmlEntities, safeJsonParse } = require("../../http");
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let currentEvent = null;
    let completed = false;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        if (line.startsWith("event:")) {
          currentEvent = line.replace("event:", "").trim();
          continue;
        }
        if (!line.startsWith("data:")) continue;
        const data = safeJsonParse(
          decodeHtmlEntities(line.replace("data:", "").trim())
        );
        if (!data) continue;

        if (currentEvent === "error")
          throw new Error(data.error || data.message || "Download failed.");
        if (currentEvent === "complete") completed = true;
        if (currentEvent === "progress")
          onProgress?.(
            Math.round(data.percent ?? 0),
            data.file ? `Downloading ${data.file}` : "Downloading model..."
          );
        currentEvent = null;
      }
    }
    if (!completed) throw new Error("The download ended before completing.");
  }

  /**
   * Removes a downloaded model's files from lemond.
   * @param {string} modelId
   * @returns {Promise<boolean>}
   */
  static async deleteModel(modelId) {
    if (!modelId) return true;
    if (!(await EmbeddedLemonadeLLM.bootOrContinue())) return false;
    const repoDir = await EmbeddedLemonadeLLM.#repoDirFor({
      model_name: modelId,
    });
    await EmbeddedLemonadeLLM.#lemondDelete(modelId);

    // lemond removes a downloaded model's files, but not a partial download. Remove what is left unless another
    // downloaded model (eg: another quantization of the same repo) still uses the folder.
    const stillUsed = await EmbeddedLemonadeLLM.#downloadedRepoDirs();
    EmbeddedLemonadeLLM.#cleanRepoDir(repoDir, !stillUsed.has(repoDir));
    return true;
  }

  /** Deletes a model's files and registration in lemond. */
  static async #lemondDelete(modelId) {
    const response = await fetch(
      `${EmbeddedLemonadeLLM.openaiBasePath()}/delete`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model_name: String(modelId) }),
      }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.status === "error")
      throw new Error(
        data?.error?.message || data?.message || data?.error || "Delete failed."
      );
  }

  /** The repo folders of every downloaded model. */
  static async #downloadedRepoDirs() {
    const models = await fetch(
      `${EmbeddedLemonadeLLM.openaiBasePath()}/models?show_all=true`
    )
      .then((res) => res.json())
      .then(({ data = [] }) => data.filter((model) => model.downloaded))
      .catch(() => []);
    const dirs = await Promise.all(
      models.map((model) =>
        EmbeddedLemonadeLLM.#repoDirFor({
          model_name: model.id,
          checkpoint: model.checkpoint,
        })
      )
    );
    return new Set(dirs.filter(Boolean));
  }

  // Simple wrapper for dynamic embedder & normalize interface for all LLM implementations
  async embedTextInput(textInput) {
    return await this.embedder.embedTextInput(textInput);
  }
  async embedChunks(textChunks = []) {
    return await this.embedder.embedChunks(textChunks);
  }

  async compressMessages(promptArgs = {}, rawHistory = []) {
    await this.assertModelContextLimits();
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }
}

/**
 * The lemond id a Hugging Face style checkpoint is registered under. It is registered as `user.<id>` but lemond
 * lists, loads and deletes it by the plain id.
 * eg: "unsloth/Qwen3-4B-GGUF:Q4_K_M" -> "Qwen3-4B-GGUF-Q4_K_M"
 * @param {string} checkpoint
 * @returns {string}
 */
function modelIdForCheckpoint(checkpoint = "") {
  const [repo, quant = null] = checkpoint.split(":");
  const name = repo.split("/").pop();
  return `${name}${quant ? `-${quant}` : ""}`;
}

/**
 * Chat models for the custom models endpoint.
 * Without the catalog only downloaded models are listed, and without the `downloaded` flag - the workspace, agent,
 * chat and router model pickers would otherwise list each model twice (as "Downloaded" and as "Discovered").
 * @param {boolean} includeCatalog - Also list the models that are not downloaded yet (for the model table).
 */
async function getEmbeddedLemonadeModels(includeCatalog = false) {
  const models = await EmbeddedLemonadeLLM.availableModels();
  if (includeCatalog) return { models, error: null };
  return {
    models: models
      .filter((model) => model.downloaded)
      .map(({ downloaded: _, ...model }) => model),
    error: null,
  };
}

module.exports = {
  EmbeddedLemonadeLLM,
  getEmbeddedLemonadeModels,
};
