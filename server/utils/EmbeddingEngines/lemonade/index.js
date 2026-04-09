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
    try {
      this.log(`Embedding text input...`);
      const response = await this.lemonade.embeddings.create({
        model: this.model,
        input: textInput,
      });
      return response?.data[0]?.embedding || [];
    } catch (error) {
      this.log("Failed to get embedding from Lemonade.", error.message);
      throw error;
    }
  }

  async embedChunks(textChunks = []) {
    this.log(
      `Embedding ${textChunks.length} chunks of text with ${this.model}.`
    );

    const allResults = [];
    for (const chunk of toChunks(textChunks, this.maxConcurrentChunks)) {
      try {
        const response = await this.lemonade.embeddings.create({
          model: this.model,
          input: chunk,
        });

        const embeddings = response?.data?.map((emb) => emb.embedding) || [];
        if (embeddings.length === 0)
          throw new Error("Lemonade returned empty embeddings for batch");

        allResults.push(...embeddings);
        reportEmbeddingProgress(allResults.length, textChunks.length);
      } catch (error) {
        this.log("Failed to get embeddings from Lemonade.", error.message);
        throw new Error(`Lemonade Failed to embed: ${error.message}`);
      }
    }

    return allResults.length > 0 ? allResults : null;
  }
}

module.exports = {
  LemonadeEmbedder,
};
