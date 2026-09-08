const fs = require("fs");
const path = require("path");
const { safeJsonParse } = require("../../http");

const cacheFolder = path.resolve(
  process.env.STORAGE_DIR
    ? path.resolve(process.env.STORAGE_DIR, "models", "foundry")
    : path.resolve(__dirname, `../../../storage/models/foundry`)
);

/**
 * The Foundry Local model catalog, read from the Azure AI registry.
 *
 * Foundry Local 0.10 removed the daemon's `/foundry/list` route, so a
 * containerized install has no way to see anything it has not already
 * downloaded — the full catalog now only exists in the host CLI, which we
 * cannot invoke. This reads the same registry the CLI does so the model picker
 * can still show what is available.
 *
 * Caveats worth knowing before relying on this:
 *  - The endpoint is undocumented and gated only on a User-Agent, so treat it
 *    as best-effort. Every failure path degrades to "no catalog" rather than
 *    breaking model listing.
 *  - It describes what *exists*, not what this machine can run or install.
 *    Downloads still have to happen host-side on 0.10+.
 *
 * @see https://github.com/microsoft/foundry-local/issues/245
 */
class FoundryCatalog {
  static CATALOG_URL =
    "https://ai.azure.com/api/eastus/ux/v1.0/entities/crossRegion";

  /** 1 week in ms — the catalog changes on release cadence, not hourly. */
  static MAX_STALE = 6.048e8;

  static PAGE_SIZE = 100;

  /** Safety valve so a misbehaving continuationToken cannot loop forever. */
  static MAX_PAGES = 20;

  static REQUEST_TIMEOUT_MS = 30_000;

  /** Execution providers Foundry Local ships. Spelling varies by row, so send both. */
  static EXECUTION_PROVIDERS = [
    "CPUExecutionProvider",
    "QNNExecutionProvider",
    "CUDAExecutionProvider",
    "WebGpuExecutionProvider",
    "WebGPUExecutionProvider",
  ];

  /** Only tasks that can back a chat provider. */
  static CHAT_TASKS = ["chat-completion", "vision-language-chat"];

  /**
   * Friendly runtime names for the acceleration backend a variant is built for.
   * `device` alone only says CPU/GPU/NPU — this says *which* GPU or NPU stack,
   * which is what actually determines whether a machine can run the variant.
   */
  static RUNTIME_LABELS = {
    CPUExecutionProvider: "CPU",
    CUDAExecutionProvider: "CUDA",
    WebGpuExecutionProvider: "WebGPU",
    WebGPUExecutionProvider: "WebGPU",
    QNNExecutionProvider: "QNN",
    NvTensorRTRTXExecutionProvider: "TensorRT",
    OpenVINOExecutionProvider: "OpenVINO",
    VitisAIExecutionProvider: "VitisAI",
    DmlExecutionProvider: "DirectML",
  };

