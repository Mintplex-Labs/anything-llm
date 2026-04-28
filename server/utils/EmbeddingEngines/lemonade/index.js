const { parseLemonadeServerEndpoint } = require("../../AiProviders/lemonade");

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
      apiKey: process.env.LEMONADE_LLM_API_KEY ?? null,
    });
    this.model = process.env.EMBEDDING_MODEL_PREF;

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
    this.log(`Embedding ${textChunks.length} chunks of text...`);
    const { data = [], error = null } = await new Promise((resolve) => {
      this.lemonade.embeddings
        .create({
          model: this.model,
          input: textChunks,
        })
        .then((result) => resolve({ data: result?.data, error: null }))
        .catch((e) => {
          e.type =
            e?.response?.data?.error?.code ||
            e?.response?.status ||
            "failed_to_embed";
          e.message = e?.response?.data?.error?.message || e.message;
          resolve({ data: [], error: e });
        });
    });

    if (error) throw new Error(`Lemonade Failed to embed: ${error.message}`);
    return data.length > 0 &&
      data.every((embd) => embd.hasOwnProperty("embedding"))
      ? data.map((embd) => embd.embedding)
      : null;
  }
}

module.exports = {
  LemonadeEmbedder,
};
