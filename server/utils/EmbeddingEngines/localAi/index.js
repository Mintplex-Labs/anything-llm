const { toChunks } = require("../../helpers");

class LocalAiEmbedder {
  constructor() {
    const { Configuration, OpenAIApi } = require("openai");
    if (!process.env.EMBEDDING_BASE_PATH)
      throw new Error("No embedding base path was set.");
    if (!process.env.EMBEDDING_MODEL_PREF)
      throw new Error("No embedding model was set.");
    const config = new Configuration({
      basePath: process.env.EMBEDDING_BASE_PATH,
    });
    this.openai = new OpenAIApi(config);

    // Arbitrary limit to ensure we stay within reasonable POST request size.
    this.embeddingChunkLimit = 1_000;
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks(textInput);
    return result?.[0] || [];
  }

  async embedChunks(textChunks = []) {
    const embeddingRequests = [];
    for (const chunk of toChunks(textChunks, this.embeddingChunkLimit)) {
      embeddingRequests.push(
        new Promise((resolve) => {
          this.openai
            .createEmbedding({
              model: process.env.EMBEDDING_MODEL_PREF,
              input: chunk,
            })
            .then((res) => {
              resolve({ data: res.data?.data, error: null });
            })
            .catch((e) => {
              resolve({ data: [], error: e?.error });
            });
        })
      );
    }

    const { data = [], error = null } = await Promise.all(
      embeddingRequests
    ).then((results) => {
      // If any errors were returned from LocalAI abort the entire sequence because the embeddings
      // will be incomplete.
      const errors = results
        .filter((res) => !!res.error)
        .map((res) => res.error)
        .flat();
      if (errors.length > 0) {
        return {
          data: [],
          error: `(${errors.length}) Embedding Errors! ${errors
            .map((error) => `[${error.type}]: ${error.message}`)
            .join(", ")}`,
        };
      }
      return {
        data: results.map((res) => res?.data || []).flat(),
        error: null,
      };
    });

    if (!!error) throw new Error(`LocalAI Failed to embed: ${error}`);
    return data.length > 0 &&
      data.every((embd) => embd.hasOwnProperty("embedding"))
      ? data.map((embd) => embd.embedding)
      : null;
  }
}

module.exports = {
  LocalAiEmbedder,
};
