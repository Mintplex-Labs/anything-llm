const {
  toChunks,
  maximumChunkLength,
  reportEmbeddingProgress,
} = require("../../helpers");

class GenericOpenAiEmbedder {
  constructor() {
    if (!process.env.EMBEDDING_BASE_PATH)
      throw new Error(
        "GenericOpenAI must have a valid base path to use for the api."
      );
    this.className = "GenericOpenAiEmbedder";
    const { OpenAI: OpenAIApi } = require("openai");
    this.basePath = process.env.EMBEDDING_BASE_PATH;
    this.openai = new OpenAIApi({
      baseURL: this.basePath,
      apiKey: process.env.GENERIC_OPEN_AI_EMBEDDING_API_KEY ?? null,
    });
    this.model = process.env.EMBEDDING_MODEL_PREF ?? null;
    this.embeddingMaxChunkLength = maximumChunkLength();

    // this.maxConcurrentChunks is delegated to the getter below.
    // Refer to your specific model and provider you use this class with to determine a valid maxChunkLength
    this.log(`Initialized ${this.model}`, {
      baseURL: this.basePath,
      maxConcurrentChunks: this.maxConcurrentChunks,
      embeddingMaxChunkLength: this.embeddingMaxChunkLength,
    });
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  /**
   * returns the `GENERIC_OPEN_AI_EMBEDDING_API_DELAY_MS` env variable as a number or null if the env variable is not set or is not a number.
   * The minimum delay is 500ms.
   *
   * For some implementation this is necessary to avoid 429 errors due to rate limiting or
   * hardware limitations where a single-threaded process is not able to handle the requests fast enough.
   * @returns {number}
   */
  get apiRequestDelay() {
    if (!("GENERIC_OPEN_AI_EMBEDDING_API_DELAY_MS" in process.env)) return null;
    if (isNaN(Number(process.env.GENERIC_OPEN_AI_EMBEDDING_API_DELAY_MS)))
      return null;
    const delayTimeout = Number(
      process.env.GENERIC_OPEN_AI_EMBEDDING_API_DELAY_MS
    );
    if (delayTimeout < 500) return 500; // minimum delay of 500ms
    return delayTimeout;
  }

  /**
   * runs the delay if it is set and valid.
   * @returns {Promise<void>}
   */
  async runDelay() {
    if (!this.apiRequestDelay) return;
    this.log(`Delaying new batch request for ${this.apiRequestDelay}ms`);
    await new Promise((resolve) => setTimeout(resolve, this.apiRequestDelay));
  }

  /**
   * returns the `GENERIC_OPEN_AI_EMBEDDING_MAX_CONCURRENT_CHUNKS` env variable as a number
   * or 500 if the env variable is not set or is not a number.
   * @returns {number}
   */
  get maxConcurrentChunks() {
    if (!process.env.GENERIC_OPEN_AI_EMBEDDING_MAX_CONCURRENT_CHUNKS)
      return 500;
    if (
      isNaN(Number(process.env.GENERIC_OPEN_AI_EMBEDDING_MAX_CONCURRENT_CHUNKS))
    )
      return 500;
    return Number(process.env.GENERIC_OPEN_AI_EMBEDDING_MAX_CONCURRENT_CHUNKS);
  }

  /**
   * Optional prefix prepended to each query before embedding. Empty by default
   * for backwards compatibility. Required by asymmetric models like
   * Qwen3-Embedding, which expect queries wrapped as
   * `Instruct: <task>\nQuery:<query>` while passages are sent raw.
   * @returns {string}
   */
  get queryPrefix() {
    return process.env.EMBEDDING_QUERY_PREFIX ?? "";
  }

  /**
   * Optional prefix prepended to each passage before embedding. Empty by
   * default. Most asymmetric models (Qwen3-Embedding included) leave passages
   * unwrapped, but some BGE/E5 variants expect a `passage: ` prefix.
   * @returns {string}
   */
  get passagePrefix() {
    return process.env.EMBEDDING_PASSAGE_PREFIX ?? "";
  }

  async embedTextInput(textInput) {
    const prefix = this.queryPrefix;
    const inputs = (Array.isArray(textInput) ? textInput : [textInput]).map(
      (t) => prefix + t
    );
    const result = await this.embedChunks(inputs, { isPassage: false });
    return result?.[0] || [];
  }

  async embedChunks(textChunks = [], { isPassage = true } = {}) {
    // Because there is a hard POST limit on how many chunks can be sent at once to OpenAI (~8mb)
    // we sequentially execute each max batch of text chunks possible.
    // Refer to constructor maxConcurrentChunks for more info.
    const prefix = isPassage ? this.passagePrefix : "";
    const inputs = prefix ? textChunks.map((t) => prefix + t) : textChunks;
    const allResults = [];
    for (const chunk of toChunks(inputs, this.maxConcurrentChunks)) {
      const { data = [], error = null } = await new Promise((resolve) => {
        this.openai.embeddings
          .create({
            model: this.model,
            input: chunk,
          })
          .then((result) => resolve({ data: result?.data, error: null }))
          .catch((e) => {
            e.type =
              e?.response?.data?.error?.code ||
              e?.response?.status ||
              "failed_to_embed";
            e.message = e?.response?.data?.error?.message || e.message;
            resolve({ data: [], error: e });
          });
      });

      // If any errors were returned from OpenAI abort the entire sequence because the embeddings
      // will be incomplete.
      if (error)
        throw new Error(`GenericOpenAI Failed to embed: ${error.message}`);
      allResults.push(...(data || []));
      reportEmbeddingProgress(allResults.length, textChunks.length);
      if (this.apiRequestDelay) await this.runDelay();
    }

    return allResults.length > 0 &&
      allResults.every((embd) => embd.hasOwnProperty("embedding"))
      ? allResults.map((embd) => embd.embedding)
      : null;
  }
}

module.exports = {
  GenericOpenAiEmbedder,
};
