class GeminiEmbedder {
  constructor() {
    if (!process.env.GEMINI_EMBEDDING_API_KEY)
      throw new Error("No Gemini API key was set.");

    // TODO: Deprecate this and use OpenAI interface instead - after which, remove the @google/generative-ai dependency
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_EMBEDDING_API_KEY);
    this.model = process.env.EMBEDDING_MODEL_PREF || "text-embedding-004";
    this.gemini = genAI.getGenerativeModel({ model: this.model });

    // This property is disabled as it causes issues when sending multiple chunks at once
    // since when given 4 chunks at once, the gemini api returns 1 embedding for all 4 chunks
    // instead of 4 embeddings - no idea why this is the case, but it is not how the results are
    // expected to be returned.
    // this.maxConcurrentChunks = 1;

    // https://ai.google.dev/gemini-api/docs/models/gemini#text-embedding-and-embedding
    this.embeddingMaxChunkLength = 2_048;
    this.log(`Initialized with ${this.model}`);
  }

  log(text, ...args) {
    console.log(`\x1b[36m[GeminiEmbedder]\x1b[0m ${text}`, ...args);
  }

  /**
   * Embeds a single text input
   * @param {string} textInput - The text to embed
   * @returns {Promise<Array<number>>} The embedding values
   */
  async embedTextInput(textInput) {
    const result = await this.gemini.embedContent(textInput);
    return result.embedding.values || [];
  }

  /**
   * Embeds a list of text inputs
   * @param {Array<string>} textInputs - The list of text to embed
   * @returns {Promise<Array<Array<number>>>} The embedding values
   */
  async embedChunks(textChunks = []) {
    let embeddings = [];
    for (const chunk of textChunks) {
      const results = await this.gemini.embedContent(chunk);
      if (!results.embedding || !results.embedding.values)
        throw new Error("No embedding values returned from gemini");
      embeddings.push(results.embedding.values);
    }
    return embeddings;
  }
}

module.exports = {
  GeminiEmbedder,
};
