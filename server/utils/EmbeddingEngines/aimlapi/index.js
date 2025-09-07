const { toChunks, maximumChunkLength } = require("../../helpers");
const {
  AimlApiLLM,
  fetchAimlApiEmbeddingModels,
} = require("../../AiProviders/aimlapi");
const fs = require("fs");
const path = require("path");
const { safeJsonParse } = require("../../http");

const cacheFolder = path.resolve(
  process.env.STORAGE_DIR
    ? path.resolve(process.env.STORAGE_DIR, "models", "aimlapi", "embeddings")
    : path.resolve(__dirname, `../../../storage/models/aimlapi/embeddings`)
);

class AimlApiEmbedder {
  constructor() {
    if (!process.env.AIML_EMBEDDER_API_KEY)
      throw new Error("No AI/ML API key was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    this.openai = new OpenAIApi({
      apiKey: process.env.AIML_EMBEDDER_API_KEY,
      baseURL: AimlApiLLM.BASE_URL,
      defaultHeaders: AimlApiLLM.HEADERS,
    });
    this.model = process.env.EMBEDDING_MODEL_PREF || "text-embedding-ada-002";
    if (!fs.existsSync(cacheFolder))
      fs.mkdirSync(cacheFolder, { recursive: true });
    this.cacheModelPath = path.resolve(cacheFolder, "models.json");
    this.cacheAtPath = path.resolve(cacheFolder, ".cached_at");
    this.maxConcurrentChunks = 500;
    this.embeddingMaxChunkLength = maximumChunkLength();
    this.log(`Initialized ${this.model}`);
    this.#syncModels().catch((e) =>
      this.log(`Failed to sync models: ${e.message}`)
    );
  }

  log(text, ...args) {
    console.log(`\x1b[36m[AimlApiEmbedder]\x1b[0m ${text}`, ...args);
  }

  #cacheIsStale() {
    const MAX_STALE = 6.048e8; // 1 Week in MS
    if (!fs.existsSync(this.cacheAtPath)) return true;
    const now = Number(new Date());
    const timestampMs = Number(fs.readFileSync(this.cacheAtPath));
    return now - timestampMs > MAX_STALE;
  }

  async #syncModels() {
    if (fs.existsSync(this.cacheModelPath) && !this.#cacheIsStale())
      return false;
    this.log("Model cache is not present or stale. Fetching from AimlApi API.");
    await fetchAimlApiEmbeddingModels();
    return;
  }

  models() {
    if (!fs.existsSync(this.cacheModelPath)) return {};
    return safeJsonParse(
      fs.readFileSync(this.cacheModelPath, { encoding: "utf-8" }),
      {}
    );
  }

  async isValidEmbeddingModel(modelName = "") {
    await this.#syncModels();
    const availableModels = this.models();
    return Object.prototype.hasOwnProperty.call(availableModels, modelName);
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks(
      Array.isArray(textInput) ? textInput : [textInput]
    );
    return result?.[0] || [];
  }

  async embedChunks(textChunks = []) {
    this.log(`Embedding ${textChunks.length} chunks...`);
    const embeddingRequests = [];
    for (const chunk of toChunks(textChunks, this.maxConcurrentChunks)) {
      embeddingRequests.push(
        new Promise((resolve) => {
          this.openai.embeddings
            .create({ model: this.model, input: chunk })
            .then((result) => resolve({ data: result?.data, error: null }))
            .catch((e) => {
              e.type =
                e?.response?.data?.error?.code ||
                e?.response?.status ||
                "failed_to_embed";
              e.message = e?.response?.data?.error?.message || e.message;
              resolve({ data: [], error: e });
            });
        })
      );
    }

    const { data = [], error = null } = await Promise.all(
      embeddingRequests
    ).then((results) => {
      const errors = results
        .filter((res) => !!res.error)
        .map((res) => res.error);
      if (errors.length > 0) {
        const unique = new Set();
        errors.forEach((err) => unique.add(`[${err.type}]: ${err.message}`));
        return { data: [], error: Array.from(unique).join(", ") };
      }
      return { data: results.map((r) => r.data || []).flat(), error: null };
    });

    if (error) throw new Error(`AimlApi Failed to embed: ${error}`);
    return data.length > 0 && data.every((d) => d.hasOwnProperty("embedding"))
      ? data.map((d) => d.embedding)
      : null;
  }
}

module.exports = { AimlApiEmbedder };
