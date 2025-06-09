/*
  BM25Index.js – Lightweight lexical‑search adapter for Anything‑LLM
  ------------------------------------------------------------------
  • Uses wink-bm25-text-search for BM25 scoring.
  • Keeps one engine instance per namespace (workspace) persisted to disk.
  • Exposes async helpers that mirror the Milvus adapter so HybridSearch
    can fuse dense + lexical results.
*/

const path = require("path");
const fs = require("fs");
const bm25 = require("wink-bm25-text-search");
const winkNLP = require("wink-nlp");
const model = require("wink-eng-lite-web-model");
const nlp = winkNLP(model);
const its = nlp.its;

/** Return tokens array after normalising, stemming & negation handling */
function defaultPrepTask(text) {
  const tokens = [];
  nlp.readDoc(text)
    .tokens()
    .filter(
      (t) => t.out(its.type) === "word" && !t.out(its.stopWordFlag)
    )
    .each((t) => {
      const stem = t.out(its.stem);
      tokens.push(t.out(its.negationFlag) ? "!" + stem : stem);
    });
  return tokens;
}

const indexRoot = process.env.STORAGE_DIR
  ? path.resolve(process.env.STORAGE_DIR, "bm25")
  : path.resolve(__dirname, "../../../storage/bm25");
if (!fs.existsSync(indexRoot)) fs.mkdirSync(indexRoot, { recursive: true });

/**
 * Internal helper – persist engine state to <indexRoot>/<namespace>.json
 */
function saveEngine(namespace, engine) {
  const filePath = path.resolve(indexRoot, `${namespace}.json`);
  fs.writeFileSync(filePath, JSON.stringify(engine.exportJSON()));
}

/**
 * Internal helper – load engine state or create a new one.
 */
function loadEngine(namespace) {
  const filePath = path.resolve(indexRoot, `${namespace}.json`);
  const engine = bm25();
  engine.defineConfig({ fldWeights: { text: 1 } });
  engine.definePrepTasks([defaultPrepTask]);

  if (fs.existsSync(filePath)) {
    const dump = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    engine.importJSON(dump);
  }
  return engine;
}

module.exports.BM25Index = {
  /**
   * Index an array of chunks: [{ id, text }]
   * Called from addDocumentToNamespace after dense vectors are ready.
   */
  async indexChunks(namespace, chunks = []) {
    if (!namespace || chunks.length === 0) return;
    const engine = loadEngine(namespace);

    chunks.forEach((c) => engine.addDoc({ text: c.text }, c.id));
    engine.consolidate();
    saveEngine(namespace, engine);
  },

  /**
   * Search the namespace and return top‑k doc IDs with scores.
   * Returns: [{ id, score }]
   */
  async search(namespace, query, topN = 10) {
    if (!namespace || !query) return [];
    const engine = loadEngine(namespace);
    const results = engine.search(query, topN);
    return results.map(([id, score]) => ({ id, score }));
  },

  /** Delete an entire namespace index from disk */
  async deleteNamespace(namespace) {
    const filePath = path.resolve(indexRoot, `${namespace}.json`);
    if (fs.existsSync(filePath)) fs.rmSync(filePath);
  },
};
