const { parseBaseRTBasePath } = require("../../AiProviders/baseRT");
const {
  maximumChunkLength,
  reportEmbeddingProgress,
} = require("../../helpers");

class BaseRTEmbedder {
  constructor() {
    if (!process.env.EMBEDDING_BASE_PATH)
      throw new Error("No embedding base path was set.");
    if (!process.env.EMBEDDING_MODEL_PREF)
      throw new Error("No embedding model was set.");

    this.className = "BaseRTEmbedder";
    const { OpenAI: OpenAIApi } = require("openai");
    this.basert = new OpenAIApi({
      baseURL: parseBaseRTBasePath(process.env.EMBEDDING_BASE_PATH),
      apiKey: process.env.BASERT_LLM_API_KEY || null,
    });
    this.model = process.env.EMBEDDING_MODEL_PREF;

    // Limit of how many strings we can process in a single pass to stay with resource or network limits
    this.maxConcurrentChunks = 1;
    this.embeddingMaxChunkLength = maximumChunkLength();
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  async #isAlive() {
    return await this.basert.models
      .list()
      .then((res) => res?.data?.length > 0)
      .catch((e) => {
        this.log(e.message);
        return false;
      });
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks(
      Array.isArray(textInput) ? textInput : [textInput]
    );
    return result?.[0] || [];
  }

  async embedChunks(textChunks = []) {
    if (!(await this.#isAlive()))
      throw new Error(
        `BaseRT service could not be reached. Is the BaseRT server running?`
      );

    this.log(
      `Embedding ${textChunks.length} chunks of text with ${this.model}.`
    );

    let results = [];
    let hasError = false;
    for (const [idx, chunk] of textChunks.entries()) {
      if (hasError) break;
      results.push(
        await this.basert.embeddings
          .create({
            model: this.model,
            input: chunk,
            // BaseRT only supports float encoding - the SDK defaults to base64.
            encoding_format: "float",
          })
          .then((result) => {
            const embedding = result.data?.[0]?.embedding;
            if (!Array.isArray(embedding) || !embedding.length)
              throw {
                type: "EMPTY_ARR",
                message: "The embedding was empty from BaseRT",
              };
            reportEmbeddingProgress(idx + 1, textChunks.length);
            return { data: embedding, error: null };
          })
          .catch((e) => {
            e.type =
              e?.response?.data?.error?.code ||
              e?.response?.status ||
              "failed_to_embed";
            e.message = e?.response?.data?.error?.message || e.message;
            hasError = true;
            return { data: [], error: e };
          })
      );
    }

    // Accumulate errors from embedding.
    // If any are present throw an abort error.
    const errors = results
      .filter((res) => !!res.error)
      .map((res) => res.error)
      .flat();

    if (errors.length > 0) {
      let uniqueErrors = new Set();
      console.log(errors);
      errors.map((error) =>
        uniqueErrors.add(`[${error.type}]: ${error.message}`)
      );

      if (errors.length > 0)
        throw new Error(
          `BaseRT Failed to embed: ${Array.from(uniqueErrors).join(", ")}`
        );
    }

    const data = results.map((res) => res?.data || []);
    return data.length > 0 ? data : null;
  }
}

module.exports = {
  BaseRTEmbedder,
};
