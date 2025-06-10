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

  constructor(namespace = "default") {
    this.#namespace = namespace;
    this.#cacheDir = path.resolve(
      process.env.STORAGE_DIR
        ? path.resolve(process.env.STORAGE_DIR, "bm25")
        : path.resolve(__dirname, "../../../storage/bm25")
    );
    this.#dataPath = path.resolve(this.#cacheDir, `${namespace}.json`);

    this.#init();
  }

  #log(...args) {
    console.log(chalk.cyan("[BM25]"), ...args);
  }

  #error(...args) {
    console.error(chalk.red("[BM25]"), ...args);
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
        this.#log(`Loaded BM25 index for '${this.#namespace}' from disk.`);
      } catch (err) {
        this.#error(`Failed to load index – rebuilding.`, err);
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
   * Persist index to disk.
   */
  async #persist() {
    if (!fs.existsSync(this.#cacheDir)) {
      fs.mkdirSync(this.#cacheDir, { recursive: true });
    }
    fs.writeFileSync(this.#dataPath, JSON.stringify(this.#index.exportJSON()));
    this.#log(`Index for '${this.#namespace}' saved to disk.`);
  }

  /**
   * Reset the index.
   */
  async reset() {
    this.#index = bm25();
    this.#index.defineConfig({ fldWeights: { body: 1 }});
    this.#index.definePrepTasks([this.#tokenizeAndStem]);
    await this.#persist();
    this.#log(`Index for '${this.#namespace}' reset.`);
  }
}

module.exports = BM25Embedder;
