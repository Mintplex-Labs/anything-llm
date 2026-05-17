/**
 * Native hybrid strategy.
 *
 * Delegates to the provider's own performHybridSearch() implementation.
 * The provider is responsible for combining keyword + vector retrieval and
 * returning results in the standard {contextTexts, sources, message} shape.
 *
 * Used when provider.capabilities().nativeHybrid === true.
 */
async function nativeStrategy(provider, params) {
  return provider.performHybridSearch(params);
}

module.exports = { nativeStrategy };
