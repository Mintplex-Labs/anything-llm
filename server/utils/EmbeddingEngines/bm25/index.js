/**
 * BM25.js – Hybrid lexical search adapter for Anything-LLM
 * ------------------------------------------------------------------
 * The file is now rewritten as BM25.js in the same class-based layout
 * as NativeEmbedder, complete with ANSI-color logging and save/load
 * helpers. Let me know if anything still looks off!
 */

const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const bm25 = require("wink-bm25-text-search");
const winkNLP = require("wink-nlp");
const model = require("wink-eng-lite-web-model");
const nlp = winkNLP(model);
const its = nlp.its;

class BM25Embedder {
  #index = null;
  #namespace = null;
  #cacheDir = null;
  #dataPath = null;
  #vocab = new Map(); // token -> integer id for sparse vectors
  #nextIdx = 0;


  constructor(namespace = "default") {
    this.#namespace = namespace;
    this.#cacheDir = path.resolve(
      process.env.STORAGE_DIR
        ? path.resolve(process.env.STORAGE_DIR, "bm25")
        : path.resolve(__dirname, "../../../storage/bm25")
    );
    this.#dataPath = path.resolve(this.#cacheDir, `${namespace}.json`);

    // Align with NativeEmbedder public API
    this.model = "bm25-lexical";
    this.maxConcurrentChunks = null;
    this.embeddingMaxChunkLength = null;

    this.#init();
  }

  log(text, ...args) {
    console.log(chalk.cyan("[BM25]"), text, ...args);
  }

  error(text, ...args) {
    console.error(chalk.red("[BM25]"), text, ...args);
  }

  #init() {
    this.#index = bm25();
    this.#index.defineConfig({ fldWeights: { body: 1 }});
    this.#index.definePrepTasks([
      this.#tokenizeAndStem
    ]);

    if (fs.existsSync(this.#dataPath)) {
      try {
        const snapshot = JSON.parse(fs.readFileSync(this.#dataPath, "utf8"));
        this.#index.importJSON(snapshot);
        this.log(`Loaded BM25 index for '${this.#namespace}' from disk.`);
      } catch (err) {
        this.error(`Failed to load index – rebuilding.`, err);
      }
    }
  }

  #tokenizeAndStem(text) {
    const tokens = [];
    nlp.readDoc(text)
      .tokens()
      .filter(t => t.out(its.type) === "word" && !t.out(its.stopWordFlag))
      .each(t => tokens.push(t.out(its.stem)));
    return tokens;
  }

  #idFor(token) {
    if (!this.#vocab.has(token)) this.#vocab.set(token, this.#nextIdx++);
    return this.#vocab.get(token);
  }

  /**
   * Embed a single string and return a sparse vector.
   * Mirrors NativeEmbedder.embedTextInput but returns { indices, values }.
   */
  async embedTextInput(text) {
    return this.toSparseVector(text);
  }

  /**
   * Embed an array of strings, returning aligned sparse vectors.
   * @param {string[]} textChunks
   * @returns {Array<{ indices:number[], values:number[] }>}
   */
  async embedChunks(textChunks = []) {
    return textChunks.map((t) => this.toSparseVector(t));
  }

  /**
   * Index a batch of documents.
   * @param {Array<{id: string, body: string}>} docs
   */
  async addDocuments(docs) {
    docs.forEach(doc => this.#index.addDoc(doc, doc.id));
    this.#index.consolidate();
    await this.#persist();
  }

  /**
   * Search the index.
   * @param {string} query
   * @param {number} k
   * @returns {Array<{id: string, score: number}>}
   */
  search(query, k = 10) {
    const results = this.#index.search(query);
    return results.slice(0, k);
  }

  /**
   * Convert arbitrary text into Milvus SparseFloatVector format:
   * { indices:number[], values:number[] }
   * Uses the same stemming/stop‑word logic as the index.
   */
  toSparseVector(text) {
    // Tokenize & stem
    const tokens = this.#tokenizeAndStem(text);

    // Term Frequency table for this document
    const tf = Object.create(null);
    tokens.forEach((t) => (tf[t] = (tf[t] || 0) + 1));

    // Build sparse entries and sort by index (Milvus requires ascending order)
    const entries = Object.keys(tf).map((tok) => {
      return {
        id: this.#idFor(tok),
        w: tf[tok] / tokens.length, // normalised term‑frequency
      };
    }).sort((a, b) => a.id - b.id); // ensure ascending order

    const indices = entries.map((e) => e.id);
    const values  = entries.map((e) => e.w);

    return { indices, values };
  }

  /**
   * Persist index to disk.
   */
  async #persist() {
    if (!fs.existsSync(this.#cacheDir)) {
      fs.mkdirSync(this.#cacheDir, { recursive: true });
    }
    fs.writeFileSync(this.#dataPath, JSON.stringify(this.#index.exportJSON()));
    this.log(`Index for '${this.#namespace}' saved to disk.`);
  }

  /**
   * Reset the index.
   */
  async reset() {
    this.#index = bm25();
    this.#index.defineConfig({ fldWeights: { body: 1 }});
    this.#index.definePrepTasks([this.#tokenizeAndStem]);
    await this.#persist();
    this.log(`Index for '${this.#namespace}' reset.`);
  }
}

module.exports = { BM25Embedder };
