const { hybridSearch } = require("./index");

/**
 * Single entry point used by every chat handler to retrieve context.
 *
 * Reads workspace.vectorSearchMode and dispatches:
 *   - "hybrid" → HybridSearch orchestrator (native if available, else app-side BM25)
 *   - "rerank" → provider.performSimilaritySearch with rerank=true
 *   - "default" / unknown → provider.performSimilaritySearch
 *
 * Keeping this in one place avoids each callsite needing to know about modes,
 * and makes adding future modes (e.g. learned-sparse) a one-line change.
 *
 * @param {Object} VectorDb - The vector database provider instance.
 * @param {Object} workspace - Workspace record with vectorSearchMode, hybridSearchAlpha, etc.
 * @param {Object} params - {namespace, input, LLMConnector, similarityThreshold, topN, filterIdentifiers}
 * @returns {Promise<{contextTexts:string[], sources:any[], message:string|boolean}>}
 */
async function searchWorkspace(VectorDb, workspace, params) {
  const mode = workspace?.vectorSearchMode ?? "default";

  if (mode === "hybrid") {
    return hybridSearch(VectorDb, {
      ...params,
      hybridAlpha:
        typeof workspace?.hybridSearchAlpha === "number"
          ? workspace.hybridSearchAlpha
          : 0.5,
    });
  }

  return VectorDb.performSimilaritySearch({
    ...params,
    rerank: mode === "rerank",
  });
}

module.exports = { searchWorkspace };
