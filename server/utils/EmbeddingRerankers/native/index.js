const path = require("path");
const fs = require("fs");

class NativeEmbeddingReranker {
  static #model = null;
  static #tokenizer = null;
  static #transformers = null;

  constructor() {
    // An alternative model to the mixedbread-ai/mxbai-rerank-xsmall-v1 model (speed on CPU is much slower for this model @ 18docs = 6s)
    // Model Card: https://huggingface.co/Xenova/ms-marco-MiniLM-L-6-v2 (speed on CPU is much faster @ 18docs = 1.6s)
    this.model = "Xenova/ms-marco-MiniLM-L-6-v2";
    this.cacheDir = path.resolve(
      process.env.STORAGE_DIR
        ? path.resolve(process.env.STORAGE_DIR, `models`)
        : path.resolve(__dirname, `../../../storage/models`)
    );
    this.modelPath = path.resolve(this.cacheDir, ...this.model.split("/"));
    // Make directory when it does not exist in existing installations
    if (!fs.existsSync(this.cacheDir)) fs.mkdirSync(this.cacheDir);
    this.log("Initialized");
  }

  log(text, ...args) {
    console.log(`\x1b[36m[NativeEmbeddingReranker]\x1b[0m ${text}`, ...args);
  }

  /**
   * This function will preload the reranker suite and tokenizer.
   * This is useful for reducing the latency of the first rerank call and pre-downloading the models and such
   * to avoid having to wait for the models to download on the first rerank call.
   */
  async preload() {
    try {
      this.log(`Preloading reranker suite...`);
      await this.initClient();
      this.log(
        `Preloaded reranker suite. Reranking is available as a service now.`
      );
      return;
    } catch (e) {
      console.error(e);
      this.log(
        `Failed to preload reranker suite. Reranking will be available on the first rerank call.`
      );
      return;
    }
  }

  async initClient() {
    if (NativeEmbeddingReranker.#transformers) {
      this.log(`Reranker suite already initialized - reusing.`);
      return;
    }

    await import("@xenova/transformers").then(
      async ({ AutoModelForSequenceClassification, AutoTokenizer }) => {
        this.log(`Loading reranker suite...`);
        NativeEmbeddingReranker.#transformers = {
          AutoModelForSequenceClassification,
          AutoTokenizer,
        };
        await this.#getPreTrainedModel();
        await this.#getPreTrainedTokenizer();
      }
    );
    return;
  }

  async #getPreTrainedModel() {
    if (NativeEmbeddingReranker.#model) {
      this.log(`Loading model from singleton...`);
      return NativeEmbeddingReranker.#model;
    }

    const model =
      await NativeEmbeddingReranker.#transformers.AutoModelForSequenceClassification.from_pretrained(
        this.model,
        {
          progress_callback: (p) =>
            p.status === "progress" &&
            this.log(`Loading model ${this.model}... ${p?.progress}%`),
          cache_dir: this.cacheDir,
        }
      );
    this.log(`Loaded model ${this.model}`);
    NativeEmbeddingReranker.#model = model;
    return model;
  }

  async #getPreTrainedTokenizer() {
    if (NativeEmbeddingReranker.#tokenizer) {
      this.log(`Loading tokenizer from singleton...`);
      return NativeEmbeddingReranker.#tokenizer;
    }

    const tokenizer =
      await NativeEmbeddingReranker.#transformers.AutoTokenizer.from_pretrained(
        this.model,
        {
          progress_callback: (p) =>
            p.status === "progress" &&
            this.log(`Loading tokenizer ${this.model}... ${p?.progress}%`),
          cache_dir: this.cacheDir,
        }
      );
    this.log(`Loaded tokenizer ${this.model}`);
    NativeEmbeddingReranker.#tokenizer = tokenizer;
    return tokenizer;
  }

  /**
   * Reranks a list of documents based on the query.
   * @param {string} query - The query to rerank the documents against.
   * @param {{text: string}[]} documents - The list of document text snippets to rerank. Should be output from a vector search.
   * @param {Object} options - The options for the reranking.
   * @param {number} options.topK - The number of top documents to return.
   * @returns {Promise<any[]>} - The reranked list of documents.
   */
  async rerank(query, documents, options = { topK: 4 }) {
    await this.initClient();
    const model = NativeEmbeddingReranker.#model;
    const tokenizer = NativeEmbeddingReranker.#tokenizer;

    const start = Date.now();
    this.log(`Reranking ${documents.length} documents...`);
    const inputs = tokenizer(new Array(documents.length).fill(query), {
      text_pair: documents.map((doc) => doc.text),
      padding: true,
      truncation: true,
    });
    const { logits } = await model(inputs);
    const reranked = logits
      .sigmoid()
      .tolist()
      .map(([score], i) => ({
        rerank_corpus_id: i,
        rerank_score: score,
        ...documents[i],
      }))
      .sort((a, b) => b.rerank_score - a.rerank_score)
      .slice(0, options.topK);

    this.log(
      `Reranking ${documents.length} documents to top ${options.topK} took ${Date.now() - start}ms`
    );
    return reranked;
  }
}

module.exports = {
  NativeEmbeddingReranker,
};
