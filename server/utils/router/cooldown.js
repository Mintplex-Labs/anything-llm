const DEFAULT_COOLDOWN_MS = 60_000;

const routeCache = new Map();

/**
 * Build a cache key from user/workspace/thread identifiers.
 * @param {number|null} userId
 * @param {string} workspaceSlug
 * @param {string|null} threadSlug
 * @returns {string}
 */
function cacheKey(userId, workspaceSlug, threadSlug) {
  return `${userId || 0}:${workspaceSlug}:${threadSlug || "default"}`;
}

/**
 * Get a cached route if still within the cooldown window.
 * @param {string} key
 * @param {number} cooldownMs
 * @returns {{ provider: string, model: string, ruleTitle: string|null, ruleType: string|null, isFallback: boolean }|null}
 */
function getCachedRoute(key, cooldownMs = DEFAULT_COOLDOWN_MS) {
  const entry = routeCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.routedAt > cooldownMs) {
    routeCache.delete(key);
    return null;
  }
  return entry.route;
}

/**
 * Store a route decision in the cache.
 * @param {string} key
 * @param {{ provider: string, model: string, ruleTitle: string|null, ruleType: string|null, isFallback: boolean }} route
 */
function setCachedRoute(key, route) {
  routeCache.set(key, { route, routedAt: Date.now() });
}

/**
 * Manually clear a cached route.
 * @param {string} key
 */
function clearCachedRoute(key) {
  routeCache.delete(key);
}

module.exports = {
  DEFAULT_COOLDOWN_MS,
  cacheKey,
  getCachedRoute,
  setCachedRoute,
  clearCachedRoute,
};
