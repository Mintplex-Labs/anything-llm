const { maximumChunkLength } = require("../../helpers");
const { Ollama } = require("ollama");

class OllamaEmbedder {
  constructor() {
    if (!process.env.EMBEDDING_BASE_PATH)
      throw new Error("No embedding base path was set.");
    if (!process.env.EMBEDDING_MODEL_PREF)
      throw new Error("No embedding model was set.");

    this.basePath = process.env.EMBEDDING_BASE_PATH;
    this.model = process.env.EMBEDDING_MODEL_PREF;
    // Limit of how many strings we can process in a single pass to stay with resource or network limits
    this.maxConcurrentChunks = 1;
    this.embeddingMaxChunkLength = maximumChunkLength();
    this.client = new Ollama({ host: this.basePath });
    this.log(
      `initialized with model ${this.model} at ${this.basePath}. num_ctx: ${this.embeddingMaxChunkLength}`
    );
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.constructor.name}]\x1b[0m ${text}`, ...args);
  }

  /**
   * Checks if the Ollama service is alive by pinging the base path.
   * @returns {Promise<boolean>} - A promise that resolves to true if the service is alive, false otherwise.
   */
  async #isAlive() {
    return await fetch(this.basePath)
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
   *
   * We will use the num_ctx option to set the maximum context window to the max chunk length defined by the user in the settings
   * so that the maximum context window is used and content is not truncated.
   *
   * We also assume the default keep alive option. This could cause issues with models being unloaded and reloaded
   * on load memory machines, but that is simply a user-end issue we cannot control. If the LLM and embedder are
   * constantly being loaded and unloaded, the user should use another LLM or Embedder to avoid this issue.
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
        const res = await this.client.embeddings({
          model: this.model,
          prompt: chunk,
          options: {
            // Always set the num_ctx to the max chunk length defined by the user in the settings
            // so that the maximum context window is used and content is not truncated.
            num_ctx: this.embeddingMaxChunkLength,
          },
        });

        const { embedding } = res;
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
