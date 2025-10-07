// --------------------------------------------------------------
// Toggle verbose logs for HybridEmbedder
// Set DEBUG_HYBRID_EMBEDDER=true in your .env to enable
// --------------------------------------------------------------
const LOG_ENABLED = process.env.DEBUG_HYBRID_EMBEDDER === "true";
const chalk = require("chalk");

// Local embedders
const { NativeEmbedder } = require("../native");
const { BM25Embedder } = require("../bm25");

class HybridEmbedder {
  /* ─────────────────────────── Private state ────────────────────────── */
  #namespace = null;
  #dense = null;
  #sparse = null;

  /* ─────────────────────────── Public props ─────────────────────────── */
  // BaseEmbedderProvider API surface
  model = "bm25-lexical"; // identifier for logs/analytics
  maxConcurrentChunks = null;
  embeddingMaxChunkLength = null;
  supportsSparseVectors = true;

  constructor(namespace = "default") {
    this.#namespace = namespace;

    // Dense semantic embedder (snowflake-arctic-embed-m-v2.0)
    this.#dense = new NativeEmbedder();

    // Sparse BM25 embedder (wink-bm25)
    this.#sparse = new BM25Embedder(namespace);

    // Re-expose limits from dense embedder so existing logic keeps working
    this.maxConcurrentChunks = this.#dense.maxConcurrentChunks ?? 25;
    this.embeddingMaxChunkLength =
      this.#dense.embeddingMaxChunkLength ?? 1_000;

    this.#log("Initialized HybridEmbedder for namespace", namespace);
  }

  /* ─────────────────────────── Utils ─────────────────────────── */
  #log(...args) {
    if (LOG_ENABLED) console.log(chalk.magenta("[HybridEmbedder]"), ...args);
  }
  #error(...args) {
    console.error(chalk.red("[HybridEmbedder]"), ...args);
  }

  /* ────────────────────────── Core API ───────────────────────── */

  /**
   * Embed a single text input and return `{ dense, sparse }` pair.
   */
  async embedTextInput(textInput) {
    this.#log("embedTextInput() called");
    const [result] = await this.embedChunks(
      Array.isArray(textInput) ? textInput : [textInput]
    );
    return result;
  }

  /**
   * Embed an array of text chunks and return aligned dense & sparse pairs.
   * @param {string[]} textChunks
   * @returns {Array<{ dense: number[], sparse: { indices:number[], values:number[] } }>}  */
  async embedChunks(textChunks = []) {
    try {
      this.#log("embedChunks() called", { chunks: textChunks.length });
      // Dense semantic vectors
      const denseVectors = await this.#dense.embedChunks(textChunks);

      // Sparse BM25 vectors generated from wink‑bm25 scores
      const sparseVectors = textChunks.map((chunk) =>
        this.#sparse.toSparseVector(chunk)
      );

      // Combine into unified objects
      const combined = denseVectors.map((dense, i) => ({
        dense,
        sparse: sparseVectors[i],
      }));
      this.#log("embedChunks() completed", { vectors: combined.length });
      return combined;
    } catch (err) {
      this.#error("Failed to embed chunks", err);
      throw err;
    }
  }

  /* ───────────────────────── BM25 passthroughs ─────────────────────── */

  async addDocuments(docs) {
    this.#log("addDocuments() called", { docs: docs.length });
    return this.#sparse.addDocuments(docs);
  }

  search(query, k = 10) {
    this.#log("search() called", { query, k });
    return this.#sparse.search(query, k);
  }

  toSparseVector(text) {
    this.#log("toSparseVector() called");
    return this.#sparse.toSparseVector(text);
  }
}

module.exports = {
  HybridEmbedder,
};
