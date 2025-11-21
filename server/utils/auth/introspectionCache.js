/**
 * In-memory cache for token introspection results
 * TTL: 30 seconds (as per requirements)
 * Only caches active tokens
 */
class IntrospectionCache {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 30000; // 30 seconds in milliseconds
  }

  /**
   * Generate cache key from token (use first 20 chars for privacy)
   */
  getCacheKey(token) {
    return `introspect:${token.substring(0, 20)}`;
  }

  /**
   * Get cached introspection result
   */
  get(token) {
    const key = this.getCacheKey(token);
    const item = this.cache.get(key);

    if (!item) return null;

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * Set cached introspection result
   * Only cache active tokens
   */
  set(token, data, ttl = this.defaultTTL) {
    if (!data || !data.active) {
      return; // Don't cache inactive tokens
    }

    const key = this.getCacheKey(token);
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
    });
  }

  /**
   * Invalidate cache for a token
   */
  invalidate(token) {
    const key = this.getCacheKey(token);
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
  }
}

module.exports = new IntrospectionCache();
