const { parseFoundryBasePath } = require("./index.js");
const { safeJsonParse } = require("../../http");
const FoundryCatalog = require("./catalog.js");

/**
 * @typedef {'rest'|'openai'} FoundrySource
 *
 * @typedef {Object} FoundryUiModel
 * @property {string} id - What gets persisted as the model preference.
 * @property {string} name
 * @property {string} organization - Group heading in the model table.
 * @property {number|null} size - Size in MB (null when unknown).
 * @property {'CPU'|'GPU'|'NPU'|null} deviceType
 * @property {boolean} downloaded
 * @property {boolean} toolCalling
 * @property {string|null} variantId - Fully-qualified model name, when known.
 */

/**
 * Resolves Foundry models over HTTP only.
 *
 * AnythingLLM runs in a container here, so the `foundry` CLI — which lives on
 * the host — is not reachable. Everything must go through the daemon's REST
 * API, which comes in two flavors:
 *
 *  - `rest`   A pre-0.10 daemon that serves the management routes
 *             (/foundry/list, /openai/models, /openai/download). This is the
 *             only configuration where models can be browsed and installed
 *             from AnythingLLM.
 *  - `openai` A 0.10+ daemon, which dropped every management route and serves
 *             only the OpenAI-compatible /v1 surface. Lists only what is
 *             installed; management is a host-side action via the CLI.
 *
 * The Azure registry catalog (FoundryCatalog) is NOT used for listing — it
 * advertises every hardware variant including ones this machine cannot run
 * (e.g. QNN on macOS). It IS still consulted for metadata lookups: context
 * windows, tool-calling support, reasoning, and vision capabilities.
 */
class FoundryModels {
  /** Management probes and catalog reads should fail fast, not hang the UI. */
  static REQUEST_TIMEOUT_MS = 10_000;

  /** Loading reads a multi-GB model off disk, so it gets a much longer leash. */
  static LOAD_TIMEOUT_MS = 300_000;

  static UNMANAGEABLE_ERROR =
    "This Foundry service does not expose a model management API. Install models on the host with the Foundry Local CLI (`foundry model download <model>`), then refresh.";

