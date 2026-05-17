/**
 * Reciprocal Rank Fusion (RRF).
 *
 * Combines multiple ranked lists into one without needing score normalization.
 * For each document, its contribution from a list ranked at position r is 1 / (k + r).
 * Documents present in multiple lists accumulate higher fused scores.
 *
 * Reference: Cormack, Clarke & Buettcher (2009).
 *
 * @param {Array<Array<{id:string, score:number, item:any}>>} rankedLists
 *   Each inner array is already sorted best-first. `id` must uniquely identify a doc across lists.
 * @param {Object} opts
 * @param {number} [opts.k=60] - RRF constant; classic default is 60.
 * @param {number[]} [opts.weights] - Optional per-list weight (defaults to 1 for each).
 * @returns {Array<{id:string, score:number, item:any}>} Fused list, sorted by score desc.
 */
function reciprocalRankFusion(rankedLists = [], { k = 60, weights = [] } = {}) {
  const scores = new Map();
  const items = new Map();

  rankedLists.forEach((list, listIdx) => {
    const weight = weights[listIdx] ?? 1;
    list.forEach((entry, rank) => {
      const contribution = weight / (k + rank + 1);
      scores.set(entry.id, (scores.get(entry.id) || 0) + contribution);
      if (!items.has(entry.id)) items.set(entry.id, entry.item);
    });
  });

  return Array.from(scores.entries())
    .map(([id, score]) => ({ id, score, item: items.get(id) }))
    .sort((a, b) => b.score - a.score);
}

module.exports = { reciprocalRankFusion };
