const { toChunks } = require("../../helpers");

class geminiEmbedder {
  constructor() {
    if (!process.env.GEMINI_API_KEY) throw new Error("No Gemini API key was set.");
    const { GoogleGenerativeAI: GenerativeAI } = require("@google/generative-ai");
    this.gemini = new GenerativeAI(process.env.GEMINI_API_KEY);
    this.model = process.env.EMBEDDING_MODEL_PREF || "text-embedding-004";

    // Limit of how many strings we can process in a single pass to stay with resource or network limits
    this.maxConcurrentChunks = 1; // Gemini's limit per request is 1

    // https://ai.google.dev/gemini-api/docs/models/gemini#text-embedding-and-embedding
    this.embeddingMaxChunkLength = 2_048;
  }

  async embedTextInput(textInput) {
    const genAI = this.gemini;
    const model = genAI.getGenerativeModel({ model: this.model });

    const result = await model.embedContent(textInput);
    return result.embedding.values || [];
  }

  async embedChunks(textChunks = []) {
    const genAI = this.gemini;
    const model = genAI.getGenerativeModel({ model: this.model });

    const embeddings = [];
    for (const chunk of toChunks(textChunks, this.maxConcurrentChunks)) {
      const result = await model.embedContent(chunk);
      embeddings.push(result.embedding.values);
    }
    return embeddings || [];
  }
}

module.exports = {
  geminiEmbedder,
};
