const { reciprocalRankFusion } = require("../fusion/rrf");
const { weightedFusion } = require("../fusion/weighted");
const { bm25Cache } = require("../cache");
const { config } = require("../config");
const { logger } = require("../logger");

/**
 * Universal app-side hybrid fallback that works against any vector DB provider.
 *
 * Strategy:
 *   1. Run vector similarity search with an expanded topN (env-configurable, default
 *      5x with a hard cap of 100) and similarityThreshold=0. We want a wide pool
 *      so BM25 can rescue lexically matching docs that the dense search ranked low.
 *      Threshold is re-applied AFTER fusion.
 *   2. Build or fetch a cached BM25 index over the candidate pool's chunk text.
 *   3. Fuse the two rankings (RRF by default; weighted convex combination when
 *      params.fusion === "weighted" — uses min-max normalized scores + alpha).
 *   4. Apply the workspace similarityThreshold against the original DENSE score,
 *      not the fused score. Rationale: fused score is rank-based and has no
 *      absolute semantic meaning, so a threshold against it would be uninterpretable.
 *      We preserve the operator's intent that "below 0.5 cosine = noise".
 *   5. Trim to topN and return.
 *
 * Score semantics on returned sources:
 *   - metadata.score        → fused score (used for ranking display)
 *   - metadata.denseScore   → original dense similarity (cosine, etc.)
 *   - metadata.hybridScore  → same as score, explicit alias for callers
 *   - metadata.sparseRank   → 0-indexed rank from BM25 (or null if not matched)
 */
async function appSideBM25Strategy(provider, params) {
  const {
    namespace,
    input,
    LLMConnector,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = [],
    hybridAlpha = 0.5,
    fusion = config.fusion,
    poolMultiplier = config.poolMultiplier,
    poolMax = config.poolMax,
  } = params;

  if (!namespace || !input || !LLMConnector)
    throw new Error("Invalid request to appSideBM25Strategy.");

  const candidateTopN = Math.min(
    poolMax,
    Math.max(topN, topN * poolMultiplier)
  );

  const t0 = Date.now();
  const dense = await provider.performSimilaritySearch({
    namespace,
    input,
    LLMConnector,
    similarityThreshold: 0,
    topN: candidateTopN,
    filterIdentifiers,
  });
  const denseMs = Date.now() - t0;

  if (dense?.message || !dense?.sources?.length) return dense;

  // Preserve dense order; this is also the seed for the dense ranking.
  const pool = dense.sources.map((src, idx) => {
    const metadata = src?.metadata ?? src;
    const text = metadata?.text ?? dense.contextTexts[idx] ?? "";
    const id = metadata?.id ?? metadata?.vectorId ?? `pool-${idx}`;
    const denseScore =
      typeof metadata?.score === "number" ? metadata.score : null;
    return {
      id: String(id),
      text,
      denseScore,
      denseRank: idx,
      source: src,
      contextText: dense.contextTexts[idx] ?? text,
    };
  });

  const denseRanked = pool.map((p) => ({
    id: p.id,
    score: p.denseScore ?? 1 - p.denseRank / pool.length,
    item: p,
  }));

  const bm25Build0 = Date.now();
  const bm25 = bm25Cache.getOrBuild(
    namespace,
    pool.map((p) => ({ id: p.id, text: p.text, item: p }))
  );
  const bm25BuildMs = Date.now() - bm25Build0;
  const sparseRanked = bm25.score(input);
  const sparseRankMap = new Map(sparseRanked.map((r, i) => [r.id, i]));

  const fuse0 = Date.now();
  const fused =
    fusion === "weighted"
      ? weightedFusion(denseRanked, sparseRanked, { alpha: hybridAlpha })
      : reciprocalRankFusion([denseRanked, sparseRanked], {
          weights: [hybridAlpha, 1 - hybridAlpha],
          k: config.rrfK,
        });
  const fuseMs = Date.now() - fuse0;

  const survivors = [];
  for (const { item, score } of fused) {
    const dScore = item.denseScore;
    if (dScore !== null && dScore < similarityThreshold) continue;
    survivors.push({ item, score });
    if (survivors.length >= topN) break;
  }

  const contextTexts = survivors.map(({ item }) => item.contextText);
  const sources = survivors.map(({ item, score }) => {
    const base = item.source;
    const metadata = base?.metadata ?? base;
    const sparseRank = sparseRankMap.has(item.id)
      ? sparseRankMap.get(item.id)
      : null;
    return {
      metadata: {
        ...metadata,
        score,
        hybridScore: score,
        denseScore: item.denseScore,
        sparseRank,
      },
    };
  });

  logger.debug("appSideBM25 strategy complete", {
    poolSize: pool.length,
    denseMs,
    bm25BuildMs,
    fuseMs,
    survivors: survivors.length,
    sparseMatched: sparseRanked.length,
  });

  const curated =
    typeof provider.curateSources === "function"
      ? provider.curateSources(sources)
      : sources;
  return { contextTexts, sources: curated, message: false };
}

module.exports = { appSideBM25Strategy };
