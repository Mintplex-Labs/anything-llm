const { toChunks, reportEmbeddingProgress } = require("../../helpers");

class CohereEmbedder {
  constructor() {
    if (!process.env.COHERE_API_KEY)
      throw new Error("No Cohere API key was set.");
    this.className = "CohereEmbedder";

    // Cohere exposes an OpenAI-compatible API which lets us reuse the OpenAI SDK
    // across the app instead of the cohere-ai package. The compatibility endpoint
    // manages the embedding `input_type` internally so we do not set it ourselves.
    // https://docs.cohere.com/docs/compatibility-api
    const { OpenAI: OpenAIApi } = require("openai");
    this.openai = new OpenAIApi({
      baseURL: "https://api.cohere.ai/compatibility/v1",
      apiKey: process.env.COHERE_API_KEY,
    });

    this.model = process.env.EMBEDDING_MODEL_PREF || "embed-english-v3.0";

    // Limit of how many strings we can process in a single pass to stay with resource or network limits
    this.maxConcurrentChunks = 96; // Cohere's limit per request is 96
    this.embeddingMaxChunkLength = 1945; // https://docs.cohere.com/docs/embed-2 - assume a token is roughly 4 letters with some padding
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks(
      Array.isArray(textInput) ? textInput : [textInput]
    );
    return result?.[0] || [];
  }

  async embedChunks(textChunks = []) {
    const embeddingRequests = [];
    let chunksProcessed = 0;

    for (const chunk of toChunks(textChunks, this.maxConcurrentChunks)) {
      embeddingRequests.push(
        new Promise((resolve) => {
          this.openai.embeddings
            .create({
              model: this.model,
              input: chunk,
            })
            .then((result) => {
              chunksProcessed += chunk.length;
              reportEmbeddingProgress(chunksProcessed, textChunks.length);
              resolve({ data: result?.data, error: null });
            })
            .catch((e) => {
              chunksProcessed += chunk.length;
              reportEmbeddingProgress(chunksProcessed, textChunks.length);
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
        .map((res) => res.error)
        .flat();

      if (errors.length > 0) {
        let uniqueErrors = new Set();
        errors.map((error) =>
          uniqueErrors.add(`[${error.type}]: ${error.message}`)
        );
        return { data: [], error: Array.from(uniqueErrors).join(", ") };
      }

      return {
        data: results.map((res) => res?.data || []).flat(),
        error: null,
      };
    });

    if (!!error) throw new Error(`Cohere Failed to embed: ${error}`);

    return data.length > 0 &&
      data.every((embd) => embd.hasOwnProperty("embedding"))
      ? data.map((embd) => embd.embedding)
      : null;
  }
}

module.exports = {
  CohereEmbedder,
};
