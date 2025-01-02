const path = require("path");
const fs = require("fs");

class NativeEmbeddingReranker {
  static _model = null;
  static _tokenizer = null;
  #transformers = null;

  constructor() {
    // Model Card: https://huggingface.co/mixedbread-ai/mxbai-rerank-xsmall-v1
    this.model = "mixedbread-ai/mxbai-rerank-xsmall-v1";
    this.cacheDir = path.resolve(
      process.env.STORAGE_DIR
        ? path.resolve(process.env.STORAGE_DIR, `models`)
        : path.resolve(__dirname, `../../../storage/models`)
    );
    this.modelPath = path.resolve(
      this.cacheDir,
      "mixedbread-ai",
      "mxbai-rerank-xsmall-v1"
    );
    this.modelDownloaded = fs.existsSync(this.modelPath);

    import("@xenova/transformers").then(
      ({ AutoModelForSequenceClassification, AutoTokenizer }) => {
        this.#transformers = {
          AutoModelForSequenceClassification,
          AutoTokenizer,
        };
      }
    );

    // Make directory when it does not exist in existing installations
    if (!fs.existsSync(this.cacheDir)) fs.mkdirSync(this.cacheDir);
    this.log("Initialized");
  }

  log(text, ...args) {
    console.log(`\x1b[36m[NativeEmbeddingReranker]\x1b[0m ${text}`, ...args);
  }

  async #getPreTrainedModel() {
    if (NativeEmbeddingReranker._model) {
      this.log(`Loading model from singleton...`);
      return NativeEmbeddingReranker._model;
    }

    const model =
      await this.#transformers.AutoModelForSequenceClassification.from_pretrained(
        this.model,
        {
          progress_callback: (p) =>
            p.status === "progress" &&
            this.log(`Loading model ${this.model}... ${p?.progress}%`),
          cache_dir: this.cacheDir,
        }
      );
    NativeEmbeddingReranker._model = model;
    return model;
  }

  async #getPreTrainedTokenizer() {
    if (NativeEmbeddingReranker._tokenizer) {
      this.log(`Loading tokenizer from singleton...`);
      return NativeEmbeddingReranker._tokenizer;
    }

    const tokenizer = await this.#transformers.AutoTokenizer.from_pretrained(
      this.model,
      {
        progress_callback: (p) =>
          p.status === "progress" &&
          this.log(`Loading tokenizer ${this.model}... ${p?.progress}%`),
        cache_dir: this.cacheDir,
      }
    );
    NativeEmbeddingReranker._tokenizer = tokenizer;
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
    this.log(`Loading model ${this.model}...`);
    const model = await this.#getPreTrainedModel();
    const tokenizer = await this.#getPreTrainedTokenizer();

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