  static #log(text, ...args) {
    console.log(`\x1b[36m[FoundryModels]\x1b[0m ${text}`, ...args);
  }

  /**
   * Normalize a base path to the daemon origin. Management routes live at the
   * root while chat completions live under /v1, so the base path cannot be
   * reused verbatim.
   * @param {string} basePath
   * @returns {string|null}
   */
  static #originOf(basePath = "") {
    try {
      return new URL(basePath).origin;
    } catch {
      return null;
    }
  }

  /**
   * @param {string} url
   * @param {RequestInit} options
   * @returns {Promise<Response>}
   */
  static #fetchWithTimeout(url, options = {}) {
    return fetch(url, {
      ...options,
      signal: AbortSignal.timeout(this.REQUEST_TIMEOUT_MS),
    });
  }

  /**
   * Map a /foundry/list catalog entry into the UI shape.
   * @param {object} model
   * @param {Set<string>} cachedNames
   * @returns {FoundryUiModel}
   */
  static #fromRestCatalog(model, cachedNames) {
    const alias = model.alias || model.name;
    const task = String(model.task ?? "");
    return {
      id: alias,
      name: alias,
      organization: task.toLowerCase().includes("chat")
        ? "Chat"
        : task || "Chat",
      size: Number(model.fileSizeMb ?? 0),
      deviceType: String(model.runtime?.deviceType ?? "CPU").toUpperCase(),
      downloaded: cachedNames.has(model.name),
      toolCalling: Boolean(model.supportsToolCalling),
      variantId: model.name ?? null,
    };
  }

  /**
   * The models currently held in memory, as fully-qualified variant ids.
   *
   * `/models/loaded` is one of three management routes that survived the 0.10
   * rewrite (with load and unload). None are in the published REST reference,
   * but they are what the 1.x SDK talks to when pointed at a remote service.
   * @param {string} basePath
   * @returns {Promise<string[]>}
   */
  static async loadedModels(basePath = process.env.FOUNDRY_BASE_PATH) {
    const origin = this.#originOf(basePath);
    if (!origin) return [];
    try {
      const response = await this.#fetchWithTimeout(`${origin}/models/loaded`);
      if (!response.ok) return [];
      const loaded = await response.json();
      return Array.isArray(loaded) ? loaded : [];
    } catch {
      return [];
    }
  }

  /**
   * Load a model into memory. Foundry 0.10 stopped auto-loading on inference,
   * so this has to happen before the first completion — otherwise a streaming
   * request is answered with headers and then the connection is dropped.
   * @param {string} modelId - Alias or fully-qualified variant id.
   * @param {string} basePath
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  static async loadModel(modelId, basePath = process.env.FOUNDRY_BASE_PATH) {
    const origin = this.#originOf(basePath);
    if (!origin || !modelId)
      return { success: false, error: "No Foundry service or model was set." };

    try {
      // Loading pulls a multi-GB model into memory, well past the probe timeout.
      const response = await fetch(
        `${origin}/models/load/${encodeURIComponent(modelId)}`,
        { signal: AbortSignal.timeout(this.LOAD_TIMEOUT_MS) }
      );
      if (!response.ok)
        throw new Error(
          `Foundry could not load ${modelId} (HTTP ${response.status}). Is the model downloaded?`
        );
      return { success: true, error: null };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Release a model from memory.
   * @param {string} modelId
   * @param {string} basePath
   * @returns {Promise<boolean>}
   */
  static async unloadModel(modelId, basePath = process.env.FOUNDRY_BASE_PATH) {
    const origin = this.#originOf(basePath);
    if (!origin || !modelId) return false;
    try {
      const response = await this.#fetchWithTimeout(
        `${origin}/models/unload/${encodeURIComponent(modelId)}`
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Infer the device class from a variant id's suffix.
   * Variant ids follow the pattern `<name>-<backend>-<device>`, e.g.
   * `qwen2.5-0.5b-instruct-cuda-gpu`, `Phi-4-mini-reasoning-generic-cpu`,
   * `qwen2.5-1.5b-instruct-qnn-npu`.
   * @param {string} modelId
   * @returns {'CPU'|'GPU'|'NPU'|null}
   */
  static #deviceTypeFromId(modelId = "") {
    const lower = modelId.toLowerCase();
    if (lower.endsWith("-cpu")) return "CPU";
    if (lower.endsWith("-gpu")) return "GPU";
    if (lower.endsWith("-npu")) return "NPU";
    return null;
  }

  /**
   * List models from a 0.10+ daemon, which only reports what it has installed.
   * Device type is parsed from the variant id suffix; size is enriched from the
   * Azure catalog cache when available.
   * @param {string} basePath
   * @returns {Promise<{models: FoundryUiModel[], source: FoundrySource, canManage: boolean}>}
   */
  static async #listFromOpenAiSurface(basePath) {
    try {
      const { OpenAI: OpenAIApi } = require("openai");
      const openai = new OpenAIApi({
        baseURL: parseFoundryBasePath(basePath),
        apiKey: null,
      });

      const catalogVariants = await this.#catalogVariantIndex();
      const models = await openai.models.list().then((result) =>
        result.data.map((model) => {
          const deviceType = this.#deviceTypeFromId(model.id);
          const catalogHit = catalogVariants.get(model.id.toLowerCase());
          return {
            id: model.id,
            name: model.id,
            organization: "Available Models",
            size: catalogHit?.sizeMb ?? null,
            deviceType,
            downloaded: true,
            toolCalling: false,
            variantId: model.id,
          };
        })
      );
      return { models, source: "openai", canManage: false };
    } catch (e) {
      this.#log(`Could not list models: ${e.message}`);
      return { models: [], source: "openai", canManage: false };
    }
  }

  /**
   * Build a case-insensitive index of catalog variant names → variant data.
   * Returns an empty map when the catalog is unavailable — never throws.
   * @returns {Promise<Map<string, import("./catalog.js").CatalogVariant>>}
   */
  static async #catalogVariantIndex() {
    try {
      const catalog = await FoundryCatalog.models();
      const index = new Map();
      for (const model of catalog) {
        for (const variant of model.variants) {
          index.set(variant.name.toLowerCase(), variant);
        }
      }
      return index;
    } catch {
      return new Map();
    }
  }

  /**
   * Determine which surface the configured daemon exposes.
   * @param {string} basePath
   * @returns {Promise<{source: FoundrySource, canManage: boolean}>}
   */
  static async resolveSource(basePath = process.env.FOUNDRY_BASE_PATH) {
    const origin = this.#originOf(basePath);
    if (!origin) return { source: "openai", canManage: false };

    try {
      const response = await this.#fetchWithTimeout(`${origin}/foundry/list`);
      if (response.ok) return { source: "rest", canManage: true };
    } catch {
      // Unreachable, or a 0.10+ daemon that no longer routes this path.
    }
    return { source: "openai", canManage: false };
  }

  /**
   * List models from whichever surface is available.
   * @param {string} basePath
   * @returns {Promise<{models: FoundryUiModel[], source: FoundrySource, canManage: boolean}>}
   */
  static async listModels(basePath = process.env.FOUNDRY_BASE_PATH) {
    const { source, canManage } = await this.resolveSource(basePath);
    const origin = this.#originOf(basePath);
    if (source !== "rest") return await this.#listFromOpenAiSurface(basePath);

    try {
      const [catalog, cached] = await Promise.all([
        this.#fetchWithTimeout(`${origin}/foundry/list`).then((res) =>
          res.json()
        ),
        this.#fetchWithTimeout(`${origin}/openai/models`)
          .then((res) => res.json())
          .catch(() => []),
      ]);

      const cachedNames = new Set(Array.isArray(cached) ? cached : []);
      const entries = Array.isArray(catalog) ? catalog : catalog?.models ?? [];

      // The catalog lists one entry per device variant. Collapse to one row per
      // alias, preferring a variant that is already downloaded so the table
      // reflects local state.
      const byAlias = entries
        .map((model) => this.#fromRestCatalog(model, cachedNames))
        .reduce((acc, model) => {
          const existing = acc.get(model.id);
          if (!existing || (model.downloaded && !existing.downloaded))
            acc.set(model.id, model);
          return acc;
        }, new Map());

      return { models: Array.from(byAlias.values()), source, canManage };
    } catch (e) {
      this.#log(
        `REST catalog lookup failed, falling back to /v1/models: ${e.message}`
      );
      return await this.#listFromOpenAiSurface(basePath);
    }
  }

  /**
   * Download a model into the daemon's local storage.
   * @param {string} modelId
   * @param {(percentage: number) => void} onProgress
   * @param {string} basePath
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  static async downloadModel(
    modelId,
    onProgress = () => {},
    basePath = process.env.FOUNDRY_BASE_PATH
  ) {
    const { source } = await this.resolveSource(basePath);
    if (source !== "rest")
      return { success: false, error: this.UNMANAGEABLE_ERROR };

    const origin = this.#originOf(basePath);
    try {
      const catalog = await this.#fetchWithTimeout(
        `${origin}/foundry/list`
      ).then((res) => res.json());
      const entries = Array.isArray(catalog) ? catalog : catalog?.models ?? [];
      const model = entries.find(
        (entry) => entry.alias === modelId || entry.name === modelId
      );
      if (!model)
        throw new Error(`Model ${modelId} was not found in the catalog`);

      // No timeout here — model downloads routinely run for many minutes.
      const response = await fetch(`${origin}/openai/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: {
            Uri: model.uri,
            Name: model.name,
            ProviderType: model.providerType,
            Publisher: model.publisher ?? "",
            PromptTemplate: model.promptTemplate ?? {},
          },
        }),
      });
      if (!response.ok)
        throw new Error(`Download failed with status ${response.status}`);

      // The daemon streams either `("file.onnx", 0.42)` tuples or `NN%` lines
      // depending on its version, then a trailing JSON result object.
      const reader = response.body.getReader();
      let tail = "";
      let lastPercentage = 0;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder("utf-8").decode(value);
        tail = (tail + chunk).slice(-4096);

        for (const line of chunk.split(/[\r\n]+/)) {
          if (!line.trim()) continue;
          const tuple = line.match(/\(\s*"[^"]*"\s*,\s*(\d*\.?\d+)\s*\)/);
          const percent = line.match(/(\d+(?:\.\d+)?)%/);

          let percentage = null;
          if (tuple) percentage = Math.round(Number(tuple[1]) * 100);
          else if (percent) percentage = Math.round(Number(percent[1]));
          if (percentage === null) continue;

          percentage = Math.min(Math.max(percentage, 0), 100);
          // Progress restarts per file in a multi-part model, so only advance.
          if (percentage > lastPercentage) {
            lastPercentage = percentage;
            onProgress(percentage);
          }
        }
      }

      // Failures are reported in the final JSON payload, not the status code.
      const finalJson = tail.match(/\{[\s\S]*\}\s*$/);
      const result = finalJson ? safeJsonParse(finalJson[0]) : null;
      if (result?.Success === false)
        throw new Error(result.ErrorMessage || "Model download failed");

      onProgress(100);
      return { success: true, error: null };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * The REST API has no delete route — removing a model is a host-side action.
   * @returns {Promise<{success: boolean, error: string}>}
   */
  static async deleteModel() {
    return {
      success: false,
      error:
        "Removing models is not supported over the Foundry REST API. Remove it on the host with `foundry cache remove <model>`.",
    };
  }

  /**
   * @typedef {'unknown'|boolean} Capability
   * @typedef {{tools: Capability, reasoning: Capability, imageGeneration: Capability, vision: Capability}} ModelCapabilities
   */

  /** Capabilities we could not determine at all. */
  static get UNKNOWN_CAPABILITIES() {
    return {
      tools: "unknown",
      reasoning: "unknown",
      imageGeneration: "unknown",
      vision: "unknown",
    };
  }

  /**
   * Find a model in the Azure registry catalog by alias or variant name.
   * @param {string} modelId
   * @returns {Promise<import("./catalog.js").CatalogModel|null>}
   */
  static async #catalogEntry(modelId) {
    const catalog = await FoundryCatalog.models();
    return (
      catalog.find(
        (model) =>
          model.alias === modelId ||
          model.variants.some((variant) => variant.name === modelId)
      ) ?? null
    );
  }

  /**
   * Report what a model can do.
   *
   * The registry catalog describes tool calling, reasoning and vision, so it is
   * the richest source and is consulted first. The daemon's own REST catalog
   * only advertises tool calling. Foundry Local has no image generation on any
   * surface, so that is a hard false rather than "unknown".
   * @param {string} modelId
   * @param {string} basePath
   * @returns {Promise<ModelCapabilities>}
   */
  static async getModelCapabilities(
    modelId,
    basePath = process.env.FOUNDRY_BASE_PATH
  ) {
    if (!modelId) return this.UNKNOWN_CAPABILITIES;
    try {
      const entry = await this.#catalogEntry(modelId);
      if (entry)
        return {
          tools: entry.toolCalling,
          reasoning: entry.reasoning,
          imageGeneration: false,
          vision: entry.vision,
        };

      const { models, source } = await this.listModels(basePath);
      if (source !== "rest") return this.UNKNOWN_CAPABILITIES;

      const match = models.find(
        (model) => model.id === modelId || model.variantId === modelId
      );
      if (!match) return this.UNKNOWN_CAPABILITIES;

      return {
        tools: Boolean(match.toolCalling),
        reasoning: "unknown",
        imageGeneration: false,
        vision: "unknown",
      };
    } catch (e) {
      this.#log(`Could not determine model capabilities: ${e.message}`);
      return this.UNKNOWN_CAPABILITIES;
    }
  }
}

module.exports = FoundryModels;
