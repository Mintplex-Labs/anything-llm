const { nativeStrategy } = require("./strategies/native");
const { appSideBM25Strategy } = require("./strategies/appSideBM25");
const { logger } = require("./logger");
const { config } = require("./config");
const { wrapError } = require("./errors");
const telemetry = require("./telemetry");

/**
 * Hybrid search orchestrator.
 *
 * Routes a hybrid search request to the most capable strategy available for
 * the given provider:
 *   - native:        provider implements its own hybrid (BM25/sparse + vector)
 *   - appSideBM25:   universal fallback that runs BM25 in Node over an expanded
 *                    candidate pool from the dense search
 *
 * Adding a strategy:
 *   1. Create file under ./strategies/
 *   2. Add a capability flag on the provider's capabilities()
 *   3. Branch on it inside pickStrategy() below
 */

function getCapabilities(provider) {
  if (typeof provider?.capabilities === "function")
    return provider.capabilities();
  return { nativeHybrid: false };
}

function pickStrategy(provider) {
  const caps = getCapabilities(provider);
  if (caps.nativeHybrid && typeof provider.performHybridSearch === "function") {
    return { name: "native", run: nativeStrategy };
  }
  return { name: "appSideBM25", run: appSideBM25Strategy };
}

/**
 * @param {Object} provider - A VectorDatabase instance.
 * @param {Object} params - Same shape as performSimilaritySearch, plus:
 *   @param {number} [params.hybridAlpha=0.5] - dense weight (0=keyword only, 1=vector only)
 *   @param {"rrf"|"weighted"} [params.fusion] - defaults to env config
 * @returns {Promise<{contextTexts:string[], sources:any[], message:string|boolean}>}
 * @throws {HybridSearchError}
 */
async function hybridSearch(provider, params) {
  const strategy = pickStrategy(provider);
  const t0 = Date.now();
  const enriched = {
    fusion: config.fusion,
    poolMultiplier: config.poolMultiplier,
    poolMax: config.poolMax,
    ...params,
  };

  let result;
  try {
    result = await strategy.run(provider, enriched);
  } catch (e) {
    const wrapped = wrapError(
      "HYBRID_STRATEGY_FAILED",
      `Hybrid search failed in strategy '${strategy.name}': ${e.message}`,
      {
        strategy: strategy.name,
        provider: provider?.name,
        namespace: params?.namespace,
      },
      e
    );
    logger.error("strategy execution failed", wrapped.toJSON());
    telemetry.emit("hybrid_search_failed", {
      strategy: strategy.name,
      provider: provider?.name,
      code: wrapped.code,
      latencyMs: Date.now() - t0,
    });
    throw wrapped;
  }

  const latencyMs = Date.now() - t0;
  const resultCount = result?.sources?.length ?? 0;

  logger.info("hybrid search complete", {
    strategy: strategy.name,
    provider: provider?.name,
    namespace: params?.namespace,
    resultCount,
    latencyMs,
    hybridAlpha: enriched.hybridAlpha,
  });

  telemetry.emit("hybrid_search_executed", {
    strategy: strategy.name,
    provider: provider?.name,
    resultCount,
    latencyMs,
    fusion: enriched.fusion,
    hybridAlpha: enriched.hybridAlpha,
    topN: params?.topN,
  });

  return result;
}

module.exports = { hybridSearch, pickStrategy };
