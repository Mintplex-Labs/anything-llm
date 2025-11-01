const { getRerankerProvider } = require("../helpers");

async function rerank(query, documents, topN = 4) {
  const reranker = getRerankerProvider();
  return await reranker.rerank(query, documents, { topK: topN });
}

/**
 * For reranking, we want to work with a larger number of results than the topN.
 * This is because the reranker can only rerank the results it it given and we dont auto-expand the results.
 * We want to give the reranker a larger number of results to work with.
 *
 * However, we cannot make this boundless as reranking is expensive and time consuming.
 * So we limit the number of results to a maximum of 50 and a minimum of 10.
 * This is a good balance between the number of results to rerank and the cost of reranking
 * and ensures workspaces with 10K embeddings will still rerank within a reasonable timeframe on base level hardware.
 *
 * Benchmarks:
 * On Intel Mac: 2.6 GHz 6-Core Intel Core i7 - 20 docs reranked in ~5.2 sec
 */

function getSearchLimit(totalEmbeddings = 0) {
  return Math.max(10, Math.min(50, Math.ceil(totalEmbeddings * 0.1)));
}

module.exports = {
  rerank,
  getSearchLimit,
};
