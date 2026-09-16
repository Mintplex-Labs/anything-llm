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
    });
    this.model = process.env.EMBEDDING_MODEL_PREF || "mistral-embed";

    // Mistral serves an OpenAI-compatible embeddings endpoint through the same SDK, so the
    // request is capped the way the OpenAI and Generic OpenAI embedders cap theirs instead
    // of sending a whole document in one POST.
    this.maxConcurrentChunks = 500;
    this.embeddingMaxChunkLength = maximumChunkLength();
    this.log(`Initialized ${this.model}`, {
      maxConcurrentChunks: this.maxConcurrentChunks,
      embeddingMaxChunkLength: this.embeddingMaxChunkLength,
    });
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
      // If any batch failed the embeddings are incomplete, so the whole sequence is abandoned.
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

    // Unlike the OpenAI/Generic OpenAI embedders which return null on an empty or
    // malformed result, Mistral throws here to preserve the failure contract from #5513
    // so a document is never silently embedded with empty vectors.
    const embeddings = data.map((emb) => emb.embedding);
    if (embeddings.length === 0)
      throw new Error("Mistral returned empty embeddings for batch");
    return embeddings;
  }
}

module.exports = {
  MistralEmbedder,
};
