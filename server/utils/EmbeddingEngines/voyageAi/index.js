const { toChunks, reportEmbeddingProgress } = require("../../helpers");

class VoyageAiEmbedder {
  static baseURL = "https://api.voyageai.com/v1/embeddings";

  constructor() {
    if (!process.env.VOYAGEAI_API_KEY)
      throw new Error("No Voyage AI API key was set.");

    this.className = "VoyageAiEmbedder";
    this.apiKey = process.env.VOYAGEAI_API_KEY;
    this.model = process.env.EMBEDDING_MODEL_PREF || "voyage-3-lite";
    // Embed in batches of 128 so progress can be reported as each one finishes.
    // https://docs.voyageai.com/docs/rate-limits#use-larger-batches
    this.maxConcurrentChunks = 128;
    this.embeddingMaxChunkLength = this.#getMaxEmbeddingLength();
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  // https://docs.voyageai.com/docs/embeddings
  #getMaxEmbeddingLength() {
    switch (this.model) {
      case "voyage-4-large":
      case "voyage-4":
      case "voyage-4-lite":
      case "voyage-code-4":
      case "voyage-finance-2":
      case "voyage-multilingual-2":
      case "voyage-3.5":
      case "voyage-3.5-lite":
      case "voyage-3":
      case "voyage-3-lite":
      case "voyage-3-large":
      case "voyage-code-3":
        return 32_000;
      case "voyage-large-2-instruct":
      case "voyage-law-2":
      case "voyage-code-2":
      case "voyage-large-2":
        return 16_000;
      case "voyage-2":
        return 4_000;
      default:
        return 4_000;
    }
  }

  /**
   * Embed a list of strings with the Voyage AI REST API.
   * Voyage prepends a different retrieval prompt for `query` and `document`
   * inputs, so stored chunks and search queries must say which one they are.
   * https://docs.voyageai.com/docs/embeddings#rest-api
   * @param {string[]} input
   * @param {"query"|"document"} inputType
   * @returns {Promise<number[][]>}
   */
  async #embed(input, inputType) {
    const response = await fetch(VoyageAiEmbedder.baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        input,
        model: this.model,
        input_type: inputType,
      }),
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) {
      const detail =
        body?.detail || body?.error?.message || response.statusText;
      throw new Error(`Voyage AI API error (${response.status}): ${detail}`);
    }
    if (!Array.isArray(body?.data))
      throw new Error("Voyage AI API returned no embeddings.");

    return body.data
      .sort((a, b) => a.index - b.index)
      .map((item) => item.embedding);
  }

  async embedTextInput(textInput) {
    const result = await this.#embed(
      Array.isArray(textInput) ? textInput : [textInput],
      "query"
    );

    // If given an array return the native Array[Array] format since that should be the outcome.
    // But if given a single string, we need to flatten it so that we have a 1D array.
    return (Array.isArray(textInput) ? result : result.flat()) || [];
  }

  async embedChunks(textChunks = []) {
    try {
      this.log(`Embedding ${textChunks.length} chunks...`);
      let chunksProcessed = 0;
      const batches = await Promise.all(
        toChunks(textChunks, this.maxConcurrentChunks).map(async (batch) => {
          const embeddings = await this.#embed(batch, "document");
          chunksProcessed += batch.length;
          reportEmbeddingProgress(chunksProcessed, textChunks.length);
          return embeddings;
        })
      );
      return batches.flat();
    } catch (error) {
      console.error("Voyage AI Failed to embed:", error);
      throw error;
    }
  }
}

module.exports = {
  VoyageAiEmbedder,
};
