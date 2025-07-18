const { toChunks, maximumChunkLength } = require("../../helpers");

class JinaEmbedder {
  constructor() {
    this.basePath = "https://api.jina.ai/v1";
    this.apiKey = process.env.JINA_API_KEY ?? null;
    this.model = process.env.EMBEDDING_MODEL_PREF ?? "jina-embeddings-v3";
    this.task = process.env.JINA_TASK ?? null;
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
    console.log(`\x1b[36m[JinaEmbedder]\x1b[0m ${text}`, ...args);
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

  async embedTextInput(textInput) {
    const result = await this.embedChunks(
      Array.isArray(textInput) ? textInput : [textInput]
    );
    return result?.[0] || [];
  }

  async embedChunks(textChunks = []) {
    // Because there is a hard POST limit on how many chunks can be sent at once to OpenAI (~8mb)
    // we concurrently execute each max batch of text chunks possible.
    // Refer to constructor maxConcurrentChunks for more info.
    const embeddingRequests = [];
    for (const chunk of toChunks(textChunks, this.maxConcurrentChunks)) {
      embeddingRequests.push(
        new Promise((resolve) => {
          (async () => {
            // We are using a fetch request here because the current openai library
            // does not support the Jina API
            try {
              const response = await fetch(`${this.basePath}/embeddings`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                  model: this.model,
                  input: chunk,
                  ...(this.task ? { task: this.task } : {}),
                }),
              });

              if (!response.ok) {
                const error = await response.json();
                throw {
                  type: error?.error?.code || response.status,
                  message: error?.error?.message || response.statusText,
                };
              }

              const result = await response.json();
              resolve({ data: result?.data, error: null });
            } catch (e) {
              resolve({
                data: [],
                error: {
                  type: e?.type || "failed_to_embed",
                  message: e?.message || "Failed to embed text",
                },
              });
            }
          })();
        })
      );
    }

    const { data = [], error = null } = await Promise.all(
      embeddingRequests
    ).then((results) => {
      // If any errors were returned from OpenAI abort the entire sequence because the embeddings
      // will be incomplete.
      const errors = results
        .filter((res) => !!res.error)
        .map((res) => res.error)
        .flat();
      if (errors.length > 0) {
        let uniqueErrors = new Set();
        errors.map((error) =>
          uniqueErrors.add(`[${error.type}]: ${error.message}`)
        );

        return {
          data: [],
          error: Array.from(uniqueErrors).join(", "),
        };
      }
      return {
        data: results.map((res) => res?.data || []).flat(),
        error: null,
      };
    });

    if (!!error) throw new Error(`Jina Failed to embed: ${error}`);
    return data.length > 0 &&
      data.every((embd) =>
        Object.prototype.hasOwnProperty.call(embd, "embedding")
      )
      ? data.map((embd) => embd.embedding)
      : null;
  }
}

module.exports = {
  JinaEmbedder,
};
