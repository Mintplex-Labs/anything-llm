/**
 * Weighted convex combination of dense and sparse score lists.
 *
 * Each list's scores are min-max normalized to [0,1] independently, then combined as
 *   final = alpha * denseNorm + (1 - alpha) * sparseNorm
 *
 * Use when scores are roughly meaningful magnitudes (e.g. cosine similarity + BM25).
 * Prefer RRF when score scales differ wildly or you don't trust normalization.
 *
 * @param {Array<{id:string, score:number, item:any}>} denseList
 * @param {Array<{id:string, score:number, item:any}>} sparseList
 * @param {Object} opts
 * @param {number} [opts.alpha=0.5] - Dense weight; sparse weight is (1 - alpha).
 * @returns {Array<{id:string, score:number, item:any}>} Fused list sorted by score desc.
 */
function weightedFusion(denseList = [], sparseList = [], { alpha = 0.5 } = {}) {
  const normalize = (list) => {
    if (list.length === 0) return new Map();
    const scoreValues = list.map((e) => e.score);
    const min = Math.min(...scoreValues);
    const max = Math.max(...scoreValues);
    const range = max - min || 1;
    return new Map(
      list.map((e) => [e.id, { norm: (e.score - min) / range, item: e.item }])
    );
  };

  const dense = normalize(denseList);
  const sparse = normalize(sparseList);
  const fused = new Map();

  const upsert = (id, weight, item) => {
    const existing = fused.get(id);
    if (existing) existing.score += weight;
    else fused.set(id, { id, score: weight, item });
  };

  dense.forEach(({ norm, item }, id) => upsert(id, alpha * norm, item));
  sparse.forEach(({ norm, item }, id) => upsert(id, (1 - alpha) * norm, item));

  return Array.from(fused.values()).sort((a, b) => b.score - a.score);
}

module.exports = { weightedFusion };
