class MistralEmbedder {
  constructor() {
    if (!process.env.MISTRAL_API_KEY)
      throw new Error("No Mistral API key was set.");

    const { OpenAI: OpenAIApi } = require("openai");
    this.openai = new OpenAIApi({
      baseURL: "https://api.mistral.ai/v1",
      apiKey: process.env.MISTRAL_API_KEY ?? null,
    });
    this.model = process.env.EMBEDDING_MODEL_PREF || "mistral-embed";
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks(
      Array.isArray(textInput) ? textInput : [textInput]
    );
    return result?.[0] || [];
  }

  async embedChunks(textChunks = []) {
    try {
      const response = await this.openai.embeddings.create({
        model: this.model,
        input: textChunks,
      });
      const embeddings = response?.data?.map((emb) => emb.embedding) || [];
      if (embeddings.length === 0)
        throw new Error("Mistral returned empty embeddings for batch");
      return embeddings;
    } catch (error) {
      console.error("Failed to get embeddings from Mistral.", error.message);
      throw new Error(`Mistral Failed to embed: ${error.message}`);
    }
  }
}

module.exports = {
  MistralEmbedder,
};
