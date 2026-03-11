const { toChunks, maximumChunkLength } = require("../../helpers");

class LiteLLMEmbedder {
  constructor() {
    const { OpenAI: OpenAIApi } = require("openai");
    if (!process.env.LITE_LLM_BASE_PATH)
      throw new Error(
        "LiteLLM must have a valid base path to use for the api."
      );
    this.basePath = process.env.LITE_LLM_BASE_PATH;
    this.openai = new OpenAIApi({
      baseURL: this.basePath,
      apiKey: process.env.LITE_LLM_API_KEY ?? null,
    });
    this.model = process.env.EMBEDDING_MODEL_PREF || "text-embedding-ada-002";

    // Limit of how many strings we can process in a single pass to stay with resource or network limits
    this.maxConcurrentChunks = 500;
    this.embeddingMaxChunkLength = maximumChunkLength();
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks(
      Array.isArray(textInput) ? textInput : [textInput]
    );
    return result?.[0] || [];
  }

  async embedChunks(textChunks = []) {
    // Because there is a hard POST limit on how many chunks can be sent at once to LiteLLM (~8mb)
    // we concurrently execute each max batch of text chunks possible.
    // Refer to constructor maxConcurrentChunks for more info.
    const embeddingRequests = [];
    for (const chunk of toChunks(textChunks, this.maxConcurrentChunks)) {
      embeddingRequests.push(
        new Promise((resolve) => {
          this.openai.embeddings
            .create({
              model: this.model,
              input: chunk,
            })
            .then((result) => {
              resolve({ data: result?.data, error: null });
            })
            .catch((e) => {
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
      // If any errors were returned from LiteLLM abort the entire sequence because the embeddings
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

    if (!!error) throw new Error(`LiteLLM Failed to embed: ${error}`);
    return data.length > 0 &&
      data.every((embd) => embd.hasOwnProperty("embedding"))
      ? data.map((embd) => embd.embedding)
      : null;
  }
}

module.exports = {
  LiteLLMEmbedder,
};
