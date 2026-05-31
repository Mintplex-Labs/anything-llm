const { parseLemonadeServerEndpoint } = require("../../AiProviders/lemonade");
const { toChunks, reportEmbeddingProgress } = require("../../helpers");

class LemonadeEmbedder {
  constructor() {
    if (!process.env.EMBEDDING_BASE_PATH)
      throw new Error("No Lemonade API Base Path was set.");
    if (!process.env.EMBEDDING_MODEL_PREF)
      throw new Error("No Embedding Model Pref was set.");
    this.className = "LemonadeEmbedder";
    const { OpenAI: OpenAIApi } = require("openai");
    this.lemonade = new OpenAIApi({
      baseURL: parseLemonadeServerEndpoint(
        process.env.EMBEDDING_BASE_PATH,
        "openai"
      ),
      apiKey: process.env.LEMONADE_LLM_API_KEY || null,
    });
    this.model = process.env.EMBEDDING_MODEL_PREF;

    this.maxConcurrentChunks = 50;
    this.embeddingMaxChunkLength =
      process.env.EMBEDDING_MODEL_MAX_CHUNK_LENGTH || 8_191;
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
    this.log(
      `Embedding ${textChunks.length} chunks of text with ${this.model}.`
    );

    const allResults = [];
    for (const chunk of toChunks(textChunks, this.maxConcurrentChunks)) {
      const { data = [], error = null } = await new Promise((resolve) => {
        this.lemonade.embeddings
          .create({
            model: this.model,
            input: chunk,
          })
          .then((result) => {
            if (result?.error) {
              const errMsg =
                result.error?.details?.response?.error?.message ||
                result.error?.message ||
                "Unknown error";
              const errType =
                result.error?.details?.response?.error?.type ||
                result.error?.type ||
                "api_error";
              resolve({
                data: [],
                error: { type: errType, message: errMsg },
              });
              return;
            }
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
      });

      if (error) {
        const errorMsg = `Lemonade Failed to embed: [${error.type}]: ${error.message}`;
        this.log(errorMsg);
        throw new Error(errorMsg);
      }
      allResults.push(...(data || []));
      reportEmbeddingProgress(
        Math.min(allResults.length, textChunks.length),
        textChunks.length
      );
    }

    return allResults.length > 0 &&
      allResults.every((embd) => embd.hasOwnProperty("embedding"))
      ? allResults.map((embd) => embd.embedding)
      : null;
  }
}

module.exports = {
  LemonadeEmbedder,
};
