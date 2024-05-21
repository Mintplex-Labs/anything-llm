class VoyageAiEmbedder {
  constructor() {
    if (!process.env.VOYAGEAI_API_KEY)
      throw new Error("No Voyage AI API key was set.");

    const {
      VoyageEmbeddings,
    } = require("@langchain/community/embeddings/voyage");
    const voyage = new VoyageEmbeddings({
      apiKey: process.env.VOYAGEAI_API_KEY,
    });

    this.voyage = voyage;
    this.model = process.env.EMBEDDING_MODEL_PREF || "voyage-large-2-instruct";

    // Limit of how many strings we can process in a single pass to stay with resource or network limits
    this.batchSize = 128; // Voyage AI's limit per request is 128 https://docs.voyageai.com/docs/rate-limits#use-larger-batches
    this.embeddingMaxChunkLength = 4000; // https://docs.voyageai.com/docs/embeddings - assume a token is roughly 4 letters with some padding
  }

  async embedTextInput(textInput) {
    const result = await this.voyage.embedDocuments(
      Array.isArray(textInput) ? textInput : [textInput],
      { modelName: this.model }
    );
    return result || [];
  }

  async embedChunks(textChunks = []) {
    try {
      const embeddings = await this.voyage.embedDocuments(textChunks, {
        modelName: this.model,
        batchSize: this.batchSize,
      });
      return embeddings;
    } catch (error) {
      console.error("Voyage AI Failed to embed:", error);
      throw error;
    }
  }
}

module.exports = {
  VoyageAiEmbedder,
};
