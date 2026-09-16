const {
  toChunks,
  maximumChunkLength,
  reportEmbeddingProgress,
} = require("../../helpers");

class MistralEmbedder {
  constructor() {
    if (!process.env.MISTRAL_API_KEY)
      throw new Error("No Mistral API key was set.");

    const { OpenAI: OpenAIApi } = require("openai");
    this.className = "MistralEmbedder";
    this.openai = new OpenAIApi({
      baseURL: "https://api.mistral.ai/v1",
      apiKey: process.env.MISTRAL_API_KEY ?? null,
      fetch: MistralEmbedder.applyMistralFetch(),
    });
    this.model = process.env.EMBEDDING_MODEL_PREF || "mistral-embed";

    // Mistral rejects a batch whose total token count is too large with
    // 400 {"code":"3210","message":"Too many tokens overall, split into more batches."}.
    // With 1000-char chunks, 200 inputs succeed and 300 fail, so 100 leaves headroom.
    this.maxConcurrentChunks = 100;
    this.embeddingMaxChunkLength = maximumChunkLength();
    this.log(`Initialized ${this.model}`, {
      maxConcurrentChunks: this.maxConcurrentChunks,
      embeddingMaxChunkLength: this.embeddingMaxChunkLength,
    });
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  /**
   * Mistral returns error bodies at the top level ({ message, code, type })
   * while the OpenAI SDK only reads `body.error`, so without this the SDK
   * reports "400 status code (no body)". Re-wrap the body so the real
   * message and code survive to the catch handler.
   */
  static applyMistralFetch() {
    return async (url, init) => {
      const response = await fetch(url, init);
      if (response.ok) return response;

      const body = await response
        .clone()
        .json()
        .catch(() => null);
      if (!body || body.error) return response;
      return new Response(JSON.stringify({ error: body }), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    };
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
    let chunksProcessed = 0;
    for (const chunk of toChunks(textChunks, this.maxConcurrentChunks)) {
      embeddingRequests.push(
        new Promise((resolve) => {
          this.openai.embeddings
            .create({
              model: this.model,
              input: chunk,
              encoding_format: "float",
            })
            .then((result) => {
              chunksProcessed += chunk.length;
              reportEmbeddingProgress(chunksProcessed, textChunks.length);
              resolve({ data: result?.data, error: null });
            })
            .catch((e) => {
              chunksProcessed += chunk.length;
              reportEmbeddingProgress(chunksProcessed, textChunks.length);
              e.type = e?.error?.code || e?.status || "failed_to_embed";
              e.message = e?.error?.message || e.message;
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

    if (!!error) throw new Error(`Mistral Failed to embed: ${error}`);

    // Throw rather than return null so a document is never silently embedded with empty vectors (#5513).
    const embeddings = data.map((emb) => emb.embedding);
    if (embeddings.length === 0)
      throw new Error("Mistral returned empty embeddings for batch");
    return embeddings;
  }
}

module.exports = {
  MistralEmbedder,
};
