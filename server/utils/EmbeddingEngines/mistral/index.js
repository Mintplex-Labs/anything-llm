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
    try {
      const response = await this.openai.embeddings.create({
        model: this.model,
        input: textInput,
      });
      return response?.data[0]?.embedding || [];
    } catch (error) {
      console.error("Failed to get embedding from Mistral.", error.message);
      return [];
    }
  }

  async embedChunks(textChunks = []) {
    try {
      const response = await this.openai.embeddings.create({
        model: this.model,
        input: textChunks,
      });
      return response?.data?.map((emb) => emb.embedding) || [];
    } catch (error) {
      console.error("Failed to get embeddings from Mistral.", error.message);
      return new Array(textChunks.length).fill([]);
    }
  }
}

module.exports = {
  MistralEmbedder,
};
