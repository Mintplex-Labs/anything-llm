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

  async #isAlive() {
    return await fetch(process.env.EMBEDDING_BASE_PATH, {
      method: "HEAD",
    })
      .then((res) => res.ok)
      .catch((e) => {
        this.log(e.message);
        return false;
      });
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks(
      Array.isArray(textInput) ? textInput : [textInput]
    );
    return result?.[0] || [];
  }

  /**
   * This function takes an array of text chunks and embeds them using the Ollama API.
   * chunks are processed sequentially to avoid overwhelming the API with too many requests
   * or running out of resources on the endpoint running the ollama instance.
   * @param {string[]} textChunks - An array of text chunks to embed.
   * @returns {Promise<Array<number[]>>} - A promise that resolves to an array of embeddings.
   */
  async embedChunks(textChunks = []) {
    if (!(await this.#isAlive()))
      throw new Error(
        `Ollama service could not be reached. Is Ollama running?`
      );

    this.log(
      `Embedding ${textChunks.length} chunks of text with ${this.model}.`
    );

    let data = [];
    let error = null;

    for (const chunk of textChunks) {
      try {
        const res = await fetch(this.basePath, {
          method: "POST",
          body: JSON.stringify({
            model: this.model,
            prompt: chunk,
          }),
        });

        const { embedding } = await res.json();
        if (!Array.isArray(embedding) || embedding.length === 0)
          throw new Error("Ollama returned an empty embedding for chunk!");

        data.push(embedding);
      } catch (err) {
        this.log(err.message);
        error = err.message;
        data = [];
        break;
      }
    }

    if (!!error) throw new Error(`Ollama Failed to embed: ${error}`);
    return data.length > 0 ? data : null;
  }
}

module.exports = {
  OllamaEmbedder,
};