  /**
   * @param {string|null} executionProvider
   * @param {string} deviceType
   * @returns {string}
   */
  static #runtimeLabel(executionProvider, deviceType) {
    if (!executionProvider) return deviceType;
    return (
      this.RUNTIME_LABELS[executionProvider] ??
      // Unknown providers still read better with the suffix trimmed off.
      executionProvider.replace(/ExecutionProvider$/, "")
    );
  }

  static get cacheModelPath() {
    return path.resolve(cacheFolder, "models.json");
  }

  static get cacheAtPath() {
    return path.resolve(cacheFolder, ".cached_at");
  }

  static #log(text, ...args) {
    console.log(`\x1b[36m[FoundryCatalog]\x1b[0m ${text}`, ...args);
  }

  /**
   * True when there is no cache timestamp or it is older than MAX_STALE.
   * @returns {boolean}
   */
  static #cacheIsStale() {
    if (!fs.existsSync(this.cacheAtPath)) return true;
    const timestampMs = Number(fs.readFileSync(this.cacheAtPath));
    if (!Number.isFinite(timestampMs)) return true;
    return Number(new Date()) - timestampMs > this.MAX_STALE;
  }

  /**
   * Read whatever is on disk, regardless of age.
   * @returns {CatalogModel[]|null}
   */
  static #readCache() {
    if (!fs.existsSync(this.cacheModelPath)) return null;
    const cached = safeJsonParse(
      fs.readFileSync(this.cacheModelPath, { encoding: "utf-8" }),
      null
    );
    return Array.isArray(cached) ? cached : null;
  }

  /**
   * @param {CatalogModel[]} models
   */
  static #writeCache(models) {
    try {
      if (!fs.existsSync(cacheFolder))
        fs.mkdirSync(cacheFolder, { recursive: true });
      fs.writeFileSync(this.cacheModelPath, JSON.stringify(models), {
        encoding: "utf-8",
      });
      fs.writeFileSync(this.cacheAtPath, String(Number(new Date())), {
        encoding: "utf-8",
      });
    } catch (e) {
      // A read-only or full disk should not take model listing down with it.
      this.#log(`Could not write catalog cache: ${e.message}`);
    }
  }

  /**
   * @param {string|null} continuationToken
   * @returns {Promise<{value: object[], continuationToken: string|null}>}
   */
  static async #fetchPage(continuationToken = null) {
    const response = await fetch(this.CATALOG_URL, {
      method: "POST",
      headers: {
        // The registry gates this response on the User-Agent, not on auth.
        "User-Agent": "AzureAiStudio",
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(this.REQUEST_TIMEOUT_MS),
      body: JSON.stringify({
        resourceIds: [
          { resourceId: "azureml", entityContainerType: "Registry" },
        ],
        indexEntitiesRequest: {
          filters: [
            { field: "type", operator: "eq", values: ["models"] },
            { field: "kind", operator: "eq", values: ["Versioned"] },
            { field: "labels", operator: "eq", values: ["latest"] },
            {
              field: "properties/variantInfo/variantMetadata/executionProvider",
              operator: "eq",
              values: this.EXECUTION_PROVIDERS,
            },
          ],
          pageSize: this.PAGE_SIZE,
          skip: null,
          continuationToken,
        },
      }),
    });

    if (!response.ok)
      throw new Error(`Catalog request failed with status ${response.status}`);
    const body = await response.json();
    const page = body?.indexEntitiesResponse ?? {};
    return {
      value: Array.isArray(page.value) ? page.value : [],
      continuationToken: page.continuationToken ?? null,
    };
  }

  /**
   * @typedef {Object} CatalogVariant
   * @property {string} name - Matches the id the daemon reports, eg `qwen3-0.6b-generic-gpu`.
   * @property {'CPU'|'GPU'|'NPU'} deviceType
   * @property {string|null} executionProvider
   * @property {number} sizeMb
   *
   * @typedef {Object} CatalogModel
   * @property {string} alias
   * @property {string} task
   * @property {number|null} contextLength
   * @property {boolean} toolCalling
   * @property {boolean} reasoning
   * @property {boolean} vision
   * @property {string|null} license
   * @property {CatalogVariant[]} variants
   */

  /**
   * Collapse raw registry rows (one per device variant) into one entry per
   * alias, which is how Foundry itself presents models.
   * @param {object[]} entities
   * @returns {CatalogModel[]}
   */
  static #normalize(entities = []) {
    const byAlias = new Map();

    for (const entity of entities) {
      const tags = entity?.annotations?.tags ?? {};
      const alias = tags.alias;
      if (!alias) continue;
      if (!this.CHAT_TASKS.includes(String(tags.task))) continue;

      const metadata = entity?.properties?.variantInfo?.variantMetadata ?? {};

      // `azureml://…/models/<name>/versions/<n>` — <name> is what the daemon reports.
      const assetId = String(entity.assetId ?? "");
      const name = assetId.split("/models/")[1]?.split("/versions/")[0] ?? null;
      if (!name) continue;

      const deviceType = String(metadata.device ?? "CPU").toUpperCase();
      const variant = {
        name,
        deviceType,
        executionProvider: metadata.executionProvider ?? null,
        runtime: this.#runtimeLabel(metadata.executionProvider, deviceType),
        sizeMb: Math.round(Number(metadata.fileSizeBytes ?? 0) / 1e6),
      };

      const existing = byAlias.get(alias);
      if (existing) {
        existing.variants.push(variant);
        continue;
      }

      byAlias.set(alias, {
        alias,
        task: String(tags.task),
        contextLength: Number(tags.contextLength) || null,
        toolCalling: String(tags.supportsToolCalling).toLowerCase() === "true",
        reasoning: String(tags.supportsReasoning).toLowerCase() === "true",
        // Foundry flags vision through the task and input modalities rather
        // than a dedicated capability.
        vision:
          String(tags.task) === "vision-language-chat" ||
          String(tags.inputModalities).toLowerCase().includes("image"),
        license: tags.license ?? null,
        variants: [variant],
      });
    }

    return Array.from(byAlias.values());
  }

  /**
   * Fetch every page and refresh the on-disk cache.
   * @returns {Promise<CatalogModel[]>}
   */
  static async #fetchAll() {
    const entities = [];
    let continuationToken = null;

    for (let page = 0; page < this.MAX_PAGES; page++) {
      const result = await this.#fetchPage(continuationToken);
      entities.push(...result.value);
      continuationToken = result.continuationToken;
      if (!continuationToken) break;
    }

    const models = this.#normalize(entities);
    if (models.length) this.#writeCache(models);
    return models;
  }

  /**
   * The catalog, served from cache unless it is missing or older than a week.
   * Never throws — an unreachable registry yields the stale cache if there is
   * one, otherwise an empty list, and the caller falls back to listing only
   * what the daemon already has.
   * @returns {Promise<CatalogModel[]>}
   */
  static async models() {
    const cached = this.#readCache();
    if (cached && !this.#cacheIsStale()) return cached;

    try {
      this.#log("Catalog cache is missing or stale. Fetching from registry.");
      const models = await this.#fetchAll();
      this.#log(`Cached ${models.length} catalog models.`);
      return models;
    } catch (e) {
      this.#log(`Could not fetch catalog: ${e.message}`);
      // Stale beats empty — the catalog moves on release cadence.
      return cached ?? [];
    }
  }
}

module.exports = FoundryCatalog;
