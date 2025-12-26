const { maximumChunkLength } = require("../../helpers");
const { Ollama } = require("ollama");

class OllamaEmbedder {
  constructor() {
    if (!process.env.EMBEDDING_BASE_PATH)
      throw new Error("No embedding base path was set.");
    if (!process.env.EMBEDDING_MODEL_PREF)
      throw new Error("No embedding model was set.");

    this.className = "OllamaEmbedder";
    this.basePath = process.env.EMBEDDING_BASE_PATH;
    this.model = process.env.EMBEDDING_MODEL_PREF;
    this.maxConcurrentChunks = process.env.OLLAMA_EMBEDDING_BATCH_SIZE
      ? Number(process.env.OLLAMA_EMBEDDING_BATCH_SIZE)
      : 1;
    this.embeddingMaxChunkLength = maximumChunkLength();
    this.authToken = process.env.OLLAMA_AUTH_TOKEN;
    const headers = this.authToken
      ? { Authorization: `Bearer ${this.authToken}` }
      : {};
    this.client = new Ollama({ host: this.basePath, headers });
    this.log(
      `initialized with model ${this.model} at ${this.basePath}. Batch size: ${this.maxConcurrentChunks}, num_ctx: ${this.embeddingMaxChunkLength}`
    );
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
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
   * Chunks are processed in batches based on the maxConcurrentChunks setting to balance
   * resource usage on the Ollama endpoint.
   *
   * We will use the num_ctx option to set the maximum context window to the max chunk length defined by the user in the settings
   * so that the maximum context window is used and content is not truncated.
   *
   * We also assume the default keep alive option. This could cause issues with models being unloaded and reloaded
   * on low memory machines, but that is simply a user-end issue we cannot control. If the LLM and embedder are
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
      `Embedding ${textChunks.length} chunks of text with ${this.model} in batches of ${this.maxConcurrentChunks}.`
    );

    let data = [];
    let error = null;

    // Process chunks in batches based on maxConcurrentChunks
    const totalBatches = Math.ceil(
      textChunks.length / this.maxConcurrentChunks
    );
    let currentBatch = 0;

    for (let i = 0; i < textChunks.length; i += this.maxConcurrentChunks) {
      const batch = textChunks.slice(i, i + this.maxConcurrentChunks);
      currentBatch++;

      try {
        // Use input param instead of prompt param to support batch processing
        const res = await this.client.embed({
          model: this.model,
          input: batch,
          options: {
            // Always set the num_ctx to the max chunk length defined by the user in the settings
            // so that the maximum context window is used and content is not truncated.
            num_ctx: this.embeddingMaxChunkLength,
          },
        });

        const { embeddings } = res;
        if (!Array.isArray(embeddings) || embeddings.length === 0)
          throw new Error("Ollama returned empty embeddings for batch!");

        // Using prompt param in embed() would return a single embedding (number[])
        // but input param returns an array of embeddings (number[][]) for batch processing.
        // This is why we spread the embeddings array into the data array.
        data.push(...embeddings);
        this.log(
          `Batch ${currentBatch}/${totalBatches}: Embedded ${embeddings.length} chunks. Total: ${data.length}/${textChunks.length}`
        );
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
