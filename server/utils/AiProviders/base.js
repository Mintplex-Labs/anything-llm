class BaseLLM {
  constructor(embedder, model = null) {
    if (!embedder) throw new Error("No embedder provided to LLM!");
    this.embedder = embedder;
    this.model = model;
  }

  async embedTextInput(textInput) {
    throw new Error("Method not implemented!");
  }

  async embedChunks(textChunks = []) {
    throw new Error("Method not implemented!");
  }

  async getChatCompletion(messages = [], options = {}) {
    throw new Error("Method not implemented!");
  }

  async getEmbedding(text) {
    throw new Error("Method not implemented!");
  }
}

module.exports = {
  BaseLLM,
}; 