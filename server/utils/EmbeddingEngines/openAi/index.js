const { toChunks } = require("../../helpers");

class OpenAiEmbedder {
  constructor() {
    const { Configuration, OpenAIApi } = require("openai");
    if (!process.env.OPEN_AI_KEY) throw new Error("No OpenAI API key was set.");
    const config = new Configuration({
      apiKey: process.env.OPEN_AI_KEY,
    });
    const openai = new OpenAIApi(config);
    this.openai = openai;

    // Limit of how many strings we can process in a single pass to stay with resource or network limits
    this.maxConcurrentChunks = 500;
    this.embeddingMaxChunkLength = 1_000;
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks(textInput);
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
          this.openai
            .createEmbedding({
              model: "text-embedding-ada-002",
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
      // If any errors were returned from OpenAI abort the entire sequence because the embeddings
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

    if (!!error) throw new Error(`OpenAI Failed to embed: ${error}`);
    return data.length > 0 &&
      data.every((embd) => embd.hasOwnProperty("embedding"))
      ? data.map((embd) => embd.embedding)
      : null;
  }
}

module.exports = {
  OpenAiEmbedder,
};
