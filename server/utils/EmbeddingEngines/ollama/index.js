const { maximumChunkLength } = require("../../helpers");

class OllamaEmbedder {
  constructor() {
    if (!process.env.EMBEDDING_BASE_PATH)
      throw new Error("No embedding base path was set.");
    if (!process.env.EMBEDDING_MODEL_PREF)
      throw new Error("No embedding model was set.");

    this.basePath = `${process.env.EMBEDDING_BASE_PATH}/api/embeddings`;
    this.model = process.env.EMBEDDING_MODEL_PREF;
    // Limit of how many strings we can process in a single pass to stay with resource or network limits
    this.maxConcurrentChunks = 1;
    this.embeddingMaxChunkLength = maximumChunkLength();
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.constructor.name}]\x1b[0m ${text}`, ...args);
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks([textInput]);
    return result?.[0] || [];
  }

  async embedChunks(textChunks = []) {
    const embeddingRequests = [];
    this.log(
      `Embedding ${textChunks.length} chunks of text with ${this.model}.`
    );

    for (const chunk of textChunks) {
      embeddingRequests.push(
        new Promise((resolve) => {
          fetch(this.basePath, {
            method: "POST",
            body: JSON.stringify({
              model: this.model,
              prompt: chunk,
            }),
          })
            .then((res) => res.json())
            .then(({ embedding }) => {
              resolve({ data: embedding, error: null });
              return;
            })
            .catch((error) => {
              resolve({ data: [], error: error.message });
              return;
            });
        })
      );
    }

    const { data = [], error = null } = await Promise.all(
      embeddingRequests
    ).then((results) => {
      // If any errors were returned from Ollama abort the entire sequence because the embeddings
      // will be incomplete.

      const errors = results
        .filter((res) => !!res.error)
        .map((res) => res.error)
        .flat();
      if (errors.length > 0) {
        let uniqueErrors = new Set();
        errors.map((error) =>
          uniqueErrors.add(`[${error.type}]: ${error.message}`)
        );

        return {
          data: [],
          error: Array.from(uniqueErrors).join(", "),
        };
      }

      return {
        data: results.map((res) => res?.data || []),
        error: null,
      };
    });

    if (!!error) throw new Error(`Ollama Failed to embed: ${error}`);
    return data.length > 0 ? data : null;
  }
}

module.exports = {
  OllamaEmbedder,
};
