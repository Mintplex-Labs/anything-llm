const { toChunks } = require("../../helpers");
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
      apiKey: null,
    });
    this.model = process.env.EMBEDDING_MODEL_PREF;

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
      console.error("Failed to get embedding from Lemonade.", error.message);
      return [];
    }
  }

  async embedChunks(textChunks = []) {
    try {
      this.log(`Embedding ${textChunks.length} chunks of text...`);
      const response = await this.lemonade.embeddings.create({
        model: this.model,
        input: textChunks,
      });
      return response?.data?.map((emb) => emb.embedding) || [];
    } catch (error) {
      console.error("Failed to get embeddings from Lemonade.", error.message);
      return new Array(textChunks.length).fill([]);
    }
  }
}

module.exports = {
  LemonadeEmbedder,
};
