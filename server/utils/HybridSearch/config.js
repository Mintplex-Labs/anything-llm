/**
 * Runtime configuration for HybridSearch.
 *
 * All knobs are environment-overridable so operators can tune behavior without
 * a code change. Defaults are conservative — tuned for a single-host
 * AnythingLLM install with workspaces in the 1K–100K chunk range.
 */

function intEnv(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function floatEnv(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

function enumEnv(name, allowed, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;
  return allowed.includes(raw) ? raw : fallback;
}

const config = {
  /** How much larger than topN the candidate pool should be. */
  get poolMultiplier() {
    return intEnv("HYBRID_SEARCH_POOL_MULTIPLIER", 5);
  },
  /** Absolute upper bound on candidate pool size to bound BM25 cost. */
  get poolMax() {
    return intEnv("HYBRID_SEARCH_POOL_MAX", 100);
  },
  /** Fusion algorithm: rrf (rank-based, scale-agnostic) or weighted (score-based). */
  get fusion() {
    return enumEnv("HYBRID_SEARCH_FUSION", ["rrf", "weighted"], "rrf");
  },
  /** Reciprocal Rank Fusion constant. Classic default is 60. */
  get rrfK() {
    return intEnv("HYBRID_SEARCH_RRF_K", 60);
  },
  /** Max number of BM25 indexes to keep in memory across all namespaces. */
  get bm25CacheSize() {
    return intEnv("HYBRID_SEARCH_BM25_CACHE_SIZE", 64);
  },
  /** TTL in ms for cached BM25 indexes — invalidated sooner on document mutation. */
  get bm25CacheTtlMs() {
    return intEnv("HYBRID_SEARCH_BM25_CACHE_TTL_MS", 5 * 60_000);
  },
  /** BM25 k1 parameter (term frequency saturation). Lucene default 1.2; we use 1.5. */
  get bm25K1() {
    return floatEnv("HYBRID_SEARCH_BM25_K1", 1.5);
  },
  /** BM25 b parameter (length normalization). Lucene default 0.75. */
  get bm25B() {
    return floatEnv("HYBRID_SEARCH_BM25_B", 0.75);
  },
  /** Emit telemetry events for hybrid retrievals. Off in test, on otherwise. */
  get telemetryEnabled() {
    if (process.env.NODE_ENV === "test") return false;
    return process.env.HYBRID_SEARCH_TELEMETRY !== "false";
  },
  /** Log level threshold: debug | info | warn | error */
  get logLevel() {
    let fallback = "info";
    if (process.env.NODE_ENV === "production") fallback = "warn";
    if (process.env.NODE_ENV === "test") fallback = "error";
    return enumEnv(
      "HYBRID_SEARCH_LOG_LEVEL",
      ["debug", "info", "warn", "error"],
      fallback
    );
  },
};

module.exports = { config };
