const { toChunks, maximumChunkLength } = require("../../helpers");

class LocalAiEmbedder {
  constructor() {
    const { Configuration, OpenAIApi } = require("openai");
    if (!process.env.EMBEDDING_BASE_PATH)
      throw new Error("No embedding base path was set.");
    if (!process.env.EMBEDDING_MODEL_PREF)
      throw new Error("No embedding model was set.");
    const config = new Configuration({
      basePath: process.env.EMBEDDING_BASE_PATH,
      ...(!!process.env.LOCAL_AI_API_KEY
        ? {
            apiKey: process.env.LOCAL_AI_API_KEY,
          }
        : {}),
    });
    this.openai = new OpenAIApi(config);

    // Limit of how many strings we can process in a single pass to stay with resource or network limits
    this.embeddingMaxChunkLength = maximumChunkLength();
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks(textInput);
    return result?.[0] || [];
  }

  async embedChunks(textChunks = []) {
    const embeddingRequests = [];
    for (const chunk of toChunks(textChunks, this.embeddingMaxChunkLength)) {
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
