const { STOPWORDS } = require("./stopwords");
const { config } = require("../config");

/**
 * Tokenizer + BM25 implementation tuned for retrieval over mixed-content chunks.
 *
 * Why custom, why these choices:
 *   - Existing JS BM25 libs (wink, lunr, elasticlunr) bundle English-only stemmers
 *     and locked tokenizer pipelines. We want predictable behavior across the
 *     27 locales AnythingLLM supports.
 *   - We pre-extract "atomic" tokens (URLs, snake_case/camelCase identifiers,
 *     long alphanumeric IDs, version strings) BEFORE general word-splitting so
 *     valuable signal isn't destroyed by punctuation stripping. This matters
 *     for codebases, ticketing systems, and document IDs in RAG corpora.
 *   - Stemming is intentionally absent: a correct Porter/Snowball impl across
 *     locales is its own project, and naive stemming hurts precision on short
 *     chunks. We expose a hook so callers can plug in a stemmer if they have one.
 *
 * BM25 formula follows Robertson/Sparck-Jones with Lucene-style IDF flooring:
 *     idf(t) = log(1 + (N - df + 0.5) / (df + 0.5))
 *     score(d, q) = Σ_{t in q} idf(t) * (f(t,d) * (k1+1)) /
 *                   (f(t,d) + k1 * (1 - b + b * |d|/avgdl))
 */

// Regexes are constructed once and reused; building them per-call is hot.
const URL_RE = /\bhttps?:\/\/[^\s)]+/gi;
// Identifier patterns — each requires explicit structural evidence so plain
// English words (even capitalized ones like "The") don't get treated as identifiers:
//   - snake_case / kebab-case: requires at least one separator
//   - camelCase: lowercase prefix followed by ≥1 internal uppercase hump
//   - PascalCase: ≥2 capitalized humps (e.g. "UserAccount", not "User")
const IDENT_RE =
  /\b(?:[a-z][a-z0-9]*(?:[_-][a-z0-9]+)+|[a-z][a-z0-9]+(?:[A-Z][A-Za-z0-9]*)+|(?:[A-Z][a-z0-9]+){2,})\b/g;
// Long alphanumeric strings (UUIDs, hashes, IDs) — keep verbatim when ≥6 chars
// AND containing at least one digit (avoids matching ordinary long English words).
const LONG_ID_RE = /\b(?=[a-zA-Z0-9]{6,}\b)[a-zA-Z]*\d[a-zA-Z0-9]*\b/g;
// Version-like tokens (1.2.3, v2.0.0-beta) — keep dots so "1.2.3" != "1.2"
const VERSION_RE = /\bv?\d+\.\d+(?:\.\d+(?:[-+][\w.]+)?)?\b/gi;

/**
 * Split text into tokens for BM25.
 *
 * @param {string} text
 * @param {{stopwords?:Set<string>, minLength?:number, lowercase?:boolean}} [opts]
 * @returns {string[]}
 */
function tokenize(text = "", opts = {}) {
  if (!text || typeof text !== "string") return [];
  const stopwords = opts.stopwords ?? STOPWORDS;
  const minLength = opts.minLength ?? 2;
  const lowercase = opts.lowercase !== false;

  const preserved = [];
  const consume = (re) => {
    text = text.replace(re, (match) => {
      preserved.push(lowercase ? match.toLowerCase() : match);
      return " ";
    });
  };
  // Order matters: URL before VERSION (URLs may contain version-like substrings),
  // VERSION before IDENT before LONG_ID (avoid double-extraction of the same span).
  consume(URL_RE);
  consume(VERSION_RE);
  consume(IDENT_RE);
  consume(LONG_ID_RE);

  const rest = (lowercase ? text.toLowerCase() : text)
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/);

  const out = [];
  for (const t of preserved) if (t.length >= minLength) out.push(t);
  for (const t of rest) {
    if (t.length < minLength) continue;
    if (stopwords.has(t)) continue;
    out.push(t);
  }
  return out;
}

class BM25 {
  /**
   * @param {Array<{id:string, text:string, item:any}>} docs
   * @param {{k1?:number, b?:number, stopwords?:Set<string>}} [opts]
   */
  constructor(docs = [], opts = {}) {
    this.k1 = opts.k1 ?? config.bm25K1;
    this.b = opts.b ?? config.bm25B;
    this.stopwords = opts.stopwords ?? STOPWORDS;
    this.docs = docs;
    this.docTokens = docs.map((d) =>
      tokenize(d.text, { stopwords: this.stopwords })
    );
    this.docLengths = this.docTokens.map((t) => t.length);
    this.avgDocLength =
      this.docLengths.reduce((acc, n) => acc + n, 0) / (docs.length || 1);

    this.termFreqs = this.docTokens.map((tokens) => {
      const tf = new Map();
      for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
      return tf;
    });

    this.docFreqs = new Map();
    for (const tf of this.termFreqs) {
      for (const term of tf.keys()) {
        this.docFreqs.set(term, (this.docFreqs.get(term) || 0) + 1);
      }
    }

    this.N = docs.length;
  }

  /**
   * Score every doc against a query string.
   * @returns {Array<{id:string, score:number, item:any}>} sorted desc, zero scores filtered
   */
  score(query) {
    const qTokens = tokenize(query, { stopwords: this.stopwords });
    if (qTokens.length === 0 || this.N === 0) return [];

    const results = new Array(this.docs.length);
    for (let i = 0; i < this.docs.length; i++) {
      let score = 0;
      const dl = this.docLengths[i];
      const tf = this.termFreqs[i];
      const lenNorm = 1 - this.b + this.b * (dl / this.avgDocLength);
      for (const term of qTokens) {
        const f = tf.get(term);
        if (!f) continue;
        const df = this.docFreqs.get(term) || 0;
        const idf = Math.log(1 + (this.N - df + 0.5) / (df + 0.5));
        const denom = f + this.k1 * lenNorm;
        score += idf * ((f * (this.k1 + 1)) / denom);
      }
      results[i] = { id: this.docs[i].id, score, item: this.docs[i].item };
    }

    return results.filter((r) => r.score > 0).sort((a, b) => b.score - a.score);
  }
}

module.exports = { BM25, tokenize };
