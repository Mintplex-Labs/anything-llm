const { toChunks } = require("../../helpers");

const MODEL_MAP = {
  "embedding-001": 2048,
  "text-embedding-004": 2048,
  "gemini-embedding-exp-03-07": 8192,
};

class GeminiEmbedder {
  constructor() {
    if (!process.env.GEMINI_EMBEDDING_API_KEY)
      throw new Error("No Gemini API key was set.");

    this.className = "GeminiEmbedder";
    const { OpenAI: OpenAIApi } = require("openai");
    this.model = process.env.EMBEDDING_MODEL_PREF || "text-embedding-004";
    this.openai = new OpenAIApi({
      apiKey: process.env.GEMINI_EMBEDDING_API_KEY,
      // Even models that are v1 in gemini API can be used with v1beta/openai/ endpoint and nobody knows why.
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });

    this.maxConcurrentChunks = 4;

    // https://ai.google.dev/gemini-api/docs/models/gemini#text-embedding-and-embedding
    this.embeddingMaxChunkLength = MODEL_MAP[this.model] || 2_048;
    this.log(
      `Initialized with ${this.model} - Max Size: ${this.embeddingMaxChunkLength}`
    );
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  /**
   * Embeds a single text input
   * @param {string|string[]} textInput - The text to embed
   * @returns {Promise<Array<number>>} The embedding values
   */
  async embedTextInput(textInput) {
    const result = await this.embedChunks(
      Array.isArray(textInput) ? textInput : [textInput]
    );
    return result?.[0] || [];
  }

  /**
   * Embeds a list of text inputs
   * @param {string[]} textChunks - The list of text to embed
   * @returns {Promise<Array<Array<number>>>} The embedding values
   */
  async embedChunks(textChunks = []) {
    this.log(`Embedding ${textChunks.length} chunks...`);

    // Because there is a hard POST limit on how many chunks can be sent at once to OpenAI (~8mb)
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

    if (!!error) throw new Error(`Gemini Failed to embed: ${error}`);
    return data.length > 0 &&
      data.every((embd) => embd.hasOwnProperty("embedding"))
      ? data.map((embd) => embd.embedding)
      : null;
  }
}

module.exports = {
  GeminiEmbedder,
};
